export const getTodayDate = (type) => {
    try {
        const today = new Date()
        let options 
        let res
        
        if(type == 'day'){
            options = { 
                weekday: 'short'
            }
        } else if(type == 'month'){
            options = { 
                month: 'numeric'
            }
        } else if(type == 'year'){
            options = { 
                year: 'numeric'  
            }
        } else if(type == 'yyyy-MM-dd'){
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            res = `${year}-${month}-${day}`
        }
        
        if(type !== 'yyyy-MM-dd'){
            res = today.toLocaleDateString('en-US', options)
        }

        return res
    } catch (err) {
        throw err
    }
}
