/**
 * Funnel Series
 */
import {
    AccumulationChart, AccumulationDataLabel, AccumulationChartModel, FunnelSeries, AccumulationLegend
} from '../../../src/accumulation-chart/index';
import { getInstance } from '@syncfusion/ej2-base';
AccumulationChart.Inject(AccumulationDataLabel, FunnelSeries, AccumulationLegend);

let pieModel: AccumulationChartModel = {
    series: [
        {
            dataSource: [
                { 'x': 'USA', y: 46, text: 'United States of America: 46' },
                { 'x': 'China', y: 26, text: 'China: 26' },
                { 'x': 'Russia', y: 19, text: 'Russia: 19' },
                { 'x': 'Germany', y: 17, text: 'Germany: 17' },
               
            ], name: 'RIO',
            xName: 'x',
            yName: 'y',
            startAngle: 60,
          
            innerRadius: '0%',
            emptyPointSettings: { mode: 'Zero'},
            dataLabel: {
                visible: true, position: 'Outside', connectorStyle: { type : 'Curve', length: '20'},
                name: 'text',
                font: { color: '#000', fontWeight: '600'}
            },
        }
    ],
    legendSettings: {
        visible: false
    },
    //Initializing Tooltip
    tooltip: { enable: true, format: '${point.x} : <b>${point.y}%</b>' },
    //Initializing Title
    title: 'RIO Olympics Gold',
};



let pieFullWidth: AccumulationChart = new AccumulationChart(pieModel);
pieFullWidth.appendTo('#fullPie');


let pieTemplate: AccumulationChart = new AccumulationChart(pieModel);
pieTemplate.title = 'Pie Chart with Templates';
pieTemplate.series[0].dataLabel.template = '<div>${point.x}';
pieTemplate.appendTo('#pie-template')


let piechart: AccumulationChart = new AccumulationChart (
    {
        enableSmartLabels: false,
        legendSettings: {visible: true},
      series: [
        {
            
          xName: 'x', yName: 'y',
          dataLabel: {
            visible: true,
            position: 'Outside',
           template: '<div>${point.x} : ${point.y}% </div>',
                      font: { color: '#000', fontWeight: '600' }
  
          },
          
          dataSource: [
            { 'x': 'Chrome', y: 37, },
                      { 'x': 'UCBrowser', y: 26,  },
                      { 'x': 'iPhones', y: 19,  },
                      { 'x': 'Others', y: 8, },
          ]
        }
      ]
    }
  );
  piechart.appendTo('#app');