# Image Processor API

This project is a technical assessment built with **NestJS**, **MongoDB**, and **Sharp**, allowing asynchronous image processing from either remote URLs or local paths.

The API allows the creation of image-processing tasks, resizes images into multiple resolutions, stores them locally, and persists metadata in MongoDB.

---

## Tech Stack

- **NestJS** + TypeScript
- **MongoDB** with Mongoose
- **Sharp** (image processing)
- **Swagger** (API docs)
- **Jest** (unit testing)
- **Class-validator** / custom pipes
- **Dotenv** (environment config)
- **ServeStatic** (static image access)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Micharcg8/image-processor-api.git
cd image-processor-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file at the root:

```
MONGODB_URI=mongodb://localhost:27017/image_processor
PORT=3000
```

### 4. Run MongoDB

Ensure MongoDB is running locally. If you use Docker:

```bash
docker run --name image-db -p 27017:27017 -d mongo
```

### 5. Start the app

```bash
npm run start:dev
```

### 6. Access API Docs (Swagger)

Visit: [http://localhost:3000/api](http://localhost:3000/api)

---

## Project Structure

```
src/
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── dto/
│   │   └── create-task.dto.ts
│   └── schemas/
│       └── task.schemas.ts
├── shared/
│   ├── pipes/
│   │   └── validate-object-id.pipe.ts
│   ├── validators/
│   │   └── is-valid-original-path.ts
│   └── utils/
│       ├── download-image.ts
│       └── get-md5.ts
├── app.module.ts
└── main.ts
```

---

## Running Tests

```bash
npm run test
```

Or with coverage:

```bash
npm run test:cov
```

### Included Unit Tests:

- TasksService
- TasksController
- Pipes (`ValidateObjectIdPipe`)
- Validators (`IsValidOriginalPath`)
- Utilities (`download-image.ts`, `get-md5.ts`)

---

## How It Works

1. **POST /tasks**  
   - Accepts `originalPath` (URL or local path).
   - Stores metadata in MongoDB.
   - Triggers background processing (resizes to 1024px and 800px).
   - Saves images in `/output`.

2. **GET /tasks/:id**  
   - Returns task details, including status, price, and path.

3. **GET /tasks/images/:id**  
   - Returns only the processed images for that task.

---

## Example Task Payload

```json
{
  "originalPath": "https://picsum.photos/seed/testimage/800/600"
}
```

---

## Validation and Error Handling

- Invalid Mongo ObjectIds: handled by custom pipe
- `originalPath`:
  - Must be a valid URL (`http/https`) or valid local file
- Non-existent task IDs return `404`
- Background processing errors are caught and status is marked `failed`

---

## Development Notes

- All code is modular and follows SOLID principles
- Code is linted and formatted
- PRs created through a `develop` branch with proper commits
- Environment variables are externalized via `.env`
- Static files are served from `/output` via `ServeStaticModule`

---

## Swagger Preview

![swagger-preview](swagger-preview.png)

---

## Todos / Possible Improvements

- Add authentication for task creation
- Persist processing logs
- Add retry strategy for failed tasks
- Upload processed images to cloud storage (e.g., AWS S3)

---

## Author

Michael (Software Engineer)  
