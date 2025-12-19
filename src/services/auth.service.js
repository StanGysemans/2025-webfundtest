import prisma from '../../prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (data) => {
  // Validate required fields - check both PascalCase and camelCase
  const email = data.Email || data.email;
  const passwordValue = data.Password || data.password;
  
  // Validate email
  if (!email) {
    throw new Error('Email is required');
  }
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  if (email.trim() === '') {
    throw new Error('Email cannot be empty');
  }
  
  // Validate password
  if (!passwordValue) {
    throw new Error('Password is required');
  }
  if (typeof passwordValue !== 'string') {
    throw new Error('Password must be a string');
  }
  if (passwordValue.trim() === '') {
    throw new Error('Password cannot be empty');
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/f025a4e3-0e44-4ac7-9127-cd99e47a3f90',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/services/auth.service.js:32',message:'Before prisma.usercontact.findFirst',data:{email:email.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Check if user already exists
  let existingContact;
  try {
    existingContact = await prisma.usercontact.findFirst({
      where: { Email: email.trim() }
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f025a4e3-0e44-4ac7-9127-cd99e47a3f90',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/services/auth.service.js:38',message:'After prisma.usercontact.findFirst - success',data:{found:!!existingContact},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f025a4e3-0e44-4ac7-9127-cd99e47a3f90',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/services/auth.service.js:42',message:'Prisma query error',data:{errorMessage:error.message,errorCode:error.code,errorName:error.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    throw error;
  }
  
  if (existingContact) {
    throw new Error('User with this email already exists');
  }

  // Hash password - passwordValue is guaranteed to be a non-empty string at this point
  const passwordHash = await bcrypt.hash(passwordValue.trim(), 10);
  
  // Extract other fields
  const { 
    FirstName, 
    LastName, 
    Age, 
    CampusCity, 
    Gender, 
    Bio, 
    Role
  } = data;

  // Build Prisma data object with only valid fields (PascalCase)
  const prismaData = {
    FirstName,
    LastName,
    PasswordHash: passwordHash
  };

  // Only add optional fields if they are provided
  if (Age !== undefined) prismaData.Age = Age;
  if (CampusCity) prismaData.CampusCity = CampusCity;
  if (Gender) prismaData.Gender = Gender;
  if (Bio) prismaData.Bio = Bio;
  if (Role) prismaData.Role = Role;

  // Create user and contact in transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: prismaData
    });

    await tx.usercontact.create({
      data: {
        UserID: newUser.UserID,
        Email: email
      }
    });

    return newUser;
  });

  return user;
};

export const login = async (Email, Password) => {
  if (!Email) {
    throw new Error('Email is required');
  }
  
  if (!Password) {
    throw new Error('Password is required');
  }
  
  // Find user by email
  const contact = await prisma.usercontact.findFirst({
    where: { Email: Email },
    include: { user: true }
  });
  
  if (!contact || !contact.user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await bcrypt.compare(Password, contact.user.PasswordHash || '');
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { 
      UserID: contact.user.UserID, 
      role: contact.user.Role || 'user' 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      UserID: contact.user.UserID,
      FirstName: contact.user.FirstName,
      LastName: contact.user.LastName,
      Role: contact.user.Role
    }
  };
};

