/**
 * Public barrel for the ResizableNodeView infrastructure.
 *
 * Lives at the top-level public surface (`src/nodeviews/`). Nothing inside
 * this barrel may import from `src/pm/`, `src/extensions/`, or any
 * `prosemirror-*` package — see `tools/check-no-pm-imports.mjs`.
 */

export { ResizableNodeView } from './resizable-node-view';
export type {
    ResizableNodeViewDirection,
    ResizableNodeDimensions,
    ResizableNodeViewBehaviorOptions,
    ResizableNodeViewClassNames,
    ResizableNodeViewOptions
} from './resizable-node-view.types';
