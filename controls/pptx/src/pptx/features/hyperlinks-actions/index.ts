/**
 * Optional hyperlinks and slide-actions module (`@syncfusion/ej2-pptx/hyperlinks-actions`).
 *
 * @remarks
 * Read/classify and mutate shape and run hyperlinks without pulling authoring
 * APIs into the core bundle. Importing this entry registers feature id
 * {@link HYPERLINKS_ACTIONS_FEATURE_ID}. Core continues to preserve `hlink*` markup
 * and hyperlink relationships when this module is absent.
 *
 * **Mutators** (retarget / clear / add external) take a
 * {@link HostPartRelationshipAccess} from
 * `Presentation.hostPartRelationshipAccess(slide.partName)`. Clear also
 * requires the host document root (`slide.getRoot()`) for `r:id` refcount.
 *
 * **Security:** never fetches Targets; never invokes `ppaction://` or scripts;
 * never opens URLs. Relationship Target strings are stored/updated as opaque text.
 *
 * Citation: `docs/specs/015-hyperlinks.md`; Transitional `dml-main.xsd` `CT_Hyperlink`.
 *
 * @packageDocumentation
 */
import { registerFeature } from '../../core/registry/feature-registry';
import { addExternalHyperlink, AddExternalHyperlinkOptions } from './add-external-hyperlink';
import { clearHyperlink } from './clear-hyperlink';
import { HYPERLINK_REL_TYPE, HYPERLINKS_ACTIONS_FEATURE_ID } from './constants';
import { HyperlinkMutationError } from './errors';
import { readRunHyperlink, RunHyperlinkKind } from './read-run-hyperlink';
import { readShapeHyperlink, ShapeHyperlinkKind } from './read-shape-hyperlink';
import { retargetExternal, retargetInternal } from './retarget-hyperlink';
import { HyperlinkInfo, HyperlinkSourceKind } from './types';
registerFeature({ id: HYPERLINKS_ACTIONS_FEATURE_ID });
export { HYPERLINK_REL_TYPE, HYPERLINKS_ACTIONS_FEATURE_ID, addExternalHyperlink, clearHyperlink, readRunHyperlink,
    readShapeHyperlink, retargetExternal, retargetInternal, HyperlinkMutationError };
export { AddExternalHyperlinkOptions, HyperlinkInfo, HyperlinkSourceKind, RunHyperlinkKind, ShapeHyperlinkKind };
export {
    classifyHyperlinkTarget,
    notePresentation,
    readPictureHyperlinkView,
    readShapeHyperlinkView,
    readTextPartHyperlinkView,
    removePictureHyperlink,
    removeShapeHyperlink,
    removeTextPartHyperlink,
    setPictureHyperlink,
    setShapeHyperlink,
    setTextPartHyperlink
} from './facade';
