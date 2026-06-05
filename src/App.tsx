import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  Users, 
  Utensils, 
  ShoppingBag, 
  Plus, 
  Check, 
  ChevronRight, 
  RotateCcw, 
  Copy, 
  Printer, 
  TrendingDown, 
  BadgeAlert, 
  Heart,
  Flame,
  Clock,
  Sparkles,
  HelpCircle,
  X
} from "lucide-react";
import { 
  SOLAR_TERMS, 
  MealPlanResponse, 
  Meal, 
  ShoppingItem 
} from "./types";
import { INITIAL_MEAL_PLAN_MANGZHONG, MOCK_LOADING_STEPS } from "./initialData";

export default function App() {
  // Input UI States
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [selectedTerm, setSelectedTerm] = useState<string>("芒種");
  const [dietType, setDietType] = useState<string>("均衡飲食");
  const [budgetLimit, setBudgetLimit] = useState<string>("經濟實惠");
  const [customWish, setCustomWish] = useState<string>("");

  // Data states
  const [mealPlan, setMealPlan] = useState<MealPlanResponse>(INITIAL_MEAL_PLAN_MANGZHONG);
  const [activeMealType, setActiveMealType] = useState<string>("午餐"); // Defaults to lunch
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
  
  // Custom shopping list state
  const [newGroceryName, setNewGroceryName] = useState<string>("");
  const [newGroceryCategory, setNewGroceryCategory] = useState<string>("蔬菜");
  const [newGroceryPrice, setNewGroceryPrice] = useState<string>("50");

  // App running states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showTermSelectorModal, setShowTermSelectorModal] = useState<boolean>(false);

  // Initialize shopping list from loaded meal plan
  useEffect(() => {
    if (mealPlan && mealPlan.shoppingList) {
      setShoppingList(mealPlan.shoppingList.map(item => ({ ...item, checked: false })));
      // Set active meal to the first available meal
      if (mealPlan.meals.length > 0) {
        // Prefer 午餐, then first meal
        const hasLunch = mealPlan.meals.find(m => m.type === "午餐");
        setActiveMealType(hasLunch ? "午餐" : mealPlan.meals[0].type);
      }
      setCompletedSteps({});
    }
  }, [mealPlan]);

  // Handle step-by-step loading animation
  useEffect(() => {
    let interval: any = null;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => {
          if (prev < MOCK_LOADING_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Generate meal plan using the server API
  const handleGenerateRecipe = async () => {
    setLoading(true);
    setLoadingStepIdx(0);
    setErrorMsg("");

    try {
      const response = await fetch("/api/meals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: peopleCount,
          term: selectedTerm,
          dietType,
          budgetLimit,
          customWish
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "伺服器回傳錯誤");
      }

      const data = await response.json();
      setMealPlan(data);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "連線至廚藝大師伺服器超時，請檢查網路或稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  // Toggle checkout status of grocery items
  const toggleShoppingChecked = (index: number) => {
    const updated = [...shoppingList];
    updated[index].checked = !updated[index].checked;
    setShoppingList(updated);
  };

  // Toggle recipe steps checked state
  const toggleStepCompleted = (mealType: string, stepIdx: number) => {
    const key = `${mealType}-${stepIdx}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Add a new custom shopping item
  const handleAddGroceryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;

    const newItem: ShoppingItem = {
      name: newGroceryName.trim(),
      amount: "1 份",
      category: newGroceryCategory,
      estimatedPrice: parseInt(newGroceryPrice) || 30,
      checked: false
    };

    setShoppingList([newItem, ...shoppingList]);
    setNewGroceryName("");
    setNewGroceryPrice("50");
  };

  // Quick select a solar term helper
  const selectTermDirectly = (termName: string) => {
    setSelectedTerm(termName);
    setShowTermSelectorModal(false);
  };

  // Current selected Solar Term detail description
  const currentTermObj = SOLAR_TERMS.find(t => t.name === selectedTerm) || SOLAR_TERMS[8];

  // Calculated totals
  const totalGroceryBudget = shoppingList.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const purchasedGroceryBudget = shoppingList
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.estimatedPrice, 0);

  const activeMealDetail = mealPlan.meals.find(m => m.type === activeMealType) || mealPlan.meals[0];

  // Calculate estimated total meals cost
  const totalCostEstimate = mealPlan.meals.reduce((sum, meal) => sum + (meal.estimatedCostPerPerson * peopleCount), 0);

  // Copy shopping list to clipboard
  const handleCopyShoppingList = () => {
    const headerStr = `🛒 【${selectedTerm}】${peopleCount}人份 三餐食材採買清單\n---------------------------\n`;
    const bodyStr = shoppingList
      .map(item => `[${item.checked ? "v" : " "}] ${item.name} (${item.amount}) - 預估新台幣 $${item.estimatedPrice} 元`)
      .join("\n");
    const footerStr = `\n---------------------------\n💰 總採買筆數: ${shoppingList.length} 項 | 預估總花費: $${totalGroceryBudget} TWD\n💡 家中下廚，美味又省錢！`;
    
    navigator.clipboard.writeText(headerStr + bodyStr + footerStr).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Print friendly print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="family-feast-root" className="w-[1024px] h-[768px] bg-[#F7F8F6] text-[#2D3436] font-sans flex flex-col overflow-hidden relative border border-[#E1E5E0]">
      
      {/* HEADER BAR */}
      <header id="main-header" className="bg-white border-b border-[#E1E5E0] px-5 py-3.5 flex justify-between items-center shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">當季節氣家庭食譜推薦</span>
            </div>
            <h1 className="text-xl font-extrabold text-[#2D3436] flex items-center gap-2 mt-0.5">
              FamilyFeast <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">節氣智慧生活</span>
            </h1>
          </div>

          <div className="h-8 w-px bg-[#E1E5E0]"></div>

          {/* Configuration Summary Badge */}
          <div className="flex items-center gap-2.5">
            {/* Solar Term Trigger */}
            <button 
              id="term-trigger-btn"
              onClick={() => setShowTermSelectorModal(true)}
              className="flex flex-col items-start bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 px-3 py-1 rounded transition text-left cursor-pointer"
            >
              <span className="text-[9px] text-[#4A7C59] font-medium leading-none">二十四節氣</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                {selectedTerm} <span className="text-[10px] text-slate-400 font-normal">({currentTermObj.dates})</span>
              </span>
            </button>

            {/* People Selector */}
            <div className="flex flex-col items-start bg-slate-100/60 border border-slate-200 px-3 py-1 rounded">
              <span className="text-[9px] text-slate-500 font-medium leading-none">開伙人數</span>
              <div className="flex items-center gap-1 mt-0.5">
                <button 
                  id="people-decrease-btn"
                  onClick={() => setPeopleCount(prev => Math.max(2, prev - 1))}
                  className="w-4 h-4 bg-white hover:bg-slate-200 text-[10px] font-bold rounded flex items-center justify-center border border-slate-300 transition"
                  disabled={peopleCount <= 2}
                >
                  -
                </button>
                <span className="text-xs font-bold text-center w-5 font-mono">{peopleCount}人</span>
                <button 
                  id="people-increase-btn"
                  onClick={() => setPeopleCount(prev => Math.min(8, prev + 1))}
                  className="w-4 h-4 bg-white hover:bg-slate-200 text-[10px] font-bold rounded flex items-center justify-center border border-slate-300 transition"
                  disabled={peopleCount >= 8}
                >
                  +
                </button>
              </div>
            </div>

            {/* Diet type & Custom Options */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded">
              <select 
                id="diet-type-select"
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="text-xs bg-transparent font-medium py-1 px-2 border-0 outline-none text-slate-700 cursor-pointer"
              >
                <option value="均衡飲食">均衡飲食</option>
                <option value="低卡高纖">低卡減脂</option>
                <option value="高蛋白增肌">高蛋白增肌</option>
                <option value="養生清淡">養生清淡</option>
                <option value="全素食/蔬食">全素食</option>
              </select>
              <span className="w-px h-4 bg-slate-200"></span>
              <select 
                id="budget-select"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="text-xs bg-transparent font-medium py-1 px-2 border-0 outline-none text-slate-700 cursor-pointer"
              >
                <option value="極致省錢廉價">極致省錢</option>
                <option value="經濟實惠">經濟實惠</option>
                <option value="營養豐盛奢華">營養豐盛</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input Wish & Fetch actions */}
        <div className="flex items-center gap-3">
          <input 
            id="custom-wish-input"
            type="text"
            placeholder="限定食材或偏好... 如：雞肉、不要辣"
            value={customWish}
            onChange={(e) => setCustomWish(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 w-40 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4A7C59] transition"
          />
          <button 
            id="generate-recipe-btn"
            onClick={handleGenerateRecipe}
            className="px-4 py-1.5 bg-[#4A7C59] hover:bg-[#3b664a] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>智能生成食譜</span>
          </button>
        </div>
      </header>

      {/* ERROR MESSAGE BAR */}
      {errorMsg && (
        <div id="error-alert" className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center justify-between text-xs text-red-700 shrink-0">
          <span className="font-medium flex items-center gap-1.5">
            <BadgeAlert className="w-4 h-4 text-red-500" />
            {errorMsg}
          </span>
          <button 
            id="close-error-btn"
            onClick={() => setErrorMsg("")} 
            className="text-red-400 hover:text-red-700 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main id="main-content" className="flex-1 overflow-hidden grid grid-cols-12 gap-3.5 p-3.5 relative">

        {/* LOADING SHIELD MODAL */}
        {loading && (
          <div id="loading-overlay" className="absolute inset-0 bg-white/95 z-40 flex flex-col items-center justify-center p-8 transition-all">
            <div className="w-72 bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(10, ((loadingStepIdx + 1) / MOCK_LOADING_STEPS.length) * 100))}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-3 mb-2 animate-bounce">
              <Utensils className="w-8 h-8 text-emerald-600" />
              <Leaf className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">正在磨練美味食譜...</h3>
            <p className="text-xs text-emerald-700 mt-2 font-mono h-5 font-medium transition-all animate-pulse">
              {MOCK_LOADING_STEPS[loadingStepIdx]}
            </p>
            <div className="mt-8 text-[11px] text-slate-400 max-w-sm text-center leading-relaxed">
              Gemini AI 正在依據節氣【{selectedTerm}】、全家共 {peopleCount} 人的卡路里平衡、及台灣當季市場的即時物價，為您安排預算共享比率最高的菜色...
            </div>
          </div>
        )}

        {/* LEFT COLUMN: DAILY MENU (3 Meals & Solar intro) */}
        <section id="left-column" className="col-span-3 flex flex-col gap-3.5 h-full overflow-hidden">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center justify-between">
            <span>今日家庭三餐規劃</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-mono">
              全日精算
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
            {/* Meal Cards */}
            {mealPlan.meals.map((meal) => {
              const isActive = activeMealType === meal.type;
              const hasCompletedAllSteps = meal.steps.length > 0 && meal.steps.every((_, idx) => completedSteps[`${meal.type}-${idx}`]);

              // Custom bullet borders depending on breakfast/lunch/dinner
              const mealBorderColor = 
                meal.type === "早餐" ? "border-l-[#F2994A]" : 
                meal.type === "午餐" ? "border-l-emerald-600" : "border-l-indigo-500";

              return (
                <div 
                  key={meal.type}
                  id={`meal-card-${meal.type}`}
                  onClick={() => setActiveMealType(meal.type)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border text-left flex flex-col relative overflow-hidden ${
                    isActive 
                      ? "bg-emerald-800 text-white border-emerald-950 card-shadow ring-emerald-500/20" 
                      : "bg-white text-slate-800 hover:bg-slate-100/60 border-slate-200 border-l-4 " + mealBorderColor + " card-shadow-hover"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase font-mono ${
                      isActive ? "bg-white/20 text-emerald-100" : "bg-slate-100 text-slate-600"
                    }`}>
                      {meal.type}
                    </span>
                    <span className={`text-[10px] items-center gap-1 flex ${isActive ? "text-emerald-200" : "text-green-600"}`}>
                      <Clock className="w-3 h-3" />
                      {meal.prepTime + meal.cookTime} 分鐘
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[14px] leading-snug tracking-tight">
                    {meal.dishName}
                  </h3>

                  <p className={`text-[11px] leading-relaxed mt-1.5 line-clamp-2 ${
                    isActive ? "text-emerald-100/90" : "text-slate-500"
                  }`}>
                    {meal.description}
                  </p>

                  <div className="mt-3.5 pt-2 border-t flex items-center justify-between gap-1 border-dotted shrink-0 overflow-hidden text-[10px]/none">
                    <span className={`font-mono font-semibold ${isActive ? "text-emerald-200" : "text-[#4A7C59]"}`}>
                      均均 $ {meal.estimatedCostPerPerson} TWD
                    </span>
                    
                    {hasCompletedAllSteps ? (
                      <span className="flex items-center gap-1 text-[9px] bg-green-500 text-white font-bold py-0.5 px-1.5 rounded-full">
                        <Check className="w-2.5 h-2.5" /> 料理完成
                      </span>
                    ) : (
                      <span className={`font-mono ${isActive ? "text-emerald-300" : "text-slate-400"}`}>
                        當季食材 x{meal.keySeasonalIngredients.length}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Solar Term Card */}
          <div id="solar-term-info-card" className="bg-[#E8F5E9] p-3.5 rounded-xl border border-emerald-200/50 flex flex-col shrink-0">
            <h4 className="text-[11px] font-extrabold text-[#2E7D32] mb-1 flex items-center gap-1">
              <span>📌 【{mealPlan.solarTermInfo.name}】節氣養生要點</span>
            </h4>
            <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
              {mealPlan.solarTermInfo.healthPrinciple}
            </p>
          </div>
        </section>

        {/* CENTER COLUMN: RECIPE DETAILS & DENSE WORKFLOW */}
        <section id="center-column" className="col-span-6 bg-white rounded-2xl border border-[#E1E5E0] flex flex-col overflow-hidden shadow-xs h-full">
          
          {/* Active Recipe Header */}
          <div id="recipe-detail-header" className="p-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#4A7C59] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                     當前查看 {activeMealType} 食譜
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    適合：{peopleCount} 人份
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-800 mt-1 leading-tight">
                  {activeMealDetail.dishName}
                </h2>
                
                {/* Visual Stats Row */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">備料+烹調時間</span>
                    <span className="text-xs font-bold text-slate-700">
                      {activeMealDetail.prepTime} + {activeMealDetail.cookTime} 分鐘
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 align-middle self-center"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">每人約需開支</span>
                    <span className="text-xs font-bold text-slate-700">
                      NT$ {activeMealDetail.estimatedCostPerPerson} TWD
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 align-middle self-center"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">全天熱量分配</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      約 {mealPlan.nutritionSummary.totalCalories} 卡 <span className="text-[9px] font-normal text-slate-400">/ 每日</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical Box */}
              <div id="recipe-image-placeholder" className="w-24 h-16 bg-slate-100 rounded-lg border border-slate-200/60 flex flex-col items-center justify-center shrink-0 relative overflow-hidden p-1">
                <Utensils className="w-5 h-5 text-slate-400" />
                <span className="text-[8px] text-slate-400 font-bold mt-1 text-center leading-none">
                  主廚家常食譜
                </span>
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            {/* Match Seasonal Foods */}
            {activeMealDetail.keySeasonalIngredients && activeMealDetail.keySeasonalIngredients.length > 0 && (
              <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Leaf className="w-3 h-3 text-amber-500" /> 當季明星主料:
                </span>
                {activeMealDetail.keySeasonalIngredients.map((item, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Core Content Grid */}
          <div id="recipe-core-grid" className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-hidden">
            
            {/* Left Side: Dynamic Ingredients Checklist */}
            <div className="flex flex-col h-full overflow-hidden border-r border-slate-100 pr-3.5 text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 shrink-0">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  所需食材總清單 ({peopleCount} 人份)
                </h4>
                <span className="text-[9px] text-slate-400 font-medium">包含家中基底調味</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1.5">
                {activeMealDetail.ingredients && activeMealDetail.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-1 rounded hover:bg-slate-50 transition">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        ing.category === "蔬菜" ? "bg-green-500" :
                        ing.category === "肉類/海鮮" ? "bg-red-400" :
                        ing.category === "蛋奶/豆腐" ? "bg-yellow-400" :
                        ing.category === "五穀根莖" ? "bg-amber-700" : "bg-slate-400"
                      }`} title={ing.category}></span>
                      <span className="text-slate-700 font-medium">{ing.name}</span>
                    </span>
                    <span className="font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {ing.amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Value added Tip Box */}
              <div className="bg-[#FFFCEB] p-2.5 rounded-lg border border-[#FDE68A] mt-2 shrink-0 text-left">
                <p className="text-[10px] font-extrabold text-[#F57F17] flex items-center gap-1">
                  <span>💡 當季採買與保存指引</span>
                </p>
                <p className="text-[9px] text-amber-800 leading-normal mt-0.5">
                  全家 {peopleCount} 人煮這餐預計能省下 {Math.round(peopleCount * 120)} 元外食開銷！食材可與其他兩餐共用，減少廚餘。
                </p>
              </div>
            </div>

            {/* Right Side: Step-by-Step Interactive Guide */}
            <div className="flex flex-col h-full overflow-hidden text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 shrink-0">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  烹飪手作步驟明細
                </h4>
                <span className="text-[9px] text-[#4A7C59] font-medium">點擊可標記進度</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5">
                {activeMealDetail.steps && activeMealDetail.steps.map((step, idx) => {
                  const stepKey = `${activeMealType}-${idx}`;
                  const isDone = !!completedSteps[stepKey];

                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleStepCompleted(activeMealType, idx)}
                      className={`flex gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                        isDone ? "bg-emerald-50/75 opacity-60" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5 transition font-extrabold font-mono ${
                        isDone ? "bg-emerald-600 text-white" : "bg-[#4A7C59] text-white"
                      }`}>
                        {idx + 1}
                      </span>
                      <p className={`text-xs leading-relaxed transition ${
                        isDone ? "line-through text-slate-400 decoration-emerald-700/50" : "text-slate-700 font-medium"
                      }`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Chef Secrets Tips (Footer pane inside Center) */}
          <div id="recipe-chef-tips-bar" className="bg-[#EDF2EE] px-4 py-2.5 border-t border-slate-100 shrink-0 text-left flex items-start gap-2">
            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono mt-0.5">
              主廚提示
            </span>
            <p className="text-[10px] text-emerald-800 leading-normal font-medium">
              {activeMealDetail.chefTips}
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: GROCERY & SEASONAL HIGH DENSITY PICKS */}
        <section id="right-column" className="col-span-3 flex flex-col gap-3.5 h-full overflow-hidden">
          
          {/* Shopping Checklist Card */}
          <div id="grocery-card" className="bg-white p-3.5 rounded-2xl border border-[#E1E5E0] shadow-xs flex flex-col h-[55%] overflow-hidden text-left">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex flex-col">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  超市合併採買清單
                </h4>
                <span className="text-[9px] text-[#4A7C59] font-semibold mt-0.5">
                  全家 {peopleCount} 人份當令採買
                </span>
              </div>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-extrabold">
                未購 {shoppingList.filter(item => !item.checked).length} 項
              </span>
            </div>

            {/* Shopping List Scroll area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {shoppingList.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleShoppingChecked(idx)}
                  className={`flex items-center gap-2.5 p-1.5 rounded text-xs select-none cursor-pointer transition ${
                    item.checked ? "bg-slate-50 opacity-55" : "hover:bg-slate-50"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={!!item.checked}
                    onChange={() => {}} // handled by div click
                    className="rounded text-[#4A7C59] focus:ring-[#4A7C59] cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-slate-800 text-[11px] truncate ${item.checked ? "line-through text-slate-400" : ""}`}>
                      {item.name}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      {item.amount} • <span className="bg-slate-100 px-1 py-0.2 rounded text-slate-500 font-mono text-[8px]">{item.category}</span>
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">
                    ${item.estimatedPrice} TWD
                  </span>
                </div>
              ))}
            </div>

            {/* Add Custom grocery item form */}
            <form onSubmit={handleAddGroceryItem} className="border-t border-slate-100 pt-2.5 mt-2.5 shrink-0">
              <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">手動補充額外食材</p>
              <div className="flex gap-1.5 items-center">
                <input 
                  type="text" 
                  placeholder="品名, 如: 豆腐" 
                  value={newGroceryName}
                  onChange={(e) => setNewGroceryName(e.target.value)}
                  className="text-[10px] border border-slate-300 rounded px-1.5 py-1 flex-1 focus:outline-none min-w-0 font-medium"
                />
                <input 
                  type="number" 
                  placeholder="元" 
                  value={newGroceryPrice}
                  onChange={(e) => setNewGroceryPrice(e.target.value)}
                  className="text-[10px] border border-slate-300 rounded px-1 py-1 w-10 text-center font-mono focus:outline-none"
                />
                <button 
                  type="submit"
                  className="p-1 bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded transition text-[10px]"
                  title="加入採買項"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Seasonal Highlight Card (Remaining ~45%) */}
          <div id="seasonal-highlight-card" className="bg-white p-3.5 rounded-xl border border-[#E1E5E0] shadow-xs flex-1 flex flex-col overflow-hidden text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 shrink-0">
              節氣鮮推薦 / Seasonal Best
            </h4>
            
            {/* Tiny Bento Grids for 4 Items */}
            <div className="grid grid-cols-2 gap-1.5 overflow-y-auto pr-1">
              {currentTermObj.desc ? (
                // Selected term's ingredients list from mealPlan solar info
                mealPlan.solarTermInfo.recommendedIngredients.slice(0, 4).map((ingredient, idx) => (
                  <div key={idx} className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-slate-800 text-center">
                      {ingredient}
                    </span>
                    <span className="text-[8.5px] font-bold text-[#4A7C59] bg-emerald-100/50 px-1.5 py-0.2 rounded mt-1">
                      當季最爽口
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-2 text-[10px] text-slate-400">
                  暫無節氣食材資料
                </div>
              )}
            </div>

            <div className="mt-2 text-[9px] text-[#2E7D32] bg-emerald-50 px-2 py-1.5 border border-emerald-100/50 rounded leading-tight font-medium shrink-0 flex items-start gap-1">
              <TrendingDown className="w-3 h-3 text-[#2E7D32] shrink-0 mt-0.5" />
              <span>
                <b>當週採買技巧</b>：當季的食材產量最大、價格約比非當季便宜 40%，且營養成分最為飽足：少食冰冷、宜多食瓜。
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER BAR STATS & QUICK ACTIONS */}
      <footer id="main-footer" className="bg-white border-t border-[#E1E5E0] px-5 py-3 flex justify-between items-center shrink-0 z-10 text-left">
        <div className="flex gap-5">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${
              purchasedGroceryBudget >= totalGroceryBudget ? "bg-emerald-600 animate-pulse" : "bg-amber-500"
            }`}></div>
            <span className="text-[11px] font-bold text-slate-700">
              採買支出進度: $ {purchasedGroceryBudget} / {totalGroceryBudget} TWD
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-200 align-middle self-center"></div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">
              全家共煮全日約 NT$ <span className="text-slate-800 font-black">{totalCostEstimate}</span> TWD
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Share / Copy To Clipboard */}
          <button 
            id="copy-shopping-btn"
            onClick={handleCopyShoppingList}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-100/70 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copySuccess ? "已複製！" : "複製採買清單"}</span>
          </button>

          {/* Print checklist */}
          <button 
            id="print-recipe-btn"
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100/70 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印食譜紙張</span>
          </button>

          {/* Recalculate */}
          <button 
            id="re-generate-btn"
            onClick={handleGenerateRecipe}
            className="px-4 py-1.5 text-xs bg-[#4A7C59] text-white font-extrabold rounded-lg shadow-sm hover:bg-[#3b664a] transition inline-flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>生成新食譜</span>
          </button>
        </div>
      </footer>

      {/* 24 SOLAR TERMS SELECTION DIALOG (MODAL OVERLAY) */}
      {showTermSelectorModal && (
        <div id="solar-term-modal" className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 max-h-[90%] flex flex-col shadow-2xl relative text-left">
            <button 
              id="close-modal-btn"
              onClick={() => setShowTermSelectorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
              <Leaf className="w-4.5 h-4.5 text-[#4A7C59]" />
              請選擇二十四節氣，我們將自動配對時令食材：
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              傳統農民曆中每 15 天變換一次節氣，選取最當前的節氣能做出最開胃、對身體脾胃最好的家庭膳食。
            </p>

            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 gap-2 mb-4">
              {SOLAR_TERMS.map((term) => {
                const isSelected = term.name === selectedTerm;
                
                // Color badges depending on season
                const seasonColor = 
                  term.season === "春" ? "bg-green-50 text-green-700 border-green-200" :
                  term.season === "夏" ? "bg-red-50 text-red-700 border-red-200" :
                  term.season === "秋" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                  "bg-blue-50 text-blue-700 border-blue-200";

                return (
                  <button
                    key={term.name}
                    id={`term-select-btn-${term.name}`}
                    onClick={() => selectTermDirectly(term.name)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      isSelected 
                        ? "bg-[#4A7C59] text-white border-[#4A7C59] ring-2 ring-emerald-300"
                        : "bg-white text-slate-800 hover:bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-extrabold text-sm">{term.name}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${
                        isSelected ? "bg-white/25 text-white border-white/40" : seasonColor
                      }`}>
                        {term.season}
                      </span>
                    </div>
                    <span className={`text-[9px] mt-1.5 ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                      約 {term.dates}
                    </span>
                    <p className={`text-[9.5px]/snug mt-2 line-clamp-2 ${isSelected ? "text-emerald-50" : "text-slate-500"}`}>
                      {term.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end p-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              點擊任意一個節氣卡片將隨即生效，之後回到主面板按下「生成新食譜」即可更新。
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
