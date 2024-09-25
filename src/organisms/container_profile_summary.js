"use client"
import React from 'react'

export default function ComponentProfileSummaryInfo({builder, items, urlImg, title}) {
    return (
        <div className="box-content-header">
            <img className='img img-fluid my-4' alt={urlImg} src={urlImg}/>
            <div className="content">
                <h3 className='text-white mb-3'>{title}</h3>
                <div className="row">
                    {
                        builder != null ?
                            items && items.length > 0 ?
                                items.map((item, i, idx) => {
                                    return (
                                        builder.map((build, idx) => {
                                            return (
                                                <div className="col" key={`profile_summary_info_${idx}`}>
                                                    <h6>{build['column_name']}</h6>
                                                    <h6>{item[build['object_name']]} {build['extra_desc']}</h6>
                                                </div>
                                            )
                                        })
                                    )
                                })
                            :
                                builder.map((build, idx) => {
                                    return (
                                        <div className="col" key={`profile_summary_info_${idx}`}>
                                            <h6>{build['column_name']}</h6>
                                            <h6>-</h6>
                                        </div>
                                    )
                                })
                        :
                            items.map((item, idx) => {
                                return (
                                    <div className="col" key={`profile_summary_info_${idx}`}>
                                        <h6>{item['context']}</h6>
                                        <h6>{item['total']}</h6>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}