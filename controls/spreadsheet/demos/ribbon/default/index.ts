/**
 * Spreadsheet collaborative editing sample
 */
import { enableRipple } from '@syncfusion/ej2-base';
import { Ribbon } from '../../../src/ribbon/index';

enableRipple(true);

let ribbon: Ribbon =  new Ribbon({
    menuItems: [{
        text: 'File',
        items: [{ text: 'New' }, { text: 'Open' }, { text: 'Save' }]
    }],
    items: [
        {
            header: { text: 'Home' },
            content:  [
                {
                    prefixIcon: 'e-cut-icon e-icons', tooltipText: 'Cut' },
                {
                    prefixIcon: 'e-copy-icon e-icons', tooltipText: 'Copy' },
                {
                    prefixIcon: 'e-paste-icon e-icons', tooltipText: 'Paste' },
                {
                    type: 'Separator' },
                {
                    prefixIcon: 'e-bold-icon e-icons', tooltipText: 'Bold' },
                {
                    prefixIcon: 'e-italic-icon e-icons', tooltipText: 'Italic' },
                {
                    prefixIcon: 'e-underline-icon e-icons', tooltipText: 'Underline' },
                {
                    prefixIcon: 'e-color-icon e-icons', tooltipText: 'Color-Picker' },
                {
                    type: 'Separator' },
                {
                    prefixIcon: 'e-alignleft-icon e-icons', tooltipText: 'Align-Left' },
                {
                    prefixIcon: 'e-alignright-icon e-icons', tooltipText: 'Align-Right' },
                {
                    prefixIcon: 'e-aligncenter-icon e-icons', tooltipText: 'Align-Center' },
                {
                    type: 'Separator' },
                {
                    prefixIcon: 'e-ascending-icon e-icons', tooltipText: 'Sort A - Z' },
                {
                    prefixIcon: 'e-descending-icon e-icons', tooltipText: 'Sort Z - A' }]
        },
        {
            header: { text: 'Insert' },
            content: [{ text: 'Link', tooltipText: 'Hyperlink' }, { type: 'Separator' }, { text: 'Picture', tooltipText: 'Picture' }]
        },
        {
            header: { text: 'View' },
            content: [{ text: 'Hide Headers', tooltipText: 'Hide Headers' }, { type: 'Separator' },
                { text: 'Hide Gridlines', tooltipText: 'Hide Gridlines' }]
        }
    ],
    created: (): void => {
        ribbon.hideTabs(['View']);
    }
});

ribbon.appendTo('#ribbon');

