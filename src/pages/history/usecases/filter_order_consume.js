import React from 'react'
import { storeLocal, getLocal } from '../../../modules/storages/local'

export default function FilterOrderConsume(props) {
    const toogle = (val) => {
        storeLocal("Table_order_all_consume",val) 
        props.onchange()
    }

    return (
        <div className="form-floating mb-3">
            <select className="form-select" defaultValue={getLocal("Table_order_all_consume")} id="floatingSelect" onChange={(e) => toogle(e.target.value)} aria-label="Floating label select example">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
            <label htmlFor="floatingSelect">Order By Date</label>
        </div>
    )
}
  
