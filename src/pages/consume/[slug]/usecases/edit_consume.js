"use client"
import React, { useEffect, useState } from 'react'
import Axios from 'axios'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import consumeFromTokens from '../../../../design_token/variable/consume_from'
import consumeTypeTokens from '../../../../design_token/variable/consume_type'
import Swal from 'sweetalert2'
import { getLocal, storeLocal } from '../../../../modules/storages/local'
import ComponentAlertBox from '../../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../../modules/helpers/converter'
import ComponentBreakLine from '../../../../atoms/breakline'
import ComponentTextMessageNoData from '../../../../atoms/text_message_no_data'

export default function EditConsume(props){
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState(null)
    const [resMsgAll, setResMsgAll] = useState([])
    const token = getLocal("token_key")
    
    // Form
    const [consumeName, setConsumeName] = useState(props.data.consume_name)
    const [consumeProvide, setConsumeProvide] = useState(props.data.consume_detail[0]['provide'])
    const [consumeMainIng, setConsumeMainIng] = useState(props.data.consume_detail[0]['main_ing'])
    const [consumeCal, setConsumeCal] = useState(props.data.consume_detail[0]['calorie'])
    const [consumeFrom, setConsumeFrom] = useState(props.data.consume_from)
    const [consumeType, setConsumeType] = useState(props.data.consume_type)
    const [consumeComment, setConsumeComment] = useState(props.data.consume_comment)
    const [selectedTagAdd, setSelectedTagAdd] = useState([])
    const [selectedTagRemove, setSelectedTagRemove] = useState([])

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
                setItem(result.data) 
            },
            (error) => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something wrong happen. Call the Admin!',
                    icon: 'error',
                })   
                if(getLocal("tag_sess") !== undefined){
                    setIsLoaded(true)
                    setItem(JSON.parse(getLocal("tag_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[token])

    const selectTag = (i, slug, name, type) => {
        if(type === 'add'){
            const tagExists = selectedTagAdd.some((elmt) => elmt.props.value.slug_name === slug);
            if (!tagExists) {
                setSelectedTagAdd(selectedTagAdd.concat(
                    <button key={i} className='btn btn-tag' value={{slug_name:slug, tag_name:name}} title="Unselect this tag" onClick={() => removeTag(slug)}>
                        {name}
                    </button>
                ));
            }
        } else {
            const tagExists = selectedTagRemove.some((elmt) => elmt.props.value.slug_name === slug);
            if (!tagExists) {
                setSelectedTagRemove(selectedTagRemove.concat(
                    <button key={i} className='btn btn-tag' value={{slug_name:slug, tag_name:name}} title="Unselect this tag" onClick={() => removeTag(slug)}>
                        {name}
                    </button>
                ));
            }
        }
    };

    const removeTag = (slug) => {        
        const newTag = []

        if(selectedTagAdd.length !== 0){
            selectedTagAdd.forEach(element => {
                if(element.props.value.slug_name !== slug){
                    newTag.push(element)
                }
            });
        } 
        setSelectedTagAdd(selectedTagAdd)
    }

    const handleSubmit = async (e) => {
        const consumeDetail = [{
            provide: consumeProvide,
            calorie: consumeCal,
            main_ing: consumeMainIng
        }]

        try {
            let consumeTag = props.data.consume_tag 
            if(selectedTagAdd.length > 0){
                if(consumeTag === null) consumeTag = []
                selectedTagAdd.forEach(element => {
                    consumeTag.push({
                        slug_name:element.props.value.slug_name, 
                        tag_name:element.props.value.tag_name
                    })
                });
            } 
            if(selectedTagRemove.length > 0){
                consumeTag = consumeTag.filter(element => 
                    !selectedTagRemove.some(dt => dt.props.value.slug_name === element.slug_name)
                );
            }
            if(consumeTag.length === 0){
                consumeTag = null
            } else if(consumeTag != null){
                consumeTag = JSON.stringify(consumeTag)
            }

            let data = {
                consume_type: consumeType,
                consume_name: consumeName,
                consume_detail: consumeDetail,
                consume_from: consumeFrom,
                consume_tag: consumeTag,
                consume_comment: consumeComment,
            }

            data.consume_detail = JSON.stringify(consumeDetail)
            
            const response = await Axios.put(`http://127.0.0.1:8000/api/v1/consume/update/data/${props.data.id}`, JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status === 200){
                storeLocal('is_edit_consume','false')
                props.onchange()
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.message,
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
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(props.ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div className='container-fluid p-3'>
                <h2>{getCleanTitleFromCtx(props.ctx)}</h2>
                <h5>About Consume</h5>
                <div className="form-floating">
                    <input type="text" className="form-control" defaultValue={props.data.consume_name} onBlur={(e) => setConsumeName(e.target.value)} list="consume_name_list"></input>
                    <label htmlFor="floatingInput">Name</label>
                </div>
                <div className="my-3 form-floating">
                    <input type="text" className="form-control" defaultValue={props.data.consume_detail[0]['provide']} onChange={(e) => setConsumeProvide(e.target.value)} id="floatingInput"></input>
                    <label htmlFor="floatingInput">Provide</label>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="text" className="form-control" defaultValue={props.data.consume_detail[0]['main_ing']} onChange={(e) => setConsumeMainIng(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Main Ingredient</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating">
                            <input type="number" className="form-control" defaultValue={props.data.consume_detail[0]['calorie']} onChange={(e) => setConsumeCal(e.target.value)} id="floatingInput"></input>
                            <label htmlFor="floatingInput">Calorie</label>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" defaultValue={props.data.consume_from} onChange={(e) => setConsumeFrom(e.target.value)} aria-label="Floating label select example">
                                {
                                    consumeFromTokens.map((dt,idx) => (
                                        <option value={dt} key={idx}>{dt}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor="floatingSelect">From</label>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="floatingSelect" defaultValue={props.data.consume_type} onChange={(e) => setConsumeType(e.target.value)} aria-label="Floating label select example">
                                {
                                    consumeTypeTokens.map((dt,idx) => (
                                        <option value={dt} key={idx}>{dt}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor="floatingSelect">Type</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mb-3">
                    <textarea className="form-control" style={{minHeight:"100px"}} onChange={(e) => setConsumeComment(e.target.value)} defaultValue={props.data.consume_comment} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                    <label htmlFor="floatingTextarea">Comments</label>
                </div>
                <div className="mt-2 mx-1 px-3 py-2 rounded mb-3" style={{border: "1.25px solid rgb(223, 226, 230)"}}>
                    <h6 style={{marginBottom:"var(--spaceSM)",color:"grey",fontSize:"var(--textXMD)"}}>Attached Tags</h6>
                    <ComponentBreakLine length={1}/>
                    {
                        props.data.consume_tag !== null ? (
                            <div>
                                {
                                    props.data.consume_tag.map((elmt, index) => (
                                        <button key={index} title="Select this tag" className='btn btn-tag' onClick={() => {
                                            if(selectedTagRemove.length === 0){
                                                selectTag(index, elmt.slug_name, elmt.tag_name, 'remove')
                                            } else {
                                                let found = false
                                                selectedTagRemove.map((slct, j, index) => {
                                                    if(slct.props.value === elmt.tags_slug){
                                                        found = true
                                                    }
                                                    return null
                                                })
            
                                                if(!found){
                                                    selectTag(index, elmt.slug_name, elmt.tag_name, 'remove')
                                                }
                                            }
                                        }} >{elmt.tag_name}</button>
                                    ))
                                }
                            </div>
                        ) : <ComponentTextMessageNoData message="No tag used"/>
                    }
                    {
                        selectedTagAdd.length > 0 && <div>
                            <h6 style={{marginBottom:"var(--spaceSM)",color:"grey",fontSize:"var(--textXMD)"}}>Selected Tag to <b>Add</b></h6>
                            <ComponentBreakLine length={1}/>
                            {selectedTagAdd}
                        </div>
                    }
                    {
                        selectedTagRemove.length > 0 && <div>
                            <h6 style={{marginBottom:"var(--spaceSM)",color:"grey",fontSize:"var(--textXMD)"}}>Selected Tag to <b>Remove</b></h6>
                            <ComponentBreakLine length={1}/>
                            {selectedTagRemove}
                        </div>
                    }
                </div> 
                <h5>Available Tags</h5>
                {
                    item != null && (
                        <>
                            {
                                item.map((elmt, index) => (
                                    (props.data.consume_tag === null || !props.data.consume_tag.some(dt => dt.slug_name === elmt.tag_slug)) &&
                                    <button key={index} title="Select this tag" className='btn btn-tag' onClick={() => {
                                        if(selectedTagAdd.length === 0){
                                            selectTag(index, elmt.tag_slug, elmt.tag_name, 'add')
                                        } else {
                                            let found = false
                                            selectedTagAdd.map((slct, j, index) => {
                                                if(slct.props.value === elmt.tags_slug){
                                                    found = true
                                                }
                                                return null
                                            })
        
                                            if(!found){
                                                selectTag(index, elmt.tag_slug, elmt.tag_name, 'add')
                                            }
                                        }
                                    }} >{elmt.tag_name}</button>
                                ))
                            }
                        </>
                    ) 
                }
                <span className='err-msg'>{resMsgAll}</span>
                <button className='btn btn-success mt-3' onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk}/> Save Changes</button>
            </div>
        )
    }
}