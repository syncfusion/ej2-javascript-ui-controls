import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { SpeechToText } from '@syncfusion/ej2-inputs';



export const inputs: string[] = ['allowInterimResults','buttonSettings','cssClass','disabled','enablePersistence','enableRtl','htmlAttributes','lang','listeningState','locale','showTooltip','tooltipSettings','transcript'];
export const outputs: string[] = ['created','onError','onStart','onStop','transcriptChanged','transcriptChange'];
export const twoWays: string[] = ['transcript'];

/**
 * Represents the EJ2 Angular SpeechToText Component.
 * ```html
 * <button ejs-speechtotext ></button>
 * ```
 */
@Component({
    selector: '[ejs-speechtotext]',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class SpeechToTextComponent extends SpeechToText implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare created: any;
	declare onError: any;
	declare onStart: any;
	declare onStop: any;
	declare transcriptChanged: any;
	public declare transcriptChange: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.containerContext  = new ComponentBase();
    }

    public ngOnInit() {
        this.containerContext.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.containerContext.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.containerContext.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

