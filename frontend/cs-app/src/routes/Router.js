// src/routes/Router.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/Home'; // Your main public home page
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUp'; // Assuming you have this

// This component will receive props from App.js
export default function AppRoutes({ dbStatus, constructionData }) {
  return (
    <Routes>
      {/*
        All routes are now public.
        The HomePage component will handle displaying the dashboard, panels,
        and conditionally showing login/logout buttons based on internal state (user, isAuthenticated).
      */}
      <Route
        path="/"
        element={<HomePage dbStatus={dbStatus} constructionData={constructionData} />}
      />

      {/*
        The Login and Sign Up pages are now simple public routes.
        They will be rendered when navigated to from the Home page.
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/*
        Any other public routes that don't need authentication checks
        (e.g., About Us, Contact Us, Privacy Policy)
      */}
      {/* <Route path="/about" element={<AboutPage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} */}

      {/* Optional: A catch-all route for 404 Not Found pages */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// // src/routes/Router.js

// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/Home/Home'; // Your main public home page
// import LoginPage from '../pages/auth/LoginPage';
// import SignUpPage from '../pages/auth/SignUp';

// // Import the new PublicOnlyRoute
// import PublicOnlyRoute from './PublicRoutes';

// // No need for PrivateRoute in this setup based on your requirements
// // since Home handles the dashboard/panels internally and login/signup are public-only.

// // This component will receive props from App.js
// export default function AppRoutes({ dbStatus, constructionData }) {
//   return (
//     <Routes>
//       {/*
//         Public Routes: These are always accessible.
//         Your HomePage component now contains all the UI, including the dashboard
//         logic, and login/signup buttons.
//       */}
//       <Route
//         path="/"
//         element={<HomePage dbStatus={dbStatus} constructionData={constructionData} />}
//       />

//       {/*
//         Public-Only Routes: Accessible only if NOT authenticated.
//         If an authenticated user tries to go to /login or /signup,
//         PublicOnlyRoute will redirect them (e.g., to /).
//       */}
//       <Route element={<PublicOnlyRoute />}>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//       </Route>

//       {/*
//         Any other public routes that don't need authentication checks
//         or shouldn't redirect if the user is already logged in.
//         (e.g., About Us, Contact Us, Privacy Policy)
//       */}
//       {/* <Route path="/about" element={<AboutPage />} /> */}
//       {/* <Route path="/contact" element={<ContactPage />} /> */}

//       {/* Optional: A catch-all route for 404 Not Found pages */}
//       {/* <Route path="*" element={<NotFoundPage />} /> */}
//     </Routes>
//   );
// }