import type { JSX } from "react"
import { useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonQuery } from "./pokemonApiSlice"

const options = [6, 12, 20, 30]

export const Pokemon = (): JSX.Element | null => {
  const [numberOfQuotes, setNumberOfQuotes] = useState(10)
  const { data, isError, isLoading, isSuccess } = useGetPokemonQuery(numberOfQuotes)

  if (isError) {
    return (
      <div>
        <h1>Hubo un error al cargar</h1>
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
        {data.results.map(({ name, url}) => (
          <blockquote key={name}>
            &ldquo;{name}&rdquo;
            <footer>
              <cite>{url}</cite>
            </footer>
          </blockquote>
        ))}
      </div>
    )
  }

  return null
}
