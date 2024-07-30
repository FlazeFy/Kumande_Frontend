export const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export const isMobile = () => {
    const key = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    
    return key.test(navigator.userAgent)
}