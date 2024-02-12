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
                <a className='container p-2 d-flex justify-content-start text-white' href="/stats" style={{backgroundImage: "linear-gradient(to right, var(--primaryColor) , var(--primaryLightBG))", cursor:"pointer"}}>
                  <div>
                      <img className='img-icon-lg' src={'/icons/Statistics.png'}/>
                  </div>
                  <div className='pt-2 ps-3'>
                    <h5 className="mb-1">Statistic</h5>
                    <p className="my-0" style={{fontSize:"var(--textMD)"}}>Consume, Spending, Health, Budget</p>
                  </div>
                </a>
              </div>
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
