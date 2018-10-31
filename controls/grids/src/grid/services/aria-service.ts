import { ValueType } from '../base/type';
import { SortDirection } from '../base/enum';
/**
 * AriaService
 * @hidden
 */
export class AriaService {

    public setOptions(target: HTMLElement, options: IAriaOptions<boolean>): void {
        let props: string[] = Object.keys(options);
        props.forEach((name: string) => setStateAndProperties(target, config[name], options[name]));
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
 * @hidden
 */
function setStateAndProperties(target: HTMLElement, attribute?: string, value?: ValueType, remove?: boolean): void {
    if (remove) {
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
}

const config: IAriaOptions<string> = {
    expand: 'aria-expanded',
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    sort: 'aria-sort',
    busy: 'aria-busy',
    invalid: 'aria-invalid',
    grabbed: 'aria-grabbed',
    dropeffect: 'aria-dropeffect',
    haspopup: 'aria-haspopup',
    level: 'aria-level',
    colcount: 'aria-colcount'
};