import type { JSX } from "react"
import { useEffect, useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonQuery } from "./pokemonApiSlice"
import fuzzysort from 'fuzzysort'
import PokemonItem from "./PokemonItem"
import Spinner from "../spinner/Spinner"


export const Pokemon = (): JSX.Element | null => {
  const [numberOfResults] = useState(6)
  const {data, isError, isLoading, isSuccess } = useGetPokemonQuery()
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [sliceStart, setSliceStart] = useState(numberOfResults*(currentPage-1))
  const [sliceEnd, setSliceEnd] = useState(numberOfResults*currentPage)

  useEffect(() =>{
    setSliceStart(numberOfResults*(currentPage-1))
    setSliceEnd(numberOfResults*currentPage)
  }, [numberOfResults, currentPage, searchTerm])

  if(data == undefined) {
    return(
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <Spinner />
      </div>
      );
  }

  const filteredData = searchTerm.length > 1 ? fuzzysort.go(searchTerm, data.results, {key: 'name'}).map(result => result.obj) : data?.results

  const calculatePagination = () =>{
    const totalPages = Math.ceil((filteredData?.length || 0) / numberOfResults)
    const pages = new Set<number>()

    if(currentPage>totalPages){
      setCurrentPage(totalPages)
      return Array.from(pages)
    }

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
        <h1>Hubo un error al cargar.</h1>
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
            placeholder="Busca a un Pokémon..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.Input}
          />       

          
        </div>
          <div className={styles.Content}>
            {filteredData.slice(sliceStart,sliceEnd).map(p => (
              <PokemonItem key={p.name} url={p.url} />
            ))}
          </div>

          <div className={styles.Pagination}>
            {(
              calculatePagination().map((page, i, array) => (
              <div key={page}>
                {i > 0 && array[i - 1] !== page - 1 && <span> ... </span>}
                <button
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
                  >
                {page}
                </button>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
