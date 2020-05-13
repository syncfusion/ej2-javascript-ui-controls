/** 
 * Customer issue
 */
import { AccumulationChart, AccumulationLegend } from '../../../src/index';
AccumulationChart.Inject(AccumulationLegend);

let pie: AccumulationChart = new AccumulationChart({
    series: [{
        dataSource: [
            { 'x': 'Net-tution and Fees', y: 21, text: '21%' },
        { 'x': 'Self-supporting Operations', y: 21, text: '21%' },
        { 'x': 'Private Gifts', y: 8, text: '8%' },
        { 'x': 'All Other', y: 8, text: '8%' },
        { 'x': 'Local Revenue', y: 4, text: '4%' },
        { 'x': 'State Revenue', y: 21, text: '21%' },
        { 'x': 'Federal Revenue', y: 16, text: '16%' }
        ],  xName: 'x', yName: 'y'
    }],
    legendSettings: { height: '150'},
    title: 'feedback/13645',
    subTitle: 'Issue in legend paging'
},
    '#legendPaging');

