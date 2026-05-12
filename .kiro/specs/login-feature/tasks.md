# Implementation Plan: Login Feature

## Overview

This implementation plan breaks down the login feature into actionable coding tasks. The feature includes reusable UI components (Button, Input, FormError, LoadingSpinner), authentication layouts (AuthLayoutComponent, LoginLayoutComponent, ResetPasswordLayoutComponent), main application layout (MainLayoutComponent with Dashboard and Home pages), authentication services, guards, and interceptors.

The implementation follows a modular approach with three main feature modules: ComponentsModule (shared UI components), AuthModule (authentication logic and layouts), and MainModule (main application layout and pages). All components use TypeScript with Angular 21 and Tailwind CSS for styling.

## Tasks

- [x] 1. Set up project structure and install dependencies
  - Create directory structure for components, auth, and main modules
  - _Requirements: All requirements depend on proper project structure_

- [x] 2. Create reusable UI components (ComponentsModule)
  - [x] 2.1 Create ComponentsModule and configure exports
    - Create `src/app/components/components.module.ts`
    - Import CommonModule
    - Configure module to export all component declarations
    - _Requirements: 1.1, 1.2, 1.3, 2.3, 2.4_

  - [x] 2.2 Implement ButtonComponent with loading and variant support
    - Create `src/app/components/button/button.component.ts`
    - Create template with loading spinner and disabled state
    - Add support for primary, secondary, and danger variants
    - Implement click event handling
    - Create CSS with Tailwind classes
    - _Requirements: 1.2, 3.2, 3.3_

  - [x] 2.3 Implement InputComponent with label and error display
    - Create `src/app/components/input/input.component.ts`
    - Create template with label, input, and error message slots
    - Add support for text, email, password, and number types
    - Implement value change, blur, and focus event handling
    - Add ARIA attributes for accessibility
    - Create CSS with Tailwind classes
    - _Requirements: 1.1, 2.3, 2.4, 7.1, 7.2_

  - [x] 2.4 Implement FormErrorComponent with ARIA support
    - Create `src/app/components/form-error/form-error.component.ts`
    - Create template with role="alert" and aria-live="polite"
    - Create CSS with Tailwind classes for error styling
    - _Requirements: 2.3, 4.1, 4.2, 4.3, 7.5_

  - [x] 2.5 Implement LoadingSpinnerComponent
    - Create `src/app/components/loading-spinner/loading-spinner.component.ts`
    - Create template with spinner animation
    - Add ARIA label support
    - Create CSS with Tailwind classes for spinner animation
    - _Requirements: 3.2_

- [x] 3. Create authentication data models
  - [x] 3.1 Create User model interface
    - Create `src/app/auth/models/user.model.ts`
    - Define User interface with id, email, name, roles, createdAt
    - _Requirements: 8.1, 8.4_

  - [x] 3.2 Create AuthRequest and AuthResponse models
    - Create `src/app/auth/models/auth-request.model.ts`
    - Create `src/app/auth/models/auth-response.model.ts`
    - Define interfaces for API request/response
    - _Requirements: 3.1, 3.4_

- [ ] 4. Implement AuthService with authentication logic
  - [x] 4.1 Create AuthService with login method
    - Create `src/app/auth/services/auth.service.ts`
    - Implement login method with HTTP POST to /api/auth/login
    - Implement BehaviorSubjects for currentUser$ and isAuthenticated$
    - Add error handling for network, server, and authentication errors
    - _Requirements: 3.1, 3.4, 4.1, 4.2, 4.3_

  - [x] 4.2 Implement token storage logic
    - Implement storeToken method with localStorage/sessionStorage logic
    - Implement getToken method to retrieve token from storage
    - Implement clearToken method to remove token from storage
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 4.3 Implement logout method
    - Clear token from storage
    - Reset currentUser$ and isAuthenticated$ subjects
    - _Requirements: 8.5_

  - [x] 4.4 Implement auto-authentication on initialization
    - Implement initializeAuth method called in constructor
    - Validate stored token with /api/auth/validate endpoint
    - Update authentication state if token is valid
    - Clear token if validation fails
    - _Requirements: 8.4_

- [ ] 5. Implement AuthGuard and AuthInterceptor
  - [x] 5.1 Create AuthGuard with returnUrl support
    - Create `src/app/auth/guards/auth.guard.ts`
    - Implement CanActivate interface
    - Check authentication status and redirect to login with returnUrl
    - _Requirements: 9.1, 9.2_

  - [x] 5.2 Create AuthInterceptor for token injection
    - Create `src/app/auth/interceptors/auth.interceptor.ts`
    - Implement HttpInterceptor interface
    - Add Authorization header with Bearer token to requests
    - Handle 401 errors and trigger logout
    - _Requirements: 3.1, 8.5_

- [ ] 6. Create authentication layouts (AuthModule)
  - [x] 6.1 Create AuthModule and configure routing
    - Create `src/app/auth/auth.module.ts`
    - Import ReactiveFormsModule, CommonModule, RouterModule, ComponentsModule
    - Configure child routes for /login and /reset-password
    - Provide AuthService, AuthGuard, AuthInterceptor
    - _Requirements: 1.1, 9.5_

  - [x] 6.2 Implement AuthLayoutComponent wrapper
    - Create `src/app/auth/layouts/auth-layout/auth-layout.component.ts`
    - Create template with logo, title, router-outlet, and footer
    - Implement dynamic title based on current route
    - Create CSS with Tailwind classes for centered card layout
    - _Requirements: 1.3, 1.4, 6.1, 6.2, 6.3, 6.4_

  - [x] 6.3 Implement LoginLayoutComponent with reactive form
    - Create `src/app/auth/layouts/login-layout/login-layout.component.ts`
    - Create FormGroup with email, password, and rememberMe controls
    - Add validators (required, email format)
    - Implement onSubmit method to call AuthService.login
    - Handle loading state and error messages
    - Create template using reusable Input and Button components
    - Create CSS with Tailwind classes
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 9.4, 10.1, 10.2, 10.3, 10.4_

  - [x] 6.4 Implement password visibility toggle in LoginLayoutComponent
    - Add passwordVisible boolean property
    - Implement togglePasswordVisibility method
    - Add toggle button in password input suffix slot
    - Update input type based on passwordVisible state
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.5 Implement ResetPasswordLayoutComponent (placeholder)
    - Create `src/app/auth/layouts/reset-password-layout/reset-password-layout.component.ts`
    - Create FormGroup with email control
    - Create template using reusable Input and Button components
    - Add placeholder onSubmit method with console.log
    - Create CSS with Tailwind classes
    - _Requirements: Future requirement_

- [ ] 7. Create main application layout (MainModule)
  - [x] 7.1 Create MainModule and configure routing
    - Create `src/app/main/main.module.ts`
    - Import CommonModule, RouterModule, ComponentsModule
    - Configure child routes for /dashboard and /home
    - _Requirements: 9.3_

  - [x] 7.2 Implement MainLayoutComponent with navigation
    - Create `src/app/main/main-layout/main-layout.component.ts`
    - Create template with header, navigation, router-outlet, and footer
    - Subscribe to AuthService.currentUser$ to display user info
    - Implement logout method
    - Create CSS with Tailwind classes for layout
    - _Requirements: 9.3_

  - [x] 7.3 Create DashboardComponent (placeholder)
    - Create `src/app/main/pages/dashboard/dashboard.component.ts`
    - Create simple template with "Dashboard" heading
    - Create CSS with Tailwind classes
    - _Requirements: 9.3_

  - [x] 7.4 Create HomeComponent (placeholder)
    - Create `src/app/main/pages/home/home.component.ts`
    - Create simple template with "Home" heading
    - Create CSS with Tailwind classes
    - _Requirements: 9.3_

- [ ] 8. Integrate routing with nested layouts
  - [x] 8.1 Update app-routing.module.ts with nested routes
    - Configure AuthLayoutComponent as parent for /login and /reset-password
    - Configure MainLayoutComponent as parent for /dashboard and /home
    - Add AuthGuard to MainLayoutComponent routes
    - Add wildcard redirect to /login
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9. Register providers and interceptors in app module
  - [x] 9.1 Update app.module.ts with providers
    - Import AuthModule and MainModule
    - Register AuthInterceptor in HTTP_INTERCEPTORS
    - Import HttpClientModule
    - _Requirements: 3.1, 8.5_

- [ ] 10. Implement responsive design and accessibility
  - [x] 10.1 Add responsive breakpoints to all components
    - Update CSS for mobile (<768px), tablet (768-1023px), desktop (1024px+)
    - Ensure touch-friendly button sizes on mobile (minimum 44px)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 10.2 Verify accessibility compliance
    - Verify ARIA labels on all form inputs
    - Test keyboard navigation (Tab order: email → password → remember me → submit)
    - Verify color contrast ratios meet WCAG 2.1 AA standards
    - Verify focus indicators are visible
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

## Notes

- Each task references specific requirements for traceability
- The implementation uses TypeScript with Angular 21, Tailwind CSS
- All components follow Angular best practices with reactive forms and RxJS
- The modular architecture (ComponentsModule, AuthModule, MainModule) promotes reusability and maintainability
