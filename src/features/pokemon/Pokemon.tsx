import type { JSX } from "react"
import { useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonDetailQuery, useGetPokemonQuery } from "./pokemonApiSlice"
import { PokemonPaginatedResourceResponse } from "./pokemonTypes"
import fuzzysort from 'fuzzysort'
const options = [6, 12, 20, 30]
function PokemonItem({url, name}: {url:string, name:string}): JSX.Element{
  const [isOpen, setIsOpen] =  useState(false)
  const [hasBeenHovered, setIsHovered] = useState(false)
  const urlSplit = url.split("/")


  // "https://pokeapi.co/api/v2/pokemon/25/"
  // final parts output is empty(-1), -2 contains the actual id
  const id = Number(urlSplit[urlSplit.length-2]) 

   const { data, isFetching, isError } = useGetPokemonDetailQuery(id, {
    skip: !hasBeenHovered,
  })

  return (
    <div onMouseEnter={() => setIsHovered(true)}>
      <blockquote key={id} >
        {name.toUpperCase()}
      </blockquote>
      <button
        onClick={() => setIsOpen(!isOpen)}
      >
        
      </button>
      {isOpen && (
        <div>
          <p>is open</p>
          <p>{data?.weight}</p>      
        </div>
      )}
    </div>

  )
}

export const Pokemon = (): JSX.Element | null => {
  const [numberOfQuotes, setNumberOfQuotes] = useState(6)
  const {data, isError, isLoading, isSuccess } = useGetPokemonQuery()
  const [searchTerm, setSearchTerm] = useState("")


  if(data == undefined) return(
    <div>
        <h1>Hubo un error al cargar: ${isError}</h1>
      </div>);

  const sortedData = searchTerm.length > 1 ? fuzzysort.go(searchTerm, data.results, {key: 'name'}).map(result => result.obj) : data.results

  if (isError) {
    return (
      <div>
        <h1>Hubo un error al cargar: ${isError}</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1>Cargando...</h1>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className={styles.container}>

        <input
          type="text"
          placeholder="Busca Pokémon..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.input}
        />

        <h3>Seleccione la cantidad de pokemones a mostrar:</h3>
        <select
          className={styles.select}
          value={numberOfQuotes}
          onChange={e => {
            setNumberOfQuotes(Number(e.target.value))
          }}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      {sortedData.slice(0,numberOfQuotes).map(p => (
          <PokemonItem key={p.name} name={p.name} url={p.url} />
        ))}
      </div>
    )
  }

  return null
}
