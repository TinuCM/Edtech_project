# Postman API Endpoints Guide

This guide provides all the endpoints you need to add subjects and chapters with video URLs to your database.

## Base URL
```
http://localhost:5001
```

---

## 1. Add Subject

**Endpoint:** `POST /api/v1/subject/add`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "classnumber": 1,
  "name": "Mathematics",
  "price": 0
}
```

**Example for all subjects (Class 1):**
```json
// Mathematics
{
  "classnumber": 1,
  "name": "Mathematics",
  "price": 0
}

// Science
{
  "classnumber": 1,
  "name": "Science",
  "price": 0
}

// English
{
  "classnumber": 1,
  "name": "English",
  "price": 0
}

// Arts & Creativity
{
  "classnumber": 1,
  "name": "Arts & Creativity",
  "price": 0
}
```

**Response:**
```json
{
  "message": "Subject added successfully",
  "response": {
    "_id": "SUBJECT_ID_HERE",
    "classnumber": 1,
    "name": "Mathematics",
    "price": 0
  }
}
```

**Important:** Save the `_id` from the response - you'll need it for adding chapters!

---

## 2. Get All Subjects (to find Subject IDs)

**Endpoint:** `GET /api/v1/subject/all/get`

**Headers:** None required

**Response:**
```json
{
  "message": "Subjects: ",
  "subjects": [
    {
      "_id": "SUBJECT_ID_1",
      "classnumber": 1,
      "name": "Mathematics",
      "price": 0
    },
    {
      "_id": "SUBJECT_ID_2",
      "classnumber": 1,
      "name": "Science",
      "price": 0
    }
  ]
}
```

---

## 3. Add Chapter with Video URL

**Endpoint:** `POST /api/v1/chapters/add`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "subjectId": "PASTE_SUBJECT_ID_HERE",
  "name": "Number magic",
  "description": "Master the basics of counting and number patterns.",
  "videourl": "videos/number-magic.mp4"
}
```

**Important Notes:**
- `subjectId`: Use the `_id` from the subject you created
- `videourl`: Should be relative path like `videos/filename.mp4`
- The video file should be placed in: `Edtech_project/server/uploads/videos/`
- Chapter names must match EXACTLY: "Number magic", "Addition and Subtraction", etc.

**Example for Mathematics Chapters (Class 1):**

```json
// Chapter 1: Number magic
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Number magic",
  "description": "Master the basics of counting and number patterns.",
  "videourl": "videos/number-magic.mp4"
}

// Chapter 2: Addition and Subtraction
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Addition and Subtraction",
  "description": "Learn to combine numbers and take them away.",
  "videourl": "videos/addition-subtraction.mp4"
}

// Chapter 3: Shapes and Geometry
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Shapes and Geometry",
  "description": "Discover triangles squares and circles around you.",
  "videourl": "videos/shapes-geometry.mp4"
}

// Chapter 4: Time and Clocks
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Time and Clocks",
  "description": "Learn how to read the clock and manage time.",
  "videourl": "videos/time-clocks.mp4"
}

// Chapter 5: Patterns and Sequences
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Patterns and Sequences",
  "description": "Find and continue fun patterns using colors, shapes, and numbers.",
  "videourl": "videos/patterns-sequences.mp4"
}

// Chapter 6: Money
{
  "subjectId": "MATHEMATICS_SUBJECT_ID",
  "name": "Money",
  "description": "Learn to count money and understand the money around you.",
  "videourl": "videos/money.mp4"
}
```

**Response:**
```json
{
  "message": "Chapter added successfully",
  "response": {
    "_id": "CHAPTER_ID_HERE",
    "subjectId": "SUBJECT_ID",
    "name": "Number magic",
    "description": "Master the basics of counting and number patterns.",
    "videourl": "videos/number-magic.mp4"
  }
}
```

---

## 4. Get All Chapters

**Endpoint:** `GET /api/v1/chapters/all/get`

**Headers:** None required

**Response:**
```json
{
  "message": "Chapters: ",
  "chapters": [
    {
      "_id": "CHAPTER_ID",
      "subjectId": "SUBJECT_ID",
      "name": "Number magic",
      "description": "Master the basics of counting and number patterns.",
      "videourl": "videos/number-magic.mp4"
    }
  ]
}
```

---

## 5. Get Single Chapter (to verify video URL)

**Endpoint:** `GET /api/v1/chapters/:chapterId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Example:**
```
GET http://localhost:5001/api/v1/chapters/CHAPTER_ID_HERE
```

**Response:**
```json
{
  "message": "Chapter retrieved successfully",
  "chapter": {
    "_id": "CHAPTER_ID",
    "subjectId": "SUBJECT_ID",
    "name": "Number magic",
    "description": "Master the basics of counting and number patterns.",
    "videourl": "videos/number-magic.mp4"
  }
}
```

---

## Step-by-Step Workflow

### Step 1: Create Subjects
1. Use `POST /api/v1/subject/add` to create Mathematics for Class 1
2. Copy the `_id` from the response
3. Repeat for Science, English, Arts & Creativity for Class 1
4. Repeat for all classes (1-5)

### Step 2: Get Subject IDs
1. Use `GET /api/v1/subject/all/get` to see all subjects
2. Find the Mathematics subject ID for Class 1
3. Copy it for use in Step 3

### Step 3: Add Chapters
1. Use `POST /api/v1/chapters/add` with the Mathematics subject ID
2. Add all 6 chapters one by one
3. Make sure video files are in `server/uploads/videos/` folder
4. Use correct video filenames in `videourl` field

### Step 4: Verify
1. Use `GET /api/v1/chapters/all/get` to see all chapters
2. Check that video URLs are correct
3. Test by clicking a chapter in the app

---

## Video File Setup

1. Place your video files in: `Edtech_project/server/uploads/videos/`
2. Use the filename in the `videourl` field: `videos/your-filename.mp4`
3. Example:
   - File location: `server/uploads/videos/number-magic.mp4`
   - videourl value: `videos/number-magic.mp4`

---

## Complete Example for Mathematics Class 1

**1. Create Subject:**
```json
POST http://localhost:5001/api/v1/subject/add
{
  "classnumber": 1,
  "name": "Mathematics",
  "price": 0
}
```
**Response:** `{ "_id": "67890abcdef1234567890123", ... }`

**2. Add Chapter:**
```json
POST http://localhost:5001/api/v1/chapters/add
{
  "subjectId": "67890abcdef1234567890123",
  "name": "Number magic",
  "description": "Master the basics of counting and number patterns.",
  "videourl": "videos/number-magic.mp4"
}
```

---

## Troubleshooting

- **Error: "Chapter already exists"** - The chapter name already exists for this subject
- **Error: "Subject not found"** - Check that the subjectId is correct (24 characters)
- **Video not playing** - Check that:
  - Video file exists in `server/uploads/videos/`
  - `videourl` path is correct (should start with `videos/`)
  - Server is serving static files from `/uploads` route

