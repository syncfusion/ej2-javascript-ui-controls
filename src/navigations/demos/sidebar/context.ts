
import { Sidebar } from '../../src/sidebar/index';

let sidebarObj: Sidebar = new Sidebar({
    showBackdrop: true,
    closeOnDocumentClick: true,
    width: '300px',
    type: 'Push',
    target: 'maincontent',
    close: function (args: any) {
        document.getElementById("show").style.display = "block";
    },
    open: function (args: any) {
        document.getElementById('close').onclick = function () {
            sidebarObj.hide();
        }
    },
    change: function (args: any) {

    },
});
sidebarObj.appendTo('#myBar');

document.getElementById('show').onclick = function (args: any) {
    sidebarObj.show();
}