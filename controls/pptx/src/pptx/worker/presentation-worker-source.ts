/**
 * Self-contained browser Worker bootstrap for a lazy PPTX package session.
 *
 * The string intentionally has no imports: Blob workers cannot resolve bare npm
 * specifiers. Keeping this source in the library preserves the library/viewer
 * parsing boundary while allowing both CDN and npm consumers to create one
 * inline Worker.
 */
export const PRESENTATION_WORKER_SOURCE: string = `
(function () {
  'use strict';
  // BEGIN GENERATED GRADIENT TRANSPORT
var gradientTransport=function(e){"use strict";function r(e,r){if("http://purl.oclc.org/ooxml/presentationml/main"!==e&&"http://purl.oclc.org/ooxml/drawingml/main"!==e&&"http://purl.oclc.org/ooxml/drawingml/chart"!==e)return r;switch(r){case"http://schemas.openxmlformats.org/presentationml/2006/main":return"http://purl.oclc.org/ooxml/presentationml/main";case"http://schemas.openxmlformats.org/drawingml/2006/main":return"http://purl.oclc.org/ooxml/drawingml/main";case"http://schemas.openxmlformats.org/officeDocument/2006/relationships":return"http://purl.oclc.org/ooxml/officeDocument/relationships";default:return r}}function n(e,r){return-1!==e.indexOf(r)}function i(e,r){if(!("number"!=typeof r||!Number.isFinite(r)||r<0||r>=e.length))return e[Math.floor(r)]}function t(e,r,n){Object.defineProperty(e,r,{value:n,writable:!0,enumerable:!0,configurable:!0})}function o(e,n,t){n=r(e.namespaceUri,n);for(var o=0;o<e.children.length;o++){var a=i(e.children,o);if("element"===a.kind&&a.namespaceUri===n&&a.localName===t)return a}}function a(e,n,t){n=r(e.namespaceUri,n);for(var o=0;o<e.attributes.length;o++){var a=i(e.attributes,o);if(a.namespaceUri===n&&a.localName===t)return a.value}}function l(e){for(var r="",n=0;n<e.children.length;n++){var t=i(e.children,n);"text"===t.kind&&(r+=t.text)}return r}var d="http://schemas.openxmlformats.org/drawingml/2006/main";function s(e){if(void 0!==o(e,d,"noAutofit"))return{type:"none"};if(void 0!==o(e,d,"spAutoFit"))return{type:"shape"};var r=o(e,d,"normAutofit");return void 0!==r?{type:"normal",fontScale:u(r,"fontScale"),lineSpacingReduction:u(r,"lnSpcReduction")}:void 0}function c(e,r){var n=a(e,"",r),i=Number(n);return void 0!==n&&Number.isFinite(i)?i/12700:void 0}function u(e,r){var n=a(e,"",r),i=Number(n);return void 0!==n&&Number.isFinite(i)?i/1e3:void 0}function v(e,r){return r.find(function(r){return r===e})}var f,p=(f=function(e,r){return f=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])},f(e,r)},function(e,r){function n(){this.constructor=e}f(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),m=function(e){function r(r,n){void 0===n&&(n={});var i=this,t=void 0===n.partName?"":" (part: "+n.partName+")",o=void 0===n.actual?"":"; actual value: "+String(n.actual);return(i=e.call(this,"Package security limit exceeded: "+r+t+o)||this).name="PackageLimitError",i.limit=r,i.partName=n.partName,i.actual=n.actual,i}return p(r,e),r}(Error),h=function(e){function r(r,n){void 0===n&&(n={});var i=this,t=void 0===n.partName?"":" (part: "+n.partName+")",o=void 0===n.actual?"":"; actual value: "+String(n.actual);return(i=e.call(this,"XML security limit exceeded: "+r+t+o)||this).name="XmlLimitError",i.limit=r,i.partName=n.partName,i.actual=n.actual,i}return p(r,e),r}(Error),g=(function(e){function r(r){var n=e.call(this,r)||this;return n.name="EncryptedPackageError",n}p(r,e)}(Error),function(e){function r(r){void 0===r&&(r="Invalid password");var n=e.call(this,r)||this;return n.name="InvalidPasswordError",n}p(r,e)}(Error),function(e){function r(r){void 0===r&&(r="Unsupported encryption method");var n=e.call(this,r)||this;return n.name="UnsupportedEncryptionError",n}p(r,e)}(Error),function(e){function r(r,n){void 0===n&&(n={});var i=e.call(this,r)||this;return i.name="InvalidPackageError",i.partName=n.partName,i}p(r,e)}(Error),Object.freeze(["dk1","lt1","dk2","lt2","accent1","accent2","accent3","accent4","accent5","accent6","hlink","folHlink"])),k=Object.freeze(["bg1","tx1","bg2","tx2","accent1","accent2","accent3","accent4","accent5","accent6","hlink","folHlink"]),y=(Object.freeze(["bg1","tx1","bg2","tx2","accent1","accent2","accent3","accent4","accent5","accent6","hlink","folHlink","phClr","dk1","lt1","dk2","lt2"]),new Set(g)),b=new Set(k);function F(e){return y.has(e)}function x(e,n){void 0===n&&(n=r(e.namespaceUri,d));for(var t=0;t<e.children.length;t++){var o=i(e.children,t);if("element"===o.kind&&o.namespaceUri===n)switch(o.localName){case"srgbClr":if(void 0===(p=a(o,"","val")))return;return{kind:"srgb",val:p};case"scrgbClr":var l=a(o,"","r"),s=a(o,"","g"),c=a(o,"","b");if(void 0===l||void 0===s||void 0===c)return;return{kind:"scrgb",r:l,g:s,b:c};case"hslClr":var u=a(o,"","hue"),v=a(o,"","sat"),f=a(o,"","lum");if(void 0===u||void 0===v||void 0===f)return;return{kind:"hsl",hue:u,sat:v,lum:f};case"sysClr":if(void 0===(p=a(o,"","val")))return;return{kind:"sys",val:p,lastClr:a(o,"","lastClr")};case"schemeClr":if(void 0===(p=a(o,"","val")))return;return{kind:"scheme",val:p};case"prstClr":var p;if(void 0===(p=a(o,"","val")))return;return{kind:"prst",val:p}}}}function N(e,r,n){if(void 0===e)return{kind:"absent"};var i;if("%"===e.charAt(e.length-1)){var t=e.slice(0,-1);if(!function(e,r){var n="rectangle"===r&&"-"===e.charAt(0)?e.slice(1):e,i=n.indexOf("."),t=i<0?n:n.slice(0,i),o=i<0?"":n.slice(i+1);if(!/^[0-9]+$/.test(t)||i>=0&&!/^[0-9]+$/.test(o))return!1;return"rectangle"===r||(t.length<=2||"100"===t)&&o.length<=2}(t,n))return{kind:"invalid",raw:e};i=Number(t+"e-2")}else{if("transitional"!==r)return{kind:"invalid",raw:e};var o=P(e);if(void 0===o||o<-2147483648||o>2147483647)return{kind:"invalid",raw:e};i=o/1e5}return!Number.isFinite(i)||"stop"===n&&(i<0||i>1)?{kind:"invalid",raw:e}:{kind:"value",raw:e,value:i}}function w(e){if(void 0===e)return{kind:"absent"};var r=P(e);return void 0===r||r<0||r>=216e5?{kind:"invalid",raw:e}:{kind:"value",raw:e,value:r/6e4}}function C(e){if(void 0===e)return{kind:"absent"};var r=S(e);return"true"===r||"1"===r?{kind:"value",raw:e,value:!0}:"false"===r||"0"===r?{kind:"value",raw:e,value:!1}:{kind:"invalid",raw:e}}function S(e){return e.replace(/^[ \\t\\r\\n]+/,"").replace(/[ \\t\\r\\n]+$/,"")}function P(e){var r=S(e);if(/^[+-]?[0-9]+$/.test(r)){var n=Number(r);return Number.isFinite(n)?n:void 0}}var E=function(){return E=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},E.apply(this,arguments)},B="http://purl.oclc.org/ooxml/drawingml/main";function D(e,r){var n=e.namespaceUri;if("gradFill"===e.localName&&(n===d||n===B)){var t=n===B?"strict":"transitional",o=[],l=A(e,n,"gsLst");l.length>1&&M(o,"gsLst","Multiple gradient stop lists.");var s=0===l.length?[]:A(i(l,0),n,"gs");l.length>0&&s.length<2&&M(o,"gsLst","A present stop list requires at least two stops.");var c=0===l.length?void 0:s.map(function(e,r){var l=N(a(e,"","pos"),t,"stop");"value"!==l.kind&&M(o,"gs/@pos","Missing or invalid stop position.",r);var d=x(e,n),s=A(e,n).filter(function(e){return"srgbClr"===(r=e.localName)||"scrgbClr"===r||"hslClr"===r||"sysClr"===r||"schemeClr"===r||"prstClr"===r;var r});return 1===s.length&&void 0!==d||M(o,"gs/color","A stop requires exactly one recognized color choice.",r),{position:l,color:d,colorTransforms:U(0===s.length?void 0:i(s,0),n,t)}}),u=A(e,n).filter(function(e){return"lin"===e.localName||"path"===e.localName});u.length>1&&M(o,"shade","Gradient shading is one linear or path choice.");var v=0===u.length?void 0:function(e,r,n,i){if("lin"===e.localName){var t=w(a(e,"","ang")),o=C(a(e,"","scaled"));return T(i,"lin/@ang",t),T(i,"lin/@scaled",o),{kind:"linear",angle:t,scaled:o}}var l=function(e){if(void 0===e)return{kind:"absent"};var r=j(e);return"circle"===r||"rect"===r||"shape"===r?{kind:"value",raw:e,value:r}:{kind:"invalid",raw:e}}(a(e,"","path"));return T(i,"path/@path",l),{kind:"path",path:l,fillToRect:O(e,"fillToRect",r,n,i)}}(i(u,0),n,t,o),f=C(a(e,"","rotWithShape")),p=function(e){if(void 0===e)return{kind:"absent"};var r=j(e);return"none"===r||"x"===r||"y"===r||"xy"===r?{kind:"value",raw:e,value:r}:{kind:"invalid",raw:e}}(a(e,"","flip"));return T(o,"gradFill/@rotWithShape",f),T(o,"gradFill/@flip",p),{kind:"gradient",stops:c,shade:v,rotateWithShape:f,flip:p,tileRect:O(e,"tileRect",n,t,o),diagnostics:void 0===r?o:o.map(function(e){return E({},e,{partName:r})})}}}function O(e,r,n,t,o){var l=A(e,n,r);if(0!==l.length){l.length>1&&M(o,r,"Multiple rectangle elements.");var d=i(l,0),s=N(a(d,"","l"),t,"rectangle"),c=N(a(d,"","t"),t,"rectangle"),u=N(a(d,"","r"),t,"rectangle"),v=N(a(d,"","b"),t,"rectangle");return T(o,r+"/@l",s),T(o,r+"/@t",c),T(o,r+"/@r",u),T(o,r+"/@b",v),{left:s,top:c,right:u,bottom:v}}}function U(e,r,n){return void 0===e?[]:A(e,r).map(function(e){var r,i=a(e,"","val");if(void 0!==i&&"%"===i.charAt(i.length-1)){var t=N(i,n,"rectangle");r="value"===t.kind?1e5*t.value:void 0}else if(void 0!==i&&/^[+-]?[0-9]+$/.test(j(i))){var o=Number(j(i));r=Number.isFinite(o)?o:void 0}return{kind:e.localName,value:r}})}function A(e,r,n){for(var t=[],o=0;o<e.children.length;o++){var a=i(e.children,o);"element"!==a.kind||a.namespaceUri!==r||void 0!==n&&a.localName!==n||t.push(a)}return t}function T(e,r,n){"invalid"===n.kind&&M(e,r,"Invalid authored value.")}function M(e,r,n,i){e.push({field:r,stopIndex:i,message:n})}function R(e){return e===d||"http://schemas.openxmlformats.org/presentationml/2006/main"===e?d:e===B||"http://purl.oclc.org/ooxml/presentationml/main"===e?B:void 0}function j(e){return e.replace(/^[ \\t\\r\\n]+/,"").replace(/[ \\t\\r\\n]+$/,"")}var G=function(){return G=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},G.apply(this,arguments)};function I(e,r){var n=a(e,"","w"),i=a(e,"","cap"),t=a(e,"","cmpd"),l=a(e,"","algn"),d=o(e,r,"prstDash"),s=o(e,r,"custDash"),c=e.children.find(function(e){return"element"===e.kind&&e.namespaceUri===r&&["round","bevel","miter"].indexOf(e.localName)>=0}),u=d?G({kind:"preset"},L("value",a(d,"","val"))):s?{kind:"custom",stops:s.children.filter(function(e){return"element"===e.kind&&e.namespaceUri===r&&"ds"===e.localName}).map(function(e){return G({},L("dash",a(e,"","d")),L("space",a(e,"","sp")))})}:void 0,v=G({},L("widthEmu",n),L("cap",i),L("compound",t),L("align",l),u?{dash:u}:{},c?{join:"miter"===c.localName?G({kind:"miter"},L("limit",a(c,"","lim"))):{kind:"round"===c.localName?"round":"bevel"}}:{});return Object.keys(v).length?v:void 0}function L(e,r){var n;return void 0===r?{}:((n={})[e]=r,n)}var z=function(){return z=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},z.apply(this,arguments)},_={kind:"missing"},q={kind:"follow-text"};Object.freeze(_),Object.freeze(q);var V=Object.freeze([]),K=Object.freeze({glyphFill:_,outline:_,underlineFill:_,underlineLine:_}),W=["noFill","solidFill","gradFill","blipFill","pattFill","grpFill"],$=["srgbClr","scrgbClr","hslClr","sysClr","schemeClr","prstClr"];function H(e,r){var n=void 0===e?void 0:R(e.namespaceUri);if(void 0===e||n!==e.namespaceUri||["rPr","defRPr","endParaRPr"].indexOf(e.localName)<0)return K;var i=o(e,n,"ln"),t=Q(e,n,["uFillTx","uFill"]),a=Q(e,n,["uLnTx","uLn"]);return{glyphFill:X(e,n,r),outline:void 0===i?_:z({kind:"line",fill:X(i,n,r)},Z(i,n)),underlineFill:void 0===t?_:"uFillTx"===t.localName?q:{kind:"fill",fill:X(t,n,r)},underlineLine:void 0===a?_:"uLnTx"===a.localName?q:z({kind:"line",fill:X(a,n,r)},Z(a,n))}}function Y(e){return"missing"!==e.glyphFill.kind||"missing"!==e.outline.kind||"missing"!==e.underlineFill.kind||"missing"!==e.underlineLine.kind}function X(e,r,n,i){return e.namespaceUri!==r||R(r)!==r?_:J(e,r,n,i)}function J(e,r,n,i){if(R(r)!==r)return _;var t=Q(e,r,W);if(void 0===t)return _;var o=(void 0===i?void 0:i.get(t))||D(t,n);if(void 0!==o)return o;switch(t.localName){case"noFill":return{kind:"none"};case"grpFill":return{kind:"group"};case"blipFill":return{kind:"picture"};case"pattFill":return{kind:"pattern",preset:a(t,"","prst")};default:var l=Q(t,r,$),d=void 0===l||0===l.children.length?V:U(l,r,"http://purl.oclc.org/ooxml/drawingml/main"===r?"strict":"transitional");return{kind:"solid",color:x(t,r),colorTransforms:d}}}function Q(e,r,n){for(var t=0;t<e.children.length;t++){var o=i(e.children,t);if("element"===o.kind&&o.namespaceUri===r&&n.indexOf(o.localName)>=0)return o}}function Z(e,r){var n=I(e,r);return n?{lineStyle:n}:{}}var ee=function(){return ee=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},ee.apply(this,arguments)},re="http://schemas.openxmlformats.org/drawingml/2006/main";function ne(e,r){void 0===r&&(r={});var n=ae(ve(e,re,"defRPr"),r);return{fontFamily:n.fontFamily,eastAsianFontFamily:n.eastAsianFontFamily,complexScriptFontFamily:n.complexScriptFontFamily,fontSizePt:n.fontSizePt,bold:n.bold,italic:n.italic,caps:n.caps,color:n.color,characterFills:n.characterFills,bullet:ie(e,r),rightToLeft:ue(fe(e,"","rtl")),eastAsianLineBreak:ue(fe(e,"","eaLnBrk")),latinLineBreak:ue(fe(e,"","latinLnBrk")),hangingPunctuation:ue(fe(e,"","hangingPunct"))}}function ie(e,r){if(ve(e,re,"buNone"))return{kind:"none"};var n=function(e){if(ve(e,re,"buFontTx"))return{kind:"followText"};var r=ve(e,re,"buFont");return r?{kind:"explicit",family:fe(r,"","typeface")||""}:void 0}(e),i=function(e){if(ve(e,re,"buSzTx"))return{kind:"followText"};var r=ve(e,re,"buSzPct");if(r)return{kind:"percent",value:(ce(fe(r,"","val"))||1e5)/1e3};var n=ve(e,re,"buSzPts");return n?{kind:"points",value:(ce(fe(n,"","val"))||0)/100}:void 0}(e),t=function(e){if(ve(e,re,"buClrTx"))return{kind:"followText"};var r=le(ve(e,re,"buClr"));return r?{kind:"explicit",color:r}:void 0}(e),o=ve(e,re,"buChar");if(o)return{kind:"character",character:fe(o,"","char")||"",font:n,size:i,color:t};var a=ve(e,re,"buAutoNum");if(a)return{kind:"numbered",scheme:fe(a,"","type")||"arabicPeriod",startAt:ce(fe(a,"","startAt")),font:n,size:i,color:t};var l=ve(e,re,"buBlip");if(l){var d=ve(l,re,"blip"),s=se(d,"embed")||se(d,"link");return{kind:"picture",relationshipId:s,target:void 0===s?void 0:Reflect.get(r,s),font:n,size:i,color:t}}}function te(e,r){void 0===r&&(r={});for(var n=[],i=0;i<e.children.length;i++){var t=e.children.slice(i,i+1)[0];if("element"===t.kind&&t.namespaceUri===R(e.namespaceUri)&&("r"===t.localName||"br"===t.localName||"fld"===t.localName)){var o=ae(ve(t,re,"rPr"),r);if("br"!==t.localName){var a=ve(t,re,"t"),l=void 0===a?"":pe(a);"fld"===t.localName?n.push(ee({kind:"field",text:l},o,{fieldId:fe(t,"","id"),fieldType:fe(t,"","type")})):n.push(ee({kind:"run",text:l},o))}else n.push(ee({kind:"break",text:""},o))}}return n}function oe(e,r){void 0===r&&(r={});var n=ve(e,re,"endParaRPr");return void 0===n?void 0:ae(n,r)}function ae(e,r){if(void 0===e)return{};var n=H(e),i=ve(e,re,"latin"),t=ve(e,re,"ea"),o=ve(e,re,"cs"),a=ve(e,re,"sym"),l=ce(fe(e,"","sz")),d=ce(fe(e,"","baseline")),s=ce(fe(e,"","spc")),c=ve(e,re,"hlinkClick"),u=se(c,"id"),v=void 0===c?void 0:{relationshipId:u,target:void 0===u?void 0:Reflect.get(r,u),tooltip:fe(c,"","tooltip"),action:fe(c,"","action")};return{characterFills:Y(n)?n:void 0,fontFamily:void 0===i?void 0:fe(i,"","typeface"),eastAsianFontFamily:void 0===t?void 0:fe(t,"","typeface"),complexScriptFontFamily:void 0===o?void 0:fe(o,"","typeface"),symbolFontFamily:void 0===a?void 0:fe(a,"","typeface"),fontSizePt:void 0===l?void 0:l/100,bold:ue(fe(e,"","b")),italic:ue(fe(e,"","i")),underline:fe(e,"","u"),strike:fe(e,"","strike"),caps:fe(e,"","cap"),baselinePercent:void 0===d?void 0:d/1e3,characterSpacingPt:void 0===s?void 0:s/100,language:fe(e,"","lang"),color:le(ve(e,re,"solidFill")),highlight:le(ve(e,re,"highlight")),hyperlink:v}}function le(e){if(void 0!==e){var r=function(e){var r=de(e);if(void 0===r||r.namespaceUri!==re)return;var n=fe(r,"","val");if("srgbClr"===r.localName&&void 0!==n)return{kind:"srgb",val:n};if("schemeClr"===r.localName&&void 0!==n)return{kind:"scheme",val:n};if("prstClr"===r.localName&&void 0!==n)return{kind:"prst",val:n};if("sysClr"===r.localName&&void 0!==n)return{kind:"sys",val:n,lastClr:fe(r,"","lastClr")};if("scrgbClr"===r.localName){var i=fe(r,"","r"),t=fe(r,"","g"),o=fe(r,"","b");return void 0!==i&&void 0!==t&&void 0!==o?{kind:"scrgb",r:i,g:t,b:o}:void 0}if("hslClr"===r.localName){var a=fe(r,"","hue"),l=fe(r,"","sat"),d=fe(r,"","lum");return void 0!==a&&void 0!==l&&void 0!==d?{kind:"hsl",hue:a,sat:l,lum:d}:void 0}return}(e);if(void 0!==r){var n=de(e),i=[];if(void 0!==n)for(var t=0;t<n.children.length;t++){var o=n.children.slice(t,t+1)[0];"element"===o.kind&&o.namespaceUri===re&&i.push({kind:o.localName,value:ce(fe(o,"","val"))})}return{value:r,transforms:i}}}}function de(e){for(var r=0;r<e.children.length;r++){var n=e.children.slice(r,r+1)[0];if("element"===n.kind)return n}}function se(e,r){if(void 0!==e)for(var n=0;n<e.attributes.length;n++){var i=e.attributes.slice(n,n+1)[0];if(i.localName===r)return i.value}}function ce(e){if(void 0!==e){var r=Number(e);return Number.isFinite(r)?r:void 0}}function ue(e){if(void 0!==e)return"1"===e||"true"===e.toLowerCase()||"0"!==e&&"false"!==e.toLowerCase()&&void 0}function ve(e,r,n){r===re&&R(e.namespaceUri)===e.namespaceUri&&(r=e.namespaceUri);for(var i=0;i<e.children.length;i++){var t=e.children.slice(i,i+1)[0];if("element"===t.kind&&t.namespaceUri===r&&t.localName===n)return t}}function fe(e,r,n){for(var i=0;i<e.attributes.length;i++){var t=e.attributes.slice(i,i+1)[0];if(t.namespaceUri===r&&t.localName===n)return t.value}}function pe(e){for(var r="",n=0;n<e.children.length;n++){var i=e.children.slice(n,n+1)[0];"text"===i.kind&&(r+=i.text)}return r}function me(e,r){void 0===r&&(r={});for(var n,i,t,l,u,f=void 0===(u=o(e,d,"bodyPr"))?{}:{leftInset:c(u,"lIns"),topInset:c(u,"tIns"),rightInset:c(u,"rIns"),bottomInset:c(u,"bIns"),anchor:v(a(u,"","anchor"),["t","ctr","b","just","dist"]),wrap:v(a(u,"","wrap"),["none","square"]),columnCount:(n=u,i="numCol",t=a(n,"",i),l=Number(t),void 0!==t&&Number.isInteger(l)&&l>0?l:void 0),columnSpacing:c(u,"spcCol"),verticalType:v(a(u,"","vert"),["horz","vert","vert270","wordArtVert","eaVert","mongolianVert","wordArtVertRtl"]),autoFit:s(u)},p=R(e.namespaceUri),m=he(ve(e,p,"lstStyle"),r),h=[],g=0,k=e.children;g<k.length;g++){var y=k[g];if("element"===y.kind&&y.namespaceUri===p&&"p"===y.localName){var b=ve(y,p,"pPr"),F=void 0===b?{}:ne(b,r),x=te(y,r);h.push(ee({},F,{defaultFontFamily:F.fontFamily,defaultEastAsianFontFamily:F.eastAsianFontFamily,defaultComplexScriptFontFamily:F.complexScriptFontFamily,defaultFontSizePt:F.fontSizePt,defaultBold:F.bold,defaultItalic:F.italic,defaultCaps:F.caps,defaultColor:F.color,defaultCharacterFills:F.characterFills,runs:x.filter(function(e){return"run"===e.kind}),content:x,endParagraphProperties:oe(y,r)}))}}return{properties:{leftInsetPt:f.leftInset,rightInsetPt:f.rightInset,topInsetPt:f.topInset,bottomInsetPt:f.bottomInset,anchor:f.anchor,wrap:f.wrap,columnCount:f.columnCount,columnSpacingPt:f.columnSpacing,verticalType:f.verticalType,autoFit:f.autoFit},listStyle:m,paragraphs:h}}function he(e,r){if(void 0===r&&(r={}),void 0===e)return[];var n=R(e.namespaceUri);if(void 0===n)return[];for(var i=[],t=-1;t<9;t++){var o=ve(e,n,t<0?"defPPr":"lvl"+String(t+1)+"pPr");void 0!==o&&i.push(ee({level:t},ne(o,r)))}return i}var ge=function(){return ge=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},ge.apply(this,arguments)};function ke(e,r){if(void 0===e||e.namespaceUri!==r||"ln"!==e.localName)return{};var n=function(n){var i=o(e,r,n);return void 0===i?void 0:{type:a(i,"","type"),width:a(i,"","w"),length:a(i,"","len")}};return{head:n("headEnd"),tail:n("tailEnd")}}function ye(e,r){if(void 0!==e){for(var n=[],i=0,t=e.children;i<t.length;i++){var o=t[i];"element"===o.kind&&n.push(ke(o,r))}return n}}var be=function(){return be=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},be.apply(this,arguments)};function Fe(e,r){if(void 0===e)return{fills:void 0,backgrounds:void 0};var n=R(e.namespaceUri);return void 0===n?{fills:void 0,backgrounds:void 0}:{lineStyles:we(o(e,n,"lnStyleLst"),n),lineEnds:ye(o(e,n,"lnStyleLst"),n),lines:Ne(o(e,n,"lnStyleLst"),n,r),fills:xe(o(e,n,"fillStyleLst"),n,r),backgrounds:xe(o(e,n,"bgFillStyleLst"),n,r)}}function xe(e,r,n){if(void 0!==e){for(var t=[],o=0;o<e.children.length;o++){var a=i(e.children,o);if("element"===a.kind&&a.namespaceUri===r){var l=D(a,n);if(void 0===l)switch(a.localName){case"noFill":t.push({kind:"none"});break;case"solidFill":t.push(J(be({},e,{children:[a]}),r,n));break;case"blipFill":t.push({kind:"picture"});break;case"pattFill":t.push({kind:"pattern"});break;case"grpFill":t.push({kind:"group"});break;default:t.push({kind:"unknown"})}else t.push(l)}}return t}}function Ne(e,r,n){if(void 0!==e){for(var t=[],o=0;o<e.children.length;o++){var a=i(e.children,o);"element"===a.kind&&t.push(a.namespaceUri===r&&"ln"===a.localName?X(a,r,n):{kind:"unknown"})}return t}}function we(e,r){if(void 0!==e){var n=[];return e.children.forEach(function(e){"element"===e.kind&&n.push(e.namespaceUri===r&&"ln"===e.localName&&I(e,r)||{})}),n}}var Ce=function(){return Ce=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Ce.apply(this,arguments)};function Se(e,r){var n=R(e.namespaceUri),i="fillRef"===e.localName&&e.namespaceUri===n,t="bgRef"===e.localName&&("http://schemas.openxmlformats.org/presentationml/2006/main"===e.namespaceUri||"http://purl.oclc.org/ooxml/presentationml/main"===e.namespaceUri);if(void 0!==n&&(i||t)){var o=i?"fillRef":"bgRef";return Ce({kind:o},Ee(e,n,o,r))}}function Pe(e,r){var n=R(e.namespaceUri);if("lnRef"===e.localName&&n===e.namespaceUri)return Ce({kind:"lnRef"},Ee(e,n,"lnRef",r))}function Ee(e,r,n,t){var o=function(e){if(void 0===e)return{kind:"absent"};var r=e.replace(/^[ \\t\\r\\n]+/,"").replace(/[ \\t\\r\\n]+$/,""),n=Number(r);return/^[+-]?[0-9]+$/.test(r)&&Number.isFinite(n)&&n>=0&&n<=4294967295?{kind:"value",raw:e,value:0===n?0:n}:{kind:"invalid",raw:e}}(a(e,"","idx")),l=[];"value"!==o.kind&&l.push({field:n+"/@idx",stopIndex:void 0,message:"Missing or invalid unsigned style index.",partName:t});for(var d=x(e,r),s=[],c=0;c<e.children.length;c++){var u=i(e.children,c);"element"===u.kind&&u.namespaceUri===r&&De(u.localName)&&s.push(u)}(s.length>1||s.length>0&&void 0===d)&&l.push({field:n+"/color",stopIndex:void 0,message:"Invalid or multiple reference color choices.",partName:t});var v="http://purl.oclc.org/ooxml/drawingml/main"===r?"strict":"transitional";return{index:o,color:d,diagnostics:l,colorTransforms:U(s.length?i(s,0):void 0,r,v)}}function Be(e,r,n){return"invalid"===e.index.kind?{kind:"invalid",referenceKind:e.kind,index:void 0,reason:"invalid-index"}:function(e,r,n,t){if(void 0===r)return{kind:"invalid",referenceKind:e,index:r,reason:"missing-index"};if(!Number.isFinite(r)||Math.floor(r)!==r||r<0||r>4294967295)return{kind:"invalid",referenceKind:e,index:r,reason:"invalid-index"};if(0===r||1e3===r)return{kind:"none",referenceKind:e,index:r};var o=r<1e3?"fill":"background",a="fill"===o?n:t,l="fill"===o?r-1:r-1001;return void 0===a?{kind:"invalid",referenceKind:e,index:r,reason:"missing-theme-list"}:l>=a.length?{kind:"invalid",referenceKind:e,index:r,reason:"out-of-range"}:{kind:"style",referenceKind:e,index:r,list:o,listIndex:l,style:i(a,l)}}(e.kind,"value"===e.index.kind?e.index.value:void 0,r,n)}function De(e){return"srgbClr"===e||"scrgbClr"===e||"hslClr"===e||"sysClr"===e||"schemeClr"===e||"prstClr"===e}var Oe=function(){return Oe=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Oe.apply(this,arguments)},Ue=Object.freeze({totalUncompressedBytes:1073741824,compressionRatio:200,entryCount:1e4,singlePartUncompressedBytes:268435456,xmlNestingDepth:256,xmlAttributesPerElement:4096,textNodeLengthBytes:33554432,relationshipsPerPart:1e4,slideCount:5e3,shapesPerSlide:1e4,groupNestingDepth:64,totalEmbeddedMediaBytes:536870912,animationTimingNodeCount:1e5});function Ae(e){if(void 0===e)return Object.freeze(Oe({},Ue));var r={totalUncompressedBytes:null!==e.totalUncompressedBytes&&void 0!==e.totalUncompressedBytes?e.totalUncompressedBytes:Ue.totalUncompressedBytes,compressionRatio:null!==e.compressionRatio&&void 0!==e.compressionRatio?e.compressionRatio:Ue.compressionRatio,entryCount:null!==e.entryCount&&void 0!==e.entryCount?e.entryCount:Ue.entryCount,singlePartUncompressedBytes:null!==e.singlePartUncompressedBytes&&void 0!==e.singlePartUncompressedBytes?e.singlePartUncompressedBytes:Ue.singlePartUncompressedBytes,xmlNestingDepth:null!==e.xmlNestingDepth&&void 0!==e.xmlNestingDepth?e.xmlNestingDepth:Ue.xmlNestingDepth,xmlAttributesPerElement:null!==e.xmlAttributesPerElement&&void 0!==e.xmlAttributesPerElement?e.xmlAttributesPerElement:Ue.xmlAttributesPerElement,textNodeLengthBytes:null!==e.textNodeLengthBytes&&void 0!==e.textNodeLengthBytes?e.textNodeLengthBytes:Ue.textNodeLengthBytes,relationshipsPerPart:null!==e.relationshipsPerPart&&void 0!==e.relationshipsPerPart?e.relationshipsPerPart:Ue.relationshipsPerPart,slideCount:null!==e.slideCount&&void 0!==e.slideCount?e.slideCount:Ue.slideCount,shapesPerSlide:null!==e.shapesPerSlide&&void 0!==e.shapesPerSlide?e.shapesPerSlide:Ue.shapesPerSlide,groupNestingDepth:null!==e.groupNestingDepth&&void 0!==e.groupNestingDepth?e.groupNestingDepth:Ue.groupNestingDepth,totalEmbeddedMediaBytes:null!==e.totalEmbeddedMediaBytes&&void 0!==e.totalEmbeddedMediaBytes?e.totalEmbeddedMediaBytes:Ue.totalEmbeddedMediaBytes,animationTimingNodeCount:null!==e.animationTimingNodeCount&&void 0!==e.animationTimingNodeCount?e.animationTimingNodeCount:Ue.animationTimingNodeCount};return Object.freeze(r)}var Te=function(){return Te=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Te.apply(this,arguments)};function Me(e,r,n,t){var l=e.namespaceUri,d=R(l);if(void 0!==d){var s=l===d&&("theme"===e.localName||"themeOverride"===e.localName),c=l!==d&&["sld","sldLayout","sldMaster"].indexOf(e.localName)>=0;if(s||c){var u=Ae(n),v=[],f=[],p=new Map,h=c?o(e,l,"cSld"):void 0,y=void 0===h?void 0:o(h,l,"spTree"),b=0;void 0!==y&&function e(n,s,c){var h=n.localName,g=o(n,l,"sp"===h?"nvSpPr":"cxnSp"===h?"nvCxnSpPr":"pic"===h?"nvPicPr":"graphicFrame"===h?"nvGraphicFramePr":"contentPart"===h?"nvContentPartPr":"nvGrpSpPr"),k=void 0===g?void 0:o(g,l,"cNvPr"),y=void 0===k?void 0:a(k,"","id");void 0===y||""===y?v.push({code:"missing-host-id"}):p.set(y,(p.get(y)||0)+1);var F=void 0===g?void 0:o(g,l,"nvPr"),x=void 0===F?void 0:o(F,l,"ph"),N=o(n,l,"grpSp"===h||"spTree"===h?"grpSpPr":"spPr"),w=o(n,l,"style"),S=void 0===w?void 0:o(w,d,"fillRef"),P=void 0===N?void 0:o(N,d,"ln"),E=void 0===w?void 0:o(w,d,"lnRef");if(f.push(Te({id:y,bindable:!1,elementKind:h,ancestors:s,fill:void 0===N?{kind:"missing"}:J(N,d,r,t),reference:void 0===S?void 0:Se(S,r),placeholder:void 0===x?void 0:{type:a(x,"","type"),index:a(x,"","idx")}},["sp","cxnSp","pic"].indexOf(h)<0?{}:{outline:{ends:ke(P,d),present:void 0!==P,fill:void 0===P?{kind:"missing"}:J(P,d,r,t),reference:void 0===E?void 0:Pe(E,r)}},{useBackgroundFill:C(a(n,"","useBgFill"))})),"grpSp"===h||"spTree"===h)for(var B=s.concat([y]),D=0;D<n.children.length;D++){var O=i(n.children,D);if(!("element"!==O.kind||O.namespaceUri!==l||["sp","cxnSp","pic","grpSp","graphicFrame","contentPart"].indexOf(O.localName)<0)){if(++b>u.shapesPerSlide)throw new m("shapesPerSlide",{partName:r,actual:b});var U=c+("grpSp"===O.localName?1:0);if(U>u.groupNestingDepth)throw new m("groupNestingDepth",{partName:r,actual:U});e(O,B,U)}}}(y,[],0),p.forEach(function(e,r){e>1&&v.push({code:"duplicate-host-id",id:r})});var F,N,w=void 0===h?void 0:o(h,l,"bg"),S=void 0===w?void 0:o(w,l,"bgPr"),P=void 0===w?void 0:o(w,l,"bgRef"),E=void 0===S?{kind:"missing"}:J(S,d,r,t),B=Te({fill:void 0!==S&&"missing"===E.kind?{kind:"unknown"}:E,reference:void 0!==S||void 0===P?void 0:Se(P,r)},void 0===S?{}:{shadeToTitle:C(a(S,"","shadeToTitle"))}),D=c&&"sldMaster"===e.localName?o(e,l,"clrMap"):void 0,O=c&&"sldMaster"!==e.localName?o(e,l,"clrMapOvr"):void 0,U=D||(void 0===O?void 0:o(O,d,"overrideClrMapping"));if(void 0!==U?F={kind:void 0!==D?"master":"override",entries:k.map(function(e){return{key:e,value:a(U,"",e)}})}:void 0!==O&&(F={kind:void 0===o(O,d,"masterClrMapping")?"invalid":"master-reference"}),s){var A="themeOverride"===e.localName?e:o(e,d,"themeElements"),T=void 0===A?void 0:o(A,d,"fmtScheme"),M=void 0===A?void 0:o(A,d,"clrScheme"),j=[];void 0!==M&&g.forEach(function(e){var r=o(M,d,e);void 0!==r&&j.push({slot:e,color:x(r,d)})}),N={styles:Fe(T,r),colors:void 0===M?void 0:j}}return{partName:r,hosts:f.map(function(e){return Te({},e,{bindable:void 0!==e.id&&""!==e.id&&1===p.get(e.id)})}),background:B,colorMap:F,theme:N,diagnostics:v}}}}function Re(e){return void 0===e?{typeface:"",panose:void 0,pitchFamily:void 0,charset:void 0}:{typeface:a(e,"","typeface")||"",panose:a(e,"","panose"),pitchFamily:a(e,"","pitchFamily"),charset:a(e,"","charset")}}function je(e){var r=[];if(void 0!==e)for(var n=0;n<e.children.length;n++){var t=i(e.children,n);if("element"===t.kind&&t.namespaceUri===e.namespaceUri&&"font"===t.localName){var l=a(t,"","script"),s=a(t,"","typeface");void 0!==l&&void 0!==s&&r.push({script:l,typeface:s})}}return{latin:Re(void 0===e?void 0:o(e,d,"latin")),eastAsian:Re(void 0===e?void 0:o(e,d,"ea")),complexScript:Re(void 0===e?void 0:o(e,d,"cs")),supplementalFonts:r}}var Ge=function(){return Ge=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Ge.apply(this,arguments)};function Ie(e){var r=e.namespaceUri,n=x(e,r);if(void 0!==n)return{value:n,transforms:U(o(e,r,n.kind+"Clr"),r,"http://purl.oclc.org/ooxml/drawingml/main"===r?"strict":"transitional")}}function Le(e,r){var n=a(e,"",r),i=void 0===n?void 0:n.trim();return"on"===i||"off"!==i&&void 0}var ze=function(){return ze=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},ze.apply(this,arguments)},_e=["wholeTbl","band1H","band2H","band1V","band2V","firstRow","lastRow","firstCol","lastCol","nwCell","neCell","swCell","seCell"],qe=["left","right","top","bottom","insideDiagonalDown","insideDiagonalUp"],Ve=[{edge:"left",cell:"lnL",style:"left"},{edge:"right",cell:"lnR",style:"right"},{edge:"top",cell:"lnT",style:"top"},{edge:"bottom",cell:"lnB",style:"bottom"},{edge:"insideDiagonalDown",cell:"lnTlToBr",style:"tl2br"},{edge:"insideDiagonalUp",cell:"lnBlToTr",style:"tr2bl"},{edge:"insideHorizontal",cell:void 0,style:"insideH"},{edge:"insideVertical",cell:void 0,style:"insideV"}];function Ke(e,r,n,t){if(void 0!==e&&R(e.namespaceUri)===e.namespaceUri){for(var o=[],a=new Set,l=0;l<e.children.length;l++){var d=i(e.children,l);if("element"===d.kind&&d.namespaceUri===e.namespaceUri)for(var s=0;s<Ve.length;s++){var c=i(Ve,s);if(d.localName===(n?c.style:c.cell)&&!a.has(c.edge)){a.add(c.edge);var u=n?We(d,["ln","lnRef"]):d,v={kind:"empty"};if(void 0!==u&&"lnRef"===u.localName){var f=Pe(u,r);void 0!==f&&(v={kind:"reference",reference:f})}else void 0!==u&&(v={kind:"line",properties:$e(u),fill:X(u,e.namespaceUri,r,t)});o.push({edge:c.edge,choice:v});break}}}return 0===o.length?void 0:o}}function We(e,r){for(var n=0;n<e.children.length;n++){var t=i(e.children,n);if("element"===t.kind&&t.namespaceUri===e.namespaceUri&&r.indexOf(t.localName)>=0)return t}}function $e(e){var r=We(e,["prstDash","custDash"]),n=We(e,["round","bevel","miter"]),t=[];if(void 0!==r&&"custDash"===r.localName)for(var o=0;o<r.children.length;o++){var l=i(r.children,o);"element"===l.kind&&l.namespaceUri===e.namespaceUri&&"ds"===l.localName&&t.push({dash:a(l,"","d"),space:a(l,"","sp")})}return ze({width:a(e,"","w"),cap:a(e,"","cap"),compound:a(e,"","cmpd"),align:a(e,"","algn")},void 0===r?{}:{dash:"prstDash"===r.localName?{kind:"preset",value:a(r,"","val")}:{kind:"custom",stops:t}},void 0===n?{}:{join:{kind:"round"===n.localName?"round":"bevel"===n.localName?"bevel":"miter",limit:a(n,"","lim")}},He(e,"headEnd"),He(e,"tailEnd"))}function He(e,r){var n=o(e,e.namespaceUri,r);if(void 0===n)return{};var i={type:a(n,"","type"),width:a(n,"","w"),length:a(n,"","len")};return"headEnd"===r?{headEnd:i}:{tailEnd:i}}function Ye(e,r){if(void 0!==e)for(var n=0;n<e.length;n++){var t=i(e,n);if(t.edge===r)return t.choice}}var Xe=function(){return Xe=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Xe.apply(this,arguments)},Je=Object.freeze({kind:"missing"}),Qe=["wholeTbl","band1H","band2H","band1V","band2V","firstRow","lastRow","firstCol","lastCol","nwCell","neCell","swCell","seCell"];function Ze(e,r,n,t){if(void 0===e)return Je;var o=e.namespaceUri;if(!n){var a=X(e,o,r,t);return"missing"===a.kind?Je:{kind:"fill",fill:a}}for(var l=0;l<e.children.length;l++){var d=i(e.children,l);if("element"===d.kind&&d.namespaceUri===o){if("fill"===d.localName)return{kind:"fill",fill:X(d,o,r,t)};if("fillRef"===d.localName){var s=Se(d,r);return void 0===s?Je:{kind:"reference",reference:s}}}}return Je}function er(e,r,n){return R(e.namespaceUri)!==e.namespaceUri||"tblStyleLst"!==e.localName?[]:ir(e,"tblStyle").map(function(e){return rr(e,r,n)})}function rr(e,r,n){var i=[];return Qe.forEach(function(t){var l=o(e,e.namespaceUri,t);if(void 0!==l){var d=o(l,e.namespaceUri,"tcStyle"),s=Ke(void 0===d?void 0:o(d,e.namespaceUri,"tcBdr"),r,!0,n),c=function(e){if(void 0!==e&&R(e.namespaceUri)===e.namespaceUri){var r=e.namespaceUri,n=o(e,r,"fontRef"),i=o(e,r,"font");return{font:void 0!==n?{kind:"reference",index:a(n,"","idx"),color:Ie(n)}:void 0===i?void 0:{kind:"font",collection:je(i)},color:Ie(e),bold:Le(e,"b"),italic:Le(e,"i")}}}(o(l,e.namespaceUri,"tcTxStyle"));i.push(Xe({bucket:t},void 0===c?{}:{textStyle:c},{fill:Ze(d,r,!0,n)},void 0===s?{}:{borders:s}))}}),{partName:r,styleId:a(e,"","styleId"),regions:i,background:Ze(o(e,e.namespaceUri,"tblBg"),r,!0,n)}}function nr(e,r,n,i,t){var o=[];return t.firstRow&&0===e&&o.push("firstRow"),t.firstColumn&&0===r&&o.push("firstCol"),t.lastColumn&&r===i-1&&o.push("lastCol"),t.lastRow&&e===n-1&&o.push("lastRow"),!t.bandedRows||t.firstRow&&0===e||o.push((e-(t.firstRow?1:0))%2==0?"band1H":"band2H"),!t.bandedColumns||t.firstColumn&&0===r||o.push((r-(t.firstColumn?1:0))%2==0?"band1V":"band2V"),o.push("wholeTbl"),o}function ir(e,r){for(var n=[],t=0;t<e.children.length;t++){var o=i(e.children,t);"element"===o.kind&&o.namespaceUri===e.namespaceUri&&o.localName===r&&n.push(o)}return n}function tr(e,r,n,t){void 0===n&&(n=Ue.groupNestingDepth);var l=e.namespaceUri,d=R(l);if(void 0===d||d===l)return[];var s=o(e,l,"cSld"),c=void 0===s?void 0:o(s,l,"spTree");if(void 0===c)return[];var u=[],v=new Map;function f(e){var r="sp"===e.localName?"nvSpPr":"cxnSp"===e.localName?"nvCxnSpPr":"pic"===e.localName?"nvPicPr":"graphicFrame"===e.localName?"nvGraphicFramePr":"contentPart"===e.localName?"nvContentPartPr":"nvGrpSpPr",n=o(e,l,r),i=void 0===n?void 0:o(n,l,"cNvPr");return void 0===i?void 0:a(i,"","id")}var p=f(c);return void 0!==p&&v.set(p,1),function e(s,c){for(var p=0;p<s.children.length;p++){var h=i(s.children,p);if(!("element"!==h.kind||h.namespaceUri!==l||["sp","cxnSp","pic","grpSp","graphicFrame","contentPart"].indexOf(h.localName)<0)){var g=f(h);if(void 0!==g&&v.set(g,(v.get(g)||0)+1),"grpSp"===h.localName){if(c+1>n)throw new m("groupNestingDepth",{partName:r,actual:c+1});e(h,c+1)}if("graphicFrame"===h.localName&&void 0!==g){var k=o(h,d,"graphic"),y=void 0===k?void 0:o(k,d,"graphicData"),b=void 0===y?void 0:a(y,"","uri");if("http://schemas.openxmlformats.org/drawingml/2006/table"===b||"http://purl.oclc.org/ooxml/drawingml/table"===b){var F=void 0===y?void 0:o(y,d,"tbl");void 0!==F&&u.push({id:g,data:or(F,r,t)})}}}}}(c,0),u.filter(function(e){return 1===v.get(e.id)})}function or(e,r,n){var t,a,d=e.namespaceUri,s=o(e,d,"tblPr"),c=o(e,d,"tblGrid"),u=ir(e,"tr"),v=void 0===c?0:ir(c,"gridCol").length;if(void 0!==s)for(var f=0;f<s.children.length;f++){var p=i(s.children,f);if("element"===p.kind&&p.namespaceUri===d){if("tableStyle"===p.localName){a=rr(p,r,n);break}if("tableStyleId"===p.localName){t=l(p).replace(/^[ \\t\\r\\n]+|[ \\t\\r\\n]+$/g,"");break}}}var m={firstRow:ar(s,"firstRow"),lastRow:ar(s,"lastRow"),firstColumn:ar(s,"firstCol"),lastColumn:ar(s,"lastCol"),bandedRows:ar(s,"bandRow"),bandedColumns:ar(s,"bandCol")},h=[];return u.forEach(function(e,i){ir(e,"tc").forEach(function(e,t){var a=Ke(o(e,d,"tcPr"),r,!1,n),l=o(e,d,"txBody");h.push(Xe({},void 0===l?{}:{textBody:me(l)},void 0===a?{}:{borders:a},{row:i,column:t,columnSpan:lr(e,"gridSpan"),rowSpan:lr(e,"rowSpan"),horizontalMerge:ar(e,"hMerge"),verticalMerge:ar(e,"vMerge"),fill:Ze(o(e,d,"tcPr"),r,!1,n),buckets:nr(i,t,u.length,v,m)}))})}),{partName:r,styleId:t,inlineStyle:a,background:Ze(s,r,!1,n),columnCount:v,rowCount:u.length,cells:h}}function ar(e,r){var n=C(void 0===e?void 0:a(e,"",r));return"value"===n.kind&&n.value}function lr(e,r){var n=a(e,"",r),i=void 0===n?"":n.replace(/^[ \\t\\r\\n]+|[ \\t\\r\\n]+$/g,""),t=Number(i);return/^[+]?[0-9]+$/.test(i)&&Number.isInteger(t)&&t>=1&&t<=2147483647?t:1}function dr(e,r,n){void 0===r&&(r=[]),void 0===n&&(n=sr(r));var t,o,a=void 0===e.styleId?void 0:n.get(e.styleId),l=e.inlineStyle||a,d=void 0!==e.inlineStyle?"inline":void 0===e.styleId?"none":n.has(e.styleId)?void 0===a?"ambiguous":"shared":"missing",s="missing"!==e.background.kind?{source:"table",partName:e.partName,choice:e.background}:void 0!==l&&"missing"!==l.background.kind?{source:"style-background",partName:l.partName,choice:l.background}:{source:"none",partName:e.partName,choice:Je},c=function(e,r,n){if(e.some(function(e){return void 0!==e.borders})||void 0!==r&&r.regions.some(function(e){return void 0!==e.borders})){var t=[];return void 0!==r&&_e.forEach(function(e){r.regions.forEach(function(r){r.bucket===e&&t.push(r)})}),e.map(function(e){return qe.map(function(o){var a=Ye(e.borders,o);if(void 0!==a&&"empty"!==a.kind)return{edge:o,source:"cell",partName:n,choice:a};for(var l=t.length-1;l>=0;l--){var d=i(t,l);if(!(e.buckets.indexOf(d.bucket)<0)){var s=Ye(d.borders,o);if(void 0!==s&&"empty"!==s.kind&&void 0!==r)return{edge:o,source:d.bucket,partName:r.partName,choice:s}}}return{edge:o,source:"none",partName:n,choice:void 0}})})}}(e.cells,l,e.partName);return Xe({styleResolution:d,style:l,background:s,textCells:(t=e.cells,o=l,t.map(function(e){for(var r,n,i,t,a={},l=function(e){var l=void 0===o?void 0:o.regions.find(function(r){return r.bucket===e}),d=void 0===l?void 0:l.textStyle;if(void 0===d)return"continue";void 0===r&&void 0!==d.font&&(r=d.font,a.font=e);var s=d.color||(void 0!==d.font&&"reference"===d.font.kind?d.font.color:void 0);void 0===n&&void 0!==s&&(n=s,a.color=e),void 0===i&&void 0!==d.bold&&(i=d.bold,a.bold=e),void 0===t&&void 0!==d.italic&&(t=d.italic,a.italic=e)},d=0,s=e.buckets;d<s.length;d++)l(s[d]);return{row:e.row,column:e.column,sources:a,style:Ge({},void 0===r?{}:"reference"===r.kind?{fontReference:void 0===r.index?void 0:r.index.trim(),fontReferenceColor:r.color}:{fontFamily:r.collection.latin.typeface,eastAsianFontFamily:r.collection.eastAsian.typeface,complexScriptFontFamily:r.collection.complexScript.typeface},{color:n,bold:i,italic:t})}}))},void 0===c?{}:{borderCells:c},{cells:e.cells.map(function(r){if("missing"!==r.fill.kind)return{source:"cell",partName:e.partName,choice:r.fill};if(void 0!==l)for(var n=0;n<r.buckets.length;n++)for(var t=i(r.buckets,n),o=0;o<l.regions.length;o++){var a=i(l.regions,o);if(a.bucket===t&&"missing"!==a.fill.kind)return{source:t,partName:l.partName,choice:a.fill}}return{source:"none",partName:e.partName,choice:Je}})})}function sr(e){var r=new Map;return e.forEach(function(e){void 0!==e.styleId&&r.set(e.styleId,r.has(e.styleId)?void 0:e)}),r}function cr(e,r,n){void 0===n&&(n=Ue.groupNestingDepth);var t=e.namespaceUri;if("http://schemas.openxmlformats.org/presentationml/2006/main"!==t&&"http://purl.oclc.org/ooxml/presentationml/main"!==t)return[];var l=o(e,t,"cSld"),d=void 0===l?void 0:o(l,t,"spTree");if(void 0===d)return[];var s=R(t);if(void 0===s)return[];var c=new Map,u=[];function v(e){var r="sp"===e.localName?"nvSpPr":"cxnSp"===e.localName?"nvCxnSpPr":"pic"===e.localName?"nvPicPr":"graphicFrame"===e.localName?"nvGraphicFramePr":"contentPart"===e.localName?"nvContentPartPr":"nvGrpSpPr",n=o(e,t,r),i=void 0===n?void 0:o(n,t,"cNvPr");return void 0===i?void 0:a(i,"","id")}var f=v(d);return void 0!==f&&c.set(f,1),function e(a,l,d){for(var f=l.concat([v(a)]),p=0;p<a.children.length;p++){var h=i(a.children,p);if(!("element"!==h.kind||h.namespaceUri!==t||["sp","cxnSp","pic","grpSp","graphicFrame","contentPart"].indexOf(h.localName)<0)){var g=v(h);void 0!==g&&c.set(g,(c.get(g)||0)+1);var k=o(h,t,"grpSp"===h.localName?"grpSpPr":"spPr");if(void 0!==g&&void 0!==k)for(var y=0;y<k.children.length;y++){var b=i(k.children,y);if(!("element"!==b.kind||b.namespaceUri!==s||["noFill","solidFill","gradFill","blipFill","pattFill","grpFill"].indexOf(b.localName)<0)){"grpFill"===b.localName&&u.push({id:g,ancestors:f});break}}if("grpSp"===h.localName){if(d+1>n)throw new m("groupNestingDepth",{partName:r,actual:d+1});e(h,f,d+1)}}}}(d,[],0),u.filter(function(e){return 1===c.get(e.id)&&e.ancestors.every(function(e){return void 0===e||1===c.get(e)})})}function ur(e){var r=e.namespaceUri,n="http://schemas.openxmlformats.org/presentationml/2006/main"===r?"http://schemas.openxmlformats.org/drawingml/2006/main":"http://purl.oclc.org/ooxml/presentationml/main"===r?"http://purl.oclc.org/ooxml/drawingml/main":void 0,i=o(e,r,"style"),t=void 0===i||void 0===n?void 0:o(i,n,"fontRef"),a=void 0===t?void 0:x(t,n);if(void 0!==t&&void 0!==n&&void 0!==a){var l=["srgbClr","scrgbClr","hslClr","sysClr","schemeClr","prstClr"],d=t.children.find(function(e){return"element"===e.kind&&e.namespaceUri===n&&l.indexOf(e.localName)>=0});return{glyphFill:{kind:"solid",color:a,colorTransforms:void 0===d?[]:U(d,n,"http://purl.oclc.org/ooxml/presentationml/main"===r?"strict":"transitional")},outline:{kind:"missing"},underlineFill:{kind:"missing"},underlineLine:{kind:"missing"}}}}function vr(e,r){var n=e.namespaceUri,t="http://purl.oclc.org/ooxml/presentationml/main"===n?"http://purl.oclc.org/ooxml/drawingml/main":"http://schemas.openxmlformats.org/drawingml/2006/main",l=[],d="http://purl.oclc.org/ooxml/presentationml/main"===n||"http://schemas.openxmlformats.org/presentationml/2006/main"===n,s=d?o(e,n,"txStyles"):void 0;function c(e){var n=[];if(void 0===e)return n;for(var i=-1;i<9;i++){var a=o(e,t,i<0?"defPPr":"lvl"+String(i+1)+"pPr"),l=void 0===a?void 0:o(a,t,"defRPr"),d=void 0===l?void 0:r.get(l);void 0!==d&&n.push({level:i,characterFills:d})}return n}return d&&void 0!==R(t)&&function e(d){if(d.namespaceUri===n)if("sp"!==d.localName&&"cxnSp"!==d.localName)for(b=0;b<d.children.length;b++)"element"===(B=i(d.children,b)).kind&&e(B);else{var s=o(d,n,"txBody"),u=o(d,n,"sp"===d.localName?"nvSpPr":"nvCxnSpPr"),v=void 0===u?void 0:o(u,n,"cNvPr"),f=void 0===v?void 0:a(v,"","id");if(void 0!==s&&void 0!==f){for(var p=[],m=function(e,r,n){return e.children.filter(function(e){return"element"===e.kind&&e.namespaceUri===r&&e.localName===n})}(s,t,"p"),h=!0,g=[s],k=0;k<g.length;k++)for(var y=i(g,k),b=0;b<y.children.length;b++)"element"===(B=i(y.children,b)).kind&&("p"!==B.localName||y===s&&B.namespaceUri===t||(h=!1),g.push(B));for(var F=0,x=m;F<x.length;F++){var N=x[F],w=o(N,t,"pPr"),C=void 0===w?void 0:o(w,t,"defRPr"),S=o(N,t,"endParaRPr"),P=[],E=!0;for(b=0;b<N.children.length;b++){var B;if("element"===(B=i(N.children,b)).kind)if(B.namespaceUri===t){if("r"===B.localName||"fld"===B.localName||"br"===B.localName){var D=o(B,t,"rPr");P.push(void 0===D?void 0:r.get(D))}}else E=!1}p.push({characterFills:void 0===C?void 0:r.get(C),end:void 0===S?void 0:r.get(S),content:E?P:[]})}l.push({id:f,fontReferenceFills:ur(d),list:c(o(s,t,"lstStyle")),paragraphs:h?p:[]})}}}(e),{shapes:l,defaultTextStyle:c(d?o(e,n,"defaultTextStyle"):void 0),titleStyle:c(void 0===s?void 0:o(s,n,"titleStyle")),bodyStyle:c(void 0===s?void 0:o(s,n,"bodyStyle")),otherStyle:c(void 0===s?void 0:o(s,n,"otherStyle"))}}var fr=function(){var e=function(r,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])},e(r,n)};return function(r,n){function i(){this.constructor=r}e(r,n),r.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),pr="http://schemas.openxmlformats.org/markup-compatibility/2006",mr=new Set(["http://schemas.openxmlformats.org/presentationml/2006/main","http://schemas.openxmlformats.org/drawingml/2006/main","http://schemas.openxmlformats.org/officeDocument/2006/relationships","http://schemas.openxmlformats.org/package/2006/content-types","http://schemas.openxmlformats.org/package/2006/relationships","http://purl.oclc.org/ooxml/presentationml/main","http://purl.oclc.org/ooxml/drawingml/main","http://purl.oclc.org/ooxml/officeDocument/relationships","http://www.w3.org/XML/1998/namespace","http://www.w3.org/2000/xmlns/"]),hr=function(e){function r(r,n){var i=e.call(this,r)||this;return i.name="MarkupCompatibilityError",i.code=n.code,i.partName=n.partName,i.namespaceUri=n.namespaceUri,i.prefix=n.prefix,i}return fr(r,e),r}(Error);function gr(e){var r=e.trim();return 0===r.length?[]:r.split(/\\s+/u)}var kr=function(){var e=function(r,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])},e(r,n)};return function(r,n){function i(){this.constructor=r}e(r,n),r.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),yr=function(){return yr=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},yr.apply(this,arguments)},br=function(e){function r(r,n){void 0===n&&(n={});var i=e.call(this,r)||this;return i.name="XmlParseError",i.partName=n.partName,i}return kr(r,e),r}(Error),Fr="http://www.w3.org/2000/xmlns/",xr="http://www.w3.org/XML/1998/namespace";function Nr(e,r){if("xmlns"===e)return Fr;if("xml"===e)return xr;for(var n=r.length-1;n>=0;n-=1){var t=i(r,n);if(void 0!==t)for(var o=t.length-1;o>=0;o-=1){var a=i(t,o);if(void 0!==a&&a.prefix===e)return a.uri}}}function wr(e){for(var r=0,n=0;n<e.length;n++){var i=e.charCodeAt(n);i<128?r+=1:i<2048?r+=2:i>=55296&&i<=56319?(r+=4,n+=1):r+=3}return r}function Cr(e){var r=e.charCodeAt(0);return r>=65&&r<=90||r>=97&&r<=122||95===r||58===r||r>127}function Sr(e){var r=e.charCodeAt(0);return Cr(e)||r>=48&&r<=57||45===r||46===r}function Pr(e){return null!==e.source[e.index]&&void 0!==e.source[e.index]?e.source[e.index]:""}function Er(e,r){void 0===r&&(r=1),e.index+=r}function Br(e,r){return e.source.startsWith(r,e.index)}function Dr(e){for(;e.index<e.source.length;){var r=Pr(e);if(" "!==r&&"\\t"!==r&&"\\n"!==r&&"\\r"!==r)break;Er(e)}}function Or(e){return void 0===e?{}:{partName:e}}function Ur(e,r){throw new br(r,Or(e.partName))}function Ar(e,r,n){throw new h(r,yr({},Or(e.partName),{actual:n}))}function Tr(e){Cr(Pr(e))||Ur(e,"Expected name at index "+String(e.index));var r=e.index;for(Er(e);e.index<e.source.length&&Sr(Pr(e));)Er(e);return e.source.slice(r,e.index)}function Mr(e){var r=e.indexOf(":");return r<=0?{prefix:"",localName:e}:{prefix:e.slice(0,r),localName:e.slice(r+1)}}function Rr(e,r){for(var n="",i=0;i<e.length;){var t=e.indexOf("&",i);if(-1===t){n+=e.slice(i);break}n+=e.slice(i,t);var o=e.indexOf(";",t+1);-1===o&&Ur(r,"Unterminated character entity");var a=e.slice(t+1,o);if("lt"===a)n+="<";else if("gt"===a)n+=">";else if("amp"===a)n+="&";else if("apos"===a)n+="'";else if("quot"===a)n+='"';else if(a.startsWith("#x")||a.startsWith("#X")){var l=Number.parseInt(a.slice(2),16);(!Number.isFinite(l)||l<0)&&Ur(r,"Invalid numeric character reference &"+a+";"),n+=String.fromCodePoint(l)}else if(a.startsWith("#")){l=Number.parseInt(a.slice(1),10);(!Number.isFinite(l)||l<0)&&Ur(r,"Invalid numeric character reference &"+a+";"),n+=String.fromCodePoint(l)}else Ur(r,"General entity references are not allowed: &"+a+";");i=o+1}return n}function jr(e){var r=Pr(e);'"'!==r&&"'"!==r&&Ur(e,"Expected quoted attribute value"),Er(e);for(var n=e.index;e.index<e.source.length&&Pr(e)!==r;)"<"===Pr(e)&&Ur(e,"Raw < in attribute value"),Er(e);Pr(e)!==r&&Ur(e,"Unterminated attribute value");var i=e.source.slice(n,e.index);return Er(e),Rr(i,e)}function Gr(e,r,n){if("xmlns"===e)return Fr;if("xml"===e)return xr;if(""===e&&n)return"";for(var t=r.length-1;t>=0;t-=1){var o=i(r,t);if(void 0!==o)for(var a=o.length-1;a>=0;a-=1){var l=i(o,a);if(void 0!==l&&l.prefix===e)return l.uri}}return""}function Ir(e){Er(e,2);var r=e.source.indexOf("?>",e.index);-1===r&&Ur(e,"Unterminated processing instruction"),e.index=r+2}function Lr(e){Er(e,4);var r=e.source.indexOf("--\\x3e",e.index);-1===r&&Ur(e,"Unterminated comment"),n(e.source.slice(e.index,r),"--")&&Ur(e,"Invalid comment content"),e.index=r+3}function zr(e){Er(e,9);var r=e.source.indexOf("]]>",e.index);-1===r&&Ur(e,"Unterminated CDATA section");var n=e.source.slice(e.index,r);return e.index=r+3,n}function _r(e){return Ur(e,"DOCTYPE / DTD declarations are not allowed (external entities disabled)")}function qr(e,r){Er(e),"/"===Pr(e)&&Ur(e,"Unexpected end tag");var t=Tr(e),o=Mr(t),a=o.prefix,l=o.localName,d=[];for(Dr(e);e.index<e.source.length&&"/"!==Pr(e)&&">"!==Pr(e);){var s=Tr(e);Dr(e),"="!==Pr(e)&&Ur(e,"Expected = after attribute "+s),Er(e),Dr(e);var c=jr(e),u=Mr(s);d.push({qname:s,value:c,prefix:u.prefix,localName:u.localName}),Dr(e)}d.length>e.limits.xmlAttributesPerElement&&Ar(e,"xmlAttributesPerElement",d.length);for(var v=[],f=[],p=0;p<d.length;p++){var m=(y=i(d,p)).prefix,h=y.localName;"xmlns"===y.qname?(v.push({prefix:"",uri:y.value}),f.push({prefix:"",uri:y.value})):"xmlns"===m&&(v.push({prefix:h,uri:y.value}),f.push({prefix:h,uri:y.value}))}v.length>0&&r.push(v);var g=Gr(a,r,!1),k=[];for(p=0;p<d.length;p++){var y;m=(y=i(d,p)).prefix,h=y.localName;if("xmlns"!==y.qname&&"xmlns"!==m){var b=Gr(m,r,!0);""===m?k.push({namespaceUri:b,localName:h,value:y.value}):k.push({namespaceUri:b,localName:h,value:y.value,prefix:m})}}!function(e,r,t){for(var o=0;o<e.length;o++){var a=i(e,o);if(a.namespaceUri===pr&&"MustUnderstand"===a.localName)for(var l=gr(a.value),d=0;d<l.length;d++){var s=i(l,d);if(n(s,":"))throw new hr('mc:MustUnderstand token "'+s+'" is not a bare namespace prefix',yr({code:"invalidMustUnderstand"},Or(t),{prefix:s}));var c=Nr(s,r);if(void 0===c)throw new hr('mc:MustUnderstand prefix "'+s+'" is not bound in scope',yr({code:"unboundPrefix"},Or(t),{prefix:s}));if(c===pr)throw new hr("mc:MustUnderstand must not target the Markup Compatibility namespace",yr({code:"invalidMustUnderstand"},Or(t),{namespaceUri:c,prefix:s}));if(!mr.has(c))throw new hr("mc:MustUnderstand namespace is not implemented by this library: "+c,yr({code:"mustUnderstand"},Or(t),{namespaceUri:c,prefix:s}))}}}(k,r,e.partName),e.depth+=1,e.depth>e.limits.xmlNestingDepth&&Ar(e,"xmlNestingDepth",e.depth);var F=!1;"/"===Pr(e)&&(Er(e),F=!0),">"!==Pr(e)&&Ur(e,"Expected > to close start tag"),Er(e);var x=[];if(!F)for(;e.index<e.source.length;){if(Br(e,"</")){Er(e,2);var N=Tr(e);Dr(e),">"!==Pr(e)&&Ur(e,"Expected > on end tag"),Er(e),N!==t&&Ur(e,"Mismatched end tag </"+N+"> for <"+t+">");break}if(Br(e,"\\x3c!--"))Lr(e);else if(Br(e,"<?"))Ir(e);else if(Br(e,"<![CDATA[")){var w=zr(e);wr(w)>e.limits.textNodeLengthBytes&&Ar(e,"textNodeLengthBytes",wr(w)),w.length>0&&x.push({kind:"text",text:w})}else if((Br(e,"<!DOCTYPE")||Br(e,"<!doctype"))&&_r(e),"<"!==Pr(e)){for(var C=e.index;e.index<e.source.length&&"<"!==Pr(e);)Er(e);var S=Rr(e.source.slice(C,e.index),e);wr(S)>e.limits.textNodeLengthBytes&&Ar(e,"textNodeLengthBytes",wr(S)),S.length>0&&x.push({kind:"text",text:S})}else x.push(qr(e,r))}e.depth-=1,v.length>0&&r.pop();var P={kind:"element",namespaceUri:g,localName:l,attributes:k,children:x};return""!==a&&(P.prefixHint=a),f.length>0&&(P.namespaceDeclarations=f),P}function Vr(e){for(var r=[],n=!1,t=0;t<e.length;t++){var o=i(e,t);if("missing"!==o.fill.kind){if(!n){if("gradient"!==o.fill.kind)return;n=!0}"gradient"===o.fill.kind&&r.push({id:o.id,fill:o.fill})}}if(0!==r.length){var a,l,d=i(r,0),s=r.filter(function(e){return void 0!==e.fill.shade})[0],c=void 0!==s&&void 0!==s.fill.shade?s.fill.shade.kind:"linear",u=r.filter(function(e){return void 0!==e.fill.shade&&e.fill.shade.kind===c}),v=void 0===s?{kind:"office-default"}:Yr(s.id);if("linear"===c)a={kind:"linear",source:v,angle:Kr(u,function(e){return void 0!==e.fill.shade&&"linear"===e.fill.shade.kind?e.fill.shade.angle:{kind:"absent"}},0),scaled:Kr(u,function(e){return void 0!==e.fill.shade&&"linear"===e.fill.shade.kind?e.fill.shade.scaled:{kind:"absent"}},!1)};else{var f=$r(u,function(e){return void 0!==e.fill.shade&&"path"===e.fill.shade.kind?e.fill.shade.fillToRect:void 0});a={kind:"path",source:v,path:Kr(u,function(e){return void 0!==e.fill.shade&&"path"===e.fill.shade.kind?e.fill.shade.path:{kind:"absent"}},"shape"),fillToRect:void 0===f?(l=.5,{left:Xr(l),top:Xr(l),right:Xr(l),bottom:Xr(l)}):Hr(f)}}var p=r.filter(function(e){return void 0!==e.fill.stops})[0],m=[];if(void 0!==p&&void 0!==p.fill.stops)for(t=0;t<p.fill.stops.length;t++){var h=i(p.fill.stops,t);m.push({position:Wr(h.position,p.id),color:h.color,colorTransforms:h.colorTransforms})}else m.push({position:Xr(0),color:{kind:"srgb",val:"000000"},colorTransforms:[]}),m.push({position:Xr(1),color:{kind:"srgb",val:"FFFFFF"},colorTransforms:[]});var g=$r(r,function(e){return e.fill.tileRect}),k=[];for(t=0;t<r.length;t++)for(var y=i(r,t),b=0;b<y.fill.diagnostics.length;b++)k.push({source:y.id,diagnostic:i(y.fill.diagnostics,b)});return{kind:"gradient",source:Yr(d.id),shade:a,stops:{values:m,source:void 0===p?{kind:"office-default"}:Yr(p.id)},rotateWithShape:Kr(r,function(e){return e.fill.rotateWithShape},!0),flip:Kr(r,function(e){return e.fill.flip},"none"),tileRect:void 0===g?void 0:Hr(g),diagnostics:k}}}function Kr(e,r,n){for(var t=0;t<e.length;t++){var o=i(e,t),a=r(o);if("absent"!==a.kind)return Wr(a,o.id)}return Xr(n)}function Wr(e,r){return"absent"===e.kind?{kind:"absent",source:Yr(r)}:"value"===e.kind?{kind:"value",value:e.value,source:Yr(r)}:{kind:"invalid",raw:e.raw,source:Yr(r)}}function $r(e,r){for(var n=0;n<e.length;n++){var t=i(e,n),o=r(t);if(void 0!==o)return{id:t.id,rectangle:o}}}function Hr(e){var r=function(r){return"absent"===r.kind?{kind:"value",value:0,source:{kind:"schema-default",id:e.id}}:Wr(r,e.id)};return{left:r(e.rectangle.left),top:r(e.rectangle.top),right:r(e.rectangle.right),bottom:r(e.rectangle.bottom)}}function Yr(e){return{kind:"source",id:e}}function Xr(e){return{kind:"value",value:e,source:{kind:"office-default"}}}function Jr(e,r){var n,i,t="string"==typeof e?e:e.val;if(void 0===r)return{kind:"unresolved",reason:"missing-context",token:t};if(5===t.length&&112===t.charCodeAt(0)&&104===t.charCodeAt(1)&&67===t.charCodeAt(2)&&108===t.charCodeAt(3)&&114===t.charCodeAt(4))return{kind:"unresolved",reason:"phClr",token:t};if(i=t,b.has(i))n=r.mapping.get(t);else{if(!F(t))return{kind:"unresolved",reason:"unknown-token",token:t};n=t}return function(e,r,n){if("srgb"===e.kind)return{kind:"srgb",val:e.val,sourceSlot:r};if("scheme"===e.kind)return{kind:"unresolved",reason:"nested-scheme",token:n};return{kind:"direct",value:e,sourceSlot:r}}(r.scheme.getSlot(n),n,t)}var Qr={aliceBlue:"F0F8FF",antiqueWhite:"FAEBD7",aqua:"00FFFF",aquamarine:"7FFFD4",azure:"F0FFFF",beige:"F5F5DC",bisque:"FFE4C4",black:"000000",blanchedAlmond:"FFEBCD",blue:"0000FF",blueViolet:"8A2BE2",brown:"A52A2A",burlyWood:"DEB887",cadetBlue:"5F9EA0",chartreuse:"7FFF00",chocolate:"D2691E",coral:"FF7F50",cornflowerBlue:"6495ED",cornsilk:"FFF8DC",crimson:"DC143C",cyan:"00FFFF",darkBlue:"00008B",darkCyan:"008B8B",darkGoldenrod:"B8860B",darkGray:"A9A9A9",darkGrey:"A9A9A9",darkGreen:"006400",darkKhaki:"BDB76B",darkMagenta:"8B008B",darkOliveGreen:"556B2F",darkOrange:"FF8C00",darkOrchid:"9932CC",darkRed:"8B0000",darkSalmon:"E9967A",darkSeaGreen:"8FBC8F",darkSlateBlue:"483D8B",darkSlateGray:"2F4F4F",darkSlateGrey:"2F4F4F",darkTurquoise:"00CED1",darkViolet:"9400D3",dkBlue:"00008B",dkCyan:"008B8B",dkGoldenrod:"B8860B",dkGray:"A9A9A9",dkGrey:"A9A9A9",dkGreen:"006400",dkKhaki:"BDB76B",dkMagenta:"8B008B",dkOliveGreen:"556B2F",dkOrange:"FF8C00",dkOrchid:"9932CC",dkRed:"8B0000",dkSalmon:"E9967A",dkSeaGreen:"8FBC8B",dkSlateBlue:"483D8B",dkSlateGray:"2F4F4F",dkSlateGrey:"2F4F4F",dkTurquoise:"00CED1",dkViolet:"9400D3",deepPink:"FF1493",deepSkyBlue:"00BFFF",dimGray:"696969",dimGrey:"696969",dodgerBlue:"1E90FF",firebrick:"B22222",floralWhite:"FFFAF0",forestGreen:"228B22",fuchsia:"FF00FF",gainsboro:"DCDCDC",ghostWhite:"F8F8FF",gold:"FFD700",goldenrod:"DAA520",gray:"808080",grey:"808080",green:"008000",greenYellow:"ADFF2F",honeydew:"F0FFF0",hotPink:"FF69B4",indianRed:"CD5C5C",indigo:"4B0082",ivory:"FFFFF0",khaki:"F0E68C",lavender:"E6E6FA",lavenderBlush:"FFF0F5",lawnGreen:"7CFC00",lemonChiffon:"FFFACD",lightBlue:"ADD8E6",lightCoral:"F08080",lightCyan:"E0FFFF",lightGoldenrodYellow:"FAFAD2",lightGray:"D3D3D3",lightGrey:"D3D3D3",lightGreen:"90EE90",lightPink:"FFB6C1",lightSalmon:"FFA07A",lightSeaGreen:"20B2AA",lightSkyBlue:"87CEFA",lightSlateGray:"778899",lightSlateGrey:"778899",lightSteelBlue:"B0C4DE",lightYellow:"FFFFE0",ltBlue:"ADD8E6",ltCoral:"F08080",ltCyan:"E0FFFF",ltGoldenrodYellow:"FAFA78",ltGray:"D3D3D3",ltGrey:"D3D3D3",ltGreen:"90EE90",ltPink:"FFB6C1",ltSalmon:"FFA07A",ltSeaGreen:"20B2AA",ltSkyBlue:"87CEFA",ltSlateGray:"778899",ltSlateGrey:"778899",ltSteelBlue:"B0C4DE",ltYellow:"FFFFE0",lime:"00FF00",limeGreen:"32CD32",linen:"FAF0E6",magenta:"FF00FF",maroon:"800000",medAquamarine:"66CDAA",medBlue:"0000CD",medOrchid:"BA55D3",medPurple:"9370DB",medSeaGreen:"3CB371",medSlateBlue:"7B68EE",medSpringGreen:"00FA9A",medTurquoise:"48D1CC",medVioletRed:"C71585",mediumAquamarine:"66CDAA",mediumBlue:"0000CD",mediumOrchid:"BA55D3",mediumPurple:"9370DB",mediumSeaGreen:"3CB371",mediumSlateBlue:"7B68EE",mediumSpringGreen:"00FA9A",mediumTurquoise:"48D1CC",mediumVioletRed:"C71585",midnightBlue:"191970",mintCream:"F5FFFA",mistyRose:"FFE4E1",moccasin:"FFE4B5",navajoWhite:"FFDEAD",navy:"000080",oldLace:"FDF5E6",olive:"808000",oliveDrab:"6B8E23",orange:"FFA500",orangeRed:"FF4500",orchid:"DA70D6",paleGoldenrod:"EEE8AA",paleGreen:"98FB98",paleTurquoise:"AFEEEE",paleVioletRed:"DB7093",papayaWhip:"FFEFD5",peachPuff:"FFDAB9",peru:"CD853F",pink:"FFC0CB",plum:"DDA0DD",powderBlue:"B0E0E6",purple:"800080",red:"FF0000",rosyBrown:"BC8F8F",royalBlue:"4169E1",saddleBrown:"8B4513",salmon:"FA8072",sandyBrown:"F4A460",seaGreen:"2E8B57",seaShell:"FFF5EE",sienna:"A0522D",silver:"C0C0C0",skyBlue:"87CEEB",slateBlue:"6A5ACD",slateGray:"708090",slateGrey:"708090",snow:"FFFAFA",springGreen:"00FF7F",steelBlue:"4682B4",tan:"D2B48C",teal:"008080",thistle:"D8BFD8",tomato:"FF6347",turquoise:"40E0D0",violet:"EE82EE",wheat:"F5DEB3",white:"FFFFFF",whiteSmoke:"F5F5F5",yellow:"FFFF00",yellowGreen:"9ACD32"},Zr=function(){return Zr=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Zr.apply(this,arguments)};function en(e,r,n,i){void 0===r&&(r=[]);for(var t=tn(nn(e,n,i)),o=0,a=r;o<a.length;o++){t=an(t,a[o])}return{color:"#"+[t.red,t.green,t.blue].map(rn).join(""),opacity:t.opacity}}function rn(e){var r=e.toString(16);return(r.length<2?"0"+r:r).toUpperCase()}function nn(e,r,n,i){if(void 0===i&&(i=new Set),!e||"scheme"!==e.kind)return e;if("phClr"===e.val)return nn(n,r,void 0,i);if(!i.has(e.val)){var t=mn(mn(r,"colorMap"),e.val)||e.val;return nn(mn(mn(r,"colors"),t),r,n,new Set(Array.from(i).concat(e.val)))}}function tn(e){if(!e)return{red:255,green:255,blue:255,opacity:1};if("srgb"===e.kind){var r=(e.val.replace(/^#/,"")+"000000").slice(0,6);return{red:parseInt(r.slice(0,2),16),green:parseInt(r.slice(2,4),16),blue:parseInt(r.slice(4,6),16),opacity:1}}if("sys"===e.kind)return tn({kind:"srgb",val:e.lastClr||"000000"});if("scrgb"===e.kind)return{red:on(e.r),green:on(e.g),blue:on(e.b),opacity:1};if("hsl"===e.kind)return sn({red:0,green:0,blue:0,opacity:1},{hue:Number(e.hue)/6e4,saturation:Number(e.sat)/1e5,luminance:Number(e.lum)/1e5});if("prst"===e.kind){return tn({kind:"srgb",val:{black:"000000",white:"FFFFFF",red:"FF0000",green:"008000",blue:"0000FF",yellow:"FFFF00",gray:"808080",grey:"808080",transparent:"FFFFFF"}[e.val]||"000000"})}return{red:0,green:0,blue:0,opacity:1}}function on(e){return fn(Math.round(255*Number(e)/1e5))}function an(e,r){var n=(r.value||0)/1e5;switch(r.kind){case"tint":return ln(e,function(e){return un(cn(e)*n+(1-n))});case"shade":return ln(e,function(e){return un(cn(e)*n)});case"satMod":return sn(e,Zr({},dn(e),{saturation:dn(e).saturation*n}));case"hueMod":return sn(e,Zr({},dn(e),{hue:dn(e).hue*n}));case"lumMod":return sn(e,Zr({},dn(e),{luminance:dn(e).luminance*n}));case"lumOff":return sn(e,Zr({},dn(e),{luminance:dn(e).luminance+n}));case"alpha":return Zr({},e,{opacity:pn(n)});case"alphaMod":return Zr({},e,{opacity:pn(e.opacity*n)});case"alphaOff":return Zr({},e,{opacity:pn(e.opacity+n)});case"comp":return sn(e,Zr({},dn(e),{hue:(dn(e).hue+180)%360}));case"inv":return Zr({},e,{red:255-e.red,green:255-e.green,blue:255-e.blue});case"gray":var i=fn(vn(.299*e.red+.587*e.green+.114*e.blue));return Zr({},e,{red:i,green:i,blue:i});default:return e}}function ln(e,r){return Zr({},e,{red:r(e.red),green:r(e.green),blue:r(e.blue)})}function dn(e){var r=e.red/255,n=e.green/255,i=e.blue/255,t=Math.max(r,n,i),o=Math.min(r,n,i),a=t-o,l=(t+o)/2,d=0;return 0!==a&&(d=t===r?(n-i)/a*60+(n<i?360:0):t===n?(i-r)/a*60+120:(r-n)/a*60+240),{hue:d,saturation:0===a?0:l<=.5?a/(t+o):a/(2-t-o),luminance:l}}function sn(e,r){var n=pn(r.saturation),i=pn(r.luminance);if(0===n){var t=vn(255*i);return Zr({},e,{red:t,green:t,blue:t})}var o=i<.5?i*(1+n):i+n-i*n,a=2*i-o,l=(r.hue%360+360)%360/360,d=[l+1/3,l,l-1/3].map(function(e){var r=e;return r<0&&(r+=1),r>1&&(r-=1),vn(6*r<1?255*(a+6*(o-a)*r):2*r<1?255*o:3*r<2?255*(a+(o-a)*(2/3-r)*6):255*a)});return Zr({},e,{red:d[0],green:d[1],blue:d[2]})}function cn(e){var r=e/255;return r<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4)}function un(e){return fn(vn(255*(e<0?0:e<=.0031308?12.92*e:e<1?1.055*Math.pow(e,1/2.4)-.055:1)))}function vn(e){var r=Math.floor(e);return.5!==e-r?Math.round(e):r%2==0?r:r+1}function fn(e){return Math.max(0,Math.min(255,e))}function pn(e){return Math.max(0,Math.min(1,e))}function mn(e,r){return null!=e?e[r]:void 0}function hn(e,r,n,t){var o,a=e,l=r;if(void 0!==a&&"scheme"===a.kind&&"phClr"===Nn(a.val)){if(void 0===t)return xn("unresolved-reference","phClr");a=t.color,l=t.colorTransforms.concat(r)}if(void 0===a)return xn("missing-color");"scheme"===a.kind&&(a={kind:"scheme",val:Nn(a.val)});try{o=function(e,r){return"scheme"===e.kind?Jr(e,r):{kind:"direct",value:e}}(a,n)}catch(e){if(e instanceof RangeError)return xn("unresolved-reference","missing-theme-color");throw e}if("unresolved"===o.kind)return xn("unresolved-reference",o.reason);var d="srgb"===o.kind?{kind:"srgb",val:o.val}:o.value,s=gn(d);if(void 0===s)return xn("invalid-color",d.kind);for(var c=0;c<l.length;c++){var u=i(l,c);if("comp"!==u.kind&&"inv"!==u.kind&&"gray"!==u.kind){if(!bn(u.kind))return xn("unsupported-transform",u.kind);if(!Fn(u))return xn("invalid-transform",u.kind)}}var v=en(s,l);return/^#[0-9A-F]{6}$/.test(v.color)&&Number.isFinite(v.opacity)?{kind:"resolved",color:v.color,opacity:v.opacity}:xn("invalid-color",d.kind)}function gn(e){switch(e.kind){case"srgb":var r=Nn(e.val);return/^[0-9A-Fa-f]{6}$/.test(r)?{kind:"srgb",val:r.toUpperCase()}:void 0;case"sys":return void 0===e.lastClr?void 0:gn({kind:"srgb",val:e.lastClr});case"prst":var n=Nn(e.val);r=function(e,r){if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.getOwnPropertyDescriptor(e,r);if(void 0!==n)return n.value}}(Qr,n);return void 0===r?void 0:{kind:"srgb",val:r};case"scrgb":var i=kn(e.r),t=kn(e.g),o=kn(e.b);if(void 0===i||void 0===t||void 0===o)return;return{kind:"srgb",val:yn(i)+yn(t)+yn(o)};case"hsl":var a=w(e.hue),l=kn(e.sat),d=kn(e.lum);if("value"!==a.kind||void 0===l||void 0===d)return;return{kind:"hsl",hue:String(6e4*a.value),sat:String(1e5*l),lum:String(1e5*d)};default:return}}function kn(e){var r=N(e,"transitional","rectangle");return"value"===r.kind?r.value:void 0}function yn(e){var r=Math.max(0,Math.min(1,e)),n=r<=.0031308?12.92*r:1.055*Math.pow(r,1/2.4)-.055,i=Math.round(255*n).toString(16).toUpperCase();return i.length<2?"0"+i:i}function bn(e){return"tint"===e||"shade"===e||"satMod"===e||"hueMod"===e||"lumMod"===e||"lumOff"===e||"alpha"===e||"alphaMod"===e||"alphaOff"===e}function Fn(e){var r=e.value;return!(void 0===r||!Number.isFinite(r))&&("tint"===e.kind||"shade"===e.kind||"alpha"===e.kind?r>=0&&r<=1e5:"alphaOff"===e.kind?r>=-1e5&&r<=1e5:"alphaMod"!==e.kind&&"hueMod"!==e.kind||r>=0)}function xn(e,r){return{kind:"unresolved",reason:e,detail:r}}function Nn(e){return e.replace(/^[ \\t\\r\\n]+/,"").replace(/[ \\t\\r\\n]+$/,"")}function wn(e,r,n){for(var i,t=[],o=new Map,a=[],l=!1,d=0,s=e;d<s.length;d++){var c=s[d];if(l)break;for(var u=0;u<2;u++){var v=c.id+(0===u?"":"-style"),f=c.fill;if(1===u){if(void 0===c.reference)continue;var p=Cn(c.reference,r);if("invalid"===p.kind){if(void 0===i)return{kind:"invalid-reference",source:v,reason:p.reason};a.push({source:v,reason:p.reason});continue}f=p.fill,o.set(v,c.reference)}if("missing"!==f.kind){if(void 0===i){if(i=v,"none"===f.kind)return{kind:"none",source:v};if("gradient"!==f.kind)return{kind:"other",source:v,fillKind:f.kind}}if(t.push({id:v,fill:f}),"gradient"!==f.kind){l=!0;break}}}}if(void 0===i)return{kind:"missing",source:"outline-default"};var m=Vr(t);if(void 0===m)return{kind:"invalid-reference",source:i,reason:"invalid-outline-gradient"};var h="source"===m.stops.source.kind?o.get(m.stops.source.id):void 0;return{kind:"gradient",source:i,gradient:m,reference:void 0,shadeToTitle:void 0,diagnostics:a,colors:m.stops.values.map(function(e){return hn(e.color,e.colorTransforms,n,h)})}}function Cn(e,r){if("value"!==e.index.kind)return{kind:"invalid",reason:"absent"===e.index.kind?"missing-line-index":"invalid-line-index"};var n=e.index.value;if(!Number.isInteger(n)||n<0||n>4294967295)return{kind:"invalid",reason:"invalid-line-index"};if(0===n||1e3===n)return{kind:"style",fill:{kind:"none"}};if(void 0===r)return{kind:"invalid",reason:"line-list-unavailable"};var t=i(r,n-1);return void 0===t?{kind:"invalid",reason:"line-index-out-of-range"}:{kind:"style",fill:t}}var Sn=function(){return Sn=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Sn.apply(this,arguments)};function Pn(e,r,n,t){for(var o,a=[],l=new Map,d=[],s=0;s<e.length;s++){var c=i(e,s),u=c.fill;if(void 0!==c.reference){l.set(c.id,c.reference);var v=Be(c.reference,void 0===r?void 0:r.fills,void 0===r?void 0:r.backgrounds);if("invalid"===v.kind){if(void 0===o)return{kind:"invalid-reference",source:c.id,reason:v.reason,reference:c.reference};d.push({source:c.id,reason:v.reason});continue}u="none"===v.kind?{kind:"none"}:v.style}if("missing"!==u.kind){if(void 0===o){if(o=Sn({},c,{fill:u}),"none"===u.kind)return{kind:"none",source:c.id,reference:c.reference,shadeToTitle:c.shadeToTitle};if("gradient"!==u.kind)return{kind:"other",source:c.id,fillKind:u.kind,shadeToTitle:c.shadeToTitle}}a.push({id:c.id,fill:u})}}if(void 0===o)return t?{kind:"other",source:"default",fillKind:"solid",shadeToTitle:!1}:{kind:"missing",source:"default"};var f=Vr(a);if(void 0===f)return{kind:"invalid-reference",source:o.id,reason:"invalid-gradient-selection"};var p="source"===f.stops.source.kind?l.get(f.stops.source.id):void 0;return{kind:"gradient",source:o.id,gradient:f,reference:p,shadeToTitle:o.shadeToTitle,diagnostics:d,colors:f.stops.values.map(function(e){return hn(e.color,e.colorTransforms,n,p)})}}var En=function(){return En=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},En.apply(this,arguments)};function Bn(e,r,n,t){var o=sr(r),a=[];return e.forEach(function(e){e.bindings.forEach(function(l){var d=dr(l.data,r,o);a.push({partName:e.partName,id:l.id,background:Dn(d.background,n,t),cells:d.cells.map(function(e,r){var o=i(l.data.cells,r),a=void 0===d.borderCells?void 0:i(d.borderCells,r);return En({row:o.row,column:o.column,paint:Dn(e,n,t)},void 0===a?{}:{borders:a.map(function(e){return function(e,r,n){var t=e.choice,o=void 0!==t&&"reference"===t.kind?t.reference:void 0,a=void 0!==t&&"line"===t.kind?t.fill:{kind:"missing"},l=void 0===r?void 0:r.lines,d=wn([{id:e.source,fill:a,reference:o}],l,n),s=void 0!==o&&"value"===o.index.kind?o.index.value:void 0;void 0!==s&&s>0&&1e3!==s&&void 0!==r&&void 0!==r.lines&&s<=r.lines.length&&(a=i(r.lines,s-1));var c="other"===d.kind&&"solid"===d.fillKind&&"solid"===a.kind&&"color"in a&&"colorTransforms"in a?{result:d,solid:hn(a.color,a.colorTransforms,n,o)}:{result:d},u=void 0!==s&&s>0&&1e3!==s&&void 0!==r&&void 0!==r.lineStyles?r.lineStyles[s-1]:void 0,v=function(e){if(void 0===e)return;if("preset"===e.kind)return{kind:"preset",value:e.value};var r=[];return e.stops.forEach(function(e){r.push({dash:e.dash,space:e.space})}),{kind:"custom",stops:r}}(void 0===u?void 0:u.dash),f=void 0!==t&&"line"===t.kind?t.properties:void 0===u?void 0:{width:u.widthEmu,cap:u.cap,compound:u.compound,align:u.align,dash:v,join:void 0===u.join?void 0:{kind:u.join.kind,limit:"miter"===u.join.kind?u.join.limit:void 0}};return En({edge:e.edge,source:e.source,paint:c},void 0===f?{}:{properties:f},void 0===s?{}:{referenceIndex:s})}(e,n,t)})})})})})}),a}function Dn(e,r,n){var i=e.choice,t="reference"===i.kind?i.reference:void 0,o="fill"===i.kind?i.fill:{kind:"missing"},a=Pn([{id:e.source,fill:o,reference:t}],r,n,!1);if(void 0!==t){var l=Be(t,void 0===r?void 0:r.fills,void 0===r?void 0:r.backgrounds);"style"===l.kind&&(o=l.style)}return"solid"===o.kind&&"color"in o&&"colorTransforms"in o?{result:a,solid:hn(o.color,o.colorTransforms,n,t)}:{result:a}}var On=function(){function e(e){for(var r=0;r<k.length;r++){var n=i(k,r);if(!e.has(n))throw new RangeError('ColorMapping is missing required key "'+n+'"')}this.entries=e}return e.prototype.get=function(e){var r=this.entries.get(e);if(void 0===r)throw new RangeError('ColorMapping key "'+e+'" is not present');return r},e.prototype.toRecord=function(){for(var e={},r=0;r<k.length;r++){var n=i(k,r);t(e,String(n),this.get(n))}return e},e}(),Un=function(){function e(e,r){this.name=e,this.slots=r}return e.prototype.getSlot=function(e){var r=this.slots.get(e);if(void 0===r)throw new RangeError('Colour scheme slot "'+e+'" is not present');return r},e}();Object.freeze(["title","body","ctrTitle","subTitle","dt","sldNum","ftr","hdr","obj","chart","tbl","clipArt","dgm","media","sldImg","pic"]);var An=function(){return An=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},An.apply(this,arguments)};function Tn(e){var r,n,i=e.placeholder;return void 0===i?void 0:(r=i.type||"obj",n=function(e){if(void 0===e||0===e.length)return 0;if(!/^\\d+$/.test(e))return 0;var r=Number(e);return!Number.isSafeInteger(r)||r<0?0:r}(i.index),r+"\\0"+String(n))}function Mn(e,r,n){var i=e.get(r);return void 0===i?void 0:i.get(n)}function Rn(e,r,n,i){void 0!==r&&(e.push({id:n,fill:r.fill}),e.push({id:i,fill:{kind:"missing"},reference:r.reference}))}function jn(e,r,n){void 0!==r&&void 0!==r.outline&&e.push({id:n,fill:r.outline.fill,reference:r.outline.reference})}var Gn=function(){return Gn=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++)for(var t in r=arguments[n])Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e},Gn.apply(this,arguments)};var In={groupNestingDepth:Ue.groupNestingDepth,xmlNestingDepth:Ue.xmlNestingDepth,xmlAttributesPerElement:Ue.xmlAttributesPerElement,textNodeLengthBytes:Ue.textNodeLengthBytes};return e.bindTableFillData=function(e,r,n,t){if(void 0===n&&(n=[]),void 0===t&&(t=sr(n)),e.columnWidthsEmu.length===r.columnCount&&e.rowHeightsEmu.length===r.rowCount&&e.cells.length===r.cells.length){for(var o=0;o<r.cells.length;o++){var a=i(r.cells,o),l=i(e.cells,o);if(a.row!==l.row||a.column!==l.column||a.columnSpan!==l.columnSpan||a.rowSpan!==l.rowSpan||a.horizontalMerge!==l.horizontalMerge||a.verticalMerge!==l.verticalMerge)return}return{direct:r,resolved:dr(r,n,t)}}},e.gradientXmlDefaults=In,e.indexTableStyleFills=sr,e.readGradientPartSnapshot=function(e,r,n){var t=function(e,r){void 0===r&&(r={});var n={source:e,index:0,limits:Ae(r.limits),partName:r.partName,depth:0};if("\\ufeff"===Pr(n)&&Er(n),/<!DOCTYPE/i.test(e))throw new br("DOCTYPE / DTD declarations are not allowed (external entities disabled)",Or(r.partName));for(Dr(n);n.index<n.source.length;)if(Br(n,"<?"))Ir(n),Dr(n);else{if(!Br(n,"\\x3c!--")){if((Br(n,"<!DOCTYPE")||Br(n,"<!doctype"))&&_r(n),"<"===Pr(n)){var i=qr(n,[]);if(Dr(n),n.index<n.source.length)for(;n.index<n.source.length&&(Dr(n),!(n.index>=n.source.length));)Br(n,"\\x3c!--")?Lr(n):Br(n,"<?")?Ir(n):Ur(n,"Unexpected content after document element");return i}return Ur(n,"Expected document element")}Lr(n),Dr(n)}return Ur(n,"Empty XML document")}(e,{partName:r,limits:n}),o=[],l=new Map,d=[],s=[],c=new Map;!function e(n,t,u,v){var f=t.concat([{namespaceUri:n.namespaceUri,localName:n.localName,elementIndex:u}]),p=D(n,r);void 0!==p&&(o.push({path:f,gradient:p}),l.set(n,p));var m=Se(n,r);if(void 0!==m&&d.push({path:f,reference:m}),"rPr"===n.localName||"defRPr"===n.localName||"endParaRPr"===n.localName){var h=H(n,r);if(Y(h)){c.set(n,h);var g=void 0!==v&&v.namespaceUri===n.namespaceUri&&"fld"===v.localName?v:void 0;s.push({path:f,properties:h,fieldId:void 0===g?void 0:a(g,"","id"),fieldType:void 0===g?void 0:a(g,"","type")})}}for(var k=0,y=0;y<n.children.length;y++){var b=i(n.children,y);"element"===b.kind&&e(b,f,k++,n)}}(t,[],0);var u=n&&void 0!==n.groupNestingDepth?n.groupNestingDepth:Ue.groupNestingDepth,v=function(e){var r=e.namespaceUri;if("http://schemas.openxmlformats.org/presentationml/2006/main"===r||"http://purl.oclc.org/ooxml/presentationml/main"===r){if("presentation"===e.localName){var n=ve(e,r,"defaultTextStyle");return void 0===n?void 0:{defaultTextStyle:he(n)}}if("sldMaster"===e.localName){var i=ve(e,r,"txStyles");if(void 0!==i)return{masterTextStyles:{titleStyle:he(ve(i,r,"titleStyle")),bodyStyle:he(ve(i,r,"bodyStyle")),otherStyle:he(ve(i,r,"otherStyle"))}}}}}(t);return Gn({version:1,partName:r,records:o,references:d,characters:s},void 0===v?{}:{textStyles:v},{hostBindings:Me(t,r,n,l)},e.indexOf("tbl")<0?{}:{tableFills:tr(t,r,u,l),tableStyles:er(t,r,l)},e.indexOf("grpFill")<0?{}:{groupFills:cr(t,r,u)},0===s.length&&e.indexOf("fontRef")<0?{}:{textFills:vr(t,c)})},e.resolveGradientSlidePaint=function(e){var r=[],n=void 0===e.theme?void 0:e.theme.theme;(e.overrides||[]).forEach(function(e){var i=e.theme;void 0!==i?n={styles:{lineStyles:void 0===i.styles.lines&&void 0===i.styles.lineStyles&&void 0!==n?n.styles.lineStyles:i.styles.lineStyles,lineEnds:void 0===i.styles.lines&&void 0===i.styles.lineEnds&&void 0!==n?n.styles.lineEnds:i.styles.lineEnds,lines:void 0===i.styles.lines&&void 0!==n?n.styles.lines:i.styles.lines,fills:void 0===i.styles.fills&&void 0!==n?n.styles.fills:i.styles.fills,backgrounds:void 0===i.styles.backgrounds&&void 0!==n?n.styles.backgrounds:i.styles.backgrounds},colors:void 0===i.colors&&void 0!==n?n.colors:i.colors}:r.push("unavailable-theme-override")});var o=void 0===n?void 0:n.styles,a=function(e,r){if(void 0===e||void 0===e.entries||void 0===r||void 0===r.colors)return;for(var n=new Map,i=0,t=e.entries;i<t.length;i++){var o=t[i];if(void 0===o.value||!F(o.value))return;n.set(o.key,o.value)}var a=new Map;r.colors.forEach(function(e){void 0!==e.color&&a.set(e.slot,e.color)});try{return{mapping:new On(n),scheme:new Un("gradient-paint",a)}}catch(e){if(e instanceof RangeError)return;throw e}}(e.slide.colorMap&&"master-reference"!==e.slide.colorMap.kind?e.slide.colorMap:void 0===e.master?void 0:e.master.colorMap,n);void 0===a&&r.push("unavailable-color-context");var l=[e.slide];void 0!==e.layout&&l.push(e.layout),void 0!==e.master&&l.push(e.master);var d=new Map,s=new Map;l.forEach(function(e){var n=new Map,i=new Map;e.hosts.forEach(function(e){if(e.bindable&&void 0!==e.id){i.set(e.id,e);var t=Tn(e);void 0===t||n.has(t)||n.set(t,e)}else r.push("unbound-host-id")}),d.set(e.partName,n),s.set(e.partName,i)});var c=[];l.forEach(function(n){var i=n===e.slide?"slide":n===e.layout?"layout":"master",t=n.background.shadeToTitle;void 0!==t&&"invalid"===t.kind&&r.push("invalid-background-shade-flag"),c.push({id:i,fill:n.background.fill,reference:n.background.reference,shadeToTitle:void 0===t?void 0:"value"===t.kind&&t.value})});var u=Pn(c,o,a,!0),v=[];l.forEach(function(r){r.hosts.forEach(function(n){if(n.bindable&&void 0!==n.id){var t,l,c;if("invalid"===n.useBackgroundFill.kind)t={kind:"invalid-reference",source:"direct",reason:"invalid-background-fill-flag"};else if("value"===n.useBackgroundFill.kind&&n.useBackgroundFill.value)t=u;else{Rn(p=[],n,"direct","style"),void 0!==(f=Tn(n))&&(r===e.slide&&void 0!==e.layout&&Rn(p,Mn(d,e.layout.partName,f),"layout","layout-style"),r!==e.master&&void 0!==e.master&&Rn(p,Mn(d,e.master.partName,f),"master","master-style")),"other"===(t=Pn(p,o,a,!1)).kind&&"group"===t.fillKind?t="direct"!==t.source&&"style"!==t.source?An({},t,{reason:"inherited-group-owner-unresolved"}):function(e,r,n,t,o,a){for(var l=[],d=e.ancestors.length-1;d>=0;d--){var s=i(e.ancestors,d),c=void 0===s?void 0:Mn(n,r.partName,s);if(void 0===c||void 0===s||l.indexOf(s)>=0)return{kind:"invalid-reference",source:"group",reason:"invalid-group-ancestry"};if(l.push(s),"group"!==c.fill.kind){var u=Pn([{id:"group:"+s,fill:c.fill}],t,o,!1);return An({},u,{groupOwner:{id:s,partName:r.partName,chain:l}})}}return"other"===a.kind?An({},a,{reason:"missing-group-owner"}):a}(n,r,s,o,a,t):"grpSp"===n.elementKind&&"missing"!==t.kind&&(t=An({},t,{groupOwner:{id:n.id,chain:[n.id],partName:r.partName}}))}if(void 0!==n.outline){var f,p=[],m=[],h=function(e,r){void 0!==e&&void 0!==e.outline&&m.push({id:r,ends:e.outline.ends,reference:e.outline.reference})};h(n,"outline-direct"),jn(p,n,"outline-direct"),void 0!==(f=Tn(n))&&(r===e.slide&&void 0!==e.layout&&(jn(p,Mn(d,e.layout.partName,f),"outline-layout"),h(Mn(d,e.layout.partName,f),"outline-layout")),r!==e.master&&void 0!==e.master&&(jn(p,Mn(d,e.master.partName,f),"outline-master"),h(Mn(d,e.master.partName,f),"outline-master"))),void 0!==n.outline.ends&&(c=function(e,r){for(var n={},i={},t={},o=[],a=function(e,r){void 0!==e&&(void 0===n.type&&void 0!==e.head&&void 0!==e.head.type&&(n.type=e.head.type,t["head.type"]=r),void 0===n.width&&void 0!==e.head&&void 0!==e.head.width&&(n.width=e.head.width,t["head.width"]=r),void 0===n.length&&void 0!==e.head&&void 0!==e.head.length&&(n.length=e.head.length,t["head.length"]=r),void 0===i.type&&void 0!==e.tail&&void 0!==e.tail.type&&(i.type=e.tail.type,t["tail.type"]=r),void 0===i.width&&void 0!==e.tail&&void 0!==e.tail.width&&(i.width=e.tail.width,t["tail.width"]=r),void 0===i.length&&void 0!==e.tail&&void 0!==e.tail.length&&(i.length=e.tail.length,t["tail.length"]=r))},l=0,d=e;l<d.length;l++){var s=d[l];a(s.ends,s.id);var c=void 0===s.reference?void 0:s.reference.index;void 0===r&&void 0!==c&&"value"===c.kind&&c.value>0&&1e3!==c.value&&o.push({source:s.id+"-style",reason:"unavailable-line-end-style-list"}),void 0!==r&&void 0!==c&&"value"===c.kind&&Number.isFinite(c.value)&&Number.isInteger(c.value)&&c.value>0&&1e3!==c.value&&c.value<=r.length&&a(r[c.value-1],s.id+"-style")}return ge({head:0===Object.keys(n).length?void 0:n,tail:0===Object.keys(i).length?void 0:i,provenance:t},0===o.length?{}:{diagnostics:o})}(m,void 0===o?void 0:o.lineEnds)),l=wn(p,void 0===o?void 0:o.lines,a)}v.push({partName:r.partName,id:n.id,result:t,outline:l,outlineEnds:c})}})});var f={};return void 0!==a&&void 0!==n&&void 0!==n.colors&&n.colors.forEach(function(e){F(e.slot)&&void 0!==e.color&&t(f,e.slot,e.color)}),An({version:1,textColors:void 0===a?{kind:"unavailable"}:{kind:"available",colors:f,colorMap:a.mapping.toRecord()},parts:{slide:e.slide.partName,layout:void 0===e.layout?void 0:e.layout.partName,master:void 0===e.master?void 0:e.master.partName},background:u,hosts:v},void 0===e.tableParts||0===e.tableParts.length?{}:{tables:Bn(e.tableParts,e.tableStyles||[],o,a)},{diagnostics:Array.from(new Set(r))})},e.resolveTableFillData=dr,e.tableBorderBucketOrder=_e,e.tableFillBuckets=nr,e}({});
  // END GENERATED GRADIENT TRANSPORT
  var gradientRequests = Object.create(null);
  // Four immutable part DTOs at most; no XML/DOM retained. Reset with the package session.
  var gradientPartCache = [];
  var gradientThemePartName;
  var bytes = null;
  var slides = [];
  var entries = Object.create(null);
  var cancelled = Object.create(null);
  var limits = null;
  var presentationInfo = null;
  var contentTypeDefaults = Object.create(null);
  var contentTypeOverrides = Object.create(null);
  var mediaRequests = Object.create(null);
  var mediaRequestIdsByPart = Object.create(null);
  var nextMediaRequestId = 1;
  var chartRequests = Object.create(null);
  var chartRequestIdsByPart = Object.create(null);
  var nextChartRequestId = 1;

  function fail(requestId, code, detail) {
    self.postMessage({ type: 'error', requestId: requestId, code: code, detail: detail || '' });
  }

  function u16(view, offset) { return view.getUint16(offset, true); }
  function u32(view, offset) { return view.getUint32(offset, true); }

  function decodeName(input) {
    return new TextDecoder('utf-8', { fatal: false }).decode(input);
  }

  function xmlAttribute(tag, name) {
    var quoteCharacters = String.fromCharCode(34, 39);
    var expression = new RegExp("(?:^|\\\\s)(?:[A-Za-z_][\\\\w.-]*:)?" + name +
      "\\\\s*=\\\\s*([" + quoteCharacters + "])([^" + quoteCharacters + "]*)\\\\1", 'i');
    var match = expression.exec(tag);
    return match ? match[2] : undefined;
  }

  function startTags(xml, localName) {
    var expression = new RegExp('<(?:[A-Za-z_][\\\\w.-]*:)?' + localName + '\\\\b(?!:)[^>]*>', 'gi');
    return xml.match(expression) || [];
  }

  function elementXml(xml, localName) {
    var openExpression = new RegExp('<(?:[A-Za-z_][\\\\w.-]*:)?' + localName +
      '\\\\b(?!:)[^>]*>', 'i');
    var open = openExpression.exec(xml);
    if (!open) { return undefined; }
    var slashIndex = open[0].lastIndexOf('/');
    if (slashIndex >= 0 && open[0].slice(slashIndex + 1).trim() === '>') { return open[0]; }
    var afterOpen = open.index + open[0].length;
    var closeExpression = new RegExp('<\\/(?:[A-Za-z_][\\\\w.-]*:)?' + localName + '\\\\s*>', 'i');
    var close = closeExpression.exec(xml.slice(afterOpen));
    return close ? xml.slice(open.index, afterOpen + close.index + close[0].length) : undefined;
  }

  function elementsXml(xml, localName) {
    var expression = new RegExp('<(?:[A-Za-z_][\\\\w.-]*:)?' + localName +
      '\\\\b(?!:)[^>]*>[\\\\s\\\\S]*?<\\/(?:[A-Za-z_][\\\\w.-]*:)?' + localName + '\\\\s*>', 'gi');
    return xml.match(expression) || [];
  }

  function directChildElements(xml) {
    var firstClose = xml.indexOf('>');
    var lastOpen = xml.lastIndexOf('</');
    if (firstClose < 0 || lastOpen <= firstClose) { return []; }
    var inner = xml.slice(firstClose + 1, lastOpen);
    var token = /<\\/?(?:[A-Za-z_][\\w.-]*:)?[A-Za-z_][\\w.-]*\\b[^>]*>/g;
    var result = [];
    var depth = 0;
    var start = -1;
    var match;
    while ((match = token.exec(inner)) !== null) {
      var value = match[0];
      var closing = value.charAt(1) === '/';
      var selfClosing = /\\/\\s*>$/.test(value);
      if (!closing) {
        if (depth === 0) { start = match.index; }
        if (!selfClosing) { depth++;
        } else if (depth === 0) { result.push(value); start = -1; }
      } else {
        depth--;
        if (depth === 0 && start >= 0) {
          result.push(inner.slice(start, token.lastIndex));
          start = -1;
        }
      }
    }
    return result;
  }

  function elementLocalName(xml) {
    var match = /^<(?:[A-Za-z_][\\w.-]*:)?([A-Za-z_][\\w.-]*)\\b(?!:)/i.exec(xml);
    return match ? match[1] : undefined;
  }

  function optionalBoolean(value) {
    if (value === undefined) { return undefined; }
    if (value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'on') { return true; }
    if (value === '0' || value.toLowerCase() === 'false' || value.toLowerCase() === 'off') { return false; }
    return undefined;
  }

  function emuToPoints(value) {
    var numeric = Number(value);
    return isFinite(numeric) && numeric > 0 ? numeric / 12700 : undefined;
  }

  function normalizePartName(sourceName, target) {
    if (!target) { return undefined; }
    if (target.charAt(0) === '/') { return target.slice(1); }
    var base = sourceName.split('/');
    base.pop();
    var values = base.concat(target.split('/'));
    var normalized = [];
    for (var i = 0; i < values.length; i++) {
      if (!values[i] || values[i] === '.') { continue; }
      if (values[i] === '..') {
        if (!normalized.length) { throw { code: 'Corrupt', detail: 'relationship-path' }; }
        normalized.pop();
      } else {
        normalized.push(values[i]);
      }
    }
    return normalized.join('/');
  }

  function relationshipsName(partName) {
    var slash = partName.lastIndexOf('/');
    var directory = slash >= 0 ? partName.slice(0, slash + 1) : '';
    var file = slash >= 0 ? partName.slice(slash + 1) : partName;
    return directory + '_rels/' + file + '.rels';
  }

  function imageContentType(partName) {
    var extension = (partName.split('.').pop() || '').toLowerCase();
    var values = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
      svg: 'image/svg+xml', webp: 'image/webp', bmp: 'image/bmp', tif: 'image/tiff', tiff: 'image/tiff',
      emf: 'image/x-emf', wmf: 'image/x-wmf'
    };
    return values[extension] || 'application/octet-stream';
  }

  function parseContentTypes(xml) {
    contentTypeDefaults = Object.create(null);
    contentTypeOverrides = Object.create(null);
    var defaults = startTags(xml, 'Default');
    for (var i = 0; i < defaults.length; i++) {
      var extension = (xmlAttribute(defaults[i], 'Extension') || '').toLowerCase();
      var defaultType = xmlAttribute(defaults[i], 'ContentType');
      if (extension && defaultType) { contentTypeDefaults[extension] = defaultType; }
    }
    var overrides = startTags(xml, 'Override');
    for (var j = 0; j < overrides.length; j++) {
      var partName = xmlAttribute(overrides[j], 'PartName');
      var overrideType = xmlAttribute(overrides[j], 'ContentType');
      if (partName && overrideType) {
        contentTypeOverrides[partName.charAt(0) === '/' ? partName.slice(1) : partName] = overrideType;
      }
    }
  }

  function partContentType(partName) {
    var normalized = partName || '';
    if (normalized.charAt(0) === '/') { normalized = normalized.slice(1); }
    var extension = (normalized.split('.').pop() || '').toLowerCase();
    var declared = contentTypeOverrides[normalized] || contentTypeDefaults[extension] || imageContentType(normalized);
    var lowered = String(declared).toLowerCase();
    if (lowered === 'image/jpg' || lowered === 'image/pjpeg') { return 'image/jpeg'; }
    return lowered === 'image/x-png' ? 'image/png' : declared;
  }

  function intrinsicImageSize(data, contentType) {
    if (!data || !data.length) { return undefined; }
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    if (contentType === 'image/png' && data.length >= 24 &&
        data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
      return { widthPx: view.getUint32(16, false), heightPx: view.getUint32(20, false) };
    }
    if (contentType === 'image/gif' && data.length >= 10) {
      return { widthPx: view.getUint16(6, true), heightPx: view.getUint16(8, true) };
    }
    if (contentType === 'image/bmp' && data.length >= 26) {
      return { widthPx: Math.abs(view.getInt32(18, true)), heightPx: Math.abs(view.getInt32(22, true)) };
    }
    if (contentType === 'image/jpeg') {
      var offset = 2;
      while (offset + 9 < data.length) {
        if (data[offset] !== 0xff) { offset++; continue; }
        var marker = data[offset + 1];
        if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
        var segmentLength = view.getUint16(offset + 2, false);
        if (segmentLength < 2 || offset + 2 + segmentLength > data.length) { break; }
        if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) ||
            (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
          return { widthPx: view.getUint16(offset + 7, false), heightPx: view.getUint16(offset + 5, false) };
        }
        offset += 2 + segmentLength;
      }
    }
    if (contentType === 'image/svg+xml') {
      var svg = rejectForbiddenXml(data);
      var root = startTags(svg, 'svg')[0] || '';
      function svgNumber(name) {
        var raw = xmlAttribute(root, name);
        var match = raw === undefined ? null : /^\\s*([0-9]+(?:\\.[0-9]+)?)/.exec(raw);
        return match ? Number(match[1]) : undefined;
      }
      var width = svgNumber('width');
      var height = svgNumber('height');
      if (width !== undefined && height !== undefined) { return { widthPx: width, heightPx: height }; }
      var viewBox = xmlAttribute(root, 'viewBox');
      var values = viewBox ? viewBox.trim().split(/[\\s,]+/).map(Number) : [];
      if (values.length === 4 && values.every(function (value) { return isFinite(value); })) {
        return { widthPx: Math.abs(values[2]), heightPx: Math.abs(values[3]) };
      }
    }
    return undefined;
  }

  function parseRelationships(xml, sourceName) {
    var result = Object.create(null);
    var tags = startTags(xml, 'Relationship');
    for (var i = 0; i < tags.length; i++) {
      var id = xmlAttribute(tags[i], 'Id');
      var target = xmlAttribute(tags[i], 'Target');
      if (!id || !target) { continue; }
      var external = (xmlAttribute(tags[i], 'TargetMode') || '').toLowerCase() === 'external';
      result[id] = {
        type: xmlAttribute(tags[i], 'Type') || '',
        target: target,
        external: external,
        partName: external ? undefined : normalizePartName(sourceName, target)
      };
    }
    return result;
  }

  function safeName(name) {
    if (!name || name.charAt(0) === '/' || name.indexOf('\\\\') >= 0) { return false; }
    var segments = name.split('/');
    for (var i = 0; i < segments.length; i++) {
      if (segments[i] === '..' || segments[i] === '.') { return false; }
    }
    return true;
  }

  function findEocd(input, view) {
    var start = Math.max(0, input.byteLength - 22 - 65535);
    for (var offset = input.byteLength - 22; offset >= start; offset--) {
      if (u32(view, offset) === 0x06054b50 && offset + 22 + u16(view, offset + 20) === input.byteLength) {
        return offset;
      }
    }
    throw { code: 'Corrupt', detail: 'zip-eocd' };
  }

  function slideNumber(name) {
    var match = /^ppt\\/slides\\/slide(\\d+)\\.xml$/i.exec(name);
    return match ? Number(match[1]) : -1;
  }

  function rejectForbiddenXml(data) {
    var xml = new TextDecoder('utf-8', { fatal: false }).decode(data);
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) {
      throw { code: 'Corrupt', detail: 'xml-dtd-entity' };
    }
    return xml;
  }

  function resolveWorkerLimits(overrides) {
    var defaults = {
      entryCount: 10000,
      totalUncompressedBytes: 1073741824,
      singlePartUncompressedBytes: 268435456,
      compressionRatio: 200,
      groupNestingDepth: gradientTransport.gradientXmlDefaults.groupNestingDepth,
      xmlNestingDepth: gradientTransport.gradientXmlDefaults.xmlNestingDepth,
      xmlAttributesPerElement: gradientTransport.gradientXmlDefaults.xmlAttributesPerElement,
      textNodeLengthBytes: gradientTransport.gradientXmlDefaults.textNodeLengthBytes
    };
    overrides = overrides || {};
    Object.keys(defaults).forEach(function (name) {
      var value = overrides[name];
      if (typeof value === 'number' && isFinite(value) && value > 0) {
        defaults[name] = value;
      }
    });
    return defaults;
  }

  function throwIfCancelled(requestId) {
    if (cancelled[requestId]) {
      delete cancelled[requestId];
      throw { code: 'Aborted', detail: 'request-cancelled' };
    }
  }

  async function readEntry(entry, requestId) {
    throwIfCancelled(requestId);
    var input = new Uint8Array(bytes);
    var view = new DataView(bytes);
    var offset = entry.localHeaderOffset;
    if (offset + 30 > input.byteLength || u32(view, offset) !== 0x04034b50) {
      throw { code: 'Corrupt', detail: 'local-header' };
    }
    var nameLength = u16(view, offset + 26);
    var extraLength = u16(view, offset + 28);
    var dataStart = offset + 30 + nameLength + extraLength;
    var dataEnd = dataStart + entry.compressedSize;
    if (dataEnd > input.byteLength) { throw { code: 'Corrupt', detail: 'entry-data-range' }; }
    var compressed = input.subarray(dataStart, dataEnd);
    var result;
    if (entry.method === 0) {
      result = compressed.slice();
    } else if (entry.method === 8) {
      if (typeof DecompressionStream !== 'function') {
        throw { code: 'Unsupported', detail: 'deflate-raw' };
      }
      var stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      result = new Uint8Array(await new Response(stream).arrayBuffer());
    } else {
      throw { code: 'Unsupported', detail: 'compression-method' };
    }
    throwIfCancelled(requestId);
    if (result.byteLength !== entry.uncompressedSize) {
      throw { code: 'Corrupt', detail: 'uncompressed-size' };
    }
    return result;
  }

  // The shared parser reads complete parts; detached fragments lose namespace scope.
  function captureAuthoredGradients(xml, partName, requestId) {
    var parts = gradientRequests[requestId];
    if (!parts || (xml.indexOf('gradFill') < 0 && xml.indexOf('fillRef') < 0 && xml.indexOf('bgRef') < 0 && xml.indexOf('solidFill') < 0 &&
        xml.indexOf('fontRef') < 0 && xml.indexOf('noFill') < 0 && xml.indexOf('grpFill') < 0 && xml.indexOf('pattFill') < 0 &&
        xml.indexOf('blipFill') < 0 && xml.indexOf('uFill') < 0 && xml.indexOf('uLn') < 0 &&
        xml.indexOf(':ln') < 0 && xml.indexOf('<ln') < 0 && xml.indexOf('tbl') < 0 && xml.indexOf('spTree') < 0 && xml.indexOf('clrScheme') < 0)) { return; }
    var absolute = '/' + partName;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].partName === absolute) { return; }
    }
    var record;
    for (var cachedIndex = 0; cachedIndex < gradientPartCache.length; cachedIndex++) {
      if (gradientPartCache[cachedIndex].partName === absolute) {
        record = gradientPartCache.splice(cachedIndex, 1)[0];
        break;
      }
    }
    if (!record) { record = gradientTransport.readGradientPartSnapshot(xml, absolute, limits); }
    gradientPartCache.push(record);
    if (gradientPartCache.length > 4) { gradientPartCache.shift(); }
    if (record.hostBindings || (record.tableFills && record.tableFills.length) || (record.tableStyles && record.tableStyles.length) ||
        record.records.length || record.textFills || (record.groupFills && record.groupFills.length) ||
        (record.references && record.references.length) ||
        (record.characters && record.characters.length)) { parts.push(record); }
  }

  async function readPartXml(partName, requestId) {
    var entry = entries[partName];
    if (!entry) { throw { code: 'Corrupt', detail: 'missing-part' }; }
    var partBytes = await readEntry(entry, requestId);
    var xml = rejectForbiddenXml(partBytes);
    partBytes = null;
    captureAuthoredGradients(xml, partName, requestId);
    return xml;
  }

  async function readRelationships(partName, requestId) {
    var name = relationshipsName(partName);
    if (!entries[name]) { return Object.create(null); }
    return parseRelationships(await readPartXml(name, requestId), partName);
  }

  function firstRelationshipByType(relationships, suffix) {
    var ids = Object.keys(relationships);
    for (var i = 0; i < ids.length; i++) {
      if (new RegExp('/' + suffix + '$').test(relationships[ids[i]].type)) {
        return relationships[ids[i]];
      }
    }
    return undefined;
  }

  function parseFontCollection(fontScheme, localName) {
    var collection = elementXml(fontScheme, localName);
    var supplementalFonts = [];
    function typeface(name) {
      var tags = collection ? startTags(collection, name) : [];
      return tags.length ? (xmlAttribute(tags[0], 'typeface') || '') : '';
    }
    var children = collection ? directChildElements(collection) : [];
    for (var i = 0; i < children.length; i++) {
      if (elementLocalName(children[i]) !== 'font') { continue; }
      var tags = startTags(children[i], 'font');
      var script = tags.length ? xmlAttribute(tags[0], 'script') : undefined;
      var supplementalTypeface = tags.length ? xmlAttribute(tags[0], 'typeface') : undefined;
      if (script !== undefined && supplementalTypeface !== undefined) {
        supplementalFonts.push({ script: script, typeface: supplementalTypeface });
      }
    }
    return {
      latin: typeface('latin'),
      eastAsian: typeface('ea'),
      complexScript: typeface('cs'),
      supplementalFonts: supplementalFonts
    };
  }

  async function parseThemeContext(presentationRelationships, requestId) {
    var masterRelationship = firstRelationshipByType(presentationRelationships, 'slideMaster');
    if (!masterRelationship || !masterRelationship.partName || !entries[masterRelationship.partName]) {
      return undefined;
    }
    var masterName = masterRelationship.partName;
    var masterXml = await readPartXml(masterName, requestId);
    var mapTags = startTags(masterXml, 'clrMap');
    var colorMap = Object.create(null);
    var mapKeys = ['bg1', 'tx1', 'bg2', 'tx2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
    for (var i = 0; i < mapKeys.length; i++) {
      if (mapTags.length) { colorMap[mapKeys[i]] = xmlAttribute(mapTags[0], mapKeys[i]); }
    }
    var masterRelationships = await readRelationships(masterName, requestId);
    var themeRelationship = firstRelationshipByType(masterRelationships, 'theme');
    if (!themeRelationship || !themeRelationship.partName || !entries[themeRelationship.partName]) {
      return { colors: Object.create(null), colorMap: colorMap };
    }
    gradientThemePartName = '/' + themeRelationship.partName;
    var themeXml = await readPartXml(themeRelationship.partName, requestId);
    var scheme = elementXml(themeXml, 'clrScheme') || '';
    var colorKeys = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
    var colors = Object.create(null);
    for (var j = 0; j < colorKeys.length; j++) {
      var slot = elementXml(scheme, colorKeys[j]);
      colors[colorKeys[j]] = slot ? parseColor(slot) : undefined;
    }
    var fontScheme = elementXml(themeXml, 'fontScheme') || '';
    var formatScheme = elementXml(themeXml, 'fmtScheme') || '';
    var fillList = elementXml(formatScheme, 'fillStyleLst') || '';
    var backgroundList = elementXml(formatScheme, 'bgFillStyleLst') || '';
    var lineList = elementXml(formatScheme, 'lnStyleLst') || '';
    var effectList = elementXml(formatScheme, 'effectStyleLst') || '';
    return {
      colors: colors,
      colorMap: colorMap,
      fonts: {
        major: parseFontCollection(fontScheme, 'majorFont'),
        minor: parseFontCollection(fontScheme, 'minorFont')
      },
      fillStyles: directChildElements(fillList).map(parseFill),
      backgroundFillStyles: directChildElements(backgroundList).map(parseFill),
      effectStyles: directChildElements(effectList).filter(function (child) {
        return elementLocalName(child) === 'effectStyle';
      }).map(parseShapeEffects),
      lineStyles: directChildElements(lineList).filter(function (child) {
        return elementLocalName(child) === 'ln';
      }).map(function (line) {
        var parsed = parseLineElement(line);
        return {
          width: parsed.widthEmu === undefined ? undefined : parsed.widthEmu / 12700,
          cap: parsed.cap,
          compound: parsed.compound,
          alignment: parsed.align,
          dash: parsed.presetDash,
          fill: parsed.fill
        };
      })
    };
  }

  async function parsePresentation(requestId) {
    var partName = 'ppt/presentation.xml';
    var xml = await readPartXml(partName, requestId);
    var sizeTags = startTags(xml, 'sldSz');
    var widthPt;
    var heightPt;
    var sizeType;
    if (sizeTags.length) {
      widthPt = emuToPoints(xmlAttribute(sizeTags[0], 'cx'));
      heightPt = emuToPoints(xmlAttribute(sizeTags[0], 'cy'));
      sizeType = xmlAttribute(sizeTags[0], 'type');
    }
    var relationships = await readRelationships(partName, requestId);
    var tableStylesRelationship = firstRelationshipByType(relationships, 'tableStyles');
    var tableStyles = Object.create(null);
    var tableGradientStyles = [];
    if (tableStylesRelationship && tableStylesRelationship.partName &&
        entries[tableStylesRelationship.partName]) {
      var tableStyleXml = await readPartXml(tableStylesRelationship.partName, requestId);
      tableStyles = parseTableStyleDefinitions(tableStyleXml);
      (gradientRequests[requestId] || []).forEach(function (part) {
        if (part.partName === '/' + tableStylesRelationship.partName) { tableGradientStyles = part.tableStyles || []; }
      });
    }
    var orderedSlides = [];
    var list = elementXml(xml, 'sldIdLst');
    var slideTags = list ? startTags(list, 'sldId') : [];
    for (var i = 0; i < slideTags.length; i++) {
      var relationshipId = xmlAttribute(slideTags[i], 'id');
      var relationship = relationships[relationshipId];
      if (relationship && relationship.partName && entries[relationship.partName]) {
        orderedSlides.push(relationship.partName);
      }
    }
    return {
      slideWidthPt: widthPt,
      slideHeightPt: heightPt,
      slideSizeType: sizeType,
      theme: await parseThemeContext(relationships, requestId),
      tableStyles: tableStyles,
      tableGradientStyles: tableGradientStyles,
      tableGradientStyleIndex: gradientTransport.indexTableStyleFills(tableGradientStyles),
      defaultTextStyle: parseTextStyleLevels(elementXml(xml, 'defaultTextStyle') || ''),
      slides: orderedSlides.length ? orderedSlides : slides
    };
  }

  function firstAuthoredColorXml(container) {
    var choices = ['srgbClr', 'schemeClr', 'sysClr', 'prstClr', 'scrgbClr', 'hslClr'];
    var selected;
    var selectedIndex = -1;
    for (var i = 0; i < choices.length; i++) {
      var candidate = elementXml(container, choices[i]) || startTags(container, choices[i])[0];
      if (!candidate) { continue; }
      var candidateIndex = container.indexOf(candidate);
      if (selectedIndex < 0 || (candidateIndex >= 0 && candidateIndex < selectedIndex)) {
        selected = { kind: choices[i], xml: candidate };
        selectedIndex = candidateIndex;
      }
    }
    return selected;
  }

  function parseColor(container) {
    var selected = firstAuthoredColorXml(container);
    if (selected) {
      var tags = startTags(selected.xml, selected.kind);
      if (selected.kind === 'scrgbClr') {
        return {
          kind: 'scrgb',
          r: xmlAttribute(tags[0], 'r'),
          g: xmlAttribute(tags[0], 'g'),
          b: xmlAttribute(tags[0], 'b')
        };
      }
      if (selected.kind === 'hslClr') {
        return {
          kind: 'hsl',
          hue: xmlAttribute(tags[0], 'hue'),
          sat: xmlAttribute(tags[0], 'sat'),
          lum: xmlAttribute(tags[0], 'lum')
        };
      }
      if (selected.kind === 'sysClr') {
        return {
          kind: 'sys',
          val: xmlAttribute(tags[0], 'val'),
          lastClr: xmlAttribute(tags[0], 'lastClr')
        };
      }
      return {
        kind: selected.kind === 'srgbClr' ? 'srgb' :
          (selected.kind === 'schemeClr' ? 'scheme' : 'prst'),
        val: xmlAttribute(tags[0], 'val')
      };
    }
    return undefined;
  }

  function parseColorTransforms(container) {
    var selected = firstAuthoredColorXml(container);
    var colorXml = selected ? selected.xml : undefined;
    if (!colorXml) { return []; }
    return directChildElements(colorXml).map(function (child) {
      var tag = /^<(?:[A-Za-z_][\\w.-]*:)?([A-Za-z_][\\w.-]*)\\b[^>]*>/.exec(child);
      var raw = tag ? xmlAttribute(tag[0], 'val') : undefined;
      var numeric = raw === undefined ? undefined : Number(raw);
      return {
        kind: tag ? tag[1] : 'unknown',
        value: numeric !== undefined && isFinite(numeric) ? numeric : undefined
      };
    });
  }

  function parseFill(container) {
    var solid = elementXml(container, 'solidFill');
    if (solid) {
      return {
        kind: 'solid',
        color: parseColor(solid),
        colorTransforms: parseColorTransforms(solid)
      };
    }
    var gradient = elementXml(container, 'gradFill');
    if (gradient) {
      var stops = [];
      var stopElements = elementsXml(gradient, 'gs');
      for (var i = 0; i < stopElements.length; i++) {
        var stopTags = startTags(stopElements[i], 'gs');
        var position = stopTags.length ? Number(xmlAttribute(stopTags[0], 'pos')) : 0;
        stops.push({
          position: isFinite(position) ? position / 100000 : 0,
          color: parseColor(stopElements[i]),
          colorTransforms: parseColorTransforms(stopElements[i])
        });
      }
      var linear = startTags(gradient, 'lin');
      var angle = linear.length ? Number(xmlAttribute(linear[0], 'ang')) : undefined;
      var path = startTags(gradient, 'path');
      var pathToken = path.length ? xmlAttribute(path[0], 'path') : undefined;
      var fillToRect = startTags(gradient, 'fillToRect');
      function percentage(name) {
        var raw = fillToRect.length ? Number(xmlAttribute(fillToRect[0], name)) : undefined;
        return typeof raw === 'number' && isFinite(raw) ? raw / 100000 : undefined;
      }
      return {
        kind: 'gradient',
        stops: stops,
        angle: typeof angle === 'number' && isFinite(angle) ? angle / 60000 : undefined,
        scaled: linear.length ? optionalBoolean(xmlAttribute(linear[0], 'scaled')) : undefined,
        rotateWithShape: optionalBoolean(xmlAttribute(startTags(gradient, 'gradFill')[0] || '', 'rotWithShape')),
        path: pathToken === 'circle' || pathToken === 'rect' || pathToken === 'shape' ? pathToken : undefined,
        fillToRect: fillToRect.length ? {
          left: percentage('l'),
          top: percentage('t'),
          right: percentage('r'),
          bottom: percentage('b')
        } : undefined
      };
    }
    var pattern = elementXml(container, 'pattFill');
    if (pattern) {
      var patternTags = startTags(pattern, 'pattFill');
      var foreground = elementXml(pattern, 'fgClr');
      var background = elementXml(pattern, 'bgClr');
      return {
        kind: 'pattern',
        preset: patternTags.length ? xmlAttribute(patternTags[0], 'prst') : undefined,
        foregroundColor: foreground ? parseColor(foreground) : undefined,
        foregroundTransforms: foreground ? parseColorTransforms(foreground) : [],
        backgroundColor: background ? parseColor(background) : undefined,
        backgroundTransforms: background ? parseColorTransforms(background) : []
      };
    }
    if (startTags(container, 'noFill').length) { return { kind: 'noFill' }; }
    var picture = elementXml(container, 'blipFill');
    if (picture) {
      var blipTags = startTags(picture, 'blip');
      var blipTag = blipTags.length ? blipTags[0] : '';
      var linkId = xmlAttribute(blipTag, 'link');
      return {
        kind: 'picture',
        relationshipId: xmlAttribute(blipTag, 'embed') || linkId,
        linked: linkId !== undefined,
        mode: startTags(picture, 'tile').length ? 'tile' :
          (startTags(picture, 'stretch').length ? 'stretch' : undefined)
      };
    }
    return { kind: 'unknown' };
  }

  function parseShapeFill(spPr) {
    var children = directChildElements(spPr || '');
    for (var i = 0; i < children.length; i++) {
      var name = elementLocalName(children[i]);
      if (name === 'noFill' || name === 'solidFill' || name === 'gradFill' ||
          name === 'blipFill' || name === 'pattFill' || name === 'grpFill') {
        return parseFill(children[i]);
      }
    }
    return { kind: 'missing' };
  }

  function pictureFraction(tag, name) {
    var raw = xmlAttribute(tag || '', name);
    var value = raw === undefined ? undefined : Number(raw);
    return typeof value === 'number' && isFinite(value) ? value / 100000 : undefined;
  }

  function pictureNumber(tag, name) {
    var raw = xmlAttribute(tag || '', name);
    var value = raw === undefined ? undefined : Number(raw);
    return typeof value === 'number' && isFinite(value) ? value : undefined;
  }

  function parsePictureRectangle(container, localName) {
    var tag = startTags(container || '', localName)[0];
    if (!tag) { return undefined; }
    return {
      left: pictureFraction(tag, 'l'), top: pictureFraction(tag, 't'),
      right: pictureFraction(tag, 'r'), bottom: pictureFraction(tag, 'b')
    };
  }

  function pictureEffectColor(element) {
    var value = parseColor(element);
    if (!value) { return undefined; }
    return {
      kind: value.kind,
      value: value.val,
      lastColor: value.lastClr,
      red: value.r,
      green: value.g,
      blue: value.b,
      hue: value.hue,
      saturation: value.sat,
      luminance: value.lum,
      transforms: parseColorTransforms(element)
    };
  }

  function parsePictureEffects(blip) {
    var children = directChildElements(blip || '');
    var effects = [];
    var names = {
      alphaBiLevel: 'alphaBiLevel', alphaCeiling: 'alphaCeiling', alphaFloor: 'alphaFloor',
      alphaInv: 'alphaInverse', alphaMod: 'alphaMod', alphaModFix: 'alphaModFix',
      alphaOff: 'alphaOffset', biLevel: 'biLevel', clrChange: 'colorChange',
      clrRepl: 'colorReplace', duotone: 'duotone', grayscl: 'grayscale', lum: 'luminance'
    };
    for (var i = 0; i < children.length; i++) {
      var authoredKind = elementLocalName(children[i]);
      if (!authoredKind || authoredKind === 'extLst') { continue; }
      var root = startTags(children[i], authoredKind)[0] || '';
      var amount = pictureFraction(root, 'amt');
      var threshold = pictureFraction(root, 'thresh');
      var brightness = pictureFraction(root, 'bright');
      var contrast = pictureFraction(root, 'contrast');
      var colors = [];
      var colorChildren = directChildElements(children[i]);
      for (var colorIndex = 0; colorIndex < colorChildren.length; colorIndex++) {
        var color = pictureEffectColor(colorChildren[colorIndex]);
        if (color) { colors.push(color); }
      }
      effects.push({
        kind: names[authoredKind] || 'unknown',
        authoredKind: authoredKind,
        amount: amount,
        threshold: threshold,
        brightness: brightness,
        contrast: contrast,
        colors: colors
      });
    }
    return effects;
  }

  function pictureRelationshipIds(picture) {
    var blipFill = elementXml(picture || '', 'blipFill') || '';
    return pictureFillRelationshipIds(blipFill);
  }

  function pictureFillRelationshipIds(blipFill) {
    var blip = elementXml(blipFill, 'blip') || startTags(blipFill, 'blip')[0] || '';
    var blipTag = startTags(blip, 'blip')[0] || blip;
    return {
      embedRelationshipId: xmlAttribute(blipTag, 'embed'),
      linkRelationshipId: xmlAttribute(blipTag, 'link')
    };
  }

  function pictureEnum(value, allowed) {
    return value !== undefined && allowed.indexOf(value) >= 0 ? value : undefined;
  }

  // Ports RendererBase.DrawImage and GDIRenderer.GetTextureBrush input extraction.
  function parseDirectPicture(picture, fallbackPicture) {
    var blipFill = elementXml(picture || '', 'blipFill') || '';
    var direct = parseDirectPictureFill(blipFill);
    direct.alternateContentFallback = fallbackPicture ? pictureRelationshipIds(fallbackPicture) : undefined;
    return direct;
  }

  // Ports RendererBase.DrawImage input extraction for a shape-level a:blipFill.
  function parseDirectPictureFill(blipFill) {
    var blip = elementXml(blipFill, 'blip') || startTags(blipFill, 'blip')[0] || '';
    var blipTag = startTags(blip, 'blip')[0] || blip;
    var svgBlip = startTags(blip, 'svgBlip')[0] || '';
    var stretch = elementXml(blipFill, 'stretch');
    var tile = startTags(blipFill, 'tile')[0];
    var direct = pictureFillRelationshipIds(blipFill);
    direct.svgRelationshipId = svgBlip ? xmlAttribute(svgBlip, 'embed') : undefined;
    direct.sourceRectangle = parsePictureRectangle(blipFill, 'srcRect');
    direct.stretch = stretch ? { fillRectangle: parsePictureRectangle(stretch, 'fillRect') } : undefined;
    direct.tile = tile ? {
      offsetXEmu: pictureNumber(tile, 'tx'), offsetYEmu: pictureNumber(tile, 'ty'),
      scaleX: pictureFraction(tile, 'sx'), scaleY: pictureFraction(tile, 'sy'),
      flip: pictureEnum(xmlAttribute(tile, 'flip'), ['none', 'x', 'y', 'xy']),
      alignment: pictureEnum(xmlAttribute(tile, 'algn'), ['tl', 't', 'tr', 'l', 'ctr', 'r', 'bl', 'b', 'br'])
    } : undefined;
    direct.effects = parsePictureEffects(blip);
    return direct;
  }

  function parseShapeTransform(spPr) {
    var tags = startTags(spPr || '', 'xfrm');
    if (!tags.length) { return undefined; }
    var xfrm = elementXml(spPr, 'xfrm') || tags[0];
    var off = startTags(xfrm, 'off')[0] || '';
    var ext = startTags(xfrm, 'ext')[0] || '';
    function number(name, tag) {
      var raw = xmlAttribute(tag, name);
      var value = raw === undefined ? undefined : Number(raw);
      return typeof value === 'number' && isFinite(value) ? value : undefined;
    }
    var rotation = number('rot', tags[0]);
    return {
      x: number('x', off), y: number('y', off), cx: number('cx', ext), cy: number('cy', ext),
      rotationDegrees: rotation === undefined ? undefined : rotation / 60000,
      flipHorizontal: optionalBoolean(xmlAttribute(tags[0], 'flipH')),
      flipVertical: optionalBoolean(xmlAttribute(tags[0], 'flipV'))
    };
  }

  function parseShapeGeometry(spPr) {
    var custom = elementXml(spPr || '', 'custGeom');
    if (custom) {
      return {
        kind: 'custom',
        adjustments: parseGeometryGuides(elementXml(custom, 'avLst')),
        guides: parseGeometryGuides(elementXml(custom, 'gdLst')),
        connectionSites: parseCustomConnectionSites(elementXml(custom, 'cxnLst')),
        paths: parseCustomPaths(elementXml(custom, 'pathLst'))
      };
    }
    var preset = elementXml(spPr || '', 'prstGeom');
    if (!preset) { return { kind: 'none' }; }
    var tags = startTags(preset, 'prstGeom');
    var token = tags.length ? xmlAttribute(tags[0], 'prst') : undefined;
    if (!token) { return { kind: 'none' }; }
    var adjustments = [];
    var list = elementXml(preset, 'avLst');
    var guides = list ? startTags(list, 'gd') : [];
    for (var i = 0; i < guides.length; i++) {
      var name = xmlAttribute(guides[i], 'name');
      var formula = xmlAttribute(guides[i], 'fmla');
      if (name !== undefined && formula !== undefined) { adjustments.push({ name: name, formula: formula }); }
    }
    return { kind: 'preset', preset: token, adjustments: adjustments };
  }

  function parseGeometryGuides(list) {
    var result = [];
    var guides = list ? directChildElements(list) : [];
    for (var i = 0; i < guides.length; i++) {
      if (elementLocalName(guides[i]) !== 'gd') { continue; }
      var tag = startTags(guides[i], 'gd')[0] || '';
      var name = xmlAttribute(tag, 'name');
      var formula = xmlAttribute(tag, 'fmla');
      if (name !== undefined && formula !== undefined) { result.push({ name: name, formula: formula }); }
    }
    return result;
  }

  function parseCustomPoint(container, localName) {
    var tags = startTags(container || '', localName || 'pt');
    if (!tags.length) { return undefined; }
    var x = xmlAttribute(tags[0], 'x');
    var y = xmlAttribute(tags[0], 'y');
    return x === undefined || y === undefined ? undefined : { x: x, y: y };
  }

  function parseCustomConnectionSites(list) {
    var result = [];
    var sites = list ? directChildElements(list) : [];
    for (var i = 0; i < sites.length; i++) {
      if (elementLocalName(sites[i]) !== 'cxn') { continue; }
      var tag = startTags(sites[i], 'cxn')[0] || '';
      var angle = xmlAttribute(tag, 'ang');
      var point = parseCustomPoint(sites[i], 'pos');
      if (angle !== undefined && point) { result.push({ angle: angle, point: point }); }
    }
    return result;
  }

  function parseCustomPaths(list) {
    var result = [];
    var paths = list ? directChildElements(list) : [];
    for (var i = 0; i < paths.length; i++) {
      if (elementLocalName(paths[i]) !== 'path') { continue; }
      var tag = startTags(paths[i], 'path')[0] || '';
      var commands = [];
      var children = directChildElements(paths[i]);
      for (var j = 0; j < children.length; j++) {
        var kind = elementLocalName(children[j]);
        if (kind === 'close') { commands.push({ kind: 'close' }); continue; }
        if (kind === 'arcTo') {
          var arc = startTags(children[j], 'arcTo')[0] || '';
          var wr = xmlAttribute(arc, 'wR'); var hr = xmlAttribute(arc, 'hR');
          var sa = xmlAttribute(arc, 'stAng'); var sw = xmlAttribute(arc, 'swAng');
          if (wr !== undefined && hr !== undefined && sa !== undefined && sw !== undefined) {
            commands.push({ kind: 'arc', widthRadius: wr, heightRadius: hr, startAngle: sa, sweepAngle: sw });
          }
          continue;
        }
        var pointElements = directChildElements(children[j]);
        var points = [];
        for (var k = 0; k < pointElements.length; k++) {
          if (elementLocalName(pointElements[k]) !== 'pt') { continue; }
          var point = parseCustomPoint(pointElements[k], 'pt');
          if (point) { points.push(point); }
        }
        if (kind === 'moveTo' && points[0]) { commands.push({ kind: 'move', point: points[0] }); }
        else if (kind === 'lnTo' && points[0]) { commands.push({ kind: 'line', point: points[0] }); }
        else if (kind === 'quadBezTo' && points.length >= 2) { commands.push({ kind: 'quadratic', points: points }); }
        else if (kind === 'cubicBezTo' && points.length >= 3) { commands.push({ kind: 'cubic', points: points }); }
      }
      result.push({
        width: xmlAttribute(tag, 'w'), height: xmlAttribute(tag, 'h'), fill: xmlAttribute(tag, 'fill'),
        stroke: optionalBoolean(xmlAttribute(tag, 'stroke')), commands: commands
      });
    }
    return result;
  }

  function parseLineEnd(line, name) {
    var tags = startTags(line, name);
    if (!tags.length) { return undefined; }
    return {
      type: xmlAttribute(tags[0], 'type'),
      width: xmlAttribute(tags[0], 'w'),
      length: xmlAttribute(tags[0], 'len')
    };
  }

  function parseShapeLine(spPr) {
    var children = directChildElements(spPr || '');
    var line;
    for (var i = 0; i < children.length; i++) {
      if (elementLocalName(children[i]) === 'ln') { line = children[i]; break; }
    }
    if (!line) { return { present: false, fill: { kind: 'missing' } }; }
    return parseLineElement(line);
  }

  function parseLineElement(line, localName) {
    var tag = startTags(line, localName || 'ln')[0] || '';
    var dash = startTags(line, 'prstDash')[0] || '';
    var join;
    if (startTags(line, 'round').length) { join = { kind: 'round' }; }
    else if (startTags(line, 'bevel').length) { join = { kind: 'bevel' }; }
    else if (startTags(line, 'miter').length) {
      var limit = Number(xmlAttribute(startTags(line, 'miter')[0], 'lim'));
      join = { kind: 'miter', limit: isFinite(limit) ? limit / 100000 : undefined };
    }
    var width = Number(xmlAttribute(tag, 'w'));
    return {
      present: true,
      widthEmu: isFinite(width) ? width : undefined,
      cap: xmlAttribute(tag, 'cap'),
      compound: xmlAttribute(tag, 'cmpd'),
      align: xmlAttribute(tag, 'algn'),
      presetDash: dash ? xmlAttribute(dash, 'val') : undefined,
      join: join,
      headEnd: parseLineEnd(line, 'headEnd'),
      tailEnd: parseLineEnd(line, 'tailEnd'),
      fill: parseShapeFill(line)
    };
  }

  function parseShapeStyleRefs(shape) {
    var style = elementXml(shape || '', 'style');
    if (!style) { return undefined; }
    function reference(name) {
      var value = elementXml(style, name);
      var tags = value ? startTags(value, name) : [];
      if (!tags.length) { return undefined; }
      var colorTransforms = parseColorTransforms(value);
      var reference = { idx: xmlAttribute(tags[0], 'idx'), color: parseColor(value) };
      if (colorTransforms.length) { reference.colorTransforms = colorTransforms; }
      return reference;
    }
    return {
      lnRef: reference('lnRef'), fillRef: reference('fillRef'),
      effectRef: reference('effectRef'), fontRef: reference('fontRef')
    };
  }

  function parseShapeEffects(spPr) {
    var effectList = elementXml(spPr || '', 'effectLst');
    var shadow = effectList ? elementXml(effectList, 'outerShdw') || startTags(effectList, 'outerShdw')[0] : undefined;
    if (!shadow) { return []; }
    var shadowTag = startTags(shadow, 'outerShdw')[0] || shadow;
    function number(name, divisor) {
      var raw = xmlAttribute(shadowTag, name);
      var value = raw === undefined ? undefined : Number(raw);
      return typeof value === 'number' && isFinite(value) ? value / (divisor || 1) : undefined;
    }
    return [{
      kind: 'outerShadow',
      blurRadiusEmu: number('blurRad'), distanceEmu: number('dist'),
      directionDegrees: number('dir', 60000), alignment: xmlAttribute(shadowTag, 'algn'),
      rotateWithShape: optionalBoolean(xmlAttribute(shadowTag, 'rotWithShape')),
      scaleX: number('sx', 100000), scaleY: number('sy', 100000),
      skewXDegrees: number('kx', 60000), skewYDegrees: number('ky', 60000),
      color: parseColor(shadow), colorTransforms: parseColorTransforms(shadow)
    }];
  }

  function parseConnectorEnds(shape) {
    function connection(name) {
      var tags = startTags(shape || '', name);
      if (!tags.length) { return undefined; }
      var id = xmlAttribute(tags[0], 'id'); var index = Number(xmlAttribute(tags[0], 'idx'));
      return id === undefined || !isFinite(index) ? undefined : { drawingElementId: id, siteIndex: index };
    }
    var start = connection('stCxn'); var end = connection('endCxn');
    return { start: start, end: end };
  }

  function parseGroupChildSpace(spPr) {
    var xfrm = elementXml(spPr || '', 'xfrm');
    if (!xfrm) { return undefined; }
    function point(name, xName, yName) {
      var tags = startTags(xfrm, name); if (!tags.length) { return undefined; }
      var x = Number(xmlAttribute(tags[0], xName)); var y = Number(xmlAttribute(tags[0], yName));
      return isFinite(x) && isFinite(y) ? { x: x, y: y } : undefined;
    }
    var offset = point('chOff', 'x', 'y');
    var extent = point('chExt', 'cx', 'cy');
    return offset || extent ? {
      chOff: offset,
      chExt: extent ? { width: extent.x, height: extent.y } : undefined
    } : undefined;
  }

  function decodeXmlText(value) {
    return String(value || '').replace(/&#x([0-9a-f]+);|&#([0-9]+);|&(amp|lt|gt|quot|apos);/gi,
      function (_, hex, decimal, named) {
        if (hex) { return String.fromCodePoint(parseInt(hex, 16)); }
        if (decimal) { return String.fromCodePoint(parseInt(decimal, 10)); }
        return { amp: '&', lt: '<', gt: '>', quot: String.fromCharCode(34), apos: String.fromCharCode(39) }[named] || '';
      });
  }

  function parseTextSpacing(pPr, name) {
    var spacing = elementXml(pPr || '', name);
    if (!spacing) { return undefined; }
    var points = startTags(spacing, 'spcPts')[0];
    var percent = startTags(spacing, 'spcPct')[0];
    var raw = points ? xmlAttribute(points, 'val') : (percent ? xmlAttribute(percent, 'val') : undefined);
    var value = Number(raw);
    if (!isFinite(value)) { return undefined; }
    return points ? { type: 'points', value: value / 100 } : { type: 'percent', value: value / 1000 };
  }

  function parseTextTabs(pPr) {
    var tabList = elementXml(pPr || '', 'tabLst');
    if (!tabList) { return undefined; }
    var tabs = [];
    var tabTags = startTags(tabList, 'tab');
    for (var i = 0; i < tabTags.length; i++) {
      var position = Number(xmlAttribute(tabTags[i], 'pos'));
      if (isFinite(position)) {
        tabs.push({ positionPt: position / 12700, alignment: xmlAttribute(tabTags[i], 'algn') });
      }
    }
    return tabs;
  }

  function parseTextBullet(pPr, relationships) {
    function appearance() {
      var fontTag = startTags(pPr || '', 'buFont')[0];
      var percentTag = startTags(pPr || '', 'buSzPct')[0];
      var pointsTag = startTags(pPr || '', 'buSzPts')[0];
      var colorContainer = elementXml(pPr || '', 'buClr');
      var font = startTags(pPr || '', 'buFontTx').length ? { kind: 'followText' } :
        (fontTag ? { kind: 'explicit', family: xmlAttribute(fontTag, 'typeface') || '' } : undefined);
      var size = startTags(pPr || '', 'buSzTx').length ? { kind: 'followText' } :
        (percentTag ? { kind: 'percent', value: Number(xmlAttribute(percentTag, 'val')) / 1000 } :
          (pointsTag ? { kind: 'points', value: Number(xmlAttribute(pointsTag, 'val')) / 100 } : undefined));
      var colorValue = colorContainer ? parseColor(colorContainer) : undefined;
      var color = startTags(pPr || '', 'buClrTx').length ? { kind: 'followText' } :
        (colorValue ? { kind: 'explicit', color: {
          value: colorValue, transforms: parseColorTransforms(colorContainer)
        } } : undefined);
      return { font: font, size: size, color: color };
    }
    if (startTags(pPr || '', 'buNone').length) { return { kind: 'none' }; }
    var style = appearance();
    var character = startTags(pPr || '', 'buChar')[0];
    if (character) {
      return { kind: 'character', character: xmlAttribute(character, 'char') || '',
        font: style.font, size: style.size, color: style.color };
    }
    var numbered = startTags(pPr || '', 'buAutoNum')[0];
    if (numbered) {
      var startAt = Number(xmlAttribute(numbered, 'startAt'));
      return { kind: 'numbered', scheme: xmlAttribute(numbered, 'type') || 'arabicPeriod',
        startAt: isFinite(startAt) ? startAt : undefined,
        font: style.font, size: style.size, color: style.color };
    }
    var picture = elementXml(pPr || '', 'buBlip');
    if (picture) {
      var blip = startTags(picture, 'blip')[0] || '';
      var relationshipId = xmlAttribute(blip, 'embed') || xmlAttribute(blip, 'link');
      var relationship = relationshipId && relationships ? relationships[relationshipId] : undefined;
      return { kind: 'picture', relationshipId: relationshipId,
        target: relationship ? relationship.target : undefined,
        font: style.font, size: style.size, color: style.color };
    }
    return undefined;
  }

  function parseTextParagraphStyle(pPr, relationships) {
    var rootEnd = (pPr || '').indexOf('>');
    var pTag = rootEnd >= 0 ? pPr.slice(0, rootEnd + 1) : '';
    var defaultRun = elementXml(pPr || '', 'defRPr') || startTags(pPr || '', 'defRPr')[0] || '';
    var defaultRunTag = startTags(defaultRun, 'defRPr')[0] || '';
    var defaultLatin = startTags(defaultRun, 'latin')[0] || '';
    var defaultEastAsian = startTags(defaultRun, 'ea')[0] || '';
    var defaultComplexScript = startTags(defaultRun, 'cs')[0] || '';
    // A run colour is a direct colour child of defRPr. Descendant colours in
    // effectLst (for example outerShdw C0C0C0) paint the effect and must not
    // terminate text-colour inheritance.
    var defaultColorContainer = directChildElements(defaultRun).filter(function (child) {
      var name = elementLocalName(child);
      return name === 'solidFill';
    })[0] || '';
    var defaultColorValue = parseColor(defaultColorContainer);
    function point(name) {
      var raw = xmlAttribute(pTag, name); var value = Number(raw);
      return raw !== undefined && isFinite(value) ? value / 12700 : undefined;
    }
    return {
      alignment: xmlAttribute(pTag, 'algn'),
      leftMarginPt: point('marL'),
      indentPt: point('indent'),
      lineSpacing: parseTextSpacing(pPr, 'lnSpc'),
      spaceBefore: parseTextSpacing(pPr, 'spcBef'),
      spaceAfter: parseTextSpacing(pPr, 'spcAft'),
      tabs: parseTextTabs(pPr),
      fontFamily: defaultLatin ? xmlAttribute(defaultLatin, 'typeface') : undefined,
      eastAsianFontFamily: defaultEastAsian ? xmlAttribute(defaultEastAsian, 'typeface') : undefined,
      complexScriptFontFamily: defaultComplexScript ? xmlAttribute(defaultComplexScript, 'typeface') : undefined,
      fontSizePt: Number(xmlAttribute(defaultRunTag, 'sz')) / 100 || undefined,
      bold: optionalBoolean(xmlAttribute(defaultRunTag, 'b')),
      italic: optionalBoolean(xmlAttribute(defaultRunTag, 'i')),
      caps: xmlAttribute(defaultRunTag, 'cap'),
      color: defaultColorValue ? {
        value: defaultColorValue, transforms: parseColorTransforms(defaultColorContainer)
      } : undefined,
      bullet: parseTextBullet(pPr, relationships),
      rightToLeft: optionalBoolean(xmlAttribute(pTag, 'rtl')),
      eastAsianLineBreak: optionalBoolean(xmlAttribute(pTag, 'eaLnBrk')),
      latinLineBreak: optionalBoolean(xmlAttribute(pTag, 'latinLnBrk')),
      hangingPunctuation: optionalBoolean(xmlAttribute(pTag, 'hangingPunct'))
    };
  }

  // Bind exact-namespace full-part character records to fresh legacy snapshots.
  // Raw MC/math records stay available without guessing a projected content index.
  function partTextFills(partName, requestId) {
    var parts = gradientRequests[requestId] || [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].partName === '/' + partName) { return parts[i].textFills; }
    }
    return undefined;
  }

  function mergeTextFillLevels(levels, fills) {
    var result = (levels || []).map(function (level) { return Object.assign({}, level); });
    (fills || []).forEach(function (fill) {
      var selected = result.filter(function (level) { return level.level === fill.level; })[0];
      if (selected) { selected.characterFills = fill.characterFills; }
      else { result.push({ level: fill.level, characterFills: fill.characterFills }); }
    });
    return result;
  }

  function bindShapeTextFills(shapes, partName, requestId) {
    var bindings = partTextFills(partName, requestId);
    if (!bindings) { return; }
    var byId = Object.create(null);
    bindings.shapes.forEach(function (binding) {
      if (Object.prototype.hasOwnProperty.call(byId, binding.id)) { byId[binding.id] = null; }
      else { byId[binding.id] = binding; }
    });
    function visit(items) {
      (items || []).forEach(function (shape) {
        var binding = byId[shape.id];
        if (binding && shape.textBody) {
          shape.fontReferenceFills = binding.fontReferenceFills;
          shape.textBody.listStyle = mergeTextFillLevels(shape.textBody.listStyle, binding.list);
          if (binding.paragraphs.length !== shape.textBody.paragraphs.length) { return; }
          binding.paragraphs.forEach(function (paragraph, index) {
            var target = shape.textBody.paragraphs[index];
            if (!target) { return; }
            target.defaultCharacterFills = paragraph.characterFills;
            if (paragraph.end) {
              target.endParagraphProperties = Object.assign({}, target.endParagraphProperties,
                { characterFills: paragraph.end });
            }
            if (target.content && target.content.length === paragraph.content.length) {
              paragraph.content.forEach(function (fills, contentIndex) {
                if (fills) { target.content[contentIndex].characterFills = fills; }
              });
            }
          });
        }
        visit(shape.children);
      });
    }
    visit(shapes);
  }

  // Group flags come only from canonical complete-part owner bindings.
  function bindShapeGroupFills(shapes, partName, requestId) {
    var parts = gradientRequests[requestId] || [], bindings;
    for (var partIndex = 0; partIndex < parts.length; partIndex++) {
      if (parts[partIndex].partName === '/' + partName) { bindings = parts[partIndex].groupFills; break; }
    }
    if (!bindings || !bindings.length) { return; }
    var byId = Object.create(null), counts = Object.create(null);
    bindings.forEach(function (binding) { byId[binding.id] = binding; });
    function count(items) {
      (items || []).forEach(function (shape) { counts[shape.id] = (counts[shape.id] || 0) + 1; count(shape.children); });
    }
    count(shapes);
    function bind(items) {
      (items || []).forEach(function (shape) {
        if (counts[shape.id] === 1 && byId[shape.id]) {
          shape.fill = { kind: 'group' };
          shape.groupFillAncestors = byId[shape.id].ancestors;
        }
        bind(shape.children);
      });
    }
    bind(shapes);
  }

  // Bind only unique projected frame identities and matching physical cell layouts.
  function bindShapeTableFills(shapes, partName, requestId) {
    var parts = gradientRequests[requestId] || [], bindings;
    for (var partIndex = 0; partIndex < parts.length; partIndex++) {
      if (parts[partIndex].partName === '/' + partName) { bindings = parts[partIndex].tableFills; break; }
    }
    if (!bindings || !bindings.length) { return; }
    var byId = Object.create(null), counts = Object.create(null);
    bindings.forEach(function (binding) { byId[binding.id] = binding.data; });
    function count(items) {
      (items || []).forEach(function (shape) { counts[shape.id] = (counts[shape.id] || 0) + 1; count(shape.children); });
    }
    count(shapes);
    function bind(items) {
      (items || []).forEach(function (shape) {
        if (shape.table && counts[shape.id] === 1 && byId[shape.id]) {
          var fills = gradientTransport.bindTableFillData(shape.table, byId[shape.id],
            [], presentationInfo ? presentationInfo.tableGradientStyleIndex : undefined);
          if (fills) { shape.table.authoredFills = fills; }
        }
        bind(shape.children);
      });
    }
    bind(shapes);
  }

  function parseTextStyleLevels(listStyle, relationships) {
    var levels = [];
    for (var i = 0; i < 9; i++) {
      var name = 'lvl' + String(i + 1) + 'pPr';
      var levelXml = elementXml(listStyle || '', name) || startTags(listStyle || '', name)[0];
      if (!levelXml) { continue; }
      var parsed = parseTextParagraphStyle(levelXml, relationships);
      parsed.level = i;
      levels.push(parsed);
    }
    return levels;
  }

  function parseMasterTextStyles(masterXml) {
    var textStyles = elementXml(masterXml || '', 'txStyles') || '';
    return {
      titleStyle: parseTextStyleLevels(elementXml(textStyles, 'titleStyle') || ''),
      bodyStyle: parseTextStyleLevels(elementXml(textStyles, 'bodyStyle') || ''),
      otherStyle: parseTextStyleLevels(elementXml(textStyles, 'otherStyle') || '')
    };
  }

  function numericAttribute(tag, name, divisor) {
    var raw = xmlAttribute(tag || '', name);
    var value = Number(raw);
    return raw !== undefined && isFinite(value) ? value / divisor : undefined;
  }

  function parseTextColor(properties, name) {
    var container = elementXml(properties || '', name);
    if (!container) { return undefined; }
    var value = parseColor(container);
    return value ? { value: value, transforms: parseColorTransforms(container) } : undefined;
  }

  function parseTextHyperlink(properties, relationships) {
    var tags = startTags(properties || '', 'hlinkClick');
    if (!tags.length) { return undefined; }
    var relationshipId = xmlAttribute(tags[0], 'id');
    var relationship = relationshipId && relationships ? relationships[relationshipId] : undefined;
    return {
      relationshipId: relationshipId,
      target: relationship ? relationship.target : undefined,
      tooltip: xmlAttribute(tags[0], 'tooltip'),
      action: xmlAttribute(tags[0], 'action')
    };
  }

  function parseTextCharacter(properties, relationships, propertyName) {
    var rPr = startTags(properties || '', propertyName || 'rPr')[0] || '';
    var latin = startTags(properties || '', 'latin')[0] || '';
    var eastAsian = startTags(properties || '', 'ea')[0] || '';
    var complexScript = startTags(properties || '', 'cs')[0] || '';
    var symbol = startTags(properties || '', 'sym')[0] || '';
    return {
      fontFamily: latin ? xmlAttribute(latin, 'typeface') : undefined,
      eastAsianFontFamily: eastAsian ? xmlAttribute(eastAsian, 'typeface') : undefined,
      complexScriptFontFamily: complexScript ? xmlAttribute(complexScript, 'typeface') : undefined,
      symbolFontFamily: symbol ? xmlAttribute(symbol, 'typeface') : undefined,
      fontSizePt: numericAttribute(rPr, 'sz', 100),
      bold: optionalBoolean(xmlAttribute(rPr, 'b')),
      italic: optionalBoolean(xmlAttribute(rPr, 'i')),
      underline: xmlAttribute(rPr, 'u'),
      strike: xmlAttribute(rPr, 'strike'),
      caps: xmlAttribute(rPr, 'cap'),
      baselinePercent: numericAttribute(rPr, 'baseline', 1000),
      characterSpacingPt: numericAttribute(rPr, 'spc', 100),
      language: xmlAttribute(rPr, 'lang'),
      color: parseTextColor(properties, 'solidFill'),
      highlight: parseTextColor(properties, 'highlight'),
      hyperlink: parseTextHyperlink(properties, relationships)
    };
  }

  var understoodMarkupCompatibilityPrefixes = {
    a: true, a14: true, a16: true, mc: true, m: true, p: true, p14: true, p15: true
  };

  function selectAlternateContentBranch(alternateContent) {
    var alternateChildren = directChildElements(alternateContent || '');
    var fallbackBranch = '';
    for (var alternateIndex = 0; alternateIndex < alternateChildren.length; alternateIndex++) {
      var alternateKind = elementLocalName(alternateChildren[alternateIndex]);
      if (alternateKind === 'Fallback') {
        fallbackBranch = alternateChildren[alternateIndex];
        continue;
      }
      if (alternateKind !== 'Choice') { continue; }
      var choiceTag = startTags(alternateChildren[alternateIndex], 'Choice')[0] || '';
      var requires = (xmlAttribute(choiceTag, 'Requires') || '').split(/ +/).filter(Boolean);
      var understood = requires.every(function (prefix) {
        return understoodMarkupCompatibilityPrefixes[prefix] === true;
      });
      if (understood) { return alternateChildren[alternateIndex]; }
    }
    return fallbackBranch;
  }

  function parseTextContent(paragraph, relationships) {
    var children = directChildElements(paragraph || '');
    var content = [];
    for (var i = 0; i < children.length; i++) {
      var kind = elementLocalName(children[i]);
      if (kind === 'AlternateContent') {
        var selectedTextBranch = selectAlternateContentBranch(children[i]);
        if (selectedTextBranch) { content = content.concat(parseTextContent(selectedTextBranch, relationships)); }
        continue;
      }
      if (kind === 'm') {
        content = content.concat(parseLinearMathContent(children[i], relationships));
        continue;
      }
      if (kind !== 'r' && kind !== 'br' && kind !== 'fld') { continue; }
      var rootTag = startTags(children[i], kind)[0] || '';
      var textXml = elementXml(children[i], 't') || '';
      var textStart = textXml.indexOf('>');
      var textEnd = textXml.lastIndexOf('<');
      var direct = parseTextCharacter(children[i], relationships);
      content.push(Object.assign({
        kind: kind === 'br' ? 'break' : kind === 'fld' ? 'field' : 'run',
        text: kind === 'br' ? '' : decodeXmlText(textStart >= 0 && textEnd > textStart ?
          textXml.slice(textStart + 1, textEnd) : ''),
        fieldId: kind === 'fld' ? xmlAttribute(rootTag, 'id') : undefined,
        fieldType: kind === 'fld' ? xmlAttribute(rootTag, 'type') : undefined
      }, direct));
    }
    return content;
  }

  function mathText(container) {
    var values = elementsXml(container || '', 't');
    return values.map(function (value) {
      var start = value.indexOf('>'); var end = value.lastIndexOf('<');
      return decodeXmlText(start >= 0 && end > start ? value.slice(start + 1, end) : '');
    }).join('');
  }

  // Linear, readable AT3 subset of DrawingML math. Complex layout remains
  // package-preserved and is reported by the viewer as a known limitation.
  function parseLinearMathContent(math, relationships) {
    var output = [];
    var roots = directChildElements(math || '');
    if (!roots.length) { roots = [math]; }
    function append(text, baseline, properties) {
      if (!text) { return; }
      var direct = parseTextCharacter(properties || '', relationships);
      direct.fontFamily = direct.fontFamily || 'Cambria Math';
      if (baseline !== undefined) { direct.baselinePercent = baseline; }
      output.push(Object.assign({ kind: 'run', text: text }, direct));
    }
    function visit(node) {
      var name = elementLocalName(node);
      if (name === 'f') {
        append(mathText(elementXml(node, 'num') || '') + '/' + mathText(elementXml(node, 'den') || ''), undefined, node);
        return;
      }
      if (name === 'sSup' || name === 'sSub') {
        append(mathText(elementXml(node, 'e') || ''), undefined, elementXml(node, 'e') || node);
        append(mathText(elementXml(node, name === 'sSup' ? 'sup' : 'sub') || ''), name === 'sSup' ? 30 : -25,
          elementXml(node, name === 'sSup' ? 'sup' : 'sub') || node);
        return;
      }
      if (name === 'r') { append(mathText(node), undefined, node); return; }
      var children = directChildElements(node || '');
      if (!children.length) { append(mathText(node)); return; }
      for (var childIndex = 0; childIndex < children.length; childIndex++) { visit(children[childIndex]); }
    }
    for (var index = 0; index < roots.length; index++) { visit(roots[index]); }
    if (!output.length) { append(mathText(math)); }
    return output;
  }

  function parseTextBody(shape, relationships) {
    var textBody = elementXml(shape || '', 'txBody');
    if (!textBody) { return undefined; }
    var bodyPr = elementXml(textBody, 'bodyPr') || '';
    var bodyTag = startTags(bodyPr, 'bodyPr')[0] || '';
    function pointAttribute(tag, name) {
      var raw = xmlAttribute(tag, name); var value = Number(raw);
      return raw !== undefined && isFinite(value) ? value / 12700 : undefined;
    }
    var autoFit;
    var normal = startTags(bodyPr, 'normAutofit')[0];
    if (startTags(bodyPr, 'noAutofit').length) { autoFit = { type: 'none' }; }
    else if (startTags(bodyPr, 'spAutoFit').length) { autoFit = { type: 'shape' }; }
    else if (normal) {
      var scale = Number(xmlAttribute(normal, 'fontScale'));
      var reduction = Number(xmlAttribute(normal, 'lnSpcReduction'));
      autoFit = {
        type: 'normal',
        fontScale: isFinite(scale) ? scale / 1000 : undefined,
        lineSpacingReduction: isFinite(reduction) ? reduction / 1000 : undefined
      };
    }
    var paragraphXml = elementsXml(textBody, 'p');
    var paragraphs = [];
    for (var i = 0; i < paragraphXml.length; i++) {
      var pPr = elementXml(paragraphXml[i], 'pPr') || '';
      var pTag = startTags(pPr, 'pPr')[0] || '';
      var directStyle = parseTextParagraphStyle(pPr, relationships);
      var content = parseTextContent(paragraphXml[i], relationships);
      var endParagraphXml = elementXml(paragraphXml[i], 'endParaRPr');
      var endParagraphProperties = endParagraphXml ?
        parseTextCharacter(endParagraphXml, relationships, 'endParaRPr') : undefined;
      var level = Number(xmlAttribute(pTag, 'lvl'));
      paragraphs.push({
        level: isFinite(level) ? level : undefined,
        alignment: directStyle.alignment,
        leftMarginPt: directStyle.leftMarginPt,
        indentPt: directStyle.indentPt,
        lineSpacing: directStyle.lineSpacing,
        spaceBefore: directStyle.spaceBefore,
        spaceAfter: directStyle.spaceAfter,
        defaultFontFamily: directStyle.fontFamily,
        defaultFontSizePt: directStyle.fontSizePt,
        defaultBold: directStyle.bold,
        defaultItalic: directStyle.italic,
        defaultCaps: directStyle.caps,
        defaultColor: directStyle.color,
        bullet: directStyle.bullet,
        rightToLeft: directStyle.rightToLeft,
        eastAsianLineBreak: directStyle.eastAsianLineBreak,
        latinLineBreak: directStyle.latinLineBreak,
        hangingPunctuation: directStyle.hangingPunctuation,
        tabs: directStyle.tabs,
        runs: content.filter(function (item) { return item.kind === 'run'; }),
        content: content,
        endParagraphProperties: endParagraphProperties
      });
    }
    var columnCount = Number(xmlAttribute(bodyTag, 'numCol'));
    var presetTextWarpTag = startTags(bodyPr, 'prstTxWarp')[0] || '';
    return {
      properties: {
        presetTextWarp: xmlAttribute(presetTextWarpTag, 'prst'),
        leftInsetPt: pointAttribute(bodyTag, 'lIns'), topInsetPt: pointAttribute(bodyTag, 'tIns'),
        rightInsetPt: pointAttribute(bodyTag, 'rIns'), bottomInsetPt: pointAttribute(bodyTag, 'bIns'),
        anchor: xmlAttribute(bodyTag, 'anchor'), wrap: xmlAttribute(bodyTag, 'wrap'),
        columnCount: isFinite(columnCount) ? columnCount : undefined,
        columnSpacingPt: pointAttribute(bodyTag, 'spcCol'), verticalType: xmlAttribute(bodyTag, 'vert'),
        autoFit: autoFit
      },
      listStyle: parseTextStyleLevels(elementXml(textBody, 'lstStyle') || '', relationships),
      paragraphs: paragraphs
    };
  }

  function parsePlaceholder(shape) {
    var tags = startTags(shape || '', 'ph');
    if (!tags.length) { return undefined; }
    return { type: xmlAttribute(tags[0], 'type'), index: xmlAttribute(tags[0], 'idx') };
  }

  function parseFallbackFrame(shape, contentKind, nonVisual) {
    if (contentKind !== 'chart' && contentKind !== 'diagram' && contentKind !== 'ole' &&
        contentKind !== 'media' && contentKind !== 'unknown') { return undefined; }
    var relationshipTag = startTags(shape || '', contentKind === 'chart' ? 'chart' :
      contentKind === 'ole' ? 'oleObj' : contentKind === 'media' ? 'contentPart' : 'relIds')[0] || '';
    var previewXml = elementXml(shape || '', 'pic');
    return {
      kind: contentKind,
      description: xmlAttribute(nonVisual || '', 'descr'),
      title: xmlAttribute(nonVisual || '', 'title'),
      direct: { contentRelationshipId: xmlAttribute(relationshipTag, 'id') },
      resolved: {},
      preview: previewXml ? {
        description: xmlAttribute(startTags(previewXml, 'cNvPr')[0] || '', 'descr'),
        title: xmlAttribute(startTags(previewXml, 'cNvPr')[0] || '', 'title'),
        direct: parseDirectPicture(previewXml), resolved: {}
      } : undefined
    };
  }

  function tableBoolean(tag, name) {
    var raw = xmlAttribute(tag || '', name);
    return optionalBoolean(raw === undefined ? undefined : raw.replace(/^[ \\t\\r\\n]+|[ \\t\\r\\n]+$/g, '')) === true;
  }

  function tableInteger(tag, name, fallback) {
    var value = Number(xmlAttribute(tag || '', name));
    return isFinite(value) ? value : fallback;
  }

  function emptyTableLine() {
    return { present: false, fill: { kind: 'missing' } };
  }

  function parseTableBorder(tcPr, name) {
    var line = elementXml(tcPr || '', name);
    return line ? parseLineElement(line, name) : emptyTableLine();
  }

  function parseTableBorders(tcPr) {
    return {
      left: parseTableBorder(tcPr, 'lnL'), right: parseTableBorder(tcPr, 'lnR'),
      top: parseTableBorder(tcPr, 'lnT'), bottom: parseTableBorder(tcPr, 'lnB'),
      insideDiagonalDown: parseTableBorder(tcPr, 'lnTlToBr'),
      insideDiagonalUp: parseTableBorder(tcPr, 'lnBlToTr')
    };
  }

  function tableStyleBuckets(row, column, rowCount, columnCount, direct) {
    return gradientTransport.tableFillBuckets(row, column, rowCount, columnCount, direct);
  }

  function tableBorderSources(borders) {
    function source(line) { return line.present ? 'cell' : 'none'; }
    return {
      left: source(borders.left), right: source(borders.right), top: source(borders.top),
      bottom: source(borders.bottom), insideDiagonalDown: source(borders.insideDiagonalDown),
      insideDiagonalUp: source(borders.insideDiagonalUp)
    };
  }

  function parseTableStyleBorder(tcStyle, name) {
    var border = elementXml(elementXml(tcStyle || '', 'tcBdr') || '', name);
    var line = border ? elementXml(border, 'ln') : '';
    return line ? parseLineElement(line, 'ln') : emptyTableLine();
  }

  function parseTableStyleBorders(tcStyle) {
    return {
      left: parseTableStyleBorder(tcStyle, 'left'), right: parseTableStyleBorder(tcStyle, 'right'),
      top: parseTableStyleBorder(tcStyle, 'top'), bottom: parseTableStyleBorder(tcStyle, 'bottom'),
      insideDiagonalDown: parseTableStyleBorder(tcStyle, 'tl2br'),
      insideDiagonalUp: parseTableStyleBorder(tcStyle, 'tr2bl')
    };
  }

  // Ports Table style-region lookup while keeping the package XML untouched.
  function parseTableStyleDefinitions(xml) {
    var definitions = Object.create(null);
    var root = elementXml(xml || '', 'tblStyleLst') || xml || '';
    var styles = directChildElements(root).filter(function (child) {
      return elementLocalName(child) === 'tblStyle';
    });
    var bucketNames = ['wholeTbl', 'band1H', 'band2H', 'band1V', 'band2V',
      'firstRow', 'lastRow', 'firstCol', 'lastCol', 'nwCell', 'neCell', 'swCell', 'seCell'];
    for (var styleIndex = 0; styleIndex < styles.length; styleIndex++) {
      var styleTag = startTags(styles[styleIndex], 'tblStyle')[0] || '';
      var styleId = xmlAttribute(styleTag, 'styleId');
      if (!styleId) { continue; }
      var buckets = Object.create(null);
      for (var bucketIndex = 0; bucketIndex < bucketNames.length; bucketIndex++) {
        var bucketName = bucketNames[bucketIndex];
        var bucket = elementXml(styles[styleIndex], bucketName) || '';
        var tcStyle = elementXml(bucket, 'tcStyle') || '';
        var tcTextStyle = elementXml(bucket, 'tcTxStyle') || '';
        if (!tcStyle && !tcTextStyle) { continue; }
        var fillContainer = elementXml(tcStyle, 'fill') || '';
        var textStyleTag = startTags(tcTextStyle, 'tcTxStyle')[0] || '';
        var fontRef = elementXml(tcTextStyle, 'fontRef') || '';
        var textColorElement = directChildElements(tcTextStyle).filter(function (child) {
          var name = elementLocalName(child);
          return name === 'srgbClr' || name === 'schemeClr' || name === 'sysClr' ||
            name === 'prstClr' || name === 'scrgbClr' || name === 'hslClr';
        })[0];
        buckets[bucketName] = {
          fill: fillContainer ? parseShapeFill(fillContainer) : { kind: 'missing' },
          borders: parseTableStyleBorders(tcStyle),
          textStyle: tcTextStyle ? {
            fontReference: fontRef ? xmlAttribute(startTags(fontRef, 'fontRef')[0] || '', 'idx') : undefined,
            color: textColorElement ? {
              value: parseColor(textColorElement), transforms: parseColorTransforms(textColorElement)
            } : undefined,
            bold: optionalBoolean(xmlAttribute(textStyleTag, 'b')),
            italic: optionalBoolean(xmlAttribute(textStyleTag, 'i'))
          } : undefined
        };
      }
      definitions[styleId] = buckets;
    }
    return definitions;
  }

  function resolveTableCellStyle(fill, borders, buckets, styleDefinitions) {
    var resolvedFill = { kind: 'missing' };
    var fillSource = 'none';
    var resolvedBorders = parseTableBorders('');
    var borderSources = tableBorderSources(resolvedBorders);
    var textStyle;
    var textStyleSource;
    var edgeNames = ['left', 'right', 'top', 'bottom', 'insideDiagonalDown', 'insideDiagonalUp'];
    for (var bucketIndex = 0; bucketIndex < buckets.length; bucketIndex++) {
      var bucketName = buckets[bucketIndex];
      var bucket = styleDefinitions && styleDefinitions[bucketName];
      if (!bucket) { continue; }
      if (fillSource === 'none' && bucket.fill && bucket.fill.kind !== 'missing') {
        resolvedFill = bucket.fill;
        fillSource = bucketName;
      }
      if (!textStyle && bucket.textStyle) {
        textStyle = bucket.textStyle;
        textStyleSource = bucketName;
      }
    }
    // Border selection is edge-specific in Cell.Default*Border. Preserve the
    // existing low-to-high style order here until that separate port lands.
    var borderBucketOrder = gradientTransport.tableBorderBucketOrder;
    for (var borderBucketIndex = 0; borderBucketIndex < borderBucketOrder.length; borderBucketIndex++) {
      var borderBucketName = borderBucketOrder[borderBucketIndex];
      if (buckets.indexOf(borderBucketName) === -1) { continue; }
      var borderBucket = styleDefinitions && styleDefinitions[borderBucketName];
      if (!borderBucket) { continue; }
      for (var edgeIndex = 0; edgeIndex < edgeNames.length; edgeIndex++) {
        var edgeName = edgeNames[edgeIndex];
        if (borderBucket.borders[edgeName].present) {
          resolvedBorders[edgeName] = borderBucket.borders[edgeName];
          borderSources[edgeName] = borderBucketName;
        }
      }
    }
    if (fill.kind !== 'missing') {
      resolvedFill = fill;
      fillSource = 'cell';
    }
    for (var directEdgeIndex = 0; directEdgeIndex < edgeNames.length; directEdgeIndex++) {
      var directEdge = edgeNames[directEdgeIndex];
      if (borders[directEdge].present) {
        resolvedBorders[directEdge] = borders[directEdge];
        borderSources[directEdge] = 'cell';
      }
    }
    return {
      fill: resolvedFill, fillSource: fillSource,
      borders: resolvedBorders, borderSources: borderSources,
      textStyle: textStyle, textStyleSource: textStyleSource
    };
  }

  // Ports Table.Layout and Cell.Layout snapshot inputs without mutating the package DOM.
  function parseTableSnapshot(graphicFrame, relationships, tableStyles, tableTextDefaults) {
    var table = elementXml(graphicFrame || '', 'tbl');
    if (!table) { return undefined; }
    var tableProperties = elementXml(table, 'tblPr') || '';
    var tablePropertiesTag = startTags(tableProperties, 'tblPr')[0] || '';
    var styleIdElement = elementXml(tableProperties, 'tableStyleId') || '';
    var styleIdMatch = />\\s*([^<]+?)\\s*</.exec(styleIdElement);
    var styleIdText = styleIdMatch ? decodeXmlText(styleIdMatch[1]) : '';
    var direct = {
      styleId: styleIdText || undefined,
      firstRow: tableBoolean(tablePropertiesTag, 'firstRow'),
      lastRow: tableBoolean(tablePropertiesTag, 'lastRow'),
      firstColumn: tableBoolean(tablePropertiesTag, 'firstCol'),
      lastColumn: tableBoolean(tablePropertiesTag, 'lastCol'),
      bandedRows: tableBoolean(tablePropertiesTag, 'bandRow'),
      bandedColumns: tableBoolean(tablePropertiesTag, 'bandCol')
    };
    var grid = elementXml(table, 'tblGrid') || '';
    var gridColumns = directChildElements(grid).filter(function (child) {
      return elementLocalName(child) === 'gridCol';
    });
    var columnWidths = gridColumns.map(function (column) {
      return tableInteger(startTags(column, 'gridCol')[0] || '', 'w', 0);
    });
    var rows = directChildElements(table).filter(function (child) { return elementLocalName(child) === 'tr'; });
    var rowHeights = rows.map(function (rowXml) {
      return tableInteger(startTags(rowXml, 'tr')[0] || '', 'h', 0);
    });
    var cells = [];
    var owners = [];
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var rowCells = directChildElements(rows[rowIndex]).filter(function (child) {
        return elementLocalName(child) === 'tc';
      });
      var columnIndex = 0;
      for (var cellIndex = 0; cellIndex < rowCells.length; cellIndex++) {
        var cell = rowCells[cellIndex];
        var cellTag = startTags(cell, 'tc')[0] || '';
        var columnSpan = Math.max(1, tableInteger(cellTag, 'gridSpan', 1));
        var rowSpan = Math.max(1, tableInteger(cellTag, 'rowSpan', 1));
        var horizontalMerge = tableBoolean(cellTag, 'hMerge');
        var verticalMerge = tableBoolean(cellTag, 'vMerge');
        var owner = { row: rowIndex, column: columnIndex, continuation: false };
        if (horizontalMerge && columnIndex > 0 && owners[rowIndex] && owners[rowIndex][columnIndex - 1]) {
          owner = owners[rowIndex][columnIndex - 1];
        } else if (verticalMerge && rowIndex > 0 && owners[rowIndex - 1] && owners[rowIndex - 1][columnIndex]) {
          owner = owners[rowIndex - 1][columnIndex];
        }
        for (var coveredRow = rowIndex; coveredRow < Math.min(rows.length, rowIndex + rowSpan); coveredRow++) {
          owners[coveredRow] = owners[coveredRow] || [];
          for (var coveredColumn = columnIndex; coveredColumn < columnIndex + columnSpan; coveredColumn++) {
            owners[coveredRow][coveredColumn] = {
              row: owner.row, column: owner.column,
              continuation: coveredRow !== rowIndex || coveredColumn !== columnIndex
            };
          }
        }
        var tcPr = elementXml(cell, 'tcPr') || '';
        var tcPrTag = startTags(tcPr, 'tcPr')[0] || '';
        var fill = parseShapeFill(tcPr);
        var borders = parseTableBorders(tcPr);
        var textBody = parseTextBody(cell, relationships);
        var buckets = tableStyleBuckets(rowIndex, columnIndex, rows.length, columnWidths.length, direct);
        var resolvedStyle = resolveTableCellStyle(
          fill, borders, buckets, tableStyles && direct.styleId ? tableStyles[direct.styleId] : undefined);
        cells.push({
          row: rowIndex, column: columnIndex, columnSpan: columnSpan, rowSpan: rowSpan,
          horizontalMerge: horizontalMerge, verticalMerge: verticalMerge,
          mergeOwnerRow: owner.row, mergeOwnerColumn: owner.column,
          direct: {
            marginLeftEmu: tableInteger(tcPrTag, 'marL', 91440),
            marginRightEmu: tableInteger(tcPrTag, 'marR', 91440),
            marginTopEmu: tableInteger(tcPrTag, 'marT', 45720),
            marginBottomEmu: tableInteger(tcPrTag, 'marB', 45720),
            verticalType: xmlAttribute(tcPrTag, 'vert') || 'horz',
            anchor: xmlAttribute(tcPrTag, 'anchor') || 't',
            anchorCenter: tableBoolean(tcPrTag, 'anchorCtr'),
            horizontalOverflow: xmlAttribute(tcPrTag, 'horzOverflow') || 'clip',
            fill: fill, borders: borders
          },
          resolved: {
            buckets: buckets,
            fill: resolvedStyle.fill, fillSource: resolvedStyle.fillSource,
            borders: resolvedStyle.borders, borderSources: resolvedStyle.borderSources,
            textStyle: resolvedStyle.textStyle, textStyleSource: resolvedStyle.textStyleSource,
            inheritedTextStyle: tableTextDefaults ? {
              fontFamily: tableTextDefaults.fontFamily,
              fontSizePt: tableTextDefaults.fontSizePt,
              color: tableTextDefaults.color,
              bold: tableTextDefaults.bold,
              italic: tableTextDefaults.italic
            } : undefined,
            inheritedTextStyleSource: tableTextDefaults ? tableTextDefaults.source : undefined
          },
          textBody: textBody
        });
        columnIndex++;
      }
    }
    return { direct: direct, columnWidthsEmu: columnWidths, rowHeightsEmu: rowHeights, cells: cells };
  }

  function parseShapeChildren(container, relationships, tableStyles, tableTextDefaults) {
    var sourceChildren = directChildElements(container || '');
    var children = [];
    var alternateFallbackPictures = [];
    for (var sourceIndex = 0; sourceIndex < sourceChildren.length; sourceIndex++) {
      var sourceChild = sourceChildren[sourceIndex];
      if (elementLocalName(sourceChild) !== 'AlternateContent') {
        children.push(sourceChild); alternateFallbackPictures.push(undefined); continue;
      }
      var selectedBranch = selectAlternateContentBranch(sourceChild);
      var fallbackBranch = elementXml(sourceChild, 'Fallback') || '';
      var selectedChildren = directChildElements(selectedBranch);
      var fallbackPicture = elementXml(fallbackBranch, 'pic');
      for (var selectedIndex = 0; selectedIndex < selectedChildren.length; selectedIndex++) {
        children.push(selectedChildren[selectedIndex]);
        alternateFallbackPictures.push(elementLocalName(selectedChildren[selectedIndex]) === 'pic'
          ? fallbackPicture : undefined);
      }
    }
    var result = [];
    for (var i = 0; i < children.length; i++) {
      var shape = children[i];
      var fallbackPicture = alternateFallbackPictures[i];
      var kind = elementLocalName(shape);
      children[i] = shape;
      if (kind !== 'sp' && kind !== 'pic' && kind !== 'grpSp' && kind !== 'cxnSp' &&
          kind !== 'graphicFrame' && kind !== 'contentPart') { continue; }
      var nonVisual = startTags(children[i], 'cNvPr')[0] || '';
      var spPr = elementXml(children[i], kind === 'grpSp' ? 'grpSpPr' : 'spPr') || '';
      var transformContainer = kind === 'graphicFrame' ? children[i] : spPr;
      var directFill = parseShapeFill(spPr);
      var contentKind = kind === 'pic' ? 'picture' : 'shape';
      if (kind === 'graphicFrame') {
        var graphicData = startTags(children[i], 'graphicData')[0] || '';
        var graphicUri = xmlAttribute(graphicData, 'uri') || '';
        if (/\\/table$/.test(graphicUri)) { contentKind = 'table'; }
        else if (/\\/chart$/.test(graphicUri)) { contentKind = 'chart'; }
        else if (/\\/diagram$/.test(graphicUri)) { contentKind = 'diagram'; }
        else if (/\\/ole$/.test(graphicUri)) { contentKind = 'ole'; }
        else { contentKind = 'unknown'; }
      } else if (kind === 'contentPart') {
        contentKind = 'media';
      }
      result.push({
        id: xmlAttribute(nonVisual, 'id') || '',
        name: xmlAttribute(nonVisual, 'name') || '',
        hidden: optionalBoolean(xmlAttribute(nonVisual, 'hidden')) === true,
        elementKind: kind,
        contentKind: contentKind,
        hasTextBody: (kind === 'sp' || kind === 'cxnSp') && startTags(children[i], 'txBody').length > 0,
        textBody: kind === 'sp' || kind === 'cxnSp' ? parseTextBody(children[i], relationships) : undefined,
        placeholder: parsePlaceholder(children[i]),
        picture: kind === 'pic' ? {
          description: xmlAttribute(nonVisual, 'descr'),
          title: xmlAttribute(nonVisual, 'title'),
          direct: parseDirectPicture(children[i], fallbackPicture),
          resolved: {}
        } : undefined,
        pictureFill: kind !== 'pic' && directFill.kind === 'picture' ? {
          direct: parseDirectPictureFill(elementXml(spPr, 'blipFill') || ''),
          resolved: {}
        } : undefined,
        table: contentKind === 'table'
          ? parseTableSnapshot(children[i], relationships, tableStyles, tableTextDefaults) : undefined,
        fallbackFrame: parseFallbackFrame(children[i], contentKind, nonVisual),
        transform: parseShapeTransform(transformContainer),
        groupChildSpace: kind === 'grpSp' ? parseGroupChildSpace(spPr) : undefined,
        children: kind === 'grpSp'
          ? parseShapeChildren(children[i], relationships, tableStyles, tableTextDefaults) : [],
        connectorEnds: kind === 'cxnSp' ? parseConnectorEnds(children[i]) : {},
        styleRefs: parseShapeStyleRefs(children[i]),
        effects: parseShapeEffects(spPr),
        geometry: parseShapeGeometry(spPr),
        fill: directFill,
        line: parseShapeLine(spPr)
      });
    }
    return result;
  }

  function parseShapeSnapshots(xml, relationships, tableStyles, tableTextDefaults) {
    var tree = elementXml(xml || '', 'spTree');
    return tree ? parseShapeChildren(tree, relationships, tableStyles, tableTextDefaults) : [];
  }

  function bytesToDataUri(data, contentType) {
    var value = '';
    var chunk = 0x8000;
    for (var offset = 0; offset < data.length; offset += chunk) {
      value += String.fromCharCode.apply(null, data.subarray(offset, Math.min(offset + chunk, data.length)));
    }
    return 'data:' + contentType + ';base64,' + btoa(value);
  }

  function registerChartRequest(partName) {
    var existing = chartRequestIdsByPart[partName];
    if (existing) { return existing; }
    var id = 'chart-part-' + nextChartRequestId++;
    chartRequestIdsByPart[partName] = id;
    chartRequests[id] = { partName: partName };
    return id;
  }

  function registerMediaRequest(partName, mimeType, intrinsicSize) {
    var existing = mediaRequestIdsByPart[partName];
    if (existing) { return existing; }
    var id = 'picture-media-' + nextMediaRequestId++;
    mediaRequestIdsByPart[partName] = id;
    mediaRequests[id] = { partName: partName, mimeType: mimeType, intrinsicSize: intrinsicSize };
    return id;
  }

  async function resolveEmbeddedPicture(relationshipId, relationships, requestId) {
    if (!relationshipId) { return undefined; }
    var relationship = relationships[relationshipId];
    if (!relationship || relationship.external || !relationship.partName ||
        relationship.type.slice(-6) !== '/image' || !entries[relationship.partName]) { return undefined; }
    var mimeType = partContentType(relationship.partName);
    var pictureBytes = await readEntry(entries[relationship.partName], requestId);
    var intrinsicSize = intrinsicImageSize(pictureBytes, mimeType);
    pictureBytes = null;
    return {
      kind: 'embedded',
      relationshipId: relationshipId,
      partName: '/' + relationship.partName,
      mimeType: mimeType,
      mediaRequestId: registerMediaRequest(relationship.partName, mimeType, intrinsicSize),
      intrinsicSize: intrinsicSize
    };
  }

  function resolveLinkedPicture(relationshipId, relationships) {
    if (!relationshipId) { return undefined; }
    var relationship = relationships[relationshipId];
    if (!relationship || !relationship.external || relationship.type.slice(-6) !== '/image') { return undefined; }
    return { kind: 'linked', relationshipId: relationshipId, target: relationship.target };
  }

  async function resolvePictureRelationships(direct, relationships, requestId) {
    if (!direct) { return {}; }
    return {
      embedded: await resolveEmbeddedPicture(direct.embedRelationshipId, relationships, requestId),
      linked: resolveLinkedPicture(direct.linkRelationshipId, relationships)
    };
  }

  // Ports RendererBase.DrawImage SVG-first / ordinary-image fallback source selection.
  async function materializePictures(shapes, relationships, requestId) {
    for (var i = 0; i < shapes.length; i++) {
      var picture = shapes[i].picture;
      if (picture) {
        var resolved = await resolvePictureRelationships(picture.direct, relationships, requestId);
        resolved.svg = await resolveEmbeddedPicture(picture.direct.svgRelationshipId, relationships, requestId);
        if (picture.direct.alternateContentFallback) {
          resolved.alternateContentFallback = await resolvePictureRelationships(
            picture.direct.alternateContentFallback, relationships, requestId);
        }
        picture.resolved = resolved;
      }
      var pictureFill = shapes[i].pictureFill;
      if (pictureFill) {
        var fillResolved = await resolvePictureRelationships(pictureFill.direct, relationships, requestId);
        fillResolved.svg = await resolveEmbeddedPicture(
          pictureFill.direct.svgRelationshipId, relationships, requestId);
        pictureFill.resolved = fillResolved;
      }
      var fallbackFrame = shapes[i].fallbackFrame;
      if (fallbackFrame && fallbackFrame.direct.contentRelationshipId) {
        var contentRelationship = relationships[fallbackFrame.direct.contentRelationshipId];
        fallbackFrame.resolved = {
          contentPartName: contentRelationship && !contentRelationship.external && contentRelationship.partName
            ? '/' + contentRelationship.partName : undefined
        };
        if (fallbackFrame.kind === 'chart' && contentRelationship && !contentRelationship.external &&
            contentRelationship.partName && entries[contentRelationship.partName]) {
          fallbackFrame.resolved.chartRequestId = registerChartRequest(contentRelationship.partName);
        }
      }
      if (fallbackFrame && fallbackFrame.preview) {
        var previewResolved = await resolvePictureRelationships(
          fallbackFrame.preview.direct, relationships, requestId);
        previewResolved.svg = await resolveEmbeddedPicture(
          fallbackFrame.preview.direct.svgRelationshipId, relationships, requestId);
        fallbackFrame.preview.resolved = previewResolved;
      }
      await materializePictures(shapes[i].children || [], relationships, requestId);
    }
    return shapes;
  }

  async function materializePictureBullets(shapes, relationships, requestId) {
    async function marker(bullet) {
      if (!bullet || bullet.kind !== 'picture' || !bullet.relationshipId) { return; }
      var relationship = relationships[bullet.relationshipId];
      if (!relationship) { return; }
      if (relationship.external) { bullet.target = relationship.target; return; }
      var entry = entries[relationship.partName];
      if (!entry) { return; }
      var data = await readEntry(entry, requestId);
      bullet.dataUri = bytesToDataUri(data, imageContentType(relationship.partName));
    }
    for (var i = 0; i < shapes.length; i++) {
      var textBody = shapes[i].textBody;
      if (textBody) {
        var styles = textBody.listStyle || [];
        for (var styleIndex = 0; styleIndex < styles.length; styleIndex++) { await marker(styles[styleIndex].bullet); }
        for (var paragraphIndex = 0; paragraphIndex < textBody.paragraphs.length; paragraphIndex++) {
          await marker(textBody.paragraphs[paragraphIndex].bullet);
        }
      }
      await materializePictureBullets(shapes[i].children || [], relationships, requestId);
    }
    return shapes;
  }

  function parseDirectBackground(xml) {
    var common = elementXml(xml, 'cSld');
    var background = common ? elementXml(common, 'bg') : undefined;
    if (!background) { return { kind: 'missing' }; }
    var properties = elementXml(background, 'bgPr');
    if (properties) {
      var propertyTags = startTags(properties, 'bgPr');
      var shade = propertyTags.length ? xmlAttribute(propertyTags[0], 'shadeToTitle') : undefined;
      return {
        kind: 'fill',
        fill: parseFill(properties),
        shadeToTitle: shade === '1' || (shade !== undefined && shade.toLowerCase() === 'true')
      };
    }
    var references = startTags(background, 'bgRef');
    if (references.length) {
      return {
        kind: 'theme',
        styleIndex: Number(xmlAttribute(references[0], 'idx')) || 0,
        color: parseColor(background),
        colorTransforms: parseColorTransforms(background)
      };
    }
    return { kind: 'missing' };
  }

  async function materializePicture(background, sourceName, requestId) {
    if (!background || background.kind !== 'fill' || !background.fill || background.fill.kind !== 'picture') {
      return background;
    }
    var relationships = await readRelationships(sourceName, requestId);
    var relationship = relationships[background.fill.relationshipId];
    if (!relationship) { return background; }
    if (relationship.external) {
      background.fill.externalUrl = relationship.target;
      return background;
    }
    var pictureEntry = entries[relationship.partName];
    if (!pictureEntry) { return background; }
    var pictureBytes = await readEntry(pictureEntry, requestId);
    background.fill.data = pictureBytes.buffer.slice(
      pictureBytes.byteOffset,
      pictureBytes.byteOffset + pictureBytes.byteLength
    );
    background.fill.contentType = imageContentType(relationship.partName);
    return background;
  }

  function trueByDefault(xml, localName) {
    var tags = startTags(xml, localName);
    if (!tags.length) { return true; }
    var authored = xmlAttribute(tags[0], 'showMasterSp');
    return authored === undefined || (authored !== '0' && authored.toLowerCase() !== 'false');
  }

  async function backgroundContext(slideXml, slideName, requestId) {
    var slideBackground = await materializePicture(parseDirectBackground(slideXml), slideName, requestId);
    var layoutBackground = { kind: 'missing' };
    var masterBackground = { kind: 'missing' };
    var layoutShowMasterShapes = true;
    var layoutXml;
    var masterXml;
    var layoutRelationships = Object.create(null);
    var masterRelationships = Object.create(null);
    var resolved;
    var slideRelationships = await readRelationships(slideName, requestId);
    var slideIds = Object.keys(slideRelationships);
    var layoutRelationship;
    for (var i = 0; i < slideIds.length; i++) {
      if (/\\/slideLayout$/.test(slideRelationships[slideIds[i]].type)) {
        layoutRelationship = slideRelationships[slideIds[i]];
        break;
      }
    }
    if (layoutRelationship && layoutRelationship.partName && entries[layoutRelationship.partName]) {
      var layoutName = layoutRelationship.partName;
      layoutXml = await readPartXml(layoutName, requestId);
      layoutShowMasterShapes = trueByDefault(layoutXml, 'sldLayout');
      layoutBackground = await materializePicture(parseDirectBackground(layoutXml), layoutName, requestId);
      layoutRelationships = await readRelationships(layoutName, requestId);
      var layoutIds = Object.keys(layoutRelationships);
      for (var j = 0; j < layoutIds.length; j++) {
        var masterRelationship = layoutRelationships[layoutIds[j]];
        if (/\\/slideMaster$/.test(masterRelationship.type) && masterRelationship.partName &&
            entries[masterRelationship.partName]) {
          masterXml = await readPartXml(masterRelationship.partName, requestId);
          masterRelationships = await readRelationships(masterRelationship.partName, requestId);
          masterBackground = await materializePicture(
            parseDirectBackground(masterXml), masterRelationship.partName, requestId);
          break;
        }
      }
    }
    if (slideBackground.kind !== 'missing') {
      resolved = { source: 'slide', background: slideBackground };
    } else if (layoutBackground.kind !== 'missing') {
      resolved = { source: 'layout', background: layoutBackground };
    } else if (masterBackground.kind !== 'missing') {
      resolved = { source: 'master', background: masterBackground };
    } else {
      resolved = {
        source: 'default',
        background: {
          kind: 'fill',
          fill: { kind: 'solid', color: { kind: 'srgb', val: 'FFFFFF' } },
          shadeToTitle: false
        }
      };
    }
    var tableStyles = presentationInfo ? presentationInfo.tableStyles : Object.create(null);
    var masterTextStyles = parseMasterTextStyles(masterXml);
    var inheritedTableLevel = masterTextStyles.otherStyle && masterTextStyles.otherStyle[0];
    var inheritedTableSource = 'master-other-style';
    if (!inheritedTableLevel && presentationInfo && presentationInfo.defaultTextStyle) {
      inheritedTableLevel = presentationInfo.defaultTextStyle[0];
      inheritedTableSource = 'presentation-default';
    }
    var tableTextDefaults = inheritedTableLevel ? {
      fontFamily: inheritedTableLevel.fontFamily,
      fontSizePt: inheritedTableLevel.fontSizePt,
      color: inheritedTableLevel.color,
      bold: inheritedTableLevel.bold,
      italic: inheritedTableLevel.italic,
      source: inheritedTableSource
    } : undefined;
    var masterBindings = masterRelationship ? partTextFills(masterRelationship.partName, requestId) : undefined;
    if (masterBindings) {
      ['titleStyle', 'bodyStyle', 'otherStyle'].forEach(function (name) {
        masterTextStyles[name] = mergeTextFillLevels(masterTextStyles[name], masterBindings[name]);
      });
    }
    var presentationBindings = partTextFills('ppt/presentation.xml', requestId);
    var presentationTextDefaults = mergeTextFillLevels(
      presentationInfo ? (presentationInfo.gradientDefaultTextStyle || presentationInfo.defaultTextStyle) : [],
      presentationBindings ? presentationBindings.defaultTextStyle : []);
    var masterShapes = parseShapeSnapshots(masterXml, masterRelationships, tableStyles, tableTextDefaults);
    var layoutShapes = parseShapeSnapshots(layoutXml, layoutRelationships, tableStyles, tableTextDefaults);
    var slideShapes = parseShapeSnapshots(slideXml, slideRelationships, tableStyles, tableTextDefaults);
    bindShapeTableFills(masterShapes, masterRelationship ? masterRelationship.partName : '', requestId);
    bindShapeTableFills(layoutShapes, layoutRelationship ? layoutRelationship.partName : '', requestId);
    bindShapeTableFills(slideShapes, slideName, requestId);
    bindShapeGroupFills(masterShapes, masterRelationship ? masterRelationship.partName : '', requestId);
    bindShapeGroupFills(layoutShapes, layoutRelationship ? layoutRelationship.partName : '', requestId);
    bindShapeGroupFills(slideShapes, slideName, requestId);
    bindShapeTextFills(masterShapes, masterRelationship ? masterRelationship.partName : '', requestId);
    bindShapeTextFills(layoutShapes, layoutRelationship ? layoutRelationship.partName : '', requestId);
    bindShapeTextFills(slideShapes, slideName, requestId);
    await materializePictures(masterShapes, masterRelationships, requestId);
    await materializePictures(layoutShapes, layoutRelationships, requestId);
    await materializePictures(slideShapes, slideRelationships, requestId);
    await materializePictureBullets(masterShapes, masterRelationships, requestId);
    await materializePictureBullets(layoutShapes, layoutRelationships, requestId);
    await materializePictureBullets(slideShapes, slideRelationships, requestId);
    return {
      slide: slideBackground,
      layout: layoutBackground,
      master: masterBackground,
      resolved: resolved,
      showMasterShapes: trueByDefault(slideXml, 'sld'),
      layoutShowMasterShapes: layoutShowMasterShapes,
      gradientPaint: await canonicalGradientPaint(slideName, slideRelationships,
        layoutRelationship ? layoutRelationship.partName : undefined, layoutRelationships,
        masterRelationship ? masterRelationship.partName : undefined, masterRelationships, requestId),
      shapes: {
        master: masterShapes,
        layout: layoutShapes,
        slide: slideShapes,
        masterTextStyles: masterTextStyles,
        presentationDefaultTextStyle: presentationTextDefaults
      }
    };
  }

  function canonicalGradientRelationship(relationships, kind) {
    var selected;
    Object.keys(relationships).forEach(function (key) {
      var relationship = relationships[key];
      if (!relationship.partName || !entries[relationship.partName] || relationship.targetMode === 'External') { return; }
      if (relationship.type !== 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/' + kind &&
          relationship.type !== 'http://purl.oclc.org/ooxml/officeDocument/relationships/' + kind) { return; }
      if (selected) { throw { code: 'Corrupt', detail: 'ambiguous-gradient-context' }; }
      selected = relationship.partName;
    });
    return selected;
  }
  async function canonicalGradientPart(name, requestId) {
    if (!name) { return undefined; }
    var parts = gradientRequests[requestId] || [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].partName === '/' + name) { return parts[i].hostBindings; }
    }
    await readPartXml(name, requestId);
    for (var j = 0; j < parts.length; j++) {
      if (parts[j].partName === '/' + name) { return parts[j].hostBindings; }
    }
    return undefined;
  }
  async function canonicalGradientPaint(slideName, slideRelationships, legacyLayout, layoutRelationships,
                                        legacyMaster, masterRelationships, requestId) {
    var layout = canonicalGradientRelationship(slideRelationships, 'slideLayout');
    if (layout && layout !== legacyLayout) { layoutRelationships = await readRelationships(layout, requestId); }
    if (!layout) { layoutRelationships = Object.create(null); }
    var master = canonicalGradientRelationship(layoutRelationships, 'slideMaster');
    if (master && master !== legacyMaster) { masterRelationships = await readRelationships(master, requestId); }
    if (!master) { masterRelationships = Object.create(null); }
    var theme = canonicalGradientRelationship(masterRelationships, 'theme') ||
      (gradientThemePartName ? gradientThemePartName.slice(1) : undefined);
    var overrides = [];
    var owners = [masterRelationships, layoutRelationships, slideRelationships];
    for (var i = 0; i < owners.length; i++) {
      var overrideName = canonicalGradientRelationship(owners[i], 'themeOverride');
      var override = await canonicalGradientPart(overrideName, requestId);
      if (override) { overrides.push(override); }
    }
    var slide = await canonicalGradientPart(slideName, requestId);
    if (!slide) { throw { code: 'Corrupt', detail: 'missing-gradient-slide-context' }; }
    var layoutPart = await canonicalGradientPart(layout, requestId);
    var masterPart = await canonicalGradientPart(master, requestId);
    var themePart = await canonicalGradientPart(theme, requestId);
    var tableParts = [], tableStyles = presentationInfo ? presentationInfo.tableGradientStyles || [] : [];
    var records = gradientRequests[requestId] || [];
    records.forEach(function(record) {
      if ([slide.partName, layoutPart && layoutPart.partName, masterPart && masterPart.partName].indexOf(record.partName) >= 0 && record.tableFills && record.tableFills.length) {
        tableParts.push({ partName: record.partName, bindings: record.tableFills });
      }
    });
    return gradientTransport.resolveGradientSlidePaint({ slide: slide,
      layout: layoutPart, master: masterPart, theme: themePart, overrides: overrides,
      tableParts: tableParts, tableStyles: tableStyles });
  }

  async function buildSlideSnapshot(data, entry, index, requestId) {
    var xml = rejectForbiddenXml(data);
    captureAuthoredGradients(xml, entry.name, requestId);
    var shapes = xml.match(/<(?:[A-Za-z_][\\w.-]*:)?(?:sp|pic|grpSp|cxnSp|graphicFrame)\\b/g);
    var slideTags = startTags(xml, 'sld');
    var show = slideTags.length ? xmlAttribute(slideTags[0], 'show') : undefined;
    var backgrounds = await backgroundContext(xml, entry.name, requestId);
    return {
      index: index,
      partName: '/' + entry.name,
      compressedSize: entry.compressedSize,
      uncompressedSize: entry.uncompressedSize,
      shapeCount: shapes ? shapes.length : 0,
      isHidden: show === '0' || (show !== undefined && show.toLowerCase() === 'false'),
      showMasterShapes: backgrounds.showMasterShapes,
      layoutShowMasterShapes: backgrounds.layoutShowMasterShapes,
      backgrounds: {
        slide: backgrounds.slide,
        layout: backgrounds.layout,
        master: backgrounds.master,
        resolved: backgrounds.resolved
      },
      background: backgrounds.resolved,
      authoredGradients: gradientRequests[requestId],
      gradientPaint: backgrounds.gradientPaint,
      shapes: backgrounds.shapes
    };
  }

  function notesColor(color) {
    return color && color.value && color.value.kind === 'srgb' && color.value.val ? color.value.val : undefined;
  }

  function notesRun(item) {
    var run = { text: item.text };
    if (item.bold) { run.bold = true; }
    if (item.italic) { run.italic = true; }
    if (item.underline && item.underline !== 'none') { run.underline = true; }
    if (item.strike && item.strike !== 'noStrike') { run.strike = true; }
    var color = notesColor(item.color);
    if (color) { run.color = color; }
    var highlight = notesColor(item.highlight);
    if (highlight) { run.highlight = highlight; }
    if (item.fontFamily) { run.fontFamily = item.fontFamily; }
    if (item.fontSizePt) { run.fontSizePt = item.fontSizePt; }
    return run;
  }

  function notesParagraph(source, runs) {
    var paragraph = { runs: runs };
    if (source.level) { paragraph.level = source.level; }
    if (source.alignment) { paragraph.alignment = source.alignment; }
    if (source.leftMarginPt !== undefined) { paragraph.leftMarginPt = source.leftMarginPt; }
    if (source.indentPt !== undefined) { paragraph.indentPt = source.indentPt; }
    var bullet = source.bullet;
    if (bullet && bullet.kind === 'character' && bullet.character) {
      paragraph.bullet = { kind: 'character', character: decodeXmlText(bullet.character) };
    } else if (bullet && bullet.kind === 'numbered') {
      paragraph.bullet = { kind: 'numbered', scheme: bullet.scheme, startAt: bullet.startAt };
    }
    return paragraph;
  }

  async function buildNotesSnapshot(index, requestId) {
    var slideName = slides[index];
    if (!slideName || !entries[slideName]) { throw { code: 'Corrupt', detail: 'slide-index' }; }
    var slideRelationships = await readRelationships(slideName, requestId);
    var notesRelationship = firstRelationshipByType(slideRelationships, 'notesSlide');
    var notesPart = notesRelationship && !notesRelationship.external ? notesRelationship.partName : undefined;
    if (!notesPart || !entries[notesPart]) { return { index: index, paragraphs: [] }; }
    var notesXml = await readPartXml(notesPart, requestId);
    var shapesXml = elementsXml(notesXml, 'sp');
    for (var i = 0; i < shapesXml.length; i++) {
      var placeholder = parsePlaceholder(shapesXml[i]);
      if (!placeholder || placeholder.type !== 'body') { continue; }
      var body = parseTextBody(shapesXml[i], Object.create(null));
      var paragraphs = [];
      var bodyParagraphs = body ? body.paragraphs : [];
      for (var p = 0; p < bodyParagraphs.length; p++) {
        var runs = [];
        var content = bodyParagraphs[p].content || [];
        for (var c = 0; c < content.length; c++) {
          if (content[c].kind === 'break') { runs.push({ text: '\\n' }); continue; }
          if (!content[c].text) { continue; }
          runs.push(notesRun(content[c]));
        }
        paragraphs.push(notesParagraph(bodyParagraphs[p], runs));
      }
      return { index: index, paragraphs: paragraphs };
    }
    return { index: index, paragraphs: [] };
  }

  function indexPackage(buffer, effectiveLimits) {
    var input = new Uint8Array(buffer);
    if (input.byteLength < 22 || input[0] !== 0x50 || input[1] !== 0x4b) {
      throw { code: 'NotZip', detail: 'zip-signature' };
    }
    var view = new DataView(buffer);
    var eocd = findEocd(input, view);
    var count = u16(view, eocd + 10);
    var size = u32(view, eocd + 12);
    var offset = u32(view, eocd + 16);
    if (offset + size > input.byteLength) { throw { code: 'Corrupt', detail: 'central-directory-range' }; }
    if (count > effectiveLimits.entryCount) { throw { code: 'TooLarge', detail: 'entry-count' }; }
    var result = Object.create(null);
    var slideList = [];
    var totalUncompressed = 0;
    for (var index = 0; index < count; index++) {
      if (offset + 46 > input.byteLength || u32(view, offset) !== 0x02014b50) {
        throw { code: 'Corrupt', detail: 'central-directory-entry' };
      }
      var nameLength = u16(view, offset + 28);
      var extraLength = u16(view, offset + 30);
      var commentLength = u16(view, offset + 32);
      var nameStart = offset + 46;
      var nameEnd = nameStart + nameLength;
      if (nameEnd + extraLength + commentLength > input.byteLength) {
        throw { code: 'Corrupt', detail: 'central-directory-truncated' };
      }
      var name = decodeName(input.subarray(nameStart, nameEnd));
      if (!safeName(name)) { throw { code: 'Corrupt', detail: 'entry-path' }; }
      if ((u16(view, offset + 8) & 1) !== 0) { throw { code: 'Encrypted', detail: 'entry-encrypted' }; }
      if (result[name]) { throw { code: 'Corrupt', detail: 'duplicate-entry' }; }
      var compressedSize = u32(view, offset + 20);
      var uncompressedSize = u32(view, offset + 24);
      if (uncompressedSize > effectiveLimits.singlePartUncompressedBytes) {
        throw { code: 'TooLarge', detail: 'single-part-size' };
      }
      if (compressedSize > 0 && uncompressedSize / compressedSize > effectiveLimits.compressionRatio) {
        throw { code: 'TooLarge', detail: 'compression-ratio' };
      }
      totalUncompressed += uncompressedSize;
      if (totalUncompressed > effectiveLimits.totalUncompressedBytes) {
        throw { code: 'TooLarge', detail: 'total-uncompressed-size' };
      }
      result[name] = {
        name: name,
        method: u16(view, offset + 10),
        compressedSize: compressedSize,
        uncompressedSize: uncompressedSize,
        localHeaderOffset: u32(view, offset + 42)
      };
      if (slideNumber(name) >= 0) { slideList.push(name); }
      offset = nameEnd + extraLength + commentLength;
    }
    if (!result['[Content_Types].xml'] || !result['ppt/presentation.xml']) {
      throw { code: 'NotPptx', detail: 'required-parts' };
    }
    slideList.sort(function (left, right) { return slideNumber(left) - slideNumber(right); });
    return { entries: result, slides: slideList };
  }

  self.onmessage = async function (event) {
    var message = event.data || {};
    if (message.type === 'open' || message.type === 'slide') { gradientRequests[message.requestId] = []; }
    try {
      if (message.type === 'cancel') {
        cancelled[message.requestId] = true;
        return;
      }
      if (message.type === 'open') {
        gradientThemePartName = undefined;
        gradientPartCache = [];
        bytes = message.bytes;
        limits = resolveWorkerLimits(message.limits);
        mediaRequests = Object.create(null);
        mediaRequestIdsByPart = Object.create(null);
        nextMediaRequestId = 1;
        chartRequests = Object.create(null);
        chartRequestIdsByPart = Object.create(null);
        nextChartRequestId = 1;
        var indexed = indexPackage(bytes, limits);
        entries = indexed.entries;
        slides = indexed.slides;
        var contentTypesBytes = await readEntry(entries['[Content_Types].xml'], message.requestId);
        var contentTypes = rejectForbiddenXml(contentTypesBytes);
        contentTypesBytes = null;
        if (contentTypes.indexOf('presentationml.presentation.main+xml') < 0 &&
            contentTypes.indexOf('ms-powerpoint.presentation.macroEnabled.main+xml') < 0 &&
            contentTypes.indexOf('ms-powerpoint.slideshow.macroEnabled.main+xml') < 0 &&
            contentTypes.indexOf('ms-powerpoint.template.macroEnabled.main+xml') < 0) {
          throw { code: 'NotPptx', detail: 'presentation-content-type' };
        }
        parseContentTypes(contentTypes);
        presentationInfo = await parsePresentation(message.requestId);
        var presentationFills = partTextFills('ppt/presentation.xml', message.requestId);
        if (presentationInfo && presentationFills) {
          presentationInfo.gradientDefaultTextStyle = mergeTextFillLevels(
            presentationInfo.defaultTextStyle, presentationFills.defaultTextStyle);
        }
        slides = presentationInfo.slides;
        var hasMacros = contentTypes.indexOf('macroEnabled') >= 0 ||
          contentTypes.indexOf('vbaProject') >= 0 || !!entries['ppt/vbaProject.bin'];
        self.postMessage({
          type: 'opened',
          requestId: message.requestId,
          snapshot: {
            slideCount: slides.length,
            entryCount: Object.keys(entries).length,
            hasMacros: hasMacros,
            slideWidthPt: presentationInfo.slideWidthPt,
            slideHeightPt: presentationInfo.slideHeightPt,
            slideSizeType: presentationInfo.slideSizeType,
            theme: presentationInfo.theme,
            authoredGradients: gradientRequests[message.requestId]
          }
        });
        return;
      }
      if (message.type === 'media') {
        if (!bytes) { throw { code: 'Corrupt', detail: 'session-closed' }; }
        var mediaRequest = mediaRequests[message.mediaRequestId];
        if (!mediaRequest || !entries[mediaRequest.partName]) {
          throw { code: 'Corrupt', detail: 'media-request' };
        }
        var mediaBytes = await readEntry(entries[mediaRequest.partName], message.requestId);
        var mediaBuffer = mediaBytes.buffer.slice(
          mediaBytes.byteOffset, mediaBytes.byteOffset + mediaBytes.byteLength);
        mediaBytes = null;
        self.postMessage({
          type: 'media',
          requestId: message.requestId,
          mediaRequestId: message.mediaRequestId,
          mimeType: mediaRequest.mimeType,
          intrinsicSize: mediaRequest.intrinsicSize,
          data: mediaBuffer
        }, [mediaBuffer]);
        return;
      }
      if (message.type === 'chart') {
        if (!bytes) { throw { code: 'Corrupt', detail: 'session-closed' }; }
        var chartRequest = chartRequests[message.chartRequestId];
        if (!chartRequest || !entries[chartRequest.partName]) {
          throw { code: 'Corrupt', detail: 'chart-request' };
        }
        var chartBytes = await readEntry(entries[chartRequest.partName], message.requestId);
        var chartXml = rejectForbiddenXml(chartBytes);
        chartBytes = null;
        self.postMessage({
          type: 'chart',
          requestId: message.requestId,
          chartRequestId: message.chartRequestId,
          xml: chartXml
        });
        return;
      }
      if (message.type === 'slide') {
        if (!bytes) { throw { code: 'Corrupt', detail: 'session-closed' }; }
        var entry = entries[slides[message.index]];
        if (!entry) { throw { code: 'Corrupt', detail: 'slide-index' }; }
        var slideBytes = await readEntry(entry, message.requestId);
        var snapshot = await buildSlideSnapshot(slideBytes, entry, message.index, message.requestId);
        slideBytes = null;
        var transfers = [];
        if (snapshot.background && snapshot.background.background && snapshot.background.background.fill &&
            snapshot.background.background.fill.data) {
          transfers.push(snapshot.background.background.fill.data);
        }
        self.postMessage({
          type: 'slide',
          requestId: message.requestId,
          snapshot: snapshot
        }, transfers);
        return;
      }
      if (message.type === 'notes') {
        if (!bytes) { throw { code: 'Corrupt', detail: 'session-closed' }; }
        self.postMessage({
          type: 'notes',
          requestId: message.requestId,
          snapshot: await buildNotesSnapshot(message.index, message.requestId)
        });
        return;
      }
      if (message.type === 'close') {
        bytes = null;
        gradientRequests = Object.create(null);
        gradientPartCache = [];
        gradientThemePartName = undefined;
        slides = [];
        entries = Object.create(null);
        cancelled = Object.create(null);
        limits = null;
        presentationInfo = null;
        contentTypeDefaults = Object.create(null);
        contentTypeOverrides = Object.create(null);
        mediaRequests = Object.create(null);
        mediaRequestIdsByPart = Object.create(null);
        nextMediaRequestId = 1;
        chartRequests = Object.create(null);
        chartRequestIdsByPart = Object.create(null);
        nextChartRequestId = 1;
        self.close();
      }
    } catch (error) {
      if (message.type === 'open') { gradientPartCache = []; }
      fail(message.requestId, error && error.code ? error.code : 'Corrupt', error && error.detail ? error.detail : 'worker');
    } finally {
      if (message.type === 'open' || message.type === 'slide') { delete gradientRequests[message.requestId]; }
    }
  };
}());`;

