/*** spec*/
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder;
let unSelect: ElementFinder = element(by.id('unSelect'));
let undo: ElementFinder = element(by.id('undo'));
let redo: ElementFinder = element(by.id('redo'));
describe('Diagram Control', () => {
    describe('Decorator - Straight', () => {
        it('Decorator - rendering', () => {
            browser.load('/demos/connectors/decorator.html');
            browser.compareScreen(element(By.id('diagram')), 'Decorator');
        });
        it('Change Source decortor shape changing', () => {
            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });

            let selectObject: ElementFinder = element(by.id('decoratorShapes'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Straight-source-decorator-shape');
        });
        it('Change Source decortor - fill', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });

            let selectObject: ElementFinder = element(by.id('fillColor'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Straight-source-decorator-fill');
        });

    });

    describe('Decorator - Orthogonal', () => {
        it('Change Source decortor shape changing', () => {
            browser.load('/demos/connectors/decorator.html');

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });

            let selectObject: ElementFinder = element(by.id('decoratorShapes'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[8].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Orthogonal-source-decorator-shape');
        });

        it('Change Source decortor - stroke', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });

            let color: ElementFinder = element(by.id('strokeColorRadio'));
            color.click();

            let selectObject: ElementFinder = element(by.id('fillColor'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Orthogonal-source-decorator-stroke');
        });
        it('Change Source decortor - width', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });

            let selectObject: ElementFinder = element(by.id('widthHeight'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Orthogonal-source-decorator-width');
        });
        it('Change Source decortor - height', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });

            let height: ElementFinder = element(by.id('heightRadio'));
            height.click();

            let selectObject: ElementFinder = element(by.id('widthHeight'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Orthogonal-source-decorator-height');
        });

    });

    describe('Decorator - Bezier', () => {
        it('Change Source decortor shape changing', () => {
            browser.load('/demos/connectors/decorator.html');

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            let selectObject: ElementFinder = element(by.id('decoratorShapes'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[9].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Bezier-source-decorator-shape');
        });
        it('Change Source decortor - strokeWidth', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            let selectObject: ElementFinder = element(by.id('strokeWidth'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Bezier-source-decorator-strokeWidth');
        });
        it('Change Source decortor - Stroke Dash Array', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            let selectObject: ElementFinder = element(by.id('strokeDashArray'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Bezier-source-decorator-strokeDashArray');
        });
        it('Change Source decortor - Opacity', () => {

            let connectors: ElementFinder = element(by.id('selectionOption'));
            connectors.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            let selectObject: ElementFinder = element(by.id('opacity'));
            selectObject.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            unSelect.click();
            browser.compareScreen(element(By.id('diagram')), 'Bezier-source-decorator-opacity');
        });
    });

});