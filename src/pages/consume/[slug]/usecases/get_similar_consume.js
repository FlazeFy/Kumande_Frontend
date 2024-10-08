"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'

//Font awesome classicon
import { getCleanTitleFromCtx, ucFirstWord } from '../../../../modules/helpers/converter'
import { getMonthName } from '../../../../modules/helpers/generator'
import ComponentTextMessageNoData from '../../../../atoms/text_message_no_data'
import ComponentContainerConsume from '../../../../organisms/container_consume'
import ComponentAlertBox from '../../../../molecules/alert_box'

export default function GetSimilarConsume({ctx, consume_from, consume_type, provide, main_ing, month, year, slug}) {
    //Initial variable
    ctx = `${ctx}`
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = getLocal("token_key")

    const [itemsConsumeFrom, setItemsConsumeFrom] = useState([])
    const [itemsConsumeType, setItemsConsumeType] = useState([])
    const [itemsProvide, setItemsProvide] = useState([])
    const [itemsMainIng, setItemsMainIng] = useState([])
    const [itemsCreatedAt, setItemsCreatedAt] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/by/context/all/all`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 7,
                consume_from:consume_from,
                consume_type:consume_type,
                provide:provide,
                main_ing:main_ing,
                date:`${month}_${year}`, 
            })
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setError(null)
                if(result.data != null){
                    let item_consume_from = []
                    let item_consume_type = []
                    let item_provide = []
                    let item_main_ing = []
                    let item_created_at = []
                    
                    result.data.forEach(el => {
                        if(el.consume_from === consume_from && item_consume_from.length < 6){
                            item_consume_from.push(el)
                        } else if(el.consume_type === consume_type && item_consume_type.length < 6){
                            item_consume_type.push(el)
                        } else if(el.consume_detail[0].provide === provide && item_provide.length < 6){
                            item_provide.push(el)
                        } else if(el.consume_detail[0].main_ing === main_ing && item_main_ing.length < 6){
                            item_main_ing.push(el)
                        } else if(item_created_at.length < 6){
                            item_created_at.push(el)
                        }
                    });

                    setItemsConsumeFrom(item_consume_from)
                    setItemsConsumeType(item_consume_type)
                    setItemsCreatedAt(item_created_at)
                    setItemsMainIng(item_main_ing)
                    setItemsProvide(item_provide)
                }        
            },
            (error) => {
                setError(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        )
    },[consume_from, consume_type, main_ing, month, provide, token,year])

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
            <div className='container p-3 mt-3'>
                <h5>Similar Consume From <span className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{ucFirstWord(consume_from)}</span></h5>
                <div className='row'>
                    {
                        itemsConsumeFrom.length > 0 ?
                            itemsConsumeFrom.map((elmt, idx)=>{
                                if(elmt.slug_name !== slug){
                                    return (
                                        <div className='col-lg-4 col-md-6 col-sm-12' key={idx}>
                                            <ComponentContainerConsume type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                        </div>
                                    )
                                }
                                return null
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                </div>
                <h5>Similar Consume Type <span className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{ucFirstWord(consume_type)}</span></h5>
                <div className='row'>
                    {
                        itemsConsumeType.length > 0 ?
                            itemsConsumeType.map((elmt, idx)=>{
                                if(elmt.slug_name !== slug){
                                    return (
                                        <div className='col-lg-4 col-md-6 col-sm-12' key={idx}>
                                            <ComponentContainerConsume type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                        </div>
                                    )
                                }
                                return null
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                </div>
                <h5>Similar Provide <span className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{ucFirstWord(provide)}</span></h5>
                <div className='row'>
                    {
                        itemsProvide.length > 0 ?
                            itemsProvide.map((elmt, idx)=>{
                                if(elmt.slug_name !== slug){
                                    return (
                                        <div className='col-lg-4 col-md-6 col-sm-12' key={idx}>
                                            <ComponentContainerConsume type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                        </div>
                                    )
                                }
                                return null
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                </div>
                <h5>Similar Main Ingredient <span className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{ucFirstWord(main_ing)}</span></h5>
                <div className='row'>
                    {
                        itemsMainIng.length > 0 ?
                            itemsMainIng.map((elmt, idx)=>{
                                if(elmt.slug_name !== slug){
                                    return (
                                        <div className='col-lg-4 col-md-6 col-sm-12' key={idx}>
                                            <ComponentContainerConsume type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                        </div>
                                    )
                                }
                                return null
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                </div>
                <h5>Similar Date Created In<span className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{getMonthName(month)} {year}</span></h5>
                <div className='row'>
                    {
                        itemsCreatedAt.length > 0 ?
                            itemsCreatedAt.map((elmt, idx)=>{
                                if(elmt.slug_name !== slug){
                                    return (
                                        <div className='col-lg-4 col-md-6 col-sm-12' key={idx}>
                                            <ComponentContainerConsume type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                        </div>
                                    )
                                }
                                return null
                            })
                        :
                            <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                    }
                </div>
            </div>
        )
    }
}
  