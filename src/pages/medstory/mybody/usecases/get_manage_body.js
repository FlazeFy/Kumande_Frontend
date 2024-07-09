"use client"
import { faClockRotateLeft, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef } from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import { convertDatetime } from '../../../../modules/helpers/converter'

export default function GetManageBody({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [itemsBodyInfo, setItemsBodyInfo] = useState(null)
    const [itemsCalorie, setItemsCalorie] = useState(null)
    const [resMsgAll, setResMsgAll] = useState([])
    
    const fetchManageBody = () => {
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
            },
            (error) => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            }
        )
    }

    useEffect(() => {
        fetchManageBody();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>
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
                                <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <div className='row'>
                                    <div className='col-lg-7 col-md-6 col-sm-12'>
                                        <table class="table table-bordered table-click">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Tested On</th>
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
                                                            <tr>
                                                                <td>{convertDatetime(dt.created_at,'datetime')}</td>
                                                                <td>{dt.blood_pressure}</td>
                                                                <td>{dt.blood_glucose} mg/dL</td>
                                                                <td>{dt.gout} mg/dL</td>
                                                                <td>{dt.cholesterol} mg/dL</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                <tr>
                                                    <td colSpan={5}><button className='btn btn-success w-100' style={{borderRadius:"0"}}><FontAwesomeIcon icon={faPlus}/> Add New Test</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-lg-5 col-md-6 col-sm-12'>
                                        <table class="table table-bordered table-click">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Tested On</th>
                                                    <th scope="col">Weight</th>
                                                    <th scope="col">Height</th>
                                                    <th scope="col">Calorie</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    itemsCalorie.map((dt, idx)=>{
                                                        return (
                                                            <tr>
                                                                <td>{convertDatetime(dt.created_at,'datetime')}</td>
                                                                <td>{dt.weight} Kg</td>
                                                                <td>{dt.height} Cm</td>
                                                                <td>{dt.result} Cal</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                <tr>
                                                    <td colSpan={5}><button className='btn btn-success w-100' style={{borderRadius:"0"}}><FontAwesomeIcon icon={faPlus}/> Add New Test</button></td>
                                                </tr>
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
  