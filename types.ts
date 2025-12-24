
export type Role = 'SUPER_ADMIN' | 'MARKET_ADMIN' | 'COUNTER_STAFF' | 'VENDOR' | 'SUPPLIER' | 'USER';

export interface UserSettings {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'NONE';
  mfaEnabled: boolean;
  profileImage?: string;
  appliedRole?: Role;
  settings?: UserSettings;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  products: number;
  joinedDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  city: string;
  market: string;
  rentDue: number;
  vatDue: number;
  level?: string;
  section?: string;
  storeType?: 'STALL' | 'KIOSK' | 'SHOP' | 'WAREHOUSE';
  ownershipType?: 'LEASED' | 'OWNED' | 'SUB-LEASED';
}

export interface SupplierShowcaseItem {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  category: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  warehouseLocation: string;
  suppliedItemsCount: number;
  rating: number;
  totalRatings: number;
  kycValidated: boolean;
  onboardingDate: string;
  walletBalance: number;
  showcase?: SupplierShowcaseItem[];
}

export interface Bid {
  id: string;
  supplierId: string;
  supplierName: string;
  price: number;
  deliveryDate: string;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface Requisition {
  id: string;
  vendorId: string;
  vendorName: string;
  itemName: string;
  quantity: number;
  unit: string;
  budget: number;
  status: 'OPEN' | 'BIDDING' | 'ASSIGNED' | 'TRANSIT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  description: string;
  bids: Bid[];
  acceptedBidId?: string;
}

export interface ManifestItem {
  id: string;
  vendorId: string;
  vendorName: string;
  itemName: string;
  qty: number;
  estPrice: number;
  paid: boolean;
}

export interface BridgeLogistics {
  id: string;
  dispatchDate: string;
  status: 'PREPARING' | 'DISPATCHED' | 'PURCHASING' | 'RETURNING' | 'ARRIVED';
  capacity: number; // 0-100
  items: ManifestItem[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  context: 'SUPPORT' | 'ASSET' | 'SUPPLY' | 'COMPLAINT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  creatorId: string;
  creatorName: string;
  createdAt: string;
  assetType?: 'CCTV' | 'POWER' | 'FAN' | 'BULB' | 'PLUMBING' | 'GENERAL';
  targetEntityId?: string;
  assignedToId?: string;
  assignedToName?: string;
  resolutionNote?: string;
  attachmentUrl?: string; 
}

export interface Rating {
  id: string;
  supplierId: string;
  vendorId: string;
  vendorName: string;
  score: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  vendor: string;
  stock: number;
  price: number;
  status: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'PENDING_APPROVAL';
  category: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'RENT' | 'SERVICE_CHARGE' | 'LICENSE' | 'WITHDRAWAL' | 'SUPPLY_PAYMENT' | 'VAT';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  method: string;
  referenceId?: string;
}

export interface Market {
  id: string;
  name: string;
  city: string;
  type: 'WHOLESALE' | 'RETAIL' | 'MIXED';
  ownership: 'PUBLIC' | 'PRIVATE' | 'PPP';
  establishedDate: string;
  primaryProducts: string[];
  capacity: number;
}

export interface StockLog {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  vendor: string;
  type: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  inspector: string;
  status: 'VERIFIED' | 'FLAGGED' | 'PENDING';
}

export interface CityMarketData {
  city: string;
  markets: string[];
}
