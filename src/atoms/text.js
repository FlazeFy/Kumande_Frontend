import React from "react"

export default function ComponentText(props){
    const defaultStyle = {
        sub_content: {
            fontSize:"var(--textLG)",
            ...props.text_style,
        },
        mini_content: {
            fontSize:"var(--textMD)",
            ...props.text_style,
        }
    }

    if(props.text_type == 'main_heading'){
        return <h2 className="mb-1">{props.body}</h2>
    } else if(props.text_type == 'sub_heading'){
        return <h5 className="mb-1">{props.body}</h5>
    } else if(props.text_type == 'mini_sub_heading'){
        return <h6 className="mb-1">{props.body}</h6>
    } else if(props.text_type == 'main_content'){

    } else if(props.text_type == 'sub_content'){
        return <p className="my-0 text-secondary" style={defaultStyle.sub_content}>{props.body}</p>
    } else if(props.text_type == 'mini_content'){
        return <p className="my-0 text-secondary" style={defaultStyle.mini_content}>{props.body}</p>
    }
}