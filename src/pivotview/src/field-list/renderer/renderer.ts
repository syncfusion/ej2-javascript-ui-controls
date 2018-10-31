import { PivotFieldList } from '../base/field-list';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { TreeViewRenderer } from '../renderer/tree-renderer';
import { AxisTableRenderer } from '../renderer/axis-table-renderer';
import { AxisFieldRenderer } from './axis-field-renderer';

/**
 * Module to render Pivot Table component
 */
/** @hidden */
export class Render {
    public parent: PivotFieldList;

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
        this.parent.dialogRenderer = new DialogRenderer(this.parent);
        this.parent.treeViewModule = new TreeViewRenderer(this.parent);
        this.parent.axisTableModule = new AxisTableRenderer(this.parent);
        this.parent.axisFieldModule = new AxisFieldRenderer(this.parent);
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.parent.dialogRenderer.render();
        if (!this.parent.isAdaptive) {
            this.parent.treeViewModule.render();
        }
        this.parent.axisTableModule.render();
    }
}