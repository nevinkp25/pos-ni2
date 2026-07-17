import { MenuCategory } from './types';

export const menuData: MenuCategory[] = [
  { 
    title: 'STARTERS', 
    items: [
      { 
        name: 'Burrata con Pomodorini', 
        description: 'Creamy burrata, cherry tomatoes, basil pesto',
        allergens: ['Dairy'], 
        basePrice: 65,
        nutritionalInfo: { kcal: 450, protein: '15g', carbs: '10g', fat: '35g' },
        variations: [
          { name: 'Standard', price: 0 },
          { name: 'Extra Pesto', price: 5 },
          { name: 'With Focaccia', price: 10 }
        ],
        addons: [
          { name: 'Extra Burrata', price: 25 },
          { name: 'Extra Pesto', price: 5 },
          { name: 'Focaccia Bread', price: 8 }
        ]
      },
      { 
        name: 'Calamari Fritti', 
        description: 'Crispy fried squid with spicy marinara',
        allergens: ['Shellfish', 'Gluten'], 
        basePrice: 55,
        nutritionalInfo: { kcal: 520, protein: '22g', carbs: '35g', fat: '28g' },
        variations: [
          { name: 'Spicy Marinara', price: 0 },
          { name: 'Garlic Aioli', price: 0 }
        ],
        addons: [
          { name: 'Extra Sauce', price: 5 },
          { name: 'Side Salad', price: 15 }
        ]
      },
    ] 
  },
  { 
    title: 'PIZZA', 
    items: [
      { 
        name: 'Margherita', 
        description: 'Tomato sauce, fresh mozzarella, basil',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 75,
        nutritionalInfo: { kcal: 850, protein: '32g', carbs: '95g', fat: '34g' },
        variations: [
          { name: 'Thin Crust', price: 0 },
          { name: 'Thick Crust', price: 5 },
          { name: 'Buffalo Mozzarella', price: 15 }
        ],
        addons: [
          { name: 'Olives', price: 5 },
          { name: 'Mushrooms', price: 8 },
          { name: 'Hot Salami', price: 12 }
        ]
      },
      { 
        name: 'Diavola', 
        description: 'Tomato sauce, mozzarella, spicy salami',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 85,
        nutritionalInfo: { kcal: 980, protein: '38g', carbs: '92g', fat: '45g' },
        variations: [
          { name: 'Standard', price: 0 },
          { name: 'Extra Spicy', price: 2 }
        ],
        addons: [
          { name: 'Jalapenos', price: 5 },
          { name: 'Hot Honey', price: 8 }
        ]
      },
    ] 
  },
  { 
    title: 'MAINS', 
    items: [
      { 
        name: 'Osso Buco alla Milanese', 
        description: 'Veal shank · saffron risotto',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 145,
        nutritionalInfo: { kcal: 892, protein: '32g', carbs: '98g', fat: '38g' },
        variations: [
          { name: 'Classic Saffron', price: 0 },
          { name: 'Extra Risotto', price: 25 }
        ],
        addons: [
          { name: 'Bone Marrow', price: 30 },
          { name: 'Asparagus', price: 15 }
        ]
      },
      { 
        name: 'Spaghetti alle Vongole', 
        description: 'Fresh clams, garlic, white wine, parsley',
        allergens: ['Shellfish', 'Gluten'], 
        basePrice: 98,
        nutritionalInfo: { kcal: 650, protein: '28g', carbs: '85g', fat: '18g' },
        variations: [
          { name: 'Classic', price: 0 },
          { name: 'Spicy', price: 0 }
        ],
        addons: [
          { name: 'Extra Clams', price: 35 },
          { name: 'Bottarga', price: 20 }
        ]
      },
      { 
        name: 'Branzino al Forno', 
        description: 'Baked whole sea bass, herbs, lemon',
        allergens: ['Fish'], 
        basePrice: 130,
        nutritionalInfo: { kcal: 420, protein: '45g', carbs: '5g', fat: '15g' },
        variations: [
          { name: 'Grilled', price: 0 },
          { name: 'Al Forno', price: 0 }
        ],
        addons: [
          { name: 'Roasted Potatoes', price: 15 },
          { name: 'Sautéed Spinach', price: 15 }
        ]
      },
    ] 
  },
  { 
    title: 'SIDES & SAUCES', 
    items: [
      { 
        name: 'Patatine Fritte', 
        description: 'Classic crispy fries',
        allergens: [], 
        basePrice: 25,
        nutritionalInfo: { kcal: 400, protein: '4g', carbs: '48g', fat: '20g' },
        variations: [
          { name: 'Classic', price: 0 },
          { name: 'Truffle Oil & Parmesan', price: 10 }
        ],
        addons: [
          { name: 'Cheese Dip', price: 5 },
          { name: 'Garlic Mayo', price: 3 }
        ]
      },
    ] 
  },
  { 
    title: 'DESSERTS', 
    items: [
      { 
        name: 'Tiramisu Classico', 
        description: 'Coffee-soaked ladyfingers with mascarpone',
        allergens: ['Dairy', 'Gluten', 'Eggs'], 
        basePrice: 48,
        nutritionalInfo: { kcal: 580, protein: '8g', carbs: '55g', fat: '32g' },
        variations: [
          { name: 'Standard', price: 0 },
          { name: 'Decaf Version', price: 0 }
        ],
        addons: [
          { name: 'Chocolate Shavings', price: 5 },
          { name: 'Espresso Shot', price: 8 }
        ]
      },
    ] 
  },
];
