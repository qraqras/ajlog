import React from "react";
import "./textfield.css"

/**
 * Base TextField
 * @param {string} name
 * @param {string} placeholder
 * @param {React.ChangeEvent} onChange
 * @returns {string}
 */
export const BaseTextField = ({ name, placeholder, onChange }: { name: string; placeholder: string; onChange: (event: React.ChangeEvent) => void; }) => {
    return (
        <input className="textfield" name={name} type="text" placeholder={placeholder} onChange={onChange}></input>
    )
}
