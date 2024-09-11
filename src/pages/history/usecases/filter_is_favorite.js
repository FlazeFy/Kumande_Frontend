import React from 'react'
import { isMobile } from '../../../modules/helpers/validator'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterIsFavoriteConsume() {
    const is_mobile = isMobile()

    function toogle(val) {
        storeLocal("Table_filter_favorite_all_consume",val) 

        window.location.reload(false)
    }

    const selectedIsFav = getLocal("Table_filter_favorite_all_consume")

    return (
        <div className={is_mobile ? "form-floating mb-3":"form-floating mb-3 ms-3"}>
            <select className="form-select" defaultValue={selectedIsFav} id="floatingSelect" style={{minWidth:"150px"}} onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="all">All</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
            <label htmlFor="floatingSelect">Filter By Favorite</label>
        </div>
    )
}
  
