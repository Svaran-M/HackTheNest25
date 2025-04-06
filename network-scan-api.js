
const SERVER_URL = "http://192.168.1.100:8000"
const SCANNER_BACKEND_URL = SERVER_URL

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch (e) {
      errorData = { detail: response.statusText || `HTTP error ${response.status}` }
    }
    console.error(`Scanner API Error (${response.status}):`, errorData)
    const errorMessage = errorData.detail || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }
  try {
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (e) {
    console.error("Failed to parse JSON response:", e)
    throw new Error("Invalid JSON received from scanner server.")
  }
}

/**
 * @returns {Promise<{status: string, detail: string}>}
 */
export const triggerScan = async () => {
  try {
    console.log(`Triggering scan: ${SCANNER_BACKEND_URL}/scan`)
    const response = await fetch(`${SCANNER_BACKEND_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    const data = await handleResponse(response)
    console.log("Scan trigger response:", data)
    return {
      status: data.status || "success",
      detail: data.message || "Scan started successfully.",
    }
  } catch (error) {
    console.error("Error triggering scan:", error)
    throw error 
  }
}

/**
 * @returns {Promise<{latest_summary: string}>} - The latest summary object
 */
export const getLatestSummary = async () => {
  try {
    console.log(`Fetching latest summary: ${SCANNER_BACKEND_URL}/summary`)
    const response = await fetch(`${SCANNER_BACKEND_URL}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    const data = await handleResponse(response)
    console.log("Latest summary response:", data)
    return {
      latest_summary: data.summary || "No summary available.",
    }
  } catch (error) {
    console.error("Error fetching latest summary:", error)
    throw error
  }
}

/**
 * @returns {Promise<{summaries: Array<{id: int, timestamp: string, summary: string}>}>} - Object containing list of summaries
 */
export const getSummaries = async () => {
  try {
    console.log(`Fetching all summaries: ${SCANNER_BACKEND_URL}/summaries`)
    const response = await fetch(`${SCANNER_BACKEND_URL}/summaries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
s
    const data = await handleResponse(response)
    console.log("All summaries response:", data)


    const summaries = data.summaries || data.history || []
    return { summaries }
  } catch (error) {
    console.error("Error fetching all summaries:", error)
    throw error
  }
}

let scannerBackendUrl = SCANNER_BACKEND_URL
export const updateServerUrl = (newUrl) => {
  if (newUrl && typeof newUrl === "string") {
    scannerBackendUrl = newUrl
    return true
  }
  return false
}

