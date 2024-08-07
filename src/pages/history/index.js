import * as React from "react"
import GetAllConsumePagination from "./usecases/get_all_consume_pagination"

// Font awesome icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"

const HistoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="history"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body">
            <GetAllConsumePagination ctx="all_consume"/>
            <a className="btn btn-add" href="/add_consume"><FontAwesomeIcon icon={faPlusSquare} size="xl"/></a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HistoryPage

export const Head = () => <title>History Page</title>
