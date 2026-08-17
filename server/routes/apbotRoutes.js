import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sable_super_secret_key_123';
const APBOT_API_URL = process.env.APBOT_API_URL || 'http://localhost:5001/api/apbot/predict';
function getRequestedIndex(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('1st') || lower.includes('first') || lower.includes('pehli') || lower.includes('pehla') || lower.includes('pehle') || lower.includes('1st wali')) return 0;
    if (lower.includes('2nd') || lower.includes('second') || lower.includes('doosri') || lower.includes('doosra') || lower.includes('dusri') || lower.includes('dusra') || lower.includes('2nd wali') || lower.includes('doosri wali')) return 1;
    if (lower.includes('3rd') || lower.includes('third') || lower.includes('teesri') || lower.includes('teesra') || lower.includes('tisri') || lower.includes('tisra') || lower.includes('3rd wali') || lower.includes('teesri wali')) return 2;
    if (lower.includes('4th') || lower.includes('fourth') || lower.includes('chauthi') || lower.includes('chautha') || lower.includes('4th wali')) return 3;
    if (lower.includes('5th') || lower.includes('fifth') || lower.includes('paanchvi') || lower.includes('paanchva') || lower.includes('5th wali')) return 4;
    const match = lower.match(/\b(?:no|number|num)?\s*([1-9])(?:st|nd|rd|th)?\s*(?:one|item|piece|product|jacket|shirt|coat|wali|wala|valey)?\b/);
    if (match) {
        const num = parseInt(match[1], 10);
        if (num >= 1 && num <= 9) return num - 1;
    }
    return null;
}
function isValidAddress(text) {
    if (!text || text.trim().length < 8) return false;
    const lower = text.toLowerCase().trim();
    const junkWords = ['add', 'fill', 'random', 'test', 'asdf', '123', 'yes', 'no', 'ok', 'hi', 'hello', 'help', 'product', 'item', 'something', 'report', 'what'];
    if (junkWords.includes(lower)) return false;
    const hasNumber = /\d+/.test(lower);
    const hasAddressKw = /\b(street|st|road|rd|ave|avenue|drive|flat|apartment|house|lane|city|london|karachi|lahore|islamabad|postcode|zip|block|town|country|mayfair|york|uk|pakistan|suite|sector|phase|building)\b/i.test(lower);
    return hasNumber || hasAddressKw || lower.includes(',');
}

function isValidPayment(text) {
    if (!text || text.trim().length < 2) return false;
    const lower = text.toLowerCase().trim();
    const junkWords = ['add', 'fill', 'random', 'test', 'asdf', '123', 'ok', 'hi', 'hello', 'help'];
    if (junkWords.includes(lower)) return false;
    const validPaymentKw = /\b(card|credit|debit|visa|mastercard|cash|cod|cash on delivery|apple pay|applepay|google pay|gpay|paypal|klarna|online|bank)\b/i;
    return validPaymentKw.test(lower);
}

router.post('/message', async (req, res) => {
    try {
        const { message, context } = req.body;
        let authenticatedUser = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                authenticatedUser = jwt.verify(token, JWT_SECRET);
            } catch (err) {
                console.warn("Invalid JWT presented to ApBot, falling back to guest mode.");
                authenticatedUser = null;
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
        const lowerMsg = message.toLowerCase();
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
        const indexMap = { 'first': 0, '1st': 0, 'second': 1, '2nd': 1, 'third': 2, '3rd': 2, 'fourth': 3, '4th': 3, 'fifth': 4, '5th': 4 };
        let referencedProductIndex = -1;
        for (const [word, idx] of Object.entries(indexMap)) {
            if (lowerMsg.includes(word + ' one') || lowerMsg.includes('the ' + word) || lowerMsg.includes(word + ' product') || lowerMsg.includes(word + ' item')) {
                referencedProductIndex = idx;
                break;
            }
        }
        let activeIntent = intent;
        
        const isCancelReq = /\b(cancel|stop|exit|abort|nevermind|rehne do)\b/i.test(lowerMsg);
        const isTopicSwitch = /\b(show|find|search|where|what|how|return|policy|shipping|track|tracking|order|jacket|knitwear|tailoring|price|size|discount|outfit|contact|report|winter|office|date|cheap|sasta|surprise|choose|similar)\b/i.test(lowerMsg);
        
        if (isCancelReq) {
            responseData.context.checkoutState = null;
            activeIntent = 'cancel_checkout';
        } else if (isTopicSwitch) {
            responseData.context.checkoutState = null;
        } else if (context?.checkoutState === 'awaiting_address') {
            activeIntent = 'process_address';
        } else if (context?.checkoutState === 'awaiting_payment') {
            activeIntent = 'process_payment';
        }

        if (!context?.checkoutState && (lowerMsg.includes('add it') || lowerMsg.includes('add another')) && context?.lastProducts?.length > 0) {
             activeIntent = 'add_to_cart';
        }
        if (!context?.checkoutState && referencedProductIndex !== -1 && context?.lastProducts?.length > referencedProductIndex) {
            responseData.context.lastProducts = [context.lastProducts[referencedProductIndex]];
            if (lowerMsg.includes('wishlist') || lowerMsg.includes('favorite') || lowerMsg.includes('fav') || lowerMsg.includes('save')) {
                activeIntent = 'wishlist_add';
            } else if (/\b(add|buy|cart|bag)\b/i.test(lowerMsg)) {
                activeIntent = 'add_to_cart';
            } else if (lowerMsg.includes('similar') || lowerMsg.includes('jaisa') || lowerMsg.includes('like')) {
                activeIntent = 'similar_products';
            } else {
                activeIntent = 'product_information';
            }
        }
        if (!context?.checkoutState && (priceMatch || colorMatch) && referencedProductIndex === -1) {
            if (!['add_to_cart', 'wishlist_add', 'remove_from_cart', 'checkout', 'process_payment', 'process_address'].includes(activeIntent)) {
                activeIntent = 'product_search';
                responseData.message = "Let me filter those for you.";
            }
        }
        if (!context?.checkoutState && referencedProductIndex === -1) {
            if (lowerMsg.includes('wishlist') || lowerMsg.includes('favorite') || lowerMsg.includes('fav') || lowerMsg.includes('save') || lowerMsg.includes('baad me')) {
                if (lowerMsg.includes('unsave') || lowerMsg.includes('remove')) {
                    activeIntent = 'wishlist_remove';
                } else {
                    activeIntent = 'wishlist_add';
                }
            } else if (/\b(add|put|buy|purchase)\b/i.test(lowerMsg) || lowerMsg.includes('get this') || lowerMsg.includes('take this') || lowerMsg.includes('le leta')) {
                if (lowerMsg.includes('cart') || lowerMsg.includes('bag') || lowerMsg.includes('this') || lowerMsg.includes('item') || lowerMsg.includes('one') || lowerMsg.includes('product') || lowerMsg.includes('jacket') || lowerMsg.includes('coat') || lowerMsg.includes('wali') || lowerMsg.includes('wala') || getRequestedIndex(lowerMsg) !== null) {
                    activeIntent = 'add_to_cart';
                }
            }
            if (!['add_to_cart', 'wishlist_add', 'wishlist_remove'].includes(activeIntent)) {
                // Out-of-scope check
                if (/\b(weather|president|bitcoin|python|letter|joke|2\+2|netflix|karachi|pakistan)\b/i.test(lowerMsg)) {
                    activeIntent = 'out_of_scope';
                } else if (/\b(choose|choose for me|pick for me|mere liye|hisaab se|meri jagah|what should i buy|teeno me se|kaun sa)\b/i.test(lowerMsg)) {
                    activeIntent = 'curate_recommendation';
                } else if (/\b(surprise|surprise me|kuch bhi|anything)\b/i.test(lowerMsg)) {
                    activeIntent = 'surprise_me';
                } else if (lowerMsg.includes('similar') || lowerMsg.includes('jaisa') || lowerMsg.includes('like 1st') || lowerMsg.includes('like first') || lowerMsg.includes('is ke jaisa')) {
                    activeIntent = 'similar_products';
                } else if (lowerMsg.includes('cheap') || lowerMsg.includes('cheapest') || lowerMsg.includes('cheep') || lowerMsg.includes('sasta') || lowerMsg.includes('low price') || lowerMsg.includes('less price')) {
                    activeIntent = 'cheap_products';
                } else if (lowerMsg.includes('winter')) {
                    activeIntent = 'winter_collection';
                } else if (lowerMsg.includes('office') || lowerMsg.includes('formal') || lowerMsg.includes('work')) {
                    activeIntent = 'office_collection';
                } else if (lowerMsg.includes('date') || lowerMsg.includes('party')) {
                    activeIntent = 'date_collection';
                } else if (lowerMsg.includes('worth it') || lowerMsg.includes('worth') || lowerMsg.includes('good quality') || lowerMsg.includes('kaisa hai')) {
                    activeIntent = 'stylist_advice';
                } else if (lowerMsg.includes('return') || lowerMsg.includes('refund') || lowerMsg.includes('wapas') || lowerMsg.includes('wapsi') || lowerMsg.includes('exchange')) {
                    activeIntent = 'return_product';
                } else if (lowerMsg.includes('not receive') || lowerMsg.includes('no receive') || lowerMsg.includes('no receved') || lowerMsg.includes('not received') || lowerMsg.includes('parcel') || lowerMsg.includes('package') || lowerMsg.includes('missing') || lowerMsg.includes('where is my') || lowerMsg.includes('track') || lowerMsg.includes('delivery') || lowerMsg.includes('kahan hai') || lowerMsg.includes('kab ayega') || lowerMsg.includes('kab hogi') || /\bsbl-\d+/i.test(lowerMsg)) {
                    activeIntent = 'order_tracking';
                } else if (lowerMsg.includes('shipping') || lowerMsg.includes('ship') || lowerMsg.includes('duty') || lowerMsg.includes('duties') || lowerMsg.includes('tax') || lowerMsg.includes('courier')) {
                    activeIntent = 'shipping_info';
                } else if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('klarna') || lowerMsg.includes('paypal') || lowerMsg.includes('card') || lowerMsg.includes('cod')) {
                    activeIntent = 'payment_info';
                } else if (lowerMsg.includes('authentic') || lowerMsg.includes('original') || lowerMsg.includes('limited') || lowerMsg.includes('restock')) {
                    activeIntent = 'authenticity_info';
                } else if (lowerMsg.includes('care') || lowerMsg.includes('wash') || lowerMsg.includes('dry clean') || lowerMsg.includes('fabric') || lowerMsg.includes('material')) {
                    activeIntent = 'care_info';
                } else if (lowerMsg.includes('contact') || lowerMsg.includes('support') || lowerMsg.includes('phone') || lowerMsg.includes('email') || lowerMsg.includes('address') || lowerMsg.includes('store') || lowerMsg.includes('boutique') || lowerMsg.includes('mayfair') || lowerMsg.includes('complaint') || lowerMsg.includes('help')) {
                    activeIntent = 'contact_support';
                } else if (lowerMsg.includes('report') || lowerMsg.includes('doc') || lowerMsg.includes('srs')) {
                    activeIntent = 'report_info';
                } else if (lowerMsg.includes('outfit') || lowerMsg.includes('complete look') || lowerMsg.includes('pair with') || lowerMsg.includes('style with') || lowerMsg.includes('bundle')) {
                    activeIntent = 'ai_outfit';
                } else if (lowerMsg.includes('size') || /\bfit\b/.test(lowerMsg) || lowerMsg.includes('height') || lowerMsg.includes('weight') || lowerMsg.includes('kg') || lowerMsg.includes('cm') || lowerMsg.includes('ft')) {
                    activeIntent = 'ai_size_fit';
                } else if (lowerMsg.includes('discount') || lowerMsg.includes('promo') || lowerMsg.includes('coupon') || lowerMsg.includes('vip') || lowerMsg.includes('perk') || lowerMsg.includes('offer') || lowerMsg.includes('code')) {
                    activeIntent = 'vip_discount';
                } else if (lowerMsg.includes('photo') || lowerMsg.includes('image search') || lowerMsg.includes('visual search')) {
                    activeIntent = 'visual_search';
                } else if (lowerMsg.includes('new arrival') || lowerMsg.includes('latest arrival') || lowerMsg.includes('trending') || (lowerMsg.includes('new') && !lowerMsg.includes('york') && !lowerMsg.includes('jersey') && !lowerMsg.includes('delhi'))) {
                    activeIntent = 'product_search';
                    responseData.message = "Here are our latest trending arrivals:";
                } else if (lowerMsg.includes('checkout') || lowerMsg.includes('check out') || lowerMsg.includes('checkout karwa')) {
                    activeIntent = 'checkout';
                } else if (lowerMsg.includes('account') || lowerMsg.includes('profile')) {
                    activeIntent = 'open_profile';
                } else if (lowerMsg.includes('order') || lowerMsg.includes('orders')) {
                    activeIntent = 'previous_orders';
                } else if (lowerMsg.includes('login')) {
                    activeIntent = 'login';
                } else if (lowerMsg.includes('logout')) {
                    activeIntent = 'logout';
                } else if ((lowerMsg.includes('view') || lowerMsg.includes('open') || lowerMsg.includes('check') || lowerMsg.trim() === 'cart' || lowerMsg.trim() === 'bag') && (lowerMsg.includes('bag') || lowerMsg.includes('cart'))) {
                    activeIntent = 'view_cart';
                } else if (lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('search') || lowerMsg.includes('outerwear') || lowerMsg.includes('knitwear') || lowerMsg.includes('tailoring') || lowerMsg.includes('jacket') || lowerMsg.includes('jaket') || lowerMsg.includes('dikhao') || lowerMsg.includes('dikao') || lowerMsg.includes('batao') || lowerMsg.includes('btao') || lowerMsg.includes('chahiye') || lowerMsg.includes('all') || lowerMsg.includes('sare') || lowerMsg.includes('sab') || lowerMsg.includes('products') || lowerMsg.includes('items') || lowerMsg.includes('acha')) {
                    activeIntent = 'product_search';
                }
            }
        }
        if ((confidence < 0.5 || intent === 'unknown') && activeIntent === intent) {
            responseData.message = "I'm here to assist you with SABLE luxury garments, order tracking, returns, shipping, sizing, or checkout. How can I help you today?";
            responseData.intent = 'unknown';
            return res.json(responseData);
        }
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
                    const isAllRequest = lowerMsg.includes('all') || lowerMsg.includes('everything') || lowerMsg.includes('sare') || lowerMsg.includes('sab') || lowerMsg.includes('catalog') || lowerMsg.includes('collection') || lowerMsg.trim() === 'products' || lowerMsg.trim() === 'items';
                    if (isAllRequest) {
                        searchKeywords = [];
                        responseData.message = "Here is our full collection of SABLE products:";
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
                        const isExplicitCarryover = lowerMsg.includes('same') || lowerMsg.includes('similar') || lowerMsg.includes('more of');
                        if (isExplicitCarryover && context?.lastSearchKeywords) {
                            searchKeywords = context.lastSearchKeywords;
                        } else if (searchKeywords.length > 0) {
                            responseData.context.lastSearchKeywords = searchKeywords;
                        }
                        searchKeywords = searchKeywords.map(w => synonymMap[w] || w);
                    }
                }
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
                const requestedIndex = getRequestedIndex(lowerMsg);
                if (requestedIndex !== null) {
                    if (responseData.context.lastProducts && responseData.context.lastProducts.length > requestedIndex) {
                        const targetId = responseData.context.lastProducts[requestedIndex];
                        productToAdd = await Product.findById(targetId);
                    } else if (responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                        responseData.message = `I currently have ${responseData.context.lastProducts.length} item(s) in your active view. Did you mean option 1 or 2?`;
                        break;
                    }
                }
                if (!productToAdd) {
                    const addStopWords = ['only', 'under', 'less', 'than', 'more', 'over', 'price', 'show', 'me', 'the', 'a', 'an', 'some', 'any', 'please', 'just', 'add', 'in', 'it', 'to', 'my', 'bag', 'cart', 'buy', 'purchase', 'want', 'looking', 'for', 'can', 'you', 'find', 'like', 'this', 'one', 'best', 'wali', 'wala', 'valey', 'item', 'product', 'piece', 'le', 'leta', 'hun', 'dal', 'do'];
                    let potentialNames = lowerMsg.replace(/£?\d+/g, '').split(/[\s,.]+/).filter(w => w.length > 2 && !addStopWords.includes(w));
                    if (potentialNames.length > 0) {
                        const regexP = potentialNames.join('|');
                        productToAdd = await Product.findOne({
                            $or: [
                                { nm: { $regex: regexP, $options: 'i' } },
                                { ct: { $regex: regexP, $options: 'i' } }
                            ]
                        });
                    }
                }
                if (!productToAdd && responseData.context.lastProducts && responseData.context.lastProducts.length > 0) {
                    productToAdd = await Product.findById(responseData.context.lastProducts[0]);
                }
                if (productToAdd) {
                    let quantity = 1;
                    if (/\b(?:qty|quantity|count)\s*(?:of|=|:)?\s*(\d+)\b/i.test(lowerMsg)) {
                        const qtyMatch = lowerMsg.match(/\b(?:qty|quantity)\s*(?:of|=|:)?\s*(\d+)\b/i);
                        if (qtyMatch) quantity = Math.min(10, Math.max(1, parseInt(qtyMatch[1], 10)));
                    } else if (/\b(\d+)\s*(?:pieces|items|copies|pairs|pkgs)\b/i.test(lowerMsg)) {
                        const pcsMatch = lowerMsg.match(/\b(\d+)\s*(?:pieces|items|copies|pairs|pkgs)\b/i);
                        if (pcsMatch) quantity = Math.min(10, Math.max(1, parseInt(pcsMatch[1], 10)));
                    }
                    const formattedProduct = {
                        ...productToAdd.toObject(),
                        _id: productToAdd._id.toString(), id: productToAdd._id.toString(),
                        name: productToAdd.nm, brand: 'SABLE', price: productToAdd.pr, category: productToAdd.ct, images: [productToAdd.img]
                    };
                    responseData.actions.push('add_to_cart');
                    responseData.data = { type: 'cart_action', product: formattedProduct, quantity };
                    responseData.message = `I've added ${quantity}x ${formattedProduct.name} to your bag.`;
                } else {
                    responseData.message = "Which piece would you like me to add to your bag? Please select an item or tell me its name (e.g. 'add Overshirt')!";
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
                    responseData.actions.push('remove_from_cart');
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
            case 'cancel_checkout':
                responseData.context.checkoutState = null;
                responseData.message = "Checkout has been cancelled. How else can I help you today?";
                break;
            case 'report_info':
            case 'report_issue':
                responseData.message = "I can help you file a priority issue report directly with our Mayfair Client Services team. Please fill out the report form below:";
                responseData.data = { type: 'contact_form' };
                break;
            case 'process_address':
                if (!isValidAddress(message)) {
                    responseData.context.checkoutState = 'awaiting_address';
                    responseData.message = "Please provide a complete shipping address with house/street number, area, and city (e.g. '14 Bruton Street, Mayfair, London W1J 6LX'). Say 'cancel' to exit checkout.";
                    responseData.data = { type: 'address_form' };
                } else {
                    responseData.context.checkoutState = 'awaiting_payment';
                    responseData.context.shippingAddress = message;
                    responseData.message = "Got it! Your delivery address is saved. Now, please enter your payment method (Credit/Debit Card, Apple Pay, PayPal, or Cash on Delivery).";
                    responseData.data = { type: 'payment_form' };
                }
                break;
            case 'process_payment':
                if (!isValidPayment(message)) {
                    responseData.context.checkoutState = 'awaiting_payment';
                    responseData.message = "Please specify a valid payment method: Credit/Debit Card, Apple Pay, PayPal, or Cash on Delivery (COD). Say 'cancel' to exit checkout.";
                    responseData.data = { type: 'payment_form' };
                } else {
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
                }
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
                    if (elapsedMins >= 20) return 'In Transit';
                    if (elapsedMins >= 10) return 'Processing';
                    return 'Order Placed';
                };
                const getArrivalEstimate = (orderObj) => {
                    if (!orderObj || !orderObj.createdAt) return '3-5 Business Days via DHL Express';
                    const elapsedMins = Math.floor((new Date() - new Date(orderObj.createdAt)) / (1000 * 60));
                    if (elapsedMins >= 40) return 'Delivered Today at Mayfair Address';
                    if (elapsedMins >= 30) return 'Arriving Today (Out for Courier Delivery)';
                    if (elapsedMins >= 20) return 'Arriving in 1 Business Day (In Transit via DHL)';
                    if (elapsedMins >= 10) return 'Arriving in 2-3 Business Days (Processing at Atelier)';
                    return 'Arriving in 3-5 Business Days (Order Placed)';
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
                        const arrivalEst = getArrivalEstimate(order);
                        order.trackingStatus = dynamicStatus;
                        responseData.data = { type: 'order', item: order };
                        responseData.message = `Live Order Status #${activeId}:\n\n• Current Status: "${dynamicStatus}"\n• Dispatch Hub: SABLE London Fulfillment Centre\n• Estimated Arrival: ${arrivalEst}`;
                    } else {
                        responseData.message = `I couldn't find an order with tracking ID ${tId}. Please check your tracking number and try again.`;
                    }
                } else {
                    const userEmail = authenticatedUser?.email || context?.userId;
                    const latestOrder = await Order.findOne(userEmail && userEmail !== 'guest' ? { userId: userEmail } : {}).sort({ createdAt: -1 });
                    if (latestOrder) {
                        const activeId = latestOrder.orderId || latestOrder.trackingNumber;
                        const dynamicStatus = getDynamicStatus(latestOrder);
                        const arrivalEst = getArrivalEstimate(latestOrder);
                        latestOrder.trackingStatus = dynamicStatus;
                        responseData.data = { type: 'order', item: latestOrder };
                        responseData.message = `Live Order Status #${activeId}:\n\n• Current Status: "${dynamicStatus}"\n• Dispatch Hub: SABLE London Fulfillment Centre\n• Estimated Arrival: ${arrivalEst}`;
                    } else {
                        responseData.message = "Standard SABLE delivery takes 3-5 business days via DHL Express. You can track your exact parcel anytime by entering your Order ID (e.g., SBL-12345).";
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
            case 'vip_discount': {
                responseData.data = {
                    type: 'vip_discount',
                    code: 'SABLE-VIP15',
                    discountPercent: 15
                };
                responseData.message = "As a valued guest of SABLE, I've unlocked an exclusive 15% VIP discount code for your order!";
                break;
            }
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
            case 'out_of_scope':
                responseData.message = "As SABLE's AI Concierge, I specialize in luxury fashion, tailoring, order tracking, and client assistance. While I can't write code or forecast weather, I can certainly help you look stunning for any occasion! What fashion pieces can I curate for you today?";
                break;
            case 'curate_recommendation': {
                const curated = await Product.find({}).sort({ _id: -1 }).limit(1);
                if (curated.length > 0) {
                    const prod = curated[0];
                    const formatted = [{
                        ...prod.toObject(),
                        _id: prod._id.toString(), id: prod._id.toString(),
                        name: prod.nm, brand: 'SABLE', price: prod.pr, category: prod.ct, images: [prod.img]
                    }];
                    responseData.data = { type: 'products', items: formatted, hint: "Stylist Pick: Handselected by ApBot Concierge." };
                    responseData.message = `If I were in your place, I would choose the ${prod.nm} (£${prod.pr}). It offers unparalleled versatility, heavy 400gsm organic cotton twill structure, and timeless Mayfair styling:`;
                } else {
                    responseData.message = "I would recommend exploring our premier outerwear collection for timeless style.";
                }
                break;
            }
            case 'surprise_me': {
                const allProds = await Product.find({});
                if (allProds.length > 0) {
                    const randomItem = allProds[Math.floor(Math.random() * allProds.length)];
                    const formatted = [{
                        ...randomItem.toObject(),
                        _id: randomItem._id.toString(), id: randomItem._id.toString(),
                        name: randomItem.nm, brand: 'SABLE', price: randomItem.pr, category: randomItem.ct, images: [randomItem.img]
                    }];
                    responseData.data = { type: 'products', items: formatted, hint: "Surprise Selection from SABLE Mayfair Atelier." };
                    responseData.message = `Here is a surprise luxury selection curated just for you — the ${randomItem.nm}:`;
                }
                break;
            }
            case 'cheap_products': {
                const cheapProds = await Product.find({}).sort({ pr: 1 }).limit(3);
                const formatted = cheapProds.map(p => ({
                    ...p.toObject(),
                    _id: p._id.toString(), id: p._id.toString(),
                    name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                }));
                responseData.data = { type: 'products', items: formatted, hint: "Sorted by value & accessible pricing." };
                responseData.message = "Here are our most accessible luxury pieces sorted by exceptional value:";
                break;
            }
            case 'winter_collection': {
                const winterProds = await Product.find({
                    $or: [
                        { ct: /outerwear|knitwear/i },
                        { nm: /jacket|coat|overshirt|sweater|cardigan/i }
                    ]
                }).limit(3);
                const formatted = winterProds.map(p => ({
                    ...p.toObject(),
                    _id: p._id.toString(), id: p._id.toString(),
                    name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                }));
                responseData.data = { type: 'products', items: formatted, hint: "Winter Essentials: Heavy organic twill & cashmere." };
                responseData.message = "Here is our Winter Collection featuring heavy 400gsm organic cotton twill outerwear and cashmere knitwear:";
                break;
            }
            case 'office_collection': {
                const officeProds = await Product.find({
                    $or: [
                        { ct: /tailoring|essentials|outerwear/i },
                        { nm: /blazer|trousers|overshirt|shirt|tailored/i }
                    ]
                }).limit(3);
                const formatted = officeProds.map(p => ({
                    ...p.toObject(),
                    _id: p._id.toString(), id: p._id.toString(),
                    name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                }));
                responseData.data = { type: 'products', items: formatted, hint: "Office & Formal Wear: Precision tailoring." };
                responseData.message = "Here are our premier tailoring and structured overshirts crafted for office and formal professional wear:";
                break;
            }
            case 'date_collection': {
                const dateProds = await Product.find({}).sort({ pr: -1 }).limit(2);
                const formatted = dateProds.map(p => ({
                    ...p.toObject(),
                    _id: p._id.toString(), id: p._id.toString(),
                    name: p.nm, brand: 'SABLE', price: p.pr, category: p.ct, images: [p.img]
                }));
                responseData.data = { type: 'products', items: formatted, hint: "Date Night Ensemble: Sleek elegance." };
                responseData.message = "Here are our sleekest date-night recommendations curated for effortless sophistication:";
                break;
            }
            case 'stylist_advice': {
                responseData.message = "Every SABLE garment is crafted in strictly limited runs of 100 numbered pieces using 400gsm organic twill and pure cashmere. It is 100% worth the investment for lifetime durability and timeless style.";
                break;
            }
            case 'checkout_help':
            case 'payment_help':
            case 'payment_info':
                responseData.message = "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal, and Klarna 3-part interest-free installment payments. All transactions are protected via 256-bit SSL encryption.";
                break;
            case 'delivery_address':
                responseData.message = "During checkout, you can enter your shipping address directly in chat or use our secure checkout page.";
                break;
            case 'shipping_info':
                responseData.message = "SABLE ships worldwide via DHL Express. Standard delivery takes 2-4 business days (Complimentary over £150). All import duties and taxes are fully calculated and included at checkout.";
                break;
            case 'return_product':
            case 'return_policy':
                responseData.message = "We operate a 30-day complimentary return policy for unworn items in original condition with security tags attached. You can initiate a return from your account dashboard or by contacting concierge@sable-couture.com to receive a prepaid DHL shipping label.";
                break;
            case 'authenticity_info':
                responseData.message = "Every SABLE piece is 100% authentic, handcrafted in strictly limited runs of 100 individually numbered units at our London Atelier. Sold-out pieces are rarely restocked to preserve exclusivity.";
                break;
            case 'care_info':
                responseData.message = "Our garments are crafted from 100% organic cotton twill, merino wool, and cashmere. We recommend professional dry cleaning or delicate hand washing in cold water with specialized wool detergent.";
                break;
            case 'complaint':
            case 'contact_support':
                responseData.message = "Our Mayfair Client Services team is here for you. You can reach us via email at concierge@sable-couture.com, telephone at +44 20 7946 0912, or visit our atelier at 14 Bruton Street, Mayfair, London W1J 6LX.";
                break;
            case 'faq':
                responseData.message = "Here is our SABLE intelligence guide: Standard global shipping takes 2-4 business days (free over £150). We offer 30-day free returns and limited numbered runs of 100 pieces per drop. How else can I assist you?";
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
