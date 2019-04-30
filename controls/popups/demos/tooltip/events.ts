import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import { createElement } from '@syncfusion/ej2-base';
/**
 * tooltip events sample
 */
let tooltip: Tooltip;
tooltip = new Tooltip({
    created: create,
    beforeRender: beforeRender,
    beforeOpen: beforeOpen,
    afterOpen: afterOpen,
    beforeClose: beforeClose,
    afterClose: afterClose,
    destroyed: destroy
}, '#tooltip1');

document.getElementById('clear').onclick = () => {
    document.getElementById('EventLog').innerHTML = '';
};
document.getElementById('open').onclick = () => {
    tooltip.open(document.getElementById('tooltip1'));
};
document.getElementById('close').onclick = () => {
    tooltip.close();
};
document.getElementById('destroy').onclick = () => {
    tooltip.destroy();
};
function beforeRender(args: TooltipEventArgs): void {
    console.log(args);
    appendElement('Tooltip <b>beforeRender</b> event called<hr>');
}
function beforeOpen(args: TooltipEventArgs): void {
    console.log(args);
    appendElement('Tooltip <b>beforeOpen</b> event called<hr>');
}
function afterOpen(args: TooltipEventArgs): void {
    console.log(args);
    appendElement('Tooltip <b>afterOpen</b> event called<hr>');
}
function beforeClose(args: TooltipEventArgs): void {
    console.log(args);
    appendElement('Tooltip <b>beforeClose</b> event called<hr>');
}
function afterClose(args: TooltipEventArgs): void {
    console.log(args);
    appendElement('Tooltip <b>afterClose</b> event called<hr>');
}
function create(args: Object): void {
    console.log(args);
    appendElement('Tooltip <b>created</b> event called<hr>');
}
function destroy(args: Object): void {
    console.log(args);
    appendElement('Tooltip <b>destroyed</b> event called<hr>');
}
function appendElement(html: string): void {
    let span: HTMLElement = createElement('span', { innerHTML: html });
    let log: HTMLElement = document.getElementById('EventLog');
    log.insertBefore(span, log.firstChild);
}