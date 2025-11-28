import api from './api';

export async function loginUser(username, password) {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message || 'Login successful'
      };
    }

    return {
      success: false,
      message: response.data.message || 'Invalid username or password'
    };

  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Network Error'
    };
  }
}
