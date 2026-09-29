import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumnDirective, StackedColumnsDirective } from './stacked-column.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AggregateColumnDirective, AggregateColumnsDirective } from './aggregate-columns.directive';
import { AggregateDirective, AggregatesDirective } from './aggregates.directive';
import { GridComponent } from './grid.component';
import { GridModule } from './grid.module';
import {Filter, Page, Selection, Sort, Group, Reorder, RowDD, DetailRow, Toolbar, Aggregate, Search, VirtualScroll, Edit, Resize, ExcelExport, PdfExport, CommandColumn, ContextMenu, Freeze, ColumnMenu, ColumnChooser, ForeignKey, InfiniteScroll, LazyLoadGroup, DomVirtualization, Formula, AdvancedFilter, WebMcpAdapter} from '@syncfusion/ej2-grids'


export const FilterService: ValueProvider = { provide: 'GridsFilter', useValue: Filter};
export const PageService: ValueProvider = { provide: 'GridsPage', useValue: Page};
export const SelectionService: ValueProvider = { provide: 'GridsSelection', useValue: Selection};
export const SortService: ValueProvider = { provide: 'GridsSort', useValue: Sort};
export const GroupService: ValueProvider = { provide: 'GridsGroup', useValue: Group};
export const ReorderService: ValueProvider = { provide: 'GridsReorder', useValue: Reorder};
export const RowDDService: ValueProvider = { provide: 'GridsRowDD', useValue: RowDD};
export const DetailRowService: ValueProvider = { provide: 'GridsDetailRow', useValue: DetailRow};
export const ToolbarService: ValueProvider = { provide: 'GridsToolbar', useValue: Toolbar};
export const AggregateService: ValueProvider = { provide: 'GridsAggregate', useValue: Aggregate};
export const SearchService: ValueProvider = { provide: 'GridsSearch', useValue: Search};
export const VirtualScrollService: ValueProvider = { provide: 'GridsVirtualScroll', useValue: VirtualScroll};
export const EditService: ValueProvider = { provide: 'GridsEdit', useValue: Edit};
export const ResizeService: ValueProvider = { provide: 'GridsResize', useValue: Resize};
export const ExcelExportService: ValueProvider = { provide: 'GridsExcelExport', useValue: ExcelExport};
export const PdfExportService: ValueProvider = { provide: 'GridsPdfExport', useValue: PdfExport};
export const CommandColumnService: ValueProvider = { provide: 'GridsCommandColumn', useValue: CommandColumn};
export const ContextMenuService: ValueProvider = { provide: 'GridsContextMenu', useValue: ContextMenu};
export const FreezeService: ValueProvider = { provide: 'GridsFreeze', useValue: Freeze};
export const ColumnMenuService: ValueProvider = { provide: 'GridsColumnMenu', useValue: ColumnMenu};
export const ColumnChooserService: ValueProvider = { provide: 'GridsColumnChooser', useValue: ColumnChooser};
export const ForeignKeyService: ValueProvider = { provide: 'GridsForeignKey', useValue: ForeignKey};
export const InfiniteScrollService: ValueProvider = { provide: 'GridsInfiniteScroll', useValue: InfiniteScroll};
export const LazyLoadGroupService: ValueProvider = { provide: 'GridsLazyLoadGroup', useValue: LazyLoadGroup};
export const DomVirtualizationService: ValueProvider = { provide: 'GridsDomVirtualization', useValue: DomVirtualization};
export const FormulaService: ValueProvider = { provide: 'GridsFormula', useValue: Formula};
export const AdvancedFilterService: ValueProvider = { provide: 'GridsAdvancedFilter', useValue: AdvancedFilter};
export const WebMcpAdapterService: ValueProvider = { provide: 'GridsWebMcpAdapter', useValue: WebMcpAdapter};

/**
 * NgModule definition for the Grid component with providers.
 */
@NgModule({
    imports: [CommonModule, GridModule],
    exports: [
        GridModule
    ],
    providers:[
        FilterService,
        PageService,
        SelectionService,
        SortService,
        GroupService,
        ReorderService,
        RowDDService,
        DetailRowService,
        ToolbarService,
        AggregateService,
        SearchService,
        VirtualScrollService,
        EditService,
        ResizeService,
        ExcelExportService,
        PdfExportService,
        CommandColumnService,
        ContextMenuService,
        FreezeService,
        ColumnMenuService,
        ColumnChooserService,
        ForeignKeyService,
        InfiniteScrollService,
        LazyLoadGroupService,
        DomVirtualizationService,
        FormulaService,
        AdvancedFilterService,
        WebMcpAdapterService
    ]
})
export class GridAllModule { }