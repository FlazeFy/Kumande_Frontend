"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { ucFirstWord } from '../../../modules/helpers/converter'
import { getLocal } from '../../../modules/storages/local'

//Font awesome classicon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faBowlRice, faCake, faMugSaucer } from "@fortawesome/free-solid-svg-icons"

export default function GetListStarted({ ctx }) {
    // Initial state variables
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const [chunkedItems, setChunkedItems] = useState([])
    const token = getLocal("token_key")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/consume/list/select`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true)
                    setItem(result.data)

                    const chunkArray = (array, size) => {
                        const chunked = []
                        for (let i = 0; i < array.length; i += size) {
                            chunked.push(array.slice(i, i + size))
                        }
                        return chunked
                    }
                    setChunkedItems(chunkArray(result.data, 6))
                },
                (error) => {
                    if (getLocal(ctx + "_sess") !== undefined) {
                        setIsLoaded(true)
                        setItem(JSON.parse(getLocal(ctx + "_sess")))
                    } else {
                        setIsLoaded(true)
                        setError(error)
                    }
                }
            );
    }, [ctx, token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        );
    } else {
        return (
            <div className='row h-100'>
                <div className='col-lg-5 mx-auto my-auto'>
                    <div className="tag-list">
                        {
                            chunkedItems.map((chunk, chunkIndex) => (
                                <div className="loop-slider mx-auto" key={chunkIndex} style={{ '--duration': '15951ms', '--direction': 'normal' }}>
                                    <div className="inner">
                                        {
                                            chunk.map((elmt, index) => (
                                                <div className="btn btn-tag" style={{whiteSpace:"nowrap"}} key={index}>
                                                    {
                                                        elmt.consume_type == 'Food' ?
                                                            <FontAwesomeIcon icon={faBowlRice} className='me-2'/>
                                                        : elmt.consume_type == 'Drink' ?
                                                            <FontAwesomeIcon icon={faMugSaucer} className='me-2'/>
                                                        : elmt.consume_type == 'Snack' ?
                                                            <FontAwesomeIcon icon={faCake} className='me-2'/>
                                                        : 
                                                            <></>
                                                    }
                                                    {elmt.consume_name}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <div className="fade"></div>
                    </div>
                </div>
                <div className='col-lg-4 mx-auto text-center'>
                    <img className='img img-fluid' src={'/icons/Confused.png'} alt="Confused" />
                    <h5>Confused how to manage your consume schedule? Do you want to group all in similiar list or your favorite food?</h5>
                    <a className='btn btn-success px-4 py-3 rounded-pill mt-4'><FontAwesomeIcon icon={faAdd} className='me-2'/> Make List Now!</a>
                </div>
            </div>
        );
    }
}