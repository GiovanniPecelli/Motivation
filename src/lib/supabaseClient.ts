import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvggfomvwhymodadcbtq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z2dmb212d2h5bW9kYWRjYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE5MTMsImV4cCI6MjA4ODczNzkxM30.QqD2uwh3-25db-71VC43YbeMV3pcvmBLa_J8KOrIdo0'

export const supabase = createClient(supabaseUrl, supabaseKey)
