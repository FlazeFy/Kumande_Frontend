"use client"
import React, { useRef } from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import GetListStarted from './get_list_started'
import ManageList from './manage_list'
import ComponentContainerTag from '../../../molecules/container_tag'
import ComponentContainerConsumeList from '../../../organisms/container_consume_list'
import ComponentContainerDescription from '../../../molecules/container_description'
import ComponentTextProps from '../../../molecules/text_props'
import ComponentAlertBox from '../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

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

            if(status === 200){
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
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
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
                                        <div className='col-lg-6 col-md-6 col-sm-12 py-2 px-3' key={`list_dashboard_${idx}`}>
                                            <button className='btn container p-3 text-start shadow' data-bs-toggle="modal" data-bs-target={"#listConsumeModal"} onClick={(e) => handleListData(dt.id)}>
                                                <div className='row'>
                                                    <div className='col'>
                                                        <ComponentTextProps props_type="created at" props_title={dt.list_name} props_content={dt.created_at}/>
                                                    </div>
                                                    <div className='col'>
                                                        <ComponentContainerDescription container_title="Description" container_body={dt.list_desc}/>
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <ComponentContainerTag container_title="Tags" list_tag={dt.list_tag}/>
                                                <hr></hr>
                                                <ComponentContainerConsumeList container_title="List Consume" list_consume={dt.consume}/>
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
  