import { destinations, type Destination } from "./destinations";

export interface RouteWeatherSEO {
  destId: string;
  intro: string;
  weatherDescription: string;
  bestSeasons: string;
}

// Climate zones based on geography
type ClimateZone = "tropical" | "subtropical" | "desert" | "mediterranean" | "temperate" | "continental" | "pacific-nw" | "mountain" | "plains";

function getClimateZone(dest: Destination): ClimateZone {
  const { lat, lon, state } = dest;
  if (state === "HI") return "tropical";
  if (state === "FL" || (lat < 31 && (state === "TX" || state === "LA"))) return "subtropical";
  if (state === "AZ" || state === "NM" || (state === "NV" && lat < 40) || (state === "CA" && lon > -118 && lat < 35) || state === "UT" && lat < 39) return "desert";
  if (state === "CA" && lat > 33) return "mediterranean";
  if (state === "WA" || state === "OR") return "pacific-nw";
  if (state === "CO" || state === "WY" || state === "ID" || state === "MT" || (state === "UT" && lat >= 39)) return "mountain";
  if (state === "KS" || state === "NE" || state === "SD" || state === "ND" || state === "IA" || state === "OK") return "plains";
  if (lat > 40) return "continental";
  return "temperate";
}

function getWeatherDescription(dest: Destination, zone: ClimateZone): string {
  switch (zone) {
    case "tropical":
      return `${dest.name} enjoys a tropical climate with warm temperatures year-round, typically ranging from the mid-70s to upper 80s°F. Occasional rain showers are common, especially in summer, but they tend to be brief. Trade winds keep the humidity manageable for most of the year.`;
    case "subtropical":
      return `The drive to ${dest.name} passes through a subtropical climate zone with warm to hot temperatures for much of the year. Summers are hot and humid with highs often above 90°F, while winters are mild with temperatures in the 50s to 70s°F. Brief afternoon thunderstorms are common from June through September.`;
    case "desert":
      return `The route to ${dest.name} crosses arid desert terrain where conditions can be extreme. Summers bring intense heat with temperatures frequently exceeding 100°F, while winters are pleasantly mild in the 50s to 70s°F. Rain is rare year-round, and the low humidity makes warm days more comfortable. Be prepared for large temperature swings between day and night.`;
    case "mediterranean":
      return `Driving to ${dest.name}, you'll experience a mild Mediterranean climate with dry summers and gentle winters. Temperatures typically range from the 60s to 80s°F for most of the year. Fog is possible along the coast in the morning, especially in summer, but conditions are generally clear and sunny inland.`;
    case "pacific-nw":
      return `The drive to ${dest.name} takes you through the Pacific Northwest, known for overcast skies and frequent light rain from October through May. Summers are spectacular with temperatures in the 70s to 80s°F and little rainfall. Winter temperatures stay mild, generally in the 30s to 50s°F. Mountain passes along the route may have snow in winter.`;
    case "mountain":
      return `The route to ${dest.name} passes through mountainous terrain where weather can change rapidly with altitude. Expect cooler temperatures at elevation, with summer highs in the 70s to 80s°F and winter temperatures that can drop well below freezing. Snow is possible on mountain passes from October through May. Check road conditions before departing in winter.`;
    case "plains":
      return `Driving to ${dest.name} crosses open plains where weather can shift quickly. Summers are warm to hot with temperatures in the 80s to 100s°F, often with afternoon thunderstorms. Winters bring cold temperatures, wind, and occasional ice or snow. Spring and fall offer the most comfortable driving conditions, though severe weather is possible in spring.`;
    case "continental":
      return `The route to ${dest.name} passes through a continental climate with distinct seasons. Summers are warm with temperatures in the 70s to 90s°F, while winters can be cold with temperatures in the 20s to 40s°F. Snow and ice are possible from November through March. Lake-effect weather may affect areas near the Great Lakes.`;
    case "temperate":
      return `The drive to ${dest.name} crosses a temperate climate zone with four distinct seasons. Summers are warm and occasionally humid with highs in the 80s to 90s°F. Winters are cool with temperatures in the 30s to 50s°F and occasional snow or ice. Spring and fall offer pleasant driving weather with mild temperatures and colorful scenery.`;
  }
}

function getBestSeasons(dest: Destination, zone: ClimateZone): string {
  switch (zone) {
    case "tropical":
      return `${dest.name} is a great destination year-round, but the best driving conditions are from December through April when rainfall is lower and temperatures hover in the comfortable mid-70s to low 80s°F. The summer months from June through October bring more rain and higher humidity, though the warmth remains consistent.`;
    case "subtropical":
      return `The ideal time to drive to ${dest.name} is from October through April, when temperatures are warm but not oppressive and humidity is lower. Winter months offer the most pleasant conditions for a road trip, with daytime highs in the 60s to 70s°F. Avoid summer if possible, as heat and humidity can make the drive less comfortable.`;
    case "desert":
      return `The best time to drive to ${dest.name} is from October through April, when daytime temperatures are comfortable in the 60s to 80s°F. Late fall and early spring are especially ideal. Summer driving in the desert can be dangerous with extreme heat; if you must travel June through August, drive early in the morning and carry extra water.`;
    case "mediterranean":
      return `Driving to ${dest.name} is enjoyable nearly year-round thanks to the mild climate. Spring (March through May) and fall (September through November) offer the most comfortable conditions. Summer is warm and dry, perfect for the coast. Winter driving is still pleasant, though you may encounter rain and fog.`;
    case "pacific-nw":
      return `The best time to drive to ${dest.name} is from June through September, when skies are clear and temperatures are ideal in the 70s to 80s°F. Summer in the Pacific Northwest is famously beautiful. Spring and fall can be rainy but still scenic. Winter driving is possible but may require chains on mountain routes.`;
    case "mountain":
      return `Summer (June through August) offers the best driving conditions to ${dest.name}, with warm days and clear mountain roads. Early fall is also excellent, with cooler temperatures and stunning foliage. Spring can be unpredictable with late-season snow. Winter trips require preparation for snow and ice, though the scenery is breathtaking.`;
    case "plains":
      return `The best seasons to drive to ${dest.name} are late spring (May) and early fall (September through October), when temperatures are moderate and severe weather is less likely. Summer drives are warm but can include thunderstorms. Winter travel is possible but watch for ice and strong winds across the open plains.`;
    case "continental":
      return `Late spring through early fall (May through October) offers the best driving conditions to ${dest.name}. Summer provides the warmest and longest days. Fall brings beautiful foliage and crisp temperatures. Winter driving is feasible but may involve snow, ice, and shorter daylight hours, so plan accordingly.`;
    case "temperate":
      return `Spring and fall are the best seasons to drive to ${dest.name}, offering mild temperatures and scenic conditions. Spring brings blooming landscapes, while fall features colorful foliage. Summer is warm and great for longer trips. Winter driving is manageable in this region, though occasional snow or ice is possible.`;
  }
}

function generateIntro(dest: Destination, zone: ClimateZone): string {
  const regionDescriptions: Record<string, string> = {
    FL: "the Sunshine State",
    CA: "the Golden State",
    TX: "the Lone Star State",
    AZ: "the Grand Canyon State",
    NV: "the Silver State",
    CO: "the Centennial State",
    TN: "the Volunteer State",
    GA: "the Peach State",
    NC: "the Tar Heel State",
    SC: "the Palmetto State",
    LA: "the Pelican State",
    HI: "the Aloha State",
    NM: "the Land of Enchantment",
    OR: "the Beaver State",
    WA: "the Evergreen State",
    UT: "the Beehive State",
    VA: "the Old Dominion",
    MD: "the Old Line State",
    OH: "the Buckeye State",
    IL: "the Prairie State",
    MI: "the Great Lakes State",
    PA: "the Keystone State",
    NY: "the Empire State",
    MA: "the Bay State",
    WI: "the Badger State",
    MN: "the Land of 10,000 Lakes",
    MO: "the Show-Me State",
    IN: "the Hoosier State",
    KY: "the Bluegrass State",
    AL: "the Heart of Dixie",
    OK: "the Sooner State",
    KS: "the Sunflower State",
    NE: "the Cornhusker State",
    IA: "the Hawkeye State",
    AR: "the Natural State",
    ID: "the Gem State",
    WY: "the Cowboy State",
    SD: "the Mount Rushmore State",
    NJ: "the Garden State",
    DC: "the nation's capital",
    AK: "the Last Frontier",
    ME: "the Pine Tree State",
  };

  const stateNickname = regionDescriptions[dest.state] || dest.state;

  return `${dest.name} is located in ${stateNickname} and offers a rewarding driving destination for travelers looking to explore ${dest.description.toLowerCase()}. Whether you're planning a weekend getaway or a longer road trip, checking the weather along your route helps you prepare for the drive ahead and make the most of your time on the road.\n\nUse the route weather tool below to see the forecast at multiple points along your drive. Select your departure date and time to get an hour-by-hour weather outlook from your starting point all the way to ${dest.name}, ${dest.state}.`;
}

// Custom overrides for major destinations
const customSEOData: Record<string, Partial<RouteWeatherSEO>> = {
  nashville: {
    intro: "Nashville, Tennessee is a top road trip destination known for its vibrant live music scene, honky-tonk bars on Broadway, and world-class Southern cuisine. Whether you're coming from the Midwest, the Southeast, or the East Coast, the drive to Nashville takes you through rolling hills and scenic stretches of interstate that make the journey part of the adventure.\n\nUse the route weather tool below to check conditions along your drive to Music City. Pick your departure date and time to see the forecast at each point along the route, so you can plan rest stops and arrive ready to explore.",
  },
  miami: {
    intro: "Miami, Florida is one of the most popular warm-weather driving destinations in the United States. The city offers tropical beaches, Art Deco architecture, Cuban coffee, and a nightlife scene unlike anywhere else. Driving to Miami from cities across the Eastern Seaboard is a classic American road trip, with routes passing through charming Southern towns and miles of coastal scenery.\n\nUse the route weather tool below to plan your drive to Miami. Select your departure date and time to view the weather forecast at stops along your route, from your starting point all the way to the Magic City.",
  },
  "las-vegas": {
    intro: "Las Vegas, Nevada draws road trippers from across the Western United States with its world-famous entertainment, dining, and desert scenery. The drive to Las Vegas often crosses stunning desert landscapes, with routes through the Mojave or along dramatic canyon corridors. It's one of the most iconic road trip destinations in America.\n\nUse the route weather tool below to check conditions for your drive to Vegas. Desert weather can be extreme, so knowing what to expect along the route helps you plan stops and stay comfortable on the road.",
  },
  orlando: {
    intro: "Orlando, Florida is a premier family road trip destination, home to Walt Disney World, Universal Studios, and dozens of attractions. Millions of families drive to Orlando each year from cities across the Southeast, Mid-Atlantic, and Midwest. The drive typically follows major interstates through a mix of terrain and climates.\n\nUse the route weather tool below to see the forecast along your drive to Orlando. Knowing the weather at each point helps you plan fuel stops, meal breaks, and arrival timing for a smoother trip.",
  },
  chicago: {
    intro: "Chicago, Illinois is a world-class city on the shores of Lake Michigan, known for deep-dish pizza, stunning architecture, and a vibrant cultural scene. As a major Midwest hub, Chicago is accessible by road from dozens of cities within a day's drive. The routes into Chicago cross flat prairies, rolling farmland, and the suburban sprawl of the metro area.\n\nUse the route weather tool below to check the forecast along your drive to the Windy City. Lake-effect weather can bring surprises, especially in fall and winter, so checking conditions before you depart is always a smart move.",
  },
  phoenix: {
    intro: "Phoenix, Arizona is a top winter driving destination, offering sunshine and warm desert temperatures when much of the country is cold. The Valley of the Sun attracts snowbirds and road trippers from the Pacific Northwest, Mountain West, and Midwest. Routes to Phoenix often cross dramatic desert and mountain terrain with big elevation changes.\n\nUse the route weather tool below to plan your drive to Phoenix. Desert conditions can vary significantly along the route, with cooler mountain passes and hot valley floors, so an hour-by-hour forecast helps you prepare.",
  },
  "new-york": {
    intro: "New York City is the most visited city in the United States, drawing travelers from every direction. Driving to NYC is a classic road trip along major East Coast corridors like I-95, the New Jersey Turnpike, or scenic routes through New England and the Hudson Valley. Traffic and weather can both impact your drive.\n\nUse the route weather tool below to check the forecast along your route to New York. Whether you're driving in from Philadelphia, Boston, Washington, or farther away, knowing the weather at each stop helps you time your arrival and avoid surprises.",
  },
  "san-diego": {
    intro: "San Diego, California is renowned for its near-perfect weather, beautiful beaches, and the world-famous San Diego Zoo. Driving to San Diego from cities across the West is a quintessential road trip, with routes passing through desert landscapes, mountain passes, and the Southern California coast.\n\nUse the route weather tool below to see the weather along your drive to San Diego. While the destination itself is almost always sunny, the route can cross varied terrain and microclimates, especially through mountain and desert stretches.",
  },
  denver: {
    intro: "Denver, Colorado sits at the edge of the Rocky Mountains, drawing road trippers with its craft beer scene, outdoor recreation, and the stunning Front Range backdrop. Drives to Denver cross wide-open plains from the east or dramatic mountain passes from the west, making weather along the route an important factor in trip planning.\n\nUse the route weather tool below to check conditions for your drive to the Mile High City. Mountain weather can change quickly, and knowing what to expect at each point along the route helps you plan for a safe and comfortable trip.",
  },
  atlanta: {
    intro: "Atlanta, Georgia is the cultural and economic capital of the South, offering world-class dining, the Georgia Aquarium, and a thriving arts scene. As a major interstate hub, Atlanta is reachable by road from almost anywhere in the Eastern United States. Routes into Atlanta pass through rolling Southern landscapes and the foothills of the Appalachians.\n\nUse the route weather tool below to check the weather along your drive to Atlanta. Southern weather can be unpredictable, with afternoon thunderstorms common in summer and occasional ice in winter, so checking the forecast along your route is always worthwhile.",
  },
  austin: {
    intro: "Austin, Texas is the Live Music Capital of the World and a beloved road trip destination for its food trucks, outdoor swimming holes, and laid-back culture. Driving to Austin from cities across Texas and the South is easy on the highway network, with routes crossing Hill Country terrain and wide-open landscapes.\n\nUse the route weather tool below to plan your drive to Austin. Texas weather can range from pleasant to extreme depending on the season, and knowing conditions along the way helps you time your departure and stops.",
  },
  seattle: {
    intro: "Seattle, Washington is a Pacific Northwest gem, known for its coffee culture, Pike Place Market, and stunning mountain and water views. Driving to Seattle takes you through some of the most scenic terrain in the country, whether you're coming up the coast, across the Cascades, or through the Columbia River Gorge.\n\nUse the route weather tool below to check the forecast for your drive to Seattle. Pacific Northwest weather is famously changeable, and mountain passes can see snow even outside of winter, so checking conditions along your route is essential.",
  },
  "new-orleans": {
    intro: "New Orleans, Louisiana is unlike anywhere else in America, with its jazz clubs, Creole cuisine, French Quarter architecture, and legendary hospitality. Driving to New Orleans from cities across the South and Gulf Coast is a popular road trip, with routes that cross bayou country and Southern lowlands.\n\nUse the route weather tool below to see the weather along your drive to the Big Easy. Gulf Coast humidity and the chance of afternoon thunderstorms make it worth checking conditions before you hit the road.",
  },
  boston: {
    intro: "Boston, Massachusetts is one of America's most historic cities, offering the Freedom Trail, world-class universities, and a legendary food scene. Driving to Boston along the Northeast corridor or from inland cities takes you through some of the most densely populated and well-traveled highways in the country.\n\nUse the route weather tool below to check the forecast for your drive to Boston. New England weather is notoriously variable, and conditions can change significantly along even a short route, especially in winter and during nor'easters.",
  },
  "san-francisco": {
    intro: "San Francisco, California captivates visitors with the Golden Gate Bridge, steep cable car streets, and a world-class food scene. Driving to San Francisco is a scenic experience, whether you're coming up the Pacific Coast Highway, across the Central Valley, or over the Bay Bridge from the east.\n\nUse the route weather tool below to check conditions for your drive to San Francisco. The city is famous for its microclimates and fog, and conditions along the route can vary widely depending on your direction of approach.",
  },
};

export function getRouteWeatherSEO(destId: string): RouteWeatherSEO | null {
  const dest = destinations.find((d) => d.id === destId);
  if (!dest) return null;

  const zone = getClimateZone(dest);
  const custom = customSEOData[destId];

  return {
    destId,
    intro: custom?.intro || generateIntro(dest, zone),
    weatherDescription: custom?.weatherDescription || getWeatherDescription(dest, zone),
    bestSeasons: custom?.bestSeasons || getBestSeasons(dest, zone),
  };
}

export function getAllRouteWeatherDestIds(): string[] {
  return destinations.map((d) => d.id);
}
