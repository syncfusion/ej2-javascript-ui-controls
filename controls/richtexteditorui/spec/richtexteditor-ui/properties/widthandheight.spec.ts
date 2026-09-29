import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('Width properties', () => {
    describe('should apply the default width during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply the default width during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('100%');
        });
    });

    describe('should apply string width during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ width: '320px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply string width during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('320px');
        });
    });

    describe('should convert numeric width to pixel units', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ width: 420 });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should convert numeric width to pixel units', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('420px');
        });
    });

    describe('should respect auto width during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ width: 'auto' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should respect auto width during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('auto');
        });
    });

    describe('should apply width from htmlAttributes when property is not specified', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ htmlAttributes: { width: '480px' } });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply width from htmlAttributes when property is not specified', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('480px');
        });
    });

    describe('should let width property override htmlAttributes style width', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                width: '300px',
                htmlAttributes: { style: 'width: 500px;' }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should let width property override htmlAttributes style width', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('300px');
        });
    });

    describe('should update width when property changes after initialization', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ width: '200px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update width when property changes after initialization', () => {
            editor.width = '75%';
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('75%');
        });
    });

    describe('should ignore undefined width updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ width: '250px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should ignore undefined width updates', () => {
            editor.width = '250px';
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.width).toBe('250px');
        });
    });
});

describe('Height properties', () => {
    describe('should apply the default height during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply the default height during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('auto');
        });
    });

    describe('should apply string height during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ height: '240px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply string height during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('240px');
        });
    });

    describe('should convert numeric height to pixel units', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ height: 180 });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should convert numeric height to pixel units', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('180px');
        });
    });

    describe('should respect auto height during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ height: 'auto' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should respect auto height during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('auto');
        });
    });

    describe('should apply height from htmlAttributes when property is not specified', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ htmlAttributes: { height: '180px' } });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply height from htmlAttributes when property is not specified', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('180px');
        });
    });

    describe('should let height property override htmlAttributes style height', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                height: '200px',
                htmlAttributes: { style: 'height: 400px;' }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should let height property override htmlAttributes style height', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('200px');
        });
    });

    describe('should update height when property changes after initialization', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ height: '150px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update height when property changes after initialization', () => {
            editor.onPropertyChanged({ height: 400 } as never, { height: '150px' } as never);
            editor.height = '400px';
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('400px');
        });
    });

    describe('should ignore undefined height updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ height: '140px' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should ignore undefined height updates', () => {
            editor.height = undefined;
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.style.height).toBe('140px');
        });
    });
});
