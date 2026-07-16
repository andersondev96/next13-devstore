// Mock auth() function to simulate NextAuth.js behavior for demonstration.
// In a real application, this would be your configured Auth.js `auth()` export.

export async function auth() {
  // Simulate a logged-in user who has purchased products.
  // This user ID 'clerk-user-id-1' corresponds to the mock order in `data.json`.
  return {
    user: {
      id: "clerk-user-id-1",
      name: "Anderson",
      email: "anderson.ff@example.com",
      image: "https://github.com/andersondev96.png",
    },
  };
  // To test the unauthenticated state, you can return null:
  // return null
}
