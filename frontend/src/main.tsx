import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Main from "./routes/Main";
import { ThemeProvider } from "./components/theme_provider";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <SignInPage />
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Main />
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
