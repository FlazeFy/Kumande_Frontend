import React from 'react'
import { ucFirstChar } from "../../modules/helpers/converter";

export default function GetAnimaText({ctx, url}) {
    return (
        <div className='d-block mx-auto text-center'>
            <img className='img img-fluid my-4' src={url} style={{width:"400px"}}/>
            <h3 className='text-secondary'>{ucFirstChar(ctx)}</h3>
        </div>
    )
}