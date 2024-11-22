import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.scss";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import About from "./pages/about/About";
import Add from "./pages/add/Add";
import Campaign from "./pages/campaign/Campaign";
import Campaigns from "./pages/campaigns/Campaigns";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Message from "./pages/message/Message";
import Messages from "./pages/messages/Messages";
import MyCampaigns from "./pages/myCampaigns/MyCampaigns";
import Orders from "./pages/orders/Orders";
import Pay from "./pages/pay/Pay";
import Register from "./pages/register/Register";
import Success from "./pages/success/Success";

function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/campaigns",
          element: <Campaigns />,
        },
        {
          path: "/campaign/:id",
          element: <Campaign />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/mycampaigns",
          element: <MyCampaigns />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
        { path: "/about", element: <About /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
