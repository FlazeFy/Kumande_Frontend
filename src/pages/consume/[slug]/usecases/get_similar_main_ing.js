"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'

//Font awesome classicon
import GetConsumeBox from '../../../../components/containers/consume_box'
import GetBreakLine from '../../../../components/others/breakline'
import { ucFirstWord } from '../../../../modules/helpers/converter'

export default function GetSimilarMainIng({ctx, main_ing, slug}) {
    //Initial variable
    ctx = `${ctx}_${main_ing}`
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/by/context/main_ing/${main_ing}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItems(result.data)
                }        
            },
            (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
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
        return (
            <div className='container p-3 mt-3'>
                <h5>Similar Main Ingredient <a className='btn btn-primary rounded-pill py-1 ms-1' style={{fontSize:"var(--textMD)"}}>{ucFirstWord(main_ing)}</a></h5>
                <GetBreakLine length={1}/>
                <div className='row'>
                    {
                        items.map((elmt, idx)=>{
                            if(elmt.slug_name != slug){
                                return (
                                    <div className='col-lg-4 col-md-6 col-sm-12'>
                                        <GetConsumeBox type="mini" items={elmt} func={(e)=> window.location.href ='/consume/'+elmt.slug_name}/>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
  