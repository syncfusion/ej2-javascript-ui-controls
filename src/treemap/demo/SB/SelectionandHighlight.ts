import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapHighlight } from '../../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { importData } from '../treemapData/Import';
import { HighLightMode } from '../../src';
TreeMap.Inject(TreeMapTooltip, TreeMapHighlight);

let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Import and Export details of US'
    },
    dataSource: importData,
    weightValuePath: 'sales',
    levels: [
        { groupPath: 'dataType', fill: '#c5e2f7', headerStyle: { size: '16px' }, headerAlignment: 'Center', groupGap: 5 },
        { groupPath: 'product', fill: '#a4d1f2', headerAlignment: 'Center', groupGap: 2 }
    ],
    leafItemSettings: {
        labelPath: 'type',
        fill: '#8ebfe2',
        labelPosition: 'Center',
        gap: 10
    },
    selectionSettings: {
        enable: true,
        fill: '#58a0d3',
        border: { width: 0.3, color: 'black' },
        opacity: '1'
    },
    highlightSettings: {
        enable: true,
        fill: '#71b0dd',
        border: { width: 0.3, color: 'black' },
        opacity: '1'
    }
});
treemap.appendTo('#container');

document.getElementById('highlightEnable').onchange = () => {
    let highlight: HTMLInputElement = <HTMLInputElement>document.getElementById('highlightEnable');
    treemap.highlightSettings.enable = highlight.checked;
    treemap.refresh();
};
document.getElementById('highlightMode').onchange = () => {
    let mode = <HTMLSelectElement>document.getElementById('highlightMode');
    treemap.highlightSettings.mode = <HighLightMode>mode.value;
    treemap.refresh();
};
document.getElementById('SelectionEnable').onchange = () => {
    let selection: HTMLInputElement = <HTMLInputElement>document.getElementById('SelectionEnable');
    treemap.selectionSettings.enable = selection.checked;
    treemap.refresh();
};
document.getElementById('selectionMode').onchange = () => {
    let selectionmode = <HTMLSelectElement>document.getElementById('selectionMode');
    treemap.selectionSettings.mode = <HighLightMode>selectionmode.value;
    treemap.refresh();
};