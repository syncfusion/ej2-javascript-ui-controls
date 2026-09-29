import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentBase, IComponentBase } from '../src/component-base';
import { applyMixins, ComponentMixins } from '../src/util';
import { DemoBase } from './sample.core';

/**
 * Sample Component
 */
@Component({
    selector: 'ej2-button',
    inputs: ['text', 'height', 'width', 'value'],
    outputs: ['updated', 'textChange'],
    template: ''
})
@ComponentMixins([ComponentBase])
export class DemoBaseComponent extends DemoBase implements IComponentBase {
    constructor( @Inject(ElementRef) private ngEle: ElementRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.registerEvents(['updated']);
        this.addTwoWay.call(this, ['text']);
    }

    public registerEvents: (eventList: string[]) => void;
    public addTwoWay: (propList: string[]) => void;
}


/**
 * Sample Component
 */
@Component({
    selector: 'ej2-container',
    inputs: ['text', 'height', 'width'],
    outputs: [],
    template: '<ng-content></ng-content>'
})
@ComponentMixins([ComponentBase])
export class ContainerComponent extends DemoBase implements IComponentBase {
    constructor( @Inject(ElementRef) private ngEle: ElementRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.registerEvents(null);
        this.addTwoWay(['text']);
    }
    public registerEvents: (eventList: string[]) => void;
    public addTwoWay: (propList: string[]) => void;
}
// To cover coverage
let cbase: any = new ComponentBase();
cbase.registerEvents();

