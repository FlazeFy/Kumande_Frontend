import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetMapsboard from "./usecases/get_maps_board"

const MapsPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="maps"/>
        <div id="content" className="p-0">
          <div style={{position:"fixed", top:"10px", marginLeft:"var(--spaceMD)", zIndex:"1000"}}>
            <GetNavbarToggle/>
          </div>
          <div id="content-body" className="m-0">
            <GetMapsboard/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MapsPage

export const Head = () => <title>Maps Page</title>
