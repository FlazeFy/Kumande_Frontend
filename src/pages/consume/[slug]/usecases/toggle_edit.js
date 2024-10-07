import React from 'react'

// Toast
import ComponentCustomToast from "../../../../molecules/container_toast"
import { toast } from 'react-toastify'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { getLocal, storeLocal } from '../../../../modules/storages/local'

export default function GetToggleEdit(props) {
    const toggleEdit = () => {
        if(getLocal('is_edit_consume') === 'true'){
            storeLocal('is_edit_consume','false')
        } else {
            storeLocal('is_edit_consume','true')
        }
        toast.success(<ComponentCustomToast msg={"toogle edit updated"} />)
        props.onchange()
    }

    return (
        <button className={getLocal('is_edit_consume') === 'true' ? "btn btn-success me-2":"btn btn-danger me-2"} onClick={toggleEdit}><FontAwesomeIcon icon={faEdit}/> Toggle Edit : {getLocal('is_edit_consume') === 'true' ? <span>On</span>:<span>Off</span>}</button>
    );
}