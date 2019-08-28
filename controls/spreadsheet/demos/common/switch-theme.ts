import { createElement, enableRipple } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
/**
 * switch theme method used to add theme switching options
 */
// tslint:disable-next-line:no-any
export function switchTheme(target?: HTMLElement | string, instance?: any): void {
    if (target) {
        if (typeof (target) === 'string') {
            target = document.querySelector(target) as HTMLElement;
        }
        appendOptions(target);
    } else {
        target = createElement('select');
        appendOptions(target);
        if (document.body.firstElementChild) {
            document.body.insertBefore(target, document.body.firstElementChild);
        } else {
            document.body.appendChild(target);
        }
    }
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
                } else {
                    document.body.style.backgroundColor = ''; document.body.style.color = '';
                }
                if (instance) { instance.refresh(); }
            }
        },
        target);
}
function appendOptions(target: HTMLElement): void {
    let i: number = 0;
    let themeNames: string[] = ['Material', 'Fabric', 'Bootstrap', 'Bootstrap4', 'Highcontrast'];
    let values: string[] = ['material', 'fabric', 'bootstrap', 'bootstrap4', 'highcontrast'];
    while (i < themeNames.length) {
        target.appendChild(createElement('option', { innerHTML: themeNames[i], attrs: { 'value': values[i] } }));
        i++;
    }
}
interface Object {
    refresh(): Function;
}