const logout = async () => {
  try {
    await logoutUser();
  } catch {
    // ignore error (token možda već istekao)
  } finally {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};