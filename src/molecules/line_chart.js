import React from 'react'
import Chart from 'react-apexcharts'
import ComponentBreakLine from '../atoms/breakline';
import GetLimit from '../components/controls/limit'
import { getLocal } from '../modules/storages/local';

export default function ComponentLineChart({items, filter_name}) {
    //Initial variable
    var chart = [];

    //Converter
    const data = Object.values(items);

    function getSeries(val){
        let catSeries = [];
        val.forEach(e => { 
            catSeries.push({
                x: e.context,
                y: parseInt(e.total)
            });
        });
        return catSeries;
    }

    const keyType = getLocal("stats_type_sess")

    chart = {
        series: [{
            data: getSeries(data),
            name: keyType
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                colors: ['#00A7EA', 'transparent'], 
                opacity: 0.5
                },
            },
        },
    };

    return (
        <div className='custom-tbody' style={{padding:"6px"}}>
            <div className="me-4">
                {
                    filter_name ? 
                        <>
                            <GetLimit ctx={filter_name} type={"bar"}/>
                            <ComponentBreakLine length={2}/>
                        </>
                    :
                        <></>
                }
                <Chart
                    options={chart.options}
                    series={chart.series}
                    type="line"
                    // height="800"
                />
            </div>
        </div>
    );
}
  