import React, { memo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import PropTypes from "prop-types";

export const LocationsMap = memo((props) => {
  const { maps } = props;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const mapStyles = {
    height: "50vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: 35.6809591,
    lng: 139.7673068,
  };

  const locations = Array.from(new Set(
    maps.map((location) =>
      location.latitude && (
      {
        id: location.id,
        lat: location.latitude,
        lng: location.longitude,
      }
    ))
  ))
  .filter(v => v);

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={4}
      center={defaultCenter}
    >
      {locations &&
        locations.map((location) => (
          <MarkerF key={location.id} position={location} />
        ))
      }
    </GoogleMap>
  );
});

LocationsMap.propTypes = {
  maps: PropTypes.arrayOf(
    PropTypes.shape({
      map: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          latitude: PropTypes.number.isRequired,
          longitude: PropTypes.number.isRequired,
        })
      )
    })
  ).isRequired,
};
