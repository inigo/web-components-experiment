import Highcharts, {SeriesOptionsType} from "highcharts";
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ChartData, DataStore, defaultDataStore} from "./chart-data.ts";

@customElement('data-chart')
export class DataChart extends LitElement {
    @property({ type: DataStore })
    store: DataStore = defaultDataStore;

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

    firstUpdated() {
        const chartElement = this.shadowRoot?.getElementById('shadow-chart');
        if (chartElement) {
            const data = this.store.getData();
            this.chart = Highcharts.chart(chartElement, {
                credits: {enabled: false},
                chart: {
                    type: 'column',
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
                    }
                },
                series: (data?.series ?? []) as SeriesOptionsType[],
            });
        }
    }

    private updateChartData() {
        const data = this.store.getData();

        if (!this.chart || !data) return;

        this.chart.setTitle({ text: data.title });
        this.chart.xAxis[0].setCategories(data.categories);

        // Update series data
        data.series.forEach((seriesData, index) => {
            if (this.chart?.series[index]) {
                this.chart.series[index].setData(seriesData.data, false);
            } else if (this.chart) {
                this.chart.addSeries(seriesData as SeriesOptionsType, false);
            }
        });
        // Remove unused series
        while (this.chart.series.length > data.series.length) {
            if (this.chart.series[this.chart.series.length - 1]) {
                this.chart.series[this.chart.series.length - 1].remove(false);
            }
        }

        // Redraw chart once with all changes
        this.chart.redraw();
    }
}