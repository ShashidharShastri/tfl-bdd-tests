// This configuration file for Cucumber.js specifies the step definitions to be imported from the "src/step_definitions" directory
// and sets the output formats to "progress" and "json" with the JSON report being saved in "reports/cucumber-report.json".

export default {
  import: ["src/step_definitions/*.js"],
  format: ["progress", "json:reports/cucumber-report.json"]
};