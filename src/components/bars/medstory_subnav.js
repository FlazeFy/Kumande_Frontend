import React, { useEffect } from "react"

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBriefcaseMedical, faCalendar, faClockRotateLeft, faEnvelope, faKitchenSet, faList, faMap, faMoneyBill, faPhotoFilm, faTableColumns, faUser, faUtensils, faXmark } from "@fortawesome/free-solid-svg-icons"

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
            <a className={"nav-link "+getActive(active, "history")} href="/medstory/history">History</a>
            <a className={"nav-link "+getActive(active, "reminder")} href="/medstory/reminder">Reminder</a>
            <a className={"nav-link "+getActive(active, "smartdoc")} href="/medstory/smartdoc">SmartDoc</a>
        </nav>
    )
}