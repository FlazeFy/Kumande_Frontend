import React from 'react'
import { useState, useEffect } from "react"

// Component
import GetPieChart from '../../../components/charts/pie_chart'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'

export default function GetMostConsumeMainIng({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now
    const filter_name = "consume_type"

    useEffect(() => {
        //Default config
        const keyLimit = sessionStorage.getItem(`Pie_limit_${filter_name}`)
        if(keyLimit == null){
            sessionStorage.setItem(`Pie_limit_${filter_name}`, 5);
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/total/bymain`, {
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
                <GetPieChart items={items} filter_name={null}/>  
            </div>
        )
    }
}
  