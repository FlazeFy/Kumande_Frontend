import React, { useEffect, useState } from 'react'
import ComponentTextMessageNoData from '../../../atoms/text_message_no_data'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'
import { isMobile } from '../../../modules/helpers/validator'
import { getLocal, storeLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function FilterConsumeTag({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    let tags = []
    const token = getLocal("token_key")
    const is_mobile = isMobile()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/tag`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItems(result.data)
                } 
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

    function handleCheckboxChange(event) {
        const { checked, value } = event.target
        const tagValue = JSON.parse(value)
        if (checked) {
            tags.push(tagValue)
        } else {
            tags = tags.filter((item) => item.tag_slug !== tagValue.tag_slug)
        }
    }

    function applyFilter(){
        storeLocal("Table_filter_"+ctx, tags)
        window.location.reload()
    }

    function resetFilter(){
        localStorage.removeItem("Table_filter_"+ctx)
        window.location.reload()
    }
  
    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        const tagSelected = JSON.parse(getLocal("Table_filter_"+ctx))
        return (
            <>
                <div className={is_mobile ?'W-100 p-2 rounded mb-2':'w-50 p-2 rounded ms-2'} style={{border:"1px solid #DFE2E6", cursor:"pointer"}} title="Click to select tag"
                    data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <label className='text-secondary'>Tags</label>
                        <p className='tag-filter-holder'>
                            {
                                tagSelected != null && tagSelected.length > 0 ?
                                    tagSelected.map((element,idx) => {
                                            return (
                                                <a key={`tag_name_${idx}`}>{element.tag_name}</a>
                                            );
                                        })
                                    :
                                        <span className={is_mobile ?"alert alert-warning mt-2 mb-0 w-100":"alert alert-warning mt-2 mb-0"} role="alert">
                                            No tag has been selected
                                        </span>
                            }
                        </p>
                    </div>
                    <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Tag</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                items.length > 0 ?
                                    items.map((elmt, idx) => {
                                        let found = false
                                        tagSelected != null && tagSelected.length > 0 ?
                                            tagSelected.map(element => {
                                                if(element.tag_slug == elmt.tag_slug){
                                                    found = true
                                                    return
                                                }
                                            })
                                        :
                                            <></>                                        

                                        return (
                                            <div className="form-chec d-inline-block me-2" key={`check_${idx}`}>
                                                <input className="form-check-input tags_element" type="checkbox" defaultChecked={found} onChange={handleCheckboxChange} value={
                                                    JSON.stringify({
                                                        tag_slug:elmt.tag_slug,
                                                        tag_name:elmt.tag_name
                                                    })
                                                }></input>
                                                <label className="form-check-label ms-1" htmlFor="flexCheckDefault">
                                                    {elmt.tag_name}
                                                </label>
                                            </div>
                                        )
                                    })
                                :
                                    <ComponentTextMessageNoData is_with_image={true} url={'/icons/Consume.png'} message="No Tag found"/>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={resetFilter}>Reset All</button>
                            <button type="button" className="btn btn-success" onClick={applyFilter}>Apply Filter</button>
                        </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
  
