import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Menu } from '@syncfusion/ej2-navigations';
import { Template } from '@syncfusion/ej2-angular-base';
import { MenuItemsDirective } from './items.directive';

export const inputs: string[] = ['animationSettings','cssClass','enableHtmlSanitizer','enablePersistence','enableRtl','enableScrolling','fields','filter','hamburgerMode','hoverDelay','items','locale','orientation','showItemOnClick','target','template','title'];
export const outputs: string[] = ['beforeClose','beforeItemRender','beforeOpen','created','onClose','onOpen','select'];
export const twoWays: string[] = [''];

/**
 * Represents the EJ2 Angular Menu Component.
 * ```html
 * <ejs-menu [items]='menuItems'></ejs-menu>
 * ```
 */
@Component({
    selector: 'ejs-menu',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(MenuItemsDirective),
        template: new ContentChild('template')
    }
})
@ComponentMixins([ComponentBase])
export class MenuComponent extends Menu implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeItemRender: any;
	declare beforeOpen: any;
	declare created: any;
	declare onClose: any;
	declare onOpen: any;
	public declare select: any;
    public declare childItems: QueryList<MenuItemsDirective>;
    public tags: string[] = ['items'];

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
        this.tagObjects[0].instance = this.childItems;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(MenuComponent.prototype, 'template');


