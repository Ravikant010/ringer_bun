import { screen, act, waitFor, fireEvent } from "@testing-library/react";
import SignInPage from "@/routes/public/LandingPage";
import { render } from "./provider";
describe("Simple working test", () => {
  it("the title is visible", async () => {
    render(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      const loader = screen.getByTestId('loader');
      expect(loader).toBeInTheDocument();
    });
  });
});
