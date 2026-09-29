import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ChipList } from '@syncfusion/ej2-buttons';

import { ChipsDirective } from './chips.directive';

export const inputs: string[] = ['allowDragAndDrop','avatarIconCss','avatarText','chips','cssClass','dragArea','enableDelete','enablePersistence','enableRtl','enabled','htmlAttributes','leadingIconCss','leadingIconUrl','locale','selectedChips','selection','text','trailingIconCss','trailingIconUrl'];
export const outputs: string[] = ['beforeClick','click','created','delete','deleted','dragStart','dragStop','dragging'];
export const twoWays: string[] = [''];

/**
 * Represents the Essential JS 2 Angular ChipList Component.
 * ```html
 * <ejs-chiplist></ejs-chiplist>
 * ```
 */
@Component({
    selector: 'ejs-chiplist',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childChips: new ContentChild(ChipsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class ChipListComponent extends ChipList implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforeClick: any;
	declare click: any;
	declare created: any;
	declare delete: any;
	declare deleted: any;
	declare dragStart: any;
	declare dragStop: any;
	public declare dragging: any;
    public declare childChips: QueryList<ChipsDirective>;
    public tags: string[] = ['chips'];

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
        this.tagObjects[0].instance = this.childChips;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


