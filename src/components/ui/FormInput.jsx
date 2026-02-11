import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export const FormInput = ({
    label,
    type = "text",
    value,
    onChange,
    onBlur,
    error,
    required = false,
    placeholder,
    disabled = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordType = type === "password"

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={isPasswordType ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition ${error ? "border-red-500" : "border-gray-300"
                        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${isPasswordType ? "pr-10" : ""}`}
                    {...props}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        title={showPassword ? "Hide password" : "Show password"}
                        disabled={disabled}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
