import { createElement, enableRipple, getComponent } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { Spreadsheet } from '../../src/index';
/**
 * switch theme method used to add theme switching options
 */
export function switchTheme(target?: HTMLSelectElement | string, instance?: Spreadsheet): void {
    if (target) {
        if (typeof (target) === 'string') {
            target = document.querySelector(target) as HTMLSelectElement;
        }
        appendOptions(target);
    } else {
        target = createElement('select') as HTMLSelectElement;
        appendOptions(target);
        if (document.body.firstElementChild) {
            document.body.insertBefore(target, document.body.firstElementChild);
        } else {
            document.body.appendChild(target);
        }
    }
    let parent: HTMLElement = target.parentElement;
    let mouse: HTMLInputElement = createElement('input', { attrs: { 'type': 'radio' } }) as HTMLInputElement;
    let touch: HTMLInputElement = mouse.cloneNode() as HTMLInputElement;
    parent.insertBefore(mouse, target); parent.insertBefore(touch, target);
    new RadioButton({ value: 'mouse', name: 'theme', label: 'Mouse', checked: true, change: change }, mouse);
    new RadioButton({ value: 'touch', name: 'theme', label: 'Touch', change: change }, touch);
    mouse.parentElement.style.marginRight = '10px';
    touch.parentElement.style.marginRight = '30px';
    new DropDownList(
        {
            index: 0,
            width: '150px',
            popupHeight: '200px',
            placeholder: 'Select theme',
            change: (args: ChangeEventArgs): void => {
                document.getElementById('theme').setAttribute('href', `./../../../common/themes/${args.value}.css`);
                (args.value as string).indexOf('material') > -1 ? enableRipple(true) : enableRipple(false);
                if (args.value === 'highcontrast') {
                    document.body.style.backgroundColor = '#000'; document.body.style.color = '#fff';
                } else if(args.value === 'material-dark') {
                    document.body.style.backgroundColor = '#303030'; document.body.style.color = '#000';
                } else if(args.value === 'fabric-dark') {
                    document.body.style.backgroundColor = '#333232'; document.body.style.color = '#000';
                } else if(args.value === 'bootstrap-dark') {
                    document.body.style.backgroundColor = '#191919'; document.body.style.color = '#F0F0F0';
                } else {
                    document.body.style.backgroundColor = ''; document.body.style.color = '';
                }
                if (instance) { instance.refresh(); }
            }
        },
        target);
}
function appendOptions(target: HTMLSelectElement): void {
    let i: number = 0;
    let themeNames: string[] = ['Material', 'Fabric', 'Bootstrap', 'Bootstrap4', 'Highcontrast', 'Material Dark', 'Fabric Dark',
        'Bootstrap Dark'];
    let values: string[] = ['material', 'fabric', 'bootstrap', 'bootstrap4', 'highcontrast', 'material-dark', 'fabric-dark',
        'bootstrap-dark'];
    while (i < themeNames.length) {
        target.appendChild(createElement('option', { innerHTML: themeNames[i], attrs: { 'value': values[i] } }));
        i++;
    }
}
function change(args: ChangeArgs): void {
    let instance: Spreadsheet = getComponent(document.querySelector('.e-spreadsheet') as HTMLElement, Spreadsheet) as Spreadsheet;
    if (args.value === 'mouse') {
        instance.cssClass = instance.cssClass === 'e-bigger' ? '' : instance.cssClass.replace(' e-bigger', '');
    }
    else {
        instance.cssClass = instance.cssClass ? instance.cssClass + ' e-bigger' : 'e-bigger';
    }
    instance.dataBind();
}