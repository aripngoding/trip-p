import React, { useState } from 'react';
import type { Trip, Activity, Expense, PackingItem } from '../types/trip';

interface TripPlannerProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onBackToDashboard: () => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  trip,
  onUpdateTrip,
  onBackToDashboard
}) => {
  const [plannerTab, setPlannerTab] = useState<'itinerary' | 'budget' | 'packing'>('itinerary');

  // Days Calculation
  const getDaysArray = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const days = [];
    for (let i = 0; i < diffDays; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      days.push({
        dayNumber: i + 1,
        date: current.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const days = getDaysArray();
  const [activeDay, setActiveDay] = useState<number>(1);

  // Modals state
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // New Activity Form State
  const [actTime, setActTime] = useState('08:00');
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState<Activity['category']>('sightseeing');
  const [actCost, setActCost] = useState(0);
  const [actNotes, setActNotes] = useState('');

  // New Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState(0);
  const [expCategory, setExpCategory] = useState<Expense['category']>('food');
  const [expDate, setExpDate] = useState(trip.startDate);

  // New Packing Item State
  const [packName, setPackName] = useState('');
  const [packCategory, setPackCategory] = useState<PackingItem['category']>('clothing');

  // Format IDR Helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  // Update Status Handler
  const handleUpdateStatus = async (status: Trip['status']) => {
    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Gagal memperbarui status trip.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Add Activity Handler
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle || !actTime) {
      alert('Harap isi judul aktivitas dan waktu.');
      return;
    }

    try {
      const response = await fetch(`/api/trips/${trip.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: activeDay,
          time: actTime,
          title: actTitle,
          category: actCategory,
          cost: actCost,
          notes: actNotes
        })
      });
      if (!response.ok) throw new Error('Gagal menambahkan aktivitas ke database.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);

      // Reset Form
      setActTime('08:00');
      setActTitle('');
      setActCategory('sightseeing');
      setActCost(0);
      setActNotes('');
      setShowActivityModal(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activityId: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus aktivitas dari database.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Add Expense Handler
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || expAmount <= 0) {
      alert('Harap isi judul pengeluaran dan jumlah nominal yang valid.');
      return;
    }

    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: expTitle,
          amount: expAmount,
          category: expCategory,
          date: expDate
        })
      });
      if (!response.ok) throw new Error('Gagal menyimpan pengeluaran ke database.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);

      setExpTitle('');
      setExpAmount(0);
      setExpCategory('food');
      setExpDate(trip.startDate);
      setShowExpenseModal(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Delete Expense Handler
  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus pengeluaran dari database.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Packing Checklist handlers
  const handleTogglePacking = async (itemId: string) => {
    try {
      const response = await fetch(`/api/packing/${itemId}/toggle`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Gagal memperbarui status barang bawaan.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleAddPackingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packName) return;

    try {
      const response = await fetch(`/api/trips/${trip.id}/packing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: packName,
          category: packCategory
        })
      });
      if (!response.ok) throw new Error('Gagal menambahkan barang bawaan.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
      setPackName('');
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleDeletePackingItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/packing/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus barang bawaan.');
      const updatedTrip = await response.json();
      onUpdateTrip(updatedTrip);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleResetPacking = async () => {
    if(confirm('Atur ulang seluruh checklist menjadi belum dibawa?')) {
      try {
        const response = await fetch(`/api/trips/${trip.id}/packing/reset`, {
          method: 'PUT'
        });
        if (!response.ok) throw new Error('Gagal mereset barang bawaan.');
        const updatedTrip = await response.json();
        onUpdateTrip(updatedTrip);
      } catch (e: any) {
        console.error(e);
        alert(e.message);
      }
    }
  };

  // Budget Calculations
  const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = trip.budget - totalExpenses;
  const budgetUsagePercent = Math.min((totalExpenses / trip.budget) * 100, 100);

  // Category summary for budget charts
  const getCategorySpent = (cat: Expense['category']) => {
    return trip.expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Get current day's activities
  const activeDayItinerary = trip.itinerary.find(d => d.dayNumber === activeDay);
  const activeDayActivities = activeDayItinerary?.activities || [];

  // Grouped Packing list
  const packingCategories: { name: string; key: PackingItem['category'] }[] = [
    { name: 'Dokumen Penting', key: 'documents' },
    { name: 'Pakaian & Aksesoris', key: 'clothing' },
    { name: 'Elektronik & Gadget', key: 'electronics' },
    { name: 'Perlengkapan Mandi', key: 'toiletries' },
    { name: 'Kesehatan & Obat', key: 'medication' },
    { name: 'Lain-lain', key: 'other' }
  ];

  const getPackingProgress = () => {
    if (trip.packingList.length === 0) return { percent: 0, count: 0, total: 0 };
    const total = trip.packingList.length;
    const count = trip.packingList.filter(i => i.packed).length;
    return {
      percent: Math.round((count / total) * 100),
      count,
      total
    };
  };

  const packingProgress = getPackingProgress();

  return (
    <div style={styles.container}>
      {/* Background Orbs */}
      <div className="orb orb-1" style={{ top: '20%' }}></div>
      <div className="orb orb-3" style={{ bottom: '10%' }}></div>

      {/* Header bar */}
      <div style={styles.header}>
        <button className="btn btn-secondary" onClick={onBackToDashboard} style={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Dashboard
        </button>

        <div style={styles.tripBadgeContainer}>
          <span className={`badge badge-${trip.status}`}>
            {trip.status === 'upcoming' ? 'Akan Datang' : trip.status === 'ongoing' ? 'Sedang Jalan' : 'Selesai'}
          </span>
          <select 
            value={trip.status} 
            onChange={(e) => handleUpdateStatus(e.target.value as Trip['status'])}
            style={styles.statusDropdown}
          >
            <option value="upcoming">Akan Datang</option>
            <option value="ongoing">Sedang Jalan</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>

      {/* Trip Quick Info */}
      <div className="glass-card" style={styles.quickInfoCard}>
        <div style={{ ...styles.cardColorBar, background: trip.coverImage }}></div>
        <div style={styles.quickInfoContent}>
          <div style={styles.destText}>{trip.destination}</div>
          <h2 style={styles.tripTitle}>{trip.title}</h2>
          {trip.description && <p style={styles.tripDesc}>{trip.description}</p>}
          <div style={styles.tripDates}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.metaIcon}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDate(trip.startDate)} s/d {formatDate(trip.endDate)} ({days.length} Hari)</span>
          </div>
        </div>
      </div>

      {/* Internal Subtabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setPlannerTab('itinerary')} 
          style={{...styles.tabItem, ...(plannerTab === 'itinerary' ? styles.tabItemActive : {})}}
        >
          <svg style={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Itinerary Harian
        </button>
        <button 
          onClick={() => setPlannerTab('budget')} 
          style={{...styles.tabItem, ...(plannerTab === 'budget' ? styles.tabItemActive : {})}}
        >
          <svg style={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Anggaran & Pengeluaran ({Math.round(budgetUsagePercent)}%)
        </button>
        <button 
          onClick={() => setPlannerTab('packing')} 
          style={{...styles.tabItem, ...(plannerTab === 'packing' ? styles.tabItemActive : {})}}
        >
          <svg style={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Checklist Barang ({packingProgress.percent}%)
        </button>
      </div>

      {/* Main planner views */}
      <div style={styles.viewContent}>
        
        {/* TAB 1: ITINERARY PLANNER */}
        {plannerTab === 'itinerary' && (
          <div className="grid-2-1">
            {/* Days list & activities */}
            <div className="glass-card">
              <div style={styles.itineraryHeader}>
                <h3>Jadwal Kegiatan</h3>
                <button className="btn btn-primary" onClick={() => setShowActivityModal(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Tambah Aktivitas
                </button>
              </div>

              {/* Day selector carousel */}
              <div style={styles.daysCarousel}>
                {days.map((d) => (
                  <button 
                    key={d.dayNumber}
                    onClick={() => setActiveDay(d.dayNumber)}
                    style={{
                      ...styles.dayTabButton, 
                      ...(activeDay === d.dayNumber ? styles.dayTabButtonActive : {})
                    }}
                  >
                    <span style={styles.dayTabNum}>Hari {d.dayNumber}</span>
                    <span style={styles.dayTabDate}>{formatDate(d.date)}</span>
                  </button>
                ))}
              </div>

              {/* Day details */}
              <div style={styles.activitiesSection}>
                <h4 style={styles.activeDayTitle}>Aktivitas Hari {activeDay} ({formatDate(days.find(d => d.dayNumber === activeDay)?.date || '')})</h4>
                
                {activeDayActivities.length === 0 ? (
                  <div style={styles.emptyActivities}>
                    <p>Belum ada jadwal aktivitas untuk hari ini.</p>
                    <button className="btn btn-secondary" onClick={() => setShowActivityModal(true)} style={{ marginTop: 12 }}>
                      Buat Jadwal Pertama
                    </button>
                  </div>
                ) : (
                  <div style={styles.activitiesList}>
                    {activeDayActivities.map((act) => (
                      <div key={act.id} style={styles.activityCard}>
                        <div style={styles.actTimeBox}>
                          <span style={styles.actTime}>{act.time}</span>
                          <div style={{ ...styles.actCategoryBadge, ...categoryStyles[act.category] }}>
                            {act.category === 'transport' ? '🚗 Transport' : 
                             act.category === 'food' ? '🍲 Kuliner' : 
                             act.category === 'hotel' ? '🏨 Akomodasi' : 
                             act.category === 'sightseeing' ? '🏞️ Wisata' : 
                             act.category === 'activity' ? '🎯 Kegiatan' : '⚙️ Lainnya'}
                          </div>
                        </div>
                        <div style={styles.actContentBox}>
                          <div style={styles.actMainRow}>
                            <h5 style={styles.actTitleText}>{act.title}</h5>
                            {act.cost > 0 && (
                              <span style={styles.actCostText}>{formatCurrency(act.cost)}</span>
                            )}
                          </div>
                          {act.notes && <p style={styles.actNotesText}>{act.notes}</p>}
                        </div>
                        <button 
                          style={styles.actDeleteBtn}
                          onClick={() => handleDeleteActivity(act.id)}
                          title="Hapus Kegiatan"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick tips panel */}
            <div className="glass-card" style={styles.sidePanel}>
              <h3 style={styles.sideTitle}>💡 Tips Perjalanan</h3>
              <ul style={styles.tipsList}>
                <li>📅 <strong>Jadwal Fleksibel:</strong> Jangan mengisi setiap jam dengan kegiatan. Sediakan waktu jeda 1-2 jam untuk istirahat atau mengantisipasi keterlambatan.</li>
                <li>🚇 <strong>Akomodasi Terpusat:</strong> Cari penginapan dekat dengan stasiun kereta atau terminal untuk menghemat pengeluaran transportasi.</li>
                <li>🍲 <strong>Kuliner Lokal:</strong> Makanlah di warung lokal abadi untuk mendapatkan cita rasa autentik dan harga yang ramah di kantong.</li>
              </ul>

              <div style={styles.budgetQuickStats}>
                <h4>Ringkasan Budget Harian</h4>
                <div style={styles.quickStatRow}>
                  <span>Total Anggaran:</span>
                  <span>{formatCurrency(trip.budget)}</span>
                </div>
                <div style={styles.quickStatRow}>
                  <span>Total Terpakai:</span>
                  <span style={{ color: remainingBudget >= 0 ? '#05d697' : '#ff4d6d' }}>{formatCurrency(totalExpenses)}</span>
                </div>
                <div style={styles.quickStatRowBorder}>
                  <span>Sisa:</span>
                  <span style={{ fontWeight: 700, color: remainingBudget >= 0 ? '#00f2fe' : '#ff4d6d' }}>{formatCurrency(remainingBudget)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUDGET & EXPENSES TRACKER */}
        {plannerTab === 'budget' && (
          <div className="grid-2-1">
            {/* Expense logs */}
            <div className="glass-card">
              <div style={styles.itineraryHeader}>
                <h3>Daftar Pengeluaran</h3>
                <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Catat Pengeluaran
                </button>
              </div>

              {trip.expenses.length === 0 ? (
                <div style={styles.emptyActivities}>
                  <p>Belum ada pengeluaran yang dicatat.</p>
                  <button className="btn btn-secondary" onClick={() => setShowExpenseModal(true)} style={{ marginTop: 12 }}>
                    Mulai Catat Pengeluaran
                  </button>
                </div>
              ) : (
                <div style={styles.expensesTableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Tanggal</th>
                        <th style={styles.th}>Deskripsi</th>
                        <th style={styles.th}>Kategori</th>
                        <th style={styles.th}>Jumlah</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trip.expenses.map((exp) => (
                        <tr key={exp.id} style={styles.tr}>
                          <td style={styles.td}>{formatDate(exp.date)}</td>
                          <td style={styles.td}><strong>{exp.title}</strong></td>
                          <td style={styles.td}>
                            <span style={{ ...styles.categoryLabel, ...expenseCategoryStyles[exp.category] }}>
                              {exp.category === 'accommodation' ? '🏨 Akomodasi' :
                               exp.category === 'transport' ? '🚗 Transport' :
                               exp.category === 'food' ? '🍲 Kuliner' :
                               exp.category === 'activities' ? '🎯 Wisata' :
                               exp.category === 'shopping' ? '🛍️ Belanja' : '⚙️ Lainnya'}
                            </span>
                          </td>
                          <td style={{ ...styles.td, fontWeight: 700 }}>{formatCurrency(exp.amount)}</td>
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <button 
                              style={styles.actionDeleteBtn}
                              onClick={() => handleDeleteExpense(exp.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Budget Analytics Side Panel */}
            <div className="glass-card" style={styles.sidePanel}>
              <h3 style={styles.sideTitle}>Ringkasan Keuangan</h3>
              
              <div style={styles.progressBarWrapper}>
                <div style={styles.flexRowBetween}>
                  <span style={styles.barLabel}>Anggaran Terpakai</span>
                  <span style={{ ...styles.barValue, color: budgetUsagePercent > 90 ? '#ff4d6d' : '#00f2fe' }}>
                    {Math.round(budgetUsagePercent)}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${budgetUsagePercent}%`,
                      background: budgetUsagePercent > 90 ? 'var(--gradient-orange-pink)' : budgetUsagePercent > 70 ? 'var(--gradient-cyan-blue)' : 'var(--gradient-emerald-cyan)'
                    }}
                  />
                </div>
                <div style={styles.flexRowBetween} className="mt-4">
                  <div style={styles.expBox}>
                    <span style={styles.expLabel}>TERPAKAI</span>
                    <span style={styles.expNumber}>{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div style={{ ...styles.expBox, alignItems: 'flex-end' }}>
                    <span style={styles.expLabel}>SISA SALDO</span>
                    <span style={{ ...styles.expNumber, color: remainingBudget >= 0 ? '#05d697' : '#ff4d6d' }}>
                      {formatCurrency(remainingBudget)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.categoryDistribution}>
                <h4 style={styles.sectionHeading}>Alokasi Pengeluaran per Kategori</h4>
                
                {[
                  { label: '🏨 Akomodasi', key: 'accommodation' as Expense['category'] },
                  { label: '🚗 Transportasi', key: 'transport' as Expense['category'] },
                  { label: '🍲 Kuliner', key: 'food' as Expense['category'] },
                  { label: '🎯 Wisata & Kegiatan', key: 'activities' as Expense['category'] },
                  { label: '🛍️ Belanja', key: 'shopping' as Expense['category'] },
                  { label: '⚙️ Lainnya', key: 'other' as Expense['category'] },
                ].map((item) => {
                  const spent = getCategorySpent(item.key);
                  const percent = totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0;
                  return (
                    <div key={item.key} style={styles.distributionRow}>
                      <div style={styles.distributionMeta}>
                        <span>{item.label}</span>
                        <strong>{formatCurrency(spent)}</strong>
                      </div>
                      <div className="progress-bar-container" style={{ height: 4 }}>
                        <div 
                          className="progress-bar-fill"
                          style={{ 
                            width: `${percent}%`,
                            background: 'var(--gradient-cyan-blue)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PACKING CHECKLIST */}
        {plannerTab === 'packing' && (
          <div className="grid-2-1">
            {/* Checklist boxes */}
            <div className="glass-card">
              <div style={styles.itineraryHeader}>
                <h3>Checklist Barang Bawaan</h3>
                <button className="btn btn-danger" onClick={handleResetPacking}>
                  Atur Ulang
                </button>
              </div>

              {trip.packingList.length === 0 ? (
                <div style={styles.emptyActivities}>
                  <p>Belum ada barang bawaan yang terdaftar.</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gunakan kolom di samping kanan untuk memasukkan daftar barang bawaan pertama Anda.</p>
                </div>
              ) : (
                <div style={styles.packingContent}>
                  {packingCategories.map((cat) => {
                    const items = trip.packingList.filter(i => i.category === cat.key);
                    if (items.length === 0) return null;
                    return (
                      <div key={cat.key} style={styles.packingCatBlock}>
                        <h4 style={styles.packingCatTitle}>{cat.name}</h4>
                        <div style={styles.packingItemsGrid}>
                          {items.map((item) => (
                            <div 
                              key={item.id} 
                              style={{ 
                                ...styles.packingItemRow, 
                                opacity: item.packed ? 0.6 : 1 
                              }}
                              onClick={() => handleTogglePacking(item.id)}
                            >
                              <div style={styles.checkboxContainer}>
                                <input 
                                  type="checkbox" 
                                  checked={item.packed} 
                                  onChange={() => {}} // toggled on container click
                                  style={styles.checkbox}
                                />
                                <span style={{ 
                                  ...styles.packingItemName,
                                  textDecoration: item.packed ? 'line-through' : 'none'
                                }}>
                                  {item.name}
                                </span>
                              </div>
                              <button 
                                style={styles.packItemDelete}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePackingItem(item.id);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add packing item panel */}
            <div className="glass-card" style={styles.sidePanel}>
              <h3 style={styles.sideTitle}>Tambah Barang</h3>
              <form onSubmit={handleAddPackingItem} style={styles.form}>
                <div className="form-group">
                  <label>Nama Barang</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Contoh: Paspor / Charger HP"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    className="form-control"
                    value={packCategory}
                    onChange={(e) => setPackCategory(e.target.value as PackingItem['category'])}
                  >
                    {packingCategories.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                  Tambah ke Daftar
                </button>
              </form>

              <div style={styles.packingProgressBox}>
                <h4>Kesiapan Barang</h4>
                <div style={styles.packingProgressMeta}>
                  <span>Barang Terpack:</span>
                  <strong>{packingProgress.count} / {packingProgress.total}</strong>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ 
                      width: `${packingProgress.percent}%`,
                      background: 'var(--gradient-emerald-cyan)'
                    }}
                  />
                </div>
                <div style={styles.progressPercent}>{packingProgress.percent}% siap berangkat</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Tambah Aktivitas Hari {activeDay}</h2>
              <button style={styles.closeModalBtn} onClick={() => setShowActivityModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddActivity} style={styles.form}>
              <div className="form-row">
                <div className="form-group">
                  <label>Waktu Kegiatan *</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori *</label>
                  <select 
                    className="form-control"
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value as Activity['category'])}
                    required
                  >
                    <option value="sightseeing">🏞️ Wisata & Rekreasi</option>
                    <option value="food">🍲 Makan & Minum</option>
                    <option value="transport">🚗 Transportasi</option>
                    <option value="hotel">🏨 Penginapan/Hotel</option>
                    <option value="activity">🎯 Aktivitas Lain</option>
                    <option value="other">⚙️ Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Judul Aktivitas *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Contoh: Tiket Masuk Kuil Emas / Makan Malam Ramen" 
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Biaya Estimasi (Rp) - Opsional</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Isi jika memerlukan biaya, otomatis tercatat di pengeluaran" 
                  value={actCost || ''}
                  onChange={(e) => setActCost(Number(e.target.value))}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Catatan / Alamat / Keterangan</label>
                <textarea 
                  className="form-control" 
                  style={{ height: 80, resize: 'vertical' }}
                  placeholder="Contoh: Naik kereta jalur biru turun di stasiun A2"
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                />
              </div>

              <div style={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowActivityModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Tambahkan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Catat Pengeluaran Baru</h2>
              <button style={styles.closeModalBtn} onClick={() => setShowExpenseModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddExpense} style={styles.form}>
              <div className="form-group">
                <label>Nama Pengeluaran *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Contoh: Sewa Kamar Hotel 3 Malam" 
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nominal Pengeluaran (Rp) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Contoh: 1500000" 
                    value={expAmount || ''}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Kategori *</label>
                  <select 
                    className="form-control"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as Expense['category'])}
                    required
                  >
                    <option value="accommodation">🏨 Akomodasi</option>
                    <option value="transport">🚗 Transportasi</option>
                    <option value="food">🍲 Makanan & Minuman</option>
                    <option value="activities">🎯 Aktivitas & Wisata</option>
                    <option value="shopping">🛍️ Belanja</option>
                    <option value="other">⚙️ Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tanggal Pengeluaran *</label>
                <select 
                  className="form-control"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  required
                >
                  {days.map(d => (
                    <option key={d.date} value={d.date}>{formatDate(d.date)}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling definitions specific to categories
const categoryStyles: { [key: string]: React.CSSProperties } = {
  transport: { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  food: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  hotel: { background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  sightseeing: { background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' },
  activity: { background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  other: { background: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' },
};

const expenseCategoryStyles: { [key: string]: React.CSSProperties } = {
  accommodation: { background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  transport: { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  food: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  activities: { background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' },
  shopping: { background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' },
  other: { background: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' },
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    animation: 'fade-in 0.4s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  backBtn: {
    padding: '10px 18px',
    fontSize: 13,
  },
  tripBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusDropdown: {
    background: 'rgba(15, 22, 36, 0.8)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
  },
  quickInfoCard: {
    padding: 0,
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  cardColorBar: {
    height: 6,
    width: '100%',
  },
  quickInfoContent: {
    padding: 24,
  },
  destText: {
    fontSize: 12,
    fontWeight: 700,
    color: '#00f2fe',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: 6,
  },
  tripTitle: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 8,
  },
  tripDesc: {
    color: 'var(--text-secondary)',
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  tripDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  metaIcon: {
    color: 'var(--text-muted)',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: 32,
    gap: 24,
    overflowX: 'auto',
  },
  tabItem: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-secondary)',
    padding: '12px 4px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  tabItemActive: {
    color: '#00f2fe',
    borderBottomColor: '#00f2fe',
  },
  tabIcon: {
    width: 16,
    height: 16,
  },
  viewContent: {
    minHeight: 400,
  },
  itineraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  daysCarousel: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBottom: 16,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  dayTabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minWidth: 100,
    transition: 'all 0.2s ease',
  },
  dayTabButtonActive: {
    background: 'rgba(0, 242, 254, 0.08)',
    borderColor: '#00f2fe',
    color: '#00f2fe',
  },
  dayTabNum: {
    fontWeight: 700,
    fontSize: 14,
  },
  dayTabDate: {
    fontSize: 11,
  },
  activitiesSection: {
    marginTop: 10,
  },
  activeDayTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
    color: '#fff',
  },
  emptyActivities: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-secondary)',
    fontSize: 14,
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  activityCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  actTimeBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    minWidth: 100,
  },
  actTime: {
    fontSize: 15,
    fontWeight: 800,
    color: '#fff',
  },
  actCategoryBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  actContentBox: {
    flex: 1,
  },
  actMainRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 12,
  },
  actTitleText: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  actCostText: {
    fontSize: 13,
    fontWeight: 700,
    color: '#05d697',
  },
  actNotesText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  actDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 20,
    cursor: 'pointer',
    position: 'absolute',
    top: 12,
    right: 12,
    lineHeight: 0.5,
    transition: 'color 0.2s ease',
  },
  sidePanel: {
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  sideTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  tipsList: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    padding: 0,
  },
  budgetQuickStats: {
    marginTop: 8,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  quickStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  quickStatRowBorder: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: 8,
  },
  expensesTableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
    textAlign: 'left',
  },
  th: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    color: 'var(--text-primary)',
  },
  tr: {
    transition: 'all 0.2s ease',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  actionDeleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ff4d6d',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
  progressBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  flexRowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  barValue: {
    fontSize: 14,
    fontWeight: 800,
  },
  expBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  expLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  expNumber: {
    fontSize: 16,
    fontWeight: 800,
  },
  categoryDistribution: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: 8,
  },
  distributionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  distributionMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  packingContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  packingCatBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  packingCatTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#00f2fe',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: 6,
  },
  packingItemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 10,
  },
  packingItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    cursor: 'pointer',
    width: 16,
    height: 16,
    accentColor: '#05d697',
  },
  packingItemName: {
    fontSize: 13,
    color: 'var(--text-primary)',
  },
  packItemDelete: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 16,
    cursor: 'pointer',
  },
  packingProgressBox: {
    marginTop: 8,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  packingProgressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: 600,
    color: '#05d697',
    textAlign: 'right',
  },
  modal: {
    maxWidth: 500,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: 28,
    cursor: 'pointer',
    lineHeight: 0.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  }
};
