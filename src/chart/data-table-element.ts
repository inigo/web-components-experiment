import {customElement} from "lit/decorators.js";
import {html, LitElement} from "lit";
import {DataStoreController} from "./data-store-controller.ts";


@customElement('data-table')
export class DataTable extends LitElement {
    private storeController = new DataStoreController(this);

    render() {
        console.debug("Rendering table");
        const data = this.storeController.getData();
        if (!data) return html`<div>No data available</div>`;
        return html`
            <table class="table sortable tabular-nums">
                <thead>
                    <th class="bg-gray-200 sticky top-0 z-10"></th>
                    ${data.categories.map(category => html`<th class="bg-gray-200 sticky top-0 z-10">${category}</th>`)}
                </thead>
                <tbody>
                    ${data.series.map(series => html`
                        <tr>
                            <td>${series.name}</td>
                            ${series.data.map(value => html`<td>${value}</td>`)}
                        </tr>
                    `)}    
                </tbody>
            </table>
        `;
    }

    /** Disables the shadow root, so Tailwind classes work */
    createRenderRoot() { return this; }
}