import React from 'react'
import { isMobile } from '../../../modules/helpers/validator'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterConsumeType(props) {
    const is_mobile = isMobile()

    const toogle = (val) => {
        storeLocal("Table_filter_type_all_consume",val) 
        props.onchange()
    }

    const selectedConsumeType = getLocal("Table_filter_type_all_consume")

    return (
        <div className={is_mobile ? "form-floating mb-3":"form-floating mb-3 ms-3"}>
            <select className="form-select" defaultValue={selectedConsumeType} id="floatingSelect" style={{minWidth:"150px"}} onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="all">All</option>
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="snack">Snack</option>
            </select>
            <label htmlFor="floatingSelect">Filter By Type</label>
        </div>
    )
}
  
