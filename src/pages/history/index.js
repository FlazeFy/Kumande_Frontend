import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetAllConsumePagination from "./usecases/get_all_consume_pagination"

const HistoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="history"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetAllConsumePagination ctx="all_consume"/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HistoryPage

export const Head = () => <title>History Page</title>
