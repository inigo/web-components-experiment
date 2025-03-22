import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import {DataTable} from "simple-datatables"
// import {Tabulator} from 'tabulator-tables';
import {initCookieConsent} from "./cookieconsent/cookieconsent.ts";

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

initCookieConsent();

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


setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
