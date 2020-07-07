window.sf = window.sf || {};
var splitbuttonsbase = (function (exports) {
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
/**
 * @param props
 * @param model
 */
function getModel(props, model) {
    var obj = sf.base.extend({}, props);
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var prop = _a[_i];
        if ((model).indexOf(prop) < 0) {
            sf.base.deleteObject(obj, prop);
        }
    }
    return obj;
}
/** @hidden */
function upDownKeyHandler(ul, keyCode) {
    var defaultIdx = keyCode === 40 ? 0 : ul.childElementCount - 1;
    var liIdx = defaultIdx;
    var li;
    var selectedLi = ul.querySelector('.e-selected');
    if (selectedLi) {
        selectedLi.classList.remove('e-selected');
    }
    for (var i = 0, len = ul.children.length; i < len; i++) {
        if (ul.children[i].classList.contains('e-focused')) {
            li = ul.children[i];
            liIdx = i;
            li.classList.remove('e-focused');
            keyCode === 40 ? liIdx++ : liIdx--;
            if (liIdx === (keyCode === 40 ? ul.childElementCount : -1)) {
                liIdx = defaultIdx;
            }
        }
    }
    li = ul.children[liIdx];
    liIdx = isValidLI(ul, li, liIdx, keyCode);
    if (liIdx !== -1) {
        sf.base.addClass([ul.children[liIdx]], 'e-focused');
        ul.children[liIdx].focus();
    }
}
function isValidLI(ul, li, index, keyCode, count) {
    if (count === void 0) { count = 0; }
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        if (index === (keyCode === 40 ? ul.childElementCount - 1 : 0)) {
            index = keyCode === 40 ? 0 : ul.childElementCount - 1;
        }
        else {
            keyCode === 40 ? index++ : index--;
        }
    }
    li = ul.children[index];
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        count++;
        if (count === ul.childElementCount) {
            return index = -1;
        }
        index = isValidLI(ul, li, index, keyCode, count);
    }
    return index;
}
/**
 * Defines the items of Split Button/DropDownButton.
 */
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "id", void 0);
    __decorate([
        sf.base.Property(false)
    ], Item.prototype, "separator", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "text", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "url", void 0);
    return Item;
}(sf.base.ChildProperty));

exports.getModel = getModel;
exports.upDownKeyHandler = upDownKeyHandler;
exports.Item = Item;

return exports;

});
sfBlazor.modules["splitbuttonsbase"] = "splitbuttons.getModel";
window.sf.splitbuttons = window.sf.base.extend({}, window.sf.splitbuttons, splitbuttonsbase({}));
