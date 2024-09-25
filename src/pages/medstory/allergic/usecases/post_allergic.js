"use client"
import React from 'react'
import { useState } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'

export default function PostAllergic({fetchAllergic, count, total_found}) {
    //Initial variable
    const token = getLocal("token_key")

    // Form
    const [allergicName, setAllergicName] = useState("")
    const [allergicDesc, setAllergicDesc] = useState("")

    const handleAddAllergic = async () => {
        const data = {
            allergic_context: allergicName,
            allergic_desc: allergicDesc && allergicDesc.trim() === "" ? null : allergicDesc,
        }

        setAllergicName("")
        setAllergicDesc("")
        try {
            const response = await Axios.post(`http://127.0.0.1:8000/api/v1/analytic/allergic`, JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status === 200){
                fetchAllergic()
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                    text: response.data.message,
                })
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message || "An unexpected error occurred"

            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: errorMessage,
            })
        }
    }

    return (
        <>
            <button className='btn-main mb-3' style={{height:"150px"}} data-bs-toggle="modal" data-bs-target={`#addAllergic`} title='Add Allergic'>
                <div className='ms-2 me-4'>
                    <img style={{height:"140px",bottom:"0"}} src={'/icons/Allergic.png'} alt={'/icons/Allergic.png'}/>
                </div>
                <div className='text-start py-4'>
                    <p className='mb-0'>{count === 0 ? 'You have some allergic and want to monitor all your food? You will receive warning alert' : 'From our analyze for all your consume history'}</p>
                    <p className='mb-0'>{count === 0 && total_found === 0 ? 'About the possible food that possible be your allergic' : total_found > 0 ? `We have found ${total_found.length}`:'All of your food is safe!'}</p>
                    <h2>{count === 0 ? 'Start Monitoring Your Consume' : 'Add More Allergic'}</h2>
                </div>
            </button>
            <div className="modal fade" id={`addAllergic`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Allergic</h5>
                            <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                        </div>
                        <div className="modal-body text-start p-4">
                            <div className="form-floating mb-2">
                                <input type="text" className="form-control" onChange={(e) => setAllergicName(e.target.value)} id="floatingInput"></input>
                                <label htmlFor="floatingInput">Allergic Name</label>
                            </div>
                            <div className="form-floating">
                                <textarea className="form-control" style={{height:"100px"}} onChange={(e) => setAllergicDesc(e.target.value)} id="floatingInput"></textarea>
                                <label htmlFor="floatingInput">Description</label>
                            </div>
                            <button className='w-100 btn btn-success mt-2 py-2' data-bs-dismiss="modal" onClick={(e) => handleAddAllergic()}><FontAwesomeIcon icon={faFloppyDisk}/> Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>  
    )
}
  