export type EmojiNounItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
};

export type EmojiNounCategory = {
  id: string;
  label: string;
  subtitle: string;
  items: EmojiNounItem[];
};

export const EMOJI_NOUN_CATEGORIES: EmojiNounCategory[] = [
  {
    "id": "smileys-emotion",
    "label": "笑脸与情感",
    "subtitle": "Smileys & Emotion",
    "items": [
      {
        "id": "grinning-face",
        "emoji": "😀",
        "word": "Grinning Face",
        "cn": "咧嘴笑"
      },
      {
        "id": "grinning-face-with-big-eyes",
        "emoji": "😃",
        "word": "Grinning Face with Big Eyes",
        "cn": "大笑"
      },
      {
        "id": "grinning-face-with-smiling-eyes",
        "emoji": "😄",
        "word": "Grinning Face with Smiling Eyes",
        "cn": "微笑眼大笑"
      },
      {
        "id": "beaming-face-with-smiling-eyes",
        "emoji": "😁",
        "word": "Beaming Face with Smiling Eyes",
        "cn": "笑嘻嘻"
      },
      {
        "id": "grinning-squinting-face",
        "emoji": "😆",
        "word": "Grinning Squinting Face",
        "cn": "眯眼笑"
      },
      {
        "id": "grinning-face-with-sweat",
        "emoji": "😅",
        "word": "Grinning Face with Sweat",
        "cn": "流汗笑"
      },
      {
        "id": "rolling-on-the-floor-laughing",
        "emoji": "🤣",
        "word": "Rolling on the Floor Laughing",
        "cn": "笑到打滚"
      },
      {
        "id": "face-with-tears-of-joy",
        "emoji": "😂",
        "word": "Face with Tears of Joy",
        "cn": "笑哭"
      },
      {
        "id": "slightly-smiling-face",
        "emoji": "🙂",
        "word": "Slightly Smiling Face",
        "cn": "淡淡微笑"
      },
      {
        "id": "upside-down-face",
        "emoji": "🙃",
        "word": "Upside-Down Face",
        "cn": "倒脸笑"
      },
      {
        "id": "winking-face",
        "emoji": "😉",
        "word": "Winking Face",
        "cn": "眨眼"
      },
      {
        "id": "smiling-face-with-smiling-eyes",
        "emoji": "😊",
        "word": "Smiling Face with Smiling Eyes",
        "cn": "温柔笑"
      },
      {
        "id": "smiling-face-with-halo",
        "emoji": "😇",
        "word": "Smiling Face with Halo",
        "cn": "天使笑"
      },
      {
        "id": "smiling-face-with-hearts",
        "emoji": "🥰",
        "word": "Smiling Face with Hearts",
        "cn": "爱心环绕"
      },
      {
        "id": "smiling-face-with-heart-eyes",
        "emoji": "😍",
        "word": "Smiling Face with Heart-Eyes",
        "cn": "花痴爱心眼"
      },
      {
        "id": "star-struck",
        "emoji": "🤩",
        "word": "Star-Struck",
        "cn": "星星眼"
      },
      {
        "id": "face-blowing-a-kiss",
        "emoji": "😘",
        "word": "Face Blowing a Kiss",
        "cn": "飞吻"
      },
      {
        "id": "kissing-face",
        "emoji": "😗",
        "word": "Kissing Face",
        "cn": "亲亲"
      },
      {
        "id": "kissing-face-with-smiling-eyes",
        "emoji": "😙",
        "word": "Kissing Face with Smiling Eyes",
        "cn": "亲亲笑眼"
      },
      {
        "id": "kissing-face-with-closed-eyes",
        "emoji": "😚",
        "word": "Kissing Face with Closed Eyes",
        "cn": "紧闭眼亲亲"
      },
      {
        "id": "winking-face-with-tongue",
        "emoji": "😜",
        "word": "Winking Face with Tongue",
        "cn": "眨眼吐舌"
      },
      {
        "id": "squinting-face-with-tongue",
        "emoji": "😝",
        "word": "Squinting Face with Tongue",
        "cn": "调皮吐舌"
      },
      {
        "id": "face-with-tongue",
        "emoji": "😛",
        "word": "Face with Tongue",
        "cn": "吐舌"
      },
      {
        "id": "money-mouth-face",
        "emoji": "🤑",
        "word": "Money-Mouth Face",
        "cn": "见钱眼开"
      },
      {
        "id": "smiling-face-with-open-hands",
        "emoji": "🤗",
        "word": "Smiling Face with Open Hands",
        "cn": "拥抱"
      },
      {
        "id": "face-with-hand-over-mouth",
        "emoji": "🤭",
        "word": "Face with Hand Over Mouth",
        "cn": "偷笑"
      },
      {
        "id": "face-with-open-eyes-and-hand-over-mouth",
        "emoji": "🫢",
        "word": "Face with Open Eyes and Hand Over Mouth",
        "cn": "捂嘴惊讶"
      },
      {
        "id": "peeking-eye",
        "emoji": "🫣",
        "word": "Face With Peeking Eye",
        "cn": "偷看"
      },
      {
        "id": "shushing-face",
        "emoji": "🤫",
        "word": "Shushing Face",
        "cn": "嘘"
      },
      {
        "id": "thinking-face",
        "emoji": "🤔",
        "word": "Thinking Face",
        "cn": "思考"
      },
      {
        "id": "saluting-face",
        "emoji": "🫡",
        "word": "Saluting Face",
        "cn": "敬礼"
      },
      {
        "id": "zipper-mouth-face",
        "emoji": "🤐",
        "word": "Zipper-Mouth Face",
        "cn": "闭嘴"
      },
      {
        "id": "face-with-raised-eyebrow",
        "emoji": "🤨",
        "word": "Face with Raised Eyebrow",
        "cn": "挑眉怀疑"
      },
      {
        "id": "neutral-face",
        "emoji": "😐",
        "word": "Neutral Face",
        "cn": "面无表情"
      },
      {
        "id": "expressionless-face",
        "emoji": "😑",
        "word": "Expressionless Face",
        "cn": "无语"
      },
      {
        "id": "face-without-mouth",
        "emoji": "😶",
        "word": "Face Without Mouth",
        "cn": "沉默"
      },
      {
        "id": "dotted-line-face",
        "emoji": "🫥",
        "word": "Dotted Line Face",
        "cn": "隐身脸"
      },
      {
        "id": "smirking-face",
        "emoji": "😏",
        "word": "Smirking Face",
        "cn": "坏笑"
      },
      {
        "id": "unamused-face",
        "emoji": "😒",
        "word": "Unamused Face",
        "cn": "不爽"
      },
      {
        "id": "face-with-rolling-eyes",
        "emoji": "🙄",
        "word": "Face with Rolling Eyes",
        "cn": "翻白眼"
      },
      {
        "id": "grimacing-face",
        "emoji": "😬",
        "word": "Grimacing Face",
        "cn": "尴尬龇牙"
      },
      {
        "id": "lying-face",
        "emoji": "🤥",
        "word": "Lying Face",
        "cn": "说谎"
      },
      {
        "id": "relieved-face",
        "emoji": "😌",
        "word": "Relieved Face",
        "cn": "放松欣慰"
      },
      {
        "id": "pensive-face",
        "emoji": "😔",
        "word": "Pensive Face",
        "cn": "难过"
      },
      {
        "id": "tired-face",
        "emoji": "😪",
        "word": "Sleepy Face",
        "cn": "困倦"
      },
      {
        "id": "drooling-face",
        "emoji": "🤤",
        "word": "Drooling Face",
        "cn": "流口水"
      },
      {
        "id": "face-savoring-food",
        "emoji": "😋",
        "word": "Face Savoring Food",
        "cn": "馋嘴"
      },
      {
        "id": "face-in-clouds",
        "emoji": "😶‍🌫️",
        "word": "Face in Clouds",
        "cn": "雾脸"
      },
      {
        "id": "face-with-medical-mask",
        "emoji": "😷",
        "word": "Face with Medical Mask",
        "cn": "口罩"
      },
      {
        "id": "face-with-thermometer",
        "emoji": "🤒",
        "word": "Face with Thermometer",
        "cn": "发烧"
      },
      {
        "id": "face-with-head-bandage",
        "emoji": "🤕",
        "word": "Face with Head-Bandage",
        "cn": "受伤"
      },
      {
        "id": "nauseated-face",
        "emoji": "🤢",
        "word": "Nauseated Face",
        "cn": "恶心"
      },
      {
        "id": "face-vomiting",
        "emoji": "🤮",
        "word": "Face Vomiting",
        "cn": "呕吐"
      },
      {
        "id": "sneezing-face",
        "emoji": "🤧",
        "word": "Sneezing Face",
        "cn": "打喷嚏"
      },
      {
        "id": "hot-face",
        "emoji": "🥵",
        "word": "Hot Face",
        "cn": "热晕"
      },
      {
        "id": "cold-face",
        "emoji": "🥶",
        "word": "Cold Face",
        "cn": "冷僵"
      },
      {
        "id": "woozy-face",
        "emoji": "🥴",
        "word": "Woozy Face",
        "cn": "晕乎乎"
      },
      {
        "id": "dizzy-face",
        "emoji": "😵",
        "word": "Face with Crossed-out Eyes",
        "cn": "晕圈"
      },
      {
        "id": "face-with-spiral-eyes",
        "emoji": "😵‍💫",
        "word": "Face with Spiral Eyes",
        "cn": "晕头转向"
      },
      {
        "id": "exploding-head",
        "emoji": "🤯",
        "word": "Exploding Head",
        "cn": "头炸"
      },
      {
        "id": "cowboy-hat-face",
        "emoji": "🤠",
        "word": "Cowboy Hat Face",
        "cn": "牛仔帽"
      },
      {
        "id": "face-with-party-horn-and-hat",
        "emoji": "🥳",
        "word": "Partying Face",
        "cn": "派对庆祝"
      },
      {
        "id": "disguised-face",
        "emoji": "🥸",
        "word": "Disguised Face",
        "cn": "伪装"
      },
      {
        "id": "smiling-face-with-sunglasses",
        "emoji": "😎",
        "word": "Smiling Face with Sunglasses",
        "cn": "墨镜酷"
      },
      {
        "id": "nerd-face",
        "emoji": "🤓",
        "word": "Nerd Face",
        "cn": "书呆子"
      },
      {
        "id": "face-with-monocle",
        "emoji": "🧐",
        "word": "Face with Monocle",
        "cn": "侦探脸"
      },
      {
        "id": "confused-face",
        "emoji": "😕",
        "word": "Confused Face",
        "cn": "困惑"
      },
      {
        "id": "face-with-diagonal-mouth",
        "emoji": "🫤",
        "word": "Face with Diagonal Mouth",
        "cn": "茫然"
      },
      {
        "id": "worried-face",
        "emoji": "😟",
        "word": "Worried Face",
        "cn": "担心"
      },
      {
        "id": "slightly-frowning-face",
        "emoji": "🙁",
        "word": "Slightly Frowning Face",
        "cn": "有点不开心"
      },
      {
        "id": "face-with-open-mouth",
        "emoji": "😮",
        "word": "Face with Open Mouth",
        "cn": "惊讶张嘴"
      },
      {
        "id": "hushed-face",
        "emoji": "😯",
        "word": "Hushed Face",
        "cn": "安静惊讶"
      },
      {
        "id": "astonished-face",
        "emoji": "😲",
        "word": "Astonished Face",
        "cn": "震惊"
      },
      {
        "id": "flushed-face",
        "emoji": "😳",
        "word": "Flushed Face",
        "cn": "脸红"
      },
      {
        "id": "pleading-face",
        "emoji": "🥺",
        "word": "Pleading Face",
        "cn": "恳求"
      },
      {
        "id": "frowning-face-with-open-mouth",
        "emoji": "😦",
        "word": "Frowning Face with Open Mouth",
        "cn": "难过张嘴"
      },
      {
        "id": "anguished-face",
        "emoji": "😧",
        "word": "Anguished Face",
        "cn": "痛苦"
      },
      {
        "id": "fearful-face",
        "emoji": "😨",
        "word": "Fearful Face",
        "cn": "害怕"
      },
      {
        "id": "anxious-face-with-sweat",
        "emoji": "😰",
        "word": "Anxious Face with Sweat",
        "cn": "冷汗"
      },
      {
        "id": "sad-but-relieved-face",
        "emoji": "😥",
        "word": "Sad but Relieved Face",
        "cn": "难过流汗"
      },
      {
        "id": "crying-face",
        "emoji": "😢",
        "word": "Crying Face",
        "cn": "流泪"
      },
      {
        "id": "loudly-crying-face",
        "emoji": "😭",
        "word": "Loudly Crying Face",
        "cn": "大哭"
      },
      {
        "id": "face-screaming-in-fear",
        "emoji": "😱",
        "word": "Face Screaming in Fear",
        "cn": "吓死"
      },
      {
        "id": "confounded-face",
        "emoji": "😖",
        "word": "Confounded Face",
        "cn": "苦恼"
      },
      {
        "id": "persevering-face",
        "emoji": "😣",
        "word": "Persevering Face",
        "cn": "痛苦"
      },
      {
        "id": "disappointed-face",
        "emoji": "😞",
        "word": "Disappointed Face",
        "cn": "失望"
      },
      {
        "id": "downcast-face-with-sweat",
        "emoji": "😓",
        "word": "Downcast Face with Sweat",
        "cn": "无奈"
      },
      {
        "id": "weary-face",
        "emoji": "😩",
        "word": "Weary Face",
        "cn": "累瘫"
      },
      {
        "id": "tired-face-2",
        "emoji": "😫",
        "word": "Tired Face",
        "cn": "痛苦"
      },
      {
        "id": "yawning-face",
        "emoji": "🥱",
        "word": "Yawning Face",
        "cn": "打哈欠"
      },
      {
        "id": "frowning-face",
        "emoji": "☹️",
        "word": "Frowning Face",
        "cn": "难过"
      },
      {
        "id": "face-exhaling",
        "emoji": "😮‍💨",
        "word": "Face Exhaling",
        "cn": "叹气"
      },
      {
        "id": "face-with-steam-from-nose",
        "emoji": "😤",
        "word": "Face with Steam from Nose",
        "cn": "鼻孔生气"
      },
      {
        "id": "angry-face",
        "emoji": "😠",
        "word": "Angry Face",
        "cn": "生气"
      },
      {
        "id": "pouting-face",
        "emoji": "😡",
        "word": "Enraged Face",
        "cn": "暴怒"
      },
      {
        "id": "face-with-symbols-on-mouth",
        "emoji": "🤬",
        "word": "Face with Symbols on Mouth",
        "cn": "脏话骂人"
      },
      {
        "id": "smiling-face-with-horns",
        "emoji": "😈",
        "word": "Smiling Face with Horns",
        "cn": "恶魔笑"
      },
      {
        "id": "angry-face-with-horns",
        "emoji": "👿",
        "word": "Angry Face with Horns",
        "cn": "愤怒恶魔"
      },
      {
        "id": "skull",
        "emoji": "💀",
        "word": "Skull",
        "cn": "骷髅"
      },
      {
        "id": "pile-of-poo",
        "emoji": "💩",
        "word": "Pile of Poo",
        "cn": "便便"
      },
      {
        "id": "clown-face",
        "emoji": "🤡",
        "word": "Clown Face",
        "cn": "小丑"
      },
      {
        "id": "ogre",
        "emoji": "👹",
        "word": "Ogre",
        "cn": "鬼怪"
      },
      {
        "id": "goblin",
        "emoji": "👺",
        "word": "Goblin",
        "cn": "天狗"
      },
      {
        "id": "ghost",
        "emoji": "👻",
        "word": "Ghost",
        "cn": "幽灵"
      },
      {
        "id": "alien",
        "emoji": "👽",
        "word": "Alien",
        "cn": "外星人"
      },
      {
        "id": "alien-monster",
        "emoji": "👾",
        "word": "Alien Monster",
        "cn": "外星怪物"
      },
      {
        "id": "robot",
        "emoji": "🤖",
        "word": "Robot",
        "cn": "机器人"
      },
      {
        "id": "grinning-cat",
        "emoji": "😺",
        "word": "Grinning Cat",
        "cn": "微笑猫"
      },
      {
        "id": "grinning-cat-with-smiling-eyes",
        "emoji": "😸",
        "word": "Grinning Cat with Smiling Eyes",
        "cn": "开心猫"
      },
      {
        "id": "cat-with-tears-of-joy",
        "emoji": "😹",
        "word": "Cat with Tears of Joy",
        "cn": "笑哭猫"
      },
      {
        "id": "smiling-cat-with-heart-eyes",
        "emoji": "😻",
        "word": "Smiling Cat with Heart-Eyes",
        "cn": "爱心眼猫"
      },
      {
        "id": "cat-with-wry-smile",
        "emoji": "😼",
        "word": "Cat with Wry Smile",
        "cn": "坏笑猫"
      },
      {
        "id": "kissing-cat",
        "emoji": "😽",
        "word": "Kissing Cat",
        "cn": "亲亲猫"
      },
      {
        "id": "weary-cat",
        "emoji": "🙀",
        "word": "Weary Cat",
        "cn": "惊吓猫"
      },
      {
        "id": "crying-cat",
        "emoji": "😿",
        "word": "Crying Cat",
        "cn": "难过猫"
      },
      {
        "id": "pouting-cat",
        "emoji": "😾",
        "word": "Pouting Cat",
        "cn": "生气猫"
      },
      {
        "id": "melting-face",
        "emoji": "🫠",
        "word": "Melting Face",
        "cn": "融化脸"
      },
      {
        "id": "smiling-face-with-tear",
        "emoji": "🥲",
        "word": "Smiling Face with Tear",
        "cn": "含泪微笑"
      },
      {
        "id": "zany-face",
        "emoji": "🤪",
        "word": "Zany Face",
        "cn": "搞怪"
      },
      {
        "id": "shaking-face",
        "emoji": "🫨",
        "word": "Shaking Face",
        "cn": "颤抖"
      },
      {
        "id": "head-shaking-horizontally",
        "emoji": "🙂‍↔️",
        "word": "Head Shaking Horizontally",
        "cn": "左右摇头"
      },
      {
        "id": "head-shaking-vertically",
        "emoji": "🙂‍↕️",
        "word": "Head Shaking Vertically",
        "cn": "上下点头"
      },
      {
        "id": "sleeping-face",
        "emoji": "😴",
        "word": "Sleeping Face",
        "cn": "睡觉"
      },
      {
        "id": "face-with-bags-under-eyes",
        "emoji": "🫩",
        "word": "Face with Bags Under Eyes",
        "cn": "黑眼圈"
      },
      {
        "id": "face-holding-back-tears",
        "emoji": "🥹",
        "word": "Face Holding Back Tears",
        "cn": "强忍泪水"
      },
      {
        "id": "skull-and-crossbones",
        "emoji": "☠",
        "word": "Skull and Crossbones",
        "cn": "骷髅交叉骨"
      },
      {
        "id": "see-no-evil-monkey",
        "emoji": "🙈",
        "word": "See-No-Evil Monkey",
        "cn": "非礼勿视"
      },
      {
        "id": "hear-no-evil-monkey",
        "emoji": "🙉",
        "word": "Hear-No-Evil Monkey",
        "cn": "非礼勿听"
      },
      {
        "id": "speak-no-evil-monkey",
        "emoji": "🙊",
        "word": "Speak-No-Evil Monkey",
        "cn": "非礼勿言"
      }
    ]
  },
  {
    "id": "body",
    "label": "身体",
    "subtitle": "Body",
    "items": [
      {
        "id": "waving-hand",
        "emoji": "👋",
        "word": "Waving Hand",
        "cn": "挥手"
      },
      {
        "id": "raised-back-of-hand",
        "emoji": "🤚",
        "word": "Raised Back Of Hand",
        "cn": "手背抬起"
      },
      {
        "id": "hand-with-fingers-splayed",
        "emoji": "🖐",
        "word": "Hand With Fingers Splayed",
        "cn": "手指张开的手"
      },
      {
        "id": "raised-hand",
        "emoji": "✋",
        "word": "Raised Hand",
        "cn": "举手"
      },
      {
        "id": "vulcan-salute",
        "emoji": "🖖",
        "word": "Vulcan Salute",
        "cn": "瓦肯举手礼"
      },
      {
        "id": "rightwards-hand",
        "emoji": "🫱",
        "word": "Rightwards Hand",
        "cn": "右手"
      },
      {
        "id": "leftwards-hand",
        "emoji": "🫲",
        "word": "Leftwards Hand",
        "cn": "左手"
      },
      {
        "id": "palm-down-hand",
        "emoji": "🫳",
        "word": "Palm Down Hand",
        "cn": "掌心向下的手"
      },
      {
        "id": "palm-up-hand",
        "emoji": "🫴",
        "word": "Palm Up Hand",
        "cn": "掌心向上的手"
      },
      {
        "id": "leftwards-pushing-hand",
        "emoji": "🫷",
        "word": "Leftwards Pushing Hand",
        "cn": "向左推的手"
      },
      {
        "id": "rightwards-pushing-hand",
        "emoji": "🫸",
        "word": "Rightwards Pushing Hand",
        "cn": "向右推的手"
      },
      {
        "id": "ok-hand",
        "emoji": "👌",
        "word": "OK Hand",
        "cn": "OK手势"
      },
      {
        "id": "pinched-fingers",
        "emoji": "🤌",
        "word": "Pinched Fingers",
        "cn": "捏手指"
      },
      {
        "id": "pinching-hand",
        "emoji": "🤏",
        "word": "Pinching Hand",
        "cn": "捏合的手"
      },
      {
        "id": "victory-hand",
        "emoji": "✌",
        "word": "Victory Hand",
        "cn": "胜利手势"
      },
      {
        "id": "crossed-fingers",
        "emoji": "🤞",
        "word": "Crossed Fingers",
        "cn": "交叉手指"
      },
      {
        "id": "hand-with-index-finger-and-thumb-crossed",
        "emoji": "🫰",
        "word": "Hand With Index Finger And Thumb Crossed",
        "cn": "食指与拇指交叉的手"
      },
      {
        "id": "love-you-gesture",
        "emoji": "🤟",
        "word": "Love-You Gesture",
        "cn": "比心手势"
      },
      {
        "id": "sign-of-the-horns",
        "emoji": "🤘",
        "word": "Sign Of The Horns",
        "cn": "摇滚手势"
      },
      {
        "id": "call-me-hand",
        "emoji": "🤙",
        "word": "Call Me Hand",
        "cn": "打电话手势"
      },
      {
        "id": "backhand-index-pointing-left",
        "emoji": "👈",
        "word": "Backhand Index Pointing Left",
        "cn": "左手食指指向左"
      },
      {
        "id": "backhand-index-pointing-right",
        "emoji": "👉",
        "word": "Backhand Index Pointing Right",
        "cn": "右指反手食指"
      },
      {
        "id": "backhand-index-pointing-up",
        "emoji": "👆",
        "word": "Backhand Index Pointing Up",
        "cn": "食指向上指"
      },
      {
        "id": "middle-finger",
        "emoji": "🖕",
        "word": "Middle Finger",
        "cn": "中指"
      },
      {
        "id": "backhand-index-pointing-down",
        "emoji": "👇",
        "word": "Backhand Index Pointing Down",
        "cn": "反手向下指"
      },
      {
        "id": "index-pointing-up",
        "emoji": "☝",
        "word": "Index Pointing Up",
        "cn": "食指向上指"
      },
      {
        "id": "index-pointing-at-the-viewer",
        "emoji": "🫵",
        "word": "Index Pointing At The Viewer",
        "cn": "指向观看者的食指"
      },
      {
        "id": "thumbs-up",
        "emoji": "👍",
        "word": "Thumbs Up",
        "cn": "点赞"
      },
      {
        "id": "thumbs-down",
        "emoji": "👎",
        "word": "Thumbs Down",
        "cn": "向下点赞"
      },
      {
        "id": "raised-fist",
        "emoji": "✊",
        "word": "Raised Fist",
        "cn": "握拳"
      },
      {
        "id": "oncoming-fist",
        "emoji": "👊",
        "word": "Oncoming Fist",
        "cn": "迎面而来的拳头"
      },
      {
        "id": "left-facing-fist",
        "emoji": "🤛",
        "word": "Left-Facing Fist",
        "cn": "左拳"
      },
      {
        "id": "right-facing-fist",
        "emoji": "🤜",
        "word": "Right-Facing Fist",
        "cn": "右拳"
      },
      {
        "id": "clapping-hands",
        "emoji": "👏",
        "word": "Clapping Hands",
        "cn": "鼓掌"
      },
      {
        "id": "raising-hands",
        "emoji": "🙌",
        "word": "Raising Hands",
        "cn": "举手"
      },
      {
        "id": "heart-hands",
        "emoji": "🫶",
        "word": "Heart Hands",
        "cn": "爱心手势"
      },
      {
        "id": "open-hands",
        "emoji": "👐",
        "word": "Open Hands",
        "cn": "张开的双手"
      },
      {
        "id": "palms-up-together",
        "emoji": "🤲",
        "word": "Palms Up Together",
        "cn": "双手掌心向上"
      },
      {
        "id": "handshake",
        "emoji": "🤝",
        "word": "Handshake",
        "cn": "握手"
      },
      {
        "id": "folded-hands",
        "emoji": "🙏",
        "word": "Folded Hands",
        "cn": "合十"
      },
      {
        "id": "writing-hand",
        "emoji": "✍",
        "word": "Writing Hand",
        "cn": "书写手"
      },
      {
        "id": "nail-polish",
        "emoji": "💅",
        "word": "Nail Polish",
        "cn": "指甲油"
      },
      {
        "id": "flexed-biceps",
        "emoji": "💪",
        "word": "Flexed Biceps",
        "cn": "弯曲的二头肌"
      },
      {
        "id": "leg",
        "emoji": "🦵",
        "word": "Leg",
        "cn": "腿"
      },
      {
        "id": "foot",
        "emoji": "🦶",
        "word": "Foot",
        "cn": "脚"
      },
      {
        "id": "ear",
        "emoji": "👂",
        "word": "Ear",
        "cn": "耳朵"
      },
      {
        "id": "ear-with-hearing-aid",
        "emoji": "🦻",
        "word": "Ear With Hearing Aid",
        "cn": "带助听器的耳朵"
      },
      {
        "id": "nose",
        "emoji": "👃",
        "word": "Nose",
        "cn": "鼻子"
      },
      {
        "id": "brain",
        "emoji": "🧠",
        "word": "Brain",
        "cn": "大脑"
      },
      {
        "id": "anatomical-heart",
        "emoji": "🫀",
        "word": "Anatomical Heart",
        "cn": "解剖心脏"
      },
      {
        "id": "lungs",
        "emoji": "🫁",
        "word": "Lungs",
        "cn": "肺"
      },
      {
        "id": "tooth",
        "emoji": "🦷",
        "word": "Tooth",
        "cn": "牙齿"
      },
      {
        "id": "bone",
        "emoji": "🦴",
        "word": "Bone",
        "cn": "骨头"
      },
      {
        "id": "eyes",
        "emoji": "👀",
        "word": "Eyes",
        "cn": "眼睛"
      },
      {
        "id": "eye",
        "emoji": "👁",
        "word": "Eye",
        "cn": "眼睛"
      },
      {
        "id": "tongue",
        "emoji": "👅",
        "word": "Tongue",
        "cn": "舌头"
      },
      {
        "id": "mouth",
        "emoji": "👄",
        "word": "Mouth",
        "cn": "嘴巴"
      },
      {
        "id": "biting-lip",
        "emoji": "🫦",
        "word": "Biting Lip",
        "cn": "咬嘴唇"
      },
      {
        "id": "blond-hair",
        "emoji": "👱‍♀️",
        "word": "Blond Hair",
        "cn": "人物：金发"
      },
      {
        "id": "frowning",
        "emoji": "🙍‍♀️",
        "word": "Frowning",
        "cn": "皱眉的人"
      },
      {
        "id": "pouting",
        "emoji": "🙎‍♀️",
        "word": "Pouting",
        "cn": "噘嘴的人"
      },
      {
        "id": "gesturing-no",
        "emoji": "🙅‍♀️",
        "word": "Gesturing NO",
        "cn": "做出拒绝手势的人"
      },
      {
        "id": "gesturing-ok",
        "emoji": "🙆‍♀️",
        "word": "Gesturing OK",
        "cn": "比出OK手势的人"
      },
      {
        "id": "tipping-hand",
        "emoji": "💁‍♀️",
        "word": "Tipping Hand",
        "cn": "抬手示意的人"
      },
      {
        "id": "raising-hand",
        "emoji": "🙋‍♀️",
        "word": "Raising Hand",
        "cn": "举手的人"
      },
      {
        "id": "deaf",
        "emoji": "🧏‍♀️",
        "word": "Deaf",
        "cn": "听障人士"
      },
      {
        "id": "bowing",
        "emoji": "🙇‍♀️",
        "word": "Bowing",
        "cn": "鞠躬的人"
      },
      {
        "id": "facepalming",
        "emoji": "🤦‍♀️",
        "word": "Facepalming",
        "cn": "捂脸的人"
      },
      {
        "id": "shrugging",
        "emoji": "🤷‍♀️",
        "word": "Shrugging",
        "cn": "人物耸肩"
      }
    ]
  },
  {
    "id": "people",
    "label": "人物",
    "subtitle": "People",
    "items": [
      {
        "id": "wearing-turban",
        "emoji": "👳‍♀️",
        "word": "Wearing Turban",
        "cn": "戴头巾的人"
      },
      {
        "id": "in-tuxedo",
        "emoji": "🤵‍♀️",
        "word": "In Tuxedo",
        "cn": "穿燕尾服的人"
      },
      {
        "id": "with-veil",
        "emoji": "👰‍♀️",
        "word": "With Veil",
        "cn": "戴面纱的人"
      },
      {
        "id": "merperson",
        "emoji": "🧜",
        "word": "Merperson",
        "cn": "人鱼"
      },
      {
        "id": "merman",
        "emoji": "🧜‍♂️",
        "word": "Merman",
        "cn": "美人鱼"
      },
      {
        "id": "in-steamy-room",
        "emoji": "🧖‍♀️",
        "word": "In Steamy Room",
        "cn": "桑拿房中的人"
      },
      {
        "id": "climbing",
        "emoji": "🧗‍♀️",
        "word": "Climbing",
        "cn": "攀爬的人"
      },
      {
        "id": "horse-racing",
        "emoji": "🏇",
        "word": "Horse Racing",
        "cn": "赛马"
      },
      {
        "id": "skier",
        "emoji": "⛷️",
        "word": "Skier",
        "cn": "滑雪者"
      },
      {
        "id": "snowboarder",
        "emoji": "🏂",
        "word": "Snowboarder",
        "cn": "滑雪板"
      },
      {
        "id": "selfie",
        "emoji": "🤳",
        "word": "Selfie",
        "cn": "自拍"
      },
      {
        "id": "mechanical-arm",
        "emoji": "🦾",
        "word": "Mechanical Arm",
        "cn": "机械手臂"
      },
      {
        "id": "mechanical-leg",
        "emoji": "🦿",
        "word": "Mechanical Leg",
        "cn": "机械腿"
      },
      {
        "id": "baby",
        "emoji": "👶",
        "word": "Baby",
        "cn": "婴儿"
      },
      {
        "id": "child",
        "emoji": "🧒",
        "word": "Child",
        "cn": "儿童"
      },
      {
        "id": "boy",
        "emoji": "👦",
        "word": "Boy",
        "cn": "男孩"
      },
      {
        "id": "girl",
        "emoji": "👧",
        "word": "Girl",
        "cn": "女孩"
      },
      {
        "id": "person",
        "emoji": "🧑",
        "word": "Person",
        "cn": "人"
      },
      {
        "id": "man",
        "emoji": "👨",
        "word": "Man",
        "cn": "男人"
      },
      {
        "id": "beard",
        "emoji": "🧔‍♀️",
        "word": "Beard",
        "cn": "人物：胡须"
      },
      {
        "id": "red-hair",
        "emoji": "👩‍🦰",
        "word": "Red Hair",
        "cn": "人物：红发"
      },
      {
        "id": "curly-hair",
        "emoji": "👩‍🦱",
        "word": "Curly Hair",
        "cn": "人物：卷发"
      },
      {
        "id": "white-hair",
        "emoji": "👩‍🦳",
        "word": "White Hair",
        "cn": "人物：白发"
      },
      {
        "id": "bald",
        "emoji": "👩‍🦲",
        "word": "Bald",
        "cn": "人物：光头"
      },
      {
        "id": "woman",
        "emoji": "👩",
        "word": "Woman",
        "cn": "女性"
      },
      {
        "id": "older-person",
        "emoji": "🧓",
        "word": "Older Person",
        "cn": "年长者"
      },
      {
        "id": "old-man",
        "emoji": "👴",
        "word": "Old Man",
        "cn": "老人"
      },
      {
        "id": "old-woman",
        "emoji": "👵",
        "word": "Old Woman",
        "cn": "老妇人"
      },
      {
        "id": "health-worker",
        "emoji": "👩‍⚕️",
        "word": "Health Worker",
        "cn": "卫生工作者"
      },
      {
        "id": "student",
        "emoji": "👩‍🎓",
        "word": "Student",
        "cn": "学生"
      },
      {
        "id": "teacher",
        "emoji": "👩‍🏫",
        "word": "Teacher",
        "cn": "教师"
      },
      {
        "id": "judge",
        "emoji": "👩‍⚖️",
        "word": "Judge",
        "cn": "法官"
      },
      {
        "id": "farmer",
        "emoji": "👩‍🌾",
        "word": "Farmer",
        "cn": "农民"
      },
      {
        "id": "cook",
        "emoji": "👩‍🍳",
        "word": "Cook",
        "cn": "厨师"
      },
      {
        "id": "mechanic",
        "emoji": "👩‍🔧",
        "word": "Mechanic",
        "cn": "机械师"
      },
      {
        "id": "factory-worker",
        "emoji": "👩‍🏭",
        "word": "Factory Worker",
        "cn": "工厂工人"
      },
      {
        "id": "office-worker",
        "emoji": "👩‍💼",
        "word": "Office Worker",
        "cn": "办公室职员"
      },
      {
        "id": "scientist",
        "emoji": "👩‍🔬",
        "word": "Scientist",
        "cn": "科学家"
      },
      {
        "id": "technologist",
        "emoji": "👩‍💻",
        "word": "Technologist",
        "cn": "技术人员"
      },
      {
        "id": "singer",
        "emoji": "👩‍🎤",
        "word": "Singer",
        "cn": "歌手"
      },
      {
        "id": "artist",
        "emoji": "👩‍🎨",
        "word": "Artist",
        "cn": "艺术家"
      },
      {
        "id": "pilot",
        "emoji": "👩‍✈️",
        "word": "Pilot",
        "cn": "飞行员"
      },
      {
        "id": "astronaut",
        "emoji": "👩‍🚀",
        "word": "Astronaut",
        "cn": "宇航员"
      },
      {
        "id": "firefighter",
        "emoji": "👩‍🚒",
        "word": "Firefighter",
        "cn": "消防员"
      },
      {
        "id": "police-officer",
        "emoji": "👮‍♀️",
        "word": "Police Officer",
        "cn": "警察"
      },
      {
        "id": "detective",
        "emoji": "🕵️‍♀️",
        "word": "Detective",
        "cn": "侦探"
      },
      {
        "id": "guard",
        "emoji": "💂‍♀️",
        "word": "Guard",
        "cn": "警卫"
      },
      {
        "id": "ninja",
        "emoji": "🥷",
        "word": "Ninja",
        "cn": "忍者"
      },
      {
        "id": "construction-worker",
        "emoji": "👷‍♀️",
        "word": "Construction Worker",
        "cn": "建筑工人"
      },
      {
        "id": "prince",
        "emoji": "🤴",
        "word": "Prince",
        "cn": "王子"
      },
      {
        "id": "princess",
        "emoji": "👸",
        "word": "Princess",
        "cn": "公主"
      },
      {
        "id": "pregnant",
        "emoji": "🤰",
        "word": "Pregnant",
        "cn": "孕妇"
      },
      {
        "id": "breast-feeding",
        "emoji": "🤱",
        "word": "Breast-Feeding",
        "cn": "母乳喂养"
      },
      {
        "id": "feeding-baby",
        "emoji": "👩‍🍼",
        "word": "Feeding Baby",
        "cn": "喂婴儿的人"
      },
      {
        "id": "baby-angel",
        "emoji": "👼",
        "word": "Baby Angel",
        "cn": "小天使"
      },
      {
        "id": "santa-claus",
        "emoji": "🎅",
        "word": "Santa Claus",
        "cn": "圣诞老人"
      },
      {
        "id": "mrs-claus",
        "emoji": "🤶",
        "word": "Mrs. Claus",
        "cn": "圣诞夫人"
      },
      {
        "id": "mx-claus",
        "emoji": "🧑‍🎄",
        "word": "Mx Claus",
        "cn": "克劳斯先生/女士"
      },
      {
        "id": "superhero",
        "emoji": "🦸‍♀️",
        "word": "Superhero",
        "cn": "超级英雄"
      },
      {
        "id": "supervillain",
        "emoji": "🦹‍♀️",
        "word": "Supervillain",
        "cn": "超级反派"
      },
      {
        "id": "mage",
        "emoji": "🧙‍♀️",
        "word": "Mage",
        "cn": "法师"
      },
      {
        "id": "fairy",
        "emoji": "🧚‍♀️",
        "word": "Fairy",
        "cn": "仙女"
      },
      {
        "id": "vampire",
        "emoji": "🧛‍♀️",
        "word": "Vampire",
        "cn": "吸血鬼"
      },
      {
        "id": "mermaid",
        "emoji": "🧜‍♀️",
        "word": "Mermaid",
        "cn": "美人鱼"
      },
      {
        "id": "elf",
        "emoji": "🧝‍♀️",
        "word": "Elf",
        "cn": "精灵"
      },
      {
        "id": "genie",
        "emoji": "🧞‍♀️",
        "word": "Genie",
        "cn": "精灵"
      },
      {
        "id": "zombie",
        "emoji": "🧟‍♀️",
        "word": "Zombie",
        "cn": "僵尸"
      },
      {
        "id": "troll",
        "emoji": "🧌",
        "word": "Troll",
        "cn": "巨魔"
      },
      {
        "id": "getting-massage",
        "emoji": "💆‍♀️",
        "word": "Getting Massage",
        "cn": "接受按摩的人"
      },
      {
        "id": "getting-haircut",
        "emoji": "💇‍♀️",
        "word": "Getting Haircut",
        "cn": "正在理发的人"
      },
      {
        "id": "walking",
        "emoji": "🚶‍♀️",
        "word": "Walking",
        "cn": "行走的人"
      },
      {
        "id": "walking-facing-right",
        "emoji": "🚶‍♀️‍➡️",
        "word": "Walking: Facing Right",
        "cn": "行走的人：朝右"
      },
      {
        "id": "standing",
        "emoji": "🧍‍♀️",
        "word": "Standing",
        "cn": "站立的人"
      },
      {
        "id": "kneeling",
        "emoji": "🧎‍♀️",
        "word": "Kneeling",
        "cn": "跪地的人"
      },
      {
        "id": "kneeling-facing-right",
        "emoji": "🧎‍♀️‍➡️",
        "word": "Kneeling: Facing Right",
        "cn": "面向右侧的跪地人物"
      },
      {
        "id": "with-white-cane",
        "emoji": "👩‍🦯",
        "word": "With White Cane",
        "cn": "持白杖者"
      },
      {
        "id": "with-white-cane-facing-right",
        "emoji": "👩‍🦯‍➡️",
        "word": "With White Cane: Facing Right",
        "cn": "手持白手杖的人：面向右侧"
      },
      {
        "id": "in-motorized-wheelchair",
        "emoji": "👩‍🦼",
        "word": "In Motorized Wheelchair",
        "cn": "电动轮椅使用者"
      },
      {
        "id": "in-motorized-wheelchair-facing-right",
        "emoji": "👩‍🦼‍➡️",
        "word": "In Motorized Wheelchair: Facing Right",
        "cn": "电动轮椅使用者：面向右侧"
      },
      {
        "id": "in-manual-wheelchair",
        "emoji": "👩‍🦽",
        "word": "In Manual Wheelchair",
        "cn": "手动轮椅使用者"
      },
      {
        "id": "in-manual-wheelchair-facing-right",
        "emoji": "👩‍🦽‍➡️",
        "word": "In Manual Wheelchair: Facing Right",
        "cn": "手动轮椅使用者：面向右侧"
      },
      {
        "id": "running",
        "emoji": "🏃‍♀️",
        "word": "Running",
        "cn": "跑步的人"
      },
      {
        "id": "running-facing-right",
        "emoji": "🏃‍♀️‍➡️",
        "word": "Running: Facing Right",
        "cn": "跑步的人：面向右侧"
      },
      {
        "id": "ballet-dancer",
        "emoji": "🧑‍🩰",
        "word": "Ballet Dancer",
        "cn": "芭蕾舞演员"
      },
      {
        "id": "dancing",
        "emoji": "💃",
        "word": "Dancing",
        "cn": "跳舞"
      },
      {
        "id": "golfing",
        "emoji": "🏌️‍♀️",
        "word": "Golfing",
        "cn": "打高尔夫的人"
      },
      {
        "id": "surfing",
        "emoji": "🏄‍♀️",
        "word": "Surfing",
        "cn": "冲浪的人"
      },
      {
        "id": "rowing-boat",
        "emoji": "🚣‍♀️",
        "word": "Rowing Boat",
        "cn": "划船的人"
      },
      {
        "id": "swimming",
        "emoji": "🏊‍♀️",
        "word": "Swimming",
        "cn": "游泳的人"
      },
      {
        "id": "bouncing-ball",
        "emoji": "⛹️‍♀️",
        "word": "Bouncing Ball",
        "cn": "拍球的人"
      },
      {
        "id": "lifting-weights",
        "emoji": "🏋️‍♀️",
        "word": "Lifting Weights",
        "cn": "举铁的人"
      },
      {
        "id": "biking",
        "emoji": "🚴‍♀️",
        "word": "Biking",
        "cn": "骑行的人"
      },
      {
        "id": "mountain-biking",
        "emoji": "🚵‍♀️",
        "word": "Mountain Biking",
        "cn": "山地自行车骑行者"
      },
      {
        "id": "cartwheeling",
        "emoji": "🤸‍♀️",
        "word": "Cartwheeling",
        "cn": "翻侧手翻的人"
      },
      {
        "id": "people-wrestling",
        "emoji": "🤼",
        "word": "People Wrestling",
        "cn": "摔跤的人"
      },
      {
        "id": "playing-water-polo",
        "emoji": "🤽‍♀️",
        "word": "Playing Water Polo",
        "cn": "玩水球的人"
      },
      {
        "id": "playing-handball",
        "emoji": "🤾‍♀️",
        "word": "Playing Handball",
        "cn": "打手球的人"
      },
      {
        "id": "in-lotus-position",
        "emoji": "🧘‍♀️",
        "word": "In Lotus Position",
        "cn": "莲花坐姿的人"
      },
      {
        "id": "with-crown",
        "emoji": "🫅",
        "word": "With Crown",
        "cn": "戴皇冠的人"
      },
      {
        "id": "with-skullcap",
        "emoji": "👲",
        "word": "With Skullcap",
        "cn": "戴小圆帽的人"
      },
      {
        "id": "with-headscarf",
        "emoji": "🧕",
        "word": "With Headscarf",
        "cn": "戴头巾"
      },
      {
        "id": "in-suit-levitating",
        "emoji": "🕴",
        "word": "In Suit Levitating",
        "cn": "穿西装悬浮的人"
      },
      {
        "id": "people-with-bunny-ears",
        "emoji": "👯‍♀️",
        "word": "People With Bunny Ears",
        "cn": "戴兔耳朵"
      },
      {
        "id": "fencing",
        "emoji": "🤺",
        "word": "Fencing",
        "cn": "击剑的人"
      },
      {
        "id": "men-wrestling",
        "emoji": "🤼‍♂️",
        "word": "Men Wrestling",
        "cn": "摔跤"
      },
      {
        "id": "women-wrestling",
        "emoji": "🤼‍♀️",
        "word": "Women Wrestling",
        "cn": "摔跤"
      },
      {
        "id": "taking-bath",
        "emoji": "🛀",
        "word": "Taking Bath",
        "cn": "正在洗澡的人"
      },
      {
        "id": "in-bed",
        "emoji": "🛌",
        "word": "In Bed",
        "cn": "床上的人"
      }
    ]
  },
  {
    "id": "animals",
    "label": "动物",
    "subtitle": "Animals",
    "items": [
      {
        "id": "monkey-face",
        "emoji": "🐵",
        "word": "Monkey Face",
        "cn": "猴脸"
      },
      {
        "id": "monkey",
        "emoji": "🐒",
        "word": "Monkey",
        "cn": "猴子"
      },
      {
        "id": "gorilla",
        "emoji": "🦍",
        "word": "Gorilla",
        "cn": "大猩猩"
      },
      {
        "id": "orangutan",
        "emoji": "🦧",
        "word": "Orangutan",
        "cn": "红毛猩猩"
      },
      {
        "id": "dog-face",
        "emoji": "🐶",
        "word": "Dog Face",
        "cn": "狗脸"
      },
      {
        "id": "dog",
        "emoji": "🐕",
        "word": "Dog",
        "cn": "狗"
      },
      {
        "id": "guide-dog",
        "emoji": "🦮",
        "word": "Guide Dog",
        "cn": "导盲犬"
      },
      {
        "id": "service-dog",
        "emoji": "🐕‍🦺",
        "word": "Service Dog",
        "cn": "工作犬"
      },
      {
        "id": "poodle",
        "emoji": "🐩",
        "word": "Poodle",
        "cn": "贵宾犬"
      },
      {
        "id": "wolf",
        "emoji": "🐺",
        "word": "Wolf",
        "cn": "狼"
      },
      {
        "id": "fox",
        "emoji": "🦊",
        "word": "Fox",
        "cn": "狐狸"
      },
      {
        "id": "raccoon",
        "emoji": "🦝",
        "word": "Raccoon",
        "cn": "浣熊"
      },
      {
        "id": "cat-face",
        "emoji": "🐱",
        "word": "Cat Face",
        "cn": "猫脸"
      },
      {
        "id": "cat",
        "emoji": "🐈",
        "word": "Cat",
        "cn": "猫"
      },
      {
        "id": "black-cat",
        "emoji": "🐈‍⬛",
        "word": "Black Cat",
        "cn": "黑猫"
      },
      {
        "id": "lion",
        "emoji": "🦁",
        "word": "Lion",
        "cn": "狮子"
      },
      {
        "id": "tiger-face",
        "emoji": "🐯",
        "word": "Tiger Face",
        "cn": "老虎脸"
      },
      {
        "id": "tiger",
        "emoji": "🐅",
        "word": "Tiger",
        "cn": "老虎"
      },
      {
        "id": "leopard",
        "emoji": "🐆",
        "word": "Leopard",
        "cn": "豹子"
      },
      {
        "id": "horse-face",
        "emoji": "🐴",
        "word": "Horse Face",
        "cn": "马脸"
      },
      {
        "id": "moose",
        "emoji": "🫎",
        "word": "Moose",
        "cn": "驼鹿"
      },
      {
        "id": "donkey",
        "emoji": "🫏",
        "word": "Donkey",
        "cn": "驴"
      },
      {
        "id": "horse",
        "emoji": "🐎",
        "word": "Horse",
        "cn": "马"
      },
      {
        "id": "unicorn",
        "emoji": "🦄",
        "word": "Unicorn",
        "cn": "独角兽"
      },
      {
        "id": "zebra",
        "emoji": "🦓",
        "word": "Zebra",
        "cn": "斑马"
      },
      {
        "id": "deer",
        "emoji": "🦌",
        "word": "Deer",
        "cn": "鹿"
      },
      {
        "id": "bison",
        "emoji": "🦬",
        "word": "Bison",
        "cn": "野牛"
      },
      {
        "id": "cow-face",
        "emoji": "🐮",
        "word": "Cow Face",
        "cn": "牛脸"
      },
      {
        "id": "ox",
        "emoji": "🐂",
        "word": "Ox",
        "cn": "公牛"
      },
      {
        "id": "water-buffalo",
        "emoji": "🐃",
        "word": "Water Buffalo",
        "cn": "水牛"
      },
      {
        "id": "cow",
        "emoji": "🐄",
        "word": "Cow",
        "cn": "奶牛"
      },
      {
        "id": "pig-face",
        "emoji": "🐷",
        "word": "Pig Face",
        "cn": "猪头"
      },
      {
        "id": "pig",
        "emoji": "🐖",
        "word": "Pig",
        "cn": "猪"
      },
      {
        "id": "boar",
        "emoji": "🐗",
        "word": "Boar",
        "cn": "野猪"
      },
      {
        "id": "pig-nose",
        "emoji": "🐽",
        "word": "Pig Nose",
        "cn": "猪鼻子"
      },
      {
        "id": "ram",
        "emoji": "🐏",
        "word": "Ram",
        "cn": "公羊"
      },
      {
        "id": "ewe",
        "emoji": "🐑",
        "word": "Ewe",
        "cn": "母羊"
      },
      {
        "id": "goat",
        "emoji": "🐐",
        "word": "Goat",
        "cn": "山羊"
      },
      {
        "id": "camel",
        "emoji": "🐪",
        "word": "Camel",
        "cn": "骆驼"
      },
      {
        "id": "two-hump-camel",
        "emoji": "🐫",
        "word": "Two-Hump Camel",
        "cn": "双峰驼"
      },
      {
        "id": "llama",
        "emoji": "🦙",
        "word": "Llama",
        "cn": "羊驼"
      },
      {
        "id": "giraffe",
        "emoji": "🦒",
        "word": "Giraffe",
        "cn": "长颈鹿"
      },
      {
        "id": "elephant",
        "emoji": "🐘",
        "word": "Elephant",
        "cn": "大象"
      },
      {
        "id": "mammoth",
        "emoji": "🦣",
        "word": "Mammoth",
        "cn": "猛犸象"
      },
      {
        "id": "rhinoceros",
        "emoji": "🦏",
        "word": "Rhinoceros",
        "cn": "犀牛"
      },
      {
        "id": "hippopotamus",
        "emoji": "🦛",
        "word": "Hippopotamus",
        "cn": "河马"
      },
      {
        "id": "mouse-face",
        "emoji": "🐭",
        "word": "Mouse Face",
        "cn": "老鼠脸"
      },
      {
        "id": "mouse",
        "emoji": "🐁",
        "word": "Mouse",
        "cn": "老鼠"
      },
      {
        "id": "rat",
        "emoji": "🐀",
        "word": "Rat",
        "cn": "老鼠"
      },
      {
        "id": "hamster",
        "emoji": "🐹",
        "word": "Hamster",
        "cn": "仓鼠"
      },
      {
        "id": "rabbit-face",
        "emoji": "🐰",
        "word": "Rabbit Face",
        "cn": "兔脸"
      },
      {
        "id": "rabbit",
        "emoji": "🐇",
        "word": "Rabbit",
        "cn": "兔子"
      },
      {
        "id": "chipmunk",
        "emoji": "🐿️",
        "word": "Chipmunk",
        "cn": "花栗鼠"
      },
      {
        "id": "beaver",
        "emoji": "🦫",
        "word": "Beaver",
        "cn": "海狸"
      },
      {
        "id": "hedgehog",
        "emoji": "🦔",
        "word": "Hedgehog",
        "cn": "刺猬"
      },
      {
        "id": "bat",
        "emoji": "🦇",
        "word": "Bat",
        "cn": "蝙蝠"
      },
      {
        "id": "bear",
        "emoji": "🐻",
        "word": "Bear",
        "cn": "熊"
      },
      {
        "id": "polar-bear",
        "emoji": "🐻‍❄️",
        "word": "Polar Bear",
        "cn": "北极熊"
      },
      {
        "id": "koala",
        "emoji": "🐨",
        "word": "Koala",
        "cn": "考拉"
      },
      {
        "id": "panda",
        "emoji": "🐼",
        "word": "Panda",
        "cn": "熊猫"
      },
      {
        "id": "sloth",
        "emoji": "🦥",
        "word": "Sloth",
        "cn": "树懒"
      },
      {
        "id": "otter",
        "emoji": "🦦",
        "word": "Otter",
        "cn": "水獭"
      },
      {
        "id": "skunk",
        "emoji": "🦨",
        "word": "Skunk",
        "cn": "臭鼬"
      },
      {
        "id": "kangaroo",
        "emoji": "🦘",
        "word": "Kangaroo",
        "cn": "袋鼠"
      },
      {
        "id": "badger",
        "emoji": "🦡",
        "word": "Badger",
        "cn": "獾"
      },
      {
        "id": "paw-prints",
        "emoji": "🐾",
        "word": "Paw Prints",
        "cn": "爪印"
      },
      {
        "id": "turkey",
        "emoji": "🦃",
        "word": "Turkey",
        "cn": "火鸡"
      },
      {
        "id": "chicken",
        "emoji": "🐔",
        "word": "Chicken",
        "cn": "鸡"
      },
      {
        "id": "rooster",
        "emoji": "🐓",
        "word": "Rooster",
        "cn": "公鸡"
      },
      {
        "id": "hatching-chick",
        "emoji": "🐣",
        "word": "Hatching Chick",
        "cn": "破壳小鸡"
      },
      {
        "id": "baby-chick",
        "emoji": "🐤",
        "word": "Baby Chick",
        "cn": "小鸡"
      },
      {
        "id": "front-facing-baby-chick",
        "emoji": "🐥",
        "word": "Front-Facing Baby Chick",
        "cn": "面向前方的小鸡"
      },
      {
        "id": "bird",
        "emoji": "🐦",
        "word": "Bird",
        "cn": "鸟"
      },
      {
        "id": "penguin",
        "emoji": "🐧",
        "word": "Penguin",
        "cn": "企鹅"
      },
      {
        "id": "dove",
        "emoji": "🕊️",
        "word": "Dove",
        "cn": "鸽子"
      },
      {
        "id": "eagle",
        "emoji": "🦅",
        "word": "Eagle",
        "cn": "鹰"
      },
      {
        "id": "duck",
        "emoji": "🦆",
        "word": "Duck",
        "cn": "鸭子"
      },
      {
        "id": "swan",
        "emoji": "🦢",
        "word": "Swan",
        "cn": "天鹅"
      },
      {
        "id": "owl",
        "emoji": "🦉",
        "word": "Owl",
        "cn": "猫头鹰"
      },
      {
        "id": "dodo",
        "emoji": "🦤",
        "word": "Dodo",
        "cn": "渡渡鸟"
      },
      {
        "id": "feather",
        "emoji": "🪶",
        "word": "Feather",
        "cn": "羽毛"
      },
      {
        "id": "flamingo",
        "emoji": "🦩",
        "word": "Flamingo",
        "cn": "火烈鸟"
      },
      {
        "id": "peacock",
        "emoji": "🦚",
        "word": "Peacock",
        "cn": "孔雀"
      },
      {
        "id": "parrot",
        "emoji": "🦜",
        "word": "Parrot",
        "cn": "鹦鹉"
      },
      {
        "id": "wing",
        "emoji": "🪽",
        "word": "Wing",
        "cn": "翅膀"
      },
      {
        "id": "black-bird",
        "emoji": "🐦‍⬛",
        "word": "Black Bird",
        "cn": "黑色的鸟"
      },
      {
        "id": "goose",
        "emoji": "🪿",
        "word": "Goose",
        "cn": "鹅"
      },
      {
        "id": "phoenix",
        "emoji": "🐦‍🔥",
        "word": "Phoenix",
        "cn": "凤凰"
      },
      {
        "id": "frog",
        "emoji": "🐸",
        "word": "Frog",
        "cn": "青蛙"
      },
      {
        "id": "crocodile",
        "emoji": "🐊",
        "word": "Crocodile",
        "cn": "鳄鱼"
      },
      {
        "id": "turtle",
        "emoji": "🐢",
        "word": "Turtle",
        "cn": "乌龟"
      },
      {
        "id": "lizard",
        "emoji": "🦎",
        "word": "Lizard",
        "cn": "蜥蜴"
      },
      {
        "id": "snake",
        "emoji": "🐍",
        "word": "Snake",
        "cn": "蛇"
      },
      {
        "id": "dragon-face",
        "emoji": "🐲",
        "word": "Dragon Face",
        "cn": "龙脸"
      },
      {
        "id": "dragon",
        "emoji": "🐉",
        "word": "Dragon",
        "cn": "龙"
      },
      {
        "id": "sauropod",
        "emoji": "🦕",
        "word": "Sauropod",
        "cn": "蜥脚类恐龙"
      },
      {
        "id": "t-rex",
        "emoji": "🦖",
        "word": "T-Rex",
        "cn": "霸王龙"
      },
      {
        "id": "spouting-whale",
        "emoji": "🐳",
        "word": "Spouting Whale",
        "cn": "喷水的鲸鱼"
      },
      {
        "id": "whale",
        "emoji": "🐋",
        "word": "Whale",
        "cn": "鲸"
      },
      {
        "id": "dolphin",
        "emoji": "🐬",
        "word": "Dolphin",
        "cn": "海豚"
      },
      {
        "id": "seal",
        "emoji": "🦭",
        "word": "Seal",
        "cn": "海豹"
      },
      {
        "id": "fish",
        "emoji": "🐟",
        "word": "Fish",
        "cn": "鱼"
      },
      {
        "id": "tropical-fish",
        "emoji": "🐠",
        "word": "Tropical Fish",
        "cn": "热带鱼"
      },
      {
        "id": "blowfish",
        "emoji": "🐡",
        "word": "Blowfish",
        "cn": "河豚"
      },
      {
        "id": "shark",
        "emoji": "🦈",
        "word": "Shark",
        "cn": "鲨鱼"
      },
      {
        "id": "octopus",
        "emoji": "🐙",
        "word": "Octopus",
        "cn": "章鱼"
      },
      {
        "id": "spiral-shell",
        "emoji": "🐚",
        "word": "Spiral Shell",
        "cn": "螺旋贝壳"
      },
      {
        "id": "coral",
        "emoji": "🪸",
        "word": "Coral",
        "cn": "珊瑚"
      },
      {
        "id": "jellyfish",
        "emoji": "🪼",
        "word": "Jellyfish",
        "cn": "水母"
      },
      {
        "id": "crab",
        "emoji": "🦀",
        "word": "Crab",
        "cn": "螃蟹"
      },
      {
        "id": "lobster",
        "emoji": "🦞",
        "word": "Lobster",
        "cn": "龙虾"
      },
      {
        "id": "shrimp",
        "emoji": "🦐",
        "word": "Shrimp",
        "cn": "虾"
      },
      {
        "id": "squid",
        "emoji": "🦑",
        "word": "Squid",
        "cn": "鱿鱼"
      },
      {
        "id": "oyster",
        "emoji": "🦪",
        "word": "Oyster",
        "cn": "牡蛎"
      },
      {
        "id": "snail",
        "emoji": "🐌",
        "word": "Snail",
        "cn": "蜗牛"
      },
      {
        "id": "butterfly",
        "emoji": "🦋",
        "word": "Butterfly",
        "cn": "蝴蝶"
      },
      {
        "id": "bug",
        "emoji": "🐛",
        "word": "Bug",
        "cn": "昆虫"
      },
      {
        "id": "ant",
        "emoji": "🐜",
        "word": "Ant",
        "cn": "蚂蚁"
      },
      {
        "id": "honeybee",
        "emoji": "🐝",
        "word": "Honeybee",
        "cn": "蜜蜂"
      },
      {
        "id": "beetle",
        "emoji": "🪲",
        "word": "Beetle",
        "cn": "甲虫"
      },
      {
        "id": "lady-beetle",
        "emoji": "🐞",
        "word": "Lady Beetle",
        "cn": "瓢虫"
      },
      {
        "id": "cricket",
        "emoji": "🦗",
        "word": "Cricket",
        "cn": "蟋蟀"
      },
      {
        "id": "cockroach",
        "emoji": "🪳",
        "word": "Cockroach",
        "cn": "蟑螂"
      },
      {
        "id": "spider",
        "emoji": "🕷️",
        "word": "Spider",
        "cn": "蜘蛛"
      },
      {
        "id": "spider-web",
        "emoji": "🕸️",
        "word": "Spider Web",
        "cn": "蜘蛛网"
      },
      {
        "id": "scorpion",
        "emoji": "🦂",
        "word": "Scorpion",
        "cn": "蝎子"
      },
      {
        "id": "mosquito",
        "emoji": "🦟",
        "word": "Mosquito",
        "cn": "蚊子"
      },
      {
        "id": "fly",
        "emoji": "🪰",
        "word": "Fly",
        "cn": "苍蝇"
      },
      {
        "id": "worm",
        "emoji": "🪱",
        "word": "Worm",
        "cn": "蠕虫"
      },
      {
        "id": "microbe",
        "emoji": "🦠",
        "word": "Microbe",
        "cn": "微生物"
      }
    ]
  },
  {
    "id": "plants",
    "label": "植物与花",
    "subtitle": "Plants & Flowers",
    "items": [
      {
        "id": "bouquet",
        "emoji": "💐",
        "word": "Bouquet",
        "cn": "花束"
      },
      {
        "id": "cherry-blossom",
        "emoji": "🌸",
        "word": "Cherry Blossom",
        "cn": "樱花"
      },
      {
        "id": "white-flower",
        "emoji": "💮",
        "word": "White Flower",
        "cn": "白色花朵"
      },
      {
        "id": "lotus",
        "emoji": "🪷",
        "word": "Lotus",
        "cn": "荷花"
      },
      {
        "id": "rosette",
        "emoji": "🏵️",
        "word": "Rosette",
        "cn": "玫瑰花结"
      },
      {
        "id": "rose",
        "emoji": "🌹",
        "word": "Rose",
        "cn": "玫瑰"
      },
      {
        "id": "wilted-flower",
        "emoji": "🥀",
        "word": "Wilted Flower",
        "cn": "枯萎的花"
      },
      {
        "id": "hibiscus",
        "emoji": "🌺",
        "word": "Hibiscus",
        "cn": "木槿花"
      },
      {
        "id": "sunflower",
        "emoji": "🌻",
        "word": "Sunflower",
        "cn": "向日葵"
      },
      {
        "id": "blossom",
        "emoji": "🌼",
        "word": "Blossom",
        "cn": "花朵"
      },
      {
        "id": "tulip",
        "emoji": "🌷",
        "word": "Tulip",
        "cn": "郁金香"
      },
      {
        "id": "hyacinth",
        "emoji": "🪻",
        "word": "Hyacinth",
        "cn": "风信子"
      },
      {
        "id": "seedling",
        "emoji": "🌱",
        "word": "Seedling",
        "cn": "秧苗"
      },
      {
        "id": "potted-plant",
        "emoji": "🪴",
        "word": "Potted Plant",
        "cn": "盆栽"
      },
      {
        "id": "evergreen-tree",
        "emoji": "🌲",
        "word": "Evergreen Tree",
        "cn": "常青树"
      },
      {
        "id": "deciduous-tree",
        "emoji": "🌳",
        "word": "Deciduous Tree",
        "cn": "落叶树"
      },
      {
        "id": "palm-tree",
        "emoji": "🌴",
        "word": "Palm Tree",
        "cn": "棕榈树"
      },
      {
        "id": "cactus",
        "emoji": "🌵",
        "word": "Cactus",
        "cn": "仙人掌"
      },
      {
        "id": "sheaf-of-rice",
        "emoji": "🌾",
        "word": "Sheaf of Rice",
        "cn": "稻捆"
      },
      {
        "id": "herb",
        "emoji": "🌿",
        "word": "Herb",
        "cn": "草本植物"
      },
      {
        "id": "shamrock",
        "emoji": "☘️",
        "word": "Shamrock",
        "cn": "三叶草"
      },
      {
        "id": "four-leaf-clover",
        "emoji": "🍀",
        "word": "Four Leaf Clover",
        "cn": "四叶草"
      },
      {
        "id": "maple-leaf",
        "emoji": "🍁",
        "word": "Maple Leaf",
        "cn": "枫叶"
      },
      {
        "id": "fallen-leaf",
        "emoji": "🍂",
        "word": "Fallen Leaf",
        "cn": "落叶"
      },
      {
        "id": "leaf-fluttering-in-wind",
        "emoji": "🍃",
        "word": "Leaf Fluttering in Wind",
        "cn": "风中飘动的叶子"
      },
      {
        "id": "empty-nest",
        "emoji": "🪹",
        "word": "Empty Nest",
        "cn": "空巢"
      },
      {
        "id": "nest-with-eggs",
        "emoji": "🪺",
        "word": "Nest with Eggs",
        "cn": "带蛋的巢"
      },
      {
        "id": "mushroom",
        "emoji": "🍄",
        "word": "Mushroom",
        "cn": "蘑菇"
      },
      {
        "id": "leafless-tree",
        "emoji": "🪾",
        "word": "Leafless Tree",
        "cn": "无叶树"
      }
    ]
  },
  {
    "id": "food-drink",
    "label": "食物与饮品",
    "subtitle": "Food & Drink",
    "items": [
      {
        "id": "grapes",
        "emoji": "🍇",
        "word": "Grapes",
        "cn": "葡萄"
      },
      {
        "id": "melon",
        "emoji": "🍈",
        "word": "Melon",
        "cn": "甜瓜"
      },
      {
        "id": "watermelon",
        "emoji": "🍉",
        "word": "Watermelon",
        "cn": "西瓜"
      },
      {
        "id": "tangerine",
        "emoji": "🍊",
        "word": "Tangerine",
        "cn": "橘子"
      },
      {
        "id": "lemon",
        "emoji": "🍋",
        "word": "Lemon",
        "cn": "柠檬"
      },
      {
        "id": "lime",
        "emoji": "🍋‍🟩",
        "word": "Lime",
        "cn": "青柠"
      },
      {
        "id": "banana",
        "emoji": "🍌",
        "word": "Banana",
        "cn": "香蕉"
      },
      {
        "id": "pineapple",
        "emoji": "🍍",
        "word": "Pineapple",
        "cn": "菠萝"
      },
      {
        "id": "mango",
        "emoji": "🥭",
        "word": "Mango",
        "cn": "芒果"
      },
      {
        "id": "red-apple",
        "emoji": "🍎",
        "word": "Red Apple",
        "cn": "红苹果"
      },
      {
        "id": "green-apple",
        "emoji": "🍏",
        "word": "Green Apple",
        "cn": "青苹果"
      },
      {
        "id": "pear",
        "emoji": "🍐",
        "word": "Pear",
        "cn": "梨"
      },
      {
        "id": "peach",
        "emoji": "🍑",
        "word": "Peach",
        "cn": "桃子"
      },
      {
        "id": "cherries",
        "emoji": "🍒",
        "word": "Cherries",
        "cn": "樱桃"
      },
      {
        "id": "strawberry",
        "emoji": "🍓",
        "word": "Strawberry",
        "cn": "草莓"
      },
      {
        "id": "blueberries",
        "emoji": "🫐",
        "word": "Blueberries",
        "cn": "蓝莓"
      },
      {
        "id": "kiwi-fruit",
        "emoji": "🥝",
        "word": "Kiwi Fruit",
        "cn": "猕猴桃"
      },
      {
        "id": "tomato",
        "emoji": "🍅",
        "word": "Tomato",
        "cn": "番茄"
      },
      {
        "id": "olive",
        "emoji": "🫒",
        "word": "Olive",
        "cn": "橄榄"
      },
      {
        "id": "coconut",
        "emoji": "🥥",
        "word": "Coconut",
        "cn": "椰子"
      },
      {
        "id": "avocado",
        "emoji": "🥑",
        "word": "Avocado",
        "cn": "牛油果"
      },
      {
        "id": "eggplant",
        "emoji": "🍆",
        "word": "Eggplant",
        "cn": "茄子"
      },
      {
        "id": "potato",
        "emoji": "🥔",
        "word": "Potato",
        "cn": "土豆"
      },
      {
        "id": "carrot",
        "emoji": "🥕",
        "word": "Carrot",
        "cn": "胡萝卜"
      },
      {
        "id": "ear-of-corn",
        "emoji": "🌽",
        "word": "Ear of Corn",
        "cn": "玉米穗"
      },
      {
        "id": "hot-pepper",
        "emoji": "🌶️",
        "word": "Hot Pepper",
        "cn": "辣椒"
      },
      {
        "id": "bell-pepper",
        "emoji": "🫑",
        "word": "Bell Pepper",
        "cn": "甜椒"
      },
      {
        "id": "cucumber",
        "emoji": "🥒",
        "word": "Cucumber",
        "cn": "黄瓜"
      },
      {
        "id": "leafy-green",
        "emoji": "🥬",
        "word": "Leafy Green",
        "cn": "绿叶蔬菜"
      },
      {
        "id": "broccoli",
        "emoji": "🥦",
        "word": "Broccoli",
        "cn": "西兰花"
      },
      {
        "id": "garlic",
        "emoji": "🧄",
        "word": "Garlic",
        "cn": "大蒜"
      },
      {
        "id": "onion",
        "emoji": "🧅",
        "word": "Onion",
        "cn": "洋葱"
      },
      {
        "id": "peanuts",
        "emoji": "🥜",
        "word": "Peanuts",
        "cn": "花生"
      },
      {
        "id": "beans",
        "emoji": "🫘",
        "word": "Beans",
        "cn": "豆子"
      },
      {
        "id": "chestnut",
        "emoji": "🌰",
        "word": "Chestnut",
        "cn": "栗子"
      },
      {
        "id": "ginger-root",
        "emoji": "🫚",
        "word": "Ginger Root",
        "cn": "生姜"
      },
      {
        "id": "pea-pod",
        "emoji": "🫛",
        "word": "Pea Pod",
        "cn": "豆荚"
      },
      {
        "id": "brown-mushroom",
        "emoji": "🍄‍🟫",
        "word": "Brown Mushroom",
        "cn": "棕色蘑菇"
      },
      {
        "id": "root-vegetable",
        "emoji": "🫜",
        "word": "Root Vegetable",
        "cn": "根茎类蔬菜"
      },
      {
        "id": "bread",
        "emoji": "🍞",
        "word": "Bread",
        "cn": "面包"
      },
      {
        "id": "croissant",
        "emoji": "🥐",
        "word": "Croissant",
        "cn": "牛角包"
      },
      {
        "id": "baguette-bread",
        "emoji": "🥖",
        "word": "Baguette Bread",
        "cn": "法棍面包"
      },
      {
        "id": "flatbread",
        "emoji": "🫓",
        "word": "Flatbread",
        "cn": "扁平面包"
      },
      {
        "id": "pretzel",
        "emoji": "🥨",
        "word": "Pretzel",
        "cn": "椒盐卷饼"
      },
      {
        "id": "bagel",
        "emoji": "🥯",
        "word": "Bagel",
        "cn": "贝果"
      },
      {
        "id": "pancakes",
        "emoji": "🥞",
        "word": "Pancakes",
        "cn": "煎饼"
      },
      {
        "id": "waffle",
        "emoji": "🧇",
        "word": "Waffle",
        "cn": "华夫饼"
      },
      {
        "id": "cheese-wedge",
        "emoji": "🧀",
        "word": "Cheese Wedge",
        "cn": "奶酪块"
      },
      {
        "id": "meat-on-bone",
        "emoji": "🍖",
        "word": "Meat on Bone",
        "cn": "带骨肉类"
      },
      {
        "id": "poultry-leg",
        "emoji": "🍗",
        "word": "Poultry Leg",
        "cn": "鸡腿"
      },
      {
        "id": "cut-of-meat",
        "emoji": "🥩",
        "word": "Cut of Meat",
        "cn": "肉块"
      },
      {
        "id": "bacon",
        "emoji": "🥓",
        "word": "Bacon",
        "cn": "培根"
      },
      {
        "id": "hamburger",
        "emoji": "🍔",
        "word": "Hamburger",
        "cn": "汉堡"
      },
      {
        "id": "french-fries",
        "emoji": "🍟",
        "word": "French Fries",
        "cn": "薯条"
      },
      {
        "id": "pizza",
        "emoji": "🍕",
        "word": "Pizza",
        "cn": "披萨"
      },
      {
        "id": "hot-dog",
        "emoji": "🌭",
        "word": "Hot Dog",
        "cn": "热狗"
      },
      {
        "id": "sandwich",
        "emoji": "🥪",
        "word": "Sandwich",
        "cn": "三明治"
      },
      {
        "id": "taco",
        "emoji": "🌮",
        "word": "Taco",
        "cn": "塔可"
      },
      {
        "id": "burrito",
        "emoji": "🌯",
        "word": "Burrito",
        "cn": "墨西哥卷饼"
      },
      {
        "id": "tamale",
        "emoji": "🫔",
        "word": "Tamale",
        "cn": "塔马利"
      },
      {
        "id": "stuffed-flatbread",
        "emoji": "🥙",
        "word": "Stuffed Flatbread",
        "cn": "夹馅扁平面包"
      },
      {
        "id": "falafel",
        "emoji": "🧆",
        "word": "Falafel",
        "cn": "炸豆丸子"
      },
      {
        "id": "egg",
        "emoji": "🥚",
        "word": "Egg",
        "cn": "鸡蛋"
      },
      {
        "id": "cooking",
        "emoji": "🍳",
        "word": "Cooking",
        "cn": "烹饪"
      },
      {
        "id": "chopsticks",
        "emoji": "🥢",
        "word": "Chopsticks",
        "cn": "筷子"
      },
      {
        "id": "fork-and-knife-with-plate",
        "emoji": "🍽️",
        "word": "Fork and Knife with Plate",
        "cn": "带盘子的刀叉"
      },
      {
        "id": "fork-and-knife",
        "emoji": "🍴",
        "word": "Fork and Knife",
        "cn": "刀叉"
      },
      {
        "id": "spoon",
        "emoji": "🥄",
        "word": "Spoon",
        "cn": "勺子"
      },
      {
        "id": "kitchen-knife",
        "emoji": "🔪",
        "word": "Kitchen Knife",
        "cn": "厨房刀"
      },
      {
        "id": "shallow-pan-of-food",
        "emoji": "🥘",
        "word": "Shallow Pan of Food",
        "cn": "浅盘食物"
      },
      {
        "id": "pot-of-food",
        "emoji": "🍲",
        "word": "Pot of Food",
        "cn": "一锅食物"
      },
      {
        "id": "fondue",
        "emoji": "🫕",
        "word": "Fondue",
        "cn": "火锅"
      },
      {
        "id": "bowl-with-spoon",
        "emoji": "🥣",
        "word": "Bowl with Spoon",
        "cn": "带勺子的碗"
      },
      {
        "id": "green-salad",
        "emoji": "🥗",
        "word": "Green Salad",
        "cn": "绿色沙拉"
      },
      {
        "id": "popcorn",
        "emoji": "🍿",
        "word": "Popcorn",
        "cn": "爆米花"
      },
      {
        "id": "butter",
        "emoji": "🧈",
        "word": "Butter",
        "cn": "黄油"
      },
      {
        "id": "salt",
        "emoji": "🧂",
        "word": "Salt",
        "cn": "盐"
      },
      {
        "id": "canned-food",
        "emoji": "🥫",
        "word": "Canned Food",
        "cn": "罐头食品"
      },
      {
        "id": "jar",
        "emoji": "🫙",
        "word": "Jar",
        "cn": "罐子"
      },
      {
        "id": "amphora",
        "emoji": "🏺",
        "word": "Amphora",
        "cn": "双耳瓶"
      },
      {
        "id": "bento-box",
        "emoji": "🍱",
        "word": "Bento Box",
        "cn": "便当盒"
      },
      {
        "id": "rice-cracker",
        "emoji": "🍘",
        "word": "Rice Cracker",
        "cn": "米饼"
      },
      {
        "id": "rice-ball",
        "emoji": "🍙",
        "word": "Rice Ball",
        "cn": "饭团"
      },
      {
        "id": "cooked-rice",
        "emoji": "🍚",
        "word": "Cooked Rice",
        "cn": "熟米饭"
      },
      {
        "id": "curry-rice",
        "emoji": "🍛",
        "word": "Curry Rice",
        "cn": "咖喱饭"
      },
      {
        "id": "steaming-bowl",
        "emoji": "🍜",
        "word": "Steaming Bowl",
        "cn": "热气腾腾的碗"
      },
      {
        "id": "spaghetti",
        "emoji": "🍝",
        "word": "Spaghetti",
        "cn": "意大利面"
      },
      {
        "id": "roasted-sweet-potato",
        "emoji": "🍠",
        "word": "Roasted Sweet Potato",
        "cn": "烤红薯"
      },
      {
        "id": "oden",
        "emoji": "🍢",
        "word": "Oden",
        "cn": "关东煮"
      },
      {
        "id": "sushi",
        "emoji": "🍣",
        "word": "Sushi",
        "cn": "寿司"
      },
      {
        "id": "fried-shrimp",
        "emoji": "🍤",
        "word": "Fried Shrimp",
        "cn": "炸虾"
      },
      {
        "id": "fish-cake-with-swirl",
        "emoji": "🍥",
        "word": "Fish Cake with Swirl",
        "cn": "漩涡纹鱼糕"
      },
      {
        "id": "moon-cake",
        "emoji": "🥮",
        "word": "Moon Cake",
        "cn": "月饼"
      },
      {
        "id": "dango",
        "emoji": "🍡",
        "word": "Dango",
        "cn": "日式团子"
      },
      {
        "id": "dumpling",
        "emoji": "🥟",
        "word": "Dumpling",
        "cn": "饺子"
      },
      {
        "id": "fortune-cookie",
        "emoji": "🥠",
        "word": "Fortune Cookie",
        "cn": "幸运饼干"
      },
      {
        "id": "takeout-box",
        "emoji": "🥡",
        "word": "Takeout Box",
        "cn": "外卖盒"
      },
      {
        "id": "soft-ice-cream",
        "emoji": "🍦",
        "word": "Soft Ice Cream",
        "cn": "软冰淇淋"
      },
      {
        "id": "shaved-ice",
        "emoji": "🍧",
        "word": "Shaved Ice",
        "cn": "刨冰"
      },
      {
        "id": "ice-cream",
        "emoji": "🍨",
        "word": "Ice Cream",
        "cn": "冰淇淋"
      },
      {
        "id": "doughnut",
        "emoji": "🍩",
        "word": "Doughnut",
        "cn": "甜甜圈"
      },
      {
        "id": "cookie",
        "emoji": "🍪",
        "word": "Cookie",
        "cn": "饼干"
      },
      {
        "id": "birthday-cake",
        "emoji": "🎂",
        "word": "Birthday Cake",
        "cn": "生日蛋糕"
      },
      {
        "id": "shortcake",
        "emoji": "🍰",
        "word": "Shortcake",
        "cn": "草莓蛋糕"
      },
      {
        "id": "cupcake",
        "emoji": "🧁",
        "word": "Cupcake",
        "cn": "纸杯蛋糕"
      },
      {
        "id": "pie",
        "emoji": "🥧",
        "word": "Pie",
        "cn": "派"
      },
      {
        "id": "chocolate-bar",
        "emoji": "🍫",
        "word": "Chocolate Bar",
        "cn": "巧克力棒"
      },
      {
        "id": "candy",
        "emoji": "🍬",
        "word": "Candy",
        "cn": "糖果"
      },
      {
        "id": "lollipop",
        "emoji": "🍭",
        "word": "Lollipop",
        "cn": "棒棒糖"
      },
      {
        "id": "custard",
        "emoji": "🍮",
        "word": "Custard",
        "cn": "蛋奶冻"
      },
      {
        "id": "honey-pot",
        "emoji": "🍯",
        "word": "Honey Pot",
        "cn": "蜂蜜罐"
      },
      {
        "id": "baby-bottle",
        "emoji": "🍼",
        "word": "Baby Bottle",
        "cn": "奶瓶"
      },
      {
        "id": "glass-of-milk",
        "emoji": "🥛",
        "word": "Glass of Milk",
        "cn": "一杯牛奶"
      },
      {
        "id": "hot-beverage",
        "emoji": "☕️",
        "word": "Hot Beverage",
        "cn": "热饮"
      },
      {
        "id": "teapot",
        "emoji": "🫖",
        "word": "Teapot",
        "cn": "茶壶"
      },
      {
        "id": "teacup-without-handle",
        "emoji": "🍵",
        "word": "Teacup without Handle",
        "cn": "无柄茶杯"
      },
      {
        "id": "sake",
        "emoji": "🍶",
        "word": "Sake",
        "cn": "清酒"
      },
      {
        "id": "bottle-with-popping-cork",
        "emoji": "🍾",
        "word": "Bottle with Popping Cork",
        "cn": "开瓶塞的瓶子"
      },
      {
        "id": "wine-glass",
        "emoji": "🍷",
        "word": "Wine Glass",
        "cn": "高脚酒杯"
      },
      {
        "id": "cocktail-glass",
        "emoji": "🍸",
        "word": "Cocktail Glass",
        "cn": "鸡尾酒杯"
      },
      {
        "id": "tropical-drink",
        "emoji": "🍹",
        "word": "Tropical Drink",
        "cn": "热带饮品"
      },
      {
        "id": "beer-mug",
        "emoji": "🍺",
        "word": "Beer Mug",
        "cn": "啤酒杯"
      },
      {
        "id": "clinking-beer-mugs",
        "emoji": "🍻",
        "word": "Clinking Beer Mugs",
        "cn": "碰杯的啤酒杯"
      },
      {
        "id": "clinking-glasses",
        "emoji": "🥂",
        "word": "Clinking Glasses",
        "cn": "碰杯"
      },
      {
        "id": "tumbler-glass",
        "emoji": "🥃",
        "word": "Tumbler Glass",
        "cn": "平底杯"
      },
      {
        "id": "pouring-liquid",
        "emoji": "🫗",
        "word": "Pouring Liquid",
        "cn": "倾倒液体"
      },
      {
        "id": "cup-with-straw",
        "emoji": "🥤",
        "word": "Cup with Straw",
        "cn": "带吸管的杯子"
      },
      {
        "id": "bubble-tea",
        "emoji": "🧋",
        "word": "Bubble Tea",
        "cn": "珍珠奶茶"
      },
      {
        "id": "beverage-box",
        "emoji": "🧃",
        "word": "Beverage Box",
        "cn": "饮料盒"
      },
      {
        "id": "mate",
        "emoji": "🧉",
        "word": "Mate",
        "cn": "马黛茶"
      },
      {
        "id": "ice",
        "emoji": "🧊",
        "word": "Ice",
        "cn": "冰"
      }
    ]
  },
  {
    "id": "weather",
    "label": "天气",
    "subtitle": "Weather",
    "items": [
      {
        "id": "ringed-planet",
        "emoji": "🪐",
        "word": "Ringed Planet",
        "cn": "带环行星"
      },
      {
        "id": "star",
        "emoji": "⭐️",
        "word": "Star",
        "cn": "星星"
      },
      {
        "id": "glowing-star",
        "emoji": "🌟",
        "word": "Glowing Star",
        "cn": "发光的星星"
      },
      {
        "id": "shooting-star",
        "emoji": "🌠",
        "word": "Shooting Star",
        "cn": "流星"
      },
      {
        "id": "milky-way",
        "emoji": "🌌",
        "word": "Milky Way",
        "cn": "银河系"
      },
      {
        "id": "cloud",
        "emoji": "☁️",
        "word": "Cloud",
        "cn": "云"
      },
      {
        "id": "sun-behind-cloud",
        "emoji": "⛅️",
        "word": "Sun behind Cloud",
        "cn": "云后太阳"
      },
      {
        "id": "cloud-with-lightning-and-rain",
        "emoji": "⛈️",
        "word": "Cloud with Lightning and Rain",
        "cn": "带闪电和雨的云"
      },
      {
        "id": "sun-behind-small-cloud",
        "emoji": "🌤️",
        "word": "Sun behind Small Cloud",
        "cn": "小云朵后的太阳"
      },
      {
        "id": "sun-behind-large-cloud",
        "emoji": "🌥️",
        "word": "Sun behind Large Cloud",
        "cn": "大云后面的太阳"
      },
      {
        "id": "sun-behind-rain-cloud",
        "emoji": "🌦️",
        "word": "Sun behind Rain Cloud",
        "cn": "雨云后有太阳"
      },
      {
        "id": "cloud-with-rain",
        "emoji": "🌧️",
        "word": "Cloud with Rain",
        "cn": "带雨的云"
      },
      {
        "id": "cloud-with-snow",
        "emoji": "🌨️",
        "word": "Cloud with Snow",
        "cn": "带雪的云"
      },
      {
        "id": "cloud-with-lightning",
        "emoji": "🌩️",
        "word": "Cloud with Lightning",
        "cn": "带闪电的云"
      },
      {
        "id": "tornado",
        "emoji": "🌪️",
        "word": "Tornado",
        "cn": "龙卷风"
      },
      {
        "id": "fog",
        "emoji": "🌫️",
        "word": "Fog",
        "cn": "雾"
      },
      {
        "id": "wind-face",
        "emoji": "🌬️",
        "word": "Wind Face",
        "cn": "风脸"
      },
      {
        "id": "cyclone",
        "emoji": "🌀",
        "word": "Cyclone",
        "cn": "气旋"
      },
      {
        "id": "rainbow",
        "emoji": "🌈",
        "word": "Rainbow",
        "cn": "彩虹"
      },
      {
        "id": "closed-umbrella",
        "emoji": "🌂️",
        "word": "Closed Umbrella",
        "cn": "闭合的雨伞"
      },
      {
        "id": "umbrella",
        "emoji": "☂️",
        "word": "Umbrella",
        "cn": "雨伞"
      },
      {
        "id": "umbrella-with-rain-drops",
        "emoji": "☔️",
        "word": "Umbrella with Rain Drops",
        "cn": "带雨滴的雨伞"
      },
      {
        "id": "high-voltage",
        "emoji": "⚡️",
        "word": "High Voltage",
        "cn": "高压"
      },
      {
        "id": "snowflake",
        "emoji": "❄️",
        "word": "Snowflake",
        "cn": "雪花"
      },
      {
        "id": "snowman-without-snow",
        "emoji": "⛄️",
        "word": "Snowman without Snow",
        "cn": "无雪雪人"
      },
      {
        "id": "comet",
        "emoji": "☄️",
        "word": "Comet",
        "cn": "彗星"
      },
      {
        "id": "fire",
        "emoji": "🔥️",
        "word": "Fire",
        "cn": "火"
      },
      {
        "id": "droplet",
        "emoji": "💧️",
        "word": "Droplet",
        "cn": "水滴"
      },
      {
        "id": "water-wave",
        "emoji": "🌊️",
        "word": "Water Wave",
        "cn": "水波"
      }
    ]
  },
  {
    "id": "travel",
    "label": "旅行",
    "subtitle": "Travel",
    "items": [
      {
        "id": "snow-capped-mountain",
        "emoji": "🏔️",
        "word": "Snow-Capped Mountain",
        "cn": "雪山"
      },
      {
        "id": "mountain",
        "emoji": "⛰️",
        "word": "Mountain",
        "cn": "山"
      },
      {
        "id": "volcano",
        "emoji": "🌋",
        "word": "Volcano",
        "cn": "火山"
      },
      {
        "id": "mount-fuji",
        "emoji": "🗻",
        "word": "Mount Fuji",
        "cn": "富士山"
      },
      {
        "id": "camping",
        "emoji": "🏕️",
        "word": "Camping",
        "cn": "露营"
      },
      {
        "id": "beach-with-umbrella",
        "emoji": "🏖️",
        "word": "Beach with Umbrella",
        "cn": "带遮阳伞的海滩"
      },
      {
        "id": "desert",
        "emoji": "🏜️",
        "word": "Desert",
        "cn": "沙漠"
      },
      {
        "id": "desert-island",
        "emoji": "🏝️",
        "word": "Desert Island",
        "cn": "荒岛"
      },
      {
        "id": "national-park",
        "emoji": "🏞️",
        "word": "National Park",
        "cn": "国家公园"
      },
      {
        "id": "stadium",
        "emoji": "🏟️",
        "word": "Stadium",
        "cn": "体育场"
      },
      {
        "id": "night-with-stars",
        "emoji": "🌃",
        "word": "Night with Stars",
        "cn": "星空之夜"
      },
      {
        "id": "cityscape",
        "emoji": "🏙️",
        "word": "Cityscape",
        "cn": "城市景观"
      },
      {
        "id": "sunrise-over-mountains",
        "emoji": "🌄",
        "word": "Sunrise Over Mountains",
        "cn": "山间日出"
      },
      {
        "id": "sunrise",
        "emoji": "🌅",
        "word": "Sunrise",
        "cn": "日出"
      },
      {
        "id": "cityscape-at-dusk",
        "emoji": "🌆",
        "word": "Cityscape at Dusk",
        "cn": "黄昏时的城市景观"
      },
      {
        "id": "sunset",
        "emoji": "🌇",
        "word": "Sunset",
        "cn": "日落"
      },
      {
        "id": "bridge-at-night",
        "emoji": "🌉",
        "word": "Bridge at Night",
        "cn": "夜晚的桥"
      },
      {
        "id": "hot-springs",
        "emoji": "♨️",
        "word": "Hot Springs",
        "cn": "温泉"
      },
      {
        "id": "carousel-horse",
        "emoji": "🎠",
        "word": "Carousel Horse",
        "cn": "旋转木马的马"
      },
      {
        "id": "classical-building",
        "emoji": "🏛️",
        "word": "Classical Building",
        "cn": "古典建筑"
      },
      {
        "id": "building-construction",
        "emoji": "🏗️",
        "word": "Building Construction",
        "cn": "建筑施工"
      },
      {
        "id": "brick",
        "emoji": "🧱",
        "word": "Brick",
        "cn": "砖块"
      },
      {
        "id": "rock",
        "emoji": "🪨",
        "word": "Rock",
        "cn": "岩石"
      },
      {
        "id": "wood",
        "emoji": "🪵",
        "word": "Wood",
        "cn": "木头"
      },
      {
        "id": "hut",
        "emoji": "🛖",
        "word": "Hut",
        "cn": "小屋"
      },
      {
        "id": "houses",
        "emoji": "🏘️",
        "word": "Houses",
        "cn": "房屋"
      },
      {
        "id": "derelict-house",
        "emoji": "🏚️",
        "word": "Derelict House",
        "cn": "废弃房屋"
      },
      {
        "id": "house",
        "emoji": "🏠",
        "word": "House",
        "cn": "房子"
      },
      {
        "id": "house-with-garden",
        "emoji": "🏡",
        "word": "House with Garden",
        "cn": "带花园的房子"
      },
      {
        "id": "office-building",
        "emoji": "🏢",
        "word": "Office Building",
        "cn": "办公楼"
      },
      {
        "id": "japanese-post-office",
        "emoji": "🏣",
        "word": "Japanese Post Office",
        "cn": "日本邮局"
      },
      {
        "id": "post-office",
        "emoji": "🏤",
        "word": "Post Office",
        "cn": "邮局"
      },
      {
        "id": "hospital",
        "emoji": "🏥",
        "word": "Hospital",
        "cn": "医院"
      },
      {
        "id": "bank",
        "emoji": "🏦",
        "word": "Bank",
        "cn": "银行"
      },
      {
        "id": "hotel",
        "emoji": "🏨",
        "word": "Hotel",
        "cn": "酒店"
      },
      {
        "id": "love-hotel",
        "emoji": "🏩",
        "word": "Love Hotel",
        "cn": "情侣酒店"
      },
      {
        "id": "convenience-store",
        "emoji": "🏪",
        "word": "Convenience Store",
        "cn": "便利店"
      },
      {
        "id": "school",
        "emoji": "🏫",
        "word": "School",
        "cn": "学校"
      },
      {
        "id": "department-store",
        "emoji": "🏬",
        "word": "Department Store",
        "cn": "百货商店"
      },
      {
        "id": "factory",
        "emoji": "🏭",
        "word": "Factory",
        "cn": "工厂"
      },
      {
        "id": "japanese-castle",
        "emoji": "🏯",
        "word": "Japanese Castle",
        "cn": "日式城堡"
      },
      {
        "id": "castle",
        "emoji": "🏰",
        "word": "Castle",
        "cn": "城堡"
      },
      {
        "id": "wedding",
        "emoji": "💒",
        "word": "Wedding",
        "cn": "婚礼"
      },
      {
        "id": "tokyo-tower",
        "emoji": "🗼️",
        "word": "Tokyo Tower",
        "cn": "东京塔"
      },
      {
        "id": "statue-of-liberty",
        "emoji": "🗽️",
        "word": "Statue of Liberty",
        "cn": "自由女神像"
      },
      {
        "id": "church",
        "emoji": "⛪️",
        "word": "Church",
        "cn": "教堂"
      },
      {
        "id": "mosque",
        "emoji": "🕌",
        "word": "Mosque",
        "cn": "清真寺"
      },
      {
        "id": "hindu-temple",
        "emoji": "🛕",
        "word": "Hindu Temple",
        "cn": "印度教寺庙"
      },
      {
        "id": "synagogue",
        "emoji": "🕍",
        "word": "Synagogue",
        "cn": "犹太会堂"
      },
      {
        "id": "shinto-shrine",
        "emoji": "⛩️",
        "word": "Shinto Shrine",
        "cn": "神社"
      },
      {
        "id": "kaaba",
        "emoji": "🕋",
        "word": "Kaaba",
        "cn": "克尔白"
      },
      {
        "id": "fountain",
        "emoji": "⛲️",
        "word": "Fountain",
        "cn": "喷泉"
      },
      {
        "id": "tent",
        "emoji": "⛺️",
        "word": "Tent",
        "cn": "帐篷"
      },
      {
        "id": "playground-slide",
        "emoji": "🛝",
        "word": "Playground Slide",
        "cn": "滑梯"
      },
      {
        "id": "ferris-wheel",
        "emoji": "🎡",
        "word": "Ferris Wheel",
        "cn": "摩天轮"
      },
      {
        "id": "roller-coaster",
        "emoji": "🎢",
        "word": "Roller Coaster",
        "cn": "过山车"
      },
      {
        "id": "barber-pole",
        "emoji": "💈",
        "word": "Barber Pole",
        "cn": "理发店转灯"
      },
      {
        "id": "circus-tent",
        "emoji": "🎪",
        "word": "Circus Tent",
        "cn": "马戏团帐篷"
      },
      {
        "id": "locomotive",
        "emoji": "🚂",
        "word": "Locomotive",
        "cn": "机车"
      }
    ]
  },
  {
    "id": "travel-transport",
    "label": "交通",
    "subtitle": "Travel: Transport",
    "items": [
      {
        "id": "railway-car",
        "emoji": "🚃",
        "word": "Railway Car",
        "cn": "车厢"
      },
      {
        "id": "high-speed-train",
        "emoji": "🚄",
        "word": "High-Speed Train",
        "cn": "高速列车"
      },
      {
        "id": "bullet-train",
        "emoji": "🚅",
        "word": "Bullet Train",
        "cn": "高速列车"
      },
      {
        "id": "train",
        "emoji": "🚆",
        "word": "Train",
        "cn": "火车"
      },
      {
        "id": "metro",
        "emoji": "🚇",
        "word": "Metro",
        "cn": "地铁"
      },
      {
        "id": "light-rail",
        "emoji": "🚈",
        "word": "Light Rail",
        "cn": "轻轨"
      },
      {
        "id": "station",
        "emoji": "🚉",
        "word": "Station",
        "cn": "车站"
      },
      {
        "id": "tram",
        "emoji": "🚊",
        "word": "Tram",
        "cn": "电车"
      },
      {
        "id": "monorail",
        "emoji": "🚝",
        "word": "Monorail",
        "cn": "单轨铁路"
      },
      {
        "id": "mountain-railway",
        "emoji": "🚞",
        "word": "Mountain Railway",
        "cn": "山区铁路"
      },
      {
        "id": "tram-car",
        "emoji": "🚋",
        "word": "Tram Car",
        "cn": "电车"
      },
      {
        "id": "bus",
        "emoji": "🚌",
        "word": "Bus",
        "cn": "公交车"
      },
      {
        "id": "oncoming-bus",
        "emoji": "🚍",
        "word": "Oncoming Bus",
        "cn": "迎面而来的公交车"
      },
      {
        "id": "trolleybus",
        "emoji": "🚎",
        "word": "Trolleybus",
        "cn": "公共汽车"
      },
      {
        "id": "minibus",
        "emoji": "🚐",
        "word": "Minibus",
        "cn": "小型巴士"
      },
      {
        "id": "ambulance",
        "emoji": "🚑",
        "word": "Ambulance",
        "cn": "救护车"
      },
      {
        "id": "fire-engine",
        "emoji": "🚒",
        "word": "Fire Engine",
        "cn": "消防车"
      },
      {
        "id": "police-car",
        "emoji": "🚓",
        "word": "Police Car",
        "cn": "警车"
      },
      {
        "id": "oncoming-police-car",
        "emoji": "🚔",
        "word": "Oncoming Police Car",
        "cn": "迎面而来的警车"
      },
      {
        "id": "taxi",
        "emoji": "🚕",
        "word": "Taxi",
        "cn": "出租车"
      },
      {
        "id": "oncoming-taxi",
        "emoji": "🚖",
        "word": "Oncoming Taxi",
        "cn": "迎面而来的出租车"
      },
      {
        "id": "automobile",
        "emoji": "🚗",
        "word": "Automobile",
        "cn": "汽车"
      },
      {
        "id": "oncoming-automobile",
        "emoji": "🚘",
        "word": "Oncoming Automobile",
        "cn": "迎面驶来的汽车"
      },
      {
        "id": "sport-utility-vehicle",
        "emoji": "🚙",
        "word": "Sport Utility Vehicle",
        "cn": "运动型多用途汽车"
      },
      {
        "id": "pickup-truck",
        "emoji": "🛻",
        "word": "Pickup Truck",
        "cn": "皮卡"
      },
      {
        "id": "delivery-truck",
        "emoji": "🚚",
        "word": "Delivery Truck",
        "cn": "配送卡车"
      },
      {
        "id": "articulated-lorry",
        "emoji": "🚛",
        "word": "Articulated Lorry",
        "cn": "铰接式卡车"
      },
      {
        "id": "tractor",
        "emoji": "🚜",
        "word": "Tractor",
        "cn": "拖拉机"
      },
      {
        "id": "racing-car",
        "emoji": "🏎",
        "word": "Racing Car",
        "cn": "赛车"
      },
      {
        "id": "motorcycle",
        "emoji": "🏍",
        "word": "Motorcycle",
        "cn": "摩托车"
      },
      {
        "id": "motor-scooter",
        "emoji": "🛵",
        "word": "Motor Scooter",
        "cn": "电动摩托车"
      },
      {
        "id": "manual-wheelchair",
        "emoji": "🦽",
        "word": "Manual Wheelchair",
        "cn": "手动轮椅"
      },
      {
        "id": "motorized-wheelchair",
        "emoji": "🦼",
        "word": "Motorized Wheelchair",
        "cn": "电动轮椅"
      },
      {
        "id": "auto-rickshaw",
        "emoji": "🛺",
        "word": "Auto Rickshaw",
        "cn": "人力三轮车"
      },
      {
        "id": "bicycle",
        "emoji": "🚲",
        "word": "Bicycle",
        "cn": "自行车"
      },
      {
        "id": "kick-scooter",
        "emoji": "🛴",
        "word": "Kick Scooter",
        "cn": "踏板滑板车"
      },
      {
        "id": "skateboard",
        "emoji": "🛹",
        "word": "Skateboard",
        "cn": "滑板"
      },
      {
        "id": "roller-skate",
        "emoji": "🛼",
        "word": "Roller Skate",
        "cn": "轮滑鞋"
      },
      {
        "id": "bus-stop",
        "emoji": "🚏",
        "word": "Bus Stop",
        "cn": "公交站"
      },
      {
        "id": "sailboat",
        "emoji": "⛵️",
        "word": "Sailboat",
        "cn": "帆船"
      },
      {
        "id": "canoe",
        "emoji": "🛶",
        "word": "Canoe",
        "cn": "独木舟"
      },
      {
        "id": "speedboat",
        "emoji": "🚤",
        "word": "Speedboat",
        "cn": "快艇"
      },
      {
        "id": "passenger-ship",
        "emoji": "🛳",
        "word": "Passenger Ship",
        "cn": "客船"
      },
      {
        "id": "ferry",
        "emoji": "⛴️",
        "word": "Ferry",
        "cn": "渡轮"
      },
      {
        "id": "motor-boat",
        "emoji": "🛥",
        "word": "Motor Boat",
        "cn": "摩托艇"
      },
      {
        "id": "ship",
        "emoji": "🚢",
        "word": "Ship",
        "cn": "船"
      },
      {
        "id": "airplane",
        "emoji": "✈️",
        "word": "Airplane",
        "cn": "飞机"
      },
      {
        "id": "small-airplane",
        "emoji": "🛩",
        "word": "Small Airplane",
        "cn": "小型飞机"
      },
      {
        "id": "airplane-departure",
        "emoji": "🛫",
        "word": "Airplane Departure",
        "cn": "飞机起飞"
      },
      {
        "id": "airplane-arrival",
        "emoji": "🛬",
        "word": "Airplane Arrival",
        "cn": "飞机抵达"
      },
      {
        "id": "parachute",
        "emoji": "🪂",
        "word": "Parachute",
        "cn": "降落伞"
      },
      {
        "id": "seat",
        "emoji": "💺",
        "word": "Seat",
        "cn": "座位"
      },
      {
        "id": "helicopter",
        "emoji": "🚁",
        "word": "Helicopter",
        "cn": "直升机"
      },
      {
        "id": "suspension-railway",
        "emoji": "🚟",
        "word": "Suspension Railway",
        "cn": "悬挂式铁路"
      },
      {
        "id": "mountain-cableway",
        "emoji": "🚠",
        "word": "Mountain Cableway",
        "cn": "山地缆车"
      },
      {
        "id": "aerial-tramway",
        "emoji": "🚡",
        "word": "Aerial Tramway",
        "cn": "空中缆车"
      },
      {
        "id": "satellite",
        "emoji": "🛰",
        "word": "Satellite",
        "cn": "卫星"
      },
      {
        "id": "rocket",
        "emoji": "🚀",
        "word": "Rocket",
        "cn": "火箭"
      },
      {
        "id": "flying-saucer",
        "emoji": "🛸",
        "word": "Flying Saucer",
        "cn": "飞碟"
      }
    ]
  },
  {
    "id": "travel-signs",
    "label": "道路标识",
    "subtitle": "Travel: Road Signs",
    "items": [
      {
        "id": "motorway",
        "emoji": "🛣",
        "word": "Motorway",
        "cn": "高速公路"
      },
      {
        "id": "railway-track",
        "emoji": "🛤",
        "word": "Railway Track",
        "cn": "铁轨"
      },
      {
        "id": "oil-drum",
        "emoji": "🛢",
        "word": "Oil Drum",
        "cn": "油桶"
      },
      {
        "id": "fuel-pump",
        "emoji": "⛽",
        "word": "Fuel Pump",
        "cn": "燃油泵"
      },
      {
        "id": "wheel",
        "emoji": "🛞",
        "word": "Wheel",
        "cn": "轮子"
      },
      {
        "id": "police-car-light",
        "emoji": "🚨",
        "word": "Police Car Light",
        "cn": "警车灯"
      },
      {
        "id": "horizontal-traffic-light",
        "emoji": "🚥",
        "word": "Horizontal Traffic Light",
        "cn": "横向交通信号灯"
      },
      {
        "id": "vertical-traffic-light",
        "emoji": "🚦",
        "word": "Vertical Traffic Light",
        "cn": "垂直交通信号灯"
      },
      {
        "id": "stop-sign",
        "emoji": "🛑",
        "word": "Stop Sign",
        "cn": "停车标志"
      },
      {
        "id": "construction",
        "emoji": "🚧",
        "word": "Construction",
        "cn": "施工"
      },
      {
        "id": "anchor",
        "emoji": "⚓️",
        "word": "Anchor",
        "cn": "锚"
      },
      {
        "id": "ring-buoy",
        "emoji": "🛟",
        "word": "Ring Buoy",
        "cn": "救生圈浮标"
      }
    ]
  },
  {
    "id": "travel-time",
    "label": "时间",
    "subtitle": "Travel: Time",
    "items": [
      {
        "id": "hourglass-done",
        "emoji": "⌛️",
        "word": "Hourglass done",
        "cn": "沙漏完成"
      },
      {
        "id": "hourglass-not-done",
        "emoji": "⏳",
        "word": "Hourglass not done",
        "cn": "沙漏未完成"
      },
      {
        "id": "watch",
        "emoji": "⌚️",
        "word": "Watch",
        "cn": "手表"
      },
      {
        "id": "alarm-clock",
        "emoji": "⏰",
        "word": "Alarm Clock",
        "cn": "闹钟"
      },
      {
        "id": "stopwatch",
        "emoji": "⏱",
        "word": "Stopwatch",
        "cn": "秒表"
      },
      {
        "id": "timer-clock",
        "emoji": "⏲",
        "word": "Timer Clock",
        "cn": "计时器"
      },
      {
        "id": "mantelpiece-clock",
        "emoji": "🕰",
        "word": "Mantelpiece Clock",
        "cn": "壁炉钟"
      }
    ]
  },
  {
    "id": "sports-games",
    "label": "运动与游戏",
    "subtitle": "Sports & Games",
    "items": [
      {
        "id": "soccer-ball",
        "emoji": "⚽️",
        "word": "Soccer Ball",
        "cn": "足球"
      },
      {
        "id": "baseball",
        "emoji": "⚾️",
        "word": "Baseball",
        "cn": "棒球"
      },
      {
        "id": "softball",
        "emoji": "🥎",
        "word": "Softball",
        "cn": "垒球"
      },
      {
        "id": "basketball",
        "emoji": "🏀",
        "word": "Basketball",
        "cn": "篮球"
      },
      {
        "id": "volleyball",
        "emoji": "🏐",
        "word": "Volleyball",
        "cn": "排球"
      },
      {
        "id": "american-football",
        "emoji": "🏈",
        "word": "American Football",
        "cn": "美式橄榄球"
      },
      {
        "id": "rugby-football",
        "emoji": "🏉",
        "word": "Rugby Football",
        "cn": "橄榄球"
      },
      {
        "id": "tennis",
        "emoji": "🎾",
        "word": "Tennis",
        "cn": "网球"
      },
      {
        "id": "flying-disc",
        "emoji": "🥏",
        "word": "Flying Disc",
        "cn": "飞盘"
      },
      {
        "id": "bowling",
        "emoji": "🎳",
        "word": "Bowling",
        "cn": "保龄球"
      },
      {
        "id": "cricket-game",
        "emoji": "🏏",
        "word": "Cricket Game",
        "cn": "板球运动"
      },
      {
        "id": "field-hockey",
        "emoji": "🏑",
        "word": "Field Hockey",
        "cn": "曲棍球"
      },
      {
        "id": "ice-hockey",
        "emoji": "🏒",
        "word": "Ice Hockey",
        "cn": "冰球"
      },
      {
        "id": "lacrosse",
        "emoji": "🥍",
        "word": "Lacrosse",
        "cn": "长曲棍球"
      },
      {
        "id": "ping-pong",
        "emoji": "🏓",
        "word": "Ping Pong",
        "cn": "乒乓球"
      },
      {
        "id": "badminton",
        "emoji": "🏸",
        "word": "Badminton",
        "cn": "羽毛球"
      },
      {
        "id": "boxing-glove",
        "emoji": "🥊",
        "word": "Boxing Glove",
        "cn": "拳击手套"
      },
      {
        "id": "martial-arts-uniform",
        "emoji": "🥋",
        "word": "Martial Arts Uniform",
        "cn": "武术服"
      },
      {
        "id": "goal-net",
        "emoji": "🥅",
        "word": "Goal Net",
        "cn": "球门网"
      },
      {
        "id": "flag-in-hole",
        "emoji": "⛳️",
        "word": "Flag in Hole",
        "cn": "洞中的旗帜"
      },
      {
        "id": "ice-skate",
        "emoji": "⛸️",
        "word": "Ice Skate",
        "cn": "冰鞋"
      },
      {
        "id": "fishing-pole",
        "emoji": "🎣",
        "word": "Fishing Pole",
        "cn": "鱼竿"
      },
      {
        "id": "diving-mask",
        "emoji": "🤿",
        "word": "Diving Mask",
        "cn": "潜水面罩"
      },
      {
        "id": "running-shirt",
        "emoji": "🎽",
        "word": "Running Shirt",
        "cn": "跑步衫"
      },
      {
        "id": "skis",
        "emoji": "🎿",
        "word": "Skis",
        "cn": "滑雪板"
      },
      {
        "id": "sled",
        "emoji": "🛷",
        "word": "Sled",
        "cn": "雪橇"
      },
      {
        "id": "curling-stone",
        "emoji": "🥌",
        "word": "Curling Stone",
        "cn": "冰壶石"
      },
      {
        "id": "bullseye",
        "emoji": "🎯",
        "word": "Bullseye",
        "cn": "靶心"
      },
      {
        "id": "yo-yo",
        "emoji": "🪀",
        "word": "Yo-Yo",
        "cn": "悠悠球"
      },
      {
        "id": "kite",
        "emoji": "🪁",
        "word": "Kite",
        "cn": "风筝"
      },
      {
        "id": "water-pistol",
        "emoji": "🔫",
        "word": "Water Pistol",
        "cn": "水枪"
      },
      {
        "id": "pool-8-ball",
        "emoji": "🎱",
        "word": "Pool 8 Ball",
        "cn": "台球8号球"
      },
      {
        "id": "crystal-ball",
        "emoji": "🔮",
        "word": "Crystal Ball",
        "cn": "水晶球"
      },
      {
        "id": "magic-wand",
        "emoji": "🪄",
        "word": "Magic Wand",
        "cn": "魔法棒"
      },
      {
        "id": "video-game",
        "emoji": "🎮",
        "word": "Video Game",
        "cn": "电子游戏"
      },
      {
        "id": "joystick",
        "emoji": "🕹️",
        "word": "Joystick",
        "cn": "操纵杆"
      },
      {
        "id": "slot-machine",
        "emoji": "🎰",
        "word": "Slot Machine",
        "cn": "老虎机"
      },
      {
        "id": "game-die",
        "emoji": "🎲",
        "word": "Game Die",
        "cn": "骰子"
      },
      {
        "id": "puzzle-piece",
        "emoji": "🧩",
        "word": "Puzzle Piece",
        "cn": "拼图块"
      },
      {
        "id": "teddy-bear",
        "emoji": "🧸",
        "word": "Teddy Bear",
        "cn": "泰迪熊"
      },
      {
        "id": "pi-ata",
        "emoji": "🪅",
        "word": "Piñata",
        "cn": "皮纳塔"
      },
      {
        "id": "mirror-ball",
        "emoji": "🪩",
        "word": "Mirror Ball",
        "cn": "镜面球"
      },
      {
        "id": "nesting-dolls",
        "emoji": "🪆",
        "word": "Nesting Dolls",
        "cn": "套娃"
      },
      {
        "id": "spade-suit",
        "emoji": "♠️",
        "word": "Spade Suit",
        "cn": "黑桃花色"
      },
      {
        "id": "heart-suit",
        "emoji": "♥️",
        "word": "Heart Suit",
        "cn": "红桃花色"
      },
      {
        "id": "diamond-suit",
        "emoji": "♦️",
        "word": "Diamond Suit",
        "cn": "方块花色"
      },
      {
        "id": "club-suit",
        "emoji": "♣️",
        "word": "Club Suit",
        "cn": "梅花花色"
      },
      {
        "id": "chess-pawn",
        "emoji": "♟️",
        "word": "Chess Pawn",
        "cn": "兵卒"
      },
      {
        "id": "joker",
        "emoji": "🃏",
        "word": "Joker",
        "cn": "鬼牌"
      },
      {
        "id": "mahjong-red-dragon",
        "emoji": "🀄️",
        "word": "Mahjong Red Dragon",
        "cn": "麻将红龙"
      },
      {
        "id": "flower-playing-cards",
        "emoji": "🎴",
        "word": "Flower Playing Cards",
        "cn": "花牌"
      }
    ]
  },
  {
    "id": "holidays",
    "label": "节日",
    "subtitle": "Holidays",
    "items": [
      {
        "id": "jack-o-lantern",
        "emoji": "🎃",
        "word": "Jack-O-Lantern",
        "cn": "南瓜灯"
      },
      {
        "id": "christmas-tree",
        "emoji": "🎄",
        "word": "Christmas Tree",
        "cn": "圣诞树"
      },
      {
        "id": "fireworks",
        "emoji": "🎆",
        "word": "Fireworks",
        "cn": "烟花"
      },
      {
        "id": "sparkler",
        "emoji": "🎇",
        "word": "Sparkler",
        "cn": "烟花棒"
      },
      {
        "id": "firecracker",
        "emoji": "🧨",
        "word": "Firecracker",
        "cn": "鞭炮"
      },
      {
        "id": "sparkles",
        "emoji": "✨️",
        "word": "Sparkles",
        "cn": "火花"
      },
      {
        "id": "balloon",
        "emoji": "🎈",
        "word": "Balloon",
        "cn": "气球"
      },
      {
        "id": "party-popper",
        "emoji": "🎉",
        "word": "Party Popper",
        "cn": "派对礼花"
      },
      {
        "id": "confetti-ball",
        "emoji": "🎊",
        "word": "Confetti Ball",
        "cn": "彩球"
      },
      {
        "id": "tanabata-tree",
        "emoji": "🎋",
        "word": "Tanabata Tree",
        "cn": "七夕树"
      },
      {
        "id": "pine-decoration",
        "emoji": "🎍",
        "word": "Pine Decoration",
        "cn": "松枝装饰"
      },
      {
        "id": "japanese-dolls",
        "emoji": "🎎",
        "word": "Japanese Dolls",
        "cn": "日式人偶"
      },
      {
        "id": "carp-streamer",
        "emoji": "🎏",
        "word": "Carp Streamer",
        "cn": "鲤鱼旗"
      },
      {
        "id": "wind-chime",
        "emoji": "🎐",
        "word": "Wind Chime",
        "cn": "风铃"
      },
      {
        "id": "moon-viewing-ceremony",
        "emoji": "🎑",
        "word": "Moon Viewing Ceremony",
        "cn": "赏月仪式"
      },
      {
        "id": "red-envelope",
        "emoji": "🧧",
        "word": "Red Envelope",
        "cn": "红包"
      },
      {
        "id": "ribbon",
        "emoji": "🎀",
        "word": "Ribbon",
        "cn": "丝带"
      },
      {
        "id": "wrapped-gift",
        "emoji": "🎁",
        "word": "Wrapped Gift",
        "cn": "包装好的礼物"
      },
      {
        "id": "reminder-ribbon",
        "emoji": "🎗️",
        "word": "Reminder Ribbon",
        "cn": "提醒丝带"
      },
      {
        "id": "admission-tickets",
        "emoji": "🎟️",
        "word": "Admission Tickets",
        "cn": "入场券"
      },
      {
        "id": "ticket",
        "emoji": "🎫",
        "word": "Ticket",
        "cn": "票"
      },
      {
        "id": "military-medal",
        "emoji": "🎖️",
        "word": "Military Medal",
        "cn": "军事勋章"
      },
      {
        "id": "trophy",
        "emoji": "🏆️",
        "word": "Trophy",
        "cn": "奖杯"
      },
      {
        "id": "sports-medal",
        "emoji": "🏅️",
        "word": "Sports Medal",
        "cn": "运动奖牌"
      },
      {
        "id": "1st-place-medal",
        "emoji": "🥇",
        "word": "1st place Medal",
        "cn": "第一名奖牌"
      },
      {
        "id": "2nd-place-medal",
        "emoji": "🥈",
        "word": "2nd place Medal",
        "cn": "亚军奖牌"
      },
      {
        "id": "3rd-place-medal",
        "emoji": "🥉",
        "word": "3rd place Medal",
        "cn": "铜牌"
      }
    ]
  },
  {
    "id": "arts-culture",
    "label": "艺术与文化",
    "subtitle": "Arts & Culture",
    "items": [
      {
        "id": "performing-arts",
        "emoji": "🎭",
        "word": "Performing Arts",
        "cn": "表演艺术"
      },
      {
        "id": "framed-picture",
        "emoji": "🖼️",
        "word": "Framed Picture",
        "cn": "带框图片"
      },
      {
        "id": "artist-palette",
        "emoji": "🎨",
        "word": "Artist Palette",
        "cn": "艺术家调色板"
      },
      {
        "id": "movie-camera",
        "emoji": "🎥",
        "word": "Movie Camera",
        "cn": "摄像机"
      },
      {
        "id": "film-projector",
        "emoji": "📽️",
        "word": "Film Projector",
        "cn": "放映机"
      },
      {
        "id": "camera",
        "emoji": "📷",
        "word": "Camera",
        "cn": "相机"
      },
      {
        "id": "camera-with-flash",
        "emoji": "📸",
        "word": "Camera with Flash",
        "cn": "拍照相机"
      },
      {
        "id": "video-camera",
        "emoji": "📹",
        "word": "Video Camera",
        "cn": "摄像机"
      },
      {
        "id": "videocassette",
        "emoji": "📼",
        "word": "Videocassette",
        "cn": "录像带"
      },
      {
        "id": "film-frames",
        "emoji": "🎞️",
        "word": "Film Frames",
        "cn": "胶卷"
      },
      {
        "id": "clapper-board",
        "emoji": "🎬",
        "word": "Clapper Board",
        "cn": "场记板"
      },
      {
        "id": "thread",
        "emoji": "🧵",
        "word": "Thread",
        "cn": "线"
      },
      {
        "id": "sewing-needle",
        "emoji": "🪡",
        "word": "Sewing Needle",
        "cn": "缝纫针"
      },
      {
        "id": "yarn",
        "emoji": "🧶",
        "word": "Yarn",
        "cn": "纱线"
      },
      {
        "id": "knot",
        "emoji": "🪢",
        "word": "Knot",
        "cn": "绳结"
      }
    ]
  },
  {
    "id": "music",
    "label": "音乐",
    "subtitle": "Music",
    "items": [
      {
        "id": "microphone",
        "emoji": "🎤",
        "word": "Microphone",
        "cn": "麦克风"
      },
      {
        "id": "headphone",
        "emoji": "🎧",
        "word": "Headphone",
        "cn": "耳机"
      },
      {
        "id": "radio",
        "emoji": "📻",
        "word": "Radio",
        "cn": "收音机"
      },
      {
        "id": "saxophone",
        "emoji": "🎷",
        "word": "Saxophone",
        "cn": "萨克斯"
      },
      {
        "id": "trumpet",
        "emoji": "🎺",
        "word": "Trumpet",
        "cn": "小号"
      },
      {
        "id": "accordion",
        "emoji": "🪗",
        "word": "Accordion",
        "cn": "手风琴"
      },
      {
        "id": "guitar",
        "emoji": "🎸",
        "word": "Guitar",
        "cn": "吉他"
      },
      {
        "id": "musical-keyboard",
        "emoji": "🎹",
        "word": "Musical Keyboard",
        "cn": "琴键"
      },
      {
        "id": "violin",
        "emoji": "🎻",
        "word": "Violin",
        "cn": "小提琴"
      },
      {
        "id": "banjo",
        "emoji": "🪕",
        "word": "Banjo",
        "cn": "班卓琴"
      },
      {
        "id": "drum",
        "emoji": "🥁",
        "word": "Drum",
        "cn": "鼓"
      },
      {
        "id": "long-drum",
        "emoji": "🪘",
        "word": "Long Drum",
        "cn": "长鼓"
      },
      {
        "id": "maracas",
        "emoji": "🪇",
        "word": "Maracas",
        "cn": "沙锤"
      },
      {
        "id": "flute",
        "emoji": "🪈",
        "word": "Flute",
        "cn": "长笛"
      },
      {
        "id": "harp",
        "emoji": "🪉",
        "word": "Harp",
        "cn": "竖琴"
      }
    ]
  },
  {
    "id": "clothing-accessories",
    "label": "服饰与配件",
    "subtitle": "Clothing & Accessories",
    "items": [
      {
        "id": "glasses",
        "emoji": "👓",
        "word": "Glasses",
        "cn": "眼镜"
      },
      {
        "id": "sunglasses",
        "emoji": "🕶️",
        "word": "Sunglasses",
        "cn": "太阳镜"
      },
      {
        "id": "goggles",
        "emoji": "🥽",
        "word": "Goggles",
        "cn": "护目镜"
      },
      {
        "id": "lab-coat",
        "emoji": "🥼",
        "word": "Lab Coat",
        "cn": "实验服"
      },
      {
        "id": "safety-vest",
        "emoji": "🦺",
        "word": "Safety Vest",
        "cn": "安全背心"
      },
      {
        "id": "necktie",
        "emoji": "👔",
        "word": "Necktie",
        "cn": "领带"
      },
      {
        "id": "t-shirt",
        "emoji": "👕",
        "word": "T-Shirt",
        "cn": "T恤"
      },
      {
        "id": "jeans",
        "emoji": "👖",
        "word": "Jeans",
        "cn": "牛仔裤"
      },
      {
        "id": "scarf",
        "emoji": "🧣",
        "word": "Scarf",
        "cn": "围巾"
      },
      {
        "id": "gloves",
        "emoji": "🧤",
        "word": "Gloves",
        "cn": "手套"
      },
      {
        "id": "coat",
        "emoji": "🧥",
        "word": "Coat",
        "cn": "外套"
      },
      {
        "id": "socks",
        "emoji": "🧦",
        "word": "Socks",
        "cn": "袜子"
      },
      {
        "id": "dress",
        "emoji": "👗",
        "word": "Dress",
        "cn": "连衣裙"
      },
      {
        "id": "kimono",
        "emoji": "👘",
        "word": "Kimono",
        "cn": "和服"
      },
      {
        "id": "sari",
        "emoji": "🥻",
        "word": "Sari",
        "cn": "纱丽"
      },
      {
        "id": "one-piece-swimsuit",
        "emoji": "🩱",
        "word": "One-Piece Swimsuit",
        "cn": "连体泳衣"
      },
      {
        "id": "briefs",
        "emoji": "🩲",
        "word": "Briefs",
        "cn": "内裤"
      },
      {
        "id": "shorts",
        "emoji": "🩳",
        "word": "Shorts",
        "cn": "短裤"
      },
      {
        "id": "bikini",
        "emoji": "👙",
        "word": "Bikini",
        "cn": "比基尼"
      },
      {
        "id": "womans-clothes",
        "emoji": "👚",
        "word": "Woman’s Clothes",
        "cn": "女装"
      },
      {
        "id": "folding-hand-fan",
        "emoji": "🪭",
        "word": "Folding Hand Fan",
        "cn": "折扇"
      },
      {
        "id": "purse",
        "emoji": "👛",
        "word": "Purse",
        "cn": "钱包"
      },
      {
        "id": "handbag",
        "emoji": "👜",
        "word": "Handbag",
        "cn": "手提包"
      },
      {
        "id": "clutch-bag",
        "emoji": "👝",
        "word": "Clutch Bag",
        "cn": "手拿包"
      },
      {
        "id": "shopping-bags",
        "emoji": "🛍️",
        "word": "Shopping Bags",
        "cn": "购物袋"
      },
      {
        "id": "backpack",
        "emoji": "🎒",
        "word": "Backpack",
        "cn": "背包"
      },
      {
        "id": "thong-sandal",
        "emoji": "🩴",
        "word": "Thong Sandal",
        "cn": "人字拖"
      },
      {
        "id": "mans-shoe",
        "emoji": "👞",
        "word": "Man’s Shoe",
        "cn": "男士皮鞋"
      },
      {
        "id": "running-shoe",
        "emoji": "👟",
        "word": "Running Shoe",
        "cn": "跑鞋"
      },
      {
        "id": "hiking-boot",
        "emoji": "🥾",
        "word": "Hiking Boot",
        "cn": "徒步靴"
      },
      {
        "id": "flat-shoe",
        "emoji": "🥿",
        "word": "Flat Shoe",
        "cn": "平底鞋"
      },
      {
        "id": "high-heeled-shoe",
        "emoji": "👠",
        "word": "High-Heeled Shoe",
        "cn": "高跟鞋"
      },
      {
        "id": "womans-sandal",
        "emoji": "👡",
        "word": "Woman’s Sandal",
        "cn": "女式凉鞋"
      },
      {
        "id": "ballet-shoes",
        "emoji": "🩰",
        "word": "Ballet Shoes",
        "cn": "芭蕾舞鞋"
      },
      {
        "id": "womans-boot",
        "emoji": "👢",
        "word": "Woman’s Boot",
        "cn": "女式短靴"
      },
      {
        "id": "hair-pick",
        "emoji": "🪮",
        "word": "Hair Pick",
        "cn": "发簪"
      },
      {
        "id": "crown",
        "emoji": "👑",
        "word": "Crown",
        "cn": "皇冠"
      },
      {
        "id": "womans-hat",
        "emoji": "👒",
        "word": "Woman’s Hat",
        "cn": "女式帽子"
      },
      {
        "id": "top-hat",
        "emoji": "🎩",
        "word": "Top Hat",
        "cn": "高顶礼帽"
      },
      {
        "id": "graduation-cap",
        "emoji": "🎓",
        "word": "Graduation Cap",
        "cn": "学士帽"
      },
      {
        "id": "billed-cap",
        "emoji": "🧢",
        "word": "Billed Cap",
        "cn": "有檐帽"
      },
      {
        "id": "military-helmet",
        "emoji": "🪖",
        "word": "Military Helmet",
        "cn": "军用头盔"
      },
      {
        "id": "rescue-workers-helmet",
        "emoji": "⛑️",
        "word": "Rescue Worker’s Helmet",
        "cn": "救援人员头盔"
      },
      {
        "id": "prayer-beads",
        "emoji": "📿",
        "word": "Prayer Beads",
        "cn": "念珠"
      },
      {
        "id": "lipstick",
        "emoji": "💄",
        "word": "Lipstick",
        "cn": "口红"
      },
      {
        "id": "ring",
        "emoji": "💍",
        "word": "Ring",
        "cn": "戒指"
      },
      {
        "id": "gem-stone",
        "emoji": "💎",
        "word": "Gem Stone",
        "cn": "宝石"
      }
    ]
  },
  {
    "id": "tools",
    "label": "工具",
    "subtitle": "Tools",
    "items": [
      {
        "id": "carpentry-saw",
        "emoji": "🪚",
        "word": "Carpentry Saw",
        "cn": "木工锯"
      },
      {
        "id": "wrench",
        "emoji": "🔧",
        "word": "Wrench",
        "cn": "扳手"
      },
      {
        "id": "screwdriver",
        "emoji": "🪛",
        "word": "Screwdriver",
        "cn": "螺丝刀"
      },
      {
        "id": "nut-and-bolt",
        "emoji": "🔩",
        "word": "Nut and Bolt",
        "cn": "螺母和螺栓"
      },
      {
        "id": "gear",
        "emoji": "⚙️",
        "word": "Gear",
        "cn": "齿轮"
      },
      {
        "id": "clamp",
        "emoji": "🗜️",
        "word": "Clamp",
        "cn": "夹具"
      },
      {
        "id": "balance-scale",
        "emoji": "⚖️",
        "word": "Balance Scale",
        "cn": "天平"
      },
      {
        "id": "white-cane",
        "emoji": "🦯",
        "word": "White Cane",
        "cn": "白手杖"
      },
      {
        "id": "lock-with-ink-pen",
        "emoji": "🔏",
        "word": "Lock with Ink Pen",
        "cn": "钢笔锁"
      },
      {
        "id": "lock",
        "emoji": "🔒",
        "word": "Lock",
        "cn": "锁"
      },
      {
        "id": "unlock",
        "emoji": "🔓",
        "word": "Unlock",
        "cn": "开锁"
      },
      {
        "id": "lock-with-key",
        "emoji": "🔐",
        "word": "Lock with Key",
        "cn": "钥匙锁"
      },
      {
        "id": "key",
        "emoji": "🔑",
        "word": "Key",
        "cn": "钥匙"
      },
      {
        "id": "old-key",
        "emoji": "🗝️",
        "word": "Old Key",
        "cn": "复古钥匙"
      },
      {
        "id": "hammer",
        "emoji": "🔨",
        "word": "Hammer",
        "cn": "锤子"
      },
      {
        "id": "axe",
        "emoji": "🪓",
        "word": "Axe",
        "cn": "斧头"
      },
      {
        "id": "hammer-and-wrench",
        "emoji": "🛠️",
        "word": "Hammer and Wrench",
        "cn": "工具"
      },
      {
        "id": "sponges",
        "emoji": "🧽",
        "word": "Sponges",
        "cn": "海绵"
      },
      {
        "id": "bucket",
        "emoji": "🪣",
        "word": "Bucket",
        "cn": "桶"
      },
      {
        "id": "detergent",
        "emoji": "🧴",
        "word": "Detergent",
        "cn": "洗涤剂"
      },
      {
        "id": "razor",
        "emoji": "🪒",
        "word": "Razor",
        "cn": "剃刀"
      }
    ]
  },
  {
    "id": "objects",
    "label": "物品",
    "subtitle": "Objects",
    "items": [
      {
        "id": "mobile-phone",
        "emoji": "📱",
        "word": "Mobile Phone",
        "cn": "手机"
      },
      {
        "id": "mobile-phone-with-arrow",
        "emoji": "📲",
        "word": "Mobile Phone with Arrow",
        "cn": "来电手机"
      },
      {
        "id": "laptop-computer",
        "emoji": "💻",
        "word": "Laptop Computer",
        "cn": "笔记本电脑"
      },
      {
        "id": "desktop-computer",
        "emoji": "🖥️",
        "word": "Desktop Computer",
        "cn": "台式电脑"
      },
      {
        "id": "printer",
        "emoji": "🖨️",
        "word": "Printer",
        "cn": "打印机"
      },
      {
        "id": "computer-mouse",
        "emoji": "🖱️",
        "word": "Computer Mouse",
        "cn": "鼠标"
      },
      {
        "id": "trackball",
        "emoji": "🖲️",
        "word": "Trackball",
        "cn": "轨迹球"
      },
      {
        "id": "computer-disk",
        "emoji": "💽",
        "word": "Computer Disk",
        "cn": "磁盘"
      },
      {
        "id": "floppy-disk",
        "emoji": "💾",
        "word": "Floppy Disk",
        "cn": "软盘"
      },
      {
        "id": "dvd",
        "emoji": "📀",
        "word": "DVD",
        "cn": "光盘"
      },
      {
        "id": "battery",
        "emoji": "🔋",
        "word": "Battery",
        "cn": "电池"
      },
      {
        "id": "electric-plug",
        "emoji": "🔌",
        "word": "Electric Plug",
        "cn": "插头"
      },
      {
        "id": "light-bulb",
        "emoji": "💡",
        "word": "Light Bulb",
        "cn": "灯泡"
      },
      {
        "id": "flashlight",
        "emoji": "🔦",
        "word": "Flashlight",
        "cn": "手电筒"
      },
      {
        "id": "paper-lantern",
        "emoji": "🏮",
        "word": "Paper Lantern",
        "cn": "御手玉"
      },
      {
        "id": "notebook-with-decorative-cover",
        "emoji": "📔",
        "word": "Notebook with Decorative Cover",
        "cn": "笔记本"
      },
      {
        "id": "closed-book",
        "emoji": "📕",
        "word": "Closed Book",
        "cn": "合本书"
      },
      {
        "id": "open-book",
        "emoji": "📖",
        "word": "Open Book",
        "cn": "打开书"
      },
      {
        "id": "green-book",
        "emoji": "📗",
        "word": "Green Book",
        "cn": "绿皮书"
      },
      {
        "id": "blue-book",
        "emoji": "📘",
        "word": "Blue Book",
        "cn": "蓝皮书"
      },
      {
        "id": "orange-book",
        "emoji": "📙",
        "word": "Orange Book",
        "cn": "橙皮书"
      },
      {
        "id": "books",
        "emoji": "📚",
        "word": "Books",
        "cn": "书籍堆"
      },
      {
        "id": "notebook",
        "emoji": "📓",
        "word": "Notebook",
        "cn": "笔记本"
      },
      {
        "id": "bookmark-tabs",
        "emoji": "📑",
        "word": "Bookmark Tabs",
        "cn": "书签"
      },
      {
        "id": "bookmark",
        "emoji": "🔖",
        "word": "Bookmark",
        "cn": "书签"
      },
      {
        "id": "label",
        "emoji": "🏷️",
        "word": "Label",
        "cn": "标签"
      },
      {
        "id": "credit-card",
        "emoji": "💳",
        "word": "Credit Card",
        "cn": "银行卡"
      },
      {
        "id": "incoming-envelope",
        "emoji": "📨",
        "word": "Incoming Envelope",
        "cn": "来信"
      },
      {
        "id": "envelope-with-arrow",
        "emoji": "📩",
        "word": "Envelope with Arrow",
        "cn": "拆信"
      },
      {
        "id": "package",
        "emoji": "📦",
        "word": "Package",
        "cn": "包裹"
      },
      {
        "id": "closed-mailbox-with-raised-flag",
        "emoji": "📫",
        "word": "Closed Mailbox with Raised Flag",
        "cn": "闭合邮箱"
      },
      {
        "id": "closed-mailbox-with-lowered-flag",
        "emoji": "📪",
        "word": "Closed Mailbox with Lowered Flag",
        "cn": "lowered 邮箱"
      },
      {
        "id": "open-mailbox-with-raised-flag",
        "emoji": "📬",
        "word": "Open Mailbox with Raised Flag",
        "cn": "打开邮箱"
      },
      {
        "id": "open-mailbox-with-lowered-flag",
        "emoji": "📭",
        "word": "Open Mailbox with Lowered Flag",
        "cn": "打开无信邮箱"
      },
      {
        "id": "fountain-pen",
        "emoji": "🖋️",
        "word": "Fountain Pen",
        "cn": "钢笔"
      },
      {
        "id": "pen",
        "emoji": "🖊️",
        "word": "Pen",
        "cn": "圆珠笔"
      },
      {
        "id": "memo",
        "emoji": "📝",
        "word": "Memo",
        "cn": "备忘录"
      },
      {
        "id": "folder",
        "emoji": "📁",
        "word": "Folder",
        "cn": "文件夹"
      },
      {
        "id": "open-folder",
        "emoji": "📂",
        "word": "Open Folder",
        "cn": "打开文件夹"
      },
      {
        "id": "card-index",
        "emoji": "🗂️",
        "word": "Card Index Dividers",
        "cn": "卡片索引分隔板"
      },
      {
        "id": "calendar",
        "emoji": "📅",
        "word": "Calendar",
        "cn": "日历"
      },
      {
        "id": "tear-off-calendar",
        "emoji": "📆",
        "word": "Tear-Off Calendar",
        "cn": "翻页日历"
      },
      {
        "id": "spiral-calendar",
        "emoji": "🗓️",
        "word": "Spiral Calendar",
        "cn": "线圈日历"
      },
      {
        "id": "card-index-2",
        "emoji": "📇",
        "word": "Card Index",
        "cn": "名片夹"
      },
      {
        "id": "paperclip",
        "emoji": "📎",
        "word": "Paperclip",
        "cn": "回形针"
      },
      {
        "id": "linked-paperclips",
        "emoji": "🖇️",
        "word": "Linked Paperclips",
        "cn": "双回形针"
      },
      {
        "id": "pushpin",
        "emoji": "📌",
        "word": "Pushpin",
        "cn": "图钉"
      },
      {
        "id": "round-pushpin",
        "emoji": "📍",
        "word": "Round Pushpin",
        "cn": "定位针"
      },
      {
        "id": "straight-ruler",
        "emoji": "📏",
        "word": "Straight Ruler",
        "cn": "直尺"
      },
      {
        "id": "triangular-ruler",
        "emoji": "📐",
        "word": "Triangular Ruler",
        "cn": "三角尺"
      },
      {
        "id": "card-file-box",
        "emoji": "🗃️",
        "word": "Card File Box",
        "cn": "文件盒"
      },
      {
        "id": "file-cabinet",
        "emoji": "🗄️",
        "word": "File Cabinet",
        "cn": "档案柜"
      },
      {
        "id": "paper-towel",
        "emoji": "🧻",
        "word": "Paper Towel",
        "cn": "厨房纸；纸巾"
      },
      {
        "id": "safety-pin",
        "emoji": "🧷",
        "word": "Safety Pin",
        "cn": "别针"
      },
      {
        "id": "diya-lamp",
        "emoji": "🪔",
        "word": "Diya Lamp",
        "cn": "（印度）迪亚油灯"
      },
      {
        "id": "toothbrush",
        "emoji": "🪥",
        "word": "Toothbrush",
        "cn": "牙刷"
      },
      {
        "id": "bellhop-bell",
        "emoji": "🛎",
        "word": "Bellhop Bell",
        "cn": "门童铃铛"
      },
      {
        "id": "luggage",
        "emoji": "🧳",
        "word": "Luggage",
        "cn": "行李"
      },
      {
        "id": "bell",
        "emoji": "🔔",
        "word": "Bell",
        "cn": "铃铛"
      },
      {
        "id": "bell-with-slash",
        "emoji": "🔕",
        "word": "Bell with Slash",
        "cn": "静音铃"
      },
      {
        "id": "abacus",
        "emoji": "🧮",
        "word": "Abacus",
        "cn": "计算器"
      },
      {
        "id": "ledger",
        "emoji": "📒",
        "word": "Ledger",
        "cn": "账本"
      },
      {
        "id": "page-with-curl",
        "emoji": "📃",
        "word": "Page with Curl",
        "cn": "卷纸"
      },
      {
        "id": "scroll",
        "emoji": "📜",
        "word": "Scroll",
        "cn": "卷轴"
      },
      {
        "id": "page-facing-up",
        "emoji": "📄",
        "word": "Page Facing Up",
        "cn": "纸页"
      },
      {
        "id": "money-bag",
        "emoji": "💰",
        "word": "Money Bag",
        "cn": "钱袋"
      },
      {
        "id": "coin",
        "emoji": "🪙",
        "word": "Coin",
        "cn": "硬币"
      },
      {
        "id": "yen-banknote",
        "emoji": "💴",
        "word": "Yen Banknote",
        "cn": "日元"
      },
      {
        "id": "dollar-banknote",
        "emoji": "💵",
        "word": "Dollar Banknote",
        "cn": "美元"
      },
      {
        "id": "euro-banknote",
        "emoji": "💶",
        "word": "Euro Banknote",
        "cn": "欧元"
      },
      {
        "id": "pound-banknote",
        "emoji": "💷",
        "word": "Pound Banknote",
        "cn": "英镑"
      },
      {
        "id": "money-with-wings",
        "emoji": "💸",
        "word": "Money with Wings",
        "cn": "飞钱"
      },
      {
        "id": "e-mail",
        "emoji": "📧",
        "word": "E-Mail",
        "cn": "邮件"
      },
      {
        "id": "outbox-tray",
        "emoji": "📤",
        "word": "Outbox Tray",
        "cn": "发信"
      },
      {
        "id": "inbox-tray",
        "emoji": "📥",
        "word": "Inbox Tray",
        "cn": "收信"
      },
      {
        "id": "postbox",
        "emoji": "📮",
        "word": "Postbox",
        "cn": "邮筒"
      },
      {
        "id": "ballot-box",
        "emoji": "🗳️",
        "word": "Ballot Box",
        "cn": "投票箱"
      },
      {
        "id": "briefcase",
        "emoji": "💼",
        "word": "Briefcase",
        "cn": "公文包"
      },
      {
        "id": "spiral-notepad",
        "emoji": "🗒️",
        "word": "Spiral Notepad",
        "cn": "便签"
      },
      {
        "id": "link",
        "emoji": "🔗",
        "word": "Link",
        "cn": "链接"
      },
      {
        "id": "dagger",
        "emoji": "🗡️",
        "word": "Dagger",
        "cn": "剑"
      },
      {
        "id": "bomb",
        "emoji": "💣",
        "word": "Bomb",
        "cn": "炸弹"
      },
      {
        "id": "boomerang",
        "emoji": "🪃",
        "word": "Boomerang",
        "cn": "回旋镖"
      },
      {
        "id": "bow-and-arrow",
        "emoji": "🏹",
        "word": "Bow and Arrow",
        "cn": "弓箭"
      },
      {
        "id": "shield",
        "emoji": "🛡️",
        "word": "Shield",
        "cn": "盾牌"
      },
      {
        "id": "cigarette",
        "emoji": "🚬",
        "word": "Cigarette",
        "cn": "香烟"
      },
      {
        "id": "headstone",
        "emoji": "🪦",
        "word": "Headstone",
        "cn": "墓碑"
      },
      {
        "id": "nazar-amulet",
        "emoji": "🧿",
        "word": "Nazar Amulet",
        "cn": "邪眼"
      },
      {
        "id": "hamsa",
        "emoji": "🪬",
        "word": "Hamsa",
        "cn": "护符"
      },
      {
        "id": "juggling",
        "emoji": "🤹",
        "word": "Juggling",
        "cn": "杂耍"
      },
      {
        "id": "musical-score",
        "emoji": "🎼",
        "word": "Musical Score",
        "cn": "乐谱"
      },
      {
        "id": "postal-horn",
        "emoji": "📯",
        "word": "Postal Horn",
        "cn": "邮号"
      },
      {
        "id": "musical-notes",
        "emoji": "🎶",
        "word": "Musical Notes",
        "cn": "音符"
      },
      {
        "id": "musical-note",
        "emoji": "🎵",
        "word": "Musical Note",
        "cn": "单音符"
      },
      {
        "id": "receipt",
        "emoji": "🧾",
        "word": "Receipt",
        "cn": "收据"
      }
    ]
  },
  {
    "id": "symbols",
    "label": "符号",
    "subtitle": "Symbols",
    "items": [
      {
        "id": "red-heart",
        "emoji": "❤️",
        "word": "Red Heart",
        "cn": "红心"
      },
      {
        "id": "orange-heart",
        "emoji": "🧡",
        "word": "Orange Heart",
        "cn": "橙心"
      },
      {
        "id": "yellow-heart",
        "emoji": "💛",
        "word": "Yellow Heart",
        "cn": "黄心"
      },
      {
        "id": "green-heart",
        "emoji": "💚",
        "word": "Green Heart",
        "cn": "绿心"
      },
      {
        "id": "blue-heart",
        "emoji": "💙",
        "word": "Blue Heart",
        "cn": "蓝心"
      },
      {
        "id": "purple-heart",
        "emoji": "💜",
        "word": "Purple Heart",
        "cn": "紫心"
      },
      {
        "id": "black-heart",
        "emoji": "🖤",
        "word": "Black Heart",
        "cn": "黑心"
      },
      {
        "id": "white-heart",
        "emoji": "🤍",
        "word": "White Heart",
        "cn": "白心"
      },
      {
        "id": "brown-heart",
        "emoji": "🤎",
        "word": "Brown Heart",
        "cn": "棕心"
      },
      {
        "id": "broken-heart",
        "emoji": "💔",
        "word": "Broken Heart",
        "cn": "心碎"
      },
      {
        "id": "heart-exclamation",
        "emoji": "❣️",
        "word": "Heart Exclamation",
        "cn": "感叹心"
      },
      {
        "id": "two-hearts",
        "emoji": "💕",
        "word": "Two Hearts",
        "cn": "双心"
      },
      {
        "id": "revolving-hearts",
        "emoji": "💞",
        "word": "Revolving Hearts",
        "cn": "旋转心"
      },
      {
        "id": "beating-heart",
        "emoji": "💓",
        "word": "Beating Heart",
        "cn": "心跳"
      },
      {
        "id": "growing-heart",
        "emoji": "💗",
        "word": "Growing Heart",
        "cn": "生长心"
      },
      {
        "id": "sparkling-heart",
        "emoji": "💖",
        "word": "Sparkling Heart",
        "cn": "闪光心"
      },
      {
        "id": "heart-with-arrow",
        "emoji": "💘",
        "word": "Heart with Arrow",
        "cn": "箭穿心"
      },
      {
        "id": "heart-with-ribbon",
        "emoji": "💝",
        "word": "Heart with Ribbon",
        "cn": "礼盒心"
      },
      {
        "id": "love-letter",
        "emoji": "💌",
        "word": "Love Letter",
        "cn": "爱心信"
      },
      {
        "id": "hole",
        "emoji": "🕳️",
        "word": "Hole",
        "cn": "黑洞"
      },
      {
        "id": "anger-symbol",
        "emoji": "💢",
        "word": "Anger Symbol",
        "cn": "怒符号"
      },
      {
        "id": "speech-balloon",
        "emoji": "💬",
        "word": "Speech Balloon",
        "cn": "对话气泡"
      },
      {
        "id": "thought-balloon",
        "emoji": "💭",
        "word": "Thought Balloon",
        "cn": "思考气泡"
      },
      {
        "id": "zzz",
        "emoji": "💤",
        "word": "ZZZ",
        "cn": "睡觉"
      },
      {
        "id": "children-crossing",
        "emoji": "🚸",
        "word": "Children Crossing",
        "cn": "儿童"
      },
      {
        "id": "no-one-under-eighteen",
        "emoji": "🔞",
        "word": "No One Under Eighteen",
        "cn": "18禁"
      },
      {
        "id": "mobile-phone-with-prohibited-sign",
        "emoji": "📵",
        "word": "Mobile Phone with Prohibited Sign",
        "cn": "禁手机"
      },
      {
        "id": "clockwise-arrows",
        "emoji": "🔃",
        "word": "Clockwise Arrows",
        "cn": "循环箭头"
      },
      {
        "id": "anticlockwise-arrows",
        "emoji": "🔄",
        "word": "Anticlockwise Arrows",
        "cn": "反向循环"
      },
      {
        "id": "back-arrow",
        "emoji": "🔙",
        "word": "Back Arrow",
        "cn": "返回"
      },
      {
        "id": "end-arrow",
        "emoji": "🔚",
        "word": "End Arrow",
        "cn": "结束"
      },
      {
        "id": "on-arrow",
        "emoji": "🔛",
        "word": "On! Arrow",
        "cn": "开关"
      },
      {
        "id": "soon-arrow",
        "emoji": "🔜",
        "word": "Soon Arrow",
        "cn": "马上"
      },
      {
        "id": "top-arrow",
        "emoji": "🔝",
        "word": "Top Arrow",
        "cn": "置顶"
      },
      {
        "id": "place-of-worship",
        "emoji": "🛐",
        "word": "Place of Worship",
        "cn": "祈祷"
      },
      {
        "id": "om-symbol",
        "emoji": "🕉️",
        "word": "Om Symbol",
        "cn": "欧姆"
      },
      {
        "id": "menorah",
        "emoji": "🕎",
        "word": "Menorah",
        "cn": "灯台"
      },
      {
        "id": "dotted-six-pointed-star",
        "emoji": "🔯",
        "word": "Dotted Six-Pointed Star",
        "cn": "六芒星"
      },
      {
        "id": "khanda",
        "emoji": "🪯",
        "word": "Khanda",
        "cn": "卡帕拉"
      },
      {
        "id": "shuffle-tracks-button",
        "emoji": "🔀",
        "word": "Shuffle Tracks Button",
        "cn": "随机"
      },
      {
        "id": "repeat-button",
        "emoji": "🔁",
        "word": "Repeat Button",
        "cn": "循环"
      },
      {
        "id": "repeat-single-button",
        "emoji": "🔂",
        "word": "Repeat Single Button",
        "cn": "单次循环"
      },
      {
        "id": "play-button",
        "emoji": "▶️",
        "word": "Play Button",
        "cn": "播放"
      },
      {
        "id": "fast-forward-button",
        "emoji": "⏩",
        "word": "Fast-Forward Button",
        "cn": "快进"
      },
      {
        "id": "next-track-button",
        "emoji": "⏭️",
        "word": "Next Track Button",
        "cn": "下一曲"
      },
      {
        "id": "play-or-pause-button",
        "emoji": "⏯️",
        "word": "Play or Pause Button",
        "cn": "播放暂停"
      },
      {
        "id": "reverse-button",
        "emoji": "◀️",
        "word": "Reverse Button",
        "cn": "倒放"
      },
      {
        "id": "fast-reverse-button",
        "emoji": "⏪",
        "word": "Fast Reverse Button",
        "cn": "快退"
      },
      {
        "id": "previous-track-button",
        "emoji": "⏮️",
        "word": "Previous Track Button",
        "cn": "上一曲"
      },
      {
        "id": "upwards-button",
        "emoji": "🔼",
        "word": "Upwards Button",
        "cn": "上箭头"
      },
      {
        "id": "fast-up-button",
        "emoji": "⏫",
        "word": "Fast Up Button",
        "cn": "快上"
      },
      {
        "id": "downwards-button",
        "emoji": "🔽",
        "word": "Downwards Button",
        "cn": "下箭头"
      },
      {
        "id": "fast-down-button",
        "emoji": "⏬",
        "word": "Fast Down Button",
        "cn": "快下"
      },
      {
        "id": "pause-button",
        "emoji": "⏸️",
        "word": "Pause Button",
        "cn": "暂停"
      },
      {
        "id": "stop-button",
        "emoji": "⏹️",
        "word": "Stop Button",
        "cn": "停止"
      },
      {
        "id": "record-button",
        "emoji": "⏺️",
        "word": "Record Button",
        "cn": "录制"
      },
      {
        "id": "eject-button",
        "emoji": "⏏️",
        "word": "Eject Button",
        "cn": "弹出"
      },
      {
        "id": "cinema-light",
        "emoji": "🎦",
        "word": "Cinema Light",
        "cn": "影院标志"
      },
      {
        "id": "dim-button",
        "emoji": "🔅",
        "word": "Dim Button",
        "cn": "低亮"
      },
      {
        "id": "bright-button",
        "emoji": "🔆",
        "word": "Bright Button",
        "cn": "高亮"
      },
      {
        "id": "antenna-bars",
        "emoji": "📶",
        "word": "Antenna Bars",
        "cn": "信号"
      },
      {
        "id": "wireless",
        "emoji": "🛜",
        "word": "Wireless",
        "cn": "无线"
      },
      {
        "id": "vibration-mode",
        "emoji": "📳",
        "word": "Vibration Mode",
        "cn": "震动"
      },
      {
        "id": "mobile-phone-off",
        "emoji": "📴",
        "word": "Mobile Phone Off",
        "cn": "关机"
      },
      {
        "id": "heavy-equals-sign",
        "emoji": "🟰",
        "word": "Heavy Equals Sign",
        "cn": "等号"
      },
      {
        "id": "atom-symbol",
        "emoji": "⚛️",
        "word": "Atom Symbol",
        "cn": "原子"
      },
      {
        "id": "wheel-of-dharma",
        "emoji": "☸️",
        "word": "Wheel of Dharma",
        "cn": "法轮"
      },
      {
        "id": "yin-yang",
        "emoji": "☯️",
        "word": "Yin Yang",
        "cn": "太极"
      },
      {
        "id": "star-of-david",
        "emoji": "✡️",
        "word": "Star of David",
        "cn": "大卫之星"
      },
      {
        "id": "radioactive",
        "emoji": "☢️",
        "word": "Radioactive",
        "cn": "辐射"
      },
      {
        "id": "biohazard",
        "emoji": "☣️",
        "word": "Biohazard",
        "cn": "生物危害"
      },
      {
        "id": "female-sign",
        "emoji": "♀️",
        "word": "Female Sign",
        "cn": "女性符号"
      },
      {
        "id": "male-sign",
        "emoji": "♂️",
        "word": "Male Sign",
        "cn": "男性符号"
      },
      {
        "id": "transgender-symbol",
        "emoji": "⚧️",
        "word": "Transgender Symbol",
        "cn": "跨性别"
      },
      {
        "id": "latin-cross",
        "emoji": "✝️",
        "word": "Latin Cross",
        "cn": "十字"
      },
      {
        "id": "orthodox-cross",
        "emoji": "☦️",
        "word": "Orthodox Cross",
        "cn": "东正十字"
      },
      {
        "id": "star-and-crescent",
        "emoji": "☪️",
        "word": "Star and Crescent",
        "cn": "星月"
      },
      {
        "id": "peace-symbol",
        "emoji": "☮️",
        "word": "Peace Symbol",
        "cn": "和平"
      },
      {
        "id": "medical-symbol",
        "emoji": "⚕️",
        "word": "Medical Symbol",
        "cn": "医疗"
      },
      {
        "id": "recycling-symbol",
        "emoji": "♻️",
        "word": "Recycling Symbol",
        "cn": "回收"
      },
      {
        "id": "fleur-de-lis",
        "emoji": "⚜️",
        "word": "Fleur-de-lis",
        "cn": "鸢尾花"
      },
      {
        "id": "trident-emblem",
        "emoji": "🔱",
        "word": "Trident Emblem",
        "cn": "三叉戟"
      },
      {
        "id": "name-badge",
        "emoji": "📛",
        "word": "Name Badge",
        "cn": "名牌"
      },
      {
        "id": "japanese-symbol",
        "emoji": "🔰",
        "word": "Japanese Symbol",
        "cn": "徽章"
      }
    ]
  }
] as const;
