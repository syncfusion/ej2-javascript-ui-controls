import { officeRelationshipType, ownerNamespace, officeRootNamespace } from '../xml/office-dialect';
import { arrayAt } from '../util/es5-compat';
/**
 * Parse `p:clrMap` and `p:clrMapOvr` from PresentationML / DrawingML DOM.
 */
import { SLIDE_MASTER_REL_TYPE } from '../package/constants';
import { OpcPackage, PackagePart } from '../package/package-model';
import { PML_NS } from '../presentation/constants';
import { InvalidPackageError } from '../security/errors';
import { parseXml, OoxmlElement, OoxmlText, OoxmlAttribute } from '../xml/dom';
import { ColorMapping } from './color-mapping';
import { COLOR_MAP_KEYS, DML_NS, isColorSchemeIndex, ColorMapKey, ColorSchemeIndex } from './constants';
import { PackageRelationship } from '../package/relationships';
/**
 * Slide-level colour-map override relative to the master map.
 *
 * - `undefined` — no `p:clrMapOvr` (inherit master)
 * - `'master'` — `a:masterClrMapping` (explicit inherit)
 * - `ColorMapping` — `a:overrideClrMapping` full replacement
 */
export type SlideColorMapOverride = ColorMapping | 'master' | undefined;
/**
 * Parses a `CT_ColorMapping` element (`p:clrMap` or `a:overrideClrMapping`).
 *
 * @throws {Error} Missing attr or value not `ST_ColorSchemeIndex`.
 * @param {OoxmlElement} el - Element bearing the twelve required attributes.
 * @param {string} partName - Part URI for error context.
 * @returns {ColorMapping} Immutable {@link ColorMapping}.
 */
export function parseColorMapping(el: OoxmlElement, partName: string): ColorMapping {
    const entries: Map<string, string> = new Map<ColorMapKey, ColorSchemeIndex>();
    for (let i: number = 0; i < COLOR_MAP_KEYS.length; i++) {
        const key: string = arrayAt(COLOR_MAP_KEYS, i);
        const raw: string = getAttr(el, '', key);
        if (raw === undefined) {
            throw new InvalidPackageError(`CT_ColorMapping requires attribute ${key}`, { partName });
        }
        if (!isColorSchemeIndex(raw)) {
            throw new InvalidPackageError(`CT_ColorMapping @${key}="${raw}" is not a ST_ColorSchemeIndex token`, { partName });
        }
        entries.set(key, raw);

    }
    return new ColorMapping(entries);
}
/**
 * Parses optional `p:clrMapOvr` under a slide or layout root.
 *
 * @throws {Error} Malformed override choice.
 * @param {OoxmlElement} root - `p:sld` or `p:sldLayout` root.
 * @param {string} partName - Part URI for errors.
 * @returns {SlideColorMapOverride} Override discriminant for {@link effectiveColorMap}.
 */
export function parseSlideColorMapOverride(root: OoxmlElement, partName: string): SlideColorMapOverride {
    const ovr: OoxmlElement = findChild(root, PML_NS, 'clrMapOvr');
    if (ovr === undefined) {
        return undefined;
    }
    const master: OoxmlElement = findChild(ovr, DML_NS, 'masterClrMapping');
    if (master !== undefined) {
        return 'master';
    }
    const overrideEl: OoxmlElement = findChild(ovr, DML_NS, 'overrideClrMapping');
    if (overrideEl !== undefined) {
        return parseColorMapping(overrideEl, partName);
    }
    throw new InvalidPackageError('p:clrMapOvr requires a:masterClrMapping or a:overrideClrMapping (CT_ColorMappingOverride)',
                                  { partName });
}
/**
 * Loads the first presentation slide master's `p:clrMap`, if any master exists.
 *
 * @throws {Error} Master present but missing/invalid `p:clrMap`.
 * @remarks Phase-2 slide resolve uses this master map plus the slide's own `clrMapOvr` (layout ovr does not apply to slide-level resolve —
 * spec default). Citation: `pml.xsd` `EG_TopLevelSlide` requires `clrMap` on masters.
 * @param {OpcPackage} pkg - Opened package.
 * @returns {ColorMapping | undefined} Master {@link ColorMapping}, or `undefined` when no Internal master rel.
 */
export function loadMasterColorMap(pkg: OpcPackage): ColorMapping | undefined {
    const presentationRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(pkg.presentationPartName);
        return __rels != null ? __rels : [];
    })());
    for (let i: number = 0; i < presentationRels.length; i++) {
        const rel: PackageRelationship = arrayAt(presentationRels, i);
        if (!officeRelationshipType(rel.type, SLIDE_MASTER_REL_TYPE) ||
            rel.targetMode !== 'Internal' ||
            rel.targetPartName === undefined) {
            continue;
        }
        const masterPartName: string = rel.targetPartName;
        const part: PackagePart = pkg.parts.get(masterPartName);
        if (part === undefined) {
            throw new InvalidPackageError(`Slide master relationship "${rel.id}" target "${masterPartName}" is not present in the package`,
                                          { partName: masterPartName });
        }
        const text: string = new TextDecoder('utf-8').decode(part.data);
        const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName: masterPartName });
        if (root.localName !== 'sldMaster' || !officeRootNamespace(root.namespaceUri, PML_NS)) {
            throw new InvalidPackageError('Slide master root must be p:sldMaster in the PresentationML namespace',
                                          { partName: masterPartName });
        }
        const clrMap: OoxmlElement = findChild(root, PML_NS, 'clrMap');
        if (clrMap === undefined) {
            throw new InvalidPackageError('p:sldMaster requires p:clrMap (EG_TopLevelSlide)', {
                partName: masterPartName
            });
        }
        return parseColorMapping(clrMap, masterPartName);

    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findChild(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement | undefined {
    namespaceUri = ownerNamespace(parent.namespaceUri, namespaceUri);
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' &&
            child.namespaceUri === namespaceUri &&
            child.localName === localName) {
            return child;
        }

    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
function getAttr(el: OoxmlElement, namespaceUri: string, localName: string): string | undefined {
    namespaceUri = ownerNamespace(el.namespaceUri, namespaceUri);
    for (let i: number = 0; i < el.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(el.attributes, i);
        if (a.namespaceUri === namespaceUri && a.localName === localName) {
            return a.value;
        }

    }
    return undefined;
}
