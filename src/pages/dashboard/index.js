import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetAnalyticPaymentMonth from "./usecases/get_analytic_payment_month"
import GetFullfilCalorie from "./usecases/get_fullfil_calorie"
import GetTodaySchedule from "./usecases/get_today_schedule"

const DashboardPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="dashboard"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetTodaySchedule ctx="Today's Schedule"/>
            <div style={{marginBottom:"var(--spaceMD)"}}/>
            <GetAnalyticPaymentMonth ctx="Payment's Analytic (Monthly)"/>
            <div style={{marginBottom:"var(--spaceMD)"}}/>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6">
                <GetFullfilCalorie ctx="Today Calories"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage

export const Head = () => <title>Dashboard Page</title>
