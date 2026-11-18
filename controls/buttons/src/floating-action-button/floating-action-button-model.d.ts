import { getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { select } from '@syncfusion/ej2-base';import { Button } from '../button/button';
import {FabPosition} from "./floating-action-button";
import {ButtonModel} from "../button/button-model";

/**
 * Interface for a class Fab
 */
export interface FabModel extends ButtonModel{

    /**
     * Defines the position of the FAB relative to target.
     * The possible values are:
     * * TopLeft: Positions the FAB at the target's top left corner.
     * * TopCenter: Positions the FAB at the target's top left corner.
     * * TopRight: Positions the FAB at the target's top left corner.
     * * MiddleLeft: Positions the FAB at the target's top left corner.
     * * MiddleCenter: Positions the FAB at the target's top left corner.
     * * MiddleRight: Positions the FAB at the target's top left corner.
     * * BottomLeft: Positions the FAB at the target's top left corner.
     * * BottomCenter: Places the FAB on the bottom-center position of the target.
     * * BottomRight: Positions the FAB at the target's bottom right corner.
     *
     * {% codeBlock src='fab/position/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default FabPosition.BottomRight
     * @asptype FabPosition
     */
    position?: string | FabPosition;

    /**
     * Defines the selector that points to an element in which the FAB will be positioned.
     * By default, FAB is positioned based on viewport of browser.
     * The target element must have relative position, else FAB will get positioned based on the closest element which has relative position.
     *
     * @default ''
     */
    target?: string | HTMLElement;

    /**
     * Defines whether the fab is visible or hidden.
     *
     * @default true.
     */
    visible?: boolean;

    /**
     * Defines whether to apply primary style for FAB.
     *
     * @default true
     */
    isPrimary?: boolean;

}