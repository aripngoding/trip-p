import React from 'react';
import type { Destination } from '../types/trip';

interface ExploreProps {
  onPlanDestination: (destination: Destination) => void;
}

export const PRESET_DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Pulau Dewata yang terkenal dengan keindahan pantai, pura kuno, terasering padi Ubud, dan budaya seni pertunjukan yang magis.',
    imageUrl: 'linear-gradient(135deg, #05d697 0%, #00b0ff 100%)',
    popularActivities: ['Sunset di Pura Luhur Uluwatu', 'Snorkeling di Nusa Penida', 'Menikmati seni di Ubud', 'Belajar berselancar di Pantai Kuta'],
    recommendedDuration: '7 Hari',
    estimatedCost: 'Rp 5.000.000'
  },
  {
    id: 'dest-2',
    name: 'Kyoto',
    country: 'Jepang',
    description: 'Kota warisan budaya bersejarah Jepang dengan ribuan kuil Buddha klasik, taman zen yang menenangkan, istana kekaisaran, dan hutan bambu Arashiyama.',
    imageUrl: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)',
    popularActivities: ['Gerbang Merah Fushimi Inari Shrine', 'Kuil Emas Kinkaku-ji', 'Hutan Bambu Arashiyama', 'Menjelajahi distrik kuno Gion'],
    recommendedDuration: '5 Hari',
    estimatedCost: 'Rp 15.000.000'
  },
  {
    id: 'dest-3',
    name: 'Pegunungan Alpen',
    country: 'Swiss',
    description: 'Negeri ajaib musim dingin dan musim panas dengan puncak bersalju abadi, danau glasial yang jernih, serta desa-desa kayu alpine yang menawan.',
    imageUrl: 'linear-gradient(135deg, #70a1ff 0%, #1e90ff 100%)',
    popularActivities: ['Melihat Gunung Matterhorn', 'Kereta Panoramic Glacier Express', 'Paragliding di Interlaken', 'Mengunjungi desa Zermatt'],
    recommendedDuration: '6 Hari',
    estimatedCost: 'Rp 30.000.000'
  },
  {
    id: 'dest-4',
    name: 'Iceland',
    country: 'Islandia',
    description: 'Negeri api dan es dengan lanskap dramatis, gunung berapi aktif, geiser menyembur, air terjun raksasa, gua es, dan keindahan Aurora Borealis.',
    imageUrl: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    popularActivities: ['Menikmati air hangat Blue Lagoon', 'Tur Golden Circle', 'Mencari Cahaya Utara (Aurora)', 'Melihat Pantai Pasir Hitam Reynisfjara'],
    recommendedDuration: '8 Hari',
    estimatedCost: 'Rp 25.000.000'
  },
  {
    id: 'dest-5',
    name: 'Paris',
    country: 'Prancis',
    description: 'Pusat seni, mode, gastronomi, dan budaya global. Terkenal dengan pemandangan kota abad ke-19 yang ikonik, Sungai Seine, dan museum kelas dunia.',
    imageUrl: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    popularActivities: ['Berfoto di Menara Eiffel', 'Menjelajahi Museum Louvre', 'Menyusuri jalan Champs-Élysées', 'Makan croissant di kafe pinggir jalan'],
    recommendedDuration: '4 Hari',
    estimatedCost: 'Rp 22.000.000'
  },
  {
    id: 'dest-6',
    name: 'Raja Ampat',
    country: 'Indonesia',
    description: 'Surga bawah laut terindah di dunia dengan gugusan pulau karang karst, terumbu karang yang sangat kaya akan biodiversitas, dan pantai pasir putih tak berpenghuni.',
    imageUrl: 'linear-gradient(135deg, #00b0ff 0%, #00223e 100%)',
    popularActivities: ['Diving & Snorkeling di Cape Kri', 'Trekking ke Bukit Pianemo', 'Melihat Burung Cendrawasih Merah', 'Menikmati ketenangan di Misool'],
    recommendedDuration: '6 Hari',
    estimatedCost: 'Rp 12.000.000'
  }
];

export const Explore: React.FC<ExploreProps> = ({ onPlanDestination }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.tagline}>DOKUMENTASI DESTINASI</span>
        <h1 style={styles.title}>Eksplorasi <span className="gradient-text">Destinasi Impian</span></h1>
        <p style={styles.subtitle}>
          Temukan destinasi terpopuler di dunia dan rancang perjalanan tak terlupakan Anda sekarang juga.
        </p>
      </div>

      <div className="grid-3" style={styles.grid}>
        {PRESET_DESTINATIONS.map((dest) => (
          <div key={dest.id} className="glass-card hoverable" style={styles.card}>
            <div style={{ ...styles.cardHeader, background: dest.imageUrl }}>
              <div style={styles.destOverlay}>
                <span style={styles.countryBadge}>{dest.country}</span>
              </div>
            </div>
            <div style={styles.cardBody}>
              <h3 style={styles.destName}>{dest.name}</h3>
              <p style={styles.destDesc}>{dest.description}</p>
              
              <div style={styles.statsContainer}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Durasi Rekomendasi</span>
                  <span style={styles.statValue}>{dest.recommendedDuration}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Estimasi Biaya</span>
                  <span style={styles.statValue} className="gradient-text">{dest.estimatedCost}</span>
                </div>
              </div>

              <div style={styles.activitiesContainer}>
                <h4 style={styles.activitiesTitle}>Aktivitas Favorit:</h4>
                <ul style={styles.activitiesList}>
                  {dest.popularActivities.slice(0, 3).map((act, index) => (
                    <li key={index} style={styles.activityItem}>
                      <span style={styles.bullet}>✦</span> {act}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="btn btn-primary" 
                style={styles.planButton}
                onClick={() => onPlanDestination(dest)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Rencanakan Trip Ke Sini
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    animation: 'fade-in 0.4s ease-out',
  },
  header: {
    marginBottom: 40,
    textAlign: 'center',
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
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  grid: {
    marginTop: 20,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
  },
  cardHeader: {
    height: 180,
    position: 'relative',
    borderTopLeftRadius: '19px',
    borderTopRightRadius: '19px',
  },
  destOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  countryBadge: {
    padding: '4px 10px',
    background: 'rgba(4, 7, 13, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: '#fff',
  },
  cardBody: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  destName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
    color: '#fff',
  },
  destDesc: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    marginBottom: 20,
    flex: 'none',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    marginBottom: 20,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 700,
  },
  activitiesContainer: {
    marginBottom: 24,
    flex: 1,
  },
  activitiesTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 8,
  },
  activitiesList: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  activityItem: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    display: 'flex',
    gap: 8,
  },
  bullet: {
    color: '#00f2fe',
  },
  planButton: {
    width: '100%',
    marginTop: 'auto',
  }
};
