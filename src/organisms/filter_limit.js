import React from 'react'

// Toast
import ComponentCustomToast from "../molecules/container_toast"
import { toast } from 'react-toastify'
import { ucFirstWord } from "../modules/helpers/converter"

export default function ComponentLimit({ctx, type}) {
    function navigate(ctx, ord){
        sessionStorage.setItem(`${ucFirstWord(type)}_limit_${ctx}`, ord)
        toast.success(<ComponentCustomToast msg={ctx + " filtered"} />)
    }

    function getCollection(type){ 
        if(type == "table"){
            return [
                {
                    context: "15 Item/Page",
                    value: 15
                },
                {
                    context: "25 Item/Page",
                    value: 25
                },
                {
                    context: "50 Item/Page",
                    value: 50
                },
                {
                    context: "100 Item/Page",
                    value: 100
                },
            ]
        } else if(type == "pie"){
            return [
                {
                    context: "5 Item/Chart",
                    value: 5
                },
                {
                    context: "6 Item/Chart",
                    value: 6
                },
                {
                    context: "7 Item/Chart",
                    value: 7
                },
                {
                    context: "8 Item/Chart",
                    value: 8
                },
            ]
        } else if(type == "bar"){
            return [
                {
                    context: "10 Item/Chart",
                    value: 10
                },
                {
                    context: "11 Item/Chart",
                    value: 11
                },
                {
                    context: "12 Item/Chart",
                    value: 12
                },
                {
                    context: "13 Item/Chart",
                    value: 13
                },
                {
                    context: "14 Item/Chart",
                    value: 14
                },
                {
                    context: "15 Item/Chart",
                    value: 15
                },
            ]
        }
    }

    return (
        <div className="dropdown">
            <a className="btn btn-success dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                { sessionStorage.getItem(`${ucFirstWord(type)}_limit_${ctx}`) + " Item/Page" }
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">       
            {
                getCollection(type).map((item, i, idx) => {
                    return (
                        <li key={i}><button className="dropdown-item" onClick={(e) => navigate(ctx, item['value'])}>{ item['context'] }</button></li>
                    )
                })
            }
            </ul>
        </div>
    )
}