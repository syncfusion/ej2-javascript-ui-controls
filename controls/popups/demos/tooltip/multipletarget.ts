import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip target selector
 */
let tooltip: Tooltip = new Tooltip({
    target: '.e-info',
    position: 'RightCenter',
    opensOn: 'Click Focus'
});
tooltip.appendTo('#details');
