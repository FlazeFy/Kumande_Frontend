import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'

const GetDataTable = (props) => {
    const [filteredData, setFilteredData] = useState(props.data)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setFilteredData(
            props.data.filter((item) =>
                Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
            )
        );
    }, [searchText, props.data]);

    return (
        <div>
            <input type="text" className='form-control' placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} 
                style={{maxWidth:"260px"}}/>
            <DataTable columns={props.columns} data={filteredData} pagination/>
        </div>
    );
};

export default GetDataTable
