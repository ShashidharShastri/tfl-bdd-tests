// This JavaScript code imports the axios library and sets up constants for base URLs and API keys for the TfL (Transport for London) and OpenCage APIs. These constants will be used to make HTTP requests to these services.
import axios from 'axios';
const API_BASE_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults';
const API_APP_KEY = '9985ecd1e56a45d9a91d33891967f265'; // Replace with your TfL API app_key
const OPENCAGE_API_KEY = 'fd64a9db7dae47f9ac4af25e94f1df1d'; // Replace with your OpenCage API key

/**
 * This JavaScript function, `geocodeAddress`, takes an address string as input and uses the OpenCage Geocoding API to fetch the latitude and longitude of the address. 
 * It makes an asynchronous HTTP GET request using axios, passing the address and API key as query parameters. 
 * If the request is successful and returns a status code of 200, it extracts and returns the latitude and longitude from the response data.
 * If the request fails or the response status is not 200, it throws an error with a descriptive message.
 */

async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: address,
        key: OPENCAGE_API_KEY
      }
    });
    if (response.status !== 200) {
      throw new Error(`Failed to geocode address: ${response.status} ${response.statusText}`);
    }
    const { lat, lng } = response.data.results[0].geometry;
    return { lat, lng };
  } catch (error) {
    throw new Error(`Failed to geocode address: ${error}`);
  }
}

/**
 * This function, `findNearestStopPoints`, retrieves the nearest public transport stop points 
 * (such as bus, coach, or tram stops) around a given latitude and longitude using the Transport for London (TfL) API.
 * It sends a GET request to the TfL API with the specified coordinates and a radius of 500 meters.
 * The function returns the stop points data if the request is successful and there are stop points found.
 * If the request fails or no stop points are found, it throws an appropriate error.
 */

async function findNearestStopPoints(lat, lng) {
  try {
    const response = await axios.get('https://api.tfl.gov.uk/StopPoint', {
      params: {
        lat,
        lon: lng,
        stopTypes: 'NaptanPublicBusCoachTram',
        radius: 500, // Adjust radius as needed
        app_key: API_APP_KEY
      }
    });
    if (response.status !== 200) {
      throw new Error(`Failed to get stop points: ${response.status} ${response.statusText}`);
    }
    if (response.data.stopPoints.length === 0) {
      throw new Error('No stop points found near the provided coordinates.');
    }
    return response.data.stopPoints;
  } catch (error) {
    throw new Error(`Failed to get stop points: ${error}`);
  }
}

/**
 * This function, planJourney, takes two parameters 'from' and 'to', and uses the axios library to make a GET request to an API endpoint.
 * It encodes the 'from' and 'to' parameters to ensure they are properly formatted for the URL.
 * The request includes an application key (API_APP_KEY) as a query parameter.
 * If the response status is not 200, it throws an error with the status and status text.
 * If the request is successful, it returns the data from the response.
 * If any error occurs during the request, it catches the error and throws a new error with a descriptive message.
 */

async function planJourney(from, to) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}`, {
      params: {
        app_key: API_APP_KEY
      }
    });
    if (response.status !== 200) {
      throw new Error(`Failed to plan journey: ${response.status} ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to plan journey: ${error}`);
  }
}

/**
 * This function, `getLatestDepartureJourney`, fetches the latest departure journey details
 * from a specified starting point to a destination based on the provided arrival time.
 * It constructs the API request using the given latitude and longitude coordinates,
 * formats the arrival time appropriately, and makes an asynchronous GET request to the API.
 * If the request is successful, it returns the journey data; otherwise, it throws an error.
 * 
 * @param {number} fromLat - Latitude of the starting point
 * @param {number} fromLng - Longitude of the starting point
 * @param {number} toLat - Latitude of the destination
 * @param {number} toLng - Longitude of the destination
 * @param {string} arrivalTime - Desired arrival time in ISO format (e.g., '2023-10-01T15:30:00')
 * @returns {Promise<Object>} - A promise that resolves to the journey data
 * @throws {Error} - Throws an error if the API request fails
 */

async function getLatestDepartureJourney(fromLat, fromLng, toLat, toLng, arrivalTime) {
  try {
    const date = arrivalTime.split('T')[0].replace(/-/g, '');
    const time = arrivalTime.split('T')[1].replace(':', '');
    const response = await axios.get(`${API_BASE_URL}/${fromLat},${fromLng}/to/${toLat},${toLng}`, {
      params: {
        app_key: API_APP_KEY,
        timeIs: 'arriving',
        date: date,
        time: time
      }
    });
    if (response.status !== 200) {
      throw new Error(`Failed to plan journey: ${response.status} ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to plan journey: ${error}`);
    throw new Error(`Failed to plan journey: ${error}`);
  }
}
export { geocodeAddress, findNearestStopPoints, planJourney, getLatestDepartureJourney };