import { SfPivotView } from './sf-pivotview-fn';
import * as cls from '../common/constants';
import { EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';

/**
 * Module for Drillthrough action
 */
export class DrillThrough {
    public parent: SfPivotView;

    constructor(parent: SfPivotView) {
        this.parent = parent;
        this.parent.drillThroughModule = this;
    }

    public addInternalEvents(): void {
        this.wireEvents();
    }

    private wireEvents(): void {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    }

    private mouseClickHandler(e: MouseEventArgs): void {
        let target: Element = e.target as Element;
        let element: HTMLElement;
        if (target.classList.contains(cls.STACKED_HEADER_CELL_DIV) || target.classList.contains(cls.CELLVALUE) ||
            target.classList.contains(cls.HEADER_CELL_DIV)) {
            element = target.parentElement;
        } else if (target.classList.contains(cls.HEADERCELL) || target.classList.contains(cls.ROW_CELL_CLASS)) {
            element = target as HTMLElement;
        } else if (target.classList.contains(cls.HEADER_TEXT)) {
            element = target.parentElement.parentElement;
        }
        if (element) {
            /* tslint:disable */
            if (this.parent.options.allowDrillThrough && element.classList.contains(cls.VALUESCONTENT) || this.parent.editSettings.allowEditing) {
                let colIndex: number = Number(element.getAttribute('aria-colindex'));
                let rowIndex: number = Number(element.getAttribute('index'));
                this.parent.dotNetRef.invokeMethodAsync('MouseDoubleClickHandler', rowIndex, colIndex, JSON.stringify((window as any).sfBlazor.getDomObject('currentTarget', element)));
            }
            /* tslint:enable */
        }
    }

    public destroy(): void {
        this.unWireEvents();
    }
}