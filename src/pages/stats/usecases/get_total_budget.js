import React from 'react'
import { useState, useEffect } from "react"
import GetLineChart from '../../../components/charts/line_chart'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'

export default function GetTotalBudget({ctx, filter_name}) {
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

        fetch(`http://127.0.0.1:8000/api/v1/budget/by/`+yr, {
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
        return <div><h2>{getCleanTitleFromCtx(ctx)}</h2> Error: {error.message}</div>
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
                <GetLineChart items={items} filter_name={null}/>
            </div>
        )
    }
}
  