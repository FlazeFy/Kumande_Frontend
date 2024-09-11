"use client"
import React from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import ComponentAlertBox from '../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

export default function GetExistedConsume({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/list/select`, {
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
            <datalist id="consume_name_list">
                {
                    item ?
                        item.map((elmt, index) => (
                            <option value={elmt.slug_name}>{elmt.consume_name}</option>
                        ))
                    :
                        <></>
                }
            </datalist>
        )
    }
}
  