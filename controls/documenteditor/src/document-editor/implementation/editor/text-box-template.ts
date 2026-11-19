import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';

/**
 * Values substituted into the static text-box SFDT before paste.
 */
export interface TextBoxTemplateOptions {
    name: string;
    text: string;
    width: number;
    height: number;
    widthRelativePercent: number;
    heightRelativePercent: number;
    horizontalPosition: number;
    verticalPosition: number;
    horizontalOrigin: string;
    verticalOrigin: string;
    horizontalAlignment: string;
    verticalAlignment: string;
    horizontalRelativePercent: number;
    verticalRelativePercent: number;
    horizontalPositionMode: string;
    verticalPositionMode: string;
    textWrappingStyle: string;
    textWrappingType: string;
    distanceLeft: number;
    distanceRight: number;
    distanceTop: number;
    distanceBottom: number;
    widthScale?: number;
    heightScale?: number;
    lockAspectRatio?: boolean;
}

/**
 * Defaults taken from the Doc1-derived template in commit 137d13e7.
 *
 * @returns {TextBoxTemplateOptions} - Default text-box values.
 */
export function createDefaultTextBoxOptions(): TextBoxTemplateOptions {
    return {
        name: 'Text Box',
        text: '',
        width: 185.76,
        height: 74.88,
        widthRelativePercent: -3.4028235e38,
        heightRelativePercent: -3.4028235e38,
        horizontalPosition: -3.75,
        verticalPosition: 1.5,
        horizontalOrigin: 'Column',
        verticalOrigin: 'Paragraph',
        horizontalAlignment: 'None',
        verticalAlignment: 'None',
        horizontalRelativePercent: -3.4028235e38,
        verticalRelativePercent: -3.4028235e38,
        horizontalPositionMode: 'Absolute',
        verticalPositionMode: 'Absolute',
        textWrappingStyle: 'InFrontOfText',
        textWrappingType: 'Both',
        distanceLeft: 9,
        distanceRight: 9,
        distanceTop: 0,
        distanceBottom: 0,
        widthScale: 100,
        heightScale: 98,
        lockAspectRatio: false
    };
}

/**
 * Builds a paste-ready SFDT string from the static rectangle text-box template.
 * Substitution is structural so names and text cannot break the document JSON.
 *
 * @param {TextBoxTemplateOptions} options - Values to apply to the template.
 * @returns {string} - SFDT content for editor.paste.
 */
export function buildTextBoxSfdt(options: TextBoxTemplateOptions): string {
    const text: string = SanitizeHtmlHelper.sanitize(options.text || '');
    const lines: string[] = text.split(/\r\n|\r|\n/);
    const blocks: object[] = lines.map((line: string): object => ({
        paragraphFormat: { styleName: 'Normal' },
        characterFormat: {},
        inlines: line.length > 0 ? [{ text: line }] : []
    }));
    const document: any = {
        sections: [{
            sectionFormat: {
                pageWidth: 612,
                pageHeight: 792,
                leftMargin: 72,
                rightMargin: 72,
                topMargin: 72,
                bottomMargin: 72,
                differentFirstPage: false,
                differentOddAndEvenPages: false,
                headerDistance: 36,
                footerDistance: 36,
                bidi: false
            },
            blocks: [{
                paragraphFormat: { styleName: 'Normal' },
                characterFormat: {},
                inlines: [{
                    shapeId: 0,
                    name: options.name || 'Text Box',
                    visible: true,
                    is2007Shape: false,
                    autoShapeType: 'Rectangle',
                    width: options.width,
                    height: options.height,
                    widthScale: isNaN(options.widthScale) ? 100 : options.widthScale,
                    heightScale: isNaN(options.heightScale) ? 100 : options.heightScale,
                    rotation: 0,
                    widthRelativePercent: options.widthRelativePercent,
                    heightRelativePercent: options.heightRelativePercent,
                    horizontalRelativePercent: isNaN(options.horizontalRelativePercent)
                        ? -3.4028235e38 : options.horizontalRelativePercent,
                    verticalRelativePercent: isNaN(options.verticalRelativePercent)
                        ? -3.4028235e38 : options.verticalRelativePercent,
                    horizontalPosition: options.horizontalPosition,
                    verticalPosition: options.verticalPosition,
                    horizontalOrigin: options.horizontalOrigin,
                    verticalOrigin: options.verticalOrigin,
                    horizontalAlignment: options.horizontalAlignment || 'None',
                    verticalAlignment: options.verticalAlignment || 'None',
                    textWrappingStyle: options.textWrappingStyle,
                    textWrappingType: options.textWrappingType,
                    zOrderPosition: 251659264,
                    allowOverlap: true,
                    layoutInCell: true,
                    lockAnchor: false,
                    distanceLeft: options.distanceLeft,
                    distanceRight: options.distanceRight,
                    distanceTop: options.distanceTop,
                    distanceBottom: options.distanceBottom,
                    lineFromXPosition: 0,
                    lineFromYPosition: 0,
                    lineToXPosition: 0,
                    lineToYPosition: 0,
                    leftMargin: 0,
                    topMargin: 0,
                    coordinateSize: '0,0',
                    coordinateXOrigin: 0,
                    coordinateYOrigin: 0,
                    lineFormat: {
                        lineFormatType: 'Solid',
                        weight: 0.5,
                        color: '#000000',
                        line: true
                    },
                    fillFormat: {
                        color: '#ffffff',
                        fill: true,
                        fillType: 'FillSolid'
                    },
                    textFrame: {
                        textVerticalAlignment: 'Top',
                        leftMargin: 7.2,
                        rightMargin: 7.2,
                        topMargin: 3.6,
                        bottomMargin: 3.6,
                        blocks: blocks
                    }
                }]
            }],
            headersFooters: {}
        }],
        characterFormat: {
            bold: false,
            italic: false,
            fontSize: 11,
            fontFamily: 'Calibri',
            underline: 'None',
            strikethrough: 'None',
            baselineAlignment: 'Normal',
            highlightColor: 'NoColor',
            fontColor: '#00000000',
            bidi: false
        },
        paragraphFormat: {
            leftIndent: 0,
            rightIndent: 0,
            firstLineIndent: 0,
            beforeSpacing: 0,
            afterSpacing: 8,
            lineSpacing: 1.0791666507720947,
            lineSpacingType: 'Multiple',
            textAlignment: 'Left',
            outlineLevel: 'BodyText'
        },
        defaultTabWidth: 36,
        formatting: false,
        protectionType: 'NoProtection',
        enforcement: false,
        dontUseHtmlParagraphAutoSpacing: false,
        formFieldShading: true,
        compatibilityMode: 'Word2013',
        styles: [{
            name: 'Normal',
            type: 'Paragraph',
            paragraphFormat: {
                lineSpacing: 1.149999976158142,
                lineSpacingType: 'Multiple',
                listFormat: {}
            },
            characterFormat: {
                fontFamily: 'Calibri',
                fontSize: 11
            },
            next: 'Normal'
        }],
        lists: [],
        abstractLists: [],
        comments: [],
        revisions: [],
        customXml: []
    };
    return JSON.stringify(document);
}
