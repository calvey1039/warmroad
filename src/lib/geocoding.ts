// Geocoding utility for zip code and city/state to coordinates

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
  state?: string;
}

const stateAbbreviations: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

function parseCityState(input: string): { city: string; stateFilter: string | undefined } | null {
  const commaIdx = input.indexOf(",");
  if (commaIdx === -1) return null;

  const city = input.substring(0, commaIdx).trim();
  let stateStr = input.substring(commaIdx + 1).trim();

  if (!city || !stateStr) return null;

  stateStr = stateStr
    .replace(/['']/g, "'")
    .replace(/'d$/i, "D")
    .replace(/'ll$/i, "LL")
    .replace(/'s$/i, "S")
    .replace(/[.']/g, "")
    .trim();

  const upper = stateStr.toUpperCase();

  if (stateAbbreviations[upper]) {
    return { city, stateFilter: stateAbbreviations[upper] };
  }

  const fullName = Object.values(stateAbbreviations).find(
    name => name.toLowerCase() === stateStr.toLowerCase()
  );
  if (fullName) {
    return { city, stateFilter: fullName };
  }

  return { city, stateFilter: undefined };
}

export async function geocodeLocation(query: string): Promise<GeocodingResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (/^\d{5}$/.test(trimmed.trim())) {
    return await geocodeZipCode(trimmed);
  }

  return await geocodeCity(trimmed);
}

async function geocodeCity(input: string): Promise<GeocodingResult | null> {
  try {
    const parsed = parseCityState(input);
    const searchName = parsed?.city || input;
    const stateFilter = parsed?.stateFilter;

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return await geocodeCityWithNominatim(input);
    }

    const usResults = data.results.filter((r: { country_code: string }) => r.country_code === "US");

    let result;
    if (stateFilter && usResults.length > 0) {
      result = usResults.find((r: { admin1?: string }) =>
        r.admin1?.toLowerCase() === stateFilter.toLowerCase()
      ) || usResults[0];
    } else if (usResults.length > 0) {
      result = usResults[0];
    } else {
      result = data.results[0];
    }

    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      state: result.admin1,
    };
  } catch (error) {
    console.error("City geocoding error:", error);
    return null;
  }
}

async function geocodeCityWithNominatim(input: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&country=US&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { "User-Agent": "WarmRoad App" },
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name?.split(",")[0] || input,
      state: result.display_name?.split(",")[1]?.trim(),
    };
  } catch (error) {
    console.error("Nominatim city geocoding error:", error);
    return null;
  }
}

async function geocodeZipCode(zipCode: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(zipCode)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return await geocodeZipWithNominatim(zipCode);
    }

    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      state: result.admin1,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

async function geocodeZipWithNominatim(zipCode: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zipCode)}&country=US&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { "User-Agent": "WarmRoad App" },
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name?.split(",")[0] || zipCode,
      state: result.display_name?.split(",")[1]?.trim(),
    };
  } catch (error) {
    console.error("Nominatim geocoding error:", error);
    return null;
  }
}

// Reverse geocode coordinates to get a city/town name
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&format=json&zoom=10`;
    const response = await fetch(url, {
      headers: { "User-Agent": "WarmRoad/1.0" },
    });
    if (!response.ok) return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    const data = await response.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
    if (city) return city;
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  } catch {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
}

export async function fetchGasPrice(): Promise<{ price: number; date: string; source: string }> {
  try {
    const response = await fetch(
      "https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=DEMO_KEY&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMR_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1",
      { next: { revalidate: 3600 } } as RequestInit
    );
    if (!response.ok) throw new Error("Failed to fetch gas price");

    const data = await response.json();
    if (data.response?.data?.[0]?.value) {
      return {
        price: parseFloat(data.response.data[0].value),
        date: data.response.data[0].period,
        source: "EIA",
      };
    }
    throw new Error("No data in response");
  } catch (error) {
    console.error("Gas price fetch error:", error);
    return { price: 2.93, date: new Date().toISOString().split("T")[0], source: "default" };
  }
}
