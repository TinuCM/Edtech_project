# Get My Subjects Endpoint - Documentation

## 📌 Endpoint

```
GET /api/v1/subject/my-subjects
```

## 🔐 Authentication

**Required**: Yes - Bearer token in Authorization header

## 📝 Description

This endpoint automatically retrieves all subjects for the logged-in user's class along with their lock/unlock status. No need to pass class number or user ID - it uses the authenticated user's information.

---

## 📥 Request

### Headers:
```
Authorization: Bearer <your_jwt_token>
```

### No Query Parameters or Body Required!
The endpoint automatically:
1. Gets the user ID from the JWT token
2. Looks up the user's class number
3. Fetches subjects for that class
4. Checks lock status for each subject

---

## 📤 Response

### Success Response (200):

```json
{
  "message": "Subjects retrieved successfully",
  "classno": 10,
  "subjects": [
    {
      "_id": "subject_id_1",
      "name": "Mathematics",
      "classnumber": 10,
      "price": 499,
      "locked": true,
      "purchaseDate": null,
      "transactionId": null
    },
    {
      "_id": "subject_id_2",
      "name": "Science",
      "classnumber": 10,
      "price": 599,
      "locked": false,
      "purchaseDate": "2025-12-29T10:30:00.000Z",
      "transactionId": "txn_123456"
    },
    {
      "_id": "subject_id_3",
      "name": "English",
      "classnumber": 10,
      "price": 399,
      "locked": true,
      "purchaseDate": null,
      "transactionId": null
    }
  ],
  "totalSubjects": 3
}
```

### Response Fields:

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Success message |
| `classno` | Number | User's class number |
| `subjects` | Array | List of subjects with lock status |
| `subjects[].id` | String | Subject ID |
| `subjects[].name` | String | Subject name |
| `subjects[].classnumber` | Number | Class this subject belongs to |
| `subjects[].price` | Number | Price of the subject |
| `subjects[].locked` | Boolean | `true` = locked 🔒, `false` = unlocked ✅ |
| `subjects[].purchaseDate` | Date/null | Date when purchased (null if locked) |
| `subjects[].transactionId` | String/null | Payment transaction ID (null if locked) |
| `totalSubjects` | Number | Total number of subjects |

---

## ❌ Error Responses

### 401 - Unauthorized (No token or invalid token)
```json
{
  "message": "Authentication required"
}
```

### 404 - User Not Found
```json
{
  "message": "User not found"
}
```

### 404 - No Subjects
```json
{
  "message": "No subjects found for your class",
  "classno": 10
}
```

### 500 - Server Error
```json
{
  "message": "Error message here"
}
```

---

## 💻 Frontend Usage Examples

### JavaScript (Fetch API)
```javascript
async function getMySubjects() {
  const token = localStorage.getItem('token'); // or get from your auth system
  
  try {
    const response = await fetch('http://localhost:5001/api/v1/subject/my-subjects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Your class:', data.classno);
      console.log('Total subjects:', data.totalSubjects);
      
      data.subjects.forEach(subject => {
        if (subject.locked) {
          console.log(`🔒 ${subject.name} - Locked (₹${subject.price})`);
        } else {
          console.log(`✅ ${subject.name} - Unlocked`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getMySubjects();
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function MySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classNo, setClassNo] = useState(null);

  useEffect(() => {
    fetchMySubjects();
  }, []);

  const fetchMySubjects = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/v1/subject/my-subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubjects(data.subjects);
        setClassNo(data.classno);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Subjects - Class {classNo}</h1>
      <div className="subjects-grid">
        {subjects.map(subject => (
          <div key={subject._id} className="subject-card">
            <h3>{subject.name}</h3>
            <p>Price: ₹{subject.price}</p>
            
            {subject.locked ? (
              <>
                <span className="badge locked">🔒 Locked</span>
                <button>Buy Now</button>
              </>
            ) : (
              <>
                <span className="badge unlocked">✅ Unlocked</span>
                <button>View Chapters</button>
                <small>Purchased: {new Date(subject.purchaseDate).toLocaleDateString()}</small>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySubjects;
```

### Axios Example
```javascript
import axios from 'axios';

const getMySubjects = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get('/api/v1/subject/my-subjects', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const { classno, subjects, totalSubjects } = response.data;
    
    console.log(`Class ${classno} - ${totalSubjects} subjects`);
    
    const lockedSubjects = subjects.filter(s => s.locked);
    const unlockedSubjects = subjects.filter(s => !s.locked);
    
    console.log(`Locked: ${lockedSubjects.length}`);
    console.log(`Unlocked: ${unlockedSubjects.length}`);
    
    return subjects;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

---

## 🎯 Use Cases

### 1. Display User's Dashboard
```javascript
// Show student their subjects with lock/unlock status
const { subjects, classno } = await getMySubjects();
displayDashboard(subjects, classno);
```

### 2. Check What's Available to Purchase
```javascript
const { subjects } = await getMySubjects();
const lockedSubjects = subjects.filter(s => s.locked);
// Show "Buy Now" options for locked subjects
```

### 3. Show User's Purchased Content
```javascript
const { subjects } = await getMySubjects();
const unlockedSubjects = subjects.filter(s => !s.locked);
// Show content they can access
```

### 4. Calculate Total Spent
```javascript
const { subjects } = await getMySubjects();
const totalSpent = subjects
  .filter(s => !s.locked)
  .reduce((sum, s) => sum + s.price, 0);
console.log(`Total spent: ₹${totalSpent}`);
```

---

## 🔄 Comparison with Other Endpoints

### This Endpoint vs Other Subject Endpoints:

| Endpoint | Auth Required | What It Does |
|----------|--------------|--------------|
| `GET /api/v1/subject/my-subjects` | ✅ Yes | Gets subjects for **logged-in user's class** with lock status |
| `GET /api/v1/subject/by-class/:classno` | ✅ Yes | Gets subjects for **specific class** with lock status |
| `GET /api/v1/subject/all/get` | ❌ No | Gets **all subjects** (no lock status) |
| `GET /api/v1/subject/:subjectId` | ✅ Yes | Gets **single subject** with lock status |

**Use this endpoint** when you want to show a student their own subjects with lock status without knowing their class number!

---

## ✨ Features

✅ **Automatic class detection** - No need to pass class number  
✅ **Lock status included** - Shows which subjects are purchased  
✅ **Purchase info** - Includes purchase date and transaction ID for unlocked subjects  
✅ **Auto-creates missing entries** - If UserSubject entries are missing, creates them automatically  
✅ **Clean response** - Only includes relevant fields  

---

## 🧪 Testing

### Using cURL:
```bash
curl -X GET http://localhost:5001/api/v1/subject/my-subjects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman:
1. Method: GET
2. URL: `http://localhost:5001/api/v1/subject/my-subjects`
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
4. Send

### Expected Result:
- List of subjects for your class
- Each with `locked: true` or `locked: false`
- Purchase date and transaction ID for unlocked subjects

---

## 📊 Summary

This endpoint is perfect for:
- Student dashboard showing their subjects
- Displaying what they can purchase vs what they own
- Building a "My Subjects" page in your frontend
- Mobile apps where you want subjects for the logged-in user

**Simple to use - Just send the token, get back all your subjects!** 🎉

