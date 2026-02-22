/* eslint-disable @typescript-eslint/no-explicit-any */
import graphqlClient from '../../../graphql-client';
import { gql } from 'graphql-request';

const GET_GIFT_SHOPS = gql`
  query GET_GIFT_SHOPS {
    giftShops {
      amount
      images {
        title
        image {
          url
        }
      }
      id
      title
      videos {
        title
        video {
          url
        }
      }
      description
    }
  }
`;

export type GiftShop = {
  amount: number;
  quantity: number;
  images: {
    title: string;
    image: {
      url: string;
    };
  }[];
  id: string;
  title: string;
  videos: {
    title: string;
    video: {
      url: string;
    };
  }[];
  description: string;
};

type FetchGiftShopsResponse = {
  giftShops: GiftShop[];
};

export const fetchGiftShops = async (): Promise<GiftShop[]> => {
  const data: FetchGiftShopsResponse = await graphqlClient.request(GET_GIFT_SHOPS);
  return data.giftShops;
};
