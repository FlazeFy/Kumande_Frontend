import React from "react"

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"

export default function ComponentLeftNavbarToggle() {
    return  (
        <div className="mb-3 position-fixed">
            <button type="button" id="sidebarCollapse" className="btn btn-primary px-3 py-2">
            <FontAwesomeIcon icon={faBars} size="lg"/>
            </button>
        </div>
    )
}