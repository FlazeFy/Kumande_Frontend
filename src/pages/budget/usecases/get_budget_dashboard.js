"use client"
import Axios from 'axios'
import React, { useRef } from 'react'
import { getLocal } from '../../../modules/storages/local'
import { useState, useEffect } from "react"
import GetRadialChart from '../../../components/charts/radial_chart'
import { convertDatetime, numberToPrice } from '../../../modules/helpers/converter'
import { faAngleDown, faAngleUp, faEdit, faRotateBackward, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import { add_firestore } from '../../../modules/firebase/command'
import { async } from '@firebase/util'

export default function GetBudgetDashboard({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState(null)
    const [totalAll, setTotalAll] = useState(0)
    const token = getLocal("token_key")
    const [resMsgAll, setResMsgAll] = useState([])

    // Form
    const [budgetTotal, setBudgetTotal] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")

    const [monthlyItem, setMonthlyItem] = useState(null)
    const [monthlyItemMonth, setMonthlyItemMonth] = useState(null)
    const [monthlyItemYear, setMonthlyItemYear] = useState(null)
    const [monthlyItemCurrentPage, setMonthlyItemCurrentPage] = useState(1) 
    const [monthlyItemMaxPage, setMonthlyItemMaxPage] = useState(1) 

    const budgetAmmount = useRef(null)

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des']
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/budget/dashboard`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data) 
                setTotalAll(result.total_all)

                setMonth(months[0])
                setYear(new Date().getFullYear())
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

    // Services
    const handleSubmit = async (e) => {
        try {
            let data = {
                budget_total: budgetTotal,
                month: month,
                year: year
            }

            data.firebase_id = await add_firestore(data, 'budget')
            
            const response = await Axios.post("http://127.0.0.1:8000/api/v1/budget/create", JSON.stringify(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(response.status == 200){
                Swal.fire({
                    title: "Success!",
                    text: "Budget saved",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
            setResMsgAll(error)
        }
    }

    const fetchMontlyPayment = async (month, year, page) => {
        try {
            setMonthlyItemMonth(month)
            setMonthlyItemYear(year)

            const response = await fetch(`http://127.0.0.1:8000/api/v1/payment/detail/month/${month}/year/${year}?page=`+page, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json()
            setIsLoaded(true)

            if (response.status === 200) {
                setMonthlyItem(result.data.data)
                setMonthlyItemCurrentPage(result.data.current_page)
                setMonthlyItemMaxPage(result.data.last_page)
            } else {
                setMonthlyItem(null)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No payment for this month!",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
            setResMsgAll(error)
        }
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
        let totalCoveredPayment = 0
        let largetBudget = 0
        let smallesBudget = 0
        
        const now = new Date()
        let currentYear = now.getFullYear() - 1
        let years = []
        for (let i = 0; i < 6; i++) {
            years.push(currentYear + i)
        }

        return (
            <div className='row pt-2'>
                {
                    items != null ?
                        <>
                            {
                                items.map((dt, idx) => {
                                    const percentage = (dt.payment_history.total_price / dt.budget_total * 100).toFixed(0)
                                    totalCoveredPayment = totalCoveredPayment + dt.payment_history.total_price
                                    if(dt.budget_total > largetBudget){
                                        largetBudget = dt.budget_total
                                    }
                                    if(smallesBudget == 0 || dt.budget_total < smallesBudget){
                                        smallesBudget = dt.budget_total
                                    }

                                    return(
                                        <div className='col-lg-3 col-md-4 col-sm-12 p-2'>
                                            <button className='btn container p-3 text-center shadow budget-plan-section' data-bs-toggle="modal" data-bs-target={"#paymentMonthlyModal"} onClick={(e)=>fetchMontlyPayment(dt.month, dt.year, 1)} title={'See history payment in '+dt.month+' '+dt.year}>
                                                <h4 className='mb-0 budget-plan-title'>Budget in {dt.month} {dt.year}</h4>
                                                <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>
                                                    {dt.payment_history.total_item === 0 ? (
                                                        <span className='fst-italic'>- No Payment Found -</span>
                                                    ) : (
                                                        <>
                                                            <b>{dt.payment_history.total_item}</b> payments with an average of <b>{'Rp. '+numberToPrice(dt.payment_history.average_payment)}</b>
                                                        </>
                                                    )}
                                                </p>                                    
                                                <GetRadialChart val={percentage > 100 ? 100 : percentage} label={percentage > 100 ? 'Overload!' : 'Rp. '+numberToPrice(dt.remain_budget)}/>
                                                <hr></hr>
                                                <div className='row'>
                                                    <div className='col'>
                                                        <h6 className='mb-0'>Budget</h6>
                                                        <p className='mb-0 budget-text'>Rp. {numberToPrice(dt.budget_total)}</p>
                                                    </div>
                                                    <div className='col'>
                                                        <h6 className='mb-0'>Spending</h6>
                                                        <p className='mb-0 spending-text'>Rp. {numberToPrice(dt.payment_history.total_price)}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    )
                                })
                            }
                            <div className="modal fade" id={"paymentMonthlyModal"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-xl">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Payment in {monthlyItemMonth} {monthlyItemYear}</h5>
                                            <button type="button" className="btn_close_modal" id="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                                        </div>
                                        <div className="modal-body text-center p-4">
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr>
                                                        <td>Consume Name</td>
                                                        <td>Consume Type</td>
                                                        <td>Payment Method</td>
                                                        <td>Payment Price</td>
                                                        <td>Props</td>
                                                        <td>Action</td>
                                                    </tr>
                                                </thead>
                                                <tbody className='text-start'>
                                                    {
                                                        monthlyItem && monthlyItem.map((dt, idx) => {
                                                            return (
                                                                <tr key={idx} className="payment-detail">
                                                                    <td>{dt.consume_name}</td>
                                                                    <td>{dt.consume_type}</td>
                                                                    <td>{dt.payment_method}</td>
                                                                    <td className='payment-price'>Rp. {numberToPrice(dt.payment_price)}</td>
                                                                    <td>
                                                                        <h6 className='mb-0'>Created At</h6>
                                                                        <p className='mb-0'>{convertDatetime(dt.created_at,'calendar')}</p>
                                                                    </td>
                                                                    <td>
                                                                        <button className='btn btn-warning w-100'><FontAwesomeIcon icon={faEdit}/> Edit</button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            {
                                                monthlyItemMaxPage > 0 ?
                                                    <div className='d-flex justify-content-start'>
                                                        {
                                                            Array.from({ length: monthlyItemMaxPage }, (v, i) => (
                                                                <button key={'page_'+i} onClick={() => fetchMontlyPayment(monthlyItemMonth, monthlyItemYear, i+1)} className={monthlyItemCurrentPage == i+1 ? 'btn btn-page active':'btn btn-page'}>{i+1}</button>
                                                            ))
                                                        }
                                                    </div>
                                                :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    : 
                        <></>
                }
                <div className='col-lg-3 col-md-4 col-sm-12 p-2'>
                    <button className='btn add container p-3 text-center shadow h-100 d-flex flex-column justify-content-between'
                        data-bs-toggle="modal" data-bs-target={"#addBudgetModal"}>
                        <div className='mb-4'>
                            <h4 className='mb-0'>Add Budget</h4>
                            <p className='mb-0'>Set a limit for your monthly spending, get alerts, and monitor it!</p>
                        </div>
                        <div className='w-100 mb-4'>
                            <img className='img img-fluid' style={{maxHeight:"160px"}} src={'/icons/BudgetData.png'}/>
                        </div>
                        {
                            (() => {
                                const totalUncovered = totalAll - totalCoveredPayment
                                return totalUncovered > 0 ?
                                    <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}>You have about <b>Rp. {numberToPrice(totalUncovered)}</b> spending that isn't monitored in the monthly budget</p>
                                :
                                    <p className='mb-0 text-secondary' style={{fontSize:"var(--textMD)"}}><b>Congrats!</b> All payments are monitored in the budget</p>
                            })()
                        }
                    </button>
                    <div className="modal fade" id={"addBudgetModal"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Budget</h5>
                                    <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                                </div>
                                <div className="modal-body text-center p-4">
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="form-floating mb-3">
                                                <select className="form-select" id="floatingSelect" onChange={(e)=>setYear(e.target.value)} aria-label="Floating label select example">
                                                    {
                                                        years.map((dt, idx) => {
                                                            return (
                                                                <option value={dt} selected={idx == 1 ? true : false}>{dt}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <label htmlFor="floatingSelect">Year</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className="form-floating mb-3">
                                                <select className="form-select" id="floatingSelect" onChange={(e)=>setMonth(e.target.value)} aria-label="Floating label select example">
                                                    {
                                                        months.map((dt, idx)=>{
                                                            return (
                                                                <option value={dt}>{dt}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <label htmlFor="floatingSelect">Month</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="form-floating">
                                                <input type="number" class="form-control" ref={budgetAmmount} onChange={(e)=>setBudgetTotal(e.target.value)} min={1} id="floatingInput"></input>
                                                <label for="floatingInput">Budget (Rp.)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-start mt-1'>
                                        {
                                            items != null ?
                                                <>
                                                    <a className='mt-2 mb-3 btn btn-warning text-white me-2' onClick={(e)=>budgetAmmount.current.value = smallesBudget} style={{fontSize:"var(--textMD)"}}><FontAwesomeIcon icon={faAngleDown}/> Smallest Budget</a>
                                                    <a className='mt-2 mb-3 btn btn-danger me-2' onClick={(e)=>budgetAmmount.current.value = largetBudget} style={{fontSize:"var(--textMD)"}}><FontAwesomeIcon icon={faAngleUp}/> Largest Budget</a>
                                                    <a className='mt-2 mb-3 btn btn-primary' onClick={(e)=>budgetAmmount.current.value = items[items.length -1].budget_total} style={{fontSize:"var(--textMD)"}}><FontAwesomeIcon icon={faRotateBackward}/> Last Budget</a>
                                                </>
                                            :
                                                <></>
                                        }
                                    </div>
                                    <button className="btn btn-success w-100 mt-2" onClick={handleSubmit}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
  