import { faChartSimple, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef } from 'react'
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import ComponentTextMessageNoData from '../../../atoms/text_message_no_data'

// Component
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal } from '../../../modules/storages/local'
import GetAnalyzeTag from './get_analyze_tag'
import PostTag from './post_tag'

export default function GetMyTag({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    const [analyzeTagData, setAnalyzeTagData] = useState(null)

    // Ref
    const analyzeTagDataRef = useRef(null)

    const handleAnalyzeTagData = (dt) => {
        setAnalyzeTagData(dt)
    }

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
                                            <td>
                                                <button className='btn btn-success my-1' data-bs-toggle="modal" data-bs-target="#analyze_tag" onClick={(e) => handleAnalyzeTagData(dt)}><FontAwesomeIcon icon={faChartSimple}/></button>
                                            </td>
                                            <td><button className='btn btn-warning my-1'><FontAwesomeIcon icon={faEdit}/></button></td>
                                        </tr>
                                    )
                                })
                            :
                                <tr key={1}>
                                    <td colSpan={4}>
                                        <ComponentTextMessageNoData is_with_image={false}  message="No Tag found"/>
                                    </td>
                                </tr>
                        }
                        <PostTag fetchTag={fetchTag}/>
                    </tbody>
                </table>
                {items && <GetAnalyzeTag dt={analyzeTagData} ref={analyzeTagDataRef}/>}

            </div>
        )
    }
}
  