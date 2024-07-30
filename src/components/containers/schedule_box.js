"use client"
import React from 'react'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import { ucFirstChar } from '../../modules/helpers/converter'
import { isMobile } from '../../modules/helpers/validator'

export default function GetScheduleBox({items,time}) {
    let total = 0 
    
    // Initial Variable
    const is_mobile = isMobile()

    return (
        <div className='container bg-white p-2 d-flex justify-content-start'>
            {
                is_mobile ?
                    <></>
                :
                    <div>
                        <img className='img-icon-lg' src={'/icons/'+ucFirstChar(time)+'.png'}/>
                    </div>
            }
            <div>
                <h5 className='text-primary'>
                    {
                        is_mobile ?
                            <img className='img-icon-md' src={'/icons/'+ucFirstChar(time)+'.png'}/>
                        :
                            <></>
                    }
                    {ucFirstChar(time)}
                </h5>
                {
                    items.map((data, i, idx) => {
                        if(data['schedule_time'][0]['category'] == ucFirstChar(time)){
                            total++
                            return (
                                <a style={{marginRight:"var(--spaceXSM)"}}>
                                    {
                                        data['consume_type'] == 'Food' ?
                                            <FontAwesomeIcon icon={faBowlRice} className='me-1' style={{color:"var(--primaryColor)"}}/>
                                        : data['consume_type'] == 'Drink' ?
                                            <FontAwesomeIcon icon={faMugSaucer} className='me-1' style={{color:"var(--primaryColor)"}}/>
                                        : data['consume_type'] == 'Snack' ?
                                            <FontAwesomeIcon icon={faCake} className='me-1' style={{color:"var(--primaryColor)"}}/>
                                        : 
                                            <></>
                                    }
                                    {ucFirstChar(data['schedule_consume'])}
                                </a>
                            )
                        }
                    })
                }
                {
                    total === 0 ?
                        <a className='text-secondary'>No Schedule for today</a>
                    : 
                        <></>
                }
            </div>
        </div>
    )
}
  