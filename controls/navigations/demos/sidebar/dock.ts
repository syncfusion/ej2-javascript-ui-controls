import { Sidebar } from '../../src/sidebar/index';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(false);
/**
 * Sidebar Dock sample
 */

// Sidebar initialization
let dockBar: Sidebar = new Sidebar({
    width: '220px',
    dockSize: '72px',
    enableDock: true
});
dockBar.appendTo('#dockSidebar');

//radio button initialization
let leftbutton: RadioButton = new RadioButton({ label: 'Left', name: 'state', checked: true, change: positionChange });
leftbutton.appendTo('#left');

let rightbutton: RadioButton = new RadioButton({ label: 'Right', name: 'state', change: positionChange });
rightbutton.appendTo('#right');

function positionChange(args: any): void {
    dockBar.position = (args.event.target.id === 'left') ? 'Left' : 'Right';
}

//switch the expand and collapse state
document.getElementById('toggle').onclick = (): void => {
    dockBar.toggle();
}
