import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../../utils";
import { RegisterData, USER_ROLES_TYPE, WasteType } from "@/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm, SubmitHandler } from "react-hook-form";
import { getRedirectRoute } from "../../../config/routeMappings";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  role: USER_ROLES_TYPE;
  address: string;
  password: string;
  confirmPassword: string;
  dealerTypes: WasteType[];
};
export const useRegister = () => {
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: USER_ROLES.CUSTOMER as USER_ROLES_TYPE,
      address: "",
      password: "",
      confirmPassword: "",
      dealerTypes: [] as WasteType[],
    },
  });

  const watchedPassword = watch("password", "");
  const watchedRole = watch("role", USER_ROLES.CUSTOMER as USER_ROLES_TYPE);
  const watchedDealerTypes = watch("dealerTypes", [] as WasteType[]);

  // redirect if already logged in
  useEffect(() => {
   if (user?.role) {
         const targetRoute = getRedirectRoute(user.role);
         navigate(targetRoute, { replace: true });
       }
  }, [user, navigate]);

  const handleDealerTypeChange = (wasteType: WasteType) => {
    const current: WasteType[] = getValues("dealerTypes") || [];
    const next = current.includes(wasteType)
      ? current.filter((t) => t !== wasteType)
      : [...current, wasteType];

    // update form value and trigger validation
    setValue("dealerTypes", next, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");

    // extra validations
    if (data.password !== data.confirmPassword) {
      setError("Password do not match");
      return;
    }

    if (data.role === USER_ROLES.DEALER && data.dealerTypes.length === 0) {
      setError("Dealers must select at least one waste type");
      return;
    }

    setLoading(true);

    const registerData: RegisterData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      location: {
        address: data.address,
      },
    };

    if (data.role === USER_ROLES.DEALER) {
      registerData.dealerTypes = data.dealerTypes;
    }

    try {
      await registerUser(registerData);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    error,
    loading,
    errors,
    watchedPassword,
    watchedRole,
    watchedDealerTypes,
    handleDealerTypeChange,
  };
};
