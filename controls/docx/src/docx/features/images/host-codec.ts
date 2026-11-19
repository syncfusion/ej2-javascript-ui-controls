/**
 * Picture DrawingML host decode/encode helpers (`wp:inline` / `wp:anchor` + `pic:pic`).
 *
 * Schema cites (Transitional `dml-wordprocessingDrawing.xsd`):
 * - `CT_Inline`, `CT_Anchor`, `EG_WrapType`
 * - `CT_PosH` / `CT_PosV` (align XOR posOffset; relativeFrom required)
 * - `ST_RelFromH`, `ST_RelFromV`, `ST_AlignH`, `ST_AlignV`
 * DrawingML main: `a:xfrm` rot/flipH/flipV; `a:CT_NonVisualDrawingProps` name/descr/title
 * Locks: `a:graphicFrameLocks/@noChangeAspect`
 *
 * Anchor promotion defaults mirror ink host-codec minimal Word-like anchor
 * (distL/R 114300, relativeHeight 251658240, layoutInCell 1, allowOverlap 1,
 * positionH column posOffset 0, positionV paragraph posOffset 0, wrapNone).
 *
 * @packageDocumentation
 */
import { emuToPoint, pointToEmus, pointToCoordinateEmus, emus, Emus } from '../document/length';
import { isWml, wmlElement } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { HorizontalAlignment, HorizontalOrigin, PicturePlacement, TextWrappingStyle, VerticalAlignment, VerticalOrigin, isHorizontalAlignment, isHorizontalOrigin, isTextWrappingStyle, isVerticalAlignment, isVerticalOrigin, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, PicturePlacement as PicturePlacementType, TextWrappingStyle as TextWrappingStyleType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from './layout-types';
const WP_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const PIC_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/** ST_Angle: 60000ths of a degree (ECMA-376 DrawingML). */
const ROTATION_UNITS_PER_DEGREE: number = 60000;
const PICTURE_GRAPHIC_DATA_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
/**
 * @private
 * Decoded picture host state. */
export interface PictureHostState {
    readonly placement: PicturePlacementType;
    readonly wrapping: TextWrappingStyleType;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly relationshipId: string;
    readonly name: string;
    readonly title: string | undefined;
    readonly description: string | undefined;
    readonly lockAspectRatio: boolean;
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
    readonly horizontalOrigin: HorizontalOriginType | undefined;
    readonly verticalOrigin: VerticalOriginType | undefined;
    readonly horizontalPosition: number | undefined;
    readonly verticalPosition: number | undefined;
    readonly horizontalAlignment: HorizontalAlignmentType | undefined;
    readonly verticalAlignment: VerticalAlignmentType | undefined;
    readonly docPrId: number;
    /**
     * DrawingML picture hyperlink relationship id (`a:hlinkClick/@r:id` on
     * `wp:docPr` / `pic:cNvPr`), when present.
     */
    readonly hyperlinkRelationshipId: string | undefined;
    /** Original drawing element for residual preservation on dirty rebuild. */
    readonly preservedHost: OpenXmlElement;
}
/**
 * @private
 * Encode input for picture host serialization. */
export interface EncodePictureHostInput {
    readonly placement: PicturePlacementType;
    readonly wrapping: TextWrappingStyleType;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly relationshipId: string;
    readonly name: string;
    readonly title: string | undefined;
    readonly description: string | undefined;
    readonly lockAspectRatio: boolean;
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
    readonly horizontalOrigin: HorizontalOriginType;
    readonly verticalOrigin: VerticalOriginType;
    readonly horizontalPosition: number | undefined;
    readonly verticalPosition: number | undefined;
    readonly horizontalAlignment: HorizontalAlignmentType | undefined;
    readonly verticalAlignment: VerticalAlignmentType | undefined;
    readonly docPrId: number;
    readonly preservedHost: OpenXmlElement | undefined;
    /**
     * When true, rebuild position/wrap from modeled fields (user mutated layout).
     * When false and preservedHost has matching placement, reuse residual position/wrap.
     */
    readonly layoutDirty: boolean;
    /**
     * Optional external hyperlink relationship id emitted as
     * `a:hlinkClick/@r:id` under `wp:docPr` and `pic:cNvPr`.
     */
    readonly hyperlinkRelationshipId: string | undefined;
}
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function isElement(el: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return el.namespaceUri === namespaceUri && el.localName === localName;
}
function findFirstElement(root: OpenXmlElement, namespaceUri: string, localName: string): OpenXmlElement | undefined {
    if (isElement(root, namespaceUri, localName)) {
        return root;
    }
    for (const child of elementChildren(root)) {
        const found: OpenXmlElement = findFirstElement(child, namespaceUri, localName);
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
function attributeValue(el: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    let ts330: any;
    return (
        (ts330 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName)),
        ts330 == null ? undefined : ts330.value
    );
}
function textContent(el: OpenXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        }
    }
    return out;
}
function xmlElement(namespaceUri: string, prefix: string, localName: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
    readonly namespaceDeclarations?: OpenXmlElement['namespaceDeclarations'];
}): OpenXmlElement {
    let ts331: any; let ts332: any; let ts333: any;
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefix,
        attributes: ((ts331 = options == null ? undefined : options.attributes), ts331 != null ? ts331 : []),
        namespaceDeclarations: ((ts332 = options == null ? undefined : options.namespaceDeclarations), ts332 != null ? ts332 : []),
        children: ((ts333 = options == null ? undefined : options.children), ts333 != null ? ts333 : [])
    };
}
function attr(localName: string, value: string, namespaceUri: string = '', prefix: string = ''): OpenXmlAttribute {
    return { namespaceUri, localName, prefix, value };
}
function blipEmbedAttribute(id: string): OpenXmlAttribute {
    return { namespaceUri: R_NS, localName: 'embed', prefix: 'r', value: id };
}
function extentAttributes(widthEmu: Emus, heightEmu: Emus): ReadonlyArray<OpenXmlAttribute> {
    return [attr('cx', String(widthEmu)), attr('cy', String(heightEmu))];
}
function parseOnOff(raw: string | undefined): boolean {
    return raw === '1' || raw === 'true';
}
function parseXfrm(picRoot: OpenXmlElement): {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
} {
    const xfrm: OpenXmlElement = findFirstElement(picRoot, A_NS, 'xfrm');
    if (xfrm === undefined) {
        return { rotation: 0, flipHorizontal: false, flipVertical: false };
    }
    const rotRaw: string = attributeValue(xfrm, '', 'rot');
    const rotation: number = rotRaw !== undefined && /^-?\d+$/.test(rotRaw)
        ? Number.parseInt(rotRaw, 10) / ROTATION_UNITS_PER_DEGREE
        : 0;
    return {
        rotation,
        flipHorizontal: parseOnOff(attributeValue(xfrm, '', 'flipH')),
        flipVertical: parseOnOff(attributeValue(xfrm, '', 'flipV'))
    };
}
function parseHlinkClickRelId(parent: OpenXmlElement | undefined): string | undefined {
    if (parent === undefined) {
        return undefined;
    }
    for (const child of elementChildren(parent)) {
        if (isElement(child, A_NS, 'hlinkClick')) {
            const relId: string = attributeValue(child, R_NS, 'id');
            if (relId !== undefined && relId.length > 0) {
                return relId;
            }
        }
    }
    return undefined;
}
function parseDocPr(host: OpenXmlElement): {
    name: string;
    title: string | undefined;
    description: string | undefined;
    id: number;
    hyperlinkRelationshipId: string | undefined;
} {
    let ts334: any;
    const docPr: OpenXmlElement = findFirstElement(host, WP_NS, 'docPr');
    if (docPr === undefined) {
        return { name: 'Picture', title: undefined, description: undefined, id: 1, hyperlinkRelationshipId: undefined };
    }
    const idRaw: string = attributeValue(docPr, '', 'id');
    const id: number = idRaw !== undefined && /^\d+$/.test(idRaw) ? Number.parseInt(idRaw, 10) : 1;
    return {
        name: ((ts334 = attributeValue(docPr, '', 'name')), ts334 != null ? ts334 : 'Picture'),
        title: attributeValue(docPr, '', 'title'),
        description: attributeValue(docPr, '', 'descr'),
        id,
        hyperlinkRelationshipId: parseHlinkClickRelId(docPr)
    };
}
function parseLockAspect(host: OpenXmlElement): boolean {
    const locks: OpenXmlElement = findFirstElement(host, A_NS, 'graphicFrameLocks');
    if (locks === undefined) {
        return false;
    }
    return parseOnOff(attributeValue(locks, '', 'noChangeAspect'));
}
function parsePosOffset(parent: OpenXmlElement | undefined): number | undefined {
    if (parent === undefined) {
        return undefined;
    }
    const offset: OpenXmlElement = elementChildren(parent).find((c: OpenXmlElement) => isElement(c, WP_NS, 'posOffset'));
    if (offset === undefined) {
        return undefined;
    }
    const raw: string = textContent(offset).trim();
    if (!/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return emuToPoint(Number.parseInt(raw, 10));
}
function parseAlignChild(parent: OpenXmlElement | undefined, axis: 'h' | 'v'): HorizontalAlignmentType | VerticalAlignmentType | undefined {
    if (parent === undefined) {
        return undefined;
    }
    const alignEl: OpenXmlElement = elementChildren(parent).find((c: OpenXmlElement) => isElement(c, WP_NS, 'align'));
    if (alignEl === undefined) {
        return undefined;
    }
    const raw: string = textContent(alignEl).trim();
    if (axis === 'h') {
        return isHorizontalAlignment(raw) ? raw : undefined;
    }
    return isVerticalAlignment(raw) ? raw : undefined;
}
function parseWrapping(host: OpenXmlElement, placement: PicturePlacementType): TextWrappingStyleType {
    if (placement === PicturePlacement.Inline) {
        return TextWrappingStyle.Inline;
    }
    if (findFirstElement(host, WP_NS, 'wrapNone') !== undefined) {
        return TextWrappingStyle.None;
    }
    if (findFirstElement(host, WP_NS, 'wrapSquare') !== undefined) {
        return TextWrappingStyle.Square;
    }
    if (findFirstElement(host, WP_NS, 'wrapTight') !== undefined) {
        return TextWrappingStyle.Tight;
    }
    if (findFirstElement(host, WP_NS, 'wrapThrough') !== undefined) {
        return TextWrappingStyle.Through;
    }
    if (findFirstElement(host, WP_NS, 'wrapTopAndBottom') !== undefined) {
        return TextWrappingStyle.TopAndBottom;
    }
    return TextWrappingStyle.None;
}
/**
 * Decode a picture `w:drawing` (inline or anchor with `a:blip` embed).
 *
 * @param {OpenXmlElement} drawing - The drawing.
 * @returns {PictureHostState | undefined} The result.
 * @private
 */
export function decodePictureHost(drawing: OpenXmlElement): PictureHostState | undefined {
    let ts335: any;
    if (!isWml(drawing, 'drawing')) {
        return undefined;
    }
    const blip: OpenXmlElement = findFirstElement(drawing, A_NS, 'blip');
    if (blip === undefined) {
        return undefined;
    }
    const embed: string = attributeValue(blip, R_NS, 'embed');
    if (embed === undefined || embed.length === 0) {
        return undefined;
    }
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    const host: OpenXmlElement = inline != null ? inline : anchor;
    if (host === undefined) {
        return undefined;
    }
    const placement: PicturePlacementType = inline !== undefined ? PicturePlacement.Inline : PicturePlacement.Anchored;
    const extent: OpenXmlElement = findFirstElement(host, WP_NS, 'extent');
    if (extent === undefined) {
        return undefined;
    }
    const cxRaw: string = attributeValue(extent, '', 'cx');
    const cyRaw: string = attributeValue(extent, '', 'cy');
    // cx/cy=0 is invalid for DrawingML extents; keep the drawing opaque for round-trip.
    if (
        cxRaw === undefined ||
        cyRaw === undefined ||
        !/^\d+$/.test(cxRaw) ||
        !/^\d+$/.test(cyRaw) ||
        cxRaw === '0' ||
        cyRaw === '0'
    ) {
        return undefined;
    }
    const positionH: OpenXmlElement = findFirstElement(host, WP_NS, 'positionH');
    const positionV: OpenXmlElement = findFirstElement(host, WP_NS, 'positionV');
    const hOriginRaw: string = positionH !== undefined ? attributeValue(positionH, '', 'relativeFrom') : undefined;
    const vOriginRaw: string = positionV !== undefined ? attributeValue(positionV, '', 'relativeFrom') : undefined;
    const pic: OpenXmlElement = ((ts335 = findFirstElement(drawing, PIC_NS, 'pic')), ts335 != null ? ts335 : drawing);
    const xfrm: { rotation: number; flipHorizontal: boolean; flipVertical: boolean; } = parseXfrm(pic);
    const docPr: { name: string; title: string; description: string; id: number; hyperlinkRelationshipId: string; } = parseDocPr(host);
    const cNvPr: OpenXmlElement = findFirstElement(pic, PIC_NS, 'cNvPr');
    const hyperlinkRelationshipId: string = docPr.hyperlinkRelationshipId != null
        ? docPr.hyperlinkRelationshipId
        : parseHlinkClickRelId(cNvPr);
    return {
        placement,
        wrapping: parseWrapping(host, placement),
        widthEmu: emus(Number.parseInt(cxRaw, 10)),
        heightEmu: emus(Number.parseInt(cyRaw, 10)),
        relationshipId: embed,
        name: docPr.name,
        title: docPr.title,
        description: docPr.description,
        lockAspectRatio: parseLockAspect(host),
        rotation: xfrm.rotation,
        flipHorizontal: xfrm.flipHorizontal,
        flipVertical: xfrm.flipVertical,
        horizontalOrigin: hOriginRaw !== undefined && isHorizontalOrigin(hOriginRaw) ? hOriginRaw : undefined,
        verticalOrigin: vOriginRaw !== undefined && isVerticalOrigin(vOriginRaw) ? vOriginRaw : undefined,
        horizontalPosition: parsePosOffset(positionH),
        verticalPosition: parsePosOffset(positionV),
        horizontalAlignment: parseAlignChild(positionH, 'h') as HorizontalAlignmentType | undefined,
        verticalAlignment: parseAlignChild(positionV, 'v') as VerticalAlignmentType | undefined,
        docPrId: docPr.id,
        hyperlinkRelationshipId,
        preservedHost: drawing
    };
}
function buildHlinkClick(relationshipId: string): OpenXmlElement {
    return xmlElement(A_NS, 'a', 'hlinkClick', {
        attributes: [attr('id', relationshipId, R_NS, 'r')],
        children: [],
        namespaceDeclarations: []
    });
}
function buildDocPr(input: EncodePictureHostInput): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [
        attr('id', String(input.docPrId)),
        attr('name', input.name)
    ];
    if (input.description !== undefined && input.description.length > 0) {
        attributes.push(attr('descr', input.description));
    }
    if (input.title !== undefined && input.title.length > 0) {
        attributes.push(attr('title', input.title));
    }
    const children: OpenXmlChild[] = [];
    if (input.hyperlinkRelationshipId !== undefined && input.hyperlinkRelationshipId.length > 0) {
        children.push(buildHlinkClick(input.hyperlinkRelationshipId));
    }
    return xmlElement(WP_NS, 'wp', 'docPr', { attributes, children });
}
function buildEffectExtent(): OpenXmlElement {
    return xmlElement(WP_NS, 'wp', 'effectExtent', {
        attributes: [attr('l', '0'), attr('t', '0'), attr('r', '0'), attr('b', '0')]
    });
}
function buildCNvGraphicFramePr(lockAspectRatio: boolean): OpenXmlElement {
    const lockAttrs: OpenXmlAttribute[] = lockAspectRatio
        ? [attr('noChangeAspect', '1')]
        : [];
    return xmlElement(WP_NS, 'wp', 'cNvGraphicFramePr', {
        children: [
            xmlElement(A_NS, 'a', 'graphicFrameLocks', {
                attributes: lockAttrs
            })
        ]
    });
}
function buildPic(input: EncodePictureHostInput): OpenXmlElement {
    const xfrmAttrs: OpenXmlAttribute[] = [];
    if (input.rotation !== 0) {
        xfrmAttrs.push(attr('rot', String(Math.round(input.rotation * ROTATION_UNITS_PER_DEGREE))));
    }
    if (input.flipHorizontal) {
        xfrmAttrs.push(attr('flipH', '1'));
    }
    if (input.flipVertical) {
        xfrmAttrs.push(attr('flipV', '1'));
    }
    const blipFill: OpenXmlElement = xmlElement(PIC_NS, 'pic', 'blipFill', {
        children: [
            xmlElement(A_NS, 'a', 'blip', { attributes: [blipEmbedAttribute(input.relationshipId)] }),
            xmlElement(A_NS, 'a', 'stretch', {
                children: [xmlElement(A_NS, 'a', 'fillRect')]
            })
        ]
    });
    const spPr: OpenXmlElement = xmlElement(PIC_NS, 'pic', 'spPr', {
        children: [
            xmlElement(A_NS, 'a', 'xfrm', {
                attributes: xfrmAttrs,
                children: [
                    xmlElement(A_NS, 'a', 'off', {
                        attributes: [attr('x', '0'), attr('y', '0')]
                    }),
                    xmlElement(A_NS, 'a', 'ext', {
                        attributes: extentAttributes(input.widthEmu, input.heightEmu)
                    })
                ]
            }),
            xmlElement(A_NS, 'a', 'prstGeom', {
                attributes: [attr('prst', 'rect')],
                children: [xmlElement(A_NS, 'a', 'avLst')]
            })
        ]
    });
    return xmlElement(PIC_NS, 'pic', 'pic', {
        namespaceDeclarations: [
            { prefix: 'pic', namespaceUri: PIC_NS },
            { prefix: 'a', namespaceUri: A_NS },
            { prefix: 'r', namespaceUri: R_NS }
        ],
        children: [
            xmlElement(PIC_NS, 'pic', 'nvPicPr', {
                children: [
                    xmlElement(PIC_NS, 'pic', 'cNvPr', {
                        attributes: [attr('id', '0'), attr('name', input.name)],
                        children: (input.hyperlinkRelationshipId !== undefined && input.hyperlinkRelationshipId.length > 0)
                            ? [buildHlinkClick(input.hyperlinkRelationshipId)]
                            : []
                    }),
                    xmlElement(PIC_NS, 'pic', 'cNvPicPr')
                ]
            }),
            blipFill,
            spPr
        ]
    });
}
function buildGraphic(input: EncodePictureHostInput): OpenXmlElement {
    return xmlElement(A_NS, 'a', 'graphic', {
        children: [
            xmlElement(A_NS, 'a', 'graphicData', {
                attributes: [attr('uri', PICTURE_GRAPHIC_DATA_URI)],
                children: [buildPic(input)]
            })
        ]
    });
}
function buildPositionH(input: EncodePictureHostInput): OpenXmlElement {
    const origin: string = input.horizontalOrigin;
    let child: OpenXmlElement;
    if (input.horizontalAlignment !== undefined) {
        child = xmlElement(WP_NS, 'wp', 'align', {
            children: [{ kind: 'text', value: input.horizontalAlignment }]
        });
    }
    else {
        // posOffset is a coordinate (0 / negative allowed), not an extent.
        const emu: 0 | Emus = input.horizontalPosition !== undefined
            ? pointToCoordinateEmus(input.horizontalPosition)
            : 0;
        child = xmlElement(WP_NS, 'wp', 'posOffset', {
            children: [{ kind: 'text', value: String(emu) }]
        });
    }
    return xmlElement(WP_NS, 'wp', 'positionH', {
        attributes: [attr('relativeFrom', origin)],
        children: [child]
    });
}
function buildPositionV(input: EncodePictureHostInput): OpenXmlElement {
    const origin: string = input.verticalOrigin;
    let child: OpenXmlElement;
    if (input.verticalAlignment !== undefined) {
        child = xmlElement(WP_NS, 'wp', 'align', {
            children: [{ kind: 'text', value: input.verticalAlignment }]
        });
    }
    else {
        // posOffset is a coordinate (0 / negative allowed), not an extent.
        const emu: 0 | Emus = input.verticalPosition !== undefined
            ? pointToCoordinateEmus(input.verticalPosition)
            : 0;
        child = xmlElement(WP_NS, 'wp', 'posOffset', {
            children: [{ kind: 'text', value: String(emu) }]
        });
    }
    return xmlElement(WP_NS, 'wp', 'positionV', {
        attributes: [attr('relativeFrom', origin)],
        children: [child]
    });
}
/**
 * Build wrap element from modeled style.
 * tight/through require wrapPolygon; without residual, fall back is not invented —
 * callers should only dirty-author rectangular wraps unless residual provides polygon.
 *
 * @param {TextWrappingStyleType} wrapping - The wrapping.
 * @param {OpenXmlElement | undefined} residualWrap - The residual wrap.
 * @returns {OpenXmlElement} The result.
 */
function buildWrapElement(wrapping: TextWrappingStyleType, residualWrap: OpenXmlElement | undefined): OpenXmlElement {
    if (residualWrap !== undefined &&
        ((wrapping === TextWrappingStyle.Tight && residualWrap.localName === 'wrapTight') ||
            (wrapping === TextWrappingStyle.Through && residualWrap.localName === 'wrapThrough') ||
            (wrapping === TextWrappingStyle.Square && residualWrap.localName === 'wrapSquare') ||
            (wrapping === TextWrappingStyle.None && residualWrap.localName === 'wrapNone') ||
            (wrapping === TextWrappingStyle.TopAndBottom &&
                residualWrap.localName === 'wrapTopAndBottom'))) {
        return residualWrap;
    }
    switch (wrapping) {
    case TextWrappingStyle.None:
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    case TextWrappingStyle.Square:
        return xmlElement(WP_NS, 'wp', 'wrapSquare', {
            attributes: [attr('wrapText', 'bothSides')]
        });
    case TextWrappingStyle.TopAndBottom:
        return xmlElement(WP_NS, 'wp', 'wrapTopAndBottom');
    case TextWrappingStyle.Tight:
        // Prefer residual polygon; without citeable default polygon, emit residual or square-safe fallback
        if (residualWrap !== undefined && residualWrap.localName === 'wrapTight') {
            return residualWrap;
        }
        // Authoring tight without polygon is not schema-complete; keep residual if any wrapTight
        return residualWrap != null ? residualWrap : xmlElement(WP_NS, 'wp', 'wrapNone');
    case TextWrappingStyle.Through:
        if (residualWrap !== undefined && residualWrap.localName === 'wrapThrough') {
            return residualWrap;
        }
        return residualWrap != null ? residualWrap : xmlElement(WP_NS, 'wp', 'wrapNone');
    default:
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    }
}
function findResidualWrap(anchor: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (anchor === undefined) {
        return undefined;
    }
    for (const name of [
        'wrapNone',
        'wrapSquare',
        'wrapTight',
        'wrapThrough',
        'wrapTopAndBottom'
    ]) {
        const found: OpenXmlElement = elementChildren(anchor).find((c: OpenXmlElement) => isElement(c, WP_NS, name));
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
function findResidualEffectExtent(host: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (host === undefined) {
        return undefined;
    }
    return elementChildren(host).find((c: OpenXmlElement) => isElement(c, WP_NS, 'effectExtent'));
}
function copyElementAttrs(source: OpenXmlElement | undefined, localNames: ReadonlyArray<string>): OpenXmlAttribute[] {
    if (source === undefined) {
        return [];
    }
    const out: OpenXmlAttribute[] = [];
    for (const name of localNames) {
        const value: string = attributeValue(source, '', name);
        if (value !== undefined) {
            out.push(attr(name, value));
        }
    }
    return out;
}
function buildInlineHost(input: EncodePictureHostInput): OpenXmlElement {
    let ts336: any;
    const preservedInline: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WP_NS, 'inline')
        : undefined;
    const effect: OpenXmlElement = ((ts336 = findResidualEffectExtent(preservedInline)), ts336 != null ? ts336 : buildEffectExtent());
    return xmlElement(WP_NS, 'wp', 'inline', {
        namespaceDeclarations: [
            { prefix: 'wp', namespaceUri: WP_NS },
            { prefix: 'a', namespaceUri: A_NS },
            { prefix: 'pic', namespaceUri: PIC_NS },
            { prefix: 'r', namespaceUri: R_NS }
        ],
        attributes: [
            attr('distT', '0'),
            attr('distB', '0'),
            attr('distL', '0'),
            attr('distR', '0')
        ],
        children: [
            xmlElement(WP_NS, 'wp', 'extent', {
                attributes: extentAttributes(input.widthEmu, input.heightEmu)
            }),
            effect,
            buildDocPr(input),
            buildCNvGraphicFramePr(input.lockAspectRatio),
            buildGraphic(input)
        ]
    });
}
function buildAnchoredHost(input: EncodePictureHostInput): OpenXmlElement {
    let ts337: any;
    const preservedAnchor: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WP_NS, 'anchor')
        : undefined;
    const defaultAttrs: OpenXmlAttribute[] = [
        attr('distT', '0'),
        attr('distB', '0'),
        attr('distL', '114300'),
        attr('distR', '114300'),
        attr('simplePos', '0'),
        attr('relativeHeight', '251658240'),
        attr('behindDoc', '0'),
        attr('locked', '0'),
        attr('layoutInCell', '1'),
        attr('allowOverlap', '1')
    ];
    const preservedAttrs: OpenXmlAttribute[] = copyElementAttrs(preservedAnchor, [
        'distT',
        'distB',
        'distL',
        'distR',
        'simplePos',
        'relativeHeight',
        'behindDoc',
        'locked',
        'layoutInCell',
        'allowOverlap',
        'hidden'
    ]);
    const attrs: OpenXmlAttribute[] = preservedAttrs.length > 0 ? preservedAttrs : defaultAttrs;
    const residualWrap: OpenXmlElement = findResidualWrap(preservedAnchor);
    const residualEffect: OpenXmlElement =
        ((ts337 = findResidualEffectExtent(preservedAnchor)), ts337 != null ? ts337 : buildEffectExtent());
    const residualSimplePos: OpenXmlElement = preservedAnchor
        ? elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'simplePos'))
        : undefined;
    const useModeledLayout: boolean = input.layoutDirty || preservedAnchor === undefined;
    let simplePos: OpenXmlElement;
    let positionH: OpenXmlElement;
    let positionV: OpenXmlElement;
    let wrap: OpenXmlElement;
    if (useModeledLayout) {
        simplePos = residualSimplePos != null ? residualSimplePos : xmlElement(WP_NS, 'wp', 'simplePos', {
            attributes: [attr('x', '0'), attr('y', '0')]
        });
        positionH = buildPositionH(input);
        positionV = buildPositionV(input);
        wrap = buildWrapElement(input.wrapping === TextWrappingStyle.Inline ? TextWrappingStyle.None : input.wrapping, residualWrap);
    }
    else {
        const ph: OpenXmlElement = elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionH'));
        const pv: OpenXmlElement = elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionV'));
        simplePos = residualSimplePos != null ? residualSimplePos : xmlElement(WP_NS, 'wp', 'simplePos', {
            attributes: [attr('x', '0'), attr('y', '0')]
        });
        positionH = ph != null ? ph : xmlElement(WP_NS, 'wp', 'positionH', {
            attributes: [attr('relativeFrom', HorizontalOrigin.Column)],
            children: [
                xmlElement(WP_NS, 'wp', 'posOffset', { children: [{ kind: 'text', value: '0' }] })
            ]
        });
        positionV = pv != null ? pv : xmlElement(WP_NS, 'wp', 'positionV', {
            attributes: [attr('relativeFrom', VerticalOrigin.Paragraph)],
            children: [
                xmlElement(WP_NS, 'wp', 'posOffset', { children: [{ kind: 'text', value: '0' }] })
            ]
        });
        wrap = residualWrap != null ? residualWrap : xmlElement(WP_NS, 'wp', 'wrapNone');
    }
    return xmlElement(WP_NS, 'wp', 'anchor', {
        namespaceDeclarations: [
            { prefix: 'wp', namespaceUri: WP_NS },
            { prefix: 'a', namespaceUri: A_NS },
            { prefix: 'pic', namespaceUri: PIC_NS },
            { prefix: 'r', namespaceUri: R_NS }
        ],
        attributes: attrs,
        children: [
            simplePos,
            positionH,
            positionV,
            xmlElement(WP_NS, 'wp', 'extent', {
                attributes: extentAttributes(input.widthEmu, input.heightEmu)
            }),
            residualEffect,
            wrap,
            buildDocPr(input),
            buildCNvGraphicFramePr(input.lockAspectRatio),
            buildGraphic(input)
        ]
    });
}
/**
 * Encode a modeled picture host into `w:drawing`.
 *
 * @param {EncodePictureHostInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function encodePictureHost(input: EncodePictureHostInput): OpenXmlElement {
    if (input.relationshipId.length === 0) {
        throw new Error('encodePictureHost: relationship id is not materialized');
    }
    const host: OpenXmlElement = input.placement === PicturePlacement.Anchored ||
        input.wrapping !== TextWrappingStyle.Inline
        ? buildAnchoredHost({
            ...input,
            placement: PicturePlacement.Anchored,
            wrapping: input.wrapping === TextWrappingStyle.Inline
                ? TextWrappingStyle.None
                : input.wrapping
        })
        : buildInlineHost(input);
    return wmlElement('drawing', { children: [host] });
}
/**
 * Whether wrapping requires an anchor host.
 *
 * @param {TextWrappingStyleType} wrapping - The wrapping.
 * @returns {boolean} The result.
 * @private
 */
export function wrappingRequiresAnchor(wrapping: TextWrappingStyleType): boolean {
    return wrapping !== TextWrappingStyle.Inline;
}
