import React from 'react'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function GetCalendarType() {
    function toogleStats(val) {
        storeLocal("calendar_type_sess",val) 

        window.location.reload(false)
    }

    const selectedCalendarType = getLocal("calendar_type_sess")

    return (
        <div className="form-floating mb-3">
            <select className="form-select" defaultValue={selectedCalendarType} id="floatingSelect" onChange={(e) => toogleStats(e.target.value)} aria-label="Floating label select example">
                <option value="total_spending">Total Spending</option>
                <option value="total_calorie">Total Calorie</option>
                <option value="all_consume">All Consume</option>
            </select>
            <label htmlFor="floatingSelect">Select Context</label>
        </div>
    )
}
  
