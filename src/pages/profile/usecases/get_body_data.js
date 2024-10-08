import React from 'react'
import { useState, useEffect } from "react"
import ComponentProfileSummaryInfo from '../../../organisms/container_profile_summary'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetBodyData({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")

    const builder = [
        {
            "column_name":"Weight",
            "object_name":"weight",
            "extra_desc":"Kg"
        },
        {
            "column_name":"Height",
            "object_name":"height",
            "extra_desc":"Cm"
        },
        {
            "column_name":"Calories / Day",
            "object_name":"result",
            "extra_desc":"Cal"
        }
    ]

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/count/calorie`, {
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
    },[ctx,token])

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
                <ComponentProfileSummaryInfo items={item} builder={builder} urlImg={'/icons/BodyData.png'} title="Body Info"/>
            </div>
        )
    }
}
  