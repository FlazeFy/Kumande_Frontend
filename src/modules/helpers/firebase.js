import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Swal from 'sweetalert2'
import { v4 } from "uuid"
import { storage } from "../firebase/init"

export const uploadeFirebaseStorage = async (event, path) => {
    try {
        let file = event.target.files[0]
        const imageRef = ref(storage, `${path}/${file.name + v4()}`)
        const snapshot = await uploadBytes(imageRef, file)
        const url = await getDownloadURL(snapshot.ref)

        return url
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Something wrong happen. Call the Admin!',
        })
    }
}