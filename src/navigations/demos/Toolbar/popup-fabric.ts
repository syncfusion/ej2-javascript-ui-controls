/**
 * Toolbar Popup Sample
 */
import { Toolbar } from '../../src/toolbar/index';

let toolbarObj: Toolbar = new Toolbar({
    overflowMode: 'Popup',
    width: 900,
    items: [
        {
            prefixIcon: 'e-cut-icon tb-icons', tooltipText: 'Cut'
        },
        {
            prefixIcon: 'e-copy-icon tb-icons', tooltipText: 'Copy'
        },
        {
            prefixIcon: 'e-paste-icon tb-icons', tooltipText: 'Paste'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-bold-icon tb-icons', tooltipText: 'Bold'
        },
        {
            prefixIcon: 'e-underline-icon tb-icons', tooltipText: 'Underline'
        },
        {
            prefixIcon: 'e-italic-icon tb-icons', tooltipText: 'Italic'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-bullets-icon tb-icons', text: 'Bullets', tooltipText: 'Bullets'
        },
        {
            prefixIcon: 'e-numbering-icon tb-icons', text: 'Bullets', tooltipText: 'Numbering'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-undo-icon tb-icons', tooltipText: 'Undo', text: 'Undo'
        },
        {
            prefixIcon: 'e-redo-icon tb-icons', tooltipText: 'Redo', text: 'Redo'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-alignleft-icon tb-icons', tooltipText: 'Align-Left', text: 'Left'
        },
        {
            prefixIcon: 'e-alignjustify-icon tb-icons', tooltipText: 'Align-Justify',
            text: 'Justify'
        },
        {
            prefixIcon: 'e-alignright-icon tb-icons', tooltipText: 'Align-Right',
            text: 'Right'
        },
        {
            prefixIcon: 'e-aligncenter-icon tb-icons', tooltipText: 'Align-Center',
            text: 'Center'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-radar-icon tb-icons', text: 'Radar', tooltipText: 'Radar Chart'
        },
        {
            prefixIcon: 'e-line-icon tb-icons', text: 'Line', tooltipText: 'Line Chart'
        },
        {
            prefixIcon: 'e-doughnut-icon tb-icons', text: 'Doughnut', tooltipText: 'Doughnut Chart'
        },
        {
            prefixIcon: 'e-bubble-icon tb-icons', text: 'Bubble', tooltipText: 'Bubble Chart'
        },
        {
            prefixIcon: 'e-table-icon tb-icons', text: 'Table', tooltipText: 'Table'
        },
        {
            prefixIcon: 'e-picture-icon tb-icons', text: 'Picture', tooltipText: 'Picture'
        },
        {
            text: 'Design', prefixIcon: 'e-design-icon tb-icons', tooltipText: 'Design'
        }],
});
toolbarObj.appendTo('#ej2Toolbar_pop');
document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};