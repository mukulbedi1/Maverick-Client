import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// pages
import {
  HomeLayout,
  Error,
  Datasets,
  Stats,
  Landing,
  About,
  UnderConstruction,
  YourSpace,
  DashBoardLanding,
  DashBoardLayout,
  Login,
  Register,
  Dictionary,
  Words,
  DictionaryLanding,
  Characters,
  Nmf,
  Profile,
  Prediction,
  DataSetCreation,
  Sign_Alphabets,
  TextToSign,
} from "./pages";

// actions
import { action as RegisterAction } from './pages/Register';
import { action as LoginAction } from "./pages/Login";

// components
import { VideosPage, UploadVideo, CoursePage, CommunityFeed } from "./Components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        action: RegisterAction,
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
        action: LoginAction,
      },
      {
        path: "dashboard",
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            element: <DashBoardLanding />,
          },
          {
            path: "TextToSign",
            element: <TextToSign />,
          },
          {
            path: "Sign",
            element: <Sign_Alphabets />,
          },
          {
            path: "DataSetCreation",
            element: <DataSetCreation />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "Prediction",
            element: <Prediction />,
          },
          {
            path: "Dictionary",
            element: <Dictionary />,
            children: [
              {
                index: true,
                element: <DictionaryLanding />,
              },
              {
                path: "Profile",
                element: <Profile />,
              },
              {
                path: "Words",
                element: <Words />,
              },
              {
                path: "Characters",
                element: <Characters />,
              },
              {
                path: "Nmf",
                element: <Nmf />,
              },
            ],
          },
          { path: "stats", element: <Stats /> },
          {
            path: "Datasets",
            element: <VideosPage />,
          },
          {
            path: "upload",
            element: <UploadVideo />,
          },
          {
            path: "courses",
            element: <CoursePage />,
          },
          {
            path: "discussions",
            element: <CommunityFeed />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
