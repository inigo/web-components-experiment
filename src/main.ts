import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import {DataTable} from "simple-datatables"
// import {Tabulator} from 'tabulator-tables';
import * as CookieConsent from "vanilla-cookieconsent";

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

new DataTable("#myTable", {
    searchable: false,
    paging: false,
});

// var tableData = [
//     {id:1, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
//     {id:2, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
// ]
//
// new Tabulator("#myTable", {
//     // height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
//     data:tableData, //assign data to table
//     // layout:"fitColumns", //fit columns to width of table (optional)
//     columns:[ //Define Table Columns
//         {title:"Name", field:"name"},
//         {title:"Age", field:"age"},
//         {title:"Gender", field:"gender"},
//         {title:"Height", field:"height"},
//         {title:"Favourite Color", field:"col"},
//         {title:"Date Of Birth", field:"dob"},
//         {title:"Cheese Preference", field:"cheese"},
//     ],
// });

CookieConsent.run({
    // Don't bother with cookie consent if the user has explicitly set "Do not track"
    autoShow: ! (navigator.doNotTrack==="1"),
    categories: {
        necessary: {
            enabled: true,  // this category is enabled by default
            readOnly: true  // this category cannot be disabled
        },
        analytics: {}
    },
    disablePageInteraction: false,
    cookie: {
        name: 'cc_cookie',
    },
    guiOptions: {
        consentModal: {
            layout: 'bar',
            position: 'bottom',
            equalWeightButtons: false
        }
    },

    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'We use cookies',
                    description: 'Cookie modal description',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    showPreferencesBtn: 'Manage Individual preferences'
                },
                preferencesModal: {
                    title: 'Manage cookie preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    savePreferencesBtn: 'Accept current selection',
                    closeIconLabel: 'Close modal',
                    sections: [
                        {
                            title: 'Somebody said ... cookies?',
                            description: 'I want one!'
                        },
                        {
                            title: 'Strictly Necessary cookies',
                            description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Performance and Analytics',
                            description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'More information',
                            description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
                        }
                    ]
                }
            }
        }
    }
});
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
