import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { DrillDown } from '../../demo/Data/Drilldown_Sample';
import { Alignment } from '../../src/treemap/utils/enum';
import { EmitType } from '@syncfusion/ej2-base';
import { IDrillStartEventArgs } from '../../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip);

let prevTime: Date; let curTime: Date;
let drilldown: EmitType<IDrillStartEventArgs> = (args: IDrillStartEventArgs) => {
    args.treemap.levels[2].showHeader = true;
};

let treemap: TreeMap = new TreeMap({
    palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999', '#FF99FF', '#FFCC66'],
    titleSettings: {
        text: 'List of countries by population',
        textStyle: { size: '15px' }
    },
    enableDrillDown: true,
    format: 'n',
    useGroupingSeparator: true,
    dataSource: DrillDown,
    weightValuePath: 'Population',
    tooltipSettings: {
        visible: true,
        format: '${Name} : ${Population}'
    },
    leafItemSettings: {
        labelPath: 'Name',
        showLabels: false,
        labelStyle: { size: '0px' },
        border: { color: 'black', width: 0.5 }
    },
    levels: [
        { groupPath: 'Continent', border: { color: 'black', width: 0.5 } },
        { groupPath: 'States', border: { color: 'black', width: 0.5 } },
        { groupPath: 'Region', showHeader: false, border: { color: 'black', width: 0.5 } },
    ],
    drillStart: drilldown
});
treemap.appendTo('#container');

document.getElementById('drillView').onchange = () => {
    let drilldown: HTMLInputElement = <HTMLInputElement>document.getElementById('drillView');
    treemap.enableDrillDown = drilldown.checked;
    treemap.refresh();
};
document.getElementById('breadCrumb').onchange = () => {
    let breadcrumb: HTMLInputElement = <HTMLInputElement>document.getElementById('breadCrumb');
    treemap.enableBreadcrumb = breadcrumb.checked;
    treemap.refresh();
};
document.getElementById('connectorText').onchange = () => {
    let connector = <HTMLSelectElement>document.getElementById('connectorText');
    treemap.breadcrumbConnector = connector.value;
    treemap.refresh();
};
document.getElementById('header').onchange = () => {
    let alignment = <HTMLSelectElement>document.getElementById('header');
    treemap.levels[0].headerAlignment = <Alignment>alignment.value;
    treemap.refresh();
};
document.getElementById('label').onchange = () => {
    let labelalignment = <HTMLSelectElement>document.getElementById('label');
    treemap.levels[2].headerAlignment = <Alignment>labelalignment.value;
    treemap.refresh();
};