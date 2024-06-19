"use client"
import Axios from 'axios'
import React from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { add_firestore } from '../../../modules/firebase/command'

export default function PostConsume() {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    const ctx = 'tag_opt'
    const [selectedTag, setSelectedTag] = useState([])
    const [resMsgAll, setResMsgAll] = useState([])

    // Form
    const [consumeName, setConsumeName] = useState("")
    const [consumeProvide, setConsumeProvide] = useState("")
    const [consumeMainIng, setConsumeMainIng] = useState("")
    const [consumeCal, setConsumeCal] = useState(0)
    const [consumeFrom, setConsumeFrom] = useState("")
    const [consumeType, setConsumeType] = useState("")
    const [consumeComment, setConsumeComment] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentPrice, setPaymentPrice] = useState(0)

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
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" onChange={(e) => setConsumeName(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Name</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" onChange={(e) => setConsumeProvide(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Provide</label>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" onChange={(e) => setConsumeMainIng(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Main Ingredient</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="number" className="form-control" onChange={(e) => setConsumeCal(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Calorie</label>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" onChange={(e) => setConsumeFrom(e.target.value)} aria-label="Floating label select example">
                                <option value="GoFood">GoFood</option>
                                <option value="GrabFood">GrabFood</option>
                                <option value="ShopeeFood">ShopeeFood</option>
                                <option value="Dine-In">Dine-In</option>
                                <option value="Take Away">Take Away</option>
                            </select>
                            <label htmlFor="floatingSelect">From</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" onChange={(e) => setConsumeType(e.target.value)} aria-label="Floating label select example">
                                <option value="Food">Food</option>
                                <option value="Drink">Drink</option>
                                <option value="Snack">Snack</option>
                            </select>
                            <label htmlFor="floatingSelect">Type</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mb-3">
                    <textarea className="form-control" style={{minHeight:"100px"}} onChange={(e) => setConsumeComment(e.target.value)} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
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
                    <div>
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
                            <select className="form-select" id="floatingSelect" onChange={(e) => setPaymentMethod(e.target.value)} aria-label="Floating label select example">
                                <option value="GoPay">GoPay</option>
                                <option value="Ovo">Ovo</option>
                                <option value="Dana">Dana</option>
                                <option value="Link Aja">Link Aja</option>
                                <option value="MBanking">MBanking</option>
                                <option value="Cash">Cash</option>
                                <option value="Gift">Gift</option>
                                <option value="Cuppon">Cuppon</option>
                            </select>
                            <label htmlFor="floatingSelect">Method</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="number" className="form-control" onChange={(e) => setPaymentPrice(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Price</label>
                        </div>
                    </div>
                </div>
                <button className='btn btn-success mt-3' onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk}/> Save</button>
            </div>
        )
    }
}
  