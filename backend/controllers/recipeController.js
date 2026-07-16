const { Recipe, User, Comment, Like } = require('../models');

// @desc    Generate a recipe using Grok AI
// @route   POST /api/recipes/generate
const generateRecipe = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Grok API key not configured on server' });
    }

    const systemPrompt = `You are a culinary AI. The user will provide a prompt or recipe idea.
Generate a recipe matching the prompt. You MUST return ONLY a raw JSON object (without any markdown formatting like \`\`\`json) with the following structure:
{
  "title": "String, title of the recipe",
  "description": "String, brief description",
  "ingredients": "String, comma-separated list of ingredients (e.g., 'Pasta, Tomato, Garlic')",
  "instructions": "String, step-by-step instructions (e.g., 'Step 1: Boil water. Step 2: Cook pasta.')",
  "cookingTime": "Number, time in minutes as an integer"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-8b-instant',
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return res.status(500).json({ message: 'Failed to generate recipe from Groq' });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let parsedRecipe;
    try {
      // Basic cleanup in case the model ignores instructions and returns markdown
      const cleanContent = content.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedRecipe = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse Groq response as JSON:', content);
      return res.status(500).json({ message: 'Received invalid format from Groq' });
    }

    res.json(parsedRecipe);
  } catch (error) {
    console.error('Generate Recipe Error:', error);
    next(error);
  }
};


// @desc    Create a recipe
// @route   POST /api/recipes
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, image } = req.body;

    const recipe = await Recipe.create({
      userId: req.user.id,
      title, 
      description, 
      ingredients, 
      instructions, 
      cookingTime, 
      image
    });

    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
const getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'authorImg'] },
        { model: Like, attributes: ['id', 'userId'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'authorImg'] },
        { 
          model: Comment, 
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Like, attributes: ['id', 'userId'] }
      ]
    });

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (recipe) {
      // Check if user is the author
      if (recipe.userId !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this recipe' });
      }

      recipe.title = req.body.title || recipe.title;
      recipe.description = req.body.description || recipe.description;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;
      recipe.cookingTime = req.body.cookingTime || recipe.cookingTime;
      recipe.image = req.body.image || recipe.image;

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (recipe) {
      // Check if user is the author
      if (recipe.userId !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this recipe' });
      }

      await recipe.destroy();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, generateRecipe };
