import { Tooltip, TooltipEventArgs, Effect } from '../../src/tooltip/tooltip';
/**
 * tooltip sample
 */

let tiptl: Tooltip = new Tooltip({ content: 'Tooltip display on Top Left', position: 'TopLeft' }, '#tl');
let tiptc: Tooltip = new Tooltip({ content: 'Tooltip display on Top Center', position: 'TopCenter' }, '#tc');
let tiptr: Tooltip = new Tooltip({ content: 'Tooltip display on Top Right', position: 'TopRight' }, '#tr');

let tiplt: Tooltip = new Tooltip({ content: 'Tooltip display on Left Top', position: 'LeftTop' }, '#lt');
let tiplc: Tooltip = new Tooltip({ content: 'Tooltip display on Left Center', position: 'LeftCenter' }, '#lc');
let tiplb: Tooltip = new Tooltip({ content: 'Tooltip display on Left Bottom', position: 'LeftBottom' }, '#lb');

let tiprt: Tooltip = new Tooltip({ content: 'Tooltip display on Right Top', position: 'RightTop' }, '#rt');
let tiprc: Tooltip = new Tooltip({ content: 'Tooltip display on Right Center', position: 'RightCenter' }, '#rc');
let tiprb: Tooltip = new Tooltip({ content: 'Tooltip display on Right Bottom', position: 'RightBottom' }, '#rb');


let tipbl: Tooltip = new Tooltip({ content: 'Tooltip display on Bottom Left', position: 'BottomLeft' }, '#bl');
let tipbc: Tooltip = new Tooltip({ content: 'Tooltip display on Bottom Center', position: 'BottomCenter' }, '#bc');
let tipbr: Tooltip = new Tooltip({ content: 'Tooltip display on Bottom Right', position: 'BottomRight' }, '#br');

let tooltip1: Tooltip = new Tooltip({
    target: '#link1,#link2,#link3,#link4,#link5,#link6,#link7', position: 'RightCenter'
});
tooltip1.appendTo('#tstooptip');

let tooltipElement: HTMLElement = document.createElement('div');
tooltipElement.innerHTML = '<b>Environmentally friendly</b> or environment-friendly, (also referred to as eco-friendly, nature-friendly, and green) are marketing and sustainability terms referring to goods and services, laws, guidelines and policies that inflict reduced, minimal, or no harm upon ecosystems or the environment.';
let tooltip2: Tooltip = new Tooltip({
    target: '#staticlink', width: '300px', height: '100px', content: tooltipElement
});
tooltip2.appendTo('#statictooptip');

let tooltip3: Tooltip = new Tooltip({
    target: '.circletool',
    closeDelay: 1000,
    animation: { open: { effect: 'None' }, close: { effect: 'None' } },
    beforeRender: onBeforeRender
});
function onBeforeRender(args: TooltipEventArgs): void {
    if (args.element) {
        args.element.style.display = 'block';
        args.element.style.transitionProperty = 'Left,top';
        args.element.style.transitionDuration = '1000ms';
    }
}
tooltip3.appendTo('#transitiontooltip');

let tooltip4: Tooltip = new Tooltip({
    position: 'BottomCenter',
    showTipPointer: false,
    offsetY: 10,
    animation: { open: { effect: 'ZoomIn', duration: 750, delay: 0 }, close: { effect: 'ZoomOut', duration: 750, delay: 0 } }
});
tooltip4.appendTo('#animatetooltip');
document.querySelector('#animationlist').addEventListener('change', function () {
    tooltip4.animation = {
        open: { effect: this.value + 'In' as Effect, duration: 750, delay: 0 },
        close: { effect: this.value + 'Out' as Effect, duration: 750, delay: 0 }
    };
    tooltip4.dataBind();
});

let tooltip5: Tooltip = new Tooltip({
    mouseTrail: true,
    animation: { open: { effect: 'None' }, close: { effect: 'None' } }
});
tooltip5.appendTo('#trailtooltip');

let tooltip6: Tooltip = new Tooltip({
    isSticky: true,
    position: 'RightCenter',
    width: 120
});
tooltip6.appendTo('#stickytooltip');
