import { createElement, EventHandler, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { LabelPosition, PrecisionType, Rating, RatingChangedEventArgs, RatingHoverEventArgs, RatingItemEventArgs } from "../src/rating/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";

describe('Rating', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    describe('DOM', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
        });

        it('Default rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.classList.contains('e-rating')).toEqual(true);
            expect(ratingElement.getAttribute('aria-label')).toBe("rating");
            expect(ratingElement.parentElement.classList.contains('.e-rating-container') != null).toEqual(true);
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list') != null).toEqual(true);
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').getAttribute('tabindex')).toBe('0');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item-container').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-icon').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Get component name testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(rating.getModuleName()).toEqual('rating');
        });

        it('Rating testing with Persistence', () => {
            rating = new Rating({
                enablePersistence: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.classList.contains('e-rating')).toEqual(true);
            expect(ratingElement.parentElement.classList.contains('.e-rating-container') != null).toEqual(true);
        });

        it('Generic input Element ID generation', () => {
            rating = new Rating();
            let ratingEle1 = createElement('input', {});
            document.body.appendChild(ratingEle1);
            rating.appendTo(ratingEle1);
            expect(ratingEle1.getAttribute('id') != ratingElement.getAttribute('id')).toEqual(true);
            expect(isNullOrUndefined(ratingEle1.id)).toBe(false);
            rating.destroy();
            rating = undefined;
            remove(ratingEle1);
        });

        it('Generic input Element Name generation', () => {
            rating = new Rating();
            let ratingEle1 = createElement('input', { attrs: { 'name': 'rating1' } });
            document.body.appendChild(ratingEle1);
            rating.appendTo(ratingEle1);
            expect(ratingEle1.getAttribute('name') != ratingElement.getAttribute('id')).toEqual(true);
            expect(ratingEle1.getAttribute('name')).toBe('rating1');
            expect(isNullOrUndefined(ratingEle1.getAttribute('name'))).toBe(false);
            rating.destroy();
            rating = undefined;
            remove(ratingEle1);
        });

        it('Item count(6) rating testing', () => {
            rating = new Rating({
                itemsCount: 6
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item-container').length).toBe(6);
        });

        it('Value rating testing', () => {
            rating = new Rating({
                value: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
        });

        it('value > itemsCount rating testing', () => {
            rating = new Rating({
                value: 6
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
        });

        it('Minimum value rating testing', () => {
            rating = new Rating({
                min: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
        });

        it('Show Label rating testing', () => {
            rating = new Rating({
                showLabel: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label') != null).toEqual(true);
        });

        it('Minimum value is greater than Value rating testing', () => {
            rating = new Rating({
                min: 2,
                value: 1
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
        });

        it('Minimum value is less than 0 rating testing', () => {
            rating = new Rating({
                min: -1
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Dynamic Value rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            rating.value = 4;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
        });

        it('Dynamic Minimum value rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            rating.min = 3;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            rating.value = 2;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
        });

        it('Dynamic Item count with value(4) rating testing', () => {
            rating = new Rating({
                value: 4
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item-container').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            rating.itemsCount = 6;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item-container').length).toBe(6);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
        });

        it('Making Show Label Dynamically False rating testing', () => {
            rating = new Rating({
                showLabel: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label') != null).toEqual(true);
            rating.showLabel = false;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label') != null).toEqual(false);
        });
    });

    describe('DOM Properties', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
        });

        it('Disabled', () => {
            rating = new Rating({
                disabled: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList.contains('e-disabled')).toEqual(true);
            rating.disabled = false;
            rating.dataBind();
            expect(ratingElement.parentElement.classList.contains('e-disabled')).toEqual(false);

        });

        it('Visible', () => {
            rating = new Rating({
                visible: false
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList.contains('e-rating-hidden')).toEqual(true);
            rating.visible = true;
            rating.dataBind();
            expect(ratingElement.parentElement.classList.contains('e-rating-hidden')).toEqual(false);

        });

        it('Read Only', () => {
            rating = new Rating({
                readOnly: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList.contains('e-rating-readonly')).toEqual(true);
            rating.readOnly = false;
            rating.dataBind();
            expect(ratingElement.parentElement.classList.contains('e-rating-readonly')).toEqual(false);

        });

        it('RTL', () => {
            rating = new Rating({
                enableRtl: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList.contains('e-rtl')).toEqual(true);
            rating.enableRtl = false;
            rating.dataBind();
            expect(ratingElement.parentElement.classList.contains('e-rtl')).toEqual(false);

        });

        it('Reset ', () => {
            rating = new Rating({
                allowReset: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-reset') != null).toEqual(true);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
            rating.allowReset = false;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-reset') != null).toEqual(false);
        });

        it('cssClass', () => {
            rating = new Rating({
                cssClass: 'testClass'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList).toContain('testClass');
            rating.cssClass = 'newClass';
            rating.dataBind();
            expect(ratingElement.parentElement.classList).toContain('newClass');
            expect(ratingElement.parentElement.classList.contains("testClass")).toBe(false);
        });

        it('Label Position', () => {
            rating = new Rating({
                showLabel: true,
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-right');
            rating.labelPosition = 'Bottom';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-bottom');
            rating.labelPosition = 'Left';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-left');
            rating.labelPosition = 'Top';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-top');
        });

        it('Label Position using LabelPosition Enum', () => {
            rating = new Rating({
                showLabel: true,
                labelPosition: LabelPosition.Left
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-left');
            rating.labelPosition = LabelPosition.Right;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-right');
            rating.labelPosition = LabelPosition.Bottom;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-bottom');
            rating.labelPosition = LabelPosition.Top;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').classList).toContain('e-label-top');
        });

        it('Single Selection with value ', () => {
            rating = new Rating({
                enableSingleSelection: true,
                value: 3
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            rating.enableSingleSelection = false;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            rating.enableSingleSelection = true;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
        });

        it('Single Selection with precision ', () => {
            rating = new Rating({
                enableSingleSelection: true,
                value: 3
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            rating.precision = PrecisionType.Half;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            rating.precision = PrecisionType.Full;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            rating.precision = PrecisionType.Quarter;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            rating.precision = PrecisionType.Full;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            rating.precision = PrecisionType.Exact;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            rating.precision = PrecisionType.Full;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
        });

        it('Enable Animation ', () => {
            rating = new Rating({
                enableAnimation: false
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.classList.contains('e-rating-animation')).toBe(false);
            rating.enableAnimation = true;
            rating.dataBind();
            expect(ratingElement.parentElement.classList).toContain('e-rating-animation');
        });

        it('Custom Label template', () => {
            rating = new Rating({
                showLabel: true,
                labelTemplate: '<span>testTemplate</span>'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label') != null).toEqual(true);
            expect(ratingElement.parentElement.querySelector('.e-rating-label').innerHTML).toEqual('<span>testTemplate</span>');
            rating.labelTemplate = '';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label') != null).toEqual(true);
            expect(ratingElement.parentElement.querySelector('.e-rating-label').innerHTML).toEqual('0 / 5');
            rating.labelTemplate = '<span>testTemplate</span>';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-label').innerHTML).toEqual('<span>testTemplate</span>');
        });

        it('Label Template as js renderer ', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            let renderer = createElement("script", { id: "labelTemp", innerHTML: template });
            renderer.setAttribute("type", "text/x-jsrender");
            document.body.appendChild(renderer);
            rating = new Rating({
                showLabel: true,
                labelTemplate: '#labelTemp'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-label').firstElementChild.classList).toContain('tempContent');
            template = null;
            remove(renderer);
        });

        it('Item list Aria', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.getAttribute('value')).toBe('0');
            let itemList = ratingElement.parentElement.querySelector('.e-rating-item-list');
            expect(itemList.getAttribute('aria-valuemax')).toBe('5');
            expect(itemList.getAttribute('aria-valuemin')).toBe('0');
            expect(itemList.getAttribute('aria-valuenow')).toBe('0');
            rating.itemsCount = 6;
            rating.value = 3;
            rating.min = 2;
            rating.dataBind();
            expect(ratingElement.getAttribute('value')).toBe('3');
            expect(itemList.getAttribute('aria-valuemax')).toBe('6');
            expect(itemList.getAttribute('aria-valuemin')).toBe('2');
            expect(itemList.getAttribute('aria-valuenow')).toBe('3');
        });
    });

    describe('Rating Precision', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
        });

        it('Full Precision with Value(3.4)', () => {
            rating = new Rating({
                value: 3.4
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            expect(rating.value).toBe(3);
        });

        it('Full Precision with Value(3.6)', () => {
            rating = new Rating({
                value: 3.6
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            expect(rating.value).toBe(4);
        });

        it('Half Precision with Value(3.4)', () => {
            rating = new Rating({
                value: 3.4,
                precision: PrecisionType.Half
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
            expect(rating.value).toBe(3.5);
        });

        it('Half Precision with Value(3.2)', () => {
            rating = new Rating({
                value: 3.2,
                precision: 'Half'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            expect(rating.value).toBe(3);
        });

        it('Quarter Precision with Value(3.1)', () => {
            rating = new Rating({
                value: 3.1,
                precision: PrecisionType.Quarter
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            expect(rating.value).toBe(3);
        });

        it('Quarter Precision with Value(3.2)', () => {
            rating = new Rating({
                value: 3.2,
                precision: 'Quarter'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
            expect(rating.value).toBe(3.25);
        });

        it('Exact Precision with Value(3.04)', () => {
            rating = new Rating({
                value: 3.04,
                precision: PrecisionType.Exact
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            expect(rating.value).toBe(3);
        });

        it('Exact Precision with Value(3.05)', () => {
            rating = new Rating({
                value: 3.05,
                precision: 'Exact'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
            expect(rating.value).toBe(3.1);
        });

        describe('Dynamic Precision', () => {
            it('Half to Full Precision', () => {
                rating = new Rating({
                    value: 3.5,
                    precision: PrecisionType.Half
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Full;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                expect(rating.value).toBe(4);
                rating.value = 3.9;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                expect(rating.value).toBe(4);
            });

            it('Quarter to Full Precision', () => {
                rating = new Rating({
                    value: 3.75,
                    precision: PrecisionType.Quarter
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Full;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                expect(rating.value).toBe(4);
            });

            it('Exact to Full Precision', () => {
                rating = new Rating({
                    value: 3.4,
                    precision: PrecisionType.Exact
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Full;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                expect(rating.value).toBe(3);
            });

            it('Quarter to Half Precision', () => {
                rating = new Rating({
                    value: 3.25,
                    precision: PrecisionType.Quarter
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Half;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                expect(rating.value).toBe(3.5);
            });

            it('Exact to Half Precision', () => {
                rating = new Rating({
                    value: 3.4,
                    precision: PrecisionType.Exact
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Half;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                expect(rating.value).toBe(3.5);
            });

            it('Exact to Quarter Precision', () => {
                rating = new Rating({
                    value: 3.3,
                    precision: PrecisionType.Exact
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                rating.precision = PrecisionType.Quarter;
                rating.dataBind();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                expect(rating.value).toBe(3.25);
            });
        });
    });

    describe('Mouse Events', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;
        let mouseEventArs: any;
        // let originalTimeout: any;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
            mouseEventArs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                offset: Number
            };
            // originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('Click event rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], "mousemove", mouseEventArs);
            EventHandler.trigger(liElementArray[2], "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
        });

        it('Click event with Minimum value rating testing', () => {
            rating = new Rating({
                min: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[0];
            EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
            EventHandler.trigger(liElementArray[0], "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
        });

        it('Click event with Minimum value and reset rating testing', () => {
            rating = new Rating({
                min: 2,
                allowReset: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[0];
            EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
            EventHandler.trigger(liElementArray[0], "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], "mousemove", mouseEventArs);
            EventHandler.trigger(liElementArray[2], "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
        });


        it('Mouse Move and Leave rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], "mousemove", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], "mousemove", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], 'mouseleave', mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Mouse Move and Leave with Minimum value rating testing', () => {
            rating = new Rating({
                min: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[0];
            EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            mouseEventArs.target = liElementArray[0];
            EventHandler.trigger(liElementArray[0], 'mouseleave', mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
        });

        it('Reset Click event with Value rating testing', () => {
            rating = new Rating({
                allowReset: true,
                value: 3
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            let resetElement: HTMLElement = ratingElement.parentElement.querySelector('.e-reset');
            mouseEventArs.target = ratingElement.parentElement.querySelector('.e-reset');
            EventHandler.trigger(resetElement, "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
            rating.value = 3;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
        });

        it('Reset Click event with Value & Min value rating testing', () => {
            rating = new Rating({
                allowReset: true,
                value: 3,
                min: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
            let resetElement: HTMLElement = ratingElement.parentElement.querySelector('.e-reset');
            mouseEventArs.target = ratingElement.parentElement.querySelector('.e-reset');
            EventHandler.trigger(resetElement, "click", mouseEventArs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
        });

        it('Tooltip with default template', () => {
            rating = new Rating({
                showTooltip: false
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').classList.contains('e-tooltip')).toBe(false);
            expect(document.body.querySelector('.e-tooltip-wrap') == null).toEqual(true);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            rating.showTooltip = true;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').classList.contains('e-tooltip')).toBe(true);
            (rating as any).tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            (rating as any).tooltipObj.open(liElementArray[1]);
            expect(document.body.querySelector('.e-tooltip-wrap') != null).toEqual(true);
            expect(document.body.querySelector('.e-tip-content').innerHTML).toEqual('2');
            mouseEventArs.target = liElementArray[2];
            EventHandler.trigger(liElementArray[2], "mousemove");
            (rating as any).tooltipObj.open(liElementArray[2]);
            expect(document.body.querySelector('.e-tip-content').innerHTML).toEqual('3');
            rating.showTooltip = false;
            rating.dataBind();
            expect(document.body.querySelector('.e-tooltip-wrap') == null).toEqual(true);
        });

        it('Tooltip with template', () => {
            rating = new Rating({
                tooltipTemplate: '<span>testTemplate</span>'
            });
            rating.appendTo('#rating');
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            rating.showTooltip = true;
            rating.dataBind();
            (rating as any).tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').classList.contains('e-tooltip')).toBe(true);
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            (rating as any).tooltipObj.open(liElementArray[1]);
            expect(document.body.querySelector('.e-tip-content').innerHTML).toEqual('<span>testTemplate</span>');
        });

        it('Single Selection ', () => {
            rating = new Rating({
                enableSingleSelection: true,
            });
            rating.appendTo('#rating');
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mouseleave");
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Empty template', () => {
            rating = new Rating({
                emptyTemplate: '<span class="emptyTemplate"></span>'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.emptyTemplate').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-empty').length).toBe(5);
            rating.emptyTemplate = '';
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.emptyTemplate').length).toBe(0);
        });

        it('Full template', () => {
            rating = new Rating({
                value: 1,
                fullTemplate: '<span class="fullTemplate"></span>'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item').length).toBe(5);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-full').length).toBe(1);
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            expect(ratingElement.parentElement.querySelectorAll('.fullTemplate').length).toBe(2);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-full').length).toBe(2);
            rating.fullTemplate = '';
            rating.dataBind();
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            expect(ratingElement.parentElement.querySelectorAll('.fullTemplate').length).toBe(0);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-full').length).toBe(0);
        });

        it('Full and Empty template', () => {
            rating = new Rating({
                fullTemplate: '<span class="fullTemplate"></span>',
                emptyTemplate: '<span class="emptyTemplate"></span>'
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-item').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.emptyTemplate').length).toBe(5);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-empty').length).toBe(5);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            mouseEventArs.target = liElementArray[1];
            EventHandler.trigger(liElementArray[1], "mousemove");
            expect(ratingElement.parentElement.querySelectorAll('.fullTemplate').length).toBe(2);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-full').length).toBe(2);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-empty').length).toBe(3);
            expect(ratingElement.parentElement.querySelectorAll('.emptyTemplate').length).toBe(3);
            mouseEventArs.target = liElementArray[0];
            EventHandler.trigger(liElementArray[0], "mousemove");
            expect(ratingElement.parentElement.querySelectorAll('.fullTemplate').length).toBe(1);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-full').length).toBe(1);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-empty').length).toBe(4);
            expect(ratingElement.parentElement.querySelectorAll('.emptyTemplate').length).toBe(4);
        });

        describe('Rating Precision', () => {
            it('Half Precision', () => {
            // it('Half Precision', (done) => {
                rating = new Rating({
                    precision: PrecisionType.Half
                });
                rating.appendTo('#rating');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                // setTimeout(() => {
                    mouseEventArs.offsetX = 10;
                    EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                    // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                    // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                    mouseEventArs.offsetX = 21;
                    EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                    expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
                    expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                    // done();
                // }, 500);
            });

            it('Quarter Precision', () => {
                rating = new Rating({
                    precision: 'Quarter'
                });
                rating.appendTo('#rating');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                mouseEventArs.offsetX = 4;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                mouseEventArs.offsetX = 9;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                mouseEventArs.offsetX = 17;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                mouseEventArs.offsetX = 22;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            });

            it('Exact PrecisionType', () => {
                rating = new Rating({
                    precision: PrecisionType.Exact
                });
                rating.appendTo('#rating');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                mouseEventArs.offsetX = 2;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                mouseEventArs.offsetX = 8;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
            });

            it('Exact Precision with RTL', () => {
                rating = new Rating({
                    precision: 'Exact',
                    enableRtl: true
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.classList).toContain('e-rtl');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                mouseEventArs.offsetX = 2;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                mouseEventArs.offsetX = 8;
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
            });

        });

        describe('Methods and Events', () => {
            it('beforeItemRender Property', () => {
                let count: number = 0;
                rating = new Rating({
                    beforeItemRender: (e: RatingItemEventArgs) => {
                        count++;
                        expect(e.element.classList).toContain('e-rating-item-container');
                    }
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-item-container').length).toBe(5);
                expect(count).toBe(5);
            });

            it('onItemHover Property', () => {
                let isHovered = false;
                rating = new Rating({
                    onItemHover: (e: RatingHoverEventArgs) => {
                        isHovered = true;
                        expect(e.element.classList).toContain('e-rating-item-container');
                    }
                });
                rating.appendTo('#rating');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                mouseEventArs.target = liElementArray[0];
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
                expect(isHovered).toEqual(true);
            });

            it('valueChanged Property', () => {
                let isClicked = false;
                rating = new Rating({
                    valueChanged: (e: RatingChangedEventArgs) => {
                        isClicked = true;
                    }
                });
                rating.appendTo('#rating');
                let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
                mouseEventArs.target = liElementArray[0];
                EventHandler.trigger(liElementArray[0], "mousemove", mouseEventArs);
                EventHandler.trigger(liElementArray[0], "click", mouseEventArs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
                expect(isClicked).toEqual(true);
            });

            it('reset Method', () => {
                rating = new Rating({
                    allowReset: true,
                    value: 3,
                    min: 2
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
                expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
                rating.reset();
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
                expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
            });
        });
    });

    describe('Touch Events', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;
        let touchEvent: any;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
            touchEvent = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                touches: [{ clientX: Number }]
            };
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
        });

        it('Full Precision', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            let ulElement: any = ratingElement.parentElement.querySelector('.e-rating-item-list');
            touchEvent.touches[0].clientX = 30;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            touchEvent.touches[0].clientX = 180;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
        });

        it('Tooltip with default template', () => {
            rating = new Rating({
                showTooltip: false
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').classList.contains('e-tooltip')).toBe(false);
            expect(document.body.querySelector('.e-tooltip-wrap') == null).toEqual(true);
            let liElementArray: any = ratingElement.parentElement.querySelectorAll('.e-rating-item-container');
            rating.showTooltip = true;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').classList.contains('e-tooltip')).toBe(true);
            (rating as any).tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            let ulElement: any = ratingElement.parentElement.querySelector('.e-rating-item-list');
            touchEvent.touches[0].clientX = 30;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            (rating as any).tooltipObj.open(liElementArray[0]);
            expect(document.body.querySelector('.e-tooltip-wrap') != null).toEqual(true);
            EventHandler.trigger(ulElement, "touchend", touchEvent);
            (rating as any).tooltipObj.close();
            expect(document.body.querySelector('.e-tooltip-wrap') != null).toEqual(false);
        });

        it('Full Precision with value', () => {
            rating = new Rating({
                value: 2
            });
            rating.appendTo('#rating');
            let ulElement: any = ratingElement.parentElement.querySelector('.e-rating-item-list');
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            touchEvent.touches[0].clientX = 30;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
        });

        it('Full Precision with minimum value', () => {
            rating = new Rating({
                min: 2
            });
            rating.appendTo('#rating');
            let ulElement: any = ratingElement.parentElement.querySelector('.e-rating-item-list');
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            touchEvent.touches[0].clientX = 30;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
        });

        it('Full Precision with RTL', () => {
            rating = new Rating({
                enableRtl: true
            });
            rating.appendTo('#rating');
            let ulElement: any = ratingElement.parentElement.querySelector('.e-rating-item-list');
            touchEvent.touches[0].clientX = 120;
            EventHandler.trigger(ulElement, "touchmove", touchEvent);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            // expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
        });
    });

    describe('Keyboard Events', () => {
        let rating: Rating;
        let ratingElement: HTMLElement;
        let keyboardEventArgs: any;

        beforeEach(() => {
            ratingElement = createElement('input', { id: 'rating', styles: 'display: none' });
            document.body.appendChild(ratingElement);
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
            };
        });

        afterEach(() => {
            if (rating) {
                rating.destroy();
                rating = undefined;
            }
            remove(ratingElement);
        });

        it('Keyboard Combination event rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            keyboardEventArgs.action = 'downarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.action = 'rightarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            keyboardEventArgs.action = 'leftarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Keyboard event with disabled and reset button rating testing', () => {
            rating = new Rating({
                disabled: true,
                allowReset: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelector('.e-rating-item-list').getAttribute('tabindex')).toBe('-1');
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Keyboard Uparrow rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
        });

        it('Keyboard Rightarrow rating testing', () => {
            rating = new Rating();
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'rightarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
        });

        it('Keyboard Downarrow rating testing', () => {
            rating = new Rating({
                value: 5
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'downarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Keyboard Leftarrow rating testing', () => {
            rating = new Rating({
                value: 5
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'leftarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('RTL Keyboard Combination event rating testing', () => {
            rating = new Rating({
                enableRtl: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            keyboardEventArgs.action = 'downarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.action = 'leftarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            keyboardEventArgs.action = 'rightarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('RTL Keyboard Leftarrow rating testing', () => {
            rating = new Rating({
                enableRtl: true
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'leftarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
        });

        it('RTL Keyboard Rightarrow rating testing', () => {
            rating = new Rating({
                enableRtl: true,
                value: 5
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(5);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'rightarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(4);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
        });

        it('Reset Keyboard Space with Value rating testing', () => {
            rating = new Rating({
                allowReset: true,
                value: 3
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-reset');
            keyboardEventArgs.action = 'space';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
            rating.value = 3;
            rating.dataBind();
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
        });

        it('Reset Keyboard Space with Value & Min value rating testing', () => {
            rating = new Rating({
                allowReset: true,
                value: 3,
                min: 2
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(3);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-reset');
            keyboardEventArgs.action = 'space';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList).toContain('e-disabled');
        });

        it('Reset Keyboard Space with Value rating testing', () => {
            rating = new Rating({
                allowReset: true,
            });
            rating.appendTo('#rating');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(true);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'uparrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(2);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'downarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(false);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
            keyboardEventArgs.action = 'downarrow';
            (rating as any).keyActionHandler(keyboardEventArgs);
            expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
            expect(ratingElement.parentElement.querySelector('.e-reset').classList.contains('e-disabled')).toBe(true);
            expect(ratingElement.parentElement.querySelector('.e-reset').getAttribute('tabindex')).toBe('-1');
        });

        describe('- Rating Precision', function () {
            it('Half Precision', function () {
                rating = new Rating({
                    precision: PrecisionType.Half
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(1);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            });

            it('Quarter Precision', function () {
                rating = new Rating({
                    precision: PrecisionType.Quarter
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            });

            it('Exact Precision', function () {
                rating = new Rating({
                    precision: 'Exact'
                });
                rating.appendTo('#rating');
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
                keyboardEventArgs.target = ratingElement.parentElement.querySelector('.e-rating-item-list');
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'uparrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(1);
                keyboardEventArgs.action = 'downarrow';
                (rating as any).keyActionHandler(keyboardEventArgs);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-selected').length).toBe(0);
                expect(ratingElement.parentElement.querySelectorAll('.e-rating-intermediate').length).toBe(0);
            });
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
