import React from 'react';
import Chart from 'react-apexcharts';

export default function ComponentRadialChart({val, label, custom}) {
    //Initial variable
    var chart = []
    let series = [val]
    let labels = [custom == null ?label:label+' '+custom.extra_desc]
    let sizeHollow = '65%'

    if(Array.isArray(val)){
        series = val
        labels = label
        if(val.length <= 3){
            sizeHollow = '45%'
        } else {
            sizeHollow = '55%'
        }
    }

    const generateColors = (series) => {
        return series.map(value => {
            if (value < 50) {
                return 'var(--primaryColor)'
            } else if (value < 75) {
                return 'var(--warningBG)'
            } else {
                return 'var(--dangerBG)'
            }
        });
    };
    
    chart = {
        series: series,
        options: {
            chart: {
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: sizeHollow,
                    },
                    dataLabels: {
                        name: {
                            show: true,
                        },
                        value: {
                            show: custom != null ? true:false,
                            offsetY: 3.5,
                            formatter: function (seriesName, opts) {
                                if (custom == null) {
                                    return ''
                                } else if (Array.isArray(val)) {
                                    return custom.value[opts.seriesIndex] // still undefined
                                } else {
                                    return custom.value
                                }
                            }
                        }
                    },
                },
            },
            colors: generateColors(series),            
            labels: labels,
        },
    };

    if(custom){
        if(custom.type == 'half'){
            chart.options.plotOptions.radialBar.startAngle = -90
            chart.options.plotOptions.radialBar.endAngle = 90
        }
    }
    if(Array.isArray(val)){
        chart.options.plotOptions.radialBar.startAngle = 0
        chart.options.plotOptions.radialBar.endAngle = 270
        chart.options.plotOptions.radialBar.barLabels = {
            enabled: true,
            useSeriesColors: true,
            fontSize: val.length > 3 ? '11px':'12px',
            formatter: function(seriesName, opts) {
                return custom == null ? seriesName + " : " + opts.w.globals.series[opts.seriesIndex] 
                    : seriesName + " : " + custom.value[opts.seriesIndex]
            },
        }
    }

    return (
        <div className='my-2'>
            <Chart
                options={chart.options}
                series={chart.series}
                type="radialBar"
            />
        </div>
    );
}
  