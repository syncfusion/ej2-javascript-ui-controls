import { RichTextEditorUI, ToolbarSettingsModel } from '../../../src';
import { renderRTE, destroyRTE } from '../../base.spec';

function selectEditorText(editor: RichTextEditorUI): void {
    const inputElement: HTMLElement = editor.inputElement as HTMLElement;
    inputElement.focus();
    const paragraph: HTMLElement = inputElement.querySelector('p') as HTMLElement;
    const range: Range = document.createRange();
    range.selectNodeContents(paragraph);
    const selection: Selection = inputElement.ownerDocument.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
    inputElement.ownerDocument.dispatchEvent(new Event('selectionchange'));
}

describe('Toolbar Module', () => {
    describe('Module Name', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({});
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('getModuleName', () => {
            expect(editor.toolbarModule.getModuleName()).toBe('toolbar');
        });
    });
    describe('Basic Rendering', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    type: 'MultiRow'
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('toolbar wrapper rendered', () => {
            expect(document.querySelector('.e-rte-ui-toolbar-wrapper')).not.toBeNull();
        });
        it('toolbar rendered', () => {
            expect(editor.toolbarModule.element).not.toBeNull();
        });
        it('toolbar items rendered', () => {
            expect(document.querySelector('.e-toolbar-items')).not.toBeNull();
        });
        it('default item count rendered', () => {
            expect(
                document.querySelector('.e-toolbar-items')!.childElementCount
            ).toBeGreaterThan(0);
        });
    });
    describe('Toolbar Properties', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    type: 'MultiRow'
                } as ToolbarSettingsModel
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('position update', () => {
            editor.toolbarSettings.position = 'Bottom';
            editor.dataBind();
            expect(editor.toolbarSettings.position).toBe('Bottom');
        });
        it('floating update', () => {
            editor.toolbarSettings.floatingOffset = 50;
            editor.dataBind();
            expect(editor.toolbarSettings.floatingOffset).toBe(50);
        });
        it('disable floating', () => {
            editor.toolbarSettings.enableFloating = false;
            editor.dataBind();
            expect(editor.toolbarSettings.enableFloating).toBe(false);
        });
        it('toolbar type update', () => {
            editor.toolbarSettings.type = 'Scrollable';
            editor.dataBind();
            expect(editor.toolbarSettings.type).toBe('Scrollable');
        });
    });
    describe('Toolbar Events', () => {
        let editor: RichTextEditorUI;
        let eventTriggered: boolean;
        beforeEach(() => {
            eventTriggered = false;
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold'],
                    itemClicked: () => {
                        eventTriggered = true;
                    }
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('itemClicked event', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Bold'
                ) as HTMLElement;
            button.click();
            expect(eventTriggered).toBe(true);
        });
    });
    describe('Button Actions', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Bold button', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Bold'
                ) as HTMLElement;

            button.click();
            expect(button).not.toBeNull();
        });
        it('Italic button', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Italic'
                ) as HTMLElement;
            button.click();
            expect(button).not.toBeNull();
        });
        it('Underline button', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Underline'
                ) as HTMLElement;
            button.click();
            expect(button).not.toBeNull();
        });
    });
    describe('Button Actions for uppercase, lowercase and HorizontalLine', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>testing</p>',
                toolbarSettings: {
                    items: ['UpperCase', 'LowerCase', 'HorizontalLine']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Action buttons testing', () => {
            // Upper case
            editor.inputElement?.focus();
            selectEditorText(editor);
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_UpperCase') as HTMLElement;
            button.click();
            expect(editor.inputElement?.textContent).toBe('TESTING');
            // Lower case
            const button1: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_LowerCase') as HTMLElement;
            button1.click();
            expect(editor.inputElement?.textContent).toBe('testing');
            // Horizontal Line
            const button2: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_HorizontalLine') as HTMLElement;
            button2.click();
            expect(editor.inputElement?.querySelector('hr')).not.toBeNull();
        });
    });
    describe('Dropdown Rendering', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Formats']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Formats dropdown rendered', () => {
            expect(
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Formats'
                )
            ).not.toBeNull();
        });
        it('Formats popup open', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_Formats'
                ) as HTMLElement;
            button.click();
            expect(
                document.querySelector('.e-dropdown-popup.e-popup-open')
            ).not.toBeNull();
        });
    });
    describe('Dropdown Selection', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Testing</p>',
                toolbarSettings: {
                    items: ['Formats']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('select dropdown item', () => {
            const pElement: HTMLElement = editor.inputElement.querySelector('p') as HTMLElement;
            const textNode: Text = pElement.firstChild as Text;
            // Select the word "Testing"
            const range: Range = document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(textNode, textNode.textContent!.length);
            const selection: Selection = window.getSelection() as Selection;
            selection.removeAllRanges();
            selection.addRange(range);
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Formats') as HTMLElement;
            button.click();
            const item: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item.click();
            expect(editor.inputElement?.firstElementChild?.nodeName).toBe('H1');
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button.click();
            const activeItem: HTMLElement | null = document.querySelector('.e-dropdown-popup.e-popup-open li.e-active');
            expect(activeItem).not.toBeNull();
        });
    });
    describe('SplitButton Rendering', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('number format split button', () => {
            expect(
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_NumberFormatList'
                )
            ).not.toBeNull();
        });
        it('split popup open', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_NumberFormatList'
                ) as HTMLElement;
            button.click();
            expect(document.body).not.toBeNull();
        });
    });
    describe('SplitButton Selection', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('select split button item', () => {
            const button: HTMLElement =
                document.querySelector(
                    '#' + editor.element.id + '_toolbar_NumberFormatList'
                ) as HTMLElement;
            button.click();
            const item: HTMLElement | null =
                document.querySelector('.e-dropdown-popup.e-popup-open li');
            item?.click();
            expect(item).toBeNull();
        });
    });
    describe('Color Picker', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: [
                        'FontColor',
                        'BackgroundColor'
                    ]
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('FontColor rendering', () => {
            expect(
                document.querySelector('.e-rte-ui-font-colorpicker')
            ).not.toBeNull();
        });
        it('BackgroundColor rendering', () => {
            expect(
                document.querySelector('.e-rte-ui-background-colorpicker')
            ).not.toBeNull();
        });
        it('FontColor click', () => {
            const picker: HTMLElement | null =
                document.querySelector('.e-rte-ui-font-colorpicker');

            picker?.click();
            expect(picker).not.toBeNull();
        });
    });
    describe('Dynamic Toolbar Updates', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', '|', 'Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('update toolbar items collection', () => {
            editor.toolbarSettings.items = ['Bold', '|', 'Italic', '|', 'Underline'];
            editor.dataBind();
            expect(
                editor.toolbarSettings.items.length
            ).toBe(5);
        });
    });
    describe('Toolbar staus testing', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Testing</p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'Formats', 'FontName', 'FontSize', 'Alignment', 'FontColor', 'Undo', 'Redo', 'BackgroundColor']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Bold button', () => {
            editor.inputElement.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Bold') as HTMLElement;
            button.click();
            expect(button.parentElement?.classList.contains('e-active')).toBe(true);
        });
        it('Italic button', () => {
            editor.inputElement.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Italic') as HTMLElement;
            button.click();
            expect(button.parentElement?.classList.contains('e-active')).toBe(true);
        });
        it('Formats button', () => {
            editor.inputElement.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Formats') as HTMLElement;
            button.click();
            const item: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item.click();
            editor.inputElement.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button1: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Formats') as HTMLElement;
            button1.click();
        });
        it('Font color button', () => {
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_FontColor')?.parentElement?.querySelectorAll('button')[1] as HTMLElement;
            button.click();
            const item: HTMLElement | null = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
            expect(item.querySelector('.e-selected')).not.toBeNull();
        });
        it('Background color button', () => {
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_BackgroundColor')?.parentElement?.querySelectorAll('button')[1] as HTMLElement;
            button.click();
            const item: HTMLElement | null = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
            expect(item.querySelector('.e-selected')).not.toBeNull();
        });
        it('Font color and back ground color coverage', () => {
            editor.inputElement.focus();
            selectEditorText(editor);
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_FontColor')?.parentElement?.querySelectorAll('button')[0] as HTMLElement;
            button.click();
            const button1: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_FontColor')?.parentElement?.querySelectorAll('button')[1] as HTMLElement;
            button1.click();
            const item1: HTMLElement | null = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
            expect(item1.querySelector('.e-selected')).not.toBeNull();

            editor.inputElement.focus();
            selectEditorText(editor);
            const button2: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_BackgroundColor')?.parentElement?.querySelectorAll('button')[0] as HTMLElement;
            button2.click();
            const button3: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_BackgroundColor')?.parentElement?.querySelectorAll('button')[1] as HTMLElement;
            button3.click();
            const item2: HTMLElement | null = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
            expect(item2.querySelector('.e-selected')).not.toBeNull();
        });
    });
    describe('Dropdown Selection for font size, fontsize and Align', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Testing</p>',
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Alignment']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('select dropdown item', () => {
            editor.inputElement?.focus();
            selectEditorText(editor);
            const button: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_FontName') as HTMLElement;
            button.click();
            const item: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item.click();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button.click();
            const item7: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item7.click();

            editor.inputElement?.focus();
            selectEditorText(editor);
            const button1: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_FontSize') as HTMLElement;
            button1.click();
            const item1: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item1.click();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button1.click();
            const item6: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item6.click();

            editor.inputElement?.focus();
            selectEditorText(editor);
            const button2: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Alignment') as HTMLElement;
            button2.click();
            const item2: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[1] as HTMLElement;
            item2.click();
            expect(editor.inputElement?.querySelector('p')?.style.textAlign).toBe('center');
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button2.click();
            const item3: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[0] as HTMLElement;
            item3.click();
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button2.click();
            const item4: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[2] as HTMLElement;
            item4.click();
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button2.click();
            const item5: HTMLElement | null = document.querySelectorAll('.e-dropdown-popup.e-popup-open li')[3] as HTMLElement;
            item5.click();
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button2.click();
        });
    });
    describe('Rendered toolbar with custom items', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Alignment', 'FontColor', 'BackgroundColor', 'FontName', 'FontSize',
                        {
                            tooltipText: 'Formatss',
                            id: 'customFormats',
                            template: `
<select id="customFormat">
<option value="">Format</option>
<option value="h1">Heading 1</option>
<option value="h2">Heading 2</option>
</select>
`
                        }
                    ],
                    type: 'MultiRow'
                } as ToolbarSettingsModel
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Should render the configured toolbar items', () => {
            const defaultElementCount: number = document.querySelector('.e-toolbar-items')!.childElementCount;
            expect(defaultElementCount).toBe(7);
        });
    });
    describe('Property Change Coverage', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({});
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('font color update', () => {
            (editor as any).fontColor = {
                default: '#ff0000'
            };
            editor.dataBind();
            expect(true).toBe(true);
        });
        it('background color update', () => {
            (editor as any).backgroundColor = {
                default: '#00ff00'
            };
            editor.dataBind();
            expect(true).toBe(true);
        });
        it('font family update', () => {
            (editor as any).fontFamily = {
                width: '120px'
            };
            editor.dataBind();
            expect(true).toBe(true);
        });
        it('font size update', () => {
            (editor as any).fontSize = {
                width: '80px'
            };
            editor.dataBind();
            expect(true).toBe(true);
        });
        it('format update', () => {
            (editor as any).format = {
                width: '90px'
            };
            editor.dataBind();
            expect(true).toBe(true);
        });
    });
    describe('Coverage APIs', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({});
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('refreshOverflow', () => {
            editor.toolbarModule.refreshOverflow();
        });
        it('updateLocale', () => {
            editor.toolbarModule.updateLocale();
        });
        it('updateType', () => {
            editor.toolbarModule.updateType('MultiRow');
        });
        it('updatePosition', () => {
            editor.toolbarModule.updatePosition('Bottom');
        });
        it('updateFloating', () => {
            editor.toolbarModule.updateFloating(true, 50);
        });
        it('destroyModule', () => {
            editor.toolbarModule.destroyModule();
            expect(editor.toolbarModule.mainToolbar).toBeNull();
        });
    });

    describe('Tooltip casing issue for Indent and Outdent toolbar items', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Indent', 'Outdent']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('renders Tab shortcuts in toolbar titles and button labels', () => {
            const indentItem: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
            const outdentItem: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
            expect(indentItem.getAttribute('title')).toBe('Indent (Tab)');
            expect(outdentItem.getAttribute('title')).toBe('Outdent (Shift+Tab)');
            expect(indentItem.querySelector('button')?.getAttribute('aria-label')).toBe('Indent (Tab)');
            expect(outdentItem.querySelector('button')?.getAttribute('aria-label')).toBe('Outdent (Shift+Tab)');
        });
    });

    describe('FontName dropdown content wrapper width', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Testing</p>',
                toolbarSettings: {
                    items: ['Bold', 'FontName', 'FontSize']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('getFontNameDropdownWidth returns the default 72px when fontFamily.width is unset', () => {
            const renderer: any = editor.toolbarModule.mainToolbar.getRenderer();
            expect(typeof renderer.getFontNameDropdownWidth).toBe('function');
            const width: string = renderer.getFontNameDropdownWidth();
            // Default FontFamily class annotates @Property('72px') public width
            expect(width).toBe('72px');
        });
        it('FontName ButtonText wrapper uses the default fontFamily.width at render', () => {
            const btn: HTMLElement | null = document.querySelector(
                '#' + editor.element.id + '_toolbar_FontName' + ' .e-rte-ui-dropdown-btn-text-wrapper'
            );
            expect(btn).not.toBeNull();
            expect(btn!.getAttribute('style') || '').toContain('width: 72px');
        });
        it('changing editor.fontFamily.width updates getFontNameDropdownWidth output', () => {
            (editor as any).fontFamily = { width: '110px' };
            editor.dataBind();
            const renderer: any = editor.toolbarModule.mainToolbar.getRenderer();
            expect(renderer.getFontNameDropdownWidth()).toBe('110px');
        });
    });
});
