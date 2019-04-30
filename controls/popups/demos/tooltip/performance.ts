import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip performance sample
 */
let start: number = Date.now();
let tooltip: Tooltip = new Tooltip({
    target: 'body [title]'
});
tooltip.appendTo('body');
let end: number = Date.now();
document.getElementById('time').innerText = 'Tooltip Loading time : ' + (end - start) + 'ms';
