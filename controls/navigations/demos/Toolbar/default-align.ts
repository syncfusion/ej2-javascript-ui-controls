/**
 *  Toolbar default Sample
 */
import { Toolbar } from '../../src/toolbar/index';
import { Button } from '@syncfusion/ej2-buttons';

    let button: Button= new Button({content: 'Add settings btn in right' } , '#btn_AddItems');
    let button1: Button= new Button({content: 'remove_items' } , '#btn_removeItems');
    let toolbarObj: Toolbar = new Toolbar({
        width: '1000px',
        items: [
            {
                prefixIcon: 'e-back-icon', text: 'Home', tooltipText: 'Home' },
            {
                text: 'Settings', tooltipText: 'Welcome to HomePage', align: 'Center' },
            {
                prefixIcon: 'e-search-icon', text: 'Search', tooltipText: 'Search', align: 'Right' },
            {
                prefixIcon: 'e-next-icon', text: 'Next', tooltipText: 'next', align: 'Right', cssClass:'e-primary' },
            ]
    });
    toolbarObj.appendTo('#ej2Toolbar');
    document.getElementById('btn_removeItems').onclick = (e: Event) => {
      toolbarObj.removeItems(toolbarObj.element.querySelector('.e-toolbar-item') as HTMLElement );
    }
    document.getElementById('btn_AddItems').onclick = (e: Event) => {
       toolbarObj.addItems([
            {
                prefixIcon: 'e-settings-icon', tooltipText: 'Cut', type: 'Button', align:'Right' },],1);
    }