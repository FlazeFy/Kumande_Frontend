import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"
import { isMobile } from "../modules/helpers/validator";

/**
 * This component renders a button based on the functionality specified
 *
 * @component
 * @example
 * ```jsx
 * <ComponentButton button_name='Dashboard' button_type='submenu' active='dashboard' url='dashboard'/>
 * <ComponentButton button_name='Open Image' button_type='modal' target='openImageModal' class='m-1 btn-success text-white p-2'/>
 * <ComponentButton button_name='westernfood' button_type='tag'/>
 * <ComponentButton button_name='Rice' button_type='main_ing'/>
 * <ComponentButton button_name={200} button_type='calorie'/>
 * <ComponentButton button_name='KFC' button_type='provide'/>
 * <ComponentButton button_name='Detail' id="detail-btn" url="/detail" button_type='primary'/>
 * ```
 * @param {Object} props - The props object
 * @param {string} props.button_type - Type of component to render
 * @param {string} props.active - Current active page
 * @param {string} props.url - URL where the page / section will go after click the button
 * @param {string} props.button_name - Text / Title of the button
 * @param {string} props.target- ID of the modal element to call
 * @param {string} props.id- ID of the button
 * 
 * @returns {React.Element}
 */
export default function ComponentButton(props){
    // Initial Variable
    const is_mobile = isMobile()

    const getActive = (val, curr) => {
        if(val == curr){
            return "active"
        } else {
            return ""
        }
    }

    if(props.button_type == 'menu'){
        return (
            <li className={getActive(props.active, props.url.split('/')[0])}>
                <a href={`/${props.url}`}>{props.icon} {props.button_name}</a>
            </li>
        )
    } else if(props.button_type == 'submenu'){
        return <a className={"nav-link "+getActive(props.active, props.url.split('/')[2])} href={props.url}>{props.button_name}</a>
    } else if(props.button_type == 'modal'){
        return (
            <a className={`border-0 rounded ${props.class}`} data-bs-toggle="modal" data-bs-target={`#${props.target}`}>
                {props.icon} {props.button_name}
            </a>
        )
    } else if(props.button_type == 'tag'){
        return <a className='btn btn-primary rounded-pill px-3 py-1 me-1'>#{props.button_name}</a>
    } else if(props.button_type == 'main_ing'){
        return <a className='btn btn-danger rounded-pill px-3 py-1 me-1'>{props.button_name}</a>
    } else if(props.button_type == 'calorie'){
        return <a className='btn btn-warning rounded-pill px-3 py-1 me-1'>{props.button_name} Cal</a>
    } else if(props.button_type == 'provide'){
        return (
            <a className='btn btn-success rounded-pill px-3 py-1 me-1'>
                {!is_mobile ? props.button_name : <><FontAwesomeIcon icon={faLocationDot}/> Maps</>}
            </a>
        )
    } else if(props.button_type == 'primary'){
        return <a className='btn btn-primary rounded px-3 py-2' id={props.id} href={props.url}>{props.button_name}</a>
    }
}