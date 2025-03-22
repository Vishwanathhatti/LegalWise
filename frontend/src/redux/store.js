import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, persistReducer as persistReducerFunction, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import authSlice from "./authSlice.js";
import modeSlice from "./modeSlice.js";
import conversationSlice from "./conversationSlice.js";

const persistConfig={
    key:"root",
    version:1,
    storage,
}

const rootReducers = combineReducers({
    auth: authSlice,
    mode: modeSlice,
    conversation: conversationSlice,
})

const persistedReducer=  persistReducerFunction(persistConfig,rootReducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;