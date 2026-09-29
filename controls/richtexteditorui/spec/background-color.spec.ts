import { ColorPicker } from '@syncfusion/ej2-inputs';
import { ToolbarRenderer } from '../src/base/renderer/toolbar-renderer';
import { RichTextEditorUI } from '../src/richtexteditor-ui/richtexteditor-ui';
import { ToolbarItem } from '../src/richtexteditor-ui/model/toolbar.types';
import { destroyRTE, renderRTE } from './base.spec';

describe('backgroundColor property', () => {
    const ITEMS_WITH_BACKGROUND_COLOR: ToolbarItem[] = ['Bold', 'Italic', 'BackgroundColor'];

    const getRendererAndPicker: (editor: RichTextEditorUI) => { renderer: ToolbarRenderer; picker: ColorPicker } =
        (editor: RichTextEditorUI): { renderer: ToolbarRenderer; picker: ColorPicker } => {
            const toolbar: any = (editor as any).toolbar;
            expect(toolbar).not.toBeNull();
            const renderer: ToolbarRenderer = toolbar.mainToolbar.getRenderer();
            expect(renderer).not.toBeNull();
            const picker: ColorPicker = renderer.getColorPicker('BackgroundColor');
            expect(picker).not.toBeNull();
            return { renderer: renderer, picker: picker };
        };

    describe('Initial rendering', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ITEMS_WITH_BACKGROUND_COLOR
                },
                backgroundColor: {
                    default: '#abcdefff',
                    mode: 'Picker',
                    columns: 8,
                    modeSwitcher: true,
                    showRecentColors: false,
                    preset: {
                        Custom: ['#444444', '#555555', '#666666']
                    }
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply backgroundColor.default to the ColorPicker value during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.value).toBe('#abcdefff');
        });

        it('should apply backgroundColor.columns to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.columns).toBe(8);
        });

        it('should apply backgroundColor.modeSwitcher to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.modeSwitcher).toBe(true);
        });

        it('should apply backgroundColor.showRecentColors to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.showRecentColors).toBe(false);
        });

        it('should apply backgroundColor.preset as presetColors to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.presetColors).toEqual({
                Custom: ['#444444', '#555555', '#666666']
            });
        });
    });

    describe('Runtime property changes via setProperties()', () => {
        let editor: RichTextEditorUI;
        let picker: ColorPicker;

        const getPicker: (editor: RichTextEditorUI) => ColorPicker =
            (editor: RichTextEditorUI): ColorPicker => getRendererAndPicker(editor).picker;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ITEMS_WITH_BACKGROUND_COLOR
                },
                backgroundColor: {
                    default: '#ffff00ff',
                    mode: 'Palette',
                    columns: 5,
                    modeSwitcher: false,
                    showRecentColors: true
                }
            });
            picker = getPicker(editor);
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should forward backgroundColor.default change to picker.setProperties({ value }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { default: '#00ffffff' };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ value: '#00ffffff' });
            expect(picker.value).toBe('#00ffffff');
        });

        it('should forward backgroundColor.columns change to picker.setProperties({ columns }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { columns: 12 };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ columns: 12 });
            expect(picker.columns).toBe(12);
        });

        it('should forward backgroundColor.modeSwitcher change to picker.setProperties({ modeSwitcher }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { modeSwitcher: true };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ modeSwitcher: true });
            expect(picker.modeSwitcher).toBe(true);
        });

        it('should forward backgroundColor.showRecentColors change to picker.setProperties({ showRecentColors }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { showRecentColors: false };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ showRecentColors: false });
            expect(picker.showRecentColors).toBe(false);
        });

        it('should forward backgroundColor.preset change to picker.setProperties({ presetColors }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            const newPalette: { [key: string]: string[] } = { Custom: ['#cccccc', '#dddddd'] };
            editor.backgroundColor = { preset: newPalette };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ presetColors: newPalette });
            expect(picker.presetColors).toEqual(newPalette);
        });

        it('should forward backgroundColor.mode change to picker.setProperties({ mode }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { mode: 'Picker' };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ mode: 'Picker' });
            expect(picker.mode).toBe('Picker');
        });

        it('should not call picker.setProperties when backgroundColor is assigned an empty change object', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = {};
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
        });

        it('should not call picker.setProperties when backgroundColor default value is unchanged', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            // Same value as initial backgroundColor.default
            editor.backgroundColor = { default: '#ffff00ff' };
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
        });

        it('should not call picker.setProperties when backgroundColor columns value is unchanged', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { columns: 5 };
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
        });

        it('should handle multiple backgroundColor property changes in a single dataBind() call', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = {
                default: '#202020ff',
                columns: 9,
                modeSwitcher: true,
                showRecentColors: false,
                mode: 'Picker'
            };
            editor.dataBind();

            expect(picker.value).toBe('#202020ff');
            expect(picker.columns).toBe(9);
            expect(picker.modeSwitcher).toBe(true);
            expect(picker.showRecentColors).toBe(false);
            expect(picker.mode).toBe('Picker');

            // Exactly one setProperties call per forwarded property.
            const callCount: number = (picker.setProperties as jasmine.Spy).calls.count();
            expect(callCount).toBe(5);
        });

        it('should not affect the BackgroundColor picker when fontColor is changed', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { default: '#ff0000ff' };
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
            expect(picker.value).toBe('#ffff00ff');
        });
    });

    describe('When BackgroundColor picker is not configured', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic']
                },
                backgroundColor: {
                    default: '#00ff00ff'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should not throw and should not crash when backgroundColor changes are applied via dataBind()', () => {
            // No BackgroundColor toolbar item is configured, so there is no picker.
            // The dispatcher must hit the safe no-op branches without raising.
            expect((): void => {
                editor.backgroundColor = { default: '#abcdefff' };
                editor.dataBind();
            }).not.toThrow();

            // Editor instance must remain usable after the change.
            expect((editor as any).isDestroyed).toBe(false);
        });

        it('should retain the rendered editor when backgroundColor has no toolbar item', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui');
            expect(editorElement).not.toBeNull();
        });
    });
});