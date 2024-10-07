export const getTodayDate = (type) => {
    try {
        const today = new Date()
        let options 
        let res
        
        if(type === 'day'){
            options = { 
                weekday: 'short'
            }
        } else if(type === 'month'){
            options = { 
                month: 'numeric'
            }
        } else if(type === 'month_name'){
            options = { 
                month: 'short'
            }
        } else if(type === 'year'){
            options = { 
                year: 'numeric'  
            }
        } else if(type === 'yyyy-MM-dd'){
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            res = `${year}-${month}-${day}`
        }  else if (type === 'yyyy-MM-dd H:i') {
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const hours = String(today.getHours()).padStart(2, '0');
            const minutes = String(today.getMinutes()).padStart(2, '0');
            res = `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        
        if(type !== 'yyyy-MM-dd'){
            res = today.toLocaleDateString('en-US', options)
        }

        return res
    } catch (err) {
        throw err
    }
}

export const getMonthName = (val) => {
    const month_name = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const res = month_name[val]
    return res
}

export const getAllDay = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const day = today.getDay()
    const dayName = daysOfWeek[day]

    const startIdx = daysOfWeek.indexOf(dayName)
    const newDays = daysOfWeek.slice(startIdx).concat(daysOfWeek.slice(0, startIdx))

    return newDays
}

export const getErrorMessage = (val) => {
    let msg = ''
    
    if(typeof val === 'object'){
        const keys = Object.keys(val)

        keys.forEach(dt => {
            val[dt].forEach(valdt => {
                msg += `<li>${valdt}</li> `
            });
        });
    } else if(typeof val === 'string'){
        msg = val
    } else {
        msg = `Can't generated failed message`
    }
    return msg
}

export const getAge = (born) => {
    try {
        const birthDate = new Date(born)
        const today = new Date()
      
        let years = today.getFullYear() - birthDate.getFullYear()
        let months = today.getMonth() - birthDate.getMonth()
      
        if (months < 0) {
          years--
          months += 12
        }

        const res = `${years} Years ${months} Months`
      
        return res
    } catch (err) {
        throw err
    }
}

export const getDaysInMonth = (month) => {
    try {
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        const monthIndex = parseInt(month) - 1
        return monthIndex === 1 ? 29 : monthDays[monthIndex]
    } catch (err) {
        throw err
    }
}