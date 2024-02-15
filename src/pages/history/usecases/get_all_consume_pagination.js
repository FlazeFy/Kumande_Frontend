"use client"
import React from 'react'
import { useState, useEffect } from "react"
import GetConsumeBox from '../../../components/containers/consume_box'
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'

import { getLocal, storeLocal } from '../../../modules/storages/local'
import FilterOrderConsume from './filter_order_consume'

export default function GetAllConsumePagination({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now

    useEffect(() => {
        //Default config
        const keyPage = sessionStorage.getItem("Table_"+ctx)
        const keyOrder = getLocal("Table_order_"+ctx)

        if(keyPage === null){
            sessionStorage.setItem("Table_"+ctx, "1")
        }
        if(keyOrder === null){
            storeLocal("Table_order_"+ctx,"ASC")
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/limit/10/order/${keyOrder}/favorite/0/type/All/provide/all?page=${keyPage}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data.data)        
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
            <div>
                <div className='d-block mx-auto' style={{width:"1080px"}}>
                    <h3 className='m-2 text-primary'>{getCleanTitleFromCtx(ucFirstWord(ctx))}</h3>
                    <FilterOrderConsume/>
                    {
                        items.map((elmt, idx) => {
                            return (
                                <GetConsumeBox items={elmt}/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
  