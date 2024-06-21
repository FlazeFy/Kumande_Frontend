"use client"
import React from 'react'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faCalendar, faEdit, faHeart, faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import GetBreakLine from '../others/breakline'
import { convertDatetime, numberToPrice } from '../../modules/helpers/converter'
import { GetAnimaText } from '../messages/anima_text'

export default function GetConsumeBox({items, type}) {
    const getFavorite = (val) => {
        if(val == 1){
            return 'var(--spaceSM) solid var(--dangerBG)'
        } else {
            return 'none'
        }
    }

    return (
        <div className={type != 'detail'?'consume-box':'mt-4 mb-2 container p-4'} onClick={type != 'detail' ? (e)=>window.location.href='/consume/'+items.slug_name:null} style={{borderLeft:getFavorite(items['is_favorite'])}}>
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
                {
                    type != 'detail' ?
                        <div style={{fontWeight:"500"}}>
                            <a className='text-secondary me-3'>{items['consume_from']}</a>
                            {
                                items['is_payment'] === 0 ?
                                    <a className='bg-success'>Free</a>
                                :
                                    <a className='text-success'>Rp. {items['payment_price'].toLocaleString()}</a>
                            }
                        </div>
                    : 
                        <></>
                }
            </div>
            <div>{items['consume_comment']}</div>
            <GetBreakLine length={1}/>
            {
                type == 'detail' ? <hr></hr> : <></>
            }
            <h6>Detail</h6>
            <div className='d-flex justify-content-start'>
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
            <h6 className='mt-2'>Tags</h6>
            <div className='d-flex justify-content-start'>
                {
                    items['consume_tag'].map((tag, idx) => {
                        return(
                            <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>{tag['tag_name']}</a>
                        )
                    })
                }
            </div>
            {
                type == 'detail' ?
                    <>
                        <hr></hr>
                        <div className='row mt-2'>
                            <div className='col'>
                                <h6 className='mt-2'>Payment</h6>
                                {
                                    items['payment'].length > 0 ?
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>Method</th>
                                                    <th>Amount</th>
                                                    <th>Props</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items['payment'].map((item, idx) => {
                                                        return (
                                                            <tr>
                                                                <td>{item.payment_method}</td>
                                                                <td>Rp. {item.payment_price.toLocaleString()},00</td>
                                                                <td style={{fontSize:"var(--textMD)"}}>
                                                                    <h6 className='m-0'>Created At</h6>
                                                                    <p className='m-0'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items.created_at, 'calendar')}</p>
                                                                    {
                                                                        items.updated_at ?
                                                                            <>                                                                    
                                                                                <h6 className='m-0'>Updated At</h6>
                                                                                <p className='m-0'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items.updated_at, 'calendar')}</p>
                                                                            </>
                                                                        :
                                                                            <></>
                                                                    }
                                                                </td>
                                                                <td><a className='btn btn-warning'><FontAwesomeIcon icon={faEdit}/></a></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    :
                                        <GetAnimaText ctx="No Consume Found" url={'/icons/Consume.png'}/>
                                }
                            </div>
                            <div className='col'>
                                <h6 className='mt-2'>Schedule</h6>
                                {
                                    items['schedule'].length > 0 ?
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>Day</th>
                                                    <th>Category</th>
                                                    <th>Time</th>
                                                    <th>Props</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items['schedule'].map((item, idx) => {
                                                        return (
                                                            <tr>
                                                                <td>{item.schedule_time[0].day}</td>
                                                                <td>{item.schedule_time[0].category}</td>
                                                                <td>{item.schedule_time[0].time}</td>
                                                                <td style={{fontSize:"var(--textMD)"}}>
                                                                    <h6 className='m-0'>Created At</h6>
                                                                    <p className='m-0'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(item.created_at, 'calendar')}</p>
                                                                    {
                                                                        item.updated_at ?
                                                                            <>                                                                    
                                                                                <h6 className='m-0'>Updated At</h6>
                                                                                <p className='m-0'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(item.updated_at, 'calendar')}</p>
                                                                            </>
                                                                        :
                                                                            <></>
                                                                    }
                                                                </td>
                                                                <td><a className='btn btn-warning'><FontAwesomeIcon icon={faEdit}/></a></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    :
                                        <GetAnimaText ctx="No Consume Found" url={'/icons/Consume.png'}/>
                                }
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row mt-2 text-center">
                            <div className='col-lg-4 col-md-6'>
                                <h6>Created At</h6>
                                <a className='text-secondary'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items['created_at'], 'calendar')}</a>
                            </div>
                            <div className='col-lg-4 col-md-6'>
                                <h6>Updated At</h6>
                                <a className='text-secondary'>{items['updated_at'] ? <><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items['updated_at'], 'calendar')}</> : '-'}</a>
                            </div>
                            <div className='col-lg-4 col-md-6'>
                                <h6>Deleted At</h6>
                                <a className='text-secondary'>{items['deleted_at'] ? <><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items['deleted_at'], 'calendar')}</> : '-'}</a>
                            </div>
                        </div>
                    </>
                :
                    
                    <div className="d-flex justify-content-end mt-2">
                        <a className='text-secondary'><FontAwesomeIcon icon={faCalendar}/> At {convertDatetime(items['created_at'], 'calendar')}</a>
                    </div>
            }
        </div>
    )
}