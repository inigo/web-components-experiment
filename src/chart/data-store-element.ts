import {DataChangedEvent} from "./data-event-mediator-element.ts";
import {customElement, property} from "lit/decorators.js";
import {LitElement} from "lit";

@customElement('data-store')
export class DataStore extends LitElement {
    private data: ChartData | undefined = undefined;
    private listeners: Function[] = [];
    private queryParams: Record<string, string> = {};

    @property({converter: parseStringArray})
    private relevantChanges = ['cheese'];

    @property()
    private baseUrl = "/data.json";

    @property()
    private fakeData = false;

    async fetchData() {
        console.debug("Retrieving data for data store");
        try {
            const url = new URL(this.baseUrl, window.location.origin);
            url.search = new URLSearchParams(this.queryParams).toString();
            // When testing with local data and no server, using a _ not a query string means
            // the fake data can be served from the local filesystem easily
            const response = this.fakeData ?
                await fetch(url.toString().replace('?', '_')) :
                await fetch(url);
            this.data = await response.json();
            this.notifyListeners();
        } catch (error) {
            console.error('Error fetching the data:', error);
            // When using fake data from the filesystem, most combinations of results
            // won't exist, so fall back to the basic value
            if (this.fakeData) {
                const response = await fetch(this.baseUrl);
                this.data = await response.json();
                this.notifyListeners();
            }
        }
    }

    getData(): ChartData | undefined {
        return this.data;
    }

    dataParamsHandler = async (event: Event) => {
        const ev = event as DataChangedEvent;
        ev.detail.newValue=="" ?
            delete this.queryParams[ev.detail.fieldChanged] :
            this.queryParams[ev.detail.fieldChanged] = ev.detail.newValue;
        await this.fetchData();
    }

    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.data));
    }

    async connectedCallback() {
        this.relevantChanges.forEach(change => document.addEventListener(`data-${change}-changed`, this.dataParamsHandler));
        await this.fetchData();
    }

    disconnectedCallback() {
        this.relevantChanges.forEach(change => document.removeEventListener(`data-${change}-changed`, this.dataParamsHandler));
    }
}

export interface ChartData {
    title: string;
    categories: string[];
    series: Series[];
}

export interface Series {
    name: string;
    data: number[];
}

function parseStringArray(value: string | null, _: unknown) {
    return (value ?? "").split(",").map(s => s.trim());
}