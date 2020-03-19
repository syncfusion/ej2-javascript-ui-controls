/**
 *  Tab performance sample
 */
import { Tab } from '../../src/tab/index';

beforeCreate();

let tabObj: Tab = new Tab({
    created: created,
    items: [
        {
            header: { 'text': 'India' },
            content: 'India officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.'
        },
        {
            header: { 'text': 'Canada' },
            content: 'Canada is a North American country stretching from the U.S. in the south to the Arctic Circle in the north. Major cities include massive Toronto, west coast film centre Vancouver, French-speaking Montréal and Québec City, and capital city Ottawa. Canada vast swaths of wilderness include lake-filled Banff National Park in the Rocky Mountains. It also home to Niagara Falls, a famous group of massive waterfalls.'
        },
        {
            header: { 'text': 'Australia' },
            content: 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.'
        },
        {
            header: { 'text': 'USA' },
            content: 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.'
        },
        {
            header: { 'text': 'London' },
            content: 'London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times. At its centre stand the imposing Houses of Parliament, the iconic ‘Big Ben’ clock tower and Westminster Abbey, site of British monarch coronations. Across the Thames River, the London Eye observation wheel provides panoramic views of the South Bank cultural complex, and the entire city.'
        },
        {
            header: { 'text': 'Germany' },
            content: 'Germany is a Western European country with a landscape of forests, rivers, mountain ranges and North Sea beaches. It has over 2 millennia of history. Berlin, its capital, is home to art and nightlife scenes, the Brandenburg Gate and many sites relating to WWII. Munich is known for its Oktoberfest and beer halls, including the 16th-century Hofbräuhaus. Frankfurt, with its skyscrapers, houses the European Central Bank.'
        },
        {
            header: { 'text': 'France' },
            content: 'France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.'
        },
        {
            header: { 'text': 'Sweden' },
            content: 'Sweden is a Scandinavian nation with thousands of coastal islands and inland lakes, along with vast boreal forests and glaciated mountains. Its principal cities, eastern capital Stockholm and southwestern Gothenburg and Malmö, are all coastal. Stockholm is built on 14 islands. It has more than 50 bridges, as well as the medieval old town, Gamla Stan, royal palaces and museums such as open-air Skansen.'
        },
        {
            header: { 'text': 'Africa' },
            content: 'Africa is the world second-largest and second-most-populous continent. At about 30.3 million km² including adjacent islands, it covers 6% of Earth total surface area and 20.4% of its total land area'
        },
        {
            header: { 'text': 'Japan' },
            content: 'Japan is an island nation in the Pacific Ocean with dense cities, imperial palaces, mountainous national parks and thousands of shrines and temples. Shinkansen bullet trains connect the main islands of Kyushu, Honshu (home to Tokyo and Hiroshima’s atomic-bomb memorial) and Hokkaido (famous for skiing). Tokyo, the capital, is known for skyscrapers, shopping and pop culture.'
        },
        {
            header: { 'text': 'Malaysia' },
            content: 'Malaysia is a Southeast Asian country occupying parts of the Malay Peninsula and the island of Borneo. It known for its beaches, rainforests and mix of Malay, Chinese, Indian and European cultural influences. The capital, Kuala Lumpur, is home to colonial buildings, busy shopping districts such as Bukit Bintang and skyscrapers such as the iconic, 451m-tall Petronas Twin Towers.'
        },
        {
            header: { 'text': 'Singapore' },
            content: 'Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. Its colonial core centers on the Padang, a cricket field since the 1830s and now flanked by grand buildings such as City Hall, with its 18 Corinthian columns. In Singapore circa-1820 Chinatown stands the red-and-gold Buddha Tooth Relic Temple, said to house one of Buddha teeth.'
        },
        {
            header: { 'text': 'Afghanistan' },
            content: 'Afghanistan, approximately the size of Texas, is bordered on the north by Turkmenistan, Uzbekistan, and Tajikistan, on the extreme northeast by China, on the east and south by Pakistan, and by Iran on the west. The country is split east to west by the Hindu Kush mountain range, rising in the east to heights of 24,000 ft (7,315 m). With the exception of the southwest, most of the country is covered by high snow-capped mountains and is traversed by deep valleys.'
        },
        {
            header: { 'text': 'Algeria' },
            content: 'Nearly four times the size of Texas and the largest country on the continent, Algeria is bordered on the west by Morocco and Western Sahara and on the east by Tunisia and Libya. The Mediterranean Sea is to the north, and to the south are Mauritania, Mali, and Niger. The Saharan region, which is 85% of the country, is almost completely uninhabited. The highest point is Mount Tahat in the Sahara, which rises 9,850 ft (3,000 m).'
        },
        {
            header: { 'text': 'Cuba' },
            content: 'The largest island of the West Indies group (equal in area to Pennsylvania), Cuba is also the westernmost—just west of Hispaniola (Haiti and the Dominican Republic), and 90 mi (145 km) south of Key West, Fla., at the entrance to the Gulf of Mexico. The island is mountainous in the southeast and south-central area (Sierra Maestra). It is flat or rolling elsewhere. Cuba also includes numerous smaller islands, islets, and cays.'
        },
        {
            header: { 'text': 'Zimbabwe' },
            content: 'Zimbabwe, a landlocked country in south-central Africa, is slightly smaller than California. It is bordered by Botswana on the west, Zambia on the north, Mozambique on the east, and South Africa on the south.'
        },
        {
            header: { 'text': 'Nepal' },
            content: 'A landlocked country the size of Arkansas, lying between India and the Tibetan Autonomous Region of China, Nepal contains Mount Everest (29,035 ft; 8,850 m), the tallest mountain in the world. Along its southern border, Nepal has a strip of level land that is partly forested, partly cultivated. North of that is the slope of the main section of the Himalayan range, including Everest and many other peaks higher than 8,000 m.'
        },
        {
            header: { 'text': 'Mexico' },
            content: 'Mexico is bordered by the United States to the north and Belize and Guatemala to the southeast. Mexico is about one-fifth the size of the United States. Baja California in the west is an 800-mile (1,287-km) peninsula that forms the Gulf of California. In the east are the Gulf of Mexico and the Bay of Campeche, which is formed by Mexico other peninsula, the Yucatán. The center of Mexico is a great, high plateau, open to the north, with mountain chains on the east and west and with ocean-front lowlands beyond.'
        },
        {
            header: { 'text': 'Jordan' },
            content: 'The Middle East kingdom of Jordan is bordered on the west by Israel and the Dead Sea, on the north by Syria, on the east by Iraq, and on the south by Saudi Arabia. It is comparable in size to Indiana. Arid hills and mountains make up most of the country. The southern section of the Jordan River flows through the country.'
        },
        {
            header: { 'text': 'Ireland' },
            content: 'Ireland is situated in the Atlantic Ocean and separated from Great Britain by the Irish Sea. Half the size of Arkansas, it occupies the entire island except for the six counties that make up Northern Ireland. Ireland resembles a basin—a central plain rimmed with mountains, except in the Dublin region. The mountains are low, with the highest peak, Carrantuohill in County Kerry, rising to 3,415 ft (1,041 m). The principal river is the Shannon, which begins in the north-central area, flows south and southwest for about 240 mi (386 km), and empties into the Atlantic.'
        },
        {
            header: { 'text': 'Italy' },
            content: 'Italy, slightly larger than Arizona, is a long peninsula shaped like a boot, surrounded on the west by the Tyrrhenian Sea and on the east by the Adriatic. It is bounded by France, Switzerland, Austria, and Slovenia to the north. The Apennine Mountains form the peninsula backbone; the Alps form its northern boundary. The largest of its many northern lakes is Garda (143 sq mi; 370 sq km); the Po, its principal river, flows from the Alps on Italy western border and crosses the Lombard plain to the Adriatic Sea. Several islands form part of Italy; the largest are Sicily (9,926 sq mi; 25,708 sq km) and Sardinia (9,301 sq mi; 24,090 sq km).'
        },
        {
            header: { 'text': 'Denmark' },
            content: 'Smallest of the Scandinavian countries (half the size of Maine), Denmark occupies the Jutland peninsula, a lowland area. The country also consists of several islands in the Baltic Sea; the two largest are Sjælland, the site of Copenhagen, and Fyn.'
        },
        {
            header: { 'text': 'Brazil' },
            content: 'Brazil covers nearly half of South America and is the continent largest nation. It extends 2,965 mi (4,772 km) north-south, 2,691 mi (4,331 km) east-west, and borders every nation on the continent except Chile and Ecuador. Brazil may be divided into the Brazilian Highlands, or plateau, in the south and the Amazon River Basin in the north. Over a third of Brazil is drained by the Amazon and its more than 200 tributaries. The Amazon is navigable for ocean steamers to Iquitos, Peru, 2,300 mi (3,700 km) upstream. Southern Brazil is drained by the Plata system—the Paraguay, Uruguay, and Paraná rivers.'
        },
        {
            header: { 'text': 'Bangladesh' },
            content: 'Bangladesh, on the northern coast of the Bay of Bengal, is surrounded by India, with a small common border with Myanmar in the southeast. The country is low-lying riverine land traversed by the many branches and tributaries of the Ganges and Brahmaputra rivers. Tropical monsoons and frequent floods and cyclones inflict heavy damage in the delta region.'
        },
        {
            header: { 'text': 'Belgium' },
            content: 'Located in western Europe, Belgium has about 40 mi of seacoast on the North Sea, at the Strait of Dover, and is approximately the size of Maryland. The Meuse and the Schelde, Belgium principal rivers, are important commercial arteries.'
        }
    ]
});
tabObj.appendTo('#ej2Tab');

let startTime: number;
function beforeCreate (): void{
  startTime = new Date().getMilliseconds();
}
function created(e: Event): void {
    let time: string = ((new Date().getMilliseconds() - startTime) / 1000).toFixed(2);
    (document.querySelector('.performance_time') as HTMLElement).innerHTML = time + 's';
}