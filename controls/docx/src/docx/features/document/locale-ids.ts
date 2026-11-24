import { ownGet } from '../../core/compat/object-compat';
/**
 * Specifies the locale identifiers that can be assigned to text.
 *
 * @public
 */
export enum LocaleIDs {
    /** Unspecified / cleared language. */
    None = 0,

    /** Specifies the Afrikaans (South Africa) locale. */
    'af_ZA' = 1078,
    /** Specifies the Albanian (Albania) locale. */
    'sq_AL' = 1052,
    /** Specifies the Amharic (Ethiopia) locale. */
    'am_ET' = 1118,
    /** Specifies the Arabic (Saudi Arabia) locale. */
    'ar_SA' = 1025,
    /** Specifies the Arabic (Iraq) locale. */
    'ar_IQ' = 2049,
    /** Specifies the Arabic (Egypt) locale. */
    'ar_EG' = 3073,
    /** Specifies the Arabic (Libya) locale. */
    'ar_LY' = 4097,
    /** Specifies the Arabic (Algeria) locale. */
    'ar_DZ' = 5121,
    /** Specifies the Arabic (Morocco) locale. */
    'ar_MA' = 6145,
    /** Specifies the Arabic (Tunisia) locale. */
    'ar_TN' = 7169,
    /** Specifies the Arabic (Oman) locale. */
    'ar_OM' = 8193,
    /** Specifies the Arabic (Yemen) locale. */
    'ar_YE' = 9217,
    /** Specifies the Arabic (Syria) locale. */
    'ar_SY' = 10241,
    /** Specifies the Arabic (Jordan) locale. */
    'ar_JO' = 11265,
    /** Specifies the Arabic (Lebanon) locale. */
    'ar_LB' = 12289,
    /** Specifies the Arabic (Kuwait) locale. */
    'ar_KW' = 13313,
    /** Specifies the Arabic (United Arab Emirates) locale. */
    'ar_AE' = 14337,
    /** Specifies the Arabic (Bahrain) locale. */
    'ar_BH' = 15361,
    /** Specifies the Arabic (Qatar) locale. */
    'ar_QA' = 16385,
    /** Specifies the Armenian (Armenia) locale. */
    'hy_AM' = 1067,
    /** Specifies the Assamese (India) locale. */
    'as_IN' = 1101,
    /** Specifies the Azerbaijani (Latin, Azerbaijan) locale. */
    'az_AZ_Latn' = 1068,
    /** Specifies the Azerbaijani (Cyrillic, Azerbaijan) locale. */
    'az_AZ_Cyrl' = 2092,
    /** Specifies the Basque (Spain) locale. */
    'eu_ES' = 1069,
    /** Specifies the Belarusian (Belarus) locale. */
    'be_BY' = 1059,
    /** Specifies the Bangla (India) locale. */
    'bn_IN' = 1093,
    /** Specifies the Bangla (Bangladesh) locale. */
    'bn_BD' = 2117,
    /** Specifies the Bosnian (Latin, Bosnia and Herzegovina) locale. */
    'bs_BA_Latn' = 5146,
    /** Specifies the Bosnian (Cyrillic, Bosnia and Herzegovina) locale. */
    'bs_BA_Cyrl' = 8218,
    /** Specifies the Bulgarian (Bulgaria) locale. */
    'bg_BG' = 1026,
    /** Specifies the Burmese (Myanmar (Burma)) locale. */
    'my_MM' = 1109,
    /** Specifies the Catalan (Spain) locale. */
    'ca_ES' = 1027,
    /** Specifies the Chinese (Taiwan) locale. */
    'zh_TW' = 1028,
    /** Specifies the Chinese (China) locale. */
    'zh_CN' = 2052,
    /** Specifies the Chinese (Hong Kong SAR China) locale. */
    'zh_HK' = 3076,
    /** Specifies the Chinese (Singapore) locale. */
    'zh_SG' = 4100,
    /** Specifies the Chinese (Macao SAR China) locale. */
    'zh_MO' = 5124,
    /** Specifies the Croatian (Croatia) locale. */
    'hr_HR' = 1050,
    /** Specifies the Croatian (Bosnia and Herzegovina) locale. */
    'hr_BA' = 4122,
    /** Specifies the Czech (Czechia) locale. */
    'cs_CZ' = 1029,
    /** Specifies the Danish (Denmark) locale. */
    'da_DK' = 1030,
    /** Specifies the Dari (Afghanistan) locale. */
    'prs_AF' = 1164,
    /** Specifies the Divehi (Maldives) locale. */
    'dv_MV' = 1125,
    /** Specifies the Dutch (Netherlands) locale. */
    'nl_NL' = 1043,
    /** Specifies the Dutch (Belgium) locale. */
    'nl_BE' = 2067,
    /** Specifies the English (United States) locale. */
    'en_US' = 1033,
    /** Specifies the English (United Kingdom) locale. */
    'en_GB' = 2057,
    /** Specifies the English (Australia) locale. */
    'en_AU' = 3081,
    /** Specifies the English (Canada) locale. */
    'en_CA' = 4105,
    /** Specifies the English (New Zealand) locale. */
    'en_NZ' = 5129,
    /** Specifies the English (Ireland) locale. */
    'en_IE' = 6153,
    /** Specifies the English (South Africa) locale. */
    'en_ZA' = 7177,
    /** Specifies the English (Jamaica) locale. */
    'en_JM' = 8201,
    /** Specifies the English (Caribbean) locale. */
    'en_CB' = 9225,
    /** Specifies the English (Belize) locale. */
    'en_BZ' = 10249,
    /** Specifies the English (Trinidad and Tobago) locale. */
    'en_TT' = 11273,
    /** Specifies the English (Zimbabwe) locale. */
    'en_ZW' = 12297,
    /** Specifies the English (Philippines) locale. */
    'en_PH' = 13321,
    /** Specifies the English (India) locale. */
    'en_IN' = 16393,
    /** Specifies the English (Malaysia) locale. */
    'en_MY' = 17417,
    /** Specifies the English (Singapore) locale. */
    'en_SG' = 18441,
    /** Specifies the Estonian (Estonia) locale. */
    'et_EE' = 1061,
    /** Specifies the Faroese (Faroe Islands) locale. */
    'fo_FO' = 1080,
    /** Specifies the Filipino (Philippines) locale. */
    'fil_PH' = 1124,
    /** Specifies the Finnish (Finland) locale. */
    'fi_FI' = 1035,
    /** Specifies the French (France) locale. */
    'fr_FR' = 1036,
    /** Specifies the French (Belgium) locale. */
    'fr_BE' = 2060,
    /** Specifies the French (Canada) locale. */
    'fr_CA' = 3084,
    /** Specifies the French (Switzerland) locale. */
    'fr_CH' = 4108,
    /** Specifies the French (Luxembourg) locale. */
    'fr_LU' = 5132,
    /** Specifies the French (Monaco) locale. */
    'fr_MC' = 6156,
    /** Specifies the Western Frisian (Netherlands) locale. */
    'fy_NL' = 1122,
    /** Specifies the Galician (Spain) locale. */
    'gl_ES' = 1110,
    /** Specifies the Georgian (Georgia) locale. */
    'ka_GE' = 1079,
    /** Specifies the German (Germany) locale. */
    'de_DE' = 1031,
    /** Specifies the German (Switzerland) locale. */
    'de_CH' = 2055,
    /** Specifies the German (Austria) locale. */
    'de_AT' = 3079,
    /** Specifies the German (Luxembourg) locale. */
    'de_LU' = 4103,
    /** Specifies the German (Liechtenstein) locale. */
    'de_LI' = 5127,
    /** Specifies the Greek (Greece) locale. */
    'el_GR' = 1032,
    /** Specifies the Gujarati (India) locale. */
    'gu_IN' = 1095,
    /** Specifies the Hausa (Latin, Nigeria) locale. */
    'ha_NG_Latn' = 1128,
    /** Specifies the Hebrew (Israel) locale. */
    'he_IL' = 1037,
    /** Specifies the Hindi (India) locale. */
    'hi_IN' = 1081,
    /** Specifies the Hungarian (Hungary) locale. */
    'hu_HU' = 1038,
    /** Specifies the Icelandic (Iceland) locale. */
    'is_IS' = 1039,
    /** Specifies the Igbo (Nigeria) locale. */
    'ig_NG' = 1136,
    /** Specifies the Indonesian (Indonesia) locale. */
    'id_ID' = 1057,
    /** Specifies the Inuktitut (Latin, Canada) locale. */
    'iu_CA_Latn' = 2141,
    /** Specifies the Inuktitut (Unified Canadian Aboriginal Syllabics, Canada) locale. */
    'iu_CA_Cans' = 1117,
    /** Specifies the Irish (Ireland) locale. */
    'ga_IE' = 2108,
    /** Specifies the Xhosa (South Africa) locale. */
    'xh_ZA' = 1076,
    /** Specifies the Zulu (South Africa) locale. */
    'zu_ZA' = 1077,
    /** Specifies the Italian (Italy) locale. */
    'it_IT' = 1040,
    /** Specifies the Italian (Switzerland) locale. */
    'it_CH' = 2064,
    /** Specifies the Japanese (Japan) locale. */
    'ja_JP' = 1041,
    /** Specifies the Kannada (India) locale. */
    'kn_IN' = 1099,
    /** Specifies the Kazakh (Kazakhstan) locale. */
    'kk_KZ' = 1087,
    /** Specifies the Khmer (Cambodia) locale. */
    'km_KH' = 1107,
    /** Specifies the Kʼicheʼ (Guatemala) locale. */
    'quc_GT' = 1158,
    /** Specifies the Kinyarwanda (Rwanda) locale. */
    'rw_RW' = 1159,
    /** Specifies the Swahili (Kenya) locale. */
    'sw_KE' = 1089,
    /** Specifies the Konkani (India) locale. */
    'kok_IN' = 1111,
    /** Specifies the Korean (South Korea) locale. */
    'ko_KR' = 1042,
    /** Specifies the Kyrgyz (Kyrgyzstan) locale. */
    'ky_KG' = 1088,
    /** Specifies the Lao (Laos) locale. */
    'lo_LA' = 1108,
    /** Specifies the Latvian (Latvia) locale. */
    'lv_LV' = 1062,
    /** Specifies the Lithuanian (Lithuania) locale. */
    'lt_LT' = 1063,
    /** Specifies the Lower Sorbian (Germany) locale. */
    'dsb_DE' = 2094,
    /** Specifies the Luxembourgish (Luxembourg) locale. */
    'lb_LU' = 1134,
    /** Specifies the Macedonian (North Macedonia) locale. */
    'mk_MK' = 1071,
    /** Specifies the Malay (Malaysia) locale. */
    'ms_MY' = 1086,
    /** Specifies the Malay (Brunei) locale. */
    'ms_BN' = 2110,
    /** Specifies the Malayalam (India) locale. */
    'ml_IN' = 1100,
    /** Specifies the Maltese (Malta) locale. */
    'mt_MT' = 1082,
    /** Specifies the Māori (New Zealand) locale. */
    'mi_NZ' = 1153,
    /** Specifies the Mapuche (Chile) locale. */
    'arn_CL' = 1146,
    /** Specifies the Marathi (India) locale. */
    'mr_IN' = 1102,
    /** Specifies the Mongolian (Mongolia) locale. */
    'mn_MN' = 1104,
    /** Specifies the Mongolian (China) locale. */
    'mn_CN' = 2128,
    /** Specifies the Nepali (Nepal) locale. */
    'ne_NP' = 1121,
    /** Specifies the Norwegian Bokmål (Norway) locale. */
    'nb_NO' = 1044,
    /** Specifies the Norwegian Nynorsk (Norway) locale. */
    'nn_NO' = 2068,
    /** Specifies the Occitan (France) locale. */
    'oc_FR' = 1154,
    /** Specifies the Odia (India) locale. */
    'or_IN' = 1096,
    /** Specifies the Pashto (Afghanistan) locale. */
    'ps_AF' = 1123,
    /** Specifies the Persian (Iran) locale. */
    'fa_IR' = 1065,
    /** Specifies the Polish (Poland) locale. */
    'pl_PL' = 1045,
    /** Specifies the Portuguese (Brazil) locale. */
    'pt_BR' = 1046,
    /** Specifies the Portuguese (Portugal) locale. */
    'pt_PT' = 2070,
    /** Specifies the Punjabi (India) locale. */
    'pa_IN' = 1094,
    /** Specifies the Quechua (Bolivia) locale. */
    'quz_BO' = 1131,
    /** Specifies the Quechua (Ecuador) locale. */
    'quz_EC' = 2155,
    /** Specifies the Quechua (Peru) locale. */
    'quz_PE' = 3179,
    /** Specifies the Romanian (Romania) locale. */
    'ro_RO' = 1048,
    /** Specifies the Romansh (Switzerland) locale. */
    'rm_CH' = 1047,
    /** Specifies the Russian (Russia) locale. */
    'ru_RU' = 1049,
    /** Specifies the Inari Sami (Finland) locale. */
    'smn_FI' = 9275,
    /** Specifies the Lule Sami (Norway) locale. */
    'smj_NO' = 4155,
    /** Specifies the Lule Sami (Sweden) locale. */
    'smj_SE' = 5179,
    /** Specifies the Northern Sami (Norway) locale. */
    'se_NO' = 3131,
    /** Specifies the Northern Sami (Sweden) locale. */
    'se_SE' = 1083,
    /** Specifies the Northern Sami (Finland) locale. */
    'se_FI' = 2107,
    /** Specifies the Skolt Sami (Finland) locale. */
    'sms_FI' = 8251,
    /** Specifies the Southern Sami (Norway) locale. */
    'sma_NO' = 6203,
    /** Specifies the Southern Sami (Sweden) locale. */
    'sma_SE' = 7227,
    /** Specifies the Sanskrit (India) locale. */
    'sa_IN' = 1103,
    /** Specifies the Serbian (Cyrillic, Serbia) locale. */
    'sr_SP_Cyrl' = 3098,
    /** Specifies the Serbian (Latin, Serbia) locale. */
    'sr_SP_Latn' = 2074,
    /** Specifies the Serbian (Cyrillic, Bosnia and Herzegovina) locale. */
    'sr_BA_Cyrl' = 7194,
    /** Specifies the Serbian (Latin, Bosnia and Herzegovina) locale. */
    'sr_BA_Latn' = 5146,
    /** Specifies the Northern Sotho (South Africa) locale. */
    'nso_ZA' = 1132,
    /** Specifies the Tswana (South Africa) locale. */
    'tn_ZA' = 1074,
    /** Specifies the Sinhala (Sri Lanka) locale. */
    'si_LK' = 1115,
    /** Specifies the Slovak (Slovakia) locale. */
    'sk_SK' = 1051,
    /** Specifies the Slovenian (Slovenia) locale. */
    'sl_SI' = 1060,
    /** Specifies the Spanish (Spain, Traditional Sort) locale. */
    'es_ES_tradnl' = 1034,
    /** Specifies the Spanish (Mexico) locale. */
    'es_MX' = 2058,
    /** Specifies the Spanish (Spain) locale. */
    'es_ES' = 3082,
    /** Specifies the Spanish (Guatemala) locale. */
    'es_GT' = 4106,
    /** Specifies the Spanish (Costa Rica) locale. */
    'es_CR' = 5130,
    /** Specifies the Spanish (Panama) locale. */
    'es_PA' = 6154,
    /** Specifies the Spanish (Dominican Republic) locale. */
    'es_DO' = 7178,
    /** Specifies the Spanish (Venezuela) locale. */
    'es_VE' = 8202,
    /** Specifies the Spanish (Colombia) locale. */
    'es_CO' = 9226,
    /** Specifies the Spanish (Peru) locale. */
    'es_PE' = 10250,
    /** Specifies the Spanish (Argentina) locale. */
    'es_AR' = 11274,
    /** Specifies the Spanish (Ecuador) locale. */
    'es_EC' = 12298,
    /** Specifies the Spanish (Chile) locale. */
    'es_CL' = 13322,
    /** Specifies the Spanish (Uruguay) locale. */
    'es_UY' = 14346,
    /** Specifies the Spanish (Paraguay) locale. */
    'es_PY' = 15370,
    /** Specifies the Spanish (Bolivia) locale. */
    'es_BO' = 16394,
    /** Specifies the Spanish (El Salvador) locale. */
    'es_SV' = 17418,
    /** Specifies the Spanish (Honduras) locale. */
    'es_HN' = 18442,
    /** Specifies the Spanish (Nicaragua) locale. */
    'es_NI' = 19466,
    /** Specifies the Spanish (Puerto Rico) locale. */
    'es_PR' = 20490,
    /** Specifies the Spanish (United States) locale. */
    'es_US' = 21514,
    /** Specifies the Swedish (Sweden) locale. */
    'sv_SE' = 1053,
    /** Specifies the Swedish (Finland) locale. */
    'sv_FI' = 2077,
    /** Specifies the Syriac (Syria) locale. */
    'syr_SY' = 1114,
    /** Specifies the Tajik (Cyrillic, Tajikistan) locale. */
    'tg_TJ_Cyrl' = 1064,
    /** Specifies the Tamil (India) locale. */
    'ta_IN' = 1097,
    /** Specifies the Tatar (Russia) locale. */
    'tt_RU' = 1092,
    /** Specifies the Telugu (India) locale. */
    'te_IN' = 1098,
    /** Specifies the Thai (Thailand) locale. */
    'th_TH' = 1054,
    /** Specifies the Tibetan (China) locale. */
    'bo_CN' = 1105,
    /** Specifies the Tigrinya (Eritrea) locale. */
    'ti_ER' = 2163,
    /** Specifies the Tigrinya (Ethiopia) locale. */
    'ti_ET' = 1139,
    /** Specifies the Tsonga (South Africa) locale. */
    'ts_ZA' = 1073,
    /** Specifies the Turkish (Türkiye) locale. */
    'tr_TR' = 1055,
    /** Specifies the Turkmen (Turkmenistan) locale. */
    'tk_TM' = 1090,
    /** Specifies the Ukrainian (Ukraine) locale. */
    'uk_UA' = 1058,
    /** Specifies the Upper Sorbian (Germany) locale. */
    'hsb_DE' = 1070,
    /** Specifies the Urdu (Pakistan) locale. */
    'ur_PK' = 1056,
    /** Specifies the Uyghur (China) locale. */
    'ug_CN' = 1152,
    /** Specifies the Uzbek (Latin, Uzbekistan) locale. */
    'uz_UZ_Latn' = 1091,
    /** Specifies the Uzbek (Cyrillic, Uzbekistan) locale. */
    'uz_UZ_Cyrl' = 2115,
    /** Specifies the Vietnamese (Vietnam) locale. */
    'vi_VN' = 1066,
    /** Specifies the Welsh (United Kingdom) locale. */
    'cy_GB' = 1106,
    /** Specifies the Wolof (Senegal) locale. */
    'wo_SN' = 1160,
    /** Specifies the Yakut (Russia) locale. */
    'sah_RU' = 1157,
    /** Specifies the Sichuan Yi (China) locale. */
    'ii_CN' = 1144,
    /** Specifies the Yoruba (Nigeria) locale. */
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
