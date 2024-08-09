import React from "react"

/**
 * This component renders a text with icon
 *
 * @component
 * @example
 * ```jsx
 * <ComponentText text_type='main_heading' body='Lorem ipsum odor amet, consectetuer adipiscing elit'/>
 * <ComponentText text_type='sub_heading' body='Lorem ipsum odor amet, consectetuer adipiscing elit'/>
 * <ComponentText text_type='mini_sub_heading' body='Lorem ipsum odor amet, consectetuer adipiscing elit'/>
 * <ComponentText text_type='sub_content' body='Lorem ipsum odor amet, consectetuer adipiscing elit'/>
 * <ComponentText text_type='mini_content' body='Lorem ipsum odor amet, consectetuer adipiscing elit'/>
 * ```
 * @param {Object} props - The props object
 * @param {string} props.text_type - Type of component to render
 * @param {string} props.body - Text to show
 * 
 * @returns {React.Element}
 */
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