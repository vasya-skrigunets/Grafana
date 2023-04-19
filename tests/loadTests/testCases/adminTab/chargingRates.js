import { postRequest, setSession, getRequest, randomInt, randomValueRange, randomArrElement, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { Trend } from "k6/metrics";
import { sleep } from "k6";

const endpointName = 'ChargingRates';

const mainRatesAPIurl = '/api/rates/actions/';

const preparedRateKeys = ["fast_boat_12_99_kg_east", "fast_boat_12_99_kg_mid", "fast_boat_12_99_kg_west", "fast_boat_gt_100_kg_east", "fast_boat_gt_100_kg_mid", "fast_boat_gt_100_kg_west", "meidum_boat_12_99_kg_east", "meidum_boat_12_99_kg_mid", "meidum_boat_12_99_kg_west", "meidum_boat_gt_100_kg_east", "meidum_boat_gt_100_kg_mid", "meidum_boat_gt_100_kg_west", "slow_boat_12_99_kg_east", "slow_boat_12_99_kg_mid", "slow_boat_12_99_kg_west", "slow_boat_gt_100_kg_east", "slow_boat_gt_100_kg_mid", "slow_boat_gt_100_kg_west", "over_266_cm_rate", "remote_warehouse_surcharge", "prep_rate", "rmb_conversation_rate", "skudrop_margin", "carton_range_22_40_kg", "length_width_height_75_120_cm", "truck_weight_gte_30", "truck_kg_longest_size_120_150", "truck_kg_longest_size_150_200", "truck_cbm_longest_size_120_150", "truck_cbm_longest_size_150_200", "insurance_percent", "fast_boat_cbm_east", "fast_boat_cbm_mid", "fast_boat_cbm_west", "fast_boat_kg_ups_east", "fast_boat_kg_ups_mid", "fast_boat_kg_ups_west", "meidum_boat_cbm_east", "meidum_boat_cbm_mid", "meidum_boat_cbm_west", "meidum_boat_kg_ups_east", "meidum_boat_kg_ups_mid", "meidum_boat_kg_ups_west", "slow_boat_cbm_east", "slow_boat_cbm_mid", "slow_boat_cbm_west", "slow_boat_kg_ups_east", "slow_boat_kg_ups_mid", "slow_boat_kg_ups_west", "min_cbm_value", "min_kg_value"];

export function ChargingRates(initData) {
    const startIterationTime = timeStamp();
    
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getRatesResp = getRequest(session, mainRatesAPIurl, null, endpointName);

    sleep(1);
    
    if (getRatesResp && getRatesResp.body) {
        const respObj = getRatesResp.json();
        let setRatesRequestBody = respObj;
    
        for (let i = 0; i < randomInt(5, 10); i++) {
            let randomKey = randomArrElement(preparedRateKeys);
            setRatesRequestBody[randomKey] = randomValueRange(respObj[randomKey]);
        };
    
        const setRatesResp = postRequest(session, mainRatesAPIurl, null, endpointName, JSON.stringify(setRatesRequestBody));
    
        sleep(1);
    } else {
        consoleMessage('Received response has no needed keys, interrupting changing rates', endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};