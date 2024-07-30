import React from 'react'
import { isMobile } from '../../../modules/helpers/validator'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterConsumeLimit() {
    const is_mobile = isMobile()

    function toogle(val) {
        storeLocal("Table_limit_all_consume",val) 

        window.location.reload(false)
    }

    const selectedConsumeLimit = getLocal("Table_limit_all_consume")

    return (
        <div className={is_mobile ? "form-floating mb-3":"form-floating mb-3 ms-3"}>
            <select class="form-select" id="floatingSelect" style={{minWidth:"150px"}} onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="10" selected={selectedConsumeLimit === '10' ? true : false}>10</option>
                <option value="25" selected={selectedConsumeLimit === '25' ? true : false}>25</option>
                <option value="50" selected={selectedConsumeLimit === '50' ? true : false}>50</option>
                <option value="100" selected={selectedConsumeLimit === '100' ? true : false}>100</option>
            </select>
            <label for="floatingSelect">Limit Per Page</label>
        </div>
    )
}
  
