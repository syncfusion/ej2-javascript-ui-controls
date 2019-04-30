import { Sidebar } from '../../src/sidebar/index';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * API sample
 */

// initialize the sidebar component
let sidebarObj: Sidebar = new Sidebar({
    type: "Push",
    width: '260px',
    close: function (args: any) {
        document.getElementById("show").style.display = "block";
        appendElement('Sidebar <b>Close</b> event called<hr>');
    },
    open: function (args: any) {
        appendElement('Sidebar <b>Open</b> event called<hr>');
        document.getElementById('close').onclick = function () {
            sidebarObj.hide();
        }
    },
    created: function () {
        appendElement('Sidebar <b>Created</b> event called<hr>');
        document.getElementById('close').onclick = function () {
            sidebarObj.hide();
        }
    },
    change: function (args: any) {
        appendElement('Sidebar <b>Change</b> event called<hr>');

    },
});
sidebarObj.appendTo('#myBar');
//enable or disable the showbackdrop
document.getElementById("backdrop").onclick = function (args: any) {
    if (sidebarObj.showBackdrop) {
        sidebarObj.showBackdrop = false;
        this.innerText = "ShowBackDrop - Disabled";
    } else {
        sidebarObj.showBackdrop = true;
        this.innerText = "ShowBackDrop - Enabled";
    }

}
// enable or disable the animation 
document.getElementById("animation").onclick = function (args: any) {
    if (sidebarObj.animate) {
        sidebarObj.animate = false;
        sidebarObj.dataBind();
        this.innerText = "Animation - Disabled";
    } else {
        sidebarObj.animate = true;
        sidebarObj.dataBind();
        this.innerText = "Animation - Enabled";
    }

}
// enable or disable the closeondocumentclick
document.getElementById("document").onclick = function (args: any) {
    if (sidebarObj.closeOnDocumentClick) {
        sidebarObj.closeOnDocumentClick = false;
        sidebarObj.dataBind();
        this.innerText = "closeOnDocumentClick - Disabled";
    } else {
        sidebarObj.closeOnDocumentClick = true;
        sidebarObj.dataBind();
        this.innerText = "closeOnDocumentClick - Enabled";
    }

}
// enable or disable the enablegestures
document.getElementById("gesture").onclick = function (args: any) {
    if (sidebarObj.enableGestures) {
        sidebarObj.enableGestures = false;
        sidebarObj.dataBind();
        this.innerText = "enableGestures - Disabled";
    } else {
        sidebarObj.enableGestures = true;
        sidebarObj.dataBind();
        this.innerText = "enableGestures - Enabled";
    }

}

document.getElementById("rtl").onclick = function (args: any) {
    if (sidebarObj.enableRtl) {
        sidebarObj.enableRtl = false;
        sidebarObj.dataBind();
        this.innerText = "RTL - Disabled";
    } else {
        sidebarObj.enableRtl = true;
        sidebarObj.dataBind();
        this.innerText = "RTL - Enabled";
    }

}
// toggle the sidebar
document.getElementById('show').onclick = function (args: any) {
    sidebarObj.toggle();
}

document.getElementById('mediaQuery').onblur = function (args: any) {
    sidebarObj.mediaQuery = window.matchMedia(args.currentTarget.value);
    sidebarObj.dataBind();
}

document.getElementById('width').onblur = function (args: any) {
    sidebarObj.width = args.currentTarget.value;
    sidebarObj.dataBind();
}
// change the type of sidebar 
document.getElementById('type').onchange = function (args: any) {
    sidebarObj.type = args.currentTarget.value;
    sidebarObj.dataBind();
}
// change the position of sideabr
document.getElementById('position').onchange = function (args: any) {
    sidebarObj.position = args.currentTarget.value;
    sidebarObj.dataBind();
}


function appendElement(html: string): void {
    let span: HTMLElement = document.createElement('span');
    span.innerHTML = html;
    let log: HTMLElement = document.getElementById('EventLog');
    log.insertBefore(span, log.firstChild);
}

document.getElementById('clear').onclick = () => {
    document.getElementById('EventLog').innerHTML = '';
};

