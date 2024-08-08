"use client"
import React from 'react'
import ComponentText from '../atoms/text'
import ComponentBreakLine from '../atoms/breakline'

export default function ComponentContainerGallery(props) {
    return (
        <div className='text-start text-white'>
            <img className='img img-fluid rounded' src={props.image_url}></img>
            <ComponentBreakLine length={props.created_at ? 1 : 2}/>
            <ComponentText text_type="mini_sub_heading" body={props.body}/>
            {
                props.created_at && <ComponentText text_type="mini_content" body={`Posted at ${props.created_at}`}/>
            }
        </div>
    )
}
  