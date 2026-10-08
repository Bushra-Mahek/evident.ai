import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApiLogin } from "../api/authApi";
import { saveSession } from "../utils/auth";
import "./Auth.css";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        const data = await authApiLogin(email, password);

        saveSession(data.token, data.user);

        navigate("/dashboard");
    }

    return (
        <div className="auth-page">
            <div className="auth-shell">

                <div className="auth-brand">
                    <div className="auth-brand-mark">E</div>
                    <span className="auth-brand-name">
                        EVIDENT.AI
                    </span>
                </div>

                <div className="auth-card">

                    <div className="auth-card-header">
                        <span className="auth-eyebrow">
                            ESG VERIFICATION PLATFORM
                        </span>

                        <h1>Welcome back</h1>

                        <p>
                            Sign in to access your ESG reporting
                            and verification workspace.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-field">
                            <label htmlFor="login-email">
                                Email address
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="you@company.com"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            className="auth-submit"
                            type="submit"
                        >
                            Sign In
                        </button>

                    </form>

                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <a href="/register">
                            Create an account
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}