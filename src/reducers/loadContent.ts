import { defaultState } from "../defaultState";
import { LoadContentAction } from "../actions/loadContent";
import { Competitor } from "../types/GlobalState";

export const LOAD_CONTENT_SUCCESS = 'loadContentSuccess';
export type LOAD_CONTENT_SUCCESS = 'loadContentSuccess';

export const LOAD_CONTENT_FAILURE = 'loadContentFailure';
export type LOAD_CONTENT_FAILURE = 'loadContentFailure';

export const LOAD_CONTENT_STARTED = 'loadContentStarted';
export type LOAD_CONTENT_STARTED = 'loadContentStarted';

// TODO: create a test to sync these values with backend
export enum MediaType {
  PHOTO = 1,
  VIDEO = 2,
  // CAROUSEL = 8,
}

export type MediaItem = {
  type: MediaType,
  url: string,
  coverUrl?: string,
}

export type Product = {
  name: string
  currentPrice: string
  fullPrice: string
  discount: number
  productId: string
  merchant: {
    id: string
    username: string
  }
  mainImage: string
  externalUrl: string
  reviewStatus: string
}

export type Content = {
  pk: Competitor['userPk']
  likeCount: number
  commentCount: number
  products: Product[]
  mediaType: MediaType
  itemUrl: string
  viewCount: number | null
  caption: string | null
  location: {
    id: string
    name: string
    address: string
    lng: number
    lat: number
  } | null
  content: MediaItem[]
  engagementRate: number
  hashtags: string[]
  mentions: string[]
}

export const loadContentReducer = (state: typeof defaultState.loadContent = defaultState.loadContent, action: LoadContentAction): typeof defaultState.loadContent => {
  switch (action.type) {
    case LOAD_CONTENT_STARTED:
      return {
        ...state,
        loading: true
      };
    case LOAD_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        content: action.payload,
      };
    case LOAD_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
