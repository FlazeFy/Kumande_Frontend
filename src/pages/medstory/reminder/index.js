import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import GetNavbar from "../../../components/bars/navbar"
import GetNavbarToggle from "../../../components/bars/navbartoggle"
import GetListReminder from "./usecases/get_list_reminder"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
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
