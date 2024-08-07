"use client"
import React from 'react'
import ComponentText from '../atoms/text'

export default function ComponentTextMessageImageNoData(props){
    return (
        <div className='d-block mx-auto text-center'>
            <img className='img img-fluid mt-3 mb-2' src={props.image_url} style={{width:"160px"}}/>
            <ComponentText text_type="sub_content" body={<>- {props.body} -</>}/>
        </div>
    )
}