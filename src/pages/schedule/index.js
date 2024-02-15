import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetCalendarType from "./usecases/get_calendar_type"
import GetDailyCalorie from "./usecases/get_daily_calorie"
import GetMySchedule from "./usecases/get_my_schedule"

const SchedulePage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="schedule"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetCalendarType/>
            <GetDailyCalorie ctx="daily_calorie"/>
            <GetMySchedule ctx="my_schedule"/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SchedulePage

export const Head = () => <title>Schedule Page</title>
