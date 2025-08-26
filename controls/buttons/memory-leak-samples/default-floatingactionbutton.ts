import { Fab} from '../src/index';
/**
 * Floating Action Button (FAB) Default Sample
 */

document.getElementById('render').addEventListener('click', renderFABs);
document.getElementById('destroy').addEventListener('click', destroyFABs);

let fabObj1: Fab;
let fabObj2: Fab;
let fabObj3: Fab;
let fabObj4: Fab;

function renderFABs(): void {
    // Icon only
    fabObj1 = new Fab({
        iconCss: 'e-icons e-people',
        position: 'TopLeft',
        isPrimary: false,
        target: '#target-container'
    });
    fabObj1.appendTo('#icon');

    // Icon with Label
    fabObj2 = new Fab({
        iconCss: 'e-icons e-people',
        position: 'TopRight',
        content: "Contact",
        target: '#target-container'
    });
    fabObj2.appendTo('#iconLabel');

    // Icon with Disabled true
    fabObj3 = new Fab({
        iconCss: 'e-icons e-people',
        content: 'Disabled',
        disabled: true,
        position: 'BottomLeft',
        target: '#target-container',
    });
    fabObj3.appendTo('#disabled');

    // Label only
    fabObj4 = new Fab({
        content: 'Text Content',
        position: 'BottomRight',
        cssClass: 'e-warning',
        target: '#target-container'
    });
    fabObj4.appendTo('#label');
}

function destroyFABs(): void {
    if (fabObj1) { fabObj1.destroy(); fabObj1 = null; }
    if (fabObj2) { fabObj2.destroy(); fabObj2 = null; }
    if (fabObj3) { fabObj3.destroy(); fabObj3 = null; }
    if (fabObj4) { fabObj4.destroy(); fabObj4 = null; }
}
