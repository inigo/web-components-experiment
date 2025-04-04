import {DataHistoryManager} from "./data-history-manager.ts";
import {DataEventMediator} from "./data-event-mediator.ts";

export function registerComponents(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
    if (!customElements.get('data-history-manager')) {
        customElements.define('data-history-manager', DataHistoryManager);
    }
}