"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import ComponentText from '../../../../atoms/text'
import ComponentTextMessageImageNoData from '../../../../molecules/text_message_image_no_data'
import ComponentContainerGalleryManage from '../../../../organisms/container_gallery_manage'
import ComponentBreakLine from '../../../../atoms/breakline'
import ComponentModal from '../../../../molecules/modal'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PostGallery from './post_gallery'
import ComponentAlertBox from '../../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../../modules/helpers/converter'

export default function GetConsumeGallery(props) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = () => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/gallery/${props.slug}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json().then(result => ({
                status: res.status,
                body: result
            }))
        })
        .then(
            ({ status, body }) => {
                setIsLoaded(true)
                if (status == 200) {
                    setItems(body.data.data)
                }
            },
            (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        )
    }

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={'consume gallery'}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container p-3 mt-3'>
                <div className='d-flex justify-content-between'>
                    <ComponentText text_type="sub_heading" body="Gallery"/>
                    {
                        items.length > 0 &&
                            <ComponentModal id={`addGallery`} title={`Add Gallery`} button_class="bgd-primary p-2 text-white"
                                button_icon={<FontAwesomeIcon icon={faPlus} size="xl" className='me-2'/>}
                                body={<PostGallery consume_id={props.id} onsubmit={fetchGallery}/>}
                            />
                    }
                </div>
                <ComponentBreakLine length={1}/>
                {
                    items.length > 0 ?
                        <div className='row'>
                            {
                                items.map((dt, idx) => (
                                    <div className='col-lg-4' key={idx}>
                                        <ComponentContainerGalleryManage image_url={dt.gallery_url} id={dt.id} body={dt.gallery_desc} created_at={dt.created_at} title={props.consume_name}/>
                                    </div>
                                ))
                            }
                        </div>
                    :
                        <div className='text-center'>
                            <ComponentTextMessageImageNoData is_with_image={true} image_url={'/icons/Gallery.png'} body="No Gallery Found"/>
                            <ComponentBreakLine length={1}/>
                            <ComponentModal id={`addGallery`} title={`Add Gallery`} button_class="bgd-primary p-2 text-white"
                                button_icon={<FontAwesomeIcon icon={faPlus} size="xl" className='me-2'/>}
                                body={<PostGallery consume_id={props.id} onsubmit={fetchGallery}/>}
                            />
                            <ComponentBreakLine length={2}/>
                        </div>
                }
            </div>
        )
    }
}
  