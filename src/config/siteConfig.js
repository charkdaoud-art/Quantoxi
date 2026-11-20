/**
 * QUANTIVORA AI · ADMINISTRATIVE SETTINGS
 * ------------------------------------------------------------------
 * Every business figure shown on the site is driven from this file.
 *
 * statsMode:
 *   'demo'       → shows illustrative targets with a visible "Illustrative" label.
 *   'production' → shows ONLY stats where verified === true. Unverified stats are hidden.
 *
 * Never set verified: true unless the figure is audited/actual.
 */

export const company = {
  name: 'Quantoxi',
  // TODO(legal): replace with the actual operating entity before launch.
  legalEntity: 'Quantoxi',
  jurisdiction: 'Ontario, Canada',
  address: 'Toronto, Ontario, Canada',
  city: 'Toronto, Ontario',
  email: 'hello@quantoxi.com',
  privacyEmail: 'hello@quantoxi.com',
  phone: '(647) 313-0731',
  phoneHref: '+16473130731',
  founded: 2026,
  slogan: 'Your Data. Tomorrow’s Intelligence.',
  secondary: 'Unlock the Hidden Value of Your Data.',
};

export const statsMode = 'demo'; // 'demo' | 'production'

export const stats = [
  { id: 'payouts', label: 'Total Partner Payouts', value: 8000000, prefix: '$', suffix: '+', note: 'Projected partner payouts', verified: false },
  { id: 'partners', label: 'Participating Businesses', value: 3200, suffix: '+', note: 'Projected business partners', verified: false },
  { id: 'records', label: 'Data Records Processed', value: 100000000, suffix: '+', note: 'Target data records', verified: false, compact: true },
  { id: 'industries', label: 'Industries Supported', value: 16, note: 'Industry categories accepted today', verified: true },
  { id: 'avg', label: 'Average Partner Payout', value: 2500, prefix: '$', note: 'Illustrative average payout', verified: false },
];

/** Data acquisition rates in CAD per eligible record. Configurable. */
export const currency = 'CAD';
export const dataRates = [
  // One standard rate: every eligible record includes name, email, phone number and address.
  { id: 'standard', label: 'Name, email, phone number and address', short: 'Standard record', desc: 'Authorized name, email, phone number and address', rate: 0.08 },
];

/** Formats a per-record rate in cents, e.g. 0.08 → "8¢", 0.075 → "7.5¢". */
export const fmtRate = (r) => `${Math.round(r * 1000) / 10}¢`;

export const recordRange = { min: 100, max: 250000 };

export const timelines = {
  verification: '10 to 20 business days after submission',
  payment: 'Within 30 days after a dataset is approved',
};

export const industries = [
  { id: 'cleaning', name: 'Home Cleaning', icon: 'Sparkles', color: '#22D3EE', blurb: 'Service frequency and seasonality signals help model recurring household service demand.' },
  { id: 'construction', name: 'Construction', icon: 'HardHat', color: '#F59E0B', blurb: 'Project timing and scope trends inform regional build activity forecasts.' },
  { id: 'landscaping', name: 'Landscaping', icon: 'Trees', color: '#10B981', blurb: 'Seasonal booking patterns sharpen weather-linked demand prediction.' },
  { id: 'roofing', name: 'Roofing', icon: 'Home', color: '#F43F5E', blurb: 'Replacement cycles and storm response data support regional market benchmarks.' },
  { id: 'hvac', name: 'HVAC', icon: 'Thermometer', color: '#38BDF8', blurb: 'Maintenance and install timing reveals equipment lifecycle and climate effects.' },
  { id: 'plumbing', name: 'Plumbing', icon: 'Droplets', color: '#3B82F6', blurb: 'Aggregated service call trends support emergency demand modelling.' },
  { id: 'realestate', name: 'Real Estate', icon: 'Building2', color: '#A78BFA', blurb: 'Transaction and inquiry timing contributes to housing market intelligence.' },
  { id: 'automotive', name: 'Automotive Services', icon: 'Car', color: '#FB923C', blurb: 'Service interval patterns inform vehicle maintenance demand forecasts.' },
  { id: 'pest', name: 'Pest Control', icon: 'Bug', color: '#84CC16', blurb: 'Regional seasonality data supports predictive treatment demand models.' },
  { id: 'improvement', name: 'Home Improvement', icon: 'Hammer', color: '#EAB308', blurb: 'Renovation category trends feed consumer spending benchmarks.' },
  { id: 'property', name: 'Property Management', icon: 'KeyRound', color: '#14B8A6', blurb: 'Portfolio service patterns inform occupancy and maintenance analytics.' },
  { id: 'ecommerce', name: 'E-commerce', icon: 'ShoppingCart', color: '#EC4899', blurb: 'Aggregated purchase behaviour supports category demand intelligence.' },
  { id: 'retail', name: 'Retail', icon: 'Store', color: '#8B5CF6', blurb: 'Store-level seasonality contributes to regional consumer trend models.' },
  { id: 'professional', name: 'Professional Services', icon: 'Briefcase', color: '#60A5FA', blurb: 'Engagement timing signals support B2B demand benchmarks.' },
  { id: 'hospitality', name: 'Hospitality', icon: 'BedDouble', color: '#F472B6', blurb: 'Booking windows and stay patterns inform travel demand forecasts.' },
  { id: 'other', name: 'Other Industries', icon: 'Layers', color: '#94A3B8', blurb: 'Tell us about your data and we will assess research relevance and eligibility.' },
];

export const crms = [
  { name: 'Jobber', steps: ['Open Clients from the main menu.', 'Apply any filters you need (for example, active clients only).', 'Choose the export option to download a CSV.'] },
  { name: 'Housecall Pro', steps: ['Open Customers.', 'Select the customers to include or select all.', 'Use the export action to download a CSV file.'] },
  { name: 'ServiceTitan', steps: ['Open Reports and select or build a customer report.', 'Choose only the columns you are authorized to share.', 'Export the report as CSV.'] },
  { name: 'Salesforce', steps: ['Create a Contacts or Accounts report with the needed columns.', 'Run the report.', 'Export as Details Only in CSV format.'] },
  { name: 'HubSpot', steps: ['Open Contacts and select or filter a view.', 'Choose Export view and select CSV.', 'Download the file from the link HubSpot provides.'] },
  { name: 'QuickBooks', steps: ['Open the Customers list.', 'Use the export option to download the list.', 'Open the file and save it as CSV UTF-8.'] },
  { name: 'Zoho CRM', steps: ['Open the Contacts module.', 'Select records, then choose Export from the actions menu.', 'Pick CSV as the file format.'] },
  { name: 'Microsoft Excel', steps: ['Open your workbook.', 'Choose File, then Save As.', 'Select CSV UTF-8 (Comma delimited).'] },
  { name: 'Google Sheets', steps: ['Open your sheet.', 'Choose File, then Download.', 'Select Comma Separated Values (.csv).'] },
  { name: 'Custom CRM platforms', steps: ['Look for an export, report or backup feature.', 'Export one row per customer record with a header row.', 'Contact us if your system can only export other formats.'] },
];
