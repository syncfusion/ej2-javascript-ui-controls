/**
 * Sports data
 */
/* eslint-disable */
export let Metals: Object[] = [
    { valuePath: "Swimming" ,legendVisibility: true, fill: "#DEB887", Sport: "Swimming", Gold: 16, GameImage: 'Swimming.svg', ItemHeight: "180px", ItemWidth: '180px' },
    { valuePath: "Swimming" ,legendVisibility: false, fill: "#5F9EA0", Sport: "Athletics", Gold: 13, GameImage: 'Athletics.svg', ItemHeight: "70px", ItemWidth: '70px' },
    { valuePath: "Gymnastics" ,legendVisibility: true, fill: "#DC143C", Sport: "Gymnastics", Gold: 4, GameImage: 'Gymnastics.svg', ItemHeight: "80px", ItemWidth: '80px' },
    { valuePath: "Gymnastics" ,legendVisibility: false, fill: "#FF8C00", Sport: "Cycling", Gold: 2, GameImage: 'Cycling.svg', ItemHeight: "50px", ItemWidth: '50px' },
    { valuePath: "Wrestling" ,legendVisibility: true, fill: "#E9967A", Sport: "Wrestling", Gold: 2, GameImage: 'Wrestling.svg', ItemHeight: "60px", ItemWidth: '50px' },
    { valuePath: "Basketball" ,legendVisibility: true, fill: "#483D8B", Sport: "Basketball", Gold: 2, GameImage: 'Basketball.svg', ItemHeight: "50px", ItemWidth: '50px' },
    { valuePath: "Boxing" ,legendVisibility: true, fill: "#DAA520", Sport: "Boxing", Gold: 1, GameImage: 'Boxing.svg', ItemHeight: "40px", ItemWidth: '30px' },
    { valuePath: "Tennis" ,legendVisibility: true, fill: "#CD5C5C", Sport: "Tennis", Gold: 1, GameImage: 'Tennis.svg', ItemHeight: "40px", ItemWidth: '40px' },
    { valuePath: "Judo" ,legendVisibility: false, fill: "#556B2F", Sport: "Judo", Gold: 1, GameImage: 'Judo.svg', ItemHeight: "40px", ItemWidth: '40px' },
    { valuePath: "Rowing" ,legendVisibility: false, fill: "#8FBC8F", Sport: "Rowing", Gold: 1, GameImage: 'Rowing.svg', ItemHeight: "40px", ItemWidth: '40px' },
];
export let sportsData: Object[] = [
    {
        Country: 'US', GameName: 'Swimming', GoldMedals: 16, SilverMedals: 9, BronzeMedals: 6,
        TotalMedals: 31, scale: 2, size: '106', GameImage: 'Swimming.png'
    },
    {
        Country: 'US', GameName: 'Track and Field', GoldMedals: 9, SilverMedals: 13, BronzeMedals: 7,
        TotalMedals: 29, scale: 1.5, size: '106', GameImage: 'TrackAndField.png'
    },
    {
        Country: 'US', GameName: 'Gymnastics', GoldMedals: 3, SilverMedals: 1, BronzeMedals: 2,
        TotalMedals: 6, size: '80', scale: 1.2, GameImage: 'Gymnastics.png'
    },
    {
        Country: 'US', GameName: 'Boxing', GoldMedals: 1, SilverMedals: 0, BronzeMedals: 1,
        TotalMedals: 2, size: '38', scale: 0.5, GameImage: 'Boxing.png'
    },
    {
        Country: 'US', GameName: 'Cycling', GoldMedals: 1, SilverMedals: 2, BronzeMedals: 1,
        TotalMedals: 4, size: '58', scale: 0.8, GameImage: 'Cycling.png'
    },
    {
        Country: 'US', GameName: 'Shooting', GoldMedals: 3, SilverMedals: 0, BronzeMedals: 1,
        TotalMedals: 4, size: '46', scale: 0.8, GameImage: 'Shooting.png'
    },
    {
        Country: 'US', GameName: 'Wrestling', GoldMedals: 2, SilverMedals: 0, BronzeMedals: 2,
        TotalMedals: 4, size: '64', scale: 1, GameImage: 'Wrestling.png'
    },
    {
        Country: 'US', GameName: 'Archery', GoldMedals: 0, SilverMedals: 1, BronzeMedals: 0,
        TotalMedals: 1, size: '38', scale: 0.6, GameImage: 'Archery.png'
    },
    {
        Country: 'US', GameName: 'Soccer', GoldMedals: 1, SilverMedals: 0, BronzeMedals: 0,
        TotalMedals: 1, size: '38', scale: 0.6, GameImage: 'Soccer.png'
    },
    {
        Country: 'US', GameName: 'Diving', GoldMedals: 1, SilverMedals: 1, BronzeMedals: 2,
        TotalMedals: 4, size: '46', scale: 0.7, GameImage: 'Diving.png'
    }
];

/**
 * tree map data
 */
/* tslint disable */
export let jobData: Object[] = [
    { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 50 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Marketing', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 55 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 175 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 70 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Management', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Accounts', EmployeesCount: 60 },

    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 43 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 125 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 60 },
    { Category: 'Employees', Country: 'India', JobDescription: 'HR Executives', EmployeesCount: 70 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Accounts', EmployeesCount: 45 },

    { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 30 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Marketing', EmployeesCount: 50 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 65 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 27 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Management', EmployeesCount: 33 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Accounts', EmployeesCount: 55 },

    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'TestersTestersTestersTesters TestersTestersTestersTes', EmployeesCount: 45 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 96 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 55 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'HR Executives', EmployeesCount: 60 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Accounts', EmployeesCount: 30 },

    { Category: 'Employees', Country: 'France', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'France', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 65 },
    { Category: 'Employees', Country: 'France', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 27 },
    { Category: 'Employees', Country: 'France', JobDescription: 'Marketing', EmployeesCount: 50 }

];

export let countryData: Object[] = [
    { Name: 'United States', Capital: 'DC', GDP: 17946 },
    { Name: 'China', Capital: 'Beijing', GDP: 10866 },
    { Name: 'Japan', Capital: 'Tokyo', GDP: 4123 },
    { Name: 'Germany', Capital: 'Frankfurt', GDP: 3355 },
    { Name: 'United Kingdom', Capital: 'London', GDP: 2848 },
    { Name: 'France', Capital: 'Paris', GDP: 2421 },
    { Name: 'India', Capital: 'Delhi', GDP: 1234 },
    { Name: 'India Mumbai', Capital: 'Delhi', GDP: 3456 },
    { Name: 'India Delhi', Capital: 'Delhi', GDP: 5678 },
    { Name: 'India Chennai', Capital: 'Delhi', GDP: 7890 },
    { Name: 'Italy', Capital: 'Rome', GDP: 1814 },
    { Name: 'ItalyRome', Capital: 'Rome', GDP: 1814 },
    { Name: 'ItalyVenice', Capital: 'Venice', GDP: 1814 },
    { Name: 'Brazil', Capital: 'Brazilia', GDP: 1774 },
];

export let jobDataRTL: Object[] = [
    { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 50 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Marketing', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 55 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 175 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 70 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Management', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'USA', JobDescription: 'Accounts', EmployeesCount: 60 },

    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 43 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 125 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 60 },
    { Category: 'Employees', Country: 'India', JobDescription: 'HR Executives', EmployeesCount: 70 },
    { Category: 'Employees', Country: 'India', JobDescription: 'Accounts', EmployeesCount: 45 },

    { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 30 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Marketing', EmployeesCount: 50 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 65 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 27 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Management', EmployeesCount: 33 },
    { Category: 'Employees', Country: 'Germany', JobDescription: 'Accounts', EmployeesCount: 55 },

    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'TestersTestersTestersTesters TestersTestersTestersTes', EmployeesCount: 45 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 96 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 55 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'HR Executives', EmployeesCount: 60 },
    { Category: 'Employees', Country: 'UK', JobDescription: 'Accounts', EmployeesCount: 30 },

    { Category: 'Employees', Country: 'Central America and the caribean', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 40 },
    { Category: 'Employees', Country: 'Central America and the caribean', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Windows', EmployeesCount: 65 },
    { Category: 'Employees', Country: 'Central America and the caribean', JobDescription: 'Technical', JobGroup: 'Developers', JobRole: 'Web', EmployeesCount: 27 },
    { Category: 'Employees', Country: 'Central America and the caribean', JobDescription: 'Marketing', EmployeesCount: 50 }

];

export let hierarchicalData: Object[] = [
    {
        'Continent': 'North America',
        'Country': [
            {
                'name': 'United States',
                'value': 90,
                'State': [
                    {
                        'name': 'california',
                        'value': 30
                    },
                    {
                        'name': 'florida',
                        'value': 40
                    }
                ]
            },
            {
                'name': 'Canada',
                'value': 113,
                'State': [
                    {
                        'name': 'Alberta',
                        'value': 20
                    },
                    {
                        'name': 'Manitoba',
                        'value': 50
                    }
                ]
            },
            {
                'name': 'Mexico',
                'value': 78
            }
        ]
    },
    {
        'Continent': 'Europe',
        'Country': [
            {
                'name': 'France',
                'value': 42,
                'State': [
                    {
                        'name': 'Burgundy',
                        'value': 60
                    },
                    {
                        'name': 'Alsace',
                        'value': 30
                    }
                ]
            },
            {
                'name': 'Spain',
                'value': 28,
                'State': [
                    {
                        'name': 'Cantabria',
                        'value': 50
                    },
                    {
                        'name': 'Biscay',
                        'value': 80
                    }
                ]
            }
        ]
    },
    {
        'Continent': 'Africa',
        'Country': [
            {
                'name': 'Egypt',
                'value': 22,
                'State': [
                    {
                        'name': 'Cairo',
                        'value': 40
                    },
                    {
                        'name': 'Giza',
                        'value': 70
                    }
                ]
            },
            {
                'name': 'Congo',
                'value': 38
            }
        ]
    },
    {
        'Continent': 'Asia',
        'Country': [
            {
                'name': 'India',
                'value': 92,
                'State': [
                    {
                        'name': 'Tamil nadu',
                        'value': 80
                    },
                    {
                        'name': 'Mumbai',
                        'value': 70
                    }
                ]
            },
            {
                'name': 'China',
                'value': 68
            }
        ]
    },
    {
        'Continent': 'South America',
        'Country': [
            {
                'name': 'Brazil',
                'value': 42,
                'State': [
                    {
                        'name': 'Bahia',
                        'value': 120
                    },
                    {
                        'name': 'Parana',
                        'value': 30
                    }
                ]
            },
            {
                'name': 'Argentina',
                'value': 28
            }
        ]
    },
    {
        'Continent': 'Australia',
        'Country': [
            {
                'name': 'Australia',
                'value': 121,
            },
            {
                'name': 'New Zealand',
                'value': 24,
                'State': [
                    {
                        'name': 'Wellington',
                        'value': 50
                    },
                    {
                        'name': 'Auckland',
                        'value': 80
                    }
                ]
            }
        ]
    }
];
/**
 * Metals Data 
 */
/* eslint-disable */
export let Country_Population = [
    { Country: "China", Population: 1388232693 },

    { Country: "India", Population: 1342512706 },

    { Country: "United States of America", Population: 326474013 },

    { Country: "Indonesia", Population: 263510146 },

    { Country: "Brazil", Population: 211243220 },

    { Country: "Pakistan", Population: 196744376 },

    { Country: "Nigeria", Population: 191835936 },

    { Country: "Bangladesh", Population: 164827718 },

    { Country: "Russian Federation", Population: 143375006 },

    { Country: "Mexico", Population: 130222815 },

    { Country: "Japan", Population: 126045211 },

    { Country: "Ethiopia", Population: 104344901 },

    { Country: "Philippines", Population: 103796832 },

    { Country: "Viet Nam", Population: 95414640 },

    { Country: "Egypt", Population: 95215102 },

    { Country: "D.R. Congo", Population: 82242685 },

    { Country: "Iran", Population: 80945718 },

    { Country: "Germany", Population: 80636124 },

    { Country: "Turkey", Population: 80417526 },

    { Country: "Thailand", Population: 68297547 },

    { Country: "United Kingdom", Population: 65511098 },

    { Country: "France", Population: 64938716 },

    { Country: "Italy", Population: 59797978 },

    { Country: "Tanzania", Population: 56877529 },

    { Country: "South Africa", Population: 55436360 },

    { Country: "Myanmar", Population: 54836483 },

    { Country: "Republic of Korea", Population: 50704971 },

    { Country: "Colombia", Population: 49067981 },

    { Country: "Kenya", Population: 48466928 },

    { Country: "Spain", Population: 46070146 },

    { Country: "Ukraine", Population: 44405055 },

    { Country: "Argentina", Population: 44272125 },

    { Country: "Sudan", Population: 42166323 },

    { Country: "Uganda", Population: 41652938 },

    { Country: "Algeria", Population: 41063753 },

    { Country: "Iraq", Population: 38654287 },

    { Country: "Poland", Population: 38563573 },

    { Country: "Canada", Population: 36626083 },

    { Country: "Morocco", Population: 35241418 },

    { Country: "Afghanistan", Population: 34169169 },

    { Country: "Saudi Arabia", Population: 32742664 },

    { Country: "Peru", Population: 32166473 },

    { Country: "Venezuela", Population: 31925705 },

    { Country: "Malaysia", Population: 31164177 },

    { Country: "Uzbekistan", Population: 30690914 },

    { Country: "Mozambique", Population: 29537914 },

    { Country: "Nepal", Population: 29187037 },

    { Country: "Ghana", Population: 28656723 },

    { Country: "Yemen", Population: 28119546 },

    { Country: "Angola", Population: 26655513 },

    { Country: "Madagascar", Population: 25612972 },

    { Country: "Dem Peoples Republic of Korea", Population: 25405296 },

    { Country: "Australia", Population: 24641662 },

    { Country: "Cameroon", Population: 24513689 },

    { Country: "Côte dIvoire", Population: 23815886 },

    { Country: "Taiwan", Population: 23405309 },

    { Country: "Niger", Population: 21563607 },

    { Country: "Sri Lanka", Population: 20905335 },

    { Country: "Romania", Population: 19237513 },

    { Country: "Burkina Faso", Population: 19173322 },

    { Country: "Syrian Arab Republic", Population: 18906907 },

    { Country: "Mali", Population: 18689966 },

    { Country: "Chile", Population: 18313495 },

    { Country: "Malawi", Population: 18298679 },

    { Country: "Kazakhstan", Population: 18064470 },

    { Country: "Zambia", Population: 17237931 },

    { Country: "Netherlands", Population: 17032845 },

    { Country: "Guatemala", Population: 17005497 },

    { Country: "Ecuador", Population: 16625776 },

    { Country: "Zimbabwe", Population: 16337760 },

    { Country: "Cambodia", Population: 16076370 },

    { Country: "Senegal", Population: 16054275 },

    { Country: "Chad", Population: 14965482 },

    { Country: "Guinea", Population: 13290659 },

    { Country: "South Sudan", Population: 13096190 },

    { Country: "Rwanda", Population: 12159586 },

    { Country: "Burundi", Population: 11936481 },

    { Country: "Tunisia", Population: 11494760 },

    { Country: "Benin", Population: 11458611 },

    { Country: "Belgium", Population: 11443830 },

    { Country: "Somalia", Population: 11391962 },

    { Country: "Cuba", Population: 11390184 },

    { Country: "Bolivia", Population: 11052864 },

    { Country: "Haiti", Population: 10983274 },

    { Country: "Greece", Population: 10892931 },

    { Country: "Dominican Republic", Population: 10766564 },

    { Country: "Czech Republic", Population: 10555130 },

    { Country: "Portugal", Population: 10264797 },

    { Country: "Azerbaijan", Population: 9973697 },

    { Country: "Sweden", Population: 9920624 },

    { Country: "Hungary", Population: 9787905 },

    { Country: "Belarus", Population: 9458535 },

    { Country: "United Arab Emirates", Population: 9397599 },

    { Country: "Tajikistan", Population: 8858115 },

    { Country: "Serbia", Population: 8776940 },

    { Country: "Austria", Population: 8592400 },

    { Country: "Switzerland", Population: 8454083 },

    { Country: "Israel", Population: 8323248 },

    { Country: "Honduras", Population: 8304677 },

    { Country: "Papua New Guinea", Population: 7933841 },

    { Country: "Jordan", Population: 7876703 },

    { Country: "Togo", Population: 7691915 },

    { Country: "China Hong Kong SAR", Population: 7401941 },

    { Country: "Bulgaria", Population: 7045259 },

    { Country: "Laos", Population: 7037521 },

    { Country: "Paraguay", Population: 6811583 },

    { Country: "Sierra Leone", Population: 6732899 },

    { Country: "Libya", Population: 6408742 },

    { Country: "Nicaragua", Population: 6217796 },

    { Country: "El Salvador", Population: 6167147 },

    { Country: "Kyrgyzstan", Population: 6124945 },

    { Country: "Lebanon", Population: 6039277 },

    { Country: "Singapore", Population: 5784538 },

    { Country: "Denmark", Population: 5711837 },

    { Country: "Finland", Population: 5541274 },

    { Country: "Turkmenistan", Population: 5502586 },

    { Country: "Eritrea", Population: 5481906 },

    { Country: "Slovakia", Population: 5432157 },

    { Country: "Norway", Population: 5330800 },

    { Country: "Central African Republic", Population: 5098826 },

    { Country: "State of Palestine", Population: 4928225 },

    { Country: "Costa Rica", Population: 4905626 },

    { Country: "Congo", Population: 4866243 },

    { Country: "Ireland", Population: 4749153 },

    { Country: "Oman", Population: 4741305 },

    { Country: "Liberia", Population: 4730437 },

    { Country: "New Zealand", Population: 4604871 },

    { Country: "Mauritania", Population: 4266448 },

    { Country: "Croatia", Population: 4209815 },

    { Country: "Kuwait", Population: 4099932 },

    { Country: "Republic of Moldova", Population: 4054640 },

    { Country: "Panama", Population: 4051284 },

    { Country: "Georgia", Population: 3972532 },

    { Country: "Bosnia and Herzegovina", Population: 3792759 },

    { Country: "Puerto Rico", Population: 3679086 },

    { Country: "Uruguay", Population: 3456877 },

    { Country: "Mongolia", Population: 3051900 },

    { Country: "Armenia", Population: 3031670 },

    { Country: "Albania", Population: 2911428 },

    { Country: "Lithuania", Population: 2830582 },

    { Country: "Jamaica", Population: 2813285 },

    { Country: "Namibia", Population: 2568569 },

    { Country: "Botswana", Population: 2343981 },

    { Country: "Qatar", Population: 2338085 },

    { Country: "Lesotho", Population: 2185159 },

    { Country: "Gambia", Population: 2120418 },

    { Country: "TFYR Macedonia", Population: 2083308 },

    { Country: "Slovenia", Population: 2071252 },

    { Country: "Latvia", Population: 1944565 },

    { Country: "Guinea-Bissau", Population: 1932871 },

    { Country: "Gabon", Population: 1801232 },

    { Country: "Bahrain", Population: 1418895 },

    { Country: "Trinidad and Tobago", Population: 1369157 },

    { Country: "Swaziland", Population: 1320356 },

    { Country: "Estonia", Population: 1305755 },

    { Country: "Mauritius", Population: 1281353 },

    { Country: "Timor-Leste", Population: 1237251 },

    { Country: "Cyprus", Population: 1187575 },

    { Country: "Djibouti", Population: 911382 },

    { Country: "Fiji", Population: 902547 },

    { Country: "Equatorial Guinea", Population: 894464 },

    { Country: "Réunion", Population: 873356 },

    { Country: "Comoros", Population: 825920 },

    { Country: "Bhutan", Population: 792877 },

    { Country: "Guyana", Population: 774407 },

    { Country: "Montenegro", Population: 626250 },

    { Country: "China Macao SAR", Population: 606384 },

    { Country: "Solomon Islands", Population: 606215 },

    { Country: "Western Sahara", Population: 596021 },

    { Country: "Luxembourg", Population: 584103 },

    { Country: "Suriname", Population: 552112 },

    { Country: "Cabo Verde", Population: 533468 },

    { Country: "Guadeloupe", Population: 472462 },

    { Country: "Brunei Darussalam", Population: 434448 },

    { Country: "Malta", Population: 420521 },

    { Country: "Bahamas", Population: 397164 },

    { Country: "Martinique", Population: 396071 },

    { Country: "Maldives", Population: 375867 },

    { Country: "Belize", Population: 374651 },

    { Country: "Iceland", Population: 334303 },

    { Country: "French Polynesia", Population: 288685 },

    { Country: "Barbados", Population: 285744 },

    { Country: "French Guiana", Population: 282761 },

    { Country: "Vanuatu", Population: 276331 },

    { Country: "New Caledonia", Population: 269736 },

    { Country: "Mayotte", Population: 253068 },

    { Country: "Sao Tome and Principe", Population: 198481 },

    { Country: "Samoa", Population: 195743 },

    { Country: "Saint Lucia", Population: 187768 },

    { Country: "Guam", Population: 174214 },

    { Country: "Channel Islands", Population: 165235 },

    { Country: "Curaçao", Population: 159987 },

    { Country: "Kiribati", Population: 116405 },

    { Country: "Saint Vincent and the Grenadines", Population: 109895 },

    { Country: "Grenada", Population: 107850 },

    { Country: "Tonga", Population: 107797 },

    { Country: "United States Virgin Islands", Population: 106574 },

    { Country: "Micronesia (Fed. States of)", Population: 105566 },

    { Country: "Aruba", Population: 104588 },

    { Country: "Seychelles", Population: 97539 },

    { Country: "Antigua and Barbuda", Population: 93659 },
];
export let CarSales: object[] = [
    { "color": "#DEB887", Continent: "China", Company: "Volkswagen", Sales: 3005994 },
    { "color": "#DEB887", Continent: "China", Company: "General Motors", Sales: 1230044 },
    { "color": "#DEB887", Continent: "China", Company: "Honda", Sales: 1197023 },
    { "color": "#5F9EA0", Continent: "United States", Company: "General Motors", Sales:3042775  },
    { "color": "#5F9EA0", Continent: "United States", Company: "Ford", Sales:2599193  },
    { "color": "#5F9EA0", Continent: "United States", Company: "Toyota", Sales:2449587  },
    { "color": "#DC143C", Continent: "Japan",Company: "Toyota", Sales:1527977  },
    { "color": "#DC143C", Continent: "Japan", Company: "Honda", Sales:706982 },
    { "color": "#DC143C", Continent: "Japan", Company: "Suzuki", Sales:623041  },
    { "color": "#FF8C00", Continent: "Germany",Company: "Volkswagen", Sales:655977  },
    { "color": "#FF8C00", Continent: "Germany", Company: "Mercedes", Sales:310845  },
    { "color": "#FF8C00", Continent: "Germany", Company: "BMW", Sales:261931  },
    { "color": "#E9967A", Continent: "United Kingdom", Company: "Ford ", Sales:319442  },
	{ "color": "#E9967A", Continent: "United Kingdom", Company: "Vauxhall", Sales: 251146 },
    { "color": "#E9967A", Continent: "United Kingdom", Company: "Volkswagen", Sales:206994  },
    { "color": "#483D8B", Continent: "India", Company: "Maruti Suzuki", Sales:1443654  },
    { "color": "#483D8B", Continent: "India", Company: "Hyundai", Sales:476241  },
    { "color": "#483D8B", Continent: "India", Company: "Mahindra", Sales:205041  },
    { "color": "#DAA520", Continent: "France", Company: "Renault", Sales:408183 },
    { "color": "#DAA520", Continent: "France", Company: "Peugeot", Sales:336242 },
    { "color": "#DAA520", Continent: "France", Company: "Citroen", Sales:194986  },
    { "color": "#CD5C5C", Continent: "Brazil", Company: "Flat Chrysler", Sales:368842  },
    { "color": "#CD5C5C", Continent: "Brazil", Company: "General Motors", Sales: 348351 },
    { "color": "#CD5C5C", Continent: "Brazil", Company: "Volkswagen", Sales: 245895 },
    { "color": "#556B2F", Continent: "Italy", Company: "Flat Chrysler", Sales:386260  },
    { "color": "#556B2F", Continent: "Italy", Company: "Volkswagen", Sales: 138984 },
    { "color": "#556B2F", Continent: "Italy", Company: "Ford", Sales: 125144 },
    { "color": "#8FBC8F", Continent: "Canada", Company: "Ford", Sales:  278011},
    { "color": "#8FBC8F", Continent: "Canada", Company: "FCA", Sales:305086 },
    { "color": "#8FBC8F", Continent: "Canada", Company: "GM", Sales: 266884 },       
];
export let Airport_Count: Object[] = [
    { Title: 'State wise International Airport count in South America', State: "Brazil", Count: 25 },
    { Title: 'State wise International Airport count in South America', State: "Colombia", Count: 12 },
    { Title: 'State wise International Airport count in South America', State: "Argentina", Count: 9 },
    { Title: 'State wise International Airport count in South America', State: "Ecuador", Count: 7 },
    { Title: 'State wise International Airport count in South America', State: "Chile", Count: 6 },
    { Title: 'State wise International Airport count in South America', State: "Peru", Count: 3 },
    { Title: 'State wise International Airport count in South America', State: "Venezuela", Count: 3 },
    { Title: 'State wise International Airport count in South America', State: "Bolivia", Count: 2 },
    { Title: 'State wise International Airport count in South America', State: "Paraguay", Count: 2 },
    { Title: 'State wise International Airport count in South America', State: "Uruguay", Count: 2 },
    { Title: 'State wise International Airport count in South America', State: "Falkland Islands", Count: 1 },
    { Title: 'State wise International Airport count in South America', State: "French Guiana", Count: 1 },
    { Title: 'State wise International Airport count in South America', State: "Guyana", Count: 1 },
    { Title: 'State wise International Airport count in South America', State: "Suriname", Count: 1 },
];
/**
 * drill down sample
 */
/* eslint-disable */
export let DrillDown: Object[] = [
    { Continent:[
       { Name: "Africa",Population: 1216130000, States: [
            { Name: "Eastern Africa",Population:410637987, Region:[				
                { Name:"Ethiopia", Population: 107534882},
				{ Name:"Tanzania", Population: 59091392},
				{ Name:"Kenya", Population: 50950879},
				{ Name:"Uganda", Population: 44270563},
				{ Name:"Mozambique", Population: 30528673},
				{ Name:"Madagascar", Population: 26262810},
				{ Name:"Malawi", Population: 19164728},
				{ Name:"Zambia", Population: 17609178},
				{ Name:"Zimbabwe", Population: 16913261},
				{ Name:"Somalia", Population: 15181925},
				{ Name:"South, Sudan", Population: 12919053},
				{ Name:"Rwanda", Population: 12501156},
				{ Name:"Burundi", Population: 11216450},
				{ Name:"Eritrea", Population: 5187948},
				{ Name:"Mauritius", Population: 1268315},
				{ Name:"Djibouti", Population: 971408},
				{ Name:"Réunion", Population: 883247},
				{ Name:"Comoros", Population: 832347},
				{ Name:"Mayotte", Population: 259682},
				{ Name:"Seychelles", Population: 95235},
            ]  },
            { Name: "Middle Africa",Population:158562976, Region:[
				{ Name:"Democratic, Republic of the Congo", Population: 84004989},
				{ Name:"Angola", Population: 30774205},
				{ Name:"Cameroon", Population: 24678234},
				{ Name:"Chad", Population: 15353184},
				{ Name:"Congo", Population: 5399895},
				{ Name:"Central African, Republic", Population: 4737423},
				{ Name:"Gabon", Population: 2067561},
				{ Name:"Equatorial Guinea", Population: 1313894},
				{ Name:"Sao Tome and Principe", Population: 208818},
			] },
            { Name: "Northern Africa",Population:229385603, Region: [
				{ Name:"Egypt", Population: 99375741},
				{ Name:"Algeria", Population: 42008054},
				{ Name:"Sudan", Population: 41511526},
				{ Name:"Morocco", Population: 36191805},
				{ Name:"Tunisia", Population: 11659174},
				{ Name:"Libya", Population: 6470956},
				{ Name:"Western, Sahara", Population: 567421},
			] },
            { Name: "Southern Africa",Population:64292365, Region:[
				{ Name:"South Africa", Population: 57398421},
				{ Name:"Namibia", Population: 2587801},
				{ Name:"Botswana", Population: 2333201},
				{ Name:"Lesotho", Population: 2263010},
				{ Name:"Swaziland", Population: 1391385},
			] },
            { Name: "Western Africa", Population:362201579, Region:[
				{ Name:"Nigeria", Population: 195875237},
				{ Name:"Ghana", Population: 29463643},
				{ Name:"Côte d'Ivoire", Population: 24905843},
				{ Name:"Niger", Population: 22311375},
				{ Name:"Burkina Faso", Population: 19751651},
				{ Name:"Mali", Population: 19107706},
				{ Name:"Senegal", Population: 16294270},
				{ Name:"Guinea", Population: 13052608},
				{ Name:"Benin", Population: 11485674},
				{ Name:"Togo", Population: 7990926},
				{ Name:"Sierra Leone", Population: 7719729},
				{ Name:"Liberia", Population: 4853516},
				{ Name:"Mauritania", Population: 4540068},
				{ Name:"Gambia", Population: 2163765},
				{ Name:"Guinea-Bissau", Population: 1907268},
				{ Name:"Cabo Verde", Population: 553335},
				{ Name:"Saint Helena", Population: 4074},
			] },
        ]
       }]
    },
	
	
	
	{ Continent:[
        {
		Name: "Asia", Population:4436224000, States:[
			{Name: "Central Asia", Population: 69787760, Region:[
				{ Name:"Uzbekistan", Population: 32364996 },
				{ Name:"Kazakhstan", Population: 18403860 },
				{ Name:"Tajikistan", Population: 9107211 },
				{ Name:"Kyrgyzstan", Population: 6132932 },
				{ Name:"Turkmenistan", Population: 5851466 },
			] },
			{Name: "Eastern Asia", Population:1641908531, Region:[
				{ Name:"China", Population: 1415045928}, 
				{ Name:"Japan", Population:	 127185332 },
				{ Name:"South Korea", Population:	51164435 },
				{ Name:"North Korea", Population:25610672 },
				{ Name:"Taiwan", Population: 23694089 },
				{ Name:"Hong Kong", Population: 7428887 },
				{ Name:"Mongolia", Population: 3121772}, 
				{ Name:"Macao", Population: 632418 },
			]  },
			{Name: "Southeastern Asia", Population:641775797, Region: [
				{ Name:"Indonesia", Population:	 266794980 },
				{ Name:"Philippines", Population:	 106512074 },
				{ Name:"Viet Nam", Population:	 96491146 },
				{ Name:"Thailand", Population:	 69183173 },
				{ Name:"Myanmar", Population:	 53855735 },
				{ Name:"Malaysia", Population:	 32042458 },
				{ Name:"Cambodia", Population:	 16245729 },
				{ Name:"Laos", Population:	 6961210 },
				{ Name:"Singapore", Population:	 5791901}, 
				{ Name:"Timor-Leste", Population:	 1324094}, 
				{ Name:"Brunei Darussalam", Population:	 434076}, 
			]  },
			{Name: "Southern Asia", Population: 1846266634, Region: [
				{ Name:"India", Population:	 1354051854},
				{ Name:"Pakistan", Population:	 200813818},
				{ Name:"Bangladesh", Population:	 166368149},
				{ Name:"Iran", Population:	 82011735},
				{ Name:"Afghanistan", Population:	 36373176},
				{ Name:"Nepal", Population:	 29624035},
				{ Name:"Sri Lanka", Population:	 20950041},
				{ Name:"Bhutan", Population:	 817054},
				{ Name:"Maldives", Population:	 444259},
			]},
			{Name: "Western Asia", Population:262938009, Region: [
				{ Name:"Turkey", Population: 81916871},
				{ Name:"Iraq", Population: 39339753},
				{ Name:"Saudi Arabia", Population: 33554343},
				{ Name:"Yemen", Population: 28915284},
				{ Name:"Syria", Population: 18284407},
				{ Name:"Azerbaijan", Population: 9923914},
				{ Name:"Jordan", Population: 9903802},
				{ Name:"United Arab Emirates", Population: 9541615},
				{ Name:"Israel", Population: 8452841},
				{ Name:"Lebanon", Population: 6093509},
				{ Name:"State of Palestine", Population: 5052776},
				{ Name:"Oman", Population: 4829946},
				{ Name:"Kuwait", Population: 4197128},
				{ Name:"Georgia", Population: 3907131},
				{ Name:"Armenia", Population: 2934152},
				{ Name:"Qatar", Population: 2694849},
				{ Name:"Bahrain", Population: 1566993},
				{ Name:"Cyprus", Population: 1189085},
			] },
       ]
        }]
    },
 
 
	{ Continent:[
        {
		Name: "North America", Population:579024000, States:[
			
		{Name:"Central America", Population:174988756 , Region:[
			{ Name:"Mexico", Population: 130759074 },
			{ Name:"Guatemala", Population: 17245346 },
			{ Name:"Honduras", Population: 9417167 },
			{ Name:"El, Salvador", Population: 6411558}, 
			{ Name:"Nicaragua", Population: 6284757 },
			{ Name:"Costa, Rica", Population: 4953199}, 
			{ Name:"Panama", Population: 4162618 },
			{ Name:"Belize", Population: 382444 },
	   ]},
		{ Name:"Northern America", Population:358593810, Region:[
			{ Name:"U.S.", Population: 322179605 }, 
			{ Name:"Canada", Population:36953765},
			{ Name:"Bermuda", Population:61070	},
			{ Name:"Greenland", Population:56565},
			{ Name:"Saint Pierre & Miquelon", Population:6342	},
		]},
      ]
        }]
    },
 
 
	{
        Continent:[
            {
		Name:"South America", Population: 422535000, States:[
			{Name:"Brazil", Population:204519000},
			{Name:"Colombia", Population:48549000 },
			{Name:"Argentina", Population:43132000 },
			{Name:"Peru", Population:31153000 },
			{Name:"Venezuela", Population:30620000},
			{Name:"Chile", Population:18006000 },
			{Name:"Ecuador", Population:16279000},
			{Name:"Bolivia", Population:10520000},
			{Name:"Paraguay", Population:7003000},
			{Name:"Uruguay", Population:3310000},
			{Name:"Guyana", Population:747000},
			{Name:"Suriname", Population:560000 },
			{Name:"French Guiana", Population:262000},
			{Name:"Falkland Islands", Population:3000 },
        ]},
    ]},
        

	{ Continent:[
        {
        Name: "Europe", Population:738849000, States:[
		{Name:"Eastern Europe", Population:291953328, Region:[
			{Name:"Russia", Population:143964709 },
			{Name:"Ukraine", Population: 44009214},
			{Name:"Poland", Population:38104832 },
			{Name:"Romania", Population:19580634 },
			{Name:"Crech, Republic", Population:10625250 },
			{Name:"Hungary", Population:9688847 },
			{Name:"Belarus", Population:9452113 },
			{Name:"Bulgaria", Population: 7036848},
			{Name:"Slovakia", Population: 5449816},
			{Name:"Moldova", Population:4041065 },
		] },
		{Name:"Northern Europe", Population:103642971, Region:[
			{ Name:"United Kingdom", Population: 66573504},
			{ Name:"Sweden", Population: 9982709},
			{ Name:"Denmark", Population: 5754356},
			{ Name:"Finland", Population: 5542517},
			{ Name:"Norway", Population: 5353363},
			{ Name:"Ireland", Population: 4803748},
			{ Name:"Lithuania", Population: 2876475},
			{ Name:"Latvia", Population: 1929938},
			{ Name:"Estonia", Population: 1306788},
			{ Name:"Iceland", Population: 337780},
			{ Name:"Channel Islands", Population: 166083},
			{ Name:"Isle of Man", Population: 84831},
			{ Name:"Faeroe Islands", Population: 49489},
		] },
		{Name:"Southern Europe", Population:152172107, Region:[
			{ Name:"Italy",Population:  59290969 },
			{ Name:"Spain",Population:  46397452}, 
			{ Name:"Greece",Population:  11142161 },
			{ Name:"Portugal",Population:  10291196}, 
			{ Name:"Serbia",Population:  8762027 },
			{ Name:"Croatia",Population:  4164783 },
			{ Name:"Bosnia and Herzegovina",Population:  3503554 },
			{ Name:"Albania",Population:  2934363 },
			{ Name:"Macedonia",Population:  2085051 },
			{ Name:"Slovenia",Population:  2081260 },
			{ Name:"Montenegro",Population:  629219}, 
			{ Name:"Malta",Population:  432089 },
			{ Name:"Andorra",Population:  76953 },
			{ Name:"Gibraltar",Population:  34733 },
			{ Name:"San Marino",Population:  33557 },
			{ Name:"Holy, See",Population:  801 },
		]},
		{Name:"Western Europe", Population:92746859, Region:[
			{ Name:"Germany", Population: 82293457 },
			{ Name:"France", Population: 65233271 },
			{ Name:"Netherlands", Population: 17084459 },
			{ Name:"Belgium", Population: 11498519 },
			{ Name:"Austria", Population: 8751820 },
			{ Name:"Switzerland", Population: 8544034 },
			{ Name:"Luxembourg", Population: 590321 },
			{ Name:"Monaco", Population: 38897 },
			{ Name:"Liechtenstein", Population: 38155 },
		]},
      ]
    }]
    }
 ];

 export let importData: object[] = [
    { dataType: "Import", type: "Animal products",   product: "2010", sales: 20839332874 },
    { dataType: "Import", type: "Animal products",   product: "2011", sales: 23098635589 },
    { dataType: "Import", type: "Chemical products", product: "2010", sales: 141637951510 },
    { dataType: "Import", type: "Chemical products", product: "2011", sales: 161550338209 },
    { dataType: "Import", type: "Base metals",       product: "2010", sales: 86079439944 },
    { dataType: "Import", type: "Base metals",       product: "2011", sales: 103821671535 },
    { dataType: "Import", type: "Textile articles",       product: "2010", sales: 97126140830 },
    { dataType: "Import", type: "Textile articles",       product: "2011", sales: 104980750811 },
    { dataType: "Export", type: "Animal products",   product: "2010", sales:  15845503378 },
    { dataType: "Export", type: "Animal products",   product: "2011", sales:  20650111620 },
    { dataType: "Export", type: "Chemical products", product: "2010", sales: 136100054087 },
    { dataType: "Export", type: "Chemical products", product: "2011", sales: 146341672411 },
    { dataType: "Export", type: "Base metals",       product: "2010", sales: 59060592813 },
    { dataType: "Export", type: "Base metals",       product: "2011", sales: 71785882641 },
    { dataType: "Export", type: "Textile articles",       product: "2010", sales: 20982380561 },
    { dataType: "Export", type: "Textile articles",       product: "2011", sales: 26016143783 }
];

export let data: object[] = [
    {Continent: "China_", Company: "Volkswagen", Sales: 3005994 },
    {Continent: "China_", Company: "General Motors", Sales: 1230044 },
    {Continent: "China_", Company: "Honda", Sales: 1197023 },
    {Continent: "United States_", Company: "General Motors", Sales:3042775  },
    {Continent: "United States_", Company: "Ford", Sales:2599193  },
    {Continent: "United States_", Company: "Toyota", Sales:2449587  }
]