/**
 * interfaces are used to refer listview component animation and click event argument details
 */
export interface AnimationSettings {
    /**
     * It is used to specify the effect which is shown in sub list transform.
     */
    effect?: ListViewEffect;
    /**
     * It is used to specify the time duration of transform object.
     */
    duration?: number;
    /**
     * It is used to specify the easing effect applied while transform
     */
    easing?: string;
}

export interface ClickEventArgs {
    /**
     * It is used to specify the selected element id
     */
    ElementId?: string;
    /**
     * It is used to specify the selected element checkbox status
     */
    IsChecked: boolean;
    /**
     * It is used to specify the selected element datasource level key
     */
    Key?: string;
    /**
     * It is used to specify that event has triggered by user interaction or not.
     */
    IsInteracted?: boolean;
}

type ListViewEffect = 'None' | 'SlideLeft' | 'SlideDown' | 'Zoom' | 'Fade';
