import React from 'react';
import Chart from 'react-apexcharts';
import GetLimit from '../controls/limit'

export default function GetLineChart({items, filter_name}) {
    //Initial variable
    var chart = [];

    //Converter
    const data = Object.values(items);

    function getSeries(val){
        let catSeries = [];
        val.forEach(e => { 
            catSeries.push({
                x: e.context,
                y: parseInt(e.total_ammount)
            });
        });
        return catSeries;
    }

    const keyType = sessionStorage.getItem("flow_type")

    chart = {
        //series: getSeries(data),
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
                colors: ['#f9aa0c', 'transparent'], 
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
                            <GetLimit ctx={filter_name} type={"bar"}/><br></br><br></br>
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
  