"use client"
import React from 'react'
import Axios from 'axios'
import { useState } from 'react'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark} from "@fortawesome/free-solid-svg-icons"

// Module
import { getLocal } from "../../../modules/storages/local";


export default function GetSignOut() {
    const keyToken = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState("")

    // Services
    const handleSubmit = async (e) => {
        try {
            const response = await Axios.post("http://127.0.0.1:8000/api/v1/logout", null, {
                headers: {
                    Authorization: `Bearer ${keyToken}`
                }
            })
            if(response.status != 200){
                window.location.reload(false)
                return response.data.message
            } else {
                localStorage.clear()
                window.location.href = '/'
            }
        } catch (error) {
            setResMsgAll(error)
        }
    }

    return (
        <li>
            <a className="border-0 bg-danger rounded" data-bs-toggle="modal" data-bs-target={"#signoutModal"}>
                <FontAwesomeIcon icon={faXmark} size="2xl" className='me-2'/> Sign Out
            </a>
            <div className="modal fade" id={"signoutModal"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sign Out</h5>
                            <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                        </div>
                        <div className="modal-body text-center p-4">
                            <p className="mt-4">Are you sure want to sign out from this account?</p>
                            <button className="btn btn-danger w-100 mb-4" onClick={handleSubmit}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}