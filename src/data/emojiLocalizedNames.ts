import type { Locale } from '../i18n/types';

export type EmojiTranslationLocale = 'es' | 'fr' | 'de' | 'ja' | 'ko';

export type EmojiLocalizedNames = Record<EmojiTranslationLocale, string>;

/** Unicode CLDR 48.2.0 short names for the 1,117 Emoji in the learning dataset. */
export const EMOJI_LOCALIZED_NAMES: Record<string, EmojiLocalizedNames> = {
  "😀": {
    "es": "cara sonriendo",
    "fr": "visage rieur",
    "de": "grinsendes Gesicht",
    "ja": "にっこり笑う",
    "ko": "활짝 웃는 얼굴"
  },
  "😃": {
    "es": "cara sonriendo con ojos grandes",
    "fr": "visage souriant avec de grands yeux",
    "de": "grinsendes Gesicht mit großen Augen",
    "ja": "わーい",
    "ko": "눈을 크게 뜨고 웃는 얼굴"
  },
  "😄": {
    "es": "cara sonriendo con ojos sonrientes",
    "fr": "visage très souriant aux yeux rieurs",
    "de": "grinsendes Gesicht mit lachenden Augen",
    "ja": "笑顔",
    "ko": "미소 짓는 눈으로 활짝 웃는 얼굴"
  },
  "😁": {
    "es": "cara radiante con ojos sonrientes",
    "fr": "visage souriant aux yeux rieurs",
    "de": "strahlendes Gesicht mit lachenden Augen",
    "ja": "にやっと笑う",
    "ko": "미소 짓는 눈으로 웃는 얼굴"
  },
  "😆": {
    "es": "cara sonriendo con los ojos cerrados",
    "fr": "visage souriant avec yeux plissés",
    "de": "Grinsegesicht mit zugekniffenen Augen",
    "ja": "きゃー",
    "ko": "눈웃음짓는 얼굴"
  },
  "😅": {
    "es": "cara sonriendo con sudor frío",
    "fr": "visage souriant avec une goutte de sueur",
    "de": "grinsendes Gesicht mit Schweißtropfen",
    "ja": "冷や汗笑顔",
    "ko": "땀 흘리며 웃는 얼굴"
  },
  "🤣": {
    "es": "cara revolviéndose de la risa",
    "fr": "se rouler par terre de rire",
    "de": "sich vor Lachen auf dem Boden wälzen",
    "ja": "笑い転げる",
    "ko": "바닥을 구르며 웃는 얼굴"
  },
  "😂": {
    "es": "cara llorando de risa",
    "fr": "visage riant aux larmes",
    "de": "Gesicht mit Freudentränen",
    "ja": "嬉し泣き",
    "ko": "기쁨의 눈물을 흘리는 얼굴"
  },
  "🙂": {
    "es": "cara sonriendo ligeramente",
    "fr": "visage avec un léger sourire",
    "de": "leicht lächelndes Gesicht",
    "ja": "微笑む",
    "ko": "살짝 미소 짓는 얼굴"
  },
  "🙃": {
    "es": "cara al revés",
    "fr": "tête à l’envers",
    "de": "umgekehrtes Gesicht",
    "ja": "さかさまの顔",
    "ko": "거꾸로 된 얼굴"
  },
  "😉": {
    "es": "cara guiñando el ojo",
    "fr": "visage faisant un clin d’œil",
    "de": "zwinkerndes Gesicht",
    "ja": "ウインク",
    "ko": "윙크하는 얼굴"
  },
  "😊": {
    "es": "cara feliz con ojos sonrientes",
    "fr": "visage souriant avec yeux rieurs",
    "de": "lächelndes Gesicht mit lachenden Augen",
    "ja": "にこにこ",
    "ko": "미소 짓는 눈으로 살짝 웃는 얼굴"
  },
  "😇": {
    "es": "cara sonriendo con aureola",
    "fr": "visage souriant avec auréole",
    "de": "lächelndes Gesicht mit Heiligenschein",
    "ja": "天使の輪がついた笑顔",
    "ko": "후광이 비치는 웃는 얼굴"
  },
  "🥰": {
    "es": "cara sonriendo con corazones",
    "fr": "visage souriant avec cœurs",
    "de": "lächelndes Gesicht mit Herzen",
    "ja": "ハートの笑顔",
    "ko": "하트와 함께 웃는 얼굴"
  },
  "😍": {
    "es": "cara sonriendo con ojos de corazón",
    "fr": "visage souriant avec yeux en forme de cœur",
    "de": "lächelndes Gesicht mit herzförmigen Augen",
    "ja": "目がハートの笑顔",
    "ko": "하트 눈 얼굴"
  },
  "🤩": {
    "es": "cara sonriendo con estrellas",
    "fr": "visage avec des étoiles à la place des yeux",
    "de": "überwältigt",
    "ja": "目が星の笑顔",
    "ko": "반한 얼굴"
  },
  "😘": {
    "es": "cara lanzando un beso",
    "fr": "visage envoyant un bisou",
    "de": "Kuss zuwerfendes Gesicht",
    "ja": "投げキッス",
    "ko": "키스를 보내는 얼굴"
  },
  "😗": {
    "es": "cara besando",
    "fr": "visage faisant un bisou",
    "de": "küssendes Gesicht",
    "ja": "キス",
    "ko": "키스하는 얼굴"
  },
  "😙": {
    "es": "cara besando con ojos sonrientes",
    "fr": "visage aux yeux rieurs faisant un bisou",
    "de": "küssendes Gesicht mit lächelnden Augen",
    "ja": "にっこりキス",
    "ko": "미소 짓는 눈으로 키스하는 얼굴"
  },
  "😚": {
    "es": "cara besando con los ojos cerrados",
    "fr": "visage faisant un bisou avec les yeux fermés",
    "de": "küssendes Gesicht mit geschlossenen Augen",
    "ja": "ちゅっ",
    "ko": "눈을 감은 채로 키스하는 얼굴"
  },
  "😜": {
    "es": "cara sacando la lengua y guiñando un ojo",
    "fr": "visage qui tire la langue et fait un clin d’œil",
    "de": "zwinkerndes Gesicht mit herausgestreckter Zunge",
    "ja": "あっかんべー",
    "ko": "윙크하면서 혀를 내민 얼굴"
  },
  "😝": {
    "es": "cara con ojos cerrados y lengua fuera",
    "fr": "visage qui tire la langue les yeux plissés",
    "de": "Gesicht mit herausgestreckter Zunge und zusammengekniffenen Augen",
    "ja": "目を閉じてべー",
    "ko": "눈을 감고 메롱하는 얼굴"
  },
  "😛": {
    "es": "cara sacando la lengua",
    "fr": "visage qui tire la langue",
    "de": "Gesicht mit herausgestreckter Zunge",
    "ja": "舌を出した顔",
    "ko": "혀를 내민 얼굴"
  },
  "🤑": {
    "es": "cara con lengua de dinero",
    "fr": "argent dans les yeux et la bouche",
    "de": "Gesicht mit Dollarzeichen",
    "ja": "お金の顔",
    "ko": "돈 모양의 입이 있는 얼굴"
  },
  "🤗": {
    "es": "cara con manos abrazando",
    "fr": "visage qui fait un câlin",
    "de": "Gesicht mit umarmenden Händen",
    "ja": "ハグ",
    "ko": "포옹하고 있는 얼굴"
  },
  "🤭": {
    "es": "cara con mano sobre la boca",
    "fr": "visage avec une main sur la bouche",
    "de": "verlegen kicherndes Gesicht",
    "ja": "口に手を当てた顔",
    "ko": "손으로 입을 가린 얼굴"
  },
  "🫢": {
    "es": "cara con ojos abiertos y boca tapada",
    "fr": "visage avec yeux ouverts et main sur la bouche",
    "de": "Gesicht mit offenen Augen und Hand über dem Mund",
    "ja": "目を開けて口に手を当てた顔",
    "ko": "눈을 뜨고 손으로 입을 가린 얼굴"
  },
  "🫣": {
    "es": "cara tapada con ojo espiando",
    "fr": "visage qui regarde entre ses doigts",
    "de": "Gesicht mit durch die Finger linsendem Auge",
    "ja": "指の間からのぞき見る顔",
    "ko": "한쪽 눈을 가리고 훔쳐보는 얼굴"
  },
  "🤫": {
    "es": "cara pidiendo silencio",
    "fr": "visage avec un doigt sur la bouche",
    "de": "ermahnendes Gesicht",
    "ja": "しーっ",
    "ko": "쉿 하는 얼굴"
  },
  "🤔": {
    "es": "cara pensativa",
    "fr": "visage en pleine réflexion",
    "de": "nachdenkendes Gesicht",
    "ja": "考える顔",
    "ko": "생각하는 얼굴"
  },
  "🫡": {
    "es": "cara saludando",
    "fr": "visage qui fait un salut militaire",
    "de": "salutierendes Gesicht",
    "ja": "敬礼する顔",
    "ko": "경례하는 얼굴"
  },
  "🤐": {
    "es": "cara con la boca cerrada con cremallera",
    "fr": "visage avec bouche fermeture éclair",
    "de": "Gesicht mit Reißverschlussmund",
    "ja": "口チャック",
    "ko": "지퍼로 입을 잠근 얼굴"
  },
  "🤨": {
    "es": "cara con ceja alzada",
    "fr": "visage avec les sourcils relevés",
    "de": "Gesicht mit hochgezogenen Augenbrauen",
    "ja": "眉を上げた顔",
    "ko": "눈썹을 치켜올린 얼굴"
  },
  "😐": {
    "es": "cara neutral",
    "fr": "visage neutre",
    "de": "neutrales Gesicht",
    "ja": "ポーカーフェイス",
    "ko": "덤덤한 얼굴"
  },
  "😑": {
    "es": "cara sin expresión",
    "fr": "visage sans expression",
    "de": "ausdrucksloses Gesicht",
    "ja": "無表情",
    "ko": "무표정한 얼굴"
  },
  "😶": {
    "es": "cara sin boca",
    "fr": "visage sans bouche",
    "de": "Gesicht ohne Mund",
    "ja": "口のない顔",
    "ko": "입이 없는 얼굴"
  },
  "🫥": {
    "es": "cara con línea de puntos",
    "fr": "visage en pointillés",
    "de": "gestricheltes Gesicht",
    "ja": "点線の顔",
    "ko": "테두리가 점선으로 된 얼굴"
  },
  "😏": {
    "es": "cara sonriendo con superioridad",
    "fr": "visage avec un sourire malin",
    "de": "süffisant lächelndes Gesicht",
    "ja": "薄笑いをする顔",
    "ko": "히죽거리는 얼굴"
  },
  "😒": {
    "es": "cara de desaprobación",
    "fr": "visage blasé",
    "de": "verstimmtes Gesicht",
    "ja": "しらけた",
    "ko": "지루해하는 얼굴"
  },
  "🙄": {
    "es": "cara con ojos en blanco",
    "fr": "visage roulant des yeux",
    "de": "Augen verdrehendes Gesicht",
    "ja": "上を見る顔",
    "ko": "눈을 굴리고 있는 얼굴"
  },
  "😬": {
    "es": "cara haciendo una mueca",
    "fr": "visage grimaçant",
    "de": "Grimassen schneidendes Gesicht",
    "ja": "しかめ面",
    "ko": "찌푸린 얼굴"
  },
  "🤥": {
    "es": "cara de mentiroso",
    "fr": "visage de menteur",
    "de": "lügendes Gesicht",
    "ja": "うそつきの顔",
    "ko": "거짓말하는 얼굴"
  },
  "😌": {
    "es": "cara de alivio",
    "fr": "visage soulagé",
    "de": "erleichtertes Gesicht",
    "ja": "ほっとした顔",
    "ko": "안심한 얼굴"
  },
  "😔": {
    "es": "cara desanimada",
    "fr": "visage pensif",
    "de": "nachdenkliches Gesicht",
    "ja": "しょぼーん",
    "ko": "수심 어린 얼굴"
  },
  "😪": {
    "es": "cara de sueño",
    "fr": "visage endormi",
    "de": "schläfriges Gesicht",
    "ja": "眠い",
    "ko": "졸린 얼굴"
  },
  "🤤": {
    "es": "cara babeando",
    "fr": "visage qui bave",
    "de": "sabberndes Gesicht",
    "ja": "よだれを垂らした顔",
    "ko": "침 흘리는 얼굴"
  },
  "😋": {
    "es": "cara saboreando comida",
    "fr": "miam",
    "de": "sich die Lippen leckendes Gesicht",
    "ja": "にこにこぺろり",
    "ko": "맛있는 음식을 음미하는 얼굴"
  },
  "😶‍🌫️": {
    "es": "cara entre las nubes",
    "fr": "visage dans les nuages",
    "de": "Gesicht in Wolken",
    "ja": "雲の中の顔",
    "ko": "공상에 잠긴 얼굴"
  },
  "😷": {
    "es": "cara con mascarilla médica",
    "fr": "visage avec masque",
    "de": "Gesicht mit Atemschutzmaske",
    "ja": "マスク顔",
    "ko": "마스크 낀 얼굴"
  },
  "🤒": {
    "es": "cara con termómetro",
    "fr": "visage avec thermomètre",
    "de": "Gesicht mit Fieberthermometer",
    "ja": "熱がある顔",
    "ko": "체온계를 물고 있는 얼굴"
  },
  "🤕": {
    "es": "cara con la cabeza vendada",
    "fr": "visage avec bandage autour de la tête",
    "de": "Gesicht mit Kopfverband",
    "ja": "包帯を巻いた顔",
    "ko": "머리에 붕대를 감은 얼굴"
  },
  "🤢": {
    "es": "cara de náuseas",
    "fr": "visage nauséeux",
    "de": "würgendes Gesicht",
    "ja": "吐き気を催している顔",
    "ko": "구역질을 하는 얼굴"
  },
  "🤮": {
    "es": "cara vomitando",
    "fr": "visage qui vomit",
    "de": "kotzendes Gesicht",
    "ja": "嘔吐する顔",
    "ko": "토하는 얼굴"
  },
  "🤧": {
    "es": "cara estornudando",
    "fr": "visage qui éternue",
    "de": "niesendes Gesicht",
    "ja": "くしゃみする顔",
    "ko": "재채기하는 얼굴"
  },
  "🥵": {
    "es": "cara con calor",
    "fr": "visage rouge et chaud",
    "de": "schwitzendes Gesicht",
    "ja": "暑い顔",
    "ko": "더운 얼굴"
  },
  "🥶": {
    "es": "cara con frío",
    "fr": "visage bleu et froid",
    "de": "frierendes Gesicht",
    "ja": "寒い顔",
    "ko": "추워하는 얼굴"
  },
  "🥴": {
    "es": "cara de grogui",
    "fr": "visage éméché",
    "de": "schwindeliges Gesicht",
    "ja": "ふらふらの顔",
    "ko": "헤롱헤롱 얼굴"
  },
  "😵": {
    "es": "cara mareada",
    "fr": "visage étourdi",
    "de": "benommenes Gesicht",
    "ja": "めまい",
    "ko": "어지러운 얼굴"
  },
  "😵‍💫": {
    "es": "cara con ojos en espiral",
    "fr": "visage aux yeux en spirales",
    "de": "Gesicht mit Spiralen als Augen",
    "ja": "目を回した顔",
    "ko": "현기증 난 얼굴"
  },
  "🤯": {
    "es": "cabeza explotando",
    "fr": "tête qui explose",
    "de": "explodierender Kopf",
    "ja": "頭爆発",
    "ko": "폭발하는 얼굴"
  },
  "🤠": {
    "es": "cara con sombrero de vaquero",
    "fr": "visage avec chapeau de cowboy",
    "de": "Gesicht mit Cowboyhut",
    "ja": "カウボーイの顔",
    "ko": "카우보이 모자 쓴 얼굴"
  },
  "🥳": {
    "es": "cara de fiesta",
    "fr": "visage festif",
    "de": "Partygesicht",
    "ja": "パーティーの顔",
    "ko": "파티하는 얼굴"
  },
  "🥸": {
    "es": "cara disfrazada",
    "fr": "visage déguisé",
    "de": "verkleidet",
    "ja": "変装した顔",
    "ko": "변장한 얼굴"
  },
  "😎": {
    "es": "cara sonriendo con gafas de sol",
    "fr": "visage avec lunettes de soleil",
    "de": "lächelndes Gesicht mit Sonnenbrille",
    "ja": "サングラスで笑顔",
    "ko": "선글라스 낀 얼굴"
  },
  "🤓": {
    "es": "cara de empollón",
    "fr": "visage de geek",
    "de": "Strebergesicht",
    "ja": "オタク",
    "ko": "모범생 얼굴"
  },
  "🧐": {
    "es": "cara con monóculo",
    "fr": "visage avec un monocle",
    "de": "Gesicht mit Monokel",
    "ja": "モノクルを付けた顔",
    "ko": "단안경을 쓴 얼굴"
  },
  "😕": {
    "es": "cara de confusión",
    "fr": "visage confus",
    "de": "verwundertes Gesicht",
    "ja": "混乱",
    "ko": "혼란스러워하는 얼굴"
  },
  "🫤": {
    "es": "cara con boca diagonal",
    "fr": "visage avec bouche en diagonale",
    "de": "Gesicht mit schrägem Mund",
    "ja": "口が斜めの顔",
    "ko": "입이 한쪽으로 올라간 얼굴"
  },
  "😟": {
    "es": "cara preocupada",
    "fr": "visage inquiet",
    "de": "besorgtes Gesicht",
    "ja": "悩む顔",
    "ko": "걱정스러운 얼굴"
  },
  "🙁": {
    "es": "cara con el ceño ligeramente fruncido",
    "fr": "visage légèrement mécontent",
    "de": "betrübtes Gesicht",
    "ja": "少し困った顔",
    "ko": "살짝 찡그린 얼굴"
  },
  "😮": {
    "es": "cara con la boca abierta",
    "fr": "visage avec bouche ouverte",
    "de": "Gesicht mit offenem Mund",
    "ja": "口が開いた顔",
    "ko": "입벌린 얼굴"
  },
  "😯": {
    "es": "cara estupefacta",
    "fr": "visage ébahi",
    "de": "verdutztes Gesicht",
    "ja": "ぽかーん",
    "ko": "숨죽인 얼굴"
  },
  "😲": {
    "es": "cara asombrada",
    "fr": "visage stupéfait",
    "de": "erstauntes Gesicht",
    "ja": "びっくり",
    "ko": "깜짝 놀란 얼굴"
  },
  "😳": {
    "es": "cara sonrojada",
    "fr": "visage qui rougit",
    "de": "errötetes Gesicht mit großen Augen",
    "ja": "赤面",
    "ko": "상기된 얼굴"
  },
  "🥺": {
    "es": "cara suplicante",
    "fr": "visage implorant",
    "de": "bettelndes Gesicht",
    "ja": "訴えるような顔",
    "ko": "애원하는 얼굴"
  },
  "😦": {
    "es": "cara con el ceño fruncido y la boca abierta",
    "fr": "visage mécontent avec bouche ouverte",
    "de": "entsetztes Gesicht",
    "ja": "あきれ顔",
    "ko": "입 벌리고 찌푸린 얼굴"
  },
  "😧": {
    "es": "cara angustiada",
    "fr": "visage angoissé",
    "de": "qualvolles Gesicht",
    "ja": "苦悩",
    "ko": "괴로워하는 얼굴"
  },
  "😨": {
    "es": "cara asustada",
    "fr": "visage effrayé",
    "de": "ängstliches Gesicht",
    "ja": "青ざめ",
    "ko": "두려워하는 얼굴"
  },
  "😰": {
    "es": "cara con ansiedad y sudor",
    "fr": "visage anxieux avec goutte de sueur",
    "de": "besorgtes Gesicht mit Schweißtropfen",
    "ja": "冷や汗青ざめ",
    "ko": "땀 흘리며 불안해하는 얼굴"
  },
  "😥": {
    "es": "cara triste pero aliviada",
    "fr": "visage triste mais soulagé",
    "de": "trauriges aber erleichtertes Gesicht",
    "ja": "どうしよう",
    "ko": "실망했지만 안도하는 얼굴"
  },
  "😢": {
    "es": "cara llorando",
    "fr": "visage qui pleure",
    "de": "weinendes Gesicht",
    "ja": "泣き顔",
    "ko": "우는 얼굴"
  },
  "😭": {
    "es": "cara llorando fuerte",
    "fr": "visage qui pleure à chaudes larmes",
    "de": "heulendes Gesicht",
    "ja": "大泣き",
    "ko": "엉엉 우는 얼굴"
  },
  "😱": {
    "es": "cara gritando de miedo",
    "fr": "visage qui hurle de peur",
    "de": "vor Angst schreiendes Gesicht",
    "ja": "恐怖",
    "ko": "공포에 절규하는 얼굴"
  },
  "😖": {
    "es": "cara de frustración",
    "fr": "visage déconcerté",
    "de": "verwirrtes Gesicht",
    "ja": "困惑した顔",
    "ko": "당혹한 얼굴"
  },
  "😣": {
    "es": "cara desesperada",
    "fr": "visage persévérant",
    "de": "entschlossenes Gesicht",
    "ja": "我慢",
    "ko": "참아내는 얼굴"
  },
  "😞": {
    "es": "cara decepcionada",
    "fr": "visage déçu",
    "de": "enttäuschtes Gesicht",
    "ja": "失望した顔",
    "ko": "실망한 얼굴"
  },
  "😓": {
    "es": "cara con sudor frío",
    "fr": "visage démoralisé avec goutte de sueur",
    "de": "bedrücktes Gesicht mit Schweiß",
    "ja": "冷や汗",
    "ko": "식은땀 흘리는 얼굴"
  },
  "😩": {
    "es": "cara agotada",
    "fr": "visage épuisé",
    "de": "erschöpftes Gesicht",
    "ja": "あきらめ",
    "ko": "지친 얼굴"
  },
  "😫": {
    "es": "cara cansada",
    "fr": "visage fatigué",
    "de": "müdes Gesicht",
    "ja": "疲れた",
    "ko": "피곤한 얼굴"
  },
  "🥱": {
    "es": "cara de bostezo",
    "fr": "visage bâillant",
    "de": "gähnendes Gesicht",
    "ja": "あくびした顔",
    "ko": "하품하는 얼굴"
  },
  "☹️": {
    "es": "cara con el ceño fruncido",
    "fr": "visage mécontent",
    "de": "düsteres Gesicht",
    "ja": "困った顔",
    "ko": "찡그린 얼굴"
  },
  "😮‍💨": {
    "es": "cara exhalando",
    "fr": "visage expirant",
    "de": "Gesicht, das ausatmet",
    "ja": "息を吐く顔",
    "ko": "날숨 쉬는 얼굴"
  },
  "😤": {
    "es": "cara resoplando",
    "fr": "visage avec fumée sortant des narines",
    "de": "schnaubendes Gesicht",
    "ja": "勝ち誇った顔",
    "ko": "화내며 씩씩거리는 얼굴"
  },
  "😠": {
    "es": "cara enfadada",
    "fr": "visage en colère",
    "de": "verärgertes Gesicht",
    "ja": "ぷんぷん",
    "ko": "화난 얼굴"
  },
  "😡": {
    "es": "cara cabreada",
    "fr": "visage boudeur",
    "de": "schmollendes Gesicht",
    "ja": "ふくれっ面",
    "ko": "뾰로통한 얼굴"
  },
  "🤬": {
    "es": "cara con símbolos en la boca",
    "fr": "visage avec des symboles dans la bouche",
    "de": "Gesicht mit Symbolen über dem Mund",
    "ja": "ののしる",
    "ko": "욕하는 얼굴"
  },
  "😈": {
    "es": "cara sonriendo con cuernos",
    "fr": "visage souriant avec des cornes",
    "de": "grinsendes Gesicht mit Hörnern",
    "ja": "笑った悪魔",
    "ko": "머리에 뿔이 달린 웃는 얼굴"
  },
  "👿": {
    "es": "cara enfadada con cuernos",
    "fr": "visage en colère avec des cornes",
    "de": "wütendes Gesicht mit Hörnern",
    "ja": "怒った悪魔",
    "ko": "머리에 뿔이 달린 화난 얼굴"
  },
  "💀": {
    "es": "calavera",
    "fr": "crâne",
    "de": "Totenkopf",
    "ja": "ドクロ",
    "ko": "해골"
  },
  "💩": {
    "es": "caca con ojos",
    "fr": "tas de crotte",
    "de": "Kothaufen",
    "ja": "うんち",
    "ko": "똥"
  },
  "🤡": {
    "es": "cara de payaso",
    "fr": "visage de clown",
    "de": "Clown-Gesicht",
    "ja": "ピエロの顔",
    "ko": "어릿광대 얼굴"
  },
  "👹": {
    "es": "demonio japonés oni",
    "fr": "ogre",
    "de": "Ungeheuer",
    "ja": "鬼",
    "ko": "도깨비 가면"
  },
  "👺": {
    "es": "demonio japonés tengu",
    "fr": "monstre japonais",
    "de": "Kobold",
    "ja": "天狗",
    "ko": "코주부 도깨비 가면"
  },
  "👻": {
    "es": "fantasma",
    "fr": "fantôme",
    "de": "Gespenst",
    "ja": "お化け",
    "ko": "유령"
  },
  "👽": {
    "es": "alienígena",
    "fr": "alien",
    "de": "Außerirdischer",
    "ja": "エイリアン",
    "ko": "외계인"
  },
  "👾": {
    "es": "monstruo alienígena",
    "fr": "monstre de l’espace",
    "de": "Computerspiel-Monster",
    "ja": "インベーダー",
    "ko": "에일리언"
  },
  "🤖": {
    "es": "robot",
    "fr": "robot",
    "de": "Roboter",
    "ja": "ロボット",
    "ko": "로봇 얼굴"
  },
  "😺": {
    "es": "gato sonriendo",
    "fr": "chat qui sourit",
    "de": "grinsende Katze",
    "ja": "にっこり笑う猫",
    "ko": "활짝 웃는 고양이 얼굴"
  },
  "😸": {
    "es": "gato sonriendo con ojos sonrientes",
    "fr": "chat qui sourit avec des yeux rieurs",
    "de": "grinsende Katze mit lachenden Augen",
    "ja": "にやっと笑う猫",
    "ko": "미소 짓는 눈으로 활짝 웃는 고양이 얼굴"
  },
  "😹": {
    "es": "gato llorando de risa",
    "fr": "chat qui pleure de joie",
    "de": "Katze mit Freudentränen",
    "ja": "嬉し泣きする猫",
    "ko": "기쁨의 눈물을 흘리는 고양이 얼굴"
  },
  "😻": {
    "es": "gato sonriendo con ojos de corazón",
    "fr": "chat souriant aux yeux en cœurs",
    "de": "lachende Katze mit Herzen als Augen",
    "ja": "目がハートの猫",
    "ko": "하트 눈 고양이 얼굴"
  },
  "😼": {
    "es": "gato haciendo una mueca",
    "fr": "chat avec sourire en coin",
    "de": "verwegen lächelnde Katze",
    "ja": "にやりとする猫",
    "ko": "썩소 짓는 고양이"
  },
  "😽": {
    "es": "gato besando",
    "fr": "chat qui fait un bisou",
    "de": "küssende Katze",
    "ja": "猫のキス",
    "ko": "키스하는 고양이 얼굴"
  },
  "🙀": {
    "es": "gato asustado",
    "fr": "chat fatigué",
    "de": "erschöpfte Katze",
    "ja": "絶望する猫",
    "ko": "절규하는 고양이 얼굴"
  },
  "😿": {
    "es": "gato llorando",
    "fr": "chat qui pleure",
    "de": "weinende Katze",
    "ja": "泣いている猫",
    "ko": "울고 있는 고양이 얼굴"
  },
  "😾": {
    "es": "gato enfadado",
    "fr": "chat qui boude",
    "de": "schmollende Katze",
    "ja": "不機嫌な猫",
    "ko": "뾰로통한 고양이 얼굴"
  },
  "🫠": {
    "es": "cara derritiéndose",
    "fr": "visage qui fond",
    "de": "schmelzendes Gesicht",
    "ja": "溶けている顔",
    "ko": "녹아 내리는 얼굴"
  },
  "🥲": {
    "es": "cara sonriente con lágrima",
    "fr": "visage souriant avec une larme",
    "de": "lachendes Gesicht mit Träne",
    "ja": "嬉し涙の顔",
    "ko": "눈물 흘리며 웃는 얼굴"
  },
  "🤪": {
    "es": "cara de loco",
    "fr": "tête de fou",
    "de": "irres Gesicht",
    "ja": "ふざけた顔",
    "ko": "괴짜 얼굴"
  },
  "🫨": {
    "es": "cara temblorosa",
    "fr": "visage secoué",
    "de": "zitterndes Doppelgesicht",
    "ja": "震えている顔",
    "ko": "요동치는 얼굴"
  },
  "🙂‍↔️": {
    "es": "cabeza negando",
    "fr": "tête secouée horizontalement",
    "de": "Kopfschütteln",
    "ja": "首を横に振る",
    "ko": "도리도리"
  },
  "🙂‍↕️": {
    "es": "cabeza asintiendo",
    "fr": "tête secouée verticalement",
    "de": "Kopfnicken",
    "ja": "首を縦に振る",
    "ko": "끄덕끄덕"
  },
  "😴": {
    "es": "cara durmiendo",
    "fr": "visage somnolent",
    "de": "schlafendes Gesicht",
    "ja": "寝る",
    "ko": "졸고 있는 얼굴"
  },
  "🫩": {
    "es": "cara con ojeras",
    "fr": "visage avec des valises sous les yeux",
    "de": "Gesicht mit Augenringen",
    "ja": "目にクマがある顔",
    "ko": "다크서클이 있는 얼굴"
  },
  "🥹": {
    "es": "cara aguantándose las lágrimas",
    "fr": "visage retenant ses larmes",
    "de": "Gesicht, das Tränen zurückhält",
    "ja": "涙をこらえた顔",
    "ko": "눈물을 참는 얼굴"
  },
  "☠": {
    "es": "calavera y huesos cruzados",
    "fr": "tête de mort",
    "de": "Totenkopf mit gekreuzten Knochen",
    "ja": "ドクロと骨",
    "ko": "해골과 뼈다귀"
  },
  "🙈": {
    "es": "mono con los ojos tapados",
    "fr": "singe ne rien voir",
    "de": "sich die Augen zuhaltendes Affengesicht",
    "ja": "見ざる",
    "ko": "눈을 가리고 있는 원숭이"
  },
  "🙉": {
    "es": "mono con los oídos tapados",
    "fr": "singe ne rien entendre",
    "de": "sich die Ohren zuhaltendes Affengesicht",
    "ja": "聞かざる",
    "ko": "귀를 막고 있는 원숭이"
  },
  "🙊": {
    "es": "mono con la boca tapada",
    "fr": "singe ne rien dire",
    "de": "sich den Mund zuhaltendes Affengesicht",
    "ja": "言わざる",
    "ko": "입을 막고 있는 원숭이"
  },
  "👋": {
    "es": "mano saludando",
    "fr": "signe de la main",
    "de": "winkende Hand",
    "ja": "手を振る",
    "ko": "흔드는 손"
  },
  "🤚": {
    "es": "dorso de la mano",
    "fr": "dos de main levée",
    "de": "erhobene Hand von hinten",
    "ja": "手の甲",
    "ko": "손등"
  },
  "🖐": {
    "es": "mano abierta",
    "fr": "main levée doigts écartés",
    "de": "Hand mit gespreizten Fingern",
    "ja": "開いた手",
    "ko": "쫙 편 손바닥"
  },
  "✋": {
    "es": "mano levantada",
    "fr": "main levée",
    "de": "erhobene Hand",
    "ja": "挙手",
    "ko": "손바닥"
  },
  "🖖": {
    "es": "saludo vulcano",
    "fr": "salut vulcain",
    "de": "vulkanischer Gruß",
    "ja": "バルカンの挨拶",
    "ko": "벌칸식 인사"
  },
  "🫱": {
    "es": "mano hacia la derecha",
    "fr": "main vers la droite",
    "de": "nach rechts weisende Hand",
    "ja": "右に向けた手",
    "ko": "오른쪽으로 향하는 손등"
  },
  "🫲": {
    "es": "mano hacia la izquierda",
    "fr": "main vers la gauche",
    "de": "nach links weisende Hand",
    "ja": "左に向けた手",
    "ko": "왼쪽으로 향하는 손바닥"
  },
  "🫳": {
    "es": "mano con la palma hacia abajo",
    "fr": "main paume vers le bas",
    "de": "Hand mit Handfläche nach unten",
    "ja": "下に向けた手",
    "ko": "손바닥을 아래로 향한 손"
  },
  "🫴": {
    "es": "mano con la palma hacia arriba",
    "fr": "main paume vers le haut",
    "de": "Hand mit Handfläche nach oben",
    "ja": "上に向けた手",
    "ko": "손바닥을 위로 향한 손"
  },
  "🫷": {
    "es": "mano empujando hacia la izquierda",
    "fr": "main qui pousse vers la gauche",
    "de": "nach links schiebende Hand",
    "ja": "左向きに押している手",
    "ko": "왼쪽으로 밀치는 손"
  },
  "🫸": {
    "es": "mano empujando hacia la derecha",
    "fr": "main qui pousse vers la droite",
    "de": "nach rechts schiebende Hand",
    "ja": "右向きに押している手",
    "ko": "오른쪽으로 밀치는 손"
  },
  "👌": {
    "es": "señal de aprobación con la mano",
    "fr": "ok",
    "de": "OK-Zeichen",
    "ja": "OKの手",
    "ko": "오케이를 표시한 손"
  },
  "🤌": {
    "es": "dedos juntos apuntando hacia arriba",
    "fr": "bout des doigts joints",
    "de": "zusammengedrückte Finger",
    "ja": "上向きにすぼめた手",
    "ko": "꼬집는 손가락"
  },
  "🤏": {
    "es": "mano pellizcando",
    "fr": "pouce et index rapprochés",
    "de": "Wenig-Geste",
    "ja": "つまんでいる指",
    "ko": "꼬집는 손"
  },
  "✌": {
    "es": "mano con señal de victoria",
    "fr": "V de la victoire",
    "de": "Victory-Geste",
    "ja": "Vサイン",
    "ko": "브이 표시"
  },
  "🤞": {
    "es": "dedos cruzados",
    "fr": "doigts croisés",
    "de": "Hand mit gekreuzten Fingern",
    "ja": "指をクロス",
    "ko": "검지와 중지 크로스"
  },
  "🫰": {
    "es": "mano con dedo índice y pulgar cruzados",
    "fr": "main avec index et pouce croisés",
    "de": "Hand mit gekreuztem Zeigefinger und Daumen",
    "ja": "親指と人差し指をクロス",
    "ko": "엄지와 중지를 교차한 손"
  },
  "🤟": {
    "es": "gesto de te quiero",
    "fr": "signe je t’aime",
    "de": "Ich-liebe-dich-Geste",
    "ja": "アイラブユー",
    "ko": "사랑을 표시하는 손"
  },
  "🤘": {
    "es": "mano haciendo el signo de cuernos",
    "fr": "cornes avec les doigts",
    "de": "Teufelsgruß",
    "ja": "角の指サイン",
    "ko": "뿔 모양 손짓"
  },
  "🤙": {
    "es": "mano haciendo el gesto de llamar",
    "fr": "signe appel téléphonique avec les doigts",
    "de": "Ruf-mich-an-Handzeichen",
    "ja": "電話の合図",
    "ko": "전화를 걸라는 손 모양"
  },
  "👈": {
    "es": "dorso de mano con índice a la izquierda",
    "fr": "main avec index pointant à gauche",
    "de": "nach links weisender Zeigefinger",
    "ja": "左指差し",
    "ko": "왼쪽을 가리키는 손등"
  },
  "👉": {
    "es": "dorso de mano con índice a la derecha",
    "fr": "main avec index pointant à droite",
    "de": "nach rechts weisender Zeigefinger",
    "ja": "右指差し",
    "ko": "오른쪽을 가리키는 손등"
  },
  "👆": {
    "es": "dorso de mano con índice hacia arriba",
    "fr": "main avec index pointant vers le haut",
    "de": "nach oben weisender Zeigefinger von hinten",
    "ja": "手の甲上指差し",
    "ko": "위쪽을 가리키는 손등"
  },
  "🖕": {
    "es": "dedo corazón hacia arriba",
    "fr": "doigt d’honneur",
    "de": "Mittelfinger",
    "ja": "立てた中指",
    "ko": "중지"
  },
  "👇": {
    "es": "dorso de mano con índice hacia abajo",
    "fr": "main avec index pointant vers le bas",
    "de": "nach unten weisender Zeigefinger",
    "ja": "下指差し",
    "ko": "아래쪽을 가리키는 손등"
  },
  "☝": {
    "es": "dedo índice hacia arriba",
    "fr": "index pointant vers le haut",
    "de": "nach oben weisender Zeigefinger von vorne",
    "ja": "上指差し",
    "ko": "위쪽을 가리키는 손"
  },
  "🫵": {
    "es": "dedo índice apuntándote a ti",
    "fr": "index pointant vers l’utilisateur",
    "de": "auf Betrachter zeigender Zeigefinger",
    "ja": "人を指差している手",
    "ko": "보는 사람을 가리키는 검지"
  },
  "👍": {
    "es": "pulgar hacia arriba",
    "fr": "pouce vers le haut",
    "de": "Daumen hoch",
    "ja": "サムズアップ",
    "ko": "올린 엄지"
  },
  "👎": {
    "es": "pulgar hacia abajo",
    "fr": "pouce vers le bas",
    "de": "Daumen runter",
    "ja": "サムズダウン",
    "ko": "내린 엄지"
  },
  "✊": {
    "es": "puño en alto",
    "fr": "poing levé",
    "de": "erhobene Faust",
    "ja": "げんこつ",
    "ko": "주먹"
  },
  "👊": {
    "es": "puño cerrado",
    "fr": "poing de face",
    "de": "geballte Faust",
    "ja": "グー",
    "ko": "주먹 전면"
  },
  "🤛": {
    "es": "puño hacia la izquierda",
    "fr": "poing à gauche",
    "de": "Faust nach links",
    "ja": "左向きのこぶし",
    "ko": "왼쪽을 향하는 주먹"
  },
  "🤜": {
    "es": "puño hacia la derecha",
    "fr": "poing à droite",
    "de": "Faust nach rechts",
    "ja": "右向きのこぶし",
    "ko": "오른쪽을 향하는 주먹"
  },
  "👏": {
    "es": "manos aplaudiendo",
    "fr": "applaudissements",
    "de": "klatschende Hände",
    "ja": "拍手",
    "ko": "손뼉"
  },
  "🙌": {
    "es": "manos levantadas celebrando",
    "fr": "mains levées",
    "de": "zwei erhobene Handflächen",
    "ja": "バンザイ",
    "ko": "만세"
  },
  "🫶": {
    "es": "manos formando un corazón",
    "fr": "mains qui forment un cœur",
    "de": "Hände, die Herz bilden",
    "ja": "ハート形の手",
    "ko": "손 하트"
  },
  "👐": {
    "es": "manos abiertas",
    "fr": "mains ouvertes",
    "de": "offene Hände",
    "ja": "両手のひら",
    "ko": "양손을 모아서 벌린 모양"
  },
  "🤲": {
    "es": "palmas hacia arriba juntas",
    "fr": "paume contre paume doigts vers le haut",
    "de": "Handflächen nach oben",
    "ja": "手のひらを揃えた両手",
    "ko": "내민 두 손"
  },
  "🤝": {
    "es": "apretón de manos",
    "fr": "poignée de main",
    "de": "Handschlag",
    "ja": "握手",
    "ko": "악수"
  },
  "🙏": {
    "es": "manos en oración",
    "fr": "mains en prière",
    "de": "zusammengelegte Handflächen",
    "ja": "祈り",
    "ko": "기도"
  },
  "✍": {
    "es": "mano escribiendo",
    "fr": "main qui écrit",
    "de": "schreibende Hand",
    "ja": "書いている手",
    "ko": "글을 쓰고 있는 손"
  },
  "💅": {
    "es": "pintarse las uñas",
    "fr": "vernis à ongles",
    "de": "Nagellack",
    "ja": "マニキュアを塗る手",
    "ko": "매니큐어"
  },
  "💪": {
    "es": "bíceps flexionado",
    "fr": "biceps contracté",
    "de": "angespannter Bizeps",
    "ja": "力こぶ",
    "ko": "알통"
  },
  "🦵": {
    "es": "pierna",
    "fr": "jambe",
    "de": "Bein",
    "ja": "脚",
    "ko": "한쪽 다리"
  },
  "🦶": {
    "es": "pie",
    "fr": "pied",
    "de": "Fuß",
    "ja": "足",
    "ko": "한쪽 발"
  },
  "👂": {
    "es": "oreja",
    "fr": "oreille",
    "de": "Ohr",
    "ja": "耳",
    "ko": "귀"
  },
  "🦻": {
    "es": "oreja con audífono",
    "fr": "oreille appareillée",
    "de": "Ohr mit Hörgerät",
    "ja": "補聴器を付けた耳",
    "ko": "보청기를 낀 귀"
  },
  "👃": {
    "es": "nariz",
    "fr": "nez",
    "de": "Nase",
    "ja": "鼻",
    "ko": "코"
  },
  "🧠": {
    "es": "cerebro",
    "fr": "cerveau",
    "de": "Gehirn",
    "ja": "脳",
    "ko": "뇌"
  },
  "🫀": {
    "es": "corazón humano",
    "fr": "cœur",
    "de": "Herz (Organ)",
    "ja": "心臓",
    "ko": "심장"
  },
  "🫁": {
    "es": "pulmones",
    "fr": "poumons",
    "de": "Lunge",
    "ja": "肺",
    "ko": "폐"
  },
  "🦷": {
    "es": "diente",
    "fr": "dent",
    "de": "Zahn",
    "ja": "歯",
    "ko": "이빨"
  },
  "🦴": {
    "es": "hueso",
    "fr": "os",
    "de": "Knochen",
    "ja": "骨",
    "ko": "뼈다귀"
  },
  "👀": {
    "es": "ojos",
    "fr": "yeux",
    "de": "Augen",
    "ja": "目",
    "ko": "왕눈이 눈알"
  },
  "👁": {
    "es": "ojo",
    "fr": "œil",
    "de": "Auge",
    "ja": "片目",
    "ko": "눈"
  },
  "👅": {
    "es": "lengua",
    "fr": "langue",
    "de": "Zunge",
    "ja": "舌",
    "ko": "혀"
  },
  "👄": {
    "es": "boca",
    "fr": "bouche",
    "de": "Mund",
    "ja": "口",
    "ko": "입"
  },
  "🫦": {
    "es": "labio mordido",
    "fr": "lèvres qui se mordent",
    "de": "auf Lippe beißen",
    "ja": "唇を咬んでいる口",
    "ko": "입술을 깨물고 있는 입"
  },
  "👱‍♀️": {
    "es": "mujer rubia",
    "fr": "femme blonde",
    "de": "Frau: blond",
    "ja": "金髪の女性",
    "ko": "금발 여자"
  },
  "🙍‍♀️": {
    "es": "mujer frunciendo el ceño",
    "fr": "femme fronçant les sourcils",
    "de": "missmutige Frau",
    "ja": "しかめ面の女",
    "ko": "찌푸린 여자"
  },
  "🙎‍♀️": {
    "es": "mujer haciendo pucheros",
    "fr": "femme qui boude",
    "de": "schmollende Frau",
    "ja": "不機嫌な女",
    "ko": "뾰로통한 여자"
  },
  "🙅‍♀️": {
    "es": "mujer haciendo el gesto de \"no\"",
    "fr": "femme faisant un geste d’interdiction",
    "de": "Frau mit überkreuzten Armen",
    "ja": "ダメのポーズをする女",
    "ko": "안 된다는 제스처를 하는 여자"
  },
  "🙆‍♀️": {
    "es": "mujer haciendo el gesto de \"de acuerdo\"",
    "fr": "femme faisant un geste d’acceptation",
    "de": "Frau mit Händen auf dem Kopf",
    "ja": "OKのポーズをする女",
    "ko": "오케이라는 제스처를 하는 여자"
  },
  "💁‍♀️": {
    "es": "empleada de mostrador de información",
    "fr": "femme paume vers le haut",
    "de": "Infoschalter-Mitarbeiterin",
    "ja": "案内する女",
    "ko": "손바닥 꺾은 여자"
  },
  "🙋‍♀️": {
    "es": "mujer con la mano levantada",
    "fr": "femme qui lève la main",
    "de": "Frau mit erhobenem Arm",
    "ja": "手を挙げる女",
    "ko": "한 손 든 여자"
  },
  "🧏‍♀️": {
    "es": "mujer sorda",
    "fr": "femme sourde",
    "de": "gehörlose Frau",
    "ja": "耳の不自由な女性",
    "ko": "청각장애가 있는 여자"
  },
  "🙇‍♀️": {
    "es": "mujer haciendo una reverencia",
    "fr": "femme qui s’incline",
    "de": "sich verbeugende Frau",
    "ja": "おじぎする女",
    "ko": "절하는 여자"
  },
  "🤦‍♀️": {
    "es": "mujer con la mano en la frente",
    "fr": "femme avec la paume sur le visage",
    "de": "sich an den Kopf fassende Frau",
    "ja": "ひたいに手をあてる女",
    "ko": "골치 아파하는 여자"
  },
  "🤷‍♀️": {
    "es": "mujer encogida de hombros",
    "fr": "femme qui hausse les épaules",
    "de": "schulterzuckende Frau",
    "ja": "お手上げする女",
    "ko": "어깨를 으쓱하는 여자"
  },
  "👳‍♀️": {
    "es": "mujer con turbante",
    "fr": "femme en turban",
    "de": "Frau mit Turban",
    "ja": "ターバンの女性",
    "ko": "터번을 쓰고 있는 여자"
  },
  "🤵‍♀️": {
    "es": "mujer con esmoquin",
    "fr": "femme en smoking",
    "de": "Frau im Smoking",
    "ja": "タキシードの女性",
    "ko": "턱시도를 입은 여자"
  },
  "👰‍♀️": {
    "es": "mujer con velo",
    "fr": "femme avec voile",
    "de": "Frau mit Schleier",
    "ja": "ベールの女性",
    "ko": "면사포를 쓴 여자"
  },
  "🧜": {
    "es": "persona sirena",
    "fr": "créature aquatique",
    "de": "Wassermensch",
    "ja": "人魚",
    "ko": "인어"
  },
  "🧜‍♂️": {
    "es": "sirena hombre",
    "fr": "triton",
    "de": "Wassermann",
    "ja": "マーマン",
    "ko": "남자 인어"
  },
  "🧖‍♀️": {
    "es": "mujer en una sauna",
    "fr": "femme au hammam",
    "de": "Frau in Dampfsauna",
    "ja": "サウナに入る女",
    "ko": "사우나 하는 여자"
  },
  "🧗‍♀️": {
    "es": "mujer escalando",
    "fr": "femme qui grimpe",
    "de": "Bergsteigerin",
    "ja": "山を登る女",
    "ko": "클라이밍하는 여자"
  },
  "🏇": {
    "es": "carrera de caballos",
    "fr": "course hippique",
    "de": "Pferderennen",
    "ja": "競馬",
    "ko": "승마"
  },
  "⛷️": {
    "es": "persona esquiando",
    "fr": "skieur",
    "de": "Skifahrer(in)",
    "ja": "スキーヤー",
    "ko": "스키 타는 사람"
  },
  "🏂": {
    "es": "practicante de snowboard",
    "fr": "snowboardeur",
    "de": "Snowboarder(in)",
    "ja": "スノーボーダー",
    "ko": "스노보드 타는 사람"
  },
  "🤳": {
    "es": "selfi",
    "fr": "selfie",
    "de": "Selfie",
    "ja": "セルフィー",
    "ko": "셀카"
  },
  "🦾": {
    "es": "brazo mecánico",
    "fr": "bras mécanique",
    "de": "Armprothese",
    "ja": "義手",
    "ko": "기계 팔"
  },
  "🦿": {
    "es": "pierna mecánica",
    "fr": "jambe mécanique",
    "de": "Beinprothese",
    "ja": "義足",
    "ko": "인공 다리"
  },
  "👶": {
    "es": "bebé",
    "fr": "bébé",
    "de": "Baby",
    "ja": "赤ん坊",
    "ko": "아기"
  },
  "🧒": {
    "es": "infante",
    "fr": "enfant",
    "de": "Kind",
    "ja": "子供",
    "ko": "어린이"
  },
  "👦": {
    "es": "niño",
    "fr": "garçon",
    "de": "Junge",
    "ja": "男の子",
    "ko": "남자 아이"
  },
  "👧": {
    "es": "niña",
    "fr": "fille",
    "de": "Mädchen",
    "ja": "女の子",
    "ko": "여자 아이"
  },
  "🧑": {
    "es": "persona adulta",
    "fr": "adulte",
    "de": "Person",
    "ja": "大人",
    "ko": "사람"
  },
  "👨": {
    "es": "hombre",
    "fr": "homme",
    "de": "Mann",
    "ja": "男性",
    "ko": "남자"
  },
  "🧔‍♀️": {
    "es": "mujer: barba",
    "fr": "femme barbue",
    "de": "Frau: Bart",
    "ja": "あごひげの女性",
    "ko": "수염 난 여자"
  },
  "👩‍🦰": {
    "es": "mujer: pelo pelirrojo",
    "fr": "femme : cheveux roux",
    "de": "Frau: rotes Haar",
    "ja": "女性: 赤毛",
    "ko": "여자: 빨간 머리"
  },
  "👩‍🦱": {
    "es": "mujer: pelo rizado",
    "fr": "femme : cheveux bouclés",
    "de": "Frau: lockiges Haar",
    "ja": "女性: 巻き毛",
    "ko": "여자: 곱슬머리"
  },
  "👩‍🦳": {
    "es": "mujer: pelo blanco",
    "fr": "femme : cheveux blancs",
    "de": "Frau: weißes Haar",
    "ja": "女性: 白髪",
    "ko": "여자: 백발"
  },
  "👩‍🦲": {
    "es": "mujer: sin pelo",
    "fr": "femme : chauve",
    "de": "Frau: Glatze",
    "ja": "女性: はげ頭",
    "ko": "여자: 대머리"
  },
  "👩": {
    "es": "mujer",
    "fr": "femme",
    "de": "Frau",
    "ja": "女性",
    "ko": "여자"
  },
  "🧓": {
    "es": "persona mayor",
    "fr": "personne âgée",
    "de": "ältere Person",
    "ja": "お年寄り",
    "ko": "노인"
  },
  "👴": {
    "es": "anciano",
    "fr": "homme âgé",
    "de": "älterer Mann",
    "ja": "おじいさん",
    "ko": "할아버지"
  },
  "👵": {
    "es": "anciana",
    "fr": "femme âgée",
    "de": "ältere Frau",
    "ja": "おばあさん",
    "ko": "할머니"
  },
  "👩‍⚕️": {
    "es": "profesional sanitario mujer",
    "fr": "professionnelle de la santé",
    "de": "Ärztin",
    "ja": "女性の医者",
    "ko": "여자 의료인"
  },
  "👩‍🎓": {
    "es": "estudiante mujer",
    "fr": "étudiante",
    "de": "Studentin",
    "ja": "女子学生",
    "ko": "여학생"
  },
  "👩‍🏫": {
    "es": "docente mujer",
    "fr": "enseignante",
    "de": "Lehrerin",
    "ja": "女性の教師",
    "ko": "여교사"
  },
  "👩‍⚖️": {
    "es": "fiscal mujer",
    "fr": "juge femme",
    "de": "Richterin",
    "ja": "女性の裁判官",
    "ko": "여자 판사"
  },
  "👩‍🌾": {
    "es": "profesional de la agricultura mujer",
    "fr": "fermière",
    "de": "Bäuerin",
    "ja": "農家の女性",
    "ko": "여자 농부"
  },
  "👩‍🍳": {
    "es": "chef mujer",
    "fr": "cuisinière",
    "de": "Köchin",
    "ja": "女性のコック",
    "ko": "여자 요리사"
  },
  "👩‍🔧": {
    "es": "profesional de la mecánica mujer",
    "fr": "mécanicienne",
    "de": "Mechanikerin",
    "ja": "女性の整備士",
    "ko": "여자 정비공"
  },
  "👩‍🏭": {
    "es": "profesional industrial mujer",
    "fr": "ouvrière",
    "de": "Fabrikarbeiterin",
    "ja": "女性の溶接工",
    "ko": "공장 여자 직원"
  },
  "👩‍💼": {
    "es": "oficinista mujer",
    "fr": "employée de bureau",
    "de": "Büroangestellte",
    "ja": "女性会社員",
    "ko": "여자 회사원"
  },
  "👩‍🔬": {
    "es": "profesional de la ciencia mujer",
    "fr": "scientifique femme",
    "de": "Wissenschaftlerin",
    "ja": "女性科学者",
    "ko": "여자 과학자"
  },
  "👩‍💻": {
    "es": "profesional de la tecnología mujer",
    "fr": "informaticienne",
    "de": "IT-Expertin",
    "ja": "女性技術者",
    "ko": "여자 기술 전문가"
  },
  "👩‍🎤": {
    "es": "cantante mujer",
    "fr": "chanteuse",
    "de": "Sängerin",
    "ja": "女性歌手",
    "ko": "여자 가수"
  },
  "👩‍🎨": {
    "es": "artista mujer",
    "fr": "artiste femme",
    "de": "Künstlerin",
    "ja": "女性の芸術家",
    "ko": "여자 화가"
  },
  "👩‍✈️": {
    "es": "piloto mujer",
    "fr": "pilote femme",
    "de": "Pilotin",
    "ja": "女性パイロット",
    "ko": "여자 기장"
  },
  "👩‍🚀": {
    "es": "astronauta mujer",
    "fr": "astronaute femme",
    "de": "Astronautin",
    "ja": "女性宇宙飛行士",
    "ko": "여자 우주비행사"
  },
  "👩‍🚒": {
    "es": "bombera",
    "fr": "pompier femme",
    "de": "Feuerwehrfrau",
    "ja": "女性消防士",
    "ko": "여자 소방관"
  },
  "👮‍♀️": {
    "es": "agente de policía mujer",
    "fr": "policière",
    "de": "Polizistin",
    "ja": "女性警察官",
    "ko": "여자 경찰관"
  },
  "🕵️‍♀️": {
    "es": "detective mujer",
    "fr": "détective femme",
    "de": "Detektivin",
    "ja": "女性の探偵",
    "ko": "여자 탐정"
  },
  "💂‍♀️": {
    "es": "guardia mujer",
    "fr": "garde femme",
    "de": "Wachsoldatin",
    "ja": "女性の衛兵",
    "ko": "여자 근위병"
  },
  "🥷": {
    "es": "ninja",
    "fr": "ninja",
    "de": "Ninja",
    "ja": "忍者",
    "ko": "닌자"
  },
  "👷‍♀️": {
    "es": "profesional de la construcción mujer",
    "fr": "ouvrière du bâtiment",
    "de": "Bauarbeiterin",
    "ja": "女性の建設作業員",
    "ko": "건설 현장 여자 노동자"
  },
  "🤴": {
    "es": "príncipe",
    "fr": "prince",
    "de": "Prinz",
    "ja": "プリンス",
    "ko": "왕자"
  },
  "👸": {
    "es": "princesa",
    "fr": "princesse",
    "de": "Prinzessin",
    "ja": "プリンセス",
    "ko": "공주"
  },
  "🤰": {
    "es": "mujer embarazada",
    "fr": "femme enceinte",
    "de": "schwangere Frau",
    "ja": "妊婦",
    "ko": "임산부"
  },
  "🤱": {
    "es": "lactancia materna",
    "fr": "allaitement",
    "de": "Stillen",
    "ja": "授乳",
    "ko": "모유 수유"
  },
  "👩‍🍼": {
    "es": "mujer alimentando a bebé",
    "fr": "femme allaitant un bébé",
    "de": "Frau, die Baby die Flasche gibt",
    "ja": "授乳する女性",
    "ko": "수유 중인 여자"
  },
  "👼": {
    "es": "bebé ángel",
    "fr": "bébé ange",
    "de": "Putte",
    "ja": "天使",
    "ko": "아기 천사"
  },
  "🎅": {
    "es": "Papá Noel",
    "fr": "père Noël",
    "de": "Weihnachtsmann",
    "ja": "サンタ",
    "ko": "산타클로스"
  },
  "🤶": {
    "es": "Mamá Noel",
    "fr": "mère Noël",
    "de": "Weihnachtsfrau",
    "ja": "女性のサンタ",
    "ko": "산타할머니"
  },
  "🧑‍🎄": {
    "es": "Noel",
    "fr": "santa",
    "de": "Weihnachtsperson",
    "ja": "サンタさん",
    "ko": "산타"
  },
  "🦸‍♀️": {
    "es": "superheroína",
    "fr": "super-héroïne",
    "de": "Heldin",
    "ja": "女性のスーパーヒーロー",
    "ko": "여자 히어로"
  },
  "🦹‍♀️": {
    "es": "supervillana",
    "fr": "super-vilain femme",
    "de": "weiblicher Bösewicht",
    "ja": "女性の悪役",
    "ko": "여자 슈퍼 악당"
  },
  "🧙‍♀️": {
    "es": "maga",
    "fr": "mage femme",
    "de": "Magierin",
    "ja": "女の魔法使い",
    "ko": "여자 마법사"
  },
  "🧚‍♀️": {
    "es": "hada mujer",
    "fr": "fée",
    "de": "Fee",
    "ja": "女の妖精",
    "ko": "여자 요정"
  },
  "🧛‍♀️": {
    "es": "vampiresa",
    "fr": "vampire femme",
    "de": "weiblicher Vampir",
    "ja": "女の吸血鬼",
    "ko": "여자 뱀파이어"
  },
  "🧜‍♀️": {
    "es": "sirena",
    "fr": "sirène",
    "de": "Meerjungfrau",
    "ja": "マーメイド",
    "ko": "여자 인어"
  },
  "🧝‍♀️": {
    "es": "elfa",
    "fr": "elfe femme",
    "de": "Elfe",
    "ja": "女のエルフ",
    "ko": "여자 엘프"
  },
  "🧞‍♀️": {
    "es": "genio mujer",
    "fr": "génie femme",
    "de": "weiblicher Flaschengeist",
    "ja": "女の精霊",
    "ko": "여자 지니"
  },
  "🧟‍♀️": {
    "es": "zombi mujer",
    "fr": "zombie femme",
    "de": "weiblicher Zombie",
    "ja": "女のゾンビ",
    "ko": "여자 좀비"
  },
  "🧌": {
    "es": "trol",
    "fr": "troll",
    "de": "Troll",
    "ja": "トロール",
    "ko": "트롤"
  },
  "💆‍♀️": {
    "es": "mujer recibiendo masaje",
    "fr": "femme qui se fait masser",
    "de": "Frau, die eine Kopfmassage bekommt",
    "ja": "フェイスマッサージ中の女",
    "ko": "마사지 받는 여자"
  },
  "💇‍♀️": {
    "es": "mujer cortándose el pelo",
    "fr": "femme qui se fait couper les cheveux",
    "de": "Frau beim Haareschneiden",
    "ja": "散髪される女",
    "ko": "여자 헤어컷"
  },
  "🚶‍♀️": {
    "es": "mujer caminando",
    "fr": "femme qui marche",
    "de": "Fußgängerin",
    "ja": "歩く女",
    "ko": "걷는 여자"
  },
  "🚶‍♀️‍➡️": {
    "es": "mujer caminando: hacia la derecha",
    "fr": "femme qui marche : vers la droite",
    "de": "Fußgängerin: nach rechts",
    "ja": "歩く女: 右向き",
    "ko": "걷는 여자: 오른쪽을 향한"
  },
  "🧍‍♀️": {
    "es": "mujer de pie",
    "fr": "femme debout",
    "de": "stehende Frau",
    "ja": "立つ女",
    "ko": "서 있는 여자"
  },
  "🧎‍♀️": {
    "es": "mujer de rodillas",
    "fr": "femme à genoux",
    "de": "kniende Frau",
    "ja": "正座する女性",
    "ko": "무릎을 꿇은 여자"
  },
  "🧎‍♀️‍➡️": {
    "es": "mujer de rodillas: hacia la derecha",
    "fr": "femme à genoux : vers la droite",
    "de": "kniende Frau: nach rechts",
    "ja": "正座する女性: 右向き",
    "ko": "무릎을 꿇은 여자: 오른쪽을 향한"
  },
  "👩‍🦯": {
    "es": "mujer con bastón",
    "fr": "femme avec canne blanche",
    "de": "Frau mit Langstock",
    "ja": "杖をついた女性",
    "ko": "지팡이를 든 여자"
  },
  "👩‍🦯‍➡️": {
    "es": "mujer con bastón: hacia la derecha",
    "fr": "femme avec canne blanche : vers la droite",
    "de": "Frau mit Langstock: nach rechts",
    "ja": "杖をついた女性: 右向き",
    "ko": "지팡이를 든 여자: 오른쪽을 향한"
  },
  "👩‍🦼": {
    "es": "mujer en silla de ruedas eléctrica",
    "fr": "femme en fauteuil motorisé",
    "de": "Frau in elektrischem Rollstuhl",
    "ja": "電動車椅子の女性",
    "ko": "전동 휠체어를 탄 여자"
  },
  "👩‍🦼‍➡️": {
    "es": "mujer en silla de ruedas eléctrica: hacia la derecha",
    "fr": "femme en fauteuil motorisé : vers la droite",
    "de": "Frau in elektrischem Rollstuhl: nach rechts",
    "ja": "電動車椅子の女性: 右向き",
    "ko": "전동 휠체어를 탄 여자: 오른쪽을 향한"
  },
  "👩‍🦽": {
    "es": "mujer en silla de ruedas manual",
    "fr": "femme en fauteuil roulant manuel",
    "de": "Frau in manuellem Rollstuhl",
    "ja": "手動式車椅子の女性",
    "ko": "수동 휠체어를 탄 여자"
  },
  "👩‍🦽‍➡️": {
    "es": "mujer en silla de ruedas manual: hacia la derecha",
    "fr": "femme en fauteuil roulant manuel : vers la droite",
    "de": "Frau in manuellem Rollstuhl: nach rechts",
    "ja": "手動式車椅子の女性: 右向き",
    "ko": "수동 휠체어를 탄 여자: 오른쪽을 향한"
  },
  "🏃‍♀️": {
    "es": "mujer corriendo",
    "fr": "femme qui court",
    "de": "laufende Frau",
    "ja": "走る女",
    "ko": "뛰는 여자"
  },
  "🏃‍♀️‍➡️": {
    "es": "mujer corriendo: hacia la derecha",
    "fr": "femme qui court : vers la droite",
    "de": "laufende Frau: nach rechts",
    "ja": "走る女: 右向き",
    "ko": "뛰는 여자: 오른쪽을 향한"
  },
  "🧑‍🩰": {
    "es": "bailarina de ballet",
    "fr": "danseuse de ballet",
    "de": "Balletttänzerin",
    "ja": "バレエダンサー",
    "ko": "발레 무용수"
  },
  "💃": {
    "es": "mujer bailando",
    "fr": "danseuse",
    "de": "tanzende Frau",
    "ja": "踊る女",
    "ko": "여자 댄서"
  },
  "🏌️‍♀️": {
    "es": "mujer jugando al golf",
    "fr": "golfeuse",
    "de": "Golferin",
    "ja": "ゴルフをする女",
    "ko": "골프치는 여자"
  },
  "🏄‍♀️": {
    "es": "mujer haciendo surf",
    "fr": "surfeuse",
    "de": "Surferin",
    "ja": "サーフィンする女",
    "ko": "서핑하는 여자"
  },
  "🚣‍♀️": {
    "es": "mujer remando en un bote",
    "fr": "rameuse dans une barque",
    "de": "Frau im Ruderboot",
    "ja": "ボートをこぐ女",
    "ko": "노젓는 여자"
  },
  "🏊‍♀️": {
    "es": "mujer nadando",
    "fr": "nageuse",
    "de": "Schwimmerin",
    "ja": "泳ぐ女",
    "ko": "수영하는 여자"
  },
  "⛹️‍♀️": {
    "es": "mujer botando un balón",
    "fr": "femme avec ballon",
    "de": "Frau mit Ball",
    "ja": "バスケットボールをする女",
    "ko": "공 가진 여자"
  },
  "🏋️‍♀️": {
    "es": "mujer levantando pesas",
    "fr": "femme haltérophile",
    "de": "Gewichtheberin",
    "ja": "重量挙げをする女",
    "ko": "여자 역도 선수"
  },
  "🚴‍♀️": {
    "es": "mujer en bicicleta",
    "fr": "cycliste femme",
    "de": "Radfahrerin",
    "ja": "自転車に乗る女",
    "ko": "자전거 타는 여자"
  },
  "🚵‍♀️": {
    "es": "mujer en bicicleta de montaña",
    "fr": "femme en VTT",
    "de": "Mountainbikerin",
    "ja": "マウンテンバイクに乗る女",
    "ko": "산악 자전거 타는 여자"
  },
  "🤸‍♀️": {
    "es": "mujer dando una voltereta lateral",
    "fr": "femme faisant la roue",
    "de": "Rad schlagende Frau",
    "ja": "側転する女",
    "ko": "옆돌기하는 여자"
  },
  "🤼": {
    "es": "personas luchando",
    "fr": "personnes faisant de la lutte",
    "de": "Ringer(in)",
    "ja": "レスリングする人",
    "ko": "레슬링하는 사람"
  },
  "🤽‍♀️": {
    "es": "mujer jugando al waterpolo",
    "fr": "joueuse de water-polo",
    "de": "Wasserballspielerin",
    "ja": "水球をする女",
    "ko": "수구하는 여자"
  },
  "🤾‍♀️": {
    "es": "mujer jugando al balonmano",
    "fr": "handballeuse",
    "de": "Handballspielerin",
    "ja": "ハンドボールをする女",
    "ko": "핸드볼하는 여자"
  },
  "🧘‍♀️": {
    "es": "mujer en posición de loto",
    "fr": "femme dans la posture du lotus",
    "de": "Frau im Lotossitz",
    "ja": "ヨガのポーズをする女",
    "ko": "가부좌한 여자"
  },
  "🫅": {
    "es": "persona con corona",
    "fr": "personne avec une couronne",
    "de": "Person mit Krone",
    "ja": "王冠をかぶった人",
    "ko": "왕관을 쓴 사람"
  },
  "👲": {
    "es": "persona con gorro chino",
    "fr": "homme avec casquette chinoise",
    "de": "Mann mit chinesischem Hut",
    "ja": "中華帽の男性",
    "ko": "중국 전통 모자를 쓰고 있는 남자"
  },
  "🧕": {
    "es": "mujer con hiyab",
    "fr": "femme avec foulard",
    "de": "Frau mit Kopftuch",
    "ja": "スカーフの女性",
    "ko": "머리에 스카프를 두른 여자"
  },
  "🕴": {
    "es": "persona trajeada levitando",
    "fr": "homme d’affaires en lévitation",
    "de": "schwebender Mann im Anzug",
    "ja": "浮いてるビジネスマン",
    "ko": "공중에 떠 있는 정장 입은 남자"
  },
  "👯‍♀️": {
    "es": "mujeres con orejas de conejo",
    "fr": "femmes avec des oreilles de lapin",
    "de": "Frauen mit Hasenohren",
    "ja": "バニーガール",
    "ko": "토끼 귀를 쓰고 춤추는 여자들"
  },
  "🤺": {
    "es": "persona haciendo esgrima",
    "fr": "escrimeur",
    "de": "Fechter(in)",
    "ja": "フェンシングをする人",
    "ko": "펜싱하는 사람"
  },
  "🤼‍♂️": {
    "es": "hombres luchando",
    "fr": "lutteurs",
    "de": "ringende Männer",
    "ja": "レスリングする男",
    "ko": "레슬링하는 남자"
  },
  "🤼‍♀️": {
    "es": "mujeres luchando",
    "fr": "lutteuses",
    "de": "ringende Frauen",
    "ja": "レスリングする女",
    "ko": "레슬링하는 여자"
  },
  "🛀": {
    "es": "persona en la bañera",
    "fr": "personne prenant un bain",
    "de": "badende Person",
    "ja": "風呂に入る人",
    "ko": "목욕하는 사람"
  },
  "🛌": {
    "es": "persona en la cama",
    "fr": "personne au lit",
    "de": "im Bett liegende Person",
    "ja": "ベッドに寝る人",
    "ko": "침대에 누운 사람"
  },
  "🐵": {
    "es": "cara de mono",
    "fr": "tête de singe",
    "de": "Affengesicht",
    "ja": "サルの顔",
    "ko": "원숭이 얼굴"
  },
  "🐒": {
    "es": "mono",
    "fr": "singe",
    "de": "Affe",
    "ja": "サル",
    "ko": "원숭이"
  },
  "🦍": {
    "es": "gorila",
    "fr": "gorille",
    "de": "Gorilla",
    "ja": "ゴリラ",
    "ko": "고릴라"
  },
  "🦧": {
    "es": "orangután",
    "fr": "orang-outan",
    "de": "Orang-Utan",
    "ja": "オランウータン",
    "ko": "오랑우탄"
  },
  "🐶": {
    "es": "cara de perro",
    "fr": "tête de chien",
    "de": "Hundegesicht",
    "ja": "イヌの顔",
    "ko": "강아지 얼굴"
  },
  "🐕": {
    "es": "perro",
    "fr": "chien",
    "de": "Hund",
    "ja": "イヌ",
    "ko": "개"
  },
  "🦮": {
    "es": "perro guía",
    "fr": "chien guide",
    "de": "Blindenhund",
    "ja": "盲導犬",
    "ko": "안내견"
  },
  "🐕‍🦺": {
    "es": "perro de servicio",
    "fr": "chien d’assistance",
    "de": "Assistenzhund",
    "ja": "介助犬",
    "ko": "보조견"
  },
  "🐩": {
    "es": "caniche",
    "fr": "caniche",
    "de": "Pudel",
    "ja": "プードル",
    "ko": "푸들"
  },
  "🐺": {
    "es": "lobo",
    "fr": "loup",
    "de": "Wolf",
    "ja": "オオカミの顔",
    "ko": "늑대 얼굴"
  },
  "🦊": {
    "es": "zorro",
    "fr": "renard",
    "de": "Fuchs",
    "ja": "キツネの顔",
    "ko": "여우 얼굴"
  },
  "🦝": {
    "es": "mapache",
    "fr": "raton laveur",
    "de": "Waschbär",
    "ja": "アライグマ",
    "ko": "너구리"
  },
  "🐱": {
    "es": "cara de gato",
    "fr": "tête de chat",
    "de": "Katzengesicht",
    "ja": "ネコの顔",
    "ko": "고양이 얼굴"
  },
  "🐈": {
    "es": "gato",
    "fr": "chat",
    "de": "Katze",
    "ja": "ネコ",
    "ko": "고양이"
  },
  "🐈‍⬛": {
    "es": "gato negro",
    "fr": "chat noir",
    "de": "schwarze Katze",
    "ja": "黒猫",
    "ko": "검은 고양이"
  },
  "🦁": {
    "es": "león",
    "fr": "tête de lion",
    "de": "Löwe",
    "ja": "ライオンの顔",
    "ko": "사자 얼굴"
  },
  "🐯": {
    "es": "cara de tigre",
    "fr": "tête de tigre",
    "de": "Tigergesicht",
    "ja": "トラの顔",
    "ko": "호랑이 얼굴"
  },
  "🐅": {
    "es": "tigre",
    "fr": "tigre",
    "de": "Tiger",
    "ja": "トラ",
    "ko": "호랑이"
  },
  "🐆": {
    "es": "leopardo",
    "fr": "léopard",
    "de": "Leopard",
    "ja": "ヒョウ",
    "ko": "표범"
  },
  "🐴": {
    "es": "cara de caballo",
    "fr": "tête de cheval",
    "de": "Pferdegesicht",
    "ja": "馬の顔",
    "ko": "말 얼굴"
  },
  "🫎": {
    "es": "alce",
    "fr": "élan",
    "de": "Elch",
    "ja": "ヘラジカ",
    "ko": "무스"
  },
  "🫏": {
    "es": "burro",
    "fr": "âne",
    "de": "Esel",
    "ja": "ロバ",
    "ko": "당나귀"
  },
  "🐎": {
    "es": "caballo",
    "fr": "cheval",
    "de": "Pferd",
    "ja": "馬",
    "ko": "말"
  },
  "🦄": {
    "es": "unicornio",
    "fr": "licorne",
    "de": "Einhorn",
    "ja": "ユニコーンの顔",
    "ko": "유니콘 얼굴"
  },
  "🦓": {
    "es": "cebra",
    "fr": "zèbre",
    "de": "Zebra",
    "ja": "シマウマ",
    "ko": "얼룩말"
  },
  "🦌": {
    "es": "ciervo",
    "fr": "cerf",
    "de": "Hirsch",
    "ja": "シカ",
    "ko": "사슴"
  },
  "🦬": {
    "es": "bisonte",
    "fr": "bison",
    "de": "Bison",
    "ja": "バイソン",
    "ko": "들소"
  },
  "🐮": {
    "es": "cara de vaca",
    "fr": "tête de vache",
    "de": "Kuhgesicht",
    "ja": "牛の顔",
    "ko": "소 얼굴"
  },
  "🐂": {
    "es": "buey",
    "fr": "bœuf",
    "de": "Ochse",
    "ja": "牡牛",
    "ko": "소"
  },
  "🐃": {
    "es": "búfalo de agua",
    "fr": "buffle",
    "de": "Wasserbüffel",
    "ja": "水牛",
    "ko": "물소"
  },
  "🐄": {
    "es": "vaca",
    "fr": "vache",
    "de": "Kuh",
    "ja": "牝牛",
    "ko": "젖소"
  },
  "🐷": {
    "es": "cara de cerdo",
    "fr": "tête de cochon",
    "de": "Schweinegesicht",
    "ja": "ブタの顔",
    "ko": "돼지 얼굴"
  },
  "🐖": {
    "es": "cerdo",
    "fr": "cochon",
    "de": "Schwein",
    "ja": "ブタ",
    "ko": "돼지"
  },
  "🐗": {
    "es": "jabalí",
    "fr": "sanglier",
    "de": "Wildschwein",
    "ja": "イノシシ",
    "ko": "멧돼지"
  },
  "🐽": {
    "es": "nariz de cerdo",
    "fr": "groin",
    "de": "Schweinerüssel",
    "ja": "ブタ鼻",
    "ko": "돼지코"
  },
  "🐏": {
    "es": "carnero",
    "fr": "bélier",
    "de": "Widder",
    "ja": "牡羊",
    "ko": "숫양"
  },
  "🐑": {
    "es": "oveja",
    "fr": "mouton",
    "de": "Schaf",
    "ja": "羊",
    "ko": "양"
  },
  "🐐": {
    "es": "cabra",
    "fr": "chèvre",
    "de": "Ziege",
    "ja": "山羊",
    "ko": "염소"
  },
  "🐪": {
    "es": "dromedario",
    "fr": "dromadaire",
    "de": "Dromedar",
    "ja": "ラクダ",
    "ko": "낙타"
  },
  "🐫": {
    "es": "camello",
    "fr": "chameau",
    "de": "Kamel",
    "ja": "フタコブラクダ",
    "ko": "쌍봉 낙타"
  },
  "🦙": {
    "es": "llama",
    "fr": "lama",
    "de": "Lama",
    "ja": "ラマ",
    "ko": "라마"
  },
  "🦒": {
    "es": "jirafa",
    "fr": "girafe",
    "de": "Giraffe",
    "ja": "キリン",
    "ko": "기린"
  },
  "🐘": {
    "es": "elefante",
    "fr": "éléphant",
    "de": "Elefant",
    "ja": "ゾウ",
    "ko": "코끼리"
  },
  "🦣": {
    "es": "mamut",
    "fr": "mammouth",
    "de": "Mammut",
    "ja": "マンモス",
    "ko": "매머드"
  },
  "🦏": {
    "es": "rinoceronte",
    "fr": "rhinocéros",
    "de": "Nashorn",
    "ja": "サイ",
    "ko": "코뿔소"
  },
  "🦛": {
    "es": "hipopótamo",
    "fr": "hippopotame",
    "de": "Nilpferd",
    "ja": "カバ",
    "ko": "하마"
  },
  "🐭": {
    "es": "cara de ratón",
    "fr": "tête de souris",
    "de": "Mäusegesicht",
    "ja": "ネズミの顔",
    "ko": "쥐 얼굴"
  },
  "🐁": {
    "es": "ratón",
    "fr": "souris",
    "de": "Maus",
    "ja": "ハツカネズミ",
    "ko": "생쥐"
  },
  "🐀": {
    "es": "rata",
    "fr": "rat",
    "de": "Ratte",
    "ja": "ネズミ",
    "ko": "쥐"
  },
  "🐹": {
    "es": "hámster",
    "fr": "hamster",
    "de": "Hamster",
    "ja": "ハムスターの顔",
    "ko": "햄스터 얼굴"
  },
  "🐰": {
    "es": "cara de conejo",
    "fr": "tête de lapin",
    "de": "Hasengesicht",
    "ja": "ウサギの顔",
    "ko": "토끼 얼굴"
  },
  "🐇": {
    "es": "conejo",
    "fr": "lapin",
    "de": "Hase",
    "ja": "ウサギ",
    "ko": "토끼"
  },
  "🐿️": {
    "es": "ardilla",
    "fr": "écureuil",
    "de": "Streifenhörnchen",
    "ja": "リス",
    "ko": "얼룩다람쥐"
  },
  "🦫": {
    "es": "castor",
    "fr": "castor",
    "de": "Biber",
    "ja": "ビーバー",
    "ko": "비버"
  },
  "🦔": {
    "es": "erizo",
    "fr": "hérisson",
    "de": "Igel",
    "ja": "ハリネズミ",
    "ko": "고슴도치"
  },
  "🦇": {
    "es": "murciélago",
    "fr": "chauve-souris",
    "de": "Fledermaus",
    "ja": "コウモリ",
    "ko": "박쥐"
  },
  "🐻": {
    "es": "oso",
    "fr": "ours",
    "de": "Bär",
    "ja": "クマの顔",
    "ko": "곰 얼굴"
  },
  "🐻‍❄️": {
    "es": "oso polar",
    "fr": "ours polaire",
    "de": "Eisbär",
    "ja": "シロクマ",
    "ko": "북극곰"
  },
  "🐨": {
    "es": "koala",
    "fr": "koala",
    "de": "Koala",
    "ja": "コアラ",
    "ko": "코알라"
  },
  "🐼": {
    "es": "panda",
    "fr": "panda",
    "de": "Panda",
    "ja": "パンダの顔",
    "ko": "판다 얼굴"
  },
  "🦥": {
    "es": "perezoso",
    "fr": "paresseux",
    "de": "Faultier",
    "ja": "ナマケモノ",
    "ko": "나무늘보"
  },
  "🦦": {
    "es": "nutria",
    "fr": "loutre",
    "de": "Otter",
    "ja": "カワウソ",
    "ko": "수달"
  },
  "🦨": {
    "es": "mofeta",
    "fr": "mouffette",
    "de": "Stinktier",
    "ja": "スカンク",
    "ko": "스컹크"
  },
  "🦘": {
    "es": "canguro",
    "fr": "kangourou",
    "de": "Känguru",
    "ja": "カンガルー",
    "ko": "캥거루"
  },
  "🦡": {
    "es": "tejón",
    "fr": "blaireau",
    "de": "Dachs",
    "ja": "アナグマ",
    "ko": "오소리"
  },
  "🐾": {
    "es": "huellas de pezuñas",
    "fr": "empreintes d’animaux",
    "de": "Tatzenabdrücke",
    "ja": "肉球",
    "ko": "곰발바닥"
  },
  "🦃": {
    "es": "pavo",
    "fr": "dindon",
    "de": "Truthahn",
    "ja": "七面鳥",
    "ko": "칠면조"
  },
  "🐔": {
    "es": "gallina",
    "fr": "poule",
    "de": "Huhn",
    "ja": "にわとり",
    "ko": "닭"
  },
  "🐓": {
    "es": "gallo",
    "fr": "coq",
    "de": "Hahn",
    "ja": "おんどり",
    "ko": "수탉"
  },
  "🐣": {
    "es": "pollito rompiendo el cascarón",
    "fr": "poussin qui éclôt",
    "de": "schlüpfendes Küken",
    "ja": "卵からかえったひよこ",
    "ko": "알에서 깬 병아리"
  },
  "🐤": {
    "es": "pollito",
    "fr": "poussin",
    "de": "Küken",
    "ja": "ひよこ",
    "ko": "병아리"
  },
  "🐥": {
    "es": "pollito de frente",
    "fr": "poussin de face",
    "de": "Küken von vorne",
    "ja": "前を向いているひよこ",
    "ko": "정면을 향해 날개를 편 병아리"
  },
  "🐦": {
    "es": "pájaro",
    "fr": "oiseau",
    "de": "Vogel",
    "ja": "鳥",
    "ko": "새"
  },
  "🐧": {
    "es": "pingüino",
    "fr": "pingouin",
    "de": "Pinguin",
    "ja": "ペンギン",
    "ko": "펭귄"
  },
  "🕊️": {
    "es": "paloma",
    "fr": "colombe",
    "de": "Taube",
    "ja": "ハト",
    "ko": "비둘기"
  },
  "🦅": {
    "es": "águila",
    "fr": "aigle",
    "de": "Adler",
    "ja": "ワシ",
    "ko": "독수리"
  },
  "🦆": {
    "es": "pato",
    "fr": "canard",
    "de": "Ente",
    "ja": "カモ",
    "ko": "오리"
  },
  "🦢": {
    "es": "cisne",
    "fr": "cygne",
    "de": "Schwan",
    "ja": "白鳥",
    "ko": "백조"
  },
  "🦉": {
    "es": "búho",
    "fr": "chouette",
    "de": "Eule",
    "ja": "フクロウ",
    "ko": "부엉이"
  },
  "🦤": {
    "es": "dodo",
    "fr": "dodo",
    "de": "Dodo",
    "ja": "ドードー",
    "ko": "도도새"
  },
  "🪶": {
    "es": "pluma",
    "fr": "plume",
    "de": "Feder",
    "ja": "羽",
    "ko": "깃털"
  },
  "🦩": {
    "es": "flamenco",
    "fr": "flamant",
    "de": "Flamingo",
    "ja": "フラミンゴ",
    "ko": "홍학"
  },
  "🦚": {
    "es": "pavo real",
    "fr": "paon",
    "de": "Pfau",
    "ja": "クジャク",
    "ko": "공작"
  },
  "🦜": {
    "es": "loro",
    "fr": "perroquet",
    "de": "Papagei",
    "ja": "オウム",
    "ko": "앵무새"
  },
  "🪽": {
    "es": "ala",
    "fr": "aile",
    "de": "Flügel",
    "ja": "翼",
    "ko": "날개"
  },
  "🐦‍⬛": {
    "es": "pájaro negro",
    "fr": "oiseau noir",
    "de": "schwarzer Vogel",
    "ja": "黒い鳥",
    "ko": "검은 새"
  },
  "🪿": {
    "es": "oca",
    "fr": "oie",
    "de": "Gans",
    "ja": "ガチョウ",
    "ko": "거위"
  },
  "🐦‍🔥": {
    "es": "fénix",
    "fr": "phénix",
    "de": "Phönix",
    "ja": "フェニックス",
    "ko": "불사조"
  },
  "🐸": {
    "es": "rana",
    "fr": "grenouille",
    "de": "Frosch",
    "ja": "カエルの顔",
    "ko": "개구리 얼굴"
  },
  "🐊": {
    "es": "cocodrilo",
    "fr": "crocodile",
    "de": "Krokodil",
    "ja": "ワニ",
    "ko": "악어"
  },
  "🐢": {
    "es": "tortuga",
    "fr": "tortue",
    "de": "Schildkröte",
    "ja": "カメ",
    "ko": "거북이"
  },
  "🦎": {
    "es": "lagarto",
    "fr": "lézard",
    "de": "Eidechse",
    "ja": "トカゲ",
    "ko": "도마뱀"
  },
  "🐍": {
    "es": "serpiente",
    "fr": "serpent",
    "de": "Schlange",
    "ja": "ヘビ",
    "ko": "뱀"
  },
  "🐲": {
    "es": "cara de dragón",
    "fr": "tête de dragon",
    "de": "Drachengesicht",
    "ja": "ドラゴンの顔",
    "ko": "용 얼굴"
  },
  "🐉": {
    "es": "dragón",
    "fr": "dragon",
    "de": "Drache",
    "ja": "ドラゴン",
    "ko": "용"
  },
  "🦕": {
    "es": "saurópodo",
    "fr": "sauropode",
    "de": "Sauropode",
    "ja": "草食恐竜",
    "ko": "초식 공룡"
  },
  "🦖": {
    "es": "t-rex",
    "fr": "T-Rex",
    "de": "T-Rex",
    "ja": "ティラノサウルス",
    "ko": "티라노사우루스"
  },
  "🐳": {
    "es": "ballena soltando un chorro",
    "fr": "baleine soufflant par son évent",
    "de": "blasender Wal",
    "ja": "潮吹きクジラ",
    "ko": "물 뿜는 고래"
  },
  "🐋": {
    "es": "ballena",
    "fr": "baleine",
    "de": "Wal",
    "ja": "クジラ",
    "ko": "고래"
  },
  "🐬": {
    "es": "delfín",
    "fr": "dauphin",
    "de": "Delfin",
    "ja": "イルカ",
    "ko": "돌고래"
  },
  "🦭": {
    "es": "foca",
    "fr": "phoque",
    "de": "Seehund",
    "ja": "アザラシ",
    "ko": "물개"
  },
  "🐟": {
    "es": "pez",
    "fr": "poisson",
    "de": "Fisch",
    "ja": "魚",
    "ko": "물고기"
  },
  "🐠": {
    "es": "pez tropical",
    "fr": "poisson tropical",
    "de": "Tropenfisch",
    "ja": "熱帯魚",
    "ko": "열대어"
  },
  "🐡": {
    "es": "pez globo",
    "fr": "poisson-lune",
    "de": "Kugelfisch",
    "ja": "フグ",
    "ko": "복어"
  },
  "🦈": {
    "es": "tiburón",
    "fr": "requin",
    "de": "Hai",
    "ja": "サメ",
    "ko": "상어"
  },
  "🐙": {
    "es": "pulpo",
    "fr": "pieuvre",
    "de": "Oktopus",
    "ja": "タコ",
    "ko": "문어"
  },
  "🐚": {
    "es": "caracola",
    "fr": "coquille en spirale",
    "de": "Schneckenhaus",
    "ja": "巻き貝",
    "ko": "달팽이집"
  },
  "🪸": {
    "es": "coral",
    "fr": "corail",
    "de": "Koralle",
    "ja": "サンゴ",
    "ko": "산호초"
  },
  "🪼": {
    "es": "medusa",
    "fr": "méduse",
    "de": "Qualle",
    "ja": "クラゲ",
    "ko": "해파리"
  },
  "🦀": {
    "es": "cangrejo",
    "fr": "crabe",
    "de": "Krebs",
    "ja": "カニ",
    "ko": "꽃게"
  },
  "🦞": {
    "es": "bogavante",
    "fr": "homard",
    "de": "Hummer",
    "ja": "ザリガニ",
    "ko": "바닷가재"
  },
  "🦐": {
    "es": "gamba",
    "fr": "crevette",
    "de": "Garnele",
    "ja": "エビ",
    "ko": "새우"
  },
  "🦑": {
    "es": "calamar",
    "fr": "calamar",
    "de": "Tintenfisch",
    "ja": "イカ",
    "ko": "오징어"
  },
  "🦪": {
    "es": "ostra",
    "fr": "huître",
    "de": "Auster",
    "ja": "牡蠣",
    "ko": "굴"
  },
  "🐌": {
    "es": "caracol",
    "fr": "escargot",
    "de": "Schnecke",
    "ja": "かたつむり",
    "ko": "달팽이"
  },
  "🦋": {
    "es": "mariposa",
    "fr": "papillon",
    "de": "Schmetterling",
    "ja": "チョウ",
    "ko": "나비"
  },
  "🐛": {
    "es": "bicho",
    "fr": "chenille",
    "de": "Raupe",
    "ja": "毛虫",
    "ko": "송충이"
  },
  "🐜": {
    "es": "hormiga",
    "fr": "fourmi",
    "de": "Ameise",
    "ja": "アリ",
    "ko": "개미"
  },
  "🐝": {
    "es": "abeja",
    "fr": "abeille",
    "de": "Biene",
    "ja": "ミツバチ",
    "ko": "꿀벌"
  },
  "🪲": {
    "es": "escarabajo",
    "fr": "scarabée",
    "de": "Käfer",
    "ja": "カブトムシ",
    "ko": "딱정벌레"
  },
  "🐞": {
    "es": "mariquita",
    "fr": "coccinelle",
    "de": "Marienkäfer",
    "ja": "テントウムシ",
    "ko": "무당벌레"
  },
  "🦗": {
    "es": "grillo",
    "fr": "criquet",
    "de": "Grille",
    "ja": "バッタ",
    "ko": "귀뚜라미"
  },
  "🪳": {
    "es": "cucaracha",
    "fr": "cafard",
    "de": "Kakerlake",
    "ja": "ゴキブリ",
    "ko": "바퀴벌레"
  },
  "🕷️": {
    "es": "araña",
    "fr": "araignée",
    "de": "Spinne",
    "ja": "クモ",
    "ko": "거미"
  },
  "🕸️": {
    "es": "tela de araña",
    "fr": "toile d’araignée",
    "de": "Spinnennetz",
    "ja": "クモの巣",
    "ko": "거미줄"
  },
  "🦂": {
    "es": "escorpión",
    "fr": "scorpion",
    "de": "Skorpion",
    "ja": "サソリ",
    "ko": "전갈"
  },
  "🦟": {
    "es": "mosquito",
    "fr": "moustique",
    "de": "Mücke",
    "ja": "蚊",
    "ko": "모기"
  },
  "🪰": {
    "es": "mosca",
    "fr": "mouche",
    "de": "Fliege",
    "ja": "ハエ",
    "ko": "파리"
  },
  "🪱": {
    "es": "gusano",
    "fr": "lombric",
    "de": "Wurm",
    "ja": "ミミズ",
    "ko": "지렁이"
  },
  "🦠": {
    "es": "microbio",
    "fr": "microbe",
    "de": "Mikrobe",
    "ja": "微生物",
    "ko": "미생물"
  },
  "💐": {
    "es": "ramo de flores",
    "fr": "bouquet",
    "de": "Blumenstrauß",
    "ja": "花束",
    "ko": "꽃다발"
  },
  "🌸": {
    "es": "flor de cerezo",
    "fr": "fleur de cerisier",
    "de": "Kirschblüte",
    "ja": "桜",
    "ko": "벚꽃"
  },
  "💮": {
    "es": "flor blanca",
    "fr": "fleur blanche",
    "de": "Blumenstempel",
    "ja": "大変よくできました",
    "ko": "흰 꽃"
  },
  "🪷": {
    "es": "loto",
    "fr": "lotus",
    "de": "Lotusblüte",
    "ja": "ハスの花",
    "ko": "연꽃"
  },
  "🏵️": {
    "es": "roseta",
    "fr": "rosette",
    "de": "Rosette",
    "ja": "花飾り",
    "ko": "장미"
  },
  "🌹": {
    "es": "rosa",
    "fr": "rose",
    "de": "Rose",
    "ja": "バラ",
    "ko": "장미꽃"
  },
  "🥀": {
    "es": "flor marchita",
    "fr": "fleur fanée",
    "de": "welke Blume",
    "ja": "しおれた花",
    "ko": "시든 꽃"
  },
  "🌺": {
    "es": "flor de hibisco",
    "fr": "hibiscus",
    "de": "Hibiskus",
    "ja": "ハイビスカス",
    "ko": "무궁화"
  },
  "🌻": {
    "es": "girasol",
    "fr": "tournesol",
    "de": "Sonnenblume",
    "ja": "ヒマワリ",
    "ko": "해바라기"
  },
  "🌼": {
    "es": "flor",
    "fr": "bourgeon",
    "de": "gelbe Blüte",
    "ja": "開花",
    "ko": "꽃송이"
  },
  "🌷": {
    "es": "tulipán",
    "fr": "tulipe",
    "de": "Tulpe",
    "ja": "チューリップ",
    "ko": "튤립"
  },
  "🪻": {
    "es": "campanilla",
    "fr": "jacinthe",
    "de": "Hyazinthe",
    "ja": "ヒヤシンス",
    "ko": "히아신스"
  },
  "🌱": {
    "es": "planta joven",
    "fr": "jeune pousse",
    "de": "Spross",
    "ja": "新芽",
    "ko": "새싹"
  },
  "🪴": {
    "es": "planta de maceta",
    "fr": "plante en pot",
    "de": "Topfpflanze",
    "ja": "鉢植え",
    "ko": "분재"
  },
  "🌲": {
    "es": "árbol de hoja perenne",
    "fr": "conifère",
    "de": "Nadelbaum",
    "ja": "常緑樹",
    "ko": "소나무"
  },
  "🌳": {
    "es": "árbol de hoja caduca",
    "fr": "arbre à feuilles caduques",
    "de": "Laubbaum",
    "ja": "落葉樹",
    "ko": "나무"
  },
  "🌴": {
    "es": "palmera",
    "fr": "palmier",
    "de": "Palme",
    "ja": "ヤシの木",
    "ko": "야자수"
  },
  "🌵": {
    "es": "cactus",
    "fr": "cactus",
    "de": "Kaktus",
    "ja": "サボテン",
    "ko": "선인장"
  },
  "🌾": {
    "es": "espiga de arroz",
    "fr": "plant de riz",
    "de": "Reisähre",
    "ja": "稲",
    "ko": "벼"
  },
  "🌿": {
    "es": "hierba",
    "fr": "feuille",
    "de": "Kräuter",
    "ja": "ハーブ",
    "ko": "풀"
  },
  "☘️": {
    "es": "trébol",
    "fr": "trèfle",
    "de": "Kleeblatt",
    "ja": "クローバー",
    "ko": "토끼풀"
  },
  "🍀": {
    "es": "trébol de cuatro hojas",
    "fr": "trèfle à quatre feuilles",
    "de": "Glücksklee",
    "ja": "四つ葉のクローバー",
    "ko": "네잎클로버"
  },
  "🍁": {
    "es": "hoja de arce",
    "fr": "feuille d’érable",
    "de": "Ahornblatt",
    "ja": "かえで",
    "ko": "단풍잎"
  },
  "🍂": {
    "es": "hojas caídas",
    "fr": "feuille morte",
    "de": "Laub",
    "ja": "落ち葉",
    "ko": "낙엽"
  },
  "🍃": {
    "es": "hojas revoloteando al viento",
    "fr": "feuille virevoltante",
    "de": "Blätter im Wind",
    "ja": "風に揺れる葉",
    "ko": "바람에 흔들리는 나뭇잎"
  },
  "🪹": {
    "es": "nido vacío",
    "fr": "nid vide",
    "de": "leeres Nest",
    "ja": "空っぽの巣",
    "ko": "빈 둥지"
  },
  "🪺": {
    "es": "nido con huevos",
    "fr": "nid avec œufs",
    "de": "Nest mit Eiern",
    "ja": "鳥の卵と巣",
    "ko": "알이 들어 있는 둥지"
  },
  "🍄": {
    "es": "champiñón",
    "fr": "champignon",
    "de": "Fliegenpilz",
    "ja": "キノコ",
    "ko": "버섯"
  },
  "🪾": {
    "es": "árbol sin hojas",
    "fr": "arbre sans feuille",
    "de": "kahler Baum",
    "ja": "枯れ木",
    "ko": "잎이 없는 나무"
  },
  "🍇": {
    "es": "uvas",
    "fr": "raisin",
    "de": "Trauben",
    "ja": "ぶどう",
    "ko": "포도"
  },
  "🍈": {
    "es": "melón",
    "fr": "melon",
    "de": "Honigmelone",
    "ja": "メロン",
    "ko": "멜론"
  },
  "🍉": {
    "es": "sandía",
    "fr": "pastèque",
    "de": "Wassermelone",
    "ja": "スイカ",
    "ko": "수박"
  },
  "🍊": {
    "es": "mandarina",
    "fr": "mandarine",
    "de": "Mandarine",
    "ja": "みかん",
    "ko": "귤"
  },
  "🍋": {
    "es": "limón",
    "fr": "citron",
    "de": "Zitrone",
    "ja": "レモン",
    "ko": "레몬"
  },
  "🍋‍🟩": {
    "es": "lima",
    "fr": "citron vert",
    "de": "Limette",
    "ja": "ライム",
    "ko": "라임"
  },
  "🍌": {
    "es": "plátano",
    "fr": "banane",
    "de": "Banane",
    "ja": "バナナ",
    "ko": "바나나"
  },
  "🍍": {
    "es": "piña",
    "fr": "ananas",
    "de": "Ananas",
    "ja": "パイナップル",
    "ko": "파인애플"
  },
  "🥭": {
    "es": "mango",
    "fr": "mangue",
    "de": "Mango",
    "ja": "マンゴー",
    "ko": "망고"
  },
  "🍎": {
    "es": "manzana roja",
    "fr": "pomme rouge",
    "de": "roter Apfel",
    "ja": "赤リンゴ",
    "ko": "빨간 사과"
  },
  "🍏": {
    "es": "manzana verde",
    "fr": "pomme verte",
    "de": "grüner Apfel",
    "ja": "青リンゴ",
    "ko": "초록 사과"
  },
  "🍐": {
    "es": "pera",
    "fr": "poire",
    "de": "Birne",
    "ja": "洋ナシ",
    "ko": "배"
  },
  "🍑": {
    "es": "melocotón",
    "fr": "pêche",
    "de": "Pfirsich",
    "ja": "桃",
    "ko": "복숭아"
  },
  "🍒": {
    "es": "cerezas",
    "fr": "cerises",
    "de": "Kirschen",
    "ja": "さくらんぼ",
    "ko": "체리"
  },
  "🍓": {
    "es": "fresa",
    "fr": "fraise",
    "de": "Erdbeere",
    "ja": "いちご",
    "ko": "딸기"
  },
  "🫐": {
    "es": "arándanos",
    "fr": "myrtilles",
    "de": "Blaubeeren",
    "ja": "ブルーベリー",
    "ko": "블루베리"
  },
  "🥝": {
    "es": "kiwi",
    "fr": "kiwi",
    "de": "Kiwi",
    "ja": "キウイフルーツ",
    "ko": "키위"
  },
  "🍅": {
    "es": "tomate",
    "fr": "tomate",
    "de": "Tomate",
    "ja": "トマト",
    "ko": "토마토"
  },
  "🫒": {
    "es": "aceituna",
    "fr": "olive",
    "de": "Olive",
    "ja": "オリーブ",
    "ko": "올리브"
  },
  "🥥": {
    "es": "coco",
    "fr": "noix de coco",
    "de": "Kokosnuss",
    "ja": "ココナツ",
    "ko": "코코넛"
  },
  "🥑": {
    "es": "aguacate",
    "fr": "avocat",
    "de": "Avocado",
    "ja": "アボカド",
    "ko": "아보카도"
  },
  "🍆": {
    "es": "berenjena",
    "fr": "aubergine",
    "de": "Aubergine",
    "ja": "ナス",
    "ko": "가지"
  },
  "🥔": {
    "es": "patata",
    "fr": "pomme de terre",
    "de": "Kartoffel",
    "ja": "ジャガイモ",
    "ko": "감자"
  },
  "🥕": {
    "es": "zanahoria",
    "fr": "carotte",
    "de": "Karotte",
    "ja": "人参",
    "ko": "당근"
  },
  "🌽": {
    "es": "espiga de maíz",
    "fr": "épi de maïs",
    "de": "Maiskolben",
    "ja": "とうもろこし",
    "ko": "옥수수"
  },
  "🌶️": {
    "es": "chile picante",
    "fr": "piment rouge",
    "de": "Peperoni",
    "ja": "とうがらし",
    "ko": "홍고추"
  },
  "🫑": {
    "es": "pimiento",
    "fr": "poivron",
    "de": "Paprika",
    "ja": "ピーマン",
    "ko": "피망"
  },
  "🥒": {
    "es": "pepino",
    "fr": "concombre",
    "de": "Gurke",
    "ja": "キュウリ",
    "ko": "오이"
  },
  "🥬": {
    "es": "verdura de hoja verde",
    "fr": "légume à feuilles vertes",
    "de": "Blattgemüse",
    "ja": "葉野菜",
    "ko": "녹색 채소"
  },
  "🥦": {
    "es": "brócoli",
    "fr": "brocoli",
    "de": "Brokkoli",
    "ja": "ブロッコリー",
    "ko": "브로콜리"
  },
  "🧄": {
    "es": "ajo",
    "fr": "ail",
    "de": "Knoblauch",
    "ja": "ニンニク",
    "ko": "마늘"
  },
  "🧅": {
    "es": "cebolla",
    "fr": "oignon",
    "de": "Zwiebel",
    "ja": "タマネギ",
    "ko": "양파"
  },
  "🥜": {
    "es": "cacahuetes",
    "fr": "cacahuètes",
    "de": "Erdnuss",
    "ja": "ピーナッツ",
    "ko": "땅콩"
  },
  "🫘": {
    "es": "alubias",
    "fr": "haricots",
    "de": "Bohnen",
    "ja": "豆",
    "ko": "콩"
  },
  "🌰": {
    "es": "castaña",
    "fr": "châtaigne",
    "de": "Kastanie",
    "ja": "くり",
    "ko": "밤"
  },
  "🫚": {
    "es": "raíz de jengibre",
    "fr": "racine de gingembre",
    "de": "Ingwer",
    "ja": "ショウガ",
    "ko": "생강 뿌리"
  },
  "🫛": {
    "es": "vaina",
    "fr": "cosse de petits pois",
    "de": "Erbsenschote",
    "ja": "エンドウ豆",
    "ko": "완두콩 꼬투리"
  },
  "🍄‍🟫": {
    "es": "champiñón marrón",
    "fr": "champignon marron",
    "de": "brauner Pilz",
    "ja": "きのこ",
    "ko": "갈색 양송이 버섯"
  },
  "🫜": {
    "es": "túberculo comestible",
    "fr": "légume-racine",
    "de": "Wurzelgemüse",
    "ja": "根菜",
    "ko": "뿌리채소"
  },
  "🍞": {
    "es": "pan de molde",
    "fr": "pain",
    "de": "Brot",
    "ja": "食パン",
    "ko": "빵"
  },
  "🥐": {
    "es": "cruasán",
    "fr": "croissant",
    "de": "Croissant",
    "ja": "クロワッサン",
    "ko": "크루아상"
  },
  "🥖": {
    "es": "baguete",
    "fr": "baguette",
    "de": "Baguette",
    "ja": "バゲット",
    "ko": "바게트"
  },
  "🫓": {
    "es": "pan sin levadura",
    "fr": "galette",
    "de": "Fladenbrot",
    "ja": "フラットブレッド",
    "ko": "플랫브레드"
  },
  "🥨": {
    "es": "bretzel",
    "fr": "bretzel",
    "de": "Brezel",
    "ja": "プレッツェル",
    "ko": "프레첼"
  },
  "🥯": {
    "es": "bagel",
    "fr": "bagel",
    "de": "Bagel",
    "ja": "ベーグル",
    "ko": "베이글"
  },
  "🥞": {
    "es": "tortitas",
    "fr": "pancakes",
    "de": "Pfannkuchen",
    "ja": "パンケーキ",
    "ko": "팬케이크"
  },
  "🧇": {
    "es": "gofre",
    "fr": "gaufre",
    "de": "Waffel",
    "ja": "ワッフル",
    "ko": "와플"
  },
  "🧀": {
    "es": "cuña de queso",
    "fr": "part de fromage",
    "de": "Käsestück",
    "ja": "チーズ",
    "ko": "치즈 조각"
  },
  "🍖": {
    "es": "carne con hueso",
    "fr": "viande sur un os",
    "de": "Fleischhachse",
    "ja": "骨付き肉",
    "ko": "고기"
  },
  "🍗": {
    "es": "muslo de pollo",
    "fr": "cuisse de poulet",
    "de": "Hähnchenschenkel",
    "ja": "鶏もも肉",
    "ko": "닭다리"
  },
  "🥩": {
    "es": "corte de carne",
    "fr": "morceau de viande",
    "de": "Fleischstück",
    "ja": "ステーキ肉",
    "ko": "고깃덩이"
  },
  "🥓": {
    "es": "beicon",
    "fr": "lard",
    "de": "Bacon",
    "ja": "ベーコン",
    "ko": "베이컨"
  },
  "🍔": {
    "es": "hamburguesa",
    "fr": "hamburger",
    "de": "Hamburger",
    "ja": "ハンバーガー",
    "ko": "햄버거"
  },
  "🍟": {
    "es": "patatas fritas",
    "fr": "frites",
    "de": "Pommes frites",
    "ja": "フライドポテト",
    "ko": "감자튀김"
  },
  "🍕": {
    "es": "pizza",
    "fr": "pizza",
    "de": "Pizza",
    "ja": "ピザ",
    "ko": "피자"
  },
  "🌭": {
    "es": "perrito caliente",
    "fr": "hot dog",
    "de": "Hotdog",
    "ja": "ホットドッグ",
    "ko": "핫도그"
  },
  "🥪": {
    "es": "sándwich",
    "fr": "sandwich",
    "de": "Sandwich",
    "ja": "サンドイッチ",
    "ko": "샌드위치"
  },
  "🌮": {
    "es": "taco",
    "fr": "taco",
    "de": "Taco",
    "ja": "タコス",
    "ko": "타코"
  },
  "🌯": {
    "es": "burrito",
    "fr": "burrito",
    "de": "Burrito",
    "ja": "ブリトー",
    "ko": "부리또"
  },
  "🫔": {
    "es": "tamal",
    "fr": "tamal",
    "de": "Tamale",
    "ja": "タマル",
    "ko": "타말레"
  },
  "🥙": {
    "es": "pan relleno",
    "fr": "kebab",
    "de": "Döner",
    "ja": "ケバブサンド",
    "ko": "밀전병에 싼 요리"
  },
  "🧆": {
    "es": "falafel",
    "fr": "falafels",
    "de": "Falafel",
    "ja": "ファラフェル",
    "ko": "팔라펠"
  },
  "🥚": {
    "es": "huevo",
    "fr": "œuf",
    "de": "Ei",
    "ja": "卵",
    "ko": "달걀"
  },
  "🍳": {
    "es": "cocinar",
    "fr": "œuf au plat",
    "de": "Spiegelei in Bratpfanne",
    "ja": "料理",
    "ko": "프라이팬"
  },
  "🥢": {
    "es": "palillos",
    "fr": "baguettes",
    "de": "Essstäbchen",
    "ja": "はし",
    "ko": "젓가락"
  },
  "🍽️": {
    "es": "cuchillo y tenedor con un plato",
    "fr": "fourchette et couteau avec assiette",
    "de": "Teller mit Messer und Gabel",
    "ja": "ナイフとフォークと皿",
    "ko": "포크와 나이프가 있는 접시"
  },
  "🍴": {
    "es": "tenedor y cuchillo",
    "fr": "fourchette et couteau",
    "de": "Messer und Gabel",
    "ja": "ナイフとフォーク",
    "ko": "포크와 나이프"
  },
  "🥄": {
    "es": "cuchara",
    "fr": "cuillère",
    "de": "Löffel",
    "ja": "スプーン",
    "ko": "숟가락"
  },
  "🔪": {
    "es": "cuchillo de cocina",
    "fr": "couteau de cuisine",
    "de": "Küchenmesser",
    "ja": "包丁",
    "ko": "식칼"
  },
  "🥘": {
    "es": "paella",
    "fr": "plat mitonné",
    "de": "Pfannengericht",
    "ja": "パエリア",
    "ko": "납작한 냄비"
  },
  "🍲": {
    "es": "olla de comida",
    "fr": "marmite",
    "de": "Topf mit Essen",
    "ja": "なべ",
    "ko": "국"
  },
  "🫕": {
    "es": "fondue",
    "fr": "fondue",
    "de": "Fondue",
    "ja": "フォンデュ",
    "ko": "퐁듀"
  },
  "🥣": {
    "es": "cuenco con cuchara",
    "fr": "bol avec cuillère",
    "de": "Schüssel mit Löffel",
    "ja": "ボウルとスプーン",
    "ko": "스푼과 사발"
  },
  "🥗": {
    "es": "ensalada",
    "fr": "salade verte",
    "de": "Salat",
    "ja": "グリーンサラダ",
    "ko": "야채샐러드"
  },
  "🍿": {
    "es": "palomitas",
    "fr": "pop-corn",
    "de": "Popcorn",
    "ja": "ポップコーン",
    "ko": "팝콘"
  },
  "🧈": {
    "es": "mantequilla",
    "fr": "beurre",
    "de": "Butter",
    "ja": "バター",
    "ko": "버터"
  },
  "🧂": {
    "es": "sal",
    "fr": "sel",
    "de": "Salz",
    "ja": "塩",
    "ko": "소금"
  },
  "🥫": {
    "es": "comida enlatada",
    "fr": "aliments en conserve",
    "de": "Konserve",
    "ja": "缶詰",
    "ko": "통조림"
  },
  "🫙": {
    "es": "tarro",
    "fr": "bocal",
    "de": "Einmachglas",
    "ja": "瓶",
    "ko": "작은 병"
  },
  "🏺": {
    "es": "ánfora",
    "fr": "amphore",
    "de": "Amphore",
    "ja": "壺",
    "ko": "암포라"
  },
  "🍱": {
    "es": "caja de bento",
    "fr": "boîte déjeuner",
    "de": "Bento-Box",
    "ja": "弁当",
    "ko": "도시락"
  },
  "🍘": {
    "es": "galleta de arroz",
    "fr": "galette de riz",
    "de": "Reiscracker",
    "ja": "せんべい",
    "ko": "주먹밥"
  },
  "🍙": {
    "es": "bola de arroz",
    "fr": "boulette de riz",
    "de": "Reisbällchen",
    "ja": "おにぎり",
    "ko": "삼각 김밥"
  },
  "🍚": {
    "es": "arroz cocido",
    "fr": "bol de riz",
    "de": "Reis in Schüssel",
    "ja": "ごはん",
    "ko": "밥"
  },
  "🍛": {
    "es": "arroz con curry",
    "fr": "riz au curry",
    "de": "Reis mit Curry",
    "ja": "カレーライス",
    "ko": "카레라이스"
  },
  "🍜": {
    "es": "tazón de fideos",
    "fr": "bol fumant",
    "de": "Schüssel und Essstäbchen",
    "ja": "ラーメン",
    "ko": "국수"
  },
  "🍝": {
    "es": "espagueti",
    "fr": "spaghetti",
    "de": "Spaghetti",
    "ja": "スパゲッティ",
    "ko": "스파게티"
  },
  "🍠": {
    "es": "patata asada",
    "fr": "patate douce",
    "de": "geröstete Süßkartoffel",
    "ja": "焼き芋",
    "ko": "고구마"
  },
  "🍢": {
    "es": "brocheta",
    "fr": "brochette de poisson",
    "de": "Oden",
    "ja": "おでん",
    "ko": "오뎅"
  },
  "🍣": {
    "es": "sushi",
    "fr": "sushi",
    "de": "Sushi",
    "ja": "すし",
    "ko": "초밥"
  },
  "🍤": {
    "es": "gamba frita",
    "fr": "beignet de crevette",
    "de": "frittierte Garnele",
    "ja": "エビフライ",
    "ko": "새우튀김"
  },
  "🍥": {
    "es": "pastel de pescado japonés",
    "fr": "croquette de poisson",
    "de": "Fischfrikadelle",
    "ja": "なると",
    "ko": "어묵"
  },
  "🥮": {
    "es": "pastel de luna",
    "fr": "gâteau de lune",
    "de": "Mondkuchen",
    "ja": "月餅",
    "ko": "월병"
  },
  "🍡": {
    "es": "dango",
    "fr": "brochette de bonbons",
    "de": "Dango",
    "ja": "だんご",
    "ko": "떡꼬치"
  },
  "🥟": {
    "es": "dumpling",
    "fr": "boulette de pâte",
    "de": "Teigtasche",
    "ja": "点心",
    "ko": "만두"
  },
  "🥠": {
    "es": "galleta de la fortuna",
    "fr": "biscuit chinois",
    "de": "Glückskeks",
    "ja": "フォーチュンクッキー",
    "ko": "포츈 쿠키"
  },
  "🥡": {
    "es": "caja para llevar",
    "fr": "boîte à emporter",
    "de": "Takeaway-Schachtel",
    "ja": "テイクアウト弁当",
    "ko": "테이크아웃 상자"
  },
  "🍦": {
    "es": "cucurucho de helado",
    "fr": "glace italienne",
    "de": "Softeis",
    "ja": "ソフトクリーム",
    "ko": "소프트 아이스크림"
  },
  "🍧": {
    "es": "granizado hawaiano",
    "fr": "granité",
    "de": "Wassereis",
    "ja": "かき氷",
    "ko": "샤베트 아이스크림"
  },
  "🍨": {
    "es": "helado",
    "fr": "glace",
    "de": "Eiscreme",
    "ja": "アイスクリーム",
    "ko": "아이스크림"
  },
  "🍩": {
    "es": "dónut",
    "fr": "doughnut",
    "de": "Donut",
    "ja": "ドーナツ",
    "ko": "도넛"
  },
  "🍪": {
    "es": "galleta",
    "fr": "cookie",
    "de": "Keks",
    "ja": "クッキー",
    "ko": "쿠키"
  },
  "🎂": {
    "es": "tarta de cumpleaños",
    "fr": "gâteau d’anniversaire",
    "de": "Geburtstagskuchen",
    "ja": "バースデーケーキ",
    "ko": "생일 케이크"
  },
  "🍰": {
    "es": "trozo de tarta",
    "fr": "gâteau sablé",
    "de": "Torte",
    "ja": "ショートケーキ",
    "ko": "조각 케익"
  },
  "🧁": {
    "es": "magdalena",
    "fr": "cupcake",
    "de": "Cupcake",
    "ja": "カップケーキ",
    "ko": "컵케이크"
  },
  "🥧": {
    "es": "pastel",
    "fr": "tarte",
    "de": "Kuchen",
    "ja": "パイ",
    "ko": "파이"
  },
  "🍫": {
    "es": "tableta de chocolate",
    "fr": "barre chocolatée",
    "de": "Schokoladentafel",
    "ja": "チョコレート",
    "ko": "초콜렛"
  },
  "🍬": {
    "es": "caramelo",
    "fr": "bonbon",
    "de": "Bonbon",
    "ja": "キャンディ",
    "ko": "사탕"
  },
  "🍭": {
    "es": "piruleta",
    "fr": "sucette",
    "de": "Lutscher",
    "ja": "ぺろぺろキャンディ",
    "ko": "롤리팝"
  },
  "🍮": {
    "es": "flan",
    "fr": "crème renversée",
    "de": "Pudding",
    "ja": "プリン",
    "ko": "커스타드 푸딩"
  },
  "🍯": {
    "es": "tarro de miel",
    "fr": "pot de miel",
    "de": "Honigtopf",
    "ja": "はちみつ",
    "ko": "꿀"
  },
  "🍼": {
    "es": "biberón",
    "fr": "biberon",
    "de": "Babyflasche",
    "ja": "ほにゅう瓶",
    "ko": "젖병"
  },
  "🥛": {
    "es": "vaso de leche",
    "fr": "verre de lait",
    "de": "Glas Milch",
    "ja": "牛乳入りのコップ",
    "ko": "우유 한잔"
  },
  "☕️": {
    "es": "bebida caliente",
    "fr": "boisson chaude",
    "de": "Heißgetränk",
    "ja": "温かい飲み物",
    "ko": "뜨거운 음료"
  },
  "🫖": {
    "es": "tetera",
    "fr": "théière",
    "de": "Teekanne",
    "ja": "ティーポット",
    "ko": "찻주전자"
  },
  "🍵": {
    "es": "tazón de té",
    "fr": "tasse",
    "de": "Teetasse ohne Henkel",
    "ja": "湯飲み",
    "ko": "차"
  },
  "🍶": {
    "es": "sake",
    "fr": "saké",
    "de": "Sake-Flasche mit Tasse",
    "ja": "徳利",
    "ko": "사케"
  },
  "🍾": {
    "es": "botella descorchada",
    "fr": "bouteille de champagne",
    "de": "Flasche mit knallendem Korken",
    "ja": "シャンパン",
    "ko": "코르크가 튀어나오고 있는 병"
  },
  "🍷": {
    "es": "copa de vino",
    "fr": "verre de vin",
    "de": "Weinglas",
    "ja": "ワイングラス",
    "ko": "와인잔"
  },
  "🍸": {
    "es": "copa de cóctel",
    "fr": "cocktail",
    "de": "Cocktailglas",
    "ja": "カクテルグラス",
    "ko": "칵테일"
  },
  "🍹": {
    "es": "bebida tropical",
    "fr": "cocktail tropical",
    "de": "Cocktail",
    "ja": "トロピカルドリンク",
    "ko": "음료수"
  },
  "🍺": {
    "es": "jarra de cerveza",
    "fr": "chope",
    "de": "Bierkrug",
    "ja": "ビールジョッキ",
    "ko": "맥주잔"
  },
  "🍻": {
    "es": "jarras de cerveza brindando",
    "fr": "chopes de bière",
    "de": "Bierkrüge",
    "ja": "ビールで乾杯",
    "ko": "맥주"
  },
  "🥂": {
    "es": "copas brindando",
    "fr": "trinquer",
    "de": "Sektgläser",
    "ja": "グラスで乾杯",
    "ko": "건배하는 샴페인 잔"
  },
  "🥃": {
    "es": "vaso de whisky",
    "fr": "verre tumbler",
    "de": "Trinkglas",
    "ja": "タンブラーグラス",
    "ko": "양주잔"
  },
  "🫗": {
    "es": "líquido derramándose",
    "fr": "verser un liquide",
    "de": "Flüssigkeit ausgießen",
    "ja": "コップから注ぐ",
    "ko": "쏟아져 나오는 액체"
  },
  "🥤": {
    "es": "vaso con pajita",
    "fr": "gobelet avec paille",
    "de": "Becher mit Strohhalm",
    "ja": "ストローカップ",
    "ko": "빨대와 컵"
  },
  "🧋": {
    "es": "té de burbujas",
    "fr": "thé aux perles",
    "de": "Bubble Tea",
    "ja": "タピオカドリンク",
    "ko": "버블티"
  },
  "🧃": {
    "es": "tetrabrik",
    "fr": "briquette de jus",
    "de": "Trinkpäckchen",
    "ja": "紙パック飲料",
    "ko": "음료 팩"
  },
  "🧉": {
    "es": "mate",
    "fr": "maté",
    "de": "Mate-Tee",
    "ja": "マテ茶",
    "ko": "마테차"
  },
  "🧊": {
    "es": "cubito de hielo",
    "fr": "glaçon",
    "de": "Eiswürfel",
    "ja": "角氷",
    "ko": "얼음"
  },
  "🪐": {
    "es": "planeta con anillos",
    "fr": "planète à anneaux",
    "de": "Ringplanet",
    "ja": "環のある惑星",
    "ko": "고리가 있는 행성"
  },
  "⭐️": {
    "es": "estrella",
    "fr": "étoile",
    "de": "weißer mittelgroßer Stern",
    "ja": "スター",
    "ko": "별"
  },
  "🌟": {
    "es": "estrella brillante",
    "fr": "étoile brillante",
    "de": "funkelnder Stern",
    "ja": "きらきら星",
    "ko": "반짝이는 별"
  },
  "🌠": {
    "es": "estrella fugaz",
    "fr": "étoile filante",
    "de": "Sternschnuppe",
    "ja": "流れ星",
    "ko": "별똥별"
  },
  "🌌": {
    "es": "Vía Láctea",
    "fr": "voie lactée",
    "de": "Milchstraße",
    "ja": "天の川",
    "ko": "은하수"
  },
  "☁️": {
    "es": "nube",
    "fr": "nuage",
    "de": "Wolke",
    "ja": "雲",
    "ko": "구름"
  },
  "⛅️": {
    "es": "sol detrás de una nube",
    "fr": "soleil derrière les nuages",
    "de": "Sonne hinter Wolke",
    "ja": "曇り時々晴れ",
    "ko": "구름 뒤의 해"
  },
  "⛈️": {
    "es": "nube con rayo y lluvia",
    "fr": "nuage avec éclair et pluie",
    "de": "Wolke mit Blitz und Regen",
    "ja": "雷雨",
    "ko": "번개가 치는 비구름"
  },
  "🌤️": {
    "es": "sol detrás de una nube pequeña",
    "fr": "soleil derrière un petit nuage",
    "de": "Sonne hinter kleiner Wolke",
    "ja": "晴れ時々曇り",
    "ko": "작은 구름 뒤의 태양"
  },
  "🌥️": {
    "es": "sol detrás de una nube grande",
    "fr": "soleil derrière un gros nuage",
    "de": "Sonne hinter großer Wolke",
    "ja": "曇り一時晴れ",
    "ko": "큰 구름 뒤의 태양"
  },
  "🌦️": {
    "es": "sol detrás de una nube con lluvia",
    "fr": "soleil derrière un nuage de pluie",
    "de": "Sonne hinter Regenwolke",
    "ja": "雨時々晴れ",
    "ko": "비구름 뒤의 태양"
  },
  "🌧️": {
    "es": "nube con lluvia",
    "fr": "nuage avec pluie",
    "de": "Wolke mit Regen",
    "ja": "雨雲",
    "ko": "비구름"
  },
  "🌨️": {
    "es": "nube con nieve",
    "fr": "nuage avec neige",
    "de": "Wolke mit Schnee",
    "ja": "雪雲",
    "ko": "눈구름"
  },
  "🌩️": {
    "es": "nube con rayo",
    "fr": "nuage avec éclair",
    "de": "Wolke mit Blitz",
    "ja": "雷雲",
    "ko": "번개구름"
  },
  "🌪️": {
    "es": "tornado",
    "fr": "tornade",
    "de": "Wirbelsturm",
    "ja": "竜巻",
    "ko": "토네이도"
  },
  "🌫️": {
    "es": "niebla",
    "fr": "brouillard",
    "de": "Nebel",
    "ja": "霧",
    "ko": "안개"
  },
  "🌬️": {
    "es": "cara de viento",
    "fr": "vent avec visage",
    "de": "Wind",
    "ja": "顔のある風",
    "ko": "얼굴이 있는 바람"
  },
  "🌀": {
    "es": "ciclón",
    "fr": "cyclone",
    "de": "Wirbel",
    "ja": "渦巻き",
    "ko": "태풍"
  },
  "🌈": {
    "es": "arcoíris",
    "fr": "arc-en-ciel",
    "de": "Regenbogen",
    "ja": "虹",
    "ko": "무지개"
  },
  "🌂️": {
    "es": "paraguas cerrado",
    "fr": "parapluie fermé",
    "de": "geschlossener Regenschirm",
    "ja": "閉じた傘",
    "ko": "접힌 우산"
  },
  "☂️": {
    "es": "paraguas",
    "fr": "parapluie ouvert",
    "de": "Regenschirm",
    "ja": "傘",
    "ko": "우산"
  },
  "☔️": {
    "es": "paraguas con gotas de lluvia",
    "fr": "parapluie avec gouttes de pluie",
    "de": "Regenschirm im Regen",
    "ja": "傘と雨",
    "ko": "빗방울이 있는 우산"
  },
  "⚡️": {
    "es": "alto voltaje",
    "fr": "haute tension",
    "de": "Hochspannung",
    "ja": "高電圧",
    "ko": "고압 주의"
  },
  "❄️": {
    "es": "copo de nieve",
    "fr": "flocon",
    "de": "Schneeflocke",
    "ja": "雪の結晶",
    "ko": "눈송이"
  },
  "⛄️": {
    "es": "muñeco de nieve",
    "fr": "bonhomme de neige sans neige",
    "de": "Schneemann ohne Schneeflocken",
    "ja": "雪だるま",
    "ko": "스노우맨"
  },
  "☄️": {
    "es": "meteorito",
    "fr": "comète",
    "de": "Komet",
    "ja": "彗星",
    "ko": "혜성"
  },
  "🔥️": {
    "es": "fuego",
    "fr": "feu",
    "de": "Feuer",
    "ja": "火",
    "ko": "불"
  },
  "💧️": {
    "es": "gota",
    "fr": "goutte d’eau",
    "de": "Tropfen",
    "ja": "水滴",
    "ko": "물방울"
  },
  "🌊️": {
    "es": "ola de mar",
    "fr": "vague",
    "de": "Welle",
    "ja": "波",
    "ko": "파도"
  },
  "🏔️": {
    "es": "montaña con nieve",
    "fr": "montagne enneigée",
    "de": "schneebedeckter Berg",
    "ja": "雪山",
    "ko": "눈 덮인 산"
  },
  "⛰️": {
    "es": "montaña",
    "fr": "montagne",
    "de": "Berg",
    "ja": "山",
    "ko": "산"
  },
  "🌋": {
    "es": "volcán",
    "fr": "volcan",
    "de": "Vulkan",
    "ja": "火山",
    "ko": "화산"
  },
  "🗻": {
    "es": "monte Fuji",
    "fr": "mont Fuji",
    "de": "Fuji",
    "ja": "富士山",
    "ko": "후지산"
  },
  "🏕️": {
    "es": "camping",
    "fr": "camping",
    "de": "Camping",
    "ja": "キャンプ",
    "ko": "캠핑"
  },
  "🏖️": {
    "es": "playa y sombrilla",
    "fr": "plage avec parasol",
    "de": "Strand mit Sonnenschirm",
    "ja": "ビーチパラソル",
    "ko": "파라솔이 있는 해변"
  },
  "🏜️": {
    "es": "desierto",
    "fr": "désert",
    "de": "Wüste",
    "ja": "砂漠",
    "ko": "사막"
  },
  "🏝️": {
    "es": "isla desierta",
    "fr": "île déserte",
    "de": "einsame Insel",
    "ja": "無人島",
    "ko": "사막 섬"
  },
  "🏞️": {
    "es": "parque nacional",
    "fr": "parc national",
    "de": "Nationalpark",
    "ja": "国立公園",
    "ko": "국립공원"
  },
  "🏟️": {
    "es": "estadio",
    "fr": "stade",
    "de": "Stadion",
    "ja": "競技場",
    "ko": "경기장"
  },
  "🌃": {
    "es": "noche estrellada",
    "fr": "nuit étoilée",
    "de": "Sternenhimmel",
    "ja": "夜の都会",
    "ko": "밤하늘 별"
  },
  "🏙️": {
    "es": "paisaje urbano",
    "fr": "ville",
    "de": "Skyline",
    "ja": "高層ビル",
    "ko": "도시 전경"
  },
  "🌄": {
    "es": "amanecer sobre montañas",
    "fr": "soleil levant derrière les montagnes",
    "de": "Sonnenaufgang über Bergen",
    "ja": "山から日の出",
    "ko": "산에서 떠오르는 해"
  },
  "🌅": {
    "es": "amanecer",
    "fr": "soleil levant",
    "de": "Sonnenaufgang über dem Meer",
    "ja": "日の出",
    "ko": "일출"
  },
  "🌆": {
    "es": "ciudad al atardecer",
    "fr": "ville au crépuscule",
    "de": "Abendstimmung in der Stadt",
    "ja": "夕暮れの都会",
    "ko": "도시 야경"
  },
  "🌇": {
    "es": "puesta del sol",
    "fr": "coucher de soleil",
    "de": "Sonnenuntergang in der Stadt",
    "ja": "夕日",
    "ko": "일몰"
  },
  "🌉": {
    "es": "puente de noche",
    "fr": "pont de nuit",
    "de": "Brücke vor Nachthimmel",
    "ja": "夜の橋",
    "ko": "밤하늘을 배경으로 하는 다리"
  },
  "♨️": {
    "es": "aguas termales",
    "fr": "sources chaudes",
    "de": "heiße Quellen",
    "ja": "温泉マーク",
    "ko": "온천"
  },
  "🎠": {
    "es": "caballo de tiovivo",
    "fr": "cheval de manège",
    "de": "Karussellpferd",
    "ja": "メリーゴーランド",
    "ko": "회전 목마"
  },
  "🏛️": {
    "es": "edificio clásico",
    "fr": "monument classique",
    "de": "antikes Gebäude",
    "ja": "歴史的な建物",
    "ko": "고전 양식의 건축물"
  },
  "🏗️": {
    "es": "construcción",
    "fr": "construction d’un bâtiment",
    "de": "Kran",
    "ja": "建設中",
    "ko": "건물 공사"
  },
  "🧱": {
    "es": "ladrillo",
    "fr": "brique",
    "de": "Ziegelstein",
    "ja": "れんが",
    "ko": "벽돌"
  },
  "🪨": {
    "es": "piedra",
    "fr": "rocher",
    "de": "Felsen",
    "ja": "岩石",
    "ko": "바위"
  },
  "🪵": {
    "es": "madera",
    "fr": "bois",
    "de": "Holz",
    "ja": "丸太",
    "ko": "목재"
  },
  "🛖": {
    "es": "cabaña",
    "fr": "hutte",
    "de": "Hütte",
    "ja": "わらぶき小屋",
    "ko": "오두막"
  },
  "🏘️": {
    "es": "casas",
    "fr": "maisons",
    "de": "Wohnhäuser",
    "ja": "住宅街",
    "ko": "주택 건물"
  },
  "🏚️": {
    "es": "casa abandonada",
    "fr": "maison abandonnée",
    "de": "verfallenes Haus",
    "ja": "廃屋",
    "ko": "낡은 주택 건물"
  },
  "🏠": {
    "es": "casa",
    "fr": "maison",
    "de": "Haus",
    "ja": "家",
    "ko": "집"
  },
  "🏡": {
    "es": "casa con jardín",
    "fr": "maison avec jardin",
    "de": "Haus mit Garten",
    "ja": "庭付きの家",
    "ko": "정원이 있는 집"
  },
  "🏢": {
    "es": "edificio de oficinas",
    "fr": "immeuble de bureaux",
    "de": "Bürogebäude",
    "ja": "オフィスビル",
    "ko": "빌딩"
  },
  "🏣": {
    "es": "oficina de correos japonesa",
    "fr": "bureau de poste japonais",
    "de": "japanisches Postgebäude",
    "ja": "郵便局",
    "ko": "일본 우체국"
  },
  "🏤": {
    "es": "oficina de correos europea",
    "fr": "bureau de poste",
    "de": "Postgebäude",
    "ja": "西洋の郵便局",
    "ko": "우체국"
  },
  "🏥": {
    "es": "hospital",
    "fr": "hôpital",
    "de": "Krankenhaus",
    "ja": "病院",
    "ko": "병원"
  },
  "🏦": {
    "es": "banco",
    "fr": "banque",
    "de": "Bank",
    "ja": "銀行",
    "ko": "은행"
  },
  "🏨": {
    "es": "hotel",
    "fr": "hôtel",
    "de": "Hotel",
    "ja": "ホテル",
    "ko": "호텔"
  },
  "🏩": {
    "es": "hotel del amor",
    "fr": "love hotel",
    "de": "Stundenhotel",
    "ja": "ラブホテル",
    "ko": "모텔"
  },
  "🏪": {
    "es": "tienda 24 horas",
    "fr": "supérette",
    "de": "Minimarkt",
    "ja": "コンビニ",
    "ko": "편의점"
  },
  "🏫": {
    "es": "colegio",
    "fr": "école",
    "de": "Schule",
    "ja": "学校",
    "ko": "학교"
  },
  "🏬": {
    "es": "grandes almacenes",
    "fr": "grand magasin",
    "de": "Kaufhaus",
    "ja": "デパート",
    "ko": "백화점"
  },
  "🏭": {
    "es": "fábrica",
    "fr": "usine",
    "de": "Fabrik",
    "ja": "工場",
    "ko": "공장"
  },
  "🏯": {
    "es": "castillo japonés",
    "fr": "château japonais",
    "de": "japanisches Schloss",
    "ja": "城",
    "ko": "일본 성"
  },
  "🏰": {
    "es": "castillo europeo",
    "fr": "château",
    "de": "Schloss",
    "ja": "西洋の城",
    "ko": "유럽 성"
  },
  "💒": {
    "es": "iglesia celebrando boda",
    "fr": "mariage",
    "de": "Hochzeit",
    "ja": "結婚式",
    "ko": "결혼식"
  },
  "🗼️": {
    "es": "Torre de Tokio",
    "fr": "tour de Tokyo",
    "de": "Tokyo Tower",
    "ja": "東京タワー",
    "ko": "도쿄 타워"
  },
  "🗽️": {
    "es": "Estatua de la Libertad",
    "fr": "statue de la Liberté",
    "de": "Freiheitsstatue",
    "ja": "自由の女神",
    "ko": "자유의 여신상"
  },
  "⛪️": {
    "es": "iglesia",
    "fr": "église",
    "de": "Kirche",
    "ja": "教会",
    "ko": "교회"
  },
  "🕌": {
    "es": "mezquita",
    "fr": "mosquée",
    "de": "Moschee",
    "ja": "モスク",
    "ko": "모스크"
  },
  "🛕": {
    "es": "templo hindú",
    "fr": "temple hindou",
    "de": "Hindutempel",
    "ja": "ヒンドゥー教の寺院",
    "ko": "힌두교 사원"
  },
  "🕍": {
    "es": "sinagoga",
    "fr": "synagogue",
    "de": "Synagoge",
    "ja": "シナゴーグ",
    "ko": "시나고그"
  },
  "⛩️": {
    "es": "santuario sintoísta",
    "fr": "sanctuaire shinto",
    "de": "Shinto-Schrein",
    "ja": "鳥居",
    "ko": "신토 신사"
  },
  "🕋": {
    "es": "Kaaba",
    "fr": "kaaba",
    "de": "Kaaba",
    "ja": "カーバ",
    "ko": "카바"
  },
  "⛲️": {
    "es": "fuente",
    "fr": "fontaine",
    "de": "Springbrunnen",
    "ja": "噴水",
    "ko": "분수"
  },
  "⛺️": {
    "es": "tienda de campaña",
    "fr": "tente",
    "de": "Zelt",
    "ja": "テント",
    "ko": "텐트"
  },
  "🛝": {
    "es": "tobogán",
    "fr": "toboggan",
    "de": "Spielplatzrutsche",
    "ja": "すべり台",
    "ko": "미끄럼틀"
  },
  "🎡": {
    "es": "noria de feria",
    "fr": "grande roue",
    "de": "Riesenrad",
    "ja": "観覧車",
    "ko": "관람차"
  },
  "🎢": {
    "es": "montaña rusa",
    "fr": "montagnes russes",
    "de": "Achterbahn",
    "ja": "ジェットコースター",
    "ko": "롤러코스터"
  },
  "💈": {
    "es": "poste de barbero",
    "fr": "enseigne de barbier",
    "de": "Barbershop-Säule",
    "ja": "床屋",
    "ko": "이발소"
  },
  "🎪": {
    "es": "carpa de circo",
    "fr": "chapiteau",
    "de": "Zirkuszelt",
    "ja": "サーカス",
    "ko": "서커스"
  },
  "🚂": {
    "es": "locomotora de vapor",
    "fr": "locomotive",
    "de": "Dampflokomotive",
    "ja": "蒸気機関車",
    "ko": "기관차"
  },
  "🚃": {
    "es": "vagón",
    "fr": "wagon",
    "de": "Eisenbahnwagen",
    "ja": "電車",
    "ko": "전철"
  },
  "🚄": {
    "es": "tren de alta velocidad",
    "fr": "TGV",
    "de": "Hochgeschwindigkeitszug mit spitzer Nase",
    "ja": "新幹線",
    "ko": "고속열차"
  },
  "🚅": {
    "es": "tren bala",
    "fr": "train à grande vitesse",
    "de": "Hochgeschwindigkeitszug",
    "ja": "0系新幹線",
    "ko": "고속철"
  },
  "🚆": {
    "es": "tren",
    "fr": "train",
    "de": "Zug",
    "ja": "電車正面",
    "ko": "기차"
  },
  "🚇": {
    "es": "metro",
    "fr": "métro",
    "de": "U-Bahn",
    "ja": "地下鉄",
    "ko": "지하철"
  },
  "🚈": {
    "es": "tren ligero",
    "fr": "métro léger",
    "de": "S-Bahn",
    "ja": "ライトレール",
    "ko": "경전철"
  },
  "🚉": {
    "es": "estación de tren",
    "fr": "gare",
    "de": "Bahnhof",
    "ja": "駅",
    "ko": "기차역"
  },
  "🚊": {
    "es": "tranvía",
    "fr": "tramway",
    "de": "Straßenbahn",
    "ja": "路面電車正面",
    "ko": "트램"
  },
  "🚝": {
    "es": "monorraíl",
    "fr": "monorail",
    "de": "Einschienenbahn",
    "ja": "モノレール",
    "ko": "모노레일"
  },
  "🚞": {
    "es": "ferrocarril de montaña",
    "fr": "train de montagne",
    "de": "Bergbahn",
    "ja": "登山鉄道",
    "ko": "기차 터널"
  },
  "🚋": {
    "es": "vagón de tranvía",
    "fr": "wagon de tramway",
    "de": "Straßenbahnwagen",
    "ja": "路面電車",
    "ko": "트램 차량"
  },
  "🚌": {
    "es": "autobús",
    "fr": "bus",
    "de": "Bus",
    "ja": "バス",
    "ko": "버스"
  },
  "🚍": {
    "es": "autobús próximo",
    "fr": "bus de face",
    "de": "Bus von vorne",
    "ja": "バス正面",
    "ko": "오고 있는 버스"
  },
  "🚎": {
    "es": "trolebús",
    "fr": "trolleybus",
    "de": "Oberleitungsbus",
    "ja": "トロリーバス",
    "ko": "트롤리 버스"
  },
  "🚐": {
    "es": "minibús",
    "fr": "minibus",
    "de": "Kleinbus",
    "ja": "マイクロバス",
    "ko": "미니버스"
  },
  "🚑": {
    "es": "ambulancia",
    "fr": "ambulance",
    "de": "Krankenwagen",
    "ja": "救急車",
    "ko": "구급차"
  },
  "🚒": {
    "es": "coche de bomberos",
    "fr": "camion de pompier",
    "de": "Feuerwehrauto",
    "ja": "消防車",
    "ko": "소방차"
  },
  "🚓": {
    "es": "coche de policía",
    "fr": "voiture de police",
    "de": "Polizeiwagen",
    "ja": "パトカー",
    "ko": "경찰차"
  },
  "🚔": {
    "es": "coche de policía próximo",
    "fr": "voiture de police de face",
    "de": "Polizeiwagen von vorne",
    "ja": "パトカー正面",
    "ko": "오고 있는 경찰차"
  },
  "🚕": {
    "es": "taxi",
    "fr": "taxi",
    "de": "Taxi",
    "ja": "タクシー",
    "ko": "택시"
  },
  "🚖": {
    "es": "taxi próximo",
    "fr": "taxi de face",
    "de": "Taxi von vorne",
    "ja": "タクシー正面",
    "ko": "오고 있는 택시"
  },
  "🚗": {
    "es": "coche",
    "fr": "voiture",
    "de": "Auto",
    "ja": "自動車",
    "ko": "자동차"
  },
  "🚘": {
    "es": "coche próximo",
    "fr": "voiture de face",
    "de": "Auto von vorne",
    "ja": "自動車正面",
    "ko": "오고 있는 자동차"
  },
  "🚙": {
    "es": "vehículo deportivo utilitario",
    "fr": "véhicule utilitaire sport",
    "de": "Wohnmobil",
    "ja": "アールブイ車",
    "ko": "지프"
  },
  "🛻": {
    "es": "camioneta",
    "fr": "pick-up",
    "de": "Pick-up",
    "ja": "軽トラック",
    "ko": "픽업트럭"
  },
  "🚚": {
    "es": "camión de reparto",
    "fr": "camion de livraison",
    "de": "Lieferwagen",
    "ja": "トラック",
    "ko": "운송 트럭"
  },
  "🚛": {
    "es": "camión articulado",
    "fr": "semi-remorque",
    "de": "Sattelzug",
    "ja": "トレーラー",
    "ko": "트레일러 트럭"
  },
  "🚜": {
    "es": "tractor",
    "fr": "tracteur",
    "de": "Traktor",
    "ja": "トラクター",
    "ko": "트랙터"
  },
  "🏎": {
    "es": "coche de carreras",
    "fr": "voiture de course",
    "de": "Rennauto",
    "ja": "レーシングカー",
    "ko": "경주용 자동차"
  },
  "🏍": {
    "es": "moto",
    "fr": "moto",
    "de": "Motorrad",
    "ja": "オートバイ",
    "ko": "오토바이"
  },
  "🛵": {
    "es": "scooter",
    "fr": "scooter",
    "de": "Motorroller",
    "ja": "スクーター",
    "ko": "스쿠터"
  },
  "🦽": {
    "es": "silla de ruedas manual",
    "fr": "fauteuil roulant manuel",
    "de": "manueller Rollstuhl",
    "ja": "手動式車椅子",
    "ko": "수동 휠체어"
  },
  "🦼": {
    "es": "silla de ruedas eléctrica",
    "fr": "fauteuil motorisé",
    "de": "elektrischer Rollstuhl",
    "ja": "電動車椅子",
    "ko": "전동 휠체어"
  },
  "🛺": {
    "es": "mototaxi",
    "fr": "tuk tuk",
    "de": "Autorikscha",
    "ja": "三輪タクシー",
    "ko": "경삼륜차"
  },
  "🚲": {
    "es": "bicicleta",
    "fr": "vélo",
    "de": "Fahrrad",
    "ja": "自転車",
    "ko": "자전거"
  },
  "🛴": {
    "es": "patinete",
    "fr": "trottinette",
    "de": "Tretroller",
    "ja": "キックボード",
    "ko": "킥보드"
  },
  "🛹": {
    "es": "monopatín",
    "fr": "planche à roulettes",
    "de": "Skateboard",
    "ja": "スケートボード",
    "ko": "스케이트보드"
  },
  "🛼": {
    "es": "patines",
    "fr": "patin à roulettes",
    "de": "Rollschuh",
    "ja": "ローラースケート",
    "ko": "롤러스케이트"
  },
  "🚏": {
    "es": "parada de autobús",
    "fr": "arrêt de bus",
    "de": "Bushaltestelle",
    "ja": "バス停",
    "ko": "버스 정류장"
  },
  "⛵️": {
    "es": "velero",
    "fr": "voilier",
    "de": "Segelboot",
    "ja": "ヨット",
    "ko": "돛단배"
  },
  "🛶": {
    "es": "canoa",
    "fr": "canoë",
    "de": "Kanu",
    "ja": "カヌー",
    "ko": "카누"
  },
  "🚤": {
    "es": "lancha motora",
    "fr": "hors-bord",
    "de": "Schnellboot",
    "ja": "スピードボート",
    "ko": "쾌속정"
  },
  "🛳": {
    "es": "barco de pasajeros",
    "fr": "paquebot",
    "de": "Passagierschiff",
    "ja": "客船",
    "ko": "여객선"
  },
  "⛴️": {
    "es": "ferri",
    "fr": "ferry",
    "de": "Fähre",
    "ja": "フェリー",
    "ko": "페리"
  },
  "🛥": {
    "es": "barco a motor",
    "fr": "bateau à moteur",
    "de": "Motorboot",
    "ja": "モーターボート",
    "ko": "모터보트"
  },
  "🚢": {
    "es": "barco",
    "fr": "navire",
    "de": "Schiff",
    "ja": "船",
    "ko": "선박"
  },
  "✈️": {
    "es": "avión",
    "fr": "avion",
    "de": "Flugzeug",
    "ja": "飛行機",
    "ko": "비행기"
  },
  "🛩": {
    "es": "avioneta",
    "fr": "petit avion",
    "de": "kleines Flugzeug",
    "ja": "小型飛行機",
    "ko": "경비행기"
  },
  "🛫": {
    "es": "avión despegando",
    "fr": "avion au décollage",
    "de": "Abflug",
    "ja": "飛行機離陸",
    "ko": "비행기 이륙"
  },
  "🛬": {
    "es": "avión aterrizando",
    "fr": "avion à l’atterrissage",
    "de": "Landung eines Flugzeugs",
    "ja": "飛行機着陸",
    "ko": "비행기 착륙"
  },
  "🪂": {
    "es": "paracaídas",
    "fr": "parachute",
    "de": "Fallschirm",
    "ja": "パラシュート",
    "ko": "낙하산"
  },
  "💺": {
    "es": "asiento de transporte",
    "fr": "siège",
    "de": "Sitzplatz",
    "ja": "座席",
    "ko": "좌석"
  },
  "🚁": {
    "es": "helicóptero",
    "fr": "hélicoptère",
    "de": "Hubschrauber",
    "ja": "ヘリコプター",
    "ko": "헬리콥터"
  },
  "🚟": {
    "es": "ferrocarril de suspensión",
    "fr": "train suspendu",
    "de": "Schwebebahn",
    "ja": "懸垂式モノレール",
    "ko": "매달린 케이블카"
  },
  "🚠": {
    "es": "teleférico de montaña",
    "fr": "téléphérique",
    "de": "Bergschwebebahn",
    "ja": "ケーブルカー",
    "ko": "산악 케이블카"
  },
  "🚡": {
    "es": "teleférico",
    "fr": "tramway aérien",
    "de": "Bergseilbahn",
    "ja": "ロープウェイ",
    "ko": "케이블카"
  },
  "🛰": {
    "es": "satélite",
    "fr": "satellite",
    "de": "Satellit",
    "ja": "人工衛星",
    "ko": "인공위성"
  },
  "🚀": {
    "es": "cohete",
    "fr": "fusée",
    "de": "Rakete",
    "ja": "ロケット",
    "ko": "로켓"
  },
  "🛸": {
    "es": "platillo volante",
    "fr": "soucoupe volante",
    "de": "fliegende Untertasse",
    "ja": "空飛ぶ円盤",
    "ko": "비행접시"
  },
  "🛣": {
    "es": "autopista",
    "fr": "autoroute",
    "de": "Autobahn",
    "ja": "高速道路",
    "ko": "고속도로"
  },
  "🛤": {
    "es": "vía de tren",
    "fr": "voie ferrée",
    "de": "Bahngleis",
    "ja": "線路",
    "ko": "철도 선로"
  },
  "🛢": {
    "es": "barril de petróleo",
    "fr": "baril de pétrole",
    "de": "Ölfass",
    "ja": "ドラム缶",
    "ko": "기름통"
  },
  "⛽": {
    "es": "surtidor de gasolina",
    "fr": "pompe à essence",
    "de": "Tanksäule",
    "ja": "ガソリンスタンド",
    "ko": "주유소"
  },
  "🛞": {
    "es": "rueda",
    "fr": "roue",
    "de": "Autorad",
    "ja": "ホイール",
    "ko": "휠"
  },
  "🚨": {
    "es": "luces de policía",
    "fr": "gyrophare",
    "de": "Polizeilicht",
    "ja": "パトランプ",
    "ko": "사이렌"
  },
  "🚥": {
    "es": "semáforo horizontal",
    "fr": "feu tricolore horizontal",
    "de": "horizontale Verkehrsampel",
    "ja": "信号横",
    "ko": "가로 신호등"
  },
  "🚦": {
    "es": "semáforo",
    "fr": "feu tricolore vertical",
    "de": "vertikale Verkehrsampel",
    "ja": "信号縦",
    "ko": "세로 신호등"
  },
  "🛑": {
    "es": "señal de stop",
    "fr": "stop",
    "de": "Stoppschild",
    "ja": "止まれの標識",
    "ko": "멈춤 표시"
  },
  "🚧": {
    "es": "obras",
    "fr": "travaux",
    "de": "Baustellenabsperrung",
    "ja": "工事中",
    "ko": "공사 중"
  },
  "⚓️": {
    "es": "ancla",
    "fr": "ancre",
    "de": "Anker",
    "ja": "錨",
    "ko": "닻"
  },
  "🛟": {
    "es": "salvavidas",
    "fr": "bouée de sauvetage",
    "de": "Rettungsring",
    "ja": "救命浮環",
    "ko": "구명부환"
  },
  "⌛️": {
    "es": "reloj de arena sin tiempo",
    "fr": "sablier",
    "de": "Sanduhr",
    "ja": "砂時計",
    "ko": "시간이 다 된 모래시계"
  },
  "⏳": {
    "es": "reloj de arena con tiempo",
    "fr": "sablier avec sable qui coule",
    "de": "laufende Sanduhr",
    "ja": "砂が落ちている砂時計",
    "ko": "시간이 남은 모래시계"
  },
  "⌚️": {
    "es": "reloj",
    "fr": "montre",
    "de": "Armbanduhr",
    "ja": "腕時計",
    "ko": "시계"
  },
  "⏰": {
    "es": "reloj despertador",
    "fr": "réveil",
    "de": "Wecker",
    "ja": "目覚まし時計",
    "ko": "알람 시계"
  },
  "⏱": {
    "es": "cronómetro",
    "fr": "chronomètre",
    "de": "Stoppuhr",
    "ja": "ストップウォッチ",
    "ko": "스톱워치"
  },
  "⏲": {
    "es": "temporizador",
    "fr": "horloge",
    "de": "Zeitschaltuhr",
    "ja": "タイマー",
    "ko": "타이머 시계"
  },
  "🕰": {
    "es": "reloj de sobremesa",
    "fr": "pendule",
    "de": "Kaminuhr",
    "ja": "置時計",
    "ko": "벽난로 선반 시계"
  },
  "⚽️": {
    "es": "balón de fútbol",
    "fr": "ballon de football",
    "de": "Fußball",
    "ja": "サッカー",
    "ko": "축구공"
  },
  "⚾️": {
    "es": "béisbol",
    "fr": "baseball",
    "de": "Baseball",
    "ja": "野球",
    "ko": "야구공"
  },
  "🥎": {
    "es": "pelota de softball",
    "fr": "softball",
    "de": "Softball",
    "ja": "ソフトボール",
    "ko": "소프트볼"
  },
  "🏀": {
    "es": "balón de baloncesto",
    "fr": "basket",
    "de": "Basketball",
    "ja": "バスケットボール",
    "ko": "농구"
  },
  "🏐": {
    "es": "pelota de voleibol",
    "fr": "volley-ball",
    "de": "Volleyball",
    "ja": "バレーボール",
    "ko": "배구공"
  },
  "🏈": {
    "es": "balón de fútbol americano",
    "fr": "football américain",
    "de": "Football",
    "ja": "アメフト",
    "ko": "미식축구공"
  },
  "🏉": {
    "es": "balón de rugby",
    "fr": "rugby",
    "de": "Rugbyball",
    "ja": "ラグビー",
    "ko": "럭비공"
  },
  "🎾": {
    "es": "pelota de tenis",
    "fr": "tennis",
    "de": "Tennisball",
    "ja": "テニス",
    "ko": "테니스"
  },
  "🥏": {
    "es": "disco volador",
    "fr": "disque volant",
    "de": "Frisbee",
    "ja": "フリスビー",
    "ko": "원반"
  },
  "🎳": {
    "es": "bolos",
    "fr": "bowling",
    "de": "Bowling",
    "ja": "ボウリング",
    "ko": "볼링"
  },
  "🏏": {
    "es": "críquet",
    "fr": "cricket",
    "de": "Kricket",
    "ja": "クリケット",
    "ko": "크리켓"
  },
  "🏑": {
    "es": "hockey sobre hierba",
    "fr": "hockey sur gazon",
    "de": "Feldhockey",
    "ja": "ホッケー",
    "ko": "필드 하키"
  },
  "🏒": {
    "es": "hockey sobre hielo",
    "fr": "hockey sur glace",
    "de": "Eishockey",
    "ja": "アイスホッケー",
    "ko": "아이스 하키와 퍽"
  },
  "🥍": {
    "es": "lacrosse",
    "fr": "crosse",
    "de": "Lacrosse",
    "ja": "ラクロス",
    "ko": "라크로스"
  },
  "🏓": {
    "es": "tenis de mesa",
    "fr": "ping-pong",
    "de": "Tischtennis",
    "ja": "卓球",
    "ko": "탁구"
  },
  "🏸": {
    "es": "bádminton",
    "fr": "badminton",
    "de": "Badminton",
    "ja": "バドミントン",
    "ko": "배드민턴"
  },
  "🥊": {
    "es": "guante de boxeo",
    "fr": "gant de boxe",
    "de": "Boxhandschuh",
    "ja": "ボクシング",
    "ko": "권투 글러브"
  },
  "🥋": {
    "es": "uniforme de artes marciales",
    "fr": "tenue d’arts martiaux",
    "de": "Kampfsportanzug",
    "ja": "武道",
    "ko": "도복"
  },
  "🥅": {
    "es": "portería",
    "fr": "cage",
    "de": "Tor",
    "ja": "ゴールネット",
    "ko": "골대"
  },
  "⛳️": {
    "es": "banderín en hoyo",
    "fr": "drapeau de golf",
    "de": "Golffahne",
    "ja": "ゴルフ",
    "ko": "골프"
  },
  "⛸️": {
    "es": "patín de hielo",
    "fr": "patin à glace",
    "de": "Schlittschuh",
    "ja": "アイススケート",
    "ko": "아이스 스케이트"
  },
  "🎣": {
    "es": "caña de pescar",
    "fr": "pêche à la ligne",
    "de": "Angel mit Fisch",
    "ja": "釣り",
    "ko": "낚싯대"
  },
  "🤿": {
    "es": "máscara de buceo",
    "fr": "masque de plongée",
    "de": "Tauchmaske",
    "ja": "ダイビング マスク",
    "ko": "다이빙 마스크"
  },
  "🎽": {
    "es": "camiseta sin mangas",
    "fr": "maillot de course",
    "de": "Laufshirt",
    "ja": "長距離走",
    "ko": "러닝 셔츠"
  },
  "🎿": {
    "es": "esquís",
    "fr": "ski",
    "de": "Ski",
    "ja": "スキー",
    "ko": "스키"
  },
  "🛷": {
    "es": "trineo",
    "fr": "luge",
    "de": "Schlitten",
    "ja": "そり競技",
    "ko": "썰매"
  },
  "🥌": {
    "es": "piedra de curling",
    "fr": "pierre de curling",
    "de": "Curlingstein",
    "ja": "カーリング",
    "ko": "컬링 스톤"
  },
  "🎯": {
    "es": "diana",
    "fr": "dans le mille",
    "de": "Darts",
    "ja": "的",
    "ko": "과녁 명중"
  },
  "🪀": {
    "es": "yoyó",
    "fr": "yoyo",
    "de": "Jo-Jo",
    "ja": "ヨーヨー",
    "ko": "요요"
  },
  "🪁": {
    "es": "cometa",
    "fr": "cerf-volant",
    "de": "Drachen",
    "ja": "たこ",
    "ko": "연"
  },
  "🔫": {
    "es": "pistola de agua",
    "fr": "pistolet à eau",
    "de": "Wasserpistole",
    "ja": "水鉄砲",
    "ko": "물총"
  },
  "🎱": {
    "es": "bola negra de billar",
    "fr": "boule de billard",
    "de": "Billardkugel",
    "ja": "ビリヤード",
    "ko": "당구"
  },
  "🔮": {
    "es": "bola de cristal",
    "fr": "boule de cristal",
    "de": "Kristallkugel",
    "ja": "水晶玉",
    "ko": "수정 구슬"
  },
  "🪄": {
    "es": "varita mágica",
    "fr": "baguette magique",
    "de": "Zauberstab",
    "ja": "魔法の杖",
    "ko": "마술 지팡이"
  },
  "🎮": {
    "es": "mando de videoconsola",
    "fr": "jeu vidéo",
    "de": "Gamepad",
    "ja": "テレビゲーム",
    "ko": "비디오 게임"
  },
  "🕹️": {
    "es": "joystick",
    "fr": "manette de jeu",
    "de": "Joystick",
    "ja": "ジョイスティック",
    "ko": "조이스틱"
  },
  "🎰": {
    "es": "máquina tragaperras",
    "fr": "machine à sous",
    "de": "Spielautomat",
    "ja": "スロットマシン",
    "ko": "슬롯 머신"
  },
  "🎲": {
    "es": "dado",
    "fr": "dés",
    "de": "Spielwürfel",
    "ja": "サイコロ",
    "ko": "주사위"
  },
  "🧩": {
    "es": "pieza de puzle",
    "fr": "pièce de puzzle",
    "de": "Puzzleteil",
    "ja": "ジグソーパズル",
    "ko": "퍼즐"
  },
  "🧸": {
    "es": "osito de peluche",
    "fr": "ours en peluche",
    "de": "Teddybär",
    "ja": "テディベア",
    "ko": "테디 베어"
  },
  "🪅": {
    "es": "piñata",
    "fr": "piñata",
    "de": "Piñata",
    "ja": "ピニャータ",
    "ko": "피냐타"
  },
  "🪩": {
    "es": "bola de espejos",
    "fr": "boule à facettes",
    "de": "Discokugel",
    "ja": "ミラーボール",
    "ko": "미러볼"
  },
  "🪆": {
    "es": "muñeca rusa",
    "fr": "poupées russes",
    "de": "Matroschka",
    "ja": "マトリョーシカ",
    "ko": "네스팅 인형"
  },
  "♠️": {
    "es": "palo de picas",
    "fr": "pique",
    "de": "Pik",
    "ja": "スペード",
    "ko": "스페이드"
  },
  "♥️": {
    "es": "palo de corazones",
    "fr": "cœur cartes",
    "de": "Herz",
    "ja": "ハート",
    "ko": "하트"
  },
  "♦️": {
    "es": "palo de diamantes",
    "fr": "carreau",
    "de": "Karo",
    "ja": "ダイヤ",
    "ko": "다이아몬드"
  },
  "♣️": {
    "es": "palo de tréboles",
    "fr": "trèfle cartes",
    "de": "Kreuz",
    "ja": "クラブ",
    "ko": "클럽"
  },
  "♟️": {
    "es": "peón de ajedrez",
    "fr": "pion d’échec",
    "de": "Bauer Schach",
    "ja": "チェスの駒",
    "ko": "체스 폰"
  },
  "🃏": {
    "es": "comodín",
    "fr": "carte Joker",
    "de": "Jokerkarte",
    "ja": "ジョーカー",
    "ko": "조커"
  },
  "🀄️": {
    "es": "dragón rojo de mahjong",
    "fr": "dragon rouge mahjong",
    "de": "Mahjong-Stein",
    "ja": "麻雀",
    "ko": "마작"
  },
  "🎴": {
    "es": "cartas de flores",
    "fr": "jeu des fleurs",
    "de": "japanische Blumenkarte",
    "ja": "花札",
    "ko": "화투"
  },
  "🎃": {
    "es": "calabaza de Halloween",
    "fr": "citrouille",
    "de": "Halloweenkürbis",
    "ja": "ハロウィンかぼちゃ",
    "ko": "할로윈"
  },
  "🎄": {
    "es": "árbol de Navidad",
    "fr": "sapin de Noël",
    "de": "Weihnachtsbaum",
    "ja": "クリスマスツリー",
    "ko": "크리스마스 트리"
  },
  "🎆": {
    "es": "fuegos artificiales",
    "fr": "feu d’artifice",
    "de": "Feuerwerk",
    "ja": "打ち上げ花火",
    "ko": "불꽃놀이"
  },
  "🎇": {
    "es": "bengala",
    "fr": "cierge magique",
    "de": "Wunderkerze",
    "ja": "線香花火",
    "ko": "불꽃"
  },
  "🧨": {
    "es": "petardo",
    "fr": "pétard",
    "de": "Feuerwerkskörper",
    "ja": "爆竹",
    "ko": "폭죽"
  },
  "✨️": {
    "es": "chispas",
    "fr": "étincelles",
    "de": "funkelnde Sterne",
    "ja": "きらきら",
    "ko": "블링블링"
  },
  "🎈": {
    "es": "globo",
    "fr": "ballon gonflable",
    "de": "Luftballon",
    "ja": "風船",
    "ko": "풍선"
  },
  "🎉": {
    "es": "cañón de confeti",
    "fr": "cotillons",
    "de": "Konfettibombe",
    "ja": "クラッカー",
    "ko": "파티"
  },
  "🎊": {
    "es": "bola de confeti",
    "fr": "confettis",
    "de": "Konfettiball",
    "ja": "くす玉",
    "ko": "박 터트리기"
  },
  "🎋": {
    "es": "árbol de tanabata",
    "fr": "arbre à vœux",
    "de": "Tanabata-Baum",
    "ja": "七夕",
    "ko": "소원을 건 나무"
  },
  "🎍": {
    "es": "decoración de pino",
    "fr": "bambou décoratif",
    "de": "Piniendekoration",
    "ja": "門松",
    "ko": "일본 장식"
  },
  "🎎": {
    "es": "muñecas japonesas",
    "fr": "poupées japonaises",
    "de": "japanische Puppen",
    "ja": "ひな祭り",
    "ko": "일본 인형"
  },
  "🎏": {
    "es": "banderín de carpas",
    "fr": "koinobori",
    "de": "traditionelle japanische Windsäcke",
    "ja": "こいのぼり",
    "ko": "물고기 깃발"
  },
  "🎐": {
    "es": "campanilla de viento",
    "fr": "carillon éolien",
    "de": "japanisches Windspiel",
    "ja": "風鈴",
    "ko": "풍경"
  },
  "🎑": {
    "es": "ceremonia de contemplación de la luna",
    "fr": "cérémonie de la lune",
    "de": "traditionelles Mondfest",
    "ja": "月見",
    "ko": "달맞이"
  },
  "🧧": {
    "es": "sobre rojo",
    "fr": "enveloppe rouge",
    "de": "roter Umschlag",
    "ja": "赤い封筒",
    "ko": "세뱃돈"
  },
  "🎀": {
    "es": "lazo",
    "fr": "ruban",
    "de": "pinke Schleife",
    "ja": "リボン",
    "ko": "리본"
  },
  "🎁": {
    "es": "regalo",
    "fr": "cadeau",
    "de": "Geschenk",
    "ja": "プレゼント",
    "ko": "선물"
  },
  "🎗️": {
    "es": "lazo conmemorativo",
    "fr": "ruban de mémoire",
    "de": "Gedenkschleife",
    "ja": "リマインダーリボン",
    "ko": "추모 리본"
  },
  "🎟️": {
    "es": "entradas",
    "fr": "billet d’entrée",
    "de": "Eintrittskarten",
    "ja": "入場券",
    "ko": "입장 티켓"
  },
  "🎫": {
    "es": "tique",
    "fr": "billet",
    "de": "Ticket",
    "ja": "チケット",
    "ko": "티켓"
  },
  "🎖️": {
    "es": "medalla militar",
    "fr": "médaille militaire",
    "de": "Militärorden",
    "ja": "勲章",
    "ko": "무공 훈장"
  },
  "🏆️": {
    "es": "trofeo",
    "fr": "trophée",
    "de": "Pokal",
    "ja": "トロフィー",
    "ko": "트로피"
  },
  "🏅️": {
    "es": "medalla deportiva",
    "fr": "médaille sportive",
    "de": "Sportmedaille",
    "ja": "メダル",
    "ko": "스포츠 메달"
  },
  "🥇": {
    "es": "medalla de oro",
    "fr": "médaille d’or",
    "de": "Goldmedaille",
    "ja": "金メダル",
    "ko": "금메달"
  },
  "🥈": {
    "es": "medalla de plata",
    "fr": "médaille d’argent",
    "de": "Silbermedaille",
    "ja": "銀メダル",
    "ko": "은메달"
  },
  "🥉": {
    "es": "medalla de bronce",
    "fr": "médaille de bronze",
    "de": "Bronzemedaille",
    "ja": "銅メダル",
    "ko": "동메달"
  },
  "🎭": {
    "es": "máscaras de teatro",
    "fr": "spectacle vivant",
    "de": "Masken",
    "ja": "舞台芸術",
    "ko": "가면"
  },
  "🖼️": {
    "es": "cuadro enmarcado",
    "fr": "cadre avec image",
    "de": "gerahmtes Bild",
    "ja": "絵画",
    "ko": "그림 액자"
  },
  "🎨": {
    "es": "paleta de pintor",
    "fr": "palette de peinture",
    "de": "Mischpalette",
    "ja": "絵の具パレット",
    "ko": "팔레트"
  },
  "🎥": {
    "es": "cámara de cine",
    "fr": "caméra",
    "de": "Filmkamera",
    "ja": "映画カメラ",
    "ko": "영화 카메라"
  },
  "📽️": {
    "es": "proyector de cine",
    "fr": "projecteur cinématographique",
    "de": "Filmprojektor",
    "ja": "映写機",
    "ko": "영화 프로젝터"
  },
  "📷": {
    "es": "cámara de fotos",
    "fr": "appareil photo",
    "de": "Fotoapparat",
    "ja": "カメラ",
    "ko": "카메라"
  },
  "📸": {
    "es": "cámara con flash",
    "fr": "appareil photo avec flash",
    "de": "Fotoapparat mit Blitz",
    "ja": "フラッシュを焚いているカメラ",
    "ko": "플래시를 터트리고 있는 카메라"
  },
  "📹": {
    "es": "videocámara",
    "fr": "caméscope",
    "de": "Videokamera",
    "ja": "ビデオカメラ",
    "ko": "캠코더"
  },
  "📼": {
    "es": "cinta de vídeo",
    "fr": "cassette vidéo",
    "de": "Videokassette",
    "ja": "ビデオテープ",
    "ko": "비디오테이프"
  },
  "🎞️": {
    "es": "fotograma de película",
    "fr": "pellicule",
    "de": "Filmstreifen",
    "ja": "映画フィルム",
    "ko": "영화 프레임"
  },
  "🎬": {
    "es": "claqueta",
    "fr": "clap",
    "de": "Filmklappe",
    "ja": "カチンコ",
    "ko": "슬레이트"
  },
  "🧵": {
    "es": "hilo",
    "fr": "bobine de fil",
    "de": "Faden",
    "ja": "糸",
    "ko": "실타래"
  },
  "🪡": {
    "es": "aguja de coser",
    "fr": "aiguille à coudre",
    "de": "Nähnadel",
    "ja": "縫い針",
    "ko": "바늘"
  },
  "🧶": {
    "es": "ovillo",
    "fr": "fil",
    "de": "Wollknäuel",
    "ja": "毛糸",
    "ko": "실뭉치"
  },
  "🪢": {
    "es": "nudo",
    "fr": "nœud",
    "de": "Knoten",
    "ja": "結び目",
    "ko": "매듭"
  },
  "🎤": {
    "es": "micrófono",
    "fr": "micro",
    "de": "Mikrofon",
    "ja": "マイク",
    "ko": "마이크"
  },
  "🎧": {
    "es": "auricular",
    "fr": "casque",
    "de": "Kopfhörer",
    "ja": "ヘッドホン",
    "ko": "헤드폰"
  },
  "📻": {
    "es": "radio",
    "fr": "radio",
    "de": "Radio",
    "ja": "ラジオ",
    "ko": "라디오"
  },
  "🎷": {
    "es": "saxofón",
    "fr": "saxophone",
    "de": "Saxofon",
    "ja": "サックス",
    "ko": "색소폰"
  },
  "🎺": {
    "es": "trompeta",
    "fr": "trompette",
    "de": "Trompete",
    "ja": "トランペット",
    "ko": "트럼펫"
  },
  "🪗": {
    "es": "acordeón",
    "fr": "accordéon",
    "de": "Akkordeon",
    "ja": "アコーディオン",
    "ko": "아코디언"
  },
  "🎸": {
    "es": "guitarra",
    "fr": "guitare",
    "de": "Gitarre",
    "ja": "ギター",
    "ko": "기타"
  },
  "🎹": {
    "es": "teclado musical",
    "fr": "piano",
    "de": "Klaviatur",
    "ja": "鍵盤",
    "ko": "피아노"
  },
  "🎻": {
    "es": "violín",
    "fr": "violon",
    "de": "Geige",
    "ja": "バイオリン",
    "ko": "바이올린"
  },
  "🪕": {
    "es": "banjo",
    "fr": "banjo",
    "de": "Banjo",
    "ja": "バンジョー",
    "ko": "밴조"
  },
  "🥁": {
    "es": "tambor",
    "fr": "batterie",
    "de": "Trommel",
    "ja": "ドラム",
    "ko": "드럼"
  },
  "🪘": {
    "es": "tamboril",
    "fr": "djembé",
    "de": "afrikanische Trommel",
    "ja": "コンガ",
    "ko": "긴 북"
  },
  "🪇": {
    "es": "maracas",
    "fr": "maracas",
    "de": "Maracas",
    "ja": "マラカス",
    "ko": "마라카스"
  },
  "🪈": {
    "es": "flauta",
    "fr": "flûte",
    "de": "Flöte",
    "ja": "笛",
    "ko": "플루트"
  },
  "🪉": {
    "es": "arpa",
    "fr": "harpe",
    "de": "Harfe",
    "ja": "ハープ",
    "ko": "하프"
  },
  "👓": {
    "es": "gafas",
    "fr": "lunettes de vue",
    "de": "Brille",
    "ja": "メガネ",
    "ko": "안경"
  },
  "🕶️": {
    "es": "gafas de sol",
    "fr": "lunettes de soleil",
    "de": "Sonnenbrille",
    "ja": "サングラス",
    "ko": "선글라스"
  },
  "🥽": {
    "es": "gafas de protección",
    "fr": "lunettes",
    "de": "Schutzbrille",
    "ja": "ゴーグル",
    "ko": "고글"
  },
  "🥼": {
    "es": "bata de laboratorio",
    "fr": "blouse blanche",
    "de": "Laborkittel",
    "ja": "白衣",
    "ko": "실험실 가운"
  },
  "🦺": {
    "es": "chaleco de seguridad",
    "fr": "gilet de sécurité",
    "de": "Sicherheitsweste",
    "ja": "安全ベスト",
    "ko": "구명조끼"
  },
  "👔": {
    "es": "corbata",
    "fr": "cravate",
    "de": "Hemd mit Krawatte",
    "ja": "ネクタイ",
    "ko": "넥타이"
  },
  "👕": {
    "es": "camiseta",
    "fr": "T-shirt",
    "de": "T-Shirt",
    "ja": "Tシャツ",
    "ko": "티셔츠"
  },
  "👖": {
    "es": "vaqueros",
    "fr": "jean",
    "de": "Jeans",
    "ja": "ジーンズ",
    "ko": "바지"
  },
  "🧣": {
    "es": "bufanda",
    "fr": "foulard",
    "de": "Schal",
    "ja": "マフラー",
    "ko": "스카프"
  },
  "🧤": {
    "es": "guantes",
    "fr": "gants",
    "de": "Handschuhe",
    "ja": "手袋",
    "ko": "장갑"
  },
  "🧥": {
    "es": "abrigo",
    "fr": "manteau",
    "de": "Mantel",
    "ja": "コート",
    "ko": "코트"
  },
  "🧦": {
    "es": "calcetines",
    "fr": "chaussettes",
    "de": "Socken",
    "ja": "ソックス",
    "ko": "양말"
  },
  "👗": {
    "es": "vestido",
    "fr": "robe",
    "de": "Kleid",
    "ja": "ワンピース",
    "ko": "원피스"
  },
  "👘": {
    "es": "kimono",
    "fr": "kimono",
    "de": "Kimono",
    "ja": "着物",
    "ko": "기모노"
  },
  "🥻": {
    "es": "sari",
    "fr": "sari",
    "de": "Sari",
    "ja": "サリー",
    "ko": "사리"
  },
  "🩱": {
    "es": "traje de baño de una pieza",
    "fr": "maillot de bain une pièce",
    "de": "einteiliger Badeanzug",
    "ja": "ワンピースの水着",
    "ko": "원피스 수영복"
  },
  "🩲": {
    "es": "ropa interior",
    "fr": "slip",
    "de": "Slip",
    "ja": "ブリーフ",
    "ko": "삼각 수영복"
  },
  "🩳": {
    "es": "pantalones cortos",
    "fr": "short",
    "de": "Shorts",
    "ja": "ショーツ",
    "ko": "반바지"
  },
  "👙": {
    "es": "bikini",
    "fr": "bikini",
    "de": "Bikini",
    "ja": "ビキニ",
    "ko": "비키니"
  },
  "👚": {
    "es": "ropa de mujer",
    "fr": "vêtements de femme",
    "de": "Bluse",
    "ja": "婦人服",
    "ko": "여성복"
  },
  "🪭": {
    "es": "abanico abierto",
    "fr": "éventail",
    "de": "Faltfächer",
    "ja": "扇子",
    "ko": "접이식 손 부채"
  },
  "👛": {
    "es": "monedero",
    "fr": "porte-monnaie",
    "de": "Geldbörse",
    "ja": "がま口",
    "ko": "지갑"
  },
  "👜": {
    "es": "bolso",
    "fr": "sac à main",
    "de": "Handtasche",
    "ja": "ハンドバッグ",
    "ko": "핸드백"
  },
  "👝": {
    "es": "bolso de mano",
    "fr": "pochette",
    "de": "Clutch",
    "ja": "ポーチ",
    "ko": "파우치"
  },
  "🛍️": {
    "es": "bolsas de compras",
    "fr": "sacs de shopping",
    "de": "Einkaufstüten",
    "ja": "紙袋",
    "ko": "쇼핑백"
  },
  "🎒": {
    "es": "mochila escolar",
    "fr": "cartable",
    "de": "Schulranzen",
    "ja": "バックパック",
    "ko": "학교 가방"
  },
  "🩴": {
    "es": "chancla",
    "fr": "tong",
    "de": "Zehensandale",
    "ja": "ビーチサンダル",
    "ko": "가락신"
  },
  "👞": {
    "es": "zapato de hombre",
    "fr": "chaussure d’homme",
    "de": "Herrenschuh",
    "ja": "紳士靴",
    "ko": "남성용 구두"
  },
  "👟": {
    "es": "zapatilla deportiva",
    "fr": "chaussure de sport",
    "de": "Sportschuh",
    "ja": "スニーカー",
    "ko": "운동화"
  },
  "🥾": {
    "es": "bota de senderismo",
    "fr": "chaussure de randonnée",
    "de": "Wanderstiefel",
    "ja": "ハイキングシューズ",
    "ko": "등산화"
  },
  "🥿": {
    "es": "bailarina",
    "fr": "chaussure plate",
    "de": "flacher Schuh",
    "ja": "フラットシューズ",
    "ko": "플랫 슈즈"
  },
  "👠": {
    "es": "zapato de tacón",
    "fr": "chaussure à talon haut",
    "de": "Stöckelschuh",
    "ja": "ハイヒール",
    "ko": "하이힐"
  },
  "👡": {
    "es": "sandalia de mujer",
    "fr": "sandale de femme",
    "de": "Damensandale",
    "ja": "サンダル",
    "ko": "샌들"
  },
  "🩰": {
    "es": "zapatillas de ballet",
    "fr": "chaussons de danse",
    "de": "Ballettschuhe",
    "ja": "トウシューズ",
    "ko": "발레 슈즈"
  },
  "👢": {
    "es": "bota de mujer",
    "fr": "botte de femme",
    "de": "Damenstiefel",
    "ja": "ブーツ",
    "ko": "부츠"
  },
  "🪮": {
    "es": "peineta",
    "fr": "peigne afro",
    "de": "Haarkamm",
    "ja": "アフロコーム",
    "ko": "머리 빗"
  },
  "👑": {
    "es": "corona",
    "fr": "couronne",
    "de": "Krone",
    "ja": "王冠",
    "ko": "왕관"
  },
  "👒": {
    "es": "sombrero de mujer",
    "fr": "chapeau de femme",
    "de": "Damenhut",
    "ja": "婦人帽子",
    "ko": "여성용 모자"
  },
  "🎩": {
    "es": "sombrero de copa",
    "fr": "haut de forme",
    "de": "Zylinder",
    "ja": "シルクハット",
    "ko": "마술사 모자"
  },
  "🎓": {
    "es": "birrete",
    "fr": "toque universitaire",
    "de": "Doktorhut",
    "ja": "角帽",
    "ko": "졸업 모자"
  },
  "🧢": {
    "es": "gorra con visera",
    "fr": "casquette américaine",
    "de": "Baseballmütze",
    "ja": "キャップ",
    "ko": "야구모자"
  },
  "🪖": {
    "es": "casco militar",
    "fr": "casque militaire",
    "de": "Militärhelm",
    "ja": "軍用ヘルメット",
    "ko": "군용 헬멧"
  },
  "⛑️": {
    "es": "casco con una cruz blanca",
    "fr": "casque de secouriste",
    "de": "Rettungshelm",
    "ja": "白十字ヘルメット",
    "ko": "흰 십자가가 있는 헬멧"
  },
  "📿": {
    "es": "rosario",
    "fr": "chapelet",
    "de": "Gebetskette",
    "ja": "数珠",
    "ko": "묵주"
  },
  "💄": {
    "es": "pintalabios",
    "fr": "rouge à lèvres",
    "de": "Lippenstift",
    "ja": "口紅",
    "ko": "립스틱"
  },
  "💍": {
    "es": "anillo",
    "fr": "bague",
    "de": "Ring",
    "ja": "指輪",
    "ko": "반지"
  },
  "💎": {
    "es": "piedra preciosa",
    "fr": "pierre précieuse",
    "de": "Edelstein",
    "ja": "宝石",
    "ko": "원석"
  },
  "🪚": {
    "es": "sierra de carpintería",
    "fr": "scie",
    "de": "Handsäge",
    "ja": "のこぎり",
    "ko": "목공 톱"
  },
  "🔧": {
    "es": "llave inglesa",
    "fr": "clé à molette",
    "de": "Schraubenschlüssel",
    "ja": "レンチ",
    "ko": "렌치"
  },
  "🪛": {
    "es": "destornillador",
    "fr": "tournevis",
    "de": "Schraubenzieher",
    "ja": "ねじ回し",
    "ko": "드라이버"
  },
  "🔩": {
    "es": "tornillo y tuerca",
    "fr": "vis et écrou",
    "de": "Mutter und Schraube",
    "ja": "ボルトとナット",
    "ko": "볼트와 너트"
  },
  "⚙️": {
    "es": "engranaje",
    "fr": "roue dentée",
    "de": "Zahnrad",
    "ja": "歯車",
    "ko": "톱니바퀴"
  },
  "🗜️": {
    "es": "tornillo de banco",
    "fr": "serre-joint",
    "de": "Schraubzwinge",
    "ja": "万力",
    "ko": "압축기"
  },
  "⚖️": {
    "es": "balanza",
    "fr": "balance à poids",
    "de": "Waage",
    "ja": "天秤",
    "ko": "접시저울"
  },
  "🦯": {
    "es": "bastón",
    "fr": "canne blanche",
    "de": "Blindenstock",
    "ja": "白杖",
    "ko": "시각장애인 지팡이"
  },
  "🔏": {
    "es": "candado con pluma estilográfica",
    "fr": "cadenas fermé avec stylo",
    "de": "Schloss mit Füller",
    "ja": "閉じた錠とペン",
    "ko": "자물쇠와 펜"
  },
  "🔒": {
    "es": "candado cerrado",
    "fr": "cadenas fermé",
    "de": "geschlossenes Schloss",
    "ja": "閉じた錠",
    "ko": "자물쇠"
  },
  "🔓": {
    "es": "candado abierto",
    "fr": "cadenas ouvert",
    "de": "offenes Schloss",
    "ja": "開いた錠",
    "ko": "열린 자물쇠"
  },
  "🔐": {
    "es": "candado cerrado y llave",
    "fr": "cadenas fermé avec clé",
    "de": "Schloss mit Schlüssel",
    "ja": "閉じた錠と鍵",
    "ko": "자물쇠와 열쇠"
  },
  "🔑": {
    "es": "llave",
    "fr": "clé",
    "de": "Schlüssel",
    "ja": "鍵",
    "ko": "열쇠"
  },
  "🗝️": {
    "es": "llave antigua",
    "fr": "clé ancienne",
    "de": "alter Schlüssel",
    "ja": "古い鍵",
    "ko": "오래된 열쇠"
  },
  "🔨": {
    "es": "martillo",
    "fr": "marteau",
    "de": "Hammer",
    "ja": "ハンマー",
    "ko": "망치"
  },
  "🪓": {
    "es": "hacha",
    "fr": "hache",
    "de": "Axt",
    "ja": "斧",
    "ko": "도끼"
  },
  "🛠️": {
    "es": "martillo y llave inglesa",
    "fr": "marteau et clé à molette",
    "de": "Hammer und Schraubenschlüssel",
    "ja": "ハンマーとレンチ",
    "ko": "망치와 렌치"
  },
  "🧽": {
    "es": "esponja",
    "fr": "éponge",
    "de": "Schwamm",
    "ja": "スポンジ",
    "ko": "스펀지"
  },
  "🪣": {
    "es": "cubo",
    "fr": "seau",
    "de": "Eimer",
    "ja": "バケツ",
    "ko": "양동이"
  },
  "🧴": {
    "es": "bote de crema",
    "fr": "bouteille de lotion",
    "de": "Creme",
    "ja": "ローション",
    "ko": "로션"
  },
  "🪒": {
    "es": "cuchilla de afeitar",
    "fr": "rasoir",
    "de": "Rasierer",
    "ja": "剃刀",
    "ko": "면도칼"
  },
  "📱": {
    "es": "teléfono móvil",
    "fr": "téléphone portable",
    "de": "Mobiltelefon",
    "ja": "携帯電話",
    "ko": "휴대전화"
  },
  "📲": {
    "es": "móvil con una flecha",
    "fr": "appel entrant",
    "de": "Mobiltelefon mit Pfeil",
    "ja": "着信中",
    "ko": "왼쪽에 화살표가 있는 휴대전화"
  },
  "💻": {
    "es": "ordenador portátil",
    "fr": "ordinateur portable",
    "de": "Laptop",
    "ja": "ノートパソコン",
    "ko": "노트북"
  },
  "🖥️": {
    "es": "ordenador de sobremesa",
    "fr": "ordinateur de bureau",
    "de": "Desktopcomputer",
    "ja": "デスクトップパソコン",
    "ko": "데스크톱 컴퓨터"
  },
  "🖨️": {
    "es": "impresora",
    "fr": "imprimante",
    "de": "Drucker",
    "ja": "プリンタ",
    "ko": "프린터"
  },
  "🖱️": {
    "es": "ratón de ordenador",
    "fr": "souris d’ordinateur",
    "de": "Computermaus",
    "ja": "マウス",
    "ko": "컴퓨터 마우스"
  },
  "🖲️": {
    "es": "bola de desplazamiento",
    "fr": "boule de commande",
    "de": "Trackball",
    "ja": "トラックボール",
    "ko": "트랙볼"
  },
  "💽": {
    "es": "minidisc",
    "fr": "disque d’ordinateur",
    "de": "Minidisc",
    "ja": "MD",
    "ko": "엠디"
  },
  "💾": {
    "es": "disquete",
    "fr": "disquette",
    "de": "Diskette",
    "ja": "フロッピー",
    "ko": "플로피 디스크"
  },
  "📀": {
    "es": "disco DVD",
    "fr": "DVD",
    "de": "DVD",
    "ja": "DVD",
    "ko": "디비디"
  },
  "🔋": {
    "es": "pila",
    "fr": "pile",
    "de": "Batterie",
    "ja": "電池",
    "ko": "배터리"
  },
  "🔌": {
    "es": "enchufe eléctrico",
    "fr": "câble avec fiche électrique",
    "de": "Netzstecker",
    "ja": "コンセント",
    "ko": "전기 플러그"
  },
  "💡": {
    "es": "bombilla",
    "fr": "ampoule",
    "de": "Glühbirne",
    "ja": "電球",
    "ko": "전구"
  },
  "🔦": {
    "es": "linterna",
    "fr": "torche",
    "de": "Taschenlampe",
    "ja": "懐中電灯",
    "ko": "손전등"
  },
  "🏮": {
    "es": "lámpara japonesa",
    "fr": "lampion rouge",
    "de": "rote Papierlaterne",
    "ja": "赤ちょうちん",
    "ko": "일본식 등"
  },
  "📔": {
    "es": "cuaderno con tapa decorativa",
    "fr": "carnet avec couverture",
    "de": "Notizbuch mit dekorativem Einband",
    "ja": "表紙付きノート",
    "ko": "표지가 있는 노트"
  },
  "📕": {
    "es": "libro cerrado",
    "fr": "livre fermé",
    "de": "geschlossenes Buch",
    "ja": "閉じた本",
    "ko": "펼치지 않은 책"
  },
  "📖": {
    "es": "libro abierto",
    "fr": "livre ouvert",
    "de": "offenes Buch",
    "ja": "開いた本",
    "ko": "펼쳐진 책"
  },
  "📗": {
    "es": "libro verde",
    "fr": "livre vert",
    "de": "grünes Buch",
    "ja": "緑の本",
    "ko": "초록색 책"
  },
  "📘": {
    "es": "libro azul",
    "fr": "livre bleu",
    "de": "blaues Buch",
    "ja": "青の本",
    "ko": "파란색 책"
  },
  "📙": {
    "es": "libro naranja",
    "fr": "livre orange",
    "de": "orangefarbenes Buch",
    "ja": "オレンジの本",
    "ko": "주황색 책"
  },
  "📚": {
    "es": "libros",
    "fr": "livres",
    "de": "Bücherstapel",
    "ja": "本の山",
    "ko": "책 여러 권"
  },
  "📓": {
    "es": "cuaderno",
    "fr": "carnet",
    "de": "Notizbuch",
    "ja": "ノート",
    "ko": "공책"
  },
  "📑": {
    "es": "marcadores",
    "fr": "signets",
    "de": "Pagemarker",
    "ja": "ページに付箋",
    "ko": "북마크 탭"
  },
  "🔖": {
    "es": "marcapáginas",
    "fr": "marque-page",
    "de": "Lesezeichen",
    "ja": "しおり",
    "ko": "북마크"
  },
  "🏷️": {
    "es": "etiqueta",
    "fr": "étiquette",
    "de": "Etikett",
    "ja": "荷札",
    "ko": "라벨"
  },
  "💳": {
    "es": "tarjeta de crédito",
    "fr": "carte bancaire",
    "de": "Kreditkarte",
    "ja": "クレジットカード",
    "ko": "신용카드"
  },
  "📨": {
    "es": "sobre entrante",
    "fr": "message reçu",
    "de": "eingehender Briefumschlag",
    "ja": "メール受信中",
    "ko": "받은 편지"
  },
  "📩": {
    "es": "sobre con flecha",
    "fr": "enveloppe avec flèche",
    "de": "Umschlag mit Pfeil",
    "ja": "メール受信",
    "ko": "보낸 편지"
  },
  "📦": {
    "es": "paquete",
    "fr": "colis",
    "de": "Paket",
    "ja": "荷物",
    "ko": "소포"
  },
  "📫": {
    "es": "buzón cerrado con la bandera levantada",
    "fr": "boîte aux lettres fermée drapeau levé",
    "de": "geschlossener Briefkasten mit Post",
    "ja": "閉じた郵便受け（手紙あり）",
    "ko": "표지가 올라간 닫힌 우편함"
  },
  "📪": {
    "es": "buzón cerrado con la bandera bajada",
    "fr": "boîte aux lettres fermée drapeau baissé",
    "de": "geschlossener Briefkasten ohne Post",
    "ja": "閉じた郵便受け（手紙なし）",
    "ko": "표지가 내려간 닫힌 우편함"
  },
  "📬": {
    "es": "buzón abierto con la bandera levantada",
    "fr": "boîte aux lettres ouverte drapeau levé",
    "de": "offener Briefkasten mit Post",
    "ja": "開いた郵便受け（手紙あり）",
    "ko": "표지가 올라간 열린 우편함"
  },
  "📭": {
    "es": "buzón abierto con la bandera bajada",
    "fr": "boîte aux lettres ouverte drapeau baissé",
    "de": "offener Briefkasten ohne Post",
    "ja": "開いた郵便受け（手紙なし）",
    "ko": "표지가 내려간 열린 우편함"
  },
  "🖋️": {
    "es": "estilográfica",
    "fr": "stylo plume",
    "de": "Füllhalter",
    "ja": "万年筆",
    "ko": "만년필"
  },
  "🖊️": {
    "es": "bolígrafo",
    "fr": "stylo",
    "de": "Kugelschreiber",
    "ja": "ペン",
    "ko": "펜"
  },
  "📝": {
    "es": "cuaderno de notas",
    "fr": "mémo",
    "de": "Papier und Bleistift",
    "ja": "鉛筆とメモ",
    "ko": "메모"
  },
  "📁": {
    "es": "carpeta de archivos",
    "fr": "dossier",
    "de": "Ordner",
    "ja": "フォルダー",
    "ko": "폴더"
  },
  "📂": {
    "es": "carpeta de archivos abierta",
    "fr": "dossier ouvert",
    "de": "geöffneter Ordner",
    "ja": "開いたフォルダー",
    "ko": "폴더 열기"
  },
  "🗂️": {
    "es": "separador de fichas",
    "fr": "intercalaires",
    "de": "Karteireiter",
    "ja": "カードフォルダー",
    "ko": "카드 색인 파일"
  },
  "📅": {
    "es": "calendario",
    "fr": "calendrier",
    "de": "Kalender",
    "ja": "カレンダー",
    "ko": "달력"
  },
  "📆": {
    "es": "calendario recortable",
    "fr": "éphéméride",
    "de": "Abreißkalender",
    "ja": "日めくりカレンダー",
    "ko": "뜯어진 달력"
  },
  "🗓️": {
    "es": "calendario de espiral",
    "fr": "calendrier à spirale",
    "de": "Spiralkalender",
    "ja": "月めくりカレンダー",
    "ko": "스프링 달력"
  },
  "📇": {
    "es": "organizador de fichas",
    "fr": "carnet d’adresses",
    "de": "Rotationskartei",
    "ja": "カードインデックス",
    "ko": "카드 인덱스"
  },
  "📎": {
    "es": "clip",
    "fr": "trombone",
    "de": "Büroklammer",
    "ja": "クリップ",
    "ko": "클립"
  },
  "🖇️": {
    "es": "clips unidos",
    "fr": "trombones",
    "de": "verhakte Büroklammern",
    "ja": "つながったクリップ",
    "ko": "이어져 있는 클립"
  },
  "📌": {
    "es": "chincheta",
    "fr": "punaise",
    "de": "Reißzwecke",
    "ja": "押しピン",
    "ko": "압정"
  },
  "📍": {
    "es": "chincheta redonda",
    "fr": "épingle",
    "de": "Stecknadel",
    "ja": "丸い押しピン",
    "ko": "둥근 머리 핀"
  },
  "📏": {
    "es": "regla",
    "fr": "règle",
    "de": "Lineal",
    "ja": "定規",
    "ko": "자"
  },
  "📐": {
    "es": "escuadra",
    "fr": "équerre",
    "de": "dreieckiges Lineal",
    "ja": "三角定規",
    "ko": "삼각자"
  },
  "🗃️": {
    "es": "archivador de tarjetas",
    "fr": "boîte à dossiers",
    "de": "Karteikasten",
    "ja": "カードファイルボックス",
    "ko": "카드 파일 상자"
  },
  "🗄️": {
    "es": "archivador",
    "fr": "meuble à dossiers",
    "de": "Aktenschrank",
    "ja": "ファイルキャビネット",
    "ko": "파일 보관 서랍장"
  },
  "🧻": {
    "es": "rollo de papel",
    "fr": "rouleau de papier",
    "de": "Küchenrolle",
    "ja": "トイレットペーパー",
    "ko": "두루마리"
  },
  "🧷": {
    "es": "imperdible",
    "fr": "épingle de sûreté",
    "de": "Sicherheitsnadel",
    "ja": "安全ピン",
    "ko": "옷핀"
  },
  "🪔": {
    "es": "lámpara de aceite",
    "fr": "diya",
    "de": "Öllampe",
    "ja": "ディヤランプ",
    "ko": "기름 램프"
  },
  "🪥": {
    "es": "cepillo de dientes",
    "fr": "brosse à dents",
    "de": "Zahnbürste",
    "ja": "歯ブラシ",
    "ko": "칫솔"
  },
  "🛎": {
    "es": "timbre de hotel",
    "fr": "cloche de comptoir",
    "de": "Rezeptionsklingel",
    "ja": "ベルボーイベル",
    "ko": "호출 벨"
  },
  "🧳": {
    "es": "equipaje",
    "fr": "bagage",
    "de": "Gepäck",
    "ja": "スーツケース",
    "ko": "여행용 가방"
  },
  "🔔": {
    "es": "campana",
    "fr": "cloche",
    "de": "Glocke",
    "ja": "ベル",
    "ko": "종"
  },
  "🔕": {
    "es": "campana con signo de cancelación",
    "fr": "alarme désactivée",
    "de": "durchgestrichene Glocke",
    "ja": "ベル消音",
    "ko": "음소거"
  },
  "🧮": {
    "es": "ábaco",
    "fr": "abaque",
    "de": "Abakus",
    "ja": "そろばん",
    "ko": "주판"
  },
  "📒": {
    "es": "libro de contabilidad",
    "fr": "carnet de compte",
    "de": "Spiralblock",
    "ja": "リングノート",
    "ko": "노트"
  },
  "📃": {
    "es": "página doblada",
    "fr": "page enroulée",
    "de": "teilweise eingerolltes Blatt",
    "ja": "巻きページ",
    "ko": "안으로 말린 문서"
  },
  "📜": {
    "es": "pergamino",
    "fr": "parchemin",
    "de": "Schriftrolle",
    "ja": "巻き物",
    "ko": "문서"
  },
  "📄": {
    "es": "página hacia arriba",
    "fr": "page",
    "de": "Vorderseite eines Blattes",
    "ja": "ページ",
    "ko": "오른쪽 모서리가 접힌 문서"
  },
  "💰": {
    "es": "bolsa de dinero",
    "fr": "sac plein d’argent",
    "de": "Geldsack",
    "ja": "ドル袋",
    "ko": "돈주머니"
  },
  "🪙": {
    "es": "moneda",
    "fr": "pièce",
    "de": "Münze",
    "ja": "コイン",
    "ko": "동전"
  },
  "💴": {
    "es": "billete de yen",
    "fr": "billet en yens",
    "de": "Yen-Banknote",
    "ja": "円札",
    "ko": "엔"
  },
  "💵": {
    "es": "billete de dólar",
    "fr": "billet en dollars",
    "de": "Dollar-Banknote",
    "ja": "ドル札",
    "ko": "달러"
  },
  "💶": {
    "es": "billete de euro",
    "fr": "billet en euros",
    "de": "Euro-Banknote",
    "ja": "ユーロ札",
    "ko": "유로"
  },
  "💷": {
    "es": "billete de libra",
    "fr": "billet en livres",
    "de": "Pfund-Banknote",
    "ja": "ポンド札",
    "ko": "파운드"
  },
  "💸": {
    "es": "billete con alas",
    "fr": "billet avec des ailes",
    "de": "Geldschein mit Flügeln",
    "ja": "羽が生えたお金",
    "ko": "날개 달린 돈"
  },
  "📧": {
    "es": "correo electrónico",
    "fr": "e-mail",
    "de": "E-Mail",
    "ja": "Eメール",
    "ko": "이메일"
  },
  "📤": {
    "es": "bandeja de salida",
    "fr": "boîte d’envoi",
    "de": "Postausgang",
    "ja": "送信トレイ",
    "ko": "보낸 편지함"
  },
  "📥": {
    "es": "bandeja de entrada",
    "fr": "boîte de réception",
    "de": "Posteingang",
    "ja": "受信トレイ",
    "ko": "받은 편지함"
  },
  "📮": {
    "es": "buzón",
    "fr": "boîte aux lettres",
    "de": "Briefkasten",
    "ja": "郵便ポスト",
    "ko": "우편함"
  },
  "🗳️": {
    "es": "urna con papeleta",
    "fr": "urne électorale",
    "de": "Urne mit Wahlzettel",
    "ja": "投票箱",
    "ko": "투표 용지가 있는 투표 상자"
  },
  "💼": {
    "es": "maletín",
    "fr": "porte-documents",
    "de": "Aktentasche",
    "ja": "ブリーフケース",
    "ko": "서류 가방"
  },
  "🗒️": {
    "es": "bloc de notas de espiral",
    "fr": "bloc-notes à spirale",
    "de": "Notizblock",
    "ja": "メモ帳",
    "ko": "스프링 노트"
  },
  "🔗": {
    "es": "eslabón",
    "fr": "chaînons",
    "de": "Linksymbol",
    "ja": "リンクシンボル",
    "ko": "링크"
  },
  "🗡️": {
    "es": "puñal",
    "fr": "dague",
    "de": "Dolch",
    "ja": "短刀",
    "ko": "단검"
  },
  "💣": {
    "es": "bomba",
    "fr": "bombe",
    "de": "Bombe",
    "ja": "爆弾",
    "ko": "폭탄"
  },
  "🪃": {
    "es": "bumerán",
    "fr": "boomerang",
    "de": "Bumerang",
    "ja": "ブーメラン",
    "ko": "부메랑"
  },
  "🏹": {
    "es": "arco y flecha",
    "fr": "arc et flèche",
    "de": "Pfeil und Bogen",
    "ja": "弓矢",
    "ko": "활과 화살"
  },
  "🛡️": {
    "es": "escudo",
    "fr": "bouclier",
    "de": "Schutzschild",
    "ja": "盾",
    "ko": "방패"
  },
  "🚬": {
    "es": "cigarrillo",
    "fr": "cigarette",
    "de": "Zigarette",
    "ja": "煙草",
    "ko": "흡연 구역 신호"
  },
  "🪦": {
    "es": "lápida",
    "fr": "pierre tombale",
    "de": "Grabstein",
    "ja": "墓石",
    "ko": "묘비"
  },
  "🧿": {
    "es": "ojo turco",
    "fr": "mauvais œil",
    "de": "Nazar-Amulett",
    "ja": "ナザール・ボンジュウ",
    "ko": "악마의 눈"
  },
  "🪬": {
    "es": "hamsa",
    "fr": "main de Fatma",
    "de": "Hamsa",
    "ja": "ハムサ",
    "ko": "함사"
  },
  "🤹": {
    "es": "persona haciendo malabares",
    "fr": "personne qui jongle",
    "de": "Jongleur(in)",
    "ja": "ジャグリングをする人",
    "ko": "저글링하는 사람"
  },
  "🎼": {
    "es": "pentagrama",
    "fr": "partition",
    "de": "Notenschlüssel",
    "ja": "楽譜",
    "ko": "높은음자리표"
  },
  "📯": {
    "es": "corneta de posta",
    "fr": "cor postal",
    "de": "Posthorn",
    "ja": "郵便ラッパ",
    "ko": "호른"
  },
  "🎶": {
    "es": "notas musicales",
    "fr": "notes de musique",
    "de": "Musiknoten",
    "ja": "複数の音符",
    "ko": "노래 음표"
  },
  "🎵": {
    "es": "nota musical",
    "fr": "note de musique",
    "de": "Musiknote",
    "ja": "音符",
    "ko": "음표"
  },
  "🧾": {
    "es": "recibo",
    "fr": "reçu",
    "de": "Beleg",
    "ja": "レシート",
    "ko": "영수증"
  },
  "❤️": {
    "es": "corazón rojo",
    "fr": "cœur rouge",
    "de": "rotes Herz",
    "ja": "赤いハート",
    "ko": "빨간색 하트"
  },
  "🧡": {
    "es": "corazón naranja",
    "fr": "cœur orange",
    "de": "oranges Herz",
    "ja": "オレンジのハート",
    "ko": "주황색 하트"
  },
  "💛": {
    "es": "corazón amarillo",
    "fr": "cœur jaune",
    "de": "gelbes Herz",
    "ja": "黄色のハート",
    "ko": "노란색 하트"
  },
  "💚": {
    "es": "corazón verde",
    "fr": "cœur vert",
    "de": "grünes Herz",
    "ja": "緑のハート",
    "ko": "초록색 하트"
  },
  "💙": {
    "es": "corazón azul",
    "fr": "cœur bleu",
    "de": "blaues Herz",
    "ja": "青いハート",
    "ko": "파란색 하트"
  },
  "💜": {
    "es": "corazón morado",
    "fr": "cœur violet",
    "de": "lila Herz",
    "ja": "紫のハート",
    "ko": "보라색 하트"
  },
  "🖤": {
    "es": "corazón negro",
    "fr": "cœur noir",
    "de": "schwarzes Herz",
    "ja": "黒いハート",
    "ko": "검은색 하트"
  },
  "🤍": {
    "es": "corazón blanco",
    "fr": "cœur blanc",
    "de": "weißes Herz",
    "ja": "白いハート",
    "ko": "흰색 하트"
  },
  "🤎": {
    "es": "corazón marrón",
    "fr": "cœur marron",
    "de": "braunes Herz",
    "ja": "茶色いハート",
    "ko": "갈색 하트"
  },
  "💔": {
    "es": "corazón roto",
    "fr": "cœur brisé",
    "de": "gebrochenes Herz",
    "ja": "割れたハート",
    "ko": "깨진 하트"
  },
  "❣️": {
    "es": "exclamación de corazón",
    "fr": "cœur point d’exclamation",
    "de": "Herz als Ausrufezeichen",
    "ja": "ハートのびっくり",
    "ko": "하트 모양 느낌표"
  },
  "💕": {
    "es": "dos corazones",
    "fr": "deux cœurs",
    "de": "zwei Herzen",
    "ja": "2つのハート",
    "ko": "하트 두 개"
  },
  "💞": {
    "es": "corazones giratorios",
    "fr": "cœurs qui tournent",
    "de": "kreisende Herzen",
    "ja": "回転するハート",
    "ko": "회전하는 하트"
  },
  "💓": {
    "es": "corazón latiendo",
    "fr": "cœur battant",
    "de": "schlagendes Herz",
    "ja": "ドキドキするハート",
    "ko": "두근거리는 하트"
  },
  "💗": {
    "es": "corazón creciente",
    "fr": "cœur grandissant",
    "de": "wachsendes Herz",
    "ja": "大きくなるハート",
    "ko": "커지는 하트"
  },
  "💖": {
    "es": "corazón brillante",
    "fr": "cœur étincelant",
    "de": "funkelndes Herz",
    "ja": "きらきらハート",
    "ko": "빛나는 하트"
  },
  "💘": {
    "es": "corazón con flecha",
    "fr": "cœur et flèche",
    "de": "Herz mit Pfeil",
    "ja": "ハートに矢",
    "ko": "화살이 꽂힌 하트"
  },
  "💝": {
    "es": "corazón con lazo",
    "fr": "cœur avec ruban",
    "de": "Herz mit Schleife",
    "ja": "ハートにリボン",
    "ko": "리본 달린 하트"
  },
  "💌": {
    "es": "carta de amor",
    "fr": "lettre d’amour",
    "de": "Liebesbrief",
    "ja": "ラブレター",
    "ko": "러브레터"
  },
  "🕳️": {
    "es": "agujero",
    "fr": "trou",
    "de": "Loch",
    "ja": "穴",
    "ko": "구멍"
  },
  "💢": {
    "es": "símbolo de enfado",
    "fr": "symbole de colère",
    "de": "Ärger",
    "ja": "むかっ",
    "ko": "화남"
  },
  "💬": {
    "es": "bocadillo de diálogo",
    "fr": "bulle de parole",
    "de": "Sprechblase mit drei Punkten",
    "ja": "会話の吹き出し",
    "ko": "말풍선"
  },
  "💭": {
    "es": "bocadillo de pensamiento",
    "fr": "bulle de pensée",
    "de": "Gedankenblase",
    "ja": "雲形の吹き出し",
    "ko": "생각 풍선"
  },
  "💤": {
    "es": "símbolo de sueño",
    "fr": "endormi",
    "de": "Schlafen",
    "ja": "グーグー",
    "ko": "졸림"
  },
  "🚸": {
    "es": "niños cruzando",
    "fr": "traversée d’enfants",
    "de": "Kinder überqueren die Straße",
    "ja": "児童横断",
    "ko": "어린이 보호 구역"
  },
  "🔞": {
    "es": "prohibido para menos de 18 años",
    "fr": "18 ans et plus",
    "de": "Minderjährige verboten",
    "ja": "18歳未満禁止",
    "ko": "성인용"
  },
  "📵": {
    "es": "prohibido el uso de móviles",
    "fr": "téléphones portables interdits",
    "de": "Mobiltelefone verboten",
    "ja": "携帯電話禁止",
    "ko": "휴대전화 사용금지"
  },
  "🔃": {
    "es": "flechas verticales en sentido horario",
    "fr": "flèches dans le sens horaire",
    "de": "kreisförmige Pfeile im Uhrzeigersinn",
    "ja": "右回り縦矢印",
    "ko": "시계 방향 화살표"
  },
  "🔄": {
    "es": "flechas en sentido antihorario",
    "fr": "flèches dans le sens antihoraire",
    "de": "Pfeile gegen den Uhrzeigersinn",
    "ja": "左回り矢印",
    "ko": "반시계 방향 화살표"
  },
  "🔙": {
    "es": "flecha BACK",
    "fr": "flèche Retour",
    "de": "BACK-Pfeil",
    "ja": "BACK矢印",
    "ko": "뒤로"
  },
  "🔚": {
    "es": "flecha END",
    "fr": "flèche Fin",
    "de": "END-Pfeil",
    "ja": "END矢印",
    "ko": "종료"
  },
  "🔛": {
    "es": "flecha ON!",
    "fr": "flèche Activé",
    "de": "ON!-Pfeil",
    "ja": "ON矢印",
    "ko": "켜짐"
  },
  "🔜": {
    "es": "flecha SOON",
    "fr": "flèche Bientôt",
    "de": "SOON-Pfeil",
    "ja": "SOON矢印",
    "ko": "곧"
  },
  "🔝": {
    "es": "flecha TOP",
    "fr": "flèche En haut",
    "de": "TOP-Pfeil",
    "ja": "TOP矢印",
    "ko": "맨 위 화살표"
  },
  "🛐": {
    "es": "lugar de culto",
    "fr": "lieu de culte",
    "de": "religiöse Stätte",
    "ja": "礼拝所",
    "ko": "예배공간"
  },
  "🕉️": {
    "es": "om",
    "fr": "om",
    "de": "om",
    "ja": "オーム",
    "ko": "옴"
  },
  "🕎": {
    "es": "menorá",
    "fr": "chandelier à sept branches",
    "de": "Menora",
    "ja": "メノーラー",
    "ko": "메노라"
  },
  "🔯": {
    "es": "estrella de seis puntas",
    "fr": "étoile à 6 branches",
    "de": "Hexagramm mit Punkt",
    "ja": "六芒星",
    "ko": "육각 별"
  },
  "🪯": {
    "es": "khanda",
    "fr": "khanda",
    "de": "Khanda",
    "ja": "カンダ",
    "ko": "칸다"
  },
  "🔀": {
    "es": "reproducción aleatoria",
    "fr": "bouton lecture aléatoire",
    "de": "Zufallsmodus",
    "ja": "シャッフルボタン",
    "ko": "랜덤 재생"
  },
  "🔁": {
    "es": "repetir",
    "fr": "bouton répétition",
    "de": "Wiederholen",
    "ja": "リピートボタン",
    "ko": "전곡 반복 재생"
  },
  "🔂": {
    "es": "repetir una vez",
    "fr": "bouton répétition de la piste",
    "de": "Titel wiederholen",
    "ja": "1曲リピートボタン",
    "ko": "한 곡 반복 재생"
  },
  "▶️": {
    "es": "reproducir",
    "fr": "bouton lecture",
    "de": "Wiedergabe",
    "ja": "再生ボタン",
    "ko": "재생 버튼"
  },
  "⏩": {
    "es": "avance rápido",
    "fr": "bouton avance rapide",
    "de": "Doppelpfeile nach rechts",
    "ja": "早送りボタン",
    "ko": "빨리 감기 버튼"
  },
  "⏭️": {
    "es": "pista siguiente",
    "fr": "bouton piste suivante",
    "de": "Nächster Titel",
    "ja": "次の曲ボタン",
    "ko": "다음 트랙 버튼"
  },
  "⏯️": {
    "es": "reproducir o pausa",
    "fr": "bouton lecture/pause",
    "de": "Wiedergabe oder Pause",
    "ja": "再生／一時停止ボタン",
    "ko": "재생 또는 일시 정지 버튼"
  },
  "◀️": {
    "es": "retroceso",
    "fr": "bouton retour",
    "de": "Pfeil zurück",
    "ja": "逆再生ボタン",
    "ko": "반대로 버튼"
  },
  "⏪": {
    "es": "retroceso rápido",
    "fr": "bouton retour rapide",
    "de": "Zurückspulen",
    "ja": "早戻しボタン",
    "ko": "되감기 버튼"
  },
  "⏮️": {
    "es": "pista anterior",
    "fr": "bouton piste précédente",
    "de": "Vorheriger Titel",
    "ja": "前の曲ボタン",
    "ko": "이전 트랙 버튼"
  },
  "🔼": {
    "es": "triángulo hacia arriba",
    "fr": "petit triangle haut",
    "de": "Aufwärts-Schaltfläche",
    "ja": "上ボタン",
    "ko": "올리기 버튼"
  },
  "⏫": {
    "es": "triángulo doble hacia arriba",
    "fr": "double flèche vers le haut",
    "de": "Doppelpfeile nach oben",
    "ja": "高速上ボタン",
    "ko": "빨리 올리기 버튼"
  },
  "🔽": {
    "es": "triángulo hacia abajo",
    "fr": "petit triangle bas",
    "de": "Abwärts-Schaltfläche",
    "ja": "下ボタン",
    "ko": "내리기 버튼"
  },
  "⏬": {
    "es": "triángulo doble hacia abajo",
    "fr": "double flèche vers le bas",
    "de": "Doppelpfeile nach unten",
    "ja": "高速下ボタン",
    "ko": "빨리 내리기 버튼"
  },
  "⏸️": {
    "es": "pausa",
    "fr": "bouton pause",
    "de": "Pause",
    "ja": "一時停止ボタン",
    "ko": "일시 정지 버튼"
  },
  "⏹️": {
    "es": "detener",
    "fr": "bouton stop",
    "de": "Stopp",
    "ja": "停止ボタン",
    "ko": "정지 버튼"
  },
  "⏺️": {
    "es": "grabar",
    "fr": "bouton enregistrer",
    "de": "Aufnehmen",
    "ja": "録音録画ボタン",
    "ko": "녹음/녹화 버튼"
  },
  "⏏️": {
    "es": "expulsar",
    "fr": "bouton éjecter",
    "de": "Auswerfen",
    "ja": "取り出しボタン",
    "ko": "꺼냄 버튼"
  },
  "🎦": {
    "es": "cine",
    "fr": "cinéma",
    "de": "Kinosymbol",
    "ja": "映画",
    "ko": "영화"
  },
  "🔅": {
    "es": "brillo bajo",
    "fr": "luminosité faible",
    "de": "Taste Dimmen",
    "ja": "低輝度",
    "ko": "밝기 낮음"
  },
  "🔆": {
    "es": "brillo alto",
    "fr": "luminosité élevée",
    "de": "Heller-Taste",
    "ja": "高輝度",
    "ko": "밝기 높음"
  },
  "📶": {
    "es": "barras de cobertura",
    "fr": "barres de réseau",
    "de": "balkenförmige Signalstärkenanzeige",
    "ja": "アンテナマーク",
    "ko": "안테나 신호"
  },
  "🛜": {
    "es": "wifi",
    "fr": "sans fil",
    "de": "WLAN",
    "ja": "Wi-Fi",
    "ko": "무선"
  },
  "📳": {
    "es": "modo vibración",
    "fr": "mode vibreur",
    "de": "Vibrationsmodus",
    "ja": "マナーモード",
    "ko": "진동 모드"
  },
  "📴": {
    "es": "teléfono móvil apagado",
    "fr": "téléphone éteint",
    "de": "Mobiltelefon aus",
    "ja": "携帯電話電源オフ",
    "ko": "휴대전화 끄기"
  },
  "🟰": {
    "es": "signo igual grueso",
    "fr": "signe égal gras",
    "de": "Gleichheitszeichen extrafett",
    "ja": "太字の等号",
    "ko": "등호 기호"
  },
  "⚛️": {
    "es": "símbolo de átomo",
    "fr": "symbole de l’atome",
    "de": "Atomzeichen",
    "ja": "原子のシンボル",
    "ko": "원자 기호"
  },
  "☸️": {
    "es": "rueda del dharma",
    "fr": "roue du Dharma",
    "de": "Dharma-Rad",
    "ja": "法輪",
    "ko": "진리의 수레바퀴"
  },
  "☯️": {
    "es": "yin yang",
    "fr": "yin yang",
    "de": "Yin und Yang",
    "ja": "陰陽",
    "ko": "음양"
  },
  "✡️": {
    "es": "estrella de David",
    "fr": "étoile de David",
    "de": "Davidstern",
    "ja": "ダビデの星",
    "ko": "다윗의 별"
  },
  "☢️": {
    "es": "radiactivo",
    "fr": "radioactif",
    "de": "Radioaktiv",
    "ja": "放射能",
    "ko": "방사능"
  },
  "☣️": {
    "es": "riesgo biológico",
    "fr": "danger biologique",
    "de": "Biogefährdung",
    "ja": "バイオハザード",
    "ko": "생물학적 위험"
  },
  "♀️": {
    "es": "signo femenino",
    "fr": "symbole de la femme",
    "de": "Frauensymbol",
    "ja": "女性のマーク",
    "ko": "여성 기호"
  },
  "♂️": {
    "es": "signo masculino",
    "fr": "symbole de l’homme",
    "de": "Männersymbol",
    "ja": "男性のマーク",
    "ko": "남성 기호"
  },
  "⚧️": {
    "es": "símbolo de transgénero",
    "fr": "symbole de la communauté transgenre",
    "de": "Transgender-Symbol",
    "ja": "トランスジェンダーのマーク",
    "ko": "트랜스젠더 기호"
  },
  "✝️": {
    "es": "cruz latina",
    "fr": "croix latine",
    "de": "lateinisches Kreuz",
    "ja": "十字架",
    "ko": "라틴 십자가"
  },
  "☦️": {
    "es": "cruz ortodoxa",
    "fr": "croix orthodoxe",
    "de": "orthodoxes Kreuz",
    "ja": "八端十字架",
    "ko": "전통적인 십자가"
  },
  "☪️": {
    "es": "media luna y estrella",
    "fr": "lune et étoile",
    "de": "Hilal und Stern",
    "ja": "星と三日月",
    "ko": "초승달과 별"
  },
  "☮️": {
    "es": "símbolo de la paz",
    "fr": "symbole de paix",
    "de": "Friedenszeichen",
    "ja": "ピースマーク",
    "ko": "평화 기호"
  },
  "⚕️": {
    "es": "símbolo de medicina",
    "fr": "caducée",
    "de": "Äskulapstab",
    "ja": "医療のシンボル",
    "ko": "의학 기호"
  },
  "♻️": {
    "es": "símbolo de reciclaje",
    "fr": "symbole Recyclage",
    "de": "Recycling-Symbol",
    "ja": "リサイクルマーク",
    "ko": "재활용 표시"
  },
  "⚜️": {
    "es": "flor de lis",
    "fr": "fleur de lys",
    "de": "Lilie",
    "ja": "フルール・ド・リス",
    "ko": "백합 문장"
  },
  "🔱": {
    "es": "emblema de tridente",
    "fr": "trident",
    "de": "Dreizack",
    "ja": "トライデント",
    "ko": "삼지창"
  },
  "📛": {
    "es": "etiqueta identificativa",
    "fr": "badge nominatif",
    "de": "Namensschild",
    "ja": "名札",
    "ko": "이름표"
  },
  "🔰": {
    "es": "símbolo japonés para principiante",
    "fr": "symbole japonais de débutant",
    "de": "japanisches Anfänger-Zeichen",
    "ja": "初心者マーク",
    "ko": "일본 초보운전 표시"
  }
};

export function getEmojiLearningTranslation(
  item: { emoji?: string; cn?: string },
  locale: Locale,
): string | null {
  if (locale === 'en') return null;
  if (locale === 'zh-CN') return item.cn?.trim() || null;
  if (!item.emoji) return null;
  return EMOJI_LOCALIZED_NAMES[item.emoji]?.[locale] ?? null;
}
