export const storeLocal = (name,val) => {
    try {
        let res
        if (Array.isArray(val)) {
            res = JSON.stringify(val)
        } else {
            if(val == null){
                res = val
            } else {
                res = val.trim()
            }
        }
        localStorage.setItem(name, res)
    } catch (error) {
        throw error
    }
}

export const getLocal = (name) => {
    try {
        return localStorage.getItem(name)
    } catch (error) {
        throw error
    }
}