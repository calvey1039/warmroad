export interface CityOrigin {
  name: string;
  state: string;
  stateAbbr: string;
  slug: string;
  lat: number;
  lon: number;
}

const cityOrigins: CityOrigin[] = [
  { name: "Columbus", state: "Ohio", stateAbbr: "OH", slug: "from-columbus-oh", lat: 39.9612, lon: -82.9988 },
  { name: "Cleveland", state: "Ohio", stateAbbr: "OH", slug: "from-cleveland-oh", lat: 41.4993, lon: -81.6944 },
  { name: "Cincinnati", state: "Ohio", stateAbbr: "OH", slug: "from-cincinnati-oh", lat: 39.1031, lon: -84.5120 },
  { name: "Chicago", state: "Illinois", stateAbbr: "IL", slug: "from-chicago-il", lat: 41.8781, lon: -87.6298 },
  { name: "Detroit", state: "Michigan", stateAbbr: "MI", slug: "from-detroit-mi", lat: 42.3314, lon: -83.0458 },
  { name: "Pittsburgh", state: "Pennsylvania", stateAbbr: "PA", slug: "from-pittsburgh-pa", lat: 40.4406, lon: -79.9959 },
  { name: "Indianapolis", state: "Indiana", stateAbbr: "IN", slug: "from-indianapolis-in", lat: 39.7684, lon: -86.1581 },
  { name: "Nashville", state: "Tennessee", stateAbbr: "TN", slug: "from-nashville-tn", lat: 36.1627, lon: -86.7816 },
  { name: "Louisville", state: "Kentucky", stateAbbr: "KY", slug: "from-louisville-ky", lat: 38.2527, lon: -85.7585 },
  { name: "Charlotte", state: "North Carolina", stateAbbr: "NC", slug: "from-charlotte-nc", lat: 35.2271, lon: -80.8431 },
  { name: "Atlanta", state: "Georgia", stateAbbr: "GA", slug: "from-atlanta-ga", lat: 33.7490, lon: -84.3880 },
  { name: "Knoxville", state: "Tennessee", stateAbbr: "TN", slug: "from-knoxville-tn", lat: 35.9606, lon: -83.9207 },
  { name: "Asheville", state: "North Carolina", stateAbbr: "NC", slug: "from-asheville-nc", lat: 35.5951, lon: -82.5515 },
  { name: "St. Louis", state: "Missouri", stateAbbr: "MO", slug: "from-st-louis-mo", lat: 38.6270, lon: -90.1994 },
  { name: "Kansas City", state: "Missouri", stateAbbr: "MO", slug: "from-kansas-city-mo", lat: 39.0997, lon: -94.5786 },
  { name: "Minneapolis", state: "Minnesota", stateAbbr: "MN", slug: "from-minneapolis-mn", lat: 44.9778, lon: -93.2650 },
  { name: "Milwaukee", state: "Wisconsin", stateAbbr: "WI", slug: "from-milwaukee-wi", lat: 43.0389, lon: -87.9065 },
  { name: "Madison", state: "Wisconsin", stateAbbr: "WI", slug: "from-madison-wi", lat: 43.0731, lon: -89.4012 },
  { name: "Des Moines", state: "Iowa", stateAbbr: "IA", slug: "from-des-moines-ia", lat: 41.5868, lon: -93.6250 },
  { name: "Omaha", state: "Nebraska", stateAbbr: "NE", slug: "from-omaha-ne", lat: 41.2565, lon: -95.9345 },
  { name: "Denver", state: "Colorado", stateAbbr: "CO", slug: "from-denver-co", lat: 39.7392, lon: -104.9903 },
  { name: "Salt Lake City", state: "Utah", stateAbbr: "UT", slug: "from-salt-lake-city-ut", lat: 40.7608, lon: -111.8910 },
  { name: "Phoenix", state: "Arizona", stateAbbr: "AZ", slug: "from-phoenix-az", lat: 33.4484, lon: -112.0740 },
  { name: "Las Vegas", state: "Nevada", stateAbbr: "NV", slug: "from-las-vegas-nv", lat: 36.1699, lon: -115.1398 },
  { name: "Los Angeles", state: "California", stateAbbr: "CA", slug: "from-los-angeles-ca", lat: 34.0522, lon: -118.2437 },
  { name: "San Diego", state: "California", stateAbbr: "CA", slug: "from-san-diego-ca", lat: 32.7157, lon: -117.1611 },
  { name: "San Francisco", state: "California", stateAbbr: "CA", slug: "from-san-francisco-ca", lat: 37.7749, lon: -122.4194 },
  { name: "Portland", state: "Oregon", stateAbbr: "OR", slug: "from-portland-or", lat: 45.5152, lon: -122.6784 },
  { name: "Seattle", state: "Washington", stateAbbr: "WA", slug: "from-seattle-wa", lat: 47.6062, lon: -122.3321 },
  { name: "Boise", state: "Idaho", stateAbbr: "ID", slug: "from-boise-id", lat: 43.6150, lon: -116.2023 },
  { name: "Dallas", state: "Texas", stateAbbr: "TX", slug: "from-dallas-tx", lat: 32.7767, lon: -96.7970 },
  { name: "Austin", state: "Texas", stateAbbr: "TX", slug: "from-austin-tx", lat: 30.2672, lon: -97.7431 },
  { name: "Houston", state: "Texas", stateAbbr: "TX", slug: "from-houston-tx", lat: 29.7604, lon: -95.3698 },
  { name: "San Antonio", state: "Texas", stateAbbr: "TX", slug: "from-san-antonio-tx", lat: 29.4241, lon: -98.4936 },
  { name: "Oklahoma City", state: "Oklahoma", stateAbbr: "OK", slug: "from-oklahoma-city-ok", lat: 35.4676, lon: -97.5164 },
  { name: "New Orleans", state: "Louisiana", stateAbbr: "LA", slug: "from-new-orleans-la", lat: 29.9511, lon: -90.0715 },
  { name: "Tampa", state: "Florida", stateAbbr: "FL", slug: "from-tampa-fl", lat: 27.9506, lon: -82.4572 },
  { name: "Orlando", state: "Florida", stateAbbr: "FL", slug: "from-orlando-fl", lat: 28.5383, lon: -81.3792 },
  { name: "Jacksonville", state: "Florida", stateAbbr: "FL", slug: "from-jacksonville-fl", lat: 30.3322, lon: -81.6557 },
  { name: "Miami", state: "Florida", stateAbbr: "FL", slug: "from-miami-fl", lat: 25.7617, lon: -80.1918 },
  { name: "Washington", state: "D.C.", stateAbbr: "DC", slug: "from-washington-dc", lat: 38.9072, lon: -77.0369 },
  { name: "Baltimore", state: "Maryland", stateAbbr: "MD", slug: "from-baltimore-md", lat: 39.2904, lon: -76.6122 },
  { name: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA", slug: "from-philadelphia-pa", lat: 39.9526, lon: -75.1652 },
  { name: "New York", state: "New York", stateAbbr: "NY", slug: "from-new-york-ny", lat: 40.7128, lon: -74.0060 },
  { name: "Boston", state: "Massachusetts", stateAbbr: "MA", slug: "from-boston-ma", lat: 42.3601, lon: -71.0589 },
  { name: "Buffalo", state: "New York", stateAbbr: "NY", slug: "from-buffalo-ny", lat: 42.8864, lon: -78.8784 },
  { name: "Rochester", state: "New York", stateAbbr: "NY", slug: "from-rochester-ny", lat: 43.1566, lon: -77.6088 },
  { name: "Albany", state: "New York", stateAbbr: "NY", slug: "from-albany-ny", lat: 42.6526, lon: -73.7562 },
  { name: "Richmond", state: "Virginia", stateAbbr: "VA", slug: "from-richmond-va", lat: 37.5407, lon: -77.4360 },
  { name: "Charleston", state: "South Carolina", stateAbbr: "SC", slug: "from-charleston-sc", lat: 32.7765, lon: -79.9311 },
];

export function getCityOrigin(slug: string): CityOrigin | undefined {
  return cityOrigins.find((c) => c.slug === slug);
}

export function getAllCityOriginSlugs(): string[] {
  return cityOrigins.map((c) => c.slug);
}

export function getAllCityOrigins(): CityOrigin[] {
  return cityOrigins;
}
