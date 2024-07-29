"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import GetRadialChart from '../../../../components/charts/radial_chart'
import { convertDatetime } from '../../../../modules/helpers/converter'
import GetManageBody from './get_manage_body'
import Swal from 'sweetalert2'

export default function GetMyBodyInfo({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [items, setItems] = useState(null)
    
    const fetchBodyInfo = () => {
        fetch(`http://127.0.0.1:8000/api/v1/user/body_info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({status:res.status, result:result}))
        }).then(({status, result}) => {
            setIsLoaded(true)

            if(status == 200){
                setItems(result.data) 
            } else {
                setItems(null)
            }
        }).catch(error=> {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Call the Admin!',
                icon: 'error',
            })
            if(getLocal(ctx + "_sess") !== undefined){
                setIsLoaded(true)
                setItems(JSON.parse(getLocal(ctx + "_sess")))
            } else {
                setIsLoaded(true)
                setError(error)
            }
        })
    }

    useEffect(() => {
        fetchBodyInfo()
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        let bmi_status
        let glucose_status
        let gout_status
        let cholesterol_status
        let top_gout
        let bottom_gout
        let systolic_status
        let diastolic_status
        let systolic
        let diastolic

        if(items){
            // BMI Status (Source : CDC)
            bmi_status = items.bmi >= 30.0 ? 'Obesity' : 
                items.bmi >= 25.0 ? 'Overweight':
                items.bmi >= 18.5 ? 'Healthy Weight':
                'Underweight'

            // Glucose Status : Fasting (Source : CDC)
            glucose_status = items.blood_glucose >= 126 ? 'Diabetes' :
                items.blood_glucose >= 100 ? 'Prediabetes' :
                items.blood_glucose >= 70 ? 'Normal' :
                'Low'

            // Gout Status : Fasting (Source : https://www.medicalnewstoday.com/articles/uric-acid-level)
            gout_status = 
            items.gender == 'male' ?
                items.gout > 7.0 ? 'High' :
                    items.gout >= 2.5 ? 'Normal' :
                    'Low'
            : items.gender == 'female' ?
                items.gout > 6.0 ? 'High' :
                items.gout >= 1.5 ? 'Normal' :
                'Low' : ''

            // Total Cholesterol Status (Source : https://www.healthline.com/health/high-cholesterol/levels-by-age#adults)
            // by gender
            cholesterol_status = items.cholesterol >= 240 ? 'High' :
                items.cholesterol >= 200 ? 'Pre-High' :
                items.cholesterol >= 120 ? 'Normal' :
                'Low'

            top_gout = items.gender == 'male' ? 7.0 : 6.0
            bottom_gout = items.gender == 'male' ? 2.5 : 1.5

            // Blood Preasure (Source : https://www.health.harvard.edu/heart-health/reading-the-new-blood-pressure-guidelines)
            const blood_pressure_split = items.blood_pressure.split('/')
            systolic = blood_pressure_split[0]
            diastolic = blood_pressure_split[1]

            systolic_status = systolic > 140 ? 'High' :
                systolic > 120 ? 'Pre-High' :
                systolic > 90 ? 'Normal' : 'Low'

            diastolic_status = diastolic > 90 ? 'High' :
                diastolic > 80 ? 'Pre-High' :
                diastolic > 60 ? 'Normal' : 'Low'
        }

        return (
            <div className='row pt-2'>
                <div className='d-flex justify-content-between mb-2'>
                    <div>
                        <h4 className='mb-0'>My Body Info</h4>
                        <p className='text-secondary text-end mb-3 pe-5' style={{fontSize:"var(--textMD)"}}>Last Updated at {items ? convertDatetime(items.created_at,'calendar'):''}</p>
                    </div>
                    <GetManageBody ctx={"manage_body"}/>
                </div>
                <div className='row text-center px-3'>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{height:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Blood Preasure</h4>
                                    {
                                        items ?
                                            <GetRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: [systolic,diastolic]
                                                }
                                            } val={[systolic - 70, diastolic - 40]} label={[`Systolic (${systolic_status})`,`Diastolic (${diastolic_status})`]}/>
                                        :   
                                        <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{height:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Glucose</h4>
                                    {
                                        items.blood_glucose > 0 ?
                                            <GetRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.blood_glucose+' mg/dL'
                                                }
                                            } val={(items.blood_glucose - 70) / (126 - 70) * 100} label={glucose_status}/>
                                        :   
                                            <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{height:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Gout</h4>
                                    {
                                        items.gout > 0 ?
                                            <GetRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.gout+' mg/dL'
                                                }
                                            } val={(items.gout - bottom_gout) / (top_gout - bottom_gout) * 100} label={gout_status}/>
                                        :   
                                            <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{height:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Cholesterol</h4>
                                    {
                                        items.cholesterol > 0 ?
                                            <GetRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.cholesterol+' mg/dL'
                                                }
                                            } val={(items.cholesterol - 120) / (240 - 120) * 100} label={cholesterol_status}/>
                                        :   
                                            <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{height:"40vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Body Mass Index (BMI)</h4>
                                    {
                                        items.bmi ?
                                        <   GetRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.bmi
                                                }
                                            } val={(items.bmi - 18.5) / (35.0 - 18.5) * 100} label={bmi_status}/>
                                        :   
                                            <p className='text-secondary text-center fst-italic'>- No Data Found -</p>
                                    }
                                    <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>Last Updated at {items ? convertDatetime(items.calorie_updated,'calendar'):''}</p>
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}