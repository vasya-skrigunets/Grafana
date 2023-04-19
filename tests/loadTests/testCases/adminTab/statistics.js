import { getRequest, setSession, randomInt, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'Statistics';

const statisticAreaAPIurl = '/api/shipments/admin/statistic_area/';
const chartsAPIurl = '/api/shipments/admin/charts/';

export function Statistics(initData) {
    const startIterationTime = timeStamp();
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    let tmpDateFrom = new Date();
    let tmpDateTo = new Date();
    const dateFrom = new Date(tmpDateFrom.setMonth(randomInt(0, tmpDateFrom.getMonth())));
    const dateTo = new Date(tmpDateTo.setDate(tmpDateTo.getDate() + randomInt(2, 5)));

    const convertedDateFrom = dateFrom.toISOString().split('T')[0];
    const convertedDateTo = dateTo.toISOString().split('T')[0];
    const filterParameter = `?date_from=${convertedDateFrom}&date_to=${convertedDateTo}`;

    const getStatisticsDataResp = getRequest(session, statisticAreaAPIurl, filterParameter, endpointName);
    const getChartsDataResp = getRequest(session, chartsAPIurl, filterParameter, endpointName);

    sleep(1);

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};