import { Component, ModuleDeclaration, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { createElement, remove, classList, compile as templateCompiler } from '@syncfusion/ej2-base';import { isNullOrUndefined } from '@syncfusion/ej2-base';import { Property, Event, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { PagerDropDown } from './pager-dropdown';import { NumericContainer } from './numeric-container';import { PagerMessage } from './pager-message';import { ExternalMessage } from './external-message';import { appendChildren } from '../grid/base/util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Pager
 */
export interface PagerModel extends ComponentModel{

    /**
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  
     * @default false  
     */
    enableQueryString?: boolean;

    /**
     * If `enableExternalMessage` set to true, then it adds the message to Pager.  
     * @default false  
     */
    enableExternalMessage?: boolean;

    /**
     * If `enablePagerMessage` set to true, then it adds the pager information.  
     * @default true  
     */
    enablePagerMessage?: boolean;

    /**
     * Defines the records count of visible page.  
     * @default 12  
     */
    pageSize?: number;

    /**
     * Defines the number of pages to display in pager container.   
     * @default 10  
     */
    pageCount?: number;

    /**
     * Defines the current page number of pager.   
     * @default 1  
     */
    currentPage?: number;

    /**
     * Gets or Sets the total records count which is used to render numeric container.   
     * @default null  
     */
    totalRecordsCount?: number;

    /**
     * Defines the external message of Pager.  
     * @default null  
     */
    externalMessage?: string;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager which allow us to select pageSize from DropDownList.    
     * @default false    
     */
    pageSizes?: boolean | (number | string)[];

    /**
     *  Defines the template as string or HTML element ID which renders customized elements in pager instead of default elements.    
     * @default null    
     */
    template?: string;

    /**
     * Defines the customized text to append with numeric items.  
     * @default null  
     */
    customText?: string;

    /**
     * Triggers when click on the numeric items.   
     * @default null  
     */
    click?: EmitType<Object>;

    /**
     * Triggers after pageSize is selected in DropDownList.   
     * @default null  
     */
    dropDownChanged?: EmitType<Object>;

    /**
     * Triggers when Pager is created.   
     * @default null  
     */
    created?: EmitType<Object>;

}