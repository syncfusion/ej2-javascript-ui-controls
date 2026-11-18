/**
 * Built-in minimal diagram part XML seeds for {@link createDiagramInstance}.
 *
 * @remarks
 * Documented sample only — not a layout catalog. Roots match Transitional
 * `dml-diagram.xsd` (`dataModel`, `layoutDef`, `colorsDef`, `styleDef`).
 * ECMA-376 Part 1 §14.2.3–14.2.6.
 * @private
 */

/** Minimal `dgm:dataModel` with required `ptLst` (doc + one node). */
export const MINIMAL_DIAGRAM_DATA_XML: string =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<dgm:dataModel xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"' +
  ' xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
  '<dgm:ptLst>' +
  '<dgm:pt modelId="{00000000-0000-0000-0000-000000000001}" type="doc"/>' +
  '<dgm:pt modelId="{00000000-0000-0000-0000-000000000002}"/>' +
  '</dgm:ptLst>' +
  '</dgm:dataModel>';

/** Minimal `dgm:layoutDef` with title/desc. */
export const MINIMAL_DIAGRAM_LAYOUT_XML: string =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<dgm:layoutDef xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"' +
  ' uniqueId="urn:@syncfusion/ej2-office-common:sample:layout">' +
  '<dgm:title lang="" val="Sample Layout"/>' +
  '<dgm:desc lang="" val="Built-in minimal layoutDef"/>' +
  '</dgm:layoutDef>';

/** Minimal `dgm:colorsDef`. */
export const MINIMAL_DIAGRAM_COLORS_XML: string =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<dgm:colorsDef xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"' +
  ' uniqueId="urn:@syncfusion/ej2-office-common:sample:colors">' +
  '<dgm:title lang="" val="Sample Colors"/>' +
  '<dgm:desc lang="" val="Built-in minimal colorsDef"/>' +
  '</dgm:colorsDef>';

/** Minimal `dgm:styleDef`. */
export const MINIMAL_DIAGRAM_STYLE_XML: string =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<dgm:styleDef xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"' +
  ' uniqueId="urn:@syncfusion/ej2-office-common:sample:style">' +
  '<dgm:title lang="" val="Sample Style"/>' +
  '<dgm:desc lang="" val="Built-in minimal styleDef"/>' +
  '</dgm:styleDef>';
