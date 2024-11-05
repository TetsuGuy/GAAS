export const API_VERSION = 1 // --> ENV!
export const API_VERSION_URL = `/api/v${API_VERSION}`

export * as routesV1 from "./v1/routesV1"

export function buildUrl(method: string): string {
  return `${API_VERSION_URL}/${method}?api_key=${process.env.API_KEY}`
}
