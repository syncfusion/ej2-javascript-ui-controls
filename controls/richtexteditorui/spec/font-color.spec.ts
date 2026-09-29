import { ColorPicker } from '@syncfusion/ej2-inputs';
import { ToolbarRenderer } from '../src/base/renderer/toolbar-renderer';
import { RichTextEditorUI } from '../src/richtexteditor-ui/richtexteditor-ui';
import { ToolbarItem } from '../src/richtexteditor-ui/model/toolbar.types';
import { destroyRTE, renderRTE } from './base.spec';

describe('fontColor property', () => {
    const ITEMS_WITH_FONT_COLOR: ToolbarItem[] = ['Bold', 'Italic', 'FontColor'];

    const getRendererAndPicker: (editor: RichTextEditorUI) => { renderer: ToolbarRenderer; picker: ColorPicker } =
        (editor: RichTextEditorUI): { renderer: ToolbarRenderer; picker: ColorPicker } => {
            const toolbar: any = (editor as any).toolbar;
            expect(toolbar).not.toBeNull();
            const renderer: ToolbarRenderer = toolbar.mainToolbar.getRenderer();
            expect(renderer).not.toBeNull();
            const picker: ColorPicker = renderer.getColorPicker('FontColor');
            expect(picker).not.toBeNull();
            return { renderer: renderer, picker: picker };
        };

    describe('Initial rendering', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ITEMS_WITH_FONT_COLOR
                },
                fontColor: {
                    default: '#123456ff',
                    mode: 'Picker',
                    columns: 7,
                    modeSwitcher: true,
                    showRecentColors: false,
                    preset: {
                        Custom: ['#111111', '#222222', '#333333']
                    }
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply fontColor.default to the ColorPicker value during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.value).toBe('#123456ff');
        });

        it('should apply fontColor.columns to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.columns).toBe(7);
        });

        it('should apply fontColor.modeSwitcher to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.modeSwitcher).toBe(true);
        });

        it('should apply fontColor.showRecentColors to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.showRecentColors).toBe(false);
        });

        it('should apply fontColor.preset as presetColors to the ColorPicker during initial render', () => {
            const picker: ColorPicker = getRendererAndPicker(editor).picker;
            expect(picker.presetColors).toEqual({
                Custom: ['#111111', '#222222', '#333333']
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
                    items: ITEMS_WITH_FONT_COLOR
                },
                fontColor: {
                    default: '#ff0000ff',
                    mode: 'Palette',
                    columns: 10,
                    modeSwitcher: false,
                    showRecentColors: true
                }
            });
            picker = getPicker(editor);
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should forward fontColor.default change to picker.setProperties({ value }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { default: '#00ff00ff' };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ value: '#00ff00ff' });
            expect(picker.value).toBe('#00ff00ff');
        });

        it('should forward fontColor.columns change to picker.setProperties({ columns }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { columns: 4 };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ columns: 4 });
            expect(picker.columns).toBe(4);
        });

        it('should forward fontColor.modeSwitcher change to picker.setProperties({ modeSwitcher }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { modeSwitcher: true };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ modeSwitcher: true });
            expect(picker.modeSwitcher).toBe(true);
        });

        it('should forward fontColor.showRecentColors change to picker.setProperties({ showRecentColors }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { showRecentColors: false };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ showRecentColors: false });
            expect(picker.showRecentColors).toBe(false);
        });

        it('should forward fontColor.preset change to picker.setProperties({ presetColors }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            const newPalette: { [key: string]: string[] } = { Custom: ['#aaaaaa', '#bbbbbb'] };
            editor.fontColor = { preset: newPalette };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ presetColors: newPalette });
            expect(picker.presetColors).toEqual(newPalette);
        });

        it('should forward fontColor.mode change to picker.setProperties({ mode }) after dataBind()', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = { mode: 'Picker' };
            editor.dataBind();

            expect(picker.setProperties).toHaveBeenCalledWith({ mode: 'Picker' });
            expect(picker.mode).toBe('Picker');
        });

        it('should not call picker.setProperties when fontColor is assigned an empty change object', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = {};
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
        });

        it('should handle multiple fontColor property changes in a single dataBind() call', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.fontColor = {
                default: '#101010ff',
                columns: 8,
                modeSwitcher: true,
                showRecentColors: false,
                mode: 'Picker'
            };
            editor.dataBind();

            expect(picker.value).toBe('#101010ff');
            expect(picker.columns).toBe(8);
            expect(picker.modeSwitcher).toBe(true);
            expect(picker.showRecentColors).toBe(false);
            expect(picker.mode).toBe('Picker');

            // Exactly one setProperties call per forwarded property.
            const callCount: number = (picker.setProperties as jasmine.Spy).calls.count();
            expect(callCount).toBe(5);
        });

        it('should not affect the FontColor picker when backgroundColor is changed', () => {
            spyOn(picker, 'setProperties').and.callThrough();

            editor.backgroundColor = { default: '#ffff00ff' };
            editor.dataBind();

            expect(picker.setProperties).not.toHaveBeenCalled();
            expect(picker.value).toBe('#ff0000ff');
        });
    });

    describe('When FontColor picker is not configured', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic']
                },
                fontColor: {
                    default: '#ff00ffff'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should not throw and should not crash when fontColor changes are applied via dataBind()', () => {
            // No FontColor toolbar item is configured, so there is no picker.
            // The dispatcher must hit the safe no-op branches without raising.
            expect((): void => {
                editor.fontColor = { default: '#abcdefff' };
                editor.dataBind();
            }).not.toThrow();

            // Editor instance must remain usable after the change.
            expect((editor as any).isDestroyed).toBe(false);
        });

        it('should retain the rendered editor when fontColor has no toolbar item', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui');
            expect(editorElement).not.toBeNull();
        });
    });
});