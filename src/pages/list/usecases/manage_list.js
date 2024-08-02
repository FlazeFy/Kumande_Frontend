"use client"
import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../modules/storages/local'
import Swal from 'sweetalert2'
import Axios from 'axios'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEdit, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import GetPieChart from '../../../components/charts/pie_chart'

const ManageList = forwardRef((props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const [messageRes, setMessageRes] = useState('...')
    const token = getLocal("token_key")

    // Form
    const [listName, setListName] = useState("")
    const [listDesc, setListDesc] = useState("")
    const [itemConsumeName, setItemsConsumeName] = useState([])
    const [itemsConsumePieCal, setItemsConsumePieCal] = useState([])
    const [itemsConsumePiePrice, setItemsConsumePiePrice] = useState([])
    const [addConsumeSlug, setAddConsumeSlug] = useState(null)
    const [addConsumeCal, setAddConsumeCal] = useState(0)
    const [addConsumeProvide, setAddConsumeProvide] = useState(null)
    const [addConsumeFrom, setAddConsumeFrom] = useState(null)
    const [addConsumeAvgPrice, setAddConsumeAvgPrice] = useState(null)
    const [allowSubmitAddConsume, setAllowSubmitAddConsume] = useState(false)

    // Toogle
    const [showInputRow, setShowInputRow] = useState(false)

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

    const getConsumeList = () => {
        const ctx =1
        fetch(`http://127.0.0.1:8000/api/v1/consume/list/select`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItemsConsumeName(result.data)
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                }
            }
        )
    }

    const checkConsumeName = (slug) => {
        fetch(`http://127.0.0.1:8000/api/v1/list/check/${slug}/${props.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json().then(result => ({ status: res.status, result: result })))
        .then(({ status, result }) => {
            if (status == 200) { 
                setAddConsumeSlug(slug)
                setAddConsumeCal(result.data.calorie)
                setAddConsumeFrom(result.data.consume_from)
                setAddConsumeProvide(result.data.provide)
                setAddConsumeAvgPrice(result.data.average_price)
                setAllowSubmitAddConsume(true)

                Swal.fire({
                    title: 'Success!',
                    text: 'Consume found',
                    icon: 'success',
                }) 
            } else if(status == 409) {
                Swal.fire({
                    title: 'Error!',
                    text: result.message,
                    icon: 'error',
                }) 
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happened. Call the Admin!',
                    icon: 'error',
                }) 
            }

            if(status != 200){
                cleanAddConsumeForm()
            }
        })
        .catch(error => {                
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happened. Call the Admin!',
                icon: 'error',
            }) 
        })
    }

    const cleanAddConsumeForm = () => {
        setAllowSubmitAddConsume(false)
        setAddConsumeCal(0)
        setAddConsumeSlug(null)
        setAddConsumeFrom(null)
        setAddConsumeProvide(null)
        setAddConsumeAvgPrice(null)
    }

    // Services
    const handleAddConsume = async (slug, listId) => {
        try {
            let data = {
                consume_slug: slug,
                list_id: listId,
            }

            const response = await Axios.post("http://127.0.0.1:8000/api/v1/list/createRel", JSON.stringify(data), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            if(response.status != 200){
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Consume saved',
                    icon: 'success',
                })  
                setShowInputRow()
                cleanAddConsumeForm()
                fetchDetail()

            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happen. Call the Admin!',
                icon: 'error',
            })  
        }
    }

    const handleRemoveConsume = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will reload the analysis",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await Axios.delete(`http://127.0.0.1:8000/api/v1/list/deleteRel/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    if(response.status != 200){
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something wrong happen. Call the Admin!',
                            icon: 'error',
                        })  
                    } else {
                        Swal.fire({
                            title: 'Success!',
                            text: response.data.message,
                            icon: 'success',
                        })  
                        fetchDetail()
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something wrong happen. Call the Admin!',
                        icon: 'error',
                    })  
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Consume remove dismissed",
                    icon: "error"
                })
            }
        })
    }

    // Add
    const toogleAddConsume = () => {
        getConsumeList()
        setShowInputRow(true)
    };

    // Cancel
    const closeAddConsume = () => {
        setShowInputRow(false)
        cleanAddConsumeForm()
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
                        <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close" onClick={cleanAddConsumeForm}>
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
                                                    items.consume ?
                                                        <GetPieChart items={itemsConsumePieCal} filter_name={null}/>
                                                    :
                                                        <>
                                                            <a className='fst-italic text-secondary'>- No Data -</a>
                                                        </>
                                                }
                                                 <h5 className='mt-4'>Statistic Price</h5>
                                                {
                                                    items.consume ?
                                                        <GetPieChart items={itemsConsumePiePrice} filter_name={null}/>
                                                    :
                                                        <>
                                                            <a className='fst-italic text-secondary'>- No Data -</a>
                                                        </>
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
                                                            items.consume && (items.consume.map((dt, idx) => {
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
                                                                        <td><a className='btn btn-danger' onClick={(e)=>handleRemoveConsume(dt.id)}><FontAwesomeIcon icon={faTrash}/></a></td>
                                                                    </tr>
                                                                )
                                                            }))
                                                        }
                                                        {
                                                            showInputRow && (
                                                                <tr className='tr-form'>
                                                                    <td className='p-0'>
                                                                        <div className="form-floating">
                                                                            <select className="form-select m-0 ps-2" onChange={(e)=>checkConsumeName(e.target.value)} aria-label="Select consume">
                                                                                <option>---</option>
                                                                                {
                                                                                    itemConsumeName.map((dt, idx) =>(
                                                                                        <option key={idx} value={dt.slug_name}>
                                                                                            {dt.consume_name}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            <label htmlFor="selectDay">Select Consume</label>
                                                                        </div>
                                                                    </td>
                                                                    <td>{addConsumeCal && (<span>{addConsumeCal} Cal</span>)}</td>
                                                                    <td>{addConsumeFrom && addConsumeProvide && (<span><span className='btn btn-success rounded-pill py-0 px-2 me-1' style={{fontSize:"var(--textMD)"}}>{addConsumeFrom}</span> {addConsumeProvide}</span>)}</td>
                                                                    <td>{addConsumeAvgPrice > 0 ? <span>Rp. {addConsumeAvgPrice.toLocaleString()} ,00</span> : addConsumeAvgPrice == 0 ? <span className='btn btn-success rounded-pill py-0 px-2 me-1'style={{fontSize:"var(--textMD)"}}>Free</span> : <></>}</td>
                                                                    <td>{allowSubmitAddConsume && (<a className='btn btn-success' onClick={(e)=>handleAddConsume(addConsumeSlug,props.id)}><FontAwesomeIcon icon={faCheck}/></a>)}</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            items.consume && (
                                                                <tr>
                                                                    <td colSpan={2}>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Total Calorie:</span>
                                                                            <b>{total_cal.toFixed(2)} Cal</b>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Average Calorie:</span>
                                                                            <b>{(total_cal / items.consume.length).toFixed(2)} Cal</b>
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
                                                        <tr>
                                                            {
                                                                showInputRow ?
                                                                    <>
                                                                        <td colSpan={4} className="p-0">
                                                                            <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={toogleAddConsume}><FontAwesomeIcon icon={faPlus}/> Add</button>
                                                                        </td>
                                                                        <td colSpan={1} className="p-0">
                                                                            <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={closeAddConsume}><FontAwesomeIcon icon={faXmark}/></button>
                                                                        </td>
                                                                    </>
                                                                :
                                                                    <td colSpan={5} className="p-0">
                                                                        <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={toogleAddConsume}><FontAwesomeIcon icon={faPlus}/> Add</button>
                                                                    </td>
                                                            }
                                                            
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <hr></hr>
                                                {
                                                    items.consume && (
                                                        <>
                                                            <h5>Comparison to All Consume</h5>
                                                            <div className="d-flex justify-content-between">
                                                                <span>Average Calorie (<b>List</b> / Whole) :</span>
                                                                <span><b>{total_cal.toFixed(2)} Cal</b> / {items.whole_avg_calorie.toFixed(2)} Cal</span>
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