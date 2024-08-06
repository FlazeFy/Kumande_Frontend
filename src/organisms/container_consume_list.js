"use client"
import { faBowlRice, faCake, faEdit, faMugSaucer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

// Atoms
import ComponentButton from '../atoms/button'
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
                            <button className='btn btn-primary px-3 py-2 me-1 mb-2 text-start' style={{fontSize:"var(--textXMD)"}}>
                                <ComponentTextIcon text_type={dt.consume_type} body={dt.consume_name}/>
                                <div>
                                    <a className='btn btn-danger p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{dt.consume_from}</a>
                                    <a className='btn btn-success p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{dt.provide}</a>
                                    <a className='btn btn-warning p-1 rounded-pill px-2' style={{fontSize:"var(--textMD)"}}>{dt.calorie} Cal</a>
                                </div>
                            </button>
                        )
                    })
                :   
                    <ComponentTextMessageNoData message="No consume attached"/>
            }
        </div>
    )
}