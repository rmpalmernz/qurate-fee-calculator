

## Fee Calculator for Qurate Advisory Clients

A private, token-protected fee calculator page that allows your clients to estimate their advisory fees based on Enterprise Value.

---

### Design & Branding
- **Qurate brand styling**: Dark slate background (#334155), gold accent buttons, clean modern typography
- **Simple, focused UX**: One-page calculator with clear inputs and results
- **Professional appearance**: Matches your main website's corporate finance aesthetic

---

### Fee Calculator Widget

**Client inputs:**
- Enterprise Value amount (dollar input with formatting)

**Results displayed:**
- **Prepare Phase fee** (fixed based on EV tier)
- **Execute Phase fee** (sliding scale calculation)
- **Total Fees** with percentage of Enterprise Value
- Clear breakdown table showing the fee structure

**Calculation logic** (based on your fee model):
| Enterprise Value | Prepare | Execute | Total | % of EV |
|-----------------|---------|---------|-------|---------|
| $5,000,000 | $50,000 | $250,000 | $300,000 | 6.00% |
| $10,000,000 | $75,000 | $425,000 | $500,000 | 5.00% |
| $20,000,000 | $75,000 | $685,000 | $760,000 | 3.80% |
| $30,000,000 | $75,000 | $1,070,000 | $1,145,000 | 3.82% |
| $40,000,000 | $75,000 | $1,220,000 | $1,295,000 | 3.24% |
| $50,000,000+ | $75,000 | $1,370,000 | $1,445,000 | 2.89% |

Values between tiers will be interpolated for accurate estimates.

---

### Token-Based Access Control

- **Self-contained URL tokens**: Expiry date encoded within the token itself
- **30-day expiry**: Tokens automatically expire after 30 days
- **Access denied page**: Friendly message when token is invalid or expired, with contact prompt
- **Example URL**: `yoursite.com/calculator?token=abc123...`

You'll generate these tokens from your existing Qurate admin app - I'll provide a simple function you can copy there to create tokens.

---

### Pages

1. **Fee Calculator Page** (`/calculator`)
   - Token validation on page load
   - Enterprise Value input with real-time calculation
   - Clear results breakdown with Qurate branding

2. **Access Denied Page**
   - Shows when token is missing, invalid, or expired
   - Professional message with contact information

