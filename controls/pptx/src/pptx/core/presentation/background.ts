import { AuthoredFillMatrixReference, readFillMatrixReference } from '../theme/read-fill-reference';
/** Direct and resolved slide-background read models. */
import { PictureMediaAccess, findSlideRelationship } from '../pictures/media-access';
import { PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { findChild, getAttr } from '../shapes/dom-utils';
import { ColorValue } from '../theme/color-value';
import { DML_NS } from '../theme/constants';
import { tryParseColorChoiceChild } from '../theme/parse-color-choice';
import { ThemeColorTransform, ThemeFillStyle, parseThemeFillStyle, readColorTransforms } from '../theme/theme-render-model';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { OFFICE_REL_ATTR_NS } from './constants';
import { getGradientDrawingNamespace } from '../theme/read-gradient';

/** Embedded or externally linked picture used as a slide background. */
export interface PictureBackgroundFill {
    /** Picture-fill discriminant. */
    readonly kind: 'picture';
    /** Copy of embedded package bytes, when the relationship is internal. */
    readonly data: Uint8Array | undefined;
    /** Embedded part MIME type. */
    readonly contentType: string | undefined;
    /** Authored external image URL. The library never fetches it. */
    readonly externalUrl: string | undefined;
    /** Authored image layout mode. */
    readonly mode: 'stretch' | 'tile' | undefined;
}

/** Renderable direct background fill. */
export type BackgroundFill = Exclude<ThemeFillStyle, { readonly kind: 'picture'; }> | PictureBackgroundFill;

/** Background authored directly on a slide, layout, or master. */
export type DirectSlideBackground =
    { readonly kind: 'missing'; } |
    { readonly kind: 'fill'; readonly fill: BackgroundFill; readonly shadeToTitle: boolean; } |
    { readonly kind: 'theme'; readonly styleIndex: number; readonly color: ColorValue | undefined;
        readonly colorTransforms: ReadonlyArray<ThemeColorTransform>; };

/** Source-aware background after slide → layout → master inheritance. */
export interface ResolvedSlideBackground {
    /** Level that supplied the background. */
    readonly source: 'slide' | 'layout' | 'master' | 'default';
    /** Direct authored value from that level, or the default white fill. */
    readonly background: Exclude<DirectSlideBackground, { readonly kind: 'missing'; }>;
}

/**
 * Read a direct background without resolving inheritance.
 *
 * @internal
 * @param {OoxmlElement} root - Slide, layout, or master root.
 * @param {PictureMediaAccess | undefined} media - Package media resolver.
 * @returns {DirectSlideBackground} Authored background view.
 */
export function readDirectBackground(root: OoxmlElement, media: PictureMediaAccess | undefined): DirectSlideBackground {
    const dml: string | undefined = getGradientDrawingNamespace(root.namespaceUri);
    if (dml === undefined || root.namespaceUri === dml) { return { kind: 'missing' }; }
    const pml: string = root.namespaceUri;
    const commonSlideData: OoxmlElement = findChild(root, pml, 'cSld');
    const background: OoxmlElement = commonSlideData === undefined ? undefined : findChild(commonSlideData, pml, 'bg');
    if (background === undefined) {
        return { kind: 'missing' };
    }
    const properties: OoxmlElement = findChild(background, pml, 'bgPr');
    if (properties !== undefined) {
        const fillElement: OoxmlElement = firstFill(properties);
        const fill: BackgroundFill = fillElement === undefined
            ? { kind: 'unknown', elementName: 'missing' }
            : fillElement.localName === 'blipFill'
                ? readPictureBackground(fillElement, media)
                : parseThemeFillStyle(fillElement) as BackgroundFill;
        const shade: string = getAttr(properties, '', 'shadeToTitle');
        return {
            kind: 'fill',
            fill,
            shadeToTitle: shade === '1' || (shade !== undefined && shade.toLowerCase() === 'true')
        };
    }
    const reference: OoxmlElement = findChild(background, pml, 'bgRef');
    if (reference === undefined) {
        return { kind: 'missing' };
    }
    const rawIndex: string = getAttr(reference, '', 'idx');
    const numericIndex: number = rawIndex === undefined ? NaN : Number(rawIndex);
    return {
        kind: 'theme',
        styleIndex: Number.isSafeInteger(numericIndex) && numericIndex >= 0 ? numericIndex : 0,
        color: tryParseColorChoiceChild(reference),
        colorTransforms: readColorTransforms(reference)
    };
}

/**
 * Resolve background source without flattening its direct value.
 *
 * @internal
 * @param {DirectSlideBackground} slide - Slide-level direct background.
 * @param {DirectSlideBackground | undefined} layout - Layout-level direct background.
 * @param {DirectSlideBackground | undefined} master - Master-level direct background.
 * @returns {ResolvedSlideBackground} Source-aware view.
 */
export function resolveBackground(
    slide: DirectSlideBackground,
    layout: DirectSlideBackground | undefined,
    master: DirectSlideBackground | undefined
): ResolvedSlideBackground {
    if (slide.kind !== 'missing') {
        return { source: 'slide', background: slide };
    }
    if (layout !== undefined && layout.kind !== 'missing') {
        return { source: 'layout', background: layout };
    }
    if (master !== undefined && master.kind !== 'missing') {
        return { source: 'master', background: master };
    }
    return {
        source: 'default',
        background: {
            kind: 'fill',
            shadeToTitle: false,
            fill: { kind: 'solid', color: { kind: 'srgb', val: 'FFFFFF' }, colorTransforms: [] }
        }
    };
}

function firstFill(parent: OoxmlElement): OoxmlElement | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(parent.namespaceUri);
    if (ns === undefined) { return undefined; }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== ns) {
            continue;
        }
        if (child.localName === 'noFill' || child.localName === 'solidFill' || child.localName === 'gradFill' ||
            child.localName === 'blipFill' || child.localName === 'pattFill' || child.localName === 'grpFill') {
            return child;
        }
    }
    return undefined;
}

function readPictureBackground(element: OoxmlElement, media: PictureMediaAccess | undefined): PictureBackgroundFill {
    const blip: OoxmlElement = findChild(element, DML_NS, 'blip');
    const embedId: string = blip === undefined ? undefined : getAttr(blip, OFFICE_REL_ATTR_NS, 'embed');
    const linkId: string = blip === undefined ? undefined : getAttr(blip, OFFICE_REL_ATTR_NS, 'link');
    let data: Uint8Array | undefined;
    let contentType: string | undefined;
    let externalUrl: string | undefined;
    if (media !== undefined && embedId !== undefined) {
        const relationship: PackageRelationship = findSlideRelationship(media, embedId);
        if (relationship !== undefined && relationship.targetMode === 'Internal' && relationship.targetPartName !== undefined) {
            const part: PackagePart = media.getPart(relationship.targetPartName);
            if (part !== undefined) {
                data = part.data.slice();
                contentType = part.contentType;
            }
        }
    }
    if (media !== undefined && linkId !== undefined) {
        const relationship: PackageRelationship = findSlideRelationship(media, linkId);
        if (relationship !== undefined && relationship.targetMode === 'External') {
            externalUrl = relationship.target;
        }
    }
    return {
        kind: 'picture',
        data,
        contentType,
        externalUrl,
        mode: findChild(element, DML_NS, 'stretch') !== undefined
            ? 'stretch'
            : findChild(element, DML_NS, 'tile') !== undefined ? 'tile' : undefined
    };
}

/**
 * Reads complete background reference data without the legacy numeric projection.
 *
 * @param {OoxmlElement} root - Slide, layout or master XML root.
 * @param {string} partName - Optional owning package part.
 * @returns {AuthoredFillMatrixReference | undefined} Direct bgRef, including missing/invalid index.
 * @internal
 */
export function readBackgroundFillReference(root: OoxmlElement, partName?: string): AuthoredFillMatrixReference | undefined {
    if (getGradientDrawingNamespace(root.namespaceUri) === undefined) { return undefined; }
    const common: OoxmlElement | undefined = findChild(root, root.namespaceUri, 'cSld');
    const background: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, root.namespaceUri, 'bg');
    if (background === undefined || findChild(background, root.namespaceUri, 'bgPr') !== undefined) { return undefined; }
    const reference: OoxmlElement | undefined = findChild(background, root.namespaceUri, 'bgRef');
    return reference === undefined ? undefined : readFillMatrixReference(reference, partName);
}
