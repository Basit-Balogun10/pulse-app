import { internalMutation, query } from './_generated/server';
import { v } from 'convex/values';

/** List all clinics, with optional filters. */
export const list = query({
  args: {
    specialty: v.optional(v.string()),
    maxDistance: v.optional(v.number()),
    minRating: v.optional(v.number()),
  },
  async handler(ctx, { specialty, maxDistance, minRating }) {
    let clinics = await ctx.db.query('clinics').collect();

    if (specialty && specialty !== 'all') {
      clinics = clinics.filter((c) => c.specialty === specialty);
    }
    if (maxDistance !== undefined) {
      clinics = clinics.filter((c) => c.distance <= maxDistance);
    }
    if (minRating !== undefined) {
      clinics = clinics.filter((c) => c.rating >= minRating);
    }

    return clinics;
  },
});

/** One-time internal mutation to seed clinic data from mock-data.ts values. */
export const seed = internalMutation({
  args: {},
  async handler(ctx) {
    const existing = await ctx.db.query('clinics').first();
    if (existing) return; // Already seeded

    const clinicsData = [
      {
        name: 'Westside Family Health Clinic',
        specialty: 'General Practice',
        distance: 1.2,
        rating: 4.8,
        discount: '30%',
        discountCode: 'PULSE30',
        address: '123 Main St, Suite 100',
        phone: '+1 (555) 234-5678',
        hours: 'Mon-Fri 8am-6pm',
      },
      {
        name: 'Metro Women\'s Health Center',
        specialty: 'Gynecology',
        distance: 2.4,
        rating: 4.9,
        discount: '25%',
        discountCode: 'PULSE25',
        address: '456 Oak Avenue',
        phone: '+1 (555) 345-6789',
        hours: 'Mon-Sat 9am-5pm',
      },
      {
        name: 'City Endocrine & Diabetes Center',
        specialty: 'Endocrinology',
        distance: 3.1,
        rating: 4.7,
        discount: '20%',
        discountCode: 'PULSE20',
        address: '789 Park Blvd, Floor 3',
        phone: '+1 (555) 456-7890',
        hours: 'Mon-Thu 8am-5pm',
      },
      {
        name: 'Heart & Vascular Specialists',
        specialty: 'Cardiology',
        distance: 3.8,
        rating: 4.6,
        discount: '15%',
        discountCode: 'PULSE15',
        address: '321 Medical Center Dr',
        phone: '+1 (555) 567-8901',
        hours: 'Mon-Fri 8am-7pm',
      },
      {
        name: 'Clear Skin Dermatology',
        specialty: 'Dermatology',
        distance: 4.5,
        rating: 4.5,
        discount: '20%',
        discountCode: 'PULSE20',
        address: '654 Elm Street',
        phone: '+1 (555) 678-9012',
        hours: 'Tue-Sat 10am-6pm',
      },
      {
        name: 'Northside Urgent Care',
        specialty: 'Urgent Care',
        distance: 0.8,
        rating: 4.3,
        discount: '10%',
        discountCode: 'PULSE10',
        address: '987 North Ave',
        phone: '+1 (555) 789-0123',
        hours: 'Daily 7am-10pm',
      },
    ];

    for (const clinic of clinicsData) {
      await ctx.db.insert('clinics', clinic);
    }
  },
});
