## MaxxEnergy Frontend Integration Guide

This guide shows how to connect any frontend to the MaxxEnergy backend.

Current API base URL:

`https://b5e776df14c2.ngrok-free.app`

Note: If the ngrok tunnel restarts, this URL will change. Update your env or the HTML input accordingly.

---

### Option A — Visual Studio Code (React: Vite or CRA)

1) Configure the base URL

- Vite: create a file named `.env.local` at the project root with:

```
VITE_API_BASE_URL=https://b5e776df14c2.ngrok-free.app
```

- Create React App (CRA): create a file named `.env` at the project root with:

```
REACT_APP_API_BASE_URL=https://b5e776df14c2.ngrok-free.app
```

2) Create `src/lib/api.js`

```javascript
import axios from "axios";

const baseURL =
  (typeof import !== "undefined" && import.meta?.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://b5e776df14c2.ngrok-free.app";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
```

3) Create `src/services/auth.js`

```javascript
import { api, setAuthToken } from "../lib/api";

export async function health() {
  const { data } = await api.get("/health");
  return data; // "OK"
}

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data; // "User registered successfully"
}

export async function loginUser({ username, password }) {
  const { data } = await api.post("/auth/login", { username, password });
  const token = data?.token ?? data; // supports {token} or plain string
  setAuthToken(token);
  return token;
}

export async function changePassword({ oldPassword, newPassword }) {
  const { data } = await api.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
}

export async function resetPassword({ email, newPassword }) {
  const { data } = await api.post("/auth/reset-password", {
    email,
    newPassword,
  });
  return data;
}
```

4) Example usage (React component)

```javascript
import { useState } from "react";
import {
  health,
  registerUser,
  loginUser,
  changePassword,
  resetPassword,
} from "../services/auth";

export default function AuthExample() {
  const [token, setToken] = useState(null);

  return (
    <div style={{ padding: 16 }}>
      <button onClick={async () => console.log(await health())}>Health</button>
      <button
        onClick={async () =>
          console.log(
            await registerUser({
              username: "test3",
              email: "test3@example.com",
              password: "Passw0rd!",
              name: "Test User",
              employeeId: "E125",
            })
          )
        }
      >
        Register
      </button>
      <button
        onClick={async () => setToken(await loginUser({ username: "test3", password: "Passw0rd!" }))}
      >
        Login
      </button>
      <button
        disabled={!token}
        onClick={async () =>
          console.log(
            await changePassword({ oldPassword: "Passw0rd!", newPassword: "NewPassw0rd!" })
          )
        }
      >
        Change Password
      </button>
      <button
        onClick={async () =>
          console.log(
            await resetPassword({ email: "test3@example.com", newPassword: "ResetPassw0rd!" })
          )
        }
      >
        Reset Password
      </button>
      <div>Token: {token ? "set" : "none"}</div>
    </div>
  );
}
```

— Update the env URL if ngrok changes. JWT is sent in the `Authorization: Bearer <token>` header.

---

### Option B — Notepad++ (Plain HTML)

Save `frontend-connector.html` (already included in this repo) and open it in a browser. It is preconfigured to call the backend and provides buttons for all auth flows (register, login, change password, reset password, health). Update the API URL at the top of the page if your ngrok URL changes.

If you need a minimal inline version instead of the full UI, use this and open in a browser:

```html
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MaxxEnergy API Connector</title></head><body>
<input id="baseUrl" style="width:100%" value="https://b5e776df14c2.ngrok-free.app"><button onclick="health()">GET /health</button>
<button onclick="registerUser()">POST /auth/register</button><button onclick="login()">POST /auth/login</button>
<button onclick="changePassword()">POST /auth/change-password</button><button onclick="resetPassword()">POST /auth/reset-password</button>
<pre id="out">Ready.</pre>
<script>
const out=document.getElementById('out'); const apiBase=()=>document.getElementById('baseUrl').value.replace(/\/+$/,''); let token=localStorage.getItem('maxx_token')||'';
function show(x){out.textContent=typeof x==='string'?x:JSON.stringify(x,null,2);} async function http(m,p,b,a){const h={'Content-Type':'application/json'}; if(a){if(!token) throw new Error('Login first'); h.Authorization=`Bearer ${token}`;}
const r=await fetch(`${apiBase()}${p}`,{method:m,headers:h,body:b?JSON.stringify(b):undefined}); const ct=r.headers.get('content-type')||''; let d; try{d=ct.includes('application/json')?await r.json():await r.text();}catch{d=await r.text();}
show({status:r.status,ok:r.ok,url:r.url,data:d}); return {r,d};}
async function health(){await http('GET','/health');}
async function registerUser(){await http('POST','/auth/register',{username:'test3',email:'test3@example.com',password:'Passw0rd!',name:'Test User',employeeId:'E125'});} 
async function login(){const {d}=await http('POST','/auth/login',{username:'test3',password:'Passw0rd!'}); token=(d&&d.token)||((typeof d==='string')?d:''); if(token) localStorage.setItem('maxx_token',token);} 
async function changePassword(){await http('POST','/auth/change-password',{oldPassword:'Passw0rd!',newPassword:'NewPassw0rd!'},true);} 
async function resetPassword(){await http('POST','/auth/reset-password',{email:'test3@example.com',newPassword:'ResetPassw0rd!'});} 
</script></body></html>
```

---

### Sharing this guide

- Push this repository to GitHub (or your VCS) and share the direct link to `TEAM_SETUP.md` and `frontend-connector.html`.
- Alternatively, upload these two files to Google Drive/OneDrive and send a share link.


