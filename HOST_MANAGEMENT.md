# 🏪 Gestione Host dal Database

## 🎯 Come Funziona

Il sistema ora supporta ruoli gestiti direttamente dal database. Tutti gli utenti sono "customer" di base, ma possono essere promossi a "host" modificando il database.

## 📊 Database Schema

La tabella `profiles` contiene il campo `role`:
```sql
role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'host'))
```

## 🔧 Come Promuovere un Utente a Host

### Metodo 1: SQL Diretto
```sql
UPDATE profiles 
SET role = 'host' 
WHERE email = 'user@example.com';
```

### Metodo 2: Supabase Dashboard
1. Vai a: https://supabase.com/dashboard/project/yvggfomvwhymodadcbtq
2. Click "Table Editor"
3. Seleziona tabella `profiles`
4. Trova l'utente
5. Modifica il campo `role` da `customer` a `host`

### Metodo 3: Supabase SQL Editor
```sql
-- Promuovi utente specifico
UPDATE profiles 
SET role = 'host', updated_at = NOW()
WHERE id = 'user-uuid-here';

-- Promuovi tutti gli utenti con email specifiche
UPDATE profiles 
SET role = 'host' 
WHERE email IN ('admin@example.com', 'seller@example.com');
```

## 🎯 Cosa Vedono gli Host

Una volta promossi a host, gli utenti vedono:

### ✅ Funzionalità Extra Host
- **Badge "Host"** nel profilo
- **Statistiche prodotti** nel profilo
- **Link Dashboard Host** nel profilo
- **Link Gestisci Prodotti** nel profilo
- **Menu extra** nella navigazione

### 📄 Interfaccia Host
- Dashboard con statistiche vendite
- Gestione prodotti (aggiungi/modifica)
- Monitoraggio ordini
- Analytics vendite

## 🔐 Sicurezza

### Row Level Security (RLS)
Le policy RLS nel database garantiscono:
- Solo i **host** possono inserire/aggiornare prodotti
- Solo i **proprietari** possono vedere il proprio carrello
- Tutti possono vedere i prodotti pubblici

### Policy Esempi
```sql
-- Solo host possono inserire prodotti
CREATE POLICY "Hosts can insert products" ON products
FOR INSERT WITH CHECK (auth.jwt()->>role = 'host');

-- Tutti possono vedere prodotti attivi
CREATE POLICY "Products are viewable by everyone" ON products
FOR SELECT USING (is_active = true);
```

## 🔄 Flusso Utente

```
Registrazione → Role: customer
     ↓
Login automatico → Profilo cliente
     ↓
[Admin modifica DB] → Role: host
     ↓
Prossimo login → Profilo host con funzionalità extra
```

## 📝 Note Importanti

1. **Nessuna UI per cambio ruolo** - Solo via database
2. **Ruolo persistente** - Rimane finché modificato nel DB
3. **Automatic detection** - L'UI si adatta automaticamente al ruolo
4. **Sicurezza garantita** - RLS previene accessi non autorizzati

## 🚀 Testing

Per testare il sistema host:

1. **Crea un utente normale**
2. **Promuovilo a host** via database
3. **Fai logout/login** dell'utente
4. **Verifica** che veda le funzionalità host

---

**Il sistema è pronto per gestire host direttamente dal database! 🎉**
