import React, { useEffect, useState } from 'react'
import MultiRangeSlider from "multi-range-slider-react"
import { getLocal, storeLocal } from '../../../modules/storages/local'
import { isMobile } from '../../../modules/helpers/validator'

export default function FilterConsumeCal({ctx}) {
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
                    setMaxValue(result.data[0].max_calorie)
                    setMinValue(result.data[0].min_calorie)

                    if(getLocal("Table_filter_"+ctx) === undefined){
                        setSelectMaxValue(result.data[0].max_calorie)
                        setSelectMinValue(result.data[0].min_calorie)
                    }
                    storeLocal(ctx + "_sess", JSON.stringify(result))
                }        
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    const temp = JSON.parse(getLocal(ctx + "_sess"))
                    setMaxValue(temp.data[0].max_calorie)
                    setMinValue(temp.data[0].min_calorie)
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )

        if(getLocal("Table_filter_"+ctx) !== undefined){
            const search = getLocal("Table_filter_"+ctx).split("-")
            setSelectMaxValue(search[1])
            setSelectMinValue(search[0])
            setIsLoaded(true)
        }
    },[])
   

    const handleInput = (e) => {
        let minVal = 0 
        if (!isNaN(e.minValue)){
            minVal = e.minValue 
        }
        const maxVal = e.maxValue

        storeLocal("Table_filter_"+ctx,minVal+"-"+maxVal)
        window.location.reload()
    }
    
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
            <div className={is_mobile ?'W-100 p-2 rounded mb-2':'w-50 p-2 rounded'} style={{border:"1px solid #DFE2E6"}}>
                <label className='text-secondary'>Calorie</label>
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
  
