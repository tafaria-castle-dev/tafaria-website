/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from '@/app/components/blogcard';
import { gql } from 'graphql-request';
import graphqlClient from '../../../graphql-client';

// Define the GET_POSTS query to fetch posts, including images, content, and categories.
const GET_POSTS = gql`
    query {
        posts(
            where: { categories: { some: { name: { equals: "Blogs" } } } }
            orderBy: { priority: asc }
        ) {
            priority
            slug
            images {
                title
                description
                id
                image {
                    url
                    width
                    height
                    id
                    extension
                    filesize
                }
            }
            author {
                name
            }
            title
            id
            created_at
            content {
                document
            }
            categories {
                name
                slug
            }
        }
    }
`;

const GET_POST_BY_ID = gql`
    query GetPostById($id: ID!) {
        post(where: { id: $id }, orderBy: { priority: asc }) {
            title
            slug
            images {
                title
                description
                id
                image {
                    url
                    width
                    height
                    id
                    extension
                    filesize
                }
            }
            author {
                name
            }
            created_at
            content {
                document
            }
            categories {
                name
                slug
            }
            videos {
                id
                title
                video {
                    url
                }
                description
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
export interface Images {
    image: Image;
}
export interface ImageObject {
    slug: string;
    description: string;
    id: string;
    title: string;
    image: Image;
}
export type Post = {
    images: ImageObject[];
    author: {
        name: string;
    };
    title: string;
    id: string;
    slug: string;
    priority: number;
    created_at: string;
    content: Content;
    categories: {
        name: string;
        slug: string;
    }[];
    videos: {
        id: string;
        title: string;
        video: {
            url: string;
        };
        description: string;
    }[];
};

type FetchPostsResponse = {
    posts: Post[];
};

export const fetchPosts = async (): Promise<Post[]> => {
    const data: FetchPostsResponse = await graphqlClient.request(GET_POSTS);
    return data.posts;
};

type FetchPostByIdResponse = {
    post: Post;
};

export const fetchPostById = async (id: string): Promise<Post> => {
    const data: FetchPostByIdResponse = await graphqlClient.request(
        GET_POST_BY_ID,
        { id },
    );
    return data.post;
};
