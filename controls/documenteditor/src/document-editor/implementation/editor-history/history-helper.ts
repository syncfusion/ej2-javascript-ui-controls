import { DocumentEditor } from '../../index';
import { WParagraphFormat } from '../index';
import { WListLevel } from '../list/list-level';
import { TableWidget, TableRowWidget, WTableHolder, TableCellWidget, EditRangeStartElementBox, ContentControl } from '../viewer/page';
import { Point } from '../editor/editor-helper';
import { WRowFormat } from '../format/row-format';
import { HeightType, WidthType } from '../../base';
import { IWidget, BookmarkElementBox } from '../viewer/page';

/**
 * @private
 */
export interface BookmarkInfo extends IWidget {
    bookmark: BookmarkElementBox
    startIndex: number
    endIndex: number
}

export interface ContentInfo extends IWidget {
    contentcontrol: ContentControl
    startIndex: number
    endIndex: number
}

/**
 * @private
 */
export interface EditRangeInfo extends IWidget {
    editStart: EditRangeStartElementBox
    startIndex: number
    endIndex: number
}
/**
 * @private
 */
export class ModifiedLevel {
    private ownerListLevelIn: WListLevel = undefined;
    private modifiedListLevelIn: WListLevel = undefined;

    public get ownerListLevel(): WListLevel {
        return this.ownerListLevelIn;
    }
    public set ownerListLevel(value: WListLevel) {
        this.ownerListLevelIn = value;

    }
    public get modifiedListLevel(): WListLevel {
        return this.modifiedListLevelIn;
    }
    public set modifiedListLevel(value: WListLevel) {
        this.modifiedListLevelIn = value;
    }

    public constructor(owner: WListLevel, modified: WListLevel) {
        this.ownerListLevel = owner;
        this.modifiedListLevel = modified;
    }
    public destroy(): void {
        this.ownerListLevel = undefined;
        this.modifiedListLevel = undefined;
    }
}
/**
 * @private
 */
export class ModifiedParagraphFormat {
    private ownerFormatIn: WParagraphFormat = undefined;
    private modifiedFormatIn: WParagraphFormat = undefined;

    public get ownerFormat(): WParagraphFormat {
        return this.ownerFormatIn;
    }

    public set ownerFormat(value: WParagraphFormat) {
        this.ownerFormatIn = value;
    }

    public get modifiedFormat(): WParagraphFormat {
        return this.modifiedFormatIn;
    }

    public set modifiedFormat(value: WParagraphFormat) {
        this.modifiedFormatIn = value;
    }

    public constructor(ownerFormat: WParagraphFormat, modifiedFormat: WParagraphFormat) {
        this.ownerFormat = ownerFormat;
        this.modifiedFormat = modifiedFormat;
    }
    public destroy(): void {
        if (this.modifiedFormat) {
            this.modifiedFormat.destroy();
        }
        this.modifiedFormat = undefined;
        this.ownerFormat = undefined;
    }
}
/**
 * @private
 */
export class RowHistoryFormat {
    public startingPoint: Point;
    public rowFormat: WRowFormat;
    public tableHierarchicalIndex: string;
    public rowHeightType: HeightType;
    public displacement: number;
    public constructor(table: TableWidget, startingPoint: Point, rowFormat: WRowFormat, owner: DocumentEditor) {
        this.startingPoint = startingPoint;
        this.rowFormat = rowFormat;
        this.rowHeightType = rowFormat.heightType;
        this.tableHierarchicalIndex = owner.selectionModule.getHierarchicalIndex(table, '0');
    }
    public revertChanges(isRedo: boolean, owner: DocumentEditor, table: TableWidget): void {
        //backup current format values.
        const currentRowHeightType: HeightType = this.rowFormat.heightType;
        //Restore old values.
        const row: TableRowWidget = table.childWidgets[this.rowFormat.ownerBase.index] as TableRowWidget;
        owner.editorModule.tableResize.updateRowHeight(row, isRedo ? this.displacement : (-this.displacement));
        owner.documentHelper.layout.reLayoutTable(table);
        if (this.rowFormat.heightType !== this.rowHeightType) {
            this.rowFormat.heightType = this.rowHeightType;
        }
        //backup the current format values for redo.
        this.rowHeightType = currentRowHeightType;
    }
}
/**
 * @private
 */
export class TableHistoryInfo {
    public tableHolder: WTableHolder;
    public tableFormat: TableFormatHistoryInfo;
    public rows: RowFormatHistoryInfo[];
    public tableHierarchicalIndex: string;
    public startingPoint: Point;
    public owner: DocumentEditor;

    public constructor(table: TableWidget, owner: DocumentEditor) {
        this.tableHolder = new WTableHolder();
        this.tableFormat = new TableFormatHistoryInfo();
        this.rows = [];
        this.owner = owner;
        this.copyProperties(table);
    }
    public copyProperties(table: TableWidget): void {
        if (table.tableHolder) {
            this.tableHolder = table.tableHolder.clone();
        }
        if (table.tableFormat) {
            this.tableFormat.leftIndent = table.tableFormat.leftIndent;
            this.tableFormat.preferredWidth = table.tableFormat.preferredWidth;
            this.tableFormat.preferredWidthType = table.tableFormat.preferredWidthType;
            this.tableFormat.allowAutoFit = table.tableFormat.allowAutoFit;
        }
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[parseInt(i.toString(), 10)] as TableRowWidget;
            const rowFormat: RowFormatHistoryInfo = new RowFormatHistoryInfo();
            rowFormat.gridBefore = row.rowFormat.gridBefore;
            rowFormat.gridBeforeWidth = row.rowFormat.gridBeforeWidth;
            rowFormat.gridBeforeWidthType = row.rowFormat.gridBeforeWidthType;
            rowFormat.gridAfter = row.rowFormat.gridAfter;
            rowFormat.gridAfterWidth = row.rowFormat.gridAfterWidth;
            rowFormat.gridAfterWidthType = row.rowFormat.gridAfterWidthType;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[parseInt(j.toString(), 10)] as TableCellWidget;
                const cellFormat: CellFormatHistoryInfo = new CellFormatHistoryInfo();
                cellFormat.columnIndex = cell.columnIndex;
                cellFormat.columnSpan = cell.cellFormat.columnSpan;
                cellFormat.preferredWidth = cell.cellFormat.preferredWidth;
                cellFormat.preferredWidthType = cell.cellFormat.preferredWidthType;
                rowFormat.cells.push(cellFormat);
            }
            this.rows.push(rowFormat);
        }
        this.tableHierarchicalIndex = this.owner.selectionModule.getHierarchicalIndex(table, '0');
    }
    public destroy(): void {
        this.tableHierarchicalIndex = undefined;
        if (this.tableHolder) {
            this.tableHolder.destroy();
            this.tableHolder = undefined;
        }
        if (this.tableFormat) {
            this.tableFormat = null;
        }
        if (this.rows) {
            this.rows = [];
            this.rows = undefined;
        }
    }
}
/**
 * @private
 */
export class TableFormatHistoryInfo {
    public leftIndent: number;
    public preferredWidth: number;
    public preferredWidthType: WidthType;
    public allowAutoFit: boolean;
}
/**
 * @private
 */
export class RowFormatHistoryInfo {
    public gridBefore: number;
    public gridAfter: number;
    public gridBeforeWidth: number;
    public gridBeforeWidthType: WidthType;
    public gridAfterWidth: number;
    public gridAfterWidthType: WidthType;

    public cells: CellFormatHistoryInfo[];
    public constructor() {
        this.cells = [];
    }

}
/**
 * @private
 */
export class CellFormatHistoryInfo {
    public columnSpan: number;
    public columnIndex: number;
    public preferredWidth: number;
    public preferredWidthType: WidthType;
}

/**
 * @private
 */
export class CellHistoryFormat {
    /**
     * @private
     */
    public startingPoint: Point;
    /**
     * @private
     */
    public startIndex: number;
    /**
     * @private
     */
    public endIndex: number;
    /**
     * @private
     */
    public tableHierarchicalIndex: string;
    /**
     * @private
     */
    public startX: number;
    /**
     * @private
     */
    public startY: number;
    /**
     * @private
     */
    public displacement: number;
    public constructor(point: Point) {
        this.startingPoint = point; // starting point preserved to calculate the displacement on after cell resizing finished.
    }
}

