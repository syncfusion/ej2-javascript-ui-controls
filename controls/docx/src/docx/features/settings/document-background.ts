import { WordDocument } from '../document/document';
import { elementChildren, isWml } from '../document/wml';
import { WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { OpenXmlAttribute } from '../../core/xml/model';
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseBackgroundMetadata(background: OpenXmlElement | undefined): {
    readonly present: boolean;
    readonly color: string | undefined;
    readonly themeColor: string | undefined;
    readonly themeTint: string | undefined;
    readonly themeShade: string | undefined;
    readonly hasDrawing: boolean;
} {
    if (background === undefined || !isWml(background, 'background')) {
        return {
            present: false,
            color: undefined,
            themeColor: undefined,
            themeTint: undefined,
            themeShade: undefined,
            hasDrawing: false
        };
    }
    let hasDrawing: boolean = false;
    for (const child of elementChildren(background)) {
        if (isWml(child, 'drawing')) {
            hasDrawing = true;
            break;
        }
    }
    return {
        present: true,
        color: wmlAttribute(background, 'color'),
        themeColor: wmlAttribute(background, 'themeColor'),
        themeTint: wmlAttribute(background, 'themeTint'),
        themeShade: wmlAttribute(background, 'themeShade'),
        hasDrawing
    };
}
/**
 * Main Document page background metadata (`w:document/w:background`).
 *
 * @private
 */
export class Background {
    private readonly metadata: ReturnType<typeof parseBackgroundMetadata>;
    private readonly displayBackgroundShapeValue: boolean | undefined;
    /**
     * @param {OpenXmlElement | undefined} background - The background.
     * @param {boolean | undefined} displayBackgroundShapeValue - The display background shape value.
     * @private
     */
    constructor(background: OpenXmlElement | undefined, displayBackgroundShapeValue: boolean | undefined) {
        this.metadata = parseBackgroundMetadata(background);
        this.displayBackgroundShapeValue = displayBackgroundShapeValue;
    }
    /**
     * Whether `w:background` was present on the Main Document.
     *
     * @returns {boolean} The result.
     * @public
     */
    present(): boolean {
        return this.metadata.present;
    }
    /**
     * `w:background/@w:color`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    color(): string | undefined {
        return this.metadata.color;
    }
    /**
     * `w:background/@w:themeColor`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    themeColor(): string | undefined {
        return this.metadata.themeColor;
    }
    /**
     * `w:background/@w:themeTint`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    themeTint(): string | undefined {
        return this.metadata.themeTint;
    }
    /**
     * `w:background/@w:themeShade`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    themeShade(): string | undefined {
        return this.metadata.themeShade;
    }
    /**
     * Whether a `w:drawing` child exists under `w:background`.
     *
     * @returns {boolean} The result.
     * @public
     */
    hasDrawing(): boolean {
        return this.metadata.hasDrawing;
    }
    /**
     * `w:settings/w:displayBackgroundShape`, or `undefined` when absent.
     *
     * @returns {boolean | undefined} The result.
     * @public
     */
    displayBackgroundShape(): boolean | undefined {
        return this.displayBackgroundShapeValue;
    }
}
/**
 *  @public
 *
 * @param {WordDocument} document - The document.
 * @param {boolean | undefined} displayBackgroundShapeValue - The display background shape value.
 * @returns {Background} The result.
 */
export function createBackground(document: WordDocument, displayBackgroundShapeValue: boolean | undefined): Background {
    return new Background(document.preservedBackground(), displayBackgroundShapeValue);
}
