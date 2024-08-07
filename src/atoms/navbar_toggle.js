import React from "react"

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"
import ComponentButton from "./button"

export default function ComponentLeftNavbarToggle() {
    return  (
        <div className="mb-3 position-fixed">
            <ComponentButton button_type="primary" id="sidebarCollapse" button_name={<FontAwesomeIcon icon={faBars} size="lg"/>}/>
        </div>
    )
}