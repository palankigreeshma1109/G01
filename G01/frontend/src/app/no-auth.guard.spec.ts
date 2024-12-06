import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard';
import { AuthService } from 'src/app/services/auth.service';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for AuthService and Router
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(NoAuthGuard); // Inject the guard
  });

  it('should allow navigation if user is not logged in', () => {
    // Simulate user not logged in
    mockAuthService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate({} as any, { url: '/login' } as any);
    expect(result).toBeTrue(); // Guard should allow navigation
  });

  it('should prevent navigation to /login if user is logged in', () => {
    // Simulate user logged in
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate({} as any, { url: '/login' } as any);
    expect(result).toBeFalse(); // Guard should prevent navigation to /login
  });

  it('should allow navigation to other routes if user is logged in', () => {
    // Simulate user logged in
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate({} as any, { url: '/dashboard' } as any);
    expect(result).toBeTrue(); // Guard should allow navigation to non-login routes
  });
});
