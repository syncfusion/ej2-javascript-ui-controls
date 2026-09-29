import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['allowDragAndDrop','allowEditing','allowMultiSelection','allowTextWrap','animation','autoCheck','checkDisabledChildren','checkOnClick','checkedNodes','cssClass','disableHtmlEncode','disabled','dragArea','enableHtmlSanitizer','enablePersistence','enableRtl','enableVirtualization','expandOn','expandedNodes','fields','fullRowNavigable','fullRowSelect','height','loadOnDemand','locale','nodeTemplate','selectedNodes','showCheckBox','sortOrder'];
export const outputs: string[] = ['actionFailure','created','dataBound','dataSourceChanged','destroyed','drawNode','keyPress','nodeChecked','nodeChecking','nodeClicked','nodeCollapsed','nodeCollapsing','nodeDragStart','nodeDragStop','nodeDragging','nodeDropped','nodeEdited','nodeEditing','nodeExpanded','nodeExpanding','nodeSelected','nodeSelecting'];
export const twoWays: string[] = [''];

/**
 * TreeView component is used to represent the hierarchical data in tree like structure with advanced functions to perform edit, drag and drop, selection with check-box and more.
 * ```html
 * <ej-treeview allowDragAndDrop='true'></ej-treeview>
 * ```
 */
@Component({
    selector: 'ejs-treeview',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        nodeTemplate: new ContentChild('nodeTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class TreeViewComponent extends TreeView implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionFailure: any;
	declare created: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare destroyed: any;
	declare drawNode: any;
	declare keyPress: any;
	declare nodeChecked: any;
	declare nodeChecking: any;
	declare nodeClicked: any;
	declare nodeCollapsed: any;
	declare nodeCollapsing: any;
	declare nodeDragStart: any;
	declare nodeDragStop: any;
	declare nodeDragging: any;
	declare nodeDropped: any;
	declare nodeEdited: any;
	declare nodeEditing: any;
	declare nodeExpanded: any;
	declare nodeExpanding: any;
	declare nodeSelected: any;
	public declare nodeSelecting: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

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
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(TreeViewComponent.prototype, 'nodeTemplate');


