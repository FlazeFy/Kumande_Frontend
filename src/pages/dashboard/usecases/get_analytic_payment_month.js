"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'
import { getTodayDate } from '../../../modules/helpers/generator'
import { isMobile } from '../../../modules/helpers/validator'
import Swal from 'sweetalert2'
import { getLocal } from '../../../modules/storages/local'
import ComponentButtonPrice from '../../../molecules/button_price'
import ComponentText from '../../../atoms/text'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetAnalyticPaymentMonth({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const token = getLocal("token_key")
    const mon = getTodayDate('month')
    const yr =  getTodayDate('year')
    const is_mobile = isMobile()

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/analytic/payment/month/'+mon+'/year/'+yr, {
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
    },[ctx, mon, token, yr])

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
            <div className='container-fluid p-0' style={{background:"var(--primaryColor)"}}>
                <ComponentText text_type="main_heading" body={<span className='text-white m-2'>{ucFirstWord(ctx)}</span>} />
                <div className='row' id='category-analytic-holder'>
                    <div className={`col-lg-3 col-md-3 col-sm-6 col-6 pe-0`}>
                        <ComponentButtonPrice styles={"var(--warningBG)"} button_title="Total" button_price={item[0]['total']} button_caption="this month"/>
                    </div>
                    <div className={`col-lg-3 col-md-3 col-sm-6 col-6 ${is_mobile ? 'ps-0' : 'px-0'}`}>
                        <ComponentButtonPrice styles={"var(--successBG)"} button_title="Average" button_price={item[0]['average']} button_caption="/ day"/>
                    </div>
                    <div className={`col-lg-3 col-md-3 col-sm-6 col-6 ${is_mobile ? 'pe-0' : 'px-0'}`}>
                        <ComponentButtonPrice styles={"var(--dangerBG)"} button_title="Max" button_price={item[0]['max']} button_caption="/ day"/>
                    </div>
                    <div className={`col-lg-3 col-md-3 col-sm-6 col-6 ps-0`}>
                        <ComponentButtonPrice styles={"var(--infoBG)"} button_title="Min" button_price={item[0]['min']} button_caption="/ day"/>
                    </div>
                </div>
            </div>
        )
    }
}
  