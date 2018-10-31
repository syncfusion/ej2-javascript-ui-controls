/**
 * Toolbar Popup Sample
 */
import { Toolbar } from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
        overflowMode: 'Popup',
        width: 800,
        items: [
            {
                prefixIcon: 'e-cut-icon', tooltipText: 'Cut'},
            {
                prefixIcon: 'e-copy-icon', tooltipText: 'Copy'},
            {
                prefixIcon: 'e-paste-icon', tooltipText: 'Paste'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bold-icon', tooltipText: 'Bold'},
            {
                prefixIcon: 'e-underline-icon', tooltipText: 'Underline'},
            {
                prefixIcon: 'e-italic-icon', tooltipText: 'Italic'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bullets-icon', text: 'Bullets', tooltipText: 'Bullets'},
            {
                prefixIcon: 'e-numbering-icon', text: 'Bullets', tooltipText: 'Numbering'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-undo-icon', tooltipText: 'Undo', text: 'Undo' },
            {
                prefixIcon: 'e-redo-icon', tooltipText: 'Redo', text: 'Redo' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left', text: 'Left' },
            {
                prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify',
                 text: 'Justify' },
            {
                prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right',
                 text: 'Right' },
            {
                prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center',
                 text: 'Center' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-radar-icon', text: 'Radar', tooltipText: 'Radar Chart'  },
            {
                prefixIcon: 'e-line-icon', text: 'Line', tooltipText: 'Line Chart'  },
            {
                prefixIcon: 'e-doughnut-icon', text: 'Doughnut', tooltipText: 'Doughnut Chart' },
            {
                prefixIcon: 'e-bubble-icon', text: 'Bubble', tooltipText: 'Bubble Chart'  },
            {
                prefixIcon: 'e-table-icon', text: 'Table', tooltipText: 'Table' },
            {
                prefixIcon: 'e-picture-icon', text: 'Picture', tooltipText: 'Picture'  },
            {
                text: 'Design', prefixIcon: 'e-design-icon' , tooltipText: 'Design' 
        }],
    });
    toolbarObj.appendTo('#ej2Toolbar_pop');