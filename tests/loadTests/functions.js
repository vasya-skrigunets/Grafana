import exec from 'k6/execution';
import encoding from 'k6/encoding';
import { check, fail, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { randomString } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

// Open "env" file (in this case env file it is simple JSON)
const { DELAY_BETWEEN_REQUESTS } = JSON.parse(open('./env'));

// Prepared custom metrics
const ErrorsCounter = new Counter('http_req_error');
const TimeoutCounter = new Counter('http_req_timeout');
const api_req_duration = new Trend('api_req_duration', true);
const scenarios_iteration_duration = new Trend('scenarios_iteration_duration', true);
const endpoints_iteration_duration = new Trend('endpoints_iteration_duration', true);

// Returns an object that contains the current date, time and time zone
export const currentDateTime = () => {
    return new Date().toISOString().split('.')[0].split('T').join(" "); 
};

// Tracks critical timeout points and adds values to the http_req_timeout metric
const trackingTimeouts = (reqMethod, apiUrl, resp, endpointName) => {
    if (resp.timings.duration > 120000) {
        TimeoutCounter.add(1, {method: reqMethod, timeout: "120s", value: resp.timings.duration, api: apiUrl});
        // console.warn(`${reqMethod}, API: ${apiUrl}, Timeout: 120s, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}`);
    } else if (resp.timings.duration > 90000) {
        TimeoutCounter.add(1, {method: reqMethod, timeout: "90s", value: resp.timings.duration, api: apiUrl});
        // console.warn(`${reqMethod}, API: ${apiUrl}, Timeout: 90s, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}`);
    } else if (resp.timings.duration > 60000) {
        TimeoutCounter.add(1, {method: reqMethod, timeout: "60s", value: resp.timings.duration, api: apiUrl});
        console.warn(`${reqMethod}, API: ${apiUrl}, Timeout: 60s, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}`);
    } else if (resp.timings.duration > 30000) {
        TimeoutCounter.add(1, {method: reqMethod, timeout: "30s", value: resp.timings.duration, api: apiUrl});
        // console.warn(`${reqMethod}, API: ${apiUrl}, Timeout: 30s, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}`);
    } else if (resp.timings.duration > 15000) {
        TimeoutCounter.add(1, {method: reqMethod, timeout: "15s", value: resp.timings.duration, api: apiUrl});
        // console.warn(`${reqMethod}, API: ${apiUrl}, Timeout: 15s, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}`);
    };
};

// Outputting a message to the console and interrupting the current iteration
const onRequestError = (reqMethod, apiUrl, endpointName) => {
    fail(`${reqMethod} request error, API: ${apiUrl}, Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VUs: ${exec.instance.vusActive}, VU id: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, UTC time: ${currentDateTime()}`);
};

// Simply outputting a message to the console when the request fails
const onRequestErrorMessage = (requestType, apiUrl, resp, endpointName) => {
    console.error(`Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VU: ${exec.vu.idInTest}, iteration: ${exec.scenario.iterationInInstance}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}\n${requestType} request ERROR - API: ${apiUrl}, status: ${JSON.stringify(resp.status)}, response body: ${JSON.stringify(resp.body)}`);
};

// Function to add a request duration to the api_req_duration metric
const setApiReqDuration = (time, apiName, reqMethod, endpointName) => {
    api_req_duration.add(time, {api: apiName, method: reqMethod, endpoint: endpointName});
};

// A simple response status check
export const checkRespStatus = (resp) => {
    return resp.status >= 200 && resp.status <= 204;
};

// Function to add the scenario iteration duration to the scenarios_iteration_duration metric
export const setScenarioIterationDuration = (time) => {
    scenarios_iteration_duration.add(time, {scenario: `${exec.scenario.name}`});
};

// Function to add the endpoint (step in scenario) iteration duration to the endpoints_iteration_duration metric
export const setEndpointIterationDuration = (time, endpointName) => {
    endpoints_iteration_duration.add(time, {endpoint: `${endpointName}`});
};

// Function to create a session template
export const setSession = (url, requestTimeout, token) => {
    const session = new Httpx({
        baseURL: url,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'Content-Type': 'application/json'
        },
        timeout: requestTimeout,
    });

    session.addHeader('Authorization', `Bearer ${token}`);

    return session;
};

// POST request wrapped with additional methods (tracking the duration of the request,
// tracking the critical points of the request, checking the response)
export const postRequest = (session, apiUrl, apiParams = null, endpointName, body, params = null, init = false) => {
    if (!init && DELAY_BETWEEN_REQUESTS) {
        sleep(DELAY_BETWEEN_REQUESTS);
    };
    
    const reqMethod = 'POST';

    const resp = apiParams === null ? session.post(apiUrl, body, params) : session.post(apiUrl + apiParams, body, params);

    setApiReqDuration(resp.timings.duration, apiUrl, reqMethod, endpointName);

    check(resp, {
        'Request status is 20X': checkRespStatus(resp)
    });

    if (init) {
        if (checkRespStatus(resp)) {
            return resp;
        } else {
            ErrorsCounter.add(1, {api: apiUrl, method: reqMethod});
            console.error(`VU: ${exec.vu.idInTest}, request time: ${(resp.timings.duration / 1000).toFixed(1)}s, test time: ${(exec.instance.currentTestRunDuration / 1000).toFixed(1)}s, UTC time: ${currentDateTime()}\n${reqMethod} request ERROR - API: ${apiUrl}, status: ${JSON.stringify(resp.status)}, response body: ${JSON.stringify(resp.body)}`);
            return resp;
        };
    } else {
        trackingTimeouts(reqMethod, apiUrl, resp, endpointName);

        if (checkRespStatus(resp)) {
            return resp;
        } else {
            ErrorsCounter.add(1, {api: apiUrl, method: reqMethod});

            onRequestErrorMessage(reqMethod, apiUrl, resp, endpointName);

            // onRequestError(reqMethod, apiUrl, endpointName);
            
            return resp;
        };
    };
};

// GET request wrapped with additional methods (as in a postRequest)
export const getRequest = (session, apiUrl, apiParams = null, endpointName) => {
    if (DELAY_BETWEEN_REQUESTS) {
        sleep(DELAY_BETWEEN_REQUESTS);
    };
    
    const reqMethod = 'GET';

    const resp = apiParams === null ? session.get(apiUrl) : session.get(apiUrl + apiParams);
    
    setApiReqDuration(resp.timings.duration, apiUrl, reqMethod, endpointName);

    check(resp, {
        'Request status is 20X': checkRespStatus(resp)
    });

    trackingTimeouts(reqMethod, apiUrl, resp, endpointName);

    if (checkRespStatus(resp)) {
        return resp;
    } else {
        ErrorsCounter.add(1, {api: apiUrl, method: reqMethod});

        onRequestErrorMessage(reqMethod, apiUrl, resp, endpointName);

        // onRequestError(reqMethod, apiUrl, endpointName);

        return resp;
    };
};

// DELETE request wrapped with additional methods (as in a postRequest)
export const deleteRequest = (session, apiUrl, apiParams = null, endpointName, body = null) => {
    if (DELAY_BETWEEN_REQUESTS) {
        sleep(DELAY_BETWEEN_REQUESTS);
    };
    
    const reqMethod = 'DELETE';

    const resp = apiParams === null ? session.delete(apiUrl, body) : session.delete(apiUrl + apiParams, body);

    setApiReqDuration(resp.timings.duration, apiUrl, reqMethod, endpointName);

    check(resp, {
        'Request status is 20X': checkRespStatus(resp)
    });

    trackingTimeouts(reqMethod, apiUrl, resp, endpointName);

    if (checkRespStatus(resp)) {
        return resp;
    } else {
        ErrorsCounter.add(1, {api: apiUrl, method: reqMethod});

        onRequestErrorMessage(reqMethod, apiUrl, resp, endpointName);

        // onRequestError(reqMethod, apiUrl, endpointName);

        return resp;
    };
};

// PATCH request wrapped with additional methods (as in a postRequest)
export const patchRequest = (session, apiUrl, apiParams = null, endpointName, body, params = null) => {
    if (DELAY_BETWEEN_REQUESTS) {
        sleep(DELAY_BETWEEN_REQUESTS);
    };
    
    const reqMethod = 'PATCH';

    const resp = apiParams === null ? session.patch(apiUrl, body, params) : session.patch(apiUrl + apiParams, body, params);

    setApiReqDuration(resp.timings.duration, apiUrl, reqMethod, endpointName);

    check(resp, {
        'Request status is 20X': checkRespStatus(resp)
    });

    trackingTimeouts(reqMethod, apiUrl, resp, endpointName);

    if (checkRespStatus(resp)) {
        return resp;
    } else {
        ErrorsCounter.add(1, {api: apiUrl, method: reqMethod});

        onRequestErrorMessage(reqMethod, apiUrl, resp, endpointName);

        // onRequestError(reqMethod, apiUrl, endpointName);

        return resp;
    };
};

// Function for user authorization. Return full response
export const userAuth = (url, requestTimeout, authData) => {
    const session = setSession(url, requestTimeout);

    const loginResp = postRequest(session, '/api/token/obtain/', null, 'userAuth', JSON.stringify(authData), null, true);

    return loginResp;
};

// Function that decrypts the token. In this case, it returns only the userId
export const decodeToken = (token) => {
    const parts = token.split('.');
    const decoded = JSON.parse(encoding.b64decode(parts[1].toString(), "rawstd", 's'));
    return decoded.user_id
};

// Function that simplifies random sleep in scenarios within the given limits
export const randomSleep = (min = 1, max = 5) => {
    sleep(Math.floor(Math.random() * (max + 1 - min) + min));
};

// Function that generate random int value within the given limits
export const randomInt = (min = 0, max = 1000) => {
    return (Math.floor(Math.random() * (max + 1 - min) + min));
};

export const randomFloat = (min = 0, max = 1000, afterDot = 2) => {
    return ((Math.random() * (max - min) + min).toFixed(afterDot));
};

// The following function takes a value and by default returns a range of 15% of the given value. 
// If a minimum or maximum value is passed, then they will have a higher priority. 
// If an integer is passed, an integer will also be returned. 
// If fractional, then fractional with two decimal places will be returned
export const randomValueRange = (number, percentagesDeviation = 15, min = number - (number * percentagesDeviation / 100), max = number + (number * percentagesDeviation / 100)) => {
    let value = parseFloat(number);

    let valueMax = value + (value * (percentagesDeviation / 100));
    let valueMin = value - (value * (percentagesDeviation / 100));

    if (Number.isInteger(value)) {
        let numMax = ((value > max || valueMax > max || value < min) ? Math.floor(max) : (Math.floor(valueMax) + 1));
        let numMin = ((value < min || valueMin < min || value > max) ? Math.ceil(min) : Math.ceil(valueMin));
        return Math.floor(Math.random() * (numMax - numMin) + numMin);
    } else {
        let numMax = ((value > max || valueMax > max || value < min) ? max : (valueMax + 1));
        let numMin = ((value < min || valueMin < min || value > max) ? min : valueMin);
        return (Math.random() * (numMax - numMin) + numMin).toFixed(2);
    };
};

// Function accepts an array and returns 1 random element of it, 
// it is also possible to specify the number of returned elements in the array
export const randomArrElement = (arr, elemToReturn = 1) => {
    if (arr.length) {
        if (elemToReturn && elemToReturn != 1) {
            let counter;

            if (elemToReturn > arr.length && elemToReturn < 0) {
                counter = arr.length;
            } else {
                counter = elemToReturn;
            };

            const arrCopy = arr.slice();
            let arrToReturn = [];

            for (let i = 0; i < counter; i++) {
                arrToReturn.push(arrCopy[Math.floor(Math.random() * arrCopy.length)]);
                arrCopy.splice(arrCopy.indexOf(arrToReturn[i]), 1);
            };

            return arrToReturn;
        } else {
            return arr[Math.floor(Math.random() * arr.length)];
        };
    } else {
        console.error("Received empty array, Scenario: " + exec.scenario.name);
    };
};

// Prepared template for outputting a message to the console
export const consoleMessage = (message, endpointName) => {
    console.warn(`Scenario: ${exec.scenario.name}, Endpoint: ${endpointName}, VU: ${exec.vu.idInTest}, Scenario iteration: ${exec.scenario.iterationInInstance}, Total iterations: ${exec.instance.iterationsCompleted}, UTC Time: ${currentDateTime()}\nMessage: ${message}`);
};

// A simple function that returns the current time in milliseconds
export const timeStamp = () => {
    return new Date().valueOf();
};

// A template that returns a random FormData boundary
export const customFormBoundary = () => {
    return `----WebKitFormBoundary${randomString(16, '1234567890QqWwEeRrTtYyUuIiOoPpAaSsDdFfGgHhJjKkLlZzXxCcVvBbNnMm')}`;
};