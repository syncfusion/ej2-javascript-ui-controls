/**
 * Shared numeric helpers for formula modules (erf, normal distribution, complex numbers).
 *
 * @hidden
 */
/**
 * erf helper.
 *
 * @param {number} x - x argument.
 * @returns {number} - erf result.
 */
export function erf(x: number): number {
    const sign: number = x < 0 ? -1 : 1;
    const ax: number = Math.abs(x);
    const t: number = 1 / (1 + 0.3275911 * ax);
    const y: number = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t -
        0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
    return sign * y;
}

/**
 * erfc helper.
 *
 * @param {number} x - x argument.
 * @returns {number} - erfc result.
 */
export function erfc(x: number): number {
    return 1 - erf(x);
}

/**
 * normCDF helper.
 *
 * @param {number} x - x argument.
 * @param {number} mean - mean argument.
 * @param {number} stdDev - stdDev argument.
 * @returns {number} - normCDF result.
 */
export function normCDF(x: number, mean: number = 0, stdDev: number = 1): number {
    if (stdDev <= 0) {
        return NaN;
    }
    const z: number = (x - mean) / (stdDev * Math.SQRT2);
    return 0.5 * (1 + erf(z));
}

/**
 * normInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} mean - mean argument.
 * @param {number} stdDev - stdDev argument.
 * @returns {number} - normInv result.
 */
export function normInv(p: number, mean: number = 0, stdDev: number = 1): number {
    if (p <= 0 || p >= 1 || stdDev <= 0) {
        return NaN;
    }
    const a: number[] = [
        -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
        1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00
    ];
    const b: number[] = [
        -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
        6.680131188771972e+01, -1.328068155288572e+01
    ];
    const c: number[] = [
        -7.784894002430293e-03, -3.223964580411018e-01, -2.400758277161838e+00,
        -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00
    ];
    const d: number[] = [
        7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00
    ];
    const pLow: number = 0.02425;
    const pHigh: number = 1 - pLow;
    let q: number;
    let r: number;
    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        r = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        r = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
            (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        r = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    return mean + stdDev * r;
}

export interface ComplexValue {
    re: number;
    im: number;
}

/**
 * parseComplexText helper.
 *
 * @param {string} text - text argument.
 * @returns {ComplexValue | null} - parseComplexText result.
 */
export function parseComplexText(text: string): ComplexValue | null {
    const trimmed: string = text.trim();
    if (trimmed === '') {
        return null;
    }
    // eslint-disable-next-line security/detect-unsafe-regex
    const direct: RegExpMatchArray | null = trimmed.match(/^(-?\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)[ij]$/i);
    if (direct) {
        return { re: parseFloat(direct[1]), im: parseFloat(direct[2]) };
    }
    // eslint-disable-next-line security/detect-unsafe-regex
    const imagOnly: RegExpMatchArray | null = trimmed.match(/^([+-]?\d+(?:\.\d+)?)[ij]$/i);
    if (imagOnly) {
        return { re: 0, im: parseFloat(imagOnly[1]) };
    }
    // eslint-disable-next-line security/detect-unsafe-regex
    const realOnly: RegExpMatchArray | null = trimmed.match(/^(-?\d+(?:\.\d+)?)$/);
    if (realOnly) {
        return { re: parseFloat(realOnly[1]), im: 0 };
    }
    return null;
}

/**
 * formatComplex helper.
 *
 * @param {number} re - re argument.
 * @param {number} im - im argument.
 * @param {string} suffix - suffix argument.
 * @returns {string} - formatComplex result.
 */
export function formatComplex(re: number, im: number, suffix: string = 'i'): string {
    if (im === 0) {
        return re.toString();
    }
    if (re === 0) {
        return im.toString() + suffix;
    }
    const sign: string = im >= 0 ? '+' : '-';
    return re.toString() + sign + Math.abs(im).toString() + suffix;
}

/**
 * factorial helper.
 *
 * @param {number} n - n argument.
 * @returns {number} - factorial result.
 */
export function factorial(n: number): number {
    if (n < 0 || n > 170) {
        return NaN;
    }
    let result: number = 1;
    for (let i: number = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * binomialCoeff helper.
 *
 * @param {number} n - n argument.
 * @param {number} k - k argument.
 * @returns {number} - binomialCoeff result.
 */
export function binomialCoeff(n: number, k: number): number {
    if (k < 0 || k > n) {
        return 0;
    }
    k = Math.min(k, n - k);
    let result: number = 1;
    for (let i: number = 1; i <= k; i++) {
        result = result * (n - k + i) / i;
    }
    return result;
}
/**
 * logGamma helper.
 *
 * @param {number} x - x argument.
 * @returns {number} - logGamma result.
 */
export function logGamma(x: number): number {
    if (x <= 0) {
        return NaN;
    }
    const g: number = 7;
    const coef: number[] = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012, Number('9.984369578019571e-6'),
        1.5056327351493116e-7
    ];
    if (x < 0.5) {
        return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    }
    x -= 1;
    let a: number = coef[0];
    for (let i: number = 1; i < g + 2; i++) {
        a += coef[i as number] / (x + i);
    }
    const t: number = x + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * gamma helper.
 *
 * @param {number} x - x argument.
 * @returns {number} - gamma result.
 */
export function gamma(x: number): number {
    const lg: number = logGamma(x);
    return isFinite(lg) ? Math.exp(lg) : NaN;
}
/**
 * lowerRegularizedGamma helper.
 *
 * @param {number} a - a argument.
 * @param {number} x - x argument.
 * @returns {number} - lowerRegularizedGamma result.
 */
export function lowerRegularizedGamma(a: number, x: number): number {
    if (x < 0 || a <= 0) {
        return NaN;
    }
    if (x === 0) {
        return 0;
    }
    if (x > 1e6) {
        return 1;
    }
    let sum: number = 1 / a;
    let term: number = sum;
    for (let n: number = 1; n < 200; n++) {
        term *= x / (a + n);
        sum += term;
        if (Math.abs(term) < 1e-12 * Math.abs(sum)) {
            break;
        }
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}
/**
 * chiSquareCDF helper.
 *
 * @param {number} x - x argument.
 * @param {number} df - df argument.
 * @returns {number} - chiSquareCDF result.
 */
export function chiSquareCDF(x: number, df: number): number {
    if (x < 0 || df <= 0) {
        return NaN;
    }
    return lowerRegularizedGamma(df / 2, x / 2);
}
/**
 * chiSquareInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} df - df argument.
 * @returns {number} - chiSquareInv result.
 */
export function chiSquareInv(p: number, df: number): number {
    if (p <= 0 || p >= 1 || df <= 0) {
        return NaN;
    }
    let lo: number = 0;
    let hi: number = Math.max(100, df + 10 * Math.sqrt(2 * df));
    for (let i: number = 0; i < 100; i++) {
        const mid: number = (lo + hi) / 2;
        const cdf: number = chiSquareCDF(mid, df);
        if (cdf < p) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2;
}
/**
 * fCDF helper.
 *
 * @param {number} x - x argument.
 * @param {number} d1 - d1 argument.
 * @param {number} d2 - d2 argument.
 * @returns {number} - fCDF result.
 */
export function fCDF(x: number, d1: number, d2: number): number {
    if (x < 0 || d1 <= 0 || d2 <= 0) {
        return NaN;
    }
    const z: number = (d1 * x) / (d1 * x + d2);
    return betaRegularized(d1 / 2, d2 / 2, z);
}

/**
 * betaRegularized helper.
 *
 * @param {number} a - a argument.
 * @param {number} b - b argument.
 * @param {number} x - x argument.
 * @returns {number} - betaRegularized result.
 */
function betaRegularized(a: number, b: number, x: number): number {
    if (x <= 0) {
        return 0;
    }
    if (x >= 1) {
        return 1;
    }
    const lnBeta: number = logGamma(a) + logGamma(b) - logGamma(a + b);
    const front: number = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnBeta) / a;
    let f: number = 1;
    let c: number = 1;
    let d: number = 0;
    for (let m: number = 0; m <= 200; m++) {
        const m2: number = 2 * m;
        let aa: number = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < 1e-30) {
            d = 1e-30;
        }
        c = 1 + aa / c;
        if (Math.abs(c) < 1e-30) {
            c = 1e-30;
        }
        d = 1 / d;
        f *= d * c;
        aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
        d = 1 + aa * d;
        if (Math.abs(d) < 1e-30) {
            d = 1e-30;
        }
        c = 1 + aa / c;
        if (Math.abs(c) < 1e-30) {
            c = 1e-30;
        }
        d = 1 / d;
        const delta: number = d * c;
        f *= delta;
        if (Math.abs(delta - 1) < 1e-10) {
            break;
        }
    }
    return front * (f - 1);
}
/**
 * fInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} d1 - d1 argument.
 * @param {number} d2 - d2 argument.
 * @returns {number} - fInv result.
 */
export function fInv(p: number, d1: number, d2: number): number {
    if (p <= 0 || p >= 1 || d1 <= 0 || d2 <= 0) {
        return NaN;
    }
    let lo: number = 0;
    let hi: number = 1000;
    while (fCDF(hi, d1, d2) < p) {
        hi *= 2;
        if (hi > 1e12) {
            break;
        }
    }
    for (let i: number = 0; i < 100; i++) {
        const mid: number = (lo + hi) / 2;
        if (fCDF(mid, d1, d2) < p) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2;
}
/**
 * besselI helper.
 *
 * @param {number} n - n argument.
 * @param {number} x - x argument.
 * @returns {number} - besselI result.
 */
export function besselI(n: number, x: number): number {
    if (x < 0) {
        return besselI(n, -x);
    }
    const nn: number = Math.abs(Math.floor(n));
    let sum: number = 0;
    for (let k: number = 0; k < 100; k++) {
        const term: number = Math.pow(x / 2, 2 * k + nn) / (factorial(k) * factorial(k + nn));
        sum += term;
        if (k > 10 && term < 1e-15 * sum) {
            break;
        }
    }
    return sum;
}
/**
 * besselJ helper.
 *
 * @param {number} n - n argument.
 * @param {number} x - x argument.
 * @returns {number} - besselJ result.
 */
export function besselJ(n: number, x: number): number {
    const nn: number = Math.abs(Math.floor(n));
    let sum: number = 0;
    for (let k: number = 0; k < 100; k++) {
        const sign: number = k % 2 === 0 ? 1 : -1;
        const term: number = sign * Math.pow(x / 2, 2 * k + nn) / (factorial(k) * factorial(k + nn));
        sum += term;
        if (k > 10 && Math.abs(term) < 1e-15 * Math.abs(sum)) {
            break;
        }
    }
    return sum;
}
/**
 * besselK helper.
 *
 * @param {number} n - n argument.
 * @param {number} x - x argument.
 * @returns {number} - besselK result.
 */
export function besselK(n: number, x: number): number {
    if (x <= 0) {
        return NaN;
    }
    const nn: number = Math.abs(Math.floor(n));
    if (nn === 0) {
        return (Math.PI / 2) * (besselI(0, x) - besselJ(0, x));
    }
    return (Math.PI / 2) * (besselI(nn, x) - besselJ(nn, x));
}

/**
 * Bessel Y_0(x), x > 0.
 *
 * @param {number} x - Order-zero argument.
 * @returns {number} - Y0 approximation.
 */
function besselY0(x: number): number {
    const j0: number = besselJ(0, x);
    let innerSum: number = 0;
    for (let k: number = 1; k < 100; k++) {
        let partial: number = 0;
        for (let j: number = 1; j <= k; j++) {
            partial += 1 / j;
        }
        innerSum += Math.pow(x / 2, 2 * k) / (factorial(k) * factorial(k)) * partial;
    }
    return (2 / Math.PI) * (j0 * (Math.log(x / 2) + 0.5772156649) - innerSum);
}

/**
 * Bessel Y_1(x), x > 0.
 *
 * @param {number} x - Order-one argument.
 * @returns {number} - Y1 approximation.
 */
function besselY1(x: number): number {
    const j1: number = besselJ(1, x);
    let innerSum: number = 0;
    for (let k: number = 0; k < 100; k++) {
        const sign: number = k % 2 === 0 ? 1 : -1;
        innerSum += sign * Math.pow(x / 2, 2 * k + 1) / (factorial(k) * factorial(k + 1) * (2 * k + 1));
    }
    return (2 / Math.PI) * (j1 * Math.log(x / 2) - 1 / (x / 2) + innerSum);
}
/**
 * besselY helper.
 *
 * @param {number} n - n argument.
 * @param {number} x - x argument.
 * @returns {number} - besselY result.
 */
export function besselY(n: number, x: number): number {
    if (x <= 0) {
        return NaN;
    }
    const nn: number = Math.abs(Math.floor(n));
    if (nn === 0) {
        return besselY0(x);
    }
    let y0: number = besselY0(x);
    let y1: number = besselY1(x);
    if (nn === 1) {
        return y1;
    }
    for (let i: number = 1; i < nn; i++) {
        const yn: number = (2 * i / x) * y1 - y0;
        y0 = y1;
        y1 = yn;
    }
    return y1;
}
/**
 * logNormCDF helper.
 *
 * @param {number} x - x argument.
 * @param {number} mean - mean argument.
 * @param {number} stdDev - stdDev argument.
 * @returns {number} - logNormCDF result.
 */
export function logNormCDF(x: number, mean: number, stdDev: number): number {
    if (x <= 0 || stdDev <= 0) {
        return NaN;
    }
    return normCDF(Math.log(x), mean, stdDev);
}
/**
 * logNormInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} mean - mean argument.
 * @param {number} stdDev - stdDev argument.
 * @returns {number} - logNormInv result.
 */
export function logNormInv(p: number, mean: number, stdDev: number): number {
    return Math.exp(normInv(p, mean, stdDev));
}
/**
 * tCDF helper.
 *
 * @param {number} x - x argument.
 * @param {number} df - df argument.
 * @returns {number} - tCDF result.
 */
export function tCDF(x: number, df: number): number {
    if (df <= 0) {
        return NaN;
    }
    const t2: number = x * x;
    const ib: number = betaRegularized(df / 2, 0.5, df / (df + t2));
    return x >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
}
/**
 * tInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} df - df argument.
 * @returns {number} - tInv result.
 */
export function tInv(p: number, df: number): number {
    if (p <= 0 || p >= 1 || df <= 0) {
        return NaN;
    }
    let lo: number = -100;
    let hi: number = 100;
    for (let i: number = 0; i < 100; i++) {
        const mid: number = (lo + hi) / 2;
        if (tCDF(mid, df) < p) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2;
}
/**
 * betaDist helper.
 *
 * @param {number} x - x argument.
 * @param {number} alpha - alpha argument.
 * @param {number} betaParam - betaParam argument.
 * @returns {number} - betaDist result.
 */
export function betaDist(x: number, alpha: number, betaParam: number): number {
    if (x < 0 || x > 1 || alpha <= 0 || betaParam <= 0) {
        return NaN;
    }
    return betaRegularized(alpha, betaParam, x);
}
/**
 * betaInv helper.
 *
 * @param {number} p - p argument.
 * @param {number} alpha - alpha argument.
 * @param {number} betaParam - betaParam argument.
 * @returns {number} - betaInv result.
 */
export function betaInv(p: number, alpha: number, betaParam: number): number {
    if (p <= 0 || p >= 1 || alpha <= 0 || betaParam <= 0) {
        return NaN;
    }
    let lo: number = 0;
    let hi: number = 1;
    for (let i: number = 0; i < 100; i++) {
        const mid: number = (lo + hi) / 2;
        if (betaRegularized(alpha, betaParam, mid) < p) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2;
}
