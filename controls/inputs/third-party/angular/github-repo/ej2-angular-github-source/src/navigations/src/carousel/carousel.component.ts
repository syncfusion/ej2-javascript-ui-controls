import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Carousel } from '@syncfusion/ej2-navigations';
import { Template } from '@syncfusion/ej2-angular-base';
import { CarouselItemsDirective } from './items.directive';

export const inputs: string[] = ['allowKeyboardInteraction','animationEffect','autoPlay','buttonsVisibility','cssClass','dataSource','enablePersistence','enableRtl','enableTouchSwipe','height','htmlAttributes','indicatorsTemplate','indicatorsType','interval','itemTemplate','items','locale','loop','nextButtonTemplate','partialVisible','pauseOnHover','playButtonTemplate','previousButtonTemplate','selectedIndex','showIndicators','showPlayButton','swipeMode','width'];
export const outputs: string[] = ['slideChanged','slideChanging','selectedIndexChange'];
export const twoWays: string[] = ['selectedIndex'];

/**
 * Represents the EJ2 Angular Carousel Component.
 * ```html
 * <ejs-carousel [items]='carouselItems'></ejs-carousel>
 * ```
 */
@Component({
    selector: 'ejs-carousel',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(CarouselItemsDirective),
        indicatorsTemplate: new ContentChild('indicatorsTemplate'),
        nextButtonTemplate: new ContentChild('nextButtonTemplate'),
        previousButtonTemplate: new ContentChild('previousButtonTemplate'),
        playButtonTemplate: new ContentChild('playButtonTemplate'),
        itemTemplate: new ContentChild('itemTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class CarouselComponent extends Carousel implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare slideChanged: any;
	declare slideChanging: any;
	public declare selectedIndexChange: any;
    public declare childItems: QueryList<CarouselItemsDirective>;
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
Template()(CarouselComponent.prototype, 'indicatorsTemplate');
Template()(CarouselComponent.prototype, 'nextButtonTemplate');
Template()(CarouselComponent.prototype, 'previousButtonTemplate');
Template()(CarouselComponent.prototype, 'playButtonTemplate');
Template()(CarouselComponent.prototype, 'itemTemplate');


