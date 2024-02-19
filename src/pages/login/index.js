import * as React from "react"
import PostLogin from "./usecases/postLogin"

const LoginPage = () => {
  return (
    <main>
      <div className="wrapper d-flex align-items-stretch" style={{backgroundImage: "linear-gradient(var(--primaryLightBG),var(--primaryColor))"}}>
        <div id="content" className="p-4 p-md-5">
          <div id="content-body">
            <PostLogin/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage

export const Head = () => <title>Login Page</title>
