import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetBodyData from "./usecases/get_body_data"
import GetConsumeData from "./usecases/get_consume_data"
import GetMyProfile from "./usecases/get_my_profile"
import GetPaymentData from "./usecases/get_payment_data"

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
                <div className="col-lg-4">
                  <GetPaymentData ctx="get_spending_data"/>
                </div>
                <div className="col-lg-4">
                  <GetBodyData ctx="get_body_data"/>
                </div>
                <div className="col-lg-4">
                  <GetConsumeData ctx="get_consume_data"/>
                </div>
                <div className="col-lg-6">
                  <GetMyProfile ctx="get_my_profile"/>
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
