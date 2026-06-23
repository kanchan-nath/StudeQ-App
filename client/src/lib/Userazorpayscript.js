import { useEffect, useState } from 'react';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
// [unverified — confirm current src against razorpay.com/docs/payments/payment-gateway/web-integration/standard/]

export function useRazorpayScript() {
    const [loaded, setLoaded] = useState(() => !!window.Razorpay);

    useEffect(() => {
        if (window.Razorpay) {
            setLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => setLoaded(true);
        script.onerror = () => setLoaded(false);
        document.body.appendChild(script);
        // intentionally not removed on unmount — cache across route changes
    }, []);

    return loaded;
}