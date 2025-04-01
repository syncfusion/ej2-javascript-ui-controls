import { ChipList } from '../src/chips/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let chipObj: ChipList;
let defaultData = [
    {
        "text": "Apple",
        "cssClass": "e-primary"
    },
    {
        "text": "Microsoft",
        "cssClass": "e-info"
    },
    {
        "text": "Google",
        "cssClass": "e-success"
    },
    {
        "text": "Tesla",
        "cssClass": "e-warning"
    },
    {
        "text": "Intel",
        "cssClass": "e-danger"
    }
]

document.getElementById('render').addEventListener('click', renderChip);
document.getElementById('destroy').addEventListener('click', destoryChip);

function renderChip(): void {
    chipObj = new ChipList({
        allowDragAndDrop: true,
        chips: defaultData,
        enableDelete: true,
        selection: 'Multiple',
        selectedChips: [1, 3],
        cssClass: 'e-outline' },
    '#chip-default');
}

function destoryChip(): void {
    if (chipObj && !chipObj.isDestroyed) {
        chipObj.destroy();
        chipObj = null;
    }
}