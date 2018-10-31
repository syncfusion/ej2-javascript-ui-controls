/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder;
describe('Diagram Control', () => {
    describe('Hierarchical layout', () => {
        it('Hierarchical Tree Layout Load', () => {
            browser.load('/demos/hierarchicaltree/elementtree.html');
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalTree');
        });
        it('Orientation - TopToBottom', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalOrientation - TopToBottom');
        });
        it('Orientation - BottomToTop', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalOrientation - BottomToTop');
        });
        it('Orientation - LeftToRight', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalOrientation - LeftToRight');
        });
        it('Orientation - RightToLeft', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalOrientation - RightToLeft');
        });

        it('Layout - Without Bounds', () => {
            selectObjects = element(by.id('bounds'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Without Bounds');
        });
        it('Layout - With fixednode', () => {
            selectObjects = element(by.id('fixednode'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - With fixednode');
        });
        it('Layout - Without fixednode', () => {
            selectObjects = element(by.id('fixednode'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Without fixednode');
        });
        it('Layout - With Bounds', () => {
            selectObjects = element(by.id('bounds'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - With Bounds');
        });
        it('Layout - With Horizontal Alignment - Auto ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Horizontal Alignment - Auto');
        });
        it('Layout - With Horizontal Alignment - Left ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Horizontal Alignment - Left');
        });
        it('Layout - With Horizontal Alignment - Right ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Horizontal Alignment - Right');
        });
        it('Layout - With Horizontal Alignment - Center ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Horizontal Alignment - Center');
        });
        it('Layout - With Vertical Alignment - Auto ', () => {
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Vertical Alignment - Auto');
        });
        it('Layout - With Vertical Alignment - Top ', () => {
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Vertical Alignment - Top');
        });
        it('Layout - With Vertical Alignment - Bottom ', () => {
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Vertical Alignment - Bottom');
        });
        it('Layout - With Vertical Alignment - Center ', () => {
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - Vertical Alignment - Center');
        });
        it('Layout - HorizontalSpacing ', () => {
            selectObjects = element(by.id('hspacing'));
            selectObjects.sendKeys(50);
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - HorizontalSpacing');
        });
        it('Layout - VerticalSpacing ', () => {
            selectObjects = element(by.id('vspacing'));
            selectObjects.sendKeys(50);
            browser.compareScreen(element(By.id('diagram')), 'HierarchicalLayout - VerticalSpacing');
        });
    });
    describe('Organizational layout', () => {
        it('Organizational Tree Layout Load', () => {
            browser.load('/demos/hierarchicaltree/elementtree.html');
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalTree');
        });
        it('Orientation - TopToBottom', () => {
            selectObjects = element(by.id('type'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalOrientation - TopToBottom');
        });
        it('Orientation - BottomToTop', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalOrientation - BottomToTop');
        });
        it('Orientation - LeftToRight', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalOrientation - LeftToRight');
        });
        it('Orientation - RightToLeft', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalOrientation - RightToLeft');
        });

        it('Layout - Without Bounds', () => {
            selectObjects = element(by.id('bounds'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Without Bounds');
        });
        it('Layout - With fixednode', () => {
            selectObjects = element(by.id('fixednode'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - With fixednode');
        });
        it('Layout - Without fixednode', () => {
            selectObjects = element(by.id('fixednode'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Without fixednode');
        });
        it('Layout - With Bounds', () => {
            selectObjects = element(by.id('bounds'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - With Bounds');
        });
        it('Layout - With Horizontal Alignment - Auto ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Horizontal Alignment - Auto');
        });
        it('Layout - With Horizontal Alignment - Left ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Horizontal Alignment - Left');
        });
        it('Layout - With Horizontal Alignment - Right ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Horizontal Alignment - Right');
        });
        it('Layout - With Horizontal Alignment - Center ', () => {
            selectObjects = element(by.id('halignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Horizontal Alignment - Center');
        });
        it('Layout - With Vertical Alignment - Auto ', () => {
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
                selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Vertical Alignment - Auto');
        });
        it('Layout - With Vertical Alignment - Top ', () => {            
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Vertical Alignment - Top');
        });
        it('Layout - With Vertical Alignment - Bottom ', () => {            
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Vertical Alignment - Bottom');
        });
        it('Layout - With Vertical Alignment - Center ', () => {            
            selectObjects = element(by.id('valignment'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - Vertical Alignment - Center');
        });
        it('Layout - HorizontalSpacing ', () => {           
            selectObjects = element(by.id('hspacing'));
            selectObjects.sendKeys(50);
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - HorizontalSpacing');
        });
        it('Layout - VerticalSpacing ', () => {
            selectObjects = element(by.id('vspacing'));
            selectObjects.sendKeys(50);
            browser.compareScreen(element(By.id('diagram')), 'OrganizationalLayout - VerticalSpacing');
        });
    });
    describe('Radial layout', () => {
        it('Radial Tree Layout Load', () => {
            browser.load('/demos/radiallayout/radial.html');
            browser.compareScreen(element(By.id('diagram')), 'RadialTree');
        });
    });
    describe('Symmetric layout', () => {
        it('Symmetric Tree Layout Load', () => {
            browser.load('/demos/symmetriclayout/symmetriclayout.html');
            browser.compareScreen(element(By.id('diagram')), 'SymmetricTree');
        });
        it('SpringLength', () => {
            selectObjects = element(by.id('springlength'));
            selectObjects.sendKeys(25);
            executeClickEvent('layout');

            browser.compareScreen(element(By.id('diagram')), 'Symmetric - springlength');
        });
        it('SpringFactor', () => {
            selectObjects = element(by.id('springfactor'));
            selectObjects.sendKeys(50);
            executeClickEvent('layout');

            browser.compareScreen(element(By.id('diagram')), 'Symmetric - SpringFactor');
        });
        it('MaxIteration', () => {
            selectObjects = element(by.id('maxiteration'));
            selectObjects.sendKeys(50);
            executeClickEvent('layout');

            browser.compareScreen(element(By.id('diagram')), 'Symmetric - MaxIteration');
        });
    });
    describe('ComplexHierarchical layout', () => {
        it('ComplexHierarchical Tree Layout Load', () => {
            browser.load('/demos/complexhierarchical/datasourcecomplexhierarchicaltree.html');
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalTree');
        });
        it('Orientation - TopToBottom', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
                selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalOrientation - TopToBottom');
        });
        it('Orientation - BottomToTop', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalOrientation - BottomToTop');
        });
        it('Orientation - LeftToRight', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalOrientation - LeftToRight');
        });
        it('Orientation - RightToLeft', () => {
            selectObjects = element(by.id('orientation'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalOrientation - RightToLeft');
        });
        it('Layout - HorizontalSpacing ', () => {
            selectObjects = element(by.id('hspacing'));
            selectObjects.sendKeys(18);
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalLayout - HorizontalSpacing');
        });
        it('Layout - VerticalSpacing ', () => {
            selectObjects = element(by.id('vspacing'));
            selectObjects.sendKeys(12);
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalLayout - VerticalSpacing');
        });
        it('Layout - MarginX ', () => {
            selectObjects = element(by.id('marginx'));
            selectObjects.sendKeys(5);
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalLayout - MarginX');
        });
        it('Layout - MarginY ', () => {
            selectObjects = element(by.id('marginy'));
            selectObjects.sendKeys(5);
            browser.compareScreen(element(By.id('diagram')), 'ComplexHierarchicalLayout - MarginX');
        });
    });
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
});