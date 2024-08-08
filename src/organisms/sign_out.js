"use client"
import React from 'react'

// Molecules
import ComponentModal from '../molecules/modal'

// Other library
import Axios from 'axios'
import Swal from 'sweetalert2'

import { getLocal } from '../modules/storages/local'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ComponentSignOut() {
    const keyToken = getLocal("token_key")

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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
        }
    }

    return (
        <li>
            <ComponentModal id="signout_modal" title="Sign Out" on_exit={null} button_class="bg-danger" button_icon={<FontAwesomeIcon icon={faXmark} size="2xl" className='me-2'/>} body={
                <>
                    <p className="mt-4">Are you sure want to sign out from this account?</p>
                    <button className="btn btn-danger w-100 mb-4" onClick={handleSubmit}>Yes</button>
                </>
            }/>
        </li>
    )
}