import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const uploadLink = createUploadLink({ uri: "http://localhost:8000/graphql" });
const link = createHttpLink({ uri: "http://localhost:8000/graphql" });
const cache = new InMemoryCache();

// apollo client setup
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([uploadLink, link])
});

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    uploadGedcom(file: $file)
  }
`;

function App() {
  const handleChange = async (event, mutation) => {
    const {
      target: {
        files: [file]
      }
    } = event;

    const {
      data: { uploadGedcom }
    } = await mutation({
      mutation: UPLOAD_FILE,
      variables: { file },
      fetchPolicy: "no-cache"
    });
  };
  return (
    <div>
      <Mutation mutation={UPLOAD_FILE} fetchPolicy="no-cache">
        {(mutation, { loading }) => (
          <input
            type="file"
            required
            onChange={event => handleChange(event, mutation)}
          />
        )}
      </Mutation>
    </div>
  );
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
