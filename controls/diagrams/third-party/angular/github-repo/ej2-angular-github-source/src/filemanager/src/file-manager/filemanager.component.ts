import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { FileManager } from '@syncfusion/ej2-filemanager';
import { Template } from '@syncfusion/ej2-angular-base';
import { ToolbarItemsDirective } from './toolbaritems.directive';

export const inputs: string[] = ['ajaxSettings','allowDragAndDrop','allowMultiSelection','contextMenuSettings','cssClass','detailsViewSettings','enableHtmlSanitizer','enablePersistence','enableRangeSelection','enableRtl','enableVirtualization','enableWebMcp','fileSystemData','height','largeIconsTemplate','locale','navigationPaneSettings','navigationPaneTemplate','path','popupTarget','rootAliasName','searchSettings','selectedItems','showFileExtension','showHiddenItems','showItemCheckBoxes','showThumbnail','sortBy','sortComparer','sortOrder','toolbarItems','toolbarSettings','uploadSettings','view','width'];
export const outputs: string[] = ['beforeDelete','beforeDownload','beforeFolderCreate','beforeImageLoad','beforeMove','beforePopupClose','beforePopupOpen','beforeRename','beforeSend','beforeWebMcpToolExecute','created','delete','destroyed','failure','fileDragStart','fileDragStop','fileDragging','fileDropped','fileLoad','fileOpen','fileSelect','fileSelection','folderCreate','menuClick','menuClose','menuOpen','move','popupClose','popupOpen','rename','search','success','toolbarClick','toolbarCreate','uploadListCreate'];
export const twoWays: string[] = [''];

/**
  * Represents the Essential JS 2 Angular FileManager Component.
 * ```html
 * <ejs-filemanager showThumbnail='false'></ejs-filemanager>
 * ```
 */
@Component({
    selector: 'ejs-filemanager',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childToolbarItems: new ContentChild(ToolbarItemsDirective),
        largeIconsTemplate: new ContentChild('largeIconsTemplate'),
        navigationPaneTemplate: new ContentChild('navigationPaneTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class FileManagerComponent extends FileManager implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforeDelete: any;
	declare beforeDownload: any;
	declare beforeFolderCreate: any;
	declare beforeImageLoad: any;
	declare beforeMove: any;
	declare beforePopupClose: any;
	declare beforePopupOpen: any;
	declare beforeRename: any;
	declare beforeSend: any;
	declare beforeWebMcpToolExecute: any;
	declare created: any;
	declare delete: any;
	declare destroyed: any;
	declare failure: any;
	declare fileDragStart: any;
	declare fileDragStop: any;
	declare fileDragging: any;
	declare fileDropped: any;
	declare fileLoad: any;
	declare fileOpen: any;
	declare fileSelect: any;
	declare fileSelection: any;
	declare folderCreate: any;
	declare menuClick: any;
	declare menuClose: any;
	declare menuOpen: any;
	declare move: any;
	declare popupClose: any;
	declare popupOpen: any;
	declare rename: any;
	declare search: any;
	declare success: any;
	declare toolbarClick: any;
	declare toolbarCreate: any;
	public declare uploadListCreate: any;
    public declare childToolbarItems: QueryList<ToolbarItemsDirective>;
    public tags: string[] = ['toolbarItems'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('FileManagerDetailsView');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerNavigationPane');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerLargeIconsView');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerBreadCrumbBar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('FileManagerVirtualization');
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
        this.tagObjects[0].instance = this.childToolbarItems;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(FileManagerComponent.prototype, 'largeIconsTemplate');
Template()(FileManagerComponent.prototype, 'navigationPaneTemplate');


