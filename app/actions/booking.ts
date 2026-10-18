'use server';

import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { studioConfig } from '@/lib/config/studio';

const activeServiceSlugs = studioConfig.services
  .filter((s) => s.active)
  .map((s) => s.title);

const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Please provide your full name (at least 2 characters).' })
    .max(100, { message: 'Name must not exceed 100 characters.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address.' })
    .max(150, { message: 'Email must not exceed 150 characters.' }),
  phone: z
    .string()
    .trim()
    .max(30, { message: 'Phone number is too long.' })
    .optional()
    .or(z.literal('')),
  serviceType: z
    .string()
    .min(1, { message: 'Please select a photography service.' })
    .refine((val) => activeServiceSlugs.includes(val) || val === 'Other', {
      message: 'Please choose an available photography service.',
    }),
  preferredDate: z
    .string()
    .trim()
    .max(50, { message: 'Date entry is too long.' })
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .trim()
    .max(150, { message: 'Location must not exceed 150 characters.' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Please share a brief message about your vision (at least 10 characters).' })
    .max(3000, { message: 'Message must not exceed 3,000 characters.' }),
  // Honeypot field for spam prevention
  _hp: z.string().max(0).optional().or(z.literal('')),
});

export type BookingFormState = {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitBookingEnquiry(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone') || '',
    serviceType: formData.get('serviceType'),
    preferredDate: formData.get('preferredDate') || '',
    location: formData.get('location') || '',
    message: formData.get('message'),
    _hp: formData.get('_hp') || '',
  };

  // 1. Validate with Zod
  const validationResult = bookingSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: 'Please review and correct the highlighted fields.',
      fieldErrors,
    };
  }

  const { fullName, email, phone, serviceType, preferredDate, location, message, _hp } =
    validationResult.data;

  // 2. Honeypot bot protection
  if (_hp && _hp.length > 0) {
    // Silently return success to mislead malicious scrapers/bots
    return {
      success: true,
      message: 'Thank you. We have received your enquiry and will be in touch shortly.',
    };
  }

  // 3. Persist to Supabase booking_enquiries table
  try {
    const supabase = createServerSupabaseClient();

    const payload = {
      full_name: fullName,
      email: email.toLowerCase(),
      phone: phone || null,
      service_type: serviceType,
      preferred_date: preferredDate || null,
      location: location || null,
      message,
      status: 'new',
    };

    const { error } = await supabase.from('booking_enquiries').insert([payload]);

    if (error) {
      console.warn(`[TS Photography Booking] Supabase insert note: ${error.message}`);
      // Fallback: If table has not been created yet in local test, return helpful message
      if (error.code === '42P01' || error.message.includes('relation "booking_enquiries" does not exist')) {
        return {
          success: false,
          message:
            'The studio database table `booking_enquiries` is awaiting configuration. Please ensure the SQL migration has been applied.',
        };
      }
      return {
        success: false,
        message: 'We were unable to save your enquiry at this moment. Please try again shortly.',
      };
    }

    return {
      success: true,
      message:
        'Thank you. We have received your enquiry and will be in touch shortly to discuss your session.',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Database error';
    console.error(`[TS Photography Booking] Unexpected submission failure: ${errorMessage}`);
    return {
      success: false,
      message: 'A temporary connection issue occurred. Please retry in a moment.',
    };
  }
}
