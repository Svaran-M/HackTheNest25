
const BACKEND_URL = "http://10.0.0.42:8000" // <--- !!! VERIFY IP and PORT !!!

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch (e) {
      errorData = { detail: response.statusText || `HTTP error ${response.status}` }
    }
    console.error(`API Error (${response.status}):`, errorData)
    const errorMessage = errorData.detail || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }
  try {
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (e) {
    console.error("Failed to parse JSON response:", e)
    throw new Error("Invalid JSON received from server.")
  }
}

/**
 * Request a new temporary email from the backend server.
 */
export const generateTempEmail = async () => {
  try {
    console.log(`Requesting new email from backend: ${BACKEND_URL}/generate_email`)
    const response = await fetch(`${BACKEND_URL}/generate_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    const data = await handleResponse(response)
    console.log("Received email data from backend:", data)
    return {
      ...data,
      expiresAt: Number(data.expiresAt),
    }
  } catch (error) {
    console.error("Error calling backend /generate_email:", error)
    // Add specific check for Network request failed
    if (error.message === "Network request failed") {
      throw new Error("Network request failed. Check backend server status, IP/Port, Firewall, and HTTP settings.")
    }
    throw error // Re-throw other errors
  }
}

/**
 * Fetch inbox messages from the backend server using the token.
 */
export const fetchMessages = async (token) => {
  if (!token) {
    console.warn("fetchMessages called without a token.")
    return []
  }
  try {
    const response = await fetch(`${BACKEND_URL}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    const data = await handleResponse(response)
    return data.messages || []
  } catch (error) {
    console.error("Error calling backend /messages:", error)
    // Add specific check for Network request failed
    if (error.message === "Network request failed") {
      throw new Error("Network request failed. Check backend server status, IP/Port, Firewall, and HTTP settings.")
    }
    // Re-throw other errors (like 401 from handleResponse)
    throw error
  }
}

// Optional formatMessage function (backend handles formatting now)
export const formatMessage = (message) => {
  return {
    id: message.id || `temp_${Math.random()}`,
    sender: message.sender || "unknown@sender.com",
    subject: message.subject || "(No Subject)",
    receivedAt: message.receivedAt || new Date().toISOString(),
    read: message.read || false,
    intro: message.intro || "",
  }
}

