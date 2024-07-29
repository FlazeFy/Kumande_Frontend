export const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}