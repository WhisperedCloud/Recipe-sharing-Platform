import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "40px",
            marginBottom: "40px",
            width: "100%"
        }}>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                style={buttonStyle(currentPage === 1)}
            >
                &laquo; Prev
            </button>
            
            <div style={{ display: "flex", gap: "5px" }}>
                {pages.map(page => (
                    <button 
                        key={page} 
                        onClick={() => onPageChange(page)}
                        style={{
                            ...buttonStyle(false),
                            background: currentPage === page ? "var(--primary-color, #ff0056)" : "white",
                            color: currentPage === page ? "white" : "var(--text-color, #333)",
                            border: currentPage === page ? "1px solid var(--primary-color, #ff0056)" : "1px solid #ddd",
                            minWidth: "40px"
                        }}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                style={buttonStyle(currentPage === totalPages)}
            >
                Next &raquo;
            </button>
        </div>
    );
}

const buttonStyle = (disabled) => ({
    padding: "8px 15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "white",
    color: disabled ? "#aaa" : "var(--text-color, #333)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontSize: "14px"
});
