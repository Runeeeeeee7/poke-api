import type { JSX } from "react"
import { useEffect, useState } from "react"
import styles from "./Pokemon.module.css"
import { useGetPokemonDetailQuery, useGetPokemonQuery } from "./pokemonApiSlice"
import { PokemonPaginatedResourceResponse } from "./pokemonTypes"
import fuzzysort from 'fuzzysort'
import { current } from "@reduxjs/toolkit"
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
  const [numberOfResults, setnumberOfResults] = useState(6)
  const {data, isError, isLoading, isSuccess } = useGetPokemonQuery()
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [sliceStart, setSliceStart] = useState(numberOfResults*(currentPage-1))
  const [sliceEnd, setSliceEnd] = useState(numberOfResults*currentPage)

  useEffect(() =>{
    setSliceStart(numberOfResults*(currentPage-1))
    setSliceEnd(numberOfResults*currentPage)
  }, [numberOfResults, currentPage])

  if(data == undefined) return(
    <div>
        <h1>Hubo un error al cargar: ${isError}</h1>
      </div>
  );

  const sortedData = searchTerm.length > 1 ? fuzzysort.go(searchTerm, data.results, {key: 'name'}).map(result => result.obj) : data.results
  
  const calculatePagination = () =>{
    const totalPages = Math.ceil((data?.results?.length || 0) / numberOfResults)
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
          value={numberOfResults}
          onChange={e => {
            const newNumberOfResults = Number(e.target.value)
            setnumberOfResults(newNumberOfResults)
            const currentPageCalc = Math.ceil(data.results.length / newNumberOfResults)

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
    )
  }

  return null
}
