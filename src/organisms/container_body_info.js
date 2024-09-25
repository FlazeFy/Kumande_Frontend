"use client"
import React from 'react'
import ComponentText from '../atoms/text'
import ComponentTextMessageNoData from '../atoms/text_message_no_data'
import { ucFirstWord } from '../modules/helpers/converter'

export default function ComponentBodyBoxDashboard(props) {
    return (
        <>
            <ComponentText text_type="sub_heading" body={ucFirstWord(props.target.replace("_", " "))}/>
            <div className='d-flex justify-content-between text-white mb-3 shadow' style={{borderRadius:"var(--roundedSM)"}}>
                <div className={props.item['max_'+props.target] != props.item['min_'+props.target] ? 'col-6 bgd-success p-2' : props.item['min_'+props.target] === null ? 'col-12 bgd-secondary p-2' :'col-12 bgd-success p-2'} 
                    style={{borderRadius: props.item['max_'+props.target] != props.item['min_'+props.target] ? "var(--roundedSM) 0 0 var(--roundedSM)":'var(--roundedSM)'}}>
                    <h6 className='mb-0'>{props.item['min_'+props.target] ?? <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>} 
                        {
                            props.item['min_'+props.target] != null &&   
                                <>
                                    <span style={{fontSize:"var(--textSM)"}}>{props.target === 'height'? 'Cm': props.target === 'weight' ? 'Kg':'mg/dL'}</span>
                                    <ComponentText text_type="mini_content" body={props.item['max_'+props.target] != props.item['min_'+props.target] ? 'Lowest' : 'Current'} text_style={{color:'var(--whiteColor) !important'}}/>
                                </>         
                        }
                    </h6>
                </div>
                {
                    props.item['max_'+props.target] != props.item['min_'+props.target] ?
                        <div className='col-6 bgd-danger p-2' style={{borderRadius:"0 var(--roundedSM) var(--roundedSM) 0"}}>
                            <h6 className='mb-0'>{props.item['max_'+props.target]} <span style={{fontSize:"var(--textSM)"}}>{props.target === 'height'? 'Cm': props.target === 'weight' ? 'Kg':'mg/dL'}</span></h6>
                            <ComponentText text_type="mini_content" body="Highest" text_style={{color:'var(--whiteColor) !important'}}/>
                        </div>
                    : 
                    <></>
                }
            </div>
        </>
    )
}