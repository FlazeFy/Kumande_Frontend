import * as React from "react"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import GetListDashboard from "./usecases/get_list_dashboard"

const ListPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="list"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
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
