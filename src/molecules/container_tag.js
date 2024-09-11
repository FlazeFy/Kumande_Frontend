"use client"
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

// Atoms
import ComponentButton from '../atoms/button'
import ComponentText from "../atoms/text"
import ComponentTextMessageNoData from "../atoms/text_message_no_data"

export default function ComponentContainerTag(props) {
    return (
        <div>
            <div className='d-flex justify-content-between'>
                <ComponentText text_type="sub_heading" body={props.container_title}/>
                {
                    props.is_editable && <a className='btn btn-primary py-0'><FontAwesomeIcon icon={faEdit}/></a>
                }
            </div>
            {
                props.list_tag != null ?
                    props.list_tag.map((dt, idx) => {
                        return (
                            <ComponentButton key={`list_tag_btn_${idx}`} button_type='tag' button_name={dt.tag_name}/>
                        )
                    })
                :   
                    <ComponentTextMessageNoData is_with_image={false}  message="No tag provided"/>
            }
        </div>
    )
}