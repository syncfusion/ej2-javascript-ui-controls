/**
 *  Provide mask support to default input textboxes through utility method.
 */

import { maskInput } from '../../src/maskedtextbox/base/mask-base';

maskInput({
    element: <HTMLInputElement>document.getElementById('mask1'),
    mask: "(999) 9999-999"
});

maskInput({
    element: <HTMLInputElement>document.getElementById('mask2'),
    mask: "9999 9999 9999 9999"
});

maskInput({
    element: <HTMLInputElement>document.getElementById('mask3'),
    mask: ">A|AA 9999"
});