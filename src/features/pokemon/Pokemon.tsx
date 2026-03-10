import type { JSX } from "react"
import { useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonQuery } from "./pokemonApiSlice"

export const Pokemon = (): JSX.Element | null => {
  const [numberOfQuotes, setNumberOfQuotes] = useState(10)
  // Using a query hook automatically fetches data and returns query values
  const { data, isError, isLoading, isSuccess } =
    useGetPokemonQuery(numberOfQuotes)

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className={styles.container}>
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
