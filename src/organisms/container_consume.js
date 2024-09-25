"use client"
import React from 'react'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faEdit, faHeart, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import ComponentBreakLine from '../atoms/breakline'
import { convertDatetime } from '../modules/helpers/converter'
import ManagePayment from '../pages/consume/[slug]/usecases/manage_payment'
import { isMobile } from '../modules/helpers/validator'
import ComponentTextMessageNoData from '../atoms/text_message_no_data'
import ComponentTextIcon from '../atoms/text_icon'
import ComponentContainerMaps from '../molecules/container_maps'
import ComponentButton from '../atoms/button'
import ComponentText from '../atoms/text'
import ComponentTextMessageImageNoData from '../molecules/text_message_image_no_data'

export default function ComponentContainerConsume({items, type, func, fetchConsume}) {
    // Initial Variable
    const is_mobile = isMobile()

    const getFavorite = (val) => {
        if(val == 1){
            return 'var(--spaceSM) solid var(--dangerBG)'
        } else {
            return 'none'
        }
    }

    const handleClick = () => {
        if (type !== 'detail') {
            window.location.href = '/consume/' + items.slug_name
        }
    };

    if(type !== 'mini'){
        return (
            <div className={type !== 'detail'?'consume-box':'mb-2 container p-4'} onClick={handleClick} style={{borderLeft:getFavorite(items['is_favorite'])}}>
                <div className='d-flex justify-content-between mb-2'>
                    <div>
                        {
                            items['is_favorite'] == 1 && <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite'/>
                        }
                        <ComponentTextIcon text_style={{fontWeight:500,fontSize:"var(--textXLG)"}} text_type={items.consume_type} body={items.consume_name}/>
                    </div>
                    {
                        type !== 'detail' && !is_mobile ?
                            <div style={{fontWeight:"500"}}>
                                <a className='text-secondary me-3'>{items['consume_from']}</a>
                                <a className='bgd-success rounded py-2 px-3 text-white'>
                                {
                                    items['is_payment'] == null ?
                                        'Free'
                                    :
                                        `Rp. ${items['payment_price'].toLocaleString()}`
                                }
                                </a>
                            </div>
                        : 
                            <></>
                    }
                    {
                        type == 'detail' && <a className='text-secondary me-3'>{items['consume_from']}</a>
                    }
                </div>
                <div>{items['consume_comment']}</div>
                <ComponentBreakLine length={1}/>
                {
                    type == 'detail' && <hr></hr>
                }
                <div className='row'>
                    <div className='col'>
                        <ComponentText text_type="mini_sub_heading" body="Detail"/>
                        <div className='d-flex justify-content-start'>
                            <ComponentButton button_type="provide" button_name={items['consume_detail'][0]['provide']}/>
                            <ComponentButton button_type="calorie" button_name={items['consume_detail'][0]['calorie']}/>
                            <ComponentButton button_type="main_ing" button_name={items['consume_detail'][0]['main_ing']}/>
                            {
                                typeof items['consume_detail'][0]['provide_lat'] !== "undefined" &&
                                    <ComponentButton button_type="primary" button_name={<><FontAwesomeIcon icon={faLocationDot}/> See On Maps</>} url={`https://www.google.com/maps/place/${items['consume_detail'][0]['provide_lat']},${items['consume_detail'][0]['provide_long']}`}/>
                            }
                        </div>
                        <h6 className='mt-2'>
                            {
                                is_mobile ? 
                                    <span className='btn btn-primary rounded-pill px-3 py-1 text-white me-1'># {items['consume_tag'].length} Tags</span>
                                :
                                    <>Tags</>
                            }
                            {
                                is_mobile && (
                                    <>
                                        <a className='bgd-primary rounded-pill py-2 px-3 text-white me-1'>{items['consume_from']}</a>
                                        <a className='bgd-success rounded-pill py-2 px-3 text-white'>
                                            {
                                                items['is_payment'] == null ?
                                                    'Free'
                                                :
                                                    `Rp. ${items['payment_price'].toLocaleString()}`
                                            }
                                        </a>
                                    </>
                                ) 
                            }
                        </h6>
                        {
                            !is_mobile && (
                                <div className='d-flex justify-content-start'>
                                    {
                                        items['consume_tag'] ?
                                            items['consume_tag'].map((tag, idx) => {
                                                return <ComponentButton key={`tag_button_${idx}`} button_type="tag" button_name={tag['tag_name']}/>
                                            })
                                        :
                                            <ComponentTextMessageNoData is_with_image={false}  message="No Tag found"/>
                                    }
                                </div>
                            )
                        }
                    </div>
                    {
                        type == 'detail' && typeof items['consume_detail'][0]['provide_lat'] !== "undefined" &&
                            <div className='col'>
                                <ComponentContainerMaps 
                                    container_title="Maps"
                                    location_lat={items['consume_detail'][0]['provide_lat']} 
                                    location_lang={items['consume_detail'][0]['provide_long']} 
                                    location_name={items['consume_detail'][0]['provide']}/>
                            </div>
                    }
                </div>
                {
                    type == 'detail' ?
                        <>
                            <hr></hr>
                            <div className='row mt-2'>
                                <div className='col'>
                                    <ComponentText text_type="mini_sub_heading" body="Payment"/>
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
                                                                <tr key={`tbody_payment_${idx}`}>
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
                                                                    <td>
                                                                        <ManagePayment dt={item} fetchConsume={fetchConsume}/>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        :
                                            <ComponentTextMessageImageNoData image_url={'/icons/BudgetData.png'} body="No Payment found for this Consume"/>                         
                                        }
                                </div>
                                <div className='col'>
                                    <ComponentText text_type="mini_sub_heading" body="Schedule"/>
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
                                                                <tr key={`tbody_schedule_${idx}`}>
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
                                            <ComponentTextMessageImageNoData image_url={'/icons/Calendar.png'} body="No Schedule found for this Consume"/>
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
    } else {
        return (
            <button className='consume-box p-3 border-0 text-start bg-white' style={{borderLeft:getFavorite(items.is_favorite)}} onClick={func}>
                <div className='d-flex justify-content-between mb-1'>
                    <div>
                        {
                            items.is_favorite == 1 ?
                                <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite'/>
                            : 
                                <></>
                        }
                        <ComponentTextIcon text_style={{fontSize:"var(--textLG)"}} text_type={items.consume_type} body={items.consume_name}/>
                    </div>
                </div>
                <a style={{fontWeight:"500", fontSize:"var(--textXMD)"}}>Detail</a>
                <ComponentBreakLine length={1}/>
                <div className='d-inline'>
                    <a className='btn btn-success rounded-pill px-3 py-1 me-1 mb-1' style={{fontSize:"var(--textMD)"}}>
                        {items.consume_detail[0]['provide']}
                    </a>
                    <a className='btn btn-warning rounded-pill px-3 py-1 me-1 mb-1' style={{fontSize:"var(--textMD)"}}>
                        {items.consume_detail[0]['calorie']} Cal
                    </a>
                    <a className='btn btn-danger rounded-pill px-3 py-1' style={{fontSize:"var(--textMD)"}}>
                        {items.consume_detail[0]['main_ing']}
                    </a>
                    {
                        typeof items['consume_detail'][0]['provide_lat'] !== "undefined" ?
                            <a className='btn btn-primary rounded-pill px-3 py-1' style={{fontSize:"var(--textMD)"}} href={`https://www.google.com/maps/place/${items['consume_detail'][0]['provide_lat']},${items['consume_detail'][0]['provide_long']}`}>
                                <FontAwesomeIcon icon={faLocationDot}/> See On Maps
                            </a>
                        :
                            <></>
                    }
                </div>
            </button>
        )
    }
}