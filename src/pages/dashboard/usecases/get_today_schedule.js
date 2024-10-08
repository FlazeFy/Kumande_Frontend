"use client"
import React from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import useSound from 'use-sound'
import audioUrl from '../../../../public/digital-alarm-2-151919.mp3'

// Modules
import { getCleanTitleFromCtx, ucFirstWord } from '../../../modules/helpers/converter'
import { getLocal, storeLocal } from '../../../modules/storages/local'

// Components
import ComponentContainerSchedule from '../../../molecules/container_schedule'
import { getTodayDate } from '../../../modules/helpers/generator'
import { isMobile } from '../../../modules/helpers/validator'
import ComponentText from '../../../atoms/text'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetTodaySchedule({ctx}) {
    //Initial variable
    const [playSound, { stop }] = useSound(audioUrl)
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const token = getLocal("token_key")
    const day = getTodayDate('day')
    const is_mobile = isMobile()

    const is_remind_schedule = getLocal('is_remind_schedule')

    if(is_remind_schedule === null){
        storeLocal('is_remind_schedule','true')
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/schedule/day/`+day, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data)        
                if(result.data != null && result.data.length > 0){
                    if(is_remind_schedule === 'true'){
                        playSound()

                        let content = ''
                        result.data.forEach(el => {
                            content += `<a class="btn btn-consume-schedule" href="/consume/${el.slug_name}">${el.schedule_consume} <span class="bg-info px-3 py-1 rounded-pill ms-2">${el.schedule_time[0].category}</span></a>`
                        });

                        Swal.fire({
                            html: `
                                <br>
                                <img class='img-icon-lg' src='/icons/Eat.png' alt='/icons/Eat.png' style='width: 240px; height: 240px;'/><br>
                                <b>You Have Schedule Today!</b> 
                                <div class="mt-2">${content}</div>
                            `,
                            footer: `
                                <div class="form-check d-block mx-auto mb-3" style="width:260px;">
                                    <input class="form-check-input" type="checkbox" value="" id="check_dont_remind">
                                    <label class="form-check-label" htmlFor="flexCheckDefault">Don't remind me again for today</label>
                                </div>
                                <button id="btn_ok_reminder_schedule" class="swal2-confirm swal2-styled">Thanks!</button>
                                <button id="btn_broadcast_remind" class="swal2-confirm swal2-styled">Send To My Social Media</button>
                            `,
                            showConfirmButton: false,
                            didOpen: () => {
                                document.getElementById('btn_ok_reminder_schedule').addEventListener('click', () => {
                                    const checkbox = document.getElementById('check_dont_remind')
                                    const isRemind = checkbox.checked
                                    if(isRemind){
                                        storeLocal('is_remind_schedule','false')
                                        Swal.fire(`Thank you, now the reminder is set to off`)
                                    } else {
                                        Swal.fire(`Stay healthy, stay safe`)
                                    }
                                    stop()
                                });
                        
                                document.getElementById('btn_broadcast_remind').addEventListener('click', () => {
                                    const checkbox = document.getElementById('check_dont_remind')
                                    const isRemind = checkbox.checked
                                    if(isRemind){
                                        storeLocal('is_remind_schedule','false')
                                        Swal.fire(`Sended To My Social Media, now the reminder is set to off`)
                                    } else {
                                        Swal.fire(`Sended To My Social Media`)
                                    }
                                    stop()
                                });
                            }
                        })
                    }
                }
            },
            (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    }, [playSound, ctx, day, is_remind_schedule, stop, token]);

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container-fluid p-0' style={{background:"var(--primaryColor)"}}>
                <ComponentText text_type="main_heading" body={<span className='text-white m-2'>{ucFirstWord(ctx)}</span>} />
                <div className='row' id='time-daily-schedule-holder'>
                    <div className={`col-lg-4 col-md-4 col-sm-6 ${is_mobile ? '' : 'pe-0'}`}>
                        <ComponentContainerSchedule time="breakfast" items={items} />
                    </div>
                    <div className={`col-lg-4 col-md-4 col-sm-6 ${is_mobile ? '' : 'px-0'}`}>
                        <ComponentContainerSchedule time="lunch" items={items} />
                    </div>
                    <div className={`col-lg-4 col-md-4 col-sm-6 ${is_mobile ? '' : 'ps-0'}`}>
                        <ComponentContainerSchedule time="dinner" items={items} />
                    </div>
                </div>
            </div>
        )
    }
}
  