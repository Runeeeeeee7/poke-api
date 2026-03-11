import type { JSX } from "react"
import { useEffect, useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonDetailQuery, useGetPokemonQuery } from "./pokemonApiSlice"
import fuzzysort from 'fuzzysort'

const options = [3, 6, 12, 20, 30]

function formatPokemonLabel(value: string): string {
  return value
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function PokemonItem({url, name}: {url:string, name:string}): JSX.Element{
  const [isOpen, setIsOpen] =  useState(false)
  const [hasBeenHovered, setIsHovered] = useState(false)
  const urlSplit = url.split("/")


  // "https://pokeapi.co/api/v2/pokemon/25/"
  // final parts output is empty(-1), -2 contains the actual id
  const id = Number(urlSplit[urlSplit.length-2]) 

   const { data, isFetching, isError } = useGetPokemonDetailQuery(id, {
    // not needed, querying everything at once is fast enough
    //skip: !hasBeenHovered,
  })

  const typeNames = data?.types.map(entry => formatPokemonLabel(entry.type.name)).join(", ")
  const abilityNames = data?.abilities.map(entry => formatPokemonLabel(entry.ability.name)).join(", ")
  const statSummary = data?.stats
    .slice(0, 3)
    .map(stat => `${formatPokemonLabel(stat.stat.name)}: ${stat.base_stat}`)
    .join(" | ")

  return (
    <div onMouseEnter={() => setIsHovered(true)} className={styles.PokemonItemRootContainer}>
      <div className={styles.ItemContainer}>
        <div className={styles.IdContainer}>
          {id}
        </div>
        <div className={styles.ImageContainer}>
          <img src={data?.sprites.front_default} alt="" />
        </div>
        <div className={styles.InfoContainer}>
          <div className={styles.NameContainer}>
            <p> {name.toUpperCase()}</p>
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
          setIsHovered(true)
        }}
      >
      {isOpen ? "▼" : "▶"}
      </button>
      {isOpen && (
        <div className={styles.ExpandedContent}>
          {isFetching && <p className={styles.ExpandedStatus}>Loading details...</p>}
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

export const Pokemon = (): JSX.Element | null => {
  const [numberOfResults, setnumberOfResults] = useState(6)
  const {data, isError, isLoading, isSuccess } = useGetPokemonQuery()
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [sliceStart, setSliceStart] = useState(numberOfResults*(currentPage-1))
  const [sliceEnd, setSliceEnd] = useState(numberOfResults*currentPage)

  useEffect(() =>{
    setSliceStart(numberOfResults*(currentPage-1))
    setSliceEnd(numberOfResults*currentPage)
  }, [numberOfResults, currentPage, searchTerm])

  if(data == undefined) return(
    <div>
        <h1>Hubo un error al cargar: ${isError}</h1>
      </div>
  );

  const filteredData = searchTerm.length > 1 ? fuzzysort.go(searchTerm, data.results, {key: 'name'}).map(result => result.obj) : data.results

  const calculatePagination = () =>{
    const totalPages = Math.ceil((filteredData?.length || 0) / numberOfResults)
    const pages = new Set<number>()

    pages.add(1)

    if(currentPage>2){
      pages.add(currentPage - 2)
      pages.add(currentPage - 1)
    }

    pages.add(currentPage)

    if(currentPage < totalPages-1){
      pages.add(currentPage + 1)
      pages.add(currentPage + 2)
    }

    pages.add(totalPages)

    return Array.from(pages)
  }

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
      <div className={styles.Container}>
        <div className={styles.ResultsPane}>
        <div className={styles.Sidebar}>
          <div className={styles.SidebarHeader}>
            <p className={styles.SidebarCount}>{filteredData.length} Pokemon</p>
          </div>

          <input
            type="text"
            placeholder="Busca Pokémon..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.Input}
          />
          

          {/* technically the design document specifies 6 and no more, so rather than risk it we just comment the selector and leave the default at 6*/}
          {/* <label className={styles.SidebarLabel}>
            Cantidad de entradas a mostrar
          </label>
          <select
            className={styles.Select}
            value={numberOfResults}
            onChange={e => {
              const newNumberOfResults = Number(e.target.value)
              setnumberOfResults(newNumberOfResults)
              const currentPageCalc = Math.ceil(filteredData.length / newNumberOfResults)

              if(currentPage > currentPageCalc){
                setCurrentPage(currentPageCalc)
              }           
            }}
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select> */}
        </div>
          <div className={styles.Content}>
            {filteredData.slice(sliceStart,sliceEnd).map(p => (
              <PokemonItem key={p.name} name={p.name} url={p.url} />
            ))}
          </div>

          <div className={styles.Pagination}>
            {(
              calculatePagination().map((page, i, array) => (
              <>
                {i > 0 && array[i - 1] !== page - 1 && <span> ... </span>}
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
                  >
                {page}
                </button>
              </>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
