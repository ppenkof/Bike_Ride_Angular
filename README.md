📘 Project Documentation: BikeHub Angular App
1. Overview
BikeHub is a frontend Angular application that displays a catalog of bikes, allows users to like bikes, and supports user authentication. It integrates with a backend API (SoftUni Practice Server) and uses Angular 20 features like signals and interceptors.
2. Features
•	User authentication (login/logout)
•	User profile editing
•	Display bikes with images and all items
•	Like functionality (user-specific and total like count)
•	Book test ride for particular bike and like it
•	Review and edit book list
•	Responsive UI
•	Token-based API communication
3. Project Structure

src/
├── app/
│   ├── core/
│   ├── features/
│   ├── models/
│   ├── shared/
│   └── app.module.ts
├── assets/
│   └── images/
├── environments/
│   └── environment.ts

4. Setup Instructions
Prerequisites:
- Node.js & npm
- Angular CLI
Installation:
npm install
ng serve
Server starting:
Node server.js

Environment Configuration:
Update environment.ts with your backend API URL:

export const environment = {
  apiUrl: 'https://your-backend-url.com/api'
};

5. Services
BikesService:
- getAllBikes(): Fetches all bikes
- getBikeById(id: string): Fetches a specific bike
- mapBikeData(): Transforms backend data into flat array
LikeService:
- getLikesForBike(bikeId: string): Returns total likes
- getUserLike(bikeId: string, userId: string): Returns if user liked the bike
AuthService:
- Handles login/logout
- Stores token in localStorage
- Uses Angular signals for reactive auth state
6. Image Handling
Bike images are stored in src/assets/images. Use relative paths in your templates:
<img [src]='assets/images/' + bike.image alt='{{ bike.name }}'>
7. Signals & Interceptors
Signals are used for reactive state management (e.g., auth status). HTTP interceptor adds token to outgoing requests.
8. Future Improvements
•	Add bike filtering and sorting
•	Implement user registration
•	Add comments or reviews
•	Improve mobile responsiveness
9. License
MIT License
