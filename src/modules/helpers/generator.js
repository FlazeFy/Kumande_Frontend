export const getTodayDate = (type) => {
    try {
        const today = new Date()
        let options 
        
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
        }
        
        const res = today.toLocaleDateString('en-US', options)

        return res
    } catch (err) {
        throw err
    }
}
