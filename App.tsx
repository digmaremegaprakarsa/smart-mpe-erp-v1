import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { MotorTable } from './components/MotorTable';
import { MotorForm } from './components/MotorForm';
import { IncomingMotorForm } from './components/IncomingMotorForm';
import { SalesOrderForm } from './components/SalesOrderForm'; 
import { LogisticsTable } from './components/LogisticsTable'; 
import { SalesOrderDetail } from './components/SalesOrderDetail';
import { MotorDetail } from './components/MotorDetail'; 
import { EngineeringForm } from './components/EngineeringForm';
import { GeminiTools } from './components/GeminiTools';
import { DiscussionBoard } from './components/DiscussionBoard';
import { ProductionTracking } from './components/ProductionTracking'; 
import { ProductionKanban } from './components/ProductionKanban'; // IMPORT NEW COMPONENT
import { MotorData, UserRole, MotorStatus, DiscussionMessage, SalesOrder, EngineeringData, ProductionWO } from './types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const MOCK_DATA: MotorData[] = [
  {
    kodeBarang: 'I 015 K',
    namaPerusahaan: 'TJIWI KIMIA',
    kodeCustomer: 'T-01008215',
    jenisMotor: 'AC MOTOR',
    merk: 'SIEMENS',
    serialNumber: '-',
    dayaKW: 2.2,
    teganganVolt: 380,
    frekuensiHz: 50,
    rpm: 2800,
    arusAmpere: 4.7,
    statusFormPutih: 'SUDAH',
    statusFormBiru: 'SUDAH',
    dataMegger: 'SUDAH',
    infoCustomer: 'REWINDING',
    status: MotorStatus.KIRIM,
    dokumentasiUrl: 'https://images.unsplash.com/photo-1565514020125-9a491914eb16?w=600&auto=format&fit=crop&q=60',
    fotoUrls: [
        'https://images.unsplash.com/photo-1565514020125-9a491914eb16?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1565514020126-788950d2f708?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=60'
    ],
    tanggalMasuk: '2024-12-23',
    tanggalKirim: '2025-02-20',
    noSuratJalan: 'MSP 01001',
    nomorPenawaran: '',
    tanggalPenawaran: '',
    nomorPO: 'MJK-52056265'
  },
  {
    kodeBarang: 'P 017 K',
    namaPerusahaan: 'PAKARTI RIKEN',
    kodeCustomer: '',
    jenisMotor: 'AC MOTOR',
    merk: 'SHANDONG',
    serialNumber: '-',
    dayaKW: 15,
    teganganVolt: 380,
    frekuensiHz: 50,
    rpm: 1460,
    arusAmpere: 30.3,
    statusFormPutih: 'SUDAH',
    statusFormBiru: 'BELUM',
    dataMegger: 'SUDAH',
    infoCustomer: 'BEARING NOISE',
    status: MotorStatus.ON_PROGRESS,
    dokumentasiUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60',
    fotoUrls: [
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60'
    ],
    tanggalMasuk: '2024-12-20',
    tanggalKirim: '',
    noSuratJalan: '',
    nomorPenawaran: '009/TU/I/25',
    tanggalPenawaran: '2025-01-03',
    nomorPO: ''
  }
];

// Mock Sales Orders
const MOCK_ORDERS: SalesOrder[] = [
    {
        id: 'ORD-882910',
        salesCode: 'I - Ine',
        customerName: 'PT. INDOFOOD',
        dayaKW: 55,
        motorType: 'AC MOTOR',
        priority: 'Urgent',
        poStatus: 'Belum PO',
        status: 'Pending Pickup',
        timestamp: '15/02/2025'
    },
    {
        id: 'P260220',
        salesCode: 'P - Pusat',
        customerName: 'PT. YUTY',
        dayaKW: 35,
        motorType: 'AC MOTOR',
        priority: 'Normal',
        poStatus: 'Sudah PO',
        status: 'Pending Pickup',
        timestamp: '13 Feb 2026'
    }
];

// Mock Discussion Data
const MOCK_DISCUSSIONS: DiscussionMessage[] = [
    {
        id: '1',
        kodeBarang: 'I 015 K',
        userName: 'Agus',
        userRole: UserRole.TEKNISI,
        message: 'Kawat email ukuran 0.8mm habis, saya pakai stok 0.85mm ya?',
        timestamp: '10:15',
        isUrgent: false
    },
    {
        id: '2',
        kodeBarang: 'I 015 K',
        userName: 'Budi',
        userRole: UserRole.ADMIN,
        message: 'Oke Gus, sudah saya catat di penawaran tambahan.',
        timestamp: '10:20',
        isUrgent: false
    }
];

// MOCK PRODUCTION DATA
const MOCK_PRODUCTION: ProductionWO[] = [
    {
        kodeBarang: 'I 015 K',
        scope: 'REW',
        priority: 'Normal',
        machiningNotes: 'Rewinding Rebushing DE NDE',
        keterangan: 'Bearing Gearbox Rusak',
        // SCOPE: What was selected in Input
        jobScope: {
            rew_stator: true, rew_rotor: true, ovh_stator: false, ovh_rotor: false,
            dismantling: true, cleaning: true, varnish: true, assembling: true, painting: false,
            reb_de: true, reb_nde: true, js_de: false, js_nde: false,
            bal_rotor: false, part: true, qc: true, finishing: false
        },
        // PROGRESS: What is actually done
        progress: {
            rew_stator: true, rew_rotor: false, // Done vs Pending
            ovh_stator: false, ovh_rotor: false,
            dismantling: true, cleaning: true, varnish: true, assembling: false, painting: false,
            reb_de: true, reb_nde: true,
            js_de: false, js_nde: false,
            bal_rotor: false,
            part: true, qc: false, finishing: false
        },
        logs: [
            { id: '1', action: 'Rewinding Stator marked as TRUE', user: 'Agus', timestamp: '12/02 10:00' }
        ]
    },
    {
        kodeBarang: 'P 017 K',
        scope: 'OVH',
        priority: 'Urgent',
        machiningNotes: 'Balancing Run out Repair rumah',
        keterangan: 'Kurang Terminal',
        // SCOPE: Only Overhaul items selected
        jobScope: {
            rew_stator: false, rew_rotor: false, ovh_stator: true, ovh_rotor: true,
            dismantling: true, cleaning: true, varnish: true, assembling: true, painting: true,
            reb_de: false, reb_nde: false, js_de: false, js_nde: true,
            bal_rotor: true, part: true, qc: true, finishing: true
        },
        // PROGRESS
        progress: {
            rew_stator: false, rew_rotor: false,
            ovh_stator: true, ovh_rotor: true,
            dismantling: true, cleaning: true, varnish: true, assembling: false, painting: false,
            reb_de: false, reb_nde: false,
            js_de: false, js_nde: true,
            bal_rotor: true,
            part: true, qc: true, finishing: false
        },
        logs: []
    }
];

const emptyMatrix = {
    rew_stator: false, rew_rotor: false, ovh_stator: false, ovh_rotor: false, 
    dismantling: false, cleaning: false, varnish: false, assembling: false, painting: false,
    reb_de: false, reb_nde: false, js_de: false, js_nde: false,
    bal_rotor: false, part: false, qc: false, finishing: false
};

const App: React.FC = () => {
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'form' | 'wo_entry' | 'sales_order' | 'sales_order_detail' | 'logistics' | 'detail' | 'ai' | 'discussion' | 'engineering' | 'production' | 'kanban'>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  
  // Data State
  const [motors, setMotors] = useState<MotorData[]>(MOCK_DATA);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(MOCK_ORDERS);
  const [discussions, setDiscussions] = useState<DiscussionMessage[]>(MOCK_DISCUSSIONS);
  const [reports, setReports] = useState<EngineeringData[]>([]);
  const [productionData, setProductionData] = useState<ProductionWO[]>(MOCK_PRODUCTION);
  
  // Selection State
  const [selectedMotor, setSelectedMotor] = useState<MotorData | null>(null); 
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
  };

  // --- HANDLERS: MOTOR ---
  const handleEdit = (motor: MotorData) => {
    setSelectedMotor(motor);
    setCurrentView('form');
  };

  const handleViewDetail = (motor: MotorData) => {
      setSelectedMotor(motor);
      setCurrentView('detail');
  };

  const checkNotifications = (oldData: MotorData | undefined, newData: MotorData) => {
      if (!oldData) {
          showNotification(`🔔 INFO: Motor Baru (${newData.kodeBarang}) telah masuk! Teknisi harap cek.`, 'info');
          return;
      }
      if (!oldData.nomorPO && newData.nomorPO) {
          showNotification(`🔔 INFO: PO Diterima untuk ${newData.kodeBarang}. Pengerjaan bisa dilanjutkan!`, 'success');
          return;
      }
      if (oldData.statusFormBiru !== 'SUDAH' && newData.statusFormBiru === 'SUDAH') {
           showNotification(`✅ QC PASSED: Motor ${newData.kodeBarang} Lulus Uji & Form Biru lengkap.`, 'success');
           return;
      }
      if (!oldData.noSuratJalan && newData.noSuratJalan) {
          showNotification(`🚚 TERKIRIM: Motor ${newData.kodeBarang} sedang dalam pengiriman.`, 'info');
          return;
      }
  };

  const handleSave = (data: MotorData) => {
    const existingMotor = motors.find(m => m.kodeBarang === data.kodeBarang);
    checkNotifications(existingMotor, data);

    if (existingMotor) {
      setMotors(prev => prev.map(m => m.kodeBarang === data.kodeBarang ? data : m));
    } else {
      setMotors(prev => [...prev, data]);
      // Also init Production Data for new Motor
      setProductionData(prev => [...prev, {
          kodeBarang: data.kodeBarang,
          scope: 'OVH', // Default
          priority: 'Normal',
          machiningNotes: '',
          keterangan: '',
          jobScope: emptyMatrix,
          progress: emptyMatrix,
          logs: []
      }]);
    }
    
    setSelectedMotor(null);
    setCurrentView('table');
  };

  const handleImportData = (newMotors: MotorData[]) => {
    // Merge new motors, skipping duplicates based on kodeBarang for simplicity or overwriting
    // Here we will append only new ones to avoid overwriting existing work
    const existingIds = new Set(motors.map(m => m.kodeBarang));
    const uniqueNewMotors = newMotors.filter(m => !existingIds.has(m.kodeBarang));
    
    if (uniqueNewMotors.length === 0) {
        showNotification('⚠️ No new data imported. Duplicate IDs found.', 'info');
        return;
    }

    setMotors(prev => [...prev, ...uniqueNewMotors]);
    showNotification(`✅ Berhasil import ${uniqueNewMotors.length} data motor baru!`, 'success');
  };

  // --- HANDLERS: SALES ORDER ---
  const handleSaveOrder = (data: SalesOrder) => {
      setSalesOrders(prev => {
          const exists = prev.find(o => o.id === data.id);
          if (exists) {
              return prev.map(o => o.id === data.id ? data : o);
          }
          return [...prev, data];
      });

      const isUpdate = salesOrders.some(o => o.id === data.id);
      showNotification(
          isUpdate ? `✅ ORDER UPDATED: Data order ${data.id} diperbarui.` : `📝 ORDER CREATED: Order untuk ${data.customerName} berhasil dibuat.`, 
          'success'
      );
      
      setSelectedOrder(null);
      setCurrentView('logistics');
  };

  const handleUpdateOrder = (updatedOrder: SalesOrder) => {
    setSalesOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    if (updatedOrder.poStatus === 'Sudah PO') {
        showNotification(`✅ PO CONFIRMED: Status PO untuk ${updatedOrder.customerName} diperbarui.`, 'success');
    }
  };

  const handleViewOrder = (order: SalesOrder) => {
      setSelectedOrder(order);
      setCurrentView('sales_order_detail');
  };

  const handleEditOrder = (order: SalesOrder) => {
      setSelectedOrder(order);
      setCurrentView('sales_order');
  };

  // --- HANDLERS: ENGINEERING ---
  const handleSaveReport = (data: EngineeringData) => {
      setReports(prev => [...prev, data]);
      showNotification('✅ Engineering Report Saved Successfully', 'success');
      setCurrentView('dashboard'); // Or back to list if list exists
  };

  // --- HANDLERS: PRODUCTION ---
  const handleUpdateProduction = (updatedWO: ProductionWO) => {
      setProductionData(prev => prev.map(wo => wo.kodeBarang === updatedWO.kodeBarang ? updatedWO : wo));
      // No notification spam for realtime updates, maybe just a small toast or subtle indicator if backend existed
  };

  // --- HANDLERS: NAVIGATION ---
  const handleCancelForm = () => {
    setSelectedMotor(null);
    setSelectedOrder(null);
    // Return to appropriate view
    if (currentView === 'sales_order' || currentView === 'sales_order_detail') {
        setCurrentView('logistics');
    } else if (currentView === 'engineering') {
        setCurrentView('dashboard');
    } else {
        setCurrentView('table');
    }
  };

  const handleNewInput = () => {
    setSelectedMotor(null);
    setCurrentView('form');
  }

  const handleWoEntry = () => {
      setSelectedMotor(null);
      setCurrentView('wo_entry');
  }

  const handleSalesOrderEntry = () => {
      setSelectedOrder(null); // Clear selection for new entry
      setCurrentView('sales_order');
  }

  const handleAddMessage = (msg: DiscussionMessage) => {
      setDiscussions(prev => [...prev, msg]);
      if (msg.isUrgent) {
          showNotification(`⚠️ URGENT MESSAGE: ${msg.userName} sent an urgent note for ${msg.kodeBarang}`, 'info');
      }
  };

  const Icons = {
    Dashboard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Table: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    AI: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Chat: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    Logistics: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
    Plus: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    ChevronRight: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    ChevronLeft: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
    Engineer: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    Production: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Kanban: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> // NEW ICON
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
      {/* ... (rest of the component remains identical, just updating MOCK_DATA above) ... */}
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <AnimatePresence>
          {notification && (
              <motion.div 
                initial={{ opacity: 0, y: -50, x: '50%' }}
                animate={{ opacity: 1, y: 0, x: '50%' }}
                exit={{ opacity: 0, y: -50, x: '50%' }}
                className={`fixed top-6 right-1/2 md:right-10 md:translate-x-0 translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-[90%] backdrop-blur-md border ${
                    notification.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-slate-800/90 border-slate-700 text-white'
                }`}
              >
                  <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-sm">System Notification</h4>
                      <p className="text-xs font-medium opacity-90">{notification.message}</p>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row h-screen">
        
        {/* Sidebar (Desktop/Tablet) */}
        <motion.aside 
          animate={{ width: isSidebarCollapsed ? 100 : 288 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:flex h-[96%] my-auto ml-4 glass rounded-3xl flex-col shadow-2xl z-20 relative print:hidden"
        >
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-10 bg-white p-1.5 rounded-full text-indigo-600 shadow-md hover:scale-110 transition-transform z-50 border border-slate-100"
          >
             {isSidebarCollapsed ? Icons.ChevronRight : Icons.ChevronLeft}
          </button>

          <div className={`p-6 pb-2 ${isSidebarCollapsed ? 'px-4' : ''}`}>
            <div className={`flex items-center gap-3 mb-6 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 shrink-0 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">S</div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-lg font-extrabold text-slate-800 leading-tight tracking-tight">SMART MPE</h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">ERP System v2.0</p>
                </motion.div>
              )}
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
              { id: 'table', label: 'Data Motor', icon: Icons.Table },
              { id: 'production', label: 'Production Backlog', icon: Icons.Production },
              { id: 'kanban', label: 'Production Cards', icon: Icons.Kanban }, // NEW ITEM
              { id: 'logistics', label: 'Pengambilan & Kirim', icon: Icons.Logistics },
              { id: 'engineering', label: 'Data Engineer', icon: Icons.Engineer },
              { id: 'ai', label: 'Gemini AI', icon: Icons.AI },
              { id: 'discussion', label: 'Internal Discussion', icon: Icons.Chat },
            ].map((item) => (
              <motion.button 
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentView(item.id as any);
                  // Reset selections when changing main tabs
                  setSelectedMotor(null);
                  setSelectedOrder(null);
                }}
                className={`w-full text-left px-4 py-4 rounded-2xl flex items-center transition-all duration-300 font-bold text-sm ${
                  isSidebarCollapsed ? 'justify-center' : 'gap-4'
                } ${
                  currentView === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-indigo-600'
                }`}
              >
                 <span className="shrink-0">{item.icon}</span>
                 {!isSidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>}
              </motion.button>
            ))}
          </nav>

          <div className={`p-6 ${isSidebarCollapsed ? 'px-2' : ''}`}>
             <div className={`bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-4 border border-indigo-100 ${isSidebarCollapsed ? 'flex justify-center p-2' : ''}`}>
               <select 
                 value={currentUserRole} 
                 onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                 className={`bg-white border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm ${isSidebarCollapsed ? 'w-10 h-10 p-0 text-transparent' : 'w-full px-3 py-2'}`}
               >
                 {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
               </select>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Nav (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 p-4 pb-6 print:hidden">
           <nav className="glass rounded-2xl p-2 flex justify-around items-center shadow-2xl bg-white/90 backdrop-blur-xl">
              {[{ id: 'dashboard', icon: Icons.Dashboard }, { id: 'table', icon: Icons.Table }, { id: 'kanban', icon: Icons.Kanban }, { id: 'engineering', icon: Icons.Engineer }].map((item) => (
                <motion.button key={item.id} whileTap={{ scale: 0.9 }} onClick={() => setCurrentView(item.id as any)} className={`p-4 rounded-xl transition-all duration-300 ${currentView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-400'}`}>
                   {item.icon}
                </motion.button>
              ))}
           </nav>
        </div>

        {/* Main */}
        <main className="flex-1 h-screen overflow-hidden flex flex-col relative z-10 print:h-auto print:overflow-visible">
          
          <div className="md:hidden flex items-center justify-between px-6 pt-6 pb-2 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">S</div>
              <span className="font-extrabold text-slate-800 text-lg block leading-none">SMART MPE</span>
            </div>
            {/* Mobile Actions for WO Entry & Sales */}
             {currentView === 'table' && (
                <div className="flex gap-2">
                    {/* Sales Button (Visible to Sales & Admin) */}
                    {(currentUserRole === UserRole.SALES || currentUserRole === UserRole.ADMIN) && (
                         <button 
                            onClick={handleSalesOrderEntry}
                            className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                    )}
                    {/* WO Button (Hidden for Manager/Sales) */}
                    {currentUserRole !== UserRole.MANAGER && currentUserRole !== UserRole.SALES && (
                        <button 
                            onClick={handleWoEntry}
                            className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    )}
                </div>
            )}
          </div>

          <header className="px-6 py-4 md:px-10 md:pt-8 flex justify-between items-end md:items-center shrink-0 print:hidden">
            <div>
                <div className="flex items-center gap-2 text-indigo-900/40 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-1 md:mb-2">
                    <span className="hidden md:inline">SMART MPE</span>
                    <span className="hidden md:inline">/</span>
                    <span>{currentView === 'ai' ? 'INTELLIGENCE' : 'WORKSPACE'}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                  <motion.h2 key={currentView} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight truncate">
                    {currentView === 'dashboard' && 'Overview'}
                    {currentView === 'table' && 'Database'}
                    {currentView === 'logistics' && 'Pengambilan & Pengiriman'}
                    {currentView === 'form' && (selectedMotor ? 'Edit Job' : 'Input Data')}
                    {currentView === 'wo_entry' && 'Input Motor Datang'}
                    {currentView === 'sales_order' && (selectedOrder ? 'Edit Sales Order' : 'Order Baru')}
                    {currentView === 'sales_order_detail' && 'Order Detail'}
                    {currentView === 'detail' && 'Job Details'}
                    {currentView === 'engineering' && 'Technical Reports'}
                    {currentView === 'ai' && 'AI Assistant'}
                    {currentView === 'discussion' && 'Discussion'}
                    {currentView === 'production' && 'Production Backlog'}
                    {currentView === 'kanban' && 'Production Cards'}
                  </motion.h2>
                  <p className="hidden md:block text-slate-500 font-bold text-sm md:ml-4">Hello, {currentUserRole}</p>
                </div>
            </div>
            
            {/* Desktop Action Buttons */}
            {currentView === 'table' && (
              <div className="hidden md:flex gap-3">
                  {/* Sales Order Button */}
                  {(currentUserRole === UserRole.SALES || currentUserRole === UserRole.ADMIN) && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSalesOrderEntry}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>Order Baru</span>
                      </motion.button>
                  )}

                  {/* WO Motor Datang (Teknisi/Admin) */}
                  {currentUserRole !== UserRole.MANAGER && currentUserRole !== UserRole.SALES && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWoEntry}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                         <span>WO Motor Datang</span>
                      </motion.button>
                  )}

                  {/* Manual Input (Legacy) */}
                  {currentUserRole === UserRole.ADMIN && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewInput}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center gap-2 hover:bg-slate-800 transition-colors"
                      >
                        {Icons.Plus}
                        <span>Input Manual</span>
                      </motion.button>
                  )}
              </div>
            )}
            
            {currentView === 'logistics' && (
               <div className="hidden md:flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSalesOrderEntry}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Create Order</span>
                  </motion.button>
               </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-10 pb-28 md:pb-10 scrollbar-hide print:overflow-visible print:h-auto print:p-0">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full print:h-auto"
                >
                  {/* ... OTHER VIEWS ... */}
                  {currentView === 'dashboard' && <Dashboard data={motors} />}
                  {currentView === 'table' && <MotorTable data={motors} onEdit={handleEdit} onView={handleViewDetail} onImport={handleImportData} />}
                  {currentView === 'logistics' && (
                    <LogisticsTable 
                        orders={salesOrders} 
                        onUpdateOrder={handleUpdateOrder} 
                        onEdit={handleEditOrder}
                        onView={handleViewOrder}
                    />
                  )}
                  {currentView === 'form' && (
                    <MotorForm 
                      initialData={selectedMotor} 
                      onSave={handleSave} 
                      onCancel={handleCancelForm}
                      userRole={currentUserRole}
                    />
                  )}
                  {currentView === 'wo_entry' && (
                      <IncomingMotorForm 
                        onSave={handleSave}
                        onCancel={handleCancelForm}
                      />
                  )}
                  {currentView === 'sales_order' && (
                      <SalesOrderForm 
                        initialData={selectedOrder}
                        onSave={handleSaveOrder}
                        onCancel={handleCancelForm}
                      />
                  )}
                  {currentView === 'sales_order_detail' && selectedOrder && (
                      <SalesOrderDetail
                        order={selectedOrder}
                        onBack={handleCancelForm}
                        onEdit={handleEditOrder}
                      />
                  )}
                  {currentView === 'engineering' && (
                      <EngineeringForm 
                          motors={motors}
                          onSave={handleSaveReport}
                          onCancel={handleCancelForm}
                      />
                  )}
                  {currentView === 'detail' && selectedMotor && (
                    <MotorDetail 
                        motor={selectedMotor} 
                        onBack={() => setCurrentView('table')}
                        onEdit={handleEdit}
                        discussions={discussions}
                        onAddMessage={handleAddMessage}
                        currentUserRole={currentUserRole}
                    />
                  )}
                  {currentView === 'ai' && <GeminiTools />}
                  {currentView === 'discussion' && (
                      <DiscussionBoard 
                        motors={motors}
                        discussions={discussions}
                        onViewDetail={handleViewDetail}
                        currentUserRole={currentUserRole}
                      />
                  )}
                  
                  {/* PRODUCTION TRACKING VIEWS */}
                  {currentView === 'production' && (
                      <ProductionTracking 
                          motors={motors}
                          productionData={productionData}
                          onUpdateProduction={handleUpdateProduction}
                          currentUserRole={currentUserRole}
                      />
                  )}
                  {currentView === 'kanban' && (
                      <ProductionKanban 
                          motors={motors}
                          productionData={productionData}
                          onUpdateProduction={handleUpdateProduction}
                          currentUserRole={currentUserRole}
                      />
                  )}
                </motion.div>
             </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;