/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from '@/app/components/blogcard';
import { gql } from 'graphql-request';
import graphqlClient from '../../../graphql-client';

const GET_POSTS_BY_CATEGORY = gql`
    query GetPostsByCategory($categoryName: String!) {
        categories(where: { name: { equals: $categoryName } }) {
            name
            description
            image {
                url
            }
            id
            posts(
                where: { status: { equals: "published" } }
                orderBy: { priority: asc }
            ) {
                id
                created_at
                title
                slug
                priority
                images {
                    title
                    description
                    id
                    updated_at
                    image {
                        url
                        width
                        height
                        id
                        extension
                        filesize
                    }
                }
                videos {
                    title
                    description
                    id
                    video {
                        url
                    }
                }
                content {
                    document
                }
            }
        }
    }
`;

const GET_POSTS_BY_CATEGOR_SLUG = gql`
    query GetPostsByCategory($categorySlug: String!) {
        categories(where: { slug: { equals: $categorySlug } }) {
            name
            description
            slug
            image {
                url
            }
            id
            slug
            posts(
                where: { status: { equals: "published" } }
                orderBy: { priority: asc }
            ) {
                id
                created_at
                title
                slug
                priority
                images {
                    title
                    description
                    id
                    updated_at
                    image {
                        url
                        width
                        height
                        id
                        extension
                        filesize
                    }
                }
                videos {
                    title
                    description
                    id
                    video {
                        url
                    }
                }
                content {
                    document
                }
            }
        }
    }
`;

export type Image = {
    url: string;
    width: number;
    height: number;
    id: string;
    extension: string;
    filesize: number;
};

type Video = {
    url: string;
};

export type Post = {
    id: string;
    title: string;
    created_at: string;
    priority: number;
    slug: string;
    images: {
        slug: string;
        description: string;
        id: string;
        title: string;
        updated_at: string;
        image: Image;
    }[];
    videos: {
        description: string;
        id: string;
        title: string;
        video: Video;
    }[];
    content: Content;
};

type Category = {
    name: string;
    slug: string;
    description: string;
    image: Image;
    id: string;
    posts: Post[];
    images: Image[];
    videos: Video[];
};

type FetchCategoryResponse = {
    categories: Category[];
};

export const fetchPostsByCategorySlug = async (
    categorySlug: string,
): Promise<Category | null> => {
    const data: FetchCategoryResponse = await graphqlClient.request(
        GET_POSTS_BY_CATEGOR_SLUG,
        { categorySlug },
    );

    return data.categories.length > 0 ? data.categories[0] : null;
};

export const fetchPostsByCategory = async (
    categoryName: string,
): Promise<Category | null> => {
    const data: FetchCategoryResponse = await graphqlClient.request(
        GET_POSTS_BY_CATEGORY,
        { categoryName },
    );
    return data.categories.length > 0 ? data.categories[0] : null;
};
