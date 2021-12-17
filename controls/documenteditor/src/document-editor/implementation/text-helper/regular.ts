import { WCharacterFormat } from '../format/character-format';
import { DocumentHelper } from '../viewer';
import { TextSizeInfo } from '../viewer/text-helper';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Class which performs regular text measuring logic to find font height.
 */
export class Regular {

    /**
     * @private
     */
    public documentHelper: DocumentHelper;

    /**
     * Gets module name.
     *
     * @returns {string} - the module name.
     */
    private getModuleName(): string {
        return 'Regular';
    }
    /**
     * Constructor to initialize Regular module.
     *
     * @param {DocumentHelper} documentHelper - the document helper object
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    /**
     * @private
     * @param {WCharacterFormat} characterFormat - character format to apply.
     * @returns {TextSizeInfo} returns text size information.
     */
    public getHeightInternal(characterFormat: WCharacterFormat): TextSizeInfo {
        let textHeight: number = 0;
        let baselineOffset: number = 0;
        const spanElement: HTMLSpanElement = document.createElement('span');
        spanElement.innerText = 'm';
        const iframe: HTMLIFrameElement = createElement('iframe') as HTMLIFrameElement;
        document.body.appendChild(iframe);
        const innerHtml: string = '<!DOCTYPE html>'
            + '<html><head></head>'
            + '<body>'
            + '</body>'
            + '</html>';
        if (!isNullOrUndefined(iframe.contentDocument)) {
            iframe.contentDocument.open();
            iframe.contentDocument.write(innerHtml);
            iframe.contentDocument.close();
        }
        this.applyStyle(spanElement, characterFormat);
        const parentDiv: HTMLDivElement = document.createElement('div');
        parentDiv.setAttribute('style', 'display:inline-block;position:absolute;');
        const tempDiv: HTMLDivElement = document.createElement('div');
        tempDiv.setAttribute('style', 'display:inline-block;width: 1px; height: 0px;vertical-align: baseline;');
        parentDiv.appendChild(spanElement);
        parentDiv.appendChild(tempDiv);
        iframe.contentDocument.body.appendChild(parentDiv);
        textHeight = spanElement.offsetHeight;
        const textTopVal: number = spanElement.offsetTop;
        const tempDivTopVal: number = tempDiv.offsetTop;
        baselineOffset = tempDivTopVal - textTopVal;
        document.body.removeChild(iframe);
        return { 'Height': textHeight, 'BaselineOffset': baselineOffset };
    }

    public applyStyle(spanElement: HTMLSpanElement, characterFormat: WCharacterFormat): void {
        if (!isNullOrUndefined(spanElement) && !isNullOrUndefined(characterFormat)) {
            let style: string = 'white-space:nowrap;';
            if (characterFormat.fontFamily !== '') {
                style += 'font-family:' + characterFormat.fontFamily + ';';
            }
            let fontSize: number = characterFormat.fontSize;
            if (fontSize <= 0.5) {
                fontSize = 0.5;
            }
            style += 'font-size:' + fontSize.toString() + 'pt;';
            if (characterFormat.bold) {
                style += 'font-weight:bold;';
            }
            if (characterFormat.italic) {
                style += 'font-style:italic;';
            }
            spanElement.setAttribute('style', style);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
    }
}
