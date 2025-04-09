import Highcharts, {SeriesOptionsType} from "highcharts";
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {PropertyValues} from "@lit/reactive-element";
import {DataChangedEvent} from "./data-event-mediator-element.ts";
import {listen} from "../component-utils/listen.ts";
import {DataStoreController} from "./data-store-controller.ts";

/**
 * Data visualization chart, powered by Highcharts.
 *
 * @listens {CustomEvent} data-chartType-changed - Change chart type e.g. to column, bar, line
 */
@customElement('data-chart')
export class DataChart extends LitElement {
    private storeController = new DataStoreController(this);

    @property()
    chartType: string = 'column';

    private chart: Highcharts.Chart | null = null;

    @listen("data-chartType-changed")
    public handleChartTypeChanged = (event: Event) => {
        const dataEvent = event as DataChangedEvent;
        const selectedChartType = dataEvent.detail.newValue;
        console.debug(`Changed chart type to ${selectedChartType}`);
        this.chartType = selectedChartType;
    }

    render() {
        console.debug("Rendering chart");
        return html`<div id="shadow-chart"></div>`;
    }

    update(changedProperties: PropertyValues) {
        console.debug("Updating chart");
        super.update(changedProperties);
        this.updateChartData();
    }

    firstUpdated() {
        const chartElement = this.shadowRoot?.getElementById('shadow-chart');
        if (chartElement) {
            const data = this.storeController.getData();
            this.chart = Highcharts.chart(chartElement, {
                credits: {enabled: false},
                chart: {
                    type: this.chartType,
                    style: {
                        fontFamily: 'inherit', // Inherits font family from the containing element
                    }
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
        const data = this.storeController.getData();

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

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

}