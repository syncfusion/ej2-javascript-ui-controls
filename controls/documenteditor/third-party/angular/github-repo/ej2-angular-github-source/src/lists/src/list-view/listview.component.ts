import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ListView } from '@syncfusion/ej2-lists';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['animation','checkBoxPosition','cssClass','dataSource','disableHtmlEncode','enable','enableHtmlSanitizer','enablePersistence','enableRtl','enableVirtualization','enabled','fields','groupTemplate','headerTemplate','headerTitle','height','htmlAttributes','locale','query','showCheckBox','showHeader','showIcon','sortOrder','template','width'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','scroll','select'];
export const twoWays: string[] = [''];

/**
 * Represents Angular ListView Component
 * ```
 * <ejs-listview [dataSource]='data'></ejs-listview>
 * ```
 */
@Component({
    selector: 'ejs-listview',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        template: new ContentChild('template'),
        groupTemplate: new ContentChild('groupTemplate'),
        headerTemplate: new ContentChild('headerTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class ListViewComponent extends ListView implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare scroll: any;
	public declare select: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ListsVirtualization');
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
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ListViewComponent.prototype, 'template');
Template()(ListViewComponent.prototype, 'groupTemplate');
Template()(ListViewComponent.prototype, 'headerTemplate');


