/**
 * Splitter test cases
 */
import { createElement, Browser, isNullOrUndefined} from '@syncfusion/ej2-base';
import {Splitter, ResizeEventArgs} from '../src/splitter/splitter';
import {SplitterModel, PanePropertiesModel} from '../src/splitter/splitter-model';

function appendSplitterStyles() {
    let css: string = ".e-splitter.e-splitter-horizontal { flex-direction: row; display: flex; overflow: hidden; position: relative}";
    let boxsizing: string = ".e-control, .e-control [class^='e-'], .e-control [class*=' e-'] { box-sizing: border-box;}"
    let paneStyles: string = ".e-splitter.e-splitter-horizontal .e-pane.e-pane-horizontal, .e-splitter.e-splitter-vertical .e-pane.e-pane-horizontal { overflow: auto }"
    let flexstyles: string = ".e-splitter.e-splitter-horizontal .e-pane.e-static-pane, .e-splitter.e-splitter-vertical .e-pane.e-static-pane {     flex-grow: 0; flex-shrink: 0;}"
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    let styleNode1: Node = style.appendChild(document.createTextNode(boxsizing));
    let styleNode2: Node = style.appendChild(document.createTextNode(paneStyles));
    let styleNode3: Node = style.appendChild(document.createTextNode(flexstyles));
    document.getElementsByTagName('head')[0].appendChild(style)
}

describe('Splitter Control', () => {
    describe('Basics', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default' });
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get module name', () => {
            expect(splitterObj.getModuleName()).toBe('splitter');
        });
        it('control class validation', () => {
            expect(splitterObj.element.classList.contains('e-control')).toBe(true);
            expect(splitterObj.element.classList.contains('e-splitter')).toBe(true);
        });
        it('default value validation', () => {
            expect(splitterObj.height).toBe('100%');
            expect(splitterObj.width).toBe('100%');
        });
        it('DOM structure Testing', () => {
            expect(splitterObj.element.classList.contains('e-splitter')).toBe(true);
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal').length).toBe(2);
            // expect(splitterObj.element.querySelectorAll('.e-split-bar-horizontal').length).toBe(1);
        });
    });
    describe('Height', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default' });
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '100px'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('height api testing', () => {
            expect(splitterObj.element.style.height).toBe('100px');
            expect(splitterObj.element.style.width).toBe('100%');
        });
    });

    describe('Width', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default' });
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ width: '100px'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('width api testing', () => {
            expect(splitterObj.element.style.width).toBe('100px');
            expect(splitterObj.element.style.height).toBe('100%');
        });
    });

    describe('Width', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='100px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('inline style width testing', () => {
            expect(splitterObj.element.style.width).toBe('100px');
            expect(splitterObj.element.style.height).toBe('100%');
        });
    });
    describe('Height', (): void => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.height ='100px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('inline style height testing', () => {
            expect(splitterObj.element.style.height).toBe('100px');
            expect(splitterObj.element.style.width).toBe('100%');
        });
    });
    describe('Height', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.height ='100px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({height: '200px'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('height inline vs api testing', () => {
            expect(splitterObj.element.style.height).toBe('200px');
            expect(splitterObj.element.style.width).toBe('100%');
        });
    });
    describe('Width', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='100px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({width: '200px'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('width inline vs api testing', () => {
            expect(splitterObj.element.style.width).toBe('200px');
            expect(splitterObj.element.style.height).toBe('100%');
        });
    });
    describe('Orientation', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({orientation:'Vertical'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('vertical test', () => {
            expect(splitterObj.element.classList.contains('e-splitter-vertical')).toBe(true);
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical').length).toBe(2);
            // expect(splitterObj.element.querySelectorAll('.e-split-bar-vertical').length).toBe(1);
        });
    });
    describe('paneSettings', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '10%' }, { size: '20%' }],});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('size test', () => {
            expect(splitterObj.element.children[0].style.flexBasis).toBe('10%');
            // expect(splitterObj.element.children[1].style.flexBasis).toBe('calc(90% - 9px)')
        });
    });
    describe('paneSettings', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '100px' }, { size: '100px' }],});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('size with width in pixel', () => {
            // expect(splitterObj.element.children[0].style.flexBasis).toMatch('91px');
           // expect(splitterObj.element.children[1].style.flexBasis).toBe('calc(90% - 9px)')
        });
    });
    describe('paneSettings', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.height ='300px';
            let child1: HTMLElement = createElement('div'   );
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ orientation: 'Vertical', paneSettings: [{ size: '100px' }, { size: '100px' }],});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('size with vertical (px)', () => {
            // expect(splitterObj.element.children[0].style.flexBasis).toMatch('91px');
           // expect(splitterObj.element.children[1].style.flexBasis).toBe('calc(90% - 9px)')
        });
    });
    describe('paneSettings', () => {
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '10%' }, { size: '20%' }],});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('size test with wrong percentage', () => {
            expect(splitterObj.element.children[0].style.flexBasis).toBe('10%');
            // expect(splitterObj.element.children[1].style.flexBasis).toBe('calc(90% - 9px)')
        });
    });

    describe('checking splitter methods method', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '10%', min: '10px' }, { size: '20%', min: '20px' }],});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('validated min size', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            splitterObj.getPaneDetails();
            let left = splitterObj.validateDraggedPosition(200, 300, 300);
            expect(left).toBe(200);
        });

        it('convert pixel to percentage', () => {
            expect(splitterObj.convertPercentageToPixel('25%')).toBe(75);
            expect(splitterObj.convertPercentageToPixel('25')).toBe(25);
            expect(splitterObj.convertPercentageToPixel('25%', splitterObj.previousPane)).toBe(8);
        });

        it('convert pixel to number', () => {
            expect(splitterObj.convertPixelToNumber('180px')).toBe(180);
            expect(splitterObj.convertPixelToNumber('180')).toBe(180);
        });

        it('convert pixel to percentage', () => {
            expect(splitterObj.convertPixelToPercentage('75')).toBe(25);
        });

        it('Remove percentage', () => {
            expect(splitterObj.removePercentageUnit('75%')).toBe(75);
        });

        it('Get Min value', () => {
            expect(splitterObj.getMinMax(0, splitterObj.element, 'min')).toBe(10);
            splitterObj.paneSettings[0].min = '80px';
            splitterObj.dataBind();
            expect(splitterObj.paneSettings[0].min).toBe('80px');
        });

        it('Get max value', () => {
            expect(splitterObj.getMinMax(0, splitterObj.element, 'max')).toBe(null);
            splitterObj.paneSettings[0].max = '100px';
            splitterObj.dataBind();
            expect(splitterObj.paneSettings[0].max).toBe('100px');
        });

        it('Get Previous pane index', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            expect(splitterObj.getPreviousPaneIndex()).toBe(0);
        });

        it('Get Next pane index', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            expect(splitterObj.getNextPaneIndex()).toBe(1);
        });

        it('Get Event type', () => {
            expect(splitterObj.getEventType('mouse')).toBe('mouse');
            expect(splitterObj.getEventType('touch')).toBe('touch');
        });

        it('Get pane details method', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            let panes = splitterObj.element.getElementsByClassName('e-pane-horizontal');
            splitterObj.getPaneDetails();
            expect(splitterObj.previousPane).toBe(panes[0]);
            expect(splitterObj.nextPane).toBe(panes[1]);
            expect(splitterObj.prevPaneIndex).toBe(0);
            expect(splitterObj.nextPaneIndex).toBe(1);
        });

        it('Get pane Dimensions', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            let panes = splitterObj.element.getElementsByClassName('e-pane-horizontal');
            splitterObj.getPaneDetails();
            expect(splitterObj.previousPane).toBe(panes[0]);
            expect(splitterObj.nextPane).toBe(panes[1]);
            expect(splitterObj.prevPaneIndex).toBe(0);
            expect(splitterObj.nextPaneIndex).toBe(1);
        });
    });

    describe('Mouse Down with pixel values', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '196px', min: '10px'}, { size: '196px', min: '20px' }]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            expect(document.querySelector('.e-split-bar-horizontal').classList.contains('e-split-bar-active')).toBe(true);
            expect(splitterObj.currentSeparator).toBe(document.querySelector('.e-split-bar-horizontal'));
        });
    });

    describe('Mouse Down with percentage values', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '50%', min: '10px' }, { size: '35%', min: '20px'}]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            expect(document.querySelector('.e-split-bar-horizontal').classList.contains('e-split-bar-active')).toBe(true);
            expect(splitterObj.currentSeparator).toBe(document.querySelector('.e-split-bar-horizontal'));
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('50%');
        });
    });

    describe('Mouse Down with pixel and percentage combination', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '50%', min: '10px' }, { size: '196px', min: '20px', }]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            expect(document.querySelector('.e-split-bar-horizontal').classList.contains('e-split-bar-active')).toBe(true);
            expect(splitterObj.currentSeparator).toBe(document.querySelector('.e-split-bar-horizontal'));
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('50%');
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('196px');
        });
    });


    describe('Mouse Down with pixel and percentage combination for vertical splitter', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '50%', min: '10px' }, { size: '50%', min: '20px', }], orientation: 'Vertical'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-vertical') as HTMLElement).dispatchEvent (mouseEvent);
            expect(document.querySelector('.e-split-bar-vertical').classList.contains('e-split-bar-active')).toBe(true);
            expect(splitterObj.currentSeparator).toBe(document.querySelector('.e-split-bar-vertical'));
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[0].style.flexBasis).toEqual('50%');
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[1].style.flexBasis).toEqual('50%');
        });
    });

    describe('Resize start event', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '60%', min: '10px' }], resizeStart: function(args: ResizeEventArgs) {
                args.cancel = true
            }});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Cancel resizing', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
        });
    });

    describe('Resizing and resize stop event', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '60%', min: '10px' }], resizeStart: function(args: ResizeEventArgs) {
            }, resizing:function() {
                expect(1).toBe(1) // To check whether the resizing event has been called
            }, resizeStop: function() {
                expect(1).toBe(1) // To check whether the resizestop event has been called
            }
        });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Cancel resizing', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mousemove', true, true);
            document.dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
        });
    });

    describe('Mouse Move with pixel and percentage combination for Horizontal splitter', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ paneSettings: [{ size: '50%', min: '10px' }, { size: '50%', min: '20px', }]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mousemove', true, true);
            document.dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let eventArgs: any = {
                target: document,
                pageX: 350,
                pageY: 400,
                type: 'mousemove',
                which: 1,
                x: 0,
                y: 0
            }
            splitterObj.onMouseMove(eventArgs);
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('93%');
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('7%');
            eventArgs = {
                target: document,
                pageX: 0,
                pageY: 0,
                type: 'mousemove',
                which: 1,
                x: 0,
                y: 0
            }
            splitterObj.onMouseMove(eventArgs);
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('93%');
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('7%');
        });
    });

    describe('Mouse Move with pixel and percentage combination for vertical splitter', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', width: '400px', orientation: 'Vertical', paneSettings: [{ size: '50%', min: '10px' }, { size: '50%', min: '20px', }], 
            resizing: function() {
                expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[0].style.flexBasis).toEqual('50%');
                expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[1].style.flexBasis).toEqual('50%');
            }});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-vertical') as HTMLElement).dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mousemove', true, true);
            document.dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let eventArgs: any = {
                target: document,
                pageX: 150,
                pageY: 500,
                type: 'mousemove',
            }
            splitterObj.onMouseMove(eventArgs);
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[0].style.flexBasis).toEqual('95%');
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[1].style.flexBasis).toEqual('5%');
        });

        it('get Splitbar current position with mouse event for vertical splitter', () => {
            let eventArgs: any = {
                type: 'mouse',
                pointerType: 'mouse',
                pageX: 114,
                pageY: 167,
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            expect(splitterObj.getSeparatorPosition (eventArgs)).toEqual(159);
        });

        it('get Splitbar current position with touch event  for vertical splitter', () => {
            let eventArgs: any = {
                type: 'touchstart',
                touches: [
                    {
                        pageX: 314,
                        pageY: 267
                    }
                ],
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            expect(splitterObj.getSeparatorPosition (eventArgs)).toEqual(259);
        });
    });

    describe('Mouse Move with touch events', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', width: '400px', paneSettings: [{ size: '50%', min: '10%' }, { size: '50%', min: '10%' }], 
            resizing: function() {
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('50%');
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('50%');
            }});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            splitterObj.previousCoordinates =  {x: 200, y: 300};
            let eventArgs: any = {
                type: 'touchstart',
                touches: [
                    {
                        pageX: 314,
                        pageY: 267
                    }
                ],
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            splitterObj.updateCursorPosition (eventArgs, 'previous');
            expect(splitterObj.previousCoordinates.x).toBe(314);
            expect(splitterObj.previousCoordinates.y).toBe(267);
            eventArgs = {
                type: 'mouse',
                pointerType: 'mouse',
                pageX: 114,
                pageY: 167,
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            splitterObj.updateCursorPosition (eventArgs, 'previous');
            expect(splitterObj.previousCoordinates.x).toBe(114);
            expect(splitterObj.previousCoordinates.y).toBe(167);
        });

        it('check isSeparator method', () => {
           expect(splitterObj.isSeparator(document.querySelector('.e-resize-handler'))).toEqual(false);
        });

        it('Hovering on splitbar', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent ('mouseover', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent(mouseEvent);
            expect(splitterObj.element.querySelectorAll('.e-split-bar.e-split-bar-horizontal')[0].classList.contains('e-split-bar-hover')).toBe(true);
            mouseEvent.initEvent ('mouseout', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent(mouseEvent);
            expect(splitterObj.element.querySelectorAll('.e-split-bar.e-split-bar-horizontal')[0].classList.contains('e-split-bar-hover')).toBe(false);
        });

        it('get Splitbar current position with mouse event', () => {
            let eventArgs: any = {
                type: 'mouse',
                pointerType: 'mouse',
                pageX: 114,
                pageY: 167,
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            expect(splitterObj.getSeparatorPosition (eventArgs)).toEqual(106);
        });

        it('get Splitbar current position with touch event', () => {
            let eventArgs: any = {
                type: 'touchstart',
                touches: [
                    {
                        pageX: 314,
                        pageY: 267
                    }
                ],
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            expect(splitterObj.getSeparatorPosition (eventArgs)).toEqual(306);
        });

        it('Check isCursor moved method', () => {
            let eventArgs: any = {
                type: 'touchstart',
                touches: [
                    {
                        pageX: 314,
                        pageY: 267
                    }
                ],
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            splitterObj.previousCoordinates = {x: 314, y: 267};
            expect(splitterObj.isCursorMoved(eventArgs)).toEqual(false);
        });

        
        it('Check isCursor moved method', () => {
            let eventArgs: any = {
                type: 'mouse',
                pageX: 314,
                pageY: 267,
                pointerType: 'mouse',
                target: document.querySelector('.e-split-line') as HTMLElement
            }
            splitterObj.previousCoordinates = {x: 314, y: 267};
            expect(splitterObj.isCursorMoved(eventArgs)).toEqual(false);
        });
    });


    describe('Check min and max values within target', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', width: '400px', paneSettings: [{ size: '50%', min: '10%', max: '40%' }, { size: '50%', min: '10%', max: '40%' }],
            resizing: function() {
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('50%');
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('50%');
            }});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('get minimum value', () => {
            expect(splitterObj.getMinMax(splitterObj.getPreviousPaneIndex(), document.querySelector('.e-pane-horizontal') as HTMLElement, 'min')).toEqual(20);
        });

        it('get Maximum value', () => {
            expect(splitterObj.getMinMax(splitterObj.getPreviousPaneIndex(), document.querySelector('.e-pane-horizontal') as HTMLElement, 'max')).toEqual(80);
        });
    });


    describe('Enable RTL', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', width: '400px', enableRtl: true, paneSettings: [{ size: '50%', min: '10%', max: '40%' }, { size: '50%', min: '10%', max: '40%' }],
            resizing: function() {
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('50%');
                expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('50%');
            }});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('get previous and next pane index', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            expect(splitterObj.getPreviousPaneIndex()).toBe(1);
            expect(splitterObj.getNextPaneIndex()).toBe(0);
        });
    });


    describe('Mouse move without providing pane settings API', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='300px';
            let child1: HTMLElement = createElement('div');
            child1.innerHTML =  "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism.";
            let child2: HTMLElement = createElement('div');
            child2.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
            let child3: HTMLElement = createElement('div');
            child3.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mousemove', true, true);
            document.dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let eventArgs: any = {
                target: document,
                pageX: 350,
                pageY: 400,
                type: 'mousemove',
                which: 1,
                x: 0,
                y: 0
            }
            splitterObj.onMouseMove(eventArgs);
            expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].style.flexBasis).toEqual('198px');
            // expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].style.flexBasis).toEqual('1px');
        });
    });

    describe('Mouse move without providing pane settings API for vertical splitter', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='350px';
            element.style.width ='600px';
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({orientation: 'Vertical', width: '300px', height: '500px'});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('on split bar', () => {
            let mouseEvent = document.createEvent ('MouseEvents');
            mouseEvent.initEvent ('mousedown', true, true);
            (document.querySelector('.e-split-bar-vertical') as HTMLElement).dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mousemove', true, true);
            document.dispatchEvent (mouseEvent);
            mouseEvent.initEvent ('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let eventArgs: any = {
                target: document,
                pageX: 350,
                pageY: 400,
                type: 'mousemove',
                which: 1,
                x: 0,
                y: 0
            }
            splitterObj.onMouseMove(eventArgs);
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[0].style.flexBasis).toEqual('0px');
            expect(splitterObj.element.querySelectorAll('.e-pane-vertical')[1].style.flexBasis).toEqual('0px');
        });
    });

    
    describe('Validating minimum and maximum range', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='350px';
            element.style.width ='600px';
            element.style.flexGrow = '0';
            element.style.flexShrink = '0';
            let child1: HTMLElement = createElement('div');
            child1.innerHTML =  "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism.";
            let child2: HTMLElement = createElement('div');
            child2.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({width: '300px', height: '500px',paneSettings: [{ size: '196px', min: '10%', max: '80%' }, { size: '196px', min: '10%', max: '100%' }]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Min value', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            splitterObj.getPaneDetails();
            splitterObj.prevPaneCurrentWidth = 15;
            splitterObj.nextPaneCurrentWidth = 15;
            splitterObj.totalWidth = 392;
            splitterObj.validateMinMaxValues();
            expect(splitterObj.prevPaneCurrentWidth).toBe(20);
            expect(splitterObj.nextPaneCurrentWidth).toBe(15);
        });

        it('Max value', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            splitterObj.getPaneDetails();
            splitterObj.prevPaneCurrentWidth = 250;
            splitterObj.nextPaneCurrentWidth = 300;
            splitterObj.totalWidth = 392;
            splitterObj.validateMinMaxValues();
            expect(splitterObj.prevPaneCurrentWidth).toBe(157);
            expect(splitterObj.nextPaneCurrentWidth).toBe(103);
        });

    });


    describe('Validating minimum and maximum range', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            element.style.width ='350px';
            element.style.width ='600px';
            element.style.flexGrow = '0';
            element.style.flexShrink = '0';
            let child1: HTMLElement = createElement('div');
            child1.innerHTML =  "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism.";
            let child2: HTMLElement = createElement('div');
            child2.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({width: '300px', height: '500px',paneSettings: [{ size: '50%', min: '10%', max: '80%' }, { size: '50%', min: '10%', max: '90%' }]});
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Calculating values in percentage', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
            splitterObj.getPaneDetails();
            splitterObj.prevPaneCurrentWidth = 40;
            splitterObj.nextPaneCurrentWidth = 30;
            splitterObj.updatePrePaneInPercentage = true;
            splitterObj.updateNextPaneInPercentage = true;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('46.5%');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('43.5%');
            splitterObj.prevPaneCurrentWidth = 150;
            splitterObj.nextPaneCurrentWidth = 230;
            splitterObj.updatePrePaneInPercentage = true;
            splitterObj.updateNextPaneInPercentage = true;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('31.5%');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('58.5%');
            splitterObj.prevPaneCurrentWidth = -5;
            splitterObj.nextPaneCurrentWidth = -9;
            splitterObj.updatePrePaneInPercentage = false;
            splitterObj.updateNextPaneInPercentage = true;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('137px');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('44.5%');
            splitterObj.updatePrePaneInPercentage = true;
            splitterObj.updateNextPaneInPercentage = false;
            splitterObj.prevPaneCurrentWidth = -5;
            splitterObj.nextPaneCurrentWidth = -9;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('45.5%');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('134px');
            splitterObj.prevPaneCurrentWidth = 0;
            splitterObj.nextPaneCurrentWidth = 0;
            splitterObj.updatePrePaneInPercentage = true;
            splitterObj.updateNextPaneInPercentage = true;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('0%');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('90%');
            splitterObj.prevPaneCurrentWidth = 80;
            splitterObj.nextPaneCurrentWidth = 0;
            splitterObj.updatePrePaneInPercentage = true;
            splitterObj.updateNextPaneInPercentage = true;
            splitterObj.totalPercent = 90;
            splitterObj.calculateCurrentDimensions();
            expect(splitterObj.prevPaneCurrentWidth).toEqual('90%');
            expect(splitterObj.nextPaneCurrentWidth).toEqual('0%');

        });

        it('Dragged positions validation', () => {
            expect(splitterObj.validateDraggedPosition (50, 100, 40)).toEqual(65);
            expect(splitterObj.validateDraggedPosition (190, 100, 40)).toEqual(170);
            expect(splitterObj.validateDraggedPosition (45, 100, 40)).toEqual(65);
        });
    });


    
    describe('Validating minimum and maximum range', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            // child1.innerHTML =  "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism.";
            let child2: HTMLElement = createElement('div');
            // child2.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', max: '40px', content: content2 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Checked pane settings content API ', () => {
           expect(isNullOrUndefined(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].querySelector('#content1'))).toBe(false);
           expect(isNullOrUndefined(splitterObj.element.querySelectorAll('.e-pane-horizontal')[1].querySelector('#content2'))).toBe(false);
           splitterObj.nextPaneIndex = 1;
           expect(splitterObj.validateDraggedPosition(140, 100, 40)).toEqual(150);
           splitterObj.paneSettings[0].content = 'content Changed';
           splitterObj.dataBind();
           expect(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].innerHTML).toEqual('content Changed');
           expect(isNullOrUndefined(splitterObj.element.querySelectorAll('.e-pane-horizontal')[0].querySelector('#content1'))).toBe(true);
        });
    });
    
    describe('Without inner content and adding pane settings', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', content: content2 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Check auto generated div element', () => {
           expect(document.querySelectorAll('.e-pane-horizontal').length).toBe(2);
        });
    });

    describe('get previous pane', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                enableRtl: true,
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', content: content2 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('Previous pane', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
           expect(splitterObj.getPrevPane(splitterObj.currentSeparator, parseInt(splitterObj.currentSeparator.style.order, 10))).toBe(document.querySelectorAll('.e-pane-horizontal')[1]);
        });

        it('Next pane', () => {
            splitterObj.currentSeparator = document.getElementsByClassName('e-split-bar')[0];
           expect(splitterObj.getNextPane(splitterObj.currentSeparator, parseInt(splitterObj.currentSeparator.style.order, 10))).toBe(document.querySelectorAll('.e-pane-horizontal')[0]);
        });
    });

    describe('Resizable', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            let content3: string = "<div id='content3'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                enableRtl: true,
                paneSettings: [
                    { size: '50%', content: content1, resizable: false },
                    { size: '50%', content: content2, resizable: false },
                    { size: '50%', content: content3 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('check handlers', () => {
           splitterObj.paneSettings[0].resizable = true;
           splitterObj.dataBind();
           expect(document.getElementsByClassName('e-split-bar')[0].querySelector('.e-resize-handler').classList.contains('e-hide-handler')).toBe(true);
           splitterObj.paneSettings[1].resizable = true;
           splitterObj.dataBind();
           expect(document.getElementsByClassName('e-split-bar')[0].querySelector('.e-resize-handler').classList.contains('e-hide-handler')).toBe(false);
        });
    });

    describe('Resizable is false', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            let content3: string = "<div id='content3'></div>";
            splitterObj = new Splitter({
                width: '300px',
                height: '500px',
                enableRtl: true,
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', content: content2 },
                    { size: '50%', content: content3 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('check handlers', () => {
           expect((<HTMLElement>document.getElementsByClassName('e-split-bar')[1]).style.display === "").toBe(true);
           splitterObj.paneSettings[0].resizable = false;
           splitterObj.dataBind();
           splitterObj.paneSettings[1].resizable = false;
           splitterObj.dataBind();
           expect((<HTMLElement>document.getElementsByClassName('e-split-bar')[0].querySelector('.e-resize-handler')).classList.contains('e-hide-handler')).toBe(true);
        });
    });

    describe('Disable Resize', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            let content3: string = "<div id='content3'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', content: content2 },
                    { size: '50%', content: content3 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('dynamically', () => {
           splitterObj.paneSettings[0].resizable = false;
        //    splitterObj.dataBind();
         // expect(isNullOrUndefined(document.getElementsByClassName('e-split-bar')[0].querySelector('.e-resize-handler'))).toBe(true);
        });
    });

    
    describe('Check RTL', () => {
        appendSplitterStyles();
        let splitterObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            document.body.appendChild(element);
            let content1: string = "<div id='content1'></div>";
            let content2: string = "<div id='content2'></div>";
            let content3: string = "<div id='content3'></div>";
            splitterObj = new Splitter({
                width: '300px', 
                height: '500px',
                paneSettings: [
                    { size: '50%', content: content1 },
                    { size: '50%', content: content2 },
                    { size: '50%', content: content3 }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
        });
        afterAll((): void => {
            document.body.innerHTML = '';
        });

        it('dynamically', () => {
           splitterObj.enableRtl = true;
           splitterObj.dataBind();
           expect(splitterObj.element.classList.contains('e-rtl')).toBe(true);
           splitterObj.enableRtl = false;
           splitterObj.dataBind();
           expect(splitterObj.element.classList.contains('e-rtl')).toBe(false);
        });

        it('Worst case coverage', () => {
            splitterObj.element.classList.remove('e-splitter');
            splitterObj.enableRtl = true;
            splitterObj.dataBind();
            expect(splitterObj.enableRtl).toBe(true);
         });
    });

// Expand collapse

        //test
        describe('Rendering splitter with separatorSize', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            // let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            // element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}]});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('SeparatorSize Api testing', () => {
                expect((document.querySelector('.e-split-bar-horizontal ') as HTMLElement).style.width).toEqual('10px');
            });
        });

        describe('Rendering splitter with separatorSize', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            // let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            // element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', orientation: 'Vertical', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}]});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('SeparatorSize Api testing', () => {
                expect((document.querySelector('.e-split-bar-vertical') as HTMLElement).style.height).toEqual('10px');
            });
        });

        describe('GetPersist method', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', orientation: 'Vertical', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}]});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('test', () => {
                splitterObj.getPersistData();
                expect("{}").toEqual("{}");
            });
        });

        describe('Destroy method', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}]});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('test', () => {
                splitterObj.destroy();
                expect(splitterObj.element.classList.contains('e-control')).toEqual(false);
            });
        });
        describe('CssClass Api    ', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}], cssClass: 'custom-class'});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('test', () => {
                expect(splitterObj.element.classList.contains('custom-class')).toEqual(true);
                splitterObj.cssClass = '';
                splitterObj.dataBind();
                expect(splitterObj.cssClass).toBe('');
            });
        });

        describe('Enabled Api', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ height: '400px', separatorSize: 10, width: '400px', paneSettings: [{ size: '50%' }, {}], enabled: false});
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('test', () => {
                expect(splitterObj.element.classList.contains('e-disabled')).toEqual(true);
            });
        });
        // setModel functionalities
        describe('height and width Api    ', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update by setmodel', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
            });
        });

        describe('SeparatorSize Api setModel', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.separatorSize = 20;
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.querySelector('.e-split-bar').style.width === '20px').toEqual(true);
            });
        });

        describe('SeparatorSize Api in vertical Orientation', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ orientation: 'Vertical' });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.separatorSize = 20;
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.querySelector('.e-split-bar').style.height === '20px').toEqual(true);
            });
        });
        describe('if SeparatorSize is null', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ orientation: 'Vertical' });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.separatorSize = null;
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.querySelector('.e-split-bar').style.height === 'auto').toEqual(true);
            });
        });

        describe('if SeparatorSize is null', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.separatorSize = null;
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.querySelector('.e-split-bar').style.width === 'auto').toEqual(true);
            });
        });

        //update Orinetation
        describe('Orientation change from horizontal', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.orientation = 'Vertical';
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.classList.contains('e-splitter-vertical')).toBe(true);
            });
        });

        describe('Orientation change from vertical', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ orientation: 'Vertical' });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.orientation = 'Horizontal';
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.classList.contains('e-splitter-horizontal')).toBe(true);
            });
        });

        describe('second pane as pixel and third pane as empty', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ 
                width: '400px',
                height: '400px',
                paneSettings: [
                { size: '190px' },
                { size: '30%' },
            ]
            });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('On mouse down', () => {
                let mouseEvent = document.createEvent ('MouseEvents');
                mouseEvent.initEvent ('mousedown', true, true);
                (document.querySelectorAll('.e-split-bar-horizontal')[1] as HTMLElement).dispatchEvent (mouseEvent);
                expect((document.querySelectorAll('.e-split-bar-horizontal')[1] as HTMLElement).classList.contains('e-split-bar-active')).toBe(true);
            })
        });

        describe('Splitter without panesettings API', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ 
                width: '400px',
                height: '400px',
                paneSettings: [
                    {

                    },
                    {
                        size: "40%"
                    },
                    {
                        size: "40%"
                    }
                ]
            });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('On mouse down', () => {
                let mouseEvent = document.createEvent ('MouseEvents');
                mouseEvent.initEvent ('mousedown', true, true);
                (document.querySelectorAll('.e-split-bar-horizontal')[0] as HTMLElement).dispatchEvent (mouseEvent);
                expect((document.querySelectorAll('.e-split-bar-horizontal')[0] as HTMLElement).classList.contains('e-split-bar-active')).toBe(true);
            })
        });


        describe('cssClass through setModel', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            let child3: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            document.body.appendChild(element);
            splitterObj = new Splitter({ 
                width: '400px',
                height: '400px',
                paneSettings: [
                { size: '190px' },
                { size: '30%' },
                { size: '100px' },
            ]
            });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.cssClass = 'custom-class';
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.classList.contains('custom-class')).toBe(true);
            });

            it('On mouse down', () => {
                let mouseEvent = document.createEvent ('MouseEvents');
                mouseEvent.initEvent ('mousedown', true, true);
                (document.querySelector('.e-split-bar-horizontal') as HTMLElement).dispatchEvent (mouseEvent);
                expect(document.querySelector('.e-split-bar-horizontal').classList.contains('e-split-bar-active')).toBe(true);
                expect(splitterObj.currentSeparator).toBe(document.querySelector('.e-split-bar-horizontal'));
            })
        });

        describe('enabled through setModel', () => {
            let splitterObj: any;
            beforeAll((): void => {
            let element: HTMLElement = createElement('div', { id: 'default'});
            let child1: HTMLElement = createElement('div');
            let child2: HTMLElement = createElement('div');
            element.appendChild(child1);
            element.appendChild(child2);
            document.body.appendChild(element);
            splitterObj = new Splitter({ enabled: false });
            splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
            document.body.innerHTML = '';
            });
            it('dynamic update', () => {
                splitterObj.height = '250px';
                splitterObj.width = '350px';
                splitterObj.enabled = true;
                splitterObj.dataBind();
                expect(splitterObj.element.style.height === '250px').toEqual(true);
                expect(splitterObj.element.style.width === '350px').toEqual(true);
                expect(splitterObj.element.classList.contains('e-disabled')).toBe(false);
            });

        });

        describe('paneSettings size', () => {
            appendSplitterStyles();
            let splitterObj: any;
            beforeAll((): void => {
                let element: HTMLElement = createElement('div', { id: 'default'});
                let child1: HTMLElement = createElement('div');
                // child1.innerHTML =  "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism.";
                let child2: HTMLElement = createElement('div');
                // child2.innerHTML = "Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...";
                element.appendChild(child1);
                element.appendChild(child2);
                document.body.appendChild(element);
                let content1: string = "<div id='content1'></div>";
                let content2: string = "<div id='content2'></div>";
                splitterObj = new Splitter({
                    width: '300px', 
                    height: '500px',
                    paneSettings: [
                        { content: content1 },
                        { max: '40px', content: content2 }
                    ]
                });
                splitterObj.appendTo(document.getElementById('default'));
            });
            afterAll((): void => {
                document.body.innerHTML = '';
            });
    
            it('Checked pane size API ', () => {

               splitterObj.paneSettings[0].size = '100px';
               splitterObj.dataBind();
               expect(splitterObj.element.querySelectorAll('.e-pane')[0].style.flexBasis==="100px").toBe(true);
            });
        });

    });


