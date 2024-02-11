import React, { useEffect } from "react"

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

    useEffect(() => {
        var fullHeight = function () {
            document.querySelectorAll(".js-fullheight").forEach(function (element) {
                element.style.height = window.innerHeight + "px"
            })
        
            window.addEventListener("resize", function () {
                document.querySelectorAll(".js-fullheight").forEach(function (element) {
                element.style.height = window.innerHeight + "px"
                })
            })
        }
    
        fullHeight()
    
        document.getElementById("sidebarCollapse").addEventListener("click", function () {
          document.getElementById("sidebar").classList.toggle("active")
        })
    }, [])

    return  (
        <nav id="sidebar" className="navbar">
            <ul className="list-unstyled components mb-3 w-100">
                <li className={getActive(active, "dashboard")}>
                    <a href="/dashboard"><FontAwesomeIcon icon={faTableColumns} size="lg" className='me-3'/> Dashboard</a>
                </li>
                <li className={getActive(active, "history")}>
                    <a href="/history"><FontAwesomeIcon icon={faClockRotateLeft} size="lg" className='me-3'/> History</a>
                </li>
                <li className={getActive(active, "schedule")}>
                    <a href="/schedule"><FontAwesomeIcon icon={faCalendar} size="lg" className='me-3'/> Schedule</a>
                </li>
                <li className={getActive(active, "profile")}>
                    <a href="/profile"><FontAwesomeIcon icon={faUser} size="lg" className='me-3'/> Profile</a>
                </li>
            </ul>
        </nav>
    )
}