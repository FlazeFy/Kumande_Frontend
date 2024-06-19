import { collection, addDoc } from "firebase/firestore"
import { db } from "./init"

const add_firestore = async (data, ref) => {
    try {
        const docRef = await addDoc(collection(db, ref), data)
        return docRef.id
    } catch (e) {
        throw e
    }
};

export { add_firestore }
