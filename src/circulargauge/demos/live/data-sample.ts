/**
 * Data sample
 */
import { CircularGauge } from '../../src/index';
import { gauge1, gauge2, gauge3 } from './datasample-gauge';
window.onload = () => {
    let germany: CircularGauge = new CircularGauge(gauge1(), '#container1');
    let usa: CircularGauge = new CircularGauge(gauge2(), '#container2');
    let uk: CircularGauge = new CircularGauge(gauge3(), '#container3');
};