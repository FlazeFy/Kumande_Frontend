"use client"
import React from 'react'
import ComponentText from '../atoms/text'
import ComponentContainerGallery from '../molecules/container_gallery'
import ComponentModal from '../molecules/modal'

export default function ComponentContainerGalleryManage(props) {
    return (
        <ComponentModal button_template={
            <button className='container bgd-primary p-2 hovered-btn' data-bs-toggle="modal" data-bs-target={`#gallery-${props.id}`}>
                <ComponentContainerGallery body={props.body} image_url={props.image_url}/>
            </button>}
            id={`gallery-${props.id}`}
            title={`Gallery : ${props.title}`}
            body={
                <>
                    <ComponentContainerGallery body={props.body} image_url={props.image_url} created_at={props.created_at}/>
                    <ComponentText text_type="sub_heading" body={props.body}/>
                </>
            }
        />
    )
}
  