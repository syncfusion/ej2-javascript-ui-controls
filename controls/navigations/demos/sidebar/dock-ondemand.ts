import { Sidebar } from '../../src/sidebar/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(false);
/**
 * Dock-ondemand sample
 */

//Sidebar initialization
let dockBar: Sidebar = new Sidebar({
    width: '220px',
    dockSize: '72px',
    change: onChange
});

dockBar.appendTo('#dockSidebar');
//end of Sidebar initialization

//show the sidebar 
document.getElementById('show').onclick = (): void => {
    dockBar.show();
};
//hide the sidebr
document.getElementById('hidebtn').onclick = (): void => {
    dockBar.hide();
};
// change the enabledock while expand or collapse the sidebar 
function onChange(args: any): void {
    this.enableDock = true;
}
