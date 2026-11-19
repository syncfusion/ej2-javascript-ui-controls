/**
 * `w:zoom` DOM (`CT_Zoom`, Transitional `wml.xsd`).
 *
 * Models the view magnification applied to a document. `percent` is the
 * canonical zoom percentage (e.g. 100). `val` qualifies the zoom type when
 * present (none | fullPage | bestFit | textFit).
 *
 * @private
 */
import { WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { wmlAttr, wmlElement } from '../document/wml';
/**
 * `ST_Zoom` wire tokens for `w:zoom/@w:val` (Transitional `wml.xsd`).
 *
 * `"none"` means the numeric percent is the sole control.
 *
 * @private
 */
export enum ZoomType {
    /** Numeric percent is the sole zoom control. */
    None = 'none',
    /** Fit the full page in the window. */
    FullPage = 'fullPage',
    /** Best fit for the window. */
    BestFit = 'bestFit',
    /** Fit page width to text. */
    TextFit = 'textFit',
}
/**
 * @private
 * Wire string form of {@link ZoomType} (same tokens as the public enum).
 */
export type ZoomTypeWire = 'none' | 'fullPage' | 'bestFit' | 'textFit';
function isZoomTypeWire(value: string): value is ZoomTypeWire {
    return value === 'none' || value === 'fullPage' || value === 'bestFit' || value === 'textFit';
}
/**
 * First-class `w:zoom` node (`CT_Zoom`).
 *
 * ECMA-376-1 §17.15.1.93 — `w:zoom`
 *
 * Kept public because {@link SettingsPart.zoom} / {@link SettingsPart.setZoom} use it (R7.3).
 *
 * @private
 */
export class ZoomSettings {
    private zoomType: ZoomTypeWire | undefined;
    private zoomPercent: number | undefined;
    private constructor(zoomType: ZoomTypeWire | undefined, zoomPercent: number | undefined) {
        this.zoomType = zoomType;
        this.zoomPercent = zoomPercent;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @returns {ZoomSettings} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement): ZoomSettings {
        let zoomType: ZoomTypeWire | undefined;
        let zoomPercent: number | undefined;
        for (const attr of element.attributes) {
            if (attr.localName === 'val' &&
                (attr.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attr.namespaceUri === '')) {
                const v: string = attr.value;
                if (isZoomTypeWire(v)) {
                    zoomType = v;
                }
            }
            if (attr.localName === 'percent' &&
                (attr.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attr.namespaceUri === '')) {
                const n: number = Number(attr.value);
                if (!Number.isNaN(n)) {
                    zoomPercent = n;
                }
            }
        }
        return new ZoomSettings(zoomType, zoomPercent);
    }
    /**
     * Create a new `ZoomSettings` from explicit values.
     *
     * @param {number} percent - The percent.
     * @param {ZoomTypeWire | ZoomType} val - The val.
     * @returns {ZoomSettings} The result.
     * @private
     */
    static create(percent: number, val?: ZoomTypeWire | ZoomType): ZoomSettings {
        const wire: ZoomTypeWire = val === undefined ? undefined : (typeof val === 'string' ? val : val);
        return new ZoomSettings(wire as ZoomTypeWire | undefined, percent);
    }
    /**
     * `w:zoom/@w:val` — zoom type qualifier, or `undefined` when absent.
     *
     * @returns {ZoomTypeWire | undefined} The result.
     * @private
     */
    type(): ZoomTypeWire | undefined {
        return this.zoomType;
    }
    /**
     * Mutate `w:zoom/@w:val`.
     *
     * @param {ZoomTypeWire | ZoomType | undefined} val - The val.
     * @returns {void} Nothing is returned.
     * @private
     */
    setType(val: ZoomTypeWire | ZoomType | undefined): void {
        if (val === undefined) {
            this.zoomType = undefined;
            return;
        }
        this.zoomType = typeof val === 'string' ? val : val;
    }
    /**
     * `w:zoom/@w:percent` — numeric zoom percentage, or `undefined` when absent.
     *
     * @returns {number | undefined} The result.
     * @private
     */
    percent(): number | undefined {
        return this.zoomPercent;
    }
    /**
     * Mutate `w:zoom/@w:percent`.
     *
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setPercent(value: number | undefined): void {
        this.zoomPercent = value;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const attrs: any[] = [];
        if (this.zoomType !== undefined) {
            attrs.push(wmlAttr('val', this.zoomType));
        }
        if (this.zoomPercent !== undefined) {
            attrs.push(wmlAttr('percent', String(this.zoomPercent)));
        }
        return wmlElement('zoom', { attributes: attrs });
    }
}
