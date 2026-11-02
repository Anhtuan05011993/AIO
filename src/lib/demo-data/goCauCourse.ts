/**
 * Dữ liệu demo "Gõ câu" — 1 khóa gõ câu B1 thật của aioenglish.com.
 *
 * Nguồn: GET /api/go-cau/course/crs_b60adbaa933635b8d0 (đã extract vào
 * docs/research/aioenglish/data/api-course-crs_b60adbaa933635b8d0.json).
 * Khóa: "Đã làm việc bao lâu rồi" (unit-1-part-1, pack lo-trinh-b1 "Tiếng Anh trung cấp (B1)")
 * — 30 câu tiếng Anh kèm dịch tiếng Việt, IPA UK/US và learningUnits (phân tách từ/cụm
 * kèm giải thích ngữ pháp tiếng Việt).
 *
 * LƯU Ý CẮT GIẢM (trim): learningUnits của mỗi statement chỉ giữ 4 đơn vị đầu
 * (nguồn gốc có 6–14 đơn vị/câu — unitTypes "word" | "phrase" vẫn đủ cả hai).
 * Các trường luôn null trong dataset này (pinyin, zhWords, audioUrl, guessable,
 * pronunciationPlain — dành cho tiếng Trung/tiếp phát audio) được giữ nguyên
 * với giá trị null để đúng shape API.
 */
export type GoCauTier = "word" | "chunk" | "combinedChunk" | "sentence";

export interface GoCauCourseMeta {
  id: string;
  slug: string;
  /** Tiêu đề khóa (tiếng Việt) — "Đã làm việc bao lâu rồi" */
  title: string;
  packSlug: string;
  packTitle: string;
  targetLanguage: string;
  nextCourseId: string;
  statementCount: number;
  /** Các chế độ chơi: word → chunk → combinedChunk → sentence */
  availableTiers: GoCauTier[];
  ownerUserId: string | null;
  /** Số "từ vựng" thu được khi hoàn thành khóa */
  vocabCount: number;
}

export interface GoCauLearningUnit {
  /** id đơn vị trong câu: w0, w1, ... (word) / c0, ... (chunk) */
  id: string;
  unitText: string;
  unitType: "word" | "phrase";
  /** Nhãn ngữ pháp: subject, auxiliary, verb, preposition, ... */
  grammarTags: string[];
  partOfSpeech: string;
  /**
   * Giải thích ngữ pháp tiếng Việt hiển thị khi gõ đúng đơn vị.
   * Optional: API chỉ giải thích từ nội dung — từ chức năng (in, this, for, ...)
   * không có trường này (158/307 unit của khóa demo).
   */
  explanationVi?: string;
}

export interface GoCauStatement {
  id: string;
  /** Câu tiếng Anh không dấu chấm — dùng làm target khi chơi */
  text: string;
  pinyin: string | null;
  /** Bản dịch tiếng Việt hiển thị cho người học */
  translation: string;
  /** Các đáp án được chấp nhận (I have... / I've...) */
  acceptedAnswers: string[];
  audioUrl: string | null;
  /** IPA theo Anh-Anh (UK), mỗi từ một khối /.../ */
  ipa: string;
  targetLanguage: string;
  targetText: string;
  /** Câu hiển thị có dấu chấm cuối */
  displayText: string;
  pronunciationGuide: string;
  pronunciationGuideUs: string;
  pronunciationPlain: string | null;
  learningUnits: GoCauLearningUnit[];
  /** Tier mặc định khi vào khóa: "sentence" */
  tier: GoCauTier;
  guessable: string | null;
  zhWords: string[] | null;
}

export interface GoCauCourse {
  course: GoCauCourseMeta;
  statements: GoCauStatement[];
  /** id các statement đã thuộc (state user) */
  mastered: string[];
  /** Index statement đang học dở */
  lastIndex: number;
  completed: boolean;
  completedModes: string[];
  doneSteps: string[];
}

export const goCauCourse: GoCauCourse = {
  course: {
  "id": "crs_b60adbaa933635b8d0",
  "slug": "unit-1-part-1",
  "title": "Đã làm việc bao lâu rồi",
  "packSlug": "lo-trinh-b1",
  "packTitle": "Tiếng Anh trung cấp (B1)",
  "targetLanguage": "en",
  "nextCourseId": "crs_d5d9f4cb9dcf760b9e",
  "statementCount": 30,
  "availableTiers": [
    "word",
    "chunk",
    "combinedChunk",
    "sentence"
  ],
  "ownerUserId": null,
  "vocabCount": 60
},
  statements: [
  {
    "id": "stmt_ef49acea25f873aa6a",
    "text": "I have lived in this city for five years",
    "pinyin": null,
    "translation": "Tôi đã sống ở thành phố này được năm năm rồi.",
    "acceptedAnswers": [
      "I have lived in this city for five years",
      "I've lived in this city for five years"
    ],
    "audioUrl": null,
    "ipa": "/aɪ/ /hæv/ /lɪvd/ /ɪn/ /ðɪs/ /ˈsɪti/ /fɔː(r)/ /faɪv/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "I have lived in this city for five years",
    "displayText": "I have lived in this city for five years.",
    "pronunciationGuide": "/aɪ/ /hæv/ /lɪvd/ /ɪn/ /ðɪs/ /ˈsɪti/ /fɔː(r)/ /faɪv/ /jɪəz/",
    "pronunciationGuideUs": "/aɪ/ /hæv/ /lɪvd/ /ɪn/ /ðɪs/ /ˈsɪti/ /fɔːr/ /faɪv/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "I",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số ít."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "lived",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'live'."
      },
      {
        "id": "w3",
        "unitText": "in",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_62b0def7f6995eaedc",
    "text": "I have worked at a cafe for four months",
    "pinyin": null,
    "translation": "Tôi đã làm việc ở một quán cà phê được bốn tháng rồi.",
    "acceptedAnswers": [
      "I have worked at a cafe for four months",
      "I've worked at a cafe for four months"
    ],
    "audioUrl": null,
    "ipa": "/aɪ/ /hæv/ /wɜːkt/ /æt/ /ə/ /ˈkæfeɪ/ /fɔː(r)/ /fɔː(r)/ /mʌnθs/",
    "targetLanguage": "en",
    "targetText": "I have worked at a cafe for four months",
    "displayText": "I have worked at a cafe for four months.",
    "pronunciationGuide": "/aɪ/ /hæv/ /wɜːkt/ /æt/ /ə/ /ˈkæfeɪ/ /fɔː(r)/ /fɔː(r)/ /mʌnθs/",
    "pronunciationGuideUs": "/aɪ/ /hæv/ /wɜːrkt/ /æt/ /ə/ /kæˈfeɪ/ /fɔːr/ /fɔːr/ /mʌnθs/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "I",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số ít."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'work'."
      },
      {
        "id": "w3",
        "unitText": "at",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_dfd3486c5ea8808439",
    "text": "We have studied together for three years",
    "pinyin": null,
    "translation": "Chúng tôi đã học cùng nhau được ba năm rồi.",
    "acceptedAnswers": [
      "We have studied together for three years",
      "We've studied together for three years"
    ],
    "audioUrl": null,
    "ipa": "/wiː/ /hæv/ /ˈstʌdid/ /təˈɡeðə(r)/ /fɔː(r)/ /θriː/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "We have studied together for three years",
    "displayText": "We have studied together for three years.",
    "pronunciationGuide": "/wiː/ /hæv/ /ˈstʌdid/ /təˈɡeðə(r)/ /fɔː(r)/ /θriː/ /jɪəz/",
    "pronunciationGuideUs": "/wiː/ /hæv/ /ˈstʌdid/ /təˈɡeðər/ /fɔːr/ /θriː/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "We",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "studied",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'study'."
      },
      {
        "id": "w3",
        "unitText": "together",
        "unitType": "word",
        "grammarTags": [
          "adverbial"
        ],
        "partOfSpeech": "adverb",
        "explanationVi": "Trạng ngữ (adverbial) - trạng từ (adverb) chỉ cách thức."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_6248d2f8aff0d27b2f",
    "text": "You have worked from home for six months",
    "pinyin": null,
    "translation": "Bạn đã làm việc ở nhà được sáu tháng rồi.",
    "acceptedAnswers": [
      "You have worked from home for six months",
      "You've worked from home for six months"
    ],
    "audioUrl": null,
    "ipa": "/juː/ /hæv/ /wɜːkt/ /frɒm/ /həʊm/ /fɔː(r)/ /sɪks/ /mʌnθs/",
    "targetLanguage": "en",
    "targetText": "You have worked from home for six months",
    "displayText": "You have worked from home for six months.",
    "pronunciationGuide": "/juː/ /hæv/ /wɜːkt/ /frɒm/ /həʊm/ /fɔː(r)/ /sɪks/ /mʌnθs/",
    "pronunciationGuideUs": "/juː/ /hæv/ /wɜːrkt/ /frʌm/ /hoʊm/ /fɔːr/ /sɪks/ /mʌnθs/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "You",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ hai."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'work'."
      },
      {
        "id": "w3",
        "unitText": "from",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_09640fadf2c1337970",
    "text": "They have lived in a small flat for one year",
    "pinyin": null,
    "translation": "Họ đã sống trong một căn hộ nhỏ được một năm rồi.",
    "acceptedAnswers": [
      "They have lived in a small flat for one year",
      "They've lived in a small flat for one year"
    ],
    "audioUrl": null,
    "ipa": "/ðeɪ/ /hæv/ /lɪvd/ /ɪn/ /ə/ /smɔːl/ /flæt/ /fɔː(r)/ /wʌn/ /jɪə(r)/",
    "targetLanguage": "en",
    "targetText": "They have lived in a small flat for one year",
    "displayText": "They have lived in a small flat for one year.",
    "pronunciationGuide": "/ðeɪ/ /hæv/ /lɪvd/ /ɪn/ /ə/ /smɔːl/ /flæt/ /fɔː(r)/ /wʌn/ /jɪə(r)/",
    "pronunciationGuideUs": "/ðeɪ/ /hæv/ /lɪvd/ /ɪn/ /ə/ /smɔːl/ /flæt/ /fɔːr/ /wʌn/ /jɪr/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "They",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "lived",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'live'."
      },
      {
        "id": "w3",
        "unitText": "in",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_88844f89b3b9020fbe",
    "text": "My brother has had a new bike for two weeks",
    "pinyin": null,
    "translation": "Anh trai tôi đã có một chiếc xe đạp mới được hai tuần rồi.",
    "acceptedAnswers": [
      "My brother has had a new bike for two weeks"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /ˈbrʌðə(r)/ /hæz/ /hæd/ /ə/ /njuː/ /baɪk/ /fɔː(r)/ /tuː/ /wiːks/",
    "targetLanguage": "en",
    "targetText": "My brother has had a new bike for two weeks",
    "displayText": "My brother has had a new bike for two weeks.",
    "pronunciationGuide": "/maɪ/ /ˈbrʌðə(r)/ /hæz/ /hæd/ /ə/ /njuː/ /baɪk/ /fɔː(r)/ /tuː/ /wiːks/",
    "pronunciationGuideUs": "/maɪ/ /ˈbrʌðər/ /hæz/ /hæd/ /ə/ /nuː/ /baɪk/ /fɔːr/ /tuː/ /wiːks/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "brother",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w3",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_2c4396ad32aeaa9110",
    "text": "She has known my neighbour for ten years",
    "pinyin": null,
    "translation": "Cô ấy đã biết hàng xóm của tôi được mười năm rồi.",
    "acceptedAnswers": [
      "She has known my neighbour for ten years",
      "She's known my neighbour for ten years"
    ],
    "audioUrl": null,
    "ipa": "/ʃiː/ /hæz/ /nəʊn/ /maɪ/ /ˈneɪbə(r)/ /fɔː(r)/ /ten/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "She has known my neighbour for ten years",
    "displayText": "She has known my neighbour for ten years.",
    "pronunciationGuide": "/ʃiː/ /hæz/ /nəʊn/ /maɪ/ /ˈneɪbə(r)/ /fɔː(r)/ /ten/ /jɪəz/",
    "pronunciationGuideUs": "/ʃiː/ /hæz/ /noʊn/ /maɪ/ /ˈneɪbər/ /fɔːr/ /ten/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "She",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống cái."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "known",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'know'."
      },
      {
        "id": "w3",
        "unitText": "my",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_d501835ec93efdab5a",
    "text": "We have had a dog for three years",
    "pinyin": null,
    "translation": "Chúng tôi đã có một con chó được ba năm rồi.",
    "acceptedAnswers": [
      "We have had a dog for three years",
      "We've had a dog for three years"
    ],
    "audioUrl": null,
    "ipa": "/wiː/ /hæv/ /hæd/ /ə/ /dɒɡ/ /fɔː(r)/ /θriː/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "We have had a dog for three years",
    "displayText": "We have had a dog for three years.",
    "pronunciationGuide": "/wiː/ /hæv/ /hæd/ /ə/ /dɒɡ/ /fɔː(r)/ /θriː/ /jɪəz/",
    "pronunciationGuideUs": "/wiː/ /hæv/ /hæd/ /ə/ /dɔːɡ/ /fɔːr/ /θriː/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "We",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      },
      {
        "id": "w3",
        "unitText": "a",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "article"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_44e4e29e65c404736a",
    "text": "He has played tennis for two years",
    "pinyin": null,
    "translation": "Anh ấy đã chơi quần vợt được hai năm rồi.",
    "acceptedAnswers": [
      "He has played tennis for two years",
      "He's played tennis for two years"
    ],
    "audioUrl": null,
    "ipa": "/hiː/ /hæz/ /pleɪd/ /ˈtenɪs/ /fɔː(r)/ /tuː/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "He has played tennis for two years",
    "displayText": "He has played tennis for two years.",
    "pronunciationGuide": "/hiː/ /hæz/ /pleɪd/ /ˈtenɪs/ /fɔː(r)/ /tuː/ /jɪəz/",
    "pronunciationGuideUs": "/hiː/ /hæz/ /pleɪd/ /ˈtenɪs/ /fɔːr/ /tuː/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "He",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống đực."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "played",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'play'."
      },
      {
        "id": "w3",
        "unitText": "tennis",
        "unitType": "word",
        "grammarTags": [
          "object"
        ],
        "partOfSpeech": "noun",
        "explanationVi": "Tân ngữ (object) - danh từ không đếm được (uncountable noun) chỉ môn thể thao."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_692ae47d2836c22cd5",
    "text": "We have used this app for six months",
    "pinyin": null,
    "translation": "Chúng tôi đã dùng ứng dụng này được sáu tháng rồi.",
    "acceptedAnswers": [
      "We have used this app for six months"
    ],
    "audioUrl": null,
    "ipa": "/wiː/ /hæv/ /juːzd/ /ðɪs/ /æp/ /fɔː(r)/ /sɪks/ /mʌnθs/",
    "targetLanguage": "en",
    "targetText": "We have used this app for six months",
    "displayText": "We have used this app for six months.",
    "pronunciationGuide": "/wiː/ /hæv/ /juːzd/ /ðɪs/ /æp/ /fɔː(r)/ /sɪks/ /mʌnθs/",
    "pronunciationGuideUs": "/wiː/ /hæv/ /juːzd/ /ðɪs/ /æp/ /fɔːr/ /sɪks/ /mʌnθs/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "We",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "used",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'use'."
      },
      {
        "id": "w3",
        "unitText": "this",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_d99dfc7352dea733ee",
    "text": "My sister has worked at a hospital for five years",
    "pinyin": null,
    "translation": "Chị gái tôi đã làm việc ở một bệnh viện được năm năm rồi.",
    "acceptedAnswers": [
      "My sister has worked at a hospital for five years"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /ˈsɪstə(r)/ /hæz/ /wɜːkt/ /æt/ /ə/ /ˈhɒspɪtl/ /fɔː(r)/ /faɪv/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "My sister has worked at a hospital for five years",
    "displayText": "My sister has worked at a hospital for five years.",
    "pronunciationGuide": "/maɪ/ /ˈsɪstə(r)/ /hæz/ /wɜːkt/ /æt/ /ə/ /ˈhɒspɪtl/ /fɔː(r)/ /faɪv/ /jɪəz/",
    "pronunciationGuideUs": "/maɪ/ /ˈsɪstər/ /hæz/ /wɜːrkt/ /æt/ /ə/ /ˈhɑːspɪtl/ /fɔːr/ /faɪv/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "sister",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w3",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'work'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_d3356b6a38eb7e0392",
    "text": "I have had this phone for three months",
    "pinyin": null,
    "translation": "Tôi đã có chiếc điện thoại này được ba tháng rồi.",
    "acceptedAnswers": [
      "I have had this phone for three months",
      "I've had this phone for three months"
    ],
    "audioUrl": null,
    "ipa": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /fəʊn/ /fɔː(r)/ /θriː/ /mʌnθs/",
    "targetLanguage": "en",
    "targetText": "I have had this phone for three months",
    "displayText": "I have had this phone for three months.",
    "pronunciationGuide": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /fəʊn/ /fɔː(r)/ /θriː/ /mʌnθs/",
    "pronunciationGuideUs": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /foʊn/ /fɔːr/ /θriː/ /mʌnθs/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "I",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số ít."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      },
      {
        "id": "w3",
        "unitText": "this",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_f3a896d6a7c5ad67d1",
    "text": "They have worked in the same shop for seven years",
    "pinyin": null,
    "translation": "Họ đã làm việc trong cùng một cửa hàng được bảy năm rồi.",
    "acceptedAnswers": [
      "They have worked in the same shop for seven years",
      "They've worked in the same shop for seven years"
    ],
    "audioUrl": null,
    "ipa": "/ðeɪ/ /hæv/ /wɜːkt/ /ɪn/ /ðə/ /seɪm/ /ʃɒp/ /fɔː(r)/ /ˈsevn/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "They have worked in the same shop for seven years",
    "displayText": "They have worked in the same shop for seven years.",
    "pronunciationGuide": "/ðeɪ/ /hæv/ /wɜːkt/ /ɪn/ /ðə/ /seɪm/ /ʃɒp/ /fɔː(r)/ /ˈsevn/ /jɪəz/",
    "pronunciationGuideUs": "/ðeɪ/ /hæv/ /wɜːrkt/ /ɪn/ /ðə/ /seɪm/ /ʃɑːp/ /fɔːr/ /ˈsevn/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "They",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun) số nhiều, chỉ những người được nói tới."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' lập thì hiện tại hoàn thành (present perfect) với chủ ngữ số nhiều."
      },
      {
        "id": "w2",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính ở dạng quá khứ phân từ (past participle) của 'work', đứng sau trợ động từ 'have'."
      },
      {
        "id": "w3",
        "unitText": "in",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_8d78a0840dd3799264",
    "text": "He has lived with his grandparents for two years",
    "pinyin": null,
    "translation": "Anh ấy đã sống với ông bà của mình được hai năm rồi.",
    "acceptedAnswers": [
      "He has lived with his grandparents for two years",
      "He's lived with his grandparents for two years"
    ],
    "audioUrl": null,
    "ipa": "/hiː/ /hæz/ /lɪvd/ /wɪð/ /hɪz/ /ˈɡrænpeərənts/ /fɔː(r)/ /tuː/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "He has lived with his grandparents for two years",
    "displayText": "He has lived with his grandparents for two years.",
    "pronunciationGuide": "/hiː/ /hæz/ /lɪvd/ /wɪð/ /hɪz/ /ˈɡrænpeərənts/ /fɔː(r)/ /tuː/ /jɪəz/",
    "pronunciationGuideUs": "/hiː/ /hæz/ /lɪvd/ /wɪð/ /hɪz/ /ˈɡrændperənts/ /fɔːr/ /tuː/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "He",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống đực."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "lived",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'live'."
      },
      {
        "id": "w3",
        "unitText": "with",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_e67472d15ad5353c03",
    "text": "She has worn glasses for ten years",
    "pinyin": null,
    "translation": "Cô ấy đã đeo kính được mười năm rồi.",
    "acceptedAnswers": [
      "She has worn glasses for ten years",
      "She's worn glasses for ten years"
    ],
    "audioUrl": null,
    "ipa": "/ʃiː/ /hæz/ /wɔːn/ /ˈɡlɑːsɪz/ /fɔː(r)/ /ten/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "She has worn glasses for ten years",
    "displayText": "She has worn glasses for ten years.",
    "pronunciationGuide": "/ʃiː/ /hæz/ /wɔːn/ /ˈɡlɑːsɪz/ /fɔː(r)/ /ten/ /jɪəz/",
    "pronunciationGuideUs": "/ʃiː/ /hæz/ /wɔːrn/ /ˈɡlæsəz/ /fɔːr/ /ten/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "She",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống cái."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "worn",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'wear'."
      },
      {
        "id": "w3",
        "unitText": "glasses",
        "unitType": "word",
        "grammarTags": [
          "object"
        ],
        "partOfSpeech": "noun",
        "explanationVi": "Tân ngữ (object) - danh từ số nhiều (plural noun) chỉ vật."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_7964bce390a9519e03",
    "text": "My parents have had this house for twenty years",
    "pinyin": null,
    "translation": "Bố mẹ tôi đã có ngôi nhà này được hai mươi năm rồi.",
    "acceptedAnswers": [
      "My parents have had this house for twenty years"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /ˈpeərənts/ /hæv/ /hæd/ /ðɪs/ /haʊs/ /fɔː(r)/ /ˈtwenti/ /jɪəz/",
    "targetLanguage": "en",
    "targetText": "My parents have had this house for twenty years",
    "displayText": "My parents have had this house for twenty years.",
    "pronunciationGuide": "/maɪ/ /ˈpeərənts/ /hæv/ /hæd/ /ðɪs/ /haʊs/ /fɔː(r)/ /ˈtwenti/ /jɪəz/",
    "pronunciationGuideUs": "/maɪ/ /ˈperənts/ /hæv/ /hæd/ /ðɪs/ /haʊs/ /fɔːr/ /ˈtwenti/ /jɪrz/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "parents",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w3",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_24975279ef737e0a5f",
    "text": "I have had this laptop since January",
    "pinyin": null,
    "translation": "Tôi đã có chiếc máy tính xách tay này từ tháng Một rồi.",
    "acceptedAnswers": [
      "I have had this laptop since January",
      "I've had this laptop since January"
    ],
    "audioUrl": null,
    "ipa": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /ˈlæptɒp/ /sɪns/ /ˈdʒænjuəri/",
    "targetLanguage": "en",
    "targetText": "I have had this laptop since January",
    "displayText": "I have had this laptop since January.",
    "pronunciationGuide": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /ˈlæptɒp/ /sɪns/ /ˈdʒænjuəri/",
    "pronunciationGuideUs": "/aɪ/ /hæv/ /hæd/ /ðɪs/ /ˈlæptɑːp/ /sɪns/ /ˈdʒænjueri/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "I",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số ít."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      },
      {
        "id": "w3",
        "unitText": "this",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_64dea99e6ec322271a",
    "text": "He has driven a lorry since March",
    "pinyin": null,
    "translation": "Anh ấy đã lái xe tải từ tháng Ba rồi.",
    "acceptedAnswers": [
      "He has driven a lorry since March",
      "He's driven a lorry since March"
    ],
    "audioUrl": null,
    "ipa": "/hiː/ /hæz/ /ˈdrɪvn/ /ə/ /ˈlɒri/ /sɪns/ /mɑːtʃ/",
    "targetLanguage": "en",
    "targetText": "He has driven a lorry since March",
    "displayText": "He has driven a lorry since March.",
    "pronunciationGuide": "/hiː/ /hæz/ /ˈdrɪvn/ /ə/ /ˈlɒri/ /sɪns/ /mɑːtʃ/",
    "pronunciationGuideUs": "/hiː/ /hæz/ /ˈdrɪvən/ /ə/ /ˈlɔːri/ /sɪns/ /mɑːrtʃ/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "He",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống đực."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "driven",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'drive'."
      },
      {
        "id": "w3",
        "unitText": "a",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "article"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_bb4fa26067bd390cac",
    "text": "They have been friends since school",
    "pinyin": null,
    "translation": "Họ đã là bạn từ hồi đi học rồi.",
    "acceptedAnswers": [
      "They have been friends since school",
      "They've been friends since school"
    ],
    "audioUrl": null,
    "ipa": "/ðeɪ/ /hæv/ /biːn/ /frendz/ /sɪns/ /skuːl/",
    "targetLanguage": "en",
    "targetText": "They have been friends since school",
    "displayText": "They have been friends since school.",
    "pronunciationGuide": "/ðeɪ/ /hæv/ /biːn/ /frendz/ /sɪns/ /skuːl/",
    "pronunciationGuideUs": "/ðeɪ/ /hæv/ /bɪn/ /frendz/ /sɪns/ /skuːl/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "They",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "been",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'be', động từ nối (linking verb)."
      },
      {
        "id": "w3",
        "unitText": "friends",
        "unitType": "word",
        "grammarTags": [
          "subject_complement"
        ],
        "partOfSpeech": "noun",
        "explanationVi": "Bổ ngữ chủ ngữ (subject complement) - danh từ số nhiều (plural noun) nói về chủ ngữ 'They'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_6e5e3fa5f1aeac9b37",
    "text": "She has taught at this school since September",
    "pinyin": null,
    "translation": "Cô ấy đã dạy ở ngôi trường này từ tháng Chín rồi.",
    "acceptedAnswers": [
      "She has taught at this school since September",
      "She's taught at this school since September"
    ],
    "audioUrl": null,
    "ipa": "/ʃiː/ /hæz/ /tɔːt/ /æt/ /ðɪs/ /skuːl/ /sɪns/ /sepˈtembə(r)/",
    "targetLanguage": "en",
    "targetText": "She has taught at this school since September",
    "displayText": "She has taught at this school since September.",
    "pronunciationGuide": "/ʃiː/ /hæz/ /tɔːt/ /æt/ /ðɪs/ /skuːl/ /sɪns/ /sepˈtembə(r)/",
    "pronunciationGuideUs": "/ʃiː/ /hæz/ /tɔːt/ /æt/ /ðɪs/ /skuːl/ /sɪns/ /sepˈtembər/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "She",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống cái."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "taught",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'teach'."
      },
      {
        "id": "w3",
        "unitText": "at",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_79414e4e3a6b458f06",
    "text": "We have kept in touch since university",
    "pinyin": null,
    "translation": "Chúng tôi đã giữ liên lạc từ hồi đại học rồi.",
    "acceptedAnswers": [
      "We have kept in touch since university",
      "We've kept in touch since university"
    ],
    "audioUrl": null,
    "ipa": "/wiː/ /hæv/ /kept/ /ɪn/ /tʌtʃ/ /sɪns/ /ˌjuːnɪˈvɜːsəti/",
    "targetLanguage": "en",
    "targetText": "We have kept in touch since university",
    "displayText": "We have kept in touch since university.",
    "pronunciationGuide": "/wiː/ /hæv/ /kept/ /ɪn/ /tʌtʃ/ /sɪns/ /ˌjuːnɪˈvɜːsəti/",
    "pronunciationGuideUs": "/wiː/ /hæv/ /kept/ /ɪn/ /tʌtʃ/ /sɪns/ /ˌjuːnɪˈvɜːrsəti/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "We",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ nhất số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "kept in touch",
        "unitType": "word",
        "grammarTags": [
          "verb",
          "collocation"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - cụm từ cố định (fixed collocation) 'keep in touch', dạng quá khứ phân từ là 'kept'."
      },
      {
        "id": "w3",
        "unitText": "since",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_fde4420270ba624909",
    "text": "My parents have lived in the countryside since spring",
    "pinyin": null,
    "translation": "Bố mẹ tôi đã sống ở nông thôn từ mùa xuân rồi.",
    "acceptedAnswers": [
      "My parents have lived in the countryside since spring"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /ˈpeərənts/ /hæv/ /lɪvd/ /ɪn/ /ðə/ /ˈkʌntrisaɪd/ /sɪns/ /sprɪŋ/",
    "targetLanguage": "en",
    "targetText": "My parents have lived in the countryside since spring",
    "displayText": "My parents have lived in the countryside since spring.",
    "pronunciationGuide": "/maɪ/ /ˈpeərənts/ /hæv/ /lɪvd/ /ɪn/ /ðə/ /ˈkʌntrisaɪd/ /sɪns/ /sprɪŋ/",
    "pronunciationGuideUs": "/maɪ/ /ˈperənts/ /hæv/ /lɪvd/ /ɪn/ /ðə/ /ˈkʌntrisaɪd/ /sɪns/ /sprɪŋ/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "parents",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'have' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w3",
        "unitText": "lived",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'live'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_455afe69d2a99e2fb6",
    "text": "He has had a car since April",
    "pinyin": null,
    "translation": "Anh ấy đã có một chiếc ô tô từ tháng Tư rồi.",
    "acceptedAnswers": [
      "He has had a car since April",
      "He's had a car since April"
    ],
    "audioUrl": null,
    "ipa": "/hiː/ /hæz/ /hæd/ /ə/ /kɑː(r)/ /sɪns/ /ˈeɪprəl/",
    "targetLanguage": "en",
    "targetText": "He has had a car since April",
    "displayText": "He has had a car since April.",
    "pronunciationGuide": "/hiː/ /hæz/ /hæd/ /ə/ /kɑː(r)/ /sɪns/ /ˈeɪprəl/",
    "pronunciationGuideUs": "/hiː/ /hæz/ /hæd/ /ə/ /kɑːr/ /sɪns/ /ˈeɪprəl/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "He",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống đực."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "had",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'have' nghĩa 'có'."
      },
      {
        "id": "w3",
        "unitText": "a",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "article"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_d5896c8b735b52d4b0",
    "text": "My friend has lived abroad since last year",
    "pinyin": null,
    "translation": "Bạn tôi đã sống ở nước ngoài từ năm ngoái rồi.",
    "acceptedAnswers": [
      "My friend has lived abroad since last year"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /frend/ /hæz/ /lɪvd/ /əˈbrɔːd/ /sɪns/ /lɑːst/ /jɪə(r)/",
    "targetLanguage": "en",
    "targetText": "My friend has lived abroad since last year",
    "displayText": "My friend has lived abroad since last year.",
    "pronunciationGuide": "/maɪ/ /frend/ /hæz/ /lɪvd/ /əˈbrɔːd/ /sɪns/ /lɑːst/ /jɪə(r)/",
    "pronunciationGuideUs": "/maɪ/ /frend/ /hæz/ /lɪvd/ /əˈbrɔːd/ /sɪns/ /læst/ /jɪr/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "friend",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w3",
        "unitText": "lived",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'live'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_b336b2c9df589b7bb5",
    "text": "She has worked at a restaurant since Friday",
    "pinyin": null,
    "translation": "Cô ấy đã làm việc ở một nhà hàng từ thứ Sáu rồi.",
    "acceptedAnswers": [
      "She has worked at a restaurant since Friday",
      "She's worked at a restaurant since Friday"
    ],
    "audioUrl": null,
    "ipa": "/ʃiː/ /hæz/ /wɜːkt/ /æt/ /ə/ /ˈrestrɒnt/ /sɪns/ /ˈfraɪdeɪ/",
    "targetLanguage": "en",
    "targetText": "She has worked at a restaurant since Friday",
    "displayText": "She has worked at a restaurant since Friday.",
    "pronunciationGuide": "/ʃiː/ /hæz/ /wɜːkt/ /æt/ /ə/ /ˈrestrɒnt/ /sɪns/ /ˈfraɪdeɪ/",
    "pronunciationGuideUs": "/ʃiː/ /hæz/ /wɜːrkt/ /æt/ /ə/ /ˈrestrɑːnt/ /sɪns/ /ˈfraɪdeɪ/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "She",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun), ngôi thứ ba số ít giống cái."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' tạo thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - quá khứ phân từ (past participle) của 'work'."
      },
      {
        "id": "w3",
        "unitText": "at",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "preposition"
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_f4fa6ea8695a78a9e3",
    "text": "He has changed a lot since he moved to this city",
    "pinyin": null,
    "translation": "Anh ấy đã thay đổi nhiều từ khi chuyển đến thành phố này.",
    "acceptedAnswers": [
      "He has changed a lot since he moved to this city",
      "He's changed a lot since he moved to this city"
    ],
    "audioUrl": null,
    "ipa": "/hiː/ /hæz/ /tʃeɪndʒd/ /ə/ /lɒt/ /sɪns/ /hiː/ /muːvd/ /tə/ /ðɪs/ /ˈsɪti/",
    "targetLanguage": "en",
    "targetText": "He has changed a lot since he moved to this city",
    "displayText": "He has changed a lot since he moved to this city.",
    "pronunciationGuide": "/hiː/ /hæz/ /tʃeɪndʒd/ /ə/ /lɒt/ /sɪns/ /hiː/ /muːvd/ /tə/ /ðɪs/ /ˈsɪti/",
    "pronunciationGuideUs": "/hiː/ /hæz/ /tʃeɪndʒd/ /ə/ /lɑːt/ /sɪns/ /hiː/ /muːvd/ /tə/ /ðɪs/ /ˈsɪti/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "He",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun) số ít chỉ người."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' lập thì hiện tại hoàn thành (present perfect) với chủ ngữ số ít."
      },
      {
        "id": "w2",
        "unitText": "changed",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính dạng quá khứ phân từ (past participle) của 'change', sau trợ động từ 'has'."
      },
      {
        "id": "w3",
        "unitText": "a lot",
        "unitType": "word",
        "grammarTags": [
          "adverbial"
        ],
        "partOfSpeech": "adverb",
        "explanationVi": "Trạng ngữ (adverbial) - cụm trạng từ (adverb phrase) chỉ mức độ, bổ nghĩa cho động từ 'changed'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_3f8d79f499bb399d3c",
    "text": "We have saved money since we started cooking at home",
    "pinyin": null,
    "translation": "Chúng tôi đã tiết kiệm tiền từ khi bắt đầu nấu ăn ở nhà.",
    "acceptedAnswers": [
      "We have saved money since we started cooking at home",
      "We've saved money since we started cooking at home"
    ],
    "audioUrl": null,
    "ipa": "/wiː/ /hæv/ /seɪvd/ /ˈmʌni/ /sɪns/ /wiː/ /ˈstɑːtɪd/ /ˈkʊkɪŋ/ /æt/ /həʊm/",
    "targetLanguage": "en",
    "targetText": "We have saved money since we started cooking at home",
    "displayText": "We have saved money since we started cooking at home.",
    "pronunciationGuide": "/wiː/ /hæv/ /seɪvd/ /ˈmʌni/ /sɪns/ /wiː/ /ˈstɑːtɪd/ /ˈkʊkɪŋ/ /æt/ /həʊm/",
    "pronunciationGuideUs": "/wiː/ /hæv/ /seɪvd/ /ˈmʌni/ /sɪns/ /wiː/ /ˈstɑːrtɪd/ /ˈkʊkɪŋ/ /æt/ /hoʊm/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "We",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun) số nhiều."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - lập thì hiện tại hoàn thành (present perfect) với chủ ngữ số nhiều."
      },
      {
        "id": "w2",
        "unitText": "saved",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính dạng quá khứ phân từ (past participle) của 'save', sau trợ động từ 'have'."
      },
      {
        "id": "w3",
        "unitText": "money",
        "unitType": "word",
        "grammarTags": [
          "object"
        ],
        "partOfSpeech": "noun",
        "explanationVi": "Tân ngữ (object) - danh từ không đếm được (uncountable noun), đối tượng của hành động 'saved'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_f52bd3abe41fe75eff",
    "text": "I have improved a lot since I started this course",
    "pinyin": null,
    "translation": "Tôi đã tiến bộ nhiều từ khi bắt đầu khoá học này.",
    "acceptedAnswers": [
      "I have improved a lot since I started this course",
      "I've improved a lot since I started this course"
    ],
    "audioUrl": null,
    "ipa": "/aɪ/ /hæv/ /ɪmˈpruːvd/ /ə/ /lɒt/ /sɪns/ /aɪ/ /ˈstɑːtɪd/ /ðɪs/ /kɔːs/",
    "targetLanguage": "en",
    "targetText": "I have improved a lot since I started this course",
    "displayText": "I have improved a lot since I started this course.",
    "pronunciationGuide": "/aɪ/ /hæv/ /ɪmˈpruːvd/ /ə/ /lɒt/ /sɪns/ /aɪ/ /ˈstɑːtɪd/ /ðɪs/ /kɔːs/",
    "pronunciationGuideUs": "/aɪ/ /hæv/ /ɪmˈpruːvd/ /ə/ /lɑːt/ /sɪns/ /aɪ/ /ˈstɑːrtɪd/ /ðɪs/ /kɔːrs/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "I",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun) ngôi thứ nhất số ít."
      },
      {
        "id": "w1",
        "unitText": "have",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - lập thì hiện tại hoàn thành (present perfect)."
      },
      {
        "id": "w2",
        "unitText": "improved",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính dạng quá khứ phân từ (past participle) của 'improve', sau trợ động từ 'have'."
      },
      {
        "id": "w3",
        "unitText": "a lot",
        "unitType": "word",
        "grammarTags": [
          "adverbial"
        ],
        "partOfSpeech": "adverb",
        "explanationVi": "Trạng ngữ (adverbial) - cụm trạng từ chỉ mức độ, bổ nghĩa cho động từ 'improved'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_ecdba3255062b66a2e",
    "text": "She has worked here since she became a manager",
    "pinyin": null,
    "translation": "Cô ấy đã làm việc ở đây từ khi trở thành quản lý.",
    "acceptedAnswers": [
      "She has worked here since she became a manager",
      "She's worked here since she became a manager"
    ],
    "audioUrl": null,
    "ipa": "/ʃiː/ /hæz/ /wɜːkt/ /hɪə(r)/ /sɪns/ /ʃiː/ /bɪˈkeɪm/ /ə/ /ˈmænɪdʒə(r)/",
    "targetLanguage": "en",
    "targetText": "She has worked here since she became a manager",
    "displayText": "She has worked here since she became a manager.",
    "pronunciationGuide": "/ʃiː/ /hæz/ /wɜːkt/ /hɪə(r)/ /sɪns/ /ʃiː/ /bɪˈkeɪm/ /ə/ /ˈmænɪdʒə(r)/",
    "pronunciationGuideUs": "/ʃiː/ /hæz/ /wɜːrkt/ /hɪr/ /sɪns/ /ʃiː/ /bɪˈkeɪm/ /ə/ /ˈmænɪdʒər/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "She",
        "unitType": "word",
        "grammarTags": [
          "subject"
        ],
        "partOfSpeech": "pronoun",
        "explanationVi": "Chủ ngữ (subject) - đại từ nhân xưng (personal pronoun) số ít chỉ người."
      },
      {
        "id": "w1",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' lập thì hiện tại hoàn thành với chủ ngữ số ít."
      },
      {
        "id": "w2",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính dạng quá khứ phân từ (past participle) của 'work', sau trợ động từ 'has'."
      },
      {
        "id": "w3",
        "unitText": "here",
        "unitType": "word",
        "grammarTags": [
          "adverbial"
        ],
        "partOfSpeech": "adverb",
        "explanationVi": "Trạng ngữ (adverbial) - trạng từ chỉ nơi chốn (adverb of place), bổ nghĩa cho động từ 'worked'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  },
  {
    "id": "stmt_9f37e7b644997d3e63",
    "text": "My cousin has worked as a nurse since she left school",
    "pinyin": null,
    "translation": "Chị họ tôi đã làm y tá từ khi ra trường.",
    "acceptedAnswers": [
      "My cousin has worked as a nurse since she left school"
    ],
    "audioUrl": null,
    "ipa": "/maɪ/ /ˈkʌzn/ /hæz/ /wɜːkt/ /æz/ /ə/ /nɜːs/ /sɪns/ /ʃiː/ /left/ /skuːl/",
    "targetLanguage": "en",
    "targetText": "My cousin has worked as a nurse since she left school",
    "displayText": "My cousin has worked as a nurse since she left school.",
    "pronunciationGuide": "/maɪ/ /ˈkʌzn/ /hæz/ /wɜːkt/ /æz/ /ə/ /nɜːs/ /sɪns/ /ʃiː/ /left/ /skuːl/",
    "pronunciationGuideUs": "/maɪ/ /ˈkʌzn/ /hæz/ /wɜːrkt/ /æz/ /ə/ /nɜːrs/ /sɪns/ /ʃiː/ /left/ /skuːl/",
    "pronunciationPlain": null,
    "learningUnits": [
      {
        "id": "w0",
        "unitText": "My",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "determiner"
      },
      {
        "id": "w1",
        "unitText": "cousin",
        "unitType": "word",
        "grammarTags": [],
        "partOfSpeech": "noun"
      },
      {
        "id": "w2",
        "unitText": "has",
        "unitType": "word",
        "grammarTags": [
          "auxiliary"
        ],
        "partOfSpeech": "auxiliary",
        "explanationVi": "Trợ động từ (auxiliary) - 'has' lập thì hiện tại hoàn thành (present perfect) với chủ ngữ số ít."
      },
      {
        "id": "w3",
        "unitText": "worked",
        "unitType": "word",
        "grammarTags": [
          "verb"
        ],
        "partOfSpeech": "verb",
        "explanationVi": "Động từ (verb) - động từ chính dạng quá khứ phân từ (past participle) của 'work', sau trợ động từ 'has'."
      }
    ],
    "tier": "sentence",
    "guessable": null,
    "zhWords": null
  }
],
  mastered: [],
  lastIndex: 0,
  completed: false,
  completedModes: [],
  doneSteps: [],
};
