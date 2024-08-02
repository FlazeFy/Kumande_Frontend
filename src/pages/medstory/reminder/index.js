import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import ComponentLeftNavbarToggle from "../../../components/bars/navbartoggle"
import ComponentLeftNavbar from "../../../organisms/left_navbar"
import GetListReminder from "./usecases/get_list_reminder"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body">
            <GetMedstorySubNav active={"reminder"}/>
            <div className="nav-sub content">
              <GetListReminder ctx={"get_list_reminder"}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MedstoryPage

export const Head = () => <title>Medstory Page</title>
