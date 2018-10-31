import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selection: ElementFinder = element(by.id('selectNodes'));
let addLabel: ElementFinder = element(by.id('addLabel'));
let removeLabel: ElementFinder = element(by.id('removeLabel'));
let multiSelect: ElementFinder = element(by.id('multiSelect'));
let undo: ElementFinder = element(by.id('undo'));
let redo: ElementFinder = element(by.id('redo'));
let AddGroup: ElementFinder = element(by.id('AddGroup'));
let RemoveGroup: ElementFinder = element(by.id('RemoveGroup'));
let addport: ElementFinder = element(by.id('addport'));
let removeport: ElementFinder = element(by.id('removeport'));
let copy: ElementFinder = element(by.id('copy'));
let paste: ElementFinder = element(by.id('paste'));
let interaction: ElementFinder = element(by.id('interaction'));
let strokeColorRadio: ElementFinder = element(by.id('strokeColorRadio'));
let fillColor: ElementFinder = element(by.id('fillColor'));
let strokeWidth: ElementFinder = element(by.id('strokeWidth'));
let strokeDashArray: ElementFinder = element(by.id('strokeDashArray'));
let opacity: ElementFinder = element(by.id('opacity'));
let selectBox: ElementFinder = element(by.id('selectBox'));

describe('Diagram Control', () => {


    describe('Group - Node with label', () => {
        describe('Interaction and properties', () => {
            it('Rendering', () => {
                browser.load('/demos/group/group.html');
                browser.compareScreen(element(By.id('diagram')), 'Group-rendering');
            });
            it('childNodes-addlabel', () => {
                selection.all(by.tagName('option'))
                    .then((options: any) => {
                        options[1].click();
                    });
                addLabel.click();
                selection.all(by.tagName('option'))
                    .then((options: any) => {
                        options[2].click();
                    });
                addLabel.click();
                browser.compareScreen(element(By.id('diagram')), 'Group-Node-label-childNodes-addlabel');
            });
            it('Interaction', () => {
                selection.all(by.tagName('option'))
                    .then((options: any) => {
                        options[9].click();
                    });
                interaction.all(by.tagName('option'))
                    .then((options: any) => {
                        options[1].click();
                    });
                interaction.all(by.tagName('option'))
                    .then((options: any) => {
                        options[2].click();
                    });
                interaction.all(by.tagName('option'))
                    .then((options: any) => {
                        options[3].click();
                    });
                browser.compareScreen(element(By.id('diagram')), 'Group-Node-label-interaction');
            });

            it('Style', () => {
                fillColor.all(by.tagName('option'))
                    .then((options: any) => {
                        options[3].click();
                    });
                strokeColorRadio.click();
                fillColor.all(by.tagName('option'))
                    .then((options: any) => {
                        options[1].click();
                    });
                strokeWidth.all(by.tagName('option'))
                    .then((options: any) => {
                        options[3].click();
                    });
                strokeDashArray.all(by.tagName('option'))
                    .then((options: any) => {
                        options[3].click();
                    });
                strokeDashArray.all(by.tagName('option'))
                    .then((options: any) => {
                        options[3].click();
                    });
                browser.compareScreen(element(By.id('diagram')), 'Group-Node-label-style');
            });
            it('Copy and paste', () => {
                copy.click();
                paste.click();
                browser.compareScreen(element(By.id('diagram')), 'Group-Node-label-copy-paste');
            });

        });
    });
    describe('Group - Node with port', () => {
        it('Rendering', () => {
            browser.load('/demos/group/group.html');
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            addport.click();
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            addport.click();
            browser.compareScreen(element(By.id('diagram')), 'Group-Node-port-childNodes-addport');
        });
        it('Interaction', () => {
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[9].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Node-port-interaction');
        });


    });
    describe('Group - Connector', () => {

        it('Interaction', () => {
            browser.load('/demos/group/group.html');
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[10].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Connector-interaction');
        });

    });
    describe('Group - Connector with label', () => {
        it('Rendering', () => {
            browser.load('/demos/group/group.html');
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            addLabel.click();
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[15].click();
                });
            addLabel.click();
            browser.compareScreen(element(By.id('diagram')), 'Group-Connector-label-childConnectors-addlabel');
        });
        it('Interaction', () => {

            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[10].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Connector-label-interaction');
        });

    });
    describe('Group - Group', () => {
        it('Select Group and drag', () => {
            browser.load('/demos/group/group.html');
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[13].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Connector-interaction');
        });


    });
    describe('Group - Group with label', () => {
        it('Rendering', () => {
            browser.load('/demos/group/group.html');
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            addLabel.click();
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            addLabel.click();
            browser.compareScreen(element(By.id('diagram')), 'Group-Group-label-childGroups-addlabel');
        });
        it('Select Group and drag', () => {
            selection.all(by.tagName('option'))
                .then((options: any) => {
                    options[13].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            interaction.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Group-interaction');
        });
        it('Style', () => {
            fillColor.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            strokeColorRadio.click();
            fillColor.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            strokeWidth.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            strokeDashArray.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            strokeDashArray.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Group-Group-style');
        });
    });
    describe('Constraints', () => {
        it('Node DragDisableConstraints', () => {
            browser.load('/demos/group/group.html');
            executeSelectionEvent('selectNodes', 8);
            executeSelectionOption('Drag');
            browser.compareScreen(element(By.id('diagram')), 'group-DragDisable');
        });
        it('Node DragEnableConstraints', () => {
            executeSelectionOption('Drag');
            browser.compareScreen(element(By.id('diagram')), 'group-DragEnable');
        });
        it('Node RotateDisableConstraints', () => {
            executeSelectionOption('Rotate');
            browser.compareScreen(element(By.id('diagram')), 'node-RotateDisable');
        });
        it('Node RotateEnableConstraints', () => {
            executeSelectionOption('Rotate');
            browser.compareScreen(element(By.id('diagram')), 'node-RotateEnable');
        });

        it('Node ResizeDisableConstraints', () => {
            executeSelectionOption('Resize');
            browser.compareScreen(element(By.id('diagram')), 'node-ResizeDisable');
        });
        it('Node ResizeEnableConstraints', () => {
            executeSelectionOption('Resize');
            browser.compareScreen(element(By.id('diagram')), 'node-ResizeEnable');
        });
        it('Node DeleteDisableConstraints', () => {
            executeSelectionOption('Delete');
            browser.compareScreen(element(By.id('diagram')), 'node-DeleteEnable');
        });
        it('Node DeleteEnableConstraints', () => {
            executeSelectionOption('Delete');
            browser.compareScreen(element(By.id('diagram')), 'node-DeleteDisable');
        });
    });
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    function executeSelectionEvent(id: string, index: number): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.all(by.tagName('option'))
            .then((options: any) => {
                options[index].click();
            });
    }
    function executeSelectionOption(id: string): void {
        let selectObject: ElementFinder = element(by.id('selectBox'));
        selectObject.click();
        let options: ElementFinder = element(by.id(id));
        options.click();
        selectObject.click();
    }
});
