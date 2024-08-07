import * as React from "react"
import ComponentLeftNavbarToggle from "../../../atoms/navbar_toggle"
import ComponentLeftNavbar from "../../../organisms/left_navbar"
import ComponentMedstorySubNav from "../../../organisms/medstory_subnav"
import GetListReminder from "./usecases/get_list_reminder"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body">
            <ComponentMedstorySubNav active={"reminder"}/>
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
