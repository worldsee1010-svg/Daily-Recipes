export interface SolarTermInfo {
  name: string;
  healthPrinciple: string;
  recommendedIngredients: string[];
}

export interface NutritionSummary {
  totalCalories: number;
  protein: string;
  fat: string;
  carbs: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  category: "蔬菜" | "肉類/海鮮" | "蛋奶/豆腐" | "五穀根莖" | "調味/乾貨" | string;
}

export interface Meal {
  type: "早餐" | "午餐" | "晚餐" | string;
  dishName: string;
  description: string;
  prepTime: number;
  cookTime: number;
  estimatedCostPerPerson: number;
  keySeasonalIngredients: string[];
  ingredients: Ingredient[];
  steps: string[];
  chefTips: string;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
  estimatedPrice: number;
  checked?: boolean;
}

export interface MealPlanResponse {
  solarTermInfo: SolarTermInfo;
  nutritionSummary: NutritionSummary;
  meals: Meal[];
  shoppingList: ShoppingItem[];
}

export const SOLAR_TERMS = [
  // 春
  { name: "立春", dates: "2/3-2/5", season: "春", desc: "春季開始，天氣漸暖，宜養肝護陽，多食韭菜、春筍、辛甘發散食材。" },
  { name: "雨水", dates: "2/18-2/20", season: "春", desc: "降雨增多，濕氣漸升，宜調理脾胃，多食山藥、蓮子、紅棗等。" },
  { name: "驚蟄", dates: "3/5-3/7", season: "春", desc: "春雷驚百蟲，氣溫升高，宜清熱養脾，多食水梨、菠菜、蘆筍。" },
  { name: "春分", dates: "3/20-3/22", season: "春", desc: "平分陰陽，晝夜同長，宜平調陰陽，多享櫻桃、當季豌豆、豆芽。" },
  { name: "清明", dates: "4/4-4/6", season: "春", desc: "氣候清爽，肺氣偏旺，宜清肝明目，多食蕎麥、薺菜、紅豆、草仔粿。" },
  { name: "穀雨", dates: "4/19-4/21", season: "春", desc: "雨水增多，利於穀物，宜除濕健脾，多食香椿、燕麥、冬瓜、薏仁。" },
  // 夏
  { name: "立夏", dates: "5/5-5/7", season: "夏", desc: "夏季開始，氣溫急升，宜清心防暑，多食桑葚、綠豆、小黃瓜。" },
  { name: "小滿", dates: "5/20-5/22", season: "夏", desc: "麥類飽滿，濕熱漸增，宜健脾去濕，多食蒲公英、苦瓜、秋葵。" },
  { name: "芒種", dates: "6/5-6/7", season: "夏", desc: "作物播種，天氣高溫多濕，宜祛濕清暑、滋陰養胃。多食絲瓜、西瓜、荔枝。" },
  { name: "夏至", dates: "6/20-6/22", season: "夏", desc: "白天最長，陽氣極致，宜避暑清熱、多甘酸。多食瓠瓜、冬瓜、綠豆湯。" },
  { name: "小暑", dates: "7/6-7/8", season: "夏", desc: "天氣漸熱，雷雨多，宜防汗多亡陽。多食蓮藕、苦瓜、綠豆、鳳梨。" },
  { name: "大暑", dates: "7/22-7/24", season: "夏", desc: "最熱時期，高溫難耐，宜防中暑、健脾祛濕。多食西瓜、仙草、薏仁、薑汁。" },
  // 秋
  { name: "立秋", dates: "8/7-8/9", season: "秋", desc: "秋季開始，燥氣漸生，宜潤肺消暑。多食桂圓、茄子、蓮子、百合。" },
  { name: "處暑", dates: "8/22-8/24", season: "秋", desc: "暑氣漸退，秋燥萌芽，宜滋陰潤肺。多食鴨肉、梨子、百合、白木耳。" },
  { name: "白露", dates: "9/7-9/9", season: "秋", desc: "氣溫漸涼，露水凝結，宜益氣潤燥。多食龍眼、文旦柚、白蘿蔔。" },
  { name: "秋分", dates: "9/22-9/24", season: "秋", desc: "晝夜均分，秋高氣爽，宜養肺潤膚。多食蟹肉、柿子、山藥、芝麻。" },
  { name: "寒露", dates: "10/8-10/9", season: "秋", desc: "寒意漸濃，露水將冰，宜滋陰潤燥。多食柿子、生薑、栗子、秋菇。" },
  { name: "霜降", dates: "10/23-10/24", season: "秋", desc: "氣溫驟降，大地生霜，宜平補迎冬。多食牛肉、柿子、秋梨、南瓜。" },
  // 冬
  { name: "立冬", dates: "11/7-11/8", season: "冬", desc: "冬季開始，萬物規避，宜溫補養腎。多食麻油雞、羊肉、麻油、白木耳。" },
  { name: "小雪", dates: "11/22-11/23", season: "冬", desc: "降雪漸始，寒風襲人，宜減鹹增苦、保暖。多食白蘿蔔、大白菜、黑芝麻。" },
  { name: "大雪", dates: "12/6-12/8", season: "冬", desc: "降雪偏盛，寒氣逼人，宜補氣溫陽。多食桂圓、紅棗、糯米、栗子。" },
  { name: "冬至", dates: "12/21-12/23", season: "冬", desc: "黑夜最長，陽氣始生，宜滋補驅寒。多食湯圓、羊肉爐、黑豆、山藥。" },
  { name: "小寒", dates: "1/5-1/7", season: "冬", desc: "嚴寒天氣，不宜劇烈活動，宜防寒溫補。多食臘八粥、羊肉、生薑。" },
  { name: "大寒", dates: "1/20-1/21", season: "冬", desc: "全季最冷，迎接新春，宜固本培元。多食雞湯、香菇、芋頭、糯米飯。" }
];
