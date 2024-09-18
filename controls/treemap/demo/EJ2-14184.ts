import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import{ IDrillStartEventArgs } from '../src/treemap/model/interface';
import{ IDrillEndEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip);

let data: Object[] = [
  {Name:"United States", Capital:"DC", GDP:17946 },
  {Name:"China",Capital:"Beijing", GDP:10866 },
  {Name:"Japan",Capital:"Tokyo", GDP:4123 },
  {Name:"Germany",Capital:"Frankfurt", GDP:3355 },
  {Name:"United Kingdom",Capital:"London", GDP:2848 },
  {Name:"France",Capital:"Paris", GDP:2421 },
  {Name:"India", Capital:"Delhi",GDP:1234 },
  {Name:"India Mumbai",Capital:"Delhi", GDP:3456 },
  {Name:"India Delhi",Capital:"Delhi", GDP:5678 },
  {Name:"India Chennai",Capital:"Delhi", GDP:7890 },
  {Name:"Italy",Capital:"Rome", GDP:1814 },
  {Name:"ItalyRome", Capital:"Rome",GDP:1814 },
  {Name:"ItalyVenice",Capital:"Venice", GDP:1814 },
  {Name:"Brazil",Capital:"Brazilia", GDP:1774 },
  {Name:"Canada",Capital:"Ottawa", GDP:1550 }
];
let treemap: TreeMap = new TreeMap({
  dataSource: data,
  weightValuePath: 'GDP',
  enableDrillDown: true,
  levels: [
    { groupPath: 'Name', border: { color: 'black', width: 0.5 } },
    { groupPath: 'Capital', border: { color: 'black', width: 0.5 } },
  ]
}, '#container');