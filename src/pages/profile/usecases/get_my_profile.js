import React from 'react'
import { useState, useEffect } from "react"
import GetContentBox from '../../../components/containers/content_box'

// Component
import { calculateAge, getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'

export default function GetMyProfile({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItem(result.data)
                const item = result.data
                storeLocal(ctx + "_sess",JSON.stringify(item))             
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItem(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

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
            <div className='container mt-3 p-4'> 
                <h2>My Data</h2>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInput" defaultValue={item[0].fullname}></input>
                    <label for="floatingInput">Fullname</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" defaultValue={item[0].email}></input>
                    <label for="floatingInput">Email</label>
                </div>
                <div class="form-floating mb-1">
                    <input type="date" class="form-control" id="floatingInput" defaultValue={item[0].born_at}></input>
                    <label for="floatingInput">Date Born</label>
                </div>
                <p className='mb-2 text-secondary' id="age_user">Your age is <span>{ item[0].born_at}</span></p>
                <div class="form-floating mb-3">
                    <select class="form-select" id="floatingSelectGrid" defaultValue={calculateAge(item[0].gender)} aria-label="Floating label select example">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <label for="floatingSelectGrid">Gender</label>
                </div>
                <button className='btn btn-success'>Save Changes</button>
            </div>
        )
    }
}
  