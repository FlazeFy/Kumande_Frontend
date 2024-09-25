import React from 'react';

//Font awesome classicon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIcons, faWarning } from "@fortawesome/free-solid-svg-icons"
import { getCleanTitleFromCtx, ucFirstChar } from '../modules/helpers/converter'
import ComponentText from '../atoms/text'

export default function ComponentAlertBox(props) {
    return (
        <div>
            {
                props.type === 'error' && <ComponentText body={getCleanTitleFromCtx(props.context)} text_type="sub_heading"/>
            }
            <div className={`alert alert-${props.type}`} role='alert'>
                <h4><FontAwesomeIcon icon={props.type === 'warning' || props.type === 'danger' ? faWarning : faIcons}/> {ucFirstChar(props.type === 'danger' ? 'error':props.type)}</h4>
                {props.message}
            </div>
        </div>
    )
}