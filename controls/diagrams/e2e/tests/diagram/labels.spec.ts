/*** spec*/
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder;
let addLabel: ElementFinder = element(by.id('addLabel'));
let removeLabel: ElementFinder = element(by.id('removeLabel'));
let startTextEdit: ElementFinder = element(by.id('labelEditing'));
let undo: ElementFinder = element(by.id('undo'));
let redo: ElementFinder = element(by.id('redo'));
describe('Diagram Control', () => {
    describe('Annotation', () => {
        it('Annotation Rendering - Node', () => {
            browser.load('/demos/label/label.html');
            browser.compareScreen(element(By.id('diagram')), 'Annotation');
        });
        it('Add Label - Default Node', () => {
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            addLabel.click();
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[6].click();
                });
            addLabel.click();
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[9].click();
                });
            addLabel.click();
            browser.compareScreen(element(By.id('diagram')), 'Default-Node-add-label');
        });
        it('Remove Label - Group Node', () => {
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[6].click();
                });
            removeLabel.click();
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[9].click();
                });
            removeLabel.click();
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            startTextEdit.click();
            browser.compareScreen(element(By.id('diagram')), 'Group-Node-remove-label');
        });
    });
    describe('Annotation - properties', () => {
        it('Content', () => {
            browser.load('/demos/label/label.html');
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let option = element(by.id('content'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            option = element(by.id('visibility'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-Content-Visibility');
        });

        it('Bold', () => {
            selectObjects = element(by.id('Bold'));
            selectObjects.click();
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let option = element(by.id('visibility'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            selectObjects = element(by.id('Italic'));
            selectObjects.click();
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            option = element(by.id('visibility'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-Bold');
        });
        it('Annotation Constraints', () => {
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[9].click();
                });
            let option = element(by.id('AnnotationConstraints'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            startTextEdit.click();
            browser.compareScreen(element(By.id('diagram')), 'Annotation-Constraints');
        });
        it('Horizontal Alignment - Left', () => {
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[12].click();
                });
            let option = element(by.id('alignment'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-HorizontalAlignment-Left');
        });
        it('Margin Left', () => {
            let option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            selectObjects = element(by.id('marginRight'));
            selectObjects.click();
            option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[8].click();
                });
            selectObjects = element(by.id('marginTop'));
            selectObjects.click();
            option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            selectObjects = element(by.id('marginBottom'));
            selectObjects.click();
            option = element(by.id('margin'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[7].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-Alignment-Left-Margin');
        });

        it('VerticalAlignment - Top', () => {
            selectObjects = element(by.id('verticalAlignment'));
            selectObjects.click();
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[11].click();
                });
            let option = element(by.id('alignment'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-VerticalAlignment-Top');
        });
        it('Fill color', () => {
            let option = element(by.id('colors'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                })
            selectObjects = element(by.id('color'));
            selectObjects.click();
            option = element(by.id('colors'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            selectObjects = element(by.id('fontSize'));
            selectObjects.click();
            option = element(by.id('size'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            option = element(by.id('opacity'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-style');
        });

        it('Text Wrapping - Wrap', () => {
            selectObjects = element(by.id('SelectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            let option = element(by.id('textWrapping'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textWrapping-Wrap');
        });
        it('Text Wrapping - No Wrap', () => {
            let option = element(by.id('textWrapping'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textWrapping-NoWrap');
        });
        it('Text Wrapping - WrapWithOverflow', () => {
            let option = element(by.id('textWrapping'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textWrapping-WrapWithOverflow');
        });

        it('Text Align - Left', () => {

            let option = element(by.id('textAlign'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textAlign-Left');
        });
        it('Text Align - Right', () => {
            let option = element(by.id('textAlign'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textAlign-Right');
        });
        it('Text Align - Center', () => {
            let option = element(by.id('textAlign'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            browser.compareScreen(element(By.id('diagram')), 'Annotation-textAlign-Center');
        });
        it('Text Align - Justify', () => {
            let option = element(by.id('textAlign'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textAlign-Justify');
        });
        it('Text Decoration - Overline', () => {

            let option = element(by.id('textDecoration'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textDecoration-Overline');
        });
        it('Text Decoration - Underline', () => {
            let option = element(by.id('textDecoration'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textDecoration-Underline');
        });
        it('Text Decoration - LineThrough', () => {
            let option = element(by.id('textDecoration'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            browser.compareScreen(element(By.id('diagram')), 'Annotation-textDecoration-LineThrough');
        });
        it('Text Decoration - None', () => {
            let option = element(by.id('textDecoration'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textDecoration-None');
        });
        it('Text Overflow - Wrap', () => {
            let option = element(by.id('textOverflow'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textOverflow-Wrap');
        });
        it('Text Overflow - Ellipsis', () => {
            let option = element(by.id('textOverflow'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });

            browser.compareScreen(element(By.id('diagram')), 'Annotation-textOverflow-Ellipsis');
        });
        it('Text Overflow - Clip', () => {
            let option = element(by.id('textOverflow'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-textOverflow-Clip');
        });

        it('WhiteSpace - PreserveAll', () => {
            let option = element(by.id('whiteSpace'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                })
            browser.compareScreen(element(By.id('diagram')), 'Annotation-whiteSpace-PreserveAll');
        });
        it('WhiteSpace - CollapseSpace', () => {
            let option = element(by.id('whiteSpace'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });

            browser.compareScreen(element(By.id('diagram')), 'Annotation-whiteSpace-CollapseSpace');
        });
        it('WhiteSpace - CollapseAll', () => {
            let option = element(by.id('whiteSpace'));
            option.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'Annotation-whiteSpace-CollapseAll');
        });
    });
});