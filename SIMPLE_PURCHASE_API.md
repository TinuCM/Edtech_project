# ✅ Super Simple Purchase API - One Endpoint!

## 🎯 Purchase a Subject - Single Endpoint

I've simplified the payment system to just **ONE endpoint** that does everything!

---

## 📌 The Only Endpoint You Need

```
POST /api/v1/payment/purchase-subject
```

**That's it!** Just send the subjectId and it unlocks instantly.

---

## 🚀 How to Use in Postman

### **Step 1: Get Subject ID**

**Request:**
- Method: `GET`
- URL: `http://localhost:5001/api/v1/subject/my-subjects`
- Header: `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "subjects": [
    {
      "_id": "67760abc123...",  // ← Copy this
      "name": "Mathematics",
      "locked": true
    }
  ]
}
```

---

### **Step 2: Purchase (Unlock) the Subject**

**Request:**
- Method: `POST`
- URL: `http://localhost:5001/api/v1/payment/purchase-subject`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "subjectId": "67760abc123..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subject purchased and unlocked successfully!",
  "subject": {
    "id": "67760abc123...",
    "name": "Mathematics",
    "price": 499,
    "locked": false,
    "purchaseDate": "2025-12-29T16:00:00.000Z",
    "transactionId": "TXN_1735484400000"
  }
}
```

**Done!** ✅ The subject is now unlocked!

---

### **Step 3: Verify It's Unlocked**

**Request:**
- Method: `GET`
- URL: `http://localhost:5001/api/v1/subject/my-subjects`
- Header: `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "subjects": [
    {
      "_id": "67760abc123...",
      "name": "Mathematics",
      "locked": false,  // ✅ Now unlocked!
      "purchaseDate": "2025-12-29T16:00:00.000Z"
    }
  ]
}
```

---

## 📋 Complete Flow

```
1. GET /my-subjects
   → See locked subjects

2. POST /purchase-subject
   Body: { "subjectId": "..." }
   → Unlock instantly

3. GET /my-subjects
   → Confirm unlocked ✅
```

---

## ⚠️ Error Responses

### Subject Not Found (404)
```json
{
  "message": "Subject not found",
  "subjectId": "67760abc123..."
}
```
**Fix**: Check the subjectId is correct

### Already Purchased (400)
```json
{
  "message": "Subject already purchased",
  "subject": "Mathematics",
  "purchaseDate": "2025-12-29T16:00:00.000Z"
}
```
**This is OK** - Subject is already unlocked!

### Missing Subject ID (400)
```json
{
  "message": "Subject ID is required"
}
```
**Fix**: Make sure you include `subjectId` in the body

---

## 🎯 Postman Setup

```
┌──────────────────────────────────────────────────────────────┐
│ POST http://localhost:5001/api/v1/payment/purchase-subject  │
├──────────────────────────────────────────────────────────────┤
│ Headers:                                                      │
│   Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...            │
│   Content-Type: application/json                             │
├──────────────────────────────────────────────────────────────┤
│ Body (raw JSON):                                             │
│   {                                                           │
│     "subjectId": "67760abc123..."                            │
│   }                                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎉 Benefits

✅ **Super simple** - Just one endpoint  
✅ **Instant unlock** - No order creation needed  
✅ **Direct** - Send subjectId, get unlocked  
✅ **Clear errors** - Easy to debug  

---

## 💡 Other Useful Endpoints

### Get My Purchases
```
GET /api/v1/payment/my-purchases
```
Returns all subjects you've purchased.

### Check if Subject is Unlocked
```
GET /api/v1/payment/check-unlock/:subjectId
```
Check if a specific subject is unlocked.

---

## 🧪 Testing Steps

1. **Login** → Get token
2. **Get subjects** → Copy a locked subject ID
3. **Purchase** → POST to `/purchase-subject` with subjectId
4. **Check again** → Subject should be unlocked!

**That's it!** Super simple! 🚀

