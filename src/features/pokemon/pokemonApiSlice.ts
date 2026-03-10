// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { NamedAPIResource, Pokemon, PokemonPaginatedResourceResponse } from "./pokemonTypes"

// Define a service using a base URL and expected endpoints
export const pokemonApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/pokemon/" }),
  reducerPath: "pokemonApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Pokemon"],
  endpoints: build => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getPokemon: build.query<PokemonPaginatedResourceResponse, number>({
      query: (limit = 6) => `?limit=1350`,
      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (_result, _error, id) => [{ type: "Pokemon", id }],
    }),
  }),
})

export const pokemonDetailApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  reducerPath: "pokemonDetailApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["PokemonDetail"],
  endpoints: build => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getPokemonDetail: build.query<Pokemon, number>({
      query: (id) => `pokemon/${id}`,
      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (_result, _error, id) => [{ type: "PokemonDetail", id }],
    }),
  }),
})

export const { useGetPokemonQuery } = pokemonApiSlice;
export const { useGetPokemonDetailQuery } = pokemonDetailApiSlice;
