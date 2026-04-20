export const STORES = {
  costco:      { name: 'Costco',       color: '#E31837', bg: 'rgba(227,24,55,0.12)',   note: 'Membership required. Bulk sizes.' },
  tesco:       { name: 'Tesco',        color: '#005FA6', bg: 'rgba(0,95,166,0.12)',    note: 'Prices may vary by Tesco format.' },
  lidl:        { name: 'Lidl',         color: '#0050AA', bg: 'rgba(0,80,170,0.12)',    note: 'Limited stock availability.' },
  aldi:        { name: 'Aldi',         color: '#1E3E73', bg: 'rgba(30,62,115,0.12)',   note: 'Limited stock availability.' },
  iceland:     { name: 'Iceland',      color: '#DA291C', bg: 'rgba(218,41,28,0.12)',   note: 'Frozen/chilled specialists.' },
  sainsburys:  { name: "Sainsbury's",  color: '#F06C00', bg: 'rgba(240,108,0,0.12)',   note: 'Prices may vary by store.' },
  asda:        { name: 'Asda',         color: '#78BE20', bg: 'rgba(120,190,32,0.12)',  note: 'Rollback prices may apply.' },
}

export const CATEGORIES = [
  'All',
  'Dairy & Eggs',
  'Meat & Fish',
  'Fruit & Veg',
  'Bakery',
  'Pantry',
  'Frozen',
  'Drinks',
  'Household',
  'Snacks',
]

// prices are comparable unit prices (£ per kg, per litre, per 100 units etc.)
// packPrice = shelf price for listed pack size
export const GROCERY_ITEMS = [
  // ─── DAIRY & EGGS ───
  {
    id: 'whole-milk-4pint',
    name: 'Whole Milk',
    category: 'Dairy & Eggs',
    compareUnit: '£/litre',
    prices: {
      costco:     { packPrice: 9.99,  packSize: '6 × 2L', unitPrice: 0.83 },
      tesco:      { packPrice: 1.65,  packSize: '2.27L (4pt)', unitPrice: 0.73 },
      lidl:       { packPrice: 1.55,  packSize: '2.27L (4pt)', unitPrice: 0.68 },
      aldi:       { packPrice: 1.49,  packSize: '2.27L (4pt)', unitPrice: 0.66 },
      iceland:    { packPrice: 1.59,  packSize: '2.27L (4pt)', unitPrice: 0.70 },
      sainsburys: { packPrice: 1.70,  packSize: '2.27L (4pt)', unitPrice: 0.75 },
      asda:       { packPrice: 1.55,  packSize: '2.27L (4pt)', unitPrice: 0.68 },
    },
  },
  {
    id: 'cheddar-mature',
    name: 'Mature Cheddar',
    category: 'Dairy & Eggs',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 14.99, packSize: '2.5kg block', unitPrice: 6.00 },
      tesco:      { packPrice: 4.25,  packSize: '400g',        unitPrice: 10.63 },
      lidl:       { packPrice: 2.99,  packSize: '400g',        unitPrice: 7.48 },
      aldi:       { packPrice: 2.89,  packSize: '400g',        unitPrice: 7.23 },
      iceland:    { packPrice: 3.50,  packSize: '400g',        unitPrice: 8.75 },
      sainsburys: { packPrice: 4.50,  packSize: '400g',        unitPrice: 11.25 },
      asda:       { packPrice: 3.75,  packSize: '400g',        unitPrice: 9.38 },
    },
  },
  {
    id: 'eggs-12',
    name: 'Free Range Eggs (12)',
    category: 'Dairy & Eggs',
    compareUnit: '£/egg',
    prices: {
      costco:     { packPrice: 6.99,  packSize: '30 eggs',  unitPrice: 0.23 },
      tesco:      { packPrice: 3.35,  packSize: '12 eggs',  unitPrice: 0.28 },
      lidl:       { packPrice: 2.89,  packSize: '12 eggs',  unitPrice: 0.24 },
      aldi:       { packPrice: 2.75,  packSize: '12 eggs',  unitPrice: 0.23 },
      iceland:    { packPrice: 3.00,  packSize: '12 eggs',  unitPrice: 0.25 },
      sainsburys: { packPrice: 3.50,  packSize: '12 eggs',  unitPrice: 0.29 },
      asda:       { packPrice: 3.10,  packSize: '12 eggs',  unitPrice: 0.26 },
    },
  },
  {
    id: 'butter-unsalted',
    name: 'Unsalted Butter',
    category: 'Dairy & Eggs',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 8.99,  packSize: '4 × 250g',  unitPrice: 8.99 },
      tesco:      { packPrice: 2.20,  packSize: '250g',       unitPrice: 8.80 },
      lidl:       { packPrice: 1.79,  packSize: '250g',       unitPrice: 7.16 },
      aldi:       { packPrice: 1.75,  packSize: '250g',       unitPrice: 7.00 },
      iceland:    { packPrice: 2.00,  packSize: '250g',       unitPrice: 8.00 },
      sainsburys: { packPrice: 2.30,  packSize: '250g',       unitPrice: 9.20 },
      asda:       { packPrice: 2.10,  packSize: '250g',       unitPrice: 8.40 },
    },
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Style Yogurt',
    category: 'Dairy & Eggs',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '1kg',   unitPrice: 5.99 },
      tesco:      { packPrice: 2.50,  packSize: '500g',  unitPrice: 5.00 },
      lidl:       { packPrice: 1.49,  packSize: '500g',  unitPrice: 2.98 },
      aldi:       { packPrice: 1.45,  packSize: '500g',  unitPrice: 2.90 },
      iceland:    { packPrice: 1.75,  packSize: '500g',  unitPrice: 3.50 },
      sainsburys: { packPrice: 2.75,  packSize: '500g',  unitPrice: 5.50 },
      asda:       { packPrice: 2.00,  packSize: '500g',  unitPrice: 4.00 },
    },
  },

  // ─── MEAT & FISH ───
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    category: 'Meat & Fish',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 17.99, packSize: '3kg pack',  unitPrice: 6.00 },
      tesco:      { packPrice: 4.50,  packSize: '600g',      unitPrice: 7.50 },
      lidl:       { packPrice: 3.89,  packSize: '600g',      unitPrice: 6.48 },
      aldi:       { packPrice: 3.79,  packSize: '600g',      unitPrice: 6.32 },
      iceland:    { packPrice: 4.00,  packSize: '600g',      unitPrice: 6.67 },
      sainsburys: { packPrice: 4.75,  packSize: '600g',      unitPrice: 7.92 },
      asda:       { packPrice: 4.25,  packSize: '600g',      unitPrice: 7.08 },
    },
  },
  {
    id: 'beef-mince',
    name: 'Beef Mince (5% fat)',
    category: 'Meat & Fish',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 18.99, packSize: '2.5kg',  unitPrice: 7.60 },
      tesco:      { packPrice: 5.00,  packSize: '500g',   unitPrice: 10.00 },
      lidl:       { packPrice: 3.99,  packSize: '500g',   unitPrice: 7.98 },
      aldi:       { packPrice: 3.89,  packSize: '500g',   unitPrice: 7.78 },
      iceland:    { packPrice: 4.50,  packSize: '500g',   unitPrice: 9.00 },
      sainsburys: { packPrice: 5.25,  packSize: '500g',   unitPrice: 10.50 },
      asda:       { packPrice: 4.75,  packSize: '500g',   unitPrice: 9.50 },
    },
  },
  {
    id: 'salmon-fillets',
    name: 'Salmon Fillets',
    category: 'Meat & Fish',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 19.99, packSize: '1.5kg',  unitPrice: 13.33 },
      tesco:      { packPrice: 6.00,  packSize: '360g',   unitPrice: 16.67 },
      lidl:       { packPrice: 4.99,  packSize: '360g',   unitPrice: 13.86 },
      aldi:       { packPrice: 4.89,  packSize: '360g',   unitPrice: 13.58 },
      iceland:    { packPrice: 5.50,  packSize: '360g',   unitPrice: 15.28 },
      sainsburys: { packPrice: 6.50,  packSize: '360g',   unitPrice: 18.06 },
      asda:       { packPrice: 5.75,  packSize: '360g',   unitPrice: 15.97 },
    },
  },
  {
    id: 'pork-sausages',
    name: 'Pork Sausages',
    category: 'Meat & Fish',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 10.99, packSize: '2kg',   unitPrice: 5.50 },
      tesco:      { packPrice: 2.75,  packSize: '454g',  unitPrice: 6.06 },
      lidl:       { packPrice: 2.09,  packSize: '400g',  unitPrice: 5.23 },
      aldi:       { packPrice: 1.99,  packSize: '400g',  unitPrice: 4.98 },
      iceland:    { packPrice: 2.50,  packSize: '454g',  unitPrice: 5.51 },
      sainsburys: { packPrice: 3.00,  packSize: '400g',  unitPrice: 7.50 },
      asda:       { packPrice: 2.50,  packSize: '400g',  unitPrice: 6.25 },
    },
  },

  // ─── FRUIT & VEG ───
  {
    id: 'bananas',
    name: 'Bananas',
    category: 'Fruit & Veg',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 3.99,  packSize: '3kg bag',   unitPrice: 1.33 },
      tesco:      { packPrice: 0.99,  packSize: '5 pack',    unitPrice: 0.99 },
      lidl:       { packPrice: 0.79,  packSize: '5 pack',    unitPrice: 0.79 },
      aldi:       { packPrice: 0.75,  packSize: '5 pack',    unitPrice: 0.75 },
      iceland:    { packPrice: 0.89,  packSize: '5 pack',    unitPrice: 0.89 },
      sainsburys: { packPrice: 1.05,  packSize: '5 pack',    unitPrice: 1.05 },
      asda:       { packPrice: 0.85,  packSize: '5 pack',    unitPrice: 0.85 },
    },
  },
  {
    id: 'baby-spinach',
    name: 'Baby Spinach',
    category: 'Fruit & Veg',
    compareUnit: '£/100g',
    prices: {
      costco:     { packPrice: 4.99,  packSize: '500g bag',  unitPrice: 1.00 },
      tesco:      { packPrice: 1.50,  packSize: '200g',      unitPrice: 0.75 },
      lidl:       { packPrice: 0.99,  packSize: '200g',      unitPrice: 0.50 },
      aldi:       { packPrice: 0.99,  packSize: '200g',      unitPrice: 0.50 },
      iceland:    { packPrice: 1.25,  packSize: '200g',      unitPrice: 0.63 },
      sainsburys: { packPrice: 1.65,  packSize: '200g',      unitPrice: 0.83 },
      asda:       { packPrice: 1.35,  packSize: '200g',      unitPrice: 0.68 },
    },
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'Fruit & Veg',
    compareUnit: '£/head',
    prices: {
      costco:     { packPrice: 3.49,  packSize: '3 heads',  unitPrice: 1.16 },
      tesco:      { packPrice: 0.79,  packSize: '1 head',   unitPrice: 0.79 },
      lidl:       { packPrice: 0.59,  packSize: '1 head',   unitPrice: 0.59 },
      aldi:       { packPrice: 0.55,  packSize: '1 head',   unitPrice: 0.55 },
      iceland:    { packPrice: 0.75,  packSize: '1 head',   unitPrice: 0.75 },
      sainsburys: { packPrice: 0.90,  packSize: '1 head',   unitPrice: 0.90 },
      asda:       { packPrice: 0.72,  packSize: '1 head',   unitPrice: 0.72 },
    },
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    category: 'Fruit & Veg',
    compareUnit: '£/400g',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '1kg punnet', unitPrice: 2.40 },
      tesco:      { packPrice: 2.50,  packSize: '400g',       unitPrice: 2.50 },
      lidl:       { packPrice: 1.99,  packSize: '400g',       unitPrice: 1.99 },
      aldi:       { packPrice: 1.89,  packSize: '400g',       unitPrice: 1.89 },
      iceland:    { packPrice: 2.25,  packSize: '400g',       unitPrice: 2.25 },
      sainsburys: { packPrice: 2.75,  packSize: '400g',       unitPrice: 2.75 },
      asda:       { packPrice: 2.25,  packSize: '400g',       unitPrice: 2.25 },
    },
  },

  // ─── BAKERY ───
  {
    id: 'white-bread',
    name: 'White Sliced Bread',
    category: 'Bakery',
    compareUnit: '£/800g loaf',
    prices: {
      costco:     { packPrice: 4.99,  packSize: '4 × 800g loaves', unitPrice: 1.25 },
      tesco:      { packPrice: 1.10,  packSize: '800g loaf',       unitPrice: 1.10 },
      lidl:       { packPrice: 0.79,  packSize: '800g loaf',       unitPrice: 0.79 },
      aldi:       { packPrice: 0.75,  packSize: '800g loaf',       unitPrice: 0.75 },
      iceland:    { packPrice: 0.89,  packSize: '800g loaf',       unitPrice: 0.89 },
      sainsburys: { packPrice: 1.20,  packSize: '800g loaf',       unitPrice: 1.20 },
      asda:       { packPrice: 0.95,  packSize: '800g loaf',       unitPrice: 0.95 },
    },
  },
  {
    id: 'croissants',
    name: 'Butter Croissants (6pk)',
    category: 'Bakery',
    compareUnit: '£/croissant',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '12 pack',  unitPrice: 0.50 },
      tesco:      { packPrice: 1.75,  packSize: '6 pack',   unitPrice: 0.29 },
      lidl:       { packPrice: 1.29,  packSize: '6 pack',   unitPrice: 0.22 },
      aldi:       { packPrice: 1.25,  packSize: '6 pack',   unitPrice: 0.21 },
      iceland:    { packPrice: 1.50,  packSize: '6 pack',   unitPrice: 0.25 },
      sainsburys: { packPrice: 2.00,  packSize: '6 pack',   unitPrice: 0.33 },
      asda:       { packPrice: 1.65,  packSize: '6 pack',   unitPrice: 0.28 },
    },
  },

  // ─── PANTRY ───
  {
    id: 'pasta-penne',
    name: 'Penne Pasta',
    category: 'Pantry',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '5kg bag',  unitPrice: 1.20 },
      tesco:      { packPrice: 0.95,  packSize: '500g',     unitPrice: 1.90 },
      lidl:       { packPrice: 0.65,  packSize: '500g',     unitPrice: 1.30 },
      aldi:       { packPrice: 0.59,  packSize: '500g',     unitPrice: 1.18 },
      iceland:    { packPrice: 0.85,  packSize: '500g',     unitPrice: 1.70 },
      sainsburys: { packPrice: 1.05,  packSize: '500g',     unitPrice: 2.10 },
      asda:       { packPrice: 0.85,  packSize: '500g',     unitPrice: 1.70 },
    },
  },
  {
    id: 'basmati-rice',
    name: 'Basmati Rice',
    category: 'Pantry',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 12.99, packSize: '10kg bag',  unitPrice: 1.30 },
      tesco:      { packPrice: 3.50,  packSize: '2kg',       unitPrice: 1.75 },
      lidl:       { packPrice: 2.49,  packSize: '2kg',       unitPrice: 1.25 },
      aldi:       { packPrice: 2.39,  packSize: '2kg',       unitPrice: 1.20 },
      iceland:    { packPrice: 3.00,  packSize: '2kg',       unitPrice: 1.50 },
      sainsburys: { packPrice: 3.75,  packSize: '2kg',       unitPrice: 1.88 },
      asda:       { packPrice: 3.25,  packSize: '2kg',       unitPrice: 1.63 },
    },
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil (Extra Virgin)',
    category: 'Pantry',
    compareUnit: '£/litre',
    prices: {
      costco:     { packPrice: 14.99, packSize: '3L tin',   unitPrice: 5.00 },
      tesco:      { packPrice: 5.50,  packSize: '750ml',    unitPrice: 7.33 },
      lidl:       { packPrice: 3.99,  packSize: '750ml',    unitPrice: 5.32 },
      aldi:       { packPrice: 3.79,  packSize: '750ml',    unitPrice: 5.05 },
      iceland:    { packPrice: 4.50,  packSize: '750ml',    unitPrice: 6.00 },
      sainsburys: { packPrice: 5.75,  packSize: '750ml',    unitPrice: 7.67 },
      asda:       { packPrice: 5.00,  packSize: '750ml',    unitPrice: 6.67 },
    },
  },
  {
    id: 'chopped-tomatoes',
    name: 'Chopped Tomatoes (400g)',
    category: 'Pantry',
    compareUnit: '£/tin',
    prices: {
      costco:     { packPrice: 6.99,  packSize: '12 × 400g tins', unitPrice: 0.58 },
      tesco:      { packPrice: 0.65,  packSize: '400g tin',       unitPrice: 0.65 },
      lidl:       { packPrice: 0.45,  packSize: '400g tin',       unitPrice: 0.45 },
      aldi:       { packPrice: 0.42,  packSize: '400g tin',       unitPrice: 0.42 },
      iceland:    { packPrice: 0.55,  packSize: '400g tin',       unitPrice: 0.55 },
      sainsburys: { packPrice: 0.70,  packSize: '400g tin',       unitPrice: 0.70 },
      asda:       { packPrice: 0.58,  packSize: '400g tin',       unitPrice: 0.58 },
    },
  },
  {
    id: 'baked-beans',
    name: 'Baked Beans (420g)',
    category: 'Pantry',
    compareUnit: '£/tin',
    prices: {
      costco:     { packPrice: 7.49,  packSize: '24 × 420g tins', unitPrice: 0.31 },
      tesco:      { packPrice: 0.70,  packSize: '420g tin',       unitPrice: 0.70 },
      lidl:       { packPrice: 0.45,  packSize: '420g tin',       unitPrice: 0.45 },
      aldi:       { packPrice: 0.42,  packSize: '420g tin',       unitPrice: 0.42 },
      iceland:    { packPrice: 0.50,  packSize: '420g tin',       unitPrice: 0.50 },
      sainsburys: { packPrice: 0.80,  packSize: '420g tin',       unitPrice: 0.80 },
      asda:       { packPrice: 0.62,  packSize: '420g tin',       unitPrice: 0.62 },
    },
  },
  {
    id: 'instant-coffee',
    name: 'Instant Coffee',
    category: 'Pantry',
    compareUnit: '£/100g',
    prices: {
      costco:     { packPrice: 14.99, packSize: '750g jar',  unitPrice: 2.00 },
      tesco:      { packPrice: 4.00,  packSize: '200g jar',  unitPrice: 2.00 },
      lidl:       { packPrice: 2.49,  packSize: '200g jar',  unitPrice: 1.25 },
      aldi:       { packPrice: 2.39,  packSize: '200g jar',  unitPrice: 1.20 },
      iceland:    { packPrice: 3.50,  packSize: '200g jar',  unitPrice: 1.75 },
      sainsburys: { packPrice: 4.25,  packSize: '200g jar',  unitPrice: 2.13 },
      asda:       { packPrice: 3.75,  packSize: '200g jar',  unitPrice: 1.88 },
    },
  },

  // ─── FROZEN ───
  {
    id: 'frozen-peas',
    name: 'Frozen Garden Peas',
    category: 'Frozen',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 4.99,  packSize: '2.5kg bag',  unitPrice: 2.00 },
      tesco:      { packPrice: 1.50,  packSize: '1kg bag',    unitPrice: 1.50 },
      lidl:       { packPrice: 0.99,  packSize: '1kg bag',    unitPrice: 0.99 },
      aldi:       { packPrice: 0.95,  packSize: '1kg bag',    unitPrice: 0.95 },
      iceland:    { packPrice: 0.99,  packSize: '1kg bag',    unitPrice: 0.99 },
      sainsburys: { packPrice: 1.60,  packSize: '1kg bag',    unitPrice: 1.60 },
      asda:       { packPrice: 1.25,  packSize: '1kg bag',    unitPrice: 1.25 },
    },
  },
  {
    id: 'fish-fingers',
    name: 'Fish Fingers (10 pack)',
    category: 'Frozen',
    compareUnit: '£/finger',
    prices: {
      costco:     { packPrice: 7.99,  packSize: '50 pack',  unitPrice: 0.16 },
      tesco:      { packPrice: 2.50,  packSize: '10 pack',  unitPrice: 0.25 },
      lidl:       { packPrice: 1.79,  packSize: '10 pack',  unitPrice: 0.18 },
      aldi:       { packPrice: 1.69,  packSize: '10 pack',  unitPrice: 0.17 },
      iceland:    { packPrice: 1.99,  packSize: '10 pack',  unitPrice: 0.20 },
      sainsburys: { packPrice: 2.75,  packSize: '10 pack',  unitPrice: 0.28 },
      asda:       { packPrice: 2.25,  packSize: '10 pack',  unitPrice: 0.23 },
    },
  },
  {
    id: 'frozen-chips',
    name: 'Frozen Oven Chips',
    category: 'Frozen',
    compareUnit: '£/kg',
    prices: {
      costco:     { packPrice: 6.99,  packSize: '4kg bag',   unitPrice: 1.75 },
      tesco:      { packPrice: 1.89,  packSize: '1.5kg bag', unitPrice: 1.26 },
      lidl:       { packPrice: 1.39,  packSize: '1.5kg bag', unitPrice: 0.93 },
      aldi:       { packPrice: 1.29,  packSize: '1.5kg bag', unitPrice: 0.86 },
      iceland:    { packPrice: 1.49,  packSize: '1.5kg bag', unitPrice: 0.99 },
      sainsburys: { packPrice: 1.99,  packSize: '1.5kg bag', unitPrice: 1.33 },
      asda:       { packPrice: 1.65,  packSize: '1.5kg bag', unitPrice: 1.10 },
    },
  },

  // ─── DRINKS ───
  {
    id: 'orange-juice',
    name: 'Orange Juice (Not from Concentrate)',
    category: 'Drinks',
    compareUnit: '£/litre',
    prices: {
      costco:     { packPrice: 7.99,  packSize: '3 × 1.75L', unitPrice: 1.52 },
      tesco:      { packPrice: 2.20,  packSize: '1.75L',     unitPrice: 1.26 },
      lidl:       { packPrice: 1.79,  packSize: '1.75L',     unitPrice: 1.02 },
      aldi:       { packPrice: 1.69,  packSize: '1.75L',     unitPrice: 0.97 },
      iceland:    { packPrice: 1.99,  packSize: '1.75L',     unitPrice: 1.14 },
      sainsburys: { packPrice: 2.40,  packSize: '1.75L',     unitPrice: 1.37 },
      asda:       { packPrice: 2.10,  packSize: '1.75L',     unitPrice: 1.20 },
    },
  },
  {
    id: 'water-still',
    name: 'Still Water',
    category: 'Drinks',
    compareUnit: '£/litre',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '30 × 500ml', unitPrice: 0.40 },
      tesco:      { packPrice: 0.45,  packSize: '2L',         unitPrice: 0.23 },
      lidl:       { packPrice: 0.19,  packSize: '2L',         unitPrice: 0.10 },
      aldi:       { packPrice: 0.17,  packSize: '2L',         unitPrice: 0.09 },
      iceland:    { packPrice: 0.35,  packSize: '2L',         unitPrice: 0.18 },
      sainsburys: { packPrice: 0.50,  packSize: '2L',         unitPrice: 0.25 },
      asda:       { packPrice: 0.39,  packSize: '2L',         unitPrice: 0.20 },
    },
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola (330ml cans)',
    category: 'Drinks',
    compareUnit: '£/can',
    prices: {
      costco:     { packPrice: 9.99,  packSize: '40 × 330ml',  unitPrice: 0.25 },
      tesco:      { packPrice: 4.50,  packSize: '12 × 330ml',  unitPrice: 0.38 },
      lidl:       { packPrice: 3.99,  packSize: '12 × 330ml',  unitPrice: 0.33 },
      aldi:       { packPrice: 3.89,  packSize: '12 × 330ml',  unitPrice: 0.32 },
      iceland:    { packPrice: 4.00,  packSize: '12 × 330ml',  unitPrice: 0.33 },
      sainsburys: { packPrice: 4.75,  packSize: '12 × 330ml',  unitPrice: 0.40 },
      asda:       { packPrice: 4.25,  packSize: '12 × 330ml',  unitPrice: 0.35 },
    },
  },

  // ─── HOUSEHOLD ───
  {
    id: 'toilet-roll',
    name: 'Toilet Roll',
    category: 'Household',
    compareUnit: '£/roll',
    prices: {
      costco:     { packPrice: 19.99, packSize: '45 rolls',  unitPrice: 0.44 },
      tesco:      { packPrice: 5.50,  packSize: '9 rolls',   unitPrice: 0.61 },
      lidl:       { packPrice: 3.49,  packSize: '9 rolls',   unitPrice: 0.39 },
      aldi:       { packPrice: 3.25,  packSize: '9 rolls',   unitPrice: 0.36 },
      iceland:    { packPrice: 4.50,  packSize: '9 rolls',   unitPrice: 0.50 },
      sainsburys: { packPrice: 5.75,  packSize: '9 rolls',   unitPrice: 0.64 },
      asda:       { packPrice: 4.75,  packSize: '9 rolls',   unitPrice: 0.53 },
    },
  },
  {
    id: 'washing-powder',
    name: 'Washing Powder (Non-Bio)',
    category: 'Household',
    compareUnit: '£/wash',
    prices: {
      costco:     { packPrice: 22.99, packSize: '130 washes', unitPrice: 0.18 },
      tesco:      { packPrice: 8.00,  packSize: '40 washes',  unitPrice: 0.20 },
      lidl:       { packPrice: 4.99,  packSize: '40 washes',  unitPrice: 0.12 },
      aldi:       { packPrice: 4.79,  packSize: '40 washes',  unitPrice: 0.12 },
      iceland:    { packPrice: 6.50,  packSize: '40 washes',  unitPrice: 0.16 },
      sainsburys: { packPrice: 8.50,  packSize: '40 washes',  unitPrice: 0.21 },
      asda:       { packPrice: 7.25,  packSize: '40 washes',  unitPrice: 0.18 },
    },
  },

  // ─── SNACKS ───
  {
    id: 'crisps-multipack',
    name: "Crisps Multipack (Walkers)",
    category: 'Snacks',
    compareUnit: '£/bag',
    prices: {
      costco:     { packPrice: 8.99,  packSize: '50 bags',  unitPrice: 0.18 },
      tesco:      { packPrice: 3.50,  packSize: '12 bags',  unitPrice: 0.29 },
      lidl:       { packPrice: 2.29,  packSize: '10 bags',  unitPrice: 0.23 },
      aldi:       { packPrice: 2.19,  packSize: '10 bags',  unitPrice: 0.22 },
      iceland:    { packPrice: 3.00,  packSize: '12 bags',  unitPrice: 0.25 },
      sainsburys: { packPrice: 3.75,  packSize: '12 bags',  unitPrice: 0.31 },
      asda:       { packPrice: 3.25,  packSize: '12 bags',  unitPrice: 0.27 },
    },
  },
  {
    id: 'chocolate-digestives',
    name: 'Chocolate Digestives',
    category: 'Snacks',
    compareUnit: '£/100g',
    prices: {
      costco:     { packPrice: 5.99,  packSize: '800g twin pack', unitPrice: 0.75 },
      tesco:      { packPrice: 1.80,  packSize: '300g',           unitPrice: 0.60 },
      lidl:       { packPrice: 1.19,  packSize: '300g',           unitPrice: 0.40 },
      aldi:       { packPrice: 1.09,  packSize: '300g',           unitPrice: 0.36 },
      iceland:    { packPrice: 1.50,  packSize: '300g',           unitPrice: 0.50 },
      sainsburys: { packPrice: 1.90,  packSize: '300g',           unitPrice: 0.63 },
      asda:       { packPrice: 1.65,  packSize: '300g',           unitPrice: 0.55 },
    },
  },
]

export function searchItems(query) {
  if (!query.trim()) return GROCERY_ITEMS
  const q = query.toLowerCase()
  return GROCERY_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  )
}

export function getItemsByCategory(category) {
  if (category === 'All') return GROCERY_ITEMS
  return GROCERY_ITEMS.filter((item) => item.category === category)
}

export function getCheapestStore(item) {
  let cheapest = null
  let min = Infinity
  for (const [store, data] of Object.entries(item.prices)) {
    if (data.unitPrice < min) {
      min = data.unitPrice
      cheapest = store
    }
  }
  return cheapest
}

export function getMostExpensiveStore(item) {
  let expensive = null
  let max = -Infinity
  for (const [store, data] of Object.entries(item.prices)) {
    if (data.unitPrice > max) {
      max = data.unitPrice
      expensive = store
    }
  }
  return expensive
}

export function getSavingsVsCostco(item) {
  const costcoPrice = item.prices.costco?.unitPrice ?? null
  if (costcoPrice === null) return null
  const cheapest = getCheapestStore(item)
  if (cheapest === 'costco') return null
  const otherPrice = item.prices[cheapest].unitPrice
  return ((costcoPrice - otherPrice) / costcoPrice * 100).toFixed(0)
}
