import { Sidebar } from '../../src/sidebar/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(false);
/**
 * Default dock sample
 */

//Sidebar initialization
let dockBar: Sidebar = new Sidebar({
    width: '220px',
    dockSize: '72px',
    enableDock: true
});
dockBar.appendTo('#dockSidebar');
//end of Sidebar initialization

// show the docksidebar
document.getElementById('show').onclick = (): void => {
    dockBar.show();
};
// hide the docksidebar
document.getElementById('hidebtn').onclick = (): void => {
    dockBar.hide();
};