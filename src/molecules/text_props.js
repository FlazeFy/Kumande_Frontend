"use client"
import React from 'react'
import ComponentText from '../atoms/text'
import { convertDatetime } from '../modules/helpers/converter'

export default function ComponentTextProps(props) {
    return (
        <div>
            <ComponentText text_type="sub_heading" body={props.props_title}/>
            {
                props.props_type == 'created at' || props.props_type == 'updated at' || props.props_type == 'deleted at' ?
                    <ComponentText text_type="mini_content" body={<>{props.props_type} {convertDatetime(props.props_content,'calendar')}</>}/>
                :
                    <></>
            }
        </div>
    )
}