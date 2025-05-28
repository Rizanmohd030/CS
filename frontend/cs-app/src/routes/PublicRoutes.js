// // src/routes/PublicOnlyRoute.js

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// export default function PublicOnlyRoute() {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     // Show a loading indicator while authentication status is being determined
//     return <div>Loading authentication...</div>;
//   }

//   if (isAuthenticated) {
//     // If the user is authenticated, redirect them away from public-only routes
//     // For example, redirect to the home page or dashboard
//     return <Navigate to="/" replace />;
//   }

//   // If not authenticated, render the child route (e.g., LoginPage, SignUpPage)
//   return <Outlet />;
// }