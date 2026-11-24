/**
 * DrawingML text body surface (direct paragraphs and text parts).
 *
 * @packageDocumentation
 */
export { TextBody, findTxBody } from './text-body';
export { Paragraph } from './paragraph';
export { TextPart } from './text-part';
export { ParagraphCollection } from './paragraph-collection';
export { TextPartCollection } from './text-part-collection';
export { Font } from './font';
export { TextUnderlineType, TextStrikeType, TextCapsType, isTextUnderlineType, isTextStrikeType, isTextCapsType } from './font-types';
export { TextUnderlineTypeValue, TextStrikeTypeValue, TextCapsTypeValue } from './font-types';
export { ListFormat, ListType, NumberedListStyle, isListType, isNumberedListStyle } from './list-format';
export { ListTypeValue, NumberedListStyleValue } from './list-format';
export { HorizontalAlignmentType, isHorizontalAlignmentType, TextSpacingType, isTextSpacingType } from './paragraph-format-types';
export { HorizontalAlignmentTypeValue, TextSpacingTypeValue, TextSpacingValue } from './paragraph-format-types';
export {
    TextAutoFit, TextBodyProperties, TextTabStop, TextVerticalAnchor, TextVerticalType, TextWrapping
} from './text-layout-types';
export { TextFindMatch } from './find/text-find-match';
export { TextSelection } from './find/text-selection';
import * as findTextEngine from './find/index';
export { findTextEngine };

export { TextRange, TextRangeAnchor } from './text-range';
