import React, { memo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import PropTypes from "prop-types";

export const PostLocationMap = memo((props) => {
  const { map } = props;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const mapStyles = {
    height: "20vh",
    width: "100%"
  };

  const center = (
    map.latitude ?
      { lat: map.latitude, lng: map.longitude }
    :
      { lat: 35.6809591, lng: 139.7673068 }
  );

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={9}
      center={center}
    >
      {map.latitude && <MarkerF position={center} />}
    </GoogleMap>
  );
});

PostLocationMap.propTypes = {
  map: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })
  ).isRequired,
};
