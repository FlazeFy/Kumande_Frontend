"use client"
import React from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import GetRadialChart from '../../../components/charts/radial_chart'
import { numberToPrice } from '../../../modules/helpers/converter'

export default function GetBudgetDashboard({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = getLocal("token_key")
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/budget/dashboard`, {
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
                {
                    items.map((dt, idx) => {
                        const percentage = (dt.payment_history.total_price / dt.budget_total * 100).toFixed(0)
                        const remain = dt.budget_total - dt.payment_history.total_price 

                        return(
                            <div className='col-lg-3 col-md-4 col-sm-12'>
                                <button className='btn container p-3 text-center shadow' title={'See history payment in '+dt.month+' '+dt.year}>
                                    <h4 className='mb-0'>Budget in {dt.month} {dt.year}</h4>
                                    <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>
                                        {dt.payment_history.total_item === 0 ? (
                                            <span className='fst-italic'>- No Payment Found -</span>
                                        ) : (
                                            <>
                                                <b>{dt.payment_history.total_item}</b> payments with an average of <b>{'Rp. '+numberToPrice(dt.payment_history.average_payment)}</b>
                                            </>
                                        )}
                                    </p>                                    
                                    <GetRadialChart val={percentage > 100 ? 100 : percentage} label={percentage > 100 ? 'Overload!' : 'Rp. '+numberToPrice(remain)}/>
                                    <hr></hr>
                                    <div className='row'>
                                        <div className='col'>
                                            <h6 className='mb-0'>Budget</h6>
                                            <p className='mb-0'>Rp. {numberToPrice(dt.budget_total)}</p>
                                        </div>
                                        <div className='col'>
                                            <h6 className='mb-0'>Spending</h6>
                                            <p className='mb-0'>Rp. {numberToPrice(dt.payment_history.total_price)}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
  