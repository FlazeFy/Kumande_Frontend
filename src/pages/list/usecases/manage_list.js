"use client"
import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../modules/storages/local'
import Swal from 'sweetalert2'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import GetPieChart from '../../../components/charts/pie_chart'

const ManageList = forwardRef((props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const [messageRes, setMessageRes] = useState('...')
    const token = getLocal("token_key")

    // Form
    const [listName, setListName] = useState("")
    const [listDesc, setListDesc] = useState("")
    const [itemsConsumePieCal, setItemsConsumePieCal] = useState([])
    const [itemsConsumePiePrice, setItemsConsumePiePrice] = useState([])

    // Ref
    const listNameRef = useRef(null)
    const listDescRef = useRef(null)

    const modalRef = useRef(null)

    useEffect(() => {
        const handleShow = () => {
            if (props.id) {
                fetchDetail()
            }
        }
        const modalElement = modalRef.current
        modalElement.addEventListener('shown.bs.modal', handleShow)

        return () => {
            modalElement.removeEventListener('shown.bs.modal', handleShow)
        }
    }, [props.id])

    const fetchDetail = () => {
        fetch(`http://127.0.0.1:8000/api/v1/list/detail/${props.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json().then(result => ({ status: res.status, result: result })))
        .then(({ status, result }) => {
            setIsLoaded(true)
            if (status == 200) { 
                setItems(result.data)
                setListName(result.data.list_name)
                setListDesc(result.data.list_desc)

                if(result.data.consume){
                    let dataCal = []
                    let dataPrice = []

                    result.data.consume.forEach(el => {
                        dataCal.push({
                            context:el.consume_name,
                            total:el.calorie
                        })
                    });
                    result.data.consume.forEach(el => {
                        dataPrice.push({
                            context:el.consume_name,
                            total:el.average_price
                        })
                    });
                    setItemsConsumePieCal(dataCal)
                    setItemsConsumePiePrice(dataPrice)
                }

                if(listNameRef.current){
                    listNameRef.current.value = result.data.list_name
                }
                if(listDescRef.current){
                    listDescRef.current.value = result.data.list_desc
                }

                if(!items){
                    setMessageRes(result.message)
                }
            } else {
                setItems(null)
                if (status != 404) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something wrong happened. Call the Admin!',
                        icon: 'error',
                    }) 
                }
            }
        })
        .catch(error => {                
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happened. Call the Admin!'+error,
                icon: 'error',
            }) 
        })
    }

    useImperativeHandle(ref, () => ({
        fetchDetail
    }))

    let total_cal = 0
    let total_price = 0
    let count_payment = 0

    return (
        <div className="modal fade" id="listConsumeModal" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">List Detail</h5>
                        <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        {
                            props.id && (
                                items ?
                                    <>
                                        <div className='row'>
                                            <div className='col-5'>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" ref={listNameRef} value={listName}></input>
                                                    <label htmlFor="floatingInput">List Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <textarea className="form-control" style={{minHeight:"100px"}} ref={listDescRef} value={listDesc} placeholder="Leave a comment here" id="floatingTextarea">{listDesc}</textarea>
                                                    <label htmlFor="floatingTextarea">Description</label>
                                                </div>
                                                <hr></hr>
                                                <h5 className='mt-4'>Statistic Calorie</h5>
                                                {
                                                    items.consume && (
                                                        <GetPieChart items={itemsConsumePieCal} filter_name={null}/>
                                                    )
                                                }
                                                 <h5 className='mt-4'>Statistic Price</h5>
                                                {
                                                    items.consume && (
                                                        <GetPieChart items={itemsConsumePiePrice} filter_name={null}/>
                                                    )
                                                }
                                            </div>
                                            <div className='col-7'>
                                                <div className='d-flex justify-content-between'>
                                                    <h6 className='mt-1'>Tags</h6>
                                                    <a className='btn btn-primary py-0'><FontAwesomeIcon icon={faEdit}/></a>
                                                </div>
                                                {
                                                    items.list_tag != null ?
                                                        items.list_tag.map((tag, tidx) => {
                                                            return (
                                                                <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>{tag.tag_name}</a>
                                                            )
                                                        })
                                                    :   
                                                        <a className='fst-italic text-secondary'>- No Tag Provided -</a>
                                                }
                                                <hr></hr>
                                                <h5>List Consume</h5>
                                                <table className='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th>Consume Name</th>
                                                            <th>Calorie</th>
                                                            <th>Provide / From</th>
                                                            <th>Average Price</th>
                                                            <th>Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{fontSize:"var(--textMD)"}} className="text-start">
                                                        {
                                                            items.consume.map((dt, idx) => {
                                                                total_cal = total_cal + dt.calorie
                                                                total_price = total_price + dt.average_price
                                                                if(dt.average_price > 0){
                                                                    count_payment++
                                                                }

                                                                return (
                                                                    <tr>
                                                                        <td>{dt.consume_name}</td>
                                                                        <td>{dt.calorie} Cal</td>
                                                                        <td><span className='btn btn-success rounded-pill py-0 px-2 me-1' style={{fontSize:"var(--textMD)"}}>{dt.consume_from}</span>{dt.provide}</td>
                                                                        <td>Rp. {dt.average_price.toLocaleString()},00</td>
                                                                        <td><a className='btn btn-danger'><FontAwesomeIcon icon={faTrash}/></a></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            items.consume && (
                                                                <tr>
                                                                    <td colSpan={2}>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Total Calorie:</span>
                                                                            <b>{total_cal} Cal</b>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Average Calorie:</span>
                                                                            <b>{total_cal / items.consume.length} Cal</b>
                                                                        </div>
                                                                    </td>
                                                                    <td colSpan={3}>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Total Price :</span>
                                                                            <b>Rp. {total_price.toLocaleString()},00</b>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Average Price :</span>
                                                                            <b>Rp. {(total_price / count_payment).toLocaleString()},00</b>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                <hr></hr>
                                                {
                                                    items.consume && (
                                                        <>
                                                            <h5>Comparison to All Consume</h5>
                                                            <div className="d-flex justify-content-between">
                                                                <span>Average Calorie (<b>List</b> / Whole) :</span>
                                                                <span><b>{total_cal} Cal</b> / {items.whole_avg_calorie} Cal</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <span>Average Price (<b>List</b> / Whole) :</span>
                                                                <span><b>Rp. {(total_price / count_payment).toLocaleString()},00</b> / Rp. {items.whole_avg_price.toLocaleString()},00</span>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </>
                                :
                                    <div className='my-3 mx-auto d-block text-center'>
                                        <p className='text-secondary text-center fst-italic'>- loading... -</p>
                                    </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ManageList