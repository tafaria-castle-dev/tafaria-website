import { gql } from 'graphql-request';
import graphqlClient from '../../../graphql-client';

const GET_IMAGES = gql`
    query GET_IMAGES($where: ImageWhereInput!) {
        images(where: $where, orderBy: { priority: asc }) {
            id
            title
            description
            updated_at
            image {
                url
                width
                id
                height
                extension
                filesize
            }
            tag {
                title
            }
        }
    }
`;

const GET_SINGLE_IMAGE = gql`
    query GET_SINGLE_IMAGE($id: ID!) {
        image(where: { id: $id }) {
            description
            id
            slug
            updated_at
            image {
                url
                width
                id
                height
                extension
                filesize
            }
            title
        }
    }
`;

export type Image = {
    description: string;
    id: string;
    slug: string;
    updated_at: string;
    image: {
        url: string;
        width: number;
        height: number;
        id: string;
        extension: string;
        filesize: number;
    };
    title: string;
};

type FetchImagesResponse = {
    images: Image[];
};

type FetchSingleImageResponse = {
    image: Image;
};

// export const fetchImages = async (): Promise<Image[]> => {
//   const data: FetchImagesResponse = await graphqlClient.request(GET_IMAGES);
//   return data.images;
// };

export const fetchImages = async (filter?: {
    tagTitle?: string;
}): Promise<Image[]> => {
    const variables = {
        where: filter?.tagTitle
            ? {
                  tag: {
                      title: {
                          equals: filter.tagTitle,
                      },
                  },
              }
            : {}, // Provide empty object as fallback
    };

    const data: FetchImagesResponse = await graphqlClient.request(
        GET_IMAGES,
        variables,
    );
    return data.images;
};

// Fetch a single image by ID
export const fetchSingleImage = async (id: string): Promise<Image> => {
    const data: FetchSingleImageResponse = await graphqlClient.request(
        GET_SINGLE_IMAGE,
        { id },
    );
    return data.image;
};
