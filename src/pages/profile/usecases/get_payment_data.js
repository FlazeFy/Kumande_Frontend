import React from 'react'
import { useState, useEffect } from "react"
import ComponentProfileSummaryInfo from '../../../organisms/container_profile_summary'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'

export default function GetPaymentData({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const token = getLocal("token_key")

    const builder = [
        {
            "column_name":"Total Days",
            "object_name":"total_days",
            "extra_desc":null
        },
        {
            "column_name":"Total Payment",
            "object_name":"total_payment",
            "extra_desc":null
        }
    ]

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/count/payment`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItem(result.data)
                const item = result.data
                storeLocal(ctx + "_sess",JSON.stringify(item))             
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
        return <div><h2>{getCleanTitleFromCtx(ctx)}</h2> Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div> 
                <ComponentProfileSummaryInfo items={item} builder={builder} urlImg={'/icons/BudgetData.png'} title="Spending Info"/>
            </div>
        )
    }
}
  