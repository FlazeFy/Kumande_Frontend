"use client"
import React, { useRef } from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import Axios from 'axios'

//Font awesome classicon
import { faEdit, faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getLocal } from '../../../../modules/storages/local'
import DeletePayment from './delete_payment'

export default function ManagePayment(props) {
    //Initial variable
    const token = getLocal("token_key")

    // Form
    const [paymentMethod, setPaymentMethod] = useState(props.dt.payment_method)
    const [paymentPrice, setPaymentPrice] = useState(props.dt.payment_price)

    // Ref
    const paymentMethodRef = useRef(null)
    const paymentPriceRef = useRef(null)

    useEffect(() => {
        paymentPriceRef.current.value = props.dt.payment_price
        paymentMethodRef.current.value = props.dt.payment_method
    }, [props.dt.payment_price, props.dt.payment_method])

    const handleModalOpen = () => {
        paymentPriceRef.current.value = props.dt.payment_price
        paymentMethodRef.current.value = props.dt.payment_method
        setPaymentMethod(props.dt.payment_method)
        setPaymentPrice(props.dt.payment_price)
    }

    const handleUpdate = async () => {
        const data = {
            payment_method: paymentMethod,
            payment_price: paymentPrice,
        }

        try {
            const response = await Axios.put(`http://127.0.0.1:8000/api/v1/payment/update/${props.dt.id_payment}`, JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status === 200){
                props.fetchConsume()
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

    const choosePaymentMethod = (val) => {
        if (paymentPriceRef.current) {
            paymentPriceRef.current.value = 0
            setPaymentMethod(val)

            if (val === "Free" || val === "Gift") {
                paymentPriceRef.current.readOnly = true
            } else {
                paymentPriceRef.current.readOnly = false
            }
        }
    }

    return (
        <>
            <button className='btn btn-warning' data-bs-toggle="modal" data-bs-target={`#editPayment_${props.dt.id}`} onClick={handleModalOpen}> <FontAwesomeIcon icon={faEdit} title='Edit Payment'/></button>
            <div className="modal fade" id={`editPayment_${props.dt.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Manage Payment</h5>
                            <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                        </div>
                        <div className="modal-body text-start p-4">
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
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" ref={paymentPriceRef} onChange={(e) => setPaymentPrice(e.target.value)} id="floatingInput"/>
                                <label htmlFor="floatingInput">Price</label>
                            </div>
                            <button className='w-100 btn btn-success mt-2 py-2' data-bs-dismiss="modal" onClick={handleUpdate}><FontAwesomeIcon icon={faFloppyDisk} /> Save Changes</button>
                            <hr></hr>
                            <DeletePayment id={props.dt.id_payment} fetchConsume={props.fetchConsume}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}