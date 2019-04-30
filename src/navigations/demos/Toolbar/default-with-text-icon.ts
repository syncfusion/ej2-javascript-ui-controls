/**
 *  Toolbar default Sample
 */
import { Toolbar } from '../../src/toolbar/index';

let toolbarObj: Toolbar = new Toolbar({
    items: [
        {
            prefixIcon: 'e-cut-icon', tooltipText: 'Cut', text: 'Cut'
        },
        {
            prefixIcon: 'e-copy-icon', tooltipText: 'Copy', text: 'Copy'
        },
        {
            prefixIcon: 'e-paste-icon', tooltipText: 'Paste', text: 'Paste'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-bold-icon', tooltipText: 'Bold', text: 'Bold'
        },
        {
            prefixIcon: 'e-underline-icon', tooltipText: 'Underline', text: 'Underline'
        },
        {
            prefixIcon: 'e-italic-icon', tooltipText: 'Italic', text: 'Italic'
        },
        {
            prefixIcon: 'e-color-icon', tooltipText: 'Color-Picker'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left'
        },
        {
            prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify', text: 'Align-Justify'
        },
        {
            prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right', text: 'Align-Right'
        },
        {
            prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center', text: 'Align-Center'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-bullets-icon', tooltipText: 'Bullets'
        },
        {
            prefixIcon: 'e-numbering-icon', tooltipText: 'Numbering'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-ascending-icon', tooltipText: 'Sort A - Z'
        },
        {
            prefixIcon: 'e-descending-icon', tooltipText: 'Sort Z - A'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-upload-icon', tooltipText: 'Upload'
        },
        {
            prefixIcon: 'e-download-icon', tooltipText: 'Download'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-indent-icon', tooltipText: 'Text Indent'
        },
        {
            prefixIcon: 'e-outdent-icon', tooltipText: 'Text Outdent'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-clear-icon', tooltipText: 'Clear'
        },
        {
            prefixIcon: 'e-reload-icon', tooltipText: 'Reload'
        },
        {
            prefixIcon: 'e-export-icon', tooltipText: 'Export'
        }]
});
toolbarObj.appendTo('#ej2Toolbar');
document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};