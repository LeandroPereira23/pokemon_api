import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from './LoadingSpinner';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { front_default: string };
}

interface PokemonListProps {
  searchTerm: string;
  filters: {
    type: string;
    sortBy: string;
  };
}

const PokemonList: React.FC<PokemonListProps> = ({ searchTerm, filters }) => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(20);
  const limit = 1025;

  const fetchPokemons = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const results = response.data.results;
      const pokemonData = await Promise.all(
        results.map(async (pokemon: { url: string }) => {
          const res = await axios.get(pokemon.url);
          return res.data;
        })
      );
      setAllPokemons(prevPokemons => [...prevPokemons, ...pokemonData]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching Pokemon:', err);
      setError('Error al cargar los Pokémon. Por favor, intenta de nuevo más tarde.');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
      fetchPokemons();
  }, []);

  useEffect(() => {
    let filteredPokemons = allPokemons;

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filteredPokemons = filteredPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por tipo
    if (filters.type) {
      filteredPokemons = filteredPokemons.filter(pokemon =>
        pokemon.types.some(t => t.type.name === filters.type)
      );
    }

    // Aplicar ordenamiento
    filteredPokemons.sort((a, b) => {
      if (filters.sortBy === 'id') return a.id - b.id;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'hp') return b.stats[0].base_stat - a.stats[0].base_stat;
      if (filters.sortBy === 'attack') return b.stats[1].base_stat - a.stats[1].base_stat;
      if (filters.sortBy === 'defense') return b.stats[2].base_stat - a.stats[2].base_stat;
      return 0;
    });

    setDisplayedPokemons(filteredPokemons.slice(0, displayedPokemons.length + offset));
  }, [allPokemons, searchTerm, filters, offset]);

  const loadMore = () => {
    setOffset(prevOffset => prevOffset + 20);
  };

  const handlePokemonSelect = (id: number) => {
    setSelectedPokemonId(id);
  };

  const handleCloseDetail = () => {
    setSelectedPokemonId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <InfiniteScroll
        dataLength={displayedPokemons.length}
        next={loadMore}
        hasMore={displayedPokemons.length < allPokemons.length}
        endMessage={<p className="text-center mt-4">¡Has visto todos los Pokémon!</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={handlePokemonSelect} />
          ))}
        </div>
      </InfiniteScroll>
      {selectedPokemonId && (
        <PokemonDetail pokemonId={selectedPokemonId} onClose={handleCloseDetail} />
      )}
    </>
  );
};

export default PokemonList;
