import React, { useEffect } from "react"

export default function GetMedstorySubNav({active}) {
    function getActive(val, curr){
        if(val == curr){
            return "active";
        } else {
            return "";
        }
    }

    return  (
        <nav className="nav nav-sub">
            <a className={"nav-link "+getActive(active, "mybody")} href="/medstory/mybody">My Body</a>
            <a className={"nav-link "+getActive(active, "allergic")} href="/medstory/allergic">Allergic</a>
            <a className={"nav-link "+getActive(active, "reminder")} href="/medstory/reminder">Reminder</a>
            <a className={"nav-link "+getActive(active, "smartdoc")} href="/medstory/smartdoc">SmartDoc</a>
            <a className={"nav-link "+getActive(active, "haid")} href="/medstory/haidc">Haid Monitoring</a>
            <a className={"nav-link "+getActive(active, "history")} href="/medstory/history">History</a>
        </nav>
    )
}