"use client"
import { faBell, faCalendar, faClock, faFloppyDisk, faLocationDot, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import Axios from 'axios'
import { getMonthName } from '../../../../modules/helpers/generator'

export default function PostListReminder({fetchReminders}) {
    //Initial variable
    const token = getLocal("token_key")
    
    // Form
    const [reminderName, setReminderName] = useState("")
    const [reminderBody, setReminderBody] = useState("")
    const [reminderType, setReminderType] = useState("Every Year")
    const [reminderContextBuild, setReminderContextBuild] = useState("")
    const [reminderContext, setReminderContext] =useState([])
    const [selectedMonth, setSelectedMonth] = useState("1")
    const [selectedDay, setSelectedDay] = useState("01")
    const [selectedHour, setSelectedHour] = useState("00:00")

    useEffect(() => {
        setReminderContextBuild(generateReminderContext(reminderType))
    }, [reminderType, selectedMonth, selectedDay])

    const changeReminderType = (type) => {
        setReminderType(type)
        setReminderContextBuild(generateReminderContext(type))
    }
    const generateReminderContext = (type) => {
        setReminderContext([])
        setSelectedMonth("1")
        setSelectedDay("01")
        setSelectedHour("00:00")

        switch (type) {
            case "Every Day":
                return (
                    <div className="form-floating mb-3">
                        <select className="form-select" id="selectHour" onChange={(e) => setSelectedHour(e.target.value)} aria-label="Select hour">
                            {
                                Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                                        {String(i).padStart(2, '0')}:00
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="selectHour">Select Hour</label>
                    </div>
                )
            case "Every Month":
                return (
                    <div className="form-floating mb-3">
                        <select className="form-select" id="selectDay" onChange={(e) => setSelectedDay(e.target.value)} aria-label="Select day">
                            {
                                Array.from({ length: 31 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        Day {i + 1}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="selectDay">Select Day</label>
                    </div>
                )
            case "Every Year":
                return (
                    <>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="selectMonth" onChange={(e) => setSelectedMonth(e.target.value)} aria-label="Select month">
                                {
                                    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="selectMonth">Select Month</label>
                        </div>
                        <div className="form-floating mb-3">
                            <select className="form-select mt-3" id="selectDay" onChange={(e) => setSelectedDay(e.target.value)} aria-label="Select day">
                                {
                                    Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => (
                                        <option key={i} value={i + 1}>
                                            Day {i + 1}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="selectDay">Select Day</label>
                        </div>
                    </>
                )
            default:
                return null
        }
    }

    const getDaysInMonth = (month) => {
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        const monthIndex = parseInt(month) - 1
        return monthIndex === 1 ? 29 : monthDays[monthIndex]
    }

    const addContext = () => {
        let data = [...reminderContext]
        switch (reminderType) {
            case "Every Year":
                data.push({
                    time: `${selectedDay} ${selectedMonth}`,
                })
                break
            case "Every Month":
                data.push({
                    time: selectedDay,
                })
                break
            case "Every Day":
                data.push({
                    time: selectedHour,
                })
                break
            default:
                return null
        }
        setReminderContext(data)
    }

    // Services
    const handleAdd = async () => {
        const data = {
            reminder_name: reminderName,
            reminder_body: reminderBody,
            reminder_type: reminderType,
            reminder_context: reminderContext,
        }

        try {
            let response = await Axios.post("http://127.0.0.1:8000/api/v1/reminder/rel", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            
            if(response.status == 200){
                fetchReminders()
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"+error,
            })
        }
    }


    return (
        <div className='col-lg-6 col-md-6 col-sm-12'>
            <button className='btn-main' style={{height:"150px"}} data-bs-toggle="modal" data-bs-target={`#addReminder`} title={'Add reminder'}>
                <div className='ms-2 me-4'>
                    <img style={{height:"140px",bottom:"0"}} src={'/icons/Reminder.png'}/>
                </div>
                <div className='text-start py-4'>
                    <p className='mb-0'>Making a schedule but always forget to do it?</p>
                    <p className='mb-0'>Try to ...</p>
                    <h2>Make your Reminder</h2>
                </div>
            </button>
            <div className="modal fade" id={`addReminder`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Reminder</h5>
                            <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                        </div>
                        <div className="modal-body text-start p-4">
                            <div className='row'>
                                <div className='col-6'>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" onChange={(e) => setReminderName(e.target.value)} id="floatingInput"></input>
                                        <label htmlFor="floatingInput">Reminder Name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" style={{minHeight:"100px"}} onChange={(e) => setReminderBody(e.target.value)} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                                        <label htmlFor="floatingTextarea">Message</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <select className="form-select" id="floatingSelect" onChange={(e) => changeReminderType(e.target.value)} aria-label="Floating label select example">
                                            <option value="Every Year">Every Year</option>
                                            <option value="Every Month">Every Month</option>
                                            <option value="Every Day">Every Day</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Type</label>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    {
                                        reminderContext.length > 0 ? <h6>Selected Context</h6> : <></>
                                    }
                                    <div className='mb-2'>
                                        {
                                            reminderContext.map((dt, idx) => (
                                                <button className='btn btn-primary me-2 mb-2' key={idx}>
                                                    {
                                                        reminderType === "Every Year" ? 
                                                            <>
                                                                <FontAwesomeIcon icon={faCalendar}/> {dt.time.split(" ")[0]} {getMonthName(dt.time.split(" ")[1]-1)}
                                                            </>
                                                        : reminderType === "Every Month" ? 
                                                            <>
                                                                <FontAwesomeIcon icon={faCalendar}/> Day {dt.time}
                                                            </>
                                                        : 
                                                            <>
                                                                <FontAwesomeIcon icon={faClock}/> {dt.time}
                                                            </>
                                                    }
                                                </button>
                                            ))
                                        }
                                    </div>
                                    {reminderContextBuild}
                                    <button className='w-100 btn btn-primary py-2' onClick={addContext}><FontAwesomeIcon icon={faPlus}/> Add Context</button>
                                </div>
                            </div>
                            <button className='w-100 btn btn-success mt-2 py-2' data-bs-dismiss="modal" onClick={(e) => handleAdd()}><FontAwesomeIcon icon={faFloppyDisk}/> Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
  