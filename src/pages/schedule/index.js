import * as React from "react"
import { useEffect } from "react"
import { useState } from "react"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"
import { getLocal, storeLocal } from "../../modules/storages/local"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import GetDailyCalendar from "./usecases/get_daily_calendar"
import GetMySchedule from "./usecases/get_my_schedule"

const SchedulePage = () => {
  const [calendarType, setCalendarType] = useState(getLocal("calendar_type_sess") || 'daily_total_calorie')

  useEffect(() => {
    if(getLocal("calendar_type_sess") == null){
      storeLocal("calendar_type_sess",'daily_total_calorie') 
    }
  }, []);

  const handleCalendarTypeChange = (val) => {
    storeLocal("calendar_type_sess", val)
    setCalendarType(val)
  };

  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="schedule"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
          <div id="content-body" className='d-block mx-auto' style={{width:"1080px"}}>
            <GetDailyCalendar ctx={calendarType} onchange={handleCalendarTypeChange}/>
            <GetMySchedule ctx="my_schedule"/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SchedulePage

export const Head = () => <title>Schedule Page</title>
