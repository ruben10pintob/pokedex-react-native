import { getPokemonById } from ".";
import { Pokemon } from "../../domain/entities/pokemon";


export const getPokemonsByIds = async(ids: number[]): Promise<Pokemon[]> => {

    try {
        
        const pokemonsPromises: Promise<Pokemon>[] = ids.map( id => {
            return getPokemonById(id);
        })

        return Promise.all(pokemonsPromises);


    } catch (error) {
        throw new Error(`Error getting pokemons by ids: ${ids}`);
    }
}