import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder;
let addLabel: ElementFinder = element(by.id('addLabel'));
let removeLabel: ElementFinder = element(by.id('removeLabel'));
let MouseMove: ElementFinder = element(by.id('MouseMove'));
let unSelect: ElementFinder = element(by.id('unSelect'));
let undo: ElementFinder = element(by.id('undo'));
let redo: ElementFinder = element(by.id('redo'));
let selectVisiblity: ElementFinder = element(by.id('selectVisiblity'));
let Visible: ElementFinder = element(by.id('Visible'));
let Hidden: ElementFinder = element(by.id('Hidden'));
let Hover: ElementFinder = element(by.id('Hover'));
let Connect: ElementFinder = element(by.id('Connect'));
describe('Diagram Control', () => {
    describe('Port shapes and visibility', () => {
        it('Rendering', () => {
            browser.load('/demos/port/port.html');
            browser.compareScreen(element(By.id('diagram')), 'port');
        });
        it('Port visibility(Hover) - Default Node', () => {
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-Visibility-Hover-Default-Node');
        });
        it('Port visibility(Hover) - Group Node', () => {
            selectObjects = element(by.id('Node'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-Visibility-Hover-Group-Node');
        });
        it('Port visibility(Connect) - Default Node', () => {
            selectObjects = element(by.id('selectNode'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            selectObjects = element(by.id('Node'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-Visibility-Connect-Default-Node');
        });
        it('Port visibility(Connect) - Group Node', () => {
            selectObjects = element(by.id('Node'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-Visibility-Connect-Group-Node');
        });
        it('Port Visibility (Visible to hover)', () => {
            let node: ElementFinder = element(by.id('selectNode'));
            node.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let port: ElementFinder = element(by.id('selectPort'));
            port.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectVisiblity.click();
            Visible.click();
            Visible.click();
            Hover.click();
            selectObjects = element(by.id('Node'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-visible-to-hover');
        });
        it('Port Visibility (Hover to Connect)', () => {
            Hover.click();
            Connect.click();
            selectObjects = element(by.id('selectNode'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-hover-to-connect');
        });
        it('Port Visibility (Hover and Connect)', () => {
            unSelect.click();
            Hover.click();
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-hover-and-connect');
        });
        it('Port Visibility (Hidden, Hover and Connect)', () => {
            Hidden.click();
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-hidden-hover-and-connect');
        });
        it('Port Visibility (Hidden and Hover)', () => {
            Connect.click();
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-hidden-and-hover');
        });
        it('Port Visibility (Hidden and Connect)', () => {
            Connect.click();
            Hover.click();
            selectObjects = element(by.id('selectNode'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            MouseMove.click();
            browser.compareScreen(element(By.id('diagram')), 'port-hidden-and-connect');
        });

        it('Port Shapes(X) - Default Node', () => {
            let node: ElementFinder = element(by.id('selectNode'));
            node.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let port: ElementFinder = element(by.id('selectPort'));
            port.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            unSelect.click();
            let shapes: ElementFinder = element(by.id('portShapes'));
            shapes.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port1-Shapes-X-Default-Node');
        });
        it('Port Shapes(Custom) - Default Node', () => {
            let shapes: ElementFinder = element(by.id('portShapes'));
            shapes.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port1-Shapes-Custom-Default-Node');
        });
    });
    describe('Port Alignment and margin', () => {
        it('Horizontal Alignment - Left', () => {
            browser.load('/demos/port/port.html');
            let node: ElementFinder = element(by.id('selectNode'));
            node.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let port: ElementFinder = element(by.id('selectPort'));
            port.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            unSelect.click();
            let option = element(by.id('alignment'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-HorizontalAlignment-Left');
        });
        it('Margin Left', () => {
            let option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-Alignment-Left-MarginLeft');
        });
        it('Margin Right', () => {
            selectObjects = element(by.id('marginRight'));
            selectObjects.click();
            let option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[8].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-Alignment-Left-MarginRight');
        });
        it('Margin Top', () => {
            selectObjects = element(by.id('marginTop'));
            selectObjects.click();
            let option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-Alignment-Left-MarginTop');
        });
        it('Margin Bottom', () => {
            selectObjects = element(by.id('marginBottom'));
            selectObjects.click();
            let option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[7].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Port-Alignment-Left-MarginBottom');
        });
        it('Horizontal Alignment - Auto', () => {
            let option = element(by.id('alignment'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[5].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-HorizontalAlignment-Auto');
        });

        it('VerticalAlignment - Top', () => {
            selectObjects = element(by.id('verticalAlignment'));
            selectObjects.click();
            selectObjects = element(by.id('alignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let option = element(by.id('alignment'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port-VerticalAlignment-Top');
        });

        it('Port Styla', () => {
            browser.load('/demos/port/port.html');
            let node: ElementFinder = element(by.id('selectNode'));
            node.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let port: ElementFinder = element(by.id('selectPort'));
            port.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            unSelect.click();

            let offsetX: ElementFinder = element(by.id('offsetX'));
            offsetX.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let offsetY: ElementFinder = element(by.id('offsetY'));
            offsetY.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let width: ElementFinder = element(by.id('widthHeight'));
            width.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port1-position');
        });
        it('Fill', () => {
            let fillColor: ElementFinder = element(by.id('fillColor'));
            fillColor.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let strokeColorRadio: ElementFinder = element(by.id('strokeColorRadio'));
            strokeColorRadio.click();
            fillColor.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            let heightRadio: ElementFinder = element(by.id('heightRadio'));
            heightRadio.click();
            let Height: ElementFinder = element(by.id('widthHeight'));
            Height.all(by.tagName('option'))
                .then((options: any) => {
                    options[5].click();
                });
            let width: ElementFinder = element(by.id('strokeWidth'));
            width.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            let strokeDashArray: ElementFinder = element(by.id('strokeDashArray'));
            strokeDashArray.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            let opacity: ElementFinder = element(by.id('opacity'));
            opacity.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Port1-fillColor');
        });
    });
});