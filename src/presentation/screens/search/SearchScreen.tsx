import { ActivityIndicator, Text, View } from 'react-native';
import { globalTheme } from '../../../config/theme/global-thme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import { useQuery } from '@tanstack/react-query';
import { getPokemonNamesWithId } from '../../../actions/pokemons/get-pokemon-names-with-id';
import { useMemo, useState } from 'react';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { getPokemonsByIds } from '../../../actions/pokemons';
import { useDebouncedValue } from '../../hooks/useDebauncedValue';

export const SearchScreen = () => {

    const { top } = useSafeAreaInsets();
    const [term, setTerm] = useState('');

    const debouncedValue = useDebouncedValue(term);

    const {isLoading, data: pokemonNameList = []} = useQuery({
        queryKey: ['pokemons', 'all'],
        queryFn: () => getPokemonNamesWithId()
    });

    const pokemonNameIdList = useMemo( () => {

        /** Search by ID */
        if( !isNaN( Number(debouncedValue) )) {
            const pokemon = pokemonNameList.find( pokemon => pokemon.id === Number(debouncedValue));
            return pokemon ? [pokemon] : [];
        }

        // We need 3 letters to search
        if(debouncedValue.length < 3) return [];

        /** Search by Name */
        return pokemonNameList.filter( pokemon => pokemon.name.includes(debouncedValue.toLocaleLowerCase()));
    }, [debouncedValue]);

    const { isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
        queryKey: ['pokemons', 'by', pokemonNameIdList],
        queryFn: () => getPokemonsByIds(pokemonNameIdList.map( pokemon => pokemon.id)),
        staleTime: 100 * 60 * 5
    })

    if(isLoading) {
        return( <FullScreenLoader /> )
    }

    return(
        <View style={[ globalTheme.globalMargin, { paddingTop: top + 10 } ]}>
            <TextInput
                placeholder='Search Pokemon'
                mode='flat'
                autoFocus
                autoCorrect={false}
                onChangeText={ setTerm }
                value={term}
            />

            {isLoadingPokemons && <ActivityIndicator style={{ paddingTop: 20 }}/> }

            {/* <Text>{JSON.stringify(pokemonNameIdList, null, 2)}</Text> */}
            <FlatList
             data={ pokemons } 
             keyExtractor={ (pokemon, index) => `${pokemon.id}-${ index }` }
             numColumns={2}
             style={{paddingTop: top + 20}}
             renderItem={({item}) => <PokemonCard pokemon={item}/>}
             showsVerticalScrollIndicator={ false }
             ListFooterComponent={ <View style={{ height: 150 }}/>}
            />
        </View>
    )
}