import { getLocal } from "../storages/local"

export const isLogged = (logval, outval) => {
    try {
        if(getLocal('username_key') != null && getLocal('token_key') != null){
            return logval
        } else {
            return outval
        }
    } catch (error) {
        throw error
    }
}