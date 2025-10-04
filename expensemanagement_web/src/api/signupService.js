// signupService.js
export const signupUser = async (signupData) => {
  try {
    const response = await fetch('https://example.com/api/signup', { // replace with your API endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    return await response.json(); // expect { user, token } or similar
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};
