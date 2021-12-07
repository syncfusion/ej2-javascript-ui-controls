import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { Airport_Count } from './treemapData/AirPort_Count';
import{ ITreeMapTooltipRenderEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

/**
 * Default sample
 */

let treemap: TreeMap = new TreeMap({
    tooltipSettings: {
        visible: true,
        template: '#Tooltip'
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
    tooltipRendering: function(args: ITreeMapTooltipRenderEventArgs) {
        if (args.item["name"] === "Brazil") {
            args.cancel = true;
        }
    }
});
treemap.appendTo('#container');


