import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";
import { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";


export const getPokemons = async (page: number, limit: number = 20):Promise<Pokemon[]> => {
    
    try {

        const url = `/pokemon?offset=${ page * limit }&limit=${ limit }`;
        //const url = '/pokemon'
        const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url, {
            /*params: {
                page: 0,
                limit: 10
            }*/
        });

        /**
         * We don`t use async await because we want to do all requests togheter and not one by one
         */
        const pokemonPromises = data.results.map((info) => { 
            return pokeApi.get<PokeAPIPokemon>(info.url);
        });

        /**
         * We wait to finish all promises completed
         */
        const pokeApiPokemons = await Promise.all(pokemonPromises);
        const pokemonsPromises = pokeApiPokemons.map( (item) => PokemonMapper.pokeApiPokemonToEntity(item.data) ); 

        return await Promise.all(pokemonsPromises);

    } catch (error) {
        throw new Error('Error getting pokemons');
    }
}