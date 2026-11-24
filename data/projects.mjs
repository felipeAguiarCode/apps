// Project descriptions and labels for the Brazilian Portuguese catalog.
export const projects = [
  {
    id: 'dump',
    slug: 'dump-studio',
    name: 'My Dump Studio',
    category: 'Editor de fotos e carrosséis',
    platform: 'Windows',
    edition: 'Cherry Pie Version',
    headline: 'Do rolo de câmera ao carrossel.',
    summary: 'Junte as fotos do fim de semana, encontre o seu look e monte um photo dump pronto para o feed.',
    description: 'Edite suas fotos, crie colagens e monte carrosséis contínuos em um estúdio desktop que guarda seus projetos no computador.',
    repo: 'https://github.com/felipeAguiarCode/dump-studio',
    docs: 'https://github.com/felipeAguiarCode/dump-studio/blob/main/README.pt-BR.md',
    download: 'https://github.com/felipeAguiarCode/dump-studio/releases/latest',
    cta: 'Baixar pelo GitHub',
    demo: 'https://felipeaguiarcode.github.io/dump-studio/#play',
    demoLabel: 'Testar no navegador',
    screens: [
      ['01-filtros.png', 'Painel de filtros do editor'],
      ['04-layout-de-colagem.png', 'Layouts para colagens'],
      ['03-previa-de-preset.png', 'Prévia de um preset'],
      ['02-ajustes-de-imagem.png', 'Ajustes de imagem'],
      ['05-previa-do-carrossel.png', 'Prévia do carrossel'],
      ['06-exportacao.png', 'Configurações de exportação'],
      ['07-simulacoes-de-camera.png', 'Simulações de câmeras analógicas'],
      ['08-texturas-de-filme.png', 'Grão e brilho de filme'],
      ['09-recorte-e-proporcao.png', 'Recorte quadrado de uma foto'],
      ['10-tipografia-em-camadas.png', 'Tipografia em uma composição de Lisboa'],
      ['11-efeitos-de-sobreposicao.png', 'Vinheta aplicada como uma camada']
    ],
    tags: ['Photo dumps', 'Colagens', 'Carrosséis'],
    facts: [
      ['platform', 'Windows'],
      ['languages', 'Português e inglês'],
      ['projects', 'Locais, com salvamento automático'],
      ['export', 'JPG e PNG'],
      ['developer', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
    ],
    whatItDoes: 'Importe suas fotos, monte um carrossel e ajuste o visual com filtros e texturas. Salve o tratamento como preset para outros projetos e exporte cada página em JPG ou PNG.',
    aboutTitle: 'Uma sequência com o seu olhar',
    about: 'Um café no meio da tarde, o caminho de volta e o retrato que você quase apagou. No My Dump Studio, cada foto ganha um lugar na sequência. Escolha a composição, ajuste cada camada e veja o carrossel inteiro antes de exportar.',
    features: [
      {
        title: 'Pense no carrossel inteiro',
        body: 'Comece com uma grade, Polaroids ou um layout contínuo. Combine fotos, texto, formas e bordas em camadas. Troque do quadrado para Stories ou para o feed retrato preservando as proporções da composição.',
        screen: 1
      },
      {
        title: 'Dê às fotos o mesmo clima',
        body: 'Experimente 44 filtros, simulações de câmera, curvas e texturas. Aplique grão, vinheta ou luz vazada à foto selecionada e ajuste a intensidade com o original preservado.',
        screen: 0
      },
      {
        title: 'Guarde o look para o próximo dump',
        body: 'Salve filtros, ajustes e efeitos como um preset. Compare o antes e depois, organize os favoritos e leve seus looks para outra instalação com a exportação em JSON.',
        screen: 2
      }
    ],
    steps: [
      ['Monte a composição', 'Crie um projeto, escolha o formato e coloque suas fotos em um layout.'],
      ['Ajuste o visual', 'Edite cada camada e salve um preset se quiser repetir o look.'],
      ['Exporte as páginas', 'Gere JPG ou PNG nas dimensões do projeto.']
    ],
    installTitle: 'Monte seu primeiro dump',
    install: 'Baixe o instalador .exe da versão mais recente no GitHub. Execute o arquivo e abra o My Dump Studio pelo menu Iniciar.',
    questions: [
      ['Onde ficam meus projetos?', 'Os projetos ficam no computador e têm salvamento automático. Você pode começar a editar sem criar uma conta.'],
      ['O que consigo testar no navegador?', 'A demo usa fotos de exemplo para testar looks, intensidade, layouts e prévias em PNG. As ferramentas de camadas e a biblioteca de presets ficam no aplicativo desktop.'],
      ['Quais formatos posso criar?', 'O editor oferece formatos quadrado, retrato, horizontal e Stories. Cada página pode ser exportada em JPG ou PNG.']
    ],
    credits: [
      ['Créditos das fotos', 'https://felipeaguiarcode.github.io/dump-studio/credits.html']
    ]
  },
  {
    id: 'ps5',
    slug: 'ps5-emushell',
    name: 'psEmuShell',
    category: 'Launcher de jogos',
    platform: 'Windows 10 / 11 · 64 bits',
    edition: 'Versão portátil',
    headline: 'Da biblioteca ao jogo, pelo controle.',
    description: 'transforme seu notebook em um console de sofá com todos seus emuladores e recomps em um lugar só',
    repo: 'https://github.com/felipeAguiarCode/psEmuShell',
    docs: 'https://github.com/felipeAguiarCode/psEmuShell/blob/main/requisites.md',
    docsLabel: 'Requisitos por emulador',
    download: 'https://github.com/felipeAguiarCode/psEmuShell/releases/latest',
    cta: 'Baixar a versão mais recente',
    screens: [
      ['01-tela-de-jogos.png', 'Tela inicial de jogos do psEmuShell'],
      ['02-biblioteca.png', 'Biblioteca de jogos com capas'],
      ['03-colecoes.png', 'Coleções de jogos do launcher'],
      ['04-teclado-virtual.png', 'Teclado virtual para buscar jogos pelo controle'],
      ['05-trofeus-tema-claro.png', 'Tela de troféus do RetroAchievements no tema claro'],
      ['06-avatares.png', 'Seleção de avatares']
    ],
    tags: ['Emulação', 'Controle', 'RetroAchievements'],
    facts: [
      ['platform', 'Windows 10 / 11, 64 bits'],
      ['distribution', 'ZIP portátil'],
      ['controls', 'Xbox, DualShock 4 e DualSense'],
      ['players', 'Até 4 controles no launcher'],
      ['developer', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
    ],
    whatItDoes: 'Adicione pastas de ROMs e os executáveis de recomps e jogos de PC. O launcher reúne tudo em uma biblioteca com capas, filtros por sistema e favoritos para você escolher o que jogar pelo controle.',
    aboutTitle: 'Sua coleção pronta para jogar',
    about: 'Abra a biblioteca no sofá, passe pelas capas e filtre por console. O launcher reúne jogos de 19 sistemas, recompilações nativas e jogos de PC. Ao escolher um título, ele chama o emulador ou executável que você configurou.',
    features: [
      {
        title: 'Encontre o jogo pela capa',
        body: 'O launcher busca capas para suas ROMs e exibe a arte do jogo na tela inicial. Separe sagas em coleções, marque favoritos e troque de console com L1 e R1.',
        screen: 2
      },
      {
        title: 'Configure a sessão pelo controle',
        body: 'Navegue com Xbox, DualShock 4 ou DualSense por USB ou Bluetooth. Use o teclado virtual para buscar jogos e configure um atalho para voltar ao launcher durante a partida.',
        screen: 3
      },
      {
        title: 'Acompanhe a próxima conquista',
        body: 'Conecte sua conta do RetroAchievements, veja o progresso de cada jogo em lista ou grade e sincronize o login com os emuladores compatíveis.',
        screen: 4
      }
    ],
    stepsTitle: 'Como instalar',
    steps: [
      ['Baixe e extraia o ZIP', 'Abra a última versão no GitHub e extraia o ZIP para uma pasta de sua escolha.'],
      ['Abra o launcher', 'Execute launcher\\Iniciar.bat. Na configuração inicial, escolha os emuladores ou aponte para os executáveis que já usa.'],
      ['Adicione sua biblioteca', 'Coloque suas ROMs na pasta do sistema correspondente ou adicione uma pasta de ROMs, um jogo de PC ou uma recompilação pelo menu +.']
    ],
    requirements: [
      ['system', 'Windows 10 ou 11, 64 bits'],
      ['processor', 'x64'],
      ['memory', '4 GB de RAM'],
      ['video', 'Compatível com DirectX 11'],
      ['storage', '500 MB para o launcher, mais emuladores e jogos']
    ],
    installTitle: 'Leve a biblioteca para o sofá',
    install: 'Na página da última versão, escolha o ZIP para Windows x64. Os emuladores, jogos e arquivos de BIOS têm requisitos próprios.',
    questions: [
      ['Quais sistemas posso adicionar?', 'PlayStation, PS2, PSP, Nintendo DS e GameCube já vêm configurados. Adicione os demais, como SNES, Nintendo 64, PS3, PS4 e Xbox 360, em Configurações › Instalação.'],
      ['Posso rodar jogos de PS5?', 'O nome faz referência à interface. Os jogos são executados pelos emuladores e pelos executáveis que você configurar. A lista de sistemas inclui consoles até o PS4.'],
      ['O que preciso fornecer para jogar?', 'Use suas próprias cópias de jogos e os arquivos de BIOS ou firmware exigidos por cada emulador. O launcher pode baixar emuladores das fontes oficiais.'],
      ['Posso levar a biblioteca para outro PC?', 'Copie a pasta base inteira, que reúne o launcher, as ROMs e os emuladores. Os caminhos relativos mantêm a biblioteca vinculada no outro computador.']
    ]
  },
  {
    id: 'pixel',
    slug: 'pixel-college-deluxe',
    name: 'Pixel College Deluxe',
    category: 'Futebol americano universitário',
    platform: 'Navegador',
    edition: 'Computador e celular',
    headline: 'Do primeiro snap à final universitária.',
    summary: 'Escolha entre 138 programas universitários, dispute partidas em pixel art e construa uma carreira de treinador.',
    description: 'Futebol americano universitário em pixel art. Jogue uma partida rápida, dispute campeonatos ou assuma um time por várias temporadas. A ESPX TV acompanha os lances e também transmite partidas entre equipes controladas pela IA.',
    repo: 'https://github.com/felipeAguiarCode/pixel-college-deluxe',
    docs: 'https://github.com/felipeAguiarCode/pixel-college-deluxe/blob/main/README.pt-BR.md',
    playUrl: 'https://felipeaguiarcode.github.io/pixel-college-deluxe/',
    cta: 'Jogar no navegador',
    coverScreen: '28-espx-tv-leaders-texas-am-lsu.png',
    screens: [
      ['01-chuva-alabama-auburn-pre-snap.png', 'Alabama e Auburn alinhados antes do snap na chuva'],
      ['02-chuva-florida-state-clemson-passe.png', 'Jogada de passe entre Florida State e Clemson'],
      ['05-neve-michigan-michigan-state-handoff.png', 'Michigan e Michigan State disputam uma jogada de corrida na neve'],
      ['09-qte-texas-am-lsu-recepcao.png', 'Desafio de precisão na recepção entre Texas A&M e LSU'],
      ['25-espx-tv-halftime-georgia-tennessee.png', 'A ESPX TV comenta o intervalo de Georgia e Tennessee'],
      ['06-neve-ohio-state-penn-state-field-goal.png', 'Tentativa de field goal na neve entre Ohio State e Penn State'],
      ['07-neve-notre-dame-iowa-cover-2.png', 'Notre Dame e Iowa alinhados para uma defesa Cover 2'],
      ['11-qte-miami-florida-defesa-do-passe.png', 'Desafio de defesa do passe entre Miami e Florida'],
      ['13-especial-usc-ucla-recepcao-com-uma-mao.png', 'Destaque de uma recepção com uma mão entre USC e UCLA'],
      ['18-fog-army-navy-watch-game.png', 'A neblina toma o campo na transmissão de Army e Navy'],
      ['28-espx-tv-leaders-texas-am-lsu.png', 'Team Leaders na transmissão da ESPX TV entre Texas A&M e LSU']
    ],
    tags: ['Esportes', 'Pixel art', 'Carreira'],
    facts: [
      ['platform', 'Navegador no computador ou celular'],
      ['languages', 'Português (Brasil) e inglês'],
      ['controls', 'Teclado e mouse ou toque'],
      ['teams', '138 programas da FBS'],
      ['progress', 'Carreira e campeonato salvos no navegador'],
      ['developer', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
    ],
    whatItDoes: 'Escolha seu time, chame as jogadas e execute passes, corridas e chutes. Você pode disputar uma partida rápida, jogar um campeonato ou cuidar do elenco e do recrutamento ao longo de várias temporadas.',
    aboutTitle: 'Cada descida muda a decisão',
    about: 'Você tem quatro descidas para ganhar dez jardas e conquistar uma nova série. Um touchdown vale seis pontos e abre a escolha entre chutar o ponto extra ou tentar uma conversão de dois pontos. Se o placar estiver empatado no fim do tempo regulamentar, a partida vai para a prorrogação.',
    mechanics: [
      {
        title: 'Leia as rotas antes do snap',
        body: 'Use ← e → para percorrer o playbook e ↑ e ↓ para trocar as abas de ataque. Enter confirma a escolha. Antes de apertar Espaço para iniciar o lance, compare as rotas coloridas com a posição dos defensores e a barra de espaço sob cada recebedor.',
        screen: 0
      },
      {
        title: 'Coloque o passe onde há espaço',
        body: 'Q, W, E, R e T miram nos recebedores marcados no campo. Y escolhe o mais livre. Toque e solte a tecla para um passe alto ou segure para lançar forte. Com o mouse, clique e arraste para escolher o ponto do passe e solte com Shift para aumentar a força.',
        screen: 1
      },
      {
        title: 'Acerte a janela da recepção',
        body: 'Um recebedor livre tem uma faixa verde maior na barra de precisão. A marcação apertada diminui ou desloca essa janela. Acerte o trecho dourado, quando aparecer, para completar uma recepção com uma mão.',
        screen: 8
      },
      {
        title: 'Corra por fora ou escape da pressão',
        body: 'Em uma jogada de corrida, o quarterback entrega a bola automaticamente ao running back. Para escapar do pocket com o quarterback, aperte C. Depois, use W e S ou ↑ e ↓ para desviar, Shift para acelerar e E ou Espaço para mergulhar.',
        screen: 2
      },
      {
        title: 'Escolha a cobertura pela situação',
        body: 'Use Blitz para pressionar o quarterback. Cover 2 divide o fundo entre dois safeties e protege as laterais. Nickel coloca cinco defensive backs no campo, enquanto Goal Line reforça a linha quando faltam poucas jardas.',
        screen: 6
      },
      {
        title: 'Transforme a defesa em interceptação',
        body: 'No desafio de defesa do passe, siga as teclas e setas indicadas. Uma sequência perfeita garante a interceptação. Com 80% ou mais de acerto, você derruba o recebedor depois da captura. Abaixo disso, ele escapa.',
        screen: 7
      },
      {
        title: 'Decida o que fazer na quarta descida',
        body: 'Se o time estiver ao alcance, um field goal rende três pontos. Pressione Espaço quando o marcador entrar no verde. Fora do alcance, escolha entre devolver a bola com um punt ou arriscar as jardas que faltam.',
        screen: 5
      },
      {
        title: 'Adapte o plano ao clima',
        body: 'Chuva e temporal reduzem a precisão dos passes e dificultam a recepção. A neve corta o alcance e dificulta as mudanças de direção. O vento desvia passes e chutes. Sob neblina, a visibilidade no campo cai.',
        screen: 9
      }
    ],
    features: [
      {
        title: 'Aprenda o playbook em partidas rápidas',
        body: 'Escolha os dois times, a dificuldade, o clima e a duração dos quartos. Use o Jogo Rápido para testar uma rivalidade ou treinar um playbook antes de entrar em um campeonato.'
      },
      {
        title: 'Construa uma carreira de treinador',
        body: 'Recrute atletas com o fundo de bolsas, administre lesões e notas e invista nas instalações. A temporada regular tem 12 jogos, com chance de disputar a final da conferência, um bowl ou o playoff nacional.'
      },
      {
        title: 'Dispute campeonatos e desafios de virada',
        body: 'Jogue ou simule as rodadas do campeonato nacional ou de uma conferência. Nos desafios, cinco academias militares têm quatro cenários de virada cada, com troféus por vitória.',
        screen: 3
      },
      {
        title: 'Assista às partidas pela ESPX TV',
        body: 'Escolha duas equipes e deixe a IA disputar os quatro quartos. Acompanhe a transmissão em velocidade normal, 2× ou 4×.',
        screen: 4
      },
      {
        title: 'Personalize seus times',
        body: 'Edite nome, mascote, cores, capacete e força do programa. Com uma carreira ativa, você também pode ajustar nomes, números e posições do elenco.'
      }
    ],
    stepsTitle: 'Como começar',
    steps: [
      ['Abra o jogo', 'Use Jogar no navegador. Para mudar o idioma, acesse Settings › Language › Português (Brasil).'],
      ['Escolha o confronto', 'Entre em Jogo Rápido e selecione os times. Para aprender os comandos, escolha Rookie, tempo limpo e quartos de um minuto.'],
      ['Faça o primeiro snap', 'Confirme a jogada e pressione Espaço para iniciar o lance. No celular, toque no campo.']
    ],
    installTitle: 'Sua primeira partida',
    install: 'Abra o jogo no navegador e escolha dois times. Se jogar no celular, vire a tela na horizontal para enxergar melhor o campo.',
    questions: [
      ['Como começo a jogar no PC?', 'Clique em Jogar no navegador, abra Quick Play (Jogo Rápido) e escolha seu time e o adversário. O jogo abre no navegador sem instalação.'],
      ['Como escolho uma jogada e faço um passe?', 'Use as setas para navegar pelo playbook, Enter para confirmar e Espaço para iniciar o snap. Use a letra indicada sobre o recebedor ou clique e arraste no campo para mirar o passe.'],
      ['Quais são os comandos para correr e chutar?', 'Durante a corrida, use W e S ou as setas para desviar e Shift para acelerar. Nos chutes, pressione Espaço quando o marcador chegar à faixa verde.'],
      ['Como continuo minha carreira no PC?', 'Use o mesmo navegador e perfil para manter a carreira e o campeonato. Para guardar uma cópia da carreira ou levá-la para outro navegador, vá a Opções › Exportar save.'],
      ['Dá para jogar offline no PC?', 'Baixe o ZIP do repositório e extraia todos os arquivos. Abra index.html no navegador e mantenha a pasta assets ao lado dele.']
    ],
    credits: [
      ['Créditos da arte', 'https://github.com/felipeAguiarCode/pixel-college-deluxe/blob/main/assets/docs/art-credits.md']
    ]
  },
  {
    id: 'markdown',
    slug: 'markdown-live-editor',
    name: 'Markdown Live Editor',
    category: 'Editor de notas em Markdown',
    platform: 'Navegador',
    edition: 'Computador e celular',
    headline: 'Escreva em blocos, organize em pastas.',
    summary: 'Crie notas, checklists e documentos de projeto em um editor que salva o trabalho no navegador.',
    description: 'Editor de notas em blocos com pastas, modelos e modo imersivo. Abra no navegador, organize seus projetos e exporte as notas em Markdown, HTML ou PDF.',
    repo: 'https://github.com/felipeAguiarCode/markdown-live-editor',
    docs: 'https://github.com/felipeAguiarCode/markdown-live-editor/blob/main/README.md',
    webUrl: 'https://felipeaguiarcode.github.io/markdown-live-editor/',
    cta: 'Abrir editor no navegador',
    detailLabel: 'Conhecer o editor',
    screens: [
      ['01-organizacao.png', 'Pastas, notas fixadas e checklist de um projeto'],
      ['02-modelos-de-projeto.png', 'Modelos de documentação de projeto'],
      ['03-menu-do-editor.png', 'Menu de edição de blocos'],
      ['04-tabela-editavel.png', 'Edição de linhas e colunas de uma tabela'],
      ['05-escrita-imersiva.png', 'Área de escrita no modo imersivo'],
      ['06-editor-no-celular.png', 'Editor de notas no celular'],
      ['07-seletor-de-modelos.png', 'Seletor de modelos de notas'],
      ['08-modelos-de-prompt.png', 'Modelos de prompts'],
      ['09-modelos-de-spec-de-api.png', 'Modelo de especificação de API'],
      ['10-spec-gerada-a-partir-de-modelo.png', 'Especificação editável criada a partir de um modelo'],
      ['11-modelos-no-celular.png', 'Seletor de modelos no celular']
    ],
    tags: ['Markdown', 'Notas', 'Modelos'],
    facts: [
      ['platform', 'Navegador no computador ou celular'],
      ['storage', 'Notas, pastas e preferências no navegador'],
      ['export', 'Markdown, HTML e PDF'],
      ['developer', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
    ],
    whatItDoes: 'Escreva notas com títulos, listas, checklists, código e tabelas. Separe projetos em pastas, fixe notas importantes e use a busca para encontrar o que precisa.',
    aboutTitle: 'Do primeiro rascunho à documentação',
    about: 'Anote uma ideia, comece uma especificação a partir de um modelo ou importe uma pasta com seus arquivos Markdown. O editor guarda as mudanças no navegador e permite levar o conteúdo com você por exportação ou backup.',
    features: [
      {
        title: 'Organize as notas por projeto',
        body: 'Crie pastas e subpastas, fixe notas recorrentes e ordene a lista por título, criação ou edição.',
        screen: 0
      },
      {
        title: 'Comece com um modelo',
        body: 'Use modelos de arquitetura, contexto de projeto, especificações e prompts para criar notas que você pode adaptar.',
        screen: 1
      },
      {
        title: 'Edite e reorganize os blocos',
        body: 'Use o menu / para inserir blocos e arraste as alças para mudar a ordem. Nas tabelas, você pode inserir, mover e remover linhas e colunas.',
        screen: 3
      },
      {
        title: 'Abra espaço para escrever',
        body: 'Ative o modo imersivo para ocupar a janela com o editor. Altere o tema e escolha entre papel liso, pautado, quadriculado ou pontilhado.',
        screen: 4
      }
    ],
    stepsTitle: 'Como começar',
    steps: [
      ['Abra o editor', 'Clique em Abrir editor no navegador. No computador, use Mostrar painéis para ver suas pastas e notas.'],
      ['Crie uma nota', 'Comece em branco, selecione um modelo ou importe um arquivo Markdown. Digite / para ver os blocos disponíveis.'],
      ['Guarde uma cópia', 'Exporte uma nota no formato desejado ou gere um backup JSON para guardar o projeto inteiro.']
    ],
    installTitle: 'Crie sua primeira nota',
    install: 'Abra o editor no navegador para começar a escrever. As notas ficam armazenadas no navegador, sem precisar criar conta.',
    questions: [
      ['Minhas notas aparecem em outro dispositivo?', 'As notas ficam no navegador e perfil usados para criar o conteúdo. Use um backup JSON para transferir o projeto ou exporte uma nota para levá-la como arquivo.'],
      ['Posso importar minhas notas em Markdown?', 'Sim. Use a opção de importação na barra lateral para abrir um arquivo Markdown ou uma pasta com notas.'],
      ['Como faço backup de uma pasta?', 'Clique com o botão direito na pasta e escolha Exportar pasta para baixar um ZIP com as notas em Markdown e suas subpastas.'],
      ['Dá para usar offline?', 'Você pode abrir uma cópia local do arquivo HTML. Imagens ou vídeos vinculados a serviços externos dependem de conexão.']
    ]
  }
];
