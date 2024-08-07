import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export default function ComponentTextForm(props){
    if(props.text_type == 'form_label'){
        return <label className="input">{props.body}</label>
    } else if(props.text_type == 'form_warning'){
        return <label className="text-warning fst-italic"><FontAwesomeIcon icon={faTriangleExclamation} width="14px"/> {props.body}</label>
    } else if(props.text_type == 'form_danger'){
        return <label className="text-danger fst-italic"><FontAwesomeIcon icon={faTriangleExclamation} width="14px"/> {props.body}</label>
    } 
}