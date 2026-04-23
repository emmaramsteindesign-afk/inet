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
  { col:1, row:5 },  // 0  – decision
  { col:2, row:5 },  // 1  – intermed
  { col:2, row:4 },  // 2  – decision
  { col:3, row:4 },  // 3  – intermed
  { col:3, row:3 },  // 4  – decision
  { col:4, row:3 },  // 5  – decision
  { col:5, row:3 },  // 6  – decision
  { col:6, row:3 },  // 7  – intermed
  { col:6, row:2 },  // 8  – decision
  { col:6, row:1 },  // 9  – decision
  { col:5, row:1 },  // 10 – decision
  { col:4, row:1 },  // 11 – decision
  { col:4, row:0 },  // 12 – intermed
  { col:3, row:0 },  // 13 – decision
  { col:2, row:0 },  // 14 – decision
  { col:1, row:0 },  // 15 – ARRIVEE
];

// ─── DECISIONS ────────────────────────────────────────────────────────────────
const DECISIONS = [
  {
    stepIdx: 0,
    id: 'inet', name: "L'INET", lieu: "1 rue Edmond Michelet",
    color: '#B488BC', module: 'Parcours INET — Formation initiale',
    situation: "Tu visites l'INET, la grande école publique de Strasbourg qui forme les futurs directeurs et directrices des grandes collectivités (villes, départements, régions…). Un élève te montre son planning : des cours à Strasbourg, des stages dans une ville, un département, une région et une métropole — tous différents.",
    question: "Pourquoi faire des stages dans plusieurs types de collectivités plutôt qu'une seule ?",
    choices: [
      "Pour avoir plus de chances de trouver un poste après la formation",
      "Parce que chaque collectivité a des missions très différentes — une ville gère les écoles primaires, un département les collèges et l'aide sociale, une région les lycées et les trains",
      "Parce que l'INET n'a pas assez de place pour tout le monde à Strasbourg",
      "C'est juste une tradition sans vraie raison"
    ],
    correct: 1,
    feedback: "Une ville, un département et une région ne font pas du tout les mêmes choses. Un futur directeur général doit comprendre comment chacun fonctionne. C'est pourquoi la formation de 18 mois à l'INET alterne cours et stages dans des collectivités variées. Et toi ? Si tu veux un jour diriger une grande collectivité, c'est le parcours à viser : bac → licence/master → concours → INET.",
    penalty: null,
  },
  {
    stepIdx: 2,
    id: 'orangerie', name: "Parc de l'Orangerie", lieu: "Allée de la Robertsau",
    color: '#68C0B5', module: 'Transition écologique — Cycle supérieur de la transition (INET)',
    situation: "Tu es en stage au service urbanisme de l'Eurométropole. Un promoteur veut construire des logements sur un terrain verdoyant à côté du Parc de l'Orangerie. Pour compenser, il propose de planter des arbres dans un village du Bas-Rhin. Ton responsable te demande : 'Est-ce qu'on peut accepter ça ?'",
    question: "Qu'est-ce que la loi impose avant d'accepter une compensation environnementale ?",
    choices: [
      "Rien : planter des arbres ailleurs compense toujours la destruction de nature ici",
      "Il faut d'abord avoir vraiment cherché à éviter la destruction, puis à la réduire — la compensation n'est qu'un dernier recours",
      "Il suffit que le promoteur plante deux fois plus d'arbres qu'il n'en détruit",
      "La décision appartient uniquement au maire, le service technique n'a pas à se prononcer"
    ],
    correct: 1,
    feedback: "La loi impose une logique en 3 étapes : Éviter → Réduire → Compenser (la règle ERC). On ne peut pas sauter directement à la compensation si on n'a pas cherché d'abord à éviter le problème. C'est un réflexe clé dans les métiers de l'environnement et de l'urbanisme en collectivité. À l'INET, le Cycle supérieur de la transition prépare les cadres à piloter ces stratégies environnementales à l'échelle d'un territoire.",
    penalty: { type: 'reculer', cases: 2, label: 'Mauvaise réponse : reculer de 2 cases !' },
  },
  {
    stepIdx: 4,
    id: 'mairie', name: "Mairie de Strasbourg", lieu: "Place Broglie",
    color: '#E84250', module: 'Direction générale — Cycle de direction générale INET',
    situation: "Tu es en stage à la mairie. Tu assistes à une scène tendue : la maire demande au DGS (le directeur général des services — le plus haut fonctionnaire de la ville) d'écrire un rapport critique sur un projet porté par l'opposition, pour s'en servir lors du conseil municipal.",
    question: "Que doit faire le DGS ?",
    choices: [
      "Écrire le rapport : la maire est son supérieur, il doit obéir",
      "Refuser et proposer à la place un rapport factuel et équilibré sur le projet",
      "Démissionner pour ne pas être impliqué",
      "Écrire le rapport mais prévenir l'élu d'opposition"
    ],
    correct: 1,
    feedback: "Un fonctionnaire travaille pour l'institution et tous ses habitants — pas pour la majorité politique du moment. C'est une règle fondamentale : l'impartialité. Le DGS peut conseiller la maire, mais il ne peut pas produire un document partisan. Cette posture d'équilibre entre l'élu et le fonctionnaire, c'est exactement ce que prépare le Cycle de direction générale de l'INET.",
    penalty: { type: 'passer', label: 'Mauvaise réponse : passer votre prochain tour !' },
  },
  {
    stepIdx: 5,
    id: 'eurometropole', name: "Eurométropole", lieu: "1 parc de l'Étoile",
    color: '#B488BC', module: 'Projet de territoire — Itinéraire Territoire INET',
    situation: "Tu es en stage à l'Eurométropole. L'institution veut obtenir une subvention européenne pour améliorer les transports entre Strasbourg et Kehl (Allemagne). La subvention couvre 60 % du coût total sur 4 ans. L'Eurométropole doit financer les 40 % restants — mais la dépense s'étale sur 4 ans, pas en une seule fois.",
    question: "Pourquoi est-ce un vrai problème d'inscrire toute la dépense dans le budget d'une seule année ?",
    choices: [
      "Ce n'est pas un problème, on peut toujours ajuster le budget en cours d'année",
      "Parce que les collectivités doivent avoir un budget équilibré chaque année — une grosse dépense d'un coup peut tout faire basculer",
      "Parce que les subventions européennes arrivent toujours en avance sur les dépenses",
      "Parce que la loi interdit les projets transfrontaliers de plus de 3 ans"
    ],
    correct: 1,
    feedback: "Contrairement à l'État, une collectivité ne peut pas voter un budget en déficit. Pour les grands projets sur plusieurs années, il existe des outils spéciaux pour lisser les dépenses dans le temps. Strasbourg est une des rares villes françaises à monter régulièrement des projets avec l'Allemagne — une spécificité que les cadres formés à l'INET exploitent. L'Itinéraire Territoire de l'INET forme justement à ces stratégies de développement territorial.",
    penalty: null,
  },
  {
    stepIdx: 6,
    id: 'prefecture', name: "Préfecture du Bas-Rhin", lieu: "5 place de la République",
    color: '#ED6971', module: 'Institutions — Cycle INET Stratégies publiques et management',
    situation: "Tu visites la préfecture du Bas-Rhin. Le préfet explique qu'il vient de contester une décision du maire de Strasbourg devant le tribunal administratif. Un de tes camarades demande : 'Mais c'est pas le maire qui décide dans sa ville ? Le préfet peut vraiment s'y opposer ?'",
    question: "Pourquoi le préfet peut-il contester une décision du maire ?",
    choices: [
      "Il ne peut pas — le maire est totalement souverain dans sa commune",
      "La Constitution donne au préfet le rôle de vérifier que les décisions locales respectent bien la loi nationale",
      "Le préfet est le supérieur hiérarchique du maire et peut lui donner des ordres",
      "C'est un règlement européen qui l'autorise à intervenir"
    ],
    correct: 1,
    feedback: "Depuis 1982, les maires décident librement — mais leurs décisions doivent respecter la loi. C'est l'article 72 de la Constitution qui confie au préfet un rôle de 'contrôle de légalité'. Le préfet ne peut plus bloquer une décision avant qu'elle soit prise (fin de la tutelle préfectorale), mais il peut la contester après. Comprendre cet équilibre État–collectivités est une compétence de base pour tous les futurs cadres territoriaux formés à l'INET.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },
  {
    stepIdx: 8,
    id: 'conseil_dep', name: "Collectivité européenne d'Alsace", lieu: "Place du Quartier Blanc",
    color: '#8D59A0', module: 'Finances publiques — Cycle supérieur de management INET (CSM)',
    situation: "Tu es en stage à la Collectivité européenne d'Alsace. Le président veut construire un grand stade à 80 millions d'euros en empruntant toute la somme sur 30 ans. Ton responsable finances te dit : 'Il faut vérifier si on peut se le permettre sans mettre la collectivité en danger.' Il te demande par quoi commencer.",
    question: "Comment savoir si une collectivité peut vraiment se permettre un gros emprunt ?",
    choices: [
      "Regarder combien il y a sur le compte bancaire de la collectivité aujourd'hui",
      "Calculer en combien d'années la collectivité rembourserait toute sa dette avec ses économies annuelles — si c'est plus de 12 ans, c'est risqué",
      "Vérifier que l'emprunt ne dépasse pas 10 % du budget annuel",
      "Obtenir l'autorisation du préfet avant tout emprunt"
    ],
    correct: 1,
    feedback: "On appelle ça la 'capacité de désendettement'. Si une collectivité met de côté 10 M€ par an et a 80 M€ de dettes, il lui faudrait 8 ans pour tout rembourser. Au-delà de 12 ans, les finances sont considérées fragiles. Ce type de raisonnement est enseigné dans le Cycle supérieur de management (CSM) de l'INET — une formation diplômante qui donne accès à un Master 2 en Management Public Territorial.",
    penalty: null,
  },
  {
    stepIdx: 9,
    id: 'tram', name: "CTS — Place de l'Homme de Fer", lieu: "Place de l'Homme de Fer",
    color: '#4ecdc4', module: 'Numérique & IA — formations INET (IAESI / TRNUM)',
    situation: "Tu es en stage au service numérique de l'Eurométropole. La CTS (le réseau tram et bus de Strasbourg) veut lancer une appli qui analyse les trajets de 300 000 abonnés en temps réel pour proposer des tarifs personnalisés. Ton responsable te demande : 'Qu'est-ce qu'on doit faire avant de lancer ça par rapport à la protection des données ?'",
    question: "Que faut-il faire obligatoirement avant de collecter les données de déplacement de centaines de milliers de personnes ?",
    choices: [
      "Rien : les données de transports en commun ne sont pas des données personnelles",
      "Juste ajouter une phrase dans les conditions générales de l'appli",
      "Réaliser une étude d'impact sur la vie privée, et si les risques restent trop élevés, consulter la CNIL (la 'police des données') avant le lancement",
      "Obtenir l'accord des syndicats de la CTS"
    ],
    correct: 2,
    feedback: "Le RGPD — le règlement européen qui protège tes données — impose une 'étude d'impact' quand on collecte des données sensibles à grande échelle, comme les trajets quotidiens de milliers de personnes. Si les risques restent élevés, la CNIL doit être consultée avant le lancement. Ces enjeux numériques et éthiques font partie des formations INET sur l'IA et le numérique (stages IAESI et TRNUM) — des compétences très recherchées dans les collectivités.",
    penalty: { type: 'passer', label: 'Mauvaise réponse : passer votre prochain tour !' },
  },
  {
    stepIdx: 10,
    id: 'cathedrale', name: "Cathédrale Notre-Dame", lieu: "Place de la Cathédrale",
    color: '#00A499', module: 'Droit local — Cycle INET Stratégies publiques et management',
    situation: "Tu es en stage à la mairie de Strasbourg. Une association demande l'autorisation d'installer une crèche de Noël dans le hall de l'Hôtel de Ville. Ton responsable te dit : 'En Alsace, on a un droit local spécial hérité de l'histoire, différent du reste de la France — mais ça ne veut pas dire qu'on peut tout faire.'",
    question: "Comment la mairie doit-elle traiter cette demande ?",
    choices: [
      "Refuser : une mairie est un bâtiment public, aucun signe religieux n'est toléré nulle part en France",
      "Autoriser sans condition : en Alsace, le droit local autorise tout ce qui touche à la religion",
      "Analyser : si la crèche a un caractère culturel et festif, elle peut être autorisée ; si elle est purement religieuse, c'est plus délicat",
      "Renvoyer la décision au préfet, seul compétent sur les questions religieuses"
    ],
    correct: 2,
    feedback: "L'Alsace-Moselle a un statut juridique particulier depuis l'époque allemande : les règles sur la laïcité y sont différentes. Mais même ici, les tribunaux ont précisé qu'une crèche dans un bâtiment public pose moins de problème si elle a un caractère culturel ou festif. Ces nuances juridiques locales font partie des réalités que les cadres territoriaux doivent maîtriser — c'est au programme du Cycle INET Stratégies publiques et management.",
    penalty: null,
  },
  {
    stepIdx: 11,
    id: 'hopital', name: "Hôpitaux Universitaires de Strasbourg", lieu: "1 place de l'Hôpital",
    color: '#ED6971', module: "Santé & action locale — Stage INET 'La santé en collectivité' (1SFCT)",
    situation: "Tu es en stage à l'Eurométropole. Les urgences des HUS (les Hôpitaux Universitaires de Strasbourg) débordent. On te demande : 'La métropole peut-elle aider à organiser des médecins de ville qui travailleraient le soir et le week-end pour éviter que tout le monde aille aux urgences ?'",
    question: "Quel est le vrai rôle d'une métropole face à un problème de santé publique ?",
    choices: [
      "La métropole est responsable de la santé sur son territoire et peut imposer des solutions aux médecins libéraux",
      "La métropole n'a pas de compétence légale en santé, mais elle peut coordonner les acteurs et signer des accords avec l'Agence Régionale de Santé (ARS)",
      "La santé, c'est uniquement le rôle de la Région depuis 2015",
      "Seul l'État peut agir sur les urgences hospitalières, la métropole ne peut rien faire"
    ],
    correct: 1,
    feedback: "La santé n'est pas officiellement une compétence des métropoles — c'est l'État via les Agences Régionales de Santé (ARS) qui pilote. Mais les collectivités peuvent jouer un rôle de coordinateur en signant des 'Contrats Locaux de Santé'. C'est toute la subtilité des politiques publiques : agir concrètement sans en avoir le titre officiel. L'INET a une formation dédiée à la santé comme levier d'action locale (stage 1SFCT).",
    penalty: { type: 'reculer', cases: 2, label: 'Mauvaise réponse : reculer de 2 cases !' },
  },
  {
    stepIdx: 13,
    id: 'rh', name: "Direction des Ressources Humaines", lieu: "Hôtel de Ville, 2e étage",
    color: '#8D59A0', module: 'Management RH — Cycle supérieur des DRH INET',
    situation: "Tu es en stage à la DRH de l'Eurométropole (6 500 agents). Un chef de service est absent depuis 9 mois pour maladie. Son équipe de 40 personnes est épuisée et démotivée. Un syndicat signale que ce chef avait un comportement difficile avant son arrêt. Ton responsable RH te demande : 'Par où on commence ?'",
    question: "Quelle est la bonne priorité pour la DRH ?",
    choices: [
      "Attendre le retour du chef de service, puis déclencher une procédure disciplinaire",
      "Nommer immédiatement un remplaçant permanent sans enquête",
      "Mettre quelqu'un pour gérer l'équipe, lancer une enquête sur ce qui s'est passé, et préparer un retour accompagné du chef de service",
      "Répartir les 40 agents dans d'autres services pour effacer le problème"
    ],
    correct: 2,
    feedback: "Quand une équipe souffre à cause du management, la collectivité a une obligation légale d'agir — on appelle ça les 'risques psychosociaux' (RPS). Il faut assurer la continuité du service, comprendre les causes et ne pas précipiter le retour sans accompagnement. Le Cycle supérieur des DRH de l'INET prépare les directeurs RH des grandes collectivités à gérer exactement ce type de situation complexe.",
    penalty: null,
  },
  {
    stepIdx: 14,
    id: 'petite_france', name: "La Petite France", lieu: "Quai de la Bruche",
    color: '#00A499', module: "Habitat & territoire — Cycle supérieur de la transition INET",
    situation: "Tu te promènes dans la Petite France avec ton maître de stage. Il te montre des appartements transformés en Airbnb : 'Ce quartier classé UNESCO perd ses habitants. Les propriétaires louent aux touristes — c'est bien plus rentable. Mais les habitants permanents partent.' Il te demande : 'Tu crois qu'on peut faire quelque chose légalement ?'",
    question: "Quel outil permet à la ville de limiter la multiplication des locations touristiques type Airbnb ?",
    choices: [
      "Un arrêté municipal qui interdit purement et simplement tous les Airbnb dans le quartier",
      "Une loi (ELAN, 2018) qui oblige les propriétaires à créer un vrai logement ailleurs s'ils transforment le leur en meublé touristique",
      "Uniquement une taxe supplémentaire sur les résidences secondaires",
      "Un vote des habitants pour fixer un quota d'Airbnb autorisés dans le quartier"
    ],
    correct: 1,
    feedback: "La loi ELAN (2018) donne aux grandes villes un outil concret : si tu transforms un appartement en Airbnb, tu dois en créer un autre à usage résidentiel en compensation. Ça évite que les centres-villes se vident de leurs habitants. Ce type d'enjeu — entre logement, tourisme et transitions sociales — est au programme du Cycle supérieur de la transition de l'INET. Des décisions concrètes qui changent la vie d'un quartier.",
    penalty: { type: 'reculer', cases: 1, label: "Mauvaise réponse : reculer d'1 case !" },
  },
];