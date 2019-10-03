import { Component, ModuleDeclaration, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { createElement, remove, classList, compile as templateCompiler } from '@syncfusion/ej2-base';import { isNullOrUndefined } from '@syncfusion/ej2-base';import { Property, Event, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { PagerDropDown } from './pager-dropdown';import { NumericContainer } from './numeric-container';import { PagerMessage } from './pager-message';import { ExternalMessage } from './external-message';import { appendChildren } from '../grid/base/util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Pager
 */
export interface PagerModel extends ComponentModel{

    /**
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  

     */
    enableQueryString?: boolean;

    /**
     * If `enableExternalMessage` set to true, then it adds the message to Pager.  

     */
    enableExternalMessage?: boolean;

    /**
     * If `enablePagerMessage` set to true, then it adds the pager information.  

     */
    enablePagerMessage?: boolean;

    /**
     * Defines the records count of visible page.  

     */
    pageSize?: number;

    /**
     * Defines the number of pages to display in pager container.   

     */
    pageCount?: number;

    /**
     * Defines the current page number of pager.   

     */
    currentPage?: number;

    /**
     * Gets or Sets the total records count which is used to render numeric container.   

     */
    totalRecordsCount?: number;

    /**
     * Defines the external message of Pager.  

     */
    externalMessage?: string;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager which allow us to select pageSize from DropDownList.    

     */
    pageSizes?: boolean | (number | string)[];

    /**
     *  Defines the template as string or HTML element ID which renders customized elements in pager instead of default elements.    

     */
    template?: string;

    /**
     * Defines the customized text to append with numeric items.  

     */
    customText?: string;

    /**
     * Triggers when click on the numeric items.   

     */
    click?: EmitType<Object>;

    /**
     * Triggers after pageSize is selected in DropDownList.   

     */
    dropDownChanged?: EmitType<Object>;

    /**
     * Triggers when Pager is created.   

     */
    created?: EmitType<Object>;

}