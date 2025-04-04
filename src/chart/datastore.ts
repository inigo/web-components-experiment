
const url = '/data.json';

export class DataStore {
    private data: ChartData | undefined = undefined;
    private listeners: Function[] = [];

    constructor() {
        this.retrieveData().then(() => this.notifyListeners());
    }

    private async retrieveData() {
        try {
            const response = await fetch(url);
            this.data = await response.json();
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    getData(): ChartData | undefined {
        return this.data;
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

export const defaultDataStore = new DataStore();


