"use client"
import React from 'react'

// Components
import ComponentDropDownDctDynamic from '../molecules/dropdown'
import ComponentGetAllTag from './get_all_tag'

//Modules
import { countHalf } from '../modules/helpers/math'

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import ComponentBreakLine from '../atoms/breakline'
import ComponentTextForm from '../atoms/text_form'

export default function ComponentForm({type, props}) {
    if (type == "single-line"){
        return (
            <div key={type}>
                <div className='row'>
                    {
                        props.map((elmt, idx) => {
                            if (elmt.type === 'text' || elmt.type === 'number' || elmt.type === 'range') {
                                return (
                                    <div className='col-lg-12 col-md-12 col-sm-12 text-start mb-3' key={idx}>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                        {
                                            elmt.type === 'range' ? 
                                                <>
                                                    <ComponentBreakLine length={1}/>
                                                    <div className='d-flex justify-content-between my-1'>
                                                        <div>
                                                            <lable className='text-white'>{elmt.min}</lable>
                                                        </div>
                                                        <div>
                                                            <lable className='text-white'>{countHalf(elmt.max)}</lable>
                                                        </div>
                                                        <div>
                                                            <lable className='text-white'>{elmt.max}</lable>
                                                        </div>
                                                    </div>
                                                    <input placeholder={elmt.placeholder}
                                                        className={elmt.class + " w-100"} 
                                                        onChange={elmt.handleChange}
                                                        type={elmt.type}
                                                        max={elmt.max}
                                                        min={elmt.min}
                                                        id={elmt.id}
                                                        defaultValue={countHalf(elmt.max)}
                                                    />
                                                </>
                                            :
                                                <input placeholder={elmt.placeholder}
                                                    className={elmt.class + " w-100"} 
                                                    onChange={elmt.handleChange}
                                                    maxLength={elmt.max}
                                                    id={elmt.id}
                                                    type={elmt.is_obsecure == true ? 'password' : elmt.type}
                                                    
                                                />
                                        }
                                        <ComponentTextForm text_type="form_danger" body={elmt.errorMsg}/>
                                    </div>
                                )
                            } else if (elmt.type === 'textarea') {
                                return (
                                    <div className='col-lg-12 col-md-12 col-sm-12 text-start mb-3' key={idx}>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                        <textarea className={elmt.class + " w-100"} rows={elmt.line} onChange={elmt.handleChange}></textarea>
                                        <ComponentTextForm text_type="form_danger" body={elmt.errorMsg}/>
                                    </div>
                                )
                            } else if (elmt.type === 'upload') {
                                return (
                                    <div className='col-lg-12 col-md-12 col-sm-12 text-start mb-3' key={idx}>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                        <ComponentBreakLine length={1}/>
                                        <input className="form-control" type="file" onChange={elmt.handleChange} /> 
                                        <ComponentTextForm text_type="form_danger" body={elmt.errorMsg}/>
                                    </div>
                                )
                            } else if (elmt.type === 'select') {
                                return (
                                    <div className='col-lg-12 col-md-12 col-sm-12 text-start mb-3' key={idx}>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                        <ComponentDropDownDctDynamic url={elmt.url} elmt={elmt} ctx="dropdown"/>
                                        <ComponentTextForm text_type="form_danger" body={elmt.errorMsg}/>
                                    </div>
                                )
                            } else if (elmt.type === 'checkbox') {
                                return (
                                    <div class="form-check ms-3">
                                        <input className={elmt.class} type={elmt.type} id="disabledFieldsetCheck" onChange={elmt.handleChange}></input>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                    </div>
                                )
                            } else if (elmt.type === 'tag') {
                                return (
                                    <div class="form-check" style={{marginLeft:"-10px"}}>
                                        <ComponentTextForm text_type="form_label" body={elmt.label}/>
                                        <ComponentBreakLine length={1}/>
                                        <div className='mt-2'/>
                                        <ComponentGetAllTag url={elmt.url} cls={elmt.class} func={elmt.handleChange}/>
                                        <ComponentBreakLine length={2}/>
                                    </div>
                                )
                            } else if (elmt.type === 'submit') {
                                return (
                                    <div className='col-lg-4 col-md-6 col-sm-12 mx-auto mt-3' key={idx}>
                                        <button className={elmt.class + " w-100 h-75 mt-2 pb-3 pt-2"} 
                                            id={elmt.id}
                                            onClick={elmt.handleClick}>
                                            <FontAwesomeIcon icon={faPaperPlane} color="var(--secondaryBG)"/> {elmt.label}
                                        </button>
                                    </div>
                                )
                            } else {
                                return null
                            }
                        })
                    }
                </div>
            </div>
        )
    } else {
        return null
    }
}