import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import ComponentLeftNavbarToggle from "../../../components/bars/navbartoggle"
import ComponentLeftNavbar from "../../../organisms/left_navbar"
import GetMyBodyInfo from "./usecases/get_my_body_info"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
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
