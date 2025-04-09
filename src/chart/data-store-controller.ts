import {ReactiveController, ReactiveControllerHost} from "lit";
import {ChartData, DataStore} from "./data-store-element.ts";

export class DataStoreController implements ReactiveController {
    private host: ReactiveControllerHost;
    private store: DataStore | undefined = undefined;
    private unsubscribe = () => {};

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    getData() {
        return this.store?.getData();
    }

    hostUpdate() {
        if (this.store) return;
        // This can't be done in hostConnected, because data-store isn't defined as a component at that point
        this.store = document.querySelector('data-store') as DataStore;
        this.unsubscribe = this.store?.subscribe((_: ChartData) => {
            this.host.requestUpdate();
        });
    }

    hostDisconnected() {
        this.unsubscribe();
    }
}