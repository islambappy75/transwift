# transwift

A modern USD to BDT currency exchange web application.

## Admin Access

### Default Admin Credentials
For initial setup and demo purposes, the application comes with default admin credentials:

- **Email**: `admin@transwift.com`
- **Password**: `TranswiftAdmin2026!`

> **⚠️ SECURITY WARNING**: 
> - **CHANGE THE DEFAULT PASSWORD IMMEDIATELY** after your first login
> - Never commit real passwords to version control
> - Use strong, unique passwords for production deployments
> - Consider implementing proper backend authentication for production use

### Security Features

1. **Password Hashing**: Admin passwords are hashed using SHA-256 before storage
2. **Secure Storage**: Passwords are never stored in plain text in localStorage
3. **Migration Support**: The system supports both legacy and hashed passwords for smooth migration

### Running the Application

1. Start a local web server:
   ```bash
   python -m http.server 8000
   ```

2. Open your browser to `http://localhost:8000`

3. Access admin panel at `http://localhost:8000/admin/login.html`

### For Production Deployment

- Implement proper server-side authentication
- Use HTTPS for all connections
- Implement rate limiting on login attempts
- Add multi-factor authentication (MFA)
- Use environment variables for sensitive configuration
- Regularly update and rotate passwords
