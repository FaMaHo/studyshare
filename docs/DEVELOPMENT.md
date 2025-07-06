# Development Guide

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studyshare.git
   cd studyshare
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd studyshare-backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cd studyshare-backend
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

4. **Set up database**
   ```bash
   cd studyshare-backend
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd studyshare-backend
   npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

## 📁 Project Structure

```
StudyShare/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── AddNoteModal.tsx     # Note upload modal
│   │   └── AddUniversityModal.tsx # University creation modal
│   ├── api/                     # API utilities
│   │   └── api.ts              # API client functions
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # Type definitions
│   ├── utils/                   # Utility functions
│   │   └── fileUtils.ts        # File handling utilities
│   ├── styles/                  # CSS and styling
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── studyshare-backend/          # Backend source
│   ├── src/
│   │   └── index.ts            # Express server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Database seeding
│   │   └── migrations/         # Database migrations
│   └── generated/               # Prisma generated files
├── docs/                        # Documentation
│   ├── API.md                  # API documentation
│   └── DEVELOPMENT.md          # This file
├── scripts/                     # Build and deployment scripts
│   └── deploy.sh               # Deployment script
├── .github/                     # GitHub configuration
│   └── workflows/              # GitHub Actions
└── README.md                    # Project documentation
```

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd studyshare-backend
npm test
```

### Test Structure
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Writing Tests
```typescript
// Example test for API function
import { getUniversities } from '../api/api';

describe('API Functions', () => {
  test('getUniversities should return universities', async () => {
    const universities = await getUniversities();
    expect(Array.isArray(universities)).toBe(true);
  });
});
```

## 🔧 Code Quality

### Linting
```bash
# Frontend linting
npm run lint

# Backend linting
cd studyshare-backend
npm run lint
```

### Type Checking
```bash
# Frontend type checking
npm run type-check

# Backend type checking
cd studyshare-backend
npm run type-check
```

### Pre-commit Hooks
The project uses pre-commit hooks to ensure code quality:
- Linting
- Type checking
- Test running
- Formatting

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` type when possible

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries

### API Design
- RESTful API design
- Consistent error handling
- Proper HTTP status codes
- Input validation

### Database
- Use Prisma ORM
- Follow naming conventions
- Implement proper relationships
- Use migrations for schema changes

## 🚀 Development Workflow

### Feature Development
1. Create a feature branch
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make your changes
3. Write tests for new functionality
4. Update documentation
5. Commit your changes
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. Push and create pull request
   ```bash
   git push origin feature/new-feature
   ```

### Bug Fixes
1. Create a bug fix branch
   ```bash
   git checkout -b fix/bug-description
   ```

2. Fix the bug
3. Add regression tests
4. Commit and push
   ```bash
   git commit -m "fix: resolve bug description"
   git push origin fix/bug-description
   ```

## 🔍 Debugging

### Frontend Debugging
- Use React DevTools
- Browser developer tools
- Console logging
- Error boundaries

### Backend Debugging
- Use Node.js debugger
- Logging with proper levels
- Database query debugging
- API endpoint testing

### Database Debugging
- Use Prisma Studio
- Check migration logs
- Verify schema changes
- Test queries directly

## 📊 Performance

### Frontend Performance
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

### Backend Performance
- Database query optimization
- Caching strategies
- Rate limiting
- Monitoring and logging

## 🔒 Security

### Frontend Security
- Input validation
- XSS prevention
- CSRF protection
- Secure file handling

### Backend Security
- Input sanitization
- SQL injection prevention
- Authentication (future)
- Authorization (future)
- Rate limiting

## 🚀 Deployment

### Development Deployment
```bash
# Build both frontend and backend
npm run build
cd studyshare-backend
npm run build
cd ..

# Use deployment script
./scripts/deploy.sh
```

### Production Deployment
1. Set up environment variables
2. Configure database
3. Run migrations
4. Build application
5. Deploy to hosting platform

## 📚 Documentation

### Code Documentation
- Use JSDoc comments
- Document complex functions
- Explain business logic
- Keep README updated

### API Documentation
- Keep API.md updated
- Document all endpoints
- Include examples
- Update on changes

### User Documentation
- User guides
- Feature documentation
- Troubleshooting guides
- FAQ

## 🤝 Contributing

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update documentation
6. Submit pull request

### Code Review
- Review for functionality
- Check code quality
- Verify tests
- Ensure documentation

### Release Process
1. Update version numbers
2. Update changelog
3. Create release notes
4. Tag release
5. Deploy to production

## 🐛 Common Issues

### Database Issues
```bash
# Reset database
cd studyshare-backend
npx prisma migrate reset
npx prisma db seed
```

### Build Issues
```bash
# Clear cache
rm -rf node_modules
npm install
npm run build
```

### Port Conflicts
```bash
# Check what's using the port
lsof -i :4000
lsof -i :5173
```

## 📞 Support

### Getting Help
- Check documentation
- Search existing issues
- Create new issue
- Ask in discussions

### Reporting Bugs
- Use issue template
- Include reproduction steps
- Provide error logs
- Describe expected behavior

### Feature Requests
- Use feature request template
- Explain use case
- Provide mockups if possible
- Discuss implementation approach 