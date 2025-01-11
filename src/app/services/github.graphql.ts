import { gql } from 'apollo-angular';

const GET_AUTHENTICATED_USER_CONTRIBUTIONS = gql`
  query GetAuthenticatedUserContributions($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

const GET_USER = gql`
query {
  viewer {
    login
    id
    avatarUrl
    name
  }
}
`
;

export { GET_AUTHENTICATED_USER_CONTRIBUTIONS, GET_USER };