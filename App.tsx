import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const QuizApp = () => {
  const [fontsLoaded] = useFonts({
    'Ezra-Regular': require('./assets/fonts/Ezra-Light.otf'),
  });

  // This function hides the splash screen after fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
  //   null,
  // );
  const [currentScreen, setCurrentScreen] = useState<
    | 'telaInicial'
    | 'telaDescanso'
    | 'telaPreliminar'
    | 'telaPergunta'
    | 'telaFechamento'
  >('telaInicial');
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [perguntasSelecionadas, setPerguntasSelecionadas] = useState<
    Array<any>
  >([]);
  const [modalVisible, setModalVisible] = useState(false);

  const perguntas = [
    {
      id: 1,
      texto: 'Estrogênio e Progesterona são os principais hormônios femininos.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Fato',
    },
    {
      id: 2,
      texto:
        'Os hormônios dos contraceptivos e terapias de reposição hormonal estão relacionados ao surgimento de câncer.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Fake',
    },
    {
      id: 3,
      texto: 'Hormônios bioidênticos são aqueles retirados do corpo humano',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Fake',
    },
    {
      id: 4,
      texto: 'Usar pílula anticoncepcional engorda',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Fake',
    },
    {
      id: 5,
      texto: 'A pílula causa trombose.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Fake',
    },
  ];

  // Reset inactivity timer (24 hours)
  // const resetInactivityTimer = () => {
  //   if (inactivityTimer) clearTimeout(inactivityTimer);
  //   setInactivityTimer(
  //     setTimeout(() => {
  //       setCurrentScreen('telaInicial');
  //     }, 86400000),
  //   );
  // };

  // useEffect(() => {
  //   resetInactivityTimer();
  // }, []);

  const selecionarPerguntas = () => {
    const perguntasSelecionadasTemp = [];
    const indicesUsados = new Set();
    while (perguntasSelecionadasTemp.length < 4) {
      const index = Math.floor(Math.random() * perguntas.length);
      if (!indicesUsados.has(index)) {
        indicesUsados.add(index);
        perguntasSelecionadasTemp.push(perguntas[index]);
      }
    }

    setPerguntasSelecionadas(perguntasSelecionadasTemp);
  };

  const carregarPergunta = () => {
    if (perguntaAtual < perguntasSelecionadas.length) {
      setCurrentScreen('telaPergunta');
    } else {
      setCurrentScreen('telaFechamento');
    }
  };

  const handleIniciarQuiz = () => {
    setPerguntaAtual(0);
    selecionarPerguntas();
  };

  useEffect(() => {
    if (perguntasSelecionadas.length > 0) {
      carregarPergunta();
    }
  }, [perguntasSelecionadas]);

  // Ensure the layout runs the onLayoutRootView function once fonts are loaded
  if (!fontsLoaded) {
    return null; // Return null to keep the splash screen visible until fonts are ready
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      {currentScreen === 'telaInicial' && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => setCurrentScreen('telaDescanso')}
        >
          {/* Top Section */}
          <View style={styles.topRow}>
            <View style={styles.square}></View>
            <View style={styles.rectangle}></View>
            <Image
              source={require('./assets/imgs/Grafismo.png')}
              style={styles.inicioImage}
            />
            <Image
              source={require('./assets/imgs/sou-unica.png')}
              style={styles.uniqueImage}
            />
          </View>

          {/* Content Section */}
          <View style={styles.conteudo}>
            <Image
              source={require('./assets/imgs/LOGOTEMA---SUSM 1.png')}
              style={styles.logo}
            />
            {/* Contêiner para o ícone Lottie */}
            {/* <View style={styles.lottieIcon}></View> */}
          </View>

          {/* Bottom Section */}
          <View style={styles.lastRow}>
            <Image
              source={require('./assets/imgs/wavesblue.png')}
              style={styles.wavesImage}
            />
            <View style={styles.flexCol}>
              <View style={styles.secondRectangle}></View>
              <View style={styles.thirdRectangle}></View>
            </View>
            <View style={styles.secondSquare}></View>
          </View>
        </TouchableOpacity>
      )}

      {currentScreen === 'telaDescanso' && (
        <View style={styles.containerDescanso}>
          {/* Top Section */}
          <Image
            source={require('./assets/imgs/Grafismo4.2.png')}
            style={styles.topImage}
          />

          {/* Content Section */}
          <View style={styles.conteudoDescanso}>
            <View style={styles.stick}></View>
            <Text style={styles.heading}>
              Participe do nosso game e ajude a fazer{'\n'}a diferença!
            </Text>
            <Text style={styles.descansoFirst}>
              Bem-vindo ao EstroFacts!{'\n'}A cada participação, doaremos R$2
              para uma ONG que está transformando vidas. Além de se divertir,
              você contribui para uma causa nobre!
            </Text>
            <View style={styles.rulesContainer}>
              <Text style={styles.headerRules}>Como Funciona?</Text>
              <View style={styles.headerRulesContainer}>
                <Text style={styles.headerRules}>1.</Text>
                <Text style={styles.headerRules}>
                  Responda as 5 perguntas{'\n'}de vardedeiro ou falso
                </Text>
              </View>
              <View style={styles.headerRulesContainer}>
                <Text style={styles.headerRules}>2.</Text>
                <Text style={styles.headerRules}>
                  Ao final, você poderá{'\n'}conferir o valor já{'\n'}
                  arrecadado e saber{'\n'}mais sobre a ONG que{'\n'}está
                  recebendo sua{'\n'}contribuição!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleIniciarQuiz}
              style={styles.buttonDescanso}
            >
              <Text style={styles.buttonTextDescanso}>Iniciar</Text>
            </TouchableOpacity>
          </View>

          {/* Images at the Bottom */}
          <View style={styles.bottomImages}>
            <Image
              source={require('./assets/imgs/Group 2.png')}
              style={styles.grupo2}
            />
            <Image
              source={require('./assets/imgs/Rectangle 12376.png')}
              style={styles.rectangle2}
            />
            <Image
              source={require('./assets/imgs/sou-unica2.png')}
              style={styles.unique2}
            />
          </View>
        </View>
      )}

      {currentScreen === 'telaPergunta' && (
        <View>
          <Text style={styles.title}>
            Pergunta {perguntaAtual + 1}/{perguntasSelecionadas.length}
          </Text>
          <Text>{perguntasSelecionadas[perguntaAtual].texto}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Ver Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={carregarPergunta}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'telaFechamento' && (
        <View>
          <Text style={styles.title}>Quiz Concluído!</Text>
        </View>
      )}

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={perguntasSelecionadas[perguntaAtual]?.modalImage}
            style={styles.modalImage}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuizApp;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    fontFamily: 'Ezra-Regular',
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    backgroundColor: '#f8e2dd',
  },
  square: {
    width: 153,
    height: 153,
    backgroundColor: '#da1278',
  },
  rectangle: {
    width: 350,
    height: 93,
    backgroundColor: '#f174ac',
  },
  inicioImage: {
    height: 95,
    width: 95,
    position: 'absolute',
    top: 0,
    left: 503,
  },
  uniqueImage: {
    position: 'absolute',
    top: 50,
    left: 430,
    height: 140,
    width: 140,
    zIndex: 100,
  },
  conteudo: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#f8e2dd',
    zIndex: -1,
  },
  logo: {
    marginLeft: -50,
    height: 150,
    width: 450,
  },
  lottieIcon: {
    width: 250,
    height: 250,
    position: 'absolute',
    bottom: 565,
  },
  lastRow: {
    flexDirection: 'row',
    height: '25%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#f8e2dd',
  },
  wavesImage: {
    position: 'absolute',
    height: 210,
    width: 140,
    bottom: 105,
    zIndex: 1,
  },
  flexCol: {
    flexDirection: 'column',
    backgroundColor: '#f8e2dd',
  },
  secondRectangle: {
    width: 380,
    height: 120,
    backgroundColor: '#f174ac',
  },
  thirdRectangle: {
    width: 380,
    height: 220,
    backgroundColor: '#cbbed9',
  },
  secondSquare: {
    width: 359,
    height: 418,
    backgroundColor: '#da1278',
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: '#F28B82',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  containerDescanso: {
    height: '100%',
    backgroundColor: '#90b9d3',
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  topImage: {
    position: 'absolute',
    top: -30,
    width: 140,
    height: 140,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  conteudoDescanso: {
    position: 'absolute',
    top: 90,
    width: '80%',
    alignItems: 'center',
    // marginTop: 40,
  },
  stick: {
    width: '20%',
    color: '#512b7d',
    backgroundColor: '#512b7d',
    height: 2,
    position: 'absolute',
    left: -60,
    top: 25,
  },
  heading: {
    fontSize: 35,
    textAlign: 'left',
    width: '75%',
    fontWeight: 'bold',
    color: '#512b7d',
    // fontFamily: 'Ezra-Regular',
  },
  descansoFirst: {
    fontSize: 24,
    width: '85%',
    color: '#512b7d',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 50,
    lineHeight: 30,
  },
  rulesContainer: {
    textAlign: 'left',
    width: '75%',
    marginTop: 20,
    gap: 15,
  },
  headerRules: {
    fontSize: 24,
    color: '#512b7d',
    fontWeight: 'bold',
    lineHeight: 30,
  },
  headerRulesContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  buttonDescanso: {
    width: 350,
    height: 60,
    borderRadius: 100,
    backgroundColor: '#da1278',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonTextDescanso: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  bottomImages: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grupo2: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    width: 40,
    height: 100,
  },
  rectangle2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 50,
    width: '82%',
  },
  unique2: {
    position: 'absolute',
    right: -35,
    bottom: -60,
    width: 130,
    height: 155,
  },
});
