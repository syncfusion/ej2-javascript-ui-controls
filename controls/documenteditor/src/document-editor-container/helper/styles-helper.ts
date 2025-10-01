import { L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary, DocumentEditor } from '../../document-editor/index';
import { RibbonGalleryItemModel } from '@syncfusion/ej2-ribbon';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { StyleInfo } from './ribbon-interfaces';

/**
 * Helper class for style operations in Document Editor
 * @private
 */
export class StylesHelper {
    /**
     * Get style items for gallery
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {L10n} localObj - Localization object
     * @returns {RibbonGalleryItemModel[]} Array of style gallery items
     */
    public static getStyleItems(documentEditor: DocumentEditor, localObj: L10n): RibbonGalleryItemModel[] {
        const styles: RibbonGalleryItemModel[] = [];

        // Get styles from document's stylesMap
        if (documentEditor && documentEditor.documentHelper && documentEditor.documentHelper.stylesMap) {
            const stylesMap: Dictionary<string, any[]> = documentEditor.documentHelper.stylesMap;

            // First add important default styles in proper order
            const defaultStyleNames: string[] = [
                'Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4',
                'Title', 'Subtitle', 'Quote', 'Emphasis', 'Strong'
            ];

            // Process styles by type: Paragraph, Character, and Linked
            const paragraphStyles: any[] = stylesMap.get('Paragraph') || [];
            const characterStyles: any[] = stylesMap.get('Character') || [];
            const linkedStyles: any[] = stylesMap.get('Linked') || [];

            // Create lookup maps for faster access
            const stylesMaps: {
                paragraphStyleMap: { [key: string]: any };
                linkedStyleMap: { [key: string]: any };
                characterStyleMap: { [key: string]: any };
            } = StylesHelper.createStyleMaps(paragraphStyles, linkedStyles, characterStyles);

            // Add default styles first in the specified order
            StylesHelper.addDefaultStyles(styles, defaultStyleNames, stylesMaps, localObj);

            // Track added styles to avoid duplicates
            const addedStylesMap: { [key: string]: boolean } = {};
            /* eslint-disable */
            defaultStyleNames.forEach((name: string) => { if (localObj.getConstant(name) !== '') addedStylesMap[localObj.getConstant(name)] = true; });
            // defaultStyleNames.forEach((name: string) => {
            //     Object.prototype.hasOwnProperty.call(addedStylesMap, name) || (addedStylesMap[name] = true);
            // });

            // Add remaining styles
            StylesHelper.addRemainingStyles(styles, paragraphStyles, linkedStyles, addedStylesMap);
        }

        // If no styles found, provide some defaults
        if (styles.length === 0) {
            styles.push({
                content: localObj.getConstant('Normal'),
                htmlAttributes: {
                    style: 'font-family: Calibri; font-size: 11pt;',
                    title: localObj.getConstant('Normal')
                }
            });

            styles.push({
                content: localObj.getConstant('Heading 1'),
                htmlAttributes: {
                    style: 'font-family: "Calibri Light"; font-size: 16pt; color: #2F5496; font-weight: bold;',
                    title: localObj.getConstant('Heading 1')
                }
            });
        }

        return styles;
    }

    private static createStyleMaps(paragraphStyles: any[], linkedStyles: any[], characterStyles: any[]): {
        paragraphStyleMap: { [key: string]: any };
        linkedStyleMap: { [key: string]: any };
        characterStyleMap: { [key: string]: any };
    } {
        const createStyleMap: (styles: StyleInfo[]) => { [key: string]: StyleInfo } = (styles: StyleInfo[]) => {
            const map: { [key: string]: StyleInfo } = {};
            for (let i: number = 0; i < styles.length; i++) {
                map[styles[parseInt(i.toString(), 10)].StyleName] = styles[parseInt(i.toString(), 10)];
            }
            return map;
        };

        return {
            paragraphStyleMap: createStyleMap(paragraphStyles),
            linkedStyleMap: createStyleMap(linkedStyles),
            characterStyleMap: createStyleMap(characterStyles)
        };
    }


    private static addDefaultStyles(
        styles: RibbonGalleryItemModel[],
        defaultStyleNames: string[],
        stylesMaps: {
            paragraphStyleMap: { [key: string]: any };
            linkedStyleMap: { [key: string]: any };
            characterStyleMap: { [key: string]: any };
        },
        localObj: L10n
    ): void {
        const { paragraphStyleMap, linkedStyleMap, characterStyleMap } = stylesMaps;

        for (let i: number = 0; i < defaultStyleNames.length; i++) {
            const styleName: string = localObj.getConstant(defaultStyleNames[parseInt(i.toString(), 10)]);

            // Direct lookup is much faster than looping
            const styleInfo: any = paragraphStyleMap[styleName] ||
                linkedStyleMap[styleName] ||
                characterStyleMap[styleName];

            if (styleInfo) {
                styles.push({
                    content: styleName,
                    htmlAttributes: {
                        style: styleInfo.Style,
                        title: styleName
                    }
                });
            }
        }
    }

    private static addRemainingStyles(
        styles: RibbonGalleryItemModel[],
        paragraphStyles: any[],
        linkedStyles: any[],
        addedStylesMap: { [key: string]: boolean }
    ): void {
        // Add remaining paragraph styles
        for (let i: number = 0; i < paragraphStyles.length; i++) {
            const style: any = paragraphStyles[parseInt(i.toString(), 10)];
            if (!addedStylesMap[style.StyleName]) {
                styles.push({
                    content: style.StyleName,
                    htmlAttributes: {
                        style: style.Style,
                        title: style.StyleName
                    }
                });
                addedStylesMap[style.StyleName] = true;
            }
        }

        // Add linked styles
        for (let i: number = 0; i < linkedStyles.length; i++) {
            const style: any = linkedStyles[parseInt(i.toString(), 10)];
            if (!addedStylesMap[style.StyleName]) {
                styles.push({
                    content: style.StyleName,
                    htmlAttributes: {
                        style: style.Style,
                        title: style.StyleName
                    }
                });
                addedStylesMap[style.StyleName] = true;
            }
        }
    }

    /**
     * Get the current style name from selection
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {string} The current style name
     */
    public static getCurrentStyleName(documentEditor: DocumentEditor, localObj: L10n): string {
        if (!documentEditor || !documentEditor.selection) {
            return 'Normal';
        }

        const characterFormat: any = documentEditor.selection.characterFormat;
        const paragraphFormat: any = documentEditor.selection.paragraphFormat;
        
        if (paragraphFormat && paragraphFormat.styleName) {
            const localeValue: string = localObj.getConstant(paragraphFormat.styleName);
            return (isNullOrUndefined(localeValue) || localeValue == '') ? paragraphFormat.styleName : localeValue;
        } else if (characterFormat && characterFormat.styleName &&
            characterFormat.styleName !== 'Default Paragraph Font') {
            return localObj.getConstant(characterFormat.styleName);
        }

        return 'Normal';
    }

    /**
     * Find the index of a style in the gallery items
     *
     * @param {string} styleName - Style name to find
     * @param {RibbonGalleryItemModel[]} items - Gallery items array
     * @returns {number} Index of the style or -1 if not found
     */
    public static findStyleIndex(styleName: string, items: RibbonGalleryItemModel[]): number {
        if (!items) {
            return -1;
        }

        for (let i: number = 0; i < items.length; i++) {
            if (items[parseInt(i.toString(), 10)] && items[parseInt(i.toString(), 10)].content === styleName) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Apply a style to the document
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} styleName - Style name to apply
     * @returns {void}
     */
    public static applyStyle(documentEditor: DocumentEditor, styleName: string): void {
        if (!documentEditor.isReadOnly && documentEditor.editorModule) {
            documentEditor.editorModule.applyStyle(styleName, true);
        }
    }
    /**
     * Update style names in ComboBox
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {any} style - ComboBox instance
     * @param {L10n} localObj - Localization object
     * @returns {string} Current style name
     */
    public static updateStyleNames(documentEditor: DocumentEditor, style: any, localObj: L10n): string {
        const styleName: string = !isNullOrUndefined(style.itemData) ? style.itemData.StyleName : undefined;
        const stylesMap: any = documentEditor.documentHelper.stylesMap;
        const paraStyles: any[] = stylesMap.get('Paragraph') ? stylesMap.get('Paragraph') : [];
        const linkedStyles: any[] = stylesMap.get('Linked') ? stylesMap.get('Linked') : [];
        const charStyles: any[] = stylesMap.get('Character') ? stylesMap.get('Character') : [];

        // Filter out character styles that are part of linked styles
        for (const linkedStyle of linkedStyles) {
            for (let i: number = 0; i < charStyles.length; i++) {
                const charStyle: any = charStyles[parseInt(i.toString(), 10)];
                if (linkedStyle['StyleName'] + ' Char' === charStyle['StyleName']) {
                    charStyles.splice(i, 1);
                    break;
                }
            }
        }

        // Update ComboBox data source
        style.dataSource = paraStyles.concat(linkedStyles, charStyles);

        return styleName;
    }
    /* eslint-enable */
    /**
     * Apply style value from ComboBox selection
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {any} args - ComboBox change event arguments
     * @returns {void}
     */
    public static applyStyleValue(documentEditor: DocumentEditor, args: any): void {
        if (!documentEditor.isReadOnly && documentEditor.editorModule) {
            const styleName: string = documentEditor.stylesDialogModule.getStyleName(
                SanitizeHtmlHelper.sanitize(args.itemData.StyleName)
            );

            if (!isNullOrUndefined(documentEditor.documentHelper.styles.findByName(styleName))) {
                documentEditor.editorModule.applyStyle(styleName, true);

                // Update tree view if options pane is showing
                const treeViewResult: HTMLElement = document.getElementById(documentEditor.containerId + '_treeDiv');
                if (!isNullOrUndefined(treeViewResult) &&
                    !isNullOrUndefined(documentEditor.optionsPaneModule) &&
                    documentEditor.optionsPaneModule.isOptionsPaneShow &&
                    documentEditor.optionsPaneModule.isHeadingTab) {
                    treeViewResult.innerHTML = '';
                    documentEditor.optionsPaneModule.data = documentEditor.optionsPaneModule.dataForTreeview();
                    documentEditor.optionsPaneModule.initHeadingTab();
                }
            }
        }
    }
}
