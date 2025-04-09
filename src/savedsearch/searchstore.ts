import {ReactiveController, ReactiveControllerHost} from "lit";

export class SearchStoreController implements ReactiveController {
    private readonly storageKey = 'saved-searches';
    private host: ReactiveControllerHost;
    private searches: SavedSearch[] = [];

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    hostConnected() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            try {
                this.searches = JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse saved searches', e);
            }
        }
    }

    private saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.searches));
    }

    getSearches() {
        return [...this.searches]; // Return a copy
    }

    addSearch(title: string, query: string) {
        const newSearch = { id: crypto.randomUUID(), title, query, timestamp: Date.now() };
        this.searches = [...this.searches, newSearch];
        this.saveToStorage();
        this.host.requestUpdate();
        return newSearch;
    }

    removeSearch(id: string) {
        this.searches = this.searches.filter(search => search.id !== id);
        this.saveToStorage();
        this.host.requestUpdate();
    }
}

export interface SavedSearch {
    id: string;
    title: string;
    query: string;
    timestamp: number;
}


