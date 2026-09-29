import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['dataSource', 'displayTemplate', 'fields', 'filterType', 'highlight', 'itemTemplate', 'mentionChar', 'noRecordsTemplate', 'popupHeight', 'popupWidth', 'query', 'showMentionChar'];
let outputs: string[] = [];
/**
 * Represents the Essential JS 2 Angular AIAssistView Component.
 * ```html
 * <ejs-aiassistview> 
 *   <e-mentions>
 *     <e-mention>
 *      </e-mention>
 *    </e-mentions>
 * </ejs-aiassistview>
 * ```
 */
@Directive({
    selector: 'ejs-aiassistview>e-mentions>e-mention',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class MentionDirective extends ComplexBase<MentionDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the data source used to populate mention suggestions. 
     * Accepts local collections, DataManager instances, or remote data sources.
     * @default []
     */
    public declare dataSource: any;
    /** 
     * Specifies the template used to display selected mention items. 
     * Accepts a string template or a framework-specific template function.
     * @angulartype string | object
     * @reacttype string | function | JSX.Element
     * @vuetype string | function
     * @asptype string
     * @default ''
     */
    public declare displayTemplate: any;
    /** 
     * Specifies the field mappings for the mention data source. 
     * Maps data fields used for displaying and identifying mention items.
     * @default { text: 'text', value: 'id' }
     */
    public declare fields: any;
    /** 
     * Specifies the filtering type used for matching suggestion items. 
     * Accepts filtering options such as Contains, StartsWith, or EndsWith.
     * @default 'Contains'
     */
    public declare filterType: any;
    /** 
     * Specifies whether matching characters are highlighted in mention suggestions. 
     * When enabled, matched text is visually emphasized in the popup list.
     * @default false
     */
    public declare highlight: any;
    /** 
     * Specifies the template used to render suggestion list items. 
     * Accepts a template string to customize the appearance of suggestion items.
     * @angulartype string
     * @reacttype string
     * @vuetype string
     * @asptype string
     * @default ''
     */
    public declare itemTemplate: any;
    /** 
     * Specifies the character used to trigger mention suggestions. 
     * Accepts a single character such as '@', '#', or '/'.
     * @default ''
     */
    public declare mentionChar: any;
    /** 
     * Specifies the template displayed when no matching suggestions are found. 
     * Accepts a string value to customize the empty state content shown in the suggestion popup.
     * @angulartype string
     * @reacttype string
     * @vuetype string
     * @asptype string
     * @default 'No records found'
     */
    public declare noRecordsTemplate: any;
    /** 
     * Specifies the height of the mention suggestion popup. 
     * Accepts CSS height values such as '300px' or '50%', or numeric pixel dimensions.
     * @default '300px'
     */
    public declare popupHeight: any;
    /** 
     * Specifies the width of the mention suggestion popup. 
     * Accepts CSS width values such as '400px' or '50%', or numeric pixel dimensions.
     * @default 'auto'
     */
    public declare popupWidth: any;
    /** 
     * Specifies the query used to retrieve and filter mention data. 
     * Applies additional data operations to the configured data source.
     * @default null
     */
    public declare query: any;
    /** 
     * Specifies whether the mention character is displayed in the rendered mention item. 
     * When set to false, the mention character is omitted from the selected mention display.
     * @default true
     */
    public declare showMentionChar: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Mention Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-aiassistview>e-mentions',
    standalone: true,
    queries: {
        children: new ContentChildren(MentionDirective)
    },
})
export class MentionsDirective extends ArrayBase<MentionsDirective> {
    constructor() {
        super('mentions');
    }
}