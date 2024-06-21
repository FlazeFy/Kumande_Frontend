import * as React from "react"
import { useState, useEffect } from "react"
import GetNavbar from "../../../components/bars/navbar"
import GetNavbarToggle from "../../../components/bars/navbartoggle"
import { getLocal } from "../../../modules/storages/local"
import Swal from 'sweetalert2'
import GetConsumeBox from "../../../components/containers/consume_box"
import GetSimilarProvide from "./usecases/get_similar_provide"
import GetSimilarMainIng from "./usecases/get_similar_main_ing"
import GetSimilarConsumeFrom from "./usecases/get_similar_consume_from"
import GetSimilarYearMonthCreated from "./usecases/get_similar_year_month_created"
import GetSimilarConsumeType from "./usecases/get_similar_consume_type"

export default function ConsumeDetail({ params }) {
  //Initial variable
  const ctx = 'detail_'
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [item, setItem] = useState(null)
  const token = getLocal("token_key")

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/consume/detail/'+params.slug, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
      .then(
      (result) => {
        setIsLoaded(true)
        setItem(result.data)        
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        })
        if(getLocal(ctx + "_sess") !== undefined){
          setIsLoaded(true)
          setItem(JSON.parse(getLocal(ctx + "_sess")))
        } else {
          setIsLoaded(true)
          setError(error)
        }
      }
    )
  },[])

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
      return (
          <div>
              <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
          </div>
      )
  } else {
    const date = new Date(item.created_at)
    const month = date.getMonth()+1
    const year = date.getFullYear()
  
    return (
      <main>
        <div className="wrapper d-flex align-items-stretch">
          <GetNavbar active="history"/>
          <div id="content" className="p-4 p-md-5">
            <GetNavbarToggle/>
            <div id="content-body">
              <GetConsumeBox ctx="consume_detail" items={item} type="detail"/>
              <GetSimilarProvide ctx="similar_provide" provide={item.consume_detail[0].provide} slug={item.slug_name}/>
              <GetSimilarMainIng ctx="similar_main_ing" main_ing={item.consume_detail[0].main_ing} slug={item.slug_name}/>
              <GetSimilarConsumeFrom ctx="similar_consume_from" consume_from={item.consume_from} slug={item.slug_name}/>
              <GetSimilarConsumeType ctx="similar_consume_type" consume_type={item.consume_type} slug={item.slug_name}/>
              <GetSimilarYearMonthCreated ctx={`similar_consume_${month}_${year}`} month={month} year={year} slug={item.slug_name}/>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
export const Head = () => <title>Consume Detail Page</title>
