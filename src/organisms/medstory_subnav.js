import React from "react"
import ComponentButton from "../atoms/button"

export default function ComponentMedstorySubNav({active}) {
    return  (
        <nav className="nav nav-sub">
            <ComponentButton button_type="submenu" active={active} url="/medstory/mybody" button_name="My Body"/>
            <ComponentButton button_type="submenu" active={active} url="/medstory/allergic" button_name="Allergic"/>
            <ComponentButton button_type="submenu" active={active} url="/medstory/reminder" button_name="Reminder"/>
            <ComponentButton button_type="submenu" active={active} url="/medstory/smartdoc" button_name="SmartDoc"/>
            <ComponentButton button_type="submenu" active={active} url="/medstory/haid" button_name="Haid Monitoring"/>
            <ComponentButton button_type="submenu" active={active} url="/medstory/history" button_name="History"/>
        </nav>
    )
}