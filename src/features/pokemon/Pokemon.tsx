import type { JSX } from "react"
import { useEffect, useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonDetailQuery, useGetPokemonQuery } from "./pokemonApiSlice"
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
    // not needed, querying everything at once is fast enough
    //skip: !hasBeenHovered,
  })

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
              Is default? {data?.is_default}
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
          <p>is open</p>
          <p>{data?.weight}</p>      
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

  const sortedData = searchTerm.length > 1 ? fuzzysort.go(searchTerm, data.results, {key: 'name'}).map(result => result.obj) : data.results

  const calculatePagination = () =>{
    const totalPages = Math.ceil((sortedData?.length || 0) / numberOfResults)
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
      <div className={styles.container}>
        <div className={styles.content}>
          {sortedData.slice(sliceStart,sliceEnd).map(p => (
            <PokemonItem key={p.name} name={p.name} url={p.url} />
          ))}

          <div className={styles.pagination}>
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
        <div className={styles.sidebar}>
          <input
            type="text"
            placeholder="Busca Pokémon..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.input}
          />

          <h3>Cantidad de entradas a mostrar:</h3>
          <select
            className={styles.select}
            value={numberOfResults}
            onChange={e => {
              const newNumberOfResults = Number(e.target.value)
              setnumberOfResults(newNumberOfResults)
              const currentPageCalc = Math.ceil(sortedData.length / newNumberOfResults)

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
          </select>
        </div>
      </div>
    )
  }

  return null
}
