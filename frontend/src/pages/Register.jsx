import { useState } from "react";
import { authApiRegister } from "../api/authApi.js";
import "./Auth.css";

export function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setName] = useState("");
    const [role, setRole] = useState("");
    const [companyId, setCompanyId] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            const data = await authApiRegister(
                fullName,
                email,
                password,
                role,
                companyId
            );

            console.log(data);

            alert("Registration successful");

        } catch (err) {

            console.error(
                "REGISTER ERROR:",
                err.response?.data || err.message
            );

        }
    }

    return (
        <div className="auth-page">

            <div className="auth-shell auth-register">

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

                        <h1>Create your account</h1>

                        <p>
                            Register for access to the Evident.ai
                            ESG reporting platform.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-field">

                            <label htmlFor="register-name">
                                Full name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                value={fullName}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <input
                                id="register-email"
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

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Create a password"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-role">
                                Account role
                            </label>

                            <select
                                id="register-role"
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Select a role
                                </option>

                                <option value="COMPANY_USER">
                                    Company User
                                </option>

                                <option value="AUDITOR">
                                    Auditor
                                </option>

                                <option value="REGULATOR">
                                    Regulator
                                </option>
                            </select>

                            <div className="auth-role-note">
                                Access permissions are determined by
                                the assigned platform role.
                            </div>

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-company">
                                Company ID
                            </label>

                            <input
                                id="register-company"
                                type="text"
                                value={companyId}
                                placeholder="Required for company users"
                                onChange={(e) =>
                                    setCompanyId(e.target.value)
                                }
                            />

                            <div className="auth-field-help">
                                Leave blank if your role does not
                                require a company association.
                            </div>

                        </div>

                        <button
                            className="auth-submit"
                            type="submit"
                        >
                            Create Account
                        </button>

                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <a href="/login">
                            Sign in
                        </a>
                    </div>

                </div>

            </div>

        </div>
    );
}