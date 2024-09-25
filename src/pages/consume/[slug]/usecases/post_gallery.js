"use client"
import React from 'react'
import Axios from 'axios'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import { storage } from '../../../../modules/firebase/init'

// Component
import ComponentForm from '../../../../organisms/container_form'
import ComponentBreakLine from '../../../../atoms/breakline'
import { getLocal } from '../../../../modules/storages/local'

export default function PostGallery(props) {
    //Initial variable
    const [galleryDesc, setGalleryDesc] = useState(null)
    const [galleryUrl, setGalleryUrl] = useState(null)
    const token = getLocal("token_key")

    const [resMsgDesc, setResMsgDesc] = useState("")
    const [resMsgAll, setResMsgAll] = useState("")

    const builder = [
        {
            type: 'textarea',
            id:'desc-input',
            class: 'form-control',
            label: 'Description',
            placeholder: 'Type description',
            is_required: true,
            max: 144,
            handleChange: (event) => {
                setGalleryDesc(event.target.value)
            },
            errorMsg: resMsgDesc
        },
        {
            type: 'upload',
            id:'file-input',
            class: 'form-control',
            label: 'Gallery Image',
            is_required: true,
            handleChange: (event) => {
                event = event.target.files[0]

                if (event == null) return
                    const imageRef = ref(storage, `consume/${event.name + v4()}`)
                    uploadBytes(imageRef, event).then((snapshot) => {
                        getDownloadURL(snapshot.ref).then((url) => {
                            setGalleryUrl(url)
                        }
                    )
                })
            }
        },
        {
            type: 'submit',
            class: 'btn btn-success rounded-pill',
            id:'submit-btn',
            label: 'Submit',
            placeholder: null,
            toogle_disabled: false,
            handleClick: (event) => {
                handleSubmit(event)
            },
            errorMsg: resMsgAll
        }
    ]

    // Services
    const handleSubmit = async (e) => {
        Swal.showLoading()
        const data = {
            consume_id: props.consume_id,
            gallery_desc: galleryDesc,
            gallery_url: galleryUrl
        }

        try {
            let response = await Axios.post("http://127.0.0.1:8000/api/v1/consume/gallery", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            
            Swal.hideLoading()
            if(response.status == 200){
                props.onsubmit()
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.message,
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
        }
    }

    return <>
        {
            galleryUrl && <>
                <img className='img img-fluid' src={galleryUrl} title={galleryUrl}></img>
                <ComponentBreakLine label={1}/>
            </>
        }
        <ComponentForm type={"single-line"} props={builder} />
    </>
}