import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import { getTodayDate } from "../../modules/helpers/generator"
import { getLocal } from "../../modules/storages/local"
import GetMostConsumeFrom from "./usecases/get_most_consume_from"
import GetMostConsumeMainIng from "./usecases/get_most_consume_main_ing"
import GetMostConsumeProvide from "./usecases/get_most_consume_provide"
import GetMostConsumeType from "./usecases/get_most_consume_type"
import GetStatsType from "./usecases/get_stats_type"
import GetTotalDailyCal from "./usecases/get_total_daily_cal"
import GetTotalSpending from "./usecases/get_total_spending"

const StatsPage = () => {
    const selectedStatsType = getLocal("stats_type_sess")
    const yr =  getTodayDate('year')
    const mon =  getTodayDate('month_name')

    return (
        <main>
            <div className="wrapper d-flex align-items-stretch">
                <GetNavbar active="dashboard"/>
                <div id="content" className="p-4 p-md-5">
                    <GetNavbarToggle/>
                    <div id="content-body">
                        <GetStatsType/>
                        {
                            selectedStatsType == "consume" ?
                                <div className="row">
                                    <div className="col-lg-4 col-md-4 col-sm-6 py-3">
                                        <GetMostConsumeType ctx="most consume type"/>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-6 py-3">
                                        <GetMostConsumeFrom ctx="most consume from"/>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-6 py-3">
                                        <GetMostConsumeProvide ctx="most consume provide"/>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-6 py-3">
                                        <GetMostConsumeMainIng ctx="most consume main ingredient"/>
                                    </div>
                                </div>
                            : selectedStatsType == "spending" ?
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 py-3">
                                        <GetTotalSpending ctx={"total spending "+yr} filter_name="total_spending"/>
                                    </div>
                                </div>
                            : selectedStatsType == "health" ?
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 py-3">
                                        <GetTotalDailyCal ctx={"total daily cal "+mon+" "+yr} filter_name="total_daily_cal"/>
                                    </div>
                                </div>
                            :
                                <></>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default StatsPage

export const Head = () => <title>Stats Page</title>
