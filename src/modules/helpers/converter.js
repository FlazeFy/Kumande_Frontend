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