# Auth Flow
1. user logs in, system stores token in localstorage
2. user gets navigated to "/", where in useEffect if there is token in localStorage, it runs the fetchUser asyncThunk
3. insdie fetchUserAsynThunk, state.user gets set
4. 