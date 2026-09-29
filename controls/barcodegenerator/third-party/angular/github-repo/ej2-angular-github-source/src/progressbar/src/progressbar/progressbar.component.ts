import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ProgressBar } from '@syncfusion/ej2-progressbar';

import { ProgressBarAnnotationsDirective } from './annotations.directive';
import { RangeColorsDirective } from './rangecolors.directive';

export const inputs: string[] = ['animation','annotations','cornerRadius','enablePersistence','enablePieProgress','enableProgressSegments','enableRtl','endAngle','gapWidth','height','innerRadius','isActive','isGradient','isIndeterminate','isStriped','labelOnTrack','labelStyle','locale','margin','maximum','minimum','progressColor','progressThickness','radius','rangeColors','role','secondaryProgress','secondaryProgressColor','secondaryProgressThickness','segmentColor','segmentCount','showProgressValue','startAngle','theme','tooltip','trackColor','trackThickness','type','value','width'];
export const outputs: string[] = ['animationComplete','load','loaded','mouseClick','mouseDown','mouseLeave','mouseMove','mouseUp','progressCompleted','textRender','tooltipRender','valueChanged'];
export const twoWays: string[] = [''];

/**
 * ProgressBar Component
 * ```html
 * <ejsprogressbar></ejsprogressbar>
 * ```
 */
@Component({
    selector: 'ejs-progressbar',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childAnnotations: new ContentChild(ProgressBarAnnotationsDirective),
        childRangeColors: new ContentChild(RangeColorsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class ProgressBarComponent extends ProgressBar implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare animationComplete: any;
	declare load: any;
	declare loaded: any;
	declare mouseClick: any;
	declare mouseDown: any;
	declare mouseLeave: any;
	declare mouseMove: any;
	declare mouseUp: any;
	declare progressCompleted: any;
	declare textRender: any;
	declare tooltipRender: any;
	public declare valueChanged: any;
    public declare childAnnotations: QueryList<ProgressBarAnnotationsDirective>;
    public declare childRangeColors: QueryList<RangeColorsDirective>;
    public tags: string[] = ['annotations', 'rangeColors'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ProgressBarProgressAnnotation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ProgressBarProgressTooltip');
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
        this.tagObjects[0].instance = this.childAnnotations;
        if (this.childRangeColors) {
                    this.tagObjects[1].instance = this.childRangeColors as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


