import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createFilter } from "redux-persist-transform-filter";
import authReducer from "../domain/authSlice";
import userReducer from "../domain/userSlice";

const authFilter = createFilter("auth", ["token", "user"]);
const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [authFilter],
};

const userPersistConfig = {
  key: "users",
  storage,
};

// Application des configurations de persistance aux reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Création du store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: persistedUserReducer,
  },
});

// Création du persistor
const persistor = persistStore(store);

export { store, persistor };
