import { gql } from "@apollo/client";

export const GETQUERY = gql`
  {
    todos(sort: "id:desc") {
      data {
        id
        attributes {
          todoText
          createdAt
        }
      }
    }
  }
`;
