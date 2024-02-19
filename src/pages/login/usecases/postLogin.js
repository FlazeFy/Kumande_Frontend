"use client"
import React from 'react'
import Axios from 'axios'
import { useState } from 'react'

// Component
import GetFormTemplate from '../../../components/containers/form'
import { storeLocal } from '../../../modules/storages/local'

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
            class: 'form-control',
            label: 'Email',
            placeholder: 'Type email',
            is_required: true,
            is_obsecure: false,
            maxLength: 36,
            handleChange: (event) => {
                setEmail(event.target.value)
            },
            errorMsg: resMsgEmail
        },
        {
            type: 'text',
            class: 'form-control',
            label: 'Password',
            placeholder: 'Type password',
            is_required: true,
            is_obsecure: true,
            maxLength: 36,
            handleChange: (event) => {
                setPassword(event.target.value)
            },
            errorMsg: resMsgPassword
        },
        {
            type: 'submit',
            class: 'btn btn-success rounded-pill',
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
            if(response.status != 200){
                window.location.reload(false)
                return response.data.message
            } else {
                const data = response.data.data
                storeLocal('token_key', data.token)
                window.location.href = '/'
            }
        } catch (error) {
            setResMsgAll(error)
        }
    }

    return (
        <div className='login-box grid-border' style={{width:"720px", display:"block", marginInline:"auto"}}> 
            <div className='row'>
                <div className='col'>
                    <h4 className='text-white'>Make food scheduling, analyze it, tracking, and choose your meals for tommorow</h4>
                    <GetFormTemplate type={"single-line"} props={builder} />
                </div>
                <div className='col'>
                    <img src="/icons/Consume.png" style={{maxWidth:"50%", minWidth:"300px"}} className="img img-fluid mb-3"/>
                </div>
            </div>
        </div>
    )
}