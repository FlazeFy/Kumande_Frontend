"use client"
import React from 'react'

// Atoms
import ComponentText from '../atoms/text'
import ComponentTextMessageNoData from '../atoms/text_message_no_data'

export default function ComponentContainerDescription(props) {
    return (
        <div>
            <ComponentText text_type="sub_heading" body={props.container_title}/>
            {
                props.container_body ?
                    <ComponentText text_type="sub_content" body={props.container_body}/>
                :
                    <ComponentTextMessageNoData is_with_image={false}  message="No Description Provided"/>
            }
        </div>
    )
}