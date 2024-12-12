import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import{ IDrillStartEventArgs } from '../src/treemap/model/interface';
import{ IDrillEndEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip);

let data: Object[] = [
  { count: 2010, reason1: 'V', reason2: 'A', reason3: 'L' },
  { count: 2012, reason1: 'V', reason2: 'A', reason3: 'M' },
  { count: 529, reason1: 'V', reason2: 'A', reason3: 'N' },
  { count: 2009, reason1: 'V', reason2: 'A', reason3: 'O' },
  { count: 105, reason1: 'V', reason2: 'A', reason3: 'P' },
  { count: 2213, reason1: 'V', reason2: 'B', reason3: 'Q' },
  { count: 3, reason1: 'V', reason2: 'B', reason3: 'R' },
  { count: 7634, reason1: 'W', reason2: 'A' },
  { count: 1877, reason1: 'W', reason2: 'B' },
  { count: 877, reason1: 'V', reason2: 'A', reason3: 'S' },
  { count: 5610, reason1: 'Y', reason2: 'A' },
  { count: 6635, reason1: 'Z', reason2: 'A' },
  { count: 780, reason1: 'Z', reason2: 'B' },
  { count: 225, reason1: 'Z', reason2: 'C' }
];

let treemap: TreeMap = new TreeMap(
  {
    palette: ['#f44336', '#29b6f6', '#ab47bc', '#ffc107', '#5c6bc0', '#009688'],
    layoutType: 'Squarified',
    dataSource: data,
    weightValuePath: 'count',
    enableDrillDown: true,
    enableBreadcrumb: true,
    breadcrumbConnector: ' // ',
    leafItemSettings: {
      showLabels: true,
      
    },
    levels: [
      {
        groupPath: 'reason1',
        groupGap: 0,
        border: { color: 'black', width: 0.5 }
      },
      {
        groupPath: 'reason2',
        groupGap: 10,
        border: { color: 'white', width: 0.5 }
      },
      { groupPath: 'reason3', border: { color: '#fff', width: 1 } }
    ]
  },
  '#container'
);
