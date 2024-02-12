import React from 'react'
import controls from './controls.module.css'
import { ucFirst } from '../../modules/helpers/typography'
import { getLocal, storeLocal } from '../../modules/storages/local'

// Toast
import CustomToast from "../modals/toast"
import { toast } from 'react-toastify'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

export default function GetSearch({placeholder, ctx}) {
    function setSessionSearch(key, val){
        sessionStorage.setItem(`Table_search_${key}`,val)  
        toast.success(<CustomToast msg={ctx + " filtered"} />)
    }

    function getValue(val){
        if(val == "%20"){
            return ""
        } else {
            return val
        }
    }

    return (
        <div className={controls.search_holder}>
            <input className={'form-control '+ controls.search_bar} placeholder={ucFirst(placeholder)} defaultValue={sessionStorage.getItem(`Table_search_${ctx}`) != null ? getValue(sessionStorage.getItem(`Table_search_${ctx}`)) : null} 
                onBlur={(e) => setSessionSearch(ctx, e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? setSessionSearch(ctx, e.target.value) : null} /> 
            <FontAwesomeIcon className={controls.search_icon} icon={faMagnifyingGlass} color="var(--secondaryBG)"/>
        </div>
    );
}