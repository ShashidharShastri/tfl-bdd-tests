TfL BDD Tests

Overview

This repository contains a set of Behavior-Driven Development (BDD) tests for the Transport for London (TfL) journey planning application. The tests are written using the Cucumber framework and are designed to validate various journey planning scenarios.

Features

Journey Planning: Tests for planning journeys between different locations.
Quickest Journey: Tests to find the quickest journey between two points.
Latest Departure: Tests to find the latest possible departure time to reach a destination by a specified time.
HTML Reporting: Generates an HTML report of the test results.

Project Structure
tfl-bdd-tests/ 
├── features/ 
│   └── journey-planning.feature 
├── src/ 
│   ├── step_definitions/ 
│   │   └── journey-planning-steps.js 
│   └── support/ 
│       └── api.js 
├── reports/ 
│   └── cucumber-report.json 
├── cucumber.mjs 
├── generate-report.js 
├── package.json 
└── README.md

Setup Instructions

Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

Installation

1. Clone the repository:
    git clone https://github.com/ShashidharShastri/tfl-bdd-tests.git
    cd tfl-bdd-tests
2. Install the dependencies:
    npm install

Configuration

Ensure you have valid API keys for the TfL and OpenCage APIs. Replace the placeholders in `src/support/api.js` with your actual API keys:
javascript 
const API_APP_KEY = 'your-tfl-api-key'; // Replace with your TfL API app_key 
const OPENCAGE_API_KEY = 'your-opencage-api-key'; // Replace with your OpenCage API key

Usage

Running Tests

To run the Cucumber tests, use the following command:
npm run cucumber-test

Running Tests Using Docker
You can run the tests using a Docker container. Follow the steps below to build the Docker image and run the tests.

Prerequisites
- Docker installed on your machine.

Steps
1. Build the Docker Image:
   Open a terminal and navigate to the root directory of the repository. 
   Run the following command to build the Docker image: docker build -t tfl-bdd-tests .

2. Run the Tests:
   After the image is built, you can run the tests using the following command:
   Run the following command to run the tests: docker run --rm -e API_APP_KEY=your-tfl-api-key -e OPENCAGE_API_KEY=your-opencage-api-key tfl-bdd- 
   tests

Explanation
 Replace `your-tfl-api-key` and `your-opencage-api-key` with your actual API keys.
 - `docker build -t tfl-bdd-tests .`: This command builds a Docker image with the tag `tfl-bdd-tests` using the Dockerfile in the current directory.
 - `docker run --rm -e API_APP_KEY=your-tfl-api-key -e OPENCAGE_API_KEY=your-opencage-api-key tfl-bdd-tests

Generating Reports

After running the tests, you can generate an HTML report using:
npm run generate-report
The report will be generated in the `reports` directory as `cucumber-report.html`.

Test Scenarios

Journey Planning Feature

Located in `features/journey-planning.feature`, this file contains the following scenarios:

1. Plan the quickest journey from Notting Hill Gate to Southbank Centre:
gherkin 
    Scenario: Plan the quickest journey from Notting Hill Gate to Southbank Centre 
      Given I am at "69 Notting Hill Gate, London" 
      And I want to go to "Southbank Centre, London" 
      When I plan the quickest journey 
      Then I should see the quickest journey plan

2. Plan the journey from Notting Hill Gate, London to Bristol Temple Meads:
gherkin 
    Scenario: Plan the journey from Notting Hill Gate, London to Bristol Temple Meads 
      Given I am at "69 Notting Hill Gate, London" 
      And I want to go to "Bristol Temple Meads, Bristol" 
      When I plan the journey 
      Then I should see the journey plan

3. Plan a journey from Luton Airport to Notting Hill Gate, arriving by 8:50am:
gherkin 
    Scenario: Plan a journey from Luton Airport to Notting Hill Gate, arriving by 8:50am 
      Given I am arriving at "Luton Airport" next Wednesday 
      And I need to be at "69 Notting Hill Gate, London" by "08:50" 
      When I plan the latest possible departure journey 
      Then I should see the latest possible departure time

Code Details

Step Definitions

Located in `src/step_definitions/journey-planning-steps.js`, this file contains the step definitions for the journey planning scenarios. Key functions include:

- Setting origin and destination locations.
- Planning the quickest journey.
- Planning the latest possible departure journey.
- Verifying the journey plans.

API Support

Located in `src/support/api.js`, this file contains functions to interact with the TfL and OpenCage APIs:

- geocodeAddress(address): Geocodes an address to get latitude and longitude.
- findNearestStopPoints(lat, lng): Finds the nearest stop points around given coordinates.
- planJourney(from, to): Plans a journey from one location to another.
- getLatestDepartureJourney(fromLat, fromLng, toLat, toLng, arrivalTime) : Gets the latest departure journey based on arrival time.

Report Generation

Located in `generate-report.js`, this script generates an HTML report of the test results using the `cucumber-html-reporter` package.

License

This project is licensed under the ISC License.

Author

Shashidhar

Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

