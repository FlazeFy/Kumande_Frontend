import React from 'react'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterIsFavoriteConsume() {
    function toogle(val) {
        storeLocal("Table_filter_favorite_all_consume",val) 

        window.location.reload(false)
    }

    const selectedIsFav = getLocal("Table_filter_favorite_all_consume")

    return (
        <div className="form-floating mb-3 ms-3">
            <select class="form-select" id="floatingSelect" style={{minWidth:"150px"}} onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="all" selected={selectedIsFav === 'all' ? true : false}>All</option>
                <option value="1" selected={selectedIsFav === '1' ? true : false}>Yes</option>
                <option value="0" selected={selectedIsFav === '0' ? true : false}>No</option>
            </select>
            <label for="floatingSelect">Filter By Favorite</label>
        </div>
    )
}
  
