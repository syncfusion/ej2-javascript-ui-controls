import { ownGet } from '../../core/compat/object-compat';
/**
 * Windows LCID values for run language properties (`w:lang`).
 *
 * Enum member names use underscore BCP-47 style (`en_US`) matching the public
 * DocIO-oriented API. Wire values remain BCP-47 with hyphens (`en-US`).
 *
 * @public
 */
export enum LocaleIDs {
    /** Unspecified / cleared language. */
    None = 0,

    'af_ZA' = 1078,
    'sq_AL' = 1052,
    'am_ET' = 1118,
    'ar_SA' = 1025,
    'ar_IQ' = 2049,
    'ar_EG' = 3073,
    'ar_LY' = 4097,
    'ar_DZ' = 5121,
    'ar_MA' = 6145,
    'ar_TN' = 7169,
    'ar_OM' = 8193,
    'ar_YE' = 9217,
    'ar_SY' = 10241,
    'ar_JO' = 11265,
    'ar_LB' = 12289,
    'ar_KW' = 13313,
    'ar_AE' = 14337,
    'ar_BH' = 15361,
    'ar_QA' = 16385,
    'hy_AM' = 1067,
    'as_IN' = 1101,
    'az_AZ_Latn' = 1068,
    'az_AZ_Cyrl' = 2092,
    'eu_ES' = 1069,
    'be_BY' = 1059,
    'bn_IN' = 1093,
    'bn_BD' = 2117,
    'bs_BA_Latn' = 5146,
    'bs_BA_Cyrl' = 8218,
    'bg_BG' = 1026,
    'my_MM' = 1109,
    'ca_ES' = 1027,
    'zh_TW' = 1028,
    'zh_CN' = 2052,
    'zh_HK' = 3076,
    'zh_SG' = 4100,
    'zh_MO' = 5124,
    'hr_HR' = 1050,
    'hr_BA' = 4122,
    'cs_CZ' = 1029,
    'da_DK' = 1030,
    'prs_AF' = 1164,
    'dv_MV' = 1125,
    'nl_NL' = 1043,
    'nl_BE' = 2067,
    'en_US' = 1033,
    'en_GB' = 2057,
    'en_AU' = 3081,
    'en_CA' = 4105,
    'en_NZ' = 5129,
    'en_IE' = 6153,
    'en_ZA' = 7177,
    'en_JM' = 8201,
    'en_CB' = 9225,
    'en_BZ' = 10249,
    'en_TT' = 11273,
    'en_ZW' = 12297,
    'en_PH' = 13321,
    'en_IN' = 16393,
    'en_MY' = 17417,
    'en_SG' = 18441,
    'et_EE' = 1061,
    'fo_FO' = 1080,
    'fil_PH' = 1124,
    'fi_FI' = 1035,
    'fr_FR' = 1036,
    'fr_BE' = 2060,
    'fr_CA' = 3084,
    'fr_CH' = 4108,
    'fr_LU' = 5132,
    'fr_MC' = 6156,
    'fy_NL' = 1122,
    'gl_ES' = 1110,
    'ka_GE' = 1079,
    'de_DE' = 1031,
    'de_CH' = 2055,
    'de_AT' = 3079,
    'de_LU' = 4103,
    'de_LI' = 5127,
    'el_GR' = 1032,
    'gu_IN' = 1095,
    'ha_NG_Latn' = 1128,
    'he_IL' = 1037,
    'hi_IN' = 1081,
    'hu_HU' = 1038,
    'is_IS' = 1039,
    'ig_NG' = 1136,
    'id_ID' = 1057,
    'iu_CA_Latn' = 2141,
    'iu_CA_Cans' = 1117,
    'ga_IE' = 2108,
    'xh_ZA' = 1076,
    'zu_ZA' = 1077,
    'it_IT' = 1040,
    'it_CH' = 2064,
    'ja_JP' = 1041,
    'kn_IN' = 1099,
    'kk_KZ' = 1087,
    'km_KH' = 1107,
    'quc_GT' = 1158,
    'rw_RW' = 1159,
    'sw_KE' = 1089,
    'kok_IN' = 1111,
    'ko_KR' = 1042,
    'ky_KG' = 1088,
    'lo_LA' = 1108,
    'lv_LV' = 1062,
    'lt_LT' = 1063,
    'dsb_DE' = 2094,
    'lb_LU' = 1134,
    'mk_MK' = 1071,
    'ms_MY' = 1086,
    'ms_BN' = 2110,
    'ml_IN' = 1100,
    'mt_MT' = 1082,
    'mi_NZ' = 1153,
    'arn_CL' = 1146,
    'mr_IN' = 1102,
    'mn_MN' = 1104,
    'mn_CN' = 2128,
    'ne_NP' = 1121,
    'nb_NO' = 1044,
    'nn_NO' = 2068,
    'oc_FR' = 1154,
    'or_IN' = 1096,
    'ps_AF' = 1123,
    'fa_IR' = 1065,
    'pl_PL' = 1045,
    'pt_BR' = 1046,
    'pt_PT' = 2070,
    'pa_IN' = 1094,
    'quz_BO' = 1131,
    'quz_EC' = 2155,
    'quz_PE' = 3179,
    'ro_RO' = 1048,
    'rm_CH' = 1047,
    'ru_RU' = 1049,
    'smn_FI' = 9275,
    'smj_NO' = 4155,
    'smj_SE' = 5179,
    'se_NO' = 3131,
    'se_SE' = 1083,
    'se_FI' = 2107,
    'sms_FI' = 8251,
    'sma_NO' = 6203,
    'sma_SE' = 7227,
    'sa_IN' = 1103,
    'sr_SP_Cyrl' = 3098,
    'sr_SP_Latn' = 2074,
    'sr_BA_Cyrl' = 7194,
    'sr_BA_Latn' = 5146,
    'nso_ZA' = 1132,
    'tn_ZA' = 1074,
    'si_LK' = 1115,
    'sk_SK' = 1051,
    'sl_SI' = 1060,
    'es_ES_tradnl' = 1034,
    'es_MX' = 2058,
    'es_ES' = 3082,
    'es_GT' = 4106,
    'es_CR' = 5130,
    'es_PA' = 6154,
    'es_DO' = 7178,
    'es_VE' = 8202,
    'es_CO' = 9226,
    'es_PE' = 10250,
    'es_AR' = 11274,
    'es_EC' = 12298,
    'es_CL' = 13322,
    'es_UY' = 14346,
    'es_PY' = 15370,
    'es_BO' = 16394,
    'es_SV' = 17418,
    'es_HN' = 18442,
    'es_NI' = 19466,
    'es_PR' = 20490,
    'es_US' = 21514,
    'sv_SE' = 1053,
    'sv_FI' = 2077,
    'syr_SY' = 1114,
    'tg_TJ_Cyrl' = 1064,
    'ta_IN' = 1097,
    'tt_RU' = 1092,
    'te_IN' = 1098,
    'th_TH' = 1054,
    'bo_CN' = 1105,
    'ti_ER' = 2163,
    'ti_ET' = 1139,
    'ts_ZA' = 1073,
    'tr_TR' = 1055,
    'tk_TM' = 1090,
    'uk_UA' = 1058,
    'hsb_DE' = 1070,
    'ur_PK' = 1056,
    'ug_CN' = 1152,
    'uz_UZ_Latn' = 1091,
    'uz_UZ_Cyrl' = 2115,
    'vi_VN' = 1066,
    'cy_GB' = 1106,
    'wo_SN' = 1160,
    'sah_RU' = 1157,
    'ii_CN' = 1144,
    'yo_NG' = 1130,
}

/**
 * BCP-47 (hyphen) tag for a known LCID.
 *
 * @private
 */
const LCID_TO_BCP47: { [lcid: number]: string } = {};
/**
 * LCID for a BCP-47 tag (lowercased).
 *
 * @private
 */
const BCP47_TO_LCID: { [tag: string]: LocaleIDs } = {};

(function buildLocaleIndex(): void {
    function add(id: LocaleIDs, tag: string): void {
        LCID_TO_BCP47[id as number] = tag;
        BCP47_TO_LCID[tag.toLowerCase()] = id;
    }

    add(LocaleIDs.af_ZA, 'af-ZA');
    add(LocaleIDs.sq_AL, 'sq-AL');
    add(LocaleIDs.am_ET, 'am-ET');
    add(LocaleIDs.ar_SA, 'ar-SA');
    add(LocaleIDs.ar_IQ, 'ar-IQ');
    add(LocaleIDs.ar_EG, 'ar-EG');
    add(LocaleIDs.ar_LY, 'ar-LY');
    add(LocaleIDs.ar_DZ, 'ar-DZ');
    add(LocaleIDs.ar_MA, 'ar-MA');
    add(LocaleIDs.ar_TN, 'ar-TN');
    add(LocaleIDs.ar_OM, 'ar-OM');
    add(LocaleIDs.ar_YE, 'ar-YE');
    add(LocaleIDs.ar_SY, 'ar-SY');
    add(LocaleIDs.ar_JO, 'ar-JO');
    add(LocaleIDs.ar_LB, 'ar-LB');
    add(LocaleIDs.ar_KW, 'ar-KW');
    add(LocaleIDs.ar_AE, 'ar-AE');
    add(LocaleIDs.ar_BH, 'ar-BH');
    add(LocaleIDs.ar_QA, 'ar-QA');
    add(LocaleIDs.hy_AM, 'hy-AM');
    add(LocaleIDs.as_IN, 'as-IN');
    add(LocaleIDs.az_AZ_Latn, 'az-Latn-AZ');
    add(LocaleIDs.az_AZ_Cyrl, 'az-Cyrl-AZ');
    add(LocaleIDs.eu_ES, 'eu-ES');
    add(LocaleIDs.be_BY, 'be-BY');
    add(LocaleIDs.bn_IN, 'bn-IN');
    add(LocaleIDs.bn_BD, 'bn-BD');
    add(LocaleIDs.bs_BA_Latn, 'bs-Latn-BA');
    add(LocaleIDs.bs_BA_Cyrl, 'bs-Cyrl-BA');
    add(LocaleIDs.bg_BG, 'bg-BG');
    add(LocaleIDs.my_MM, 'my-MM');
    add(LocaleIDs.ca_ES, 'ca-ES');
    add(LocaleIDs.zh_TW, 'zh-TW');
    add(LocaleIDs.zh_CN, 'zh-CN');
    add(LocaleIDs.zh_HK, 'zh-HK');
    add(LocaleIDs.zh_SG, 'zh-SG');
    add(LocaleIDs.zh_MO, 'zh-MO');
    add(LocaleIDs.hr_HR, 'hr-HR');
    add(LocaleIDs.hr_BA, 'hr-BA');
    add(LocaleIDs.cs_CZ, 'cs-CZ');
    add(LocaleIDs.da_DK, 'da-DK');
    add(LocaleIDs.prs_AF, 'prs-AF');
    add(LocaleIDs.dv_MV, 'dv-MV');
    add(LocaleIDs.nl_NL, 'nl-NL');
    add(LocaleIDs.nl_BE, 'nl-BE');
    add(LocaleIDs.en_US, 'en-US');
    add(LocaleIDs.en_GB, 'en-GB');
    add(LocaleIDs.en_AU, 'en-AU');
    add(LocaleIDs.en_CA, 'en-CA');
    add(LocaleIDs.en_NZ, 'en-NZ');
    add(LocaleIDs.en_IE, 'en-IE');
    add(LocaleIDs.en_ZA, 'en-ZA');
    add(LocaleIDs.en_JM, 'en-JM');
    add(LocaleIDs.en_CB, 'en-029');
    add(LocaleIDs.en_BZ, 'en-BZ');
    add(LocaleIDs.en_TT, 'en-TT');
    add(LocaleIDs.en_ZW, 'en-ZW');
    add(LocaleIDs.en_PH, 'en-PH');
    add(LocaleIDs.en_IN, 'en-IN');
    add(LocaleIDs.en_MY, 'en-MY');
    add(LocaleIDs.en_SG, 'en-SG');
    add(LocaleIDs.et_EE, 'et-EE');
    add(LocaleIDs.fo_FO, 'fo-FO');
    add(LocaleIDs.fil_PH, 'fil-PH');
    add(LocaleIDs.fi_FI, 'fi-FI');
    add(LocaleIDs.fr_FR, 'fr-FR');
    add(LocaleIDs.fr_BE, 'fr-BE');
    add(LocaleIDs.fr_CA, 'fr-CA');
    add(LocaleIDs.fr_CH, 'fr-CH');
    add(LocaleIDs.fr_LU, 'fr-LU');
    add(LocaleIDs.fr_MC, 'fr-MC');
    add(LocaleIDs.fy_NL, 'fy-NL');
    add(LocaleIDs.gl_ES, 'gl-ES');
    add(LocaleIDs.ka_GE, 'ka-GE');
    add(LocaleIDs.de_DE, 'de-DE');
    add(LocaleIDs.de_CH, 'de-CH');
    add(LocaleIDs.de_AT, 'de-AT');
    add(LocaleIDs.de_LU, 'de-LU');
    add(LocaleIDs.de_LI, 'de-LI');
    add(LocaleIDs.el_GR, 'el-GR');
    add(LocaleIDs.gu_IN, 'gu-IN');
    add(LocaleIDs.ha_NG_Latn, 'ha-Latn-NG');
    add(LocaleIDs.he_IL, 'he-IL');
    add(LocaleIDs.hi_IN, 'hi-IN');
    add(LocaleIDs.hu_HU, 'hu-HU');
    add(LocaleIDs.is_IS, 'is-IS');
    add(LocaleIDs.ig_NG, 'ig-NG');
    add(LocaleIDs.id_ID, 'id-ID');
    add(LocaleIDs.iu_CA_Latn, 'iu-Latn-CA');
    add(LocaleIDs.iu_CA_Cans, 'iu-Cans-CA');
    add(LocaleIDs.ga_IE, 'ga-IE');
    add(LocaleIDs.xh_ZA, 'xh-ZA');
    add(LocaleIDs.zu_ZA, 'zu-ZA');
    add(LocaleIDs.it_IT, 'it-IT');
    add(LocaleIDs.it_CH, 'it-CH');
    add(LocaleIDs.ja_JP, 'ja-JP');
    add(LocaleIDs.kn_IN, 'kn-IN');
    add(LocaleIDs.kk_KZ, 'kk-KZ');
    add(LocaleIDs.km_KH, 'km-KH');
    add(LocaleIDs.quc_GT, 'quc-GT');
    add(LocaleIDs.rw_RW, 'rw-RW');
    add(LocaleIDs.sw_KE, 'sw-KE');
    add(LocaleIDs.kok_IN, 'kok-IN');
    add(LocaleIDs.ko_KR, 'ko-KR');
    add(LocaleIDs.ky_KG, 'ky-KG');
    add(LocaleIDs.lo_LA, 'lo-LA');
    add(LocaleIDs.lv_LV, 'lv-LV');
    add(LocaleIDs.lt_LT, 'lt-LT');
    add(LocaleIDs.dsb_DE, 'dsb-DE');
    add(LocaleIDs.lb_LU, 'lb-LU');
    add(LocaleIDs.mk_MK, 'mk-MK');
    add(LocaleIDs.ms_MY, 'ms-MY');
    add(LocaleIDs.ms_BN, 'ms-BN');
    add(LocaleIDs.ml_IN, 'ml-IN');
    add(LocaleIDs.mt_MT, 'mt-MT');
    add(LocaleIDs.mi_NZ, 'mi-NZ');
    add(LocaleIDs.arn_CL, 'arn-CL');
    add(LocaleIDs.mr_IN, 'mr-IN');
    add(LocaleIDs.mn_MN, 'mn-MN');
    add(LocaleIDs.mn_CN, 'mn-Mong-CN');
    add(LocaleIDs.ne_NP, 'ne-NP');
    add(LocaleIDs.nb_NO, 'nb-NO');
    add(LocaleIDs.nn_NO, 'nn-NO');
    add(LocaleIDs.oc_FR, 'oc-FR');
    add(LocaleIDs.or_IN, 'or-IN');
    add(LocaleIDs.ps_AF, 'ps-AF');
    add(LocaleIDs.fa_IR, 'fa-IR');
    add(LocaleIDs.pl_PL, 'pl-PL');
    add(LocaleIDs.pt_BR, 'pt-BR');
    add(LocaleIDs.pt_PT, 'pt-PT');
    add(LocaleIDs.pa_IN, 'pa-IN');
    add(LocaleIDs.quz_BO, 'quz-BO');
    add(LocaleIDs.quz_EC, 'quz-EC');
    add(LocaleIDs.quz_PE, 'quz-PE');
    add(LocaleIDs.ro_RO, 'ro-RO');
    add(LocaleIDs.rm_CH, 'rm-CH');
    add(LocaleIDs.ru_RU, 'ru-RU');
    add(LocaleIDs.smn_FI, 'smn-FI');
    add(LocaleIDs.smj_NO, 'smj-NO');
    add(LocaleIDs.smj_SE, 'smj-SE');
    add(LocaleIDs.se_NO, 'se-NO');
    add(LocaleIDs.se_SE, 'se-SE');
    add(LocaleIDs.se_FI, 'se-FI');
    add(LocaleIDs.sms_FI, 'sms-FI');
    add(LocaleIDs.sma_NO, 'sma-NO');
    add(LocaleIDs.sma_SE, 'sma-SE');
    add(LocaleIDs.sa_IN, 'sa-IN');
    add(LocaleIDs.sr_SP_Cyrl, 'sr-Cyrl-CS');
    add(LocaleIDs.sr_SP_Latn, 'sr-Latn-CS');
    add(LocaleIDs.sr_BA_Cyrl, 'sr-Cyrl-BA');
    add(LocaleIDs.sr_BA_Latn, 'sr-Latn-BA');
    add(LocaleIDs.nso_ZA, 'nso-ZA');
    add(LocaleIDs.tn_ZA, 'tn-ZA');
    add(LocaleIDs.si_LK, 'si-LK');
    add(LocaleIDs.sk_SK, 'sk-SK');
    add(LocaleIDs.sl_SI, 'sl-SI');
    add(LocaleIDs.es_ES_tradnl, 'es-ES_tradnl');
    add(LocaleIDs.es_MX, 'es-MX');
    add(LocaleIDs.es_ES, 'es-ES');
    add(LocaleIDs.es_GT, 'es-GT');
    add(LocaleIDs.es_CR, 'es-CR');
    add(LocaleIDs.es_PA, 'es-PA');
    add(LocaleIDs.es_DO, 'es-DO');
    add(LocaleIDs.es_VE, 'es-VE');
    add(LocaleIDs.es_CO, 'es-CO');
    add(LocaleIDs.es_PE, 'es-PE');
    add(LocaleIDs.es_AR, 'es-AR');
    add(LocaleIDs.es_EC, 'es-EC');
    add(LocaleIDs.es_CL, 'es-CL');
    add(LocaleIDs.es_UY, 'es-UY');
    add(LocaleIDs.es_PY, 'es-PY');
    add(LocaleIDs.es_BO, 'es-BO');
    add(LocaleIDs.es_SV, 'es-SV');
    add(LocaleIDs.es_HN, 'es-HN');
    add(LocaleIDs.es_NI, 'es-NI');
    add(LocaleIDs.es_PR, 'es-PR');
    add(LocaleIDs.es_US, 'es-US');
    add(LocaleIDs.sv_SE, 'sv-SE');
    add(LocaleIDs.sv_FI, 'sv-FI');
    add(LocaleIDs.syr_SY, 'syr-SY');
    add(LocaleIDs.tg_TJ_Cyrl, 'tg-Cyrl-TJ');
    add(LocaleIDs.ta_IN, 'ta-IN');
    add(LocaleIDs.tt_RU, 'tt-RU');
    add(LocaleIDs.te_IN, 'te-IN');
    add(LocaleIDs.th_TH, 'th-TH');
    add(LocaleIDs.bo_CN, 'bo-CN');
    add(LocaleIDs.ti_ER, 'ti-ER');
    add(LocaleIDs.ti_ET, 'ti-ET');
    add(LocaleIDs.ts_ZA, 'ts-ZA');
    add(LocaleIDs.tr_TR, 'tr-TR');
    add(LocaleIDs.tk_TM, 'tk-TM');
    add(LocaleIDs.uk_UA, 'uk-UA');
    add(LocaleIDs.hsb_DE, 'hsb-DE');
    add(LocaleIDs.ur_PK, 'ur-PK');
    add(LocaleIDs.ug_CN, 'ug-CN');
    add(LocaleIDs.uz_UZ_Latn, 'uz-Latn-UZ');
    add(LocaleIDs.uz_UZ_Cyrl, 'uz-Cyrl-UZ');
    add(LocaleIDs.vi_VN, 'vi-VN');
    add(LocaleIDs.cy_GB, 'cy-GB');
    add(LocaleIDs.wo_SN, 'wo-SN');
    add(LocaleIDs.sah_RU, 'sah-RU');
    add(LocaleIDs.ii_CN, 'ii-CN');
    add(LocaleIDs.yo_NG, 'yo-NG');

    // Common aliases.
    BCP47_TO_LCID['sr-cyrl-rs'] = LocaleIDs.sr_SP_Cyrl;
    BCP47_TO_LCID['sr-latn-rs'] = LocaleIDs.sr_SP_Latn;
    BCP47_TO_LCID['az-az'] = LocaleIDs.az_AZ_Latn;
    BCP47_TO_LCID['zh-chs'] = LocaleIDs.zh_CN;
    BCP47_TO_LCID['zh-cht'] = LocaleIDs.zh_TW;
    BCP47_TO_LCID['zh-hans'] = LocaleIDs.zh_CN;
    BCP47_TO_LCID['zh-hant'] = LocaleIDs.zh_TW;
})();

/**
 * Convert a `w:lang` BCP-47 value to {@link LocaleIDs}.
 * Unknown tags return {@link LocaleIDs.None}.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {LocaleIDs} The result.
 * @private
 */
export function localeIdFromBcp47(raw: string | undefined): LocaleIDs {
    if (raw === undefined) {
        return LocaleIDs.None;
    }
    const t: string = raw.trim();
    if (t.length === 0) {
        return LocaleIDs.None;
    }
    const key: string = t.replace(/_/g, '-').toLowerCase();
    const found: LocaleIDs = ownGet(BCP47_TO_LCID, key);
    if (found !== undefined) {
        return found;
    }
    // Language-only fallback (en → en-US preference when unique is hard; try exact primary).
    const primary: string = key.split('-')[0];
    if (primary === 'en') {
        return LocaleIDs.en_US;
    }
    if (primary === 'ar') {
        return LocaleIDs.ar_SA;
    }
    if (primary === 'he' || primary === 'iw') {
        return LocaleIDs.he_IL;
    }
    if (primary === 'ja') {
        return LocaleIDs.ja_JP;
    }
    if (primary === 'zh') {
        return LocaleIDs.zh_CN;
    }
    return LocaleIDs.None;
}

/**
 * Convert {@link LocaleIDs} to the BCP-47 string written on `w:lang`.
 * {@link LocaleIDs.None} returns `undefined` (omit attribute).
 *
 * @param {LocaleIDs} id - The id.
 * @returns {string | undefined} The result.
 * @private
 */
export function localeIdToBcp47(id: LocaleIDs): string | undefined {
    if (id === LocaleIDs.None) {
        return undefined;
    }
    return LCID_TO_BCP47[id as number];
}
