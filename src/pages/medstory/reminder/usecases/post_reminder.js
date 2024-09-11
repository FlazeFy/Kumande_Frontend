"use client"
import { faCalendar, faClock, faFloppyDisk, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { getLocal } from '../../../../modules/storages/local'
import Swal from 'sweetalert2'
import Axios from 'axios'
import GoogleMapReact from 'google-map-react'
import { getDaysInMonth, getMonthName } from '../../../../modules/helpers/generator'
import { validateURL } from '../../../../modules/helpers/validator'
import { uploadeFirebaseStorage } from '../../../../modules/helpers/firebase'

export default function PostListReminder({fetchReminders}) {
    //Initial variable
    const token = getLocal("token_key")
    
    // Form
    const [reminderName, setReminderName] = useState("")
    const [reminderBody, setReminderBody] = useState("")
    const [reminderType, setReminderType] = useState("Every Year")
    const [reminderAttachmentType, setReminderAttachmentType] = useState("none")
    const [reminderContextBuild, setReminderContextBuild] = useState("")
    const [reminderAttachmentBuild, setReminderAttachmentBuild] = useState("")
    const [reminderContext, setReminderContext] =useState([])

    const [reminderAttachmentURL, setReminderAttachmentURL] =useState("")
    const [reminderAttachmentCoor, setReminderAttachmentCoor] =useState("")
    const [reminderAttachmentName, setReminderAttachmentName] =useState("")

    const [selectedMonth, setSelectedMonth] = useState("1")
    const [selectedDay, setSelectedDay] = useState(1)
    const [selectedHour, setSelectedHour] = useState("00:00")

    // Ref
    const attachmentCoorRef = useRef(null)
    const validateURLRef = useRef(null)
    const uploadFileStatusRef = useRef(null)
    const uploadedImageRef = useRef(null)

    useEffect(() => {
        setReminderContextBuild(generateReminderContext(reminderType))
        setReminderAttachmentBuild(generateReminderAttach(reminderAttachmentType))
    }, [reminderType, reminderAttachmentType])

    const changeReminderType = (type) => {
        setReminderType(type)
        setReminderContextBuild(generateReminderContext(type))
    }
    const changeReminderAttachment = (type) => {
        setReminderAttachmentURL("")
        setReminderAttachmentType(type)
        // setReminderAttachmentBuild(generateReminderAttach(type))
    }

    const generateReminderContext = (type) => {
        setReminderContext([])
        // setSelectedMonth("1")
        // setSelectedDay(1)
        // setSelectedHour("00:00")

        switch (type) {
            case "Every Day":
                return (
                    <div className="form-floating mb-2">
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
                    <div className="form-floating mb-2">
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
                        <div className="form-floating mb-2">
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
                        <div className="form-floating mb-2">
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

    // Maps Prop
    const [marker, setMarker] = useState(null)
    const Marker = ({text}) => (
        <div className='position-relative'>
            <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Marker" />
            <h6 className='text-white text-center position-absolute' style={{width:"100px", left:"-30px"}}>{text}</h6>
        </div>
    );
    const defaultProps = {
        center: {
          lat: -6.2289462774161715,
          lng: 106.82658996100545
        },
        zoom: 12
    };

    // Firebase Storage
    const uploadFile = async (e)=> {
        uploadFileStatusRef.current.text = 'Uploading...'

        const url = await uploadeFirebaseStorage(e, 'reminder')

        uploadedImageRef.current.src = url
        setReminderAttachmentURL(url)
        uploadFileStatusRef.current.text = ''

    }

    const generateReminderAttach = (type) => {
        const checkUrl = (url) => {
            setReminderAttachmentURL(url)

            if(validateURL(url)){
                validateURLRef.current.text = 'URL is valid!'
                validateURLRef.current.style.color = 'var(--successBG)'
            } else {
                validateURLRef.current.text = 'URL is not valid!'
                validateURLRef.current.style.color = 'var(--dangerBG)'
            }
        }

        switch (type) {
            case "none":
                return (
                    <div className="form-floating mb-2">
                        <a className='fst-italic text-secondary mb-1'>- No Attachment -</a>
                    </div>
                )
            case "location":
                return (
                    <>
                        <div style={{ height: '300px', width: '100%' }} className="rounded mb-2">
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: "AIzaSyDXu2ivsJ8Hj6Qg1punir1LR2kY9Q_MSq8" }}
                                defaultCenter={defaultProps.center}
                                defaultZoom={defaultProps.zoom}
                                onClick={({ lat, lng }) => {
                                    attachmentCoorRef.current.value = `${lat}, ${lng}`
                                    setReminderAttachmentCoor(`${lat}, ${lng}`)
                                    setMarker({ lat, lng })
                                }}
                            >
                            {
                                marker && (<Marker lat={marker.lat} lng={marker.lng}/>)
                            }
                            </GoogleMapReact>
                        </div>
                        <div className="form-floating mb-2">
                            <input type="text" className="form-control" id="coordinate-input" ref={attachmentCoorRef} onChange={(e)=> setReminderAttachmentCoor(e.target.value)}></input>
                            <label htmlFor="selectHour">Coordinate</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="location-name-input" onChange={(e)=> setReminderAttachmentName(e.target.value)}></input>
                            <label htmlFor="selectHour">Location Name</label>
                        </div>
                    </>
                )
            case "url":
                return (
                    <>
                        <div className="form-floating mb-2">
                            <input type="text" className="form-control" id="url-input" onChange={(e)=> checkUrl(e.target.value)}></input>
                            <label htmlFor="selectDay">URL</label>
                            <a className='err-msg' ref={validateURLRef}></a>
                        </div>
                    </>
                )
            case "image":
                return (
                    <>
                        <img className='w-100' ref={uploadedImageRef}></img>
                        <a className='err-msg' ref={uploadFileStatusRef}></a>
                        <div className="input-group mb-2">
                            <button className="btn btn-outline-secondary" type="button" id="inputGroupFileAddon03">Upload</button>
                            <input type="file" className="form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload" 
                                onChange={(e)=>uploadFile(e)}></input>
                        </div>
                    </>
                )
            default:
                return null
        }
    }
    
    const addContext = () => {
        let data = [...reminderContext]
        let newData

        if(reminderContext.length < 10){
            switch (reminderType) {
                case "Every Year":
                    newData = {
                        time: `${selectedDay} ${selectedMonth}`,
                    }
                    break
                case "Every Month":
                    newData = {
                        time: selectedDay,
                    }
                    break
                case "Every Day":
                    newData = {
                        time: selectedHour,
                    }
                    break
                default:
                    return null
            }

            const isDuplicate = data.some((entry) => entry.time === newData.time)
            if (!isDuplicate) {
                data.push(newData)
                setReminderContext(data)
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Entry',
                    text: 'This reminder context already exist!',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Entry Reach Limit',
                text: 'You have reached maximum size of context per Reminder!',
            })
        }
    };

    const removeContext = (idx) => {
        let data = [...reminderContext]
        let newData = []

        data.forEach((el,idxData)=>{
            if(idxData != idx){
                newData.push(el)
            }
        })

        setReminderContext(newData)
    }

    // Services
    const handleAdd = async () => {
        let reminderContextFinal = []
        let reminder_attachment = []

        if(reminderType == "Every Month"){
            reminderContext.forEach(el => {
                reminderContextFinal.push({
                    time: `Day ${String(parseInt(el.time)).padStart(2, '0')}`
                })
            });
        } else if(reminderType == "Every Year"){
            reminderContext.forEach(el => {
                reminderContextFinal.push({
                    time: `${el.time.split(" ")[0]} ${getMonthName(el.time.split(" ")[1]-1)}`
                })
            });
        }

        if (reminderAttachmentType == "location"){
            reminder_attachment.push({
                attachment_type: "location",
                attachment_context: reminderAttachmentCoor,
                attachment_name: reminderAttachmentName
            })
        } else if (reminderAttachmentType == "url"){
            reminder_attachment.push({
                attachment_type: "url",
                attachment_context: reminderAttachmentURL,
                attachment_name: null
            })
        } else if (reminderAttachmentType == "image"){
            reminder_attachment.push({
                attachment_type: "image",
                attachment_context: reminderAttachmentURL,
                attachment_name: null
            })
        }

        const data = {
            reminder_name: reminderName,
            reminder_body: reminderBody,
            reminder_type: reminderType,
            reminder_context: JSON.stringify(reminderContextFinal),
            reminder_attachment: reminder_attachment != null ? JSON.stringify(reminder_attachment) : null
        }

        try {
            let response = await Axios.post("http://127.0.0.1:8000/api/v1/reminder/add", JSON.stringify(data), {
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
                text: "Something went wrong!",
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
                                        <select className="form-select"  id="floatingSelect" defaultValue='Every Year' onChange={(e) => changeReminderType(e.target.value)} aria-label="Floating label select example">
                                            <option value="Every Year">Every Year</option>
                                            <option value="Every Month">Every Month</option>
                                            <option value="Every Day">Every Day</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Type</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <select className="form-select" defaultValue='none' id="floatingSelect" onChange={(e) => changeReminderAttachment(e.target.value)} aria-label="Floating label select example">
                                            <option value="none">None</option>
                                            <option value="location">Location</option>
                                            <option value="url">URL</option>
                                            <option value="image">Image</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Attachment</label>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <h6>Context</h6>
                                    {
                                        reminderContext.length > 0 ? <h6>Selected Context</h6> : <></>
                                    }
                                    <div className='mb-2'>
                                        {
                                            reminderContext.map((dt, idx) => (
                                                <button className='btn btn-primary me-2 mb-2' key={idx} onClick={(e)=>removeContext(idx)}>
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
                                    <hr></hr>
                                    <h6>Attachment</h6>
                                    {reminderAttachmentBuild}
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
  