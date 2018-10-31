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
document.getElementById('tippositions').onchange = function () {
    let ddl: HTMLSelectElement = document.getElementById('tippositions') as HTMLSelectElement;
    tooltip.tipPointerPosition = <TipPointerPosition>ddl.value;
    tooltip.dataBind();
};