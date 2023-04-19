Don't forget to restore the test database dump:
- make pipeline_postgresql_restore
- make dev_migrate_db

The "tests" folder contains 2 executable files for Windows and Linux:
- xk6-browser.exe  //For Windows
- xk6-browser      //For Linux

To run Smoke Test, enter the command from the "tests" directory:
- xk6-browser.exe run ./smokeConfigs/smokeConfig_AllScenarios.js     //For Windows
- xk6-browser run ./smokeConfigs/smokeConfig_AllScenarios.js         //For Linux

Also the smoke config has 3 split parts that can be run separately but sequentially ("smokeConfigs" directory)

To run Full Test, enter the command from the "tests" directory:
- xk6-browser.exe run ./fullConfigs/fullConfig.js      //For Windows
- xk6-browser run ./fullConfigs/fullConfig.js          //For Linux

Docs:
- K6 Browser: https://k6.io/docs/javascript-api/xk6-browser/
- Playwright: https://playwright.dev/docs/intro

In SendProductToAmazon (.tests/smokeTests/sendProductToAmazon.js) test has some comments about the methods that used in the tests

Since k6 browser is still under development, there are the following bugs/problems: 
- if there is "null" in the browser console, there will be an error;
- not all methods work that are available in playwright
- if you use "type", "keyboard" methods (that is, input methods) in headless mode, an error occurs (not always, but in 80% of cases)
- if the script uses "sleep", "slowMo", i.e. methods that make the script pause, there will be an error