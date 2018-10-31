import { Sidebar } from '../../src/sidebar/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
/**
 * Multiple sidebar sample
 */

//initialize the sidebar component
let leftSidebar: Sidebar = new Sidebar({
    width: "350px",
    type: 'Push'

});
leftSidebar.appendTo('#leftsidebar');
//end of leftSidebar initialization

let rightSidebar: Sidebar = new Sidebar({
    width: "350px",
    position: 'Right',
    type: 'Push'
});
rightSidebar.appendTo('#rightsidebar');
//end of rightSidebar initialization

// Toggle(Open/Close) the leftsidebar
document.getElementById('toggle-btn').onclick = function () {
    leftSidebar.toggle();
};
// Toggle(Open/Close) the rightsidebar
document.getElementById('toggle-btn2').onclick = function () {
    rightSidebar.toggle();
};