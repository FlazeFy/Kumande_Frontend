"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import ComponentText from '../../../../atoms/text'
import ComponentTextMessageImageNoData from '../../../../molecules/text_message_image_no_data'
import ComponentContainerGalleryManage from '../../../../organisms/container_gallery_manage'
import ComponentBreakLine from '../../../../atoms/breakline'

export default function GetConsumeGallery(props) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/gallery/${props.slug}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data.data)
            },
            (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        )
    },[])

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container p-3 mt-3'>
                <ComponentText text_type="sub_heading" body="Gallery"/>
                <ComponentBreakLine length={1}/>
                {
                    items.length > 0 ?
                        <div className='row'>
                            {
                                items.map((dt, idx) => (
                                    <div className='col-lg-4'>
                                        <ComponentContainerGalleryManage image_url={dt.gallery_url} id={dt.id} body={dt.gallery_desc} created_at={dt.created_at} title={props.consume_name}/>
                                    </div>
                                ))
                            }
                        </div>
                    :
                        <>
                            <ComponentTextMessageImageNoData is_with_image={true} image_url={'/icons/Gallery.png'} body="No Gallery Found"/>
                            
                        </>
                }
            </div>
        )
    }
}
  