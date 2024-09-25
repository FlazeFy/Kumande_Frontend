"use client"
import React from 'react'

export default function ComponentTextMessageNoData(props){
    if(props.is_with_image){
        return (
            <div className='d-block mx-auto text-center'>
                <img className='img img-fluid my-4' src={props.url} style={{width:"400px"}} alt={props.url}/>
                <h3 className='text-secondary'>{props.message}</h3>
            </div>
        )
    } else {
        return <a className='fst-italic text-secondary'>- {props.message} -</a>
    }
}