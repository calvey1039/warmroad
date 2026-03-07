export interface WarmLandingDestination {
  name: string;
  state: string;
  driveTime: string;
  highlight: string;
  routeWeatherId?: string;
}

export interface WarmLandingPage {
  city: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  introParagraphs: string[];
  destinations: WarmLandingDestination[];
  relatedRoadTripSlug: string;
  relatedWarmPlacesSlug?: string;
}

const landingPages: WarmLandingPage[] = [
  {
    city: "Chicago",
    slug: "warm-places-from-chicago",
    seoTitle: "Warm Places to Drive From Chicago | WarmRoad",
    seoDescription:
      "Find warm destinations within driving distance of Chicago. Escape winter cold with road trips to Nashville, New Orleans, Gulf Shores, and more.",
    introParagraphs: [
      "Chicago winters are long, cold, and relentless. Lake-effect snow, sub-zero wind chills, and gray skies that stretch from November through March leave most residents dreaming of warmer air. The good news is that several warm-weather cities sit within a day's drive south.",
      "From quick weekend getaways to Nashville and Louisville to longer drives down to the Gulf Coast, Chicago drivers have plenty of options for chasing sunshine. Many of these destinations run 15 to 30 degrees warmer than the Windy City during winter and spring.",
      "Use WarmRoad's route weather tool to check conditions along your entire drive before you leave. Knowing what to expect between Chicago and your destination helps you pick the best day to hit the road.",
    ],
    destinations: [
      { name: "Nashville", state: "TN", driveTime: "7 hours", highlight: "Live music, hot chicken, and spring temps in the 60s–70s", routeWeatherId: "nashville" },
      { name: "Louisville", state: "KY", driveTime: "4.5 hours", highlight: "Bourbon trail, Derby culture, and mild spring weather", routeWeatherId: "louisville" },
      { name: "St. Louis", state: "MO", driveTime: "4.5 hours", highlight: "Free zoo, Gateway Arch, and warmer temps just a short drive away", routeWeatherId: "st-louis" },
      { name: "New Orleans", state: "LA", driveTime: "13 hours", highlight: "Warm Gulf air, world-class Cajun cuisine, and nonstop live jazz", routeWeatherId: "new-orleans" },
      { name: "Asheville", state: "NC", driveTime: "9 hours", highlight: "Mountain charm, craft breweries, and Blue Ridge Parkway access", routeWeatherId: "asheville" },
      { name: "Savannah", state: "GA", driveTime: "12 hours", highlight: "Historic squares, Spanish moss, and mild coastal winters", routeWeatherId: "savannah" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-chicago",
    relatedWarmPlacesSlug: "chicago",
  },
  {
    city: "Detroit",
    slug: "warm-places-from-detroit",
    seoTitle: "Warm Places to Drive From Detroit | WarmRoad",
    seoDescription:
      "Discover warm road trip destinations from Detroit. Drive south to Nashville, Charleston, Savannah, and the Gulf Coast to escape Michigan winters.",
    introParagraphs: [
      "Detroit winters bring lake-effect snow, freezing rain, and months of overcast skies. By February most Michiganders are ready to trade the gray for something warmer. Several sun-friendly cities sit within a manageable drive south through Ohio, Kentucky, and beyond.",
      "Whether you want a quick four-hour escape to Cincinnati or a longer haul to the Carolina coast, Detroit drivers can reach noticeably warmer weather without ever boarding a plane. Many of these destinations are 15 to 25 degrees warmer during winter months.",
      "Check WarmRoad's route weather tool before heading out. Road conditions between Detroit and the South can shift quickly, especially through the Ohio Valley in spring.",
    ],
    destinations: [
      { name: "Cincinnati", state: "OH", driveTime: "4 hours", highlight: "Riverfront dining, craft beer, and mild Ohio River valley weather", routeWeatherId: "cincinnati" },
      { name: "Louisville", state: "KY", driveTime: "5.5 hours", highlight: "Bourbon distilleries, Waterfront Park, and warmer spring days", routeWeatherId: "louisville" },
      { name: "Nashville", state: "TN", driveTime: "8 hours", highlight: "Music Row, rooftop bars, and spring temps in the 60s–70s", routeWeatherId: "nashville" },
      { name: "Asheville", state: "NC", driveTime: "8.5 hours", highlight: "Blue Ridge Parkway, farm-to-table dining, and mountain air", routeWeatherId: "asheville" },
      { name: "Charleston", state: "SC", driveTime: "12 hours", highlight: "Warm coastal air, historic streets, and incredible seafood", routeWeatherId: "charleston" },
      { name: "Savannah", state: "GA", driveTime: "12 hours", highlight: "Spanish moss, riverfront squares, and subtropical warmth", routeWeatherId: "savannah" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-detroit",
    relatedWarmPlacesSlug: "detroit",
  },
  {
    city: "Boston",
    slug: "warm-places-from-boston",
    seoTitle: "Warm Places to Drive From Boston | WarmRoad",
    seoDescription:
      "Escape Boston winters with warm road trip destinations. Drive to the Carolinas, Savannah, Hilton Head, and Florida for sunshine and mild weather.",
    introParagraphs: [
      "Boston winters are legendary — nor'easters, icy sidewalks, and wind chills that can drop well below zero. When the cold sets in, a southbound road trip is one of the best ways to find warmer weather without the hassle of flying.",
      "The I-95 corridor makes it straightforward to drive from Boston to the mid-Atlantic, Carolinas, and beyond. Each hour south brings warmer air, and by the time you reach Virginia or the Carolinas, you can expect temperatures 20 to 30 degrees higher than back home.",
      "Before you leave, use WarmRoad's route weather tool to check forecasts along your entire drive. Spring storms along the East Coast can pop up fast, and knowing conditions mile by mile helps you plan smarter.",
    ],
    destinations: [
      { name: "Outer Banks", state: "NC", driveTime: "10 hours", highlight: "Wild beaches, lighthouses, and mild shoulder-season weather" },
      { name: "Myrtle Beach", state: "SC", driveTime: "12 hours", highlight: "60 miles of sandy coastline and family-friendly boardwalks", routeWeatherId: "myrtle-beach" },
      { name: "Charleston", state: "SC", driveTime: "14 hours", highlight: "Lowcountry charm, historic cobblestone streets, and warm winters", routeWeatherId: "charleston" },
      { name: "Savannah", state: "GA", driveTime: "16 hours", highlight: "Riverfront dining, oak-lined squares, and subtropical warmth", routeWeatherId: "savannah" },
      { name: "Orlando", state: "FL", driveTime: "20 hours", highlight: "Theme parks, sunshine, and average winter highs near 75°F", routeWeatherId: "orlando" },
      { name: "Miami", state: "FL", driveTime: "24 hours", highlight: "Tropical heat, Art Deco beaches, and year-round warm water", routeWeatherId: "miami" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-boston",
  },
  {
    city: "New York",
    slug: "warm-places-from-new-york",
    seoTitle: "Warm Places to Drive From New York | WarmRoad",
    seoDescription:
      "Find warm destinations within driving distance of New York City. Road trip to the Outer Banks, Charleston, Savannah, and Florida beaches.",
    introParagraphs: [
      "New York City winters bring biting winds, gray skies, and temperatures that regularly dip into the teens and twenties. For drivers looking to escape without a flight, the Eastern Seaboard offers a clear path south to warmer weather.",
      "From the wild beaches of the Outer Banks to the subtropical warmth of Florida, New Yorkers can reach significantly warmer destinations within a single day's drive. The further south you go, the bigger the temperature difference — 20 to 40 degrees warmer by the time you reach the Carolinas or Florida.",
      "WarmRoad's route weather tool shows real-time conditions along your entire drive so you can dodge storms and pick the warmest route south.",
    ],
    destinations: [
      { name: "Outer Banks", state: "NC", driveTime: "8 hours", highlight: "Windswept barrier islands and quiet beach towns" },
      { name: "Myrtle Beach", state: "SC", driveTime: "10 hours", highlight: "Warm boardwalk vibes and family-friendly attractions", routeWeatherId: "myrtle-beach" },
      { name: "Charleston", state: "SC", driveTime: "12 hours", highlight: "Historic Lowcountry beauty and mild winter weather", routeWeatherId: "charleston" },
      { name: "Savannah", state: "GA", driveTime: "13 hours", highlight: "Spanish moss, coastal air, and Southern hospitality", routeWeatherId: "savannah" },
      { name: "Orlando", state: "FL", driveTime: "17 hours", highlight: "Theme parks and Florida sunshine year-round", routeWeatherId: "orlando" },
      { name: "Miami", state: "FL", driveTime: "19 hours", highlight: "Tropical beaches, Art Deco glamour, and warm Gulf Stream water", routeWeatherId: "miami" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-new-york",
  },
  {
    city: "Minneapolis",
    slug: "warm-places-from-minneapolis",
    seoTitle: "Warm Places to Drive From Minneapolis | WarmRoad",
    seoDescription:
      "Escape Minneapolis winters with warm road trips. Drive to Austin, New Orleans, Phoenix, and the Gulf Coast for sunshine and warmer weather.",
    introParagraphs: [
      "Minneapolis is one of the coldest major cities in the United States, regularly hitting -20°F in winter. When cabin fever sets in, a long southbound drive is one of the most rewarding ways to find warmth. The Great Plains open up a direct path to Texas, the Gulf Coast, and the desert Southwest.",
      "While most warm destinations from Minneapolis require a full day or more of driving, the payoff is dramatic — swapping sub-zero temps for 70-degree sunshine in Austin, New Orleans, or Phoenix. These drives also pass through interesting stops along the way.",
      "Use WarmRoad to check weather conditions along your route before setting out. Plains states can see fast-moving storms in spring, and knowing what's ahead helps you plan stops and timing.",
    ],
    destinations: [
      { name: "Austin", state: "TX", driveTime: "18 hours", highlight: "Live music capital with winter temps in the 60s–70s", routeWeatherId: "austin" },
      { name: "San Antonio", state: "TX", driveTime: "19 hours", highlight: "River Walk, Alamo, and warm Hill Country weather", routeWeatherId: "san-antonio" },
      { name: "New Orleans", state: "LA", driveTime: "17 hours", highlight: "Cajun cuisine, jazz clubs, and mild Gulf Coast winters", routeWeatherId: "new-orleans" },
      { name: "Phoenix", state: "AZ", driveTime: "23 hours", highlight: "Sonoran Desert sunshine and winter highs near 70°F", routeWeatherId: "phoenix" },
      { name: "Nashville", state: "TN", driveTime: "14 hours", highlight: "Music city warmth and a solid halfway stop heading further south", routeWeatherId: "nashville" },
      { name: "Destin", state: "FL", driveTime: "19 hours", highlight: "Emerald-green Gulf waters and sugar-white sand beaches", routeWeatherId: "destin" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-minneapolis",
  },
  {
    city: "Seattle",
    slug: "warm-places-from-seattle",
    seoTitle: "Warm Places to Drive From Seattle | WarmRoad",
    seoDescription:
      "Find sunny destinations within driving distance of Seattle. Road trip to San Diego, Los Angeles, Phoenix, Palm Springs, and more.",
    introParagraphs: [
      "Seattle's gray, drizzly winters can wear on even the most devoted Pacific Northwesterners. The good news is that the West Coast and desert Southwest offer some of the best warm-weather driving destinations in the country, all reachable by car.",
      "Head south along the Pacific Coast for dramatic ocean views on the way to Southern California, or cut inland toward the desert sun of Arizona and Nevada. Either way, you'll trade Seattle's overcast skies for blue sky and warm air.",
      "WarmRoad's route weather tool helps you choose between coastal and inland routes by showing real-time conditions along each option. Mountain passes between Seattle and the desert can be tricky in winter, so check before you go.",
    ],
    destinations: [
      { name: "San Diego", state: "CA", driveTime: "18 hours", highlight: "Year-round perfect weather, beaches, and world-class tacos", routeWeatherId: "san-diego" },
      { name: "Los Angeles", state: "CA", driveTime: "18 hours", highlight: "Sunshine, beaches, and endless entertainment options", routeWeatherId: "los-angeles" },
      { name: "Phoenix", state: "AZ", driveTime: "21 hours", highlight: "Desert warmth, hiking trails, and winter highs in the 70s", routeWeatherId: "phoenix" },
      { name: "Las Vegas", state: "NV", driveTime: "14 hours", highlight: "Desert heat, entertainment, and a gateway to Red Rock Canyon", routeWeatherId: "las-vegas" },
      { name: "Tucson", state: "AZ", driveTime: "22 hours", highlight: "Saguaro-studded desert and warm Sonoran sunshine", routeWeatherId: "tucson" },
      { name: "Sedona", state: "AZ", driveTime: "21 hours", highlight: "Red-rock beauty with mild winter days in the 50s–60s", routeWeatherId: "sedona" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-seattle",
  },
  {
    city: "Denver",
    slug: "warm-places-from-denver",
    seoTitle: "Warm Places to Drive From Denver | WarmRoad",
    seoDescription:
      "Discover warm road trip destinations from Denver. Drive to Phoenix, Tucson, Santa Fe, Austin, and San Diego to escape Colorado's winter cold.",
    introParagraphs: [
      "Denver gets over 300 days of sunshine a year, but winter temperatures still plunge below freezing and heavy snowstorms can shut down the Front Range. When the cold gets old, the desert Southwest and Texas offer warm-weather escapes that are easier to reach than you'd think.",
      "Phoenix is just 11 hours south with winter highs regularly in the 70s, and Santa Fe offers warm adobe charm only six hours away. For Gulf Coast warmth or beach time, Texas destinations like Austin and Corpus Christi are within a day's drive.",
      "Check WarmRoad's route weather before heading out — mountain passes between Denver and the desert can see sudden snowstorms, and knowing road conditions in advance makes your trip safer and smoother.",
    ],
    destinations: [
      { name: "Phoenix", state: "AZ", driveTime: "11 hours", highlight: "Sonoran Desert sun with winter highs regularly in the 70s", routeWeatherId: "phoenix" },
      { name: "Tucson", state: "AZ", driveTime: "12 hours", highlight: "Warm desert air, Saguaro National Park, and great hiking", routeWeatherId: "tucson" },
      { name: "Santa Fe", state: "NM", driveTime: "6 hours", highlight: "Adobe architecture, art galleries, and mild high-desert warmth", routeWeatherId: "santa-fe" },
      { name: "Sedona", state: "AZ", driveTime: "10 hours", highlight: "Red-rock formations and clear winter skies", routeWeatherId: "sedona" },
      { name: "Austin", state: "TX", driveTime: "15 hours", highlight: "Live music, BBQ, and Texas Hill Country sunshine", routeWeatherId: "austin" },
      { name: "San Diego", state: "CA", driveTime: "16 hours", highlight: "Year-round mild climate, beaches, and laid-back culture", routeWeatherId: "san-diego" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-denver",
  },
  {
    city: "Philadelphia",
    slug: "warm-places-from-philadelphia",
    seoTitle: "Warm Places to Drive From Philadelphia | WarmRoad",
    seoDescription:
      "Escape Philadelphia winters with warm road trips. Drive to the Outer Banks, Charleston, Savannah, and Florida for sunshine and beach weather.",
    introParagraphs: [
      "Philadelphia's winters bring raw, cold winds off the Delaware River, icy sidewalks, and stretches of gray skies that can last for weeks. When the chill becomes too much, heading south on I-95 or cutting toward the coast opens up a world of warmer destinations.",
      "The Outer Banks are just seven hours away, and Charleston's mild winter climate is reachable in about ten hours. Keep driving and you'll hit Florida's tropical warmth within a single long day on the road. Each stop south brings noticeably warmer air.",
      "Use WarmRoad's route weather tool to see conditions along your drive from Philly to the coast or deep South. East Coast weather can shift fast, especially in spring when nor'easters and thunderstorms collide.",
    ],
    destinations: [
      { name: "Outer Banks", state: "NC", driveTime: "7 hours", highlight: "Quiet barrier island beaches and charming fishing villages" },
      { name: "Myrtle Beach", state: "SC", driveTime: "9 hours", highlight: "Warm boardwalk vibes and miles of sandy coastline", routeWeatherId: "myrtle-beach" },
      { name: "Charleston", state: "SC", driveTime: "10 hours", highlight: "Historic Lowcountry beauty, mild winters, and incredible food", routeWeatherId: "charleston" },
      { name: "Savannah", state: "GA", driveTime: "12 hours", highlight: "Oak-lined squares, riverfront dining, and warm coastal air", routeWeatherId: "savannah" },
      { name: "Orlando", state: "FL", driveTime: "15 hours", highlight: "Theme parks, sunshine, and warm winter weather", routeWeatherId: "orlando" },
      { name: "Miami", state: "FL", driveTime: "18 hours", highlight: "Tropical beaches, Art Deco architecture, and year-round warmth", routeWeatherId: "miami" },
    ],
    relatedRoadTripSlug: "warm-road-trips-from-philadelphia",
  },
];

export function getWarmLandingPage(slug: string): WarmLandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export function getAllWarmLandingSlugs(): string[] {
  return landingPages.map((p) => p.slug);
}

export function getAllWarmLandingPages(): WarmLandingPage[] {
  return landingPages;
}
