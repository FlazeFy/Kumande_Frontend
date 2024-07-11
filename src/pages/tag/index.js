import * as React from "react"
import GetNavbar from "../../components/bars/navbar"
import GetNavbarToggle from "../../components/bars/navbartoggle"
import GetMyTag from "./usecases/get_my_tag"

const TagPage = () => {
    return (
        <main>
            <div className="wrapper d-flex align-items-stretch">
                <GetNavbar active="dashboard"/>
                <div id="content" className="p-4 p-md-5">
                    <GetNavbarToggle/>
                    <div id="content-body">
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-sm-12">

                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-12">
                                <GetMyTag ctx={"my_tag"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default TagPage

export const Head = () => <title>Tag Page</title>
