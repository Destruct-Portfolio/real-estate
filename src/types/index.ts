export interface Ad_Object {
  id: string | null;

  Number_Of_Rooms: string | null;

  square_meters: string | null;

  property_location: string | null;

  property_price: string | null;

  article_url: string | null;

  website_source: string | null;

  property_pictures: string[] | null;

  PhoneNumber: string | null;
}

export interface Zida_Api {
  structure: number;
  category: string;
  m2: number;
  year: number;
  state: string;
  terrace: number;
  bathroom: number;
  toilet: number;
  cableTv: boolean;
  phone: number;
  internetType: string;
  airConditioning: boolean;
  ventilation: boolean;
  kitchen: boolean;
  kitchenElements: boolean;
  closet: boolean;
  suitableFor?: (null)[] | null;
  lastFloor: boolean;
  furnished: string;
  heatingType: string;
  parkingIn?: (string)[] | null;
  busLine: string;
  elevator: number;
  yard: boolean;
  overlooks?: (string)[] | null;
  sideOfOrientation?: (string)[] | null;
  inhabitable: boolean;
  wheelchairAccess: boolean;
  sewerage: boolean;
  id: string;
  status: string;
  for: string;
  price: number;
  averageSalePricePerM2: number;
  placeId: number;
  registered: string;
  addressNumber: string;
  desc: string;
  featuredExpiresAt: string;
  featuredPlusRefreshCounter: number;
  highlightedExpiresAt: string;
  featuredCounter: number;
  featuredDuration: number;
  lastBoostedAt: string;
  refreshedAt: string;
  lastPromotedAt: string;
  featureRefreshAt: string;
  authorId: number;
  author: Author;
  images?: (ImagesEntity)[] | null;
  area: string;
  redactedFloor: number;
  redactedTotalFloors: number;
  humanReadableDescription: string;
  detailedTitle: string;
  type: string;
  structureName: string;
  title: string;
  url: string;
  cityId: number;
  citySlug: string;
  parentPlaceId1: number;
  parentPlaceId2: number;
  placeIdsAndTitles?: (PlaceIdsAndTitlesEntity)[] | null;
  placeSlugs?: (string)[] | null;
  safeAddress: string;
  premium: boolean;
  featured: boolean;
  featuredPlus: boolean;
  featuredExpiresIn: string;
  extra: boolean;
  highlighted: boolean;
  superIndividual: boolean;
  lastBoostedAgo: string;
  featureRefreshIn: string;
  checkedByIndividualAgo: string;
  createdAgo: string;
}
export interface Author {
  id: number;
  fullName: string;
  phones?: (PhonesEntity)[] | null;
}
export interface PhonesEntity {
  full: string;
  national: string;
  isViber: boolean;
  regionCode: string;
}
export interface ImagesEntity {
  id: string;
  adDetails: any;
}

export interface PlaceIdsAndTitlesEntity {
  id: number;
  title: string;
}
