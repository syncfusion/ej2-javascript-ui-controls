import { Sidebar } from '../../src/sidebar/index';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
/**
 * Position sample
 */

//intialize the sidebar component
let defaultSidebar: Sidebar = new Sidebar();
defaultSidebar.appendTo('#default');
//end of Sidebar initialization

// initialize the Radiobutton component
let leftbutton: RadioButton = new RadioButton({ label: 'Left', name: 'state', checked: true, change: positionChange });
leftbutton.appendTo('#left');

let rightbutton: RadioButton = new RadioButton({ label: 'Right', name: 'state', change: positionChange });
rightbutton.appendTo('#right');
// change the sidebar position
function positionChange(args: any) {
    defaultSidebar.position = (args.event.target.id == "left") ? "Left" : "Right";
}
