# Expense Claim System for Sales Teams

A modern, AI-powered expense claim submission system built with React, n8n, and Google Gemini. Sales teams can upload receipts, have them automatically processed with OCR and data extraction, review/edit the extracted information, and submit expense claims for reimbursement seamlessly.

## 🚀 Features

- **Drag & Drop Receipt Upload** - Support for PDF, JPG, PNG receipts
- **AI-Powered Receipt Processing** - Gemini integration for OCR and expense data extraction
- **Smart Expense Categorization** - Automatic classification (meals, transport, accommodation, etc.)
- **Real-time Processing Status** - Live updates during receipt analysis
- **Interactive Data Review** - Edit and verify extracted expense information
- **Business Context Tracking** - Client names, project codes, purpose documentation
- **Tax Information Extraction** - Automatic tax amount and rate detection
- **Approval Workflow** - Built-in approval logic for high-value expenses
- **Modular Architecture** - Easy to extend and customize
- **Multiple Deployment Options** - Docker and Cloudflare Pages support
- **Mobile Responsive** - Works on all devices

## 🏗️ Architecture

```
Frontend (React/TypeScript) → n8n Workflow → Gemini AI → Expense Management API
                ↓
      Sales Rep Reviews Data
                ↓
         Expense Submission
                ↓
        Approval Workflow
```

## 🛠️ Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## 📋 Prerequisites

- Node.js 18+
- n8n instance (local or cloud)
- Google Gemini API access
- Docker (optional)
- Cloudflare account (for Pages deployment)

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

This starts:
- Frontend app on port 3000
- n8n on port 5678 (admin/changeme123)
- Redis for queue processing

## ☁️ Cloudflare Pages Deployment

```bash
npm run build
wrangler pages publish dist
```

## 📊 Expense Data Structure

The system processes comprehensive expense data including:

```typescript
interface ExtractedData {
  // Basic Expense Information
  receiptNumber?: string;
  expenseDate?: string;
  expenseAmount?: number;
  currency?: string;
  expenseType?: 'meal' | 'transport' | 'accommodation' | 'entertainment' | 'supplies' | 'fuel' | 'other';
  description?: string;
  
  // Vendor/Merchant Information
  vendorName?: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorTaxId?: string;
  
  // Employee Information
  employeeName?: string;
  employeeId?: string;
  department?: string;
  costCenter?: string;
  
  // Business Context
  purpose?: string;
  clientName?: string;
  projectCode?: string;
  isClientReimbursable?: boolean;
  
  // Tax Information
  taxAmount?: number;
  taxRate?: number;
  taxType?: string;
  isTaxDeductible?: boolean;
  
  // Travel/Transport Details
  travelDetails?: {
    origin?: string;
    destination?: string;
    distance?: number;
    transportMode?: 'car' | 'taxi' | 'train' | 'flight' | 'bus' | 'other';
    mileageRate?: number;
  };
  
  // Meal Details
  mealDetails?: {
    attendees?: string[];
    attendeeCount?: number;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    isClientMeal?: boolean;
  };
  
  confidence?: number;
}
```

## 🎯 AI Integration

### Intelligent Receipt Processing
- **Smart OCR** - Extracts text from receipts regardless of quality
- **Expense Categorization** - Automatically classifies expenses based on vendor
- **Tax Detection** - Identifies tax amounts and rates
- **Business Rules** - Applies company-specific validation rules

### Specialized Receipt Types
The system includes optimized processing for:
- **Restaurant Receipts** - Meal categorization, attendee counting, tip handling
- **Transportation Receipts** - Route detection, mileage calculation, transport mode identification
- **Accommodation Receipts** - Hotel details, nightly rates, additional charges
- **Fuel Receipts** - Vehicle information, fuel efficiency tracking
- **Office Supply Receipts** - Itemized supplies, tax deductibility

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_N8N_API_URL` | n8n webhook URL | `http://localhost:5678/webhook` |
| `VITE_ENV` | Environment | `development` |
| `VITE_DEBUG` | Debug mode | `true` |

### n8n Configuration

1. **Import Workflow**: Use `n8n-expense-workflow.json`
2. **Gemini Settings**:
   - Model: `gemini-1.5-flash`
   - Temperature: `0.1`
   - Max Tokens: `2048`
3. **Approval Rules**: Configure expense thresholds and approval workflows

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
Application available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 💼 Business Features

### Expense Categories
- **Meals & Entertainment** - Client dinners, business lunches
- **Transportation** - Flights, taxis, rideshare, mileage
- **Accommodation** - Hotels, lodging for business travel
- **Office Supplies** - Business materials and equipment
- **Fuel** - Vehicle fuel for business travel
- **Other** - Miscellaneous business expenses

### Approval Workflow
- **Automatic Approval** - Expenses under $500
- **Manager Approval** - Expenses over $500
- **Special Review** - Entertainment expenses
- **Client Reimbursable** - Flagged for client billing

### Business Context Tracking
- **Client Association** - Link expenses to specific clients
- **Project Codes** - Track expenses by project
- **Cost Centers** - Department-based expense allocation
- **Purpose Documentation** - Business justification for expenses

## 📝 API Endpoints

### n8n Webhook Endpoints

#### Process Receipt
```
POST /webhook/process-claim-document
Content-Type: multipart/form-data

Body:
- file: File (PDF/Image)
- documentType: string
- documentId: string

Response:
{
  "success": boolean,
  "extractedData": ExtractedData,
  "confidence": number,
  "processedAt": string
}
```

#### Submit Expense Claim
```
POST /webhook/submit-claim
Content-Type: application/json

Body:
{
  "documents": Array<DocumentInfo>,
  "extractedData": ExtractedData,
  "userVerified": boolean,
  "submissionDate": string
}

Response:
{
  "success": boolean,
  "claimId": string,
  "status": string,
  "approvalRequired": boolean,
  "message": string
}
```

## 🔒 Security Features

- **File Validation** - Receipt type and size validation
- **Data Sanitization** - Input cleaning and validation
- **Secure Headers** - CSP and security headers
- **Environment Isolation** - Separate dev/prod configurations

## 🧪 Testing Receipt Types

### Recommended Test Receipts
1. **Restaurant Receipt** - Test meal categorization and attendee detection
2. **Taxi Receipt** - Test transportation and route extraction
3. **Hotel Receipt** - Test accommodation and nightly rate calculation
4. **Gas Station Receipt** - Test fuel categorization and vehicle tracking
5. **Office Supply Receipt** - Test supply categorization and tax handling

### Expected Confidence Scores
- **Clear printed receipts**: 90%+ confidence
- **Handwritten receipts**: 60-80% confidence
- **Poor quality photos**: 30-60% confidence
- **Partial/damaged receipts**: Graceful handling with appropriate confidence

## 🚀 Production Deployment

### Docker Deployment
- Complete containerized solution
- Include n8n workflow processing
- Production-ready with monitoring

### Cloudflare Pages
- Global CDN performance
- Automatic HTTPS and security
- Cost-effective for frontend hosting

## 🔧 Customization

### Adding New Expense Types
1. Update `ExpenseType` enum in types
2. Add new category to Gemini prompts
3. Update frontend dropdown options
4. Configure approval rules

### Integration with Expense Systems
Replace the n8n webhook endpoints with your expense management system API for seamless integration with existing financial processes.

## 📞 Support

For issues and questions:
1. Check receipt quality and supported formats
2. Review n8n workflow logs for processing errors
3. Test with sample receipts provided
4. Verify Gemini API credentials and quotas

## 📄 License

MIT License - see LICENSE file for details.