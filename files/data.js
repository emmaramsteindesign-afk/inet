// ─── ISO CONFIG ───────────────────────────────────────────────────────────────
const TW     = 112;
const TH     = TW / 2;
const SIDE_H = TH;
const OX     = 450;
const OY     = 55;

function isoXY(col, row) {
  return { x: (col - row) * (TW / 2), y: (col + row) * (TH / 2) };
}

// ─── PATH ─────────────────────────────────────────────────────────────────────
const PATH = [
  { col:1, row:5 },  // 0  , decision
  { col:2, row:5 },  // 1  , intermed
  { col:2, row:4 },  // 2  , decision
  { col:3, row:4 },  // 3  , intermed
  { col:3, row:3 },  // 4  , decision
  { col:4, row:3 },  // 5  , decision
  { col:5, row:3 },  // 6  , decision
  { col:6, row:3 },  // 7  , intermed
  { col:6, row:2 },  // 8  , decision
  { col:6, row:1 },  // 9  , decision
  { col:5, row:1 },  // 10 , decision
  { col:4, row:1 },  // 11 , decision
  { col:4, row:0 },  // 12 , intermed
  { col:3, row:0 },  // 13 , decision
  { col:2, row:0 },  // 14 , decision
  { col:1, row:0 },  // 15 , ARRIVEE
];// ─── DECISIONS ────────────────────────────────────────────────────────────────
const DECISIONS = [

  // ── CASE 0 , Administrateur territorial ───────────────────────────────────
  {
    stepIdx: 0,
    id: 'inet', name: "L'INET", lieu: "1 rue Edmond Michelet",
    color: '#68C0B5', module: 'Formation initiale, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Tu visites l'INET à Strasbourg. Un élève te dit : 'En 18 mois, j'ai bossé dans une mairie, un département, une région et une métropole.' Tu te demandes : c'est quoi la différence entre tout ça ?",
    question: "Qui s'occupe des collèges en France ?",
    choices: [
      "La mairie",
      "Le département",
      "La région",
      "L'État uniquement"
    ],
    correct: 1,
    feedback: "La mairie gère les écoles primaires, le département les collèges, la région les lycées. Trois institutions différentes, avec des budgets et des équipes différentes. Un futur directeur général doit connaître tout ça , c'est pourquoi l'INET envoie ses élèves dans les quatre types de collectivités pendant leur formation.",
    penalty: null,
  },

  // ── CASE 1 , Conservateur de bibliothèques ────────────────────────────────
  {
    stepIdx: 1,
    id: 'mediatheque', name: "Médiathèque André Malraux", lieu: "Presqu'île Malraux",
    color: '#ED6971', module: 'Lecture publique, Cycle Conservateurs de bibliothèques',
    formation: { illu: '../illu3.svg', label: 'Conservateur de bibliothèques' },
    situation: "Tu es en visite à la médiathèque André Malraux , la plus grande d'Alsace. La directrice te montre une salle pleine de gens qui font de l'impression 3D, du montage vidéo, des podcasts... Tu lui demandes : 'Mais c'est encore une bibliothèque ici ?'",
    question: "Pourquoi les médiathèques proposent-elles autant d'activités au-delà des livres ?",
    choices: [
      "Parce que les livres ne se vendent plus et qu'il faut trouver autre chose",
      "Pour attirer des publics qui ne seraient jamais venus autrement, et faire de la bibliothèque un lieu de vie pour tous",
      "Parce que c'est imposé par une loi nationale depuis 2015",
      "Pour concurrencer les salles de coworking privées"
    ],
    correct: 1,
    feedback: "Une médiathèque qui n'est qu'une salle de livres silencieuse, c'est fini. Aujourd'hui, ce sont des lieux ouverts à tous, gratuits, où on peut apprendre, créer, se retrouver. Le conservateur de bibliothèques formé à l'INET pilote ces transformations , un des métiers publics qui évolue le plus vite.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },

  // ── CASE 2 , Conservateur du patrimoine ──────────────────────────────────
  {
    stepIdx: 2,
    id: 'orangerie', name: "Parc de l'Orangerie", lieu: "Allée de la Robertsau",
    color: '#B488BC', module: 'Transition écologique, Cycle Conservateurs du patrimoine',
    formation: { illu: '../illu2.svg', label: 'Conservateur du patrimoine' },
    situation: "Tu te promènes dans le Parc de l'Orangerie. Un promoteur veut bétonner un terrain vert juste à côté pour construire des logements. Pour compenser, il propose de planter des arbres dans un village à 30 km. Ton responsable te demande ton avis.",
    question: "Est-ce qu'on peut détruire de la nature ici si on replante ailleurs ?",
    choices: [
      "Oui, planter autant d'arbres ailleurs compense toujours",
      "Non, la loi dit qu'on doit d'abord chercher à éviter la destruction avant de parler de compensation",
      "Oui, du moment que le promoteur plante deux fois plus d'arbres",
      "Ça dépend uniquement du maire"
    ],
    correct: 1,
    feedback: "La règle s'appelle ERC : Éviter → Réduire → Compenser. On ne peut pas sauter directement à 'je plante ailleurs' sans avoir vraiment cherché à ne pas détruire. C'est un principe fondamental que les conservateurs du patrimoine appliquent tous les jours.",
    penalty: { type: 'reculer', cases: 2, label: 'Mauvaise réponse : reculer de 2 cases !' },
  },

  // ── CASE 3 , Conservateur du patrimoine ──────────────────────────────────
  {
    stepIdx: 3,
    id: 'musee_alsace', name: "Musée alsacien", lieu: "23 quai Saint-Nicolas",
    color: '#B488BC', module: "Valorisation des collections, Cycle Conservateurs du patrimoine",
    formation: { illu: '../illu2.svg', label: 'Conservateur du patrimoine' },
    situation: "Tu visites les réserves du Musée alsacien : des milliers d'objets anciens jamais exposés faute de place. Une fondation propose de financer une expo itinérante pour les faire voyager dans les villages du Bas-Rhin. Le directeur hésite.",
    question: "Quel est le premier réflexe d'un conservateur avant de prêter des objets de musée ?",
    choices: [
      "Accepter : plus les objets voyagent, plus le musée est connu",
      "Refuser : les objets de musée ne doivent jamais quitter leur lieu de conservation",
      "Vérifier que le transport et les conditions d'exposition ne risquent pas d'abîmer les objets",
      "Demander l'autorisation du maire de Strasbourg"
    ],
    correct: 2,
    feedback: "Prêter une œuvre, c'est engager la responsabilité du musée. Température, humidité, vibrations du transport, sécurité sur place , tout doit être vérifié. Valoriser le patrimoine oui, mais pas à n'importe quel prix.",
    penalty: { type: 'passer', label: 'Mauvaise réponse : passer votre prochain tour !' },
  },

  // ── CASE 4 , Administrateur territorial ───────────────────────────────────
  {
    stepIdx: 4,
    id: 'mairie', name: "Mairie de Strasbourg", lieu: "Place Broglie",
    color: '#68C0B5', module: 'Direction générale, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Tu assistes à une scène tendue à la mairie. La maire demande au directeur général des services (le plus haut fonctionnaire de la ville) d'écrire un rapport pour attaquer l'opposition avant le conseil municipal.",
    question: "Qu'est-ce qu'un fonctionnaire doit faire dans cette situation ?",
    choices: [
      "Obéir : la maire est sa supérieure",
      "Démissionner pour ne pas être impliqué",
      "Refuser et proposer un rapport factuel, équilibré, sans parti pris politique",
      "Prévenir discrètement l'élu d'opposition"
    ],
    correct: 2,
    feedback: "Un fonctionnaire travaille pour tous les habitants, pas pour la majorité politique du moment. C'est la règle d'impartialité. Il peut conseiller, mais pas produire un document partisan. Tenir cette ligne, c'est exactement ce que l'INET apprend à ses élèves.",
    penalty: { type: 'passer', label: 'Mauvaise réponse : passer votre prochain tour !' },
  },

  // ── CASE 5 , Administrateur territorial ───────────────────────────────────
  {
    stepIdx: 5,
    id: 'eurometropole', name: "Eurométropole de Strasbourg", lieu: "1 parc de l'Étoile",
    color: '#68C0B5', module: 'Finances locales, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "L'Eurométropole veut améliorer les transports avec l'Allemagne. L'Europe finance 60 % du projet. Il reste 40 % à payer sur 4 ans. Un collègue propose d'inscrire toute la dépense dans le budget de cette année pour simplifier.",
    question: "Pourquoi c'est une mauvaise idée ?",
    choices: [
      "Ce n'est pas une mauvaise idée, on peut ajuster le budget en cours d'année",
      "Parce que les collectivités doivent avoir un budget équilibré chaque année , une grosse dépense d'un coup peut tout faire basculer",
      "Parce que l'Europe interdit les budgets annuels pour les projets transfrontaliers",
      "Parce que la loi limite les dépenses à 10 % du budget annuel"
    ],
    correct: 1,
    feedback: "Une ville ou une métropole ne peut pas voter un budget en déficit , contrairement à l'État. Pour les grands projets, il existe des outils pour lisser les dépenses dans le temps. Maîtriser ces règles, c'est une compétence clé des administrateurs territoriaux formés à l'INET.",
    penalty: null,
  },

  // ── CASE 6 , Administrateur territorial ───────────────────────────────────
  {
    stepIdx: 6,
    id: 'prefecture', name: "Préfecture du Bas-Rhin", lieu: "5 place de la République",
    color: '#68C0B5', module: 'Droit public & institutions, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Tu visites la préfecture. Le préfet vient de contester une décision du maire de Strasbourg devant le tribunal administratif. Un ami te dit : 'Mais le maire, c'est lui qui décide dans sa ville, non ?'",
    question: "Pourquoi le préfet peut-il contester une décision du maire ?",
    choices: [
      "Il ne peut pas, le maire est totalement souverain dans sa commune",
      "La Constitution lui confie le rôle de vérifier que les décisions locales respectent bien la loi",
      "Le préfet est le supérieur hiérarchique du maire et peut lui donner des ordres",
      "C'est un règlement européen qui l'y autorise"
    ],
    correct: 1,
    feedback: "Depuis 1982, les maires décident librement , mais leurs décisions doivent respecter la loi. Le préfet ne peut plus les bloquer avant, mais peut les contester après. C'est ça, la décentralisation : liberté locale + contrôle de légalité.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },

  // ── CASE 7 , Conservateur du patrimoine ──────────────────────────────────
  {
    stepIdx: 7,
    id: 'neustadt', name: "Quartier Neustadt", lieu: "Avenue de la Liberté",
    color: '#B488BC', module: "Patrimoine UNESCO, Cycle Conservateurs du patrimoine",
    formation: { illu: '../illu2.svg', label: 'Conservateur du patrimoine' },
    situation: "Tu te balades dans la Neustadt, classée UNESCO depuis 2017. Un promoteur veut remplacer les vieilles fenêtres d'un immeuble haussmannien par du double vitrage moderne pour isoler le bâtiment. Ton responsable te demande ton avis.",
    question: "Un classement UNESCO, ça interdit toute rénovation ?",
    choices: [
      "Oui, aucun travaux n'est possible dans un quartier classé UNESCO",
      "Non, mais les travaux doivent respecter l'aspect d'origine , il existe des solutions qui combinent isolation et style historique",
      "Non, l'isolation thermique est prioritaire sur tout le reste",
      "Ça dépend uniquement du préfet"
    ],
    correct: 1,
    feedback: "Un classement UNESCO n'interdit pas de rénover , il exige que l'authenticité du site soit préservée. Des doubles vitrages à profil historique existent, et l'Architecte des Bâtiments de France valide tous les travaux en secteur protégé. Patrimoine et écologie ne sont pas incompatibles.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },

  // ── CASE 8 , Administrateur territorial ───────────────────────────────────
  {
    stepIdx: 8,
    id: 'conseil_dep', name: "Collectivité européenne d'Alsace", lieu: "Place du Quartier Blanc",
    color: '#68C0B5', module: 'Finances publiques, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Le président de la Collectivité européenne d'Alsace veut construire un grand stade à 80 millions d'euros, en empruntant toute la somme sur 30 ans. Ton responsable te demande : 'On peut se le permettre ?'",
    question: "Comment savoir si une collectivité peut vraiment se permettre un gros emprunt ?",
    choices: [
      "Regarder combien il y a sur le compte bancaire aujourd'hui",
      "Calculer combien d'années il faudrait pour rembourser toute la dette avec les économies annuelles , au-delà de 12 ans, c'est risqué",
      "Vérifier que l'emprunt ne dépasse pas 10 % du budget annuel",
      "Obtenir l'autorisation du préfet"
    ],
    correct: 1,
    feedback: "Si la collectivité met de côté 10 M€ par an et a 80 M€ de dettes, il lui faut 8 ans , c'est raisonnable. Au-delà de 12 ans, les finances deviennent fragiles. On appelle ça la 'capacité de désendettement'. Savoir lire un budget, c'est une des premières choses qu'on apprend à l'INET.",
    penalty: null,
  },

  // ── CASE 9 , Conservateur de bibliothèques ────────────────────────────────
  {
    stepIdx: 9,
    id: 'tram', name: "CTS, Place de l'Homme de Fer", lieu: "Place de l'Homme de Fer",
    color: '#ED6971', module: 'Numérique & médiation, Cycle Conservateurs de bibliothèques',
    formation: { illu: '../illu3.svg', label: 'Conservateur de bibliothèques' },
    situation: "La bibliothèque veut lancer une appli qui analyse les emprunts de 120 000 abonnés pour leur recommander des livres , un peu comme Spotify, mais pour la lecture. Ta responsable te demande : 'Qu'est-ce qu'on doit vérifier avant de lancer ça ?'",
    question: "Avant d'analyser les habitudes de lecture de 120 000 personnes, que faut-il faire ?",
    choices: [
      "Rien, les données de bibliothèque ne sont pas sensibles",
      "Juste ajouter une ligne dans les conditions générales d'utilisation",
      "Réaliser une étude d'impact sur la vie privée, et si les risques restent élevés, consulter la CNIL",
      "Obtenir l'accord des syndicats des bibliothécaires"
    ],
    correct: 2,
    feedback: "Les habitudes de lecture peuvent révéler des opinions politiques ou religieuses , ce sont des données sensibles. Le RGPD impose une Analyse d'Impact avant tout traitement à grande échelle. Si les risques restent élevés, la CNIL doit valider. Les conservateurs de bibliothèques de l'INET pilotent ces projets numériques dans le respect du droit des usagers.",
    penalty: { type: 'passer', label: 'Mauvaise réponse : passer votre prochain tour !' },
  },

  // ── CASE 10 , Administrateur territorial ──────────────────────────────────
  {
    stepIdx: 10,
    id: 'cathedrale', name: "Cathédrale Notre-Dame", lieu: "Place de la Cathédrale",
    color: '#68C0B5', module: 'Droit local alsacien-mosellan, Cycle Administrateur territorial',
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Une association demande à la mairie de Strasbourg d'installer une crèche de Noël dans le hall de l'Hôtel de Ville. Un ami te dit : 'En France c'est laïque, ils peuvent jamais accepter ça !' Mais ton responsable sourit : 'En Alsace, c'est un peu différent...'",
    question: "Pourquoi les règles sur la laïcité sont-elles différentes en Alsace ?",
    choices: [
      "Ce n'est pas différent, la laïcité s'applique partout en France de la même façon",
      "Parce que l'Alsace a un statut juridique particulier hérité de l'époque où elle était allemande, avec des règles propres sur la religion",
      "Parce que le maire de Strasbourg a un pouvoir spécial sur les questions religieuses",
      "C'est une tradition locale tolérée mais sans base légale"
    ],
    correct: 1,
    feedback: "L'Alsace-Moselle applique un droit local datant d'avant 1905 , quand la région était allemande et n'a pas connu la loi de séparation Église-État. Résultat : des règles différentes sur la religion, les jours fériés, les associations... Un droit unique en France que tout cadre territorial à Strasbourg doit connaître.",
    penalty: null,
  },

  // ── CASE 11 , Administrateur territorial ──────────────────────────────────
  {
    stepIdx: 11,
    id: 'hopital', name: "Hôpitaux Universitaires de Strasbourg", lieu: "1 place de l'Hôpital",
    color: '#68C0B5', module: "Santé & action locale, Cycle Administrateur territorial",
    formation: { illu: '../illu1.svg', label: 'Administrateur territorial' },
    situation: "Les urgences des hôpitaux de Strasbourg débordent. Un élu de l'Eurométropole veut agir. Mais un conseiller lui dit : 'La santé c'est pas notre compétence, on peut rien faire.' L'élu te demande si c'est vrai.",
    question: "Une métropole peut-elle agir sur un problème de santé publique ?",
    choices: [
      "Non, la santé appartient uniquement à l'État, la métropole ne peut rien faire",
      "Oui, la métropole est responsable de la santé et peut imposer des solutions aux médecins",
      "Oui, même sans compétence officielle, elle peut coordonner les acteurs et signer des accords avec l'Agence Régionale de Santé",
      "Non, c'est uniquement le rôle de la Région depuis 2015"
    ],
    correct: 2,
    feedback: "La santé n'est pas une compétence officielle des métropoles , mais ça ne les empêche pas d'agir. En signant des Contrats Locaux de Santé avec l'ARS, une métropole peut financer des maisons de santé, coordonner des médecins de ville. Agir concrètement sans en avoir le titre officiel, c'est tout l'art du cadre territorial.",
    penalty: { type: 'reculer', cases: 2, label: 'Mauvaise réponse : reculer de 2 cases !' },
  },

  // ── CASE 12 , Conservateur de bibliothèques ───────────────────────────────
  {
    stepIdx: 12,
    id: 'robertsau', name: "Bibliothèque de la Robertsau", lieu: "Rue Boecklin",
    color: '#ED6971', module: "Réseau de lecture publique, Cycle Conservateurs de bibliothèques",
    formation: { illu: '../illu3.svg', label: 'Conservateur de bibliothèques' },
    situation: "La bibliothèque de la Robertsau a testé une nouveauté : ouvrir le soir sans personnel, accès par badge. Résultat : 3 fois plus de visites. Mais les bibliothécaires s'y opposent : 'Sans agent, on ne garantit rien.' Ton responsable te demande comment trancher.",
    question: "Que fait un bon manager face à une innovation qui marche mais divise les équipes ?",
    choices: [
      "Imposer : les chiffres parlent d'eux-mêmes",
      "Abandonner : sans accord syndical, rien n'est possible",
      "Conduire une expérimentation encadrée avec les équipes, évaluer ensemble, puis décider",
      "Externaliser l'accueil du soir à une entreprise privée"
    ],
    correct: 2,
    feedback: "Imposer sans concerter crée des conflits. Renoncer sans explorer prive les usagers d'un service. Tester, évaluer, décider ensemble : c'est la méthode que les conservateurs de bibliothèques de l'INET apprennent à appliquer face aux transformations.",
    penalty: null,
  },

  // ── CASE 13 , Conservateur du patrimoine ─────────────────────────────────
  {
    stepIdx: 13,
    id: 'musees_strasbourg', name: "Musées de Strasbourg", lieu: "Palais Rohan, 2 place du Château",
    color: '#B488BC', module: "Politique culturelle, Cycle Conservateurs du patrimoine",
    formation: { illu: '../illu2.svg', label: 'Conservateur du patrimoine' },
    situation: "Le budget des Musées de Strasbourg a baissé de 12 % en 3 ans. Le directeur doit choisir quelles œuvres acheter en priorité cette année. Il te demande : 'Sur quelle base tu déciderais, toi ?'",
    question: "Qu'est-ce qui guide un conservateur quand il choisit d'acheter une œuvre ?",
    choices: [
      "Ce qui plaît le plus au grand public pour remplir le musée",
      "Ce qui a la valeur marchande la plus élevée",
      "Ce qui complète les collections existantes, correspond à la politique validée par les élus, et dont la provenance légale est vérifiée",
      "Uniquement les dons et legs, pour ne pas dépenser d'argent public"
    ],
    correct: 2,
    feedback: "Acheter une œuvre pour un musée, ce n'est pas du shopping , ça engage la ville pour des générations. La provenance doit être irréprochable (pas de biens spoliés), et l'achat doit s'inscrire dans une stratégie validée par les élus. Ces arbitrages complexes, c'est le quotidien du conservateur du patrimoine.",
    penalty: null,
  },

  // ── CASE 14 , Conservateur de bibliothèques ───────────────────────────────
  {
    stepIdx: 14,
    id: 'petite_france', name: "La Petite France", lieu: "Quai de la Bruche",
    color: '#ED6971', module: "Action culturelle, Cycle Conservateurs de bibliothèques",
    formation: { illu: '../illu3.svg', label: 'Conservateur de bibliothèques' },
    situation: "Les habitants des quartiers prioritaires de Strasbourg représentent 18 % de la population, mais seulement 4 % des inscrits à la bibliothèque. Ta responsable te demande : 'Comment on fait venir des gens qui ne sont jamais entrés dans une bibliothèque de leur vie ?'",
    question: "Quelle est la stratégie la plus efficace pour toucher ces publics ?",
    choices: [
      "Baisser le prix de l'abonnement",
      "Faire de grandes campagnes d'affichage dans les quartiers",
      "Aller dans les lieux de vie de ces publics et construire des services avec eux, plutôt qu'attendre qu'ils viennent",
      "Ouvrir une nouvelle bibliothèque dans le quartier"
    ],
    correct: 2,
    feedback: "Le vrai frein, ce n'est pas le prix ni la distance , c'est souvent le sentiment que 'ce lieu n'est pas fait pour moi'. La solution : aller vers ces publics dans leurs lieux (centres sociaux, marchés, écoles) et co-construire des services avec eux. C'est ce qu'on appelle la stratégie 'aller vers'.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },
];