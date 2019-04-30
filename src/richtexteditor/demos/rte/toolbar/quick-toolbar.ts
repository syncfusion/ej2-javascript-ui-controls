// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, RendererFactory, QuickToolbar, IRenderer, HtmlEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor, QuickToolbar);

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments']
    },
    value: document.getElementById("trgContent").innerHTML
});
defaultRTE.appendTo("#defaultRTE");

let iframeRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments']
    },
    iframeSettings: {
        enable: true
    },
    value: document.getElementById("trgContent").innerHTML
});
iframeRTE.appendTo("#iframeRTE");

let renderFactory: RendererFactory = defaultRTE.serviceLocator.getService<RendererFactory>('rendererFactory');
let divQuickTBarModule: IRenderer = defaultRTE.quickToolbarModule;

let renderFactory2: RendererFactory = iframeRTE.serviceLocator.getService<RendererFactory>('rendererFactory');
let iframeQuickTBarModule: IRenderer = iframeRTE.quickToolbarModule;

function hideAllPopup1(): void {
    if (divQuickTBarModule.textQTBar) { divQuickTBarModule.textQTBar.hidePopup(); }
    if (divQuickTBarModule.imageQTBar) { divQuickTBarModule.imageQTBar.hidePopup(); }
    if (divQuickTBarModule.linkQTBar) { divQuickTBarModule.linkQTBar.hidePopup(); }
}

function hideAllPopup2(): void {
    if (iframeQuickTBarModule.textQTBar) { iframeQuickTBarModule.textQTBar.hidePopup(); }
    if (iframeQuickTBarModule.imageQTBar) { iframeQuickTBarModule.imageQTBar.hidePopup(); }
    if (iframeQuickTBarModule.linkQTBar) { iframeQuickTBarModule.linkQTBar.hidePopup(); }
}

defaultRTE.getContent().addEventListener('mouseup', function(e: any): void {
    hideAllPopup1();
    switch (e.target.tagName) {
        case 'P':
            divQuickTBarModule.textQTBar.showPopup(e.pageX, e.pageY, e.target);
            break;
        case 'IMG':
            divQuickTBarModule.imageQTBar.showPopup(e.pageX, e.pageY, e.target);
            break;
        case 'A':
            divQuickTBarModule.linkQTBar.showPopup(e.pageX, e.pageY, e.target);
            break;
    }
});

let iframe: HTMLIFrameElement = <HTMLIFrameElement>document.querySelector('iframe.e-rte-content');
let iframeBody: HTMLElement = iframe.contentDocument.body;
iframeBody.addEventListener('mouseup', function(e: any): void {
    hideAllPopup2();
    let pageY: number = window.pageYOffset + iframeRTE.element.getBoundingClientRect().top + e.clientY;
    switch (e.target.tagName) {
        case 'P':
            iframeQuickTBarModule.textQTBar.showPopup(e.pageX, pageY, e.target);
            break;
        case 'IMG':
            iframeQuickTBarModule.imageQTBar.showPopup(e.pageX, pageY, e.target);
            break;
        case 'A':
            iframeQuickTBarModule.linkQTBar.showPopup(e.pageX, pageY, e.target);
            break;
    }
});

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};