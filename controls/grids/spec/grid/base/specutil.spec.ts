import { createElement, getUniqueID, EmitType, remove } from '@syncfusion/ej2-base';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Grid } from '../../../src/grid/base/grid';
import { DataUtil } from '@syncfusion/ej2-data';

/**
 * Util functions for test cases.
 */

export function createGrid(options: GridModel, done: Function): Grid {
    let id: string = getUniqueID('Grid');
    let dataBound: EmitType<Object> = () => {
        if (document.querySelectorAll('.e-popup-open').length) {
            document.querySelectorAll('.e-popup-open')[0].remove();
        }
        done();
    };
    options.dataBound = dataBound;
    options.dataSource = options.dataSource instanceof Array ? DataUtil.parse.parseJson(JSON.stringify(options.dataSource)) :
     options.dataSource;
    let grid: Grid = new Grid(options);
    let placeholder: HTMLElement = document.body.querySelector('.testbed');
    if (!placeholder) {
        placeholder = createElement('div', { className: 'testbed' });
        document.body.appendChild(placeholder);
    }
    placeholder.appendChild(createElement('div', { id: id }));
    grid.appendTo('#' + id);
    return grid;
}

export function destroy(grid: Grid): void {
    if (grid && !grid.isDestroyed) {
        let id: string = grid.element.id;
        grid.destroy();
        remove(document.getElementById(id));
        //ensure once again, because sometimes element not removed from dom.
        if (document.getElementById(id)) {
            document.getElementById(id).remove();
        }
        let placeholder: HTMLElement = document.body.querySelector('.testbed');
        if (placeholder) {
            placeholder.innerHTML = '';
        }
    }
}

export function getClickObj(target: Element, ctrlKey?: boolean, shiftKey?: boolean): any {
    let preventDefault = () => { };
    return {
        target: target, shiftKey: shiftKey, ctrlKey: ctrlKey,
        preventDefault: preventDefault, type: 'click', clientX: 1, clientY: 1
    };
}

export function getKeyUpObj(keyCode: string | number, target: Element): any {
    let preventDefault = () => { };
    return { target: target, keyCode: keyCode };
}

export function getKeyActionObj(action: string, target?: Element): any {
    let preventDefault = () => { };
    return {
        target: target, action: action,
        preventDefault: preventDefault
    };
}