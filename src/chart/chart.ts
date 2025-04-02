import Highcharts from "highcharts";

const url = '/data.json';

export function drawChart() {
    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.debug("Drawing chart");

            Highcharts.chart('chart', {
                credits: {enabled: false},
                chart: {
                    type: 'column',
                },
                title: {
                    text: data.title
                },
                xAxis: {
                    categories: data.categories
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
                series: data.series
            });
        })
        .catch(error => console.error('Error fetching the data:', error));

}