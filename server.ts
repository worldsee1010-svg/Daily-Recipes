import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI on server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

app.use(express.json());

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiKeyConfigured: !!apiKey });
});

app.post("/api/meals/generate", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Secrets panel."
    });
  }

  const { size, term, dietType, budgetLimit, customWish } = req.body;

  const peopleCount = Number(size) || 3;
  const solarTerm = term || "芒種";
  const diet = dietType || "均衡飲食";
  const budget = budgetLimit || "經濟實惠";
  const wishes = customWish ? `、特別要求/現有食材：${customWish}` : "";

  const prompt = `
你是一位頂級的家庭營養師、米其林星級主廚與精準的家庭預算規劃專家。
請為一個 ${peopleCount} 人的家庭，制定一份「美味、健康既經濟實惠」的單日家庭三餐食譜規劃、烹飪指南與超市採買清單。

請務必緊密搭配當前「二十四節氣」：【${solarTerm}】，並充分運用「${solarTerm}」期間的【當季當令食材】。

【規劃設定條件】
1. 家庭開伙人數：${peopleCount} 人份。
2. 當前節氣：${solarTerm}。
3. 飲食偏好/營養風格：${diet}。
4. 預算考量：${budget}。
${wishes}

【生成指南要求】
- **節氣養生關聯**：提供的三餐中應包含契合該節氣的養生飲食原則，並明確融入當季食材（如春防溫、夏祛濕、秋潤燥、冬補腎）。
- **經濟實惠**：在台灣市場的物價基礎上做精細的預算控制，盡量設計能併用食材的菜單以減少浪費（食材一魚兩吃或多個菜色共用蔬菜），在預算內調配。
- **營養美味與烹飪順序**：營養分配合理、低油鹽且具備層次感。步驟詳細易懂，適合家庭主婦/夫日常快手烹調。
- **採買清單**：請在 shoppingList 中提供針對全家共 ${peopleCount} 人分量、合併後的超市採買項目，並估計出合理的台幣價格 (TWD)。

請務必嚴格遵循 responseSchema 規定的 JSON 格式回傳，不得包含任何額外的 Markdown 包裝或文字。
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位兼具節氣養生學、台灣市場物價常識、家常菜烹飪精髓與家庭精算學的食譜推薦系統。你一律使用繁體中文（台灣習慣用語，如用『高麗菜』而非『包菜』，『番茄』而非『西紅柿』，『一小匙』、『台幣』、『全聯、菜市場』）。",
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            solarTermInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "節氣名稱" },
                healthPrinciple: { type: Type.STRING, description: "該節氣的養生飲食原則與叮嚀（例如防潮去濕或清熱解渴）" },
                recommendedIngredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "此節氣在台灣最推荐、最新鮮且便宜的當季食材"
                }
              },
              required: ["name", "healthPrinciple", "recommendedIngredients"]
            },
            nutritionSummary: {
              type: Type.OBJECT,
              properties: {
                totalCalories: { type: Type.INTEGER, description: "每人全日估計總熱量 (kcal)" },
                protein: { type: Type.STRING, description: "每人全日蛋白質克數，例：'75g'" },
                fat: { type: Type.STRING, description: "每人全日脂肪克數，例：'50g'" },
                carbs: { type: Type.STRING, description: "每人全日碳水化合物克數，例：'220g'" }
              },
              required: ["totalCalories", "protein", "fat", "carbs"]
            },
            meals: {
              type: Type.ARRAY,
              description: "三餐食譜，必須包含三項，分別為早餐、午餐、晚餐",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "餐期，僅限：'早餐', '午餐', '晚餐'" },
                  dishName: { type: Type.STRING, description: "菜名（例如：櫻桃鴨肉什錦炊飯、當季絲瓜炒蛤蜊煎蛋）" },
                  description: { type: Type.STRING, description: "菜色特色、為何適合此節氣與此飲食偏好之原因" },
                  prepTime: { type: Type.INTEGER, description: "準備時間（分鐘）" },
                  cookTime: { type: Type.INTEGER, description: "烹飪時間（分鐘）" },
                  estimatedCostPerPerson: { type: Type.INTEGER, description: "單人估計平均成本 (TWD)" },
                  keySeasonalIngredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "此道菜運用到的當季當地食材"
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    description: "此道菜的全家總用量食材明細",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "食材名稱" },
                        amount: { type: Type.STRING, description: "用量（例如 1把、250g、3顆）" },
                        category: { type: Type.STRING, description: "分類，僅限：'蔬菜', '肉類/海鮮', '蛋奶/豆腐', '五穀根莖', '調味/乾貨'" }
                      },
                      required: ["name", "amount", "category"]
                    }
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "清晰明白的烹飪步驟"
                  },
                  chefTips: { type: Type.STRING, description: "主廚貼心烹飪小瞥步、火候建議，或如何保存剩食的智慧" }
                },
                required: [
                  "type",
                  "dishName",
                  "description",
                  "prepTime",
                  "cookTime",
                  "estimatedCostPerPerson",
                  "keySeasonalIngredients",
                  "ingredients",
                  "steps",
                  "chefTips"
                ]
              }
            },
            shoppingList: {
              type: Type.ARRAY,
              description: "全家總採買合併清單",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "食材品名" },
                  amount: { type: Type.STRING, description: "合併後的採買總用量" },
                  category: { type: Type.STRING, description: "分類同上，便於超市分區選購" },
                  estimatedPrice: { type: Type.INTEGER, description: "全家採買此項的大約總台幣台幣估價 (TWD)" }
                },
                required: ["name", "amount", "category", "estimatedPrice"]
              }
            }
          },
          required: ["solarTermInfo", "nutritionSummary", "meals", "shoppingList"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Returned content is empty.");
    }
    const cleanJson = JSON.parse(text.trim());
    return res.json(cleanJson);
  } catch (err: any) {
    console.error("Gemini Generate Error:", err);
    return res.status(500).json({
      error: "無法生成食譜。這有可能是 AI 模型連線逾時或回傳資料格式解析失敗，請再試一次。",
      details: err?.message || err
    });
  }
});

// Vite middleware flow for fullstack dev vs production assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
