import React from 'react'
import { useState, useEffect } from "react"
import Axios from 'axios'
import Swal from 'sweetalert2'

// Component
import { calculateAge, getCleanTitleFromCtx } from '../../../modules/helpers/converter'

// Modules
import { getLocal, storeLocal } from '../../../modules/storages/local'
import { getAge } from '../../../modules/helpers/generator'

export default function GetMyProfile({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const token = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState([])

    // Form
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [born_at, setBornAt] = useState("")

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
                setFullname(item[0].fullname)
                setEmail(item[0].email)
                setGender(item[0].gender)
                setBornAt(item[0].born_at)
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

    // Services
    const handleSubmit = async (e) => {
        try {
            let user = {
                fullname: fullname,
                email: email,
                gender: gender,
                born_at: born_at
            }
            
            const response = await Axios.put("http://127.0.0.1:8000/api/v1/user/edit", JSON.stringify(user), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status == 200){
                Swal.fire({
                    title: "Success!",
                    text: "Profile updated",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
            setResMsgAll(error)
        }
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
            <div className='container mt-3 p-4'> 
                <h2>My Data</h2>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" defaultValue={item[0].fullname} onChange={(e)=>setFullname(e.target.value)}></input>
                    <label for="floatingInput">Fullname</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" defaultValue={item[0].email} onChange={(e)=>setEmail(e.target.value)}></input>
                    <label for="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-1">
                    <input type="date" className="form-control" id="floatingInput" defaultValue={item[0].born_at} onChange={(e)=>setBornAt(e.target.value)}></input>
                    <label for="floatingInput">Date Born</label>
                </div>
                <p className='mb-2 text-secondary fst-italic' style={{fontSize:"var(--textMD)"}} id="age_user">Your age is <span>{getAge(item[0].born_at)}</span></p>
                <div className="form-floating mb-3">
                    <select className="form-select" id="floatingSelectGrid" onChange={(e)=>setGender(e.target.value)} aria-label="Floating label select example">
                        <option value="male" selected={item[0].gender == 'male' ? true : false}>Male</option>
                        <option value="female" selected={item[0].gender == 'female' ? true : false}>Female</option>
                    </select>
                    <label for="floatingSelectGrid">Gender</label>
                </div>
                <button className='btn btn-success' onClick={handleSubmit}>Save Changes</button>
            </div>
        )
    }
}
  