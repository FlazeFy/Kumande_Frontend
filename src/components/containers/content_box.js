"use client"
import React from 'react'
import { ucFirstWord } from '../../modules/helpers/converter'

export default function GetContentBox({builder, items, urlImg, title}) {

    return (
        <div className="box-content-header">
            <img className='img img-fluid my-4' src={urlImg}/>
            <div className="content">
                <h3 className='text-white mb-3'>{title}</h3>
                <div className="row">
                    {
                        items.map((item, i, idx) => {
                            return (
                                builder.map((build, j, ins) => {
                                    
                                    return (
                                        <div className="col">
                                            <h6>{build['column_name']}</h6>
                                            <h6>{item[build['object_name']]} {build['extra_desc']}</h6>
                                        </div>
                                    )
                                })
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}