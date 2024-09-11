import React from 'react'
import { useState, useEffect } from "react"

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'
import ComponentLineChart from '../../../molecules/line_chart'

export default function GetTotalSpending({ctx, filter_name}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")
    const yr =  getTodayDate('year')

    useEffect(() => {
        //Default config
        const keyLimit = sessionStorage.getItem(`Line_limit_${filter_name}`)
        if(keyLimit == null){
            sessionStorage.setItem(`Line_limit_${filter_name}`, 5);
        }

        fetch(`http://127.0.0.1:8000/api/v1/payment/total/month/`+yr, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data)
                const item = result.data
                storeLocal(ctx + "_sess",JSON.stringify(item))             
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
        return (
            <div className='container shadow p-3'> 
                <h2>{getCleanTitleFromCtx(ctx)}</h2>
                <ComponentLineChart items={items} filter_name={null}/>
            </div>
        )
    }
}
  