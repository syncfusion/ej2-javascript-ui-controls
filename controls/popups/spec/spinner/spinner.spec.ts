/**
 * spinner spec document
 */

import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner, setSpinner } from '../../src/spinner/spinner';
import '../../node_modules/es6-promise/dist/es6-promise';

describe('Spinner Control', () => {
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    let target: HTMLElement;
    let target_01: HTMLElement;
    let target_02: HTMLElement;
    describe('create simple spinner', () => {
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target);
        });
        afterEach((): void => {
            target.remove();
        });
        it('Ensure element structure and class testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let materialObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(materialObj.classList.contains('e-spin-material')).toEqual(true);
            expect((<HTMLElement>materialObj.childNodes[0]).classList.contains('e-path-circle')).toEqual(true);
        });
        it('Ensure element structure and class testing with optional args', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading..."
            }, createElement);
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let materialObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(materialObj.classList.contains('e-spin-material')).toEqual(true);
            expect((<HTMLElement>materialObj.childNodes[0]).classList.contains('e-path-circle')).toEqual(true);
        });
        it('Ensure high contrast theme element structure and class testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'), 
                    width: 50,
                    label:"Loading...",
                    type: 'HighContrast'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let highContrastObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(highContrastObj.classList.contains('e-spin-high-contrast')).toEqual(true);
            expect((<HTMLElement>highContrastObj.childNodes[0]).classList.contains('e-path-circle')).toEqual(true);
            expect((<HTMLElement>highContrastObj.childNodes[1]).classList.contains('e-path-arc')).toEqual(true);
            expect((<HTMLElement>innerObject.childNodes[1]).classList.contains('e-spin-label')).toEqual(true);
        });
        it('Ensure fabric theme element structure and class testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'), 
                    width: 50,
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let fabricObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(fabricObj.classList.contains('e-spin-fabric')).toEqual(true);
            expect((<HTMLElement>fabricObj.childNodes[0]).classList.contains('e-path-circle')).toEqual(true);
            expect((<HTMLElement>fabricObj.childNodes[1]).classList.contains('e-path-arc')).toEqual(true);
            expect((<HTMLElement>innerObject.childNodes[1]).classList.contains('e-spin-label')).toEqual(true);
        });
         it('Ensure bootstrap theme element structure and class testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let bootObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(bootObj.classList.contains('e-spin-bootstrap')).toEqual(true);
            expect((bootObj.childNodes.length)).toEqual(8);
            expect((<HTMLElement>innerObject.childNodes[1]).classList.contains('e-spin-label')).toEqual(true);
            hideSpinner(container);
        });
        it('Ensure material theme element structure and class testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading...",
                    type: 'Material'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spinner-pane')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let materialObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(materialObj.classList.contains('e-spin-material')).toEqual(true);
            expect((<HTMLElement>materialObj.childNodes[0]).classList.contains('e-path-circle')).toEqual(true);
        });
        it('Spinner width testing for material', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.height).toEqual("50px");
        });
         it('Spinner width testing for fabric', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.height).toEqual("50px");
        });
        it('Spinner width testing for bootstrap', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.height).toEqual("50px");
        });
        it('Spinner width testing for high contrast', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width:50,
                    label:"Loading...",
                    type: 'HighContrast'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.height).toEqual("50px");
        });
        it('Spinner width in pixel value testing for material', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: '50px',
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.height).toEqual("50px");
        });

        it('Spinner width in pixel value testing for fabric', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: '50px',  
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.height).toEqual("50px");
        });

        it('Spinner width in pixel value testing for bootstrap', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: '50px',
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.height).toEqual("50px");
        });

        it('Spinner without width value testing for material', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),    
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.width).toEqual("30px");
            expect((container.querySelector('.e-spin-material') as HTMLElement).style.height).toEqual("30px");
        });

        it('Spinner width in pixel value testing for high contrast', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: '50px',  
                    label:"Loading...",
                    type: 'HighContrast'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.width).toEqual("50px");
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.height).toEqual("50px");
        });

        it('Spinner without width value testing for fabric', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.width).toEqual("30px");
            expect((container.querySelector('.e-spin-fabric') as HTMLElement).style.height).toEqual("30px");
        });

        it('Spinner without width value testing for Bootstrap', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),               
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.width).toEqual("30px");
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement).style.height).toEqual("30px");
        });

        it('Spinner without width value testing for high contrast', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    label:"Loading...",
                    type: 'HighContrast'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.width).toEqual("30px");
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement).style.height).toEqual("30px");
        });

        it('Spinner without label testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50               
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-label') as HTMLElement)).toEqual(null);
        });
        it('Spinner label testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spin-label') as HTMLElement).innerHTML).toEqual("Loading...");
        });
        it('Spinner cssClass testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading...",
                    cssClass: 'e-custom-spinner'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-custom-spinner')).toEqual(true);
        });
        it('Spinner on the left side of the target', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading...",
                    cssClass: 'e-spin-left'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis.left).toEqual(9);
        });
        it('Spinner on the right side of the target', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading...",
                    cssClass: 'e-spin-right'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis.right).toEqual(409);
        });
        it('Add overlay to the spinner', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading...",
                    cssClass: 'e-spin-overlay'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-overlay')).toEqual(true);
        });
        it('Spinner rendered with template content', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading...",
                    template: '<h4> Template Content </h4> <span class="custom-spinner"></span>'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect(container.querySelector('.custom-spinner')).not.toBeNull();
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
        });
    });

    describe('Spinner public methods', () => {
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target);
            target_01 = createElement('div', { id: 'spinner-02', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_01);
        });
        afterEach((): void => {
            target.remove();
            target_01.remove();
            setSpinner({ template: null, cssClass: null });
        });
        it('Ensure show and hide spinner testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading..."
            });
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-show')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-show')).toEqual(true);
            hideSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-hide')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-hide')).toEqual(false);
            showSpinner(container);
        });
        it('Ensure set spinner testing', () => {
            let template = '<h4> Template Content </h4> <span class="custom-spinner"></span>';
            setSpinner({ template: template, cssClass: 'e-spin-custom' });
            let spinObject = createSpinner({
                target: document.getElementById('spinner-01'),
                width: 50,
                label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({
                target: document.getElementById('spinner-02'),  
                width: 50,
                label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect(container.querySelector('.custom-spinner')).not.toBeNull();
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
            expect(container1.querySelector('.custom-spinner')).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let template = '<h4> Template Content </h4> <span class="custom-spinner"></span>';
            setSpinner({ template: template, cssClass: 'e-spin-custom'});
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),      
                    width: 50,
                    label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(false);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).not.toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.custom-spinner')).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let template = '<h4> Template Content </h4> <span class="custom-spinner"></span>';
            setSpinner({template: template, cssClass: 'e-spin-custom'});
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({ type: 'Fabric'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(false);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.custom-spinner')).toBeNull();
            expect(((container.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect(((container.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.custom-spinner')).not.toBeNull();
            expect(((container1.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect(((container1.querySelector('.e-spinner-pane') as HTMLElement).querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing for material to fabirc', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,   
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Fabric'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
        });

        it('Ensure set spinner testing for material to fabirc with one spinner in hidden state', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,   
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            hideSpinner(container);
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Fabric'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
        });

        it('Ensure set spinner testing for fabirc to material', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50, 
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Material'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).not.toBeNull();
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing for material to bootstrap', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Bootstrap'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-bootstrap') as HTMLElement)).not.toBeNull();
        });

        it('Ensure set spinner testing for material to bootstrap', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Fabric'
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Bootstrap'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-bootstrap') as HTMLElement)).not.toBeNull();
        });

        it('Ensure set spinner testing for bootstrap to material', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Material'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-material') as HTMLElement)).not.toBeNull();
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-bootstrap') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing for bootstrap to fabric', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,  
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50,              
                    label:"Loading...",
                    type: 'Bootstrap'
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom',type: 'Fabric'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
            expect((container.querySelector('.e-spin-bootstrap') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-fabric') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-bootstrap') as HTMLElement)).toBeNull();
        });

        it('Ensure set spinner testing for material to high contrast', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading...",
                    type: 'Material'
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 50, 
                    label:"Loading...",
                    type: 'Material'
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            setSpinner({cssClass: 'e-spin-custom', type: 'HighContrast'});
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-custom')).toEqual(true);
            expect((container.querySelector('.e-spin-high-contrast') as HTMLElement)).not.toBeNull();
            expect((container.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
            expect((container1.querySelector('.e-spin-high-contrast') as HTMLElement)).not.toBeNull();
            expect((container1.querySelector('.e-spin-material') as HTMLElement)).toBeNull();
        });

        it('Ensure show and hide spinner testing', (done: Function) => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 50,
                    label:"Loading..."
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            setTimeout(() => { done(); }, 2000);
        });
    });

    describe('Spinner with different sizes', () => {
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target);
            target_01 = createElement('div', { id: 'spinner-02', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_01);
            target_02 = createElement('div', { id: 'spinner-03', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_02);
        });
        afterEach((): void => {
            target.remove();
            target_01.remove();
            target_02.remove();
        });
        it('Ensure spinner on left', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 12,                    
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect();
            expect(axis.left).toEqual(9);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                    width: 24,                
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis1 = (<HTMLElement>container1.childNodes[0]).getBoundingClientRect()
            expect(axis1.left).toEqual(9);
            let spinObject_02 = createSpinner({
                target: document.getElementById('spinner-03'),
                
                    width: 36,
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container2 = document.getElementById('spinner-03');
            showSpinner(container2);
            expect((container2.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis2 = (<HTMLElement>(container2.querySelector('.e-spinner-pane') as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis2.left).toEqual(9);
        });

        it('Ensure spinner on right', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 12,
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect();
            expect(axis.right).toEqual(409);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 24,   
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis1 = (<HTMLElement>container1.childNodes[0]).getBoundingClientRect()
            expect(axis1.right).toEqual(409);
            let spinObject_02 = createSpinner({
                target: document.getElementById('spinner-03'),
                
                    width: 36,
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container2 = document.getElementById('spinner-03');
            showSpinner(container2);
            expect((container2.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis2 = (<HTMLElement>(container2.querySelector('.e-spinner-pane') as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis2.right).toEqual(409);
        });
    });

    describe('Spinner with different target sizes', () => {
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 300px;height: 300px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target);
            target_01 = createElement('div', { id: 'spinner-02', className: 'spinner-demo', styles: 'width: 300px;height: 300px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_01);
            target_02 = createElement('div', { id: 'spinner-03', className: 'spinner-demo', styles: 'width: 300px;height: 300px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_02);
        });
        afterEach((): void => {
            target.remove();
            target_01.remove();
            target_02.remove();
        });
        it('Ensure spinner on left', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 12,
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect();
            expect(axis.left).toEqual(9);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 24,
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis1 = (<HTMLElement>container1.childNodes[0]).getBoundingClientRect()
            expect(axis1.left).toEqual(9);
            let spinObject_02 = createSpinner({ 
                target: document.getElementById('spinner-03'),
                
                    width: 36,
                    label:"Loading...",
                    cssClass: "e-spin-left"
            });
            let container2 = document.getElementById('spinner-03');
            showSpinner(container2);
            expect((container2.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-left')).toEqual(true);
            let axis2 = (<HTMLElement>(container2.querySelector('.e-spinner-pane') as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis2.left).toEqual(9);
        });

        it('Ensure spinner on right', () => {
            let spinObject = createSpinner({ 
                target: document.getElementById('spinner-01'),
                
                    width: 12,
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container = document.getElementById('spinner-01');
            showSpinner(container);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]).getBoundingClientRect();
            expect(axis.right).toEqual(309);
            let spinObject_01 = createSpinner({ 
                target: document.getElementById('spinner-02'),
                
                    width: 24,
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container1 = document.getElementById('spinner-02');
            showSpinner(container1);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis1 = (<HTMLElement>container1.childNodes[0]).getBoundingClientRect()
            expect(axis1.right).toEqual(309);
            let spinObject_02 = createSpinner({ 
                target: document.getElementById('spinner-03'),
                    width: 36,
                    label:"Loading...",
                    cssClass: "e-spin-right"
            });
            let container2 = document.getElementById('spinner-03');
            showSpinner(container2);
            expect((container2.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-right')).toEqual(true);
            let axis2 = (<HTMLElement>(container2.querySelector('.e-spinner-pane') as HTMLElement).childNodes[0]).getBoundingClientRect()
            expect(axis2.right).toEqual(309);
        });
    });
    describe('create spinner with virtual', () => {
        let target: HTMLElement;
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
        });
        afterEach((): void => {
            target.remove();
        });
        it('Virtual Spinner Testing without appending DOM', () => {
            let spinObject = createSpinner({ 
                target: target,
                    width: 50,
            });
            let container = target;
            showSpinner(container);
            let spinWrap: HTMLElement = (container.querySelector('.e-spinner-pane')as HTMLElement);
            expect(spinWrap.classList.contains('e-spin-hide')).toEqual(true);
            let innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            expect(innerObject.classList.contains('e-spinner-inner')).toEqual(true);
            let materialObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(isNullOrUndefined(materialObj)).toEqual(true);
            spinWrap.classList.remove('e-spin-hide');
            hideSpinner(container);
            innerObject = (<HTMLElement>(container.querySelector('.e-spinner-pane')as HTMLElement).childNodes[0]);
            materialObj = (<HTMLElement>innerObject.childNodes[0]);
            expect(isNullOrUndefined(materialObj)).toEqual(true);
        });
    });
});