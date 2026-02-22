/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request';
import graphqlClient from '../../../graphql-client';

// Define the GET_PUBLISHED_HERO_SECTION query
const GET_PUBLISHED_HERO_SECTION = gql`
    query GetPublishedHeroSection($where: HeroSectionWhereInput!) {
        heroSections(take: 1, orderBy: { created_at: desc }, where: $where) {
            title
            images {
                image {
                    url
                    width
                    height
                    id
                }
            }
            videolinks {
                id
                title
                description
                link
            }
            videos {
                id
                title
                video {
                    url
                }
                description
            }
            status
        }
    }
`;

const variables = {
    where: {
        status: {
            equals: 'published',
        },
    },
};

// Define the HeroSection type
export type HeroSection = {
    images: {
        image: {
            url: string;
            width: number;
            height: number;
            id: string;
        };
    }[];

    title: string;
    id: string;
    videos: {
        id: string;
        title: string;
        video: {
            url: string;
        };
        description: string;
    }[];
    videolinks: {
        id: string;
        title: string;
        link: string;
        description: string;
    }[];
};

// Define the expected response type from the query
type FetchHeroSectionResponse = {
    heroSections: HeroSection[]; // You need to return an array of heroSections
};

// Fetch function
export const fetchHerosection = async (): Promise<HeroSection | null> => {
    try {
        const data: FetchHeroSectionResponse = await graphqlClient.request(
            GET_PUBLISHED_HERO_SECTION,
            variables,
        );
        return data.heroSections[0] || null; // Returning the first published hero section or null if none
    } catch (error) {
        console.error('Error fetching hero section:', error);
        throw error; // You may want to handle errors more gracefully in a production app
    }
};
