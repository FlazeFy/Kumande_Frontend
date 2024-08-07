import * as React from "react"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"
import { getLocal, storeLocal } from "../../modules/storages/local"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import GetCalendarType from "./usecases/get_calendar_type"
import GetDailyCalendar from "./usecases/get_daily_calendar"
import GetMySchedule from "./usecases/get_my_schedule"

const SchedulePage = () => {
  if(getLocal("calendar_type_sess") == null){
    storeLocal("calendar_type_sess",'total_calorie') 
  } 

  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="schedule"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body" className='d-block mx-auto' style={{width:"1080px"}}>
            <GetCalendarType/>
            <GetDailyCalendar ctx={"daily_"+getLocal("calendar_type_sess")}/>
            <GetMySchedule ctx="my_schedule"/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SchedulePage

export const Head = () => <title>Schedule Page</title>
