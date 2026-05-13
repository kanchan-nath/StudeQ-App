import React from "react";

const Loader = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh"
        }}>
            <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "4px solid #e2e8f0",
                borderTopColor: "#7c3aed",
                animation: "spin 0.7s linear infinite"
            }}></div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;