import React from 'react'

interface FiltersProps {
  filters: {
    type: string;
    sortBy: string;
  };
  setFilters: (filters: { type: string; sortBy: string }) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
    'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Todos</option>
          {pokemonTypes.map((type) => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="id">ID</option>
          <option value="name">Nombre</option>
          <option value="hp">Vida</option>
          <option value="attack">Ataque</option>
          <option value="defense">Defensa</option>
        </select>
      </div>
    </div>
  )
}

export default Filters