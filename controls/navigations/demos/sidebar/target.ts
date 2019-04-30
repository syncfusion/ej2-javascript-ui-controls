import { Sidebar } from '../../src/sidebar/index';
import { Button } from '@syncfusion/ej2-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
/**
 * Target sample
 */

//Inilialization of sidebar component
let defaultSidebar: Sidebar = new Sidebar({
    width: "280px",
    type: "Push",
    target: '.maincontent'
});
defaultSidebar.appendTo('#default-sidebar');
//end of Sidebar initialization

//toggle button initialization
let togglebtn: Button = new Button({ iconCss: 'e-icons burg-icon', isToggle: true, content: 'Open' }, '#toggle');

// Close the Sidebar
document.getElementById('closebtn').onclick = (): void => {
    defaultSidebar.hide();
    document.getElementById('toggle').classList.remove('e-active');
    togglebtn.content = 'Open'
};

//Click Event
document.getElementById('toggle').onclick = (): void => {
    if (document.getElementById('toggle').classList.contains('e-active')) {
        togglebtn.content = 'Close';
        defaultSidebar.show();
    } else {
        togglebtn.content = 'Open';
        defaultSidebar.hide();
    }
};
