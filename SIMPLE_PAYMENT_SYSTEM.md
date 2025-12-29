# Simple Payment System Documentation

## 📋 Overview

This is a simplified payment system using just **ONE model** to track user-subject relationships with a `locked` boolean field.

---

## 🗂️ Database Schema

### Models:

#### 1. **User** (`edtechusers`)
```javascript
{
  name: String,
  email: String,
  password: String,
  classno: Number,
  otp: String
}
```

#### 2. **Subject** (`subjects`)
```javascript
{
  classnumber: Number,
  name: String,
  price: Number (default: 0)
}
```

#### 3. **UserSubject** (`usersubjects`) - Main Payment Tracking Model
```javascript
{
  userId: ObjectId (ref: 'edtechusers'),
  subjectId: ObjectId (ref: 'subjects'),
  locked: Boolean (default: true),  // ⭐ Key field!
  purchaseDate: Date,
  transactionId: String,
  orderId: String,
  amount: Number
}
```

---

## 🔄 How It Works

### Initial State:
When a user is created, **UserSubject entries are automatically created** for ALL subjects in their class with `locked: true`.

### States:
- **UserSubject with `locked: true`** = Subject is locked 🔒
- **UserSubject with `locked: false`** = Subject is unlocked ✅

### Purchase Flow:

```
1. User registers
   → System automatically creates UserSubject entries for ALL subjects in their class
   → All locked: true (locked by default)
   ↓
2. User views subjects
   → Sees all subjects with locked status
   ↓
3. User clicks "Buy Now" on a locked subject
   → POST /api/v1/payment/create-order
   → Adds orderId to existing UserSubject entry
   ↓
4. User completes payment (via payment gateway)
   ↓
5. POST /api/v1/payment/verify
   → Sets locked: false in UserSubject
   → Adds transactionId and purchaseDate
   ↓
6. Subject is now unlocked! ✅
```

### When New Subject is Added:
```
Admin adds a new subject for Class 10
  ↓
System finds all users in Class 10
  ↓
Creates UserSubject entries for all those users
  → All with locked: true
  ↓
All Class 10 students now see the new subject as locked
```

### Access Control:

```
When user tries to access chapters:
  ↓
Check UserSubject for this user & subject
  ↓
If userSubject.locked == false
  → Allow access ✅
Else
  → Return 403 Forbidden 🔒
```

---

## 🔌 API Endpoints

### Payment Routes

#### 1. Create Order
```
POST /api/v1/payment/create-order
Body: { subjectId: "..." }
Auth: Required

Creates UserSubject entry with locked: true
Returns orderId for payment
```

#### 2. Verify Payment
```
POST /api/v1/payment/verify
Body: { orderId: "...", transactionId: "..." }
Auth: Required

Sets locked: false to unlock subject
```

#### 3. My Purchases
```
GET /api/v1/payment/my-purchases
Auth: Required

Returns all UserSubjects where locked: false
```

#### 4. Check Unlock Status
```
GET /api/v1/payment/check-unlock/:subjectId
Auth: Required

Returns { locked: true/false }
```

---

### Subject Routes

#### 1. Get Subjects by Class
```
GET /api/v1/subject/by-class/:classno
Auth: Required

Returns subjects with locked status for current user
```

#### 2. Get Single Subject
```
GET /api/v1/subject/:subjectId
Auth: Required

Returns subject with locked status
```

---

### Chapter Routes (Protected)

#### 1. Get Chapters by Subject
```
GET /api/v1/chapters/by-subject/:subjectId
Auth: Required

Returns 403 if subject is locked
Returns chapters if unlocked
```

#### 2. Get Single Chapter
```
GET /api/v1/chapters/:chapterId
Auth: Required

Returns 403 if subject is locked
Returns chapter if unlocked
```

---

## 📊 Database Queries

### Check if subject is unlocked:
```javascript
const userSubject = await UserSubject.findOne({ 
  userId, 
  subjectId 
});

const isUnlocked = userSubject && !userSubject.locked;
```

### Get all unlocked subjects for user:
```javascript
const unlockedSubjects = await UserSubject.find({ 
  userId, 
  locked: false 
}).populate("subjectId");
```

### Unlock a subject:
```javascript
await UserSubject.findOneAndUpdate(
  { userId, subjectId },
  { 
    locked: false,
    purchaseDate: new Date(),
    transactionId: "txn_123"
  },
  { upsert: true }
);
```

---

## 🎯 Advantages of This Approach

✅ **Simple**: Only ONE model tracks everything  
✅ **Clean**: No duplicate data in User model  
✅ **Scalable**: Easy to add more fields later  
✅ **Efficient**: Direct queries without array searches  
✅ **Clear**: Boolean `locked` field is easy to understand  

---

## 🔍 Example Scenarios

### Scenario 1: New User Views Subjects
```javascript
// UserSubject collection is empty for this user
// All subjects show as locked: true (default)
```

### Scenario 2: User Purchases Math Subject
```javascript
// Before payment:
UserSubject: { userId: "user1", subjectId: "math", locked: true, orderId: "ORDER_123" }

// After payment verification:
UserSubject: { 
  userId: "user1", 
  subjectId: "math", 
  locked: false,  // ⭐ Changed!
  transactionId: "txn_456",
  purchaseDate: "2025-12-29"
}
```

### Scenario 3: User Tries to Access Chapters
```javascript
// Backend checks:
const userSubject = await UserSubject.findOne({ 
  userId: "user1", 
  subjectId: "math" 
});

if (!userSubject || userSubject.locked) {
  return res.status(403).json({ message: "Subject is locked" });
}

// Subject is unlocked, return chapters
return res.json({ chapters });
```

---

## 🚀 Frontend Integration

### Check Lock Status:
```javascript
const response = await fetch(`/api/v1/subject/by-class/10`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { subjects } = await response.json();

subjects.forEach(subject => {
  if (subject.locked) {
    // Show "Buy Now" button
  } else {
    // Show "View Chapters" button
  }
});
```

### Purchase Flow:
```javascript
// 1. Create order
const orderRes = await fetch('/api/v1/payment/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ subjectId })
});

const { order } = await orderRes.json();

// 2. Process payment (integrate payment gateway here)
// ...

// 3. Verify payment
const verifyRes = await fetch('/api/v1/payment/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    orderId: order.orderId,
    transactionId: 'payment_gateway_txn_id'
  })
});

// Subject is now unlocked!
```

---

## 📝 Summary

| Feature | Implementation |
|---------|---------------|
| **Track Purchases** | UserSubject model |
| **Lock Status** | `locked` boolean field |
| **Check Access** | Query UserSubject by userId & subjectId |
| **Unlock Subject** | Set `locked: false` |
| **Payment Info** | Stored in same UserSubject entry |

**Simple, clean, and efficient!** ✨

