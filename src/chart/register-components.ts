import {DataHistoryManager} from "./data-history-manager-element.ts";
import {DataEventMediator} from "./data-event-mediator-element.ts";
import {DataChart} from "./data-chart-element.ts";
import {DataTable} from "./data-table-element.ts";

export function registerDataChartComponents(): void {
    // Web components using @customElement can alternatively be registered by importing them individually
    // or this method will register all of them together

    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
    if (!customElements.get('data-history-manager')) {
        customElements.define('data-history-manager', DataHistoryManager);
    }
    if (!customElements.get('data-chart')) {
        customElements.define('data-chart', DataChart);
    }
    if (!customElements.get('data-table')) {
        customElements.define('data-table', DataTable);
    }
}