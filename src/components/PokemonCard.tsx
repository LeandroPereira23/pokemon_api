import React from 'react'

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { front_default: string };
}

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (id: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect(pokemon.id)}
    >
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32 mx-auto" />
      <h2 className="text-xl font-semibold text-center mt-2">{pokemon.name}</h2>
      <p className="text-gray-600 text-center">#{pokemon.id}</p>
      <div className="flex justify-center mt-2">
        {pokemon.types.map((type) => (
          <span key={type.type.name} className="px-2 py-1 bg-gray-200 rounded-full text-sm mr-1">
            {type.type.name}
          </span>
        ))}
      </div>
      <div className="mt-2">
        <p>HP: {pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat}</p>
        <p>Ataque: {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat}</p>
        <p>Defensa: {pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat}</p>
      </div>
    </div>
  )
}

export default PokemonCard