"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getCleanTitleFromCtx, ucFirstWord, convertDatetime } from '../../../modules/helpers/converter'

import { getLocal, storeLocal } from '../../../modules/storages/local'
import FilterConsumeCal from './filter_consume_cal'
import FilterConsumeLimit from './filter_consume_limit'
import FilterConsumeTag from './filter_consume_tag'
import FilterConsumeType from './filter_consume_type'
import FilterIsFavoriteConsume from './filter_is_favorite'
import FilterOrderConsume from './filter_order_consume'
import { isMobile } from '../../../modules/helpers/validator'
import ComponentContainerConsume from '../../../organisms/container_consume'
import ComponentTextMessageNoData from '../../../atoms/text_message_no_data'

export default function GetAllConsumePagination({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")
    const is_mobile = isMobile()

    //Default config
    const keyOrder = getLocal("Table_order_"+ctx)
    const keyFav = getLocal("Table_filter_favorite_"+ctx)
    const keyType = getLocal("Table_filter_type_"+ctx)
    const keyLimit = getLocal("Table_limit_"+ctx)
    const keyCalorie = getLocal("Table_filter_max_min_cal")
    const [consumeMaxPage,setConsumeMaxPage] = useState(1)
    const [consumeCurrPage,setConsumeCurrPage] = useState(1)

    const fetchConsume = (page) => {
        if(keyOrder === null){
            storeLocal("Table_order_"+ctx,"DESC")
        }
        if(keyFav === null){
            storeLocal("Table_filter_favorite_"+ctx,"all")
        }
        if(keyType === null){
            storeLocal("Table_filter_type_"+ctx,"all")
        }
        if(keyLimit === null){
            storeLocal("Table_limit_"+ctx,"10")
        }
        if(keyCalorie === null){
            storeLocal("Table_filter_max_min_cal","all")
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/limit/${keyLimit}/order/${keyOrder}/favorite/${keyFav}/type/${keyType}/provide/all/calorie/${keyCalorie}?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItems(result.data.data)
                    setConsumeCurrPage(result.data.current_page)
                    setConsumeMaxPage(result.data.last_page)
                }        
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
    }


    useEffect(() => {
        fetchConsume();
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
        let date_before = ''
        
        return (
            <div>
                <div className='d-block mx-auto'>
                    <h3 className='m-2 text-primary'>{getCleanTitleFromCtx(ucFirstWord(ctx))}</h3>
                    <div className={is_mobile ? 'row' : "d-flex justify-content-start"}>
                        <div className={is_mobile ? 'col-6' : ''}>
                            <FilterOrderConsume/>
                        </div>
                        <div className={is_mobile ? 'col-6' : ''}>
                            <FilterIsFavoriteConsume/>
                        </div>
                        <div className={is_mobile ? 'col-6' : ''}>
                            <FilterConsumeType/>
                        </div>
                        <div className={is_mobile ? 'col-6' : ''}>
                            <FilterConsumeLimit/>
                        </div>
                    </div>
                    <div className={is_mobile ? 'row' : "d-flex justify-content-start mb-3"}>
                        <FilterConsumeCal ctx="max_min_cal"/>
                        <FilterConsumeTag ctx="consume_tag"/>
                    </div>
                    {
                        items.length > 0 ?
                            items.map((elmt, idx) => {
                                const curr_date = convertDatetime(elmt.created_at,'calendar').substring(0,11)

                                if(date_before == "" || date_before != curr_date){
                                    date_before = curr_date
                                    return (
                                        <div key ={idx}>
                                            <div className='text-center'>
                                                <h6 style={{fontSize:"var(--textMD)"}} className='bgd-primary text-white p-2 mb-3 rounded d-inline-block mx-auto'>{curr_date}</h6>
                                            </div>
                                            <ComponentContainerConsume items={elmt} type="header"/>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <ComponentContainerConsume key ={idx} items={elmt} type="header"/>
                                    )
                                }
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={true} url={'/icons/Consume.png'} message="No Consume Found"/>
                    }
                    {
                        items && consumeMaxPage > 0 ? 
                            <div className='d-flex justify-content-start'>
                                {
                                    Array.from({ length: consumeMaxPage }, (v, i) => (
                                        <button key={'page_'+i} onClick={() => fetchConsume(i+1)} className={consumeCurrPage == i+1 ? 'btn btn-page active':'btn btn-page'}>{i+1}</button>
                                    ))
                                }
                            </div>
                        :
                            <></>
                    }
                </div>
            </div>
        )
    }
}
  