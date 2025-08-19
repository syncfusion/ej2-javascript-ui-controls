import { Tooltip } from '../src/tooltip/tooltip';

let tooltipObj: Tooltip;

document.getElementById('render').addEventListener('click', renderStickyTooltip);
document.getElementById('destroy').addEventListener('click', destroyStickyTooltip);

function renderStickyTooltip(): void {
    tooltipObj = new Tooltip({
        content: 'Tooltip Content',
        opensOn: 'Click',
        isSticky: true,
        animation: {
            open: { effect: 'None', duration: 0, delay: 0 },
            close: { effect: 'None', duration: 0, delay: 0 }
        },
        created: function () {
            tooltipObj.open();
        },
    });
    tooltipObj.appendTo("#tooltip");
}

function destroyStickyTooltip() {
    if (tooltipObj && !tooltipObj.isDestroyed) {
        tooltipObj.destroy();
        tooltipObj = null;
    }
}