/**
 * Polar Radar Smart Datalabel
 *
 */

import {
    Chart, Tooltip, Legend, PolarSeries, RadarSeries, Category, LineSeries, DataLabel
} from '../../../src/index';
Chart.Inject(Tooltip, Legend, PolarSeries, Category, LineSeries, RadarSeries, DataLabel);

let polarRadarData: Object[] = [
    { x: 'Jan', y: -7.1 }, { x: 'Feb', y: -3.7 },
    { x: 'Mar', y: 0.8 }, { x: 'Apr', y: 6.3 },
    { x: 'May', y: 13.3 }, { x: 'Jun', y: 18.0 },
    { x: 'Jul', y: 19.8 }, { x: 'Aug', y: 18.1 },
    { x: 'Sep', y: 13.1 }, { x: 'Oct', y: 4.1 },
    { x: 'Nov', y: -3.8 }, { x: 'Dec', y: -6.8 },

    { x: 'Jan1', y: -7.1 }, { x: 'Feb1', y: -3.7 },
    { x: 'Mar1', y: 0.8 }, { x: 'Apr1', y: 6.3 },
    { x: 'May1', y: 13.3 }, { x: 'Jun1', y: 18.0 },
    { x: 'Jul1', y: 19.8 }, { x: 'Aug1', y: 18.1 },
    { x: 'Sep1', y: 13.1 }, { x: 'Oct1', y: 4.1 },
    { x: 'Nov1', y: -3.8 }, { x: 'Dec1', y: -6.8 },

    { x: 'Jan2', y: -7.1 }, { x: 'Feb2', y: -3.7 },
    { x: 'Mar2', y: 0.8 }, { x: 'Apr2', y: 6.3 },
    { x: 'May2', y: 13.3 }, { x: 'Jun2', y: 18.0 },
    { x: 'Jul2', y: 19.8 }, { x: 'Aug2', y: 18.1 },
    { x: 'Sep2', y: 13.1 }, { x: 'Oct2', y: 4.1 },
    { x: 'Nov2', y: -3.8 }, { x: 'Dec2', y: -6.8 },

    { x: 'Jan3', y: -7.1 }, { x: 'Feb3', y: -3.7 },
    { x: 'Mar3', y: 0.8 }, { x: 'Apr3', y: 6.3 },
    { x: 'May3', y: 13.3 }, { x: 'Jun3', y: 18.0 },
    { x: 'Jul3', y: 19.8 }, { x: 'Aug3', y: 18.1 },
    { x: 'Sep3', y: 13.1 }, { x: 'Oct3', y: 4.1 },
    { x: 'Nov3', y: -3.8 }, { x: 'Dec3', y: -6.8 },
];

let polar: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'Category',
        labelPlacement: 'OnTicks',
        interval: 2,
        labelIntersectAction: "Hide",
        coefficient: 80
    },
    
    //Initializing Primary Y Axis
    primaryYAxis:
    {
        title: 'Temperature (Celsius)',
        minimum: -25, maximum: 25, interval: 5,
        edgeLabelPlacement: 'Shift',
        labelFormat: '{value}°C',
        labelIntersectAction: "Hide",
    },
    series: [{
        dataSource: polarRadarData,
        xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Polar',
        marker: {
            visible: true,
            height: 10, width: 10,
            shape: 'Pentagon',
            dataLabel: {
                visible: true,

            }
        },
        animation: { enable: false }
    }
    ]

});
polar.appendTo('#polarDataLabel');

document.getElementById("polarInput").onchange = () => {
    let isCheck: boolean = (<HTMLInputElement>document.getElementById("polarInput")).checked;
    if (isCheck) {
        polar.primaryXAxis.labelPosition = 'Inside';
    } else {
        polar.primaryXAxis.labelPosition = 'Outside';
    }
    polar.dataBind();
}


let radar: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'Category',
        labelPlacement: 'OnTicks',
        interval: 2,
        labelIntersectAction: "Hide",
        coefficient: 80
    },
    
    //Initializing Primary Y Axis
    primaryYAxis:
    {
        title: 'Temperature (Celsius)',
        minimum: -25, maximum: 25, interval: 5,
        edgeLabelPlacement: 'Shift',
        labelFormat: '{value}°C',
        labelIntersectAction: "Hide",
    },
    
    series: [{
        dataSource: polarRadarData,
        xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Radar',
        marker: {
            visible: true,
            height: 10, width: 10,
            shape: 'Pentagon',
            dataLabel: {
                visible: true,

            }
        },
        animation: { enable: false }
    }
    ]

});
radar.appendTo('#radarDataLabel');

document.getElementById("radarInput").onchange = () => {
    let isCheck: boolean = (<HTMLInputElement>document.getElementById("radarInput")).checked;
    if (isCheck) {
        radar.primaryXAxis.labelPosition = 'Inside';
    } else {
        radar.primaryXAxis.labelPosition = 'Outside';
    }
    radar.dataBind();
}

