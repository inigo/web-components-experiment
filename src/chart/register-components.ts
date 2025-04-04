import {DataHistoryManager} from "./data-history-manager.ts";
import {DataEventMediator} from "./data-event-mediator.ts";

export function registerComponents(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
    if (!customElements.get('data-history-manager')) {
        customElements.define('data-history-manager', DataHistoryManager);
    }
    // The Lit elements like data-chart do not need to be registered separately, because @customElement does it
    // but that can't be applied to non-Lit elements.
}