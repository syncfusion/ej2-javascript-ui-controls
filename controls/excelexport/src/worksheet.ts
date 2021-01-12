import { Column } from './column';
import { Rows } from './row';
import { HyperLinkType } from './enum';
import { Image } from './image';
import { AutoFilters } from './auto-filters';
/**
 * Worksheet class
 * @private
 */
export class Worksheet {
    public isSummaryRowBelow: boolean = true;
    public index: number;
    public columns: Column[];
    public rows: Rows;
    public freezePanes: FreezePane;
    public name: string;
    public showGridLines: boolean = true;
    public mergeCells: MergeCells;
    public hyperLinks: HyperLink[];
    public images: Image[];
    public enableRtl: boolean = false;
    public autoFilters: AutoFilters;
}
/**
 * Hyperlink class
 * @private
 */
export class HyperLink {
    //<hyperlink ref="C5" r:id="rId1" location="" tooltip="To know more about" 
    //display="https://www.syncfusion.com" />
    public ref: string;
    public rId: number;
    public toolTip: string;
    public location: string; //Only used when HyperlinkType = 'workbook'
    public display: string; //JSON structure display text by default 'target' value
    public target: string; //JSON structure target.
    public type: HyperLinkType;
}
/**
 * Grouping class
 * @private
 */
export class Grouping {
    public outlineLevel: number;
    public isCollapsed: boolean;
    public isHidden: boolean;
}
/**
 * FreezePane class
 * @private
 */
export class FreezePane {
    public row: number;
    public column: number;
    public leftCell: string;
}
/**
 * MergeCell
 * @private
 */
export class MergeCell {
    public ref: string;
    public x: number;
    public width: number;
    public y: number;
    public height: number;
}

/**
 * MergeCells class
 * @private
 */
export class MergeCells extends Array {
    public add = (mergeCell: MergeCell): MergeCell => {
        let inserted: boolean = false;
        let count: number = 0;
        for (let mCell of this) {
            if (MergeCells.isIntersecting(mCell, mergeCell)) {
                let intersectingCell: MergeCell = new MergeCell();
                intersectingCell.x = Math.min(mCell.x, mergeCell.x);
                intersectingCell.y = Math.min(mCell.Y, mergeCell.y);
                intersectingCell.width = Math.max(mCell.Width + mCell.X, mergeCell.width + mergeCell.x);
                intersectingCell.height = Math.max(mCell.Height + mCell.Y, mergeCell.height + mergeCell.y);
                intersectingCell.ref = (this[count].ref.split(':')[0]) + ':' + (mergeCell.ref.split(':')[1]);
                this[count] = intersectingCell;
                mergeCell = intersectingCell;
                inserted = true;
            }
            count++;
        }
        if (!inserted) {
            this.push(mergeCell);
        }
        return mergeCell;
    }
    public static isIntersecting(base: MergeCell, compare: MergeCell): boolean {
        return (base.x <= compare.x + compare.width)
            && (compare.x <= base.x + base.width)
            && (base.y <= compare.y + compare.height)
            && (compare.y <= base.y + base.height);
    }
}