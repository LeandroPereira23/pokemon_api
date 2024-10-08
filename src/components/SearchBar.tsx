import React from 'react'

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La búsqueda se realiza en tiempo real, así que no necesitamos hacer nada aquí
  }

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar Pokémon..."
        className="flex-grow px-4 py-2 rounded-l-lg border-2 border-blue-500 focus:outline-none focus:border-blue-600"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Buscar
      </button>
    </form>
  )
}

export default SearchBar