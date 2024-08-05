import React from "react"

export default function ComponentText(props){
    if(props.text_type == 'main_heading'){
        return <h2 className="mb-1">{props.body}</h2>
    } else if(props.text_type == 'sub_heading'){
        return <h5 className="mb-1">{props.body}</h5>
    } else if(props.text_type == 'main_content'){

    } else if(props.text_type == 'sub_content'){

    } else if(props.text_type == 'mini_content'){
        return <p className="my-0 text-secondary" style={{fontSize:"var(--textMD)"}}>{props.body}</p>
    }
}