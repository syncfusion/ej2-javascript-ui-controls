import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotViewComponent } from './pivotview.component';
import { PivotViewModule } from './pivotview.module';
import {GroupingBar, FieldList, CalculatedField, ConditionalFormatting, VirtualScroll, DrillThrough, Toolbar, PivotChart, PDFExport, ExcelExport, NumberFormatting, Grouping, Pager} from '@syncfusion/ej2-pivotview'


export const GroupingBarService: ValueProvider = { provide: 'PivotViewGroupingBar', useValue: GroupingBar};
export const FieldListService: ValueProvider = { provide: 'PivotViewFieldList', useValue: FieldList};
export const CalculatedFieldService: ValueProvider = { provide: 'PivotViewCalculatedField', useValue: CalculatedField};
export const ConditionalFormattingService: ValueProvider = { provide: 'PivotViewConditionalFormatting', useValue: ConditionalFormatting};
export const VirtualScrollService: ValueProvider = { provide: 'PivotViewVirtualScroll', useValue: VirtualScroll};
export const DrillThroughService: ValueProvider = { provide: 'PivotViewDrillThrough', useValue: DrillThrough};
export const ToolbarService: ValueProvider = { provide: 'PivotViewToolbar', useValue: Toolbar};
export const PivotChartService: ValueProvider = { provide: 'PivotViewPivotChart', useValue: PivotChart};
export const PDFExportService: ValueProvider = { provide: 'PivotViewPDFExport', useValue: PDFExport};
export const ExcelExportService: ValueProvider = { provide: 'PivotViewExcelExport', useValue: ExcelExport};
export const NumberFormattingService: ValueProvider = { provide: 'PivotViewNumberFormatting', useValue: NumberFormatting};
export const GroupingService: ValueProvider = { provide: 'PivotViewGrouping', useValue: Grouping};
export const PagerService: ValueProvider = { provide: 'PivotViewPager', useValue: Pager};

/**
 * NgModule definition for the PivotView component with providers.
 */
@NgModule({
    imports: [CommonModule, PivotViewModule],
    exports: [
        PivotViewModule
    ],
    providers:[
        GroupingBarService,
        FieldListService,
        CalculatedFieldService,
        ConditionalFormattingService,
        VirtualScrollService,
        DrillThroughService,
        ToolbarService,
        PivotChartService,
        PDFExportService,
        ExcelExportService,
        NumberFormattingService,
        GroupingService,
        PagerService
    ]
})
export class PivotViewAllModule { }