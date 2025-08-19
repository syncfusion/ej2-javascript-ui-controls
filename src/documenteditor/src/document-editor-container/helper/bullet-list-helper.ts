import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DocumentEditor, ListLevelPattern, ParagraphWidget, WAbstractList, WList, WListLevel } from '../../document-editor/index';
import { ElementsMap, ListStyle } from './ribbon-interfaces';

/**
 * Helper class for bullet list operations in Document Editor
 * @private
 */
export class BulletListHelper {
    // Define bullet style constants
    public static readonly BULLET_STYLES: {
        DOT: ListStyle;
        CIRCLE: ListStyle;
        SQUARE: ListStyle;
        FLOWER: ListStyle;
        ARROW: ListStyle;
        TICK: ListStyle;
    } = {
        DOT: { style: 'dot', char: String.fromCharCode(61623), font: 'Symbol' },
        CIRCLE: { style: 'circle', char: String.fromCharCode(61551) + String.fromCharCode(32), font: 'Symbol' },
        SQUARE: { style: 'square', char: String.fromCharCode(61607), font: 'Wingdings' },
        FLOWER: { style: 'flower', char: String.fromCharCode(61558), font: 'Wingdings' },
        ARROW: { style: 'arrow', char: String.fromCharCode(61656), font: 'Wingdings' },
        TICK: { style: 'tick', char: String.fromCharCode(61692), font: 'Wingdings' }
    };

    /**
     * Creates a bullet list tag item for the dropdown
     *
     * @param {HTMLElement} ulTag - Parent UL element
     * @param {string} iconCss - CSS class for the icon
     * @param {boolean} isNone - Whether this is the "None" option
     * @param {L10n} localObj - Localization object
     * @returns {HTMLElement} The created list item element
     */
    public static createBulletListTag(ulTag: HTMLElement, iconCss: string, isNone: boolean, localObj: L10n): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-bullet-menuitem-md e-de-list-items e-de-list-item-size'
        });

        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-bullet-list-header-presetmenu'
        });

        const spanDiv: HTMLElement = createElement('div', {
            styles: isNone ? 'font-size:8px;text-align: center;top: 8px;line-height:normal' : ''
        });

        const span: HTMLSpanElement = createElement('span', {
            className: !isNone ? iconCss : ''
        });

        if (isNone) {
            liInnerDiv.style.display = 'inline-table';
            span.textContent = localObj.getConstant('None');
        }

        spanDiv.appendChild(span);
        liInnerDiv.appendChild(spanDiv);
        liTag.appendChild(liInnerDiv);
        ulTag.appendChild(liTag);

        return liTag;
    }

    /**
     * Creates a number list tag item for the dropdown
     * @param {HTMLElement} ulTag - Parent UL element
     * @param {string} text1 - First number format text
     * @param {string} text2 - Second number format text
     * @param {string} text3 - Third number format text
     * @returns {HTMLElement} The created list item element
     */
    public static createNumberListTag(ulTag: HTMLElement, text1: string, text2: string, text3: string): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        let innerHTML: string = '<div>' + text1 + '<span class="e-de-list-line"></span></div><div>' + text2 + '<span class="e-de-list-line">';
        innerHTML += '</span></div><div>' + text3 + '<span class="e-de-list-line"> </span></div >';
        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }

    /**
     * Creates a number none list tag item for the dropdown
     * @param {HTMLElement} ulTag - Parent UL element
     * @param {L10n} localObj - Localization object
     * @returns {HTMLElement} The created list item element
     */
    public static createNumberNoneListTag(ulTag: HTMLElement, localObj: L10n): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        const innerHTML: string = '<div><span class="e-de-bullets">' + localObj.getConstant('None') + '</span></div>';
        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            styles: 'position:relative;left:11px;top:13px',
            innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }

    /**
     * Update the selected bullet list type in the dropdown
     * @param {string} listText - The list text to match
     * @param {ElementsMap} bulletElements - Map of bullet elements
     * @returns {void}
     */
    public static updateSelectedBulletListType(listText: string, bulletElements: ElementsMap): void {
        // Map character codes to bullet element keys
        const bulletMap: { [key: string]: string } = {
            [String.fromCharCode(61623)]: 'dot',
            [String.fromCharCode(61551) + String.fromCharCode(32)]: 'circle',
            [String.fromCharCode(61607)]: 'square',
            [String.fromCharCode(61558)]: 'flower',
            [String.fromCharCode(61656)]: 'arrow',
            [String.fromCharCode(61692)]: 'tick'
        };

        // Add selection to the matching bullet type or default to none
        /* eslint-disable */
        const elementKey: string = bulletMap[listText];
        /* eslint-disable */
        if (bulletElements[elementKey]) {
            /* eslint-disable */
            bulletElements[elementKey].classList.add('de-list-item-selected');
        }
    }

    /**
     * Update the selected numbered list type in the dropdown
     * @param {string} listText - The list pattern to match
     * @param {ElementsMap} numberElements - Map of number elements
     * @returns {void}
     */
    public static updateSelectedNumberedListType(listText: string, numberElements: ElementsMap): void {
        const patternMap: { [key: string]: string } = {
            'Arabic': 'number',
            'UpRoman': 'uproman',
            'UpLetter': 'upletter',
            'LowLetter': 'lowletter',
            'LowRoman': 'lowroman'
        };
        /* eslint-disable */
        const elementKey: string = patternMap[listText];
        /* eslint-disable */
        if (numberElements[elementKey]) {
            /* eslint-disable */
            numberElements[elementKey].classList.add('de-list-item-selected');
        }
    }

    /**
     * Remove selected class from all list items
     * @param {ElementsMap} elements - Map of elements to remove selection from
     * @returns {void}
     */
    public static removeSelectedList(elements: ElementsMap): void {
        const className: string = 'de-list-item-selected';

        for (const key in elements) {
            /* eslint-disable */
            if (Object.prototype.hasOwnProperty.call(elements, key)) {
                /* eslint-disable */
                const element: HTMLElement = elements[key];
                if (element) {
                    element.classList.remove(className);
                }
            }
        }
    }

    /**
     * Get the level format for numbering
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {string} The level format string
     */
    public static getLevelFormatNumber(documentEditor: DocumentEditor): string {
        let numberFormat: string = '%';
        const levelNumber: number = documentEditor.selectionModule.paragraphFormat.listLevelNumber;
        numberFormat = numberFormat + (((levelNumber <= 0) ? 0 : levelNumber) + 1) + '.';
        return numberFormat;
    }

    /**
     * Apply bullet style to the document
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} style - Bullet style name
     * @param {Object} appliedBulletStyle - Reference to store the applied style
     * @param {string} appliedBulletStyle.value - The value to store the applied style
     * @returns {void}
     */
    public static applyBulletStyle(documentEditor: DocumentEditor, style: string, appliedBulletStyle: { value: string }): void {
        if (style === 'none') {
            BulletListHelper.clearList(documentEditor);
            return;
        }

        // Find the bullet style configuration
        let bulletStyle: ListStyle = null;
        for (const key in BulletListHelper.BULLET_STYLES) {
            if (Object.prototype.hasOwnProperty.call(BulletListHelper.BULLET_STYLES, key)) {
                const s: ListStyle = BulletListHelper.BULLET_STYLES[key as keyof typeof BulletListHelper.BULLET_STYLES];
                if (s.style === style) {
                    bulletStyle = s;
                    break;
                }
            }
        }

        if (bulletStyle && !documentEditor.isReadOnly && documentEditor.editorModule) {
            appliedBulletStyle.value = style;
            documentEditor.editorModule.applyBullet(bulletStyle.char, bulletStyle.font);
            setTimeout((): void => {
                documentEditor.focusIn();
            }, 30);
        }
    }

    /**
     * Clear the list formatting
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {void}
     */
    public static clearList(documentEditor: DocumentEditor): void {
        if (!documentEditor.isReadOnly && documentEditor.editorModule) {
            documentEditor.editorModule.clearList();
            setTimeout((): void => {
                documentEditor.focusIn();
            }, 30);
        }
    }

    /**
     * Apply numbering with specified format
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {ListLevelPattern} pattern - Numbering pattern
     * @param {Object} appliedNumberingStyle - Reference to store the applied style
     * @param {string} appliedNumberingStyle.value - The value to store the applied style
     * @returns {void}
     */
    public static applyNumbering(documentEditor: DocumentEditor, pattern: ListLevelPattern,
                                 appliedNumberingStyle: { value: string }): void {
        if (!documentEditor.isReadOnly && documentEditor.editorModule) {
            appliedNumberingStyle.value = pattern.toLowerCase();
            const format: string = BulletListHelper.getLevelFormatNumber(documentEditor);
            documentEditor.editorModule.applyNumbering(format, pattern);
            setTimeout((): void => {
                documentEditor.focusIn();
            }, 30);
        }
    }

    /**
     * Get the current list pattern from selection
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {string} The current list pattern or 'None' if no list
     */
    public static getCurrentListPattern(documentEditor: DocumentEditor): string {
        let levelPattern: string = 'None';
        if (!isNullOrUndefined(documentEditor.selectionModule.paragraphFormat)) {
            if (isNullOrUndefined(documentEditor.selectionModule.paragraphFormat.listId) ||
                documentEditor.selectionModule.paragraphFormat.listId === -1) {
                levelPattern = 'None';
            } else {
                const list: WList = documentEditor.documentHelper.getListById(
                    documentEditor.selectionModule.paragraphFormat.listId);
                const abstractList: WAbstractList = documentEditor.documentHelper.getAbstractListById(list.abstractListId);
                const startParagraph: ParagraphWidget = documentEditor.selectionModule.isForward ?
                    documentEditor.selectionModule.start.paragraph : documentEditor.selectionModule.end.paragraph;
                const level: WListLevel = abstractList.levels[startParagraph.paragraphFormat.listFormat.listLevelNumber];
                levelPattern = level.listLevelPattern;
            }
        }
        return levelPattern;
    }

    /**
     * Get the current list text from selection
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {string} The current list text
     */
    public static getCurrentListText(documentEditor: DocumentEditor): string {
        if (isNullOrUndefined(documentEditor.selectionModule.paragraphFormat.listId) ||
            documentEditor.selectionModule.paragraphFormat.listId === -1) {
            return documentEditor.selectionModule.paragraphFormat.listText;
        } else {
            const startParagraph: ParagraphWidget = documentEditor.selectionModule.isForward ?
                documentEditor.selectionModule.start.paragraph : documentEditor.selectionModule.end.paragraph;
            return startParagraph.paragraphFormat.listFormat.listLevel.numberFormat;
        }
    }
}
