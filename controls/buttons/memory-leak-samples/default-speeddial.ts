import { SpeedDialItemModel, SpeedDial } from '../src/index';
let sdObj1: SpeedDial;
let sdObj2: SpeedDial;
let sdObj3: SpeedDial;

document.getElementById('render').addEventListener('click', renderSpeedDials);
document.getElementById('destroy').addEventListener('click', destroySpeedDials);

function renderSpeedDials(): void {
    let iconOnlyItems: SpeedDialItemModel[] = [
        { title: 'Cut', iconCss: 'e-icons e-cut' },
        { title: 'Copy', iconCss: 'e-icons e-copy' },
        { title: 'Paste', iconCss: 'e-icons e-paste' }
    ];

    sdObj1 = new SpeedDial({
        openIconCss: 'e-icons e-edit',
        closeIconCss: 'e-icons e-close',
        items: iconOnlyItems,
        target: '#target',
        position: 'BottomRight'
    });
    sdObj1.appendTo('#fab_linear1');

    sdObj2 = new SpeedDial({
        openIconCss: 'e-icons e-edit',
        closeIconCss: 'e-icons e-close',
        items: iconOnlyItems,
        position: 'BottomLeft',
        mode: 'Radial',
        target: '#target'
    });
    sdObj2.appendTo('#fab_Radial1');

    sdObj3 = new SpeedDial({
        openIconCss: 'e-icons e-edit',
        closeIconCss: 'e-icons e-close',
        items: iconOnlyItems,
        position: 'TopRight',
        mode: 'Radial',
        target: '#target'
    });
    sdObj3.appendTo('#fab_Radial2');
}

function destroySpeedDials(): void {
    if (sdObj1) { sdObj1.destroy(); sdObj1 = null; }
    if (sdObj2) { sdObj2.destroy(); sdObj2 = null; }
    if (sdObj3) { sdObj3.destroy(); sdObj3 = null; }
}