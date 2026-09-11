import React, { useState } from 'react';
import type { Trip } from '../types/trip';

interface DashboardProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: (newTrip: Omit<Trip, 'id' | 'itinerary' | 'expenses' | 'packingList'>) => void;
  onDeleteTrip: (tripId: string) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  trips,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
  showCreateModal,
  setShowCreateModal
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [coverColor, setCoverColor] = useState('linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)');

  const colorOptions = [
    { name: 'Cyber Cyan', value: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' },
    { name: 'Sunset Rose', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
    { name: 'Emerald', value: 'linear-gradient(135deg, #05d697 0%, #00b0ff 100%)' },
    { name: 'Royal Purple', value: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)' },
    { name: 'Warm Amber', value: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
    { name: 'Mystic Ocean', value: 'linear-gradient(135deg, #00b0ff 0%, #00223e 100%)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !startDate || !endDate || budget <= 0) {
      alert('Harap isi semua kolom input yang wajib dan budget harus lebih besar dari 0.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai.');
      return;
    }

    onCreateTrip({
      title,
      destination,
      startDate,
      endDate,
      budget,
      description,
      coverImage: coverColor,
      status: 'upcoming'
    });

    // Reset Form
    setTitle('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setBudget(0);
    setDescription('');
    setCoverColor('linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)');
    setShowCreateModal(false);
  };

  // Helper formats
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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Stats calculation
  const totalBudget = trips.reduce((acc, curr) => acc + curr.budget, 0);
  const upcomingCount = trips.filter(t => t.status === 'upcoming').length;
  const ongoingCount = trips.filter(t => t.status === 'ongoing').length;
  const completedCount = trips.filter(t => t.status === 'completed').length;

  return (
    <div style={styles.container}>
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Hero / Header Section */}
      <div style={styles.header}>
        <div>
          <span style={styles.tagline}>KONSOL PERJALANAN ANDA</span>
          <h1 style={styles.title}>Atur Rencana <span className="gradient-text">Petualangan Anda</span></h1>
          <p style={styles.subtitle}>
            Aplikasi planner perjalanan kelas dunia. Rancang itinerary, kelola budget, dan tracking check-list barang bawaan dalam satu dashboard glassmorphism modern.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={styles.createBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Buat Trip Baru
        </button>
      </div>

      {/* Stats Counter Section */}
      <div className="grid-3" style={styles.statsGrid}>
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <svg style={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={styles.statLabel}>Total Perjalanan</div>
            <div style={styles.statNumber}>{trips.length} Trip</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIconContainer, background: 'rgba(5, 214, 151, 0.15)', color: '#05d697' }}>
            <svg style={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div>
            <div style={styles.statLabel}>Total Budget Dialokasikan</div>
            <div style={styles.statNumber} className="gradient-text">{formatCurrency(totalBudget)}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIconContainer, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <svg style={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div style={styles.statLabel}>Status Perjalanan</div>
            <div style={styles.statStatusDesc}>
              <span style={{ color: 'var(--color-upcoming)' }}>{upcomingCount} Akan Datang</span> • <span style={{ color: 'var(--color-ongoing)' }}>{ongoingCount} Jalan</span> • <span style={{ color: 'var(--color-completed)' }}>{completedCount} Selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <h2 style={styles.sectionTitle}>Trip <span className="gradient-text">Aktif & Riwayat</span></h2>

      {trips.length === 0 ? (
        <div className="glass-card text-center" style={styles.emptyCard}>
          <div style={styles.emptyIconContainer}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={styles.emptyIcon}>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>Belum Ada Perjalanan yang Direncanakan</h3>
          <p style={styles.emptyText}>
            Mulai petualangan Anda dengan membuat rencana perjalanan baru sekarang atau pilih destinasi populer di tab **Explore**.
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            Buat Perjalanan Pertama Anda
          </button>
        </div>
      ) : (
        <div className="grid-3" style={styles.tripsGrid}>
          {trips.map((trip) => (
            <div key={trip.id} className="glass-card hoverable" style={styles.tripCard}>
              {/* Card Banner */}
              <div style={{ ...styles.tripBanner, background: trip.coverImage }}>
                <span className={`badge badge-${trip.status}`} style={styles.statusBadge}>
                  {trip.status === 'upcoming' ? 'Akan Datang' : trip.status === 'ongoing' ? 'Sedang Jalan' : 'Selesai'}
                </span>
                
                {/* Delete button on card */}
                <button 
                  style={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm(`Apakah Anda yakin ingin menghapus trip "${trip.title}"? Semua itinerary dan budget tracker akan hilang.`)) {
                      onDeleteTrip(trip.id);
                    }
                  }}
                  title="Hapus Trip"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* Card Body */}
              <div style={styles.tripCardBody}>
                <div style={styles.tripDest}>{trip.destination}</div>
                <h3 style={styles.tripTitle}>{trip.title}</h3>
                
                {trip.description && (
                  <p style={styles.tripDesc}>{trip.description}</p>
                )}

                <div style={styles.tripMeta}>
                  <div style={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.metaIcon}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>

                  <div style={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.metaIcon}>
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span style={{ fontWeight: 700 }} className="gradient-text">{formatCurrency(trip.budget)}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={styles.openTripBtn}
                  onClick={() => onSelectTrip(trip.id)}
                >
                  Buka Planner & Itinerary
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Rencanakan Trip Baru</h2>
              <button style={styles.closeModalBtn} onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="form-group">
                <label>Nama/Judul Trip *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Contoh: Liburan Keluarga Akhir Tahun" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Destinasi *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Contoh: Ubud, Bali / Tokyo, Jepang" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Mulai *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Selesai *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Alokasi Anggaran (Budget Rp) *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Contoh: 10000000" 
                  value={budget || ''}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Deskripsi / Catatan Perjalanan</label>
                <textarea 
                  className="form-control" 
                  style={{ height: 80, resize: 'vertical' }}
                  placeholder="Catatan tambahan mengenai trip ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Warna Tema Kartu</label>
                <div style={styles.colorSelector}>
                  {colorOptions.map((opt) => (
                    <div 
                      key={opt.name}
                      style={{ 
                        ...styles.colorCircle, 
                        background: opt.value,
                        border: coverColor === opt.value ? '2px solid #fff' : '2px solid transparent',
                        transform: coverColor === opt.value ? 'scale(1.15)' : 'scale(1)'
                      }}
                      onClick={() => setCoverColor(opt.value)}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Mulai Merencanakan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
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
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 40,
  },
  tagline: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '2px',
    color: '#00f2fe',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: 16,
    maxWidth: 750,
    lineHeight: 1.6,
  },
  createBtn: {
    padding: '14px 28px',
  },
  statsGrid: {
    marginBottom: 48,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: '12px',
    background: 'rgba(0, 242, 254, 0.15)',
    color: '#00f2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
  },
  statLabel: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 800,
  },
  statStatusDesc: {
    fontSize: 13,
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
  },
  emptyCard: {
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    color: 'var(--text-muted)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: 14,
    maxWidth: 500,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  tripsGrid: {
    marginTop: 10,
  },
  tripCard: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tripBanner: {
    height: 120,
    borderTopLeftRadius: '19px',
    borderTopRightRadius: '19px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusBadge: {
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(255, 8, 68, 0.15)',
    border: '1px solid rgba(255, 8, 68, 0.3)',
    color: '#ff4d6d',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  tripCardBody: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  tripDest: {
    fontSize: 12,
    fontWeight: 700,
    color: '#00f2fe',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 6,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  tripDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    marginBottom: 20,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tripMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '14px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  metaIcon: {
    color: 'var(--text-muted)',
  },
  openTripBtn: {
    width: '100%',
    justifyContent: 'space-between',
    padding: '10px 18px',
    fontSize: 13,
  },
  modal: {
    maxWidth: 550,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
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
  colorSelector: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
  }
};
