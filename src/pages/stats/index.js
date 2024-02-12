import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetMostConsumeFrom from "./usecases/get_most_consume_from"
import GetMostConsumeMainIng from "./usecases/get_most_consume_main_ing"
import GetMostConsumeProvide from "./usecases/get_most_consume_provide"
import GetMostConsumeType from "./usecases/get_most_consume_type"

const StatsPage = () => {
  return (
    <main>
        <div className="wrapper d-flex align-items-stretch">
            <GetNavbar active="dashboard"/>
            <div id="content" className="p-4 p-md-5">
                <GetNavbarToggle/>
                <div id="content-body">
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
                </div>
            </div>
        </div>
    </main>
  )
}

export default StatsPage

export const Head = () => <title>Stats Page</title>