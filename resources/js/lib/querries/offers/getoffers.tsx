/* eslint-disable @typescript-eslint/no-explicit-any */
import graphqlClient from '../../../graphql-client';
import { gql } from 'graphql-request';

const GET_OFFERS = gql`
  query GET_OFFERS {
    offers {
      image {
        height
        filesize
        extension
        url
        id
        width
      }
      name
      description
      id
      priority
      slug
    }
  }
`;

export type OfferImage = {
  height: number;
  filesize: number;
  extension: string;
  url: string;
  id: string;
  width: number;
};

export type Offer = {
  image: OfferImage;
  name: string;
  description: string;
  id: string;
  priority: number;
  slug: string;
};

type FetchOffersResponse = {
  offers: Offer[];
};

export const fetchOffers = async (): Promise<Offer[]> => {
  const data: FetchOffersResponse = await graphqlClient.request(GET_OFFERS);
  return data.offers;
};