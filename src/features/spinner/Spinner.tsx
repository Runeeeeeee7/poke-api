import type { JSX } from "react"
import styles from "./Spinner.module.css"

const Spinner = (): JSX.Element => {
  return <div className={styles.Spinner} aria-label="Cargando..." />
}

export default Spinner