import { RadioButton } from '@syncfusion/ej2-buttons';
import { Sidebar } from '../src/sidebar/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

document.getElementById('render').addEventListener('click', renderSidebar);
document.getElementById('destroy').addEventListener('click', destorySidebar);

let defaultSidebar: Sidebar;

function renderSidebar(): void {
    // Sidebar Initialization
    defaultSidebar = new Sidebar({
        width: "250px",
        position: "Left",
        dockSize: '100px',
        enableDock: true,
        type: "Push",
        target: '.maincontent'
    });
    defaultSidebar.appendTo('#default-sidebar');
    //end of Sidebar initialization
}
function destorySidebar(): void {
    if (defaultSidebar && !defaultSidebar.isDestroyed) {
        defaultSidebar.destroy();
        defaultSidebar = null;
    }
}
//radio button initialization
let leftbutton: RadioButton = new RadioButton({ label: 'Left', name: 'state', checked: true, change: positionChange });
leftbutton.appendTo('#left');

let rightbutton: RadioButton = new RadioButton({ label: 'Right', name: 'state', change: positionChange });
rightbutton.appendTo('#right');

// Toggle(Open/Close) the Sidebar
document.getElementById('toggle').onclick = (): void => {
    defaultSidebar.toggle();
};

// Close the Sidebar
document.getElementById('close').onclick = (): void => {
    defaultSidebar.hide();
};

document.getElementById('hamburger').onclick = (): void => {
    defaultSidebar.show();
};

// change the Sidebar position
function positionChange(args: any): void {
    defaultSidebar.position = (args.event.target.id === 'left') ? 'Left' : 'Right';
    if (args.event.target.id === 'right') {
        document.getElementById('hamburger').classList.add('e-rtl');
    }
    if (args.event.target.id === 'left') {
        document.getElementById('hamburger').classList.remove('e-rtl');
    }
}
