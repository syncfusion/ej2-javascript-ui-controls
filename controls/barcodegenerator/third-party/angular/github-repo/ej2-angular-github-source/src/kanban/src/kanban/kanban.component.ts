import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Kanban } from '@syncfusion/ej2-kanban';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';
import { StackedHeadersDirective } from './stackedheaders.directive';

export const inputs: string[] = ['allowColumnDragAndDrop','allowDragAndDrop','allowKeyboard','cardHeight','cardSettings','columns','constraintType','cssClass','dataSource','dialogSettings','enableHtmlSanitizer','enablePersistence','enableRtl','enableTooltip','enableVirtualization','externalDropId','height','keyField','locale','query','showEmptyColumn','sortSettings','stackedHeaders','swimlaneSettings','tooltipTemplate','width'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','cardClick','cardDoubleClick','cardRendered','columnDrag','columnDragStart','columnDrop','created','dataBinding','dataBound','dataSourceChanged','dataStateChange','dialogClose','dialogOpen','drag','dragStart','dragStop','queryCellInfo'];
export const twoWays: string[] = [''];

/**
 * `ej-kanban` represents the Angular Kanban Component.
 * ```html
 * <ejs-kanban></ejs-kanban>
 * ```
 */
@Component({
    selector: 'ejs-kanban',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        childStackedHeaders: new ContentChild(StackedHeadersDirective),
        tooltipTemplate: new ContentChild('tooltipTemplate'),
        columns_template: new ContentChild('columnsTemplate'),
        swimlaneSettings_template: new ContentChild('swimlaneSettingsTemplate'),
        cardSettings_template: new ContentChild('cardSettingsTemplate'),
        dialogSettings_template: new ContentChild('dialogSettingsTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class KanbanComponent extends Kanban implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare cardClick: any;
	declare cardDoubleClick: any;
	declare cardRendered: any;
	declare columnDrag: any;
	declare columnDragStart: any;
	declare columnDrop: any;
	declare created: any;
	declare dataBinding: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare dataStateChange: any;
	declare dialogClose: any;
	declare dialogOpen: any;
	declare drag: any;
	declare dragStart: any;
	declare dragStop: any;
	public declare queryCellInfo: any;
    public declare childColumns: QueryList<ColumnsDirective>;
    public declare childStackedHeaders: QueryList<StackedHeadersDirective>;
    public tags: string[] = ['columns', 'stackedHeaders'];

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
        this.tagObjects[0].instance = this.childColumns;
        if (this.childStackedHeaders) {
                    this.tagObjects[1].instance = this.childStackedHeaders as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(KanbanComponent.prototype, 'tooltipTemplate');
Template()(KanbanComponent.prototype, 'columns_template');
Template()(KanbanComponent.prototype, 'swimlaneSettings_template');
Template()(KanbanComponent.prototype, 'cardSettings_template');
Template()(KanbanComponent.prototype, 'dialogSettings_template');


