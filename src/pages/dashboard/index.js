import * as React from "react"
import ComponentLeftNavbarToggle from "../../components/bars/navbartoggle"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import GetAnalyticPaymentMonth from "./usecases/get_analytic_payment_month"
import GetCurrentMonthBudget from "./usecases/get_current_month_budget"
import GetFullfilCalorie from "./usecases/get_fullfil_calorie"
import GetTodaySchedule from "./usecases/get_today_schedule"

const DashboardPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="dashboard"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body">
            <GetTodaySchedule ctx="Today's Schedule"/>
            <div style={{marginBottom:"var(--spaceMD)"}}/>
            <GetAnalyticPaymentMonth ctx="Payment's Analytic (Monthly)"/>
            <div style={{marginBottom:"var(--spaceMD)"}}/>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6">
                <a className='container p-2 mb-3 d-flex justify-content-start text-white' href="/stats" style={{backgroundImage: "linear-gradient(to right, var(--primaryColor) , var(--primaryLightBG))", cursor:"pointer"}}>
                  <div>
                      <img className='img-icon-lg' src={'/icons/Statistics.png'}/>
                  </div>
                  <div className='pt-2 ps-3'>
                    <h5 className="mb-1">Statistic</h5>
                    <p className="my-0" style={{fontSize:"var(--textMD)"}}>Consume, Spending, Health, Budget</p>
                  </div>
                </a>
                <GetFullfilCalorie ctx="Today Calories"/>
                <a className='container p-2 my-3 d-flex justify-content-start text-white' href="/tag" style={{backgroundImage: "linear-gradient(to right, var(--primaryColor) , var(--primaryLightBG))", cursor:"pointer"}}>
                  <div>
                      <img className='img-icon-lg' src={'/icons/Tag.png'}/>
                  </div>
                  <div className='pt-2 ps-3'>
                    <h5 className="mb-1">Tag</h5>
                    <p className="my-0" style={{fontSize:"var(--textMD)"}}>Mark your consume and let us analyze it!</p>
                  </div>
                </a>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
                <GetCurrentMonthBudget ctx="current_month_budget"/>
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
