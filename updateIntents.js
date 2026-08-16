import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const intentsPath = path.join(__dirname, 'apbot', 'data', 'intents.json');
const data = JSON.parse(fs.readFileSync(intentsPath, 'utf8'));

const newIntents = [
  {
    "tag": "go_home",
    "patterns": ["Go home", "Take me home", "Navigate to home", "Open home page"],
    "responses": ["Taking you to the home page."],
    "context_set": ""
  },
  {
    "tag": "open_shop",
    "patterns": ["Open the shop", "Take me to the shop", "Show the shop", "Go to store", "Browse shop"],
    "responses": ["Opening the shop for you."],
    "context_set": ""
  },
  {
    "tag": "open_category",
    "patterns": ["Take me to Outerwear", "Show me Knitwear", "Open Tailoring", "Open Archive", "Go to category", "Show category"],
    "responses": ["Opening that category for you."],
    "context_set": ""
  },
  {
    "tag": "open_product",
    "patterns": ["Open this product", "Show me the details", "Take me to this product", "View this item"],
    "responses": ["Opening the product details."],
    "context_set": ""
  },
  {
    "tag": "open_search",
    "patterns": ["Take me to search", "Open search", "I want to search"],
    "responses": ["Opening search for you."],
    "context_set": ""
  },
  {
    "tag": "open_cart",
    "patterns": ["Open my bag", "Show my bag", "Open my cart", "Take me to my bag"],
    "responses": ["Opening your bag."],
    "context_set": ""
  },
  {
    "tag": "open_wishlist",
    "patterns": ["Open my wishlist", "Show my wishlist", "Take me to my wishlist", "View wishlist"],
    "responses": ["Opening your wishlist."],
    "context_set": ""
  },
  {
    "tag": "open_profile",
    "patterns": ["Open my profile", "Take me to my profile", "Show my account", "View account settings"],
    "responses": ["Opening your profile."],
    "context_set": ""
  },
  {
    "tag": "open_checkout",
    "patterns": ["Open checkout", "Take me to checkout", "Go to checkout"],
    "responses": ["Opening checkout."],
    "context_set": ""
  },
  {
    "tag": "open_tracking",
    "patterns": ["Open order tracking", "Open the tracking page", "Go to tracking", "Show tracking page"],
    "responses": ["Opening the order tracking page."],
    "context_set": ""
  },
  {
    "tag": "login",
    "patterns": ["Login", "Sign in", "Log me in", "I want to login", "Authenticate"],
    "responses": ["Opening the login page."],
    "context_set": ""
  },
  {
    "tag": "logout",
    "patterns": ["Logout", "Sign me out", "I want to log out", "Sign out", "Log me out"],
    "responses": ["Logging you out securely."],
    "context_set": ""
  },
  {
    "tag": "account_status",
    "patterns": ["Am I logged in?", "Check my account status", "What is my login status?"],
    "responses": ["Checking your authentication status."],
    "context_set": ""
  },
  {
    "tag": "product_recommendation",
    "patterns": ["Recommend me something", "What should I buy?", "Show me recommendations", "Suggest me a product"],
    "responses": ["Here are some recommendations based on our popular pieces."],
    "context_set": "product_search"
  },
  {
    "tag": "category_search",
    "patterns": ["Search Outerwear", "Search black knitwear", "Find knitwear", "Search category"],
    "responses": ["Searching our catalog for those categories."],
    "context_set": "product_search"
  },
  {
    "tag": "update_cart",
    "patterns": ["Increase the quantity", "Decrease the quantity", "Add two", "Make it two", "Update quantity"],
    "responses": ["Updating your cart."],
    "context_set": "cart_action"
  }
];

// Merge new intents if they don't exist
newIntents.forEach(ni => {
  if (!data.intents.find(i => i.tag === ni.tag)) {
    data.intents.push(ni);
  }
});

fs.writeFileSync(intentsPath, JSON.stringify(data, null, 2));
console.log('Successfully updated intents.json');
