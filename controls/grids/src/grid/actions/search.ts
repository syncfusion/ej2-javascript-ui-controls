import { addClass, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { isActionPrevent } from '../base/util';
import { SearchSettingsModel } from '../base/grid-model';

/**
 * The `Search` module is used to handle search action.
 */
export class Search implements IAction {

    //Internal variables
    /** @hidden */
    public headerFocus: boolean = false;
    //Module declarations
    private parent: IGrid;
    /** @hidden */
    public refreshSearch: boolean;
    private actionCompleteFunc: Function;

    /**
     * Constructor for Grid search module.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Checks if the input string contains non-numeric characters.
     *
     * @param {string} searchString - The string to be checked for non-numeric characters.
     * @returns {boolean} - `true` if the input string contains non-numeric characters, `false` otherwise.
     */
    private hasNonNumericCharacters(searchString: string): boolean {
        let decimalFound: boolean = false;
        for (const char of searchString) {
            if ((char < '0' || char > '9') && char !== '.') {
                return true;
            }
            if (char === '.') {
                if (decimalFound) {
                    // If decimal is found more than once, it's not valid
                    return true;
                }
                decimalFound = true;
            }
        }
        return false;
    }

    /**
     * Searches Grid records by given key.
     *
     * > You can customize the default search action by using [`searchSettings`](./searchsettings/).
     *
     * @param  {string} searchString - Defines the key.
     * @returns {void}
     */
    public search(searchString: string): void {
        const gObj: IGrid = this.parent;
        searchString = isNullOrUndefined(searchString) ? '' : searchString;
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.search, arg1: searchString });
            return;
        }
        if (searchString !== gObj.searchSettings.key) {
            this.headerFocus = false;
            // Check searchString is number and parseFloat to remove trailing zeros
            if (searchString !== '' && !this.hasNonNumericCharacters(searchString)) {
                const parts: string[] = searchString.split('.');
                if (searchString === '.' || (searchString.indexOf('.') === -1) || (parts[0].startsWith('0') && parts[0].length > 1)) {
                    gObj.searchSettings.key = searchString.toString();
                } else {
                    gObj.searchSettings.key = parseFloat(searchString).toString();
                }
            } else {
                gObj.searchSettings.key = searchString.toString();
            }
            gObj.dataBind();
        } else if (this.refreshSearch) {
            gObj.refresh();
        } else {
            this.headerFocus = false;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.searchComplete, this.onSearchComplete, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.actionCompleteFunc = this.onActionComplete.bind(this);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.on(events.cancelBegin, this.cancelBeginEvent, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.searchComplete, this.onSearchComplete);
        this.parent.off(events.destroy, this.destroy);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.off(events.cancelBegin, this.cancelBeginEvent);
    }

    /**
     * To destroy the print
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * @param {NotifyArgs} e - specfies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (!isNullOrUndefined((e.properties as SearchSettingsModel).key)) {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin, searchString: this.parent.searchSettings.key
            });
        } else {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin
            });
        }
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onSearchComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, {
            searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
        }));
    }

    /**
     * The function used to store the requestType
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        if (this.refreshSearch && e.requestType === 'refresh' && this.headerFocus) {
            this.headerFocus = false;
            this.parent.focusModule.focus();
            addClass([this.parent.focusModule.currentInfo.element], ['e-focused']);
        }
        this.refreshSearch = e.requestType !== 'searching';
    }

    private cancelBeginEvent(e: { requestType: string }): void {
        if (e.requestType === 'searching') {
            this.parent.setProperties({ searchSettings: { key: '' } }, true);
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'search';
    }
}
