import { TreeGridModel } from '../../src/treegrid/base/treegrid-model';
import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { getUniqueID, EmitType, createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';

/**
 * Util functions for test cases.
 */

export function createGrid(options: TreeGridModel, done: Function): TreeGrid {
    let id: string = getUniqueID('Grid');
    let dataBound: EmitType<Object> = () => {
        if (document.querySelectorAll('.e-popup-open').length) {
            document.querySelectorAll('.e-popup-open')[0].remove();
        }
        done();
    };
    if (!(options.dataSource instanceof DataManager)) {
        let data: Object[] = (<Object[]>options.dataSource).slice();
        delete options['dataSource'];
        options.dataSource = DataUtil.parse.parseJson(JSON.stringify(data));
    }
    if (!options.hasOwnProperty('dataBound')) {
        options.dataBound = dataBound;
    }
    if (!options.hasOwnProperty('columns')) {
        options.columns = [];
    }
    let grid: TreeGrid = new TreeGrid(options);
    document.body.appendChild(createElement('div', { id: id }));
    grid.appendTo('#' + id);
    return grid;
}

export function destroy(grid: TreeGrid): void {
    if (grid && !grid.isDestroyed) {
        let id: string = grid.element.id;
        grid.destroy();
        remove(document.getElementById(id));
        //ensure once again, because sometimes element not removed from dom.
        if (document.getElementById(id)) {
            document.getElementById(id).remove();
        }
    }
}