import { MealPlanResponse } from "./types";

export const INITIAL_MEAL_PLAN_MANGZHONG: MealPlanResponse = {
  solarTermInfo: {
    name: "芒種",
    healthPrinciple: "芒種時值仲夏，氣候高溫多濕，人体容易感到疲倦重滯、胃口不開。飲食調養宜以「祛濕消暑、滋陰健脾、清淡防暑」為主。此時水分流失快，宜多食富含水分、高纖且能排除體內濕氣的當季瓜果，不宜過食煎炸或辛辣重口味之物。",
    recommendedIngredients: ["絲瓜", "綠豆", "西瓜", "荔枝", "秋葵", "蛤蜊", "鳳梨", "苦瓜", "蓮藕", "蘆筍"]
  },
  nutritionSummary: {
    totalCalories: 1850,
    protein: "78g",
    fat: "55g",
    carbs: "240g"
  },
  meals: [
    {
      type: "早餐",
      dishName: "蘆筍野菇鮮蝦燕麥歐姆蛋",
      description: "以富含水分與天門冬胺酸的當季蘆筍，搭配低熱量、多膳食纖維的野菇與燕麥，調配出清爽不油膩的元氣早餐，為高溫的芒種早晨注入清新與滿滿優質蛋白質。",
      prepTime: 10,
      cookTime: 10,
      estimatedCostPerPerson: 55,
      keySeasonalIngredients: ["蘆筍", "新鮮白蝦", "野菇"],
      ingredients: [
        { name: "當季綠蘆筍", amount: "1把 (約150g)", category: "蔬菜" },
        { name: "好菇道雪白菇", amount: "1包", category: "蔬菜" },
        { name: "新鮮大白蝦", amount: "9隻 (去殼切丁)", category: "肉類/海鮮" },
        { name: "鮮雞蛋", amount: "6顆", category: "蛋奶/豆腐" },
        { name: "家常即食燕麥片", amount: "3湯匙", category: "五穀根莖" },
        { name: "橄欖油與海鹽", amount: "適量", category: "調味/乾貨" }
      ],
      steps: [
        "將蘆筍切掉老梗、切成細丁；雪白菇切除根部掰開備用。",
        "白蝦去殼挑砂線，洗淨後切丁，用微量鹽巴黑胡椒略醃製。",
        "在大碗中打入6顆雞蛋，加入燕麥片與2湯匙開水，充分攪拌均勻讓燕麥吸水。",
        "平底鍋熱鍋，倒入1小匙橄欖油，先將蝦仁丁、雪白菇與蘆筍細丁炒至八分熟並散發香氣。",
        "將食材在平底鍋內撥平，倒入調製好的燕麥蛋液，用中小火煎至底部微凝固，隨後對折成半月形，兩面煎至金黃即可均分享用。"
      ],
      chefTips: "加入即食燕麥片與微量水分，能鎖住蛋香，使歐姆蛋更蓬鬆多汁，同時增加低GI飽足感，非常適合高熱夏天早晨！"
    },
    {
      type: "午餐",
      dishName: "鮮甜當季絲瓜炒蛤蜊 + 乾煎黃金鮭魚菲力",
      description: "利用夏日最甜、一咬多汁的澎湖絲瓜（或本島圓絲瓜），與帶有天然鹹鮮的蛤蜊一同燜煮，完全不加水，品嚐大自然最清甜去濕的湯汁；再搭配乾煎鮭魚菲力，補足好脂肪與Omega-3，經濟又營養強健。",
      prepTime: 15,
      cookTime: 15,
      estimatedCostPerPerson: 95,
      keySeasonalIngredients: ["絲瓜", "蛤蜊"],
      ingredients: [
        { name: "台灣當季翠綠絲瓜", amount: "2條 (去皮切片)", category: "蔬菜" },
        { name: "新鮮吐沙蛤蜊", amount: "半台斤 (300g)", category: "肉類/海鮮" },
        { name: "急凍鮭魚菲力薄片", amount: "3片 (約350g總重)", category: "肉類/海鮮" },
        { name: "生薑", amount: "1小塊 (切細絲)", category: "蔬菜" },
        { name: "蒜頭", amount: "3瓣 (切片)", category: "蔬菜" },
        { name: "純香葵花油", amount: "2湯匙", category: "調味/乾貨" },
        { name: "台鹽海鹽與白胡椒粉", amount: "少許", category: "調味/乾貨" }
      ],
      steps: [
        "鮭魚沖洗後用廚房紙巾徹底擦乾水分，表面均勻撒上一層薄薄的海鹽與胡椒粉醃製備用。",
        "絲瓜削皮，先剖半再切成約1.5公分厚的斜片（保留口感，不易縮水變糊）。",
        "熱平底鍋，不放油（鮭魚自帶豐富油脂），將鮭魚片皮朝下放入，中小火乾煎。煎至皮金黃酥脆後翻面，再乾煎3-4分鐘熟透後盛盤。",
        "利用鍋中留下的鮭魚天然色澤油脂，爆香薑絲與蒜片，接著倒入切妥的絲瓜片翻炒約1分鐘。",
        "將蛤蜊倒在絲瓜表面，蓋上鍋蓋，轉中火燜煮約3分鐘，期間完全不需要加任何一滴水。待蛤蜊開殼、絲瓜出水變軟即開蓋，下一點點細鹽提鮮即可一鍋雙享受。"
      ],
      chefTips: "煎魚時要保持高溫高溫在起鍋，外皮才會像餅乾一樣酥脆。絲瓜蛤蜊完全靠絲瓜本身與蛤蜊溢出的湯汁焖熟，鮮美度是一般做法的3倍，也是夏天退火祛濕的絕佳家常高纖湯汁！"
    },
    {
      type: "晚餐",
      dishName: "涼拌鳳梨彩椒雞絲大麥冷粉",
      description: "燠熱的芒種夜晚需要能提振食慾的料理。選用關廟產鳳梨的微酸微甜，加上燙熟後手撕的放山雞胸肉絲、大黃瓜、彩椒。拌上冰鎮後、高纖健康的大麥冷麵或冬粉，淋上微涼泰式酸甜蒜香醬，低脂健康、酸甜開胃，讓全家人一掃暑氣。",
      prepTime: 20,
      cookTime: 8,
      estimatedCostPerPerson: 70,
      keySeasonalIngredients: ["鳳梨", "大黃瓜", "彩椒"],
      ingredients: [
        { name: "金鑽鳳梨", amount: "1/4顆 (切成小扇片)", category: "蔬菜" },
        { name: "小磨坊高纖綠豆冬粉", amount: "3把", category: "五穀根莖" },
        { name: "國產冷藏雞胸肉", amount: "320g", category: "肉類/海鮮" },
        { name: "大黃瓜 (或小黃瓜)", amount: "1條 (切絲)", category: "蔬菜" },
        { name: "黃、紅甜椒", amount: "各半顆 (切細絲)", category: "蔬菜" },
        { name: "熟白芝麻、香菜", amount: "適量", category: "調味/乾貨" },
        { name: "自製酸甜汁：白醋、檸檬汁、淡醬油、細糖、蒜末、芝麻油", amount: "一碗 (比例調和調好)", category: "調味/乾貨" }
      ],
      steps: [
        "準備一鍋滾水，放入薑片與1茶匙米酒，將雞胸肉放入中火燙煮約8分鐘，關火後不開蓋，用餘溫燜5分鐘，隨後撈起浸入冰水中。冷卻後，順著肌肉紋理手撕成細長雞絲。",
        "冬粉放入熱水中煮約5分鐘至軟且呈 Q 彈半透明狀，撈起立刻放入乾淨冰水中冰鎮，接著瀝乾、剪成小段好入口。",
        "將金鑽鳳梨切成薄片；大黃瓜切細絲；黃紅甜椒去籽切整齊細絲。",
        "調製醬汁：將一瓣蒜碎、適量淡醬油、半顆現榨檸檬汁、1大匙細糖、半大匙香油、1大匙開水、微量辣椒丁充分攪拌，試味道成平衡的酸甜微辣香氣。",
        "在大盆中放入冰涼的冬粉，擺上雞絲、大黃瓜絲、甜椒與亮眼金黃的鳳梨片，淋上自調特製醬汁。拌勻後盛入大碗，撒上香菜碎與白芝麻即可舒暢涼快地下肚。"
      ],
      chefTips: "雞胸肉千萬不能大火一直煮，否則肉質會變柴；以燜水的方式泡熟，肉質最為水嫩。加入當令鳳梨的天然酵素能幫助家人消食整腸，酸甜口感能瞬間激活夏日昏沉的食慾！"
    }
  ],
  shoppingList: [
    { name: "當季綠蘆筍", amount: "1把", category: "蔬菜", estimatedPrice: 45 },
    { name: "翠綠絲瓜 (本島/澎湖)", amount: "2條", category: "蔬菜", estimatedPrice: 70 },
    { name: "金鑽鳳梨 (中)", amount: "1/4顆", category: "蔬菜", estimatedPrice: 20 },
    { name: "生薑與蒜頭", amount: "1份裝", category: "蔬菜", estimatedPrice: 30 },
    { name: "大黃瓜 + 彩椒 (黃、紅各1)", amount: "1組", category: "蔬菜", estimatedPrice: 65 },
    { name: "好菇道雪白菇", amount: "1包", category: "蔬菜", estimatedPrice: 32 },
    { name: "新鮮吐沙蛤蜊", amount: "半斤 (300g)", category: "肉類/海鮮", estimatedPrice: 85 },
    { name: "國產冷藏雞胸肉", amount: "320g", category: "肉類/海鮮", estimatedPrice: 95 },
    { name: "新鮮大白蝦", amount: "9隻 (約180g)", category: "肉類/海鮮", estimatedPrice: 110 },
    { name: "急凍鮭魚菲力薄片", amount: "3片 (約350g)", category: "肉類/海鮮", estimatedPrice: 240 },
    { name: "鮮雞蛋 (洗選白蛋)", amount: "1盒 (10顆裝)", category: "蛋奶/豆腐", estimatedPrice: 65 },
    { name: "即食大燕麥片", amount: "家庭裝 (耗用小部分)", category: "五穀根莖", estimatedPrice: 15 },
    { name: "綠豆冬粉", amount: "1袋 (3把入)", category: "五穀根莖", estimatedPrice: 35 },
    { name: "香菜與白芝麻、廚用油調味料", amount: "家中乾貨與微量補充", category: "調味/乾貨", estimatedPrice: 40 }
  ]
};
export const MOCK_LOADING_STEPS = [
  "正在根據開伙人數精算食材份量...",
  "正在查詢當前節氣與養生宜忌...",
  "正在配對最新鮮、超值的在地當季食材...",
  "主廚正在規劃早餐、午餐、晚餐搭配...",
  "正在精算營養價值、卡路里平衡與食材共享率...",
  "正在撰寫詳細的採買清單與專業主廚提示...",
  "食譜精心打磨完成，即將呈現！"
];
