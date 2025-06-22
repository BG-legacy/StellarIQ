# Services

This directory contains service layer files that handle business logic and external integrations.

## Structure

- `authService.js` - Authentication and user management services
- `careerService.js` - Career planning business logic
- `skillsService.js` - Skills assessment business logic
- `pivotService.js` - Career pivot analysis services
- `aiService.js` - AI integration and chat services
- `emailService.js` - Email sending functionality
- `notificationService.js` - Push notifications and alerts

## Usage

Services should:
- Contain business logic separate from controllers
- Handle external API integrations
- Be testable and reusable
- Follow single responsibility principle
- Return promises or use async/await 