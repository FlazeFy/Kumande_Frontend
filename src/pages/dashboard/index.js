import * as React from "react"
import ComponentLeftNavbarToggle from "../../components/bars/navbartoggle"
import ComponentButtonContentImg from "../../molecules/button_content_img"
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
                <ComponentButtonContentImg button_title="Statistic" icon_url='/icons/Statistics.png' url="stats" button_content={
                  <p className="my-0" style={{fontSize:"var(--textMD)"}}>Consume, Spending, Health, Budget</p>
                }/>
                <GetFullfilCalorie ctx="Today Calories"/>
                <ComponentButtonContentImg button_title="Tag" icon_url='/icons/Tag.png' url="tag" button_content={
                  <p className="my-0" style={{fontSize:"var(--textMD)"}}>Mark your consume and let us analyze it!</p>
                }/>
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
