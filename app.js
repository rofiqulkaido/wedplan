import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { requireAuth } from './middleware/auth.js';
import { handleLogin, handleRegister, handleLogout } from './controllers/authController.js';
import { supabase } from './models/supabase.js';

// Controller untuk Event
import { createEvent, getEvents, deleteEvent, updateEvent, getEvent } from './controllers/eventController.js';
// Controller untuk Dana
import { createDana, getDanas, deleteDana, updateDana, getDana } from './controllers/danaController.js';
// Controller untuk Vendor
import { createVendor, getVendors, deleteVendor, updateVendor, getVendor } from './controllers/vendorController.js';
import { createVendorAdmin, getVendorsAdmin, deleteVendorAdmin, updateVendorAdmin, getVendorAdmin } from './controllers/vendorAdminController.js';
// Controller untuk RSVP
import { createRsvp, getRsvps, deleteRsvp, updateRsvp, getRsvp } from './controllers/rsvpController.js';
// Controller untuk Katalog
import { createKatalog,getKatalogs } from './controllers/katalogController.js';
import { getUndangan , createUndangan} from './controllers/undanganController.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/landing/css', express.static(path.join(__dirname, 'views/landing/css')));
app.use('/landing/js', express.static(path.join(__dirname, 'views/landing/js')));
app.use('/landing/img', express.static(path.join(__dirname, 'views/landing/img')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// Auth routes  
app.post('/login', handleLogin);
app.post('/daftar', handleRegister);
app.get('/logout', handleLogout);

// Public routes
app.get("/", (req, res) => res.render('index'));
app.get("/login", (req, res) => res.render('login', { error: null }));
app.get("/daftar", (req, res) => res.render('daftar', { error: null }));

// Protected routes
app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    res.render('dashboard', { user: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.redirect('/login');
  }
});

// Vendor Routes
app.get('/admin', requireAuth, getVendorsAdmin);
app.post('/admin/create', requireAuth, createVendorAdmin);
app.post('/admin/delete/:id', requireAuth, deleteVendorAdmin);
app.get('/admin/edit/:id', requireAuth, getVendorAdmin);
app.post('/admin/update/:id', requireAuth, updateVendorAdmin);

// Acara Routes
app.get('/acara', requireAuth, getEvents);
app.post('/acara/create', requireAuth, createEvent);
app.post('/acara/delete/:id', requireAuth, deleteEvent);
app.get('/acara/edit/:id', requireAuth, getEvent);
app.post('/acara/update/:id', requireAuth, updateEvent);

// Dana Routes
app.get('/dana', requireAuth, getDanas);
app.post('/dana/create', requireAuth, createDana);
app.post('/dana/delete/:id', requireAuth, deleteDana);
app.get('/dana/edit/:id', requireAuth, getDana);
app.post('/dana/update/:id', requireAuth, updateDana);

// Vendor Routes
app.get('/vendor', requireAuth, getVendors);
app.post('/vendor/create', requireAuth, createVendor);
app.post('/vendor/delete/:id', requireAuth, deleteVendor);
app.get('/vendor/edit/:id', requireAuth, getVendor);
app.post('/vendor/update/:id', requireAuth, updateVendor);

// RSVP Routes
app.get('/rsvp', requireAuth, getRsvps);
app.post('/rsvp/create', requireAuth, createRsvp);
app.post('/rsvp/delete/:id', requireAuth, deleteRsvp);
app.get('/rsvp/edit/:id', requireAuth, getRsvp);
app.post('/rsvp/update/:id', requireAuth, updateRsvp);

// Katalog Routes
app.get('/katalog', requireAuth, getKatalogs);
app.post('/katalog/create', requireAuth, createKatalog);


// Form Routes
app.get('/form/acara', requireAuth, async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
  res.render('form/acara', {
    user: userData,
    error: null,
    event: null,  // Entitas baru
    isEdit: false // Menandakan form ini untuk create (bukan edit)
  });
});

app.get("/form/dana", requireAuth, async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
  res.render('form/dana', {
    user: userData,
    error: null,
    dana: null,   // Entitas baru
    isEdit: false // Form untuk create dana
  });
});

app.get("/form/vendor", requireAuth, async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

  res.render('form/vendor', {
    user: userData,
    error: null,
    vendor: null, // Entitas baru
    isEdit: false // Form untuk create vendor
  });
});

app.get("/form/vendoradmin", requireAuth, async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
  res.render('form/vendoradmin', {
    user: userData,
    error: null,
    vendor: null, // Entitas baru
    isEdit: false // Form untuk create vendor
  });
});

app.get("/form/rsvp", requireAuth,async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
  res.render('form/rsvp', {
    user: userData,
    error: null,
    rsvp: null,   // Entitas baru
    isEdit: false // Form untuk create rsvp
  });
});

app.get("/form/katalog", requireAuth, async (req, res) => {
  const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
  res.render('form/katalog', {
    user: userData,
    error: null,
    katalog: null, // Entitas baru
    isEdit: false  // Form untuk create katalog
  });
});

app.post("/createKatalog",requireAuth,createKatalog)
// Route untuk membuat atau mengupdate undangan
// Rute untuk halaman undangan
app.get("/undangan", requireAuth, getUndangan);
// Menampilkan form tambah undangan
app.get('/undangan/create',requireAuth,async (req, res) => {
  const { data: userData} = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.user.id)
      .single();
  res.render('undanganform', { user: userData });
});
// Menyimpan undangan baru ke Supabase
app.post('/undangan',requireAuth,createUndangan);

app.get("/undangandigital/:uuid", async (req, res) => {
  const { uuid } = req.params; // Mendapatkan UUID dari URL

  try {
    // Mengambil data pengguna berdasarkan UUID dari parameter URL
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', uuid)  // Mencari pengguna berdasarkan UUID dari parameter URL
      .single();

    if (userError) throw userError;  // Jika ada error saat mengambil data pengguna

    // Mengambil data undangan berdasarkan user_id yang sesuai
    const { data: undangan, error: undanganError } = await supabase
      .from('catalog_invitations')
      .select('*')
      .eq('user_id', uuid)  // Mencari undangan berdasarkan UUID pengguna
      .single();  

    if (undanganError) throw undanganError;  // Jika ada error saat mengambil data undangan

    // Mengirim data ke template untuk ditampilkan
    res.render('undangan/template', {
      user: userData,
      undangan,
      error: null,
      katalog: null,  // Entitas baru
      isEdit: false  // Form untuk create katalog
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.render('undangan/template', {
      user: null,
      undangan: null,
      error: 'Terjadi kesalahan saat memuat data undangan.',
      katalog: null,
      isEdit: false
    });
  }
});






// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

