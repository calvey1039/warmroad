export interface RoadTripRoute {
  name: string;
  route: string;
  description: string;
  bestFor: string;
  season: string;
  driveTime: string;
}

export interface FeaturedTrip {
  name: string;
  route: string;
  description: string;
  bestFor: string;
  season: string;
}

export interface CityTrips {
  slug: string;
  city: string;
  intro: string;
  routes: RoadTripRoute[];
}

export const featuredTrips: FeaturedTrip[] = [
  {
    name: "The Gulf Coast Cruise",
    route: "New Orleans \u2192 Mobile \u2192 Pensacola \u2192 Panama City Beach",
    description: "Coastal journey through Southern cities, beaches, and seafood destinations.",
    bestFor: "Beach lovers & foodies",
    season: "Year-round (best Oct\u2013Apr)",
  },
  {
    name: "Southern California Coast",
    route: "San Diego \u2192 Los Angeles \u2192 Santa Barbara \u2192 San Luis Obispo",
    description: "Pacific Coast Highway drive through sunny California.",
    bestFor: "Scenic drives & surf culture",
    season: "Year-round",
  },
  {
    name: "Texas Hill Country & Coast",
    route: "Austin \u2192 San Antonio \u2192 Corpus Christi \u2192 South Padre Island",
    description: "Music, history, and Texas coastal experience.",
    bestFor: "Music, history & warm beaches",
    season: "Oct\u2013May",
  },
  {
    name: "The Florida Sun Trail",
    route: "Jacksonville \u2192 Orlando \u2192 Tampa \u2192 Miami \u2192 Key West",
    description: "Florida peninsula journey with theme parks, dining, and tropical destinations.",
    bestFor: "Sunshine seekers & families",
    season: "Nov\u2013Apr",
  },
  {
    name: "Desert Southwest Loop",
    route: "Phoenix \u2192 Tucson \u2192 Las Cruces \u2192 El Paso \u2192 Phoenix",
    description: "Warm desert landscapes and border-town culture.",
    bestFor: "Desert scenery & hiking",
    season: "Oct\u2013Apr",
  },
  {
    name: "Carolina Coastal Run",
    route: "Charleston \u2192 Myrtle Beach \u2192 Wilmington \u2192 Outer Banks",
    description: "Atlantic coast journey through Lowcountry and historic towns.",
    bestFor: "History buffs & coastal charm",
    season: "Mar\u2013May, Sep\u2013Nov",
  },
];

export const cityTrips: CityTrips[] = [
  {
    slug: "warm-road-trips-from-chicago",
    city: "Chicago",
    intro: "Escape the brutal Chicago winters and head south toward sunshine. Whether you follow the Mississippi down to New Orleans or cruise straight to the Gulf Coast beaches, these warm-weather road trips from Chicago offer the perfect antidote to lake-effect snow.",
    routes: [
      {
        name: "Chicago to New Orleans via the Great River Road",
        route: "Chicago \u2192 St. Louis \u2192 Memphis \u2192 Natchez \u2192 New Orleans",
        description: "Follow the Mississippi River south on one of America\u2019s most iconic drives. Stop for BBQ in Memphis, explore antebellum Natchez, and arrive in the Big Easy for world-class food, jazz, and year-round warmth.",
        bestFor: "Music lovers & foodies",
        season: "Oct\u2013Apr",
        driveTime: "~13 hours total",
      },
      {
        name: "Chicago to the Florida Gulf Coast",
        route: "Chicago \u2192 Nashville \u2192 Birmingham \u2192 Pensacola \u2192 Destin",
        description: "Drive through the heart of the South to reach the sugar-white sand beaches of the Florida Panhandle. Nashville makes an ideal overnight stop, and you\u2019ll be on the beach in under two days.",
        bestFor: "Beach lovers & families",
        season: "Year-round (best Nov\u2013Apr)",
        driveTime: "~12 hours total",
      },
      {
        name: "Chicago to South Padre Island, Texas",
        route: "Chicago \u2192 Springfield \u2192 Little Rock \u2192 Dallas \u2192 San Antonio \u2192 South Padre Island",
        description: "Head deep into the heart of Texas for warm Gulf breezes on South Padre Island. Enjoy live music and Tex-Mex in San Antonio\u2019s River Walk district before reaching this tropical barrier island.",
        bestFor: "Warm beaches & Tex-Mex cuisine",
        season: "Nov\u2013Apr",
        driveTime: "~22 hours total",
      },
      {
        name: "Chicago to Savannah & Charleston",
        route: "Chicago \u2192 Louisville \u2192 Knoxville \u2192 Charleston \u2192 Savannah",
        description: "Trade the Midwest cold for the mild charm of the Lowcountry. Explore Charleston\u2019s historic cobblestone streets, then continue to Savannah\u2019s Spanish-moss-draped squares and coastal island beaches.",
        bestFor: "History buffs & Southern charm",
        season: "Mar\u2013May, Oct\u2013Nov",
        driveTime: "~12 hours to Charleston",
      },
      {
        name: "Chicago to Orlando & the Florida Sun Coast",
        route: "Chicago \u2192 Indianapolis \u2192 Atlanta \u2192 Orlando \u2192 Tampa \u2192 Clearwater Beach",
        description: "Hit the interstate south for theme parks, sunshine, and some of the best beach towns on the Gulf side of Florida. Clearwater Beach consistently ranks among the country\u2019s best for white sand and warm water.",
        bestFor: "Families & theme park fans",
        season: "Year-round",
        driveTime: "~16 hours to Orlando",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-new-york",
    city: "New York",
    intro: "When New York City\u2019s gray winter skies and freezing winds set in, nothing beats hitting the road for warmer weather. These routes span from the mid-Atlantic through the Carolinas into Florida.",
    routes: [
      {
        name: "New York to Miami via the Atlantic Coast",
        route: "New York \u2192 Virginia Beach \u2192 Wilmington \u2192 Charleston \u2192 Jacksonville \u2192 Miami",
        description: "The classic East Coast road trip. Hug the Atlantic coastline through charming beach towns, stop for she-crab soup in Charleston, and keep going until you hit the Art Deco glamour of South Beach.",
        bestFor: "Beach hopping & coastal scenery",
        season: "Nov\u2013Apr",
        driveTime: "~19 hours total",
      },
      {
        name: "New York to the Outer Banks & Carolina Coast",
        route: "New York \u2192 Chesapeake Bay \u2192 Outer Banks \u2192 Myrtle Beach \u2192 Charleston",
        description: "Escape to the wild, windswept beaches of the Outer Banks, then cruise south through the family-friendly boardwalk scene of Myrtle Beach and into the genteel beauty of Charleston.",
        bestFor: "Coastal drives & history lovers",
        season: "Mar\u2013May, Sep\u2013Nov",
        driveTime: "~8 hours to Outer Banks",
      },
      {
        name: "New York to Key West \u2014 the Ultimate Warm Escape",
        route: "New York \u2192 Savannah \u2192 Orlando \u2192 Miami \u2192 Key West",
        description: "Go all the way to the southernmost point in the continental US. End your trip driving the breathtaking Overseas Highway through the Florida Keys, surrounded by turquoise water on both sides.",
        bestFor: "Adventure seekers & island vibes",
        season: "Dec\u2013Apr",
        driveTime: "~24 hours total",
      },
      {
        name: "New York to Hilton Head & Savannah",
        route: "New York \u2192 Washington DC \u2192 Richmond \u2192 Hilton Head Island \u2192 Savannah",
        description: "A manageable two-day drive to the mild, subtropical coast of Georgia and South Carolina. Hilton Head offers world-class golf and quiet beaches, while Savannah delivers historic charm and incredible dining.",
        bestFor: "Relaxation & Southern cuisine",
        season: "Oct\u2013May",
        driveTime: "~12 hours to Hilton Head",
      },
      {
        name: "New York to the Gulf Coast via the Blue Ridge",
        route: "New York \u2192 Shenandoah Valley \u2192 Blue Ridge Parkway \u2192 Atlanta \u2192 Gulf Shores",
        description: "Combine mountain scenery with beach relaxation. Wind through the stunning Blue Ridge Parkway, overnight in Atlanta, then finish at the warm, uncrowded sands of Gulf Shores, Alabama.",
        bestFor: "Scenic drives & beach relaxation",
        season: "Mar\u2013May, Oct\u2013Nov",
        driveTime: "~16 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-boston",
    city: "Boston",
    intro: "Boston winters are legendary \u2014 nor\u2019easters, icy sidewalks, and below-zero wind chills. These warm-weather road trips head south along the coast or cut inland to reach sunshine and mild temperatures.",
    routes: [
      {
        name: "Boston to the Carolina Coast",
        route: "Boston \u2192 New York \u2192 Virginia Beach \u2192 Outer Banks \u2192 Myrtle Beach \u2192 Charleston",
        description: "Drive the length of the East Coast to reach the warm, palmetto-lined beaches of the Carolinas. Each stop gets warmer as you go, with Charleston\u2019s mild climate and world-class food waiting at the end.",
        bestFor: "Gradual warm-up & coastal beauty",
        season: "Nov\u2013Apr",
        driveTime: "~14 hours to Charleston",
      },
      {
        name: "Boston to Florida\u2019s Space Coast & Beyond",
        route: "Boston \u2192 Philadelphia \u2192 Washington DC \u2192 Jacksonville \u2192 Cocoa Beach \u2192 Miami",
        description: "Follow I-95 south to Florida\u2019s Space Coast where you can watch rocket launches and catch perfect waves, then continue to the tropical heat of Miami and the Keys.",
        bestFor: "Science enthusiasts & beach lovers",
        season: "Dec\u2013Apr",
        driveTime: "~20 hours to Cocoa Beach",
      },
      {
        name: "Boston to Savannah & the Golden Isles",
        route: "Boston \u2192 New York \u2192 Washington DC \u2192 Savannah \u2192 Jekyll Island \u2192 St. Simons Island",
        description: "Georgia\u2019s Golden Isles are one of the South\u2019s best-kept secrets. Quiet beaches, historic ruins, wild horses on Cumberland Island, and Savannah\u2019s world-famous hospitality \u2014 all in a warm, subtropical climate.",
        bestFor: "Nature lovers & quiet getaways",
        season: "Oct\u2013May",
        driveTime: "~16 hours to Savannah",
      },
      {
        name: "Boston to the Gulf Coast",
        route: "Boston \u2192 Philadelphia \u2192 Charlotte \u2192 Atlanta \u2192 Pensacola \u2192 Destin",
        description: "Cut through the Southeast to reach the emerald-green waters and white-sand beaches of the Florida Panhandle. Destin is known as the \u2018World\u2019s Luckiest Fishing Village\u2019 and offers warm weather when Boston is buried in snow.",
        bestFor: "Beach lovers & fishing fans",
        season: "Nov\u2013Apr",
        driveTime: "~20 hours total",
      },
      {
        name: "Boston to Hilton Head Island",
        route: "Boston \u2192 Connecticut \u2192 New Jersey Turnpike \u2192 Richmond \u2192 Hilton Head Island",
        description: "A straightforward I-95 run to one of the East Coast\u2019s premier resort islands. World-class golf, quiet bike paths, and mild winter temperatures make Hilton Head the perfect Boston escape.",
        bestFor: "Golf & relaxation",
        season: "Year-round (best Oct\u2013May)",
        driveTime: "~13 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-detroit",
    city: "Detroit",
    intro: "Michigan winters mean lake-effect snow, icy roads, and months of gray skies. Break free with these warm-weather road trips from Detroit that head south through Tennessee, down the Gulf Coast, or straight to the Florida sunshine.",
    routes: [
      {
        name: "Detroit to Nashville & the Gulf Coast",
        route: "Detroit \u2192 Louisville \u2192 Nashville \u2192 Birmingham \u2192 Mobile \u2192 Gulf Shores",
        description: "Drive through the musical heart of America. Enjoy hot chicken in Nashville, then continue through Alabama to the warm, white-sand beaches of Gulf Shores on the Gulf of Mexico.",
        bestFor: "Music lovers & beach seekers",
        season: "Oct\u2013Apr",
        driveTime: "~13 hours total",
      },
      {
        name: "Detroit to Orlando & Central Florida",
        route: "Detroit \u2192 Cincinnati \u2192 Knoxville \u2192 Atlanta \u2192 Orlando",
        description: "A well-paced two-day drive lands you in the theme park capital of the world. From there, explore Florida\u2019s Gulf or Atlantic coast beaches for warm weather and endless sunshine.",
        bestFor: "Families & theme park fans",
        season: "Year-round",
        driveTime: "~15 hours total",
      },
      {
        name: "Detroit to Savannah via the Smoky Mountains",
        route: "Detroit \u2192 Lexington \u2192 Great Smoky Mountains \u2192 Asheville \u2192 Savannah",
        description: "Combine mountain beauty with coastal warmth. Drive through the misty Smokies, spend a night in the artsy mountain town of Asheville, then descend into the warm, historic streets of Savannah.",
        bestFor: "Scenic drives & history",
        season: "Mar\u2013May, Oct\u2013Nov",
        driveTime: "~12 hours total",
      },
      {
        name: "Detroit to the Florida Keys",
        route: "Detroit \u2192 Cincinnati \u2192 Atlanta \u2192 Tampa \u2192 Fort Myers \u2192 Key West",
        description: "Go all the way south for a tropical escape. The Keys offer snorkeling, fresh seafood, and average winter temperatures in the mid-70s \u2014 a world away from Detroit\u2019s single digits.",
        bestFor: "Tropical getaway seekers",
        season: "Dec\u2013Apr",
        driveTime: "~20 hours total",
      },
      {
        name: "Detroit to New Orleans",
        route: "Detroit \u2192 Indianapolis \u2192 Nashville \u2192 Jackson \u2192 New Orleans",
        description: "Head straight for the warmth and excitement of the Crescent City. New Orleans delivers mild winters, incredible Cajun and Creole cuisine, and a music scene that never stops.",
        bestFor: "Foodies & culture enthusiasts",
        season: "Oct\u2013Apr",
        driveTime: "~13 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-minneapolis",
    city: "Minneapolis",
    intro: "Minneapolis regularly hits -20\u00B0F in winter, making it one of the coldest major cities in the US. These warm-weather road trips head south through the Great Plains, down the Mississippi, or southwest to the desert.",
    routes: [
      {
        name: "Minneapolis to Austin & the Texas Hill Country",
        route: "Minneapolis \u2192 Kansas City \u2192 Oklahoma City \u2192 Dallas \u2192 Austin \u2192 San Antonio",
        description: "Drive straight south through the Great Plains into the heart of Texas. Austin\u2019s live music scene, San Antonio\u2019s River Walk, and winter temperatures in the 60s\u201370s make this a perfect cold-weather escape.",
        bestFor: "Music lovers & foodies",
        season: "Nov\u2013Mar",
        driveTime: "~18 hours to Austin",
      },
      {
        name: "Minneapolis to South Padre Island",
        route: "Minneapolis \u2192 Des Moines \u2192 Kansas City \u2192 Dallas \u2192 Corpus Christi \u2192 South Padre Island",
        description: "Keep driving south until you can\u2019t go any farther. South Padre Island sits at the southern tip of Texas with warm Gulf waters, gorgeous beaches, and subtropical weather even in January.",
        bestFor: "Beach seekers & warmth chasers",
        season: "Nov\u2013Apr",
        driveTime: "~24 hours total",
      },
      {
        name: "Minneapolis to New Orleans via the Mississippi",
        route: "Minneapolis \u2192 Quad Cities \u2192 St. Louis \u2192 Memphis \u2192 Natchez \u2192 New Orleans",
        description: "Follow the Mississippi River from its headwaters region all the way to the Gulf. This is one of America\u2019s great road trips \u2014 from frozen Minnesota to the warm, festive streets of New Orleans.",
        bestFor: "History buffs & music fans",
        season: "Oct\u2013Apr",
        driveTime: "~17 hours total",
      },
      {
        name: "Minneapolis to Phoenix & the Sonoran Desert",
        route: "Minneapolis \u2192 Omaha \u2192 Denver \u2192 Albuquerque \u2192 Phoenix \u2192 Scottsdale",
        description: "Trade snow for saguaros with this southwest-bound drive. Phoenix averages 70\u00B0F in winter, and the Sonoran Desert landscape offers incredible hiking, golf, and outdoor dining.",
        bestFor: "Desert scenery & outdoor sports",
        season: "Nov\u2013Mar",
        driveTime: "~23 hours total",
      },
      {
        name: "Minneapolis to the Florida Panhandle",
        route: "Minneapolis \u2192 Chicago \u2192 Nashville \u2192 Birmingham \u2192 Pensacola \u2192 Destin",
        description: "Head southeast through Chicago and Nashville to reach the emerald waters of the Florida Panhandle. Destin and Pensacola offer stunning beaches and some of the warmest winter weather on the Gulf Coast.",
        bestFor: "Beach lovers & seafood fans",
        season: "Nov\u2013Apr",
        driveTime: "~19 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-seattle",
    city: "Seattle",
    intro: "Seattle\u2019s endless gray drizzle and short winter days have inspired many a road trip south. Chase the sun down the Pacific Coast or cut inland through the desert Southwest \u2014 either way, these drives deliver warmth and blue skies.",
    routes: [
      {
        name: "Seattle to Southern California via the Pacific Coast",
        route: "Seattle \u2192 Portland \u2192 Redwoods \u2192 San Francisco \u2192 Big Sur \u2192 Los Angeles \u2192 San Diego",
        description: "The ultimate West Coast road trip. Drive through ancient redwood forests, across the Golden Gate Bridge, along the dramatic cliffs of Big Sur, and into the perpetual sunshine of Southern California.",
        bestFor: "Scenic drives & coastal beauty",
        season: "Year-round (best Apr\u2013Oct)",
        driveTime: "~20 hours total",
      },
      {
        name: "Seattle to Phoenix & Scottsdale",
        route: "Seattle \u2192 Boise \u2192 Salt Lake City \u2192 Las Vegas \u2192 Phoenix \u2192 Scottsdale",
        description: "Cut through the interior West to the warm, sun-soaked desert of Arizona. Phoenix\u2019s winter temps average in the 70s, and Scottsdale adds world-class spas, golf, and dining to the mix.",
        bestFor: "Desert warmth & luxury resorts",
        season: "Nov\u2013Apr",
        driveTime: "~21 hours total",
      },
      {
        name: "Seattle to San Diego \u2014 Sun & Surf",
        route: "Seattle \u2192 Sacramento \u2192 Fresno \u2192 Bakersfield \u2192 Los Angeles \u2192 San Diego",
        description: "Take the fast inland route through California\u2019s Central Valley to reach San Diego\u2019s year-round perfect weather, world-class tacos, and laid-back beach culture faster.",
        bestFor: "Beach culture & warm weather",
        season: "Year-round",
        driveTime: "~18 hours total",
      },
      {
        name: "Seattle to Las Vegas & the Desert Southwest",
        route: "Seattle \u2192 Boise \u2192 Twin Falls \u2192 Las Vegas \u2192 Sedona \u2192 Tucson",
        description: "Drive south through the dramatic landscapes of Idaho and Nevada to Las Vegas, then continue to the red-rock beauty of Sedona and the warm desert of Tucson.",
        bestFor: "Desert landscapes & adventure",
        season: "Oct\u2013Apr",
        driveTime: "~18 hours to Las Vegas",
      },
      {
        name: "Seattle to Palm Springs",
        route: "Seattle \u2192 Portland \u2192 Redding \u2192 Sacramento \u2192 Palm Springs",
        description: "Head south through Oregon and California to the chic desert oasis of Palm Springs. Mid-century modern architecture, hot springs, and winter temperatures in the 70s await.",
        bestFor: "Desert relaxation & mid-century style",
        season: "Nov\u2013Apr",
        driveTime: "~17 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-denver",
    city: "Denver",
    intro: "Denver gets 300 days of sunshine, but winter temps still plunge below freezing. Drive south through New Mexico and Arizona or head to Texas for warm desert conditions and Gulf Coast beaches.",
    routes: [
      {
        name: "Denver to Phoenix via the Desert Southwest",
        route: "Denver \u2192 Albuquerque \u2192 Socorro \u2192 Tucson \u2192 Phoenix",
        description: "Drop south through the Rio Grande Valley into the warm Sonoran Desert. Phoenix\u2019s winter highs regularly hit the 70s, and the saguaro-studded landscape is unlike anything in Colorado.",
        bestFor: "Desert scenery & outdoor sports",
        season: "Nov\u2013Apr",
        driveTime: "~11 hours total",
      },
      {
        name: "Denver to Santa Fe & Southern New Mexico",
        route: "Denver \u2192 Trinidad \u2192 Santa Fe \u2192 Truth or Consequences \u2192 Las Cruces",
        description: "Head south along the front range to the art capital of the Southwest. Santa Fe offers warm adobe charm, then continue to the hot springs of Truth or Consequences and the warm Mesilla Valley.",
        bestFor: "Art lovers & hot springs",
        season: "Year-round (best Oct\u2013Apr)",
        driveTime: "~6 hours to Santa Fe",
      },
      {
        name: "Denver to South Texas & the Gulf",
        route: "Denver \u2192 Amarillo \u2192 Austin \u2192 San Antonio \u2192 Corpus Christi",
        description: "Cross the Texas Panhandle and keep driving south until you hit the warm Gulf Coast. Austin and San Antonio offer great food and culture stops along the way.",
        bestFor: "Gulf Coast beaches & BBQ",
        season: "Nov\u2013Apr",
        driveTime: "~16 hours total",
      },
      {
        name: "Denver to San Diego via Route 66 Country",
        route: "Denver \u2192 Albuquerque \u2192 Flagstaff \u2192 Joshua Tree \u2192 San Diego",
        description: "Follow old Route 66 west through New Mexico and Arizona, detour through the otherworldly Joshua Tree National Park, and end at San Diego\u2019s perfect year-round climate.",
        bestFor: "Classic road trip vibes & beach life",
        season: "Year-round",
        driveTime: "~16 hours total",
      },
      {
        name: "Denver to Sedona & the Verde Valley",
        route: "Denver \u2192 Durango \u2192 Monument Valley \u2192 Sedona \u2192 Jerome",
        description: "Take the scenic southwestern route through Durango and Monument Valley to reach the red-rock paradise of Sedona. Winter temps hover in the 50s\u201360s with stunning clear skies.",
        bestFor: "Red-rock hiking & spiritual retreats",
        season: "Oct\u2013Apr",
        driveTime: "~10 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-pittsburgh",
    city: "Pittsburgh",
    intro: "Pittsburgh\u2019s steel-gray winter skies and frigid temperatures make heading south an annual tradition. These warm-weather road trips take you from the Three Rivers to sunny beaches, historic Southern cities, and the warm Gulf Coast.",
    routes: [
      {
        name: "Pittsburgh to Charleston & the Lowcountry",
        route: "Pittsburgh \u2192 Staunton \u2192 Blue Ridge Parkway \u2192 Charlotte \u2192 Charleston",
        description: "Drive through the scenic Blue Ridge Mountains, then descend into the warm coastal Lowcountry. Charleston\u2019s mild winters, incredible dining, and historic charm make it one of the best Southern escapes.",
        bestFor: "History lovers & foodies",
        season: "Oct\u2013May",
        driveTime: "~10 hours total",
      },
      {
        name: "Pittsburgh to Myrtle Beach",
        route: "Pittsburgh \u2192 Roanoke \u2192 Raleigh \u2192 Myrtle Beach",
        description: "A surprisingly short drive to one of the East Coast\u2019s most popular beach destinations. Myrtle Beach offers warm temps, 60 miles of sandy coastline, and family-friendly attractions.",
        bestFor: "Beach vacations & family fun",
        season: "Mar\u2013Nov",
        driveTime: "~9 hours total",
      },
      {
        name: "Pittsburgh to Orlando & the Florida Coast",
        route: "Pittsburgh \u2192 Charleston WV \u2192 Knoxville \u2192 Atlanta \u2192 Orlando \u2192 Clearwater",
        description: "Drive through the Appalachian foothills and into Georgia, then make a beeline for Florida\u2019s theme parks and Gulf Coast beaches. Clearwater Beach offers some of the warmest, clearest water on the Gulf.",
        bestFor: "Families & sunshine seekers",
        season: "Year-round",
        driveTime: "~15 hours to Orlando",
      },
      {
        name: "Pittsburgh to Savannah & the Georgia Coast",
        route: "Pittsburgh \u2192 Charlottesville \u2192 Raleigh \u2192 Savannah \u2192 Tybee Island",
        description: "Drive southeast to Savannah, one of America\u2019s most beautiful cities, then continue to Tybee Island for warm beach days. The drive passes through lovely Virginia and Carolina countryside.",
        bestFor: "Southern charm & coastal relaxation",
        season: "Oct\u2013May",
        driveTime: "~11 hours total",
      },
      {
        name: "Pittsburgh to the Gulf Coast via Nashville",
        route: "Pittsburgh \u2192 Charleston WV \u2192 Knoxville \u2192 Nashville \u2192 Birmingham \u2192 Gulf Shores",
        description: "Hit Nashville for live music and hot chicken, then keep going south to the pristine white sands of Gulf Shores, Alabama \u2014 one of the Gulf\u2019s most underrated beach destinations.",
        bestFor: "Music fans & off-the-beaten-path beaches",
        season: "Oct\u2013Apr",
        driveTime: "~14 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-philadelphia",
    city: "Philadelphia",
    intro: "Philadelphia\u2019s freezing winters and raw coastal winds make southbound road trips irresistible. These routes head from the City of Brotherly Love to warm destinations ranging from the Carolinas through Florida.",
    routes: [
      {
        name: "Philadelphia to the Outer Banks",
        route: "Philadelphia \u2192 Chesapeake Bay Bridge-Tunnel \u2192 Norfolk \u2192 Outer Banks",
        description: "Cross the engineering marvel of the Chesapeake Bay Bridge-Tunnel and arrive at the wild, windswept Outer Banks. Warm sand, quiet beaches, and charming fishing villages await.",
        bestFor: "Quiet beaches & nature lovers",
        season: "Mar\u2013Nov",
        driveTime: "~7 hours total",
      },
      {
        name: "Philadelphia to Charleston & Savannah",
        route: "Philadelphia \u2192 Richmond \u2192 Fayetteville \u2192 Charleston \u2192 Savannah",
        description: "Follow I-95 south to the crown jewels of the Southern coast. Charleston and Savannah both offer mild winters, world-class dining, beautiful architecture, and warm Southern hospitality.",
        bestFor: "History, food & architecture",
        season: "Oct\u2013May",
        driveTime: "~10 hours to Charleston",
      },
      {
        name: "Philadelphia to Miami & the Keys",
        route: "Philadelphia \u2192 Washington DC \u2192 Jacksonville \u2192 Orlando \u2192 Miami \u2192 Key West",
        description: "The full East Coast run \u2014 trade freezing Philly rain for tropical Florida sunshine. Miami\u2019s Art Deco scene and the turquoise waters of the Keys await.",
        bestFor: "Tropical escape & nightlife",
        season: "Dec\u2013Apr",
        driveTime: "~18 hours to Miami",
      },
      {
        name: "Philadelphia to Hilton Head & Beaufort",
        route: "Philadelphia \u2192 Virginia Beach \u2192 Wilmington \u2192 Hilton Head Island \u2192 Beaufort SC",
        description: "Hug the coast south to the quiet luxury of Hilton Head and the small-town charm of Beaufort, South Carolina. Mild winter weather, pristine beaches, and excellent seafood make this a perfect warm escape.",
        bestFor: "Relaxation & coastal charm",
        season: "Year-round (best Oct\u2013May)",
        driveTime: "~11 hours to Hilton Head",
      },
      {
        name: "Philadelphia to the Gulf Coast",
        route: "Philadelphia \u2192 Charlotte \u2192 Atlanta \u2192 Pensacola \u2192 Destin \u2192 Panama City Beach",
        description: "Cut southwest through the Carolinas and Georgia to reach the stunning emerald waters of the Florida Panhandle. The sugar-white sand beaches here rival anything in the Caribbean.",
        bestFor: "Beach lovers & warm-water swimming",
        season: "Nov\u2013Apr",
        driveTime: "~16 hours total",
      },
    ],
  },
  {
    slug: "warm-road-trips-from-portland",
    city: "Portland",
    intro: "Portland\u2019s famously rainy, overcast winters make the call of the sun impossible to ignore. Head south through California\u2019s wine country, along the Pacific Coast, or straight to the desert \u2014 these drives deliver warmth, clear skies, and adventure.",
    routes: [
      {
        name: "Portland to Southern California via Highway 101",
        route: "Portland \u2192 Redwoods \u2192 Mendocino \u2192 San Francisco \u2192 Santa Barbara \u2192 Los Angeles",
        description: "Hug the Pacific Coast through towering redwoods, charming Mendocino, and across the Golden Gate before reaching the warm sunshine of Santa Barbara and LA. One of the world\u2019s great coastal drives.",
        bestFor: "Scenic driving & coastal beauty",
        season: "Year-round (best May\u2013Oct)",
        driveTime: "~16 hours total",
      },
      {
        name: "Portland to San Diego \u2014 the Full West Coast",
        route: "Portland \u2192 I-5 South \u2192 Sacramento \u2192 Bakersfield \u2192 Los Angeles \u2192 San Diego",
        description: "Take the fast route straight down I-5 through California\u2019s Central Valley and arrive in San Diego\u2019s perfect climate. Year-round sunshine, incredible tacos, and a laid-back surf culture await.",
        bestFor: "Beach life & Mexican food",
        season: "Year-round",
        driveTime: "~16 hours total",
      },
      {
        name: "Portland to Palm Springs & Joshua Tree",
        route: "Portland \u2192 Redding \u2192 Sacramento \u2192 Bakersfield \u2192 Palm Springs \u2192 Joshua Tree",
        description: "Drive south through Northern California and into the warm Coachella Valley. Palm Springs offers mid-century modern style, natural hot springs, and winter highs in the 70s surrounded by dramatic desert mountains.",
        bestFor: "Desert relaxation & national parks",
        season: "Nov\u2013Apr",
        driveTime: "~15 hours total",
      },
      {
        name: "Portland to Phoenix via Crater Lake",
        route: "Portland \u2192 Crater Lake \u2192 Reno \u2192 Las Vegas \u2192 Phoenix",
        description: "Combine Oregon\u2019s most stunning natural wonder with the warm desert Southwest. Stop at Crater Lake (spectacular in any season), pass through Vegas, and end in Phoenix\u2019s 70-degree winter paradise.",
        bestFor: "Desert warmth & natural wonders",
        season: "Oct\u2013Apr (Crater Lake roads weather-dependent)",
        driveTime: "~20 hours total",
      },
      {
        name: "Portland to Sedona & Tucson",
        route: "Portland \u2192 Boise \u2192 Salt Lake City \u2192 Flagstaff \u2192 Sedona \u2192 Tucson",
        description: "Head southeast through the intermountain West to the red-rock beauty of Sedona and the warm Sonoran Desert around Tucson. This drive offers some of the most varied landscapes in America.",
        bestFor: "Desert hiking & photography",
        season: "Oct\u2013Apr",
        driveTime: "~21 hours total",
      },
    ],
  },
];

export function getCityTripBySlug(slug: string): CityTrips | undefined {
  return cityTrips.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cityTrips.map((c) => c.slug);
}
