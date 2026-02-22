/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from '@/app/components/blogcard';
import { gql } from 'graphql-request';
import graphqlClient from '../../../graphql-client';
const GET_CATEGORIES = gql`
    query {
        categories(orderBy: { priority: asc }) {
            name
            slug
            description
            priority
            image {
                url
            }
            id
            posts {
                priority
                title
                created_at
                updated_at
                slug
                images {
                    image {
                        url
                        width
                        height
                        extension
                        id
                    }
                }
                content {
                    document
                }
            }
        }
    }
`;

type Category = {
    name: string;
    slug: string;
    description: string;
    priority: number;
    image: {
        url: string;
    };
    id: string;
    posts: {
        title: string;
        slug: string;
        created_at: string;
        updated_at: string;
        priority: number;
        images: {
            image: {
                url: string;
                width: number;
                height: number;
                extension: string;
                id: string;
            };
        }[];
        content: Content;
    }[];
};

type FetchCategoriesResponse = {
    categories: Category[];
};

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const data: FetchCategoriesResponse =
            await graphqlClient.request(GET_CATEGORIES);
        return data.categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};
