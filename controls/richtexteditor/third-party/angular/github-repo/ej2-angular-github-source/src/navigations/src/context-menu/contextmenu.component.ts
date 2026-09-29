import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ContextMenu } from '@syncfusion/ej2-navigations';



export const inputs: string[] = ['animationSettings','cssClass','enableHtmlSanitizer','enablePersistence','enableRtl','enableScrolling','fields','filter','hoverDelay','itemTemplate','items','locale','showItemOnClick','target','template'];
export const outputs: string[] = ['beforeClose','beforeItemRender','beforeOpen','created','onClose','onOpen','select'];
export const twoWays: string[] = [''];

/**
 * Represents the EJ2 Angular ContextMenu Component.
 * ```html
 * <div id='target'>Right click / Touch hold to open the ContextMenu</div>
 * <ejs-contextmenu target='#target' [items]='menuItems'></ejs-contextmenu>
 * ```
 */
@Component({
    selector: 'ejs-contextmenu',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class ContextMenuComponent extends ContextMenu implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeItemRender: any;
	declare beforeOpen: any;
	declare created: any;
	declare onClose: any;
	declare onOpen: any;
	public declare select: any;



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


