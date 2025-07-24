import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock authentication - auto-login for demo
  useEffect(() => {
    const mockUser = {
      id: "1",
      username: "EtherScribe",
      email: "etherscribe@example.com",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      joinDate: "2024-01-15",
      reputation: 1250,
      storiesCreated: 5,
      storiesCollaborated: 12,
      totalVotes: 324,
      nftsEarned: 8,
      badges: ["Early Adopter", "Prolific Writer", "Community Champion"],
      bio: "Passionate storyteller exploring the intersection of technology and narrative.",
    };

    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // Mock login logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        id: "1",
        username: credentials.username,
        email: credentials.email,
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        joinDate: "2024-01-15",
        reputation: 1250,
        storiesCreated: 5,
        storiesCollaborated: 12,
        totalVotes: 324,
        nftsEarned: 8,
        badges: ["Early Adopter", "Prolific Writer", "Community Champion"],
        bio: "Passionate storyteller exploring the intersection of technology and narrative.",
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    setError(null);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
