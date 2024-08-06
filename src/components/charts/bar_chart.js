import React from 'react';
import Chart from 'react-apexcharts';
import GetLimit from '../controls/limit'

export default function GetBarChart({items, filter_name}) {
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

    chart = {
        //series: getSeries(data),
        series: [{
            data: getSeries(data)}],
        options: {
            plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 8,
                },
            },
        }
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
                    type="bar"
                    // height="800"
                />
            </div>
        </div>
    );
}
  