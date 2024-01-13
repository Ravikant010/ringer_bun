import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignInPage from "./public/LandingPage";
export default function Main(){
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignInPage />,
    }, 
  ]
  )

    return <RouterProvider router={router} />
}