import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip sample
 */

let tooltipElement: HTMLElement = document.createElement('div');
tooltipElement.innerHTML = '<b>Environmentally friendly</b> or environment-friendly, (also referred to as eco-friendly, nature-friendly, and green) are marketing and sustainability terms referring to goods and services, laws, guidelines and policies that inflict reduced, minimal, or no harm upon ecosystems or the environment.';
let tooltip1: Tooltip = new Tooltip({
    content: tooltipElement,
    height: '100px',
    opensOn: 'Click',
    target: '#staticlink',
    width: '300px'
});
tooltip1.appendTo('#tooptip1');

let tooltip2: Tooltip = new Tooltip({
    content: 'Tip pointer disabled',
    offsetX: 20,
    offsetY: 20,
    opensOn: 'Click',
    position: 'RightCenter',
    showTipPointer: false
});
tooltip2.appendTo('#tooltip2');

let tooltip3: Tooltip = new Tooltip({
    content: 'Tooltip in sticky mode,click close icon to close tooltip',
    isSticky: true,
    opensOn: 'Click',
    position: 'RightCenter',
    width: 120
});
tooltip3.appendTo('#tooltip3');
