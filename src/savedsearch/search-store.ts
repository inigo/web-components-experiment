export class SearchStore {
    readonly storageKey = 'saved-searches';

    private searches: SavedSearch[] = [];
    private listeners: Function[] = [];

    constructor() {
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

    // @todo Remove this once there's an actual way to add searches
    setupDefaultSearches() {
        if (this.searches.length === 0) {
            this.addSearch('All', '?something');
            this.addSearch('My files', '?other');
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
        this.notifyListeners();
        return newSearch;
    }

    removeSearch(id: string) {
        this.searches = this.searches.filter(search => search.id !== id);
        this.saveToStorage();
        this.notifyListeners();
    }

    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.searches));
    }
}

export interface SavedSearch {
    id: string;
    title: string;
    query: string;
    timestamp: number;
}

export const defaultSearchStore = new SearchStore();


