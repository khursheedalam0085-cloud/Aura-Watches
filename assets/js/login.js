 // DOM Elements
        const formBox = document.getElementById('formBox');
        const showSignupBtn = document.getElementById('showSignup');
        const showLoginBtn = document.getElementById('showLogin');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const toggleLoginPassword = document.getElementById('toggleLoginPassword');
        const toggleSignupPassword = document.getElementById('toggleSignupPassword');
        const loginPassword = document.getElementById('loginPassword');
        const signupPassword = document.getElementById('signupPassword');
        const loginMessage = document.getElementById('loginMessage');
        const signupMessage = document.getElementById('signupMessage');
        const rememberMe = document.getElementById('rememberMe');
        const forgotPassword = document.getElementById('forgotPassword');

        // Toggle between login and signup forms
        showSignupBtn.addEventListener('click', () => {
            formBox.classList.add('active');
            clearMessages();
        });
        
        showLoginBtn.addEventListener('click', () => {
            formBox.classList.remove('active');
            clearMessages();
        });

        // Toggle password visibility
        toggleLoginPassword.addEventListener('click', () => {
            togglePasswordVisibility(loginPassword, toggleLoginPassword);
        });
        
        toggleSignupPassword.addEventListener('click', () => {
            togglePasswordVisibility(signupPassword, toggleSignupPassword);
        });

        function togglePasswordVisibility(passwordField, toggleIcon) {
            const isPassword = passwordField.type === 'password';
            passwordField.type = isPassword ? 'text' : 'password';
            toggleIcon.className = isPassword 
                ? 'ri-eye-fill toggle-password' 
                : 'ri-eye-off-fill toggle-password';
        }

        // Clear message boxes
        function clearMessages() {
            loginMessage.textContent = '';
            loginMessage.className = 'message';
            signupMessage.textContent = '';
            signupMessage.className = 'message';
        }

        // Show message in forms
        function showMessage(element, message, type) {
            element.textContent = message;
            element.className = `message ${type}`;
            setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 5000);
        }

        // Load remembered user if exists
        function loadRememberedUser() {
            const rememberedUser = localStorage.getItem('rememberedUser');
            if (rememberedUser) {
                const user = JSON.parse(rememberedUser);
                document.getElementById('loginUsername').value = user.username || '';
                document.getElementById('loginPassword').value = user.password || '';
                rememberMe.checked = true;
            }
        }

        // Save user to local storage
        function saveUser(username, email, password) {
            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            const userExists = users.some(user => user.username === username || user.email === email);
            
            if (userExists) {
                return { success: false, message: 'User already exists!' };
            }
            
            // Add new user
            users.push({
                username: username,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            });
            
            // Save to local storage
            localStorage.setItem('users', JSON.stringify(users));
            return { success: true, message: 'Account created successfully!' };
        }

        // Authenticate user
        function authenticateUser(username, password) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(user => 
                (user.username === username || user.email === username) && 
                user.password === password
            );
            
            if (user) {
                return { success: true, user: user };
            } else {
                return { success: false, message: 'Invalid username or password!' };
            }
        }

        // Handle login
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            // Validation
            if (!username || !password) {
                showMessage(loginMessage, 'Please fill in all fields!', 'error');
                return;
            }
            
            // Authenticate
            const authResult = authenticateUser(username, password);
            
            if (authResult.success) {
                showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
                
                // Remember user if checkbox is checked
                if (rememberMe.checked) {
                    localStorage.setItem('rememberedUser', JSON.stringify({
                        username: username,
                        password: password
                    }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Store current user session
                sessionStorage.setItem('currentUser', JSON.stringify(authResult.user));
                
                // Redirect after successful login (simulate)
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);
            } else {
                showMessage(loginMessage, authResult.message, 'error');
            }
        });

        // Handle signup
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validation
            if (!username || !email || !password || !confirmPassword) {
                showMessage(signupMessage, 'Please fill in all fields!', 'error');
                return;
            }
            
            if (!agreeTerms) {
                showMessage(signupMessage, 'You must agree to the terms & conditions!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage(signupMessage, 'Password must be at least 6 characters!', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage(signupMessage, 'Passwords do not match!', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage(signupMessage, 'Please enter a valid email address!', 'error');
                return;
            }
            
            // Save user
            const saveResult = saveUser(username, email, password);
            
            if (saveResult.success) {
                showMessage(signupMessage, saveResult.message, 'success');
                
                // Clear form
                document.getElementById('signupUsername').value = '';
                document.getElementById('signupEmail').value = '';
                document.getElementById('signupPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                document.getElementById('agreeTerms').checked = false;
                
                // Switch to login form after successful signup
                setTimeout(() => {
                    formBox.classList.remove('active');
                    showMessage(loginMessage, 'Account created! Please login.', 'success');
                }, 2000);
            } else {
                showMessage(signupMessage, saveResult.message, 'error');
            }
        });

        // Forgot password functionality
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            const username = prompt("Enter your username or email to reset password:");
            
            if (username) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(user => 
                    user.username === username || user.email === username
                );
                
                if (user) {
                    alert(`Password for ${user.username} is: ${user.password}\n\nPlease change it after login for security.`);
                } else {
                    alert('User not found!');
                }
            }
        });

        // Initialize - load remembered user if exists
        window.addEventListener('DOMContentLoaded', () => {
            loadRememberedUser();
            
            // Check if there are any users in local storage (for demo)
            const users = JSON.parse(localStorage.getItem('users'));
            if (!users || users.length === 0) {
                // Add a demo user for testing
                const demoUsers = [
                    {
                        username: 'demo',
                        email: 'demo@example.com',
                        password: 'demo123',
                        createdAt: new Date().toISOString()
                    }
                ];
                localStorage.setItem('users', JSON.stringify(demoUsers));
            }
        });

        // After successful login/signup, trigger header update
if (authResult.success) {
    // ... existing code ...
    
    // Update header profile icon
    if (window.opener) {
        // If opened from main page
        window.opener.checkLoginStatus();
    }
    // Close login window after delay
    setTimeout(() => {
        window.close();
        window.location.href = 'index.html';
    }, 1500);
}