"use client"
import React from 'react'
import { useState, useEffect } from "react"
import GoogleMapReact from 'google-map-react'
import { getLocal } from '../../../modules/storages/local'
import ComponentAlertBox from '../../../molecules/alert_box'
import { getCleanTitleFromCtx } from '../../../modules/helpers/converter'

export default function GetMapsboard({ctx}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const token = getLocal("token_key")

    const Marker = ({text}) => (
        <div className='position-relative'>
            <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Marker" />
            <h6 className='text-white text-center position-absolute' style={{width:"100px", left:"-30px"}}>{text}</h6>
        </div>
    );

    const defaultProps = {
        center: {
          lat: -6.2289462774161715,
          lng: 106.82658996100545
        },
        zoom: 12
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:2000/api/v1/pin/cafe,restaurant/fcd3f23e-e5aa-11ee-892a-3216422910e9`, {
            headers: {
                // Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                if(result.data != null){
                    setItems(result.data)
                }        
            },
            (error) => {
                if(getLocal(ctx + "_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal(ctx + "_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

    if (error) {
        return <ComponentAlertBox message={error.message} type='danger' context={getCleanTitleFromCtx(ctx)}/>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyDXu2ivsJ8Hj6Qg1punir1LR2kY9Q_MSq8" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                {
                    items.map((dt, idx) => (
                        <Marker
                            key={idx}
                            lat={dt.pin_lat}
                            lng={dt.pin_long}
                            text={dt.pin_name}
                        />
                    ))
                }
                </GoogleMapReact>
            </div>
        )
    }
}
  