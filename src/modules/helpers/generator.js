export const getTodayDayName = () => {
    try {
        const today = new Date();
        const options = { weekday: 'short' };
        const res = today.toLocaleDateString('en-US', options)

        return res
    } catch (error) {
        throw error
    }
}