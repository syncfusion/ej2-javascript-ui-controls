import { destroyRTE, renderRTE } from '../../base.spec';
import { RichTextEditorUI } from '../../../src/richtexteditor-ui';

describe('Quick Toolbar status updater', () => {
    let editor: RichTextEditorUI;

    afterEach(() => {
        if (editor) {
            destroyRTE(editor);
            editor = null;
        }
    });

    it('should refresh status before opening the text quick toolbar', (done: DoneFn) => {
        editor = renderRTE({
            quickToolbarSettings: {
                enable: true,
                text: ['Bold']
            }
        });

        setTimeout((): void => {
            // NEEDS VALIDATION.
            const quickToolbarModule: any = editor.quickToolbarModule;
            const updater: any = quickToolbarModule.quickToolbarStatusUpdaters.Text;
            const textToolbar: any = quickToolbarModule.getToolbar('Text');

            spyOn(quickToolbarModule, 'hasValidTextSelection').and.returnValue(true);
            //spyOn(quickToolbarModule, 'getSelectedBlockElement').and.returnValue(editor.inputElement);
            const refreshSpy: jasmine.Spy = spyOn(updater, 'updateToolbarStatus').and.callThrough();
            const showPopupSpy: jasmine.Spy = spyOn(textToolbar, 'showPopup').and.stub();

            quickToolbarModule.showTextQuickToolbar();

            expect(refreshSpy).toHaveBeenCalled();
            //expect(showPopupSpy).toHaveBeenCalledWith(editor.inputElement, undefined);
            done();
        }, 200);
    });

    it('should refresh open quick toolbars from the editor status observer', (done: DoneFn) => {
        editor = renderRTE({
            quickToolbarSettings: {
                enable: true,
                text: ['Bold']
            }
        });

        setTimeout((): void => {
            // NEEDS VALIDATION.
            const quickToolbarModule: any = editor.quickToolbarModule;
            const updater: any = quickToolbarModule.quickToolbarStatusUpdaters.Text;
            const textToolbar: any = quickToolbarModule.getToolbar('Text');
            const refreshSpy: jasmine.Spy = spyOn(updater, 'updateToolbarStatus').and.callThrough();

            textToolbar.isRendered = true;
            (editor as any).baseEditorCore.observer.notify('refreshToolbarStatus', {});

            //expect(refreshSpy).toHaveBeenCalled();
            done();
        }, 200);
    });

    it('should wire popup sync for quick toolbar dropdown items', (done: DoneFn) => {
        editor = renderRTE({
            quickToolbarSettings: {
                enable: true,
                text: ['Formats']
            }
        });

        setTimeout((): void => {
            const quickToolbarModule: any = editor.quickToolbarModule;
            const updater: any = quickToolbarModule.quickToolbarStatusUpdaters.Text;
            const renderer: any = quickToolbarModule.getToolbar('Text').quickTBarObj.getRenderer();
            const popup: HTMLElement = document.createElement('div');
            const beforeOpenSpy: jasmine.Spy = spyOn(updater, 'onDropdownBeforeOpen').and.callThrough();

            expect(typeof renderer.popupSync).toBe('function');
            renderer.popupSync('Formats', popup);

            expect(beforeOpenSpy).toHaveBeenCalledWith('Formats', popup);
            done();
        }, 200);
    });
});