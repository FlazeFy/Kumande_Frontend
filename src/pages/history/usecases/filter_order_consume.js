import React from 'react'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterOrderConsume() {
    function toogle(val) {
        storeLocal("Table_order_all_consume",val) 

        window.location.reload(false)
    }

    const selectedConsumeOrder = getLocal("Table_order_all_consume")

    return (
        <div className="form-floating mb-3">
            <select class="form-select" id="floatingSelect" onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="desc" selected={selectedConsumeOrder === 'desc' ? true : false}>Descending</option>
                <option value="asc" selected={selectedConsumeOrder === 'asc' ? true : false}>Ascending</option>
            </select>
            <label for="floatingSelect">Order By Date</label>
        </div>
    )
}
  
