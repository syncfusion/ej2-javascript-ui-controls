import { Tooltip, Position, TipPointerPosition } from '../../../src/tooltip/tooltip';
let tooltip: Tooltip = new Tooltip({
    content: 'Animation effect that applies on the Tooltip, during open and close actions.',
    height: 50,
    isSticky: true,
    enableRtl: true,
    showTipPointer: true,
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});

tooltip.appendTo("#tooltip");

tooltip.open(document.getElementById('tooltip'));






