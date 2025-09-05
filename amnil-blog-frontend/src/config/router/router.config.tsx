import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import GuestLayout from "../../layout/GuestLayout";
import HomePage from "../../pages/HomePage";
import CreateBlogPage from "../../pages/CreateBlogPage";
import BlogPage from "../../pages/BlogPage";
import EditBlogPage from "../../pages/EditBlogtPage";
import LoginPage from "../../pages/LoginPage";
import RegsiterPage from "../../pages/RegisterPage";

import ProtectedRoutes from "./ProtectedRoutes.routes";
import OpenRoutes from "./OpenRoutes.routes";
import ProfilePage from "../../pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/blog/:slug", element: <BlogPage /> },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/blog/create",
            element: <CreateBlogPage />,
          },
          { path: "/blog/edit/:slug", element: <EditBlogPage /> },
          { path: "/proflie", element: <ProfilePage /> },
        ],
      },
    ],
  },

  {
    element: <OpenRoutes />,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegsiterPage },
    ],
  },
]);

export default router;
