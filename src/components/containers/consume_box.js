"use client"
import React from 'react'
import GoogleMapReact from 'google-map-react'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faCalendar, faEdit, faHeart, faLocationDot,  faMugSaucer } from "@fortawesome/free-solid-svg-icons"
import GetBreakLine from '../others/breakline'
import { convertDatetime, numberToPrice, ucFirstChar } from '../../modules/helpers/converter'

export default function GetConsumeBox({items, type, func}) {
    const getFavorite = (val) => {
        if(val == 1){
            return 'var(--spaceSM) solid var(--dangerBG)'
        } else {
            return 'none'
        }
    }

    const Marker = ({text}) => (
        <div className='position-relative'>
            <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Marker" />
            <h6 className='text-white text-center position-absolute' style={{width:"100px", left:"-30px"}}>{text}</h6>
        </div>
    );

    const defaultProps = {
        center: {
          lat: items['consume_detail'][0]['provide_lat'],
          lng: items['consume_detail'][0]['provide_long']
        },
        zoom: 12
    };

    const handleClick = () => {
        if (type !== 'detail') {
            window.location.href = '/consume/' + items.slug_name
        }
    };

    if(type != 'mini'){
        return (
            <div className={type != 'detail'?'consume-box':'mt-4 mb-2 container p-4'} onClick={handleClick} style={{borderLeft:getFavorite(items['is_favorite'])}}>
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
                </div>
                <div>{items['consume_comment']}</div>
                <GetBreakLine length={1}/>
                {
                    type == 'detail' ? <hr></hr> : <></>
                }
                <div className='row'>
                    <div className='col'>
                        <h6>Detail</h6>
                        <div className='d-flex justify-content-start'>
                            <a className='btn btn-success rounded-pill px-3 py-1 me-1'>
                                {items['consume_detail'][0]['provide']}
                            </a>
                            <a className='btn btn-warning rounded-pill px-3 py-1 me-1'>
                                {items['consume_detail'][0]['calorie']} Cal
                            </a>
                            <a className='btn btn-danger rounded-pill px-3 py-1 me-1'>
                                {items['consume_detail'][0]['main_ing']}
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
                        <h6 className='mt-2'>Tags</h6>
                        <div className='d-flex justify-content-start'>
                            {
                                items['consume_tag'] ?
                                    items['consume_tag'].map((tag, idx) => {
                                        return(
                                            <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>{tag['tag_name']}</a>
                                        )
                                    })
                                :
                                    <p className='text-secondary fst-italic'>- No Tag Found -</p>
                            }
                        </div>
                    </div>
                    {
                        type == 'detail' && typeof items['consume_detail'][0]['provide_lat'] !== "undefined"?
                            <div className='col'>
                                <h6>Maps</h6>
                                <div style={{ height: '400px', width: '100%'}}>
                                    <GoogleMapReact 
                                        bootstrapURLKeys={{ key: "AIzaSyDXu2ivsJ8Hj6Qg1punir1LR2kY9Q_MSq8" }}
                                        defaultCenter={defaultProps.center}
                                        defaultZoom={defaultProps.zoom}
                                    >
                                    <Marker
                                        key={items['consume_detail'][0]['provide']}
                                        lat={items['consume_detail'][0]['provide_lat']}
                                        lng={items['consume_detail'][0]['provide_long']}
                                        text={items['consume_detail'][0]['provide']}
                                    />
                                    </GoogleMapReact>
                                </div>
                            </div>
                        : 
                            <></>
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
                                            <div className='d-block mx-auto text-center'>
                                                <img className='img img-fluid my-4' src='/icons/BudgetData.png' style={{width:"160px"}}/>
                                                <h5 className='text-secondary'>No Payment found for this Consume</h5>
                                            </div>                                
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
                                            <div className='d-block mx-auto text-center'>
                                                <img className='img img-fluid my-4' src='/icons/Calendar.png' style={{width:"160px"}}/>
                                                <h5 className='text-secondary'>No Schedule found for this Consume</h5>
                                            </div>
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
                        <a style={{color:"var(--primaryColor)", fontWeight:"500", fontSize:"var(--textLG)"}}>
                        {
                            items.consume_type == 'Food' ?
                                <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                            : items.consume_type == 'Drink' ?
                                <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                            : items.consume_type == 'Snack' ?
                                <FontAwesomeIcon icon={faCake} className='me-2'/>
                            : 
                                <></>
                        }
                        {items.consume_name}
                        </a>
                    </div>
                </div>
                <a style={{fontWeight:"500", fontSize:"var(--textXMD)"}}>Detail</a>
                <GetBreakLine length={1}/>
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