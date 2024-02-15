"use client"
import React from 'react'
import { useState, useEffect } from "react"
import GetConsumeBox from '../../../components/containers/consume_box'
import { ucFirstWord } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'

import { getLocal } from '../../../modules/storages/local'

export default function GetAllConsumePagination({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now

    useEffect(() => {
        //Default config
        const keyPage = sessionStorage.getItem("Table_"+ctx)
        const keyOrder = sessionStorage.getItem("Table_order_"+ctx)

        if(keyPage == null){
            sessionStorage.setItem("Table_"+ctx, "1")
        }
        if(keyOrder == null){
            sessionStorage.setItem("Table_order_"+ctx, "asc")
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
                <div className='d-block mx-auto' style={{width:"720px"}}>
                    <h3 className='m-2 text-primary'>{ucFirstWord(ctx)}</h3>
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
  