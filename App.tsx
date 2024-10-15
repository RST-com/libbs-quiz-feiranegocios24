import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  StatusBar,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import TextoComExpoente from './TextoComExpoente ';

SplashScreen.preventAutoHideAsync();

const QuizApp = () => {
  const [fontsLoaded] = useFonts({
    EzraRegular: require('./assets/fonts/Ezra-Regular.otf'),
    EzraSemiBold: require('./assets/fonts/Ezra-SemiBold.otf'),
  });
  // This function hides the splash screen after fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const [currentScreen, setCurrentScreen] = useState<
    | 'telaInicial'
    | 'telaDescanso'
    | 'telaPergunta'
    | 'telaResposta'
    | 'telaFechamento'
    | 'telaGestao'
  >('telaInicial');
  const [currentPose, setCurrentPose] = useState(null);
  const [resultadoTexto, setResultadoTexto] = useState('');
  const [mostrarRightResult, setMostrarRightResult] = useState(false);
  const [mostrarWrongResult, setMostrarWrongResult] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [perguntasSelecionadas, setPerguntasSelecionadas] = useState<
    Array<any>
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [accumulatedValue, setAccumulatedValue] = useState(0);
  const [temporaryValue, setTemporaryValue] = useState(accumulatedValue);
  const [botaoDesativado, setBotaoDesativado] = useState(false);
  const [porcentagem, setPorcentagem] = useState(0);
  const valorTotal = 10000;

  const perguntas = [
    {
      id: 1,
      texto: 'Estrogênio e Progesterona são os principais hormônios femininos.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Gynton & Hall. Tratado de Fisiologia Médica. Cap 81, 12ª. Ed. 2011.',
      explanation:
        'Os estrogênios são produzidos principalmente pelos ovários e possuem a capacidade de estimular o crescimento e a manutenção das características sexuais femininas. A progesterona é produzida no corpo lúteo formado nos ovários e é um modulador chave das funções reprodutivas normais.',
    },
    {
      id: 2,
      texto:
        'Os hormônios dos contraceptivos e terapias de reposição hormonal estão relacionados ao surgimento de câncer.',
      resposta: 'FALSO',
      referenceText: `1. Sociedade Brasileira de Mastologia. Anticoncepcionais aumentam o risco de câncer de mama [internet]. Rio de Janeiro: SBM. [Acesso em: 04Out2024]. Disponível em: https://www.sbmastologia.com.br/anticoncepcionaisaumentam-risco-de-cancerde-mama/${'\n'}2. Pompei, Luciano de Melo; Machado, Rogério Bonassi; Wender, Maria Celeste
    Osório; Fernandes, César Eduardo. Consenso Brasileiro de Terapêutica Hormonal da
    Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: Leitura
    Médica, 2018.`,
      explanation: `Em pesquisa com 1,8 milhões de mulheres usuárias de contraceptivos hormonais realizada na Dinamarca, houve um caso a mais de câncer do que o esperado para cada 7.690 usuárias de anticoncepcionais hormonais. No entanto, os contraceptivos hormonais protegem contra os cânceres de ovário, endométrio e colorretal.^1 O risco de câncer de mama associado ao uso da terapia hormonal é pequeno, com incidência anual de aproximadamente um caso por 1.000 mulheres.^2`,
    },
    {
      id: 3,
      texto: 'Hormônios bioidênticos são aqueles retirados do corpo humano.',
      resposta: 'FALSO',
      referenceText:
        '1. Sociedade Brasileira de Endocrinologia e Metabologia. Hormônios Bioidênticos [internet]. São Paulo: SBEM; 2010. [Acesso em: 04Out2024]. Disponível em: https://www.endocrino.org.br/hormonios-bioidenticos/',
      explanation:
        'Hormônios Bioidênticos são substâncias hormonais que possuem exatamente a mesma estrutura química e molecular encontrada nos hormônios produzidos no corpo humano.',
    },
    {
      id: 4,
      texto: 'Usar pílula anticoncepcional engorda.',
      resposta: 'FALSO',
      referenceText:
        '1. Albernaz LMB, Oliveira BD, Soares AKS, De Souza JHK. O ganho de peso relacionado ao uso do anticoncepcional oral combinado: fato ou mito? Brazilian Journal of Health Review, [S. l.], v. 6, n. 3, p. 12262–12268, 2023.',
      explanation:
        'Em revisão de literatura conclui-se não há relação da pílula combinada com o aumento do peso corporal.',
    },
    {
      id: 5,
      texto: 'A pílula causa trombose.',
      resposta: 'FALSO',
      referenceText: `1. Van Hylckama Vlieg A, Helmerhorst FM, Vandenbroucke JP, Doggen CJ, Rosendaal
    FR. The venous thrombotic risk of oral contraceptives, effects of oestrogen dose and
    progestogen type: results of the MEGA case-control study. BMJ. 2009 Aug
    13;339:b2921.${'\n'}2. Reed S, Koro C, DiBello J, Becker K, Bauerfeind A, Franke C, Heinemann K.
    Prospective controlled cohort study on the safety of a monophasic oral
    contraceptive containing nomegestrol acetate (2.5mg) and 17β-oestradiol (1.5mg)
    (PRO-E2 study): risk of venous and arterial thromboembolism. Eur J Contracept
    Reprod Health [note continued from right margin...] Care. 2021 Dec;26(6):439-446.`,
      explanation:
        'Existem estudos que mostram aumento no risco de trombose em usuárias de contraceptivos que contenham estrogênio e progesterona. No entanto, esse risco é baixo e, a depender da composição é muito semelhante ao risco das não usuárias de contraceptivos.^1, ^2',
    },
    {
      id: 6,
      texto: 'Hormônios impactam na saúde mental e no humor.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Santos RL, Barbosa ALO, Santana AL, Farias JVC, Macêdo PR, Farias ICC. The risks of prolonged use of hormonal contraceptives. Research, Society and Development, [S. l.], v. 9, n. 11, p. e69791110394, 2020.',
      explanation:
        'O uso de contraceptivos hormonais pode levar a alterações de humor.',
    },
    {
      id: 7,
      texto: 'O mesmo método contraceptivo serve para todas as mulheres.',
      resposta: 'FALSO',
      referenceText: `1. Vieira CS, Oliveira LCO de, Sá MFS de. Hormônios femininos e hemostasia. Rev Bras Ginecol Obstet . 2007Oct;29(10):538–47.${'\n'}2. WORLD HEALTH ORGANIZATION. Medical eligibility criteria for contraceptive use. 5th ed. Geneva: WHO [internet]. 2015. [Acesso em: 04Out2024]. Disponível em: https://www.who.int/publications/i/item/9789241549158`,
      explanation:
        'O tratamento deve ser individualizado e baseado nas recomendações da Organização Mundial de Saúde.^1, ^2',
    },
    {
      id: 8,
      texto: 'A pílula pode ser uma aliada para controlar os sintomas de TPM.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Federação Brasileira das Associações de Ginecologia e Obstetrícia. Manual de anticoncepção. [internet]. São Paulo: FEBRASGO; 2015. [Acesso em 25set/2024] - 4 (cont) –',
      explanation:
        'Algumas pílulas, além de prevenir uma gestação indesejada, pode ser utilizada no tratamento de sintomas da TPM e outras doenças.',
    },
    {
      id: 9,
      texto:
        'Existem métodos contraceptivos que ajudam no controle da acne e espinhas.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Síndrome dos ovários policísticos. 3a ed. São Paulo: Federação Brasileira das Associações de Ginecologia e Obstetrícia (FEBRASGO); 2023. 140p. (Série Orientações e Recomendações FEBRASGO, n.1, Comissão Nacional de Ginecologia Endócrina).',
      explanation:
        'As pílulas com progestagênios antiandrogênicos (que bloqueiam o receptor de testosterona) são usadas no controle da acne.',
    },
    {
      id: 10,
      texto:
        'A Pílula do Dia Seguinte pode ser utilizada toda vez que eu tiver alguma relação sexual.',
      resposta: 'FALSO',
      referenceText:
        '1. Federação Brasileira das Associações de Ginecologia e Obstetrícia (FEBRASGO). Anticoncepcional hormonal apenas de progestagênio e anticoncepção de emergência. São Paulo: FEBRASGO; 2021. (Protocolo FEBRASGOGinecologia, no 66/ Comissão Nacional Especializada em Anticoncepção).',
      explanation:
        'A pílula do dia seguinte deve ser utilizada caso a mulher tenha uma relação desprotegida ou falha do método contraceptivo utilizado (ex: esqueceu de tomar 2 ou mais pílulas).',
    },
    {
      id: 11,
      texto: 'Existem contraceptivos com “hormônio mais natural”.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Sociedade Brasileira de Endocrinologia e Metabologia. Hormônios Bioidênticos [internet]. São Paulo: SBEM; 2010. [Acesso em: 04Out2024]. Disponível em: https://www.endocrino.org.br/hormonios-bioidenticos/',
      explanation:
        'São os Hormônios Bioidênticos, substâncias hormonais que possuem exatamente a mesma estrutura química e molecular encontrada nos hormônios produzidos no corpo humano.',
    },
    {
      id: 12,
      texto:
        'Ter câncer ou histórico de câncer na família é impeditivo para fazer terapia hormonal?',
      resposta: 'FALSO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'Somente pacientes com cânceres sensíveis ao estrogênio (ex: mama) tem contra-indicação para terapia hormonal. Histórico de câncer na família não contra-indica o tratamento.',
    },
    {
      id: 13,
      texto: 'A menopausa só chega após os 50 anos.',
      resposta: 'FALSO',
      referenceText:
        '1. Baccaro LF, Paiva LH, Nasser EJ, Valadares AL, Silva CR, Nahas EA, et al. Propedêutica mínima no climatério. FEBRASGO POSITION STATEMENT, 2022: 5.',
      explanation:
        'A definição da data da menopausa é feita retrospectivamente, após 12 meses sem sangramento em uma mulher com mais de 45 anos.',
    },
    {
      id: 14,
      texto:
        'Existem muitos efeitos colaterais na terapia de reposição hormonal.',
      resposta: 'FALSO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'Atualmente, a recomendação é iniciar a terapia hormonal com a menor dose efetiva capaz de aliviar os sintomas com menor risco de eventos adversos.',
    },
    {
      id: 15,
      texto: 'Terapia de reposição hormonal ajuda a prevenir a osteoporose.',
      resposta: 'VERDADEIRO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'Os estrogênios inibem a reabsorção óssea, com repercussão importante na massa óssea e no risco de fraturas.',
    },
    {
      id: 16,
      texto:
        'A Fitoterapia pode ajudar a aliviar os sintomas da menopausa tanto quanto a terapia de reposição hormonal.',
      resposta: 'FALSO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'Não há evidência concreta de que os fitoestrogênios efetivamente reduzem os fogachos e suores noturnos em mulheres climatéricas, sendo a terapia hormonal a primeira indicação.',
    },
    {
      id: 17,
      texto:
        'A terapia de reposição hormonal pode aumentar o risco de doenças cardiovasculares em mulheres.',
      resposta: 'FALSO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'A terapia hormonal, quando iniciada até 10 anos da menopausa ou antes dos 60 anos de idade diminui o risco cardiovascular em mulheres.',
    },
    {
      id: 18,
      texto:
        'A terapia hormonal da menopausa pode ser usada por no máximo 5 anos.',
      resposta: 'FALSO',
      referenceText:
        '1. Machado RB, Pompei LM et al. Consenso Brasileiro de Terapêutica Hormonal da Menopausa – Associação Brasileira de Climatério (SOBRAC) – São Paulo: ALEF Editora, 2024. [Juliana Fernandes Romera]',
      explanation:
        'Não há um limite fixo ou duração máxima pré-estabelecida para a uso da TH e nem mesmo uma idade máxima em que deva ser suspensa.',
    },
    // {
    //   id: 19,
    //   texto:
    //     'Preciso desintoxicar o corpo depois de um período utilizando contraceptivos.',
    //   resposta: 'FALSO',
    //   referenceText: '1. ',
    //   explanation:
    //     'Não há nenhum consenso que oriente a necessidade de desintoxicar o corpo após uso de contraceptivos.',
    // },
    // {
    //   id: 20,
    //   texto:
    //     'A terapia hormonal da menopausa pode ser usada por no máximo 5 anos.',
    //   resposta: 'FALSO',
    //   referenceText: '1. ',
    //   explanation:
    //     'Não há um limite fixo ou duração máxima pré-estabelecida para o uso da terapia hormonal e nem mesmo uma idade máxima em que deva ser suspensa.',
    // },
  ];

  const poses = [
    // require('./assets/imgs/Pose1.png'),
    require('./assets/imgs/Pose3Copy.png'),
    require('./assets/imgs/Pose2Copy.png'), // Pose 2
    require('./assets/imgs/Pose4Copy.png'),
    require('./assets/imgs/Pose5Copy.png'),
    require('./assets/imgs/Pose6Copy.png'),
  ];

  // Function to determine the pose to show based on the response
  let lastPose: null = null; // Variable to store the pose for the last question

  // Modify your getPoseForCurrentQuestion function
  const getPoseForCurrentQuestion = useCallback(() => {
    // If we already have a pose for this question, return it
    if (currentPose) return currentPose;

    // Check if perguntasSelecionadas is empty or perguntaAtual is out of bounds
    if (
      perguntasSelecionadas.length === 0 ||
      perguntaAtual >= perguntasSelecionadas.length
    ) {
      return poses[0]; // Return a default pose
    }

    const currentResponse = perguntasSelecionadas[perguntaAtual].resposta;
    let availablePoses = [...poses];

    if (currentResponse === 'Falso') {
      availablePoses = poses.filter((pose) => pose !== poses[1]); // Exclude Pose2
    }

    // Select a random pose that's different from the last one
    let randomPose;
    do {
      const randomIndex = Math.floor(Math.random() * availablePoses.length);
      randomPose = availablePoses[randomIndex];
    } while (randomPose === lastPose && availablePoses.length > 1);

    lastPose = randomPose;
    setCurrentPose(randomPose); // Store the selected pose in state
    return randomPose;
  }, [perguntaAtual, currentPose, perguntasSelecionadas]);

  const selecionarPerguntas = () => {
    const perguntasSelecionadasTemp = [];
    const indicesUsados = new Set();
    while (perguntasSelecionadasTemp.length < 5) {
      const index = Math.floor(Math.random() * perguntas.length);
      if (!indicesUsados.has(index)) {
        indicesUsados.add(index);
        perguntasSelecionadasTemp.push(perguntas[index]);
      }
    }

    setPerguntasSelecionadas(perguntasSelecionadasTemp);
  };

  const carregarPergunta = () => {
    setBotaoDesativado(false);
    setMostrarRightResult(false);
    setMostrarWrongResult(false);
    if (perguntaAtual + 1 < perguntasSelecionadas.length) {
      setCurrentScreen('telaPergunta');
    } else {
      setPerguntaAtual(0);
      setAccumulatedValue((prevValue) => {
        const novoValorAcumulado = prevValue + 20;
        const porcentagem = (novoValorAcumulado / valorTotal) * 100;
        setPorcentagem(porcentagem);
        return novoValorAcumulado;
      });
      setCurrentScreen('telaFechamento');
    }
  };

  const verificarResposta = (resposta: any) => {
    const isCorrect =
      resposta === perguntasSelecionadas[perguntaAtual].resposta;

    if (isCorrect) {
      setResultadoTexto('Resposta Correta');
      setMostrarRightResult(true);
      setMostrarWrongResult(false);
    } else {
      setResultadoTexto('Resposta Errada');
      setMostrarRightResult(false);
      setMostrarWrongResult(true);
    }
    setBotaoDesativado(true);

    // Move to the next question after 2 seconds
    setTimeout(() => {
      if (perguntaAtual + 1 === perguntasSelecionadas.length) {
        setCurrentScreen(`telaResposta`);
      } else {
        setCurrentScreen(`telaResposta`);
      }
      setMostrarRightResult(false);
      setMostrarWrongResult(false);
    }, 2000);
  };

  const handleIniciarQuiz = () => {
    setPerguntaAtual(0);
    selecionarPerguntas();
  };

  const resetInactivityTimer = () => {
    // Clear the existing timer, if any
    if (inactivityTimer) clearTimeout(inactivityTimer);

    // Start a new timer only if on 'telaFechamento'
    if (currentScreen === 'telaFechamento') {
      setInactivityTimer(
        setTimeout(() => {
          setCurrentScreen('telaInicial'); // Navigate to 'telaInicial' after 60 seconds
        }, 60000),
      );
    }
  };

  useEffect(() => {
    setCurrentPose(null);
  }, [perguntaAtual]);

  useEffect(() => {
    if (currentScreen === 'telaFechamento') {
      resetInactivityTimer(); // Start the timer when entering 'telaFechamento'
    } else if (inactivityTimer) {
      clearTimeout(inactivityTimer); // Clear the timer when leaving 'telaFechamento'
    }
  }, [currentScreen]);

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar hidden={true} />
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
          <TouchableOpacity
            style={styles.gestaoButton}
            onPress={() => setCurrentScreen('telaGestao')}
          ></TouchableOpacity>
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
              Bem-vindo ao EstroFacts!{'\n'}A cada participação, doaremos R$20
              para uma ONG que está transformando vidas. Além de se divertir,
              você contribui para uma causa nobre!
            </Text>
            <View style={styles.rulesContainer}>
              <Text style={styles.headerRules}>Como Funciona?</Text>
              <View style={styles.headerRulesContainer}>
                <Text style={styles.headerRules}>1.</Text>
                <Text style={styles.headerRules}>
                  Responda as 5 perguntas{'\n'}de verdadeiro ou falso
                </Text>
              </View>
              <View style={styles.headerRulesContainer}>
                <Text style={styles.headerRules}>2.</Text>
                <Text style={styles.headerRules}>
                  Ao final, você poderá conferir a porcentagem já arrecadada.
                  {/* Ao final, você poderá{'\n'}conferir o valor já{'\n'}
                  arrecadado e saber{'\n'}mais sobre a ONG que{'\n'}está
                  recebendo sua{'\n'}contribuição! */}
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
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => setCurrentScreen('telaInicial')}
          ></TouchableOpacity>
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
              onPress={() => verificarResposta('VERDADEIRO')}
              disabled={botaoDesativado}
            >
              <Text style={styles.buttonTextVerdadeiro}>Verdadeiro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonFalso}
              onPress={() => verificarResposta('FALSO')}
              disabled={botaoDesativado}
            >
              <Text style={styles.buttonText}>Falso</Text>
            </TouchableOpacity>

            <View style={styles.containerResult}>
              {mostrarRightResult && (
                <>
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      // width: 35,
                      // height: 35,
                    }}
                    source={require('./assets/imgs/check_circle.png')}
                  />
                  <Text
                    id="#resultado"
                    style={{
                      fontSize: 30,
                      // fontSize: 24,
                      // fontWeight: 'bold',
                      fontFamily: 'EzraSemiBold',
                      color: '#7dc4aa',
                    }}
                  >
                    {resultadoTexto}
                  </Text>
                </>
              )}

              {mostrarWrongResult && (
                <>
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      // width: 35,
                      // height: 35,
                    }}
                    source={require('./assets/imgs/wrong.png')}
                  />
                  <Text
                    id="#resultado"
                    style={{
                      fontSize: 30,
                      // fontSize: 24,
                      // fontWeight: 'bold',
                      fontFamily: 'EzraSemiBold',
                      color: '#c24242',
                    }}
                  >
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
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => setCurrentScreen('telaInicial')}
          ></TouchableOpacity>
        </View>
      )}

      {currentScreen === 'telaResposta' && (
        <View style={{ backgroundColor: '#cbbdda', height: '103%' }}>
          {/* <View style={{ backgroundColor: '#cbbdda', height: '100%' }}> */}
          <View style={styles.flexContainerResponse}>
            <Image
              style={styles.pinkSquareResponse}
              source={require('./assets/imgs/Rectangle 12377.png')}
            />
            <Image
              style={styles.rectangleResponse}
              source={require('./assets/imgs/Rectangle 12379.png')}
            />
            <Image
              style={styles.uniqueResponse}
              source={require('./assets/imgs/sou-unica5.png')}
            />
          </View>
          <View style={styles.dash}></View>
          <View style={styles.conteudoResposta}>
            <Text style={styles.answerResposta}>
              {/* Falso */}
              {perguntasSelecionadas[perguntaAtual].resposta}
            </Text>
            {/* <Text style={styles.explanation}>
              {perguntasSelecionadas[perguntaAtual].explanation}
            </Text> */}
            <TextoComExpoente
              texto={perguntasSelecionadas[perguntaAtual].explanation}
              style={styles.explanation}
            />
            <TouchableOpacity
              style={styles.buttonReference}
              onPress={() => {
                if (perguntasSelecionadas.length > 0 && !currentPose) {
                  getPoseForCurrentQuestion();
                }
                setModalVisible(true);
              }}
            >
              <ImageBackground
                source={require('./assets/imgs/Group 5.png')}
                style={styles.backgroundImage}
              >
                <View style={styles.containerTextReference}>
                  <Text style={styles.buttonTextReference}>Referências</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <Image
              style={styles.pose}
              source={currentPose || getPoseForCurrentQuestion()}
            />
            <TouchableOpacity
              style={styles.nextQuestionButton}
              onPress={() => {
                setPerguntaAtual(perguntaAtual + 1);
                setCurrentPose(null); // Reset the pose for the new question
                carregarPergunta();
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 30,
                  fontFamily: 'EzraSemiBold',
                }}
              >
                {perguntaAtual + 1 < perguntasSelecionadas.length
                  ? 'Próxima Pergunta'
                  : 'Finalizar'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            {/* <Text
              style={{
                fontSize: 11,
                color: '#333',
                fontFamily: 'EzraSemiBold',
              }}
            >
              Outubro/2024
            </Text> */}
            {/* <Text
              style={{
                fontSize: 11,
                color: '#333',
                fontFamily: 'EzraSemiBold',
              }}
            >
              - Material destinado a profissionais de saúde habilitados a
              dispensar e/ou prescrever medicamentos.
            </Text> */}
            <Text
              style={{
                fontSize: 11,
                color: '#333',
                fontFamily: 'EzraSemiBold',
              }}
            >
              - Este material é de uso exclusivo, sem autorização de postagem
              e/ou compartilhamento.
            </Text>
          </View>
          <Image
            style={styles.rectangleResponse2}
            source={require('./assets/imgs/Rectangle 12379.png')}
          />
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => setCurrentScreen('telaInicial')}
          ></TouchableOpacity>
        </View>
      )}

      {currentScreen === 'telaFechamento' && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => setCurrentScreen('telaInicial')}
        >
          {/* Top Section */}
          <View style={styles.topRow}>
            <View style={styles.rectangleFechamento}></View>
            <Image
              source={require('./assets/imgs/Grafismo.png')}
              style={styles.inicioImageFechamento}
            />
            <Image
              source={require('./assets/imgs/sou-unica.png')}
              style={styles.uniqueImageFechamento}
            />
          </View>

          {/* Content Section */}
          <View style={styles.conteudoFechamento}>
            <View style={styles.fechamentoStick}></View>
            <Image
              source={require('./assets/imgs/LOGOTEMA---SUSM 1.png')}
              style={styles.logoFechamento}
            />

            <View style={styles.conteudoTextoFechamento}>
              <Text style={styles.textoObrigado}>
                Obrigado por jogar e contribuir para um mundo melhor!
              </Text>
            </View>

            <View style={styles.arrecadadosContainer}>
              <Text
                style={{
                  color: '#7e458c',
                  fontFamily: 'EzraSemiBold',
                  fontSize: 16,
                }}
              >
                Já arrecadamos
              </Text>
              <View style={styles.arrecadasdosNumberContainer}>
                {/* //CONTADOR */}
                <Text style={styles.arrecadadosNumber}>
                  {new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(porcentagem)}
                  %
                </Text>
              </View>
              <Text
                style={{
                  color: '#7e458c',
                  fontFamily: 'EzraSemiBold',
                  fontSize: 16,
                }}
              >
                da nossa meta total de R${' '}
                {new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(valorTotal)}
              </Text>
            </View>

            {/* <View style={styles.qrCodeContainer}>
              <Image
                style={styles.qrCodeImage}
                source={require('./assets/imgs/qrCode.png')}
              />
              <Text style={styles.qrCodeText}>
                Caso queira saber mais sobre a ONG que estamos ajudando acesse
                pelo QR CODE
              </Text>
            </View> */}

            <View style={styles.footerFechamento}>
              {/* <Text
                style={{
                  fontSize: 11,
                  color: '#333',
                  fontFamily: 'EzraSemiBold',
                }}
              >
                Outubro/2024
              </Text>  */}
              {/* <Text
                style={{
                  fontSize: 11,
                  color: '#333',
                  fontFamily: 'EzraSemiBold',
                }}
              >
                - Material destinado a profissionais de saúde habilitados a
                dispensar e/ou prescrever medicamentos.
              </Text> */}
              <Text
                style={{
                  fontSize: 11,
                  color: '#333',
                  fontFamily: 'EzraSemiBold',
                }}
              >
                - Este material é de uso exclusivo, sem autorização de postagem
                e/ou compartilhamento.
              </Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.lastColFechamento}>
            <View style={styles.thirdSquare}></View>
            <View style={styles.flexRowFechamento}>
              <View style={styles.fourthRectangle}></View>
              <View style={styles.fifthRectangle}></View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {currentScreen === 'telaGestao' && (
        <View style={styles.gestaoContainer}>
          <Text style={{ color: '#511181', fontSize: 20, fontWeight: 'bold' }}>
            Valor Contador
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Valor Contador"
            keyboardType="number-pad"
            onChangeText={(value: string) => {
              // Use regex to allow only numbers
              const numericValue = value.replace(/[^0-9]/g, '');
              const numberValue = Number(numericValue);

              // Ensure only numbers greater than 0 are accepted
              if (numberValue > 0) {
                setTemporaryValue(numberValue);
              } else {
                setTemporaryValue(0); // Reset or ignore invalid input
              }
            }}
          />

          <TouchableOpacity
            style={{
              height: 65,
              width: '40%',
              backgroundColor: '#4CAF50',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              paddingHorizontal: 5,
              marginVertical: 10,
            }}
            onPress={() => [
              setAccumulatedValue(temporaryValue),
              setCurrentScreen('telaInicial'),
            ]}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              Atualizar Contador
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 65,
              width: '40%',
              backgroundColor: '#511181',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              paddingHorizontal: 5,
              marginBottom: 10,
            }}
            onPress={() => [
              setAccumulatedValue(0),
              setCurrentScreen('telaInicial'),
            ]}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              Resetar Contador
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 65,
              width: '40%',
              backgroundColor: '#c2bbd0',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              paddingHorizontal: 5,
            }}
            onPress={() => setCurrentScreen('telaInicial')}
          >
            <Text style={{ color: '#000', fontSize: 17, fontWeight: 'bold' }}>
              Voltar para a página inicial
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {modalVisible && (
        <View style={styles.referenceOverlay}>
          <View style={styles.referenceContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeXButton}
            >
              <Text style={styles.xText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.referenceTitle}>Referências:</Text>
            <Text style={styles.referenceText}>
              {perguntasSelecionadas[perguntaAtual].referenceText}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default QuizApp;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  //TELA GESTAO
  gestaoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8e2dd',
  },
  input: {
    width: '30%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  //BOTAO OCULTO VOLTAR
  voltarButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'transparent',
    padding: 25,
    borderRadius: 15,
    zIndex: 1,
  },
  //BOTAO OCULTO GESTAO
  gestaoButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'transparent',
    padding: 25,
    borderRadius: 15,
    zIndex: 1,
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
    height: 153,
    width: 153,
    backgroundColor: '#da1278',
  },
  rectangle: {
    // width: 350,
    width: 550,
    height: 93,
    backgroundColor: '#f174ac',
  },
  inicioImage: {
    height: 95,
    width: 95,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  uniqueImage: {
    position: 'absolute',
    top: 50,
    right: 30,
    // left: 430,
    height: 140,
    width: 140,
    zIndex: 100,
  },
  conteudo: {
    height: '70%',
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
    height: '20%',
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
    width: 480,
    height: 140,
    backgroundColor: '#f174ac',
  },
  thirdRectangle: {
    width: 480,
    height: 140,
    backgroundColor: '#cbbed9',
  },
  secondSquare: {
    width: 359,
    height: 418,
    backgroundColor: '#da1278',
  },
  buttonVerdadeiro: {
    width: 600,
    height: 90,
    backgroundColor: '#7dc4aa',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonFalso: {
    width: 600,
    height: 90,
    backgroundColor: '#c24242',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextVerdadeiro: {
    fontSize: 38,
    fontFamily: 'EzraSemiBold',
    color: '#3e4a4f',
  },
  buttonText: {
    fontSize: 38,
    fontFamily: 'EzraSemiBold',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  //Modal
  referenceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  referenceContent: {
    backgroundColor: '#cbbdda',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  closeXButton: {
    position: 'absolute',
    top: -10,
    right: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#511181',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  xText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
  },
  referenceTitle: {
    fontFamily: 'EzraSemiBold',
    color: '#333',
    fontSize: 18,
    marginBottom: 15,
  },
  referenceText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'EzraRegular',
  },
  closeButton: {
    backgroundColor: '#511181',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    paddingHorizontal: 40,
    padding: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'EzraSemiBold',
  },
  //TELA DESCANSO
  containerDescanso: {
    height: '103%',
    backgroundColor: '#90b9d3',
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  topImage: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: 220,
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  conteudoDescanso: {
    position: 'absolute',
    top: 160,
    width: '95%',
    alignItems: 'center',
  },
  stick: {
    width: '20%',
    color: '#512b7d',
    backgroundColor: '#512b7d',
    height: 3,
    position: 'absolute',
    left: -60,
    top: 28,
  },
  heading: {
    fontSize: 35,
    textAlign: 'left',
    width: '65%',
    color: '#512b7d',
    fontFamily: 'EzraSemiBold',
    lineHeight: 50,
  },
  descansoFirst: {
    fontFamily: 'EzraSemiBold',
    fontSize: 25,
    width: '71%',
    color: '#512b7d',
    marginTop: 20,
    textAlign: 'left',
    marginLeft: 50,
    lineHeight: 34,
  },
  rulesContainer: {
    textAlign: 'left',
    width: '64%',
    marginTop: 40,
    gap: 15,
  },
  headerRules: {
    fontSize: 25,
    color: '#512b7d',
    lineHeight: 30,
    fontFamily: 'EzraSemiBold',
    marginBottom: 20,
  },
  headerRulesContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    gap: 4,
  },
  buttonDescanso: {
    width: 500,
    height: 90,
    borderRadius: 100,
    backgroundColor: '#da1278',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextDescanso: {
    fontSize: 35,
    color: 'white',
    fontFamily: 'EzraSemiBold',
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
    width: 60,
    height: 120,
  },
  rectangle2: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    height: 60,
    width: '87%',
  },
  unique2: {
    position: 'absolute',
    right: -35,
    bottom: -15,
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
    width: 500,
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
    fontSize: 28,
    color: '#617179',
    alignSelf: 'flex-end',
    fontFamily: 'EzraSemiBold',
  },
  subtitle: {
    fontSize: 28,
    color: '#617179',
    fontFamily: 'EzraSemiBold',
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
    fontSize: 38,
    fontWeight: 'bold',
    lineHeight: 42,
    textAlign: 'center',
    color: '#511181',
    marginHorizontal: '10%',
  },
  answerResult: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
  },
  containerResult: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
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
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  rectangle28: {
    position: 'absolute',
    bottom: 35,
    left: 145,
    width: 250,
    height: 95,
    tintColor: '#da1278',
  },
  rectangle25: {
    position: 'absolute',
    bottom: -15,
    right: 0,
    width: 405,
    height: 50,
  },
  //TELA RESPOSTA
  flexContainerResponse: {
    display: 'flex',
    flexDirection: 'row',
  },
  pinkSquareResponse: {
    width: 100,
    height: 60,
  },
  rectangleResponse: {
    width: '100%',
    height: 20,
  },
  rectangleResponse2: {
    width: '100%',
    height: 40,
    position: 'absolute',
    bottom: 0,
  },
  uniqueResponse: {
    width: 186,
    height: 113,
    position: 'absolute',
    right: 80,
    top: 0,
  },
  answerResposta: {
    fontSize: 40,
    fontFamily: 'EzraSemiBold',
    color: '#511181',
    marginBottom: 30,
  },
  explanation: {
    fontSize: 20,
    lineHeight: 32,
    fontFamily: 'EzraRegular',
    color: '#511181',
    width: '100%',
  },
  conteudoResposta: {
    paddingTop: 30,
    height: '100%',
    marginHorizontal: '12%',
  },
  nextQuestionButton: {
    position: 'absolute',
    bottom: 200,
    width: '100%',
    height: 75,
    fontSize: 46,
    backgroundColor: '#511181',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,
    paddingHorizontal: 40,
  },
  dash: {
    width: '15%',
    color: '#512b7d',
    backgroundColor: '#512b7d',
    height: 3,
    position: 'absolute',
    left: -60,
    top: 115,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    textAlign: 'center',
    bottom: 50,
    width: '100%',
    lineHeight: 20,
  },
  pose: {
    width: 400,
    height: 450,
    position: 'absolute',
    bottom: 280,
    left: 50,
  },
  buttonReference: {
    width: 200,
    height: 52,
    justifyContent: 'center',
    marginTop: 10,
  },
  backgroundImage: {
    justifyContent: 'center',
    height: 52,
  },
  containerTextReference: {
    backgroundColor: '#c1b1d2',
    height: 35,
    zIndex: -1,
    marginLeft: 45,
    paddingLeft: 12,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonTextReference: {
    color: '#511181',
    fontSize: 18,
    fontFamily: 'EzraSemiBold',
  },
  //TELA FECHAMENTO
  uniqueImageFechamento: {
    position: 'absolute',
    top: 10,
    right: -44,
    height: 210,
    width: 210,
    zIndex: 100,
  },
  inicioImageFechamento: {
    height: 125,
    width: 125,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  rectangleFechamento: {
    width: 680,
    height: 120,
    marginLeft: 125,
    backgroundColor: '#f174ac',
  },
  conteudoFechamento: {
    height: '78%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#f8e2dd',
    gap: 30,
    zIndex: -1,
  },
  logoFechamento: {
    marginLeft: -50,
    height: 140,
    width: 410,
    marginBottom: 30,
  },
  conteudoTextoFechamento: {
    marginHorizontal: '22%',
  },
  textoObrigado: {
    fontSize: 42,
    fontFamily: 'EzraSemiBold',
    alignSelf: 'center',
    textAlign: 'left',
    color: '#7e458c',
    lineHeight: 60,
  },
  arrecadadosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-start',
    width: '54%',
    marginBottom: 190,
  },
  arrecadasdosNumberContainer: {
    backgroundColor: '#cbbdda',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 30,
  },
  arrecadadosNumber: {
    color: '#7e458c',
    fontSize: 50,
    fontFamily: 'EzraSemiBold',
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38.8%',
    marginRight: 125,
    gap: 20,
    marginBottom: 80,
  },
  qrCodeImage: {
    height: 115,
    width: 115,
  },
  qrCodeText: {
    fontSize: 14,
    color: '#7e458c',
    fontFamily: 'EzraSemiBold',
    width: '55%',
    marginTop: 10,
  },
  lastColFechamento: {
    display: 'flex',
    flexDirection: 'column',
    height: '15%',
    position: 'absolute',
    bottom: -30,
  },
  thirdSquare: {
    backgroundColor: '#dc0474',
    height: 60,
    width: 800,
  },
  flexRowFechamento: {
    display: 'flex',
    flexDirection: 'row',
  },
  fourthRectangle: {
    backgroundColor: '#90b9d2',
    height: 125,
    width: 400,
  },
  fifthRectangle: {
    backgroundColor: '#cbbdda',
    height: 125,
    width: 500,
  },
  fechamentoStick: {
    position: 'absolute',
    width: '25%',
    color: '#512b7d',
    backgroundColor: '#512b7d',
    height: 3,
    left: -60,
    top: 335,
  },
  footerFechamento: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    width: '100%',
    lineHeight: 20,
  },
});
