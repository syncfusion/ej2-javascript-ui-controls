import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { SmithchartFontModel} from '../utils/utils-model';
import { SmithchartFont } from '../utils/utils';
import { SmithchartAlignment } from '../utils/enum';
import { Theme } from '../model/theme';

import { SubtitleModel} from '../title/title-model';

export class Subtitle extends ChildProperty<Subtitle> {

/**
 * visibility for sub title.

 */
@Property(true)
public visible: boolean;

/**
 * text for sub title.

 */
@Property('')
public text: string;

/**
 * description for sub title.

 */
@Property('')
public description: string;

/**
 * text alignment for sub title.

 */
@Property('Far')
public textAlignment: SmithchartAlignment;

 /**
  * trim the sub title.

  */
@Property(true)
public enableTrim: boolean;
/**
 * maximum width of the sub title.


 */
@Property(null)
public maximumWidth: number;

/**
 * options for customizing sub title font
 */

@Complex<SmithchartFontModel>(Theme.smithchartSubtitleFont, SmithchartFont)
    public textStyle: SmithchartFontModel;

}

export class Title extends ChildProperty<Title> {

/**
 * visibility for title.

 */
@Property(true)
public visible: boolean;

/**
 * text for title.

 */
@Property('')
public text: string;

/**
 * description for title.

 */
@Property('')
public description: string;
/**
 * text alignment for title.

 */
@Property('Center')
public textAlignment: SmithchartAlignment;

/**
 * trim the title.

 */

@Property(true)
public enableTrim: boolean;

/**
 * maximum width of the sub title


 */
@Property(null)
public maximumWidth: number;

/**
 * options for customizing sub title
 */

@Complex<SubtitleModel>({}, Subtitle)
    public subtitle: SubtitleModel;

/**
 * options for customizing title font
 */

@Complex<SmithchartFontModel>(Theme.smithchartTitleFont, SmithchartFont)
    public font: SmithchartFontModel;

/**
 * options for customizing title text
 */

@Complex<SmithchartFontModel>(Theme.smithchartTitleFont, SmithchartFont)
    public textStyle: SmithchartFontModel;

}

