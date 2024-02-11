import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
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
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage

export const Head = () => <title>Dashboard Page</title>
