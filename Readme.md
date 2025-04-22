
# 🚀 useApiHook 

# ⚠️ Important: How to Set `baseURL`
👉 To use the API system properly, **you must** provide the **base URL**.  
There are two ways:

| Option                  | How |
|--------------------------|-----|
| 1. Provide in `AuthProvider` 🌍 | `<AuthProvider baseURL="https://your-api.com" />` |
| 2. Provide in `apiConfig` 🔧 | `apiConfig: { url: "https://your-api.com" }` |

✅ **One is required! Otherwise API calls will fail!**

---

# 📚 Table of Contents
- [⚡ Overview](#⚡-overview)
- [📦 Installation](#📦-installation)
- [🛠️ Components](#🛠️-components)
  - [AuthProvider](#authprovider)
  - [useApiHook](#useapihook)
- [🔗 fetchDataFunc](#fetchdatafunc)
- [🔥 Advanced Features](#🔥-advanced-features)
- [🛡️ Error and Status Code Handling](#🛡️-error-and-status-code-handling)
- [🎯 Tips](#🎯-tips)
- [📤 Exports](#📤-exports)

---

# ⚡ Overview

This utility helps you manage:
- API Calls (POST, GET, PUT, DELETE, etc.)
- Loading states
- Error handling
- Refetching data
- Auto logout on unauthorized errors (401/403)
- Custom actions based on API response status codes

---

# 📦 Installation

Just install it! 🎯

```bash
npm i useapicustomhook
```

and import it

```tsx
import useApiHook, { AuthProvider } from './your-path/useApiHook';
```

---

# 🛠️ Components

## 1. `<AuthProvider />`

Wrap your app with AuthProvider to share `logout`, `baseURL`, `token`, and `customActions` globally.

```tsx
<AuthProvider
  logoutFunction={logoutHandler} //optional
  customActions={[
    { codes: [418], action: handleTeapotError }
  ]} //optional
  baseURL="https://your-api.com" //set it here once or provide on apiConfig every time you use hook
  token="your-auth-token" //set it here once or provide on apiConfig every time you use hook
>
  <App />
</AuthProvider>
```

| Prop | Type | Description |
|-----|------|-------------|
| `logoutFunction` | `() => void` | Logout user on auth failure |
| `customActions` | `Array<{ codes: number[], action: () => void }>` | Custom actions based on status codes |
| `baseURL` | `string` | API Base URL |
| `token` | `string` | Auth token |

---

## 2. `useApiHook()`

### Usage:
Old way
```tsx
const { data, loading, error, fetchData, alterData } = useApiHook({
  apiCallingFunction: myApiFunction,
  apiParameters: [param1, param2],
  runOnTimeOfScreenMount: true,
  initialLoadingState: true,
  reFetchDependencies: [someDependency],
});
```

Or provide apiConfig (new way)

```tsx
const { data, loading, error, fetchData, alterData } = useApiHook({
  apiConfig:{
 
  endpoint: "/posts",
  method: "POST",
  body: { name: "John" },
  headers:{}
  
},
  runOnTimeOfScreenMount: true,
  initialLoadingState: true,
  reFetchDependencies: [someDependency],
});
```



| Prop | Type | Required | Description |
|-----|------|---------|-------------|
| `apiCallingFunction` | `(...params: any[]) => Promise<any>` | ✅ (or use `apiConfig`) | API function |
| `apiParameters` | `any[]` | ❌ | Parameters to pass to API function |
| `apiConfig` | `FetchDataProps` | ✅ (or use `apiCallingFunction`) | For direct API call |
| `onError` | `(error: any) => void` | ❌ | Custom error handler |
| `runOnTimeOfScreenMount` | `boolean` | ❌ | Auto run fetch on mount |
| `initialData` | `any` | ❌ | Preload data |
| `reFetchDependencies` | `any[]` | ❌ | Auto refetch when deps change |
| `logoutFunction` | `() => void` | ❌ | Custom logout handler |

---

# 🔗 `apiConfig Props`




| Field | Type | Required |
|------|------|----------|
| url | string | ✅(if not passed in AuthProvider) |
| endpoint | string | ✅ |
| method | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | ❌ (default GET) |
| body | any | ❌ |
| token | string | ❌(can pass on AuthProvider also) |
| headers | Record<string, string> | ❌ |



---

# 🔥 Advanced Features

- 🌀 **Auto Re-fetch** when `reFetchDependencies` change
- 🔥 **alterData()** allows you to update the state manually
- 🛡️ **401/403 Auto Logout**

---

# 🛡️ Error and Status Code Handling

It automatically handles status codes like:
- `2xx` ✅ (Success)
- `4xx` ⚠️ (Error) → fires `onError`
- `5xx` ❌ (Server error) → fires `onError`
- `401/403` 🚪→ triggers logout

Custom handling based on your own codes is supported using `customActions`!

---

# 🎯 Tips

- If using `apiConfig`, you **must** provide `url` or have `baseURL` from `AuthProvider`.
- Use `alterData()` if you need to modify API response manually.
- Use `reFetchDependencies` to auto-refresh your data easily.

---





# 📚 Summary

| Feature                | Status |
|-------------------------|--------|
| Loading Handling        | ✅ |
| Error Handling          | ✅ |
| Auto Re-fetching        | ✅ |
| Manual Data Change      | ✅ |
| Auto Logout             | ✅ |
| Custom Status Handling  | ✅ |