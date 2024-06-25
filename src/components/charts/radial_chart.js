import React from 'react';
import Chart from 'react-apexcharts';
import GetLimit from '../controls/limit'

export default function GetRadialChart({val, label}) {
    //Initial variable
    var chart = [];

    chart = {
        series: [val],
        options: {
            chart: {
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: `65%`,
                    }
                },
            },
            colors: [
                val < 50 ? 'var(--primaryColor)' : 
                val < 75 ? 'var(--warningBG)' :
                'var(--dangerBG)'
            ],
            labels: [label],
        },
    };

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
  