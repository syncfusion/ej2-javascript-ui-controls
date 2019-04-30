import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip open modes
 */

let hoverTooltip: Tooltip = new Tooltip({
    opensOn: 'Hover',
    content: 'Tooltip opened on hover'
});
hoverTooltip.appendTo('#tooltiphover');

let clickTooltip: Tooltip = new Tooltip({
    opensOn: 'Click',
    content: 'Tooltip opened on click'
});
clickTooltip.appendTo('#tooltipclick');

let focusTooltip: Tooltip = new Tooltip({
    opensOn: 'Focus',
    content: 'Tooltip opened on focus'
});
focusTooltip.appendTo('#tooltipfocus');

let customTooltip: Tooltip = new Tooltip({
    opensOn: 'Custom',
    content: 'Tooltip opened on custom mode'
});
customTooltip.appendTo('#tooltipcustom');

document.getElementById('tooltipopen').addEventListener('click', function () {
    if (this.getAttribute('data-tooltip-id')) {
        customTooltip.close();
    } else {
        customTooltip.open(this);
    }
});
