import { destroyRTE, renderRTE } from '../../base.spec';
import { BlurredEventArgs, ChangeEventArgs, FocusedEventArgs } from '../../../src/richtexteditor-ui/interface';
import { RichTextEditorUI } from '../../../src/richtexteditor-ui/richtexteditor-ui';

describe('RichTextEditor lifecycle events', () => {
    describe('created event', () => {
        let editor: RichTextEditorUI;
        let isCreated: boolean = false;

        beforeEach(() => {
            editor = renderRTE({
                created: () => {
                    isCreated = true;
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should trigger created event on initialization', () => {
            expect(isCreated).toBe(true);
        });
    });

    describe('destroyed event', () => {
        let editor: RichTextEditorUI;
        let isDestroyed: boolean = false;
        beforeEach(() => {
            editor = renderRTE({
                destroyed: () => {
                    isDestroyed = true;
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should trigger destroyed event when destroyed', () => {
            destroyRTE(editor);
            expect(isDestroyed).toBe(true);
        });
    });

    describe('focused event', () => {
        let editor: RichTextEditorUI;
        let focusedArgs: FocusedEventArgs | undefined;

        beforeEach(() => {
            editor = renderRTE({
                focused: (args: FocusedEventArgs) => {
                    focusedArgs = args;
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should trigger focused event when the editor receives focus', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            inputElement.dispatchEvent(new FocusEvent('focusin', { bubbles: true, cancelable: true }));
            expect(focusedArgs).toBeDefined();
            expect(focusedArgs.name).toBe('focused');
            expect(focusedArgs.event).toBeDefined();
        });
    });

    describe('blurred event', () => {
        let editor: RichTextEditorUI;
        let blurredArgs: BlurredEventArgs | undefined;

        beforeEach(() => {
            editor = renderRTE({
                blurred: (args: BlurredEventArgs) => {
                    blurredArgs = args;
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should trigger blurred event when the editor loses focus', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            inputElement.dispatchEvent(new FocusEvent('focusout', { bubbles: true, cancelable: true }));
            expect(blurredArgs).toBeDefined();
            expect(blurredArgs.name).toBe('blurred');
            expect(blurredArgs.event).toBeDefined();
        });
    });
});
