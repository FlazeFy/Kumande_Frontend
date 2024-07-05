import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import GetNavbar from "../../../components/bars/navbar"
import GetNavbarToggle from "../../../components/bars/navbartoggle"
import GetMyBodyInfo from "./usecases/get_my_body_info"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetMedstorySubNav active={"mybody"}/>
            <div className="nav-sub content">
              <GetMyBodyInfo ctx={"my_body_info"}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MedstoryPage

export const Head = () => <title>Medstory Page</title>
