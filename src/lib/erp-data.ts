export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'rented' | 'maintenance' | 'decommissioned';
  hourMeter: number;
  location: string;
}

export interface Material {
  sku: string;
  description: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
}

export interface WorkOrder {
  id: string;
  equipmentId: string;
  type: 'preventive' | 'corrective';
  status: 'Draft' | 'Open' | 'In Progress' | 'Closed' | 'Archived';
  description: string;
  createdAt: string;
}

export interface LogisticsDoc {
  id: string;
  type: 'delivery' | 'pickup';
  customer: string;
  status: 'Draft' | 'Sent' | 'Delivered' | 'Completed';
  date: string;
}

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'EQ001', name: 'Electric Forklift 5T', brand: 'Toyota', model: '8FBMKT25', serialNumber: 'SN-77281', status: 'available', hourMeter: 1250, location: 'Warehouse A' },
  { id: 'EQ002', name: 'Diesel Generator 100kVA', brand: 'Cummins', model: 'C100D5', serialNumber: 'SN-99102', status: 'maintenance', hourMeter: 4500, location: 'Service Center' },
  { id: 'EQ003', name: 'Scissor Lift 12m', brand: 'Genie', model: 'GS-3246', serialNumber: 'SN-44321', status: 'rented', hourMeter: 820, location: 'Downtown Site' },
];

export const MOCK_MATERIALS: Material[] = [
  { sku: 'SKU-OIL-01', description: 'Hydraulic Oil 15W40', stock: 45, minStock: 50, unit: 'Liters', price: 12.5 },
  { sku: 'SKU-FLT-05', description: 'Air Filter Element XJ-9', stock: 12, minStock: 10, unit: 'Unit', price: 45.0 },
  { sku: 'SKU-TYR-02', description: 'Solid Tire 18x7-8', stock: 4, minStock: 8, unit: 'Unit', price: 185.0 },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-2024-001', equipmentId: 'EQ002', type: 'preventive', status: 'In Progress', description: 'Standard 500h Engine Service', createdAt: '2024-03-10' },
  { id: 'WO-2024-002', equipmentId: 'EQ001', type: 'corrective', status: 'Open', description: 'Fix leaking hydraulic seal', createdAt: '2024-03-12' },
];

export const MOCK_LOGISTICS: LogisticsDoc[] = [
  { id: 'LD-9901', type: 'delivery', customer: 'BuildCo Inc.', status: 'Sent', date: '2024-03-15' },
  { id: 'LD-9902', type: 'pickup', customer: 'Metro Logistics', status: 'Draft', date: '2024-03-16' },
];