import * as React from "react"
import { useState, useEffect } from "react"
import { getLocal } from "../../../modules/storages/local"
import Swal from 'sweetalert2'
import GetSimilarConsume from "./usecases/get_similar_consume"
import ComponentLeftNavbar from "../../../organisms/left_navbar"
import ComponentContainerConsume from "../../../organisms/container_consume"
import ComponentLeftNavbarToggle from "../../../atoms/navbar_toggle"
import GetConsumeGallery from "./usecases/get_consume_gallery"

export default function ConsumeDetail({ params }) {
  //Initial variable
  const ctx = 'detail_'
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [item, setItem] = useState(null)
  const token = getLocal("token_key")

  useEffect(() => {
    fetchConsume()
  },[])

  const fetchConsume = () => {
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
  }

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
          <ComponentLeftNavbar active="history"/>
          <div id="content" className="p-4 p-md-5">
            <ComponentLeftNavbarToggle/>
            <div id="content-body">
              <ComponentContainerConsume fetchConsume={fetchConsume} ctx="consume_detail" items={item} type="detail"/>
              <GetConsumeGallery slug={item.slug_name} consume_name={item.consume_name}/>
              <GetSimilarConsume ctx={`similar_consume`} provide={item.consume_detail[0].provide} main_ing={item.consume_detail[0].main_ing} 
                consume_from={item.consume_from} consume_type={item.consume_type} month={month} year={year} slug={item.slug_name}/>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
export const Head = () => <title>Consume Detail Page</title>
