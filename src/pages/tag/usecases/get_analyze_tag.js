"use client"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getLocal } from '../../../modules/storages/local'
import { convertDatetime, numberToPrice } from '../../../modules/helpers/converter'
import ComponentTextIcon from '../../../atoms/text_icon'

const GetAnalyzeTag = forwardRef((props, ref) => {
    const [items, setItems] = useState(null)
    const [messageRes, setMessageRes] = useState('...')
    const token = getLocal("token_key")
    const modalRef = useRef(null)

    const fetchTag = useCallback(() => {
        fetch(`http://127.0.0.1:8000/api/v1/tag/analyze/${props.dt.tag_slug}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json().then(result => ({ status: res.status, result: result })))
        .then(({ status, result }) => {
            if (status === 200) { 
                setItems(result.data)
                if(!items){
                    setMessageRes(result.message)
                }
            } else {
                setItems(null)
                if (status !== 404) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something wrong happened. Call the Admin!',
                        icon: 'error',
                    }) 
                }
            }
        })
        .catch(error => {                
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happened. Call the Admin!',
                icon: 'error',
            }) 
        })
    }, [token, props, items])

    useEffect(() => {
        const handleShow = () => {
            if (props.dt) {
                fetchTag()
            }
        }
        const modalElement = modalRef.current
        modalElement.addEventListener('shown.bs.modal', handleShow)

        return () => {
            modalElement.removeEventListener('shown.bs.modal', handleShow)
        }
    }, [props.dt,fetchTag])

    useImperativeHandle(ref, () => ({
        fetchTag
    }))

    return (
        <div className="modal fade" id="analyze_tag" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Analyze Tag</h5>
                        <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="modal-body text-center p-4">
                        {
                            props.dt && (
                                items ?
                                    <>
                                        <h5>Here's some analysis for tag</h5>
                                        <span className='rounded-pill text-white btn-primary px-2 py-1 ms-2 mb-2' style={{fontSize:"var(--textLG)"}}>{props.dt.tag_name}</span><hr></hr>
                                        <p>The analysis results reveal that You have used this tag total of <b>{items.total_item}</b> consume associated with this tag, 
                                            with an overall expenditure of Rp. <b>{numberToPrice(items.total_price)}</b>.</p> 
                                        <p>On average, each item contains approximately <b>{items.average_calorie}</b> calories. 
                                            The highest-calorie item recorded has <b>{items.max_calorie}</b> calories, while the lowest contains <b>{items.min_calorie}</b> calories.</p>
                                        <p>The most recent usage of this tag occurred on <b>{convertDatetime(items.last_used,'calendar')}</b>, 
                                            with the last consumed item being 
                                            <ComponentTextIcon text_type={items.last_used_consume_type} body={items.last_used_consume_name} text_href={`/consume/${items.last_used_consume_slug}`}/>
                                        </p>
                                    </>
                                :
                                    <div className='my-3 mx-auto d-block text-center'>
                                        <img className='m-3' style={{width:"100px"}} src={'/icons/Tag.png'} alt={'/icons/Tag.png'}/>
                                        <p className='text-secondary text-center fst-italic'>- {messageRes} -</p>
                                    </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
})

export default GetAnalyzeTag