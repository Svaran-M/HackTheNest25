import axios from "axios"


const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
const API_KEY = "AIzaSyDZ8fiw6nicR7cQsRPE7vdFPHN4H2TxOyU" 

let conversationHistory = []

/**
 * @param {string} question 
 * @returns {Promise<string>}
 */
export const generateResponse = async (question) => {
  try {
    conversationHistory.push({
      role: "user",
      parts: [{ text: question }],
    })
    const requestBody = {
      contents: formatConversationForAPI(),
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    }

    
    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, requestBody)

    
    const responseText = response.data.candidates[0].content.parts[0].text

    
    conversationHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    })

    return responseText
  } catch (error) {
    console.error("Error generating response from Gemini API:", error)

    
    if (error.response) {
      console.error("API Error Response:", error.response.data)
    }

    
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."
  }
}

/**
 * Format conversation history for the Gemini API
 * @returns {Array} - Formatted conversation history
 */
const formatConversationForAPI = () => {
  if (conversationHistory.length === 0) {
    return [
      {
        role: "user",
        parts: [
          {
            text: "You are a cybersecurity assistant for the Fortress app. Your goal is to help users with security questions and provide advice on protecting their digital life. Be concise, helpful, and focus on security best practices.",
          },
        ],
      },
    ]
  }

  const formattedConversation = [
    {
      role: "user",
      parts: [
        {
          text: "You are a cybersecurity assistant for the Fortress app. Your goal is to help users with security questions and provide advice on protecting their digital life. Be concise, helpful, and focus on security best practices. Now continue our conversation.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "I'll help you with your cybersecurity questions and provide advice to protect your digital life.",
        },
      ],
    },
  ]

  const recentHistory = conversationHistory.slice(-10)
  return formattedConversation.concat(recentHistory)
}

export const clearConversationHistory = () => {
  conversationHistory = []
}

