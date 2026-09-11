import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TripPlanner } from './components/TripPlanner';
import { Explore } from './components/Explore';
import type { Trip, Destination } from './types/trip';



function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'explore'>('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load Trips from database on mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) throw new Error('Gagal mengambil data dari database.');
        const data = await response.json();
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0].id);
        }
      } catch (e) {
        console.error('Failed to load trips from database:', e);
      }
    };
    loadTrips();
  }, []);

  // Handle Trip Selection
  const handleSelectTrip = (tripId: string) => {
    setSelectedTripId(tripId);
    setActiveTab('planner');
  };

  // Handle Trip Creation
  const handleCreateTrip = async (newTripData: Omit<Trip, 'id' | 'itinerary' | 'expenses' | 'packingList'>) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTripData)
      });
      if (!response.ok) throw new Error('Gagal menyimpan trip baru ke database.');
      const savedTrip = await response.json();
      setTrips([savedTrip, ...trips]);
      setSelectedTripId(savedTrip.id);
      setActiveTab('planner');
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Handle Trip Update (Local State update after API fetch)
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  // Handle Trip Deletion
  const handleDeleteTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus trip dari database.');
      
      const updatedTrips = trips.filter(t => t.id !== tripId);
      setTrips(updatedTrips);
      if (selectedTripId === tripId) {
        setSelectedTripId(null);
        setActiveTab('dashboard');
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  // Handle Explore Preset Selection
  const handlePlanDestination = (destination: Destination) => {
    const start = new Date();
    // Start date is tomorrow
    start.setDate(start.getDate() + 1);
    
    // Parse duration number
    const durationNum = parseInt(destination.recommendedDuration) || 5;
    const end = new Date(start);
    end.setDate(start.getDate() + durationNum - 1);

    // Convert estimated cost to number
    const costClean = parseInt(destination.estimatedCost.replace(/[^0-9]/g, '')) || 5000000;

    // Open create modal with prefilled destination
    const newTripData: Omit<Trip, 'id' | 'itinerary' | 'expenses' | 'packingList'> = {
      title: `Petualangan Seru di ${destination.name}`,
      destination: `${destination.name}, ${destination.country}`,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      budget: costClean,
      description: destination.description,
      coverImage: destination.imageUrl,
      status: 'upcoming'
    };

    handleCreateTrip(newTripData);
  };

  const currentTrip = trips.find(t => t.id === selectedTripId) || null;

  return (
    <div className="app-container">
      {/* Dynamic Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasActiveTrip={selectedTripId !== null} 
      />

      {/* Main Contents Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            trips={trips}
            onSelectTrip={handleSelectTrip}
            onCreateTrip={handleCreateTrip}
            onDeleteTrip={handleDeleteTrip}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
          />
        )}

        {activeTab === 'planner' && currentTrip && (
          <TripPlanner 
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'explore' && (
          <Explore 
            onPlanDestination={handlePlanDestination}
          />
        )}
      </main>

      {/* Beautiful Glassmorphic Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span style={styles.footerText}>© 2026 TripFlow App. Dibuat dengan presisi oleh Antigravity.</span>
          <span style={styles.footerTech}>React • TypeScript • Vite • Glassmorphism CSS</span>
        </div>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(8, 12, 20, 0.9)',
    padding: '24px 0',
    marginTop: 60,
  },
  footerContent: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerText: {
    color: 'var(--text-muted)',
    fontSize: 13,
  },
  footerTech: {
    color: '#00f2fe',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
  }
};

export default App;
