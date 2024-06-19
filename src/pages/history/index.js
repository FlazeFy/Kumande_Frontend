import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetAllConsumePagination from "./usecases/get_all_consume_pagination"

// Font awesome icon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons"

const HistoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="history"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
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
