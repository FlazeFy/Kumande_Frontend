"use client"
import React from 'react'
import ComponentTextMessageNoData from '../../atoms/text_message_no_data'
import { ucFirstWord } from '../../modules/helpers/converter'

export default function GetBodyBoxDashboard({item, target}) {
    return (
        <>
            <h5 className='my-1'>{ucFirstWord(target.replace("_", " "))}</h5>
            <div className='d-flex justify-content-between text-white mb-3 shadow' style={{borderRadius:"var(--roundedSM)"}}>
                <div className={item['max_'+target] != item['min_'+target] ? 'col-6 bgd-success p-2' : item['min_'+target] == null ? 'col-12 bgd-secondary p-2' :'col-12 bgd-success p-2'} 
                    style={{borderRadius: item['max_'+target] != item['min_'+target] ? "var(--roundedSM) 0 0 var(--roundedSM)":'var(--roundedSM)'}}>
                    <h6 className='mb-0'>{item['min_'+target] ?? <ComponentTextMessageNoData message="No Data Found"/>} 
                        {
                            item['min_'+target] != null ?   
                                <>
                                    <span style={{fontSize:"var(--textSM)"}}>{target == 'height'? 'Cm': target == 'weight' ? 'Kg':'mg/dL'}</span>
                                    <p className='my-0' style={{fontSize:"var(--textMD)"}}>{item['max_'+target] != item['min_'+target] ? 'Lowest' : 'Current'}</p>
                                </>              
                            :
                                <></>
                        }
                    </h6>
                </div>
                {
                    item['max_'+target] != item['min_'+target] ?
                        <div className='col-6 bgd-danger p-2' style={{borderRadius:"0 var(--roundedSM) var(--roundedSM) 0"}}>
                            <h6 className='mb-0'>{item['max_'+target]} <span style={{fontSize:"var(--textSM)"}}>{target == 'height'? 'Cm': target == 'weight' ? 'Kg':'mg/dL'}</span></h6>
                            <p className='mb-0' style={{fontSize:"var(--textMD)"}}>Highest</p>
                        </div>
                    : 
                    <></>
                }
            </div>
        </>
    )
}