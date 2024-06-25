import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetBudgetDashboard from "./usecases/get_budget_dashboard"

const BudgetPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="budget"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <GetBudgetDashboard ctx="budget_dashboard"/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BudgetPage

export const Head = () => <title>Budget Page</title>
