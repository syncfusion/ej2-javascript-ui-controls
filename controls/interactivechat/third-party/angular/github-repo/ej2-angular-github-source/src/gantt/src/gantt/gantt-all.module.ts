import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AddDialogFieldDirective, AddDialogFieldsDirective } from './adddialogfields.directive';
import { EditDialogFieldDirective, EditDialogFieldsDirective } from './editdialogfields.directive';
import { DayWorkingTimeDirective, DayWorkingTimeCollectionDirective } from './dayworkingtime.directive';
import { WeekWorkingTimeDirective, WeekWorkingTimesDirective } from './weekworkingtime.directive';
import { HolidayDirective, HolidaysDirective } from './holidays.directive';
import { EventMarkerDirective, EventMarkersDirective } from './eventmarkers.directive';
import { GanttComponent } from './gantt.component';
import { GanttModule } from './gantt.module';
import {Filter, Selection, Sort, Reorder, Resize, Edit, DayMarkers, Toolbar, ContextMenu, ExcelExport, RowDD, ColumnMenu, PdfExport, VirtualScroll, CriticalPath, UndoRedo, Freeze} from '@syncfusion/ej2-gantt'


export const FilterService: ValueProvider = { provide: 'GanttFilter', useValue: Filter};
export const SelectionService: ValueProvider = { provide: 'GanttSelection', useValue: Selection};
export const SortService: ValueProvider = { provide: 'GanttSort', useValue: Sort};
export const ReorderService: ValueProvider = { provide: 'GanttReorder', useValue: Reorder};
export const ResizeService: ValueProvider = { provide: 'GanttResize', useValue: Resize};
export const EditService: ValueProvider = { provide: 'GanttEdit', useValue: Edit};
export const DayMarkersService: ValueProvider = { provide: 'GanttDayMarkers', useValue: DayMarkers};
export const ToolbarService: ValueProvider = { provide: 'GanttToolbar', useValue: Toolbar};
export const ContextMenuService: ValueProvider = { provide: 'GanttContextMenu', useValue: ContextMenu};
export const ExcelExportService: ValueProvider = { provide: 'GanttExcelExport', useValue: ExcelExport};
export const RowDDService: ValueProvider = { provide: 'GanttRowDD', useValue: RowDD};
export const ColumnMenuService: ValueProvider = { provide: 'GanttColumnMenu', useValue: ColumnMenu};
export const PdfExportService: ValueProvider = { provide: 'GanttPdfExport', useValue: PdfExport};
export const VirtualScrollService: ValueProvider = { provide: 'GanttVirtualScroll', useValue: VirtualScroll};
export const CriticalPathService: ValueProvider = { provide: 'GanttCriticalPath', useValue: CriticalPath};
export const UndoRedoService: ValueProvider = { provide: 'GanttUndoRedo', useValue: UndoRedo};
export const FreezeService: ValueProvider = { provide: 'GanttFreeze', useValue: Freeze};

/**
 * NgModule definition for the Gantt component with providers.
 */
@NgModule({
    imports: [CommonModule, GanttModule],
    exports: [
        GanttModule
    ],
    providers:[
        FilterService,
        SelectionService,
        SortService,
        ReorderService,
        ResizeService,
        EditService,
        DayMarkersService,
        ToolbarService,
        ContextMenuService,
        ExcelExportService,
        RowDDService,
        ColumnMenuService,
        PdfExportService,
        VirtualScrollService,
        CriticalPathService,
        UndoRedoService,
        FreezeService
    ]
})
export class GanttAllModule { }