"use client"
import React from 'react'
import { useState, useEffect } from "react"
import GetConsumeBox from '../../../components/containers/consume_box'
import GetAnimaText from '../../../components/messages/anima_text'
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'

import { getLocal, storeLocal } from '../../../modules/storages/local'
import FilterConsumeLimit from './filter_consume_limit'
import FilterConsumeType from './filter_consume_type'
import FilterIsFavoriteConsume from './filter_is_favorite'
import FilterOrderConsume from './filter_order_consume'

export default function GetAllConsumePagination({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now

    useEffect(() => {
        //Default config
        const keyPage = sessionStorage.getItem("Table_"+ctx)
        const keyOrder = getLocal("Table_order_"+ctx)
        const keyFav = getLocal("Table_filter_favorite_"+ctx)
        const keyType = getLocal("Table_filter_type_"+ctx)
        const keyLimit = getLocal("Table_limit_"+ctx)

        if(keyPage === null){
            sessionStorage.setItem("Table_"+ctx, "1")
        }
        if(keyOrder === null){
            storeLocal("Table_order_"+ctx,"ASC")
        }
        if(keyFav === null){
            storeLocal("Table_filter_favorite_"+ctx,"all")
        }
        if(keyType === null){
            storeLocal("Table_filter_type_"+ctx,"all")
        }
        if(keyLimit === null){
            storeLocal("Table_limit_"+ctx,"10")
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/limit/${keyLimit}/order/${keyOrder}/favorite/${keyFav}/type/${keyType}/provide/all?page=${keyPage}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItems(result.data.data)
                }        
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
                    <div className="d-flex justify-content-start">
                        <FilterOrderConsume/>
                        <FilterIsFavoriteConsume/>
                        <FilterConsumeType/>
                        <FilterConsumeLimit/>
                    </div>
                    {
                        items.length > 0 ?
                            items.map((elmt, idx) => {
                                return (
                                    <GetConsumeBox items={elmt}/>
                                )
                            })
                        :
                            <GetAnimaText ctx="No Consume Found" url={'/icons/Consume.png'}/>
                    }
                </div>
            </div>
        )
    }
}
  