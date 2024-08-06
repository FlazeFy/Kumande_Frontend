import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"
import { isMobile } from "../modules/helpers/validator";

export default function ComponentButton(props){
    // Initial Variable
    const is_mobile = isMobile()

    const getActive = (val, curr) => {
        if(val == curr){
            return "active"
        } else {
            return ""
        }
    }

    if(props.button_type == 'menu'){
        return (
            <li className={getActive(props.active, props.url.split('/')[0])}>
                <a href={`/${props.url}`}>{props.icon} {props.button_name}</a>
            </li>
        )
    } else if(props.button_type == 'submenu'){
        return <a className={"nav-link "+getActive(props.active, props.url.split('/')[2])} href={props.url}>{props.button_name}</a>
    } else if(props.button_type == 'modal'){
        return (
            <a className={`border-0 rounded ${props.class}`} data-bs-toggle="modal" data-bs-target={`#${props.target}`}>
                {props.icon} {props.button_name}
            </a>
        )
    } else if(props.button_type == 'tag'){
        return <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>#{props.button_name}</a>
    } else if(props.button_type == 'main_ing'){
        return <a className='btn btn-danger rounded-pill px-3 py-1 me-1'>{props.button_name}</a>
    } else if(props.button_type == 'calorie'){
        return <a className='btn btn-warning rounded-pill px-3 py-1 me-1'>{props.button_name} Cal</a>
    } else if(props.button_type == 'provide'){
        return (
            <a className='btn btn-success rounded-pill px-3 py-1 me-1'>
                {!is_mobile ? props.button_name : <><FontAwesomeIcon icon={faLocationDot}/> Maps</>}
            </a>
        )
    }
}