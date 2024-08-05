"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getTodayDate } from '../../../modules/helpers/generator'
import Swal from 'sweetalert2'
import { getLocal } from '../../../modules/storages/local'

// Molecules
import ComponentButtonContentImg from '../../../molecules/button_content_img'

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
        return <ComponentButtonContentImg button_title="Today Calories" icon_url='/icons/Calorie.png' button_content={
            <h4><b>{item[0]['total']}</b> / {item[0]['target']}</h4>
        }/>
    }
}
  