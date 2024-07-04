import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetListDashboard from "./usecases/get_list_dashboard"
import GetListStarted from "./usecases/get_list_started"

const ListPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="list"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetListDashboard ctx=""/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ListPage

export const Head = () => <title>List Page</title>