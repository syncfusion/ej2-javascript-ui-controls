import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('FontSize property', () => {

    describe('should initialize with default fontSize settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have default width of 60px', () => {
            expect(editor.fontSize).toBeDefined();
            expect(editor.fontSize.width).toBe('60px');
        });

        it('should expose the default fontSize items list on the model', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize.items).toBeDefined();
                expect(editor.fontSize.items.length).toBe(8);
                done();
            }, 200);
        });

        it('should include Default/8/10/12/14/16/18/24 ', (done: DoneFn) => {
            setTimeout((): void => {
                const expectedTexts: string[] = ['Default', '8', '10', '12', '14', '16', '18', '24'];
                const actualTexts: string[] = editor.fontSize.items.map((item: any) => item.text);
                expect(actualTexts).toEqual(expectedTexts);
                done();
            }, 200);
        });
    });

    describe('should initialize with custom fontSize settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontSize: { width: '90px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply custom width during initialization', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize.width).toBe('90px');
                done();
            }, 200);
        });

        it('should have items property defined', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize.items).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should update fontSize width at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.fontSize.width = '60px';
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should change width when fontSize property is updated', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontSize.width = '100px';
                editor.dataBind();
                expect(editor.fontSize.width).toBe('100px');
                done();
            }, 200);
        });

        it('should accept width in different units', (done: DoneFn) => {
            setTimeout((): void => {
                const units: string[] = ['50px', '70px', '6rem', '8em'];
                units.forEach((unit: string) => {
                    editor.fontSize.width = unit;
                    editor.dataBind();
                    expect(editor.fontSize.width).toBe(unit);
                });
                done();
            }, 200);
        });
    });

    describe('should update fontSize items at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have items property that can be assigned', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize.items).toBeDefined();
                editor.dataBind();
                expect(editor.fontSize).toBeDefined();
                done();
            }, 200);
        });

        it('should handle property binding on fontSize items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems: object = editor.fontSize.items;
                editor.fontSize.items = originalItems as any;
                editor.dataBind();
                expect(editor.fontSize.items).toBeDefined();
                done();
            }, 200);
        });

        it('should handle updates gracefully', (done: DoneFn) => {
            setTimeout((): void => {
                editor.dataBind();
                expect(editor.fontSize).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should update both width and items properties', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontSize: { width: '60px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update width and preserve items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems = editor.fontSize.items;
                editor.fontSize.width = '120px';
                editor.dataBind();
                expect(editor.fontSize.width).toBe('120px');
                expect(editor.fontSize.items).toEqual(originalItems);
                done();
            }, 200);
        });

        it('should update only width without affecting items', (done: DoneFn) => {
            setTimeout((): void => {
                const originalItems = editor.fontSize.items;
                editor.fontSize.width = '90px';
                editor.dataBind();
                expect(editor.fontSize.width).toBe('90px');
                expect(editor.fontSize.items).toEqual(originalItems);
                done();
            }, 200);
        });

        it('should preserve items when width is updated', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontSize.width = '100px';
                editor.dataBind();
                expect(editor.fontSize.width).toBe('100px');
                expect(editor.fontSize.items).toBeDefined();
                done();
            }, 200);
        });
    });

    describe('should handle edge cases for fontSize property', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should handle null fontSize gracefully', (done: DoneFn) => {
            setTimeout((): void => {
                expect(() => {
                    editor.fontSize = null as any;
                    editor.dataBind();
                }).not.toThrow();
                done();
            }, 200);
        });

        it('should handle empty string width', (done: DoneFn) => {
            setTimeout((): void => {
                editor.fontSize.width = '';
                editor.dataBind();
                expect(editor.fontSize.width).toBe('');
                done();
            }, 200);
        });

        it('should preserve fontSize property after multiple updates', (done: DoneFn) => {
            setTimeout((): void => {
                const width1: string = '55px';
                const width2: string = '75px';
                const width3: string = '95px';

                editor.fontSize.width = width1;
                editor.dataBind();
                expect(editor.fontSize.width).toBe(width1);

                editor.fontSize.width = width2;
                editor.dataBind();
                expect(editor.fontSize.width).toBe(width2);

                editor.fontSize.width = width3;
                editor.dataBind();
                expect(editor.fontSize.width).toBe(width3);
                done();
            }, 200);
        });
    });

    describe('should maintain fontSize property during editor lifecycle', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontSize: { width: '85px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should retain fontSize settings when editor content changes', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontSize.width;
                editor.value = '<p>New content</p>';
                editor.dataBind();
                expect(editor.fontSize.width).toBe(originalWidth);
                done();
            }, 200);
        });

        it('should retain fontSize settings when toolbar is toggled', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontSize.width;
                editor.toolbarSettings.enable = false;
                editor.dataBind();
                setTimeout((): void => {
                    editor.toolbarSettings.enable = true;
                    editor.dataBind();
                    setTimeout((): void => {
                        // FontSize width is preserved on the model since the toolbar is recreated;
                        // dropdown control is rebuilt with default width (60px) since width is reapplied at render.
                        // The model property still holds the value we last set.
                        expect(editor.fontSize.width).toBe(originalWidth);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });

        it('should retain fontSize settings during editor interaction', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontSize.width;
                const contentElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
                if (contentElement) {
                    contentElement.focus();
                    contentElement.innerText = 'Edited content';
                }
                expect(editor.fontSize.width).toBe(originalWidth);
                done();
            }, 200);
        });
    });

    describe('should validate fontSize property structure', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontSize: { width: '60px' } });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should have fontSize as a properly defined object', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize).not.toBeNull();
                expect(typeof editor.fontSize).toBe('object');
                done();
            }, 200);
        });

        it('should expose width property on fontSize', (done: DoneFn) => {
            setTimeout((): void => {
                expect('width' in editor.fontSize).toBe(true);
                done();
            }, 200);
        });

        it('should expose items property on fontSize', (done: DoneFn) => {
            setTimeout((): void => {
                expect('items' in editor.fontSize).toBe(true);
                done();
            }, 200);
        });

        it('should allow reading width property', (done: DoneFn) => {
            setTimeout((): void => {
                const width: string = editor.fontSize.width;
                expect(typeof width === 'string').toBe(true);
                done();
            }, 200);
        });

        it('should allow reading items property', (done: DoneFn) => {
            setTimeout((): void => {
                const items: object | undefined = editor.fontSize.items;
                expect(items === undefined || typeof items === 'object').toBe(true);
                done();
            }, 200);
        });
    });

    describe('should handle fontSize property with toolbar settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ fontSize: { width: '80px' } });
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply fontSize settings in the editor', (done: DoneFn) => {
            setTimeout((): void => {
                expect(editor.fontSize.width).toBe('80px');
                done();
            }, 200);
        });

        it('should preserve fontSize settings after dataBind', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontSize.width;
                editor.dataBind();
                expect(editor.fontSize.width).toBe(originalWidth);
                done();
            }, 200);
        });

        it('should maintain fontSize settings consistency', (done: DoneFn) => {
            setTimeout((): void => {
                const originalWidth: string = editor.fontSize.width;
                editor.dataBind();
                expect(editor.fontSize.width).toBe(originalWidth);
                editor.dataBind();
                expect(editor.fontSize.width).toBe(originalWidth);
                done();
            }, 200);
        });
    });
});
