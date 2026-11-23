/* Conteúdo do catálogo. Depois de editar, execute node scripts/build-project-pages.mjs. */
(() => {
  'use strict';

  window.PORTFOLIO_PROJECTS = [
    {
      id: 'dump',
      slug: 'dump-studio',
      name: 'My Dump Studio',
      category: 'Editor de fotos e carrosséis',
      categoryId: 'edicao',
      platform: 'Windows',
      edition: 'Cherry Pie Version',
      headline: 'Do rolo de câmera ao carrossel.',
      summary: 'Junte as fotos do fim de semana, encontre o seu look e monte um photo dump pronto para o feed.',
      description: 'Edite suas fotos, crie colagens e monte carrosséis contínuos em um estúdio desktop que guarda seus projetos no computador.',
      repo: 'https://github.com/felipeAguiarCode/dump-studio',
      docs: 'https://github.com/felipeAguiarCode/dump-studio/blob/main/README.pt-BR.md',
      download: 'https://felipeaguiarcode.github.io/dump-studio/#download',
      cta: 'Ir para a página de download',
      demo: 'https://felipeaguiarcode.github.io/dump-studio/#play',
      demoLabel: 'Testar no navegador',
      video: 'demo.mp4',
      screens: [
        ['editor-filters.webp', 'Painel de filtros e camadas do editor'],
        ['editor-layouts.webp', 'Layouts para colagens e carrosséis'],
        ['presets.png', 'Biblioteca de presets no tema Noir'],
        ['textures.png', 'Painel de texturas e efeitos']
      ],
      tags: ['Photo dumps', 'Colagens', 'Carrosséis'],
      facts: [
        ['Plataforma', 'Windows'],
        ['Idiomas', 'Português e inglês'],
        ['Projetos', 'Locais, com salvamento automático'],
        ['Exportação', 'JPG e PNG'],
        ['Desenvolvedor', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
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
      install: 'A página oficial mostra o status do instalador para Windows. Quando ele estiver disponível, execute o arquivo .exe e abra o My Dump Studio pelo menu Iniciar. Enquanto isso, experimente filtros, layouts e exportação em PNG na demo.',
      questions: [
        ['Onde ficam meus projetos?', 'Os projetos ficam no computador e têm salvamento automático. Você pode começar a editar sem criar uma conta.'],
        ['O que consigo testar no navegador?', 'A demo usa fotos de exemplo para testar looks, intensidade, layouts e prévias em PNG. As ferramentas de camadas e a biblioteca de presets ficam no aplicativo desktop.'],
        ['Quais formatos posso criar?', 'O editor oferece formatos quadrado, retrato, horizontal e Stories. Cada página pode ser exportada em JPG ou PNG.']
      ],
      credits: [
        ['Créditos das fotos', 'https://felipeaguiarcode.github.io/dump-studio/credits.html'],
        ['Créditos do vídeo', 'assets/projects/dump/credits.md']
      ]
    },
    {
      id: 'ps5',
      slug: 'ps5-emushell',
      name: 'psEmuShell',
      category: 'Launcher de jogos',
      categoryId: 'entretenimento',
      platform: 'Windows 10 / 11 · 64 bits',
      edition: 'Versão portátil',
      headline: 'Da biblioteca ao jogo, pelo controle.',
      description: 'transforme seu notebook em um console de sofá com todos seus emuladores e recomps em um lugar só',
      repo: 'https://github.com/felipeAguiarCode/PS5EmuShell',
      docs: 'https://github.com/felipeAguiarCode/PS5EmuShell/blob/main/requisites.md',
      docsLabel: 'Requisitos por emulador',
      download: 'https://github.com/felipeAguiarCode/PS5EmuShell/releases/latest',
      cta: 'Baixar a versão mais recente',
      video: 'demo.mp4',
      screens: [
        ['library.jpg', 'Biblioteca de jogos com capas e arte de fundo'],
        ['collections.jpg', 'Coleções de jogos no launcher'],
        ['trophies.jpg', 'Tela de troféus do RetroAchievements'],
        ['keyboard.jpg', 'Teclado virtual para buscar jogos pelo controle']
      ],
      tags: ['Emulação', 'Controle', 'RetroAchievements'],
      facts: [
        ['Plataforma', 'Windows 10 / 11, 64 bits'],
        ['Distribuição', 'ZIP portátil'],
        ['Controles', 'Xbox, DualShock 4 e DualSense'],
        ['Jogadores', 'Até 4 controles no launcher'],
        ['Desenvolvedor', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
      ],
      whatItDoes: 'Adicione pastas de ROMs e os executáveis de recomps e jogos de PC. O launcher reúne tudo em uma biblioteca com capas, filtros por sistema e favoritos para você escolher o que jogar pelo controle.',
      aboutTitle: 'Sua coleção pronta para jogar',
      about: 'Abra a biblioteca no sofá, passe pelas capas e filtre por console. O launcher reúne jogos de 19 sistemas, recompilações nativas e jogos de PC. Ao escolher um título, ele chama o emulador ou executável que você configurou.',
      features: [
        {
          title: 'Encontre o jogo pela capa',
          body: 'O launcher busca capas para suas ROMs e exibe a arte do jogo na tela inicial. Separe sagas em coleções, marque favoritos e troque de console com L1 e R1.',
          screen: 1
        },
        {
          title: 'Configure a sessão pelo controle',
          body: 'Navegue com Xbox, DualShock 4 ou DualSense por USB ou Bluetooth. Use o teclado virtual para buscar jogos e configure um atalho para voltar ao launcher durante a partida.',
          screen: 3
        },
        {
          title: 'Acompanhe a próxima conquista',
          body: 'Conecte sua conta do RetroAchievements, veja o progresso de cada jogo em lista ou grade e sincronize o login com os emuladores compatíveis.',
          screen: 2
        }
      ],
      stepsTitle: 'Como instalar',
      steps: [
        ['Baixe e extraia o ZIP', 'Abra a última versão no GitHub e extraia o ZIP para uma pasta de sua escolha.'],
        ['Abra o launcher', 'Execute launcher\\Iniciar.bat. Na configuração inicial, escolha os emuladores ou aponte para os executáveis que já usa.'],
        ['Adicione sua biblioteca', 'Coloque suas ROMs na pasta do sistema correspondente ou adicione uma pasta de ROMs, um jogo de PC ou uma recompilação pelo menu +.']
      ],
      requirements: [
        ['Sistema', 'Windows 10 ou 11, 64 bits'],
        ['Processador', 'x64'],
        ['Memória', '4 GB de RAM'],
        ['Vídeo', 'Compatível com DirectX 11'],
        ['Armazenamento', '500 MB para o launcher, mais emuladores e jogos']
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
      categoryId: 'entretenimento',
      platform: 'Navegador',
      edition: 'Computador e celular',
      headline: 'Do primeiro snap à final universitária.',
      summary: 'Escolha entre 138 programas universitários, dispute partidas em pixel art e construa uma carreira de treinador.',
      description: 'Futebol americano universitário em pixel art. Jogue uma partida rápida, dispute campeonatos ou assuma um time por várias temporadas. A ESPX TV acompanha os lances e também transmite partidas entre equipes controladas pela IA.',
      repo: 'https://github.com/felipeAguiarCode/pixel-college-deluxe',
      docs: 'https://github.com/felipeAguiarCode/pixel-college-deluxe/blob/main/README.pt-BR.md',
      playUrl: 'https://felipeaguiarcode.github.io/pixel-college-deluxe/',
      cta: 'Jogar no navegador',
      cover: 'cover.webp',
      video: 'demo.mp4',
      screens: [
        ['pre-snap.png', 'Alabama e Auburn alinhados antes do snap na chuva'],
        ['passe.png', 'Jogada de passe entre Florida State e Clemson'],
        ['corrida.png', 'Michigan e Michigan State disputam uma jogada de corrida na neve'],
        ['recepcao.png', 'Desafio de precisão na recepção entre Texas A&M e LSU'],
        ['espx-tv.png', 'A ESPX TV comenta o intervalo de Georgia e Tennessee']
      ],
      tags: ['Esportes', 'Pixel art', 'Carreira'],
      facts: [
        ['Plataforma', 'Navegador no computador ou celular'],
        ['Idiomas', 'Português (Brasil) e inglês'],
        ['Controles', 'Teclado e mouse ou toque'],
        ['Equipes', '138 programas da FBS'],
        ['Progresso', 'Carreira e campeonato salvos no navegador'],
        ['Desenvolvedor', 'Felipe Aguiar', 'assets/felipe-aguiar.jpg']
      ],
      whatItDoes: 'Escolha seu time, chame as jogadas e execute passes, corridas e chutes. Você pode disputar uma partida rápida, jogar um campeonato ou cuidar do elenco e do recrutamento ao longo de várias temporadas.',
      aboutTitle: 'Cada descida muda a decisão',
      about: 'Você tem quatro descidas para ganhar dez jardas. Leia a defesa antes do snap e escolha entre avançar aos poucos ou arriscar um passe longo. A chuva dificulta a recepção, a neve encurta os passes e o vento pode desviar o chute.',
      features: [
        {
          title: 'Aprenda o playbook em partidas rápidas',
          body: 'Escolha os dois times, a dificuldade, o clima e a duração dos quartos. Observe as rotas e a cobertura antes de chamar o snap.',
          screen: 0
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
    }
  ];
})();
