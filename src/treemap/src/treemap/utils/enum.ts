/**
 * Specifies the enum values for tree map components.
 */

/**
 * Specifies the types of label position.
 */
export type LabelPosition =
    /** Specifies the top left */
    'TopLeft' |
    /** Specifies the top center */
    'TopCenter' |
    /** Specifies the top right */
    'TopRight' |
    /** Specifies the center left */
    'CenterLeft' |
    /** Specifies the center */
    'Center' |
    /** Specifies the center right */
    'CenterRight' |
    /** Specifies the bottom left */
    'BottomLeft' |
    /** Specifies the bottom center */
    'BottomCenter' |
    /** Specifies the bottom right */
    'BottomRight';

/**
 * Specifies the types of layout rendering modes.
 */
export type LayoutMode =
    /** Specifies the squarified */
    'Squarified' |
    /** Specifies the horizontal */
    'SliceAndDiceHorizontal' |
    /** Specifies the vertical */
    'SliceAndDiceVertical' |
    /** Specifies the auto */
    'SliceAndDiceAuto';

/** 
 * Defines the Alignment.
 */
export type Alignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';
/**
 * Defines the highlight mode.
 */
export type HighLightMode =
    /** Define the item. */
    'Item' |
    /** Define the child. */
    'Child' |
    /** Define the parent. */
    'Parent' |
    /** Define the all. */
    'All';
/**
 * Defines the highlight mode.
 */
export type SelectionMode =
    /** Define the item. */
    'Item' |
    /** Define the child. */
    'Child' |
    /** Define the parent. */
    'Parent' |
    /** Define the all. */
    'All';
export type ExportType =
    /** Used to export a image as png format */
    'PNG' |
    /** Used to export a image as jpeg format */
    'JPEG' |
    /** Used to export a file as svg format */
    'SVG' |
    /** Used to export a file as pdf format */
    'PDF';
/**
 * labelAlignment
 */
export type LabelAlignment =
    /** Trim */
    'Trim' |
    /** Hide */
    'Hide' |
    /** WordByWrap */
    'WrapByWord' |
    /** WordByText */
    'Wrap';

/** 
 * Defines the shape of legend.
 */
export type LegendShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a Star. */
    'Star' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a image */
    'Image';
/** 
 * Defines the position of the legend. They are
 * * top - Displays the legend on the top.
 * * left - Displays the legend on the left.
 * * bottom - Displays the legend on the bottom.
 * * right - Displays the legend on the right.
 * * float - Displays the legend  based on given x and y value.
 */
export type LegendPosition =
    /** Places the legend on the top. */
    'Top' |
    /** Places the legend on the left. */
    'Left' |
    /** Places the legend on the bottom. */
    'Bottom' |
    /** Places the legend on the right. */
    'Right' |
    /** Places the legend based on given x and y. */
    'Float';
/** 
 * Defines the Legend modes. They are
 * * Default - Specifies the Default mode.
 * * interactive - specifies the Interactive mode.
 */
export type LegendMode =
    /** Legend remains static */
    'Default' |
    /** Legend remains interactively */
    'Interactive';
/**
 * Defines the legend arrangement
 */
export type LegendOrientation =
    /** Legend item placed default based on legend orientation */
    'None' |
    /** Legend items placed in row wise */
    'Horizontal' |
    /** Legend items place in column wise */
    'Vertical';
/**
 * Defines the label intersect action types
 */
export type LabelIntersectAction =
    /** Specifies the intersect action as None */
    'None' |
    /** Specifies the intersect action as Trim  */
    'Trim' |
    /**  Specifies the intersect action as Hide */
    'Hide';

/**
 * Defines the label placement type
 */
export type LabelPlacement =
    /** Specifies the label placement as Before */
    'Before' |
    /** Specifies the label plcement as After */
    'After';

/** 
 * Defines Theme. They are
 * * Material - Render a treemap with Material theme.
 * * Fabric - Render a treemap with Fabric theme
 * * Bootstrap - Render a treemap with Bootstrap theme
 */
export type TreeMapTheme =
    /**  Render a treemap with Material theme. */
    'Material' |
    /**  Render a treemap with Fabric theme. */
    'Fabric' |
    /**  Render a treemap with HighContrast theme. */
    'Highcontrast' |
    /**  Render a treemap with Bootstrap theme. */
    'Bootstrap';