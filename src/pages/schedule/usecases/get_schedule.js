"use client"
import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import useSound from 'use-sound'
import audioUrl from '../../../../public/digital-alarm-2-151919.mp3'

// Modules
import { getLocal } from '../../../modules/storages/local'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake,  faHeart, faMugSaucer} from "@fortawesome/free-solid-svg-icons"
import ComponentTextIcon from '../../../atoms/text_icon'

export default function GetSchedule({ctx, day, category}) {
    //Initial variable
    const [playSound, { stop }] = useSound(audioUrl)
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/schedule/day/`+day, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                let item = []
                result.data.forEach(el => {
                    if(el.schedule_time[0].category == category){
                        item.push(el)
                    }
                });
                setItems(item)        
            },
            (error) => {   
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    }, [playSound]);

    // Services
    const removeConsume = (id, consume_name, e) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Want to remove ${consume_name} from schedule?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await Axios.delete("http://127.0.0.1:8000/api/v1/schedule/delete/"+id, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if(response.status == 200){
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your consume has been removed!",
                            icon: "success"
                        });
                        window.location.reload(false)
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
        });
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
            <div className='d-flex justify-content-start mb-2'>
                {
                    items.length > 0     ? (
                        <div>
                        <h5 className='text-start'>Assigned Consume</h5>
                        {
                            items.map((elmt) => (
                                <button key={elmt.id} className='btn btn-tag-removed' data-bs-dismiss="modal" title='Click to remove from schedule' onClick={(e)=>removeConsume(elmt.id, elmt.schedule_consume)}>
                                    <div className='d-flex justify-content-between mb-1'>
                                        <div>
                                        {elmt.is_favorite == 1 ? (
                                            <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite'/>
                                        ) : (
                                            <></>
                                        )}
                                        <ComponentTextIcon text_style={{fontWeight:500,fontSize:"var(--textLG)"}} text_type={elmt.consume_type} body={elmt.schedule_consumee}/>
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                        </div>
                    ) : (
                        <></>
                    )
                }
            </div>
        );
    }
}
  