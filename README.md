# Invoice Finance Platform

A comprehensive, production-ready invoice financing platform built with modern technologies and professional UI/UX design.

## 🚀 Features

### Core Functionality
- **User Management**: Multi-role system (Borrower, Lender, Admin) with JWT authentication
- **Invoice Management**: Upload, manage, and track invoices with S3 storage
- **KYC Verification**: Aadhaar and PAN verification system with status management
- **Funding Offers**: Create, manage, and accept funding offers
- **Deal Management**: Complete deal lifecycle from creation to settlement
- **Favorites System**: Save and manage preferred invoices and lenders
- **Profile Management**: Comprehensive user profiles with KYC integration

### Technical Features
- **Backend**: Spring Boot 3.x with Spring Security and JPA
- **Frontend**: React 18 with TypeScript and modern design system
- **Database**: MySQL 8.x with Flyway migrations
- **Storage**: AWS S3 integration for document management
- **Security**: JWT-based authentication with RBAC
- **UI/UX**: Premium fintech design with glassmorphism and gradients

## 🏗️ Architecture

```
invoice-ledger/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   ├── com/invoicefinance/
│   │   │   ├── controller/  # REST API endpoints
│   │   │   ├── service/     # Business logic
│   │   │   ├── entity/      # JPA entities
│   │   │   ├── dto/         # Data transfer objects
│   │   │   ├── repository/  # Data access layer
│   │   │   └── config/      # Configuration classes
│   │   └── resources/
│   │       ├── db/migration/ # Flyway migrations
│   │       └── application.properties
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── lib/            # Utility functions and API
│   │   └── index.css       # Premium design system
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA with Hibernate
- **Migrations**: Flyway
- **Build Tool**: Maven
- **Documentation**: OpenAPI 3.0

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **UI Components**: Custom premium components

### Infrastructure
- **Database**: MySQL (Aiven)
- **Storage**: AWS S3
- **Deployment**: Docker-ready

## 📋 Development Guidelines

### Git Commit Policy
We follow a comprehensive commit policy to maintain code quality and consistency. Please read our [Git Commit Policy](git-commit-policy.md) before contributing.

### Branching Strategy
- **`main`**: Production-ready code
- **`backend`**: Backend development branch  
- **`frontend`**: Frontend development branch
- **Feature branches**: `feature/descriptive-name`

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.x
- Maven 3.6+
- Git

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://your-db-host:3306/invoice_finance
spring.datasource.username=your-username
spring.datasource.password=your-password

# JWT Configuration
jwt.secret=your-jwt-secret
jwt.expiration=86400000

# AWS S3 Configuration
aws.s3.bucket=your-s3-bucket
aws.s3.region=your-s3-region
aws.access.key=your-access-key
aws.secret.key=your-secret-key
```

## 📱 UI/UX Features

### Premium Design System
- **Glassmorphism**: Modern backdrop blur effects
- **Gradient System**: Professional color palettes
- **Micro-interactions**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant

### Color Palette
- **Primary**: Professional Blue (#2563EB)
- **Secondary**: Innovation Purple (#7C3AED)
- **Accent**: Growth Teal (#0891B2)
- **Success**: Approval Green (#059669)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **HTTPS Ready**: SSL/TLS configuration

## 📊 API Documentation

The API is documented using OpenAPI 3.0. Access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - List marketplace invoices
- `POST /api/offers` - Create funding offer
- `GET /api/deals` - List user deals
- `PUT /api/users/profile` - Update user profile

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `invoices` - Invoice data and status
- `funding_offers` - Lender offers
- `deals` - Accepted funding deals
- `kyc_documents` - KYC verification documents
- `favorites` - User favorites system

## 🚀 Deployment

### Docker Deployment
```bash
# Build backend
cd backend
mvn clean package -DskipTests
docker build -t invoice-finance-backend .

# Build frontend
cd frontend
npm run build
docker build -t invoice-finance-frontend .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables
Set the following environment variables for production:
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL`
- `JWT_SECRET`
- `AWS_ACCESS_KEY`
- `AWS_SECRET_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Machine learning for risk assessment
- [ ] Blockchain integration
- [ ] Multi-currency support
- [ ] Advanced reporting system

---

Built with ❤️ by the Invoice Finance Team




