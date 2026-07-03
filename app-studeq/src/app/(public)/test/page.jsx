"use client";

import { useState } from "react";

export default function TestPage() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("Button clicked!");
        alert("Button clicked!");
        setCount((prev) => prev + 1);
    };

    return (
        <div
            style={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <h1>Next.js Click Test</h1>

            <p>Count: {count}</p>

            <button
                onClick={handleClick}
                style={{
                    padding: "12px 24px",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
            >
                Click Me
            </button>
        </div>
    );
}