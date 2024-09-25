import React from 'react'
import { getLocal } from '../../../modules/storages/local'

export default function GetCalendarType(props) {
    const toogleStats = (val) => {
        props.onchange(val)
    }

    const selectedCalendarType = getLocal("calendar_type_sess")

    return (
        <div className="form-floating mb-3">
            <select className="form-select" defaultValue={selectedCalendarType} id="floatingSelect" onChange={(e) => toogleStats(e.target.value)} aria-label="Floating label select example">
                <option value="daily_total_spending">Total Spending</option>
                <option value="daily_total_calorie">Total Calorie</option>
                <option value="daily_all_consume">All Consume</option>
            </select>
            <label htmlFor="floatingSelect">Select Context</label>
        </div>
    )
}
  
