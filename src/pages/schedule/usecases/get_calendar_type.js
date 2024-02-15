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
            <select class="form-select" id="floatingSelect" onChange={(e) => toogleStats(e.target.value)} aria-label="Floating label select example">
                <option value="total_spending" selected={selectedCalendarType === 'total_spending' ? true : false}>Total Spending</option>
                <option value="total_calorie" selected={selectedCalendarType === 'total_calorie' ? true : false}>Total Calorie</option>
                <option value="all_consume" selected={selectedCalendarType === 'all_consume' ? true : false}>All Consume</option>
            </select>
            <label for="floatingSelect">Select Context</label>
        </div>
    )
}
  
