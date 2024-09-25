import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useState } from "react"
import Swal from 'sweetalert2'
import Axios from 'axios'

// Modules
import { getLocal } from '../../../modules/storages/local'

export default function PostTag({fetchTag}) {
    //Initial variable
    const token = getLocal("token_key")

    // Form
    const [tagName, setTagName] = useState("")

    // Toogle
    const [showInputTag, setShowInputTag] = useState(false)

    // Add
    const handleAddNewTag = () => {
        setShowInputTag(true)
    };

    // Remove
    const handleCloseNewTag = () => {
        setShowInputTag(false)
    };

    // Services
    const handleSubmit = async (e) => {
        try {
            let data = {
                tag_name: tagName,
            }   

            const response = await Axios.post("http://127.0.0.1:8000/api/v1/tag/add", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status !== 200){
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })  
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Tag has been add',
                    icon: 'success',
                })  
                fetchTag()
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Something wrong happen. Call the Admin!',
                icon: 'error',
            })  
        }
    }
   
    return (
        <>
            {
                showInputTag ?
                    <>
                        <tr>
                            <td colSpan={4}>
                                <div className="form-floating">
                                    <input type="text" className="form-control border-0" onChange={(e) => setTagName(e.target.value)}></input>
                                    <label htmlFor="floatingInput">Tag Name</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3}>
                                <a className='fst-italic text-secondary mb-1'>
                                    <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={(e)=>handleSubmit()}><FontAwesomeIcon icon={faPlus}/> Add New Tag</button>
                                </a>
                            </td>
                            <td colSpan={1}>
                                <a className='fst-italic text-secondary mb-1'>
                                    <button className='btn btn-danger w-100' style={{borderRadius:"0"}} onClick={(e)=>handleCloseNewTag()}><FontAwesomeIcon icon={faXmark}/></button>
                                </a>
                            </td>
                        </tr>
                    </>
                :
                    <tr>
                        <td colSpan={4}>
                            <a className='fst-italic text-secondary mb-1'>
                                <button className='btn btn-success w-100' style={{borderRadius:"0"}} onClick={(e)=>handleAddNewTag()}><FontAwesomeIcon icon={faPlus}/> Add New Tag</button>
                            </a>
                        </td>
                    </tr>
            }
        </>
    )
}
  