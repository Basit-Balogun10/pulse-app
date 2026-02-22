/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as appointments from "../appointments.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as clinics from "../clinics.js";
import type * as demoUser from "../demoUser.js";
import type * as healthEntries from "../healthEntries.js";
import type * as http from "../http.js";
import type * as nudges from "../nudges.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  appointments: typeof appointments;
  auth: typeof auth;
  chat: typeof chat;
  clinics: typeof clinics;
  demoUser: typeof demoUser;
  healthEntries: typeof healthEntries;
  http: typeof http;
  nudges: typeof nudges;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
