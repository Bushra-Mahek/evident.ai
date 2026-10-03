
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApiLogin } from '../api/authApi';
import { saveSession } from '../utils/auth';


export function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();

        const data = await authApiLogin(email,password);
        saveSession(data.token, data.user);
        navigate("/dashboard");
    }
        
    return (
         <form onSubmit={handleSubmit}>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">
                Login
            </button>

        </form>
    );

}

