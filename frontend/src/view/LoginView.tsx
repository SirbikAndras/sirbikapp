import {useState, useTransition} from "react";
import {loginApi} from "../api/apiClient.ts";
import type {LoginRequestDTO} from "../api/generated";
import {JWT_TOKEN_KEY} from "../api/axiosInstance";
import {NavLink} from "react-router";

export default function LoginView() {

    const [loginForm, setLoginForm] = useState<LoginRequestDTO>({});
    const [jwtToken, setJwtToken] = useState<string>();
    const [isPending, startTransition] = useTransition();

    const login = () => {
        if (!loginForm.email || !loginForm.password) {
            return;
        }

        startTransition(async () => {
            const response = await loginApi.login(loginForm);
            const token = response.data.token;
            if (token) {
                sessionStorage.setItem(JWT_TOKEN_KEY, token);
            }
            setJwtToken(token);
        });
    }

    if (isPending) {
        return <div>Loading...</div>;
    }

    return <div>
        <NavLink to="/">Home</NavLink>
        <input type="text" placeholder="Email" value={loginForm.email}
               onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}/>
        <input type="password" placeholder="Password" value={loginForm.password}
               onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}/>
        <button onClick={login}>Login</button>
        {jwtToken && <div>JWT Token: {jwtToken}</div>}
    </div>;
}