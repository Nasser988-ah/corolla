document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For demo purposes, using simple credentials
    // In production, this should be replaced with proper authentication
    if (username === 'admin' && password === 'admin123') {
        // Store login state
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}); 