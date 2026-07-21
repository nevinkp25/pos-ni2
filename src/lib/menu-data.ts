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
      { 
        name: 'Quattro Formaggi', 
        description: 'Mozzarella, gorgonzola, parmesan, fontina',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 95,
        nutritionalInfo: { kcal: 1100, protein: '45g', carbs: '88g', fat: '55g' },
        variations: [
          { name: 'White Base', price: 0 },
          { name: 'Red Base', price: 0 }
        ],
        addons: [
          { name: 'Walnuts', price: 10 },
          { name: 'Truffle Oil', price: 15 }
        ]
      },
      { 
        name: 'Capricciosa', 
        description: 'Ham, mushrooms, artichokes, olives',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 90,
        nutritionalInfo: { kcal: 920, protein: '35g', carbs: '94g', fat: '42g' },
        variations: [
          { name: 'Classic', price: 0 },
          { name: 'Well Done', price: 0 }
        ],
        addons: [
          { name: 'Anchovies', price: 12 },
          { name: 'Fried Egg', price: 8 }
        ]
      },
      { 
        name: 'Prosciutto e Funghi', 
        description: 'Cooked ham and fresh mushrooms',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 88,
        nutritionalInfo: { kcal: 890, protein: '34g', carbs: '90g', fat: '38g' },
        variations: [
          { name: 'Thin Crust', price: 0 },
          { name: 'Stuffed Crust', price: 15 }
        ],
        addons: [
          { name: 'Extra Ham', price: 12 },
          { name: 'Rocket Leaves', price: 6 }
        ]
      },
      { 
        name: 'Marinara', 
        description: 'Tomato, garlic, oregano, extra virgin olive oil',
        allergens: ['Gluten'], 
        basePrice: 60,
        nutritionalInfo: { kcal: 650, protein: '18g', carbs: '110g', fat: '15g' },
        variations: [
          { name: 'Traditional', price: 0 }
        ],
        addons: [
          { name: 'Anchovies', price: 12 },
          { name: 'Capers', price: 5 },
          { name: 'Chili Flakes', price: 2 }
        ]
      },
      { 
        name: 'Vegetariana', 
        description: 'Peppers, zucchini, eggplant, spinach',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 85,
        nutritionalInfo: { kcal: 780, protein: '28g', carbs: '95g', fat: '30g' },
        variations: [
          { name: 'Classic Mozzarella', price: 0 },
          { name: 'Vegan Cheese', price: 10 }
        ],
        addons: [
          { name: 'Sun-dried Tomatoes', price: 8 },
          { name: 'Corn', price: 5 }
        ]
      },
      { 
        name: 'Napoletana', 
        description: 'Anchovies, capers, olives, oregano',
        allergens: ['Fish', 'Dairy', 'Gluten'], 
        basePrice: 82,
        nutritionalInfo: { kcal: 840, protein: '30g', carbs: '92g', fat: '35g' },
        variations: [
          { name: 'Standard', price: 0 }
        ],
        addons: [
          { name: 'Extra Anchovies', price: 15 },
          { name: 'Garlic Oil', price: 3 }
        ]
      },
      { 
        name: 'Hawaii', 
        description: 'Ham, pineapple, mozzarella',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 85,
        nutritionalInfo: { kcal: 880, protein: '32g', carbs: '105g', fat: '34g' },
        variations: [
          { name: 'Classic', price: 0 },
          { name: 'Spicy Hawaii', price: 5 }
        ],
        addons: [
          { name: 'Bacon Bit', price: 10 },
          { name: 'Extra Pineapple', price: 5 }
        ]
      },
      { 
        name: 'BBQ Chicken', 
        description: 'Chicken breast, BBQ sauce, red onion',
        allergens: ['Dairy', 'Gluten'], 
        basePrice: 92,
        nutritionalInfo: { kcal: 1050, protein: '48g', carbs: '98g', fat: '40g' },
        variations: [
          { name: 'Smoky BBQ', price: 0 },
          { name: 'Spicy BBQ', price: 0 }
        ],
        addons: [
          { name: 'Sweetcorn', price: 5 },
          { name: 'Coriander', price: 2 }
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
