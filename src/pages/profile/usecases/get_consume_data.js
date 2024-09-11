import React from 'react'
import { useState, useEffect } from "react"
import ComponentProfileSummaryInfo from '../../../organisms/container_profile_summary'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetConsumeData({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/total/bytype`, {
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
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div> 
                <ComponentProfileSummaryInfo items={item} builder={null} urlImg={'/icons/ConsumeData.png'} title="Consume Total"/>
            </div>
        )
    }
}
  