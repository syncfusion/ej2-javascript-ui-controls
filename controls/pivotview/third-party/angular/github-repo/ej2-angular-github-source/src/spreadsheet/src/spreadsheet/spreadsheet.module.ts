import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDirective, ImagesDirective } from './image.directive';
import { ChartDirective, ChartsDirective } from './chart.directive';
import { RichTextDirective, RichTextsDirective } from './richtext.directive';
import { CellDirective, CellsDirective } from './cells.directive';
import { RowDirective, RowsDirective } from './rows.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { RangeDirective, RangesDirective } from './ranges.directive';
import { ConditionalFormatDirective, ConditionalFormatsDirective } from './conditionalformats.directive';
import { SheetDirective, SheetsDirective } from './sheets.directive';
import { DefinedNameDirective, DefinedNamesDirective } from './definednames.directive';
import { SpreadsheetComponent } from './spreadsheet.component';

const SPREADSHEET_DIRECTIVES = [
    SpreadsheetComponent,
        ImageDirective,
        ImagesDirective,
        ChartDirective,
        ChartsDirective,
        RichTextDirective,
        RichTextsDirective,
        CellDirective,
        CellsDirective,
        RowDirective,
        RowsDirective,
        ColumnDirective,
        ColumnsDirective,
        RangeDirective,
        RangesDirective,
        ConditionalFormatDirective,
        ConditionalFormatsDirective,
        SheetDirective,
        SheetsDirective,
        DefinedNameDirective,
        DefinedNamesDirective
];

/**
 * NgModule definition for the Spreadsheet component.
 * Re-exports standalone Spreadsheet component and directives so existing apps can keep using:
 * `imports: [SpreadsheetModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPREADSHEET_DIRECTIVES],
    exports: [...SPREADSHEET_DIRECTIVES]
})
export class SpreadsheetModule { }