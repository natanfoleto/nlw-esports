import axios from 'axios';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, FlatList, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';

import { Heading } from '../../components/Heading';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

import { GameParams } from '../../@types/navigation';

import { styles } from './styles';
import { THEME } from '../../theme';

import logoImg from '../../assets/logo-nlw-esports.png';

export function Game() {
  const navigation = useNavigation();

  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState('');

  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string) {
    axios(`http://192.168.0.103:3333/ads/${adsId}/discord`)
    .then((res) => {
      setDiscordDuoSelected(res.data.discord);
    })
  }

  useEffect(() => {
    axios(`http://192.168.0.103:3333/games/${game.id}/ads`)
    .then((res) => {
      setDuos(res.data);
    })
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo 
              name='chevron-thin-left'
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image 
            style={styles.logo}
            source={logoImg}
          />

          <View style={styles.right} />
        </View>

        <Image 
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode='cover'
        />

        <Heading 
          title={game.title}
          subtitle='Conecte-se e comece a jogar!'
        />

        <FlatList 
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard 
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Näo há anúncios publicados ainda
            </Text>
          )}
        />
        
        <DuoMatch 
          visible={discordDuoSelected.length > 0}
          onClose={() => setDiscordDuoSelected('')}
          discord={discordDuoSelected}
        />
      </SafeAreaView>
    </Background>
  )
}
