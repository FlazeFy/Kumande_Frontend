import { faChartSimple, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import PostTag from './post_tag'

export default function GetMyTag({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetchTag()
    },[])

    const fetchTag = () => {
        fetch(`http://127.0.0.1:8000/api/v1/tag/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            return res.json().then(result => ({ status: res.status, result: result }))
        })
        .then(({ status, result }) => {
            setIsLoaded(true)
            if(status == 200){ 
                setItems(result.data)
                const item = result.data
                storeLocal(ctx + "_sess",JSON.stringify(item))  
            } else {
                setItems(null)

                if(status != 404){
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something wrong happen. Call the Admin!',
                        icon: 'error',
                    }) 
                }
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
    }

    if (error) {
        return <div><h2>{getCleanTitleFromCtx(ctx)}</h2> Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container shadow p-3'> 
                <h4>My Tag</h4>
                <table class="table table-bordered table-click">
                    <thead>
                        <tr>
                            <th scope="col">Tag Name</th>
                            <th scope="col">Total Used</th>
                            <th scope="col">Analyze</th>
                            <th scope="col">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items ?
                                items.map((dt, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{dt.tag_name}</td>
                                            <td>{dt.total_used}</td>
                                            <td><button className='btn btn-success my-1'><FontAwesomeIcon icon={faChartSimple}/></button></td>
                                            <td><button className='btn btn-warning my-1'><FontAwesomeIcon icon={faEdit}/></button></td>
                                        </tr>
                                    )
                                })
                            :
                                <tr key={1}>
                                    <td colSpan={4}>
                                        <a className='fst-italic text-secondary mb-1'>- No Tag Founded -</a>
                                    </td>
                                </tr>
                        }
                        <PostTag fetchTag={fetchTag}/>
                    </tbody>
                </table>
            </div>
        )
    }
}
  