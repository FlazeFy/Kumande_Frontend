import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

/**
 * This component renders a text label for form functionality
 *
 * @component
 * @example
 * ```jsx
 * <ComponentTextForm text_type='form_label' body='Username'/>
 * <ComponentTextForm text_type='form_warning' body='Your username has reach maximum character'/>
 * <ComponentTextForm text_type='form_danger' body='Wrong password or username'/>
 * ```
 * @param {Object} props - The props object
 * @param {string} props.text_type - Type of component to render
 * @param {string} props.body - Text / Label of the button
 * 
 * @returns {React.Element}
 */
export default function ComponentTextForm(props){
    if(props.text_type === 'form_label'){
        return <label className="input">{props.body}</label>
    } else if(props.text_type === 'form_warning'){
        return <label className="text-warning fst-italic"><FontAwesomeIcon icon={faTriangleExclamation} width="14px"/> {props.body}</label>
    } else if(props.text_type === 'form_danger'){
        return <label className="text-danger fst-italic"><FontAwesomeIcon icon={faTriangleExclamation} width="14px"/> {props.body}</label>
    } 
}