import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { createFilter } from "redux-persist-transform-filter";
import authReducer from "../domain/authSlice";
import userReducer from "../domain/userSlice";
import roleReducer from "../domain/roleSlice";
import entrepotReducer from "../domain/entrepotSlice";

// Persist configuration for auth and user slices
const authFilter = createFilter("auth", ["token", "user"]);

const authPersistConfig = {
  key: "auth",
  storage: storageSession,
  transforms: [authFilter],
};

const userPersistConfig = {
  key: "users",
  storage: storageSession,
};

const rolePersistConfig = {
  key: "role",
  storage: storageSession,
};

const entrepotPersistConfig = {
  key: "entrepot",
  storage: storageSession,
};

// Applying persist configurations to reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedEntrepotReducer = persistReducer(entrepotPersistConfig, entrepotReducer);
const persistedRoleReducer = persistReducer(rolePersistConfig, roleReducer);

// Create the store with all reducers, excluding role from persistence
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: persistedUserReducer,
    roles: persistedRoleReducer,
    entrepots: persistedEntrepotReducer,
  },
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
