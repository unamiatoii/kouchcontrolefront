import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createFilter } from "redux-persist-transform-filter";
import authReducer from "../domain/authSlice";
import userReducer from "../domain/userSlice";
import roleReducer from "../domain/roleSlice"; // Import roleReducer

// Persist configuration for auth and user slices
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

// Applying persist configurations to reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Create the store with all reducers, excluding role from persistence
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: persistedUserReducer,
    roles: roleReducer,
  },
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
