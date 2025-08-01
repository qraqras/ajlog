import React from "react";
import "./button.css"

/**
 * Base Button
 * @param {string} labal
 * @param {React.UIEvent} onClick
 * @returns {string}
 */
export const BaseButton = ({ label, onClick }: { label: string; onClick: (event: React.UIEvent) => void; }) => {
    return (
        <button className="btn" onClick={onClick}>
            {label}
        </button>
    )
}
