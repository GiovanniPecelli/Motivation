# 🛒 Motivation Store

E-commerce completo con sistema a doppio ruolo (Customer/Host) basato su Supabase.

## 🚀 Tecnologie

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Database + Auth + Storage)
- **Styling**: TailwindCSS + Lucide Icons
- **State Management**: React Context
- **Forms**: React Hook Form + Zod Validation
- **Routing**: React Router

## 🎯 Funzionalità

### 👤 Cliente (Customer)
- Registrazione e login sicuri
- Navigazione prodotti
- Carrello della spesa real-time
- Gestione ordini
- Profilo utente

### 🏪 Host (Gestore Negozio)
- Dashboard con statistiche
- Aggiunta/modifica prodotti
- Upload immagini
- Gestione inventario
- Monitoraggio vendite
- Analytics vendite

## 🔧 Setup Rapido

### 1. Database
Esegui lo script `database-schema.sql` nel Supabase Dashboard SQL Editor.

### 2. Environment Variables
Crea un file `.env` basato su `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Avvio
```bash
npm install
npm run dev
```

## 📁 Struttura Progetto

```
src/
├── components/
│   ├── Auth/          # Form di autenticazione
│   ├── Host/          # Componenti host
│   ├── Cart/          # Gestione carrello
│   └── Header.tsx     # Navigazione principale
├── contexts/
│   ├── AuthContext.tsx    # Stato autenticazione
│   ├── RoleContext.tsx    # Gestione ruoli
│   └── CartContext.tsx    # Stato carrello
├── pages/
│   ├── AuthPage.tsx       # Login/Registrazione
│   ├── RoleSwitchPage.tsx # Scelta ruolo
│   └── ...
└── lib/
    └── supabase.ts    # Client Supabase
```

## 🔐 Sicurezza

- **Row Level Security** su tutte le tabelle
- **Environment variables** protette
- **Ruoli separati** con permessi specifici
- **Validazione input** con Zod schemas

## 🛠️ Sviluppo

### Comandi Utili
```bash
npm run dev      # Server sviluppo
npm run build    # Build produzione
npm run preview  # Preview build
npm run lint     # ESLint check
```

### Database Schema
Il database include:
- `profiles` - Estensione auth.users
- `products` - Catalogo prodotti
- `categories` - Categorie prodotti
- `cart_items` - Carrello utenti
- `orders` - Storico ordini
- `order_items` - Dettagli ordini

## 🚀 Deployment

1. **Build**: `npm run build`
2. **Environment**: Configura variabili su hosting
3. **Database**: Assicurati che RLS sia attivo
4. **Storage**: Configura bucket per immagini

## 📄 Licenza

Progetto sviluppato per Motivation Store.
