import React, { useEffect, useState } from 'react'
import MultiRangeSlider from "multi-range-slider-react"
import { getLocal, storeLocal } from '../../../modules/storages/local'
import { isMobile } from '../../../modules/helpers/validator'
import ComponentAlertBox from '../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

export default function FilterConsumeCal(props) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(1000)
    const [selectMinValue, setSelectMinValue] = useState(0)
    const [selectMaxValue, setSelectMaxValue] = useState(1000)
    const token = getLocal("token_key")
    const is_mobile = isMobile()
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/calorie/maxmin`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setMaxValue(result.data.max_calorie)
                    setMinValue(result.data.min_calorie)

                    if(getLocal("Table_filter_"+props.ctx) === undefined){
                        setSelectMaxValue(result.data.max_calorie)
                        setSelectMinValue(result.data.min_calorie)
                    }
                    storeLocal(props.ctx + "_sess", JSON.stringify(result))
                }        
            },
            (error) => {
                if(getLocal(props.ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    const temp = JSON.parse(getLocal(props.ctx + "_sess"))
                    setMaxValue(temp.data.max_calorie)
                    setMinValue(temp.data.min_calorie)
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )

        if(getLocal("Table_filter_"+props.ctx) !== undefined){
            const search = getLocal("Table_filter_"+props.ctx).split("-")
            setSelectMaxValue(search[1])
            setSelectMinValue(search[0])
            setIsLoaded(true)
        }
    },[token,props.ctx])
   

    const handleInput = (e) => {
        let minVal = 0 
        if (!isNaN(e.minValue)){
            minVal = e.minValue 
        }
        const maxVal = e.maxValue

        storeLocal("Table_filter_"+props.ctx,minVal+"-"+maxVal)
        props.onchange()
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
        return (
            <div className={is_mobile ?'W-100 p-2 rounded mb-2':'w-50 p-2 rounded'} style={{border:"1px solid #DFE2E6"}}>
                <h6 className='text-secondary'>Calorie</h6>
                <MultiRangeSlider
                    min={minValue}
                    max={maxValue}
                    style={{width:"100%", boxShadow:"none", border:"none"}}
                    step={5}
                    minValue={selectMinValue}
                    maxValue={selectMaxValue}
                    onChange={(e) => {
                        handleInput(e)
                    }}
                />
            </div>
        )
    }
}
  
