"use client"
import React from 'react'
import Axios from 'axios'
import { useState } from 'react'
import Swal from 'sweetalert2'

// Component
import { storeLocal } from '../../../modules/storages/local'
import { getStringValJson } from '../../../modules/helpers/generator'
import ComponentForm from '../../../organisms/container_form'

export default function PostLogin() {
    //Initial variable
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [resMsgEmail, setResMsgEmail] = useState("")
    const [resMsgPassword, setResMsgPassword] = useState("")
    const [resMsgAll, setResMsgAll] = useState("")

    const builder = [
        {
            type: 'text',
            id:'email-input',
            class: 'form-control',
            label: 'Email',
            placeholder: 'Type email',
            is_required: true,
            is_obsecure: false,
            max: 36,
            handleChange: (event) => {
                setEmail(event.target.value)
            },
            errorMsg: resMsgEmail
        },
        {
            type: 'text',
            id:'pass-input',
            class: 'form-control',
            label: 'Password',
            placeholder: 'Type password',
            is_required: true,
            is_obsecure: true,
            max: 36,
            handleChange: (event) => {
                setPassword(event.target.value)
            },
            errorMsg: resMsgPassword
        },
        {
            type: 'submit',
            class: 'btn btn-success rounded-pill',
            id:'submit-btn',
            label: 'Submit',
            placeholder: null,
            toogle_disabled: false,
            handleClick: (event) => {
                handleSubmit(event)
            },
            errorMsg: resMsgAll
        }
    ]

    // Services
    const handleSubmit = async (e) => {
        try {
            const data = new FormData();
            data.append('email', email);
            data.append('password', password);
            
            const response = await Axios.post("http://127.0.0.1:8000/api/v1/login", data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            if(response.status === 200){
                storeLocal('token_key', response.data.token)
                window.location.href = '/dashboard'
            }
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status
                
                if(statusCode === 401 || statusCode === 422){
                    let msg = ''
                    if(statusCode === 401){
                        msg = error.response.data.message
                    } else {
                        msg = getStringValJson(error.response.data.result)
                    }

                    Swal.fire({
                        title: 'Error!',
                        text: msg,
                        icon: 'error',
                    });
                    setResMsgAll(error.response.message)
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: `Error: ${error.message}`,
                    icon: 'error',
                });
                
                setResMsgAll(`Error: ${error.message}`)
            }
            setResMsgAll(error)
        }
    }

    return (
        <div className='login-box grid-border' style={{width:"720px", display:"block", marginInline:"auto"}}> 
            <div className='row'>
                <div className='col text-white'>
                    <h4 className=''>Make food scheduling, analyze it, tracking, and choose your meals for tommorow</h4>
                    <ComponentForm type={"single-line"} props={builder} />
                </div>
                <div className='col'>
                    <img src="/icons/Consume.png" style={{maxWidth:"50%", minWidth:"300px"}} className="img img-fluid mb-3"/>
                </div>
            </div>
        </div>
    )
}