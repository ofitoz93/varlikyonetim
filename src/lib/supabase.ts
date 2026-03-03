import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hscnjpthedxqlryzurce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzY25qcHRoZWR4cWxyeXp1cmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzQ4NTUsImV4cCI6MjA4ODAxMDg1NX0.XgImgWKibPDolQRjUx-k8uGDcD8rFBTrOlrh1wxrHtE';

export const supabase = createClient(supabaseUrl, supabaseKey);
