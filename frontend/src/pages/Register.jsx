import { useState } from 'react';
import { authApiRegister } from '../api/authApi.js';

export function Register(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [fullName,setName]= useState("");
    const [role,setRole] = useState("");
    const [companyId,setCompanyId] = useState("");

    async function handleSubmit(event){
        event.preventDefault();
        const data = await authApiRegister(fullName,email,password,role,companyId);

    console.log(data);

    }

    return(
        <form onSubmit={handleSubmit}>

            <input
                type="text"
                value={fullName}
                onChange={(e) => setName(e.target.value)}
                required
            />

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

            <input
                list="roles"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                />

                <datalist id="roles">
  <option value="COMPANY_USER">User</option>
  <option value="REGULATOR">Regulator</option>
  <option value="AUDITOR">Auditor</option>
</datalist>

            <input
                type="text"
                value={companyId}
                placeholder='If Applicable enter company Id'
                onChange={(e) => setCompanyId(e.target.value)}
            />

            <button type="submit">
                Register
            </button>

        </form>
    );
}

