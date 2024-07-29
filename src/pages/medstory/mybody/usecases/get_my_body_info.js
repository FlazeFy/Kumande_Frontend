"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import GetRadialChart from '../../../../components/charts/radial_chart'
import { convertDatetime, ucFirstChar } from '../../../../modules/helpers/converter'
import GetManageBody from './get_manage_body'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faCheckCircle, faFloppyDisk, faMugSaucer, faTrash, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import PostAllergic from './post_allergic'

export default function GetMyBodyInfo({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [items, setItems] = useState(null)
    const [itemsAllergic, setItemsAllergic] = useState(null)

    // Form
    const [allergicName, setAllergicName] = useState("")
    const [allergicDesc, setAllergicDesc] = useState("")
    const [createdAt, setCreatedAt] = useState(null)
    const [idAllergic, setIdAllergic] = useState(null)
    
    const fetchBodyInfo = () => {
        fetch(`http://127.0.0.1:8000/api/v1/user/body_info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({status:res.status, result:result}))
        }).then(({status, result}) => {
            setIsLoaded(true)

            if(status == 200){
                setItems(result.data) 
            } else {
                setItems(null)
            }
        }).catch(error=> {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Call the Admin!',
                icon: 'error',
            })
            if(getLocal(ctx + "_sess") !== undefined){
                setIsLoaded(true)
                setItems(JSON.parse(getLocal(ctx + "_sess")))
            } else {
                setIsLoaded(true)
                setError(error)
            }
        })
    }

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

            if(status == 200){
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
        fetchBodyInfo()
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
            allergic_desc: allergicDesc && allergicDesc.trim() == "" ? null : allergicDesc,
        }

        try {
            const response = await Axios.put(`http://127.0.0.1:8000/api/v1/analytic/allergic/${id}`, JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status == 200){
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
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        let bmi_status
        let glucose_status
        let gout_status
        let cholesterol_status
        let top_gout
        let bottom_gout
        let systolic_status
        let diastolic_status
        let systolic
        let diastolic

        if(items){
            // BMI Status (Source : CDC)
            bmi_status = items.bmi >= 30.0 ? 'Obesity' : 
                items.bmi >= 25.0 ? 'Overweight':
                items.bmi >= 18.5 ? 'Healthy Weight':
                'Underweight'

            // Glucose Status : Fasting (Source : CDC)
            glucose_status = items.blood_glucose >= 126 ? 'Diabetes' :
                items.blood_glucose >= 100 ? 'Prediabetes' :
                items.blood_glucose >= 70 ? 'Normal' :
                'Low'

            // Gout Status : Fasting (Source : https://www.medicalnewstoday.com/articles/uric-acid-level)
            gout_status = 
            items.gender == 'male' ?
                items.gout > 7.0 ? 'High' :
                    items.gout >= 2.5 ? 'Normal' :
                    'Low'
            : items.gender == 'female' ?
                items.gout > 6.0 ? 'High' :
                items.gout >= 1.5 ? 'Normal' :
                'Low' : ''

            // Total Cholesterol Status (Source : https://www.healthline.com/health/high-cholesterol/levels-by-age#adults)
            // by gender
            cholesterol_status = items.cholesterol >= 240 ? 'High' :
                items.cholesterol >= 200 ? 'Pre-High' :
                items.cholesterol >= 120 ? 'Normal' :
                'Low'

            top_gout = items.gender == 'male' ? 7.0 : 6.0
            bottom_gout = items.gender == 'male' ? 2.5 : 1.5

            // Blood Preasure (Source : https://www.health.harvard.edu/heart-health/reading-the-new-blood-pressure-guidelines)
            const blood_pressure_split = items.blood_pressure.split('/')
            systolic = blood_pressure_split[0]
            diastolic = blood_pressure_split[1]

            systolic_status = systolic > 140 ? 'High' :
                systolic > 120 ? 'Pre-High' :
                systolic > 90 ? 'Normal' : 'Low'

            diastolic_status = diastolic > 90 ? 'High' :
                diastolic > 80 ? 'Pre-High' :
                diastolic > 60 ? 'Normal' : 'Low'
        }

        let total_found_allergic = 0

        if(itemsAllergic){    
            itemsAllergic.map((dt, idx) => {
                if(dt.detected_on){
                    total_found_allergic += dt.detected_on.length
                }
            })
        }
        

        return (
            <div className='row pt-2'>
                <div className='d-flex justify-content-between mb-2'>
                    <h4>My Body Info</h4>
                    <GetManageBody ctx={"manage_body"}/>
                </div>
                <div className='row text-center'>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <h5 className='mb-0'>Blood Preasure</h5>
                        {
                            items ?
                                <GetRadialChart custom={
                                    {
                                        type:'half',
                                        extra_desc: '',
                                        value: [systolic,diastolic]
                                    }
                                } val={[systolic - 70, diastolic - 40]} label={[`Systolic (${systolic_status})`,`Diastolic (${diastolic_status})`]}/>
                            :   
                            <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                        }
                    </div>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <h5 className='mb-0'>Glucose</h5>
                        {
                            items.blood_glucose > 0 ?
                                <GetRadialChart custom={
                                    {
                                        type:'half',
                                        extra_desc: '',
                                        value: items.blood_glucose+' mg/dL'
                                    }
                                } val={(items.blood_glucose - 70) / (126 - 70) * 100} label={glucose_status}/>
                            :   
                                <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                        }
                    </div>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <h5 className='mb-0'>Gout</h5>
                        {
                            items.gout > 0 ?
                                <GetRadialChart custom={
                                    {
                                        type:'half',
                                        extra_desc: '',
                                        value: items.gout+' mg/dL'
                                    }
                                } val={(items.gout - bottom_gout) / (top_gout - bottom_gout) * 100} label={gout_status}/>
                            :   
                                <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                        }
                    </div>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <h5 className='mb-0'>Cholesterol</h5>
                        {
                            items.cholesterol > 0 ?
                                <GetRadialChart custom={
                                    {
                                        type:'half',
                                        extra_desc: '',
                                        value: items.cholesterol+' mg/dL'
                                    }
                                } val={(items.cholesterol - 120) / (240 - 120) * 100} label={cholesterol_status}/>
                            :   
                                <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                        }
                    </div>
                </div>
                <p className='text-secondary text-end mb-3 pe-5' style={{fontSize:"var(--textMD)"}}>Last Updated at {items ? convertDatetime(items.created_at,'calendar'):''}</p>
                <div className='row text-center'>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <h5 className='mb-0'>Body Mass Index (BMI)</h5>
                        <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>Last Updated at {items ? convertDatetime(items.calorie_updated,'calendar'):''}</p>
                        {
                            items.bmi ?
                            <   GetRadialChart custom={
                                    {
                                        type:'half',
                                        extra_desc: '',
                                        value: items.bmi
                                    }
                                } val={(items.bmi - 18.5) / (35.0 - 18.5) * 100} label={bmi_status}/>
                            :   
                                <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                        }
                    </div>
                    <div className='col-lg-9 col-md-4 col-sm-12'>
                        <h5 className='mb-0'>Allergic</h5>
                        <p className='mb-2 text-secondary' style={{fontSize:"var(--textMD)"}}>Last Updated at {itemsAllergic ? convertDatetime(itemsAllergic[0].created_at,'calendar'):''}</p>
                        <div className='row'>
                            <div className='col-12'>
                                <PostAllergic fetchAllergic={fetchAllergic} count={itemsAllergic ? itemsAllergic.length : 0} total_found={total_found_allergic}/>
                            </div>
                            {
                                itemsAllergic ?     
                                    itemsAllergic.map((dt, idx) => {
                                        return (
                                            <div className='col-12'>
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
                                                                <a className='fst-italic text-secondary mb-1'>- No Description Provided -</a>
                                                        }
                                                        <hr className='my-2'></hr>
                                                        <div className='context'>
                                                            {
                                                                dt.detected_on != null ?
                                                                    dt.detected_on.map((ctx, cidx)=> {
                                                                        return (
                                                                            <a className='me-2 btn btn-danger py-1 px-2 text-white mb-2 text-start' style={{color:"var(--primaryColor)", fontWeight:"500", fontSize:"var(--textMD)"}} href={`/consume/${ctx['slug_name']}`}>
                                                                            {
                                                                                ctx['consume_type'] == 'Food' ?
                                                                                    <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                                                                                : ctx['consume_type'] == 'Drink' ?
                                                                                    <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                                                                                : ctx['consume_type'] == 'Snack' ?
                                                                                    <FontAwesomeIcon icon={faCake} className='me-2'/>
                                                                                : 
                                                                                    <></>
                                                                            }
                                                                            {ctx['consume_name']}
                                                                            </a>
                                                                        )
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
                                    <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                            }
                            </div>
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
                                                <a className='fst-italic text-secondary' style={{fontSize:"var(--textMD)"}}>Created at {convertDatetime(createdAt,'calendar')}</a>
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
                </div>
            </div>
        )
    }
}