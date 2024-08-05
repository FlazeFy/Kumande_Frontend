"use client"
import React, { useRef } from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GetListStarted from './get_list_started'
import { faBowlRice, faCake, faMugSaucer, faXmark } from '@fortawesome/free-solid-svg-icons'
import { convertDatetime } from '../../../modules/helpers/converter'
import ManageList from './manage_list'
import ComponentTextMessageNoData from '../../../atoms/text_message_no_data'

export default function GetListDashboard({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState([])


    const [listData, setListData] = useState(null)

    // Ref
    const listDataRef = useRef(null)

    const handleListData = (id) => {
        setListData(id)
    }
    
    useEffect(() => {
        fetchData()
    },[])

    const fetchData = async () => {
        fetch(`http://127.0.0.1:8000/api/v1/list/limit/20/order/desc`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({status:res.status, result:result}))
        }).then(({status, result}) => {
            setIsLoaded(true)

            if(status == 200){
                setItems(result.data.data) 
            } else {
                setItems(null)
            }
        }).catch(error=> {
            if(getLocal(ctx + "_sess") !== undefined){
                setIsLoaded(true)
                setItems(JSON.parse(getLocal(ctx + "_sess")))
            } else {
                setIsLoaded(true)
                setError(error)
            }
        })
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
                {
                    items != null ?
                        <>
                            {
                                items.map((dt, idx) => {
                                    return(
                                        <div className='col-lg-6 col-md-6 col-sm-12 py-2 px-3'>
                                            <button className='btn container p-3 text-start shadow' data-bs-toggle="modal" data-bs-target={"#listConsumeModal"} onClick={(e) => handleListData(dt.id)}>
                                                <div className='row'>
                                                    <div className='col'>
                                                        <h4 className='mb-0' style={{fontSize:"var(--textJumbo)"}}>{dt.list_name}</h4>
                                                        <a className='text-secondary fst-italic' style={{fontSize:"var(--textXMD)"}}>Created at {convertDatetime(dt.created_at,'calendar')}</a>
                                                    </div>
                                                    <div className='col'>
                                                        <h6 className='mb-0'>Description</h6>
                                                        {
                                                            dt.list_desc ?
                                                                <p>{dt.list_desc}</p>
                                                            :
                                                                <ComponentTextMessageNoData message="No Description Provided"/>
                                                        }
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <h6>Tags</h6>
                                                {
                                                    dt.list_tag != null ?
                                                        dt.list_tag.map((tag, tidx) => {
                                                            return (
                                                                <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>{tag.tag_name}</a>
                                                            )
                                                        })
                                                    :   
                                                        <ComponentTextMessageNoData message="No tag provided"/>
                                                }
                                                <hr></hr>
                                                <h6>List Consume</h6>
                                                {
                                                    dt.consume != null ?
                                                        dt.consume.map((csm, cidx) => {
                                                            return (
                                                                <button className='btn btn-primary px-3 py-2 me-1 mb-2 text-start' style={{fontSize:"var(--textXMD)"}}>
                                                                    <div className='mb-1'>
                                                                        {
                                                                            csm.consume_type == 'Food' ?
                                                                                <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                                                                            : csm.consume_type == 'Drink' ?
                                                                                <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                                                                            : csm.consume_type == 'Snack' ?
                                                                                <FontAwesomeIcon icon={faCake} className='me-2'/>
                                                                            : 
                                                                                <></>
                                                                        }
                                                                        {csm.consume_name}
                                                                    </div>
                                                                    <div>
                                                                        <a className='btn btn-danger p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{csm.consume_from}</a>
                                                                        <a className='btn btn-success p-1 rounded-pill px-2 me-2' style={{fontSize:"var(--textMD)"}}>{csm.provide}</a>
                                                                        <a className='btn btn-warning p-1 rounded-pill px-2' style={{fontSize:"var(--textMD)"}}>{csm.calorie} Cal</a>
                                                                    </div>
                                                                </button>
                                                            )
                                                        })
                                                    :   
                                                        <a className='fst-italic text-secondary'>- No Consume Attached -</a>
                                                }
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </>
                    : 
                        <GetListStarted ctx="list_started"/>
                }
                {items && <ManageList id={listData} ref={listDataRef} fetchData={fetchData}/>}
            </div>
        )
    }
}
  