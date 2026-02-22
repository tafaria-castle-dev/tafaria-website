import graphqlClient from '../../../graphql-client';
import { gql } from 'graphql-request';

// Query to get all videos
const GET_VIDEOS = gql`
  query GET_VIDEOS {
    videos {
      id
      description
      title
      video {
        url
      }
    }
  }
`;

// Query to get a single video by ID
const GET_SINGLE_VIDEO = gql`
  query GET_SINGLE_VIDEO($id: ID!) {
    video(where: { id: $id }) {
      id
      description
      title
      video {
        url
      }
    }
  }
`;

export type Video = {
  description: string;
  id: string;
  title: string;
  video: {
    url: string;
  };
};

type FetchVideosResponse = {
  videos: Video[];
};

type FetchSingleVideoResponse = {
  video: Video;
};

// Fetch all videos
export const fetchVideos = async (): Promise<Video[]> => {
  const data: FetchVideosResponse = await graphqlClient.request(GET_VIDEOS);
  return data.videos;
};

// Fetch a single video by ID
export const fetchSingleVideo = async (id: string): Promise<Video> => {
  const data: FetchSingleVideoResponse = await graphqlClient.request(GET_SINGLE_VIDEO, { id });
  return data.video;
};
