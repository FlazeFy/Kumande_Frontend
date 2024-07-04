import React, { useEffect } from "react"

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBriefcaseMedical, faCalendar, faClockRotateLeft, faEnvelope, faKitchenSet, faList, faMap, faMoneyBill, faPhotoFilm, faTableColumns, faUser, faUtensils, faXmark } from "@fortawesome/free-solid-svg-icons"
import GetSignOut from "./usecases/get_sign_out";

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
                <h2 className="mt-3"><FontAwesomeIcon icon={faUtensils} size="lg" className='me-3'/> Kumande</h2>
                <hr></hr>
                <h5>Main Menu</h5>
                <li className={getActive(active, "dashboard")}>
                    <a href="/dashboard"><FontAwesomeIcon icon={faTableColumns} size="lg" className='me-3'/> Dashboard</a>
                </li>
                <li className={getActive(active, "history")}>
                    <a href="/history"><FontAwesomeIcon icon={faClockRotateLeft} size="lg" className='me-3'/> History</a>
                </li>
                <li className={getActive(active, "list")}>
                    <a href="/list"><FontAwesomeIcon icon={faList} size="lg" className='me-3'/> Consume List</a>
                </li>
                <li className={getActive(active, "budget")}>
                    <a href="/budget"><FontAwesomeIcon icon={faMoneyBill} size="lg" className='me-3'/> Budget</a>
                </li>
                <li className={getActive(active, "schedule")}>
                    <a href="/schedule"><FontAwesomeIcon icon={faCalendar} size="lg" className='me-3'/> Schedule</a>
                </li>
                <li className={getActive(active, "medstory")}>
                    <a href="/medstory/mybody"><FontAwesomeIcon icon={faBriefcaseMedical} size="lg" className='me-3'/> MedStory</a>
                </li>
                <li className={getActive(active, "profile")}>
                    <a href="/profile"><FontAwesomeIcon icon={faUser} size="lg" className='me-3'/> Profile</a>
                </li>
                <hr></hr>
                <h5>PinMarker</h5>
                <li className={getActive(active, "maps")}>
                    <a href="/maps"><FontAwesomeIcon icon={faMap} size="lg" className='me-3'/> Maps</a>
                </li>
                <li className={getActive(active, "gallery")}>
                    <a href="/gallery"><FontAwesomeIcon icon={faPhotoFilm} size="lg" className='me-3'/> Gallery</a>
                </li>
                <hr></hr>
                <h5>Culineira</h5>
                <li className={getActive(active, "kitchen")}>
                    <a href="/kitchen"><FontAwesomeIcon icon={faKitchenSet} size="lg" className='me-3'/> Kitchen</a>
                </li>
                <GetSignOut/>
            </ul>
        </nav>
    )
}