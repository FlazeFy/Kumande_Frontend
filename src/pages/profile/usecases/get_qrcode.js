import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import QRCode from 'qrcode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faXmark } from '@fortawesome/free-solid-svg-icons'
import ComponentAlertBox from '../../../molecules/alert_box'

export default function GetQRCode({ id }) {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState('')

    useEffect(() => {
        const generateQR = async text => {
            try {
                const url = await QRCode.toDataURL(text)
                setQrCodeUrl(url)
                setIsLoaded(true)
            } catch (err) {
                console.error('Error generating QR code:', err)
                setError(err)
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong. Call the Admin!',
                    icon: 'error',
                })
                setIsLoaded(true)
            }
        }

        generateQR(id)
    }, [id])

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={'QR Code'}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <>
                <a className="btn btn-primary" data-bs-toggle="modal" id="sign-out-btn" data-bs-target={"#qrcodeModal"}>
                    <FontAwesomeIcon icon={faQrcode} className='me-2'/> Multi Login
                </a>
                <div className="modal fade" id={"qrcodeModal"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Connect to Other Kumande Apps</h5>
                                <button type="button" className="btn_close_modal" data-bs-dismiss="modal" aria-label="Close"><FontAwesomeIcon icon={faXmark}/></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img src={qrCodeUrl} alt={qrCodeUrl} style={{width:'250px'}}/>
                                <div className='text-start'>
                                    <h6>How to Connect :</h6>
                                    <ol>
                                        <li>Open your <b>Telegram</b> Apps</li>
                                        <li>Search and chat with Bot <b>@KumandeBot</b> or click this link <a href='https://t.me/KumandeBot'>t.me/KumandeBot</a></li>
                                        <li>Capture and Send this QR to chat box</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
