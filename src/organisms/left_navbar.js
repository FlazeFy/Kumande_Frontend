import React, { useEffect } from "react"

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcaseMedical, faCalendar, faClockRotateLeft, faKitchenSet, faList, faMap, faMoneyBill, faPhotoFilm, faTableColumns, faUser, faUtensils } from "@fortawesome/free-solid-svg-icons"

// Atoms
import ComponentButton from "../atoms/button"

// Organisms
import ComponentSignOut from "./sign_out"

export default function ComponentLeftNavbar(props) {
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

    const list_menu = [
        {
            label_menu: <><h5>Main Menu</h5><hr></hr></>
        },
        {
            url: 'dashboard', 
            icon: <FontAwesomeIcon icon={faTableColumns} size="lg" className='me-3'/>, 
            button_name: 'Dashboard'
        },
        {
            url: 'history', 
            icon: <FontAwesomeIcon icon={faClockRotateLeft} size="lg" className='me-3'/>, 
            button_name: 'History'
        },
        {
            url: 'list', 
            icon: <FontAwesomeIcon icon={faList} size="lg" className='me-3'/>, 
            button_name: 'Consume List'
        },
        {
            url: 'budget', 
            icon: <FontAwesomeIcon icon={faMoneyBill} size="lg" className='me-3'/>, 
            button_name: 'Budget'
        },
        {
            url: 'schedule', 
            icon: <FontAwesomeIcon icon={faCalendar} size="lg" className='me-3'/>, 
            button_name: 'Schedule'
        },
        {
            url: 'medstory/mybody', 
            icon: <FontAwesomeIcon icon={faBriefcaseMedical} size="lg" className='me-3'/>, 
            button_name: 'MedStory'
        },
        {
            url: 'profile', 
            icon: <FontAwesomeIcon icon={faUser} size="lg" className='me-3'/>, 
            button_name: 'Profile'
        },
        {
            label_menu: <><h5>PinMarker</h5><hr></hr></>
        },
        {
            url: 'maps', 
            icon: <FontAwesomeIcon icon={faMap} size="lg" className='me-3'/>, 
            button_name: 'Maps'
        },
        {
            url: 'gallery', 
            icon: <FontAwesomeIcon icon={faPhotoFilm} size="lg" className='me-3'/>, 
            button_name: 'Gallery'
        },
        {
            label_menu: <><h5>Culineira</h5><hr></hr></>
        },
        {
            url: 'kitchen', 
            icon: <FontAwesomeIcon icon={faKitchenSet} size="lg" className='me-3'/>, 
            button_name: 'Kitchen'
        }
    ]

    return  (
        <nav id="sidebar" className="navbar">
            <ul className="list-unstyled components mb-3 w-100">
                <h2 className="mt-3"><FontAwesomeIcon icon={faUtensils} size="lg" className='me-3'/> Kumande</h2>
                {
                    list_menu.map((dt, idx)=>{
                        if('url' in dt){
                            return <ComponentButton url={dt.url} icon={dt.icon} button_name={dt.button_name} button_type="menu" active={props.active}/>
                        } else if('label_menu' in dt) {
                            return dt.label_menu
                        }
                    })
                }                
                <ComponentSignOut/>
            </ul>
        </nav>
    )
}