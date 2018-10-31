import { Tooltip } from '../../src/tooltip/tooltip';
import { Draggable } from '@syncfusion/ej2-base';
/**
 * smart position tooltip sample
 */
let tooltip: Tooltip;
tooltip = new Tooltip({
    content: 'Drag me anywhere, to start walking with me !!!',
    offsetX: -15,
    offsetY: 10,
    target: '#demoSmart',
    animation: { open: { effect: 'None' }, close: { effect: 'None' } },
    cssClass: 'customtip'
}, '#targetContainer');
let ele: HTMLElement = document.getElementById('demoSmart');
let drag: Draggable = new Draggable(ele, {
    clone: false,
    drag: (args: any) => {
        tooltip.refresh(args.element);
    },
    dragStart: (args: any) => {
        tooltip.open(args.element);
    },
    dragStop: (args: any) => {
        tooltip.close();
    }
});