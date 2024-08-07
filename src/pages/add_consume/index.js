import * as React from "react"
import ComponentLeftNavbarToggle from "../../atoms/navbar_toggle"
import ComponentLeftNavbar from "../../organisms/left_navbar"
import PostConsume from "./usecases/post_consume"

const AddConsume = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch">
        <ComponentLeftNavbar active="history"/>
        <div id="content" className="p-4 p-md-5">
          <ComponentLeftNavbarToggle/>
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
