/**
 *  Toolbar default Sample
 */
import { Toolbar } from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
        overflowMode: 'MultiRow',
        width: '100%',
        items: [
            {
                prefixIcon: 'e-cut-icon', tooltipText: 'Cut' },
            {
                prefixIcon: 'e-copy-icon', tooltipText: 'Copy' },
            {
                prefixIcon: 'e-paste-icon', tooltipText: 'Paste' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bold-icon', tooltipText: 'Bold' },
            {
                prefixIcon: 'e-underline-icon', tooltipText: 'Underline' },
            {
                prefixIcon: 'e-italic-icon', tooltipText: 'Italic' },
            {
                prefixIcon: 'e-color-icon', tooltipText: 'Color-Picker' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left' },
            {
                prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify'},
            {
                prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right' },
            {
                prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bullets-icon', tooltipText: 'Bullets'},
            {
                prefixIcon: 'e-numbering-icon', tooltipText: 'Numbering' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-ascending-icon', tooltipText: 'Sort A - Z' },
            {
                prefixIcon: 'e-descending-icon', tooltipText: 'Sort Z - A' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-upload-icon', tooltipText: 'Upload' },
            {
                prefixIcon: 'e-download-icon', tooltipText: 'Download' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-indent-icon', tooltipText: 'Text Indent' },
            {
                prefixIcon: 'e-outdent-icon', tooltipText: 'Text Outdent' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-clear-icon', tooltipText: 'Clear' },
            {
                prefixIcon: 'e-reload-icon', tooltipText: 'Reload' },
            {
                prefixIcon: 'e-export-icon', tooltipText: 'Export'
            },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-design-icon', tooltipText: 'Design' },
            {
                prefixIcon: 'e-table-icon', tooltipText: 'Table' },
            {
                prefixIcon: 'e-picture-icon', tooltipText: 'Picture'
            },
            {
                prefixIcon: 'e-chart-icon', tooltipText: 'Chart'
            },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bubble-icon', tooltipText: 'Bubble' },
            {
                prefixIcon: 'e-line-icon', tooltipText: 'Line' },
            {
                prefixIcon: 'e-radar-icon', tooltipText: 'Radar'
            }]
    });
    toolbarObj.appendTo('#ej2Toolbar');
    document.getElementById('btn_add').onclick = (e : Event) => {
        toolbarObj.addItems([{ type: 'Button', text: 'Inline-items', }], 21);
        toolbarObj.addItems([{ type: 'Button', text: 'outline-items', }], 21);
    };
    document.getElementById('btn_touch').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
       orientation();
    };
    document.getElementById('btn_mouse').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
       orientation();
    };
    document.getElementById('btn_popup').onclick = (e : Event) => {
        removeClass();
        toolbarObj.overflowMode = 'Popup';
        orientation();
    };
    document.getElementById('btn_scrollable').onclick = (e : Event) => {
        removeClass();
        toolbarObj.overflowMode = 'Scrollable';
        orientation();
    };
    document.getElementById('btn_multirow').onclick = (e : Event) => {
        toolbarObj.overflowMode = 'MultiRow';
        orientation();
    };
    function removeClass() {
        let ele = document.getElementsByClassName('e-toolbar-multirow').length;
        if(ele != 0)
           (<HTMLElement>document.getElementsByClassName('e-toolbar-multirow')[0]).classList.remove('e-toolbar-multirow');
    }
    function orientation() {
        let element = document.getElementsByClassName('e-bigger').length;
        if(element == 0) {
            toolbarObj.width = '100%';
            toolbarObj.refreshOverflow();
        }
        else {
            toolbarObj.width = '100%';
            toolbarObj.refreshOverflow();
        }
    }