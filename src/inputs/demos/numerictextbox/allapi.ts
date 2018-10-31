import { NumericTextBox, ChangeEventArgs } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    value: 10,
    created: function(args:Object) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'NumericTextBox has been created. \\\n';
    },
    change: function(args:ChangeEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'NumericTextBox value has been changed -->'+ args.previousValue+'-->'+ args.value+'    isInteraction-->'+args.isInteraction+'    name-->'+args.name+'\\\n';
    },
    destroyed: function(args:ChangeEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'NumericTextBox has been destroyed. \\\n';
    }
});
numeric.appendTo('#numeric');

let decimals: NumericTextBox = new NumericTextBox({
    change: function(args:ChangeEventArgs) {
        var numericObj = numeric;
        numericObj.decimals = args.value;
    }
});
decimals.appendTo('#decimals');
let max: NumericTextBox = new NumericTextBox({
    change: function(args:ChangeEventArgs) {
        var numericObj = numeric;
        numericObj.max = args.value;
    }
});
max.appendTo('#max');
let min: NumericTextBox = new NumericTextBox({
    change: function(args:ChangeEventArgs) {
        var numericObj = numeric;
        numericObj.min = args.value;
    }
});
min.appendTo('#min');
let step: NumericTextBox = new NumericTextBox({
    value: 1,
    change: function(args:ChangeEventArgs) {
        var numericObj = numeric;
        numericObj.step = args.value;
    }
});
step.appendTo('#step');
