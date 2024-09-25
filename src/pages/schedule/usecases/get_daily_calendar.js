"use client"
import React from 'react'
import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// Modules
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'
import { getLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'
import GetCalendarType from './get_calendar_type'

export default function GetDailyCalendar(props) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")
    const [month, setCurrentMonth] = useState(getTodayDate('month'))
    const [year, setCurrentYear] = useState(getTodayDate('year'))
    const event = []

    const getUrl = (type, month, year) => {
        if(type === 'daily_total_spending'){
            return `http://127.0.0.1:8000/api/v1/payment/total/month/${month}/year/${year}`
        } else if (type === 'daily_total_calorie'){
            return `http://127.0.0.1:8000/api/v1/consume/total/day/cal/month/${month}/year/${year}`
        } else if (type === 'daily_all_consume'){
            return ``
        }
    }

    useEffect(() => {
        fetchCalendar()
    }, [props.ctx,month, year])

    const fetchCalendar = () => {
        fetch(getUrl(props.ctx, month, year), {
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
                if(getLocal(props.ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(props.ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    }

    const handleMonthChange = (info) => {
        setCurrentMonth(info.view.currentStart.getMonth() + 1)
        setCurrentYear(info.view.currentStart.getFullYear())
    }

    const fixNumber = (val) => {
        if(val < 10){
            return '0'+val
        } else {
            return val
        }
    }

    const getUnit = (total, type) => {
        if(type === 'daily_total_spending'){
            return `Rp. ${total}`
        } else if (type === 'daily_total_calorie'){
            return total + ` cal`
        } else if (type === 'daily_all_consume'){
            return ``
        }
    }

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(props.ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        if(items){
            items.forEach((el)=> {
                event.push(
                    { 
                        title: getUnit(el['total'],props.ctx), 
                        date: `${year}-${fixNumber(month)}-${fixNumber(el['context'])}` 
                    }
                )
            })
        }
        
        return (
            <div>
                <h3 className='m-2 text-primary'>{getCleanTitleFromCtx(ucFirstWord(props.ctx))}</h3>
                <GetCalendarType onchange={props.onchange}/>
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    initialView="dayGridMonth"
                    events={event}
                    datesSet={handleMonthChange}
                />
            </div>
        )
    }
}
  