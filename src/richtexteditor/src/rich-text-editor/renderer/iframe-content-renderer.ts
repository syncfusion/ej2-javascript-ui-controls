import { IRichTextEditor } from '../base/interface';
import { ContentRender } from '../renderer/content-renderer';

/* tslint:disable */
const IFRAMEHEADER: string = `
<!DOCTYPE html> 
    <html>
         <head>
            <meta charset='utf-8' /> 
            <style>
                @charset "UTF-8";
                body {
                    font-family: "Roboto", sans-serif;
                    font-size: 14px;
                }
                html, body{height: 100%;margin: 0;}
                body.e-cursor{cursor:default}
                span.e-selected-node	{background-color: #939393;color: white;}
                span.e-selected-node.e-highlight {background-color: #1d9dd8;}
                body{color:#333;word-wrap:break-word;padding: 8px;box-sizing: border-box;}
                .e-rte-image {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-img-caption { display: inline-block; float: none; margin: 5px auto; max-width: 100%;position: relative;}
                .e-img-caption.e-caption-inline {display: inline-block;float: none;margin: 5px auto;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));position: relativetext-align: center;vertical-align: bottom;}
                .e-img-inner {box-sizing: border-box;display: block;font-size: 16px;font-weight: initial;margin: auto;opacity: .9;text-align: center;width: 100%;}
                .e-img-wrap {display: inline-block;margin: auto;padding: 0;text-align: center;width: 100%;}
                .e-imgleft {float: left;margin: 0 5px 0 0;text-align: left;}
                .e-imgright {float: right;margin: 0 0 0 5px;text-align: right;}
                .e-imgcenter {cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-control img:not(.e-resize) {border: 2px solid transparent; z-index: 1000}
                .e-imginline {display: inline-block;float: none;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));vertical-align: bottom;}
                .e-imgbreak {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-rte-image.e-img-focus:not(.e-resize) {border: solid 2px #4a90e2;}
                img::selection { background: transparent;color: transparent;}
                span.e-rte-imageboxmark {  width: 10px; height: 10px; position: absolute; display: block; background: #4a90e2; border: 1px solid #fff; z-index: 1000;}
                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }
                .e-mob-rte span.e-rte-imageboxmark { background: #fff; border: 1px solid #4a90e2; border-radius: 15px; height: 20px; width: 20px; }
                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }
                .e-rte-content .e-content img.e-resize { z-index: 1000; }
                .e-img-caption .e-rte-image.e-imgright, .e-img-caption .e-rte-image.e-imgleft { float: none; margin: 0;}
                body{box-sizing: border-box;min-height: 100px;outline: 0 solid transparent;overflow-x: auto;padding: 16px;position: relative;text-align: inherit;z-index: 2;}
                p{margin: 0 0 10px;margin-bottom: 10px;}
                li{margin-bottom: 10px;}
                h1{font-size: 2.17em;font-weight: 400;line-height: 1;margin: 10px 0;}
                h2{font-size: 1.74em;font-weight: 400;margin: 10px 0;}
                h3{font-size: 1.31em;font-weight: 400;margin: 10px 0;}
                h4{font-size: 1em;font-weight: 400;margin: 0;}
                h5{font-size: 00.8em;font-weight: 400;margin: 0;}
                h6{font-size: 00.65em;font-weight: 400;margin: 0;}
                blockquote{margin: 10px 0;margin-left: 0;padding-left: 5px;border-left: solid 2px #5c5c5c;}
                pre{background-color: inherit;border: 0;border-radius: 0;color: #333;font-size: inherit;line-height: inherit;margin: 0 0 10px;overflow: visible;padding: 0;white-space: pre-wrap;word-break: inherit;word-wrap: break-word;}
                strong, b{font-weight: 700;}
                a{text-decoration: none;user-select: auto;}
                a:hover{text-decoration: underline;};
                p:last-child, pre:last-child, blockquote:last-child{margin-bottom: 0;}
                h3+h4, h4+h5, h5+h6{margin-top: 00.6em;}
                ul:last-child{margin-bottom: 0;}
                table.e-rte-table { border-collapse: collapse; empty-cells: show;}
                table.e-rte-table td,table.e-rte-table th {background-color: #ffffff;border: 1px solid #BDBDBD; height: 20px; vertical-align: middle;}
                table.e-alternate-border tbody tr:nth-child(2n) {background-color: #F5F5F5;}
                table.e-rte-table th {background-color: #E0E0E0;}
                table.e-dashed-border td,table.e-dashed-border th { border: 1px dashed #BDBDBD} 
                table.e-rte-table .e-cell-select {border: 1px double #4a90e2;}
                span.e-table-box { cursor: nwse-resize; display: block; height: 10px; position: absolute; width: 10px; }
                span.e-table-box.e-rmob {height: 14px;width: 14px;}
                .e-row-resize, .e-column-resize { background-color: transparent; background-repeat: repeat; bottom: 0;cursor: col-resize;height: 1px;overflow: visible;position: absolute;width: 1px; }
                .e-row-resize { cursor: row-resize; height: 1px;}
                .e-table-rhelper { cursor: col-resize; opacity: .87;position: absolute;}
                .e-table-rhelper.e-column-helper { width: 1px; }
                .e-table-rhelper.e-row-helper {height: 1px;}
                .e-reicon::before { border-bottom: 6px solid transparent; border-right: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; position: absolute; right: 4px; top: 4px; width: 20px; }
                .e-reicon::after { border-bottom: 6px solid transparent; border-left: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; left: 4px; position: absolute; top: 4px; width: 20px; z-index: 3; }
                .e-row-helper.e-reicon::after { top: 10px; transform: rotate(90deg); }
                .e-row-helper.e-reicon::before { left: 4px; top: -20px; transform: rotate(90deg); }
                span.e-table-box { background-color: #ffffff; border: 1px solid #BDBDBD; }
                span.e-table-box.e-rbox-select { background-color: #BDBDBD; border: 1px solid #BDBDBD; }
                .e-table-rhelper { background-color: #4a90e2;}
            </style>
        </head>`;
/* tslint:enable */

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
export class IframeContentRender extends ContentRender {
    /**
     * The function is used to render RichTextEditor iframe    
     */

    public renderPanel(): void {
        let rteObj: IRichTextEditor = this.parent;
        let rteContent: string = (rteObj.value !== null && rteObj.value !== '') ? rteObj.value : '<p><br/></p>';
        let iFrameBodyContent: string = '<body spellcheck="false" autocorrect="off" contenteditable="true">' +
            rteContent + '</body></html>';
        let iFrameContent: string = IFRAMEHEADER + iFrameBodyContent;
        let iframe: HTMLIFrameElement = <HTMLIFrameElement>this.parent.createElement(
            'iframe',
            {
                innerHTML: iFrameContent,
                id: this.parent.getID() + '_rte-view',
                className: 'e-rte-content',
                styles: 'display:block;'
            });
        this.setPanel(iframe);
        rteObj.element.appendChild(iframe);
        iframe.contentDocument.body.id = this.parent.getID() + '_rte-edit-view';
        iframe.contentDocument.open();
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
    }
    /**
     * Get the editable element of RichTextEditor
     * @return {Element} 
     */
    public getEditPanel(): Element {
        return (this.contentPanel as HTMLIFrameElement).contentDocument.body;
    }
    /**
     * Get the document of RichTextEditor
     * @param  {Document}   
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }

}