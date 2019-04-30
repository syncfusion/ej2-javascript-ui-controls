/**
 *  Toolbar API Sample
 */
import {Toolbar } from '../../src/toolbar/index';
import { Button } from '@syncfusion/ej2-buttons';


    let buttonAdd: Button;
    let btnMultiAdd: Button;
    let btnRemove: Button;
    let btnEnable: Button;
    let btnHide: Button;
    let btnShow: Button;

    buttonAdd = new Button({});
    buttonAdd.appendTo('#btnAdd');

    btnMultiAdd = new Button({});
    btnMultiAdd.appendTo('#btnMultiAdd');

    btnRemove = new Button({  });
    btnRemove.appendTo('#btnRemove');

    btnEnable = new Button({ });
    btnEnable.appendTo('#btnEnable');

    btnHide = new Button({ });
    btnHide.appendTo('#btnHide');

    btnShow = new Button({ });
    btnShow.appendTo('#btnShow');

    let toolbarObj: Toolbar = new Toolbar({
            height: 50, items: [{
            type: 'Button', prefixIcon: 'e-btn-icon',
            suffixIcon: 'e-btn-icon',
            text: 'File',
        }, {
            type: 'Button',
            text: 'Home',
            prefixIcon: 'e-btn-icon', tooltipText: 'Home'
        }, { type: 'Separator' }, {
            text: 'Insert', type: 'Button', overflow: 'Hide'
        }, {
            type: 'Button',
            text: 'Design',
            prefixIcon: 'e-btn-icon', tooltipText: 'Design'
        }, {
            type: 'Button',
            text: 'Layout',
            prefixIcon: 'e-btn-icon', tooltipText: 'Layout'
        }, {
            type: 'Button',
            text: 'Review',
            prefixIcon: 'e-btn-icon', tooltipText: 'Review'
        }, {
            type: 'Button',
            text: 'References',
            prefixIcon: 'e-btn-icon', tooltipText: 'References'
        }],
    });
    toolbarObj.appendTo('#ej2Toolbar_api');

    function removeItem(): void {
        toolbarObj.removeItems(5);
    };
    document.getElementById('btnAdd').onclick = (e : Event) => {
       toolbarObj.addItems([{ type: 'Button', text: 'View', }], 3);
    };
    document.getElementById('btnMultiAdd').onclick = (e : Event) => {
       toolbarObj.addItems([{ type: 'Button', text: 'Go' }, { type: 'Button', text: 'View' }], 4);
    };
    document.getElementById('btnRemove').onclick = (e : Event) => {
       toolbarObj.removeItems(5);
    };
    document.getElementById('btnHide').onclick = (e : Event) => {
       toolbarObj.hideItem(4, true);
    };
    document.getElementById('btnShow').onclick = (e : Event) => {
       toolbarObj.hideItem(4, false);
    };
    document.getElementById('btnEnable').onclick = (e : Event) => {
       if ((e.target as HTMLElement).textContent === 'Disable Item') {
          toolbarObj.enableItems(toolbarObj.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement, false);
          btnEnable.element.textContent = 'Enable Item';
       }else  if ((e.target as HTMLElement).textContent === 'Enable Item') {
          toolbarObj.enableItems(toolbarObj.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement, true);
          btnEnable.element.textContent = 'Disable Item';
       }
    };