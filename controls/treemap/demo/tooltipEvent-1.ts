import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { Airport_Count } from './treemapData/AirPort_Count';
import { ITreeMapTooltipRenderEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

/**
 * Default sample
 */

let treemap: TreeMap = new TreeMap({
    tooltipSettings: {
        visible: true
    },
    dataSource: Airport_Count,
    weightValuePath: 'Count',
    equalColorValuePath: 'Count',
    leafItemSettings: {
        showLabels: true,
        labelPath: 'State',
        labelPosition: 'Center',
        labelStyle: {
            size: '13px'
        },
        fill: '#6699cc',
        border: { width: 1, color: 'white' },
    },
    tooltipRendering: function (args: ITreeMapTooltipRenderEventArgs) {
        args.options["textStyle"].color = "red";
        args.options["textStyle"].fontFamily = "Times New Roman";
        args.options["textStyle"].fontStyle = "italic";
        args.options["textStyle"].fontWeight = "Bold";
        args.options["textStyle"].opacity = 0.5;
        args.options["textStyle"].size = "25px";
        if (args.options["text"][0] === 'Count : 25') {
            args.options["text"][0] = 'Brazil';
        }
    }
});
treemap.appendTo('#container');


