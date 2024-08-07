"use client"
import React from 'react'
import { ucFirstChar } from '../modules/helpers/converter'
import { isMobile } from '../modules/helpers/validator'
import ComponentText from '../atoms/text'
import ComponentTextMessageNoData from '../atoms/text_message_no_data'
import ComponentTextIcon from '../atoms/text_icon'

export default function ComponentContainerSchedule({items,time}) {
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
                <ComponentText text_type="sub_heading" body={
                    <>
                    {
                        is_mobile ?
                            <img className='img-icon-md' src={'/icons/'+ucFirstChar(time)+'.png'}/>
                        :
                            <></>
                    }
                    {ucFirstChar(time)}
                    </>
                }/>
                {
                    items.map((data, i, idx) => {
                        if(data['schedule_time'][0]['category'] == ucFirstChar(time)){
                            total++
                            return <ComponentTextIcon text_type={data['consume_type']} body={data['schedule_consume']}/>
                        }
                    })
                }
                {
                    total === 0 ?
                        <ComponentTextMessageNoData is_with_image={false}  message="No Schedule for today"/>
                    : 
                        <></>
                }
            </div>
        </div>
    )
}
  