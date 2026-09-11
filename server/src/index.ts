import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function to fetch complete Trip relation object
async function getFullTrip(tripId: string) {
  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      itinerary: {
        include: {
          activities: true,
        },
        orderBy: {
          dayNumber: 'asc',
        },
      },
      expenses: {
        orderBy: {
          date: 'asc',
        },
      },
      packingList: true,
    },
  });
}

// Helper to seed Kyoto trip if DB is empty
async function checkAndSeedDB() {
  const count = await prisma.trip.count();
  if (count === 0) {
    console.log('Database empty. Seeding initial Kyoto trip...');
    await prisma.trip.create({
      data: {
        id: 'trip-mock-1',
        title: 'Menjelajahi Budaya Jepang Musim Gugur',
        destination: 'Tokyo & Kyoto, Jepang',
        startDate: '2026-10-10',
        endDate: '2026-10-15',
        budget: 20000000,
        description: 'Perjalanan impian musim gugur untuk melihat dedaunan merah (momiji), menikmati kuliner lokal autentik, dan mengunjungi kuil-kuil bersejarah.',
        coverImage: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)',
        status: 'upcoming',
        itinerary: {
          create: [
            {
              dayNumber: 1,
              date: '2026-10-10',
              activities: {
                create: [
                  {
                    id: 'act-m1',
                    time: '09:00',
                    title: 'Tiba di Bandara Haneda',
                    category: 'transport',
                    cost: 0,
                    notes: 'Proses imigrasi, klaim bagasi, dan pengambilan JR Pass'
                  },
                  {
                    id: 'act-m2',
                    time: '11:30',
                    title: 'Makan Siang Ichiran Ramen Shinjuku',
                    category: 'food',
                    cost: 150000,
                    notes: 'Ramen pedas nomor 1 di Shinjuku'
                  },
                  {
                    id: 'act-m3',
                    time: '14:00',
                    title: 'Check-in Hotel Shinjuku Granbell',
                    category: 'hotel',
                    cost: 1200000,
                    notes: 'Sewa kamar tipe Deluxe untuk beristirahat'
                  },
                  {
                    id: 'act-m4',
                    time: '16:30',
                    title: 'Jalan-jalan di Shinjuku Gyoen National Garden',
                    category: 'sightseeing',
                    cost: 50000,
                    notes: 'Menikmati keindahan awal musim gugur dan momiji'
                  }
                ]
              }
            },
            {
              dayNumber: 2,
              date: '2026-10-11',
              activities: {
                create: [
                  {
                    id: 'act-m5',
                    time: '09:00',
                    title: 'Menuju Senso-ji Temple Asakusa',
                    category: 'sightseeing',
                    cost: 0,
                    notes: 'Kuil Buddha tertua di Tokyo dengan gerbang Kaminarimon yang ikonik'
                  },
                  {
                    id: 'act-m6',
                    time: '13:00',
                    title: 'Makan Siang di Asakusa Gyukatsu',
                    category: 'food',
                    cost: 250000,
                    notes: 'Daging sapi katsu panggang sendiri di atas batu'
                  },
                  {
                    id: 'act-m7',
                    time: '15:30',
                    title: 'Berbelanja & Eksplorasi Akihabara',
                    category: 'activity',
                    cost: 500000,
                    notes: 'Membeli merchandise anime, action figure, dan souvenir elektronik'
                  }
                ]
              }
            }
          ]
        },
        expenses: {
          create: [
            {
              id: 'exp-act-act-m2',
              title: 'Itinerary: Makan Siang Ichiran Ramen Shinjuku',
              amount: 150000,
              category: 'food',
              date: '2026-10-10'
            },
            {
              id: 'exp-act-act-m3',
              title: 'Itinerary: Check-in Hotel Shinjuku Granbell',
              amount: 1200000,
              category: 'accommodation',
              date: '2026-10-10'
            },
            {
              id: 'exp-act-act-m4',
              title: 'Itinerary: Jalan-jalan di Shinjuku Gyoen National Garden',
              amount: 50000,
              category: 'activities',
              date: '2026-10-10'
            },
            {
              id: 'exp-act-act-m6',
              title: 'Itinerary: Makan Siang di Asakusa Gyukatsu',
              amount: 250000,
              category: 'food',
              date: '2026-10-11'
            },
            {
              id: 'exp-act-act-m7',
              title: 'Itinerary: Berbelanja & Eksplorasi Akihabara',
              amount: 500000,
              category: 'shopping',
              date: '2026-10-11'
            },
            {
              id: 'exp-m1',
              title: 'Tiket Pesawat Jakarta - Tokyo PP',
              amount: 8500000,
              category: 'transport',
              date: '2026-10-10'
            },
            {
              id: 'exp-m2',
              title: 'Asuransi Perjalanan Internasional',
              amount: 350000,
              category: 'other',
              date: '2026-10-10'
            }
          ]
        },
        packingList: {
          create: [
            { id: 'p1', name: 'Paspor & Visa Jepang', category: 'documents', packed: true },
            { id: 'p2', name: 'E-Ticket Pesawat & Bukti Booking Hotel', category: 'documents', packed: true },
            { id: 'p3', name: 'Uang Cash Yen & Kartu Kredit Utama', category: 'documents', packed: true },
            { id: 'p4', name: 'Jaket Tebal / Coat Musim Gugur', category: 'clothing', packed: false },
            { id: 'p5', name: 'Sepatu Jalan Kaki yang Nyaman', category: 'clothing', packed: true },
            { id: 'p6', name: 'Kamera Mirrorless + Lensa', category: 'electronics', packed: false },
            { id: 'p7', name: 'Universal Travel Adapter', category: 'electronics', packed: true },
            { id: 'p8', name: 'Powerbank 10.000mAh', category: 'electronics', packed: true },
            { id: 'p9', name: 'Obat Pribadi & Vitamin', category: 'medication', packed: false },
            { id: 'p10', name: 'Sikat Gigi & Skincare Travel Size', category: 'toiletries', packed: false }
          ]
        }
      }
    });
  }
}

// 1. GET ALL TRIPS
app.get('/api/trips', async (req, res) => {
  try {
    await checkAndSeedDB();
    const trips = await prisma.trip.findMany({
      include: {
        itinerary: {
          include: {
            activities: true,
          },
          orderBy: {
            dayNumber: 'asc',
          },
        },
        expenses: {
          orderBy: {
            date: 'asc',
          },
        },
        packingList: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(trips);
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Gagal mengambil data trip: ' + error.message });
  }
});

// 2. CREATE NEW TRIP (Creates trip, empty itinerary days, and default packing items)
app.post('/api/trips', async (req, res) => {
  const { title, destination, startDate, endDate, budget, description, coverImage, status } = req.body;
  
  if (!title || !destination || !startDate || !endDate || !budget) {
    res.status(400).json({ error: 'Harap isi semua kolom input yang wajib.' });
    return;
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Generate Itinerary Days Data
    const itineraryData = [];
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      itineraryData.push({
        dayNumber: i + 1,
        date: currentDate.toISOString().split('T')[0],
      });
    }

    // Default basic packing items
    const defaultPackingList = [
      { name: 'Paspor / KTP', category: 'documents', packed: false },
      { name: 'Tiket & Booking', category: 'documents', packed: false },
      { name: 'Uang Tunai / Kartu Kredit', category: 'documents', packed: false },
      { name: 'Pakaian Secukupnya', category: 'clothing', packed: false },
      { name: 'Peralatan Mandi', category: 'toiletries', packed: false },
      { name: 'Charger HP & Kabel', category: 'electronics', packed: false }
    ];

    const newTrip = await prisma.trip.create({
      data: {
        title,
        destination,
        startDate,
        endDate,
        budget: parseFloat(budget),
        description,
        coverImage,
        status: status || 'upcoming',
        itinerary: {
          create: itineraryData,
        },
        packingList: {
          create: defaultPackingList,
        },
      },
    });

    const fullTrip = await getFullTrip(newTrip.id);
    res.status(201).json(fullTrip);
  } catch (error: any) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Gagal membuat trip baru: ' + error.message });
  }
});

// 3. UPDATE TRIP BASIC INFO (e.g. status, budget, details)
app.put('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { title, destination, startDate, endDate, budget, description, coverImage, status } = req.body;

  try {
    await prisma.trip.update({
      where: { id },
      data: {
        title,
        destination,
        startDate,
        endDate,
        budget: budget ? parseFloat(budget) : undefined,
        description,
        coverImage,
        status,
      },
    });

    const fullTrip = await getFullTrip(id);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Gagal mengubah trip: ' + error.message });
  }
});

// 4. DELETE TRIP
app.delete('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.trip.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Trip berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Gagal menghapus trip: ' + error.message });
  }
});

// 5. ADD ACTIVITY TO TRIP ITINERARY
app.post('/api/trips/:id/activities', async (req, res) => {
  const { id: tripId } = req.params;
  const { dayNumber, time, title, category, cost, notes } = req.body;

  if (!dayNumber || !time || !title || !category) {
    res.status(400).json({ error: 'Harap isi dayNumber, time, title, dan category.' });
    return;
  }

  try {
    // Find ItineraryDay entry for this trip
    let day = await prisma.itineraryDay.findFirst({
      where: { tripId, dayNumber: parseInt(dayNumber) },
    });

    // Fallback if Day doesn't exist (safety check)
    if (!day) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      const startDate = trip ? new Date(trip.startDate) : new Date();
      startDate.setDate(startDate.getDate() + parseInt(dayNumber) - 1);
      
      day = await prisma.itineraryDay.create({
        data: {
          tripId,
          dayNumber: parseInt(dayNumber),
          date: startDate.toISOString().split('T')[0],
        },
      });
    }

    const activityCost = cost ? parseFloat(cost) : 0;
    
    // Create activity inside a transaction to maintain linked expense
    const result = await prisma.$transaction(async (tx) => {
      const activity = await tx.activity.create({
        data: {
          itineraryDayId: day.id,
          time,
          title,
          category,
          cost: activityCost,
          notes,
        },
      });

      // If cost > 0, auto add to Expense as well
      if (activityCost > 0) {
        let expenseCategory = 'other';
        if (category === 'food') expenseCategory = 'food';
        else if (category === 'transport') expenseCategory = 'transport';
        else if (category === 'hotel') expenseCategory = 'accommodation';
        else if (category === 'sightseeing' || category === 'activity') expenseCategory = 'activities';

        await tx.expense.create({
          data: {
            id: `exp-act-${activity.id}`,
            tripId,
            title: `Itinerary: ${title}`,
            amount: activityCost,
            category: expenseCategory,
            date: day.date,
          },
        });
      }

      return activity;
    });

    const fullTrip = await getFullTrip(tripId);
    res.status(201).json(fullTrip);
  } catch (error: any) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Gagal menambah aktivitas: ' + error.message });
  }
});

// 6. DELETE ACTIVITY FROM TRIP ITINERARY
app.delete('/api/activities/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Need to find tripId first to return updated trip
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        itineraryDay: true,
      },
    });

    if (!activity) {
      res.status(404).json({ error: 'Aktivitas tidak ditemukan.' });
      return;
    }

    const tripId = activity.itineraryDay.tripId;

    await prisma.$transaction(async (tx) => {
      // Delete the activity
      await tx.activity.delete({ where: { id } });
      
      // Also delete the automatic linked expense if exists
      await tx.expense.deleteMany({
        where: { id: `exp-act-${id}` },
      });
    });

    const fullTrip = await getFullTrip(tripId);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Gagal menghapus aktivitas: ' + error.message });
  }
});

// 7. ADD EXPENSE TO TRIP
app.post('/api/trips/:id/expenses', async (req, res) => {
  const { id: tripId } = req.params;
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    res.status(400).json({ error: 'Harap isi title, amount, category, dan date.' });
    return;
  }

  try {
    await prisma.expense.create({
      data: {
        tripId,
        title,
        amount: parseFloat(amount),
        category,
        date,
      },
    });

    const fullTrip = await getFullTrip(tripId);
    res.status(201).json(fullTrip);
  } catch (error: any) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Gagal mencatat pengeluaran: ' + error.message });
  }
});

// 8. DELETE EXPENSE FROM TRIP
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      res.status(404).json({ error: 'Pengeluaran tidak ditemukan.' });
      return;
    }

    const tripId = expense.tripId;

    await prisma.$transaction(async (tx) => {
      // Delete the expense
      await tx.expense.delete({ where: { id } });

      // If this was an automatic activity expense, reset the activity cost to 0
      if (id.startsWith('exp-act-')) {
        const activityId = id.replace('exp-act-', '');
        const exists = await tx.activity.findUnique({ where: { id: activityId } });
        if (exists) {
          await tx.activity.update({
            where: { id: activityId },
            data: { cost: 0 },
          });
        }
      }
    });

    const fullTrip = await getFullTrip(tripId);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Gagal menghapus pengeluaran: ' + error.message });
  }
});

// 9. ADD PACKING ITEM TO TRIP
app.post('/api/trips/:id/packing', async (req, res) => {
  const { id: tripId } = req.params;
  const { name, category } = req.body;

  if (!name || !category) {
    res.status(400).json({ error: 'Harap isi name dan category.' });
    return;
  }

  try {
    await prisma.packingItem.create({
      data: {
        tripId,
        name,
        category,
        packed: false,
      },
    });

    const fullTrip = await getFullTrip(tripId);
    res.status(201).json(fullTrip);
  } catch (error: any) {
    console.error('Error adding packing item:', error);
    res.status(500).json({ error: 'Gagal menambahkan barang: ' + error.message });
  }
});

// 10. TOGGLE PACKING ITEM STATE
app.put('/api/packing/:id/toggle', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.packingItem.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ error: 'Barang tidak ditemukan.' });
      return;
    }

    await prisma.packingItem.update({
      where: { id },
      data: {
        packed: !item.packed,
      },
    });

    const fullTrip = await getFullTrip(item.tripId);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error toggling packing item:', error);
    res.status(500).json({ error: 'Gagal mengubah status barang: ' + error.message });
  }
});

// 11. DELETE PACKING ITEM
app.delete('/api/packing/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.packingItem.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ error: 'Barang tidak ditemukan.' });
      return;
    }

    await prisma.packingItem.delete({ where: { id } });

    const fullTrip = await getFullTrip(item.tripId);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error deleting packing item:', error);
    res.status(500).json({ error: 'Gagal menghapus barang: ' + error.message });
  }
});

// 12. RESET ALL PACKING ITEMS OF A TRIP TO UNPACKED
app.put('/api/trips/:id/packing/reset', async (req, res) => {
  const { id: tripId } = req.params;

  try {
    await prisma.packingItem.updateMany({
      where: { tripId },
      data: {
        packed: false,
      },
    });

    const fullTrip = await getFullTrip(tripId);
    res.json(fullTrip);
  } catch (error: any) {
    console.error('Error resetting packing items:', error);
    res.status(500).json({ error: 'Gagal mengatur ulang barang: ' + error.message });
  }
});

// Serve React static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
