import { Tooltip, Position, TipPointerPosition } from '../../../src/tooltip/tooltip';
let tooltip: Tooltip = new Tooltip({
    content: 'Tooltip Content',
    height: 50,
    showTipPointer: false,
});

tooltip.appendTo("#tooltip");

tooltip.open(document.getElementById('tooltip'));






