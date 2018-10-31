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
    width: '300px',
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});
tooltip1.appendTo('#tooptip1');

let tooltip2: Tooltip = new Tooltip({
    content: 'Tip pointer disabled',
    offsetX: 20,
    offsetY: 20,
    opensOn: 'Click',
    position: 'RightCenter',
    showTipPointer: false,
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});
tooltip2.appendTo('#tooltip2');

let tooltip3: Tooltip = new Tooltip({
    content: 'Tooltip in sticky mode,click close icon to close tooltip',
    isSticky: true,
    opensOn: 'Click',
    position: 'RightCenter',
    width: 120,
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});
tooltip3.appendTo('#tooltip3');
document.getElementById('material').onclick = (e : Event) => {
    document.getElementById("theme").setAttribute('href','../../styles/material.css');
};
document.getElementById('fabric').onclick = (e : Event) => {
    document.getElementById("theme").setAttribute('href','../../styles/fabric.css');
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.getElementById("theme").setAttribute('href','../../styles/bootstrap.css');
};