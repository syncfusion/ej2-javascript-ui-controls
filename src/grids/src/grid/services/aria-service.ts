import { ValueType } from '../base/type';
import { SortDirection } from '../base/enum';
/**
 * AriaService
 *
 * @hidden
 */
export class AriaService {

    public setOptions(target: HTMLElement, options: IAriaOptions<boolean>): void {
        const props: string[] = Object.keys(options);
        for (let i: number = 0; i < props.length; i++) {
            setStateAndProperties(target, config[props[parseInt(i.toString(), 10)]], options[props[parseInt(i.toString(), 10)]]);
        }
    }

    public setExpand(target: HTMLElement, expand: boolean): void {
        setStateAndProperties(target, config.expand, expand);
    }

    public setSort(target: HTMLElement, direction?: SortDirection | 'none' | boolean): void {
        setStateAndProperties(target, config.sort, direction, typeof direction === 'boolean');
    }

    public setBusy(target: HTMLElement, isBusy: boolean): void {
        setStateAndProperties(target, config.busy, isBusy);
        setStateAndProperties(target, config.invalid, null, true);
    }

    public setGrabbed(target: HTMLElement, isGrabbed: boolean, remove?: boolean): void {
        setStateAndProperties(target, config.grabbed, isGrabbed, remove);
    }

    public setDropTarget(target: HTMLElement, isTarget: boolean): void {
        setStateAndProperties(target, config.dropeffect, 'copy', !isTarget);
    }
}
/**
 * @param {HTMLElement} target - specifies the target
 * @param {string} attribute - specifies the attribute
 * @param {ValueType} value - specifies the value
 * @param {boolean} remove - specifies the boolean for remove
 * @returns {void}
 * @hidden
 */
function setStateAndProperties(target: HTMLElement, attribute?: string, value?: ValueType, remove?: boolean): void {
    if (remove && target) {
        target.removeAttribute(attribute);
        return;
    }
    if (target) {
        target.setAttribute(attribute, <string>value);
    }
}
/**
 * @hidden
 */
export interface IAriaOptions<T> {
    role?: string;
    datarole?: string;
    expand?: T;
    collapse?: T;
    selected?: T;
    multiselectable?: T;
    sort?: T | 'none';
    busy?: T;
    invalid?: T;
    grabbed?: T;
    dropeffect?: T;
    haspopup?: T;
    level?: T;
    colcount?: string;
    rowcount?: string;
}

const config: IAriaOptions<string> = {
    expand: 'aria-expanded',
    role: 'role',
    datarole: 'data-role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    sort: 'aria-sort',
    busy: 'aria-busy',
    invalid: 'aria-invalid',
    grabbed: 'aria-grabbed',
    dropeffect: 'aria-dropeffect',
    haspopup: 'aria-haspopup',
    level: 'aria-level',
    colcount: 'aria-colcount',
    rowcount: 'aria-rowcount'
};
