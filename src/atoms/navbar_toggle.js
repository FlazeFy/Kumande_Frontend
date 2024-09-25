import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"
import ComponentButton from "./button"

/**
 * This component renders a button toogle for left navbar
 *
 * @component
 * @example
 * ```jsx
 * <ComponentLeftNavbarToggle/>
 * ```
 * 
 * @returns {React.Element}
 */
export default function ComponentLeftNavbarToggle() {
    return  (
        <div className="mb-3 position-fixed">
            <ComponentButton button_type="primary" id="sidebarCollapse" button_name={<FontAwesomeIcon icon={faBars} size="lg"/>}/>
        </div>
    )
}