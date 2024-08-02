import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import ComponentLeftNavbarToggle from "../../../components/bars/navbartoggle"
import ComponentLeftNavbar from "../../../organisms/left_navbar"
import GetAllergic from "./usecases/get_allergic"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body">
            <GetMedstorySubNav active={"allergic"}/>
            <div className="nav-sub content">
              <GetAllergic ctx={"get_allergic"}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MedstoryPage

export const Head = () => <title>Medstory Page</title>
