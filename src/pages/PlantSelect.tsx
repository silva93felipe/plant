import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import api from '../services/api';

import { EnviromentButton } from '../components/EnvirementButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantProps } from '../libs/storage';

interface EnvironmentProps{
    key: string;
    title: string;
}

export function PlantSelect(){

    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation()

    async function fletchPlants(){
        const {data} = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
        
        if(!data){
            return setLoading(true);
        }

        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        } else{
            setPlants(data);
            setFilteredPlants(data);    
        }
        
        setLoading(false);
        setLoadingMore(false);
    }

    function handleEnviromentSelected(environment: string){
        setEnvironmentSelected(environment);

        if(environment == 'all'){
            return setFilteredPlants(plants);
        }

        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
            
    }

    function handleFechtMore(distance: number){
        if(distance < 1)
            return;

        setLoadingMore(true)
        setPage(oldValue => oldValue + 1)
        fletchPlants()
    }

    function handlePlantSelect(plant: PlantProps){
        navigation.navigate('PlantSave', {plant})
    }

    useEffect(() =>{
        async function fetchEnviroment(){
            const {data} = await api.get("plants_environments?_sort=title&_order=asc");
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ])
        }

        fetchEnviroment()
    }, [])


    useEffect(() =>{
        fletchPlants()
    }, [])

    if(loading){
        return <Load />
    }
    return(
        <View>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>

                <Text style={styles.subtitle}>
                    Você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) =>(
                        <EnviromentButton 
                            title={item.title}
                            active={item.key == environmentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View >
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) =>(
                        <PlantCardPrimary 
                            data={item} 
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFechtMore(distanceFromEnd)
                    }

                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    header :{
        paddingHorizontal: 30
    },

    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },

    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },

    enviromentList:{
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },

    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
        
    },
})