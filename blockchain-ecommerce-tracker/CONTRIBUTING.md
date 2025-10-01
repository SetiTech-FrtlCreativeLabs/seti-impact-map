# Contributing to Initiative Tracker

Thank you for your interest in contributing to the Blockchain E-commerce Initiative Tracker! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Getting Started

1. **Fork and clone the repository:**
```bash
git clone https://github.com/your-username/blockchain-ecommerce-tracker.git
cd blockchain-ecommerce-tracker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start development environment:**
```bash
docker-compose up -d
npm run migrate
npm run seed
```

5. **Start development servers:**
```bash
npm run dev
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical fixes

### Creating a Feature

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run tests and linting:**
```bash
npm run test
npm run lint
```

6. **Commit your changes:**
```bash
git add .
git commit -m "feat: add your feature description"
```

7. **Push and create a pull request**

### Commit Message Format

We use conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add OAuth login support
fix(api): resolve user profile endpoint error
docs(readme): update installation instructions
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type usage
- Use meaningful variable and function names

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful comments
- Keep functions small and focused

### Database

- Use Prisma migrations for schema changes
- Write seed scripts for test data
- Follow naming conventions
- Add proper indexes

### Smart Contracts

- Follow Solidity best practices
- Use OpenZeppelin standards
- Write comprehensive tests
- Document contract functions

## Testing

### Unit Tests

```bash
# Backend tests
cd backend && npm run test

# Frontend tests
cd frontend && npm run test

# Smart contract tests
cd contracts && npm run test
```

### Integration Tests

```bash
# E2E tests
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## Pull Request Process

### Before Submitting

1. **Run all tests:**
```bash
npm run test
npm run lint
npm run build
```

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Ensure all checks pass**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Code Review Process

### For Reviewers

1. **Check code quality:**
   - Follows coding standards
   - Proper error handling
   - Security considerations

2. **Verify functionality:**
   - Tests are comprehensive
   - Edge cases covered
   - Performance impact considered

3. **Review documentation:**
   - API documentation updated
   - README changes if needed
   - Code comments are clear

### For Authors

1. **Respond to feedback** promptly
2. **Make requested changes** clearly
3. **Ask questions** if feedback is unclear
4. **Update PR** as needed

## Issue Reporting

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Alternative solutions considered

## Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security issues to: security@example.com
- Include detailed information about the vulnerability
- Allow reasonable time for response

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all inputs
- Follow OWASP guidelines
- Keep dependencies updated

## Documentation

### Code Documentation

- Document public APIs
- Use JSDoc for functions
- Include examples in comments
- Update README for major changes

### API Documentation

- Update OpenAPI/Swagger specs
- Include request/response examples
- Document error codes
- Keep versioning consistent

## Release Process

### Versioning

We use Semantic Versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- `1.0.0` - Initial release
- `1.1.0` - New features
- `1.1.1` - Bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow community standards

### Getting Help

- Check existing issues first
- Use GitHub discussions for questions
- Join our Discord community
- Read the documentation

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to maintainer team (for significant contributions)

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read the documentation
3. Join our community Discord
4. Create a new issue for clarification

Thank you for contributing to Initiative Tracker! 🚀
