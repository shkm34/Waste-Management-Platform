import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoginData } from "@/types";
import { getRedirectRoute } from "../../../config/routeMappings";
export const useLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.role) {
      const targetRoute = getRedirectRoute(user.role);
      navigate(targetRoute, { replace: true });
    }
  }, [user, navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!loginForm.email || !loginForm.password) {
      setError("Enter Email and Password");
      return;
    }
    const loginData: LoginData = {
      email: loginForm.email,
      password: loginForm.password,
    };

    try {
      await login(loginData);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return { loginForm, error, loading, handleChange, handleSubmit };
};
