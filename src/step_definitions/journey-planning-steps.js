/**
 * This file, journey-planning-steps.js, is written in JavaScript. It imports necessary functions 
 * and modules from cucumber, chai, and a custom API module. The file defines variables for 
 * origin, destination, and arrivalTime, which are used in the context of journey planning 
 * steps for testing purposes.
 */
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { geocodeAddress, findNearestStopPoints, planJourney, getLatestDepartureJourney } from '../support/api.js';
let origin;
let destination;
let arrivalTime;

/**
 * This step definition is written in JavaScript for a Cucumber test scenario.
 * It sets the origin location for a journey planning feature.
 * The step takes an origin location as a string, geocodes it to get the latitude and longitude,
 * and stores these coordinates in the context (`this`) for later use.
 * A debugging statement is included to log the origin and its coordinates.
 */

Given('I am at {string}', async function (originLocation) {
  origin = originLocation;
  const { lat, lng } = await geocodeAddress(origin);
  this.originCoordinates = { lat, lng };
  console.log(`Origin set to: ${origin} (${lat}, ${lng})`); // Debugging statement
});

/** 
* This code defines a step in a journey planning application using the Given function from a testing framework. 
* It sets a destination location, geocodes the address to get latitude and longitude, 
*  stores the coordinates, and logs the destination and coordinates for debugging purposes.
*/
Given('I want to go to {string}', async function (destinationLocation) {
  destination = destinationLocation;
  const { lat, lng } = await geocodeAddress(destination);
  this.destinationCoordinates = { lat, lng };
  console.log(`Destination set to: ${destination} (${lat}, ${lng})`); // Debugging statement
});


/**
 * This JavaScript code defines a step for a testing framework (likely Cucumber.js) 
 * where the user specifies arriving at a given location next Wednesday.
 * It calculates the date for the next Wednesday, formats it along with a fixed time (08:50),
 * and logs the arrival details. It then geocodes the address to get the latitude and longitude 
 * coordinates of the origin location and stores them in the context for further use. 
 * 
 */
Given('I am arriving at {string} next Wednesday', async function (originLocation) {
  origin = originLocation;
  const nextWednesday = new Date();
  nextWednesday.setDate(nextWednesday.getDate() + ((3 + (7 - nextWednesday.getDay())) % 7));
  const formattedDate = nextWednesday.toISOString().split('T')[0].replace(/-/g, '');
  const formattedTime = '0850'; // Assuming the time is fixed at 08:50
  arrivalTime = `${formattedDate}T${formattedTime}`;
  console.log(`I am arriving at ${origin} next Wednesday ${arrivalTime}`);
  const { lat, lng } = await geocodeAddress(origin);
  this.originCoordinates = { lat, lng };
  console.log(`origin set to for the step I am arriving at : ${origin} (${lat}, ${lng})`);
  console.log(`Arrival time set to: ${arrivalTime}`); // Debugging statement
});

/**
 * This code defines a step in a journey planning process using the Given function, which is part of a testing framework such as Cucumber. 
 * The step specifies the need to be at a particular destination by a certain time.
 * It then geocodes the destination address to get its latitude and longitude, which are stored in the context for further use. 
 * Debugging statements are included to log the destination and arrival time.
 */
Given('I need to be at {string} by {string}', async function (destinationLocation, time) {
  destination = destinationLocation;
  time = arrivalTime;
  console.log(`I need to be at step def ${arrivalTime}`);
  const { lat, lng } = await geocodeAddress(destination);
  this.destinationCoordinates = { lat, lng };
  console.log(`destinationLocation set to for the step I need to be at : ${destination} (${lat}, ${lng})`);
  console.log(`Destination: ${destination}, Arrival time: ${arrivalTime}`); // Debugging statement
});

/**
 * This code defines a step in a journey planning process using the Cucumber framework.
 * When the step "I plan the quickest journey" is executed, it performs the following actions:
 * 1. Finds the nearest stop points based on the origin coordinates.
 * 2. Throws an error if no stop points are found near the origin.
 * 3. Plans a journey from the nearest stop point to a specified destination.
 */

When('I plan the quickest journey', async function () {
  const stopPoints = await findNearestStopPoints(this.originCoordinates.lat, this.originCoordinates.lng);
  if (stopPoints.length === 0) throw new Error('No stop points found near the origin.');
  this.result = await planJourney(stopPoints[0].id, destination);
});

/**
 * This JavaScript code defines an asynchronous function that plans a journey.
 * It first finds the nearest stop points to the given origin coordinates.
 * If no stop points are found, it throws an error.
 * Otherwise, it uses the ID of the nearest stop point to plan the journey to the specified destination.   
 */

When('I plan the journey', async function () {
  const stopPoints = await findNearestStopPoints(this.originCoordinates.lat, this.originCoordinates.lng);
  if (stopPoints.length === 0) throw new Error('No stop points found near the origin.');
  this.result = await planJourney(stopPoints[0].id, destination);
});

/**
 * This code defines a step in a journey planning process using the 'When' function.
 * It extracts the latitude and longitude coordinates for both the origin and destination
 * from the context (this.originCoordinates and this.destinationCoordinates).
 * Then, it calls the getLatestDepartureJourney function with these coordinates and an arrivalTime
 * to plan the latest possible departure journey and stores the result in this.result.
 */

When('I plan the latest possible departure journey', async function () {
  const { lat: originLat, lng: originLng } = this.originCoordinates;
  const { lat: destLat, lng: destLng } = this.destinationCoordinates;
  this.result = await getLatestDepartureJourney(originLat, originLng, destLat, destLng, arrivalTime);
});

/**
 * This code defines a step in a test scenario written in JavaScript using a BDD (Behavior-Driven Development) framework.
 * The step checks that the result contains a list of journey plans and finds the quickest journey based on duration.
 * It then prints out details of the quickest journey, including duration, start and arrival times, and details of each leg of the journey.
 * If a fare is available for a leg, it prints the fare as well.
 */

Then('I should see the quickest journey plan', function () {
  expect(this.result).to.have.property('journeys');
  expect(this.result.journeys).to.be.an('array').that.is.not.empty;
  // Find the quickest journey
  const quickestJourney = this.result.journeys.reduce((quickest, current) => {
    return current.duration < quickest.duration ? current : quickest;
  });
  // Print the required details for the quickest journey
  console.log(`Quickest Journey:`);
  console.log(`  Duration: ${quickestJourney.duration} minutes`);
  console.log(`  Start Time: ${quickestJourney.startDateTime}`);
  console.log(`  Arrival Time: ${quickestJourney.arrivalDateTime}`);
  quickestJourney.legs.forEach((leg, index) => {
    console.log(`  Leg ${index + 1}:`);
    console.log(`    Mode of Transport: ${leg.mode.name}`);
    console.log(`    Departure Point: ${leg.departurePoint.commonName}`);
    console.log(`    Arrival Point: ${leg.arrivalPoint.commonName}`);
    console.log(`    Departure Time: ${leg.departureTime}`);
    console.log(`    Arrival Time: ${leg.arrivalTime}`);
    console.log(`    Instruction: ${leg.instruction.summary}`);
    console.log(`    Detailed Instruction: ${leg.instruction.detailed}`);
    if (leg.fare) {
      console.log(`    Fare: ${leg.fare.totalCost / 100} ${leg.fare.currency}`);
    }
  });
});

/**
 * This code is a step definition for a Cucumber test scenario in JavaScript.
 * It verifies that the journey plan result contains a non-empty array of journeys.
 * For each journey, it logs details such as duration, start time, and arrival time.
 * It also iterates through the legs of each journey, logging details such as the mode of transport, departure and arrival points, times, and instructions.
 */

Then('I should see the journey plan', function () {
  expect(this.result).to.have.property('journeys');
  expect(this.result.journeys).to.be.an('array').that.is.not.empty;
  // Iterate through each journey and print details
  this.result.journeys.forEach((journey, journeyIndex) => {
    console.log(`Journey ${journeyIndex + 1}:`);
    console.log(`  Duration: ${journey.duration} minutes`);
    console.log(`  Start Time: ${journey.startDateTime}`);
    console.log(`  Arrival Time: ${journey.arrivalDateTime}`);
    journey.legs.forEach((leg, legIndex) => {
      console.log(`  Leg ${legIndex + 1}:`);
      console.log(`    Mode of Transport: ${leg.mode.name}`);
      console.log(`    Departure Point: ${leg.departurePoint.commonName}`);
      console.log(`    Arrival Point: ${leg.arrivalPoint.commonName}`);
      console.log(`    Departure Time: ${leg.departureTime}`);
      console.log(`    Arrival Time: ${leg.arrivalTime}`);
      console.log(`    Instruction: ${leg.instruction.summary}`);
    });
  });
});

/**
 * This script verifies that the latest possible departure time is visible in the journey results.
 * It checks if the 'journeys' property exists and is a non-empty array.
 * It then identifies the journey with the latest departure time and prints its details, including:
 * - Duration
 * - Start Time
 * - Arrival Time
 * For each leg of the journey, it prints:
 * - Mode of Transport
 * - Departure Point
 * - Arrival Point
 * - Departure Time
 * - Arrival Time
 * - Instruction Summary
 */

Then('I should see the latest possible departure time', function () {
  expect(this.result).to.have.property('journeys');
  expect(this.result.journeys).to.be.an('array').that.is.not.empty;

  // Find the latest possible departure journey
  const latestJourney = this.result.journeys.reduce((latest, current) => {
    return new Date(current.startDateTime) > new Date(latest.startDateTime) ? current : latest;
  });

  // Print the required details for the latest possible departure journey
  console.log(`Latest Possible Departure Journey:`);
  console.log(`  Duration: ${latestJourney.duration} minutes`);
  console.log(`  Start Time: ${latestJourney.startDateTime}`);
  console.log(`  Arrival Time: ${latestJourney.arrivalDateTime}`);
  
  latestJourney.legs.forEach((leg, index) => {
    console.log(`  Leg ${index + 1}:`);
    console.log(`    Mode of Transport: ${leg.mode.name}`);
    console.log(`    Departure Point: ${leg.departurePoint.commonName}`);
    console.log(`    Arrival Point: ${leg.arrivalPoint.commonName}`);
    console.log(`    Departure Time: ${leg.departureTime}`);
    console.log(`    Arrival Time: ${leg.arrivalTime}`);
    console.log(`    Instruction: ${leg.instruction.summary}`);
  });
});