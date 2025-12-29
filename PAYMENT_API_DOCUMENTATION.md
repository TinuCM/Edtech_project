# Payment and Subject Unlock System - API Documentation

## Overview
This system implements a payment mechanism where all subjects are locked initially. After purchasing a subject, the subject and all its chapters become unlocked for the user.

## Database Schema Changes

### Subject Model (`server/Models/Subject.js`)
- `classnumber`: Number - Class the subject belongs to
- `name`: String - Subject name
- `price`: Number - Price of the subject (default: 0)
- `timestamps`: Automatically tracks createdAt and updatedAt

### User Model (`server/Models/User.js`)
Added:
- `purchasedSubjects`: Array of purchased subjects
  - `subjectId`: Reference to Subject
  - `purchaseDate`: Date of purchase

### Purchase Model (`server/Models/Purchase.js`) - NEW
- `userId`: Reference to User
- `subjectId`: Reference to Subject
- `amount`: Purchase amount
- `paymentStatus`: 'pending' | 'completed' | 'failed'
- `transactionId`: Payment gateway transaction ID
- `orderId`: Unique order identifier
- `timestamps`: Automatically tracks createdAt and updatedAt

---

## API Endpoints

### Payment Routes (`/api/v1/payment/`)

#### 1. Create Payment Order
**POST** `/api/v1/payment/create-order`
- **Auth Required**: Yes (requireLogin middleware)
- **Body**: 
  ```json
  {
    "subjectId": "subject_object_id"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "orderId": "ORDER_1234567890_abcd1234",
      "amount": 499,
      "currency": "INR",
      "subjectName": "Mathematics",
      "purchaseId": "purchase_object_id"
    }
  }
  ```
- **Purpose**: Creates a pending order for payment processing

#### 2. Verify Payment
**POST** `/api/v1/payment/verify`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "orderId": "ORDER_1234567890_abcd1234",
    "transactionId": "txn_123456789"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Payment verified and subject unlocked successfully",
    "purchasedSubject": {
      "subjectId": { /* subject details */ },
      "purchaseDate": "2025-12-29T10:30:00.000Z"
    }
  }
  ```
- **Purpose**: Verifies payment and unlocks the subject for the user

#### 3. Get My Purchases
**GET** `/api/v1/payment/my-purchases`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "message": "Purchased subjects retrieved successfully",
    "purchases": [ /* array of purchased subjects */ ],
    "totalPurchases": 5
  }
  ```

#### 4. Check Subject Unlock Status
**GET** `/api/v1/payment/check-unlock/:subjectId`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "isUnlocked": true,
    "message": "Subject is unlocked",
    "purchaseDate": "2025-12-29T10:30:00.000Z"
  }
  ```

#### 5. Get All Purchases (Admin)
**GET** `/api/v1/payment/all-purchases`
- **Auth Required**: No (should be protected with admin middleware)
- **Response**: List of all purchases with user and subject details

---

### Subject Routes (`/api/v1/subject/`)

#### 1. Add New Subject
**POST** `/api/v1/subject/add`
- **Body**:
  ```json
  {
    "classnumber": 10,
    "name": "Mathematics",
    "price": 499
  }
  ```

#### 2. Get All Subjects
**GET** `/api/v1/subject/all/get`
- **Auth Required**: No
- **Response**: List of all subjects (without user-specific unlock status)

#### 3. Get Subjects by Class with Unlock Status
**GET** `/api/v1/subject/by-class/:classno`
- **Auth Required**: Yes
- **Response**: List of subjects for a class with `isUnlocked` status for the logged-in user
  ```json
  {
    "subjects": [
      {
        "_id": "subject_id",
        "name": "Mathematics",
        "classnumber": 10,
        "price": 499,
        "isUnlocked": true,
        "purchaseDate": "2025-12-29T10:30:00.000Z"
      }
    ]
  }
  ```

#### 4. Get Single Subject with Unlock Status
**GET** `/api/v1/subject/:subjectId`
- **Auth Required**: Yes
- **Response**: Subject details with unlock status

#### 5. Update Subject
**PUT** `/api/v1/subject/update/:subjectId`
- **Body**: Fields to update (name, price, classnumber)

#### 6. Delete Subject
**DELETE** `/api/v1/subject/delete/:subjectId`

---

### Chapter Routes (`/api/v1/chapters/`)

#### 1. Add New Chapter
**POST** `/api/v1/chapters/add`
- **Body**:
  ```json
  {
    "subjectId": "subject_id",
    "name": "Chapter 1: Introduction",
    "description": "Basic concepts",
    "videourl": "https://..."
  }
  ```

#### 2. Get All Chapters
**GET** `/api/v1/chapters/all/get`
- **Auth Required**: No

#### 3. Get Chapters by Subject (Protected)
**GET** `/api/v1/chapters/by-subject/:subjectId`
- **Auth Required**: Yes
- **Lock Check**: Returns 403 if subject is not purchased
- **Response**:
  ```json
  {
    "message": "Chapters retrieved successfully",
    "chapters": [ /* array of chapters */ ],
    "isLocked": false
  }
  ```

#### 4. Get Single Chapter (Protected)
**GET** `/api/v1/chapters/:chapterId`
- **Auth Required**: Yes
- **Lock Check**: Returns 403 if subject is not purchased

#### 5. Update Chapter
**PUT** `/api/v1/chapters/update/:chapterId`

#### 6. Delete Chapter
**DELETE** `/api/v1/chapters/delete/:chapterId`

---

## Frontend Integration Guide

### 1. Display Subjects with Lock Status
```javascript
// Fetch subjects for user's class
const response = await fetch('/api/v1/subject/by-class/10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { subjects } = await response.json();

// Display subjects with lock/unlock icons
subjects.forEach(subject => {
  if (subject.isUnlocked) {
    // Show unlocked state - user can access
  } else {
    // Show locked state with price and "Buy Now" button
  }
});
```

### 2. Purchase Flow
```javascript
// Step 1: Create order
const orderResponse = await fetch('/api/v1/payment/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ subjectId: 'subject_id' })
});

const { order } = await orderResponse.json();

// Step 2: Process payment with payment gateway (Razorpay, Stripe, etc.)
// ... payment gateway integration ...

// Step 3: Verify payment
const verifyResponse = await fetch('/api/v1/payment/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    orderId: order.orderId,
    transactionId: 'txn_from_payment_gateway'
  })
});

// Subject is now unlocked!
```

### 3. Access Chapters
```javascript
// Try to fetch chapters
const chaptersResponse = await fetch('/api/v1/chapters/by-subject/subject_id', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (chaptersResponse.status === 403) {
  // Subject is locked - show purchase prompt
} else {
  const { chapters } = await chaptersResponse.json();
  // Display chapters
}
```

---

## Security Considerations

1. **Authentication**: All sensitive routes use `requireLogin` middleware
2. **Authorization**: Chapter access is checked against user's purchased subjects
3. **Duplicate Purchase Prevention**: System checks if user already purchased a subject
4. **Transaction Tracking**: All purchases are logged with transaction IDs

---

## Next Steps

1. **Payment Gateway Integration**: Integrate with Razorpay/Stripe for actual payment processing
2. **Admin Middleware**: Add admin authentication for admin-only routes
3. **Expiry System** (Optional): Add expiry dates to purchases if needed
4. **Refund System** (Optional): Implement refund functionality
5. **Webhooks**: Add webhook handlers for payment gateway notifications

