import {
	type CacheConfig,
	Environment,
	Network,
	RecordSource,
	type RequestParameters,
	Store,
	type UploadableMap,
	type Variables,
} from "relay-runtime";

async function fetchRelay(
	request: RequestParameters,
	variables: Variables,
	_cacheConfig: CacheConfig,
	_uploadables?: UploadableMap | null,
) {
	return fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			/**
			 * THIS IS A BASIC FRONTEND VITE APP
			 * DO NOT PUBLISH THIS APPLICATION ONLINE
			 * YOUR GITHUB TOKEN WILL BE PUBLICLY AVAILABLE
			 * */
			Authorization: `Bearer ${import.meta.env.VITE_GH_TOKEN}`,
		},
		body: JSON.stringify({
			query: request.text,
			variables,
		}),
	}).then((res) => res.json());
}

export default new Environment({
	network: Network.create(fetchRelay),
	store: new Store(new RecordSource()),
});
