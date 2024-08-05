import React from "react"
import ComponentText from "../atoms/text"

export default function ComponentButtonContentImg(props){
    return (
        <a className='container p-2 my-3 d-flex justify-content-start text-white' href={props.url && `/${props.url}`} style={{backgroundImage: "linear-gradient(to right, var(--primaryColor) , var(--primaryLightBG))", cursor:"pointer"}}>
            <div>
                <img className='img-icon-lg' src={props.icon_url}/>
            </div>
            <div className='pt-2 ps-3'>
                <ComponentText text_type="sub_heading" body={props.button_title}/>
                {props.button_content}            
            </div>
        </a>
    )
}