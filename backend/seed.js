const { sequelize } = require('./config/db');
const { User, Recipe } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const seedDB = async () => {
  try {
    // Wait for DB connection
    await sequelize.authenticate();
    console.log('Database connected for seeding...');

    // Warning: force: true drops the tables and recreates them to ensure a clean slate!
    await sequelize.sync({ force: true });

    // 1. Create a dummy user
    const chief1 = await User.create({
      name: 'Banvar Lal Sikendhar',
      email: 'banvar@example.com',
      password: 'password123',
      bio: 'Expert in North Indian Cuisine',
      authorImg: '/images/gallery/top-chiefs/img_1 (1).jpg'
    });

    const chief2 = await User.create({
      name: 'Eswar',
      email: 'eswar@example.com',
      password: 'password123',
      bio: 'Expert in All cuisines',
      authorImg: '/images/gallery/top-chiefs/photo.jpeg'
    });

    // 2. Create Dummy Recipes linked to the users
    const recipes = [
      {
        title: "Chicken Pizza",
        image: "/images/gallery/img_1 11.30.22 AM.jpg",
        description: "A classic chicken pizza with extra cheese.",
        ingredients: ["Chicken", "Cheese", "Pizza Base", "Tomato Sauce"],
        instructions: "Spread sauce, add toppings, and bake at 400F for 15 mins.",
        cookingTime: 20,
        userId: chief1.id
      },
      {
        title: "Korean Rice Bowl",
        image: "/images/gallery/img_2 11.30.22 AM.jpg",
        description: "Spicy and savory Korean rice bowl.",
        ingredients: ["Rice", "Beef", "Gochujang", "Vegetables"],
        instructions: "Cook rice, stir fry vegetables and beef, mix with sauce.",
        cookingTime: 25,
        userId: chief2.id
      },
      {
        title: "Chinese Platter",
        image: "/images/gallery/img_3 11.30.22 AM.jpg",
        description: "An authentic Chinese platter.",
        ingredients: ["Noodles", "Chicken", "Soy Sauce", "Vegetables"],
        instructions: "Stir fry everything together.",
        cookingTime: 30,
        userId: chief1.id
      },
      {
        title: "Mutton Biryani",
        image: "/images/gallery/img_6 11.30.22 AM.jpg",
        description: "Delicious aromatic mutton biryani.",
        ingredients: ["Basmati Rice", "Mutton", "Spices", "Yogurt"],
        instructions: "Marinate mutton, cook rice, layer and dum cook.",
        cookingTime: 60,
        userId: chief2.id
      }
    ];

    await Recipe.bulkCreate(recipes);
    
    console.log('✅ Dummy Users and Recipes successfully seeded into PostgreSQL!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
