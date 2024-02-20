"use client"
import React from 'react'
import { useState, useEffect } from "react"

// Modules
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'
import { getLocal } from '../../../modules/storages/local'

// Components
import { getAllDay } from '../../../modules/helpers/generator'

export default function GetMySchedule({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")
    const days = getAllDay()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/schedule`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data)        
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
        let i = 0
        return (
            <div>
                <h3 className='m-2 text-primary'>{getCleanTitleFromCtx(ucFirstWord(ctx))}</h3>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Day</th>
                            <th scope="col"><img className='img-icon-lg' src={'/icons/Breakfast.png'}/></th>
                            <th scope="col"><img className='img-icon-lg' src={'/icons/Lunch.png'}/></th>
                            <th scope="col"><img className='img-icon-lg' src={'/icons/Dinner.png'}/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            days.map((dy, idx) => {
                                let found = false
                                i++

                                return (
                                    <tr key={idx}>
                                        <td className={ i == 1 ? 'bg-success-light':''}>{dy}</td>
                                        {
                                            items.map((item, index) => {
                                                if (!found) {
                                                    if (item['day'] === dy.slice(0, 3)) {
                                                        found = true
                                                        return (
                                                            <>
                                                                <td className={ i == 1 ? 'bg-success-light':''}>
                                                                    {
                                                                        item['time'] === 'Breakfast' ? 
                                                                            <a>{item['schedule_consume']}</a> 
                                                                        : 
                                                                            <>-</>
                                                                    }
                                                                </td>
                                                                <td className={ i == 1 ? 'bg-success-light':''}>
                                                                    {
                                                                        item['time'] === 'Lunch' ? 
                                                                            <a>{item['schedule_consume']}</a> 
                                                                        : 
                                                                            <>-</>
                                                                    }
                                                                </td>
                                                                <td className={ i == 1 ? 'bg-success-light':''}>
                                                                    {
                                                                        item['time'] === 'Dinner' ? 
                                                                            <a>{item['schedule_consume']}</a> 
                                                                        : 
                                                                            <>-</>
                                                                    }
                                                                </td>
                                                            </>
                                                        );
                                                    }
                                                }
                                                return null
                                            })
                                        }
                                        {
                                            !found ?
                                                <>
                                                    <td className={ i == 1 ? 'bg-success-light':''}></td>
                                                    <td className={ i == 1 ? 'bg-success-light':''}></td>
                                                    <td className={ i == 1 ? 'bg-success-light':''}></td>
                                                </>
                                            :
                                                <></>
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
  