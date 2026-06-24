import { useCallback, useState } from 'react';
import { useRazorpayScript } from './useRazorpayScript';
import { apiFetch } from '../lib/api.js'; // match your Spark.E path

export function useRazorpayCheckout() {
    const scriptLoaded = useRazorpayScript();
    const [status, setStatus] = useState('idle');

    const pay = useCallback(async ({ productType, productRef, onSuccess, onError, id, billingCycle }) => {
        if (!scriptLoaded) {
            onError?.(Object.assign(new Error('Payment SDK still loading — try again'), { status: 0 }));
            return;
        }

        setStatus('creating');

        let order;
        try {
            const res = await apiFetch(`/api/payments/create-order/${id}`, {
                method: 'POST',
                body: JSON.stringify({ productType, productRef, billingCycle }),
            });

            // ── Structured error with status attached ──────────────────────────
            if (!res.ok) {
                const err = Object.assign(
                    new Error('Could not create order'),
                    { status: res.status }
                );
                setStatus('error');
                onError?.(err);
                return;
            }

            const data = await res.json();
            order = data.data ?? data; // handle ApiResponse wrapper or bare object
        } catch (err) {
            // network-level failure — no status
            const structured = Object.assign(new Error(err.message ?? 'Network error'), { status: 0 });
            setStatus('error');
            onError?.(structured);
            return;
        }

        setStatus('open');

        const rzp = new window.Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'Spark.E',
            description: 'Premium Feature Unlock',
            order_id: order.orderId,
            handler: async (response) => {
                setStatus('verifying');
                try {                    
                    const res = await apiFetch('/api/payments/verify-order', {
                        method: 'POST',
                        body: JSON.stringify(response),
                    });
console.log("res", res);

                    if (!res.ok) {
                        const err = Object.assign(
                            new Error('Verification failed'),
                            { status: res.status }
                        );
                        setStatus('error');
                        onError?.(err);
                        return;
                    }

                    setStatus('success');
                    onSuccess?.();
                } catch (err) {
                    const structured = Object.assign(new Error(err.message ?? 'Network error'), { status: 0 });
                    setStatus('error');
                    onError?.(structured);
                }
            },
            modal: {
                ondismiss: () => setStatus('dismissed'),
            },
            theme: { color: '#0B0E1A' },
        });

        rzp.on('payment.failed', (resp) => {
            setStatus('error');
            onError?.(Object.assign(
                new Error(resp.error?.description ?? 'Payment failed'),
                { status: 0 }
            ));
        });

        rzp.open();
    }, [scriptLoaded]);

    return { pay, status };
}