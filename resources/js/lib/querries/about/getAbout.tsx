/* eslint-disable @typescript-eslint/no-explicit-any */
import graphqlClient from "../../../graphql-client";
import { gql } from "graphql-request";
import { Content } from "@/app/components/blogcard";

const GET_ABOUTS_INTRO = gql`
  query GET_ABOUTS_INTRO {
    abouts {
      name
      title
      content {
        document
      }
    }
  }
`;

export type About = {
  name: string;
  title: string;
  content: Content;
};

type FetchAboutsResponse = {
  abouts: About[];
};

export const fetchAbouts = async (): Promise<About[]> => {
  try {
    const data: FetchAboutsResponse = await graphqlClient.request(
      GET_ABOUTS_INTRO
    );
    return data.abouts;
  } catch (error) {
    console.error("Error fetching abouts:", error);
    return [];
  }
};
