import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import { Country_Population } from './treemapData/Country_Population';
import{ LabelAlignment }  from '../src/treemap/utils/enum';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Countries ordered based on Population - 2017',
        textStyle: { size: '15px' }
    },
    dataSource: Country_Population,
    tooltipSettings: {
        visible: true,
        format: '${Country} : ${Population}'
    },
    legendSettings: {
        visible: true,
        mode: 'Interactive',
        width: '300px',
        height: '10',
        position: 'Top'
    },
    format: 'n',
    useGroupingSeparator: true,
    rangeColorValuePath: 'Population',
    weightValuePath: 'Population',
    leafItemSettings: {
        showLabels: true,
        labelPath: 'Country',
        fill: 'red',
        interSectAction:'WrapByWord',
        colorMapping: [
            {
                to: 10000000000,
                from: 100000000,
                label: '200M - 1.3M',
                color: '#4B134F'
            }, { to: 100000000, from: 20000000, label: '20M - 200M', color: '#8C304D' },
            { to: 20000000, from: 100000, label: '0.1M - 20M', color: '#C84B4B' }
        ]
    },
});
treemap.appendTo('#container');