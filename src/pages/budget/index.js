import * as React from "react"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import GetBudgetDashboard from "./usecases/get_budget_dashboard"

const BudgetPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="budget"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
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
