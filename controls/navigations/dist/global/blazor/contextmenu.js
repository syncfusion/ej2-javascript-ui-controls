window.sf = window.sf || {};
var sfcontextmenu = (function (exports) {
'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../common/menu-base-model.d.ts'/>
/**
 * The ContextMenu is a graphical user interface that appears on the user right click/touch hold operation.
 * ```html
 * <div id = 'target'></div>
 * <ul id = 'contextmenu'></ul>
 * ```
 * ```typescript
 * <script>
 * var contextMenuObj = new ContextMenu({items: [{ text: 'Cut' }, { text: 'Copy' },{ text: 'Paste' }], target: '#target'});
 * </script>
 * ```
 */
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    /**
     * Constructor for creating the widget.
     * @private
     */
    function ContextMenu(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * For internal use only - prerender processing.
     * @private
     */
    ContextMenu.prototype.preRender = function () {
        this.isMenu = false;
        this.element.id = this.element.id || sf.base.getUniqueID('ej2-contextmenu');
        _super.prototype.preRender.call(this);
    };
    ContextMenu.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        sf.base.attributes(this.element, { 'role': 'context menu', 'tabindex': '0' });
        this.element.style.zIndex = sf.popups.getZindexPartial(this.element).toString();
    };
    /**
     * This method is used to open the ContextMenu in specified position.
     * @param top - To specify ContextMenu vertical positioning.
     * @param left - To specify ContextMenu horizontal positioning.
     * @param target - To calculate z-index for ContextMenu based upon the specified target.
     * @method open
     * @returns void
     */
    ContextMenu.prototype.open = function (top, left, target) {
        _super.prototype.openMenu.call(this, null, null, top, left, null, target);
    };
    /**
     * Closes the ContextMenu if it is opened.
     */
    ContextMenu.prototype.close = function () {
        _super.prototype.closeMenu.call(this);
    };
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {ContextMenuModel} newProp
     * @param {ContextMenuModel} oldProp
     * @returns void
     */
    ContextMenu.prototype.onPropertyChanged = function (newProp, oldProp) {
        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'filter':
                    this.close();
                    this.filter = newProp.filter;
                    break;
                case 'target':
                    this.unWireEvents(oldProp.target);
                    this.wireEvents();
                    break;
            }
        }
    };
    /**
     * Get module name.
     * @returns string
     * @private
     */
    ContextMenu.prototype.getModuleName = function () {
        return 'contextmenu';
    };
    __decorate([
        sf.base.Property('')
    ], ContextMenu.prototype, "target", void 0);
    __decorate([
        sf.base.Property('')
    ], ContextMenu.prototype, "filter", void 0);
    __decorate([
        sf.base.Collection([], sf.navigations.MenuItem)
    ], ContextMenu.prototype, "items", void 0);
    ContextMenu = __decorate([
        sf.base.NotifyPropertyChanges
    ], ContextMenu);
    return ContextMenu;
}(sf.navigations.MenuBase));

/**
 * ContextMenu modules
 */

exports.ContextMenu = ContextMenu;

return exports;

});
sfBlazor.modules["contextmenu"] = "navigations.ContextMenu";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.contextmenu, () => {
    sf.navigations = sf.base.extend({}, sf.navigations, sfcontextmenu({}));
});