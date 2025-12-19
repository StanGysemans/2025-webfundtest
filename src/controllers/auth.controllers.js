import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    // Support both PascalCase and camelCase for Email/Password
    const body = {
      ...req.body,
      Email: req.body.Email || req.body.email,
      Password: req.body.Password || req.body.password
    };
    const user = await authService.register(body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // Support both PascalCase and camelCase
    const Email = req.body.Email || req.body.email;
    const Password = req.body.Password || req.body.password;
    const result = await authService.login(Email, Password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

