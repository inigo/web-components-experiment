import {customElement} from "lit/decorators.js";
import {html, LitElement} from "lit";
import {ChartData, DataStore} from "./data-store-element.ts";


@customElement('data-table')
export class DataTable extends LitElement {
    store: DataStore | undefined = undefined;

    private unsubscribe = () => {};

    render() {
        console.debug("Rendering table");
        if (!this.store) this.connectToStore();
        const data = this.store?.getData();
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

    connectToStore() {
        console.debug("Connecting table to data store");
        this.store = document.querySelector('data-store') as DataStore;
        this.unsubscribe = this.store?.subscribe((_: ChartData) => {
            this.requestUpdate();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe();
    }
}