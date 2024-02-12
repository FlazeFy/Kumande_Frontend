"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { ucFirstWord } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'

import { getLocal } from '../../../modules/storages/local'

export default function GetFullfilCalorie({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now
    const date = getTodayDate('yyyy-MM-dd')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/count/calorie/fulfill/'+date, {
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
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container p-2 d-flex justify-content-start text-white' style={{backgroundImage: "linear-gradient(to right, var(--primaryColor) , var(--primaryLightBG))"}}>
                <div>
                    <img className='img-icon-lg' src={'/icons/Calorie.png'}/>
                </div>
                <div className='pt-2 ps-3'>
                    <h5>{ucFirstWord(ctx)}</h5>
                    <h4><b>{item[0]['total']}</b> / {item[0]['target']}</h4>
                </div>
            </div>
        )
    }
}
  