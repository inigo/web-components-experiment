import Highcharts, {SeriesOptionsType} from "highcharts";
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ChartData, DataStore, defaultDataStore} from "./chart-data.ts";
import {PropertyValues} from "@lit/reactive-element";

@customElement('data-chart')
export class DataChart extends LitElement {
    @property({ type: DataStore })
    store: DataStore = defaultDataStore;

    @property()
    chartType: string = 'column';

    private unsubscribe = () => {};
    private chart: Highcharts.Chart | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = this.store.subscribe((_: ChartData) => {
            console.log("Received callback with chart data");
            this.updateChartData();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe();
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    render() {
        console.log("Rendering chart");
        return html`<div id="shadow-chart"></div>`;
    }

    update(changedProperties: PropertyValues) {
        super.update(changedProperties);
        this.updateChartData();
    }

    firstUpdated() {
        const chartElement = this.shadowRoot?.getElementById('shadow-chart');
        if (chartElement) {
            const data = this.store.getData();
            this.chart = Highcharts.chart(chartElement, {
                credits: {enabled: false},
                chart: {
                    type: this.chartType,
                },
                title: {
                    text: data?.title ?? '',
                },
                xAxis: {
                    categories: data?.categories ?? [],
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Population'
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        borderRadius: 0,
                        borderWidth: 0,
                        stacking: 'normal'
                    },
                    series: {
                        animation: {
                            duration: 400,
                        },
                    },
                    line: {
                        marker: { symbol: 'circle' },
                    }
                },
                series: (data?.series ?? []) as SeriesOptionsType[],
            });
        }
    }

    private updateChartData() {
        console.debug("Updating chart data");
        const data = this.store.getData();

        if (!this.chart || !data) return;

        const chart = this.chart;
        
        chart.setTitle({ text: data.title });
        chart.xAxis[0].setCategories(data.categories);

        // Remove the data before changing the chart type - or axis values get confused
        chart.series.slice().forEach((series) => series.remove(false));

        // Update series data
        data.series.forEach((seriesData) => {
            chart.addSeries(seriesData as SeriesOptionsType, false);
        });

        // @ts-ignore
        chart.series.forEach(s => s.update({ 'type': this.chartType }));

        // Redraw chart once with all changes
        chart.redraw();
    }
}