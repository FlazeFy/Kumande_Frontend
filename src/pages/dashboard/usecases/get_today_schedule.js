"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { ucFirstWord } from '../../../modules/helpers/converter'

import { getLocal } from '../../../modules/storages/local'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import GetScheduleBox from '../../../components/containers/schedule_box'
import { getTodayDayName } from '../../../modules/helpers/generator'

export default function GetTodaySchedule({ctx,slug}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = '285|BMsYhez6WDc3YKXCOWxXxIL3dp5cEDuRshUHczUu' // for now
    const day = getTodayDayName()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/schedule/day/`+day, {
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
            <div className='container-fluid p-0' style={{background:"var(--primaryColor)"}}>
                <h3 className='m-2 text-white'>{ucFirstWord(ctx)}</h3>
                <div className='row'>
                    <div className='col-lg-4 col-md-4 col-sm-6 pe-0'>
                        <GetScheduleBox time="breakfast" items={items} />
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-6 px-0'>
                        <GetScheduleBox time="lunch" items={items} />
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-6 ps-0'>
                        <GetScheduleBox time="dinner" items={items} />
                    </div>
                </div>
            </div>
        )
    }
}
  