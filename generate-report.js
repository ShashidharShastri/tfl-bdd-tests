/**
 * This script generates an HTML report from a Cucumber JSON report using the 'cucumber-html-reporter' library.
 * It is configured to use the 'bootstrap' theme and outputs the report to a specified file path.
 * The report includes metadata such as the application version and test environment.
 * Additionally, the report is launched automatically after generation.
 */

import { generate } from 'cucumber-html-reporter';

const options = {
  theme: 'bootstrap',
  jsonFile: 'c:/Thejaswini/tfl-bdd-tests/reports/cucumber-report.json',
  output: 'c:/Thejaswini/tfl-bdd-tests/reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGING"
  }
};

generate(options);