import { Tooltip, Position, TipPointerPosition } from '../../src/tooltip/tooltip';
/**
 * tooltip position sample
 */

let tooltip: Tooltip = new Tooltip({
    content: 'Tooltip Content',
    opensOn: 'Click',
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});
tooltip.appendTo("#tooltip");
document.getElementById('positions').onchange = function () {
    let ddl: HTMLSelectElement = document.getElementById('positions') as HTMLSelectElement;
    tooltip.position = <Position>ddl.value;
    tooltip.dataBind();
};