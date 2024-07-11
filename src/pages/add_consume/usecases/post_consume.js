"use client"
import Axios from 'axios'
import React, { useRef } from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { add_firestore } from '../../../modules/firebase/command'
import GetExistedConsume from './get_existed_consume'
import { convertDatetime, numberToPrice } from '../../../modules/helpers/converter'

export default function PostConsume() {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    const ctx = 'tag_opt'
    const [selectedTag, setSelectedTag] = useState([])
    const [resMsgAll, setResMsgAll] = useState([])
    const [existingHistory, setExistingHistory] = useState(null)

    // Form
    const [consumeName, setConsumeName] = useState("")
    const [consumeProvide, setConsumeProvide] = useState("")
    const [consumeMainIng, setConsumeMainIng] = useState("")
    const [consumeCal, setConsumeCal] = useState(0)
    const [consumeFrom, setConsumeFrom] = useState("GoFood")
    const [consumeType, setConsumeType] = useState("Food")
    const [consumeComment, setConsumeComment] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("GoPay")
    const [paymentPrice, setPaymentPrice] = useState(0)
    const [consumeCreatedAt, setConsumeCreatedAt] = useState(null)

    const consumeNameRef = useRef(null)
    const consumeProvideRef = useRef(null)
    const consumeMainIngRef = useRef(null)
    const consumeCalRef = useRef(null)
    const consumeFromRef = useRef(null)
    const consumeTypeRef = useRef(null)
    const consumeCommentRef = useRef(null)
    const paymentMethodRef = useRef(null)
    const paymentPriceRef = useRef(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/tag`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItem(result.data) 
            },
            (error) => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })   
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItem(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

    // Services
    const handleSubmit = async (e) => {
        const consumeDetail = [{
            provide: consumeProvide,
            calorie: consumeCal,
            main_ing: consumeMainIng
        }]

        try {
            let consumeTag = []
            if(selectedTag.length > 0){
                selectedTag.forEach(element => {
                    consumeTag.push({
                        slug_name:element.props.value.slug_name, 
                        tag_name:element.props.value.tag_name
                    })
                });
                consumeTag = JSON.stringify(consumeTag)
            } else {
                consumeTag = null
            }

            let data = {
                consume_type: consumeType,
                token_fcm: 'lorem', // for now
                consume_name: consumeName,
                consume_detail: consumeDetail,
                consume_from: consumeFrom,
                is_favorite: 0,
                consume_tag: consumeTag,
                consume_comment: consumeComment,
                is_payment: 1
            }

            data.firebase_id = await add_firestore(data, 'consume')     
            data.consume_detail = JSON.stringify(consumeDetail)
            data.payment_method = paymentMethod
            data.payment_price = paymentPrice
            
            const response = await Axios.post("http://127.0.0.1:8000/api/v1/consume/create", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status == 200){
                Swal.fire({
                    title: "Success!",
                    text: "Consume saved",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
            setResMsgAll(error)
        }
    }

    const removeTag = (slug) => {        
        const newTag = []

        if(selectedTag.length != 0){
            selectedTag.forEach(element => {
                if(element.props.value.slug_name !== slug){
                    newTag.push(element)
                }
            });
        } 
        console.log(selectedTag)
        setSelectedTag(selectedTag)
    }

    const selectTag = (i, slug, name) => {
        const tagExists = selectedTag.some((elmt) => elmt.props.value.slug_name === slug);
        if (!tagExists) {
            setSelectedTag(selectedTag.concat(
                <button key={i} className='btn btn-tag' value={{slug_name:slug, tag_name:name}} title="Unselect this tag" onClick={() => removeTag(slug)}>
                    {name}
                </button>
            ));
        }
    };

    const choosePaymentMethod = (val) => {
        if (paymentPriceRef.current) {
            paymentPriceRef.current.value = 0
            setPaymentMethod(val)

            if(val == "Free" || val == "Gift"){
                paymentPriceRef.current.readOnly = true
            } else {
                paymentPriceRef.current.readOnly = false
            }
        }
    }

    const handleConsumeName = (slug) => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/detail/${slug}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({ status: res.status, result: result }))
        })
            .then(({ status, result }) => {
                if(status != 404){
                    const data = result.data
                    if (consumeNameRef.current) {
                        consumeNameRef.current.value = data.consume_name
                        setConsumeName(data.consume_name)
                    }
                    if (consumeProvideRef.current) {
                        consumeProvideRef.current.value = data.consume_detail[0].provide
                        setConsumeProvide(data.consume_detail[0].provide)
                    }
                    if (consumeMainIngRef.current) {
                        consumeMainIngRef.current.value = data.consume_detail[0].main_ing
                        setConsumeMainIng(data.consume_detail[0].main_ing)
                    }
                    if (consumeCalRef.current) {
                        consumeCalRef.current.value = data.consume_detail[0].calorie
                        setConsumeCal(data.consume_detail[0].calorie)
                    }
                    if (consumeFromRef.current) {
                        consumeFromRef.current.value = data.consume_from
                        setConsumeFrom(data.consume_from)
                    }
                    if (consumeTypeRef.current) {
                        consumeTypeRef.current.value = data.consume_type
                        setConsumeType(data.consume_type)
                    }
                    if (consumeCommentRef.current) {
                        consumeCommentRef.current.value = data.consume_comment
                        setConsumeComment(data.consume_comment)
                    }
                    if (paymentMethodRef.current) {
                        paymentMethodRef.current.value = data.payment[0].payment_method
                        setPaymentMethod(data.payment[0].payment_method)
                    }
                    if (paymentPriceRef.current) {
                        paymentPriceRef.current.value = data.payment[0].payment_price
                        setPaymentPrice(data.payment[0].payment_price)
                    }
                    const tags = data.consume_tag

                    tags.forEach((el,i) => {
                        setSelectedTag(selectedTag.concat(
                            <button key={i} className='btn btn-tag' value={{slug_name:el.slug_name, tag_name:el.tag_name}} title="Unselect this tag" onClick={() => removeTag(el.slug_name)}>
                                {el.tag_name}
                            </button>
                        ));
                    });

                    setExistingHistory(
                        data.payment != null ?
                            <div className='row mt-2 ps-1 mx-1 p-1 rounded mb-3' style={{border:"1.25px solid #DFE2E6"}}>
                                <div className='col'>
                                    <label className='text-secondary' style={{fontSize:"var(--textMD)"}}>Consume History</label>
                                    {
                                        data.payment.length > 0 ? 
                                            <ol>
                                                {
                                                    data.payment.map((dt, idxHs) => (
                                                        <li>At {convertDatetime(dt.created_at, 'calendar')} using {dt.payment_method} with ammount Rp. {numberToPrice(dt.payment_price)}</li>
                                                    ))
                                                }
                                            </ol>
                                        : 
                                            <p className='text-secondary fst-italic'>- No History Found -</p>
                                    }
                                </div>
                                <div className='col'>
                                    <label className='text-secondary' style={{fontSize:"var(--textMD)"}}>Schedule</label>
                                    {
                                        data.schedule.length > 0 ? 
                                            <ol>
                                                {
                                                    data.schedule.map((dt, idxHs) => (
                                                        <li>For {dt.schedule_time[0].day} {dt.schedule_time[0].category} at {dt.schedule_time[0].time}</li>
                                                    ))
                                                }
                                            </ol>
                                        : 
                                            <p className='text-secondary fst-italic'>- No Schedule Found -</p>
                                    }
                                </div>
                            </div>
                        : 
                            <></>
                    )
                } else {
                    setConsumeName(slug)
                }
            },
            (error) => { 
                if(getLocal(ctx + "_sess") !== undefined){
                    setItem(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setError(error)
                }
            }
        )
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
        return (
            <div className='container-fluid p-3'>
                <h2>Add Consume</h2>
                <h5>About Consume</h5>
                <div className="form-floating">
                    <input type="text" className="form-control" ref={consumeNameRef} onBlur={(e) => handleConsumeName(e.target.value)} list="consume_name_list"></input>
                    <label htmlFor="floatingInput">Name</label>
                </div>
                <GetExistedConsume ctx="existed_consume"/>
                <div className='row my-3'>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" ref={consumeProvideRef} onChange={(e) => setConsumeProvide(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Provide</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="datetime-local" className="form-control" onChange={(e) => setConsumeCreatedAt(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Consume At</label>
                        </div>
                    </div>
                </div>
                {existingHistory}
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" ref={consumeMainIngRef} onChange={(e) => setConsumeMainIng(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Main Ingredient</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="number" className="form-control" ref={consumeCalRef} onChange={(e) => setConsumeCal(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Calorie</label>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" ref={consumeFromRef} onChange={(e) => setConsumeFrom(e.target.value)} aria-label="Floating label select example">
                                <option value="GoFood">GoFood</option>
                                <option value="GrabFood">GrabFood</option>
                                <option value="ShopeeFood">ShopeeFood</option>
                                <option value="Dine-In">Dine-In</option>
                                <option value="Take Away">Take Away</option>
                                <option value="Cooking">Cooking</option>
                            </select>
                            <label htmlFor="floatingSelect">From</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" ref={consumeTypeRef} onChange={(e) => setConsumeType(e.target.value)} aria-label="Floating label select example">
                                <option value="Food">Food</option>
                                <option value="Drink">Drink</option>
                                <option value="Snack">Snack</option>
                            </select>
                            <label htmlFor="floatingSelect">Type</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mb-3">
                    <textarea className="form-control" style={{minHeight:"100px"}} ref={consumeCommentRef} onChange={(e) => setConsumeComment(e.target.value)} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                    <label htmlFor="floatingTextarea">Comments</label>
                </div>

                <h5>Tags</h5>
                {
                    item != null ? (
                        <div>
                            {
                                item.map((elmt, index) => (
                                    <button key={index} title="Select this tag" className='btn btn-tag' onClick={() => {
                                        if(selectedTag.length == 0){
                                            selectTag(index, elmt.tag_slug, elmt.tag_name)
                                        } else {
                                            let found = false
                                            selectedTag.map((slct, j, index) => {
                                                if(slct.props.value == elmt.tags_slug){
                                                    found = true
                                                }
                                            })
        
                                            if(!found){
                                                selectTag(index, elmt.tag_slug, elmt.tag_name)
                                            }
                                        }
                                    }} >{elmt.tag_name}</button>
                                ))
                            }
                        </div>
                    ) : (
                        <div></div> 
                    )
                }
                {
                    selectedTag.length > 0 ?
                    <div ref={selectedTag}>
                        <h5>Selected Tag</h5>
                        {selectedTag}
                    </div> 
                    : 
                    <></>
                }
                <h5>Payment</h5>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" ref={paymentMethodRef} onChange={(e) => choosePaymentMethod(e.target.value)} aria-label="Floating label select example">
                                <option value="GoPay">GoPay</option>
                                <option value="Ovo">Ovo</option>
                                <option value="Dana">Dana</option>
                                <option value="Link Aja">Link Aja</option>
                                <option value="MBanking">MBanking</option>
                                <option value="Cash">Cash</option>
                                <option value="Gift">Gift</option>
                                <option value="Free">Free</option>
                                <option value="Cuppon">Cuppon</option>
                            </select>
                            <label htmlFor="floatingSelect">Method</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="number" className="form-control" ref={paymentPriceRef} onChange={(e) => setPaymentPrice(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Price</label>
                        </div>
                    </div>
                </div>
                <button className='btn btn-success mt-3' ref={paymentMethodRef} onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk}/> {paymentMethod == "Gift" || paymentMethod == "Free" ? "Save Consume":"Save Consume & Payment"}</button>
            </div>
        )
    }
}
  