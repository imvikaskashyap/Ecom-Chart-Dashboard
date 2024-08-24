import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

// OpenCage API Key
const OPEN_CAGE_API_KEY = "33da1971edbf47ed87c30692eaaa7edf";

const CityMap = () => {
  const [cities, setCities] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/customer/customer-distribution/cities`
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async (cityName) => {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            cityName
          )}&key=${OPEN_CAGE_API_KEY}`
        );
        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry;
          return { lat, lng };
        }
      } catch (error) {
        console.error(
          `Error fetching coordinates for city ${cityName}:`,
          error
        );
      }
      return null;
    };

    const fetchAllCityCoordinates = async () => {
      const coordinates = {};
      for (const city of cities) {
        const { city: cityName } = city;
        const coord = await fetchCoordinates(cityName);
        if (coord) {
          coordinates[cityName] = coord;
        }
      }
      setCityCoordinates(coordinates);
    };

    if (cities.length > 0) {
      fetchAllCityCoordinates();
    }
  }, [cities]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{
        height: "90vh",
        width: "95%",
        padding: "50px",
        marginTop: "50px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cities.map((city, index) => {
        const { city: cityName, customerCount } = city;
        const coordinates = cityCoordinates[cityName];

        if (!coordinates) return null;

        return (
          <Marker key={index} position={[coordinates.lat, coordinates.lng]}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {cityName}: {customerCount} customers
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default CityMap;
