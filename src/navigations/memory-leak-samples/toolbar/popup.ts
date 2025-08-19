import { Toolbar } from '../../src/toolbar/index';

document.getElementById('render').addEventListener('click', renderToolbar);
document.getElementById('destroy').addEventListener('click', destoryToolbar);

let toolbarObj: Toolbar;

function renderToolbar(): void {
    toolbarObj = new Toolbar({
        width: 600,
        items: [
            { type: 'Button', prefixIcon: 'e-cut-icon tb-icons', text: 'Cut' },
            { type: 'Button', prefixIcon: 'e-copy-icon tb-icons', text: 'Copy' },
            { type: 'Button', prefixIcon: 'e-paste-icon tb-icons', text: 'Paste' },
            { type: 'Separator' },
            { type: 'Button', prefixIcon: 'e-bold-icon tb-icons', text: 'Bold' },
            { type: 'Button', prefixIcon: 'e-underline-icon tb-icons', text: 'Underline' },
            { type: 'Button', prefixIcon: 'e-italic-icon tb-icons', text: 'Italic' },
            { type: 'Button', prefixIcon: 'e-color-icon tb-icons', text: 'Color-Picker' },
            { type: 'Separator' },
            { type: 'Button', prefixIcon: 'e-ascending-icon tb-icons', text: 'A-Z Sort' },
            { type: 'Button', prefixIcon: 'e-descending-icon tb-icons', text: 'Z-A Sort' },
            { type: 'Button', prefixIcon: 'e-clear-icon tb-icons', text: 'Clear' }
        ],
        overflowMode: 'Popup'
    });
    toolbarObj.appendTo('#toolbar');
}

function destoryToolbar(): void {
    if (toolbarObj) {
        toolbarObj.destroy();
        toolbarObj = null;
    }
}
