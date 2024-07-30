import React from 'react'
import { isMobile } from '../../../modules/helpers/validator'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterConsumeType() {
    const is_mobile = isMobile()

    function toogle(val) {
        storeLocal("Table_filter_type_all_consume",val) 

        window.location.reload(false)
    }

    const selectedConsumeType = getLocal("Table_filter_type_all_consume")

    return (
        <div className={is_mobile ? "form-floating mb-3":"form-floating mb-3 ms-3"}>
            <select class="form-select" id="floatingSelect" style={{minWidth:"150px"}} onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="all" selected={selectedConsumeType === 'all' ? true : false}>All</option>
                <option value="food" selected={selectedConsumeType === 'food' ? true : false}>Food</option>
                <option value="drink" selected={selectedConsumeType === 'drink' ? true : false}>Drink</option>
                <option value="snack" selected={selectedConsumeType === 'snack' ? true : false}>Snack</option>
            </select>
            <label for="floatingSelect">Filter By Type</label>
        </div>
    )
}
  
