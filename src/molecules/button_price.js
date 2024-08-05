import React from "react"
import ComponentText from "../atoms/text"
import { numberToPrice } from "../modules/helpers/converter"

export default function ComponentButtonPrice(props){
    return (
        <div className='container bg-white p-2 d-flex justify-content-start'>
            <div style={{color:props.styles}}>
                <ComponentText text_type="sub_heading" body={props.button_title}/>
                <ComponentText text_type="main_heading" body={<span>Rp. {numberToPrice(props.button_price)}</span>}/>
                <ComponentText text_type="mini_content" body={props.button_caption}/>
            </div>
        </div>
    )
}