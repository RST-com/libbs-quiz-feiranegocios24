import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  SafeAreaView,
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
  const [resultadoTexto, setResultadoTexto] = useState('');
  const [resultadoCor, setResultadoCor] = useState(''); // Use 'green' or 'red'
  const [mostrarRightResult, setMostrarRightResult] = useState(false);
  const [mostrarWrongResult, setMostrarWrongResult] = useState(false);
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
      resposta: 'Verdadeiro',
      explanation:
        'Os estrogênios são produzidos principalmente pelos ovários e possuem a capacidade de estimular o crescimento e a manutenção das características sexuais femininas. A progesterona é produzida no corpo lúteo formado nos ovários e é um modulador chave das funções reprodutivas normais.',
    },
    {
      id: 2,
      texto:
        'Os hormônios dos contraceptivos e terapias de reposição hormonal estão relacionados ao surgimento de câncer.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Em pesquisa com 1,8 milhões de mulheres usuárias de contraceptivos hormonais realizada na Dinamarca, houve um caso a mais de câncer do que o esperado para cada 7.690 usuárias de anticoncepcionais hormonais. No entanto, os contraceptivos hormonais protegem contra os cânceres de ovário, endométrio e colorretal.',
    },
    {
      id: 3,
      texto: 'Hormônios bioidênticos são aqueles retirados do corpo humano',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Hormônios Bioidênticos, substâncias hormonais que possuem exatamente a mesma estrutura química e molecular encontrada nos hormônios produzidos no corpo humano.',
    },
    {
      id: 4,
      texto: 'Usar pílula anticoncepcional engorda',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Em revisão de literatura conclui-se não há relação da pílula combinada com o aumento do peso corporal.',
    },
    {
      id: 5,
      texto: 'A pílula causa trombose.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Existem estudos que mostram um pequeno aumento no risco de trombose em usuárias de contraceptivos que contenham estrogênio e progesterona. No entanto, esse risco é baixo e, a depender da composição, é muito semelhante ao risco das não usuárias de contraceptivos.',
    },
    {
      id: 6,
      texto: 'Hormônios impactam na saúde mental e no humor.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Verdadeiro',
      explanation:
        'O uso de contraceptivos hormonais pode levar a alterações de humor.',
    },
    {
      id: 7,
      texto:
        'Quem toma a pílula anticoncepcional por muito tempo pode ficar infértil.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Não há qualquer comprovação científica de que o uso de contraceptivos hormonais leva à infertilidade, e muitas vezes, eles são usados no tratamento de disfunções hormonais.',
    },
    {
      id: 8,
      texto: 'O mesmo método contraceptivo serve para todas as mulheres.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'O tratamento deve ser individualizado e baseado nas recomendações da Organização Mundial de Saúde.',
    },
    {
      id: 9,
      texto: 'A pílula pode ser uma aliada para controlar os sintomas de TPM.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Verdadeiro',
      explanation:
        'A pílula, além de prevenir uma gestação indesejada, pode ser utilizada no tratamento de sintomas da TPM e outras doenças.',
    },
    {
      id: 10,
      texto:
        'Existem métodos contraceptivos que ajudam no controle da acne e espinhas.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Verdadeiro',
      explanation:
        'As pílulas com progestagênios antiandrogênicos (que bloqueiam o receptor de testosterona) são usadas no controle da acne.',
    },
    {
      id: 11,
      texto:
        'A Pílula do Dia Seguinte pode ser utilizada toda vez que eu tiver alguma relação sexual.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'A pílula do dia seguinte deve ser utilizada caso a mulher tenha uma relação desprotegida ou falha do método contraceptivo utilizado (ex: esqueceu de tomar 2 ou mais pílulas).',
    },
    {
      id: 12,
      texto: 'Existem contraceptivos com “hormônio mais natural”.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Verdadeiro',
      explanation:
        'São os Hormônios Bioidênticos, substâncias hormonais que possuem exatamente a mesma estrutura química e molecular encontrada nos hormônios produzidos no corpo humano.',
    },
    {
      id: 13,
      texto:
        'Ter câncer ou histórico de câncer na família é impeditivo para fazer terapia hormonal?',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Somente pacientes com cânceres sensíveis ao estrogênio (ex: mama) têm contra-indicação para terapia hormonal. Histórico de câncer na família não contra-indica o tratamento.',
    },
    {
      id: 14,
      texto: 'A menopausa só chega após os 50 anos.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'A definição da data da menopausa é feita retrospectivamente, após 12 meses sem sangramento em uma mulher com mais de 45 anos.',
    },
    {
      id: 15,
      texto:
        'Existem muitos efeitos colaterais na terapia de reposição hormonal.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Atualmente, a recomendação é iniciar a terapia hormonal com a menor dose efetiva capaz de aliviar os sintomas com menor risco de eventos adversos.',
    },
    {
      id: 16,
      texto: 'Terapia de reposição hormonal ajuda a prevenir a osteoporose.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Verdadeiro',
      explanation:
        'Os estrogênios inibem a reabsorção óssea, com repercussão importante na massa óssea e no risco de fraturas.',
    },
    {
      id: 17,
      texto:
        'A Fitoterapia pode ajudar a aliviar os sintomas da menopausa tanto quanto a terapia de reposição hormonal.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Não há evidência concreta de que os fitoestrogênios efetivamente reduzem os fogachos e suores noturnos em mulheres climatéricas, sendo a terapia hormonal a primeira indicação.',
    },
    {
      id: 18,
      texto:
        'A terapia de reposição hormonal pode aumentar o risco de doenças cardiovasculares em mulheres.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'A terapia hormonal, quando iniciada até 10 anos após a menopausa ou 60 anos de idade, diminui o risco cardiovascular em mulheres.',
    },
    {
      id: 19,
      texto:
        'Preciso desintoxicar o corpo depois de um período utilizando contraceptivos.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Não há nenhum consenso que oriente a necessidade de desintoxicar o corpo após uso de contraceptivos.',
    },
    {
      id: 20,
      texto:
        'A terapia hormonal da menopausa pode ser usada por no máximo 5 anos.',
      modalImage: require('./assets/imgs/referencia1.png'),
      resposta: 'Falso',
      explanation:
        'Não há um limite fixo ou duração máxima pré-estabelecida para o uso da terapia hormonal e nem mesmo uma idade máxima em que deva ser suspensa.',
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
    setMostrarRightResult(false);
    setMostrarWrongResult(false);
    if (perguntaAtual < perguntasSelecionadas.length) {
      setCurrentScreen('telaPergunta');
    } else {
      setCurrentScreen('telaFechamento');
    }
  };

  const verificarResposta = (resposta: any) => {
    console.log(
      'resposta:',
      perguntasSelecionadas[perguntaAtual].resposta,
      resposta,
    );
    const isCorrect =
      resposta === perguntasSelecionadas[perguntaAtual].resposta;

    if (isCorrect) {
      console.log(true);
      setResultadoTexto('Resposta Correta');
      setResultadoCor('green');
      setMostrarRightResult(true);
      setMostrarWrongResult(false);
    } else {
      console.log(false);
      setResultadoTexto('Resposta Errada');
      setResultadoCor('red');
      setMostrarRightResult(false);
      setMostrarWrongResult(true);
    }

    // Move to the next question after 2 seconds
    setTimeout(() => {
      if (perguntaAtual + 1 === perguntasSelecionadas.length) {
        const respostaId = perguntasSelecionadas[perguntaAtual].id;
        // setCurrentScreen(`tela-resposta${respostaId}`);
        // showScreen(`tela-resposta${respostaId}`)
        // const lastButtonId = `btn-continuar${perguntasSelecionadas[perguntaAtual].id}`
        // const lastButton = document.getElementById(lastButtonId)
        // if (lastButton) {
        //   lastButton.innerText = "Fim"
        //   perguntaAtual++
        // }
        // Replace the text for the last question button to "Fim"
        setPerguntaAtual(perguntaAtual + 1);
      } else {
        const respostaId = perguntasSelecionadas[perguntaAtual].id;
        // setCurrentScreen(`tela-resposta${respostaId}`);
        setPerguntaAtual(perguntaAtual + 1);
      }
      setMostrarRightResult(false);
      setMostrarWrongResult(false);
    }, 2000);
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
        <View style={styles.telaPergunta}>
          <View style={styles.flexContainer}>
            <Image
              style={styles.unique4}
              source={require('./assets/imgs/sou-unica4.png')}
            />
            <View style={styles.purpleSquare}></View>
            <View style={styles.flexContainer2}>
              <View style={styles.flexContainer3}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={styles.tituloPergunta}>
                    0{perguntaAtual + 1}/0{perguntasSelecionadas.length}
                  </Text>
                  {/* Replace "Pergunta Título" with your dynamic title */}
                  <Text style={styles.subtitle}>Perguntas</Text>
                </View>
              </View>
              <View style={styles.pinkSquare}></View>
            </View>
          </View>
          <View style={styles.containerPergunta}>
            <Text style={styles.textoPergunta}>
              {perguntasSelecionadas[perguntaAtual].texto}
            </Text>
            {/* Replace "Texto da Pergunta" with your dynamic question text */}
          </View>

          <View style={styles.answerResult}>
            <TouchableOpacity
              style={styles.buttonVerdadeiro}
              onPress={() => verificarResposta('Verdadeiro')}
            >
              <Text style={styles.buttonTextVerdadeiro}>Verdadeiro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonFalso}
              onPress={() => verificarResposta('Falso')}
            >
              <Text style={styles.buttonText}>Falso</Text>
            </TouchableOpacity>

            <View style={styles.containerResult}>
              {mostrarRightResult && (
                <>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                    }}
                    source={require('./assets/imgs/check_circle.png')}
                  />
                  <Text
                    id="#resultado"
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#7dc4aa',
                    }}
                  >
                    {/* )} */}
                    {/* <Text id="#resultado" style={styles.resultado}> */}
                    {resultadoTexto}
                  </Text>
                </>
              )}

              {mostrarWrongResult && (
                <>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                    }}
                    source={require('./assets/imgs/wrong.png')}
                  />
                  <Text
                    id="#resultado"
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#c24242',
                    }}
                  >
                    {/* )} */}
                    {/* <Text id="#resultado" style={styles.resultado}> */}
                    {resultadoTexto}
                  </Text>
                </>
              )}
            </View>
          </View>

          <Image
            style={styles.graphism5}
            source={require('./assets/imgs/Grafismo5.png')}
          />
          <Image
            style={styles.rectangle28}
            source={require('./assets/imgs/Rectangle 28.1.png')}
          />
          <Image
            style={styles.rectangle25}
            source={require('./assets/imgs/Rectangle 25.png')}
          />
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
            // style={styles.button}
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
  //TELA INICIAL
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
  buttonVerdadeiro: {
    width: 450,
    height: 60,
    backgroundColor: '#7dc4aa',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonFalso: {
    width: 450,
    height: 60,
    backgroundColor: '#c24242',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextVerdadeiro: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3e4a4f',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
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
  //TELA DESCANSO
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
  //TELA PERGUNTA
  telaPergunta: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flexDirection: 'row',
  },
  unique4: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    left: -40,
    top: 20.53,
    zIndex: 1,
  },
  purpleSquare: {
    backgroundColor: '#cbbdda',
    width: 380,
    height: 221,
  },
  flexContainer2: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flexContainer3: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  tituloPergunta: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#617179',
    alignSelf: 'flex-end',
  },
  subtitle: {
    fontSize: 22,
    color: '#617179',
    fontWeight: 'bold',
  },
  pinkSquare: {
    width: 300,
    height: 85,
    backgroundColor: '#ff72b7',
    alignSelf: 'baseline',
  },
  containerPergunta: {
    height: '36%',
    width: '100%',
    backgroundColor: '#fae3dd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoPergunta: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
    color: '#511181',
    marginHorizontal: '10%',
  },
  answerResult: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  containerResult: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 10,
  },
  hidden: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    display: 'none',
  },
  graphism5: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  rectangle28: {
    position: 'absolute',
    bottom: 25,
    left: 105,
    width: 180,
    height: 70,
    tintColor: '#da1278',
  },
  rectangle25: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 315,
    height: 25,
  },
});
