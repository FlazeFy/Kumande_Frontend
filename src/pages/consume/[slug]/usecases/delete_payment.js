"use client"
import React from 'react'
import Axios from 'axios'
import Swal from 'sweetalert2'

import ComponentButton from '../../../../atoms/button'
import { getLocal } from '../../../../modules/storages/local'

export default function DeletePayment(props) {
    //Initial variable
    const token = getLocal("token_key")

    // Services
    const handleSubmit = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will also impact on your budget analyze",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let response = await Axios.delete(`http://127.0.0.1:8000/api/v1/payment/delete/${id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    })
                    
                    if(response.status === 200){
                        Swal.fire({
                            title: "Success!",
                            text: response.data.message,
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop) {
                                props.fetchConsume()
                            }
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
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Delete payment dismissed",
                    icon: "error"
                })
            }
        })
    }

    return <ComponentButton onclick={(e)=>handleSubmit(props.id)} button_name='Delete' button_type='danger'/>
}