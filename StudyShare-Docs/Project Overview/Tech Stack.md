# Tech Stack

#project/studyshare #type/documentation #priority/high

## 🏗️ Technology Overview

StudyShare uses a modern, full-stack JavaScript/TypeScript technology stack designed for scalability, maintainability, and developer experience.

## 🎯 Frontend Stack

### Core Technologies
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.2.2** - Type-safe JavaScript development
- **Vite 5.0.8** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling
- **Responsive Design** - Mobile-first approach

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Vitest** - Unit testing framework

## 🎯 Backend Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development

### Database & ORM
- **Prisma** - Modern database ORM
- **SQLite** - Lightweight database (development)
- **PostgreSQL** - Production database (planned)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Nodemon** - Development server with auto-reload

## 🎯 Development Environment

### Package Management
- **npm** - Primary package manager
- **package-lock.json** - Dependency locking

### Version Control
- **Git** - Source code version control
- **GitHub** - Repository hosting and collaboration

### CI/CD
- **GitHub Actions** - Automated testing and deployment
- **Deployment Scripts** - Custom deployment automation

## 🎯 File Structure

```
StudyShare/
├── 📁 Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API client functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── 📁 Backend (Express + TypeScript + Prisma)
│   ├── src/
│   │   └── index.ts       # Express server
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── seed.ts        # Database seeding
│   │   └── migrations/    # Database migrations
│   └── package.json       # Backend dependencies
│
└── 📁 Documentation
    ├── docs/              # Technical documentation
    └── StudyShare-Docs/   # Obsidian vault
```

## 🎯 Key Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "typescript": "^5.2.2",
  "vite": "^5.0.8",
  "vitest": "^1.0.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "prisma": "^5.0.0",
  "typescript": "^5.2.2",
  "@types/express": "^4.17.17",
  "@types/node": "^20.0.0"
}
```

## 🎯 Development Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript type checking
```

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
```

## 🎯 Why This Stack?

### Frontend Choices
- **React**: Mature, ecosystem-rich, great developer experience
- **TypeScript**: Type safety, better IDE support, fewer runtime errors
- **Vite**: Fast development server, modern build tooling
- **Tailwind**: Rapid UI development, consistent design system

### Backend Choices
- **Express**: Simple, flexible, great for APIs
- **Prisma**: Type-safe database access, excellent developer experience
- **SQLite**: Perfect for development, easy to set up
- **TypeScript**: Shared types between frontend and backend

### Development Tools
- **ESLint + Prettier**: Consistent code style
- **Husky**: Automated quality checks
- **Vitest**: Fast, modern testing
- **GitHub Actions**: Automated CI/CD

## 🔗 Related Documents

- [[Architecture Decisions]] - Technical decisions and rationale
- [[Development Setup]] - How to set up the development environment
- [[API Documentation]] - Backend API reference
- [[Database Schema]] - Database structure and relationships

## 📝 Notes

- All dependencies are kept up to date
- TypeScript strict mode enabled
- ESLint rules configured for React and TypeScript
- Pre-commit hooks ensure code quality
- Testing setup with Vitest for fast feedback 