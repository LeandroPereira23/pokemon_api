import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

interface PokemonDetailProps {
  pokemonId: number;
  onClose: () => void;
}

interface PokemonDetailInfo {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
  description: string;
  imageUrl: string;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({
  pokemonId,
  onClose,
}) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonDetailInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
          axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
        ]);

        const pokemonData = pokemonResponse.data;
        const speciesData = speciesResponse.data;

        const description =
          speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === 'es'
          )?.flavor_text || 'Descripción no disponible';

        setPokemonInfo({
          id: pokemonData.id,
          name:
            speciesData.names.find((name: any) => name.language.name === 'es')
              ?.name || pokemonData.name,
          types: pokemonData.types.map((type: any) => type.type.name),
          height: pokemonData.height / 10,
          weight: pokemonData.weight / 10,
          abilities: pokemonData.abilities.map(
            (ability: any) => ability.ability.name
          ),
          stats: pokemonData.stats.map((stat: any) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
          description: description.replace(/\f/g, ' '),
          imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pokemonInfo) {
    return (
      <div className="text-center">
        No se pudo cargar la información del Pokémon.
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <div className="relative m-3 p-3 md:p-8 w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="w-1/4 md:w-1/2">
            <img
              src={pokemonInfo.imageUrl}
              alt={pokemonInfo.name}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold mb-4">{pokemonInfo.name}</h2>
            <p className="text-gray-600 mb-4">{pokemonInfo.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Altura:</p>
                <p>{pokemonInfo.height} m</p>
              </div>
              <div>
                <p className="font-semibold">Peso:</p>
                <p>{pokemonInfo.weight} kg</p>
              </div>
              <div>
                <p className="font-semibold">Tipos:</p>
                <p>{pokemonInfo.types.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Habilidades:</p>
                <p>{pokemonInfo.abilities.join(', ')}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Estadísticas base:</h3>
              {pokemonInfo.stats.map((stat) => (
                <div key={stat.name} className="flex items-center mb-2">
                  <span className="w-24">{stat.name}:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(stat.value / 255) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
