/**
 * Toolbar Popup Sample
 */
import { Toolbar } from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
        overflowMode: 'Popup',
        width: 600,
        items: [
            {
                prefixIcon: 'e-cut-icon', tooltipText: 'Cut', overflow: 'Show' },
            {
                prefixIcon: 'e-copy-icon', tooltipText: 'Copy', overflow: 'Show'},
            {
                prefixIcon: 'e-paste-icon', tooltipText: 'Paste', overflow: 'Show'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bold-icon', tooltipText: 'Bold', overflow: 'Show' },
            {
                prefixIcon: 'e-underline-icon', tooltipText: 'Underline', overflow: 'Show' },
            {
                prefixIcon: 'e-italic-icon', tooltipText: 'Italic', overflow: 'Show'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bullets-icon', text: 'Bullets', tooltipText: 'Bullets', overflow: 'Show'},
            {
                prefixIcon: 'e-numbering-icon', text: 'Bullets1', tooltipText: 'Numbering', overflow: 'Show'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-undo-icon', tooltipText: 'Undo', text: 'Undo' },
            {
                prefixIcon: 'e-redo-icon', tooltipText: 'Redo', text: 'Redo' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left', showTextOn : 'Overflow',
                overflow: 'Show', text: 'Left' },
            {
                prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify',
                showTextOn : 'Overflow', overflow: 'Show', text: 'Justify' },
            {
                prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right',
                showTextOn : 'Overflow', overflow: 'Show', text: 'Right' },
            {
                prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center',
                showTextOn : 'Overflow', overflow: 'Show', text: 'Center' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-radar-icon', text: 'Radar', tooltipText: 'Radar Chart' , showTextOn : 'Overflow' },
            {
                prefixIcon: 'e-line-icon', text: 'Line', tooltipText: 'Line Chart' , showTextOn : 'Overflow' },
            {
                prefixIcon: 'e-doughnut-icon', text: 'Doughnut', tooltipText: 'Doughnut Chart' , showTextOn : 'Overflow' },
            {
                prefixIcon: 'e-bubble-icon', text: 'Bubble', tooltipText: 'Bubble Chart' , showTextOn : 'Overflow' },
            {
                prefixIcon: 'e-table-icon', text: 'Table', tooltipText: 'Table' , showTextOn : 'Overflow' },
            {
                prefixIcon: 'e-picture-icon', text: 'Picture', tooltipText: 'Picture' , showTextOn : 'Overflow' },
            {
                text: 'Design', prefixIcon: 'e-design-icon' , tooltipText: 'Design' , showTextOn : 'Overflow'
        }],
    });
    toolbarObj.appendTo('#ej2Toolbar_pop');