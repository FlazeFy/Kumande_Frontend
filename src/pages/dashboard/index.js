import * as React from "react"
import GetNavbar from "../../components/bars/navbar"

const DashboardPage = () => {
  return (
    <main>
      <GetNavbar/>
      <div id="content" className="p-4 p-md-5">
          <div className="container-fluid mb-3 position-fixed">
            <button type="button" id="sidebarCollapse" className="btn btn-primary">
            <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
          <p>asas</p>
        </div>
    </main>
  )
}

export default DashboardPage

export const Head = () => <title>Dashboard Page</title>
