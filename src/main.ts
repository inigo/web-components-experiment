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

import Highcharts from 'highcharts';

import './savedsearch/saved-search-dialog';

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();
initSelectors();



const url = '/data.json';

fetch(url)
    .then(response => response.json())
    .then(data => {

        console.debug("Drawing chart");

        Highcharts.chart('chart', {
            credits: { enabled: false },
            chart: {
                type: 'column',
            },
            title: {
                text: data.title
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population'
                }
            },
            tooltip: {
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    borderRadius: 0,
                    borderWidth: 0,
                    stacking: 'normal'
                },
                series: {
                    animation: {
                        duration: 400,
                    },
                }
            },
            series: data.series
        });
    })
    .catch(error => console.error('Error fetching the data:', error));
