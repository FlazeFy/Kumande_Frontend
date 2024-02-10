import * as React from "react"

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar, faClockRotateLeft, faEnvelope, faTableColumns, faUser } from "@fortawesome/free-solid-svg-icons"

export default function GetNavbar({active, subactive}) {
    function getActive(val, curr){
        if(val == curr){
            return "active";
        } else {
            return "";
        }
    }

    return  (
        <nav id="sidebar" className="navbar">
            <div className="p-4 pt-2">
                <ul className="list-unstyled components mb-3">
                    <li className="active">
                        <a href="/dashboard"><FontAwesomeIcon icon={faTableColumns} size="lg" className='me-3'/> Dashboard</a>
                    </li>
                    <li className="">
                        <a href="/history"><FontAwesomeIcon icon={faClockRotateLeft} size="lg" className='me-3'/> History</a>
                    </li>
                    <li className="">
                        <a href="/schedule"><FontAwesomeIcon icon={faCalendar} size="lg" className='me-3'/> Schedule</a>
                    </li>
                    <li className="">
                        <a href="/profile"><FontAwesomeIcon icon={faUser} size="lg" className='me-3'/> Profile</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}