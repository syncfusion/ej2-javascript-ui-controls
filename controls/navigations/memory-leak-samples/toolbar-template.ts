import { Toolbar } from '../src/toolbar/index';

document.getElementById('render').addEventListener('click', renderToolbar);
document.getElementById('destroy').addEventListener('click', destoryToolbar);

let toolbarObj: Toolbar;

function renderToolbar(): void {
    toolbarObj = new Toolbar({
        width: 600,
        items: [
            { template: "<div><input type='checkbox' id='check1' checked=''>Accept</input></div>" },
            { template: '#AnchorTemplate' },
            { template: '<button class="e-btn" id="visible_btn">template</button>' }
        ]
    });
    toolbarObj.appendTo('#toolbar');
}

function destoryToolbar(): void {
    if (toolbarObj) {
        toolbarObj.destroy();
        toolbarObj = null;
    }
}
