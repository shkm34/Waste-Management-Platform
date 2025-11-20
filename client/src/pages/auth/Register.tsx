import { Link } from "react-router-dom";
import { ROUTES, WASTE_TYPE_LABELS, WASTE_TYPES } from "../../utils";
import { USER_ROLES } from "../../utils";
import { useRegister } from "./hooks/useRegister";

function Register() {
  const {
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
  } = useRegister();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Register
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is Required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name must be at most 100 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is Required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email is invalid" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone", {
                required: "Phone is Required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              {...register("role", {
                required: "Role is Required",
                validate: (val) =>
                  Object.values(USER_ROLES).includes(val as any) ||
                  `${val} is not a valid role`,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={USER_ROLES.CUSTOMER}>Customer</option>
              <option value={USER_ROLES.DRIVER}>Driver</option>
              <option value={USER_ROLES.DEALER}>Dealer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Dealer types (only for dealer) */}
          {watchedRole === USER_ROLES.DEALER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waste Types Accepted
              </label>
              <div className="space-y-2">
                {Object.values(WASTE_TYPES).map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watchedDealerTypes.includes(type)}
                      onChange={() => handleDealerTypeChange(type)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">
                      {WASTE_TYPE_LABELS[type]}
                    </span>
                  </label>
                ))}
              </div>

              {/* hidden field for react-hook-form validation of dealerTypes */}
              <input
                type="hidden"
                {...register("dealerTypes", {
                  validate: (val) =>
                    watchedRole !== USER_ROLES.DEALER ||
                    (Array.isArray(val) && val.length > 0) ||
                    "Select at least one waste type",
                })}
              />
              {errors.dealerTypes && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dealerTypes.message}
                </p>
              )}
            </div>
          )}

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address", { required: "Address is Required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is Required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirm Password is Required",
                minLength: {
                  value: 6,
                  message: "Confirm Password must be at least 6 characters",
                },
                validate: (val) =>
                  val === watchedPassword || "Passwords do not match",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
