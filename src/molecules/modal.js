"use client"
import React from 'react'

// Atoms
import ComponentButton from '../atoms/button'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ComponentModal(props){
    return (
        <>
            {
                props.button_template ?? <ComponentButton button_type="modal" icon={props.button_icon} text="Sign Out" class={props.button_class} target={props.id} button_name={props.title}/>
            }
            <div className="modal fade" id={props.id} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                            <button type="button" className="btn_close_modal" onClick={props.on_exit} data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                        </div>
                        <div className="modal-body text-center p-4">{props.body}</div>
                    </div>
                </div>
            </div>
        </>
    )
}