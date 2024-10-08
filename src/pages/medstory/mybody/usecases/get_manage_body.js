"use client"
import { faCalculator, faClockRotateLeft, faDroplet, faPaperPlane, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback } from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import { convertDatetime, getCleanTitleFromCtx } from '../../../../modules/helpers/converter'
import { add_firestore } from '../../../../modules/firebase/command'
import Axios from 'axios'
import $ from 'jquery'
import ComponentBodyBoxDashboard from '../../../../organisms/container_body_info'
import ComponentAlertBox from '../../../../molecules/alert_box'

export default function GetManageBody({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [itemsBodyInfo, setItemsBodyInfo] = useState(null)
    const [itemsCalorie, setItemsCalorie] = useState(null)
    const [itemsDashboard, setItemsDashboard] = useState(null)
    
    // Toogle
    const [showInputRow, setShowInputRow] = useState(false)
    const [showInputCalRow, setShowInputCalRow] = useState(false)
    const [showChecboxBodyInfo, setShowChecboxBodyInfo] = useState(false)
    const [showChecboxCal, setShowChecboxCal] = useState(false)

    // Calorie form
    const [weight, setWeight] = useState(null)
    const [height, setHeight] = useState(null)
    const [calorie, setCalorie] = useState(null)

    // Body info form
    const [bloodPressure, setBloodPressure] = useState(null)
    const [glucose, setGlucose] = useState(null)
    const [gout, setGout] = useState(null)
    const [cholesterol, setCholesterol] = useState(null)
    
    const fetchManageBody = useCallback(() => {
        fetch(`http://127.0.0.1:8000/api/v1/user/my_body_history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItemsBodyInfo(result.data.body_info) 
                setItemsCalorie(result.data.calorie) 
                setItemsDashboard(result.data.dashboard)
            },
            (error) => {
                setError(error)
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            }
        )
    }, [token])

    useEffect(() => {
        fetchManageBody()
    }, [fetchManageBody]);

    // Add
    const handleAddNewTestClick = () => {
        setShowInputRow(true)
    };
    const handleAddNewCalClick = () => {
        setShowInputCalRow(true)
    };

    // Cancel
    const closeManageBodyModal = () => {
        setShowInputRow(false)
        setShowInputCalRow(false)
    }
    const cancelAddTest = () => {
        setShowInputRow(false)
    }
    const cancelAddCal = () => {
        setShowInputCalRow(false)
    }
    const cancelDeleteBodyInfo = () => {
        setShowChecboxBodyInfo(false)
    }
    const cancelDeleteCal = () => {
        setShowChecboxCal(false)
    }

    // Services
    const handleSubmitCal = async (e) => {
        try {
            let data = {
                type: 'calorie',
                weight: weight,
                height: height,
                result: calorie,
            }

            data.firebase_id = await add_firestore(data, 'body_info')     

            const response = await Axios.post("http://127.0.0.1:8000/api/v1/count/calorie", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status !== 200){
                window.location.reload(false)
                return response.data.message
            } else {
                setShowInputCalRow(false)
                Swal.fire({
                    title: 'Success!',
                    text: 'Body data saved',
                    icon: 'success',
                })  
                fetchManageBody()
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happen. Call the Admin!',
                icon: 'error',
            })  
        }
    }

    const handleSubmitBodyInfo = async (e) => {
        try {
            let data = {
                type: 'body_info',
                blood_pressure: bloodPressure,
                blood_glucose: glucose,
                gout: gout,
                cholesterol: cholesterol,
            }

            data.firebase_id = await add_firestore(data, 'body_info')     

            const response = await Axios.post("http://127.0.0.1:8000/api/v1/user/body_info/create", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status !== 200){
                window.location.reload(false)
                return response.data.message
            } else {
                setShowInputRow(false)
                Swal.fire({
                    title: 'Success!',
                    text: 'Body data saved',
                    icon: 'success',
                })  
                fetchManageBody()
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happen. Call the Admin!',
                icon: 'error',
            })  
        }
    }

    const handleToogleDelete = async (type) => {
        if(type === 'calorie'){
            try {
                if(!showChecboxCal){
                    setShowChecboxCal(true)
                } else {
                    let id = ''
                    $('.check-delete-calorie').each(function(idx, el){
                        if(el.checked){
                            id += `${el.value},`
                        }
                    })

                    const response = await Axios.delete(`http://127.0.0.1:8000/api/v1/count/calorie/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something wrong happen. Call the Admin!',
                            icon: 'error',
                        })  
                    } else {
                        setShowChecboxCal(false)
                        Swal.fire({
                            title: 'Success!',
                            text: response.data.message,
                            icon: 'success',
                        })  
                        fetchManageBody()
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            }
        } else if(type === 'body_info'){
            try {
                if(!showChecboxBodyInfo){
                    setShowChecboxBodyInfo(true)
                } else {
                    let id = ''
                    $('.check-delete-body_info').each(function(idx, el){
                        if(el.checked){
                            id += `${el.value},`
                        }
                    })

                    const response = await Axios.delete(`http://127.0.0.1:8000/api/v1/user/body_info/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something wrong happen. Call the Admin!',
                            icon: 'error',
                        })  
                    } else {
                        setShowChecboxBodyInfo(false)
                        Swal.fire({
                            title: 'Success!',
                            text: response.data.message,
                            icon: 'success',
                        })  
                        fetchManageBody()
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            }
        }
    }

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <>
                <button className='btn btn-primary mb-2' onClick={fetchManageBody}
                    data-bs-toggle="modal" data-bs-target={"#manageBodyModal"}>
                    <FontAwesomeIcon icon={faClockRotateLeft}/> See History
                </button>
                <div className="modal fade" id={"manageBodyModal"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">My Body Data History</h5>
                                <button type="button" className="btn_close_modal" data-bs-dismiss="modal" onClick={closeManageBodyModal} aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <div className='row'>
                                    <div className='col-lg-3 mx-auto'>
                                        <ComponentBodyBoxDashboard target={"blood_glucose"} item={itemsDashboard}/>
                                    </div>
                                    <div className='col-lg-3 mx-auto'>
                                        <ComponentBodyBoxDashboard target={"gout"} item={itemsDashboard}/>
                                    </div>
                                    <div className='col-lg-3 mx-auto'>
                                        <ComponentBodyBoxDashboard target={"cholesterol"} item={itemsDashboard}/>
                                    </div>
                                    <div className='col-lg-3 mx-auto'>
                                        <ComponentBodyBoxDashboard target={"weight"} item={itemsDashboard}/>
                                    </div>
                                    <div className='col-lg-3 mx-auto'>
                                        <ComponentBodyBoxDashboard target={"height"} item={itemsDashboard}/>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className='row'>
                                    <div className='col-lg-7 col-md-6 col-sm-12'>
                                        <table className="table table-bordered table-click">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        {
                                                            !showChecboxBodyInfo ?
                                                                'Tested On'
                                                            :
                                                                'To Deleted'
                                                        }
                                                    </th>
                                                    <th scope="col">Blood Preasure</th>
                                                    <th scope="col">Glucose</th>
                                                    <th scope="col">Gout</th>
                                                    <th scope="col">Cholesterol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    itemsBodyInfo.map((dt, idx)=>{
                                                        return (
                                                            <tr key={`tbody_body_data_${idx}`}>
                                                                <td>
                                                                    {
                                                                        !showChecboxBodyInfo ?
                                                                            convertDatetime(dt.created_at,'datetime')
                                                                        : 
                                                                            <input className="form-check-input check-delete-body_info" type="checkbox" value={dt.id}></input>
                                                                    }
                                                                </td>
                                                                <td>{dt.blood_pressure}</td>
                                                                <td>{dt.blood_glucose} mg/dL</td>
                                                                <td>{dt.gout} mg/dL</td>
                                                                <td>{dt.cholesterol} mg/dL</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                {
                                                    showInputRow && (
                                                        <tr className='tr-form'>
                                                            <td><button className='bgd-success border-0 w-100 text-white'><FontAwesomeIcon icon={faDroplet}/> Check</button></td>
                                                            <td><input aria-label="Blood Pressure" type="text" className="form-control" onChange={(e)=>setBloodPressure(e.target.value)}/></td>
                                                            <td><input aria-label="Glucose" type="number" className="form-control" onChange={(e)=>setGlucose(e.target.value)}/></td>
                                                            <td><input aria-label="Gout" type="number" className="form-control" onChange={(e)=>setGout(e.target.value)}/></td>
                                                            <td><input aria-label="Cholesterol" type="number" className="form-control" onChange={(e)=>setCholesterol(e.target.value)}/></td>
                                                        </tr>
                                                    )
                                                }
                                                {
                                                    !showChecboxBodyInfo ?
                                                        !showInputRow ? 
                                                            <tr>
                                                                <td colSpan={1}>
                                                                    <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={(e) => handleToogleDelete('body_info')}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                                </td>
                                                                <td colSpan={4}>
                                                                    <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={handleAddNewTestClick}><FontAwesomeIcon icon={faPlus}/> Add New Test</button>
                                                                </td>
                                                            </tr>
                                                        :
                                                            <tr>
                                                                <td colSpan={1}>
                                                                    <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={cancelAddTest}><FontAwesomeIcon icon={faXmark}/> Cancel</button>
                                                                </td>
                                                                <td colSpan={4}>
                                                                    <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={handleSubmitBodyInfo}><FontAwesomeIcon icon={faPaperPlane}/> Submit</button>
                                                                </td>
                                                            </tr>
                                                    :
                                                        <tr>
                                                            <td colSpan={1}>
                                                                <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={cancelDeleteBodyInfo}><FontAwesomeIcon icon={faXmark}/> Cancel</button>
                                                            </td>
                                                            <td colSpan={4}>
                                                                <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={(e) => handleToogleDelete('body_info')}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                            </td>
                                                        </tr>
                                                    
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-lg-5 col-md-6 col-sm-12'>
                                        <table className="table table-bordered table-click">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        {
                                                            !showChecboxCal ?
                                                                'Tested On'
                                                            :
                                                                'To Deleted'
                                                        }
                                                    </th>
                                                    <th scope="col">Weight</th>
                                                    <th scope="col">Height</th>
                                                    <th scope="col">Calorie</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    itemsCalorie.map((dt, idx)=>{
                                                        return (
                                                            <tr key={`tbody_calorie_${idx}`}>
                                                                <td>
                                                                    {
                                                                        !showChecboxCal ?
                                                                            convertDatetime(dt.created_at,'datetime')
                                                                        : 
                                                                            <input className="form-check-input check-delete-calorie" type="checkbox" value={dt.id}></input>
                                                                    }
                                                                </td>
                                                                <td>{dt.weight} Kg</td>
                                                                <td>{dt.height} Cm</td>
                                                                <td>{dt.result} Cal</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                {
                                                    showInputCalRow && (
                                                        <tr className='tr-form'>
                                                            <td><button className='bgd-success border-0 w-100 text-white'><FontAwesomeIcon icon={faCalculator}/> Calorie</button></td>
                                                            <td><input aria-label='Weight' type="text" className="form-control" onChange={(e)=>setWeight(e.target.value)}/></td>
                                                            <td><input aria-label='Height' type="number" className="form-control" onChange={(e)=>setHeight(e.target.value)}/></td>
                                                            <td><input aria-label='Calorie' type="number" className="form-control" onChange={(e)=>setCalorie(e.target.value)}/></td>
                                                        </tr>
                                                    )
                                                }
                                                {
                                                    !showChecboxCal ?
                                                        !showInputCalRow ? 
                                                            <tr>
                                                                <td colSpan={1}>
                                                                    <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={(e) => handleToogleDelete('calorie')}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                                </td>
                                                                <td colSpan={3}>
                                                                    <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={handleAddNewCalClick}><FontAwesomeIcon icon={faPlus}/> Add New Data</button>
                                                                </td>
                                                            </tr>
                                                        :
                                                            <tr>
                                                                <td colSpan={1}>
                                                                    <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={cancelAddCal}><FontAwesomeIcon icon={faXmark}/> Cancel</button>
                                                                </td>
                                                                <td colSpan={3}>
                                                                    <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={handleSubmitCal}><FontAwesomeIcon icon={faPaperPlane}/> Submit</button>
                                                                </td>
                                                            </tr>
                                                    :
                                                        <tr>
                                                            <td colSpan={1}>
                                                                <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={cancelDeleteCal}><FontAwesomeIcon icon={faXmark}/> Cancel</button>
                                                            </td>
                                                            <td colSpan={4}>
                                                                <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={(e) => handleToogleDelete('calorie')}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
  