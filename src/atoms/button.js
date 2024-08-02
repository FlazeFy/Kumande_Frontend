import React from "react"

export default function ComponentButton(props){
    if(props.button_type == 'menu'){
        const getActive = (val, curr) => {
            if(val == curr){
                return "active";
            } else {
                return "";
            }
        }

        return (
            <li className={getActive(props.active, props.url.split('/')[0])}>
                <a href={`/${props.url}`}>{props.icon} {props.button_name}</a>
            </li>
        )
    } else if(props.button_type == 'modal'){
        return (
            <a className={`border-0 rounded ${props.class}`} data-bs-toggle="modal" data-bs-target={`#${props.target}`}>
                {props.icon} {props.button_name}
            </a>
        )
    }
}