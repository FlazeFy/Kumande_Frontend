import React from 'react'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function GetStatsType() {
    function toogleStats(val) {
        storeLocal("stats_type_sess",val) 

        window.location.reload(false)
    }

    const selectedStatsType = getLocal("stats_type_sess")

    return (
        <div className="form-floating mb-3">
            <select class="form-select" id="floatingSelect" onChange={(e) => toogleStats(e.target.value)} aria-label="Floating label select example">
                <option value="consume" selected={selectedStatsType === 'consume' ? true : false}>Consume</option>
                <option value="spending" selected={selectedStatsType === 'spending' ? true : false}>Spending</option>
                <option value="health" selected={selectedStatsType === 'health' ? true : false}>Health</option>
                <option value="budget" selected={selectedStatsType === 'budget' ? true : false}>Bugdet</option>
            </select>
            <label htmlFor="floatingSelect">Select Context</label>
        </div>
    )
}
  
