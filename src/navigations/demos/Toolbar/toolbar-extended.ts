/**
 * Toolbar Popup Sample
 */
import { Toolbar } from '../../src/toolbar/index';

   //Initialize Toolbar component
    let toolbarObj: Toolbar = new Toolbar({
        overflowMode: 'Extended',
        width: 363,
        items: [
            {
                prefixIcon: 'e-cut-icon tb-icons', tooltipText: 'Cut', text: 'Cut',  },
            {
                prefixIcon: 'e-copy-icon tb-icons', tooltipText: 'Copy', text: 'Copy', },
            {
                prefixIcon: 'e-paste-icon tb-icons', tooltipText: 'Paste', text: 'Paste' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-bold-icon tb-icons', tooltipText: 'Bold', text: 'Bold',  },
            {
                prefixIcon: 'e-underline-icon tb-icons', tooltipText: 'Underline', text: 'Underline',  },
            {
                prefixIcon: 'e-undo-icon tb-icons', tooltipText: 'Undo', text: 'Undo', showTextOn:'Overflow', align: 'Right',  overflow: 'Show'  },
            {
                prefixIcon: 'e-redo-icon tb-icons', tooltipText: 'Redo', text: 'Redo', align: 'Right', showTextOn:'Overflow', overflow: 'Show'  },],
    });
    //Render initialized Toolbar component
    toolbarObj.appendTo('#toolbar_pop');
    let today: Date = new Date();
    // tslint:disable:max-line-length
    let ele: string = '<div class = "e-tool-name">' + today.toLocaleString('en-us', { month: 'long' }) + ' ' + today.getFullYear() + '</div>';
    // tslint:enable:max-line-length
    let toolbarObj1: Toolbar = new Toolbar({
        overflowMode: 'Extended',
        width: 363,
        items: [
            {
              template: ele,
              overflow: 'Show'},
            {
               prefixIcon: 'e-icon-day e-icons', tooltipText: 'Today', text: 'Today', overflow: 'Hide', align: 'Right' },
            {
              type: 'Separator' },
            {
               prefixIcon: 'e-icon-week e-icons', tooltipText: 'Week', text: 'Week', overflow: 'Show', align: 'Right' },
            {
               prefixIcon: 'e-icon-month e-icons', tooltipText: 'Month', text: 'Month', overflow: 'Hide', align: 'Right'},
            {
               prefixIcon: 'e-icon-year e-icons', tooltipText: 'Year', text: 'Year', overflow: 'Hide', align: 'Right'},
            {
               prefixIcon: 'e-print e-icons', tooltipText: 'Print', text: 'Print', overflow: 'Hide', showAlwaysInPopup: true},
            {
               prefixIcon: 'e-reccurence-icon e-icons', tooltipText: 'Sync', text: 'Sync', overflow: 'Hide', showAlwaysInPopup: true}
            ]
    });
    //Render initialized Toolbar component
    toolbarObj1.appendTo('#toolbar_popalways');