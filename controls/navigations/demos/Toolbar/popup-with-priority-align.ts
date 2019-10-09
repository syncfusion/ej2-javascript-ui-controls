/**
 * Toolbar Popup Sample
 */
import { Toolbar } from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
        overflowMode: 'Popup',
        width: 500,
        items: [
            {
                prefixIcon: 'e-cut-icon', tooltipText: 'Cut', overflow: 'Hide' },
            {
                prefixIcon: 'e-copy-icon', tooltipText: 'Copy', overflow: 'Hide'},
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-paste-icon', tooltipText: 'Paste', overflow: 'Hide'},
            {
                prefixIcon: 'e-bold-icon', tooltipText: 'Bold', overflow: 'Show', align: 'Center' },
            {
                prefixIcon: 'e-underline-icon', tooltipText: 'Underline', overflow: 'Show', align: 'Center' },
            {
                prefixIcon: 'e-italic-icon', tooltipText: 'Italic', overflow: 'Show', align: 'Center'},
            {
                prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left', showTextOn : 'Both',
                overflow: 'Hide', text: 'Left', align: 'Right' },
            {
                prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify',
                showTextOn : 'Overflow', overflow: 'Show', text: 'Justify', align: 'Right' },
            {
                type: 'Separator', align:'Right' },
            {
                prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right',
                showTextOn : 'Both', overflow: 'Hide', text: 'Right', align: 'Right' },
            {
                prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center',
                showTextOn : 'Both', overflow: 'Show', text: 'Center', align: 'Right' },
            ],
    });
    toolbarObj.appendTo('#ej2Toolbar_pop');