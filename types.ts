
export enum UserRole {
  DEVELOPER = 'Developer',
  ADMIN = 'Admin',
  TEKNISI = 'Teknisi',
  MANAGER = 'Manager',
  SALES = 'Sales',
  ENGINEER = 'Data Engineer',
  QC = 'QC Inspector',
  MACHINING = 'Machinist',
  WINDING = 'Winding Dept'
}

export enum MotorStatus {
  ON_PROGRESS = 'ON_PROGRESS',
  KIRIM = 'KIRIM',
  PENDING = 'PENDING',
  CANCEL = 'CANCEL'
}

export type OrderPriority = 'Normal' | 'Urgent' | 'Dikerjakan Dulu' | 'Emergency';
export type POStatus = 'Belum PO' | 'Sudah PO';

export interface SalesOrder {
  id: string;
  salesCode: string;
  customerName: string;
  dayaKW: number;
  motorType: string;
  priority: OrderPriority;
  poStatus: POStatus;
  status: 'Pending Pickup' | 'Picked Up' | 'In Workshop';
  timestamp: string;
}

export interface MotorData {
  // Identitas
  kodeBarang: string; // Primary Key
  namaPerusahaan: string;
  kodeCustomer: string;

  // Spek Teknis
  jenisMotor: string;
  merk: string;
  serialNumber: string;
  dayaKW: number | string;
  teganganVolt: number | string;
  frekuensiHz: number | string;
  rpm: number | string;
  arusAmpere: number | string;

  // Proses Bengkel
  statusFormPutih: 'BELUM' | 'SUDAH';
  statusFormBiru: 'BELUM' | 'SUDAH';
  dataMegger: 'BELUM' | 'SUDAH';
  infoCustomer: string;
  status: MotorStatus;
  dokumentasiUrl: string; // URL Foto
  fotoUrls?: string[];

  // Administrasi
  tanggalMasuk: string;
  tanggalKirim: string;
  noSuratJalan: string;
  nomorPenawaran: string;
  tanggalPenawaran: string;
  nomorPO: string;
}

export interface EngineeringData {
  jobNo: string; // Links to MotorData.kodeBarang
  date: string;
  
  // Specs (some duplicated from MotorData for the report snapshot)
  type: string;
  outputKW: string;
  voltage: string;
  current: string;
  phase: string;
  mnf: string; // Manufacturer
  rpm: string;
  frequency: string;
  serialNo: string;

  // Bearings
  bearingDE: string;
  bearingNDE: string;
  greaseDE: string;
  greaseNDE: string;

  // Initial Test Results (Winding Insulation)
  init_ins_voltage: string; // Dynamic Voltage (e.g. 500, 1000, 5000)
  init_ins_UG: string;
  
  init_ins_row2_label: 'V - G' | 'DAR'; // Selection for Row 2
  init_ins_VG: string; // Value for Row 2
  
  init_ins_row3_label: 'W - G' | 'PI'; // Selection for Row 3
  init_ins_WG: string; // Value for Row 3
  
  // Initial Test Results (Winding Resistance)
  init_res_U1U2: string;
  init_res_V1V2: string;
  init_res_W1W2: string;

  // Final Test - No Load
  final_noload_hz: string;
  final_noload_connection_val: string;
  final_noload_connection_type: string;
  
  final_noload_R_res: string;
  final_noload_R_amp: string;
  final_noload_S_res: string;
  final_noload_S_amp: string;
  final_noload_T_res: string;
  final_noload_T_amp: string;
  final_rpm: string;

  // Final Test - Insulation
  final_ins_UG: string;
  final_ins_VG: string;
  final_ins_WG: string;
  durationRunning: string;

  // Final Test - Temp & Resistance
  temp_ambient: string;
  temp_shaftDE: string;
  temp_shaftNDE: string;
  temp_housingDE: string;
  temp_housingNDE: string;
  temp_body: string;

  final_res_U1U2: string;
  final_res_V1V2: string;
  final_res_W1W2: string;

  // Signatures
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DiscussionMessage {
  id: string;
  kodeBarang: string;
  userName: string;
  userRole: UserRole;
  message: string;
  timestamp: string;
  isUrgent?: boolean;
}

export interface GlobalMessage {
  id: string;
  userName: string;
  userRole: UserRole;
  message: string;
  timestamp: string;
  isAnnouncement?: boolean; // Highlight for important messages
}

// --- NEW PRODUCTION TRACKING TYPES ---

export interface TrackingMatrix {
    // Rewinding
    rew_stator: boolean;
    rew_rotor: boolean;
    
    // Overhaul
    ovh_stator: boolean;
    ovh_rotor: boolean;
    
    // General / Mechanic
    dismantling: boolean;
    cleaning: boolean;
    varnish: boolean;
    assembling: boolean;
    painting: boolean;
    
    // Rebushing
    reb_de: boolean;
    reb_nde: boolean;
    
    // Journal Shaft
    js_de: boolean;
    js_nde: boolean;
    
    // Balancing
    bal_rotor: boolean;

    // Others
    part: boolean;
    qc: boolean;
    finishing: boolean;
}

export interface ProductionLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
}

export interface ProductionWO {
    kodeBarang: string; // FK to MotorData
    scope: 'REW' | 'OVH' | 'MEC' | 'NEW'; 
    priority: OrderPriority;
    
    // Matrix
    jobScope: TrackingMatrix; // PLAN: What needs to be done (Selected in Input)
    progress: TrackingMatrix; // ACTUAL: What is currently done (Clicked in Kanban)
    
    // Additional Notes
    machiningNotes: string;
    keterangan: string;
    
    // Meta
    logs: ProductionLog[];
}