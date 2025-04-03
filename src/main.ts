import './style.css'
import {initCookieConsent} from "./cookieconsent/cookieconsent.ts";

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import {setupCssActions} from "./actions/actions.ts";
import {initSelectors} from "./select/select.ts";

import './savedsearch/saved-search-dialog';
import "./chart/chart.ts";
import {DataChart} from "./chart/chart.ts";
import {SlSelectEvent} from "@shoelace-style/shoelace";

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();
initSelectors();

const chart = document.querySelector('#chart') as DataChart;
const chartHolder = document.querySelector('#chartHolder') !;
// @todo Maybe this setup should be in chart itself, in connectedCallback?
chartHolder.addEventListener('sl-select', (event: Event) => {
    const selectedChartType = (event as SlSelectEvent).detail.item.value;
    console.debug(`Changed chart type to ${selectedChartType}`);
    chart.chartType = selectedChartType;
});
