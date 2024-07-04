"use client"
import { faBell, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef } from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'

export default function GetListReminder({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [items, setItems] = useState(null)
    const [resMsgAll, setResMsgAll] = useState([])
    
    useEffect(() => {
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
    },[])

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
                <h5>Reminder List</h5>
                <div className='row'>
                    {
                        items.map((dt, idx)=> {
                            return (
                                <div className='col-lg-6 col-md-6 col-sm-12'>
                                    <button className={dt.id_rel_reminder != null ? 'box-reminder active':'box-reminder'} 
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
                                                                    <FontAwesomeIcon icon={faBell}/> {ctx.attachment_name}
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
  