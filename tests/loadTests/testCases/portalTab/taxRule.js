import { getRequest, setSession, consoleMessage, randomArrElement, patchRequest, randomFloat, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'TaxRule';

const hsCodesTariffListAPIurl = '/api/ff/hs_codes_tariff_list/';
const updateHScodeAPIurl = '/api/ff/update_hs_code_tariff/';

export function TaxRule(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.portalUrl, initData.requestTimeout, initData.portalToken);

    const getHScodesResp = getRequest(session, hsCodesTariffListAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (getHScodesResp && getHScodesResp.json('results')) {
        const allHScodes = getHScodesResp.json('results');
        
        if (allHScodes.length) {
            const randomHScode = randomArrElement(allHScodes);

            const randomAdditionalTariff = `${randomFloat(1, 5, 5)}`;
            const randomHarbourMaintenance = `${randomFloat(1, 5, 5)}`;
            const randomMerchandiseFee = `${randomFloat(1, 5, 5)}`;
            const randomTariff = `${randomFloat(1, 5, 5)}`;

            const updateHScodeTariffRequestBody = {
                additional_tariff: randomAdditionalTariff,
                harbour_maintenance: randomHarbourMaintenance,
                merchandise_fee: randomMerchandiseFee,
                tariff: randomTariff
            };

            const updateHScodeResp = patchRequest(session, updateHScodeAPIurl, `${randomHScode.id}/`, endpointName, JSON.stringify(updateHScodeTariffRequestBody));

            sleep(1);
        } else {
            consoleMessage("No HS codes available", endpointName);
        };
    } else {
        consoleMessage("Can't parse hs list response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};