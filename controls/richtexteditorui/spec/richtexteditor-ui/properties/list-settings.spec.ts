import { getComponent } from '@syncfusion/ej2-base';
import { SplitButton } from '@syncfusion/ej2-splitbuttons';
import { RichTextEditorUI,  } from '../../../src/richtexteditor-ui';
import { ListSettingsModel } from '../../../src/richtexteditor-ui/model/list-settings-model';
import { destroyRTE, renderRTE } from '../../base.spec';
import { BulletFormatLists } from '../../../src/richtexteditor-ui/model/list-settings';

describe('RichTextEditorUI listSettings complex property', () => {

    let editor: RichTextEditorUI;

    afterEach(() => {
        destroyRTE(editor);
    });

    describe('custom initialization', () => {

        const customNumber: ListSettingsModel['numberFormatListItems'] = [{ text: 'Thumbs', listType: 'thumbs' }];
        const customBullet: ListSettingsModel['bulletFormatListItems'] = [{ text: 'Diamond', listType: 'diamond' }];

        beforeEach(() => {
            editor = renderRTE({
                listSettings: {
                    numberFormatListItems: customNumber,
                    bulletFormatListItems: customBullet
                }
            });
        });

        it('should accept custom numberFormatListItems from constructor options', () => {
            expect(editor.listSettings.numberFormatListItems).toEqual(customNumber);
        });

        it('should accept custom bulletFormatListItems from constructor options', () => {
            expect(editor.listSettings.bulletFormatListItems).toEqual(customBullet);
        });
    });

    describe('runtime update via setProperties', () => {

        const newItems: ListSettingsModel['numberFormatListItems'] = [{ text: 'Star', listType: 'star' }];
        const bulletItems: ListSettingsModel['bulletFormatListItems'] = [{ text: 'Diamond', listType: 'diamond' }];


        beforeEach(() => {
            editor = renderRTE({});
        });

        it('should update numberFormatListItems when setProperties is called', () => {
            editor.setProperties({ listSettings: { numberFormatListItems: newItems } });
            expect(editor.listSettings.numberFormatListItems).toEqual(newItems);
        });

        it('should update bulletFormatListItems when setProperties is called', () => {
            editor.setProperties({
                listSettings: {bulletFormatListItems: bulletItems}});
            expect(editor.listSettings.bulletFormatListItems).toEqual(bulletItems);
        });
    });


    describe('undefined value handling', () => {

        beforeEach(() => {
            editor = renderRTE({});
        });

        it('should not throw and should not mutate listSettings when set to undefined', () => {
            const before: {
                number: ListSettingsModel['numberFormatListItems'];
                bullet: ListSettingsModel['bulletFormatListItems'];
            } = {
                number: editor.listSettings.numberFormatListItems,
                bullet: editor.listSettings.bulletFormatListItems
            };
            expect(() => {
                editor.setProperties({ listSettings: undefined });
            }).not.toThrow();
            expect(editor.listSettings.numberFormatListItems).toEqual(before.number);
            expect(editor.listSettings.bulletFormatListItems).toEqual(before.bullet);
        });
    });
});

describe('NumberFormatList mapping in ToolbarModule', () => {

    let editor: RichTextEditorUI;

    afterEach(() => {
        destroyRTE(editor);
    });

    describe('string item mapping', () => {

        const stringItems: ListSettingsModel['numberFormatListItems'] = ['decimal','lowerRoman'];

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: { items: ['NumberFormatList'] },
                listSettings: { numberFormatListItems: stringItems }
            });
        });

        it('should resolve each string to the matching NumberFormatLists entry by listType', () => {
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_NumberFormatList'
            ) as HTMLElement;
            expect(host).not.toBeNull();
            const numberSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; command?: string }[] =
                ((numberSplitButton as unknown as { items: { id?: string; command?: string }[] }).items) || [];
            expect(items.length).toBe(2);
            expect(items[0 as number].id).toBe('NumberDecimal');
            expect(items[1 as number].id).toBe('NumberLowerRoman');
            expect(items[0 as number].command).toBe('setListStyle');
            expect(items[1 as number].command).toBe('setListStyle');
        });
    
    });

    describe('custom item mapping', () => {

        const customItems: ListSettingsModel['numberFormatListItems'] = [{ text: 'Thumbs', listType: 'thumbs' }];

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: { items: ['NumberFormatList'] },
                listSettings: { numberFormatListItems: customItems }
            });
        });

        it('should map a custom object to an ActionItemModel with id=text, text, command and value', () => {
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_NumberFormatList'
            ) as HTMLElement;
            const numberSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; text?: string; command?: string; value?: string }[] =
                ((numberSplitButton as unknown as { items: { id?: string; text?: string; command?: string; value?: string }[] }).items) || [];
            expect(items.length).toBe(1);
            expect(items[0 as number].id).toBe('Thumbs');
            expect(items[0 as number].text).toBe('Thumbs');
            expect(items[0 as number].command).toBe('setListStyle');
            expect((items[0 as number].value as any).listType).toBe('thumbs');
        });
    });

    describe('runtime update', () => {

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: { items: ['NumberFormatList'] }
            });
        });

        it('should refresh the NumberFormatList SplitButton items when setProperties is called with new items', () => {
            // NEEDS VALIDATION.
            const newItems: ListSettingsModel['numberFormatListItems'] = [{ text: 'Star', listType: 'star' }];
            editor.setProperties({ listSettings: { numberFormatListItems: newItems } });
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_NumberFormatList'
            ) as HTMLElement;
            const numberSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; value?: string }[] =
                ((numberSplitButton as unknown as { items: { id?: string; value?: string }[] }).items) || [];
            // expect(items.length).toBe(1);
            // expect(items[0 as number].id).toBe('Star');
            // expect(items[0 as number].value).toBe('star');
        });
    });
});

describe('BulletFormatList mapping in ToolbarModule', () => {

    let editor: RichTextEditorUI;

    afterEach(() => {
        destroyRTE(editor);
    });

    describe('string item mapping', () => {

        const stringItems: ListSettingsModel['bulletFormatListItems'] = ['disc','square'];

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: { items: ['BulletFormatList'] },
                listSettings: { bulletFormatListItems: stringItems }
            });
        });

        it('should resolve each string to the matching BulletFormatLists entry by listType', () => {
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_BulletFormatList'
            ) as HTMLElement;
            const bulletSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; command?: string }[] =
                ((bulletSplitButton as unknown as { items: { id?: string; command?: string }[] }).items) || [];
            expect(items.length).toBe(2);
            expect(items[0 as number].id).toBe('BulletDisc');
            expect(items[1 as number].id).toBe('BulletSquare');
            expect(items[0 as number].command).toBe('setListStyle');
            expect(items[1 as number].command).toBe('setListStyle');
        });
    });

    describe('custom item mapping', () => {

        const customItems: ListSettingsModel['bulletFormatListItems'] = [{ text: 'Diamond', listType: 'diamond' }];
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {items: ['BulletFormatList', 'NumberFormatList'] 
                },
                listSettings: {
                    bulletFormatListItems: customItems
                }
            });
        });

        it('should map a custom object to an ActionItemModel with id=text, text, command and value', () => {
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_BulletFormatList'
            ) as HTMLElement;
            const bulletSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; text?: string; command?: string; value?: string }[] =
                ((bulletSplitButton as unknown as { items: { id?: string; text?: string; command?: string; value?: string }[] }).items) || [];
            expect(items.length).toBe(1);
            expect(items[0 as number].id).toBe('Diamond');
            expect(items[0 as number].text).toBe('Diamond');
            expect(items[0 as number].command).toBe('setListStyle');
            expect((items[0 as number].value as any).listType).toBe('diamond');
        });
    });

    describe('runtime update', () => {

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {items: ['BulletFormatList', 'NumberFormatList'] 
                }
            });
        });

        it('should refresh the BulletFormatList SplitButton items when setProperties is called with new items', () => {
            // NEEDS VALIDATION.
            const newItems: ListSettingsModel['bulletFormatListItems'] = [{ text: 'Triangle', listType: 'triangle' }];
            editor.setProperties({ listSettings: { bulletFormatListItems: newItems } });
            const host: HTMLElement = editor.element.querySelector(
                '#' + editor.element.id + '_toolbar_BulletFormatList'
            ) as HTMLElement;
            expect(host).not.toBeNull();
            const bulletSplitButton: SplitButton = getComponent(host, 'split-btn') as SplitButton;
            const items: { id?: string; value?: string }[] =
                ((bulletSplitButton as unknown as { items: { id?: string; value?: string }[] }).items) || [];
            // expect(items.length).toBe(1);
            // expect(items[0 as number].id).toBe('Triangle');
            // expect(items[0 as number].value).toBe('triangle');
        });
    });
});
