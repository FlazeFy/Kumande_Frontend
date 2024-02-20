import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetBodyData from "./usecases/get_body_data"

const ProfilePage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="profile"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <div className="d-block mx-auto" style={{maxWidth:"1080px"}}>
              <div className="row">
                <div className="col">
                  <GetBodyData ctx="get_body_data"/>
                </div>
                <div className="col">
                  
                </div>
                <div className="col">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage

export const Head = () => <title>Profile Page</title>
