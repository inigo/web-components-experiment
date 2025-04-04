import {WebComponentElement} from "./web-component-interface.ts";

/**
 * Keep the browser history aligned with the current state of the data chart, by
 * reading and updating the URL hash.
 *
 * @listens hashchange
 */
export class DataHistoryManager extends HTMLElement implements WebComponentElement {

    /** Update the hash if it has changed, adding to the browser history */
    updateHash(newValues: Record<string, string>): void {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        hash.sort();
        const originalHashString = hash.toString();

        Object.entries(newValues).forEach(([key, value]) => hash.set(key, value));
        hash.sort();

        console.debug(`New hash is ${hash} compared to original ${originalHashString}`);
        if (hash.toString() !== originalHashString) {
            history.pushState(null, '', `#${hash}`);
        }
    }

    handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        const params = this.parseHashParams(hash);

        if (params.chartType) {
            const el = document.querySelector(`[data-purpose="chartType"]`);
            const selectElement = el as HTMLSelectElement;
            if (selectElement && selectElement.value !== params.chartType) {
                console.debug(`Because of hash change, setting chart type to ${params.chartType}`);
                selectElement.value = params.chartType;
                selectElement.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }
    }

    private parseHashParams(hash: string): Record<string, string> {
        if (!hash) return {};

        const searchParams = new URLSearchParams(hash);
        const result: Record<string, string> = {};
        searchParams.forEach((value, key) => result[key] = value);

        return result;
    }

    connectedCallback() {
        window.addEventListener('hashchange', this.handleHashChange);
        requestAnimationFrame(() => this.handleHashChange());
    }

    disconnectedCallback() {
        document.removeEventListener('hashchange', this.handleHashChange);
    }
}