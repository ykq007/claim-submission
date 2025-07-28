# Gemini Prompts for Sales Expense Receipt Processing

## Main Expense Receipt Analysis Prompt

Use this prompt in your n8n Gemini node for expense receipt processing:

```
You are an expert expense receipt analyst specializing in sales expense processing. Analyze the uploaded {{ $json.documentType === 'pdf' ? 'receipt document' : 'receipt image' }} and extract relevant expense information for reimbursement.

**CRITICAL INSTRUCTIONS:**
1. Extract ALL visible text using OCR capabilities
2. Identify and extract structured expense data from receipts
3. Provide confidence scores (0-1) for each extracted field
4. Return data in the specified JSON format
5. If information is unclear or missing, use null values

**DOCUMENT CONTEXT:**
This is a sales expense receipt that may contain:
- Transaction details (date, amount, receipt number)
- Vendor/merchant information (name, address, tax ID)
- Employee information (if present)
- Tax information (tax amount, rate, type)
- Expense categorization details
- Business purpose or context

**EXPECTED DATA STRUCTURE:**
Return ONLY a valid JSON object with this exact structure:
```json
{
  "receiptNumber": "string or null",
  "expenseDate": "YYYY-MM-DD or null",
  "expenseAmount": "number or null",
  "currency": "string or null",
  "expenseType": "meal|transport|accommodation|entertainment|supplies|fuel|other or null",
  "description": "string or null",
  "vendorName": "string or null",
  "vendorAddress": "string or null",
  "vendorPhone": "string or null",
  "vendorTaxId": "string or null",
  "employeeName": "string or null",
  "employeeId": "string or null",
  "department": "string or null",
  "costCenter": "string or null",
  "purpose": "string or null",
  "clientName": "string or null",
  "projectCode": "string or null",
  "isClientReimbursable": "boolean or null",
  "taxAmount": "number or null",
  "taxRate": "number or null",
  "taxType": "string or null",
  "isTaxDeductible": "boolean or null",
  "travelDetails": {
    "origin": "string or null",
    "destination": "string or null",
    "distance": "number or null",
    "transportMode": "car|taxi|train|flight|bus|other or null",
    "mileageRate": "number or null"
  },
  "mealDetails": {
    "attendees": ["string array or null"],
    "attendeeCount": "number or null",
    "mealType": "breakfast|lunch|dinner|snack or null",
    "isClientMeal": "boolean or null"
  },
  "additionalDetails": {},
  "confidence": 0.95
}
```

**EXTRACTION GUIDELINES:**
- Look for receipt/invoice numbers in various formats
- Extract dates in various formats and convert to YYYY-MM-DD
- Identify total amounts, tax amounts, and currency symbols
- Find merchant/vendor names and addresses
- Categorize expenses based on receipt content (restaurant=meal, gas station=fuel, etc.)
- Extract tax information (VAT, sales tax, etc.)
- Look for business purpose descriptions or notes
- Identify travel-related information (routes, distances, transport types)
- Count meal attendees if listed
- Calculate overall confidence based on clarity and completeness of extraction

**EXPENSE TYPE CLASSIFICATION:**
- **meal**: Restaurants, cafes, food delivery, catering
- **transport**: Taxi, ride-share, public transport, flights, trains
- **accommodation**: Hotels, motels, Airbnb, lodging
- **entertainment**: Client entertainment, business events
- **supplies**: Office supplies, business materials, equipment
- **fuel**: Gas stations, fuel purchases
- **other**: Any expense not fitting above categories

**CONFIDENCE SCORING:**
- 0.9-1.0: Very clear receipt with most fields extractable
- 0.7-0.89: Good quality receipt with key fields clearly visible
- 0.5-0.69: Moderate quality, some fields may be unclear
- 0.3-0.49: Poor quality, limited extractable information
- 0.0-0.29: Very poor quality, minimal extractable information

Analyze the receipt thoroughly and return only the JSON response.
```

## Alternative Prompts for Specific Receipt Types

### Restaurant/Meal Receipts
```
You are analyzing a restaurant or meal receipt. Focus on extracting:

**PRIORITY FIELDS:**
- Restaurant name and location
- Date and time of meal
- Total amount and tax details
- Number of guests/attendees
- Meal type (breakfast/lunch/dinner)
- Individual line items if visible

**MEAL-SPECIFIC EXTRACTION:**
- Look for guest count indicators
- Identify alcohol vs food items
- Extract tip amounts separately
- Note if business meeting or client meal
- Check for special dietary notes
- Identify meal categories (appetizers, mains, drinks)

Return the same JSON structure but prioritize meal-related fields and include itemized details in additionalDetails.
```

### Transportation Receipts
```
You are analyzing a transportation receipt (taxi, rideshare, flight, train). Focus on extracting:

**PRIORITY FIELDS:**
- Transportation company/service
- Date and time of travel
- Origin and destination locations
- Distance traveled
- Total fare and breakdown
- Vehicle/flight details

**TRANSPORT-SPECIFIC EXTRACTION:**
- Look for pickup/dropoff addresses
- Extract mileage or distance information
- Identify transport type (taxi, Uber, flight, etc.)
- Find trip duration if available
- Extract booking reference numbers
- Note if business or personal travel

Return the same JSON structure but prioritize travel fields and include trip details in additionalDetails.
```

### Accommodation Receipts
```
You are analyzing a hotel or accommodation receipt. Focus on extracting:

**PRIORITY FIELDS:**
- Hotel/accommodation name and address
- Check-in and check-out dates
- Number of nights stayed
- Room type and rate
- Total charges and tax breakdown
- Guest information

**ACCOMMODATION-SPECIFIC EXTRACTION:**
- Look for nightly rates vs total amount
- Extract additional charges (parking, wifi, etc.)
- Identify room upgrades or special requests
- Find booking confirmation numbers
- Note business vs leisure purpose
- Extract loyalty program information

Return the same JSON structure but prioritize accommodation fields and include stay details in additionalDetails.
```

### Fuel/Gas Receipts
```
You are analyzing a fuel or gas station receipt. Focus on extracting:

**PRIORITY FIELDS:**
- Gas station name and location
- Date and time of purchase
- Fuel type (regular, premium, diesel)
- Gallons/liters purchased
- Price per gallon/liter
- Total amount
- Odometer reading if present

**FUEL-SPECIFIC EXTRACTION:**
- Look for pump number
- Extract fuel grade information
- Find vehicle license plate if shown
- Calculate fuel efficiency if odometer readings available
- Identify additional purchases (car wash, convenience items)
- Note mileage-related business travel

Return the same JSON structure but prioritize fuel fields and include vehicle details in additionalDetails.
```

## Enhanced Extraction Features

### For Poor Quality Receipts:
Add this to your prompt:
```
**RECEIPT QUALITY ENHANCEMENT:**
This receipt image may be faded, crumpled, or have poor lighting. Please:
1. Use advanced OCR to read partially visible text
2. Make reasonable inferences for standard receipt formats
3. Look for watermarks or printed patterns that might indicate amounts
4. Pay attention to receipt structure to identify key fields
5. Lower confidence scores for unclear extractions
```

### For Handwritten Receipts:
```
**HANDWRITTEN RECEIPT PROCESSING:**
This receipt may contain handwritten information. Please:
1. Focus on printed portions first (more reliable)
2. Attempt to read handwritten amounts and descriptions
3. Cross-reference handwritten totals with printed subtotals
4. Note uncertainty in confidence scoring
5. Look for common receipt abbreviations
```

### For Multi-Currency Receipts:
```
**MULTI-CURRENCY HANDLING:**
This receipt may be in a foreign currency. Please:
1. Identify the currency symbol or code
2. Extract the local currency amount
3. Look for exchange rate information if present
4. Note the country/region from vendor address
5. Include currency code in the currency field
```

## Receipt Validation Rules

### Amount Validation:
- Total amount should equal subtotal + tax
- Check for tip calculations on restaurant receipts
- Verify fuel calculations (price × quantity)
- Look for discount applications

### Date Validation:
- Ensure date format consistency (YYYY-MM-DD)
- Check for reasonable date ranges
- Validate time stamps if present
- Note timezone information if available

### Category Auto-Detection:
- Gas stations → fuel
- Restaurants/cafes → meal
- Hotels/motels → accommodation
- Taxi/Uber → transport
- Office supply stores → supplies

## Testing Your Expense Prompts

### Test Scenarios:
1. **Clear printed receipt** - Should achieve 0.9+ confidence
2. **Handwritten restaurant bill** - Should achieve 0.6-0.8 confidence
3. **Faded gas station receipt** - Should achieve 0.4-0.7 confidence
4. **Foreign language receipt** - Should extract numbers and attempt translation

### Validation Checklist:
- [ ] Correctly categorizes expense type
- [ ] Extracts monetary amounts accurately
- [ ] Handles various date formats
- [ ] Identifies vendor information
- [ ] Processes tax information correctly
- [ ] Handles multiple currencies
- [ ] Provides appropriate confidence scores

## Integration with n8n

In your n8n workflow:
1. Use the main expense prompt in the Gemini node
2. Set temperature to 0.1 for consistent extraction
3. Set max tokens to 2048 for complete responses
4. Add business rules validation in subsequent Code node
5. Implement expense category auto-detection
6. Add currency conversion if needed

The workflow should handle various receipt formats and provide structured data for expense management systems.