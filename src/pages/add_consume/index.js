import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import PostConsume from "./usecases/post_consume"

const AddConsume = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <GetNavbar active="dashboard"/>
        <div id="content" className="p-4 p-md-5">
          <GetNavbarToggle/>
          <div id="content-body">
            <PostConsume/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AddConsume

export const Head = () => <title>Add Consume Page</title>
