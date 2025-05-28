import Api from './Api'; // Ensure you have the correct import for your API instance


// Function to log in a user
export const login = async (credentials) => {
    const response = await Api.post('/auth/login', credentials);
    return response.data; // Return the user data from the response
};


// Function to log out a user
export const logout = async () => {
    await Api.post('/auth/logout'); // Call the logout endpoint
};


// Function to verify a token
export const verifyToken = async (token) => {
    const response = await Api.post('/auth/verify-token', { token });
    return response.data.user; // Return the user data from the response
};