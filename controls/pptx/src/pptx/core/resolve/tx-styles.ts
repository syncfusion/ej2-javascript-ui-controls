import { arrayAt } from '../util/es5-compat';
/**
 * Master `p:txStyles` bucket selection and presentation `defaultTextStyle`.
 *
 * @remarks
 * Citation: Transitional `pml.xsd` `CT_SlideMasterTextStyles` (~1471–1478)
 * `titleStyle` / `bodyStyle` / `otherStyle`; presentation `defaultTextStyle`
 * (~1068). Bucket rule from `docs/specs/010-inheritance-resolve.md`.
 */
import { findChild } from '../shapes/dom-utils';
import { PML_NS } from '../presentation/constants';
import { PlaceholderType } from '../placeholders/constants';
import { OoxmlAttribute, OoxmlElement } from '../xml/dom';
/**
 * Which master text-style list applies for a placeholder type.
 *
 * @internal
 */
export type TxStylesBucket = 'titleStyle' | 'bodyStyle' | 'otherStyle';
/**
 * Maps `ST_PlaceholderType` to master `txStyles` child.
 *
 * @remarks Initial rule (spec 010): - `title`, `ctrTitle` → `titleStyle` - `body`, `obj`, `subTitle`,
     and other content types → `bodyStyle` - unknown / residual → `otherStyle` Refinements require fixture evidence; escalate Syncfusion conflicts.
 * @internal
 * @param {PlaceholderType | string} type - The type value.
 * @returns {TxStylesBucket} The result.
 */
export function txStylesBucketForPlaceholderType(type: PlaceholderType | string): TxStylesBucket {
    switch (type) {
    case 'title':
    case 'ctrTitle':
        return 'titleStyle';
    case 'body':
    case 'obj':
    case 'subTitle':
    case 'chart':
    case 'tbl':
    case 'clipArt':
    case 'dgm':
    case 'media':
    case 'sldImg':
    case 'pic':
        return 'bodyStyle';
    default:
        return 'otherStyle';
    }
}
/**
 * Finds `p:txStyles` under a slide master root.
 *
 * @internal
 * @param {OoxmlElement} masterRoot - The masterRoot value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findMasterTxStyles(masterRoot: OoxmlElement): OoxmlElement | undefined {
    return findChild(masterRoot, PML_NS, 'txStyles');
}
/**
 * Selects the list-style element under `p:txStyles` for a bucket.
 *
 * @internal
 * @param {OoxmlElement} txStyles - The txStyles value.
 * @param {TxStylesBucket} bucket - The bucket value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function selectTxStylesBucket(txStyles: OoxmlElement, bucket: TxStylesBucket): OoxmlElement | undefined {
    return findChild(txStyles, PML_NS, bucket);
}
/**
 * Finds presentation `p:defaultTextStyle` under `p:presentation`.
 *
 * @internal
 * @param {OoxmlElement} presentationRoot - The presentationRoot value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findDefaultTextStyle(presentationRoot: OoxmlElement): OoxmlElement | undefined {
    return findChild(presentationRoot, PML_NS, 'defaultTextStyle');
}
/**
 * Reads optional `showMasterSp` on a child slide root (`p:sld` / `p:sldLayout`).
 *
 * @remarks Preserve-only for resolve: style inheritance still walks master placeholders regardless of this flag (spec 010). Decorative
 * master-shape merge is out of scope. Citation: `pml.xsd` `AG_ChildSlide` `@showMasterSp`.
 * @internal
 * @param {OoxmlElement} slideRoot - The slideRoot value.
 * @returns {boolean | undefined} The result.
 */
export function readShowMasterSp(slideRoot: OoxmlElement): boolean | undefined {
    for (let i: number = 0; i < slideRoot.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(slideRoot.attributes, i);
        if (a.namespaceUri === '' && a.localName === 'showMasterSp') {
            if (a.value === '0' || a.value === 'false') {
                return false;
            }
            if (a.value === '1' || a.value === 'true') {
                return true;
            }
            return undefined;
        }

    }
    return undefined;
}
