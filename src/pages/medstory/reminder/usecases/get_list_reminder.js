"use client"
import { faBell, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import Axios from 'axios'
import PostListReminder from './post_reminder'

export default function GetListReminder({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [items, setItems] = useState(null)
    const [resMsgAll, setResMsgAll] = useState([])
    
    const fetchReminders = () => {
        fetch(`http://127.0.0.1:8000/api/v1/reminder`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data) 
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    }

    useEffect(() => {
        fetchReminders();
    }, []);

    // Services
    const handleClick = async (method, id) => {
        try {
            let response

            if(method == 'delete'){            
                response = await Axios.delete(`http://127.0.0.1:8000/api/v1/reminder/rel/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                })
            } else if(method == 'post'){
                let data = {
                    reminder_id : id
                }
            
                response = await Axios.post("http://127.0.0.1:8000/api/v1/reminder/rel", JSON.stringify(data), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                })
            }
            
            if(response.status == 200){
                fetchReminders()
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
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
                text: "Something went wrong!"+error,
            })
            setResMsgAll(error)
        }
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
            <div className='row pt-2'>
                <h4>Reminder List</h4>
                <div className='row'>
                    <PostListReminder fetchReminders={fetchReminders}/>
                    {
                        items.map((dt, idx)=> {
                            return (
                                <div className='col-lg-6 col-md-6 col-sm-12'>
                                    <button className={dt.id_rel_reminder != null ? 'box-reminder active':'box-reminder'} onClick={dt.id_rel_reminder != null ? (e)=>handleClick('delete',dt.id_rel_reminder):(e)=>handleClick('post',dt.reminder_id)}
                                        title={dt.id_rel_reminder != null ? 'Turn off the reminder':'Turn on the reminder'}>
                                        <div style={{width:"40px"}} className="pt-2">
                                            <FontAwesomeIcon icon={faClock} style={{fontSize:"calc(var(--textJumbo)*1.5)"}}/>
                                        </div>
                                        <div className='w-100 ms-3'>
                                            <h6 className='mb-1'>{dt.reminder_name}</h6>
                                            <p className='mb-1'>{dt.reminder_body}</p>
                                            <hr className='my-2'></hr>
                                            <div className='context'>
                                                { dt.reminder_type } at
                                                {
                                                    dt.reminder_context != null ?
                                                        dt.reminder_context.map((ctx, cidx)=> {
                                                            return (
                                                                <button className='btn btn-primary rounded-pill ms-1 mb-2'>
                                                                    <FontAwesomeIcon icon={faBell}/> {ctx.time}
                                                                </button>
                                                            )
                                                        })
                                                    :
                                                        <p className='fst-italic text-secondary'>- Reminder not configured yet -</p>
                                                }
                                                {
                                                    dt.reminder_attachment != null ?
                                                        dt.reminder_attachment.map((ctx, cidx)=> {
                                                            return (
                                                                <button className='btn btn-success rounded-pill ms-1 mb-2'>
                                                                    <FontAwesomeIcon icon={ctx.attachment_type == 'location'?faLocationDot:""}/> {ctx.attachment_name}
                                                                </button>
                                                            )
                                                        })
                                                    :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
  