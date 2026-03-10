import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { Pokemon } from "./features/pokemon/Pokemon"

export const App = () => (
  <div className="App">
    <header className="App-header">
      <img src="https://avatars.githubusercontent.com/u/147678449?v=4&size=64" className="App-logo" alt="logo" />
      <Pokemon />      
    </header>
  </div>
)
