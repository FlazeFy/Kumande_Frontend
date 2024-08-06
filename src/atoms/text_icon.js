import { faBowlRice, faCake, faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { ucFirstChar } from "../modules/helpers/converter"

export default function ComponentTextIcon(props){
    const defaultStyle = {
        consume: {
          marginRight: 'var(--spaceXSM)',
          ...props.text_style,
        }
    }

    if(props.text_type == 'Food' || props.text_type == 'Drink' || props.text_type == 'Snack'){
        return <a style={defaultStyle.consume} href={props.text_href}>
            {
                props.text_type == 'Food' ?
                    <FontAwesomeIcon icon={faBowlRice} className='me-1' style={{color:"var(--primaryColor)"}}/>
                : props.text_type == 'Drink' ?
                    <FontAwesomeIcon icon={faMugSaucer} className='me-1' style={{color:"var(--primaryColor)"}}/>
                : props.text_type == 'Snack' ?
                    <FontAwesomeIcon icon={faCake} className='me-1' style={{color:"var(--primaryColor)"}}/>
                : 
                    <></>
            }
            {ucFirstChar(props.body)}
        </a>
    } 
}