import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Spreadsheet } from '@syncfusion/ej2-spreadsheet';
import { Template } from '@syncfusion/ej2-angular-base';
import { SheetsDirective } from './sheets.directive';
import { DefinedNamesDirective } from './definednames.directive';

export const inputs: string[] = ['activeSheetIndex','aiAssistSettings','allowAutoFill','allowCellFormatting','allowChart','allowConditionalFormat','allowDataValidation','allowDelete','allowEditing','allowFiltering','allowFindAndReplace','allowFreezePane','allowHyperlink','allowImage','allowInsert','allowMerge','allowNumberFormatting','allowOpen','allowPrint','allowResizing','allowSave','allowScrolling','allowSorting','allowUndoRedo','allowWrap','author','autoFillSettings','calculationMode','cellStyle','cssClass','currencyCode','definedNames','enableAIAssist','enableClipboard','enableCollaborativeEditing','enableContextMenu','enableKeyboardNavigation','enableKeyboardShortcut','enableNotes','enablePersistence','enableRtl','enableWebMcp','height','isProtected','listSeparator','locale','openSettings','openUrl','password','saveUrl','scrollSettings','selectionSettings','sheets','showAggregate','showCommentsPane','showFormulaBar','showRibbon','showSheetTabs','width'];
export const outputs: string[] = ['actionBegin','actionComplete','afterHyperlinkClick','afterHyperlinkCreate','beforeCellFormat','beforeCellRender','beforeCellSave','beforeCellUpdate','beforeConditionalFormat','beforeDataBound','beforeHyperlinkClick','beforeHyperlinkCreate','beforeOpen','beforeSave','beforeSelect','beforeSort','beforeWebMcpToolExecute','cellEdit','cellEdited','cellEditing','cellSave','contextMenuBeforeClose','contextMenuBeforeOpen','contextMenuItemSelect','created','dataBound','dataSourceChanged','dialogBeforeOpen','fileMenuBeforeClose','fileMenuBeforeOpen','fileMenuItemSelect','openComplete','openFailure','promptRequest','promptResponse','queryCellInfo','saveComplete','select','sortComplete'];
export const twoWays: string[] = [''];

/**
 * `ejs-spreadsheet` represents the Angular Spreadsheet Component.
 * ```html
 * <ejs-spreadsheet></ejs-spreadsheet>
 * ```
 */
@Component({
    selector: 'ejs-spreadsheet',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childSheets: new ContentChild(SheetsDirective),
        childDefinedNames: new ContentChild(DefinedNamesDirective),
        template: new ContentChild('template')
    }
})
@ComponentMixins([ComponentBase])
export class SpreadsheetComponent extends Spreadsheet implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare afterHyperlinkClick: any;
	declare afterHyperlinkCreate: any;
	declare beforeCellFormat: any;
	declare beforeCellRender: any;
	declare beforeCellSave: any;
	declare beforeCellUpdate: any;
	declare beforeConditionalFormat: any;
	declare beforeDataBound: any;
	declare beforeHyperlinkClick: any;
	declare beforeHyperlinkCreate: any;
	declare beforeOpen: any;
	declare beforeSave: any;
	declare beforeSelect: any;
	declare beforeSort: any;
	declare beforeWebMcpToolExecute: any;
	declare cellEdit: any;
	declare cellEdited: any;
	declare cellEditing: any;
	declare cellSave: any;
	declare contextMenuBeforeClose: any;
	declare contextMenuBeforeOpen: any;
	declare contextMenuItemSelect: any;
	declare created: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare dialogBeforeOpen: any;
	declare fileMenuBeforeClose: any;
	declare fileMenuBeforeOpen: any;
	declare fileMenuItemSelect: any;
	declare openComplete: any;
	declare openFailure: any;
	declare promptRequest: any;
	declare promptResponse: any;
	declare queryCellInfo: any;
	declare saveComplete: any;
	declare select: any;
	public declare sortComplete: any;
    public declare childSheets: QueryList<SheetsDirective>;
    public declare childDefinedNames: QueryList<DefinedNamesDirective>;
    public tags: string[] = ['sheets', 'definedNames'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('SpreadsheetClipboard');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetEdit');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetKeyboardNavigation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetKeyboardShortcut');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetFormulaBar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetRibbon');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetSave');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetOpen');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetSheetTabs');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetDataBind');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetCellFormat');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetNumberFormat');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetFormula');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetAIAssist');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetWebMcpAdapter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SpreadsheetCollaborativeEditingHandler');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childSheets;
        if (this.childDefinedNames) {
                    this.tagObjects[1].instance = this.childDefinedNames as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(SpreadsheetComponent.prototype, 'template');


