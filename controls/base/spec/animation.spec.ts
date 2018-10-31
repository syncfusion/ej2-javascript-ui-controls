import { createElement, select } from '../src/dom';
import { EventHandler } from '../src/event-handler';
import { Browser } from '../src/browser';
import { Animation, AnimationOptions, enableRipple, rippleEffect } from '../src/animation';

/**
 * Animation specification
 */
let edgeUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';
let animeObj: Animation = new Animation({});
let modifiedObj: Animation = new Animation({
    name: 'FadeOut', duration: 100, timingFunction: 'easeIn', delay: 1
});
let element1: HTMLElement = createElement('div', { id: 'anime1' });
let element2: HTMLElement = createElement('div', { id: 'anime2' });

//Cover onPropertyChanged function
animeObj.onPropertyChanged({}, {});

describe('Animation # ', () => {
    it('initialize animation object # ', () => {
        expect(animeObj instanceof Animation).toEqual(true);
    });

    it('check default name # ', () => {
        expect(animeObj.name).toEqual('FadeIn');
    });

    it('check default duration # ', () => {
        expect(animeObj.duration).toEqual(400);
    });

    it('check default timingFunction # ', () => {
        expect(animeObj.timingFunction).toEqual('ease');
    });

    it('check default timingFunction value # ', () => {
        expect(animeObj.easing[animeObj.timingFunction]).toEqual('cubic-bezier(0.250, 0.100, 0.250, 1.000)');
    });

    it('check default delay # ', () => {
        expect(animeObj.delay).toEqual(0);
    });

    it('check modified name # ', () => {
        expect(modifiedObj.name).toEqual('FadeOut');
    });

    it('check modified duration # ', () => {
        expect(modifiedObj.duration).toEqual(100);
    });

    it('check modified timingFunction # ', () => {
        expect(modifiedObj.timingFunction).toEqual('easeIn');
    });

    it('check modified delay # ', () => {
        expect(modifiedObj.delay).toEqual(1);
    });

    it('check modified animation options with default animation options # ', () => {
        expect(modifiedObj).not.toEqual(animeObj);
    });

    it('check module name # ', () => {
        expect(animeObj.getModuleName()).toEqual('animation');
    });

    it('check notify property change # ', () => {
        modifiedObj.timingFunction = 'cubic-bezier(.29,0,.55,1)';
        expect(modifiedObj.timingFunction).toEqual('cubic-bezier(.29,0,.55,1)');
    });

    it('animate method without options # ', (done: Function) => {
        let animationObj: Animation = new Animation({});
        animationObj.end = (model: AnimationOptions) => {
            expect(model.element).toEqual(element1);
            done();
        };
        animationObj.animate(element1);
    });

    describe('animate method with id # ', () => {
        let animeOption: AnimationOptions = null;
        beforeEach((done: () => void) => {
            document.body.appendChild(element1);
            animeObj.animate('#anime1', {
                timingFunction: 'easeIn', end: (args: AnimationOptions): void => {
                    animeOption = args;
                    done();
                }
            });
        });

        it('testing callback option # ', () => {
            select('#anime1').remove();
            expect(animeOption).not.toBeNull();
        });
    });

    describe('animate method with element # ', () => {
        let animeOption: AnimationOptions = null;
        beforeEach((done: () => void) => {
            modifiedObj.animate(element1, {
                end: (args: AnimationOptions): void => {
                    animeOption = args;
                    done();
                }
            });
        });

        it('testing callback option # ', () => {
            expect(animeOption).not.toBeNull();
        });
    });

    describe('animate method with failure # ', () => {
        let error: AnimationOptions = null;
        beforeEach((done: () => void) => {
            let raf: (callback: FrameRequestCallback) => number = window.requestAnimationFrame;
            window.requestAnimationFrame = undefined;
            modifiedObj.animate(element2, {
                fail: (e: AnimationOptions): void => {
                    window.requestAnimationFrame = raf;
                    error = e;
                    done();
                }
            });
        });

        it('testing promise catch # ', () => {
            expect(error).not.toBeNull();
        });
    });

    describe('animate method with progress # ', () => {
        let animeOption: AnimationOptions = null;
        beforeEach((done: () => void) => {
            modifiedObj.animate(element2, {
                progress: (args: AnimationOptions): void => {
                    animeOption = args;
                    done();
                }
            });
        });

        it('expected animation object # ', () => {
            expect(animeOption).not.toBeNull();
        });
        afterAll(() => {
            modifiedObj.destroy();
        });
    });


    describe('EJ2-499: delay time is greater than duration time # ', () => {
        let animeOption: AnimationOptions = null;
        beforeEach((done: () => void) => {
            animeObj.animate(element1, {
                delay: 1000, duration: 100,
                progress: (args: AnimationOptions): void => {
                    if (args.timeStamp > args.duration / 2) {
                        animeOption = args;
                        done();
                    }
                }
            });
        });

        it('testing delay time is greater than duration time with animate method # ', () => {
            expect(animeOption).not.toBeNull();
        });
    });

    describe('EJ2-594: animation for svg elements in IE browser # ', () => {
        let animeAttr: string = null;
        let element: HTMLElement = createElement('div', { id: 'anime' });
        describe('testing e-animate attribute # ', () => {
            beforeEach((done: () => void) => {
                animeObj.animate(element, {
                    progress: (args: AnimationOptions): void => {
                        if (args.timeStamp > (args.delay + args.duration) / 2) {
                            animeAttr = args.element.getAttribute('e-animate');
                            done();
                        }
                    }
                });
            });

            it('progress event # ', () => {
                expect(animeAttr).toEqual('true');
            });
        });

        describe('testing e-animate attribute # ', () => {
            beforeEach((done: () => void) => {
                animeObj.animate(element1, {
                    end: (args: AnimationOptions): void => {
                        animeAttr = args.element.getAttribute('e-animate');
                        done();
                    }
                });
            });

            it('animation end # ', () => {
                expect(animeAttr).toEqual(null);
            });
        });

        describe('EJ2-940: animate method with begin and animation end on last frame # ', () => {
            let animeOption: AnimationOptions = null;
            beforeEach((done: () => void) => {
                modifiedObj.animate(element2, {
                    begin: (args: AnimationOptions): void => {
                        animeOption = args;
                        done();
                    }
                });
            });

            it('expected animation object # ', () => {
                expect(animeOption).not.toBeNull();
            });

            afterAll(() => {
                modifiedObj.destroy();
            });
        });
    });

    describe('stop animation at inprogress # ', () => {
        describe('with element # ', () => {
            let element: HTMLElement = createElement('div', { id: 'anime' });
            let animationId: string = null;
            beforeEach((done: () => void) => {
                animeObj.animate(element, {
                    progress: (args: AnimationOptions): void => {
                        animationId = args.element.getAttribute('e-animation-id');
                        Animation.stop(args.element);
                        done();
                    }
                });
            });

            it('expected animation id # ', () => {
                expect(animationId).not.toBeNull();
            });
        });

        describe('with model # ', () => {
            let element: HTMLElement = createElement('div', { id: 'anime' });
            let timeStamp: number = null;
            beforeEach((done: () => void) => {
                animeObj.animate(element, {
                    duration: 600,
                    progress: (args: AnimationOptions): void => {
                        if (args.timeStamp > 300) {
                            Animation.stop(args.element, args);
                        }
                    },
                    end: (args: AnimationOptions): void => {
                        timeStamp = args.timeStamp;
                        done();
                    }
                });
            });

            it('expected timestamp with less than actual duration # ', () => {
                expect(timeStamp < 400).toEqual(true);
            });
        });

        it('with out animate method # ', () => {
            let element: HTMLElement = createElement('div', {
                id: 'anime',
                attrs: { 'e-animate': 'true' }
            });
            Animation.stop(element);
            expect(element.getAttribute('e-animate')).toBeNull();
        });
    });
});

/* Improved RippleEffect method specs */
enableRipple(false);
let rippleEffectElement: HTMLElement = createElement('div', { id: 'ripple' });
let rippleEffectFn: Function = rippleEffect(rippleEffectElement);
describe('Ripple Effect # ', () => {
    describe('without enableRipple #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'ripple' });
        rippleEffect(rippleEffectElement);
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
        });
        it('test e-ripple attribute on ripple element', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).toEqual(null);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });

    });
    describe('enable Ripple value is False #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'ripple' });
        enableRipple(false);
        rippleEffect(rippleEffectElement);
        beforeAll(() => {


            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
        });
        it('test e-ripple attribute on ripple element', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).toEqual(null);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });
    });
    describe('enable Ripple value is True # ', () => {
        enableRipple(true);
        rippleEffect(rippleEffectElement);
        beforeEach(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseleave', { target: rippleEffectElement });
        });
        it('test  e-ripple attribute on selector element', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).not.toEqual(null);
        });
    });
    describe('enable Ripple value is False and selector is Vaild Selector #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(false);
        rippleEffect(rippleEffectElement, { selector: '.apply' });
        describe('check ripple effect on valid selector # ', () => {
            let apply: HTMLElement = <HTMLElement>document.getElementsByClassName('apply')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply.className.indexOf('e-ripple')).toEqual(-1);
                expect(apply.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is False and selector is In-Vaild Selector #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'ignore', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(false);
        rippleEffect(rippleEffectElement, { selector: '.apply' });
        describe('check ripple effect on invalid selector # ', () => {
            let ignore: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is True and selector is Vaild Selector #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement, );
        enableRipple(true);
        rippleEffect(rippleEffectElement, { selector: '.apply' });
        describe('check ripple effect on valid selector # ', () => {
            let apply: HTMLElement = <HTMLElement>document.getElementsByClassName('apply')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply });
                EventHandler.trigger(rippleEffectElement, 'mouseup', { target: apply });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply.className.indexOf('e-ripple')).not.toEqual(-1);
                expect(apply.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is True and selector is In-Vaild Selector #', () => {
        let rippleEffectElement1: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement1.appendChild(createElement('div', { className: 'ignore1', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement1);

        describe('check ripple effect on invalid selector # ', () => {

            let ignore1: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore1')[0];
            enableRipple(true);
            let rippleEffectFn1: Function = rippleEffect(rippleEffectElement1, { selector: '.apply' });
            beforeEach(() => {
                rippleEffectFn1();
                EventHandler.trigger(rippleEffectElement1, 'mousedown', { target: ignore1 });

            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore1.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore1.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement1);
        });

    });
    describe('enable Ripple value is False and selector is Vaild Selector  and Ripple flag True#', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(false);
        rippleEffect(rippleEffectElement, { selector: '.apply', rippleFlag: true });
        describe('check ripple effect on valid selector # ', () => {
            let apply: HTMLElement = <HTMLElement>document.getElementsByClassName('apply')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply });
                EventHandler.trigger(rippleEffectElement, 'mouseup', { target: apply });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply.className.indexOf('e-ripple')).not.toEqual(-1);
                expect(apply.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is False and selector is Vaild Selector  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply1', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(false);
        rippleEffect(rippleEffectElement, { selector: '.apply1', rippleFlag: false });
        describe('check ripple effect on valid selector # ', () => {
            let apply1: HTMLElement = <HTMLElement>document.getElementsByClassName('apply1')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply1 });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply1.className.indexOf('e-ripple')).toEqual(-1);
                expect(apply1.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
    });
    describe('enable Ripple value is False and selector is inVaild Selector  and Ripple flag true #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'ignore2', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(false);
        let rippleEffectFn1: Function = rippleEffect(rippleEffectElement, { selector: '.apply1', rippleFlag: true });
        describe('check ripple effect on invalid selector # ', () => {
            let ignore2: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore2')[0];
            beforeEach(() => {
                rippleEffectFn1();
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore2 });

            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore2.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore2.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is False and selector is inVaild Selector  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        document.body.appendChild(rippleEffectElement);
        rippleEffectElement.appendChild(createElement('div', { className: 'ignore3', styles: 'width: 100px; height: 100px;' }));
        enableRipple(false);
        rippleEffect(rippleEffectElement, { selector: '.apply', rippleFlag: false });
        describe('check ripple effect on invalid selector # ', () => {
            let ignore3: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore3')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore3 });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore3.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore3.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is true and selector is Vaild Selector  and Ripple flag True#', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(true);
        rippleEffect(rippleEffectElement, { selector: '.apply', rippleFlag: true });
        describe('check ripple effect on valid selector # ', () => {
            let apply: HTMLElement = <HTMLElement>document.getElementsByClassName('apply')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply });
                EventHandler.trigger(rippleEffectElement, 'mouseup', { target: apply });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply.className.indexOf('e-ripple')).not.toEqual(-1);
                expect(apply.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is true and selector is Vaild Selector  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'apply2', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(true);
        rippleEffect(rippleEffectElement, { selector: '.apply2', rippleFlag: false });
        describe('check ripple effect on valid selector # ', () => {
            let apply2: HTMLElement = <HTMLElement>document.getElementsByClassName('apply2')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: apply2 });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(apply2.className.indexOf('e-ripple')).toEqual(-1);
                expect(apply2.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is true and selector is inVaild Selector  and Ripple flag true #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'ignore6', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(true);
        let rippleEffectFn1: Function = rippleEffect(rippleEffectElement, { selector: '.apply', rippleFlag: true });
        describe('check ripple effect on invalid selector # ', () => {
            let ignore6: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore6')[0];
            beforeEach(() => {
                rippleEffectFn1();
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore6 });

            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore6.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore6.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is true and selector is inVaild Selector  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        rippleEffectElement.appendChild(createElement('div', { className: 'ignore5', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        enableRipple(true);
        rippleEffect(rippleEffectElement, { selector: '.apply', rippleFlag: false });
        describe('check ripple effect on invalid selector # ', () => {
            let ignore5: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore5')[0];
            beforeEach(() => {
                EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore5 });
            });
            it('test e-ripple attribute on selector element', () => {
                expect(ignore5.className.indexOf('e-ripple')).toEqual(-1);
                expect(ignore5.getElementsByClassName('e-ripple-element').length).toEqual(0);
            });
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });

    });
    describe('enable Ripple value is true and selector is Null  and Ripple flag true #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        enableRipple(true);
        rippleEffect(rippleEffectElement, { rippleFlag: true });
        beforeEach(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseleave', { target: rippleEffectElement });
        });
        it('test  e-ripple attribute on selector element ', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).not.toEqual(null);
        });
    });
    describe('enable Ripple value is false  and selector is Null  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        enableRipple(false);
        rippleEffect(rippleEffectElement, { rippleFlag: false });
        beforeEach(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
        });
        it('test  e-ripple attribute on selector element ', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).toEqual(null);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });
    });
    describe('enable Ripple value is false and selector is Null  and Ripple flag true #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        enableRipple(false);
        rippleEffect(rippleEffectElement, { rippleFlag: true });
        beforeEach(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseleave', { target: rippleEffectElement });
        });
        it('test  e-ripple attribute on selector element ', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).not.toEqual(null);
        });
    });
    describe('enable Ripple value is true  and selector is Null  and Ripple flag false #', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: '#ripple' });
        enableRipple(true);
        rippleEffect(rippleEffectElement, { rippleFlag: false });
        beforeEach(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
        });
        it('test  e-ripple attribute on selector element ', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).toEqual(null);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });
    });

    describe('check ripple animation # ', () => {
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
        });
        it('test e-ripple attribute on ripple element', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).not.toEqual(null);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
        });
    });

    describe('check ripple animation with multiple mousedown # ', () => {
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: rippleEffectElement });
        });
        it('test e-ripple attribute on ripple element', () => {
            expect(rippleEffectElement.getAttribute('data-ripple')).not.toEqual(null);
        });
    });

    describe('check ripple effect after destroy # ', () => {
        let rippleEffectElement1: HTMLElement = createElement('div');
        let rippleEffectFn1: Function = rippleEffect(rippleEffectElement1);
        beforeAll((done: () => void) => {
            EventHandler.trigger(rippleEffectElement1, 'mousedown', { target: rippleEffectElement1 });
            EventHandler.trigger(rippleEffectElement1, 'mouseup', { target: rippleEffectElement1 });
            setTimeout(() => {
                rippleEffectFn1();
                done();
            }, 500);
        });
        it('test e-ripple attribute on ripple element', () => {
            expect(rippleEffectElement1.getAttribute('data-ripple')).toEqual(null);
            expect(rippleEffectElement1.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });
    });

    describe('test ripple effect on edge browser', () => {
        let rippleEffectElement2: HTMLElement = createElement('div', { id: 'ripple' });
        let rippleEffectFn2: Function = rippleEffect(rippleEffectElement);
        let apply: HTMLElement = <HTMLElement>document.getElementsByClassName('ignore')[0];
        beforeAll(() => {
            Browser.userAgent = edgeUa;
            EventHandler.trigger(rippleEffectElement2, 'touchmove', { target: rippleEffectElement2 });
        });
        it('test e-ripple attribute on ripple element', (done: Function) => {
            setTimeout(() => {
                expect(rippleEffectElement2.className.indexOf('e-ripple')).toEqual(-1);
                expect(apply.getElementsByClassName('e-ripple-element').length).toEqual(0);
                done();
            }, 400);
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement2);
        });
    });

    describe('ripple effect with ignore option', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'rippleEffect' });
        let rippleEffectFn: Function = rippleEffect(rippleEffectElement, { ignore: '.ignoreEffect' });
        rippleEffectElement.appendChild(createElement('div', { className: 'ignoreEffect', styles: 'width: 100px; height: 100px;' }));
        document.body.appendChild(rippleEffectElement);
        let ignore: HTMLElement = <HTMLElement>document.getElementsByClassName('ignoreEffect')[0];
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: ignore });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: ignore });
        });
        it('test ripple effect on ignoreed element', () => {
            expect(ignore.className.indexOf('e-ripple')).toEqual(-1);
            expect(ignore.getElementsByClassName('e-ripple-element').length).toEqual(0);
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });
    });

    describe('ripple effect with center ripple option', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'rippleEffect' });
        let rippleEffectFn: Function = rippleEffect(rippleEffectElement, { isCenterRipple: true });
        document.body.appendChild(rippleEffectElement);
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: rippleEffectElement });
        });
        it('test ripple effect on ignoreed element', () => {
            expect(rippleEffectElement.className.indexOf('e-ripple')).not.toEqual(-1);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });
    });

    describe('ripple effect with ripple duration option', () => {
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'rippleEffect' });
        let rippleEffectFn: Function = rippleEffect(rippleEffectElement, { duration: 100 });
        document.body.appendChild(rippleEffectElement);
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: rippleEffectElement });
        });
        it('test ripple effect on ignoreed element', () => {
            expect(rippleEffectElement.className.indexOf('e-ripple')).not.toEqual(-1);
            expect(rippleEffectElement.getElementsByClassName('e-ripple-element').length).not.toEqual(0);
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });
    });

    describe('ripple effect with ripple callback option', () => {
        let eventArgs: MouseEvent = null;
        let rippleEffectElement: HTMLElement = createElement('div', { id: 'rippleEffect' });
        rippleEffect(rippleEffectElement, { duration: 100 }, (e: MouseEvent) => {
            eventArgs = e;
        });
        document.body.appendChild(rippleEffectElement);
        beforeAll(() => {
            EventHandler.trigger(rippleEffectElement, 'mousedown', { target: rippleEffectElement });
            EventHandler.trigger(rippleEffectElement, 'mouseup', { target: rippleEffectElement });
        });
        it('test ripple effect on ignoreed element', (done) => {
            setTimeout(() => {
                expect(eventArgs).not.toEqual(null);
                done();
            }, 100);
        });
        afterAll(() => {
            document.body.removeChild(rippleEffectElement);
        });
    });

    afterAll(() => {
        document.body.removeChild(rippleEffectElement);
    });
});