"use client"
import React from 'react'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faCalendar, faHeart, faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import GetBreakLine from '../others/breakline'
import { convertDatetime } from '../../modules/helpers/converter'

export default function GetConsumeBox({items}) {
    const getFavorite = (val) => {
        if(val == 1){
            return 'var(--spaceSM) solid var(--dangerBG)'
        } else {
            return 'none'
        }
    }

    return (
        <div className='consume-box' style={{borderLeft:getFavorite(items['is_favorite'])}}>
            <div className='d-flex justify-content-between mb-2'>
                <div>
                    {
                        items['is_favorite'] == 1 ?
                            <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite'/>
                        : 
                            <></>
                    }
                    <a style={{color:"var(--primaryColor)", fontWeight:"500", fontSize:"var(--textXLG)"}}>
                    {
                        items['consume_type'] == 'Food' ?
                            <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                        : items['consume_type'] == 'Drink' ?
                            <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                        : items['consume_type'] == 'Snack' ?
                            <FontAwesomeIcon icon={faCake} className='me-2'/>
                        : 
                            <></>
                    }
                    {items['consume_name']}
                    </a>
                </div>
                <div style={{fontWeight:"500"}}>
                    <a className='text-secondary me-3'>{items['consume_from']}</a>
                    {
                        items['is_payment'] === 0 ?
                            <a className='bg-success'>Free</a>
                        :
                            <a className='text-success'>Rp. {items['payment_price']}</a>
                    }
                </div>
            </div>
            <div>{items['consume_comment']}</div>
            <GetBreakLine length={1}/>
            <a style={{fontWeight:"500"}}>Detail</a>
            <GetBreakLine length={1}/>
            <div className='d-inline'>
                <a className='btn btn-success rounded-pill px-3 py-1 me-1'>
                    {items['consume_detail'][0]['provide']}
                </a>
                <a className='btn btn-warning rounded-pill px-3 py-1 me-1'>
                    {items['consume_detail'][0]['calorie']} Cal
                </a>
                <a className='btn btn-danger rounded-pill px-3 py-1'>
                    {items['consume_detail'][0]['main_ing']}
                </a>
            </div>
            <GetBreakLine length={1}/>
            <a style={{fontWeight:"500"}}>Tags</a>
            <GetBreakLine length={1}/>
            <div className='d-inline'>
                {
                    items['consume_tag'].map((tag, idx) => {
                        return(
                            <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>{tag['tag_name']}</a>
                        )
                    })
                }
            </div>
            <GetBreakLine length={1}/>
            <div className="d-flex justify-content-between">
                <div></div>
                <div>
                    <a className='text-secondary'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items['created_at'], 'calendar')}</a>
                </div>
            </div>
        </div>
    )
}