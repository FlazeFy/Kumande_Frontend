export const ucFirstChar = (val) => {
    try {
        return val.charAt(0).toUpperCase() + val.slice(1)
    } catch (error) {
        throw error
    }
}

export const ucFirstWord = (val) => {
    try {
        const words = val.split(' ')
        const caps = words.map(wd => {
            return wd.charAt(0).toUpperCase() + wd.slice(1)
        });
        const res = caps.join(' ')

        return res
    } catch (error) {
        throw error
    }
}

export const getCleanTitleFromCtx = (val) => {
    try {
        const newVal = val.replaceAll('_', ' ')
        const cap = newVal.split(" ").
            map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        
        return cap
    } catch (error) {
        throw error
    }
}

export const convertDatetime = (val, type) => {
    try {
        if(val){
            const result = new Date(val)
    
            if (type == "full") {
                const now = new Date(Date.now())
                const yesterday = new Date()
                const tomorrow = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                tomorrow.setDate(tomorrow.getDate() + 1)
                
                if (result.toDateString() === now.toDateString()) {
                    return ` today_at ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
                } else if (result.toDateString() === yesterday.toDateString()) {
                    return ` yesterday_at ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
                } else if (result.toDateString() === tomorrow.toDateString()) {
                    return ` tommorow_at ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
                } else {
                    return ` ${result.getFullYear()}/${(result.getMonth() + 1)}/${("0" + result.getDate()).slice(-2)} ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
                }
            } else if (type == "24h" || type == "12h") {
                return `${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`;
            } else if (type == "datetime") {
                return ` ${result.getFullYear()}/${(result.getMonth() + 1)}/${("0" + result.getDate()).slice(-2)} ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
            } else if (type == "date") {
                return `${result.getFullYear()}-${("0" + (result.getMonth() + 1)).slice(-2)}-${("0" + result.getDate()).slice(-2)}`
            } else if (type == "calendar") {
                const result = new Date(val)
                const offsetHours = getUTCHourOffset()
                result.setUTCHours(result.getUTCHours() + offsetHours)
            
                return `${result.getFullYear()}-${("0" + (result.getMonth() + 1)).slice(-2)}-${("0" + result.getDate()).slice(-2)} ${("0" + result.getHours()).slice(-2)}:${("0" + result.getMinutes()).slice(-2)}`
            }        
        } else {
            return "-"
        }
    } catch (error) {
        throw error
    }
}

export const getUTCHourOffset = (val, type) => {
    try {
        const offsetMi = new Date().getTimezoneOffset()
        const res = -offsetMi / 60
        return res
    } catch (error) {
        throw error
    }
}

export const convertSignedNumber = (num, ctx) => {
    if(ctx == "+"){
        if(num < 0){
            return num * -1
        } else {
            return num
        }
    } else if (ctx == "-"){
        if(num > 0){
            return num * -1
        } else {
            return num
        }
    } else {
        return false
    }
}

export const calculateAge = (val) => {
    const today = new Date()
    const birthDate = new Date(val)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}