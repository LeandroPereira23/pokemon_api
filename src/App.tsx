import React, { useState } from 'react'
import PokemonList from './components/PokemonList'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    sortBy: 'id'
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokémon API</h1>
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        <div className="w-full md:w-3/4">
          <PokemonList searchTerm={searchTerm} filters={filters} />
        </div>
      </div>
    </div>
  )
}

export default App