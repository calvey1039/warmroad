const EXPEDIA_AFFILIATE_URL = "https://expedia.com/affiliate/ZMHYMeV";
const EXPEDIA_HOTEL_SEARCH_URL = "https://www.expedia.com/Hotel-Search";

export type ExpediaBookingType = "lodging" | "hotels" | "flights" | "cars";

interface ExpediaAffiliateOptions {
  destination: string;
  bookingType: ExpediaBookingType;
  startDate?: string;
  endDate?: string;
}

export function buildExpediaAffiliateUrl({
  destination,
  bookingType,
  startDate,
  endDate,
}: ExpediaAffiliateOptions): string {
  if (bookingType === "lodging" || bookingType === "hotels") {
    const hotelSearchParams = new URLSearchParams({
      destination,
      rooms: "1",
      adults: "2",
    });

    if (startDate) hotelSearchParams.set("startDate", startDate);
    if (endDate) hotelSearchParams.set("endDate", endDate);

    const hotelSearchUrl = `${EXPEDIA_HOTEL_SEARCH_URL}?${hotelSearchParams.toString()}`;
    const affiliateParams = new URLSearchParams({
      url: hotelSearchUrl,
    });

    return `${EXPEDIA_AFFILIATE_URL}?${affiliateParams.toString()}`;
  }

  const params = new URLSearchParams({
    destination,
    bookingType,
  });

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  return `${EXPEDIA_AFFILIATE_URL}?${params.toString()}`;
}
