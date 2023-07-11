import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { SmithchartFontModel} from '../utils/utils-model';
import { SmithchartFont } from '../utils/utils';
import { SmithchartAlignment } from '../utils/enum';

import { SubtitleModel} from '../title/title-model';

export class Subtitle extends ChildProperty<Subtitle> {

    /**
     * visibility for sub title.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * text for sub title.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * description for sub title.
     *
     * @default ''
     */
    @Property('')
    public description: string;

    /**
     * text alignment for sub title.
     *
     * @default Far
     */
    @Property('Far')
    public textAlignment: SmithchartAlignment;

    /**
     * trim the sub title.
     *
     * @default true
     */
    @Property(true)
    public enableTrim: boolean;
    /**
     * maximum width of the sub title.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public maximumWidth: number;

    /**
     * options for customizing sub title font.
     */

    @Complex<SmithchartFontModel>({fontFamily: null, size: "14px", fontStyle: 'Normal', fontWeight: '400', color: null}, SmithchartFont)
    public textStyle: SmithchartFontModel;

}

export class Title extends ChildProperty<Title> {

    /**
     * visibility for title.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * text for title.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * description for title.
     *
     * @default ''
     */
    @Property('')
    public description: string;
    /**
     * text alignment for title.
     *
     * @default Center
     */
    @Property('Center')
    public textAlignment: SmithchartAlignment;

    /**
     * trim the title.
     *
     * @default true
     */

    @Property(true)
    public enableTrim: boolean;

    /**
     * maximum width of the sub title.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public maximumWidth: number;

    /**
     * options for customizing sub title.
     */

    @Complex<SubtitleModel>({}, Subtitle)
    public subtitle: SubtitleModel;

    /**
     * options for customizing title font.
     */

    @Complex<SmithchartFontModel>({fontFamily: null, size: "16px", fontStyle: 'Normal', fontWeight: '600', color: null}, SmithchartFont)
    public font: SmithchartFontModel;

    /**
     * options for customizing title text.
     */

    @Complex<SmithchartFontModel>({fontFamily: null, size: "16px", fontStyle: 'Normal', fontWeight: '600', color: null}, SmithchartFont)
    public textStyle: SmithchartFontModel;

}

