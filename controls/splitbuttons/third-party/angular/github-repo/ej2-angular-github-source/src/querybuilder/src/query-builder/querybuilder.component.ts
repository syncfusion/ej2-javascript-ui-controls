import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { QueryBuilder } from '@syncfusion/ej2-querybuilder';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';

export const inputs: string[] = ['addRuleToNewGroups','allowDragAndDrop','allowValidation','autoSelectField','autoSelectOperator','columns','cssClass','dataSource','displayMode','enableNotCondition','enablePersistence','enableRtl','enableSeparateConnector','fieldMode','fieldModel','headerTemplate','height','immediateModeDelay','locale','matchCase','maxGroupCount','operatorModel','readonly','rule','separator','showButtons','sortDirection','summaryView','valueModel','width'];
export const outputs: string[] = ['actionBegin','beforeChange','change','created','dataBound','destroyed','ruleChange','drag','dragStart','drop'];
export const twoWays: string[] = [''];

/**
 * Represents the EJ2 Angular QueryBuilder Component.
 * ```html
 * <ejs-querybuilder></ejs-querybuilder>
 * ```
 */
@Component({
    selector: 'ejs-querybuilder',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        headerTemplate: new ContentChild('headerTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class QueryBuilderComponent extends QueryBuilder implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare beforeChange: any;
	declare change: any;
	declare created: any;
	declare dataBound: any;
	declare destroyed: any;
	declare ruleChange: any;
	declare drag: any;
	declare dragStart: any;
	public declare drop: any;
    public declare childColumns: QueryList<ColumnsDirective>;
    public tags: string[] = ['columns'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('QueryBuilderQueryLibrary');
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
        this.tagObjects[0].instance = this.childColumns;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(QueryBuilderComponent.prototype, 'headerTemplate');


