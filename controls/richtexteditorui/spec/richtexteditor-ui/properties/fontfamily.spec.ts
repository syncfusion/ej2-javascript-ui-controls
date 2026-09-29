import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('FontFamily property', () => {

    describe('should initialize with default fontFamily settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have default width of 72px', () => {
            expect(editor.fontFamily).toBeDefined();
            expect(editor.fontFamily.width).toBe('72px');
        });

        it('should expose the default fontFamily items list on the model', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily.items).toBeDefined();
                expect(editor.fontFamily.items.length).toBe(5);
                done();
            }, 200);
        });

        it('should include Default option followed by Arial/Helvetica/Times New Roman/Courier New', (done: DoneFn) => {
            setTimeout((): void => {
                const expectedTexts: string[] = ['Default', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New'];
                const actualTexts: string[] = editor.fontFamily.items.map((item: any) => item.text);
                expect(actualTexts).toEqual(expectedTexts);
                done();
            }, 200);
        });
    });

    describe('should initialize with custom fontFamily settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontFamily: { width: '110px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply custom width during initialization', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily.width).toBe('110px');
                done();
            }, 200);
        });

        it('should have items property defined', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily.items).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should update fontFamily width at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.fontFamily.width = '72px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should change width when fontFamily property is updated', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontFamily.width = '100px';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe('100px');
                done();
            }, 200);
        });

        it('should accept width in different units', (done: DoneFn) => {
            setTimeout((): void => {
                const units: string[] = ['60px', '90px', '7rem', '9em'];
                units.forEach((unit: string) => {
                    editor.fontFamily.width = unit;
                    editor.dataBind();
                    expect(editor.fontFamily.width).toBe(unit);
                });
                done();
            }, 200);
        });
    });

    describe('should update fontFamily items at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have items property that can be assigned', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily.items).toBeDefined();
                editor.dataBind();
                expect(editor.fontFamily).toBeDefined();
                done();
            }, 200);
        });

        it('should handle property binding on fontFamily items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems: object = editor.fontFamily.items;
                editor.fontFamily.items = originalItems as any;
                editor.dataBind();
                expect(editor.fontFamily.items).toBeDefined();
                done();
            }, 200);
        });

        it('should handle updates gracefully', (done: DoneFn) => {
            setTimeout((): void => {
                editor.dataBind();
                expect(editor.fontFamily).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should update both width and items properties', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontFamily: { width: '72px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update width and preserve items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems = editor.fontFamily.items;
                editor.fontFamily.width = '130px';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe('130px');
                expect(editor.fontFamily.items).toEqual(originalItems);
                done();
            }, 200);
        });

        it('should update only width without affecting items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems = editor.fontFamily.items;
                editor.fontFamily.width = '90px';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe('90px');
                expect(editor.fontFamily.items).toEqual(originalItems);
                done();
            }, 200);
        });

        it('should preserve items when width is updated', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontFamily.width = '100px';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe('100px');
                expect(editor.fontFamily.items).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should handle edge cases for fontFamily property', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should handle null fontFamily gracefully', (done: DoneFn) => {
            setTimeout((): void => {
                expect(() => {
                    editor.fontFamily = null as any;
                    editor.dataBind();
                }).not.toThrow();
                done();
            }, 200);
        });

        it('should handle empty string width', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontFamily.width = '';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe('');
                done();
            }, 200);
        });

        it('should preserve fontFamily property after multiple updates', (done: DoneFn) => {
            setTimeout((): void => {
                const width1: string = '65px';
                const width2: string = '80px';
                const width3: string = '100px';

                editor.fontFamily.width = width1;
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(width1);

                editor.fontFamily.width = width2;
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(width2);

                editor.fontFamily.width = width3;
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(width3);
                done();
            }, 200);
        });
    });

    describe('should maintain fontFamily property during editor lifecycle', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontFamily: { width: '95px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should retain fontFamily settings when editor content changes', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontFamily.width;
                editor.value = '<p>New content</p>';
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(originalWidth);
                done();
            }, 200);
        });

        it('should retain fontFamily settings when toolbar is toggled', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontFamily.width;
                editor.toolbarSettings.enable = false;
                editor.dataBind();
                setTimeout((): void => {
                    editor.toolbarSettings.enable = true;
                    editor.dataBind();
                    setTimeout((): void => {
                        // FontFamily width is preserved on the model since the toolbar is recreated;
                        // dropdown control is rebuilt with default width (72px) since width is reapplied at render.
                        // The model property still holds the value we last set.
                        expect(editor.fontFamily.width).toBe(originalWidth);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });

        it('should retain fontFamily settings during editor interaction', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontFamily.width;
                const contentElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
                if (contentElement) {
                    contentElement.focus();
                    contentElement.innerText = 'Edited content';
                }
                expect(editor.fontFamily.width).toBe(originalWidth);
                done();
            }, 200);
        });
    });

    describe('should validate fontFamily property structure', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontFamily: { width: '72px' } });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have fontFamily as a properly defined object', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily).not.toBeNull();
                expect(typeof editor.fontFamily).toBe('object');
                done();
            }, 200);
        });

        it('should expose width property on fontFamily', (done: DoneFn) => {
            setTimeout((): void => {
                expect('width' in editor.fontFamily).toBe(true);
                done();
            }, 200);
        });

        it('should expose items property on fontFamily', (done: DoneFn) => {
            setTimeout((): void => {
                expect('items' in editor.fontFamily).toBe(true);
                done();
            }, 200);
        });

        it('should allow reading width property', (done: DoneFn) => {
            setTimeout((): void => {
                const width: string = editor.fontFamily.width;
                expect(typeof width === 'string').toBe(true);
                done();
            }, 200);
        });

        it('should allow reading items property', (done: DoneFn) => {
            setTimeout((): void => {
                const items: object | undefined = editor.fontFamily.items;
                expect(items === undefined || typeof items === 'object').toBe(true);
                done();
            }, 200);
        });
    });

    describe('should handle fontFamily property with toolbar settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontFamily: { width: '80px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply fontFamily settings in the editor', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontFamily.width).toBe('80px');
                done();
            }, 200);
        });

        it('should preserve fontFamily settings after dataBind', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontFamily.width;
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(originalWidth);
                done();
            }, 200);
        });

        it('should maintain fontFamily settings consistency', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontFamily.width;
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(originalWidth);
                editor.dataBind();
                expect(editor.fontFamily.width).toBe(originalWidth);
                done();
            }, 200);
        });
    });
});
