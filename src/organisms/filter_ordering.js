import controls from './controls.module.css'

// Toast
import ComponentCustomToast from "../molecules/container_toast"
import { toast } from 'react-toastify'

export default function ComponentOrdering({ctx}) {
    function navigate(ctx, ord){
        sessionStorage.setItem(`Table_order_${ctx}`, ord)
        toast.success(<ComponentCustomToast msg={ctx + " filtered"} />)
    }

    return (
        <>       
            {
                sessionStorage.getItem(`Table_order_${ctx}`) === "desc" ? 
                    <button className={controls.control_box} onClick={(e) => navigate(ctx,"asc")}>Order By Descending</button>
                :
                    <button className={controls.control_box} onClick={(e) => navigate(ctx,"desc")}>Order By Ascending</button>
            }
        </>
    )
}