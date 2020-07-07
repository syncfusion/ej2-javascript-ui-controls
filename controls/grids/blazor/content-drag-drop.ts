import { Draggable, Droppable, DropEventArgs, createElement, MouseEventArgs, remove } from '@syncfusion/ej2-base';
import { SfGrid } from './sf-grid-fn';
/**
 * ColumnDrop Handling
 */
export class ContentDragDrop {
    
    private drop: Function = (e: DropEventArgs) => {
        this.parent.groupModule.columnDrop({
            target: e.target, droppedElement: e.droppedElement
          });
        remove(e.droppedElement);
    }

    private parent: SfGrid;
    constructor(parent: SfGrid) {
        this.parent = parent;

        if (this.parent.options.allowGrouping) {
            this.initializeContentDrop();
        }
    }

    public initializeContentDrop(): void {
        let gObj: SfGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }

}