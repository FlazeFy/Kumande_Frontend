import { convertSignedNumber } from "./converter";

export const isNumInRange = (current, index, range) => {
    let res = true
    let dif = current - index

    if(convertSignedNumber(dif, "+") > range){
        res = false
    } 
    
    return res
}

export const countHalf = (val) => {
    if(val != 0){
        let res = Math.round(val / 2)
        return res
    } else {
        return 0
    }
}