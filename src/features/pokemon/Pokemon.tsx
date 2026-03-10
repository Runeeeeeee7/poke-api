import type { JSX } from "react"
import { useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonDetailQuery, useGetPokemonQuery } from "./pokemonApiSlice"

const options = [6, 12, 20, 30]
function PokemonItem({url, name}: {url:string, name:string}): JSX.Element{
  const [isOpen, setIsOpen] =  useState(false)
  const urlSplit = url.split("/")
  const id = urlSplit[urlSplit.length-2] //final parts output is empty(-1), -2 contains the actual id

  return (
    <div>
      <blockquote key={id} >
        {name.toUpperCase()}
      </blockquote>
      <button
        onClick={() => setIsOpen(!isOpen)}
      >
        
      </button>
      {isOpen && (
        <p>is open</p>
      )}
    </div>

  )
}

export const Pokemon = (): JSX.Element | null => {
  const [numberOfQuotes, setNumberOfQuotes] = useState(6)
  const { data, isError, isLoading, isSuccess } = useGetPokemonQuery()

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
      {data.results.slice(0,numberOfQuotes).map(p => (
          <PokemonItem key={p.name} name={p.name} url={p.url} />
        ))}
      </div>
    )
  }

  return null
}
