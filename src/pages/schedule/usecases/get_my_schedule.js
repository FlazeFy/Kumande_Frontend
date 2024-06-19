"use client"
import React from 'react'
import { useState, useEffect } from "react"
import Axios from 'axios'
import Swal from 'sweetalert2'

// Modules
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'
import { getLocal, storeLocal } from '../../../modules/storages/local'

// Components
import { getAllDay } from '../../../modules/helpers/generator'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlRice, faCake, faCalendar, faHeart, faMugSaucer, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons"
import GetAnimaText from '../../../components/messages/anima_text'
import GetConsumeBox from '../../../components/containers/consume_box'
import GetBreakLine from '../../../components/others/breakline'
import { add_firestore } from '../../../modules/firebase/command'

export default function GetMySchedule({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [itemsConsume, setItemsConsume] = useState([])
    const token = getLocal("token_key")
    const days = getAllDay()
    const [selectedConsume, setSelectedConsume] = useState([])
    const [totalCalories, setTotalCalories] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [resMsgAll, setResMsgAll] = useState([])

    // Form
    const [scheduleDay, setScheduleDay] = useState("")
    const [scheduleCategory, setScheduleCategory] = useState("")
    const [scheduleTime, setScheduleTime] = useState("")

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

    const getFavorite = (val) => {
        if(val == 1){
            return 'var(--spaceSM) solid var(--dangerBG)'
        } else {
            return 'none'
        }
    }

    function getAvailableConsume(){
        //Default config
        const keyPage = sessionStorage.getItem("Table_"+ctx)
        const keyOrder = getLocal("Table_order_"+ctx)
        const keyFav = getLocal("Table_filter_favorite_"+ctx)
        const keyType = getLocal("Table_filter_type_"+ctx)
        const keyLimit = getLocal("Table_limit_"+ctx)
        const keyCalorie = getLocal("Table_filter_max_min_cal")

        if(keyPage === null){
            sessionStorage.setItem("Table_"+ctx, "1")
        }
        if(keyOrder === null){
            storeLocal("Table_order_"+ctx,"ASC")
        }
        if(keyFav === null){
            storeLocal("Table_filter_favorite_"+ctx,"all")
        }
        if(keyType === null){
            storeLocal("Table_filter_type_"+ctx,"all")
        }
        if(keyLimit === null){
            storeLocal("Table_limit_"+ctx,"10")
        }
        if(keyCalorie === null){
            storeLocal("Table_filter_max_min_cal","all")
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/limit/${keyLimit}/order/${keyOrder}/favorite/${keyFav}/type/${keyType}/provide/all/calorie/${keyCalorie}?page=${keyPage}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItemsConsume(result.data.data)
                }        
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItemsConsume(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    }

    const handleButtonClick = (day, category, consume) => {
        setScheduleDay(day)
        setScheduleCategory(category)
        if(category == "Breakfast"){
            setScheduleTime("07:00")
        } else if(category == "Lunch"){
            setScheduleTime("12:00")
        } else if(category == "Dinner"){
            setScheduleTime("19:00")
        }
        getAvailableConsume()
    };

    const removeConsume = (slug) => {
        setSelectedConsume(selectedConsume.filter(el => el.props.value.slug_name !== slug));
    }

    const selectConsume = (elmt) => {
        const tagExists = selectedConsume.some(el => el.props.value.slug_name === elmt.slug_name);
        if (!tagExists) {
            const newConsume = (
                <div className='text-start' value={{ slug_name: elmt.slug_name }} key={elmt.slug_name}>
                    <button className='consume-box p-3 border-0 text-start bg-white' style={{ borderLeft: getFavorite(elmt.is_favorite) }} onClick={() => removeConsume(elmt.slug_name)}>
                        <div className='d-flex justify-content-between mb-1'>
                            <div>
                                {elmt.is_favorite === 1 && <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite' />}
                                <a style={{ color: "var(--primaryColor)", fontWeight: "500", fontSize: "var(--textLG)" }}>
                                    {elmt['consume_type'] === 'Food' && <FontAwesomeIcon icon={faBowlRice} className='me-2' />}
                                    {elmt['consume_type'] === 'Drink' && <FontAwesomeIcon icon={faMugSaucer} className='me-2' />}
                                    {elmt['consume_type'] === 'Snack' && <FontAwesomeIcon icon={faCake} className='me-2' />}
                                    {elmt['consume_name']}
                                </a>
                            </div>
                        </div>
                        <a style={{ fontWeight: "500", fontSize: "var(--textXMD)" }}>Detail</a>
                        <GetBreakLine length={1} />
                        <div className='d-inline'>
                            <a className='btn btn-success rounded-pill px-3 py-1 me-1 mb-1' style={{ fontSize: "var(--textMD)" }}>
                                {elmt['consume_detail'][0]['provide']}
                            </a>
                            <a className='btn btn-warning rounded-pill px-3 py-1 me-1 mb-1' style={{ fontSize: "var(--textMD)" }}>
                                {elmt['consume_detail'][0]['calorie']} Cal
                            </a>
                            <a className='btn btn-danger rounded-pill px-3 py-1' style={{ fontSize: "var(--textMD)" }}>
                                {elmt['consume_detail'][0]['main_ing']}
                            </a>
                        </div>
                    </button>
                </div>
            );
            setSelectedConsume([...selectedConsume, newConsume])
            setTotalCalories(totalCalories + parseInt(elmt.consume_detail[0]['calorie']))
            setTotalPrice(totalPrice + parseInt(elmt.payment_price))
        }
    };

    // Services
    const handleSubmit = async (e) => {
        console.log(selectedConsume[0])
        const scheduleTimeFull = [{
            day: scheduleDay,
            category: scheduleCategory,
            time: scheduleTime
        }]

        try {
            let data = {
                schedule_consume: selectedConsume[0].consume_name,
                consume_type: selectedConsume[0].consume_type,
                consume_detail: selectedConsume[0].consume_detail,
                consume_from: selectedConsume[0].consume_from,
                schedule_desc: selectedConsume[0].consume_desc,
                schedule_tag: selectedConsume[0].consume_tag,
                schedule_time: scheduleTimeFull,
            }

            data.firebase_id = await add_firestore(data, 'schedule')     
            data.consume_detail = JSON.stringify(selectedConsume[0].consume_detail)
            data.schedule_time = JSON.stringify(scheduleTimeFull)
            
            const response = await Axios.post("http://127.0.0.1:8000/api/v1/schedule/create", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.data.status != 200){
                Swal.fire({
                    title: "Success!",
                    text: "Consume saved",
                    icon: "success"
                });
                return response.data.message
            } else {
                window.location.reload()
                return ""
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong! "+error,
            })
            setResMsgAll(error)
        }
    }

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
        let total_cal = 0

        return (
            <div>
                <h3 className='m-2 text-primary'>{getCleanTitleFromCtx(ucFirstWord(ctx))}</h3>
                <table class="table table-bordered table-click">
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
                                                                <td className={ i == 1 ? 'bg-success-light p-0':''}>
                                                                    {
                                                                        item['time'] === 'Breakfast' ? 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], item['time'], item['schedule_consume']) }>{item['schedule_consume']}</button> 
                                                                        : 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], 'Breakfast', item['schedule_consume']) }>-</button>
                                                                    }
                                                                </td>
                                                                <td className={ i == 1 ? 'bg-success-light':''}>
                                                                    {
                                                                        item['time'] === 'Lunch' ? 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], item['time'], item['schedule_consume']) }>{item['schedule_consume']}</button> 
                                                                        : 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], 'Lunch', item['schedule_consume']) }>-</button>
                                                                    }
                                                                </td>
                                                                <td className={ i == 1 ? 'bg-success-light':''}>
                                                                    {
                                                                        item['time'] === 'Dinner' ? 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], item['time'], item['schedule_consume']) }>{item['schedule_consume']}</button> 
                                                                        : 
                                                                            <button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(item['day'], 'Dinner', item['schedule_consume']) }>-</button>
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
                                                    <td className={ i == 1 ? 'bg-success-light':''}><button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(dy.slice(0, 3), 'Breakfast', null) }>-</button></td>
                                                    <td className={ i == 1 ? 'bg-success-light':''}><button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(dy.slice(0, 3), 'Lunch', null) }>-</button></td>
                                                    <td className={ i == 1 ? 'bg-success-light':''}><button className='cell-click' data-bs-toggle="modal" data-bs-target={"#scheduleTableEdit"} onClick={() => handleButtonClick(dy.slice(0, 3), 'Dinner', null) }>-</button></td>
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
                <div className="modal fade" id={"scheduleTableEdit"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Edit Schedule</h5>
                                <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <div className='row'>
                                    <div className='col-lg-4 col-md-5'>
                                        <h5 className='text-start'>Schedule</h5>
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="floatingInput" defaultValue={scheduleDay} disabled></input>
                                            <label htmlFor="floatingInput">Day</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="floatingInput" defaultValue={scheduleCategory} disabled></input>
                                            <label htmlFor="floatingInput">Category</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <input type="time" className="form-control" id="floatingInput" defaultValue={scheduleTime}></input>
                                            <label htmlFor="floatingInput">Time</label>
                                        </div>
                                        {
                                            selectedConsume.length > 0 ?
                                            <div className='mt-3 text-start'>
                                                <h5>Selected Consume</h5>
                                                {selectedConsume}
                                                <div className='d-flex justify-content-between pt-3' style={{borderTop:"2px solid var(--primaryColor)"}}>
                                                    <h6 className='text-primary'>+ Total Calorie</h6>
                                                    <h6 className='text-primary'>{totalCalories} Cal</h6>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <h6 className='text-primary'>+ Total Price</h6>
                                                    <h6 className='text-primary'>Rp. {totalPrice}</h6>
                                                </div>
                                                <button className='btn btn-success mt-3 w-100 py-3' onClick={handleSubmit}><FontAwesomeIcon icon={faCalendar}/> Create Schedule</button>
                                            </div> 
                                            : 
                                            <h5 className='mt-3 text-start'>No Consume Selected</h5>
                                        }
                                    </div>
                                    <div className='col-lg-8 col-md-7'>
                                        <h5 className='text-start'>Available Consume</h5>
                                        {
                                            itemsConsume.length > 0 ?
                                                <div className='row'>
                                                {
                                                    itemsConsume.map((elmt, idx) => {
                                                        return (
                                                            <div className='col-6 text-start'>
                                                                <button className='consume-box p-3 border-0 text-start bg-white' style={{borderLeft:getFavorite(elmt.is_favorite)}} onClick={() => selectConsume(elmt)}>
                                                                    <div className='d-flex justify-content-between mb-1'>
                                                                        <div>
                                                                            {
                                                                                elmt.is_favorite == 1 ?
                                                                                    <FontAwesomeIcon icon={faHeart} className='me-2 text-danger' size='lg' title='Favorite'/>
                                                                                : 
                                                                                    <></>
                                                                            }
                                                                            <a style={{color:"var(--primaryColor)", fontWeight:"500", fontSize:"var(--textLG)"}}>
                                                                            {
                                                                                elmt.consume_type == 'Food' ?
                                                                                    <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                                                                                : elmt.consume_type == 'Drink' ?
                                                                                    <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                                                                                : elmt.consume_type == 'Snack' ?
                                                                                    <FontAwesomeIcon icon={faCake} className='me-2'/>
                                                                                : 
                                                                                    <></>
                                                                            }
                                                                            {elmt.consume_name}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    <a style={{fontWeight:"500", fontSize:"var(--textXMD)"}}>Detail</a>
                                                                    <GetBreakLine length={1}/>
                                                                    <div className='d-inline'>
                                                                        <a className='btn btn-success rounded-pill px-3 py-1 me-1 mb-1' style={{fontSize:"var(--textMD)"}}>
                                                                            {elmt.consume_detail[0]['provide']}
                                                                        </a>
                                                                        <a className='btn btn-warning rounded-pill px-3 py-1 me-1 mb-1' style={{fontSize:"var(--textMD)"}}>
                                                                            {elmt.consume_detail[0]['calorie']} Cal
                                                                        </a>
                                                                        <a className='btn btn-danger rounded-pill px-3 py-1' style={{fontSize:"var(--textMD)"}}>
                                                                            {elmt.consume_detail[0]['main_ing']}
                                                                        </a>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            :
                                                <GetAnimaText ctx="No Consume Found" url={'/icons/Consume.png'}/>
                                        }
                                        <div className='d-flex justify-content-between w-100 mt-3'>
                                            <h5 className='text-start'>Selected Consume</h5>
                                            <button className='btn btn-primary'><FontAwesomeIcon icon={faPlus}/> Add Custom Consume</button>
                                        </div>
                                        <h5 className='text-start mt-3'>Total Calorie For This Day</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
  