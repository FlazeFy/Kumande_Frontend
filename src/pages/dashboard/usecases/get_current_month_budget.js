"use client"
import React from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import ComponentRadialChart from '../../../molecules/radial_chart'
import { getCleanTitleFromCtx, numberToPrice } from '../../../modules/helpers/converter'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetCurrentMonthBudget({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const [totalAll, setTotalAll] = useState(0)
    const token = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState([])
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des']
    const now = new Date()
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/budget/dashboard`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: now.getFullYear(),
                month: months[now.getMonth()]
            })
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data) 
                setTotalAll(result.total_all)
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
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        let totalCoveredPayment = 0
        let largetBudget = 0
        let smallesBudget = 0
        
        let currentYear = now.getFullYear() - 1
        let years = []
        for (let i = 0; i < 6; i++) {
            years.push(currentYear + i)
        }

        return (
            <div>
                {
                    items != null ?
                        items.map((dt, idx) => {
                            const percentage = (dt.payment_history.total_price / dt.budget_total * 100).toFixed(0)
                            const remain = dt.budget_total - dt.payment_history.total_price 
                            totalCoveredPayment = totalCoveredPayment + dt.payment_history.total_price
                            if(dt.budget_total > largetBudget){
                                largetBudget = dt.budget_total
                            }
                            if(smallesBudget === 0 || dt.budget_total < smallesBudget){
                                smallesBudget = dt.budget_total
                            }

                            return(
                                <div key={`month_budget_${idx}`}>
                                    <button className='container p-3 text-center bg-white'>
                                        <h4 className='mb-0 budget-plan-title'>Budget in {dt.month} {dt.year}</h4>
                                        <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>
                                            {dt.payment_history.total_item === 0 ? (
                                                <span className='fst-italic'>- No Payment Found -</span>
                                            ) : (
                                                <>
                                                    <b>{dt.payment_history.total_item}</b> payments with an average of <b>{'Rp. '+numberToPrice(dt.payment_history.average_payment)}</b>
                                                </>
                                            )}
                                        </p>                                    
                                        <ComponentRadialChart val={percentage > 100 ? 100 : percentage} label={percentage > 100 ? 'Overload!' : 'Rp. '+numberToPrice(remain)}/>
                                        <hr></hr>
                                        <div className='row'>
                                            <div className='col'>
                                                <h6 className='mb-0'>Budget</h6>
                                                <p className='mb-0 budget-text'>Rp. {numberToPrice(dt.budget_total)}</p>
                                            </div>
                                            <div className='col'>
                                                <h6 className='mb-0'>Spending</h6>
                                                <p className='mb-0 spending-text'>Rp. {numberToPrice(dt.payment_history.total_price)}</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )
                        })
                    : 
                        <></>
                }
            </div>
        )
    }
}
  