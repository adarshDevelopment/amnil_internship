import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import GuestLayout from "../../layout/GuestLayout";
import HomePage from "../../pages/HomePage";
import CreateBlogPage from "../../pages/blog/CreateBlogPage";
import BlogPage from "../../pages/blog/BlogPage";
import EditBlogPage from "../../pages/blog/EditBlogtPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegsiterPage from "../../pages/auth/RegisterPage";

import ProtectedRoutes from "./ProtectedRoutes.routes";
import OpenRoutes from "./OpenRoutes.routes";
import ProfilePage from "../../pages/auth/ProfilePage";
import FilterPage from "../../pages/blog/FilterPage";
import ProfileBlogPage from "../../pages/auth/profilepages/ProfileBlogPage";
import TagIndex from "../../pages/tag/TagIndex";
import ProfileSettings from "../../pages/auth/profilepages/ProfileSettings";
import AdminRoutes from "./AdminRoutes.routes";
import ForgetPassword from "../../pages/auth/ForgetPassword";
import ResetPassword from "../../pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/blog/:slug", element: <BlogPage /> },
      // { path: "/user/:userId", element: <ProfileBlogPage /> },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/blog/create",
            element: <CreateBlogPage />,
          },
          { path: "/blog/edit/:slug", element: <EditBlogPage /> },
          { path: "/tag/:tag", element: <FilterPage /> },
        ],
      },

      {
        path: "/user/:userId",
        element: <ProfilePage />,
        children: [
          { path: "blogs", element: <ProfileBlogPage /> },
          {
            path: "tag",
            element: <AdminRoutes />,
            children: [{ index: true, element: <TagIndex /> }],
          },
          {
            path: "settings",
            element: <ProtectedRoutes />,
            children: [{ index: true, element: <ProfileSettings /> }],
          },
        ],
      },
    ],
  },

  {
    element: <OpenRoutes />,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegsiterPage },
      { path: "/forget-password", element: <ForgetPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
    ],
  },
]);

export default router;
