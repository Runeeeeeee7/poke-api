import type { JSX } from "react"
import { useState } from "react"
import styles from "./PokemonItem.module.css"
import { useGetPokemonDetailQuery } from "./pokemonApiSlice"
import Spinner from "../spinner/Spinner"


function formatPokemonLabel(value: string): string {
  return value
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function PokemonItem({url}: {url:string}): JSX.Element{
  const [isOpen, setIsOpen] =  useState(false)
  const urlSplit = url.split("/")

  // "https://pokeapi.co/api/v2/pokemon/25/"
  // final parts output is empty(-1), -2 contains the actual id
  const id = Number(urlSplit[urlSplit.length-2]) 

   const { data, isLoading, isError, isSuccess } = useGetPokemonDetailQuery(id, {
  })

  const typeNames = data?.types.map(entry => formatPokemonLabel(entry.type.name)).join(", ")
  const abilityNames = data?.abilities.map(entry => formatPokemonLabel(entry.ability.name)).join(", ")
  const statSummary = data?.stats
    .slice(0, 3)
    .map(stat => `${formatPokemonLabel(stat.stat.name)}: ${stat.base_stat}`)
    .join(" | ")


  if (isError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
        Hubo un error al cargar.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <Spinner />
      </div>
    )
  }

  if(isSuccess){
  return (  
    <div className={styles.PokemonItemRootContainer}>
      <div className={styles.ItemContainer}>
        <div className={styles.IdContainer}>
          {id}
        </div>
        <div className={styles.ImageContainer}>
            <img
            src={data?.sprites.front_default ?? undefined}
            alt={data ? `${data.name} sprite` : "Pokemon sprite"}
            />        </div>
        <div className={styles.InfoContainer}>
          <div className={styles.NameContainer}>
            <p> {data.name.toUpperCase()}</p>
          </div>
          <div className={styles.DataContainer}>
            <p>
              Base experience: {data?.base_experience}
            </p>
            <p>
              Height: {data?.height}
            </p>
            <p>
              Weight: {data?.weight}
            </p>
            <p>
              Type: {data?.types[0].type.name.toLocaleUpperCase()}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.ButtonContainer}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide Pokemon info" : "Show Pokemon info"}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
      {isOpen ? "▼" : "▶"}
      </button>
      {isOpen && (
        <div className={styles.ExpandedContent}>
          {isLoading && <p className={styles.ExpandedStatus}>Loading details...</p>}
          {isError && <p className={styles.ExpandedStatus}>Unable to load details.</p>}
          {data && (
            <div className={styles.ExpandedDetails}>
              <p><span className={styles.DetailLabel}>Species:</span> {formatPokemonLabel(data.species.name)}</p>
              <p><span className={styles.DetailLabel}>Abilities:</span> {abilityNames}</p>
              <p><span className={styles.DetailLabel}>Types:</span> {typeNames}</p>
              <p><span className={styles.DetailLabel}>Stats:</span> {statSummary}</p>
              <p><span className={styles.DetailLabel}>Default form:</span> {data.is_default ? "Yes" : "No"}</p>
              <p><span className={styles.DetailLabel}>Order:</span> {data.order}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
  }

  return (
    <div></div>
  );
}

export default PokemonItem
