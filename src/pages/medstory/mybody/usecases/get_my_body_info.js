"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import ComponentRadialChart from '../../../../molecules/radial_chart'
import { convertDatetime, getCleanTitleFromCtx, ucFirstWord } from '../../../../modules/helpers/converter'
import GetManageBody from './get_manage_body'
import Swal from 'sweetalert2'
import Axios from 'axios'
import GetDataTable from '../../../../modules/templates/get_data_table'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentTextMessageNoData from '../../../../atoms/text_message_no_data'
import ComponentBreakLine from '../../../../atoms/breakline'
import ComponentAlertBox from '../../../../molecules/alert_box'

export default function GetMyBodyInfo({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")
    const [items, setItems] = useState(null)

    // Analyze
    const [itemsBloodPreasure, setItemsBloodPreasure] = useState(null)
    const [summaryBloodPreasure,setSummaryBloodPreasure] = useState(null)
    const [itemsBloodGlucose, setItemsBloodGlucose] = useState(null)
    const [summaryBloodGlucose,setSummaryBloodGlucose] = useState(null)
    const [summaryCalorieAll, setSummaryCalorieAll] = useState(null)
    const [summaryGout, setSummaryGout] = useState(null)
    const [itemsGout, setGeneralGout] = useState(null)
    
    const fetchBodyInfo = () => {
        return fetch(`http://127.0.0.1:8000/api/v1/user/body_info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json().then(result => ({status: res.status, result: result})))
        .then(({status, result}) => {
            setIsLoaded(true)
    
            if (status === 200) {
                setItems(result.data)
                return result.data
            } else {
                setItems(null)
                throw new Error('Failed to fetch body info')
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Call the Admin!',
                icon: 'error',
            });
    
            if (getLocal(ctx + "_sess") !== undefined) {
                const sessionData = JSON.parse(getLocal(ctx + "_sess"))
                setIsLoaded(true)
                setItems(sessionData)
                return sessionData
            } else {
                setIsLoaded(true)
                setError(error)
                throw error
            }
        })
    }

    const fetchAnalyze = async (blood_pressure, blood_glucose, calorie, height, weight, gout) => {
        const formatDate = (date) => {
            const d = new Date(date)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        };
        
        const dateNow = formatDate(new Date())

        try {
            const data = {
                blood_pressure: blood_pressure,
                blood_glucose: blood_glucose,
                calorie:calorie,
                height:height,
                weight:weight,
                date:dateNow,
                gout:gout
            }
            let response = await Axios.post("http://127.0.0.1:9000/api/v1/analyze/consume_data/consume_body_relation", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Custom-Header': '157c5f24-8f7f-11ee-b9d1-0242ac120002'
                }
            })
            
            if(response.status == 200){
                setItemsBloodPreasure(response.data.general_analyze_blood_preasure)
                setSummaryBloodPreasure(response.data.summary_analyze_blood_preasure)
                setItemsBloodGlucose(response.data.general_analyze_blood_glucose)
                setSummaryBloodGlucose(response.data.summary_analyze_blood_glucose)
                setSummaryCalorieAll(response.data.summary_all_calorie)
                setSummaryGout(response.data.summary_analyze_gout)
                setGeneralGout(response.data.general_analyze_gout)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
        }
    }

    useEffect(() => {
        fetchBodyInfo()
            .then(bodyInfo => {
                const blood_pressure = bodyInfo.blood_pressure
                const blood_glucose = bodyInfo.blood_glucose
                const calorieDaily = bodyInfo.result
                const height = bodyInfo.height
                const weight = bodyInfo.weight
                const gout = bodyInfo.gout

                return fetchAnalyze(blood_pressure, blood_glucose, calorieDaily, height, weight, gout)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);
    
    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
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

        const columnsBloodPreasure = [
            { name: 'Consume Name', selector: row => ucFirstWord(row.consume_name), sortable: true },
            { name: 'Calorie', selector: row => `${row.calorie} Cal`, sortable: true },
            { name: 'Sodium / 100 g', selector: row => `${row.sodium} mg`, sortable: true },
            { name: 'Status', selector: row => 
                <div className={
                    row.sodium_status == 'Very Low' ? 'bgd-primary rounded-pill text-center text-white py-2 px-3' :
                    row.sodium_status == 'Low' ? 'bgd-success rounded-pill text-center text-white py-2 px-3' :
                    row.sodium_status == 'Moderate' ? 'bgd-warning rounded-pill text-center text-white py-2 px-3' : 
                    'bgd-danger rounded-pill text-center text-white py-2 px-3'
                }>{row.sodium_status}</div>, 
                sortable: true 
            },
        ];
        const columnsBloodGlucose = [
            { name: 'Consume Name', selector: row => ucFirstWord(row.consume_name), sortable: true },
            { name: 'Calorie', selector: row => `${row.calorie} Cal`, sortable: true },
            { name: 'Sugar / 100 g', selector: row => `${row.sugar} g`, sortable: true },
            { name: 'Sugar Status', selector: row => 
                <div className={
                    row.sugar_status == 'Very Low' ? 'bgd-primary rounded-pill text-center text-white py-2 px-3' :
                    row.sugar_status == 'Low' ? 'bgd-success rounded-pill text-center text-white py-2 px-3' :
                    row.sugar_status == 'Moderate' ? 'bgd-warning rounded-pill text-center text-white py-2 px-3' : 
                    'bgd-danger rounded-pill text-center text-white py-2 px-3'
                }>{row.sugar_status}</div>, 
                sortable: true 
            },
            { name: 'Carbohydrates / 100 g', selector: row => `${row.carbohydrate} g`, sortable: true },
            { name: 'Carbohydrates Status', selector: row => 
                <div className={
                    row.carbohydrate_status == 'Very Low' ? 'bgd-primary rounded-pill text-center text-white py-2 px-3' :
                    row.carbohydrate_status == 'Low' ? 'bgd-success rounded-pill text-center text-white py-2 px-3' :
                    row.carbohydrate_status == 'Moderate' ? 'bgd-warning rounded-pill text-center text-white py-2 px-3' : 
                    'bgd-danger rounded-pill text-center text-white py-2 px-3'
                }>{row.carbohydrate_status}</div>, 
                sortable: true 
            },
            { name: 'Dietary Fiber / 100 g', selector: row => `${row.dietary_fiber} g`, sortable: true },
            { name: 'Dietary Fiber Status', selector: row => 
                <div className={
                    row.dietary_fiber_status == 'Very Low' ? 'bgd-primary rounded-pill text-center text-white py-2 px-3' :
                    row.dietary_fiber_status == 'Low' ? 'bgd-success rounded-pill text-center text-white py-2 px-3' :
                    row.dietary_fiber_status == 'Moderate' ? 'bgd-warning rounded-pill text-center text-white py-2 px-3' : 
                    'bgd-danger rounded-pill text-center text-white py-2 px-3'
                }>{row.dietary_fiber_status}</div>, 
                sortable: true 
            },
        ];
        const columnsGout = [
            { name: 'Consume Name', selector: row => ucFirstWord(row.consume_name), sortable: true },
            { name: 'Calorie', selector: row => `${row.calorie} Cal`, sortable: true },
            { name: 'Saturated Fats / 100 g', selector: row => `${row.saturated_fats} g`, sortable: true },
            { name: 'Status', selector: row => 
                <div className={
                    row.saturated_fats_status == 'Very Low' ? 'bgd-primary rounded-pill text-center text-white py-2 px-3' :
                    row.saturated_fats_status == 'Low' ? 'bgd-success rounded-pill text-center text-white py-2 px-3' :
                    row.saturated_fats_status == 'Moderate' ? 'bgd-warning rounded-pill text-center text-white py-2 px-3' : 
                    'bgd-danger rounded-pill text-center text-white py-2 px-3'
                }>{row.saturated_fats_status}</div>, 
                sortable: true 
            },
        ];

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
                        <button className={'box-reminder warning'} title='Configure the setting'>
                            <div style={{width:"40px"}} className="pt-2">
                                <FontAwesomeIcon icon={faTriangleExclamation} style={{fontSize:"calc(var(--textJumbo)*1.5)"}}/>
                            </div>
                            <div className='w-100 ms-3'>
                                <p>{summaryCalorieAll}</p>
                            </div>
                        </button>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{minHeight:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Blood Preasure</h4>
                                    {
                                        items ?
                                            <>
                                                <ComponentRadialChart custom={
                                                    {
                                                        type:'half',
                                                        extra_desc: '',
                                                        value: [systolic,diastolic]
                                                    }
                                                } val={[systolic - 70, diastolic - 40]} label={[`Systolic (${systolic_status})`,`Diastolic (${diastolic_status})`]}/>
                                                {
                                                    !summaryBloodPreasure ? 
                                                        <span className='text-secondary text-center fst-italic'>- No Summary -</span>
                                                    :
                                                        <>
                                                            <ComponentBreakLine length={1}/>
                                                            <h5>Summary</h5>
                                                            <p>{summaryBloodPreasure}</p>
                                                        </>
                                                }
                                            </>
                                        :   
                                        <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                    {
                                        itemsBloodPreasure ?
                                            <GetDataTable data={itemsBloodPreasure} columns={columnsBloodPreasure} />
                                        : 
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4' style={{minHeight:"36vh"}}>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Glucose</h4>
                                    {
                                        items.blood_glucose > 0 ?
                                            <>
                                                <ComponentRadialChart custom={
                                                    {
                                                        type:'half',
                                                        extra_desc: '',
                                                        value: items.blood_glucose+' mg/dL'
                                                    }
                                                } val={(items.blood_glucose - 70) / (126 - 70) * 100} label={glucose_status}/>
                                                {
                                                    !summaryBloodGlucose ? 
                                                        <span className='text-secondary text-center fst-italic'>- No Summary -</span>
                                                    :
                                                        <>
                                                            <ComponentBreakLine length={1}/>
                                                            <h5>Summary</h5>
                                                            <p>{summaryBloodGlucose}</p>
                                                        </>
                                                }
                                            </>
                                        :   
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                    {
                                        itemsBloodGlucose ?
                                            <GetDataTable data={itemsBloodGlucose} columns={columnsBloodGlucose} />
                                        : 
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='shadow rounded py-3 px-4 mb-4'>
                            <div className='row w-100'>
                                <div className='col-lg-4'>
                                    <h4 className='mb-0'>Gout</h4>
                                    {
                                        items.gout > 0 ?
                                        <>
                                            <ComponentRadialChart custom={
                                                    {
                                                        type:'half',
                                                        extra_desc: '',
                                                        value: items.gout+' mg/dL'
                                                    }
                                                } val={(items.gout - bottom_gout) / (top_gout - bottom_gout) * 100} label={gout_status}/>
                                            {
                                                !summaryGout ? 
                                                    <span className='text-secondary text-center fst-italic'>- No Summary -</span>
                                                :
                                                    <>
                                                        <ComponentBreakLine length={1}/>
                                                        <h5>Summary</h5>
                                                        <p>{summaryGout}</p>
                                                    </>
                                            }
                                        </>
                                        :   
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
                                </div>
                                <div className='col-lg-8'>
                                    <h4 className='mb-0'>Analyze</h4>
                                    {
                                        itemsGout ?
                                            <GetDataTable data={itemsGout} columns={columnsGout} />
                                        : 
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                                    }
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
                                            <ComponentRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.cholesterol+' mg/dL'
                                                }
                                            } val={(items.cholesterol - 120) / (240 - 120) * 100} label={cholesterol_status}/>
                                        :   
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
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
                                        <   ComponentRadialChart custom={
                                                {
                                                    type:'half',
                                                    extra_desc: '',
                                                    value: items.bmi
                                                }
                                            } val={(items.bmi - 18.5) / (35.0 - 18.5) * 100} label={bmi_status}/>
                                        :   
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
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