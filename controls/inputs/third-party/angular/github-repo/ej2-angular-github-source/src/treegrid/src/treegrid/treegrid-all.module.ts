import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumnDirective, StackedColumnsDirective } from './stacked-column.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AggregateColumnDirective, AggregateColumnsDirective } from './aggregate-columns.directive';
import { AggregateDirective, AggregatesDirective } from './aggregates.directive';
import { TreeGridComponent } from './treegrid.component';
import { TreeGridModule } from './treegrid.module';
import {Filter, Page, Sort, Reorder, Toolbar, Aggregate, Resize, ColumnMenu, ExcelExport, PdfExport, CommandColumn, ContextMenu, Edit, Selection, VirtualScroll, DetailRow, RowDD, Freeze, ColumnChooser, Logger, InfiniteScroll, DomVirtualization} from '@syncfusion/ej2-treegrid'


export const FilterService: ValueProvider = { provide: 'TreeGridFilter', useValue: Filter};
export const PageService: ValueProvider = { provide: 'TreeGridPage', useValue: Page};
export const SortService: ValueProvider = { provide: 'TreeGridSort', useValue: Sort};
export const ReorderService: ValueProvider = { provide: 'TreeGridReorder', useValue: Reorder};
export const ToolbarService: ValueProvider = { provide: 'TreeGridToolbar', useValue: Toolbar};
export const AggregateService: ValueProvider = { provide: 'TreeGridAggregate', useValue: Aggregate};
export const ResizeService: ValueProvider = { provide: 'TreeGridResize', useValue: Resize};
export const ColumnMenuService: ValueProvider = { provide: 'TreeGridColumnMenu', useValue: ColumnMenu};
export const ExcelExportService: ValueProvider = { provide: 'TreeGridExcelExport', useValue: ExcelExport};
export const PdfExportService: ValueProvider = { provide: 'TreeGridPdfExport', useValue: PdfExport};
export const CommandColumnService: ValueProvider = { provide: 'TreeGridCommandColumn', useValue: CommandColumn};
export const ContextMenuService: ValueProvider = { provide: 'TreeGridContextMenu', useValue: ContextMenu};
export const EditService: ValueProvider = { provide: 'TreeGridEdit', useValue: Edit};
export const SelectionService: ValueProvider = { provide: 'TreeGridSelection', useValue: Selection};
export const VirtualScrollService: ValueProvider = { provide: 'TreeGridVirtualScroll', useValue: VirtualScroll};
export const DetailRowService: ValueProvider = { provide: 'TreeGridDetailRow', useValue: DetailRow};
export const RowDDService: ValueProvider = { provide: 'TreeGridRowDD', useValue: RowDD};
export const FreezeService: ValueProvider = { provide: 'TreeGridFreeze', useValue: Freeze};
export const ColumnChooserService: ValueProvider = { provide: 'TreeGridColumnChooser', useValue: ColumnChooser};
export const LoggerService: ValueProvider = { provide: 'TreeGridLogger', useValue: Logger};
export const InfiniteScrollService: ValueProvider = { provide: 'TreeGridInfiniteScroll', useValue: InfiniteScroll};
export const DomVirtualizationService: ValueProvider = { provide: 'TreeGridDomVirtualization', useValue: DomVirtualization};

/**
 * NgModule definition for the TreeGrid component with providers.
 */
@NgModule({
    imports: [CommonModule, TreeGridModule],
    exports: [
        TreeGridModule
    ],
    providers:[
        FilterService,
        PageService,
        SortService,
        ReorderService,
        ToolbarService,
        AggregateService,
        ResizeService,
        ColumnMenuService,
        ExcelExportService,
        PdfExportService,
        CommandColumnService,
        ContextMenuService,
        EditService,
        SelectionService,
        VirtualScrollService,
        DetailRowService,
        RowDDService,
        FreezeService,
        ColumnChooserService,
        LoggerService,
        InfiniteScrollService,
        DomVirtualizationService
    ]
})
export class TreeGridAllModule { }