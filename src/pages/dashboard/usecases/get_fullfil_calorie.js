"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getTodayDate } from '../../../modules/helpers/generator'
import Swal from 'sweetalert2'
import { getLocal } from '../../../modules/storages/local'

// Molecules
import ComponentButtonContentImg from '../../../molecules/button_content_img'
import ComponentAlertBox from '../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

export default function GetFullfilCalorie({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    const date = getTodayDate('yyyy-MM-dd')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/count/calorie/fulfill/'+date, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItem(result.data)        
            },
            (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItem(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[ctx, date, token])

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return <div id='today-calorie-holder'>
                <ComponentButtonContentImg button_title="Today Calories" icon_url='/icons/Calorie.png' button_content={
                <h4 id="today_calories"><b>{item[0]['total']}</b> / {item[0]['target']} Cal</h4>
            }/>
        </div>
    }
}
  