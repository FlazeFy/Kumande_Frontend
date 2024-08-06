"use client"
import React from 'react'
import GoogleMapReact from 'google-map-react'

// Atoms
import ComponentText from '../atoms/text'

export default function ComponentContainerMaps(props) {
    const Marker = ({text}) => (
        <div className='position-relative'>
            <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Marker" />
            <h6 className='text-white text-center position-absolute' style={{width:"100px", left:"-30px"}}>{text}</h6>
        </div>
    );

    const defaultProps = {
        center: {
            lat: props.location_lat,
            lng: props.location_lang
        },
        zoom: 12
    };

    return (
        <>
            <ComponentText text_type="sub_heading" body={props.container_title}/>
            <div style={{ height: '400px', width: '100%'}}>
                <GoogleMapReact 
                    bootstrapURLKeys={{ key: "AIzaSyDXu2ivsJ8Hj6Qg1punir1LR2kY9Q_MSq8" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                <Marker
                    key={props.location_name}
                    lat={props.location_lat}
                    lng={props.location_lang}
                    text={props.location_name}
                />
                </GoogleMapReact>
            </div>
        </>
    )
}