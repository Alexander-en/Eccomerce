# E-Commerce Project - Complete Workflow Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Data Flow](#architecture--data-flow)
4. [Key Concepts Explained](#key-concepts-explained)
5. [Complete Workflow Breakdown](#complete-workflow-breakdown)
6. [Database Schema](#database-schema)
7. [Component Hierarchy](#component-hierarchy)
8. [Best Practices & Learning Points](#best-practices--learning-points)

---

## Project Overview

This is a **full-stack Next.js e-commerce application** with the following features:
- User Authentication (Register, Login)
- Product Catalog (Browse, Filter by Category)
- Shopping Cart Management
- Order Checkout & Payment (Stripe Integration)
- User Account & Order History
- Admin Panel (Add/Edit/Delete Products, Manage Orders)

**Key Architecture**: Client-Server with MongoDB Database and JWT Authentication

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **State Management** | React Context API |
| **Payment** | Stripe API |
| **Validation** | Joi |
| **Storage** | Cookies (js-cookie), LocalStorage |

---

## Architecture & Data Flow

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages (UI)  ←→  Components  ←→  Context (Global State)         │
│                                      ↓                            │
│                              useContext Hook                     │
└──────────────────────────────────────┬──────────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ↓                                  ↓
            ┌─────────────────────┐          ┌──────────────────────┐
            │  localStorage       │          │    Cookies           │
            │  - user data        │          │  - JWT Token         │
            │  - cart items       │          │  - Auth Header       │
            └─────────────────────┘          └──────────────────────┘
                      │                                  │
                      └────────────────┬─────────────────┘
                                       ↓
                    ┌──────────────────────────────────┐
                    │   Services (API Calls)           │
                    │  - register/index.js             │
                    │  - login/index.js                │
                    │  - product/index.js              │
                    │  - cart/index.js                 │
                    │  - order/index.js                │
                    └──────────────────────────────────┘
                                       ↓
                    ┌──────────────────────────────────┐
                    │   API Routes (Backend)           │
                    │  - /api/register                 │
                    │  - /api/login                    │
                    │  - /api/cart/*                   │
                    │  - /api/order/*                  │
                    │  - /api/admin/*                  │
                    └──────────────────────────────────┘
                                       ↓
        ┌──────────────────────────────────────────────────────┐
        │        Middleware (AuthUser)                         │
        │  - Validates JWT Token                              │
        │  - Checks user permissions                          │
        │  - Returns user info or false                       │
        └──────────────────────────────────────────────────────┘
                                       ↓
                    ┌──────────────────────────────────┐
                    │   MongoDB Database               │
                    │  - Users Collection              │
                    │  - Products Collection           │
                    │  - Cart Collection               │
                    │  - Orders Collection             │
                    │  - Addresses Collection          │
                    └──────────────────────────────────┘
```

---

## Key Concepts Explained

### 1. **Cookies** 🍪

**What are Cookies?**
- Small text files stored on the **browser** that are automatically sent with every HTTP request
- Persist across browser sessions (until expiration or manual deletion)
- Limited storage (~4KB per cookie)

**How Used in This Project:**
```javascript
// Setting cookie (after login)
Cookies.set('token', jwtToken, { expires: 1 }); // expires in 1 day

// Getting cookie
const token = Cookies.get("token");

// Removing cookie (on logout)
Cookies.remove('token');
```

**Use Case:**
- Store JWT token for authentication
- Automatically included in API headers for protected routes
- Survives page refresh → maintains login state

---

### 2. **JWT Tokens** 🔐

**What is JWT?**
- JSON Web Token: A compact, self-contained way to transmit information between parties
- Structure: `header.payload.signature`
- Encoded but NOT encrypted (readable if decoded, but can't be tampered with)

**Flow in This Project:**

```javascript
// 1. User logs in with email/password
// 2. Backend validates credentials using bcrypt comparison

const checkPassword = await compare(password, checkUser.password);

// 3. Backend creates JWT token with user info
const token = jwt.sign(
  {
    id: checkUser._id,
    email: checkUser.email,
    role: checkUser.role
  },
  process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  { expiresIn: '1d' }  // Token valid for 1 day
);

// 4. Token sent to frontend
return NextResponse.json({
  success: true,
  finalResult: { token, user }
});

// 5. Frontend stores in cookie
Cookies.set('token', token);

// 6. Frontend includes in protected API calls
Authorization: `Bearer ${Cookies.get("token")}`

// 7. Backend extracts & verifies token
const token = req.headers.get("authorization")?.split(" ")[1];
const extractAuthUserInfo = jwt.verify(token, jwtSecret);
```

**Benefits:**
- Stateless: No need to store sessions on server
- Self-contained: Contains user info, no database lookup needed
- Secure: Signed so can't be forged
- Expires: Automatically invalid after expiration time

---

### 3. **localStorage** 💾

**What is localStorage?**
- Browser storage that persists even after closing the browser
- Larger capacity than cookies (~5-10MB)
- NOT sent with HTTP requests automatically
- Slower than cookies (synchronous)

**How Used in This Project:**

```javascript
// Storing user data after login
localStorage.setItem('user', JSON.stringify({
  email: user.email,
  name: user.name,
  _id: user._id,
  role: user.role
}));

// Storing cart items
localStorage.setItem('cartItems', JSON.stringify(cartArray));

// Retrieving on app startup
const userData = JSON.parse(localStorage.getItem('user')) || null;
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Clearing on logout
localStorage.clear();
```

**Use Cases:**
- Store complete user object (for UI display without API call)
- Cache cart items locally before checkout
- Maintain state across browser sessions
- Avoid repeated API calls on page reload

---

### 4. **React Hooks** 🎣

**What are Hooks?**
- Functions that let you "hook into" React features
- Must be called at top level of component (not in loops/conditions)
- Only in React functional components

#### **useState**
Manages component-level state

```javascript
const [showNavModal, setShowNavModal] = useState(false);
// showNavModal = current value
// setShowNavModal = function to update value
// false = initial value
```

#### **useEffect**
Runs side effects after component renders

```javascript
useEffect(() => {
  // This runs AFTER component renders
  const token = Cookies.get("token");
  if (token) {
    setIsAuthUser(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  } else {
    setIsAuthUser(false);
    setUser(null);
  }
  setIsHydrated(true);
}, []); // [] = runs only once on mount
```

#### **useContext**
Accesses global state from Context

```javascript
const { user, isAuthUser, setUser, setIsAuthUser } = useContext(GlobalContext);
// Access global state without prop drilling
```

#### **useRouter** (Next.js specific)
Navigation between pages

```javascript
const router = useRouter();
router.push('/checkout'); // Navigate to checkout page
router.back(); // Go back to previous page
```

#### **usePathname** (Next.js specific)
Gets current page path

```javascript
const pathName = usePathname();
if (protectedRoutes.includes(pathName) && !isAuthUser) {
  router.push('/login'); // Redirect if not authenticated
}
```

---

### 5. **API (Application Programming Interface)** 🌐

**What is API?**
- Set of rules for requesting data/services from server
- Request-Response pattern
- In Next.js: API routes in `/api` folder automatically become endpoints

**HTTP Methods Used:**
- **GET**: Retrieve data (read-only)
- **POST**: Create new data
- **PUT**: Update existing data
- **DELETE**: Remove data

**API Flow in This Project:**

```javascript
// 1. Frontend Service (Client-side)
// File: src/services/login/index.js
export const login = async (formData) => {
  const response = await fetch('/api/login', {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(formData)
  });
  return await response.json();
};

// 2. Frontend calls service
// File: src/app/login/page.js (or in context)
const response = await login({ email, password });
if (response.success) {
  Cookies.set('token', response.finalResult.token);
  localStorage.setItem('user', JSON.stringify(response.finalResult.user));
}

// 3. Backend API receives request
// File: src/app/api/login/route.js
export async function POST(req) {
  const { email, password } = await req.json();
  const checkUser = await User.findOne({ email });
  const checkPassword = await compare(password, checkUser.password);
  
  if (checkPassword) {
    const token = jwt.sign({ id: checkUser._id, ... }, JWT_SECRET);
    return NextResponse.json({ success: true, finalResult: { token, user } });
  }
}
```

**Protected API Pattern:**

```javascript
// API Route with authentication
export async function POST(req) {
  // 1. Connect to database
  await connectToDB();
  
  // 2. Verify user is authenticated
  const isAuthUser = await AuthUser(req);
  if (!isAuthUser) {
    return NextResponse.json({ success: false, message: "Not authenticated" });
  }
  
  // 3. Process request
  const data = await req.json();
  // ... do something with data
  
  // 4. Return response
  return NextResponse.json({ success: true, data: result });
}
```

---

### 6. **Services** 🔧

**What are Services?**
- Reusable functions that handle API communication
- Centralized place for all API calls
- Makes code DRY (Don't Repeat Yourself)
- Easy to mock for testing

**Service Pattern:**

```javascript
// File: src/services/cart/index.js
export const addToCart = async (formData) => {
  try {
    const res = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`  // Include token
      },
      body: JSON.stringify(formData)
    });
    return await res.json();
  } catch (e) {
    console.log(e);
  }
};
```

**Services in This Project:**
- `services/register/index.js`: Register new user
- `services/login/index.js`: Login user
- `services/product/index.js`: CRUD operations for products
- `services/cart/index.js`: Cart operations
- `services/order/index.js`: Order operations
- `services/address/index.js`: Address operations

---

### 7. **Components** 🧩

**What are Components?**
- Reusable UI building blocks
- Can be class or functional (we use functional)
- Receive props and render JSX
- Can have state and hooks

**Component Types in This Project:**

**Page Components** (Full pages)
```javascript
// File: src/app/page.js
export default function Home() {
  return <div>Home Page</div>;
}
```

**Functional Components** (Reusable UI elements)
```javascript
// File: src/components/navbar/index.js
export default function Navbar() {
  const { isAuthUser, user } = useContext(GlobalContext);
  
  return (
    <nav>
      {isAuthUser && <span>Welcome, {user.name}</span>}
    </nav>
  );
}
```

**Component Hierarchy:**

```
RootLayout (with GlobalState Provider)
├── Navbar
│   ├── NavItems
│   └── ActionButtons
├── CartModal
└── Main Content
    ├── pages/
    │   ├── login/page.js
    │   ├── register/page.js
    │   ├── checkout/page.js
    │   ├── cart/page.js
    │   ├── orders/page.js
    │   └── admin-view/
    │       └── (admin pages)
    └── components/
        ├── CommonListing (Products list)
        │   ├── ProductTile
        │   └── ProductButtons
        ├── CommonCart (Cart items display)
        ├── CommonDetails (Product details)
        ├── FormElements
        │   ├── InputComponent
        │   ├── SelectComponent
        │   └── TileComponent
        └── Notification
```

---

## Complete Workflow Breakdown

### **1. User Registration Workflow**

```
User fills registration form
    ↓
Frontend calls: services/register/index.js → registerNewUser()
    ↓
POST /api/register with { name, email, password, role }
    ↓
Backend validates data using Joi schema
    ↓
Check if user already exists
    ├─ YES → Return error "User already exists"
    └─ NO → Continue
    ↓
Hash password using bcryptjs
    ↓
Create new User document in MongoDB
    ↓
Return success message
    ↓
Frontend shows success notification
    ↓
Redirect to login page
```

**Key Files:**
- Frontend: `src/app/register/page.js`
- Service: `src/services/register/index.js`
- Backend API: `src/app/api/register/route.js`
- Database: `src/models/user.js`

---

### **2. User Login Workflow**

```
User fills login form
    ↓
Frontend calls: services/login/index.js → login()
    ↓
POST /api/login with { email, password }
    ↓
Backend validates using Joi schema
    ↓
Find user by email in MongoDB
    ├─ NOT FOUND → Return "Account does not exist"
    └─ FOUND → Continue
    ↓
Compare submitted password with hashed password in DB
    ├─ MISMATCH → Return "Incorrect Password"
    └─ MATCH → Continue
    ↓
Create JWT token with user info { id, email, role }
    ↓
Return token + user data to frontend
    ↓
Frontend stores:
    ├── Token in Cookies
    └── User data in localStorage
    ↓
Frontend sets isAuthUser = true in Context
    ↓
Redirect to home page
```

**Key Files:**
- Frontend: `src/app/login/page.js`
- Service: `src/services/login/index.js`
- Backend API: `src/app/api/login/route.js`
- Middleware: `src/middleware/AuthUser.js` (used for verification)

**JWT Token Flow:**
```javascript
// Backend creates token
const token = jwt.sign(
  { id: checkUser._id, email: checkUser.email, role: checkUser.role },
  process.env.JWT_SECRET || "default_secret_key",
  { expiresIn: '1d' }
);

// Frontend stores in cookie
Cookies.set('token', token);

// Frontend sends with protected requests
Authorization: `Bearer ${Cookies.get("token")}`

// Backend extracts and verifies
const token = req.headers.get("authorization")?.split(" ")[1];
const extractAuthUserInfo = jwt.verify(token, jwtSecret);
```

---

### **3. Product Browsing Workflow**

```
User lands on homepage or product page
    ↓
Frontend fetches products by category
    ↓
GET /api/client/product-by-category
    ↓
Backend queries Product collection filtered by category
    ↓
Return products array to frontend
    ↓
Frontend renders ProductTile components in CommonListing
    ↓
User can:
    ├── View product details
    ├── Filter by category
    └── Add to cart
```

**Database Query:**
```javascript
// File: src/app/api/client/product-by-category/route.js
const getProductsByCategory = await Product.find({ 
  category: categoryType 
});
```

**Component Flow:**
```
Page Component
    ↓
Fetches products using ProductService
    ↓
Passes to CommonListing component
    ↓
CommonListing maps through products
    ↓
Renders ProductTile for each product
    ↓
User clicks product
    └── Navigate to [details]/page.js with product ID
```

---

### **4. Shopping Cart Workflow**

```
User clicks "Add to Cart" on product
    ↓
Frontend calls: services/cart/index.js → addToCart()
    ↓
POST /api/cart/add-to-cart with { userID, productID }
    ├── Include JWT token in Authorization header
    ↓
Backend runs AuthUser middleware
    ├─ Token invalid/missing → Return "Not authenticated"
    └─ Token valid → Continue
    ↓
Backend validates data using Joi
    ↓
Check if product already in user's cart
    ├─ YES → Return error "Product already in cart"
    └─ NO → Continue
    ↓
Create Cart document in MongoDB
    ├── userID (reference to User)
    ├── productID (reference to Product)
    ├── quantity (default 1)
    └── timestamps
    ↓
Return success to frontend
    ↓
Frontend updates cartItems in localStorage
    ↓
Frontend updates GlobalContext cartItems state
    ↓
UI shows updated cart count in navbar
```

**Cart Document Structure:**
```javascript
{
  userID: ObjectId("user_id"),      // Link to User
  productID: ObjectId("product_id"), // Link to Product
  quantity: 1,
  createdAt: Date,
  updatedAt: Date
}
```

**State Management:**
```javascript
// Context stores cart items
const [cartItems, setCartItems] = useState(null);

// Also stored in localStorage
localStorage.setItem('cartItems', JSON.stringify(cartArray));

// Fetched when page loads
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
```

**Cart Operations:**
```javascript
// Get all cart items for user
GET /api/cart/all-cart-items?id={userID}

// Delete from cart
DELETE /api/cart/delete-from-cart?id={cartItemID}

// Update quantity (implied through UI)
```

---

### **5. Checkout & Order Workflow**

```
User navigates to checkout page
    ↓
Protected route check:
    ├─ Not authenticated → Redirect to login
    └─ Authenticated → Continue
    ↓
Frontend loads:
    ├── User's saved addresses
    └── Cart items
    ↓
User fills checkout form:
    ├── Select/add shipping address
    ├── Select payment method
    └── Review order total
    ↓
User clicks "Proceed to Payment"
    ↓
Frontend creates order with:
    ├── userID
    ├── orderItems (array of cart items)
    ├── shippingAddress
    ├── paymentMethod (Stripe)
    ├── totalPrice
    └── isPaid: false (initially)
    ↓
POST /api/order/create-order with order data
    ├── Include JWT token
    ↓
Backend validates and saves Order document
    ↓
Backend returns Stripe payment intent
    ↓
Frontend redirects to Stripe checkout
    ↓
User completes payment in Stripe
    ↓
Stripe webhook confirms payment
    ↓
Backend updates order: isPaid = true, paidAt = Date
    ↓
Frontend redirects to order confirmation
    ↓
Redirect to orders page showing new order
```

**Order Document Structure:**
```javascript
{
  user: ObjectId("user_id"),        // Link to User
  orderItems: [
    {
      qty: 2,
      product: ObjectId("product_id")
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    postalCode: "10001"
  },
  paymentMethod: "Stripe",
  totalPrice: 250.99,
  isPaid: true,                     // Updated after payment
  paidAt: Date,                     // Timestamp of payment
  isProcessing: false,              // Order status
  createdAt: Date,
  updatedAt: Date
}
```

**Address Management:**
- User can add/edit/delete addresses
- Saved in separate Address collection
- Displayed as options during checkout

---

### **6. Admin Product Management Workflow**

```
Admin (role: "admin") logs in
    ↓
Protected route check: `/admin-view`
    ├─ User role != "admin" → Redirect to unauthorized
    └─ User role = "admin" → Continue
    ↓
Admin can:
    
    A. ADD NEW PRODUCT:
        ├── Fill product form
        ├── POST /api/admin/add-product
        ├── Backend validates and creates Product
        └── Frontend shows success
    
    B. VIEW ALL PRODUCTS:
        ├── GET /api/admin/all-products
        ├── Backend returns all Product documents
        └── Frontend displays with edit/delete buttons
    
    C. UPDATE PRODUCT:
        ├── Click edit on product
        ├── Fill update form
        ├── PUT /api/admin/update-product
        ├── Backend validates and updates Product
        └── Frontend refreshes product list
    
    D. DELETE PRODUCT:
        ├── Click delete on product
        ├── DELETE /api/admin/delete-product?id={id}
        ├── Backend deletes Product document
        └── Frontend refreshes product list
```

**Product Document Structure:**
```javascript
{
  name: "T-Shirt",
  description: "Cotton t-shirt",
  price: 29.99,
  category: "men",          // Filter: men, women, kids
  sizes: ["S", "M", "L", "XL"],
  deliveryInfo: "Ships in 2-3 days",
  onSale: "yes",            // Highlight sale items
  priceDrop: 5,             // Discount amount
  imageUrl: "https://...",
  createdAt: Date,
  updatedAt: Date
}
```

---

### **7. Order Management (Admin) Workflow**

```
Admin goes to Admin Order Management
    ↓
GET /api/admin/orders/get-all-orders
    ↓
Backend returns all orders from database
    ↓
Frontend displays orders with:
    ├── User name
    ├── Order total
    ├── Order date
    ├── Payment status
    └── Processing status
    ↓
Admin can update order status
    ├── PUT /api/admin/orders/update-order
    ├── Backend updates isProcessing flag
    └── Frontend refreshes order list
    ↓
Admin can view order details
    ├── GET /api/order/order-details?id={orderId}
    └── Backend returns complete order with product details
```

---

## Database Schema

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: String ("user" or "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  sizes: Array,
  deliveryInfo: String,
  onSale: String,
  priceDrop: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Cart Collection**
```javascript
{
  _id: ObjectId,
  userID: ObjectId (ref: User),
  productID: ObjectId (ref: Product),
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderItems: [
    {
      qty: Number,
      product: ObjectId (ref: Product)
    }
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    country: String,
    postalCode: String
  },
  paymentMethod: String,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isProcessing: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Address Collection**
```javascript
{
  _id: ObjectId,
  userID: ObjectId (ref: User),
  fullName: String,
  address: String,
  city: String,
  country: String,
  postalCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Component Hierarchy

```
App Layout
│
├─ RootLayout (wraps everything with GlobalState)
│
├─ Navbar
│  ├─ NavItems (navigation menu)
│  │  └─ Maps through navOptions or adminNavOptions
│  │
│  └─ ActionButtons
│     ├─ Login Button (if not authenticated)
│     └─ Logout Button (if authenticated)
│
├─ CartModal (overlay showing cart preview)
│
└─ Main Content Area
   │
   ├─ Public Pages:
   │  ├─ Home (/)
   │  ├─ Product Listing (/product/listing/[category])
   │  ├─ Product Details (/product/[details])
   │  ├─ Login (/login)
   │  ├─ Register (/register)
   │  └─ Unauthorized (/Unauthorized-Page)
   │
   ├─ Protected Pages (require isAuthUser = true):
   │  ├─ Cart (/cart)
   │  │  └─ CommonCart (displays cart items)
   │  │     └─ ProductButtons (quantity, remove)
   │  │
   │  ├─ Checkout (/checkout)
   │  │  └─ AddressForm, PaymentForm
   │  │
   │  ├─ Account (/account)
   │  │  └─ User profile info
   │  │
   │  ├─ Orders (/orders)
   │  │  ├─ Order List (CommonListing)
   │  │  └─ Order Details (/orders/[order-details])
   │  │
   │  └─ Admin Pages (require role = "admin"):
   │     ├─ Admin View (/admin-view)
   │     ├─ Add Product (/admin-view/add-product)
   │     │  └─ ProductForm
   │     ├─ All Products (/admin-view/all-products)
   │     │  └─ CommonListing (admin mode)
   │     └─ Order Management
   │
   └─ Shared Components:
      ├─ CommonListing (displays products/orders as grid)
      │  └─ ProductTile (individual product card)
      │
      ├─ CommonDetails (product detail page)
      │
      ├─ CommonModal (generic modal overlay)
      │
      ├─ FormElements
      │  ├─ InputComponent (text input)
      │  ├─ SelectComponent (dropdown)
      │  └─ TileComponent (choice selector)
      │
      ├─ Loader
      │  └─ ComponentLevelLoader (loading spinner)
      │
      └─ Notification (toast messages)
         └─ React-Toastify
```

---

## Best Practices & Learning Points

### **1. Authentication Security**
✅ **DO:**
- Hash passwords with bcryptjs (salt rounds: 10-12)
- Use JWT tokens for stateless authentication
- Include expiration time on tokens (e.g., '1d')
- Validate tokens on every protected route
- Store sensitive data (passwords) hashed, never plain text

❌ **DON'T:**
- Send passwords in responses
- Store passwords in localStorage or cookies
- Use weak secrets for JWT signing
- Trust token expiration validation only (always verify signature)

### **2. State Management**
✅ **DO:**
- Use React Context for global state (authentication, user, cart)
- Use localStorage for persistence across sessions
- Use useState for local component state
- Keep Context focused (don't store everything)

❌ **DON'T:**
- Prop drill deeply nested data
- Overuse Context for frequently changing data
- Store sensitive data in localStorage
- Mix local state with global state unnecessarily

### **3. API Security**
✅ **DO:**
- Validate input data on backend (using Joi)
- Verify authentication tokens before processing
- Use HTTPS in production
- Implement rate limiting
- Return appropriate HTTP status codes

❌ **DON'T:**
- Trust frontend validation alone
- Expose database errors to frontend
- Log sensitive information
- Use default secrets in production

### **4. Database Design**
✅ **DO:**
- Use ObjectId references between collections (relationships)
- Add timestamps (createdAt, updatedAt) to all documents
- Use proper data types (String, Number, Date, Array)
- Index frequently queried fields

❌ **DON'T:**
- Embed collections deeply (avoid subdocuments when not needed)
- Store unrelated data in same collection
- Forget about data validation

### **5. Component Design**
✅ **DO:**
- Keep components small and focused
- Use meaningful component names
- Pass data via props (or Context for global)
- Extract logic into services/hooks

❌ **DON'T:**
- Make components too large (>300 lines)
- Directly fetch API data in multiple components
- Couple components too tightly

### **6. Error Handling**
✅ **DO:**
- Use try-catch in async functions
- Return meaningful error messages
- Log errors for debugging
- Show user-friendly error notifications

❌ **DON'T:**
- Silently fail without logging
- Show technical error details to users
- Ignore error responses from API

### **7. Environment Variables**
✅ **DO:**
- Store secrets in .env files (not in code)
- Use defaults for development
- Different configs for dev/prod
- Never commit .env to version control

❌ **DON'T:**
- Hardcode API URLs
- Use production secrets in code
- Expose env files in git

---

## Development Workflow Summary

### **Local Development Setup**
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_public_key

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

### **Creating New Features**

**Example: Adding a new product filter**

1. **Database**: Check if filter field exists in Product schema
2. **API**: Create route `/api/client/product-by-[filter]`
3. **Service**: Add function to `services/product/index.js`
4. **Component**: Update listing component to show filter options
5. **State**: Add filter state to Context if global, or useState if local
6. **UI**: Add filter buttons/dropdown to page

### **Common Development Tasks**

**Adding a new authenticated endpoint:**
```javascript
// 1. Create route file: src/app/api/[resource]/[action]/route.js
export async function POST(req) {
  // 2. Authenticate
  const isAuthUser = await AuthUser(req);
  if (!isAuthUser) return NextResponse.json({ success: false });
  
  // 3. Validate input
  const { error } = schema.validate(data);
  if (error) return NextResponse.json({ success: false });
  
  // 4. Connect to DB
  await connectToDB();
  
  // 5. Process
  const result = await Model.create(data);
  
  // 6. Return response
  return NextResponse.json({ success: true, data: result });
}

// 7. Create service function
export const createResource = async (formData) => {
  const res = await fetch('/api/[resource]/[action]', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get("token")}`
    },
    body: JSON.stringify(formData)
  });
  return res.json();
};

// 8. Use in component
const { user } = useContext(GlobalContext);
const response = await createResource(data);
```

---

## Key Learnings for Future Projects

### **Architecture Decisions**
1. **Context API** is good for small-medium apps, consider Redux/Zustand for larger ones
2. **Next.js API Routes** provide backend without separate server
3. **MongoDB** with Mongoose is flexible for ecommerce with dynamic products
4. **JWT tokens** are ideal for mobile and decoupled frontends

### **Security Checklist**
- [ ] Hash all passwords with bcryptjs
- [ ] Validate all inputs server-side
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
- [ ] Add rate limiting on auth endpoints
- [ ] Use secure cookie options (httpOnly, Secure, SameSite)
- [ ] Implement logout to clear tokens

### **Performance Tips**
- Cache product listings with `cache: "no-store"`
- Use database connection pooling (configured in `connectToDB`)
- Implement pagination for large product lists
- Use Image optimization in Next.js
- Lazy load components if needed

### **Testing Considerations**
- Unit test services (mock fetch)
- Integration test API routes
- E2E test critical flows (auth, checkout)
- Test role-based access control

### **Deployment**
- Use Vercel for Next.js hosting
- Use MongoDB Atlas for database
- Set up environment variables in hosting provider
- Enable HTTPS
- Set up webhooks for Stripe payment confirmations
- Monitor logs and errors

---

## Quick Reference

| Concept | File Location | Purpose |
|---------|---------------|---------|
| Global State | `src/context/index.js` | Manage auth, user, cart globally |
| Auth Middleware | `src/middleware/AuthUser.js` | Verify JWT tokens |
| User Model | `src/models/user.js` | User schema |
| Register Service | `src/services/register/index.js` | Registration API call |
| Login Service | `src/services/login/index.js` | Login API call |
| Cart Service | `src/services/cart/index.js` | Cart operations |
| Product Service | `src/services/product/index.js` | Product operations |
| Order Service | `src/services/order/index.js` | Order operations |
| Database Connection | `src/database/index.js` | MongoDB connection pooling |
| Navbar | `src/components/navbar/index.js` | Navigation component |
| Cart Modal | `src/components/CartModal/index.js` | Cart preview modal |
| Common Listing | `src/components/CommonListing/index.js` | Product/Order list component |

---

**Created**: 2024
**Project Type**: Full-Stack E-Commerce with Next.js
**Database**: MongoDB
**Authentication**: JWT + Cookies

This document covers the complete architecture and workflows. Use it as a reference for understanding and building similar projects!
