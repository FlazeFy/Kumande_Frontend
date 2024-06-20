"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { numberToPrice, ucFirstWord } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'

import { getLocal } from '../../../modules/storages/local'

export default function GetAnalyticPaymentMonth({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    const mon = getTodayDate('month')
    const yr =  getTodayDate('year')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/analytic/payment/month/'+mon+'/year/'+yr, {
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
            <div className='container-fluid p-0' style={{background:"var(--primaryColor)"}}>
                <h3 className='m-2 text-white'>{ucFirstWord(ctx)}</h3>
                <div className='row'>
                    <div className='col-lg-3 col-md-3 col-sm-6 pe-0'>
                        <div className='container bg-white p-2 d-flex justify-content-start'>
                            <div style={{color:"var(--warningBG)"}}>
                                <h5 className='mb-0'>Total</h5>
                                <h2 className='mb-0'>Rp. {numberToPrice(item[0]['total'])}</h2>
                                <a className='text-secondary' style={{fontSize:"var(--textMD)", fontWeight:"500"}}>this month</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 px-0'>
                        <div className='container bg-white p-2 d-flex justify-content-start'>
                            <div style={{color:"var(--successBG)"}}>
                                <h5 className='mb-0'>Average</h5>
                                <h2 className='mb-0'>Rp. {numberToPrice(item[0]['average'])}</h2>
                                <a className='text-secondary' style={{fontSize:"var(--textMD)", fontWeight:"500"}}>/ day</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 px-0'>
                        <div className='container bg-white p-2 d-flex justify-content-start'>
                            <div style={{color:"var(--dangerBG)"}}>
                                <h5 className='mb-0'>Max</h5>
                                <h2 className='mb-0'>Rp. {numberToPrice(item[0]['max'])}</h2>
                                <a className='text-secondary' style={{fontSize:"var(--textMD)", fontWeight:"500"}}>/ day</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 ps-0'>
                        <div className='container bg-white p-2 d-flex justify-content-start'>
                            <div style={{color:"var(--infoBG)"}}>
                                <h5 className='mb-0'>Min</h5>
                                <h2 className='mb-0'>Rp. {numberToPrice(item[0]['min'])}</h2>
                                <a className='text-secondary' style={{fontSize:"var(--textMD)", fontWeight:"500"}}>/ day</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
  