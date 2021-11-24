import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
} from 'react-google-maps';
import { Loader, Form, Input } from 'semantic-ui-react';

const Wrapper = styled.div`
  padding: 8px 8px 8px 8px;
`;
const Container = styled.div`
  height: 300px;
  width: 100%;
`;

const Map = withScriptjs(
  withGoogleMap(
    ({
      coordinates,
      onClick,
    }: {
      coordinates: Coordinates;
      onClick: Function;
    }) => (
      <GoogleMap
        defaultZoom={4}
        defaultCenter={coordinates}
        onClick={({ latLng }: any) => {
          const p: Coordinates = {
            lat: latLng?.lat() ?? 0,
            lng: latLng?.lng() ?? 0,
          };
          onClick(p);
        }}
      >
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    ),
  ),
);

interface Coordinates {
  lat: number;
  lng: number;
}

interface Props {
  value?: Coordinates;
  onChange: (lat: number, lng: number) => void;
}

const Render: React.FC<Props> = ({ value, onChange }) => {
  const [latValue, setLatValue] = useState(0);
  const [lngValue, setLngValue] = useState(0);

  const handleChange = (lat: number, lng: number) => {
    onChange(lat, lng);
  };

  useEffect(() => {
    if (value) {
      setLatValue(value?.lat ?? 0);
      setLngValue(value?.lng ?? 0);
    }
  }, [value]);

  return (
    <>
      <Wrapper>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Vĩ độ"
            value={latValue || 0}
            onChange={({ target: { value } }: any) => {
              const v = parseFloat(value);
              setLatValue(v);
              handleChange(v, lngValue);
            }}
          />
          <Form.Field
            control={Input}
            label="Kinh độ"
            value={lngValue || 0}
            onChange={({ target: { value } }: any) => {
              const v = parseFloat(value);
              setLngValue(v);
              handleChange(latValue, v);
            }}
          />
        </Form.Group>
        <Map
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
          }&v=3.exp`}
          loadingElement={<Loader />}
          containerElement={<Container />}
          mapElement={<Container />}
          coordinates={{
            lat: latValue,
            lng: lngValue,
          }}
          onClick={(p: any) => {
            setLatValue(p?.lat ?? 0);
            setLngValue(p?.lng ?? 0);
            handleChange(p?.lat ?? 0, p?.lng ?? 0);
          }}
        />
      </Wrapper>
    </>
  );
};

export default Render;
