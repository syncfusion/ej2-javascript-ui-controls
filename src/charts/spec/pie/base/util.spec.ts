/**
 * AccumulationChart control test case utilities
 */
import { ChartLocation } from '../../../src/common/utils/helper';
export function getPosition(element: HTMLElement) : ChartLocation {
    return new ChartLocation(parseInt(element.style.left, 10), parseInt(element.style.top, 10));
}
export function getLocations(path: string): SliceOption {
    let slice: string[] = path.split(' ');
    return {
        center: new ChartLocation(+slice[1], +slice[2]),
        start: new ChartLocation(+slice[4], +slice[5]),
        end: new ChartLocation(+slice[12], +slice[13])
    };
}
export interface SliceOption {
    center: ChartLocation;
    start: ChartLocation;
    end: ChartLocation;
}
export function addTooltipStyles(): void {
    let css: string = '.e-popup { height: auto; position: absolute; width: auto; z-index: 1000;}'
        + '.e-popup.e-popup-open { display: block;} .e-popup.e-popup-close { display: none;}'
        + '.e-tooltip-wrap { max-width: 350px; min-width: 30px; padding: 0; position: absolute; visibility: visible;}'
        + '.e-tooltip-wrap .e-arrow-tip { overflow: hidden; position: absolute; }'
        + '.e-tooltip-wrap .e-arrow-tip.e-tip-bottom { height: 8px; left: 50%; top: 100%; width: 16px; }'
        + '.e-tooltip-wrap .e-arrow-tip.e-tip-top { height: 8px; left: 50%; top: -9px; width: 16px; }'
        + '.e-tooltip-wrap .e-arrow-tip.e-tip-left { height: 16px; left: -9px; top: 48%; width: 8px; }'
        + '.e-tooltip-wrap .e-arrow-tip.e-tip-right { height: 16px; left: 100%; top: 50%; width: 8px; }'
        + '.e-tooltip-wrap .e-tooltip-close {  float: right;  position: absolute;  right: -9px;  top: -9px; }'
        + '.e-tooltip-wrap .e-tip-content { height: 100%; line-height: 16px; overflow-x: hidden;'
        + 'padding: 3px 6px; position: relative; white-space: normal; width: 100%; }'
        + '.e-tooltip-wrap.e-popup { background-color: #616161; border: 1px solid #616161; }'
        + '.e-tooltip-wrap .e-arrow-tip-outer { height: 0; left: 0; position: absolute; top: 0;  width: 0; }'
        + '.e-tooltip-wrap .e-arrow-tip-outer.e-tip-bottom { border-left: 8px solid transparent;'
        + 'border-right: 8px solid transparent; border-top: 8px solid #616161; }'
        + '.e-tooltip-wrap .e-arrow-tip-outer.e-tip-top { border-bottom: 8px solid #616161;'
        + 'border-left: 8px solid transparent; border-right: 8px solid transparent; }'
        + '.e-tooltip-wrap .e-arrow-tip-outer.e-tip-left { border-bottom: 8px solid transparent;'
        + 'border-right: 8px solid #616161; border-top: 8px solid transparent; }'
        + '.e-tooltip-wrap .e-arrow-tip-outer.e-tip-right { border-bottom: 8px solid transparent; border-left: 8px solid #616161;'
        + 'border-top: 8px solid transparent; }'
        + '.e-tooltip-wrap .e-arrow-tip-inner { height: 0; position: absolute; width: 0; }'
        + '.e-tooltip-wrap .e-arrow-tip-inner.e-tip-bottom {  border-left: 7px solid transparent;'
        + 'border-right: 7px solid transparent;  border-top: 7px solid #616161;  left: 1px;  top: 0; }'
        + '.e-tooltip-wrap .e-arrow-tip-inner.e-tip-top { border-bottom: 7px solid #616161;'
        + 'border-left: 7px solid transparent;  border-right: 7px solid transparent; left: 1px;  top: 1px; }'
        + '.e-tooltip-wrap .e-arrow-tip-inner.e-tip-left { border-bottom: 7px solid'
        + 'transparent; border-right: 7px solid #616161; border-top: 7px solid transparent; left: 1px; top: 1px; }'
        + '.e-tooltip-wrap .e-arrow-tip-inner.e-tip-right {  border-bottom: 7px solid transparent;'
        + 'border-left: 7px solid #616161;  border-top: 7px solid transparent;  left: 0;  top: 1px; }'
        + '.e-tooltip-wrap .e-tip-content {  color: #fff;  font-family: "Roboto";  font-size: 11px; }';
    let style: HTMLStyleElement = document.createElement('style');
    style.type = 'text/css';
    style.id = 'tooltipStyle';
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
}