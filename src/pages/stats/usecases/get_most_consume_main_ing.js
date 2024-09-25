import React from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import ComponentTextMessageNoData from '../../../atoms/text_message_no_data'

// Component
import { ComponentPieChart } from '../../../molecules/pie_chart'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetMostConsumeMainIng({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")
    const filter_name = "consume_type"

    useEffect(() => {
        //Default config
        const keyLimit = sessionStorage.getItem(`Pie_limit_${filter_name}`)
        if(keyLimit == null){
            sessionStorage.setItem(`Pie_limit_${filter_name}`, 5);
        }

        fetch(`http://127.0.0.1:8000/api/v1/consume/total/bymain`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({ status: res.status, result: result }))
        })
        .then(({ status, result }) => {
            setIsLoaded(true)
            if(status === 200){ 
                setItems(result.data)
                const item = result.data
                storeLocal(ctx + "_sess",JSON.stringify(item))  
            } else {
                setItems(null)
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                }) 
            }
        })
        .catch(error => {                
            if(getLocal(ctx + "_sess") !== undefined){
                setIsLoaded(true)
                setItems(JSON.parse(getLocal(ctx + "_sess")))
            } else {
                setIsLoaded(true)
                setError(error)
            }
        })
    },[])

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
            <div className='container shadow p-3'> 
                <h2>{getCleanTitleFromCtx(ctx)}</h2>
                {
                    items ?
                        <ComponentPieChart items={items} filter_name={null}/>  
                    :
                        <ComponentTextMessageNoData is_with_image={false}  message="No Data Found"/>
                } 
            </div>
        )
    }
}
  