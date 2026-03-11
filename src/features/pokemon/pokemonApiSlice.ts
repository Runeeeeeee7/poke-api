import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {  Pokemon, PokemonPaginatedResourceResponse } from "./pokemonTypes"

export const pokemonApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/pokemon/" }),
  reducerPath: "pokemonApi",
  tagTypes: ["Pokemon"],
  endpoints: build => ({
    // we ignore the limit and just pull everything
    // its lightweight enoug we can afford to pull all entries and only search for details once clicked
    getPokemon: build.query<PokemonPaginatedResourceResponse, void>({
      query: () => `?limit=1350`,

      providesTags: (_result, _error) => [{ type: "Pokemon"}],
    }),
  }),
})

export const pokemonDetailApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  reducerPath: "pokemonDetailApi",
  tagTypes: ["PokemonDetail"],
  endpoints: build => ({

    getPokemonDetail: build.query<Pokemon, number>({
      query: (id) => `pokemon/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PokemonDetail", id }],
    }),
  }),
})

export const { useGetPokemonQuery } = pokemonApiSlice;
export const { useGetPokemonDetailQuery } = pokemonDetailApiSlice;
