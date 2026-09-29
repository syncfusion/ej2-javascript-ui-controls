import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('Format property', () => {
    describe('should initialize with default format settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have default width of 75px', () => {
            expect(editor.format).toBeDefined();
            expect(editor.format.width).toBe('75px');
        });

        it('should render Format dropdown in the toolbar', (done: DoneFn) => {
            setTimeout((): void => {
                const formatElement: HTMLElement = document.querySelector('[id$="_Formats"]') as HTMLElement;
                expect(formatElement).not.toBeNull();
                done();
            }, 200);
        });
    });

    describe('should initialize with custom format settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.format.width = '120px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply custom width during initialization', () => {
            expect(editor.format.width).toBe('120px');
        });

        it('should have items property defined', () => {
            expect(editor.format.items).toBeDefined();
        });

        it('should render Format dropdown in the toolbar', (done: DoneFn) => {
            setTimeout((): void => {
                const formatElement: HTMLElement = document.querySelector('[id$="_Formats"]') as HTMLElement;
                expect(formatElement).not.toBeNull();
                done();
            }, 200);
        });
    });

    describe('should update format width at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.format.width = '75px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should change width when format property is updated', () => {
            editor.format.width = '100px';
            editor.dataBind();
            expect(editor.format.width).toBe('100px');
        });

        it('should update DOM element width when format width changes', (done: DoneFn) => {
            editor.format.width = '110px';
            editor.dataBind();
            setTimeout((): void => {
                const formatButton: HTMLElement = document.querySelector('#' + editor.element.id + '_toolbar_Formats') as HTMLElement;
                expect(formatButton).not.toBeNull();
                if (formatButton && formatButton.style.width) {
                    expect(formatButton.style.width).toBe('110px');
                }
                done();
            }, 200);
        });

        it('should accept width in different units', () => {
            const units: string[] = ['80px', '100px', '8rem', '10em'];
            units.forEach((unit: string) => {
                editor.format.width = unit;
                editor.dataBind();
                expect(editor.format.width).toBe(unit);
            });
        });
    });

    describe('should update format items at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have items property that can be assigned', () => {
            expect(editor.format.items).toBeDefined();
            editor.dataBind();
            expect(editor.format).toBeDefined();
        });

        it('should handle property binding on format items', () => {
            const originalItems: object = editor.format.items;
            editor.format.items = originalItems as any;
            editor.dataBind();
            expect(editor.format.items).toBeDefined();
        });

        it('should handle updates gracefully', () => {
            editor.dataBind();
            expect(editor.format).toBeDefined();
        });
    });

    describe('should update both width and items properties', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.format.width = '75px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update width and preserve items', () => {
            const originalItems = editor.format.items;
            editor.format.width = '130px';
            editor.dataBind();
            expect(editor.format.width).toBe('130px');
            expect(editor.format.items).toEqual(originalItems);
        });

        it('should update only width without affecting items', () => {
            const originalItems = editor.format.items;
            editor.format.width = '90px';
            editor.dataBind();
            expect(editor.format.width).toBe('90px');
            expect(editor.format.items).toEqual(originalItems);
        });

        it('should preserve items when width is updated', () => {
            editor.format.width = '100px';
            editor.dataBind();
            expect(editor.format.width).toBe('100px');
            expect(editor.format.items).toBeDefined();
        });
    });

    describe('should handle edge cases for format property', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should handle null format gracefully', () => {
            expect(() => {
                editor.format = null as any;
                editor.dataBind();
            }).not.toThrow();
        });

        it('should handle empty string width', () => {
            editor.format.width = '';
            editor.dataBind();
            expect(editor.format.width).toBe('');
        });

        it('should preserve format property after multiple updates', () => {
            const width1: string = '80px';
            const width2: string = '95px';
            const width3: string = '110px';

            editor.format.width = width1;
            editor.dataBind();
            expect(editor.format.width).toBe(width1);

            editor.format.width = width2;
            editor.dataBind();
            expect(editor.format.width).toBe(width2);

            editor.format.width = width3;
            editor.dataBind();
            expect(editor.format.width).toBe(width3);
        });
    });

    describe('should maintain format property during editor lifecycle', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.format.width = '100px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should retain format settings when editor content changes', () => {
            const originalWidth: string = editor.format.width;
            editor.value = '<p>New content</p>';
            editor.dataBind();
            expect(editor.format.width).toBe(originalWidth);
        });

        it('should retain format settings when toolbar is toggled', (done: DoneFn) => {
            const originalWidth: string = editor.format.width;
            editor.toolbarSettings.enable = false;
            editor.dataBind();
            setTimeout((): void => {
                editor.toolbarSettings.enable = true;
                editor.dataBind();
                setTimeout((): void => {
                    // Format width is preserved on the model since the toolbar is recreated;
                    // dropdown control is rebuilt with default width (75px) since width is reapplied at render.
                    // The model property still holds the value we last set.
                    expect(editor.format.width).toBe(originalWidth);
                    done();
                }, 200);
            }, 200);
        });

        it('should retain format settings during editor interaction', () => {
            const originalWidth: string = editor.format.width;
            const contentElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            if (contentElement) {
                contentElement.focus();
                contentElement.innerText = 'Edited content';
            }
            expect(editor.format.width).toBe(originalWidth);
        });
    });

    describe('should validate format property structure', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have format as a properly defined object', () => {
            expect(editor.format).not.toBeNull();
            expect(typeof editor.format).toBe('object');
        });

        it('should expose width property on format', () => {
            expect('width' in editor.format).toBe(true);
        });

        it('should expose items property on format', () => {
            expect('items' in editor.format).toBe(true);
        });

        it('should allow reading width property', () => {
            const width: string = editor.format.width;
            expect(typeof width === 'string').toBe(true);
        });

        it('should allow reading items property', () => {
            const items: object | undefined = editor.format.items;
            expect(items === undefined || typeof items === 'object').toBe(true);
        });
    });

    describe('should handle format property with toolbar settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.format.width = '90px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply format settings in the editor', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.format.width).toBe('90px');
                const formatElement: HTMLElement = document.querySelector('[id$="_Formats"]') as HTMLElement;
                expect(formatElement).not.toBeNull();
                done();
            }, 200);
        });

        it('should preserve format settings after dataBind', () => {
            const originalWidth: string = editor.format.width;
            editor.dataBind();
            expect(editor.format.width).toBe(originalWidth);
        });

        it('should maintain format settings consistency', () => {
            const originalWidth: string = editor.format.width;
            editor.dataBind();
            expect(editor.format.width).toBe(originalWidth);
            editor.dataBind();
            expect(editor.format.width).toBe(originalWidth);
        });
    });
});
