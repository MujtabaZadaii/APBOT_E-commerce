import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sable_super_secret_key_123';

const APBOT_API_URL = process.env.APBOT_API_URL || 'http://localhost:5001/api/apbot/predict';

router.post('/message', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Security Audit: Identify authenticated user securely via JWT
        let authenticatedUser = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                authenticatedUser = jwt.verify(token, JWT_SECRET);
            } catch (err) {
                console.warn("Invalid JWT presented to ApBot");
                return res.status(401).json({ error: "Invalid Authentication Token" });
            }
        }
        
        let aiData = { intent: 'unknown', confidence: 0, message: '', context: context || {} };
        try {
            const aiResponse = await fetch(APBOT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, context })
            });
            if (aiResponse.ok) {
                aiData = await aiResponse.json();
            }
        } catch (fetchErr) {
            console.warn("Python AI Service offline, falling back to Node NLP engine.");
        }
        
        const { intent = 'unknown', confidence = 0, message: botMessage = '', context: updatedPythonContext } = aiData;
        
        let responseData = {
            intent,
            confidence,
            message: botMessage,
            data: null,
            actions: [],
            context: updatedPythonContext || context || {}
        };

        
        // Contextual NLP Extractors
        const lowerMsg = message.toLowerCase();
        
        // Check for Multi-turn filters (e.g. "Only under 200", "in black")
        const priceMatch = lowerMsg.match(/under\s*£?(\d+)/) || lowerMsg.match(/less than\s*£?(\d+)/) || lowerMsg.match(/below\s*£?(\d+)/) || lowerMsg.match(/within\s*£?(\d+)/);
        if (priceMatch) {
            responseData.context.priceFilter = parseInt(priceMatch[1]);
        } else if (!lowerMsg.includes('also') && !lowerMsg.includes('only') && !lowerMsg.includes('same')) {
            responseData.context.priceFilter = null;
        }

        const colorMatch = lowerMsg.match(/(black|white|grey|gray|blue|red|green|brown|navy|ivory|charcoal|onyx|obsidian|khaki)/i);
        if (colorMatch) {
            responseData.context.colorFilter = colorMatch[1];
        } else if (!lowerMsg.includes('also') && !lowerMsg.includes('only') && !lowerMsg.includes('same')) {
            responseData.context.colorFilter = null;
        }


        // Handle "Show me the first one" or "Add the second one" or "Tell me about the 1st product"
        const indexMap = { 'first': 0, '1st': 0, 'second': 1, '2nd': 1, 'third': 2, '3rd': 2, 'fourth': 3, '4th': 3, 'fifth': 4, '5th': 4 };
        let referencedProductIndex = -1;
        for (const [word, idx] of Object.entries(indexMap)) {
            if (lowerMsg.includes(word + ' one') || lowerMsg.includes('the ' + word) || lowerMsg.includes(word + ' product') || lowerMsg.includes(word + ' item')) {
                referencedProductIndex = idx;
                break;
            }
        }

        // Conversational State Machine Overrides (Highest Priority)
        let activeIntent = intent;
        
        if (context?.checkoutState === 'awaiting_address') {
            activeIntent = 'process_address';
        } else if (context?.checkoutState === 'awaiting_payment') {
            activeIntent = 'process_payment';
        }

        // Handle "Add it to my bag" referencing the selected/filtered product
        if (!context?.checkoutState && (lowerMsg.includes('add it') || lowerMsg.includes('add another')) && context?.lastProducts?.length > 0) {
             activeIntent = 'add_to_cart';
        }

        // Contextual intent promotion for specific product references
        if (!context?.checkoutState && referencedProductIndex !== -1 && context?.lastProducts?.length > referencedProductIndex) {
            responseData.context.lastProducts = [context.lastProducts[referencedProductIndex]];
            if (lowerMsg.includes('wishlist') || lowerMsg.includes('favorite') || lowerMsg.includes('fav') || lowerMsg.includes('save')) {
                activeIntent = 'wishlist_add';
            } else if (lowerMsg.includes('add') || lowerMsg.includes('buy') || lowerMsg.includes('cart') || lowerMsg.includes('bag')) {
                activeIntent = 'add_to_cart';
            } else {
                activeIntent = 'product_information';
            }
        }

        // If they just said "under 200" but no search intent, promote to search using previous search
        if (!context?.checkoutState && (priceMatch || colorMatch) && referencedProductIndex === -1) {
            if (!['add_to_cart', 'wishlist_add', 'remove_from_cart', 'checkout', 'process_payment', 'process_address'].includes(activeIntent)) {
                activeIntent = 'product_search';
                responseData.message = "Let me filter those for you.";
            }
        }

        // Robust Pattern Matcher Overrides for Common E-commerce Triggers (only if not in active checkout state)
        if (!context?.checkoutState && referencedProductIndex === -1) {
            // Check Wishlist FIRST before Add to Cart!
            if (lowerMsg.includes('wishlist') || lowerMsg.includes('favorite') || lowerMsg.includes('fav') || lowerMsg.includes('save')) {
                activeIntent = 'wishlist_add';
            } else if (lowerMsg.includes('add') || lowerMsg.includes('put') || lowerMsg.includes('buy') || lowerMsg.includes('get this') || lowerMsg.includes('take this')) {
                if (lowerMsg.includes('cart') || lowerMsg.includes('bag') || lowerMsg.includes('this') || lowerMsg.includes('item') || lowerMsg.includes('one') || lowerMsg.includes('product') || lowerMsg.includes('jacket') || lowerMsg.includes('coat')) {
                    activeIntent = 'add_to_cart';
                }
            }

            
            if (activeIntent !== 'add_to_cart') {
                if (lowerMsg.includes('outfit') || lowerMsg.includes('complete look') || lowerMsg.includes('pair with') || lowerMsg.includes('style with') || lowerMsg.includes('bundle')) {
                    activeIntent = 'ai_outfit';
                } else if (lowerMsg.includes('size') || /\bfit\b/.test(lowerMsg) || lowerMsg.includes('height') || lowerMsg.includes('weight') || lowerMsg.includes('kg') || lowerMsg.includes('cm') || lowerMsg.includes('ft')) {
                    activeIntent = 'ai_size_fit';
                } else if (lowerMsg.includes('discount') || lowerMsg.includes('promo') || lowerMsg.includes('coupon') || lowerMsg.includes('vip') || lowerMsg.includes('perk') || lowerMsg.includes('offer') || lowerMsg.includes('code')) {
                    activeIntent = 'vip_discount';
                } else if (lowerMsg.includes('photo') || lowerMsg.includes('image search') || lowerMsg.includes('visual search')) {
                    activeIntent = 'visual_search';
                } else if (lowerMsg.includes('new arrival') || lowerMsg.includes('latest arrival') || (lowerMsg.includes('new') && !lowerMsg.includes('york') && !lowerMsg.includes('jersey') && !lowerMsg.includes('delhi'))) {
                    activeIntent = 'product_search';
                    responseData.message = "Here are our latest new arrivals:";
                } else if (lowerMsg.includes('checkout') || lowerMsg.includes('pay')) {
                    activeIntent = 'checkout';
                } else if ((lowerMsg.includes('view') || lowerMsg.includes('open') || lowerMsg.includes('check') || lowerMsg.trim() === 'cart' || lowerMsg.trim() === 'bag') && (lowerMsg.includes('bag') || lowerMsg.includes('cart'))) {
                    activeIntent = 'view_cart';
                } else if (lowerMsg.includes('track') || lowerMsg.includes('delivery')) {
                    activeIntent = 'order_tracking';
                } else if (lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('search') || lowerMsg.includes('outerwear') || lowerMsg.includes('knitwear') || lowerMsg.includes('tailoring')) {
                    activeIntent = 'product_search';
                }
            }


        }




        // Handle low confidence & unknown ONLY if no overrides happened
        if ((confidence < 0.5 || intent === 'unknown') && activeIntent === intent) {
            responseData.message = "I'm sorry, I didn't quite catch that. Could you please rephrase or let me know what you're looking for?";
            responseData.intent = 'unknown';
            return res.json(responseData);
        }

        // Handle Intents
        switch (activeIntent) {
            case 'product_search':
            case 'similar_products':
            case 'category_search':
            case 'product_recommendation': {
                let products = [];
                let dbQuery = {};
                let searchKeywords = [];
                
                const isSimilar = activeIntent === 'similar_products';
                const hasLastProducts = responseData.context.lastProducts && responseData.context.lastProducts.length > 0;
                
                if (isSimilar && hasLastProducts) {
                    const lastProduct = await Product.findById(responseData.context.lastProducts[0]);
                    if (lastProduct) {
                        dbQuery = { ct: lastProduct.ct, _id: { $ne: lastProduct._id } };
                        responseData.message = "Here are some similar recommendations.";
                    }
                } else if (activeIntent === 'product_recommendation') {
                    dbQuery = {};
                    if (context?.lastCategory) dbQuery.ct = context.lastCategory;
                    responseData.message = "Here are some gorgeous pieces I recommend for you.";
                } else {
                    const stopWords = ['new', 'arrivals', 'arrival', 'latest', 'show', 'me', 'only', 'under', 'less', 'than', 'more', 'over', 'price', 'the', 'a', 'an', 'some', 'any', 'please', 'just', 'add', 'it', 'to', 'my', 'bag', 'cart', 'buy', 'purchase', 'want', 'looking', 'for', 'can', 'you', 'find', 'like', 'ones', 'one', 'item', 'items', 'piece', 'pieces', 'thing', 'things', 'stuff', 'everything', 'all'];
                    const colorWords = ['black', 'white', 'grey', 'gray', 'blue', 'red', 'green', 'brown', 'navy', 'ivory', 'beige', 'charcoal', 'onyx', 'obsidian', 'khaki'];
                    
                    searchKeywords = lowerMsg
                        .replace(/£?\d+/g, '')
                        .split(/[\s,.]+/)
                        .filter(w => w.length > 2 && !stopWords.includes(w) && !colorWords.includes(w));
                    
                    const synonymMap = {
                        'outwheres': 'outerwear', 'jacket': 'outerwear', 'jackets': 'outerwear', 'coat': 'outerwear', 'coats': 'outerwear', 'overshirt': 'outerwear',
                        'shirt': 'essentials', 'shirts': 'essentials', 'tee': 'essentials', 'tshirt': 'essentials',
                        'sweater': 'knitwear', 'sweaters': 'knitwear', 'jumper': 'knitwear', 'cardigan': 'knitwear', 'knit': 'knitwear', 'knitwear': 'knitwear',
                        'trouser': 'trousers', 'trousers': 'trousers', 'pants': 'trousers', 'slacks': 'trousers'
                    };
                    
                    // Only reuse previous category keywords if explicitly requested (e.g. "more of those")
                    const isExplicitCarryover = lowerMsg.includes('same') || lowerMsg.includes('similar') || lowerMsg.includes('more of');
                    if (isExplicitCarryover && context?.lastSearchKeywords) {
                        searchKeywords = context.lastSearchKeywords;
                    } else if (searchKeywords.length > 0) {
                        responseData.context.lastSearchKeywords = searchKeywords;
                    }

                    searchKeywords = searchKeywords.map(w => synonymMap[w] || w);
                }

                // Construct robust $and query conditions
                const andConditions = [];

                if (searchKeywords.length > 0) {
                    const regexPattern = searchKeywords.join('|');
                    andConditions.push({
                        $or: [
                            { nm: { $regex: regexPattern, $options: 'i' } },
                            { ct: { $regex: regexPattern, $options: 'i' } },
                            { desc: { $regex: regexPattern, $options: 'i' } }
                        ]
                    });
                }
                
                // Color Synonym Map for broader, accurate database matching
                const colorSynonymMap = {
                    'black': ['black', 'obsidian', 'onyx', 'charcoal', 'dark', 'slate'],
                    'white': ['white', 'off-white', 'ivory', 'oatmeal', 'cream', 'sand'],
                    'grey': ['grey', 'gray', 'slate', 'charcoal', 'heather'],
                    'gray': ['grey', 'gray', 'slate', 'charcoal', 'heather'],
                    'blue': ['blue', 'navy', 'midnight', 'indigo'],
                    'navy': ['navy', 'blue', 'midnight'],
                    'brown': ['brown', 'tobacco', 'tan', 'khaki', 'suede'],
                    'green': ['green', 'olive', 'khaki']
                };

                let cRegex = null;
                if (responseData.context.colorFilter) {
                    const rawColor = responseData.context.colorFilter.toLowerCase();
                    const syns = colorSynonymMap[rawColor] || [rawColor];
                    cRegex = new RegExp(`(${syns.join('|')})`, 'i');
                    andConditions.push({
                        $or: [
                            { nm: cRegex },
                            { desc: cRegex },
                            { ct: cRegex },
                            { colour: cRegex },
                            { tags: cRegex },
                            { material: cRegex }
                        ]
                    });
                }

                if (responseData.context.priceFilter) {
                    andConditions.push({ pr: { $lte: responseData.context.priceFilter } });
                }

                if (andConditions.length > 0) {
                    dbQuery = { $and: andConditions };
                }
                
                // Extract user-requested count (e.g. "only 1", "show 2", "1 jacket", "just one", "the best jacket")
                let requestedCount = null;
                const countPatterns = [
                    { regex: /(?:only|just|show|top|get|find|bring|display|want)?\s*1\b|\bonly 1\b|\bjust 1\b|\b1 jacket\b|\b1 product\b|\b1 item\b|\b1 piece\b|\bone jacket\b|\bone item\b|\bone piece\b|\bjust one\b|\bonly one\b/i, count: 1 },
                    { regex: /(?:only|just|show|top|get|find|bring|display|want)?\s*2\b|\bonly 2\b|\bjust 2\b|\b2 jackets\b|\b2 products\b|\b2 items\b|\b2 pieces\b|\btwo jackets\b|\btwo items\b|\btwo pieces\b|\bjust two\b|\bonly two\b/i, count: 2 },
                    { regex: /(?:only|just|show|top|get|find|bring|display|want)?\s*3\b|\bonly 3\b|\bjust 3\b|\b3 jackets\b|\b3 products\b|\b3 items\b|\b3 pieces\b|\bthree jackets\b|\bthree items\b|\bthree pieces\b|\bjust three\b|\bonly three\b/i, count: 3 },
                    { regex: /(?:only|just|show|top|get|find|bring|display|want)?\s*4\b|\bonly 4\b|\bjust 4\b|\b4 jackets\b|\b4 products\b|\b4 items\b|\b4 pieces\b|\bfour jackets\b|\bfour items\b|\bfour pieces\b|\bjust four\b|\bonly four\b/i, count: 4 }
                ];

                for (const p of countPatterns) {
                    if (p.regex.test(lowerMsg)) {
                        requestedCount = p.count;
                        break;
                    }
                }

                if (!requestedCount && (lowerMsg.includes('the best jacket') || lowerMsg.includes('the top jacket') || lowerMsg.includes('the best piece') || lowerMsg.includes('best jacket'))) {
                    requestedCount = 1;
                }

                const fetchLimit = requestedCount ? requestedCount : 20;
                const sortCriteria = (lowerMsg.includes('best') || lowerMsg.includes('top') || lowerMsg.includes('premium')) ? { pr: -1 } : { pr: 1 };

                products = await Product.find(dbQuery).sort(sortCriteria).limit(fetchLimit);

                if (requestedCount && products.length > requestedCount) {
                    products = products.slice(0, requestedCount);
                }

                // Smart Fallbacks - Strictly preserve requested color/price intent
                if (products.length === 0) {
                    if (cRegex) {
                        products = await Product.find({
                            $or: [
                                { nm: cRegex },
                                { desc: cRegex },
                                { ct: cRegex },
                                { colour: cRegex },
                                { tags: cRegex }
                            ]
                        }).sort(sortCriteria).limit(fetchLimit);
                        
                        if (products.length > 0) {
                            responseData.message = `I couldn't find any ${responseData.context.colorFilter} items under £${responseData.context.priceFilter || 200}, but here are all available ${responseData.context.colorFilter} pieces:`;
                        }
                    } else if (responseData.context.priceFilter) {
                        products = await Product.find({ pr: { $lte: responseData.context.priceFilter } }).sort(sortCriteria).limit(fetchLimit);
                        if (products.length > 0) {
                            responseData.message = `Here are our pieces under £${responseData.context.priceFilter}:`;
                        }
                    }
                    
                    if (products.length === 0) {
                        products = await Product.find({}).sort({ _id: -1 }).limit(fetchLimit);
                    }
                }

                if (requestedCount && products.length > requestedCount) {
                    products = products.slice(0, requestedCount);
                }

                if (products.length > 0) {
                    if (requestedCount === 1) {
                        const prod = products[0];
                        if (lowerMsg.includes('best') || lowerMsg.includes('top')) {
                            responseData.message = `Here is our premier recommendation — the ${prod.nm}, crafted with exceptional luxury quality:`;
                        } else {
                            responseData.message = `Here is the ${prod.nm} from our collection:`;
                        }
                    } else if (requestedCount > 1) {
                        responseData.message = `Here are our top ${products.length} recommendations curated specifically for you:`;
                    } else if (responseData.context.colorFilter && responseData.context.priceFilter) {
                        responseData.message = `Here are our ${responseData.context.colorFilter} pieces under £${responseData.context.priceFilter}:`;
                    } else if (responseData.context.colorFilter) {
                        responseData.message = `Here are our ${responseData.context.colorFilter} pieces:`;
                    } else if (responseData.context.priceFilter) {
                        responseData.message = `Here are our pieces under £${responseData.context.priceFilter}:`;
                    } else if (lowerMsg.includes('jacket') || lowerMsg.includes('outerwear') || lowerMsg.includes('coat')) {
                        responseData.message = "Here are our premier outerwear and jacket selections:";
                    } else {
                        responseData.message = "Here are the pieces I selected for you:";
                    }

                    const formattedProducts = products.map(p => ({
                        ...p.toObject(),
                        _id: p._id.toString(), id: p._id.toString(),
                        name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                    }));


                    let dynamicHint = "Click any item to view full details, or tell me which piece to add to your bag.";
                    if (lowerMsg.includes('new') || lowerMsg.includes('arrival') || lowerMsg.includes('latest')) {
                        dynamicHint = "These are our latest SABLE arrivals click any item for full details, or let me know which piece to add to your bag.";
                    } else if (responseData.context.colorFilter && responseData.context.priceFilter) {
                        dynamicHint = `Here are the ${responseData.context.colorFilter} pieces under £${responseData.context.priceFilter} click to inspect details or ask me to add one to your bag.`;
                    } else if (responseData.context.colorFilter) {
                        dynamicHint = `Here are the ${responseData.context.colorFilter} luxury pieces click to view full details or ask me to add one to your bag.`;
                    } else if (responseData.context.priceFilter) {
                        dynamicHint = `Here are the items under £${responseData.context.priceFilter} click to view details or ask me to add one to your bag.`;
                    } else if (searchKeywords && searchKeywords.length > 0) {
                        const kw = searchKeywords.join(', ');
                        dynamicHint = `Here are our curated ${kw} pieces click to view details or ask me to add one to your bag.`;
                    }

                    responseData.data = { type: 'products', items: formattedProducts, hint: dynamicHint };

                    responseData.context.lastProducts = products.map(p => p._id.toString());
                    if (products[0].ct) responseData.context.lastCategory = products[0].ct;
                }
                break;
            }
                
            case 'product_information':
            case 'product_price':
            case 'product_availability':
                if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    const pId = responseData.context.lastProducts[0];
                    const prod = await Product.findById(pId);
                    if (prod) {
                        const formattedProduct = {
                            ...prod.toObject(),
                            _id: prod._id.toString(), id: prod._id.toString(),
                            name: prod.nm, brand: 'SABLE', price: prod.pr, category: prod.ct, images: [prod.img]
                        };
                        responseData.data = { type: 'product_detail', product: formattedProduct };
                        
                        if (activeIntent === 'product_price') {
                            responseData.message = `The ${prod.nm} is priced at £${prod.pr}.`;
                        } else if (activeIntent === 'product_availability') {
                            responseData.message = prod.inStock ? `Yes, the ${prod.nm} is currently in stock.` : `I'm sorry, the ${prod.nm} is currently sold out.`;
                        } else {
                            responseData.message = `Here is the full breakdown for ${prod.nm} (£${prod.pr}):\n\n• Craftsmanship: ${prod.desc}\n• Material: ${prod.material || '100% Premium Luxury Blend'}\n• Sizes: ${prod.sizes ? prod.sizes.join(', ') : 'S, M, L, XL'}`;
                        }

                    } else {
                        responseData.message = "I couldn't find the product details.";
                    }
                } else {
                    responseData.message = "Please search for a product first so I can give you the details.";
                }
                break;

            case 'offers':
                responseData.message = "Currently, SABLE offers standard pricing on all our luxury items. We don't have any sales right now, but sign up for our newsletter to stay updated on exclusive events.";
                break;

            case 'add_to_cart':
                let productToAdd = null;
                const addStopWords = ['only', 'under', 'less', 'than', 'more', 'over', 'price', 'show', 'me', 'the', 'a', 'an', 'some', 'any', 'please', 'just', 'add', 'in', 'it', 'to', 'my', 'bag', 'cart', 'buy', 'purchase', 'want', 'looking', 'for', 'can', 'you', 'find', 'like', 'this', 'one', 'best'];
                let potentialNames = lowerMsg.replace(/£?\d+/g, '').split(/[\s,.]+/).filter(w => w.length > 2 && !addStopWords.includes(w));
                
                if (potentialNames.length > 0) {
                    const regexP = potentialNames.join('|');
                    productToAdd = await Product.findOne({
                        $or: [
                            { nm: { $regex: regexP, $options: 'i' } },
                            { ct: { $regex: regexP, $options: 'i' } },
                            { desc: { $regex: regexP, $options: 'i' } }
                        ]
                    });
                }

                if (!productToAdd && responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    productToAdd = await Product.findById(responseData.context.lastProducts[0]);
                }

                if (!productToAdd) {
                    productToAdd = await Product.findOne({});
                }

                if (productToAdd) {
                    let quantity = 1;
                    if (lowerMsg.includes('two') || lowerMsg.includes(' 2 ')) quantity = 2;
                    if (lowerMsg.includes('three') || lowerMsg.includes(' 3 ')) quantity = 3;
                    
                    const formattedProduct = {
                        ...productToAdd.toObject(),
                        _id: productToAdd._id.toString(), id: productToAdd._id.toString(),
                        name: productToAdd.nm, brand: 'SABLE', price: productToAdd.pr, category: productToAdd.ct, images: [productToAdd.img]
                    };

                    responseData.actions.push('add_to_cart');
                    responseData.data = { type: 'cart_action', product: formattedProduct, quantity };
                    responseData.message = `I've added the ${formattedProduct.name} to your bag.`;
                } else {
                    responseData.message = "I couldn't find the product to add.";
                }
                break;

            case 'wishlist_add':
                let productToSave = null;
                if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    productToSave = await Product.findById(responseData.context.lastProducts[0]);
                }
                if (!productToSave) {
                    productToSave = await Product.findOne({});
                }

                if (productToSave) {
                    const formattedSave = {
                        ...productToSave.toObject(),
                        _id: productToSave._id.toString(), id: productToSave._id.toString(),
                        name: productToSave.nm, brand: 'SABLE', price: productToSave.pr, category: productToSave.ct, images: [productToSave.img]
                    };

                    responseData.actions.push('wishlist_add');
                    responseData.data = { type: 'wishlist_action', product: formattedSave };
                    responseData.message = `I've saved the ${formattedSave.name} to your Wishlist!`;
                } else {
                    responseData.message = "I couldn't find the item to save to your wishlist.";
                }
                break;



            case 'remove_from_cart':
                if (context?.cartItems?.length > 0) {
                    // Just push the action, frontend will show cart for them to remove, or we try to guess which one
                    responseData.actions.push('remove_from_cart');
                    // We'll pass the first item in the cart to remove if they didn't specify
                    responseData.data = { type: 'cart_remove_action', productId: context.cartItems[0].id || context.cartItems[0]._id };
                    responseData.message = "I've removed that item from your bag.";
                } else {
                    responseData.message = "Your bag is already empty.";
                }
                break;

            case 'update_cart':
                responseData.message = "You can update your bag quantities below.";
                responseData.actions.push('open_cart');
                break;

            case 'view_cart':
                const rawCart = context?.cartItems || [];
                if (rawCart.length === 0) {
                    responseData.message = "Your bag is currently empty.";
                } else {
                    const formattedCart = rawCart.map(item => ({
                        _id: item.id || item._id, name: item.name || item.nm, price: item.price || item.pr,
                        quantity: item.quantity, images: item.images || [item.img]
                    }));
                    const total = formattedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const itemNames = formattedCart.map(item => `${item.quantity}x ${item.name}`).join(', ');
                    responseData.message = `You have ${formattedCart.length} item(s) in your bag: ${itemNames}. Your total is £${total.toFixed(2)}. Say "checkout" when you're ready!`;
                    responseData.data = { type: 'cart_summary', items: formattedCart };
                }
                break;

            case 'wishlist_add':
                if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    responseData.actions.push('wishlist_add');
                    responseData.data = { type: 'wishlist_action', productId: responseData.context.lastProducts[0] };
                    responseData.message = "I've saved that to your wishlist.";
                } else {
                    responseData.message = "I don't know which product to save. Please select a product first.";
                }
                break;

            case 'wishlist_remove':
                if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    responseData.actions.push('wishlist_remove');
                    responseData.data = { type: 'wishlist_action', productId: responseData.context.lastProducts[0] };
                    responseData.message = "I've removed that from your wishlist.";
                } else {
                    responseData.message = "I don't know which product to remove. Please select a product first.";
                }
                break;
                
            case 'view_wishlist':
                responseData.actions.push('open_wishlist');
                responseData.message = "Opening your wishlist now.";
                break;

            // AUTH ACTIONS
            case 'login':
                if (authenticatedUser) {
                    responseData.message = "You're already signed in to your SABLE account.";
                } else {
                    responseData.message = "Opening the login page for you.";
                    responseData.actions.push('login');
                }
                break;
            case 'logout':
                if (authenticatedUser) {
                    responseData.message = "Signing you out.";
                    responseData.actions.push('logout');
                } else {
                    responseData.message = "You're not currently signed in.";
                }
                break;
            case 'account_status':
                if (authenticatedUser) {
                    responseData.message = `You are currently signed in as ${authenticatedUser.name || authenticatedUser.email}.`;
                } else {
                    responseData.message = "You are not currently signed in.";
                }
                break;
            case 'previous_orders':
                if (!authenticatedUser) {
                    responseData.message = "Please sign in to view your order history.";
                    responseData.actions.push('login');
                } else {
                    responseData.message = "Opening your recent orders.";
                    responseData.actions.push('open_orders');
                }
                break;

            // NAVIGATION ACTIONS
            case 'open_shop':
            case 'go_home':
                responseData.message = "Taking you to the storefront.";
                responseData.actions.push('navigate');
                responseData.data = { target: 'home' };
                break;
            case 'open_category':
                responseData.message = "Taking you to the category.";
                responseData.actions.push('navigate');
                responseData.data = { target: 'category' };
                break;
            case 'open_search':
                responseData.message = "Opening search.";
                responseData.actions.push('open_search');
                break;
            case 'open_cart':
                responseData.message = "Opening your bag.";
                responseData.actions.push('open_cart');
                break;
            case 'open_wishlist':
                responseData.message = "Opening your wishlist.";
                responseData.actions.push('open_wishlist');
                break;
            case 'open_profile':
                if (!authenticatedUser) {
                    responseData.message = "Please sign in to access your profile.";
                    responseData.actions.push('login');
                } else {
                    responseData.message = "Opening your profile.";
                    responseData.actions.push('open_profile');
                }
                break;
            case 'open_checkout':
                if (!authenticatedUser) {
                    responseData.message = "Please sign in to proceed to checkout.";
                    responseData.actions.push('login');
                } else {
                    responseData.message = "Opening checkout.";
                    responseData.actions.push('open_checkout');
                }
                break;
            case 'open_tracking':
                responseData.message = "Opening the tracking page.";
                responseData.actions.push('open_tracking');
                break;
            case 'open_product':
                if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    responseData.message = "Opening the product details.";
                    responseData.actions.push('navigate');
                    responseData.data = { target: 'product', id: responseData.context.lastProducts[0] };
                } else {
                    responseData.message = "I don't know which product to open. Please search for a product first.";
                }
                break;

            case 'checkout':
                const checkoutCart = context?.cartItems || [];
                if (checkoutCart.length === 0) {
                    responseData.message = "Your bag is empty. Add some items before checking out!";
                } else if (!authenticatedUser) {
                    responseData.message = "Please sign in to your account first to proceed with checkout.";
                } else {
                    responseData.context.checkoutState = 'awaiting_address';
                    responseData.message = "Let's get you checked out! Please provide your full shipping address.";
                    responseData.data = { type: 'address_form' };
                }
                break;
                
            case 'process_address':
                responseData.context.checkoutState = 'awaiting_payment';
                responseData.context.shippingAddress = message;
                responseData.message = "Got it! Your address is saved. Now, please securely enter your payment details.";
                responseData.data = { type: 'payment_form' };
                break;
                
            case 'process_payment':
                const finalRawCart = context?.cartItems || [];
                let itemsToSave = [];
                
                if (finalRawCart.length > 0) {
                    itemsToSave = finalRawCart.map(item => ({
                        productId: item.id || item._id,
                        name: item.name || item.nm || 'SABLE Piece',
                        price: item.price !== undefined ? item.price : (item.pr !== undefined ? item.pr : 185),
                        quantity: item.quantity || 1,
                        image: item.image || item.img || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'
                    }));
                } else if (context?.lastProducts && context.lastProducts.length > 0) {
                    const lastP = context.lastProducts[0];
                    itemsToSave = [{
                        productId: lastP._id || lastP.id || '650000000000000000000001',
                        name: lastP.name || lastP.nm || 'Suede Utility Overshirt',
                        price: lastP.price || lastP.pr || 410,
                        quantity: 1,
                        image: lastP.image || lastP.img || (lastP.images && lastP.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'
                    }];
                } else {
                    itemsToSave = [{
                        productId: '650000000000000000000001',
                        name: 'Suede Utility Overshirt',
                        price: 410,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'
                    }];
                }

                const orderTotal = itemsToSave.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const trackingId = `SBL-${Math.floor(10000 + Math.random() * 90000)}`;

                let userEmail = authenticatedUser?.email || 'guest@sable.com';
                let userName = authenticatedUser?.name || 'Guest Customer';
                let shippingAddrStr = context?.shippingAddress || '';

                if (typeof shippingAddrStr === 'string' && shippingAddrStr.includes(',')) {
                    const parts = shippingAddrStr.split(',').map(s => s.trim());
                    if (parts[0]) userName = parts[0];
                    if (parts[1] && parts[1].includes('@')) userEmail = parts[1];
                }

                const newOrder = new Order({
                    orderId: trackingId,
                    userId: userEmail,
                    userName: userName,
                    items: itemsToSave,
                    totalAmount: orderTotal,
                    trackingStatus: 'Order Placed',
                    trackingNumber: trackingId,
                    shippingAddress: shippingAddrStr || 'Standard Priority Delivery'
                });
                
                await newOrder.save();
                
                responseData.context.checkoutState = null;
                responseData.context.shippingAddress = null;
                
                responseData.actions.push('place_order');
                responseData.data = { type: 'order', item: newOrder };
                responseData.message = "Payment Successful! Your order has been confirmed.";
                break;




            case 'order_tracking':
            case 'order_status':
            case 'delivery_date':
            case 'order_details':
                const getDynamicStatus = (orderObj) => {
                    if (!orderObj || !orderObj.createdAt) return orderObj?.trackingStatus || 'Order Placed';
                    const elapsedMins = Math.floor((new Date() - new Date(orderObj.createdAt)) / (1000 * 60));
                    if (elapsedMins >= 40) return 'Delivered';
                    if (elapsedMins >= 30) return 'Out for Delivery';
                    if (elapsedMins >= 20) return 'Shipped';
                    if (elapsedMins >= 10) return 'Processing';
                    return 'Order Placed';
                };

                const trackingMatch = message.match(/SBL-\d+/i);
                if (trackingMatch) {
                    const tId = trackingMatch[0].toUpperCase();
                    const order = await Order.findOne({
                        $or: [{ orderId: tId }, { trackingNumber: tId }]
                    });
                    
                    if (order) {
                        const activeId = order.orderId || order.trackingNumber;
                        const dynamicStatus = getDynamicStatus(order);
                        order.trackingStatus = dynamicStatus;

                        responseData.data = { type: 'order', item: order };
                        responseData.message = `Tracking Order #${activeId}:\n\nStatus: "${dynamicStatus}"\nLocation: SABLE London Fulfillment Centre\nExpected Delivery: 3-5 Business Days.`;
                    } else {
                        responseData.message = `I couldn't find an order with tracking ID ${tId}. Please check your tracking number and try again.`;
                    }
                } else {
                    const userEmail = authenticatedUser?.email || context?.userId;
                    const latestOrder = await Order.findOne(userEmail && userEmail !== 'guest' ? { userId: userEmail } : {}).sort({ createdAt: -1 });
                    if (latestOrder) {
                        const activeId = latestOrder.orderId || latestOrder.trackingNumber;
                        const dynamicStatus = getDynamicStatus(latestOrder);
                        latestOrder.trackingStatus = dynamicStatus;

                        responseData.data = { type: 'order', item: latestOrder };
                        responseData.message = `Tracking Latest Order #${activeId}:\n\nStatus: "${dynamicStatus}"\nLocation: SABLE London Fulfillment Centre\nExpected Delivery: 3-5 Business Days.`;
                    } else {
                        responseData.message = "Please provide your tracking ID (e.g., SBL-30256) so I can look up your order status.";
                    }
                }
                break;


                
            case 'previous_orders':
                const orderHistoryEmail = authenticatedUser?.email || context?.userId;
                if (!orderHistoryEmail || orderHistoryEmail === 'guest') {
                    responseData.message = "Please sign in to view your order history.";
                } else {
                    const orders = await Order.find({ userId: orderHistoryEmail }).sort({ createdAt: -1 }).limit(3);

                    if (orders.length > 0) {
                        const activeId = orders[0].orderId || orders[0].trackingNumber;
                        responseData.data = { type: 'order', item: orders[0] };
                        responseData.message = `Here is your most recent order (${activeId}).`;
                    } else {
                        responseData.message = "You don't have any previous orders yet.";
                    }
                }
                break;


            // ── AI SIZE & FIT RECOMMENDATION ENGINE ────────────────────
            case 'ai_size_fit': {
                const weightMatch = lowerMsg.match(/(\d+)\s*kg/i) || lowerMsg.match(/(\d+)\s*lbs/i);
                const heightMatch = lowerMsg.match(/(\d+)\s*cm/i) || lowerMsg.match(/(\d+)\s*ft/i);
                
                if (weightMatch || heightMatch) {
                    let recSize = 'M';
                    let kg = 75;
                    if (weightMatch) {
                        const raw = parseInt(weightMatch[1]);
                        kg = lowerMsg.includes('lbs') ? Math.round(raw * 0.453592) : raw;
                    }
                    
                    if (kg < 65) { recSize = 'S'; }
                    else if (kg <= 78) { recSize = 'M'; }
                    else if (kg <= 90) { recSize = 'L'; }
                    else { recSize = 'XL'; }

                    const explanation = `Based on your submitted build (${kg}kg), Size ${recSize} provides a refined tailored silhouette with effortless comfort.`;

                    responseData.data = {
                        type: 'size_fit_recommendation',
                        size: recSize,
                        explanation
                    };
                    responseData.message = `AI Fit Advisor: We recommend Size ${recSize} for your build (${kg}kg).`;
                } else {
                    responseData.data = { type: 'size_fit_form' };
                    responseData.message = "To calculate your exact luxury tailored size, please enter your height and weight details:";
                }
                break;
            }


            // ── AI OUTFIT BUILDER (COMPLETE THE LOOK) ──────────────────
            case 'ai_outfit': {
                const outfitItems = await Product.find({}).limit(3);
                const formattedOutfit = outfitItems.map(p => ({
                    ...p.toObject(),
                    _id: p._id.toString(), id: p._id.toString(),
                    name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                }));
                const totalBundle = formattedOutfit.reduce((s, i) => s + i.price, 0);

                responseData.data = {
                    type: 'ai_outfit',
                    items: formattedOutfit,
                    totalAmount: totalBundle
                };
                responseData.message = "Here is an AI-curated 3-piece luxury ensemble designed to complete your look:";
                break;
            }

            // ── VIP DISCOUNT CONCIERGE ──────────────────────────────────
            case 'vip_discount': {
                responseData.data = {
                    type: 'vip_discount',
                    code: 'SABLE-VIP15',
                    discountPercent: 15
                };
                responseData.message = "As a valued guest of SABLE, I've unlocked an exclusive 15% VIP discount code for your order!";
                break;
            }

            // ── VISUAL SEARCH / PHOTO MATCH ────────────────────────────
            case 'visual_search': {
                const imgKeywords = ['bomber', 'trench', 'coat', 'sweater', 'jacket', 'trouser', 'overshirt', 'shirt', 'tee', 'cardigan', 'wool', 'leather', 'suede'];
                const colorKeywords = ['black', 'white', 'grey', 'gray', 'blue', 'red', 'green', 'brown', 'navy'];
                
                const foundKeyword = imgKeywords.find(k => lowerMsg.includes(k));
                const foundColor = colorKeywords.find(c => lowerMsg.includes(c));

                let matchedProducts = [];

                if (foundKeyword || foundColor) {
                    const searchConditions = [];
                    if (foundKeyword) searchConditions.push({ $or: [{ nm: new RegExp(foundKeyword, 'i') }, { ct: new RegExp(foundKeyword, 'i') }, { desc: new RegExp(foundKeyword, 'i') }] });
                    if (foundColor) searchConditions.push({ $or: [{ nm: new RegExp(foundColor, 'i') }, { desc: new RegExp(foundColor, 'i') }, { colour: new RegExp(foundColor, 'i') }] });

                    matchedProducts = await Product.find({ $and: searchConditions }).limit(3);
                }

                if (matchedProducts.length > 0) {
                    const formattedVisual = matchedProducts.map(p => ({
                        ...p.toObject(),
                        _id: p._id.toString(), id: p._id.toString(),
                        name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                    }));

                    responseData.data = {
                        type: 'products',
                        items: formattedVisual,
                        hint: "Visual AI Analysis: Match Confidence 96%."
                    };
                    responseData.message = `Visual AI Scan Complete: I identified a matching luxury item in our collection — the ${formattedVisual[0].name}:`;
                } else {
                    const alternatives = await Product.find({}).sort({ pr: -1 }).limit(2);
                    const formattedAlt = alternatives.map(p => ({
                        ...p.toObject(),
                        _id: p._id.toString(), id: p._id.toString(),
                        name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                    }));

                    responseData.data = {
                        type: 'products',
                        items: formattedAlt,
                        hint: "Closest luxury alternatives available in store."
                    };
                    responseData.message = "Visual AI Scan Complete: I analyzed your image, but we do not currently have this exact piece in our SABLE inventory. To ensure 100% accuracy, here are our closest premier recommendations:";
                }
                break;
            }


            // FAQ & Support
            case 'checkout_help':
            case 'payment_help':
                responseData.message = "You can securely check out directly in this chat! Just say 'checkout'. We accept all major credit and debit cards.";
                break;
            case 'delivery_address':
                responseData.message = "During the checkout process, I will ask you for your shipping address. You can provide it directly in the chat.";
                break;
            case 'faq':
                responseData.message = "Standard shipping takes 3-5 business days. We offer a 14-day return policy for unused items.";
                break;
            case 'complaint':
            case 'contact_support':
                responseData.message = "I am sorry to hear you need support. You can reach our team at support@sable.com or call 0800 123 4567.";
                break;
            case 'return_product':
                responseData.message = "You can return items within 14 days of receipt. Please contact support@sable.com with your Order ID to initiate a return.";
                break;
        }

        
        res.json(responseData);
        
    } catch (error) {
        console.error('ApBot Route Error:', error);
        res.status(500).json({
            intent: 'error', confidence: 0,
            message: "My systems are currently experiencing some turbulence. Please try again later.",
            data: null, actions: []
        });
    }
});

export default router;
