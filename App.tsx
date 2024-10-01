import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';

const QuizApp = () => {
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
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
  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    setInactivityTimer(
      setTimeout(() => {
        setCurrentScreen('telaInicial');
      }, 86400000),
    );
  };

  useEffect(() => {
    resetInactivityTimer();
  }, []);

  const selecionarPerguntas = () => {
    const perguntasSelecionadas = [];
    const indicesUsados = new Set();

    while (perguntasSelecionadas.length < 4) {
      const index = Math.floor(Math.random() * perguntas.length);
      if (!indicesUsados.has(index)) {
        indicesUsados.add(index);
        perguntasSelecionadas.push(perguntas[index]);
      }
    }

    setPerguntasSelecionadas(perguntasSelecionadas);
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
    carregarPergunta();
    console.log('teste:', perguntasSelecionadas);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'telaInicial' && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => setCurrentScreen('telaDescanso')}
        >
          {/* Top row */}
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

          {/* Conteúdo */}
          <View style={styles.conteudo}>
            <Image
              source={require('./assets/imgs/LOGOTEMA---SUSM 1.png')}
              style={styles.logo}
            />
            {/* Contêiner para o ícone Lottie */}
            {/* <View style={styles.lottieIcon}></View> */}
          </View>

          {/* Last row */}
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

      {/* {currentScreen === 'telaDescanso' && (
        <View style={styles.containerDescanso}>
          <Image
            source={require('./assets/imgs/Grafismo4.1.png')}
            style={styles.topImage}
          />
          <View style={styles.conteudoDescanso}>
            <Text style={styles.heading}>ESTROFACTS</Text>
            <Text style={styles.descansoFirst}>
              Bem-vindo ao EstroFacts! Prepare-se para participar de um quiz
              interativo onde desmistificamos diversas questões sobre o uso de
              contraceptivos. Juntos, vamos explorar mitos e verdades,
              aprimorando o cuidado com suas pacientes.
            </Text>
            <Text style={styles.descansoSecond}>
              Leia as afirmações apresentadas e responda entre FATO ou FAKE
            </Text>

            <TouchableOpacity
              onPress={handleIniciarQuiz}
              style={styles.buttonDescanso}
            >
              <Text style={styles.buttonTextDescanso}>Iniciar</Text>
            </TouchableOpacity>
          </View>

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
      )} */}

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
    </View>
  );
};

export default QuizApp;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    // backgroundColor: '#f8e2dd',
    position: 'relative',
    // paddingTop: 10,
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    backgroundColor: '#f8e2dd',
  },
  square: {
    width: 123,
    height: 123,
    backgroundColor: '#da1278',
  },
  rectangle: {
    width: 208,
    height: 80,
    backgroundColor: '#f174ac',
  },
  inicioImage: {
    height: 80,
    width: 80,
    position: 'absolute',
    top: 0,
    left: 330,
  },
  uniqueImage: {
    position: 'absolute',
    top: 50,
    left: 280,
    height: 100,
    width: 100,
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
    height: 100,
    width: 300,
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
    // borderTopColor: 'black',
    // borderTopWidth: 10,
  },
  wavesImage: {
    position: 'absolute',
    height: 180,
    width: 120,
    bottom: 80,
    zIndex: 1,
  },
  flexCol: {
    flexDirection: 'column',
    backgroundColor: '#f8e2dd',
  },
  secondRectangle: {
    width: 280,
    height: 90,
    backgroundColor: '#f174ac',
  },
  thirdRectangle: {
    width: 280,
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
    // flex: 1,
    height: '100%',
    backgroundColor: '#003366',
    position: 'relative',
  },
  topImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  conteudoDescanso: {
    position: 'absolute',
    // top: 406,
    marginLeft: '13.5%',
    marginRight: '13.5%',
  },
  heading: {
    fontSize: 63,
    fontWeight: '600',
    color: '#660099',
  },
  descansoFirst: {
    fontSize: 48,
    color: '#660099',
    marginTop: 10,
  },
  descansoSecond: {
    fontSize: 50,
    color: '#333333',
    marginTop: 10,
    width: '90%',
  },
  buttonDescanso: {
    width: 680,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#FF66B2',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 20,
  },
  buttonTextDescanso: {
    fontSize: 46,
    color: 'white',
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
    bottom: 140,
    left: 0,
  },
  rectangle2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  unique2: {
    position: 'absolute',
    right: 0,
    bottom: 140,
  },
});
