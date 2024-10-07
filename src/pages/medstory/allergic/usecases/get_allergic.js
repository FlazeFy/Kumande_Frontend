"use client"
import React, { useEffect } from 'react'
import { useState } from "react"
import { getLocal } from "../../../../modules/storages/local"
import Swal from 'sweetalert2'
import Axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faFloppyDisk, faTrash, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { convertDatetime, getCleanTitleFromCtx, ucFirstChar } from '../../../../modules/helpers/converter'
import PostAllergic from './post_allergic'
import ComponentTextMessageNoData from '../../../../atoms/text_message_no_data'
import ComponentTextIcon from '../../../../atoms/text_icon'
import ComponentAlertBox from '../../../../molecules/alert_box'

export default function GetAllergic({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [itemsAllergic, setItemsAllergic] = useState(null)

    // Form
    const [allergicName, setAllergicName] = useState("")
    const [allergicDesc, setAllergicDesc] = useState("")
    const [createdAt, setCreatedAt] = useState(null)
    const [idAllergic, setIdAllergic] = useState(null)


    const fetchAllergic = () => {
        fetch(`http://127.0.0.1:8000/api/v1/analytic/allergic`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({status:res.status, result:result}))
        }).then(({status, result}) => {
            setIsLoaded(true)

            if(status === 200){
                setItemsAllergic(result.data) 
            } else {
                setItemsAllergic(null)
            }
        }).catch(error=> {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Call the Admin!',
                icon: 'error',
            })
            if(getLocal(ctx + "_sess") !== undefined){
                setIsLoaded(true)
                setItemsAllergic(JSON.parse(getLocal(ctx + "_sess")))
            } else {
                setIsLoaded(true)
                setError(error)
            }
        })
    }

    useEffect(() => {
        fetchAllergic()
    }, []);

    const openEditAllergicModal = (dt) => {
        setAllergicName(dt.allergic_context)
        setAllergicDesc(dt.allergic_desc)
        setCreatedAt(dt.created_at)
        setIdAllergic(dt.id)
    }

    const handleUpdateAllergic = async (id) => {
        const data = {
            allergic_context: allergicName,
            allergic_desc: allergicDesc && allergicDesc.trim() === "" ? null : allergicDesc,
        }

        try {
            const response = await Axios.put(`http://127.0.0.1:8000/api/v1/analytic/allergic/${id}`, JSON.stringify(data), {
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

    const handleDeleteAllergic = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will also impact on consume analyze for next use",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await Axios.delete(`http://127.0.0.1:8000/api/v1/analytic/allergic/${id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    })
    
                    if (response.status === 200) {
                        fetchAllergic()
                        Swal.fire({
                            title: "success",
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
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Delete allergic dismissed",
                    icon: "error"
                })
            }
        })
    }

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        let total_found_allergic = 0

        if(itemsAllergic){    
            itemsAllergic.map((dt, idx) => {
                if(dt.detected_on){
                    total_found_allergic += dt.detected_on.length
                }
                return null
            })
        }

        return (
            <>
                <h5 className='mb-0'>Allergic</h5>
                <p className='mb-2 text-secondary' style={{fontSize:"var(--textMD)"}}>Last Updated at {itemsAllergic ? convertDatetime(itemsAllergic[0].created_at,'calendar'):''}</p>
                <div className='row px-3'>
                    <div className='col-12'>
                        <PostAllergic fetchAllergic={fetchAllergic} count={itemsAllergic ? itemsAllergic.length : 0} total_found={total_found_allergic}/>
                    </div>
                    {
                        itemsAllergic ?     
                            itemsAllergic.map((dt, idx) => {
                                return (
                                    <div className='col-12' key={`item_allergic_${idx}`}>
                                        <button className={dt.detected_on ? 'box-reminder':'box-reminder active'} data-bs-toggle="modal" data-bs-target={`#manageAllergic`} onClick={(e)=>openEditAllergicModal(dt)}
                                            title='Edit the Allergic'>
                                            <div style={{width:"40px"}} className="pt-2">
                                                <FontAwesomeIcon icon={dt.detected_on ? faTriangleExclamation:faCheckCircle} style={{fontSize:"calc(var(--textJumbo)*1.5)"}}/>
                                            </div>
                                            <div className='w-100 ms-3'>
                                                <h5 className='mb-1'>{ucFirstChar(dt.allergic_context)}</h5>
                                                {
                                                    dt.allergic_desc ?
                                                        <p className='mb-1'>{dt.allergic_desc}</p>
                                                    :
                                                        <ComponentTextMessageNoData is_with_image={false}  message="No Description Provided"/>
                                                }
                                                <hr className='my-2'></hr>
                                                <div className='context'>
                                                    {
                                                        dt.detected_on != null ?
                                                            dt.detected_on.map((ctx, cidx)=> {
                                                                return <ComponentTextIcon key={`consume_name_${cidx}`} text_type={ctx['consume_type']} body={ctx['consume_name']}/>
                                                            })
                                                        :
                                                            <p className='fst-italic text-success' style={{fontWeight:"600"}}>- All Consume is Safe -</p>
                                                    }
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                    {
                        itemsAllergic ?
                            <div className="modal fade" id={`manageAllergic`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Manage Allergic</h5>
                                            <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                                        </div>
                                        <div className="modal-body text-start p-4">
                                            <div className="form-floating mb-2">
                                                <input type="text" className="form-control" defaultValue={allergicName} onChange={(e) => setAllergicName(e.target.value)} id="floatingInput"></input>
                                                <label htmlFor="floatingInput">Allergic Name</label>
                                            </div>
                                            <div className="form-floating">
                                                <textarea className="form-control" style={{height:"100px"}} defaultValue={allergicDesc} onChange={(e) => setAllergicDesc(e.target.value)} id="floatingInput"></textarea>
                                                <label htmlFor="floatingInput">Description</label>
                                            </div>
                                            <span className='fst-italic text-secondary' style={{fontSize:"var(--textMD)"}}>Created at {convertDatetime(createdAt,'calendar')}</span>
                                            <button className='w-100 btn btn-success mt-2 py-2' data-bs-dismiss="modal" onClick={(e) => handleUpdateAllergic(idAllergic)}><FontAwesomeIcon icon={faFloppyDisk}/> Save Changes</button>
                                            <button className='w-100 btn btn-danger mt-2 py-2' data-bs-dismiss="modal" onClick={(e) => handleDeleteAllergic(idAllergic)}><FontAwesomeIcon icon={faTrash}/> Delete Allergic</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                            <></>
                    }
                </div>
            </>
        )
    }
}