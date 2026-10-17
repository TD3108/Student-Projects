import { HouseFavorite } from '../types';
import paneerBhurjiImg from '../assets/images/indian_paneer_bhurji_1791613925475.jpg';
import kandaPohaImg from '../assets/images/indian_kanda_poha_1791613948265.jpg';
import jeeraAlooImg from '../assets/images/indian_jeera_aloo_1791613967116.jpg';

export const INDIAN_15MIN_FAVORITES: HouseFavorite[] = [
  {
    id: 'paneer-bhurji',
    dishName: "Spiced Cottage Cheese Scramble (Paneer Bhurji)",
    subtitle: "High-protein quick dinner · Ready in 10 minutes",
    category: "Quick Dinner",
    prepTime: "10 mins",
    defaultServings: 2,
    imageUrl: paneerBhurjiImg,
    chefNotes: "Freshly crumbled cottage cheese sautéed with finely chopped onions, ripe tomatoes, green chilies, and clarified butter.",
    ingredients: [
      { id: '1', name: "Fresh Crumbled Cottage Cheese (Paneer)", amount: "250", unit: "g" },
      { id: '2', name: "Diced Red Onions & Tomatoes", amount: "180", unit: "g" },
      { id: '3', name: "Clarified Butter (Ghee) or Cooking Oil", amount: "2", unit: "tbsp" }
    ]
  },
  {
    id: 'kanda-poha',
    dishName: "Spiced Flattened Rice with Peanuts (Poha)",
    subtitle: "Classic savory breakfast · Ready in 12 minutes",
    category: "Breakfast & Brunch",
    prepTime: "12 mins",
    defaultServings: 3,
    imageUrl: kandaPohaImg,
    chefNotes: "Light flattened rice tempered with crackling mustard seeds, fresh curry leaves, roasted peanuts, and fresh lemon juice.",
    ingredients: [
      { id: '1', name: "Thick Flattened Rice (Poha, Rinsed)", amount: "200", unit: "g" },
      { id: '2', name: "Crunchy Roasted Peanuts", amount: "50", unit: "g" },
      { id: '3', name: "Diced Onions & Green Chilies", amount: "120", unit: "g" }
    ]
  },
  {
    id: 'jeera-aloo',
    dishName: "Crispy Pan-Seared Cumin Potatoes (Jeera Aloo)",
    subtitle: "Golden spiced potato skillet · Ready in 10 minutes",
    category: "Everyday Side",
    prepTime: "10 mins",
    defaultServings: 4,
    imageUrl: jeeraAlooImg,
    chefNotes: "Tender cubed potatoes crisped in a skillet with aromatic toasted cumin seeds, turmeric, fresh ginger, and cilantro.",
    ingredients: [
      { id: '1', name: "Boiled & Cubed Potatoes", amount: "400", unit: "g" },
      { id: '2', name: "Whole Toasted Cumin Seeds", amount: "1.5", unit: "tbsp" },
      { id: '3', name: "Cooking Oil or Clarified Butter (Ghee)", amount: "2.5", unit: "tbsp" }
    ]
  }
];

export const QUICK_RECIPE_PRESETS = [
  {
    dishName: "Tempered Yogurt Rice with Mustard & Curry Leaves",
    prepTime: "8 mins",
    servings: 2,
    ingredients: [
      { id: '1', name: "Soft Cooked White Rice (Cooled)", amount: "300", unit: "g" },
      { id: '2', name: "Fresh Plain Whole Milk Yogurt", amount: "250", unit: "g" },
      { id: '3', name: "Tempered Mustard Seeds & Curry Leaf Oil", amount: "1.5", unit: "tbsp" }
    ]
  },
  {
    dishName: "Quick Spiced Indian Scrambled Eggs",
    prepTime: "8 mins",
    servings: 2,
    ingredients: [
      { id: '1', name: "Fresh Eggs (Lightly Whisked)", amount: "4", unit: "pieces" },
      { id: '2', name: "Finely Minced Onions & Green Chilies", amount: "100", unit: "g" },
      { id: '3', name: "Salted Butter or Clarified Butter", amount: "1.5", unit: "tbsp" }
    ]
  },
  {
    dishName: "Crispy Savory Chickpea Flour Crepes",
    prepTime: "10 mins",
    servings: 2,
    ingredients: [
      { id: '1', name: "Chickpea Flour (Gram Flour)", amount: "150", unit: "g" },
      { id: '2', name: "Finely Chopped Mixed Vegetables", amount: "100", unit: "g" },
      { id: '3', name: "Mild Warm Spices & Aromatic Herbs", amount: "1", unit: "tsp" }
    ]
  }
];
