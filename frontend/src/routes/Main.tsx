import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignInPage from "./public/LandingPage";
import SignupPage from "./public/SignupPage";
export default function Main(){
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignInPage />,
    }, 
    {
      path: "/signup", 
      element: <SignupPage />
    }
  ]
  )

    return <RouterProvider router={router} />
}