import * as React from "react"
import GetMedstorySubNav from "../../../components/bars/medstory_subnav"
import GetNavbar from "../../../components/bars/navbar"
import GetNavbarToggle from "../../../components/bars/navbartoggle"
import GetAllergic from "./usecases/get_allergic"

const MedstoryPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="medstory"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
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
