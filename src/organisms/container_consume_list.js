"use client"
import React from 'react'
import ComponentText from "../atoms/text"
import ComponentTextIcon from '../atoms/text_icon'
import ComponentTextMessageNoData from "../atoms/text_message_no_data"

export default function ComponentContainerConsumeList(props) {
    return (
        <div>
            <ComponentText text_type="sub_heading" body={props.container_title}/>
            {
                props.list_consume != null ?
                    props.list_consume.map((dt, idx) => {
                        return (
                            <div className='btn btn-primary px-3 py-2 me-1 mb-2 text-start' key={`container_consume_${idx}`} style={{fontSize:"var(--textXMD)"}}>
                                <ComponentTextIcon text_type={dt.consume_type} body={dt.consume_name}/>
                                <div>
                                    <span className='btn btn-danger p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{dt.consume_from}</span>
                                    <span className='btn btn-success p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{dt.provide}</span>
                                    <span className='btn btn-warning p-1 rounded-pill px-2' style={{fontSize:"var(--textMD)"}}>{dt.calorie} Cal</span>
                                </div>
                            </div>
                        )
                    })
                :   
                    <ComponentTextMessageNoData is_with_image={false}  message="No consume attached"/>
            }
        </div>
    )
}