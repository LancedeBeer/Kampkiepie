// adminbackend.js — KampKiepie Admin Backend (Supabase edition)
// Loaded by adminbackend.html and adminsetup.html

// ── Supabase client ───────────────────────────────────────────────────────────
const SUPABASE_URL      = 'https://vgqxaubluvqjbvzgsvze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncXhhdWJsdXZxamJ2emdzdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDI5MzEsImV4cCI6MjEwNDk3ODkzMX0.YSrWrmIREgwYXdW2l6OVbegsymxNC8yHO6uMePFTSoo';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── GAS backend URL (still used for emails and user management) ───────────────
let GAS_URL = '';
async function loadConfig() {
  try {
    const res = await fetch('../config.txt', { cache: 'no-store' });
    if (!res.ok) return;
    const text = await res.text();
    text.split(/\r?\n/).forEach(line => {
      const t = line.trim(); if (!t || t.startsWith('#')) return;
      const ix = t.indexOf(':'); if (ix < 0) return;
      const k = t.slice(0, ix).trim(), v = t.slice(ix + 1).trim();
      if (k === 'adminbackend_script') GAS_URL = v;
    });
  } catch(_) {}
}

// ── Column mapping: Supabase snake_case → PascalCase (for APP.state arrays) ──
const sbToStand     = function(r){
  const out={};
  if(r.stand_id!==undefined)out.StandID=r.stand_id;
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.stand_number!==undefined)out.StandNumber=r.stand_number;
  if(r.stand_name!==undefined)out.StandName=r.stand_name;
  if(r.stand_type_id!==undefined)out.StandTypeID=r.stand_type_id;
  if(r.display_name!==undefined)out.DisplayName=r.display_name;
  if(r.description!==undefined)out.Description=r.description;
  if(r.active!==undefined)out.Active=r.active;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.base_rate!==undefined)out.BaseRate=r.base_rate;
  if(r.peak_rate!==undefined)out.PeakRate=r.peak_rate;
  if(r.off_peak_rate!==undefined)out.OffPeakRate=r.off_peak_rate;
  if(r.weekend_rate!==undefined)out.WeekendRate=r.weekend_rate;
  if(r.shoulder_rate!==undefined)out.ShoulderRate=r.shoulder_rate;
  if(r.currency!==undefined)out.Currency=r.currency;
  if(r.max_adults!==undefined)out.MaxAdults=r.max_adults;
  if(r.max_children!==undefined)out.MaxChildren=r.max_children;
  if(r.max_toddlers!==undefined)out.MaxToddlers=r.max_toddlers;
  if(r.max_guests!==undefined)out.MaxGuests=r.max_guests;
  if(r.max_vehicles!==undefined)out.MaxVehicles=r.max_vehicles;
  if(r.deposit_mode!==undefined)out.DepositMode=r.deposit_mode;
  if(r.deposit_value!==undefined)out.DepositValue=r.deposit_value;
  if(r.amenities_json!==undefined)out.AmenitiesJSON=r.amenities_json;
  if(r.features_json!==undefined)out.FeaturesJSON=r.features_json;
  if(r.extras_json!==undefined)out.ExtrasJSON=r.extras_json;
  if(r.pricing_json!==undefined)out.PricingJSON=r.pricing_json;
  if(r.occupancy_json!==undefined)out.OccupancyJSON=r.occupancy_json;
  if(r.stand_image_url!==undefined)out.StandImageURL=r.stand_image_url;
  if(r.stand_visibility!==undefined)out.StandVisibility=r.stand_visibility;
  if(r.created_at!==undefined)out.CreatedAt=r.created_at;
  if(r.updated_at!==undefined)out.UpdatedAt=r.updated_at;
  return out;
};
const sbToBooking   = function(r){
  const out={};
  if(r.booking_id!==undefined)out.BookingID=r.booking_id;
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.stand_id!==undefined)out.StandID=r.stand_id;
  if(r.stand_type_id!==undefined)out.StandTypeID=r.stand_type_id;
  if(r.booking_ref!==undefined)out.BookingRef=r.booking_ref;
  if(r.guest_first_name!==undefined)out.GuestFirstName=r.guest_first_name;
  if(r.guest_last_name!==undefined)out.GuestLastName=r.guest_last_name;
  if(r.guest_full_name!==undefined)out.GuestFullName=r.guest_full_name;
  if(r.guest_email!==undefined)out.GuestEmail=r.guest_email;
  if(r.guest_phone!==undefined)out.GuestPhone=r.guest_phone;
  if(r.adults!==undefined)out.Adults=r.adults;
  if(r.children!==undefined)out.Children=r.children;
  if(r.toddlers!==undefined)out.Toddlers=r.toddlers;
  if(r.check_in_date!==undefined)out.CheckInDate=r.check_in_date;
  if(r.check_out_date!==undefined)out.CheckOutDate=r.check_out_date;
  if(r.nights!==undefined)out.Nights=r.nights;
  if(r.status!==undefined)out.Status=r.status;
  if(r.source!==undefined)out.Source=r.source;
  if(r.booking_channel!==undefined)out.BookingChannel=r.booking_channel;
  if(r.guest_notes!==undefined)out.GuestNotes=r.guest_notes;
  if(r.internal_notes!==undefined)out.InternalNotes=r.internal_notes;
  if(r.total_snapshot!==undefined)out.TotalSnapshot=r.total_snapshot;
  if(r.deposit_required_snapshot!==undefined)out.DepositRequiredSnapshot=r.deposit_required_snapshot;
  if(r.deposit_paid_snapshot!==undefined)out.DepositPaidSnapshot=r.deposit_paid_snapshot;
  if(r.balance_snapshot!==undefined)out.BalanceSnapshot=r.balance_snapshot;
  if(r.currency!==undefined)out.Currency=r.currency;
  if(r.pricing_snapshot_json!==undefined)out.PricingSnapshotJSON=r.pricing_snapshot_json;
  if(r.extras_snapshot_json!==undefined)out.ExtrasSnapshotJSON=r.extras_snapshot_json;
  if(r.tax_snapshot_json!==undefined)out.TaxSnapshotJSON=r.tax_snapshot_json;
  if(r.fee_snapshot_json!==undefined)out.FeeSnapshotJSON=r.fee_snapshot_json;
  if(r.discount_snapshot_json!==undefined)out.DiscountSnapshotJSON=r.discount_snapshot_json;
  if(r.comms_snapshot!==undefined)out.CommsSnapshot=r.comms_snapshot;
  if(r.kkbook_level!==undefined)out.kkbookLevel=r.kkbook_level;
  if(r.hold_expires_at!==undefined)out.HoldExpiresAt=r.hold_expires_at;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.created_at!==undefined)out.CreatedAt=r.created_at;
  if(r.updated_at!==undefined)out.UpdatedAt=r.updated_at;
  return out;
};
const sbToBlock     = function(r){
  const out={};
  if(r.block_id!==undefined)out.BlockID=r.block_id;
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.stand_id!==undefined)out.StandID=r.stand_id;
  if(r.block_type!==undefined)out.BlockType=r.block_type;
  if(r.start_date!==undefined)out.StartDate=r.start_date;
  if(r.end_date!==undefined)out.EndDate=r.end_date;
  if(r.reason!==undefined)out.Reason=r.reason;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.created_at!==undefined)out.CreatedAt=r.created_at;
  if(r.updated_at!==undefined)out.UpdatedAt=r.updated_at;
  return out;
};
const sbToStandType = function(r){
  const out={};
  if(r.stand_type_id!==undefined)out.StandTypeID=r.stand_type_id;
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.stand_type_name!==undefined)out.StandTypeName=r.stand_type_name;
  if(r.pricing_mode!==undefined)out.PricingMode=r.pricing_mode;
  if(r.pricing_json!==undefined)out.PricingJSON=r.pricing_json;
  if(r.default_deposit_mode!==undefined)out.DefaultDepositMode=r.default_deposit_mode;
  if(r.default_deposit_value!==undefined)out.DefaultDepositValue=r.default_deposit_value;
  if(r.default_min_nights!==undefined)out.DefaultMinNights=r.default_min_nights;
  if(r.default_max_nights!==undefined)out.DefaultMaxNights=r.default_max_nights;
  if(r.default_lead_time_days!==undefined)out.DefaultLeadTimeDays=r.default_lead_time_days;
  if(r.default_hold_minutes!==undefined)out.DefaultHoldMinutes=r.default_hold_minutes;
  if(r.default_base_rate!==undefined)out.DefaultBaseRate=r.default_base_rate;
  if(r.default_peak_rate!==undefined)out.DefaultPeakRate=r.default_peak_rate;
  if(r.default_off_peak_rate!==undefined)out.DefaultOffPeakRate=r.default_off_peak_rate;
  if(r.default_weekend_rate!==undefined)out.DefaultWeekendRate=r.default_weekend_rate;
  if(r.default_shoulder_rate!==undefined)out.DefaultShoulderRate=r.default_shoulder_rate;
  if(r.default_amenities_json!==undefined)out.DefaultAmenitiesJSON=r.default_amenities_json;
  if(r.default_features_json!==undefined)out.DefaultFeaturesJSON=r.default_features_json;
  if(r.default_extras_json!==undefined)out.DefaultExtrasJSON=r.default_extras_json;
  if(r.default_occupancy_json!==undefined)out.DefaultOccupancyJSON=r.default_occupancy_json;
  if(r.active!==undefined)out.Active=r.active;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.created_at!==undefined)out.CreatedAt=r.created_at;
  if(r.updated_at!==undefined)out.UpdatedAt=r.updated_at;
  return out;
};
const sbToDefaults  = function(r){
  const out={};
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.default_currency!==undefined)out.DefaultCurrency=r.default_currency;
  if(r.default_check_in_time!==undefined)out.DefaultCheckInTime=r.default_check_in_time;
  if(r.default_check_out_time!==undefined)out.DefaultCheckOutTime=r.default_check_out_time;
  if(r.default_hold_minutes!==undefined)out.DefaultHoldMinutes=r.default_hold_minutes;
  if(r.default_min_nights!==undefined)out.DefaultMinNights=r.default_min_nights;
  if(r.default_max_nights!==undefined)out.DefaultMaxNights=r.default_max_nights;
  if(r.default_deposit_mode!==undefined)out.DefaultDepositMode=r.default_deposit_mode;
  if(r.default_deposit_value!==undefined)out.DefaultDepositValue=r.default_deposit_value;
  if(r.age_toddler_max!==undefined)out.AgeToddlerMax=r.age_toddler_max;
  if(r.age_child_max!==undefined)out.AgeChildMax=r.age_child_max;
  if(r.pre_holiday_treatment!==undefined)out.PreHolidayTreatment=r.pre_holiday_treatment;
  if(r.season_rules_json!==undefined)out.SeasonRulesJSON=r.season_rules_json;
  if(r.public_holidays_list!==undefined)out.PublicHolidaysList=r.public_holidays_list;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.active!==undefined)out.Active=r.active;
  return out;
};
const sbToPayment   = function(r){
  const out={};
  if(r.payment_id!==undefined)out.PaymentID=r.payment_id;
  if(r.booking_id!==undefined)out.BookingID=r.booking_id;
  if(r.resort_id!==undefined)out.ResortID=r.resort_id;
  if(r.payment_type!==undefined)out.PaymentType=r.payment_type;
  if(r.payment_status!==undefined)out.PaymentStatus=r.payment_status;
  if(r.payment_method!==undefined)out.PaymentMethod=r.payment_method;
  if(r.amount!==undefined)out.Amount=r.amount;
  if(r.currency!==undefined)out.Currency=r.currency;
  if(r.reference!==undefined)out.Reference=r.reference;
  if(r.paid_at!==undefined)out.PaidAt=r.paid_at;
  if(r.captured_at!==undefined)out.CapturedAt=r.captured_at;
  if(r.received_by!==undefined)out.ReceivedBy=r.received_by;
  if(r.notes!==undefined)out.Notes=r.notes;
  if(r.soft_deleted!==undefined)out.SoftDeleted=r.soft_deleted;
  if(r.created_at!==undefined)out.CreatedAt=r.created_at;
  if(r.updated_at!==undefined)out.UpdatedAt=r.updated_at;
  return out;
};
const sbToTier      = function(r){
  const out={};
  if(r.tier_id!==undefined)out.TierID=r.tier_id;
  if(r.tier_name!==undefined)out.TierName=r.tier_name;
  if(r.commission_rate!==undefined)out.CommissionRate=r.commission_rate;
  if(r.admin_rate!==undefined)out.AdminRate=r.admin_rate;
  if(r.promo_rate!==undefined)out.PromoRate=r.promo_rate;
  if(r.description!==undefined)out.Description=r.description;
  if(r.active!==undefined)out.Active=r.active;
  return out;
};

// PascalCase → snake_case for upsert (invert the maps)
function pascalToSnake(obj, mapping) {
  const inv = Object.fromEntries(Object.entries(mapping).map(([k,v])=>[v,k]));
  const out = {};
  Object.entries(obj).forEach(([k,v]) => { if (inv[k]) out[inv[k]] = v; });
  return out;
}

// ── GAS API call (emails and user management only) ────────────────────────────
async function gasCall(action, params={}, method='GET') {
  if (!GAS_URL) throw new Error('GAS URL not configured');
  const payload = Object.assign({ action, resortId: APP.resortId }, params);
  if (method === 'GET') {
    const url = new URL(GAS_URL);
    Object.entries(payload).forEach(([k,v]) => url.searchParams.set(k, typeof v==='object'?JSON.stringify(v):String(v)));
    url.searchParams.set('_ts', Date.now());
    const res = await fetch(url.toString(), { method:'GET', redirect:'follow', cache:'no-store' });
    return JSON.parse(await res.text());
  }
  const form = new URLSearchParams();
  Object.entries(payload).forEach(([k,v]) => form.set(k, typeof v==='object'?JSON.stringify(v):String(v)));
  const res = await fetch(GAS_URL, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}, body: form.toString() });
  return JSON.parse(await res.text());
}

// ── Session ───────────────────────────────────────────────────────────────────
function setApiState(text, ok) {
  const el = document.getElementById('apiStatePill'); if (!el) return;
  el.textContent = text;
  if (ok === true)  { el.style.background='var(--ok-l)';  el.style.color='var(--ok)';   }
  else if(ok===false){el.style.background='var(--bad-l)'; el.style.color='var(--bad)';  }
  else              { el.style.background='var(--bg)';    el.style.color='var(--muted)';}
}
let sessionRedirectTriggered = false;
function logout() {
  if (!confirm('Log out and return to the Admin Portal?')) return;
  sb.auth.signOut().then(() => { window.location.href = '../admin/admin.html'; });
}
function clearSessionAndReturnToPortal(message) {
  sessionRedirectTriggered = true;
  sb.auth.signOut().then(() => {
    showAuthRequired(message || 'Your session has ended.');
    setTimeout(() => { window.location.href = '../admin/admin.html'; }, 2000);
  });
}

// ── Connect gate UI ───────────────────────────────────────────────────────────
function showConnectMessage(msg) {
  const gate = document.getElementById('connectGate');
  const msgEl = document.getElementById('connectGateMsg');
  gate?.classList.remove('hidden');
  if (msgEl) { msgEl.textContent = msg; msgEl.className = 'notice info'; }
  document.getElementById('connectGateRetry')?.classList.add('hidden');
  document.getElementById('connectGateReturnBtn')?.classList.add('hidden');
  setConnectProgress('Loading\u2026');
}
function showConnectRetry(msg) {
  const gate = document.getElementById('connectGate');
  const msgEl = document.getElementById('connectGateMsg');
  gate?.classList.remove('hidden');
  if (msgEl) { msgEl.textContent = msg; msgEl.className = 'notice bad'; }
  document.getElementById('connectGateRetry')?.classList.add('hidden');
  document.getElementById('connectGateReturnBtn')?.classList.remove('hidden');
  setConnectProgress('Could not connect.');
}
function showAuthRequired(msg) {
  const gate = document.getElementById('connectGate');
  const msgEl = document.getElementById('connectGateMsg');
  gate?.classList.remove('hidden');
  document.getElementById('wrapMain')?.classList.add('hidden');
  if (msgEl) { msgEl.textContent = msg; msgEl.className = 'notice warn'; }
  document.getElementById('connectGateRetry')?.classList.add('hidden');
  document.getElementById('connectGateReturnBtn')?.classList.remove('hidden');
  setConnectProgress('Please sign in again.');
}
function hideConnectGate() {
  document.getElementById('connectGate')?.classList.add('hidden');
  document.getElementById('wrapMain')?.classList.remove('hidden');
}
function setConnectProgress(msg) {
  const el = document.getElementById('connectGateProgress'); if (el) el.textContent = msg;
}

// ── No-op stubs for removed GAS session management ───────────────────────────
function startSessionWatcher()  {}
function stopSessionWatcher()   {}
function clickExtendSession()   {}
function clickRefreshSession()  { window.location.href = '../admin/admin.html'; }
function connectApi()           {}
function getSession()           { return ''; }   // kept so old call sites don't crash
function setSession()           {}

// ── Live polling ──────────────────────────────────────────────────────────────
let livePollTimer = null, lastLiveUpdate = null;
const LIVE_POLL_INTERVAL_MS = 10 * 60 * 1000;
function startLivePolling() {
  if (livePollTimer) clearInterval(livePollTimer);
  livePollTimer = setInterval(livePoll, LIVE_POLL_INTERVAL_MS);
}
function stopLivePolling() { if (livePollTimer) clearInterval(livePollTimer); livePollTimer = null; }

// ── Identity ──────────────────────────────────────────────────────────────────
function applySessionIdentity() {
  const pill = document.getElementById('rolePill');
  if (pill) {
    const label = APP.role === 'superadmin' ? 'KampKiepie Super Admin' : (APP.resortRole || APP.role);
    pill.textContent = label; pill.title = APP.userEmail;
  }
  applyRoleToNav();
  showResetButtonIfSuperAdmin();
}

// ── Data loading (Supabase) ───────────────────────────────────────────────────
async function initLiveData() {
  setConnectProgress('Loading data\u2026');
  const resortId = APP.resortId;

  const [resortR, standsR, bookingsR, blocksR, standTypesR, defaultsR, paymentsR] =
    await Promise.allSettled([
      sb.from('resorts').select('resort_name, total_views, level').eq('resort_id', resortId).maybeSingle(),
      sb.from('stands').select('*').eq('resort_id', resortId),
      sb.from('bookings').select('*').eq('resort_id', resortId),
      sb.from('calendar_blocks').select('*').eq('resort_id', resortId),
      sb.from('stand_types').select('*').eq('resort_id', resortId),
      sb.from('resort_defaults').select('*').eq('resort_id', resortId).maybeSingle(),
      sb.from('booking_payments').select('*').eq('resort_id', resortId),
    ]);

  function fromSb(settled, mapFn, fallback) {
    if (settled.status === 'fulfilled' && !settled.value.error) {
      const d = settled.value.data;
      if (!d) return fallback;
      return Array.isArray(d) ? d.map(mapFn) : mapFn(d);
    }
    console.warn('Supabase load error:', settled.reason || settled.value?.error);
    return fallback;
  }

  // Resort info
  if (resortR.status === 'fulfilled' && resortR.value.data) {
    const r = resortR.value.data;
    APP.resortName       = r.resort_name || ('Resort ' + resortId);
    APP.resortTotalViews = Number(r.total_views) || 0;
    APP.kkbookLevel      = String(r.level || '').trim().toUpperCase();
    const lbl = document.getElementById('resortIdLabel');
    if (lbl) lbl.textContent = resortId;
  }

  APP.state.stands       = fromSb(standsR,     sbToStand,     APP.state.stands     || []).filter(s => !s.SoftDeleted);
  APP.state.bookings     = fromSb(bookingsR,    sbToBooking,   APP.state.bookings   || []).filter(b => !b.SoftDeleted);
  APP.state.blocks       = fromSb(blocksR,      sbToBlock,     APP.state.blocks     || []).filter(b => !b.SoftDeleted);
  APP.state.standTypes   = fromSb(standTypesR,  sbToStandType, APP.state.standTypes || []).filter(t => !t.SoftDeleted);
  APP.state.payments     = fromSb(paymentsR,    sbToPayment,   APP.state.payments   || []).filter(p => !p.SoftDeleted);

  const defRaw = defaultsR.status === 'fulfilled' && !defaultsR.value.error && defaultsR.value.data
    ? sbToDefaults(defaultsR.value.data) : APP.state.resortDefaults || {};
  APP.state.resortDefaults = defRaw;

  // Load tiers and public holidays in background
  sb.from('tiers').select('*').then(({ data }) => {
    if (data) { APP.state.tiers = data.map(sbToTier); TIERS_DATA = APP.state.tiers; }
  }).catch(() => {});

  sb.from('sa_public_holidays')
    .select('holiday_date, name')
    .order('holiday_date')
    .then(({ data }) => {
      if (data) {
        const holidays = data.map(h => ({ date: h.holiday_date, name: h.name }));
        if (!APP.state.resortDefaults) APP.state.resortDefaults = {};
        APP.state.resortDefaults.PublicHolidaysList = holidays;
        // Re-render now that holidays are available — this populates the dashgrid tiles
        buildBulk();
        renderStats();
        renderActive();
        renderInspector(null);
        if (typeof renderStandsMatrix === 'function') try { renderStandsMatrix(); } catch(_) {}
        if (typeof renderInspector === 'function' && APP.activeView === 'settings') try { renderInspector(null); } catch(_) {}
      }
    }).catch(() => {});

  buildBulk();
  setApiState('Connected', true);
  renderStats(); renderActive(); renderInspector(null);
}

// ── Write operations (Supabase) ───────────────────────────────────────────────
async function sbUpsertStand(body) {
  const row = pascalToSnake(body, Object.fromEntries(Object.entries(sbToStand({})).map((_,i,a)=>a[i])));
  // Build row directly from body using known mapping
  const r = {
    stand_id: body.StandID || uid('STAND'),
    resort_id: body.ResortID || APP.resortId,
    stand_number: body.StandNumber || '',
    stand_name: body.StandName || '',
    stand_type_id: body.StandTypeID || '',
    display_name: body.DisplayName || '',
    description: body.Description || '',
    active: body.Active === true || body.Active === 'true',
    soft_deleted: false,
    base_rate: body.BaseRate || null,
    peak_rate: body.PeakRate || null,
    off_peak_rate: body.OffPeakRate || null,
    weekend_rate: body.WeekendRate || null,
    shoulder_rate: body.ShoulderRate || null,
    currency: body.Currency || 'ZAR',
    max_adults: body.MaxAdults || null,
    max_children: body.MaxChildren || null,
    max_toddlers: body.MaxToddlers || null,
    max_guests: body.MaxGuests || null,
    max_vehicles: body.MaxVehicles || null,
    deposit_mode: body.DepositMode || null,
    deposit_value: body.DepositValue || null,
    amenities_json: body.AmenitiesJSON || '[]',
    features_json: body.FeaturesJSON || '[]',
    extras_json: body.ExtrasJSON || '[]',
    stand_image_url: body.StandImageURL || null,
    stand_visibility: body.StandVisibility === false || body.StandVisibility === 'false' ? false : true,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('stands').upsert(r, { onConflict: 'stand_id' });
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbUpsertBooking(body) {
  const r = {
    booking_id: body.BookingID || uid('BK'),
    resort_id: body.ResortID || APP.resortId,
    stand_id: body.StandID,
    stand_type_id: body.StandTypeID || null,
    booking_ref: body.BookingRef,
    guest_first_name: body.GuestFirstName || '',
    guest_last_name: body.GuestLastName || '',
    guest_full_name: body.GuestFullName || '',
    guest_email: body.GuestEmail || '',
    guest_phone: body.GuestPhone || '',
    adults: Number(body.Adults) || 1,
    children: Number(body.Children) || 0,
    toddlers: Number(body.Toddlers) || 0,
    check_in_date: body.CheckInDate,
    check_out_date: body.CheckOutDate,
    nights: Number(body.Nights) || 1,
    status: body.Status || 'reserved',
    source: body.Source || 'admin',
    booking_channel: body.BookingChannel || 'admin',
    guest_notes: body.GuestNotes || '',
    internal_notes: body.InternalNotes || '',
    total_snapshot: Number(body.TotalSnapshot) || 0,
    deposit_required_snapshot: Number(body.DepositRequiredSnapshot) || 0,
    deposit_paid_snapshot: Number(body.DepositPaidSnapshot) || 0,
    balance_snapshot: Number(body.BalanceSnapshot) || 0,
    currency: body.Currency || 'ZAR',
    pricing_snapshot_json: body.PricingSnapshotJSON || '{}',
    extras_snapshot_json: body.ExtrasSnapshotJSON || '[]',
    comms_snapshot: body.CommsSnapshot || null,
    hold_expires_at: body.HoldExpiresAt || null,
    soft_deleted: false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('bookings').upsert(r, { onConflict: 'booking_id' });
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbUpsertStandType(body) {
  const r = {
    stand_type_id: body.StandTypeID || uid('TYPE'),
    resort_id: body.ResortID || APP.resortId,
    stand_type_name: body.StandTypeName || '',
    pricing_mode: body.PricingMode || 'flat',
    pricing_json: body.PricingJSON || '{}',
    default_deposit_mode: body.DefaultDepositMode || 'percentage',
    default_deposit_value: Number(body.DefaultDepositValue) || 0,
    default_min_nights: Number(body.DefaultMinNights) || 1,
    default_max_nights: Number(body.DefaultMaxNights) || 21,
    default_lead_time_days: Number(body.DefaultLeadTimeDays) || 0,
    default_hold_minutes: Number(body.DefaultHoldMinutes) || 120,
    default_amenities_json: body.DefaultAmenitiesJSON || '[]',
    default_features_json: body.DefaultFeaturesJSON || '[]',
    default_extras_json: body.DefaultExtrasJSON || '[]',
    default_occupancy_json: body.DefaultOccupancyJSON || '{}',
    active: body.Active === true || body.Active === 'true',
    soft_deleted: false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('stand_types').upsert(r, { onConflict: 'stand_type_id' });
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbUpsertBlock(body) {
  const r = {
    block_id: body.BlockID || uid('BLK'),
    resort_id: body.ResortID || APP.resortId,
    stand_id: body.StandID,
    block_type: body.BlockType || 'maintenance',
    start_date: body.StartDate,
    end_date: body.EndDate,
    reason: body.Reason || '',
    soft_deleted: false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('calendar_blocks').upsert(r, { onConflict: 'block_id' });
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbSoftDelete(table, keyCol, keyVal) {
  const { error } = await sb.from(table).update({ soft_deleted: true, updated_at: new Date().toISOString() }).eq(keyCol, keyVal);
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbAppendPayment(body) {
  const r = {
    payment_id: body.PaymentID || ('PAY-' + Date.now() + '-' + Math.random().toString(36).slice(2,7).toUpperCase()),
    booking_id: body.BookingID,
    resort_id: body.ResortID || APP.resortId,
    payment_type: body.PaymentType || 'deposit',
    payment_status: body.PaymentStatus || 'completed',
    payment_method: body.PaymentMethod || 'EFT',
    amount: Number(body.Amount) || 0,
    currency: body.Currency || 'ZAR',
    reference: body.Reference || '',
    paid_at: body.PaidAt || new Date().toISOString(),
    captured_at: body.CapturedAt || new Date().toISOString(),
    received_by: body.ReceivedBy || APP.userEmail || 'admin',
    notes: body.Notes || '',
    soft_deleted: false,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await sb.from('booking_payments').insert(r).select().single();
  if (error) throw new Error(error.message);
  // Update booking balance
  const allPay = (APP.state.payments || []).filter(p => p.BookingID === body.BookingID && !p.SoftDeleted);
  allPay.push(sbToPayment(data));
  const paid = allPay.reduce((s,p) => p.PaymentType==='refund' ? s-Number(p.Amount||0) : s+Number(p.Amount||0), 0);
  const booking = APP.state.bookings.find(b => b.BookingID === body.BookingID);
  const total = booking ? Number(booking.TotalSnapshot || 0) : 0;
  const balance = Math.max(0, total - paid);
  await sb.from('bookings').update({ deposit_paid_snapshot: paid, balance_snapshot: balance, updated_at: new Date().toISOString() }).eq('booking_id', body.BookingID);
  if (booking) { booking.DepositPaidSnapshot = String(paid); booking.BalanceSnapshot = String(balance); }
  APP.state.payments = [...(APP.state.payments || []).filter(p => p.BookingID !== body.BookingID || !p._optimistic), ...allPay];
  return { success: true, paidTotal: paid, bookingTotal: total };
}

async function sbChangeBookingStatus(bookingId, newStatus, actor) {
  const { error } = await sb.from('bookings').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('booking_id', bookingId);
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbUpsertResortDefaults(body) {
  const r = {
    resort_id: body.ResortID || APP.resortId,
    default_currency: body.DefaultCurrency || 'ZAR',
    default_check_in_time: body.DefaultCheckInTime || '14:00',
    default_check_out_time: body.DefaultCheckOutTime || '10:00',
    default_hold_minutes: Number(body.DefaultHoldMinutes) || 120,
    default_min_nights: Number(body.DefaultMinNights) || 1,
    default_max_nights: Number(body.DefaultMaxNights) || 21,
    default_deposit_mode: body.DefaultDepositMode || 'percentage',
    default_deposit_value: Number(body.DefaultDepositValue) || 0,
    age_toddler_max: Number(body.AgeToddlerMax) || 2,
    age_child_max: Number(body.AgeChildMax) || 12,
    pre_holiday_treatment: body.PreHolidayTreatment || 'offPeak',
    season_rules_json: body.SeasonRulesJSON || '{}',
    active: true, soft_deleted: false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('resort_defaults').upsert(r, { onConflict: 'resort_id' });
  if (error) throw new Error(error.message);
  return { success: true };
}

async function sbResetResortData(sections, resortId) {
  const tableMap = {
    Bookings: 'bookings', Payments: 'booking_payments',
    BookingEvents: 'booking_events', CalendarBlocks: 'calendar_blocks',
    Stands: 'stands', StandTypes: 'stand_types',
    ResortDefaults: 'resort_defaults', AuditLog: 'audit_log',
    NewsletterSignups: 'newsletter_signups'
  };
  const results = {};
  for (const section of sections) {
    const table = tableMap[section];
    if (!table) continue;
    const col = ['resort_defaults','newsletter_signups','audit_log'].includes(table) ? 'resort_id' : 'resort_id';
    const { error, count } = await sb.from(table).delete().eq(col, resortId);
    results[section] = error ? ('Error: ' + error.message) : 'Deleted';
  }
  return { success: true, results, resortId };
}

async function sbLoadPaymentsForBooking(bookingId) {
  const { data, error } = await sb.from('booking_payments').select('*').eq('booking_id', bookingId).eq('soft_deleted', false).order('paid_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(sbToPayment);
}


// ── Default view helper ───────────────────────────────────────────────────────
function getDefaultView_() {
  const btn = document.querySelector('.nav button[data-view]');
  return btn ? btn.dataset.view : 'dashboard';
}

const APP = {
  resortId: '1',
  resortName: 'Kampkiepie Toets Kamp',
  resortTotalViews: 0,
  role: 'Resort Super Admin',
  resortRole: 'Super',   // Super | Manager | Admin | Finance (from Users tab)
  userPermissions: null, // null = use role defaults; array = explicit overrides
  userEmail: '',
  activeView: getDefaultView_(),
  standsTab: 'stands',
  showDeactivated: false,
  dashboardFilter: null,
  utilFilter: null,
  dashboardTab: 'dashboard',
  standPerfSortBy: 'revenue',
  standPerfMode: 'current',
  paymentsCache: {},
  _currentSuggestions: [],
  _chainExecution: null,
  selected: null,
  monthKeys: [],
  months: [],
  state: { stands:[], bookings:[], blocks:[], standTypes:[], resortDefaults:{}, bulk:{}, payments:[] }
};

// ── Text / JSON-array helpers ─────────────────────────────────────────────────
function sanitizeText(val) {
  return String(val || '')
    .replace(/\r\n/g, '\n')   // Windows Enter → Unix newline
    .replace(/\r/g, '\n')      // old Mac Enter → Unix newline
    .replace(/\n{3,}/g, '\n\n') // cap at 2 consecutive blank lines
    .trim();
}
function jsonArrayToText(jsonStr) {
  // ["Wifi","Pool","Braai"] → "Wifi\nPool\nBraai"
  try {
    const arr = JSON.parse(jsonStr || '[]');
    return Array.isArray(arr) ? arr.join('\n') : String(jsonStr || '');
  } catch(e) {
    // Already plain text or broken JSON — return as-is
    return String(jsonStr || '');
  }
}
function textToJsonArray(text) {
  // "Wifi\nPool\nBraai" or "Wifi, Pool, Braai" → ["Wifi","Pool","Braai"]
  return JSON.stringify(
    String(text || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean)
  );
}
function generateBookingRef(){const now=new Date();const yy=String(now.getFullYear()).slice(-2);const mm=String(now.getMonth()+1).padStart(2,'0');const dd=String(now.getDate()).padStart(2,'0');const rand=Math.random().toString(36).slice(2,8).toUpperCase();return `${yy}${mm}${dd}-${APP.resortId}-${rand}`;}
function uid(prefix){return prefix+'-'+Math.random().toString(36).slice(2,8).toUpperCase()+Date.now().toString(36).slice(-4).toUpperCase();}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function truthy(v){return String(v??'').trim().toLowerCase()==='true'||String(v??'').trim()==='1'||String(v??'').trim()==='yes';}
const CURRENCY_SYMBOLS={ZAR:'R',USD:'$',EUR:'€',GBP:'£'};
function formatMoney(amount,currencyCode){const symbol=currencyCode?(CURRENCY_SYMBOLS[String(currencyCode).toUpperCase()]||String(currencyCode)+' '):'';const num=Math.round(Number(amount||0));return symbol+num;}
function displayDate(v){const s=String(v??'').trim();if(!s)return '';return s.includes('T')?s.split('T')[0]:s;}
function dateOnly(d){if(!d)return '';const dt=new Date(d);if(Number.isNaN(dt.getTime()))return String(d);return dt.toISOString().slice(0,10);}
function parseDateOnly(value){const s=String(value||'').trim();if(!s)return null;const d=new Date(s+'T00:00:00Z');return Number.isNaN(d.getTime())?null:d;}
function addDays(dateStr,days){const d=parseDateOnly(dateStr);if(!d)return '';d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10);}
function addMonths(yyyyMm,delta){const[y,m]=yyyyMm.split('-').map(Number);const d=new Date(Date.UTC(y,m-1+delta,1));return d.toISOString().slice(0,7);}
function monthLabel(yyyyMm){const[y,m]=yyyyMm.split('-').map(Number);return new Date(Date.UTC(y,m-1,1)).toLocaleDateString('en-ZA',{month:'short',year:'numeric',timeZone:'UTC'});}
function todayMonth(){return new Date().toISOString().slice(0,7);}
function getQueryResortId(){return new URLSearchParams(location.search).get('resort')||'1';}
function overlap(aStart,aEnd,bStart,bEnd){return dateOnly(aStart)<dateOnly(bEnd)&&dateOnly(aEnd)>dateOnly(bStart);}
function bookingBlocksStatus(status){return['reserved','confirmed','part-paid','checked-in'].includes(String(status||'').toLowerCase());}
function bookingIsFinal(status){return['cancelled','no-show','completed'].includes(String(status||'').toLowerCase());}
function bookingStatusChip(status){const s=String(status||'').toLowerCase();const cls=bookingBlocksStatus(s)?'warn':(['cancelled','no-show'].includes(s)?'bad':(s==='completed'?'ok':'info'));return `<span class="chip ${cls}">${esc(status||'n/a')}</span>`;}
function optionHtml(value,label,selected){return `<option value="${esc(value)}"${selected?' selected':''}>${esc(label||value)}</option>`;}
function activeStands(){return APP.state.stands.filter(s=>!s.SoftDeleted&&truthy(s.Active));}
function standLabel(s){return[s.StandNumber,s.StandName,s.StandTypeID?'('+s.StandTypeID+')':''].filter(Boolean).join(' - ');}
function standTypeName(id){const t=APP.state.standTypes.find(x=>String(x.StandTypeID)===String(id||''));return t?String(t.StandTypeName||t.StandTypeID):String(id||'');}
function standTypesForResort(resortId){return APP.state.standTypes.filter(t=>!truthy(t.SoftDeleted)&&String(t.ResortID||'')===String(resortId||''));}
function standSearchList(q){
  const term=String(q||'').trim().toLowerCase();
  const typeFilter=document.getElementById('bookingStandType')?.value||'';
  const checkIn=document.getElementById('bookingCheckInDate')?.value||'';
  const checkOut=document.getElementById('bookingCheckOutDate')?.value||'';
  const stands=activeStands().filter(s=>{
    if(typeFilter&&String(s.StandTypeID||'')!==typeFilter)return false;
    if(!isStandAvailableForDates(s.StandID,checkIn,checkOut))return false;
    if(!term)return true;
    return[s.StandID,s.StandNumber,s.StandName,s.DisplayName,s.StandTypeID,s.Description,s.MaxAdults,s.MaxChildren,s.MaxToddlers,s.Currency].some(v=>String(v??'').toLowerCase().includes(term));
  });
  return stands.slice(0,12);
}
function enforceBookingDefaults(){
  const defaults=APP.state.resortDefaults||{};
  const minNights=Number(defaults.DefaultMinNights??1);
  const leadDays=Number(defaults.DefaultLeadTimeDays??0);
  const checkIn=document.getElementById('bookingCheckInDate');
  const checkOut=document.getElementById('bookingCheckOutDate');
  if(!checkIn||!checkOut)return;
  const todayMin=addDays(dateOnly(new Date()),leadDays);
  if(checkIn.min!==todayMin)checkIn.min=todayMin;
  const minCheckout=addDays(checkIn.value||todayMin,Math.max(1,minNights));
  checkOut.min=minCheckout;
  if(checkOut.value&&dateOnly(checkOut.value)<dateOnly(minCheckout))checkOut.value=minCheckout;
}
function isStandAvailableForDates(standId,checkIn,checkOut,excludeBookingId){
  if(!checkIn||!checkOut)return true;
  const start=dateOnly(checkIn),end=dateOnly(checkOut);
  if(!start||!end)return true;
  const bookingConflict=APP.state.bookings.some(b=>{
    if(excludeBookingId&&String(b.BookingID||'')===String(excludeBookingId))return false;
    if(String(b.StandID||'')!==String(standId||''))return false;
    if(bookingIsFinal(b.Status))return false;
    return overlap(b.CheckInDate,b.CheckOutDate,start,end);
  });
  if(bookingConflict)return false;
  const blockConflict=APP.state.blocks.some(b=>{if(String(b.StandID||'')!==String(standId||''))return false;if(truthy(b.SoftDeleted))return false;return overlap(b.StartDate,b.EndDate,start,end);});
  return!blockConflict;
}











async function sendBookingEmailToGuest(bookingId, eventType, extra) {
  extra = extra || {};
  const payload = {
    bookingId: bookingId,
    eventType: eventType,
    actorEmail: APP.userEmail || APP.role || 'admin'
  };
  if (extra.newStatus !== undefined)   payload.newStatus = extra.newStatus;
  if (extra.oldStatus !== undefined)   payload.oldStatus = extra.oldStatus;
  if (extra.amount !== undefined)      payload.paymentAmount = extra.amount;
  if (extra.paymentType !== undefined) payload.paymentType = extra.paymentType;
  try {
    const res = await gasCall('sendBookingEmail', payload, 'POST');
    if (!res.success) console.warn('Guest email not sent:', res.error);
    return res;
  } catch (e) {
    console.error('sendBookingEmailToGuest failed:', e);
    return { success: false, error: e.message || String(e) };
  }
}
function connectApi(){const url=document.getElementById('apiUrl').value.trim();if(!url)return;window.__KK_API_URL=url;localStorage.setItem('kkAdminBackendApi',url);attemptConnect();}






// ── Role access matrix ────────────────────────────────────────────────────────
// KampKiepie Super Admin (superadmin role) always has full access.
// Resort roles from Users tab: Super | Manager | Admin | Finance
const ROLE_VIEWS = {
  Super:   ['dashboard','availability','bookings','reallocate','stands','bulk','blocks','pricing','settings','insights','users','refunds','payments','reports'],
  Manager: ['dashboard','availability','bookings','reallocate','bulk','blocks','insights','refunds','payments'],
  Admin:   ['dashboard','availability','bookings'],
  Finance: ['dashboard','availability','bookings','insights','refunds','payments','reports'],
};
// Friendly labels for every permission key (used in User Management UI)
const PERM_LABELS = {
  dashboard:    'Dashboard',
  availability: 'Availability Calendar',
  bookings:     'Bookings Lines',
  reallocate:   'Reallocate & Change Dates',
  stands:       'Stands',
  bulk:         'Bookings Bulk',
  blocks:       'Maintenance',
  pricing:      'Pricing Rules',
  settings:     'Defaults & Settings',
  insights:     'Insights Tab',
  users:        'User Management',
  refunds:      'Refunds',
  payments:     'Record Payments',
  reports:      'Financial Reports',
};
const ALL_PERM_KEYS = Object.keys(PERM_LABELS);
function canAccessView(view) {
  if (APP.role === 'superadmin') return true;           // KK super admin — always full
  if (APP.resortRole === 'Super') return true;           // Resort Super — always full
  if (APP.userPermissions && APP.userPermissions.length) // Explicit per-user permission list
    return APP.userPermissions.includes(view);
  const allowed = ROLE_VIEWS[APP.resortRole] || ROLE_VIEWS.Admin;
  return allowed.includes(view);
}
function canAccessSetup() {
  // Show Setup if user can access any of the setup-page views
  return ['stands','pricing','settings','users'].some(v => canAccessView(v));
}
function isKKSuperAdmin() {
  return APP.role === 'superadmin';
}
function applyRoleToNav() {
  const isSuper = APP.role === 'superadmin' || APP.resortRole === 'Super';
  const setupAccess = canAccessSetup();

  // Guard: redirect from setup page if no access to any setup view
  if (window.KK_PAGE === 'setup' && !setupAccess) {
    window.location.href = 'adminbackend.html' + location.search;
    return;
  }

  document.querySelectorAll('.nav button[data-view]').forEach(btn => {
    const view = btn.dataset.view;
    btn.style.display = canAccessView(view) ? '' : 'none';
  });

  // Inject cross-page link for users who have setup-page access
  const nav = document.querySelector('.nav');
  if (nav && setupAccess) {
    const existing = document.getElementById('kkPageSwitch');
    if (!existing) {
      const btn = document.createElement('button');
      btn.id = 'kkPageSwitch';
      btn.className = 'btn btn-soft';
      btn.style.cssText = 'margin-top:6px;font-size:10.4px;justify-content:flex-start;width:100%;';
      if (window.KK_PAGE === 'operations') {
        btn.textContent = '\u2699\ufe0f Setup';
        btn.title = 'Stands, Pricing, Defaults';
        btn.onclick = () => navigateToPage_('adminsetup.html');
      } else {
        btn.textContent = '\u2190 Bookings';
        btn.title = 'Dashboard, Bookings, Maintenance';
        btn.onclick = () => navigateToPage_('adminbackend.html');
      }
      nav.appendChild(btn);
    }
  }

  const insightAllowed = canAccessView('insights');
  // Reports button — Super and Finance
  const rBtn = document.getElementById('reportsNavBtn');
  if (rBtn) rBtn.style.display = canAccessView('reports') ? '' : 'none';
  APP._insightAllowed = insightAllowed;
}
function applySessionIdentity(){
  // APP.role, APP.userEmail, APP.resortRole are already set by boot() from the JWT.
  // Just update the UI pill and apply role-based nav visibility.
  const pill=document.getElementById('rolePill');
  if(pill){
    const roleLabel=APP.role==='superadmin'?'KampKiepie Super Admin':(APP.resortRole||APP.role);
    pill.textContent=roleLabel;pill.title=APP.userEmail;
  }
  applyRoleToNav();
  showResetButtonIfSuperAdmin();
}

let sessionCheckTimer=null;
function startSessionWatcher(){if(sessionCheckTimer)clearInterval(sessionCheckTimer);sessionCheckTimer=setInterval(checkSessionExpiry,5000);checkSessionExpiry();}
function stopSessionWatcher(){if(sessionCheckTimer)clearInterval(sessionCheckTimer);sessionCheckTimer=null;}
function checkSessionExpiry(){
  // Session management now handled by Supabase — no-op stub.
}
function showSessionWarning(secondsLeft){const countdownEl=document.getElementById('sessionWarningCountdown');if(countdownEl)countdownEl.textContent=secondsLeft;document.getElementById('sessionWarningModal')?.classList.add('on');}
function hideSessionWarning(){document.getElementById('sessionWarningModal')?.classList.remove('on');}
async function clickExtendSession(){try{const res=await apiCall('extendSession',{},'GET');if(!res.success){alert(res.error||'Could not extend session');return;}setSession(res.session);if(typeof res.extendsRemaining==='number'&&res.extendsRemaining<=0)document.getElementById('sessionExtendBtn')?.classList.add('hidden');hideSessionWarning();checkSessionExpiry();}catch(err){console.warn('Extend failed:',err);}}
function clickRefreshSession(){window.location.href='../admin/admin.html';}


function stopLivePolling(){if(livePollTimer)clearInterval(livePollTimer);livePollTimer=null;}
async function livePoll(){
  if(document.getElementById('wrapMain')?.classList.contains('hidden'))return;
  if(document.querySelector('.modal.on'))return;
  const selected=APP.selected;
  const selectedId=selected?(selected.data.BookingID||selected.data.StandID||selected.data.BlockID||selected.data.StandTypeID):null;
  const selectedKind=selected?selected.kind:null;
  try{
    await initLiveData();
    if(selectedId&&selectedKind==='booking')selectBooking(selectedId);
    else if(selectedId&&selectedKind==='stand')selectStand(selectedId);
    else if(selectedId&&selectedKind==='block')selectBlock(selectedId);
    else if(selectedId&&selectedKind==='standType')selectStandType(selectedId);
    lastLiveUpdate=new Date();updateLiveIndicator();
  }catch(err){console.warn('Live refresh failed:',err);updateLiveIndicator('Refresh failed, retrying\u2026');}
}
function updateLiveIndicator(overrideText){const el=document.getElementById('liveIndicator');if(!el)return;if(overrideText){el.textContent=overrideText;return;}el.textContent=lastLiveUpdate?'Updated '+lastLiveUpdate.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'';}

function fillInputValue(label,value){return value===undefined||value===null?'':String(value);}
function modalInputs(modalId){return Array.from(document.querySelectorAll('#'+modalId+' input, #'+modalId+' textarea, #'+modalId+' select')).reduce((acc,el)=>{const field=el.closest('.field');const label=field&&field.querySelector('label')?field.querySelector('label').textContent.trim():'';acc[label]=el.type==='checkbox'?el.checked:el.value;return acc;},{});}
function modalObject(modalId){
  const data=modalInputs(modalId);
  const map={'Resort ID':'ResortID','Stand ID':'StandID','Stand Number':'StandNumber','Stand Name':'StandName','Stand Type':'StandTypeID','Active':'Active','Display Name':'DisplayName','Description':'Description','Base Rate':'BaseRate','Peak Rate':'PeakRate','Off-Peak Rate':'OffPeakRate','Weekend Rate':'WeekendRate','Shoulder Rate':'ShoulderRate','Currency':'Currency','Max Adults':'MaxAdults','Max Children':'MaxChildren','Max Toddlers':'MaxToddlers','Max Guests':'MaxGuests','Max Vehicles':'MaxVehicles','Deposit Mode':'DepositMode','Deposit Value':'DepositValue','Amenities JSON':'AmenitiesJSON','Features JSON':'FeaturesJSON','Extras JSON':'ExtrasJSON','Booking ID':'BookingID','Booking Ref':'BookingRef','Guest First Name':'GuestFirstName','Guest Last Name':'GuestLastName','Guest Email':'GuestEmail','Guest Phone':'GuestPhone','Adults':'Adults','Children':'Children','Toddlers':'Toddlers','Check-In Date':'CheckInDate','Check-Out Date':'CheckOutDate','Status':'Status','Source':'Source','Channel':'BookingChannel','Guest Notes':'GuestNotes','Internal Notes':'InternalNotes','Block ID':'BlockID','Block Type':'BlockType','Start Date':'StartDate','End Date':'EndDate','Reason':'Reason'};
  const out={};Object.keys(data).forEach(k=>{const mapped=map[k];if(mapped)out[mapped]=data[k];});return out;
}

async function saveModal(kind){
  try{
    let action='',body={};
    if(kind==='stand'){body=standModalPayload();body.Active=body.Active==='true'||body.Active===true;body.SoftDeleted=false;body.CreatedAt=body.CreatedAt||new Date().toISOString();body.UpdatedAt=new Date().toISOString();}
    if(kind==='stand'){const sbRes=await sbUpsertStand(body);if(!sbRes.success)throw new Error(sbRes.error||'Save failed');try{await initLiveData();}catch(e){}closeModal('standModal');return;}
    if(kind==='booking'){
      enforceBookingDefaults();body=modalObject('bookingModal');body.ResortID=APP.resortId;
      body.StandID=resolveBookingStandId();if(!body.StandID)throw new Error('Please choose a stand/unit from the available list before saving.');
      const chosenStand=APP.state.stands.find(s=>String(s.StandID)===String(body.StandID));
      body.StandTypeID=chosenStand?String(chosenStand.StandTypeID||''):(body.StandTypeID||'');
      body.Nights=String(Math.max(1,(new Date(body.CheckOutDate)-new Date(body.CheckInDate))/86400000));
      // Currency: inherit from the chosen stand, fall back to resort default
      body.Currency=chosenStand?.Currency||APP.state.resortDefaults?.DefaultCurrency||'ZAR';
      // Build full pricing snapshot using calculateStayPrice
      {
        const nights=Number(body.Nights)||1;
        const currency=body.Currency||'ZAR';
        const defaults=APP.state.resortDefaults||{};
        const adults=Number(body.Adults||1),children=Number(body.Children||0),toddlers=Number(body.Toddlers||0);
        const standType=chosenStand?APP.state.standTypes.find(t=>String(t.StandTypeID||'')===String(chosenStand.StandTypeID||'')):null;
        const priceResult=standType&&body.CheckInDate&&body.CheckOutDate
          ?calculateStayPrice(body.CheckInDate,body.CheckOutDate,standType,defaults,adults,children,toddlers)
          :null;
        const breakdown=priceResult?.breakdown||[];
        const mode=standType?.PricingMode||'manual';
        const computedTotal=priceResult?.total||0;
        const manualTotal=Number(document.getElementById('bookingTotalAmount')?.value)||0;
        body.PricingSnapshotJSON=JSON.stringify({nights,total:computedTotal||manualTotal,currency,mode,breakdown});
      }
      body.Status=document.getElementById('bookingStatus')?.value||body.Status||'reserved';
      body.Source=document.getElementById('bookingSource')?.value||body.Source||'admin';
      body.BookingChannel=document.getElementById('bookingChannel')?.value||body.BookingChannel||'admin';
      const holdMinutes=Number(document.getElementById('bookingModal')?.querySelector('.modal-b')?.dataset.holdMinutes||(APP.state.resortDefaults?.DefaultHoldMinutes??0));
      body.HoldExpiresAt=body.HoldExpiresAt||(holdMinutes?new Date(Date.now()+holdMinutes*60000).toISOString():'');
      body.CreatedAt=body.CreatedAt||new Date().toISOString();body.UpdatedAt=new Date().toISOString();
      body.SoftDeleted=false;body.GuestFullName=[body.GuestFirstName,body.GuestLastName].filter(Boolean).join(' ');if(body.GuestNotes)body.GuestNotes=sanitizeText(body.GuestNotes);if(body.InternalNotes)body.InternalNotes=sanitizeText(body.InternalNotes);
      body.BookingRef=body.BookingRef||generateBookingRef();
      body.ExtrasSnapshotJSON=body.ExtrasSnapshotJSON||'[]';
      body.TaxSnapshotJSON=body.TaxSnapshotJSON||'[]';body.FeeSnapshotJSON=body.FeeSnapshotJSON||'[]';body.DiscountSnapshotJSON=body.DiscountSnapshotJSON||'[]';
      body.TotalSnapshot=document.getElementById('bookingTotalAmount')?.value||body.TotalSnapshot||'';
      body.DepositRequiredSnapshot=body.DepositRequiredSnapshot||'';
      const existingBooking=APP.state.bookings.find(x=>x.BookingID===body.BookingID);
      const paidSoFar=existingBooking?Number(existingBooking.DepositPaidSnapshot||0):0;
      body.DepositPaidSnapshot=existingBooking?String(existingBooking.DepositPaidSnapshot??'0'):'0';
      body.BalanceSnapshot=body.TotalSnapshot?String(Math.max(0,Number(body.TotalSnapshot)-paidSoFar)):'';
      body.kkbookLevel=APP.kkbookLevel||'';
      action='upsertBooking';
    }
    if(kind==='standType'){
      body=standTypeModalPayload();body.CreatedAt=body.CreatedAt||new Date().toISOString();body.UpdatedAt=new Date().toISOString();body.SoftDeleted=false;
      if(body.Active===false){const linkedCount=APP.state.stands.filter(s=>!s.SoftDeleted&&s.StandTypeID===body.StandTypeID).length;if(linkedCount)throw new Error('Cannot deactivate this stand type - '+linkedCount+' stand(s) still use it.');}
      action='upsertStandType';
    }
    if(kind==='block'){
      body=modalObject('blockModal');body.StandID=document.getElementById('blockStandSelect')?.value||body.StandID||'';
      if(!body.StandID)throw new Error('Please select a stand for this maintenance block.');
      const blkStart=document.getElementById('blockStartDate')?.value||body.StartDate||'';
      const blkEnd=document.getElementById('blockEndDate')?.value||body.EndDate||'';
      if(blkStart&&blkEnd){const conflicts=APP.state.bookings.filter(b=>{if(b.SoftDeleted||String(b.StandID)!==body.StandID)return false;return['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,blkStart,blkEnd);});if(conflicts.length)throw new Error('Cannot save: '+conflicts.length+' active booking(s) overlap these dates.\n'+conflicts.map(b=>'- '+b.BookingRef+' – '+b.GuestFullName).join('\n'));}
      body.CreatedAt=body.CreatedAt||new Date().toISOString();body.UpdatedAt=new Date().toISOString();body.SoftDeleted=false;action='upsertBlock';
    }
    closeModal(kind+'Modal');
    try {
      if(action==='upsertStand')     await sbUpsertStand(body);
      else if(action==='upsertBooking')  await sbUpsertBooking(body);
      else if(action==='upsertStandType') await sbUpsertStandType(body);
      else if(action==='upsertBlock')    await sbUpsertBlock(body);
      buildBulk();
      try { await initLiveData(); } catch(refreshErr) { console.warn('Post-save refresh failed:', refreshErr); }
    } catch(apiErr) { alert('Save error: ' + (apiErr.message||String(apiErr))); }
  } catch(err) { alert(err.message||String(err)); }
}
async function deleteRecord(kind,id){
  const map={stand:{sheetName:'Stands',keyName:'StandID',modal:'standModal',list:'stands'},standType:{sheetName:'StandTypes',keyName:'StandTypeID',modal:'standTypeModal',list:'standTypes'},booking:{sheetName:'BookingsLines',keyName:'BookingID',modal:'bookingModal',list:'bookings'},block:{sheetName:'CalendarBlocks',keyName:'BlockID',modal:'blockModal',list:'blocks'}};
  const cfg=map[kind];if(!cfg||!id)return;
  if(kind==='standType'){const linkedCount=APP.state.stands.filter(s=>!s.SoftDeleted&&s.StandTypeID===id).length;if(linkedCount){alert('Cannot delete this stand type - '+linkedCount+' stand(s) still use it.');return;}}
  if(!confirm('Delete this '+kind+'? It will be soft-deleted and hidden from active lists.'))return;
  const applyLocalDelete=()=>{const rec=APP.state[cfg.list].find(x=>x[cfg.keyName]===id);if(rec)rec.SoftDeleted=true;buildBulk();renderStats();renderActive();renderInspector(null);};
  const sbMap={stand:{table:'stands',keyCol:'stand_id'},standType:{table:'stand_types',keyCol:'stand_type_id'},booking:{table:'bookings',keyCol:'booking_id'},block:{table:'calendar_blocks',keyCol:'block_id'}};
  const sbCfg=sbMap[kind];
  try {
    if(sbCfg) await sbSoftDelete(sbCfg.table, sbCfg.keyCol, id);
    closeModal(cfg.modal);
    try { await initLiveData(); } catch(e) {}
  } catch(err) { closeModal(cfg.modal); applyLocalDelete(); alert('Delete error: '+(err.message||err)); }
}

function showResetButtonIfSuperAdmin(){const btn=document.getElementById('resetBtn');if(!btn)return;if(APP.role==='KampKiepie Super Admin')btn.classList.remove('hidden');else btn.classList.add('hidden');}
function openResetModal(){document.getElementById('resetModal').classList.add('on');}
async function submitReset(){
  const btn=document.getElementById('resetConfirmBtn'),msg=document.getElementById('resetMsg');
  if(document.getElementById('resetConfirmInput').value!=='Delete Forever!')return;
  const sectionMap={rst_Bookings:'Bookings',rst_Payments:'Payments',rst_BookingEvents:'BookingEvents',rst_CalendarBlocks:'CalendarBlocks',rst_Stands:'Stands',rst_StandTypes:'StandTypes',rst_ResortDefaults:'ResortDefaults',rst_AuditLog:'AuditLog',rst_NewsletterSignups:'NewsletterSignups'};
  const selected=[];Object.keys(sectionMap).forEach(id=>{const el=document.getElementById(id);if(el&&el.checked&&!el.disabled)selected.push(sectionMap[id]);});
  if(!selected.length){if(msg)msg.innerHTML='<div class="notice warn">Please tick at least one section.</div>';return;}
  if(btn)btn.disabled=true;if(msg)msg.innerHTML='<div class="notice info">Deleting\u2026</div>';
  try{const res=await sbResetResortData(selected,APP.resortId);if(!res.success)throw new Error(res.error||'Reset failed');const lines=Object.entries(res.results||{}).map(([k,v])=>'<li><strong>'+esc(k)+'</strong>: '+esc(v)+'</li>').join('');if(msg)msg.innerHTML='<div class="notice ok">Reset complete for Resort '+esc(res.resortId)+'.</div><ul style="font-size:12px;font-weight:700;padding-left:18px;line-height:1.9">'+lines+'</ul>';try{await initLiveData();}catch(e){}
  }catch(err){if(msg)msg.innerHTML='<div class="notice bad">'+esc(err.message||String(err))+'</div>';if(btn)btn.disabled=false;}
}

function createMonthKeys(){const now=todayMonth();APP.monthKeys=[];for(let i=-2;i<=10;i++)APP.monthKeys.push(addMonths(now,i));APP.months=APP.monthKeys.map(m=>({key:m,label:monthLabel(m)}));}
function buildBulk(){
  APP.state.bulk={};
  const stands=APP.state.stands.filter(s=>!s.SoftDeleted);
  for(const stand of stands)APP.state.bulk[stand.StandID]={ResortID:stand.ResortID,StandID:stand.StandID};
  for(const booking of APP.state.bookings.filter(b=>!b.SoftDeleted)){
    for(const month of APP.monthKeys){
      const monthStart=month+'-01',nextMonth=addMonths(month,1)+'-01';
      if(overlap(booking.CheckInDate,booking.CheckOutDate,monthStart,nextMonth)){
        APP.state.bulk[booking.StandID]||={ResortID:booking.ResortID,StandID:booking.StandID};
        APP.state.bulk[booking.StandID][month]||=[];
        APP.state.bulk[booking.StandID][month].push({bookingId:booking.BookingID,bookingRef:booking.BookingRef,status:booking.Status,checkIn:booking.CheckInDate,checkOut:booking.CheckOutDate,nights:booking.Nights,guestName:booking.GuestFullName,adults:booking.Adults,children:booking.Children,toddlers:booking.Toddlers,source:booking.Source,total:booking.TotalSnapshot,depositPaid:booking.DepositPaidSnapshot});
      }
    }
  }
}
function classifyNight(dateStr,defaults){
  if(!dateStr||!defaults)return 'offPeak';
  const sr=(()=>{try{return JSON.parse(defaults.SeasonRulesJSON||'{}');}catch(e){return{};}})();
  const peaks=sr.peak||[],shoulders=sr.shoulder||[];
  const pht=(()=>{const s=String(defaults.PreHolidayTreatment||'offPeak').toLowerCase().replace(/[^a-z]/g,'');return s==='peak'?'peak':s==='shoulder'?'shoulder':s==='weekend'?'weekend':'offPeak';})();
  const tomorrow=addDays(dateStr,1);
  const holidays=defaults.PublicHolidaysList||[];
  const norm=v=>v?String(v).trim().slice(0,10):'';
  const isPreHoliday=holidays.some(h=>norm(h.date)===tomorrow||norm(h.observedDate)===tomorrow||norm(h.Date)===tomorrow||norm(h.ObservedDate)===tomorrow);
  if(isPreHoliday){
    // Holiday itself in peak/shoulder? Inherit that tier for the pre-holiday night
    if(peaks.some(r=>r.start&&r.end&&tomorrow>=r.start&&tomorrow<=r.end))return 'peak';
    if(shoulders.some(r=>r.start&&r.end&&tomorrow>=r.start&&tomorrow<=r.end))return 'shoulder';
    // Outside all special ranges — use the configured pht default
    return pht;
  }
  if(peaks.some(r=>r.start&&r.end&&dateStr>=r.start&&dateStr<=r.end))return 'peak';
  if(shoulders.some(r=>r.start&&r.end&&dateStr>=r.start&&dateStr<=r.end))return 'shoulder';
  const d=parseDateOnly(dateStr);if(d&&(d.getUTCDay()===5||d.getUTCDay()===6))return 'weekend';
  return 'offPeak';
}
function calculateStayPrice(checkIn,checkOut,standType,defaults,adults,children,toddlers){
  if(!checkIn||!checkOut||!standType)return null;
  const mode=standType.PricingMode||'flat',currency=(defaults&&defaults.DefaultCurrency)||APP.state.resortDefaults?.DefaultCurrency||'ZAR';
  let pricing={};try{pricing=JSON.parse(standType.PricingJSON||'{}');}catch(e){}
  const LABELS={peak:'Peak',shoulder:'Shoulder',offPeak:'Off-Peak',weekend:'Weekend'};
  const nights=[];let d=checkIn,guard=0;while(d<checkOut&&guard++<366){nights.push(d);d=addDays(d,1);}
  let total=0;
  const breakdown=nights.map(date=>{
    const tier=classifyNight(date,defaults||{});const tr=pricing[tier]||pricing['offPeak']||{};let rate=0,detail='';
    if(mode==='flat'){rate=Number(tr.rate||0);detail=formatMoney(rate,currency)+'/night';}
    else if(mode==='pppn'){rate=Number(tr.adult||0)*adults+Number(tr.child||0)*children+Number(tr.toddler||0)*toddlers;const p=[];if(adults)p.push(adults+'A @ '+formatMoney(tr.adult||0,currency));if(children)p.push(children+'C @ '+formatMoney(tr.child||0,currency));if(toddlers)p.push(toddlers+'T @ '+formatMoney(tr.toddler||0,currency));detail=p.join(', ');}
    else if(mode==='base_plus_pppn'){const base=Number(tr.baseRate||0),incl=Number(tr.included||0);let rem=incl,rA=adults,rC=children,rT=toddlers;const iA=Math.min(rA,rem);rem-=iA;rA-=iA;const iC=Math.min(rC,rem);rem-=iC;rC-=iC;const iT=Math.min(rT,rem);rT-=iT;const extra=rA*Number(tr.extraAdult||0)+rC*Number(tr.extraChild||0)+rT*Number(tr.extraToddler||0);rate=base+extra;detail='Base '+formatMoney(base,currency)+'('+incl+' incl.)'+(adults+children+toddlers>incl?' + '+formatMoney(extra,currency)+' extras':'');}
    total+=rate;return{date,tier,tierLabel:LABELS[tier]||tier,rate,detail};
  });
  return{total,currency,breakdown};
}
function renderPricingEditor(mode,pricingJSON){
  let pricing={};try{pricing=JSON.parse(pricingJSON||'{}');}catch(e){}
  const tiers=[{key:'peak',label:'Peak',color:'var(--bad)'},{key:'shoulder',label:'Shoulder',color:'var(--warn)'},{key:'offPeak',label:'Off-Peak (default)',color:'var(--ok)'},{key:'weekend',label:'Weekend \u2014 off-peak Fri/Sat',color:'var(--info)'}];
  return tiers.map(({key,label,color})=>{
    const t=pricing[key]||{};let fields='';
    if(mode==='flat')fields=`<div class="field"><label>Rate / Night</label><input class="input" id="pr_${key}_rate" type="number" min="0" step="1" value="${esc(t.rate??0)}"></div>`;
    else if(mode==='pppn')fields=`<div class="field"><label>Adult PPPN</label><input class="input" id="pr_${key}_adult" type="number" min="0" step="1" value="${esc(t.adult??0)}"></div><div class="field"><label>Child PPPN</label><input class="input" id="pr_${key}_child" type="number" min="0" step="1" value="${esc(t.child??0)}"></div><div class="field"><label>Toddler PPPN</label><input class="input" id="pr_${key}_toddler" type="number" min="0" step="1" value="${esc(t.toddler??0)}"></div>`;
    else if(mode==='base_plus_pppn')fields=`<div class="field"><label>Base Rate / Night</label><input class="input" id="pr_${key}_baseRate" type="number" min="0" step="1" value="${esc(t.baseRate??0)}"></div><div class="field"><label>Included Guests</label><input class="input" id="pr_${key}_included" type="number" min="0" step="1" value="${esc(t.included??2)}"></div><div class="field"><label>Extra Adult PPPN</label><input class="input" id="pr_${key}_extraAdult" type="number" min="0" step="1" value="${esc(t.extraAdult??0)}"></div><div class="field"><label>Extra Child PPPN</label><input class="input" id="pr_${key}_extraChild" type="number" min="0" step="1" value="${esc(t.extraChild??0)}"></div><div class="field"><label>Extra Toddler PPPN</label><input class="input" id="pr_${key}_extraToddler" type="number" min="0" step="1" value="${esc(t.extraToddler??0)}"></div>`;
    return `<div style="margin-bottom:8px;padding:12px;background:var(--bg);border-radius:10px;border-left:3px solid ${color}"><div class="small" style="font-weight:800;color:${color};margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">${label}</div><div class="form-grid">${fields}</div></div>`;
  }).join('');
}
function collectPricingJSON(mode){
  const tiers=['peak','shoulder','offPeak','weekend'],n=id=>Number(document.getElementById(id)?.value||0),result={};
  tiers.forEach(k=>{if(mode==='flat')result[k]={rate:n('pr_'+k+'_rate')};else if(mode==='pppn')result[k]={adult:n('pr_'+k+'_adult'),child:n('pr_'+k+'_child'),toddler:n('pr_'+k+'_toddler')};else if(mode==='base_plus_pppn')result[k]={baseRate:n('pr_'+k+'_baseRate'),included:n('pr_'+k+'_included'),extraAdult:n('pr_'+k+'_extraAdult'),extraChild:n('pr_'+k+'_extraChild'),extraToddler:n('pr_'+k+'_extraToddler')};});
  return JSON.stringify(result);
}
function onPricingModeChange(){const sel=document.getElementById('stPricingMode');const mode=sel?.value||'flat';let currentJSON='{}';try{currentJSON=collectPricingJSON(sel?.dataset.prevMode||mode);}catch(e){}const el=document.getElementById('pricingEditorContainer');if(el)el.innerHTML=renderPricingEditor(mode,currentJSON);if(sel)sel.dataset.prevMode=mode;}
function initSeasonRulesDraft(){try{APP._seasonRulesDraft=JSON.parse(APP.state.resortDefaults?.SeasonRulesJSON||'{}');}catch(e){APP._seasonRulesDraft={};}APP._seasonRulesDraft.peak=APP._seasonRulesDraft.peak||[];APP._seasonRulesDraft.shoulder=APP._seasonRulesDraft.shoulder||[];}
function renderSeasonRulesEditor(){
  if(!APP._seasonRulesDraft)initSeasonRulesDraft();
  const rules=APP._seasonRulesDraft;
  const sect=(type,label,color)=>`<div style="margin-bottom:14px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span class="small" style="font-weight:800;color:${color};text-transform:uppercase;letter-spacing:.4px">${label}</span><button class="btn btn-soft" style="height:28px;font-size:11px;padding:0 10px" onclick="addSeasonRange('${type}')">+ Add Range</button></div><div id="srList_${type}">${(rules[type]||[]).map((r,i)=>`<div class="flex" style="margin-bottom:6px;align-items:center;gap:6px"><input class="input" type="date" value="${esc(r.start||'')}" onchange="setSeasonRange('${type}',${i},'start',this.value)" style="flex:1"><span class="small" style="flex-shrink:0">\u2192</span><input class="input" type="date" value="${esc(r.end||'')}" onchange="setSeasonRange('${type}',${i},'end',this.value)" style="flex:1"><button class="btn btn-soft" style="height:40px;padding:0 10px;flex-shrink:0" onclick="removeSeasonRange('${type}',${i})">\u00d7</button></div>`).join('')||'<div class="small" style="color:var(--subtle);padding:4px 0">No ranges configured</div>'}</div></div>`;
  return sect('peak','Peak Season','var(--bad)')+sect('shoulder','Shoulder Season','var(--warn)');
}
function addSeasonRange(type){if(!APP._seasonRulesDraft)initSeasonRulesDraft();(APP._seasonRulesDraft[type]=APP._seasonRulesDraft[type]||[]).push({start:'',end:''});const el=document.getElementById('seasonRulesEditor');if(el)el.innerHTML=renderSeasonRulesEditor();}
function removeSeasonRange(type,i){if(!APP._seasonRulesDraft?.[type])return;APP._seasonRulesDraft[type].splice(i,1);const el=document.getElementById('seasonRulesEditor');if(el)el.innerHTML=renderSeasonRulesEditor();}
function setSeasonRange(type,i,field,value){if(!APP._seasonRulesDraft)initSeasonRulesDraft();const arr=APP._seasonRulesDraft[type];if(arr&&i<arr.length)arr[i][field]=value;}
function updateBookingPriceCalc(){
  const calcEl=document.getElementById('bookingPriceCalc');if(!calcEl)return;
  const standId=document.getElementById('bookingStandId')?.value,checkIn=document.getElementById('bookingCheckInDate')?.value,checkOut=document.getElementById('bookingCheckOutDate')?.value;
  const adults=Number(document.getElementById('bkAdults')?.value||1),children=Number(document.getElementById('bkChildren')?.value||0),toddlers=Number(document.getElementById('bkToddlers')?.value||0);
  if(!standId||!checkIn||!checkOut||checkIn>=checkOut){calcEl.innerHTML='<div class="small" style="color:var(--muted)">Select a stand and valid dates to see a price estimate.</div>';return;}
  const stand=APP.state.stands.find(s=>s.StandID===standId),standType=stand?APP.state.standTypes.find(t=>t.StandTypeID===stand.StandTypeID):null;
  if(!standType?.PricingMode||!standType?.PricingJSON){calcEl.innerHTML='<div class="small" style="color:var(--muted)">No dynamic pricing configured for this stand type yet.</div>';return;}
  const result=calculateStayPrice(checkIn,checkOut,standType,APP.state.resortDefaults,adults,children,toddlers);
  if(!result){calcEl.innerHTML='<div class="small">Unable to calculate price.</div>';return;}
  const totalEl=document.getElementById('bookingTotalAmount');if(totalEl)totalEl.value=String(Math.round(result.total));
  const tc={peak:'var(--bad)',shoulder:'var(--warn)',offPeak:'var(--ok)',weekend:'var(--info)'};
  calcEl.innerHTML=`<div style="margin-top:4px;background:var(--bg);border-radius:10px;padding:10px;border:1px solid var(--border)"><div class="small" style="font-weight:800;margin-bottom:8px">Price Breakdown</div><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:3px 6px;font-size:9.5px;color:var(--muted);text-transform:uppercase">Date</th><th style="text-align:left;padding:3px 6px;font-size:9.5px;color:var(--muted);text-transform:uppercase">Tier</th><th style="text-align:left;padding:3px 6px;font-size:9.5px;color:var(--muted);text-transform:uppercase">Detail</th><th style="text-align:right;padding:3px 6px;font-size:9.5px;color:var(--muted);text-transform:uppercase">Amount</th></tr></thead><tbody>${result.breakdown.map(n=>`<tr style="border-top:1px solid var(--border)"><td style="padding:3px 6px;font-size:11px">${esc(n.date)}</td><td style="padding:3px 6px"><span style="font-size:9.5px;font-weight:800;color:${tc[n.tier]||'var(--muted)'}">${esc(n.tierLabel)}</span></td><td style="padding:3px 6px;font-size:10.5px;color:var(--muted)">${esc(n.detail)}</td><td style="padding:3px 6px;font-size:11px;font-weight:800;text-align:right">${esc(formatMoney(n.rate,result.currency))}</td></tr>`).join('')}</tbody><tfoot><tr style="border-top:2px solid var(--border)"><td colspan="3" style="padding:5px 6px;font-weight:800;font-size:12px">Total \u2014 ${result.breakdown.length} night${result.breakdown.length!==1?'s':''}</td><td style="padding:5px 6px;font-weight:800;font-size:13px;color:var(--brand-d);text-align:right">${esc(formatMoney(result.total,result.currency))}</td></tr></tfoot></table></div>`;
}

function renderStats(){
  const stands=APP.state.stands.filter(s=>!s.SoftDeleted&&truthy(s.Active));
  const allBookings=APP.state.bookings.filter(b=>!b.SoftDeleted);
  const allBlocks=APP.state.blocks.filter(b=>!b.SoftDeleted);
  const dateFilterVal=document.getElementById('dateFilter')?.value||'';
  const range=dateFilterVal?computeDateRange(dateFilterVal):null;
  const filteredBookings=range?allBookings.filter(b=>overlap(b.CheckInDate,b.CheckOutDate,range[0],addDays(range[1],1))):allBookings;
  const filteredBlocks=range?allBlocks.filter(b=>overlap(b.StartDate,b.EndDate,range[0],addDays(range[1],1))):allBlocks;
  const rangeSub=range?'in selected range':'ledger rows';
  const stats=[['Resort',APP.resortName,'ID '+APP.resortId],['Stands',stands.length,'active physical units'],['Bookings',filteredBookings.length,rangeSub],['Maintenance',filteredBlocks.length,range?'in selected range':'active blocks'],['Total Views',APP.resortTotalViews.toLocaleString(),'resort page views']];
  document.getElementById('stats').innerHTML=stats.map(([label,value,sub])=>`<div class="stat"><label>${esc(label)}</label><strong>${esc(value)}</strong><div class="sub">${esc(sub)}</div></div>`).join('');
}
function toggleShowDeactivated(checked){APP.showDeactivated=checked;renderActive();}
function setStandsTab(tab){APP.standsTab=tab;renderActive();renderInspector(null);}
const BOOKING_STATUS_OPTIONS=['inquiry','reserved','confirmed','part-paid','checked-in','cancelled','no-show','completed'];
function populateFilterOptions(view){
  const filterEl=document.getElementById('filter');if(!filterEl)return;
  if(view==='bookings')filterEl.innerHTML=`<option value="">All records</option>`+BOOKING_STATUS_OPTIONS.map(s=>optionHtml(s,s.charAt(0).toUpperCase()+s.slice(1))).join('');
  else filterEl.innerHTML=`<option value="">All records</option>`;
  filterEl.value='';
}
function setView(view,btn){
  // Redirect to dashboard if this role can't access the requested view
  if(!canAccessView(view)){view='dashboard';btn=document.querySelector('.nav button[data-view="dashboard"]');}
  APP.dashboardFilter=null;
  APP.utilFilter=null;
  APP.activeView=view;
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  const titles={dashboard:'Dashboard',availability:'Availability Calendar',stands:'Stands',bookings:'Bookings Lines',bulk:'Bookings Bulk',blocks:'Maintenance',pricing:'Pricing Rules',settings:'Defaults & Settings',users:'User Management'};
  document.getElementById('mainTitle').textContent=titles[view]||'Dashboard';
  populateFilterOptions(view);renderActive();renderInspector(null);
}
function updateToolbarVisibility(){
  const searchEl=document.getElementById('search'),dateFilterEl=document.getElementById('dateFilter'),filterEl=document.getElementById('filter');
  const showSearch=['stands','bookings','blocks'].includes(APP.activeView);
  const showDateFilter=(APP.activeView==='dashboard'&&APP.dashboardTab!=='insights')||APP.activeView==='bookings';
  const showStatusFilter=APP.activeView==='bookings';
  if(searchEl)searchEl.style.display=showSearch?'':'none';
  if(dateFilterEl)dateFilterEl.style.display=showDateFilter?'':'none';
  if(filterEl)filterEl.style.display=showStatusFilter?'':'none';
}
function daysInMonthKey(monthKey){const[y,m]=monthKey.split('-').map(Number);const lastDay=new Date(Date.UTC(y,m,0)).getUTCDate();const days=[];for(let d=1;d<=lastDay;d++)days.push(monthKey+'-'+String(d).padStart(2,'0'));return days;}
function isMatrixWeekend(dayStr){const d=parseDateOnly(dayStr);if(!d)return false;const day=d.getUTCDay();return day===0||day===6;}
function getHolidayName(dayStr){const holidays=APP.state.resortDefaults?.PublicHolidaysList||[];if(!holidays.length||!dayStr)return null;const norm=v=>v?String(v).trim().slice(0,10):'';const hit=holidays.find(h=>norm(h.date)===dayStr||norm(h.observedDate)===dayStr||norm(h.Date)===dayStr||norm(h.ObservedDate)===dayStr);return hit?(hit.name||hit.Name||null):null;}
function renderMatrixDayHeaderCell(day){const dd=day.slice(8,10);const holidayName=getHolidayName(day);const classes=['matrix-daynum'];if(isMatrixWeekend(day))classes.push('weekend');if(holidayName)classes.push('holiday');const title=holidayName?esc(day)+' - '+esc(holidayName):esc(day);return `<th class="${classes.join(' ')}" title="${title}"><div class="matrix-daynum-t">${esc(dd[0])}</div><div class="matrix-daynum-o">${esc(dd[1])}</div></th>`;}
function getStandDayStatus(standId,dayStr){const blockHit=APP.state.blocks.some(b=>!b.SoftDeleted&&b.StandID===standId&&overlap(b.StartDate,b.EndDate,dayStr,addDays(dayStr,1)));if(blockHit)return 'maintenance';const bookingHit=APP.state.bookings.find(b=>!b.SoftDeleted&&b.StandID===standId&&['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,dayStr,addDays(dayStr,1)));if(bookingHit)return String(bookingHit.Status||'').toLowerCase()==='reserved'?'reserved':'booked';return 'available';}
function groupStandsForMatrix(){const stands=activeStands().slice();const groups={};stands.forEach(s=>{const typeId=String(s.StandTypeID||'');const typeLabel=standTypeName(typeId)||'Unassigned';if(!groups[typeLabel])groups[typeLabel]=[];groups[typeLabel].push(s);});const typeLabels=Object.keys(groups).sort((a,b)=>a.localeCompare(b));return typeLabels.map(label=>({label,stands:groups[label].slice().sort((a,b)=>String(a.StandName||'').localeCompare(String(b.StandName||'')))}));}
function stepStandsMatrixMonth(delta){const next=(APP.standsMatrixMonthIndex??0)+delta;if(next<0||next>=APP.monthKeys.length)return;APP.standsMatrixMonthIndex=next;renderActive();}
function renderStandsMatrixRow(stand,days,today){return `<tr><td class="matrix-standcol">${esc([stand.StandNumber,stand.StandName].filter(Boolean).join(' - '))}</td>${days.map(day=>{const isPast=day<today;const status=isPast?'past':getStandDayStatus(stand.StandID,day);const isWeekend=isMatrixWeekend(day);const holidayName=getHolidayName(day);const label=status.charAt(0).toUpperCase()+status.slice(1)+(isPast?' (past)':'')+(holidayName?' \xb7 '+holidayName:'');return `<td><span class="daycell ${status} ${isWeekend?'weekend':''} ${holidayName?'holiday':''}" title="${esc(day)} - ${esc(label)}"></span></td>`;}).join('')}</tr>`;}
function renderStandsAvailabilityMatrixHtml(){
  if(APP.standsMatrixMonthIndex===undefined||APP.standsMatrixMonthIndex===null){const idx0=APP.monthKeys.indexOf(todayMonth());APP.standsMatrixMonthIndex=idx0>=0?idx0:0;}
  const idx=Math.min(Math.max(APP.standsMatrixMonthIndex,0),APP.monthKeys.length-1);
  const monthKey=APP.monthKeys[idx];const today=dateOnly(new Date());const cutoff=addDays(today,-7);
  const days=daysInMonthKey(monthKey).filter(d=>d>=cutoff);
  const groups=groupStandsForMatrix();
  if(!groups.length)return `<div class="section" style="border-top:2px solid var(--border)"><div class="section-t">Availability Calendar</div><div class="small" style="padding:8px 0">No active stands yet.</div></div>`;
  return `<div class="section" style="border-top:2px solid var(--border)"><div class="section-h"><div class="section-t">Availability Calendar</div><div class="matrix-nav"><span class="small" style="font-weight:800">${esc(monthLabel(monthKey))}</span><button class="btn btn-soft" onclick="stepStandsMatrixMonth(-1)" ${idx===0?'disabled':''}>\u2190 Prev</button><button class="btn btn-soft" onclick="stepStandsMatrixMonth(1)" ${idx===APP.monthKeys.length-1?'disabled':''}>Next \u2192</button></div></div><div class="matrix-scroll"><table class="matrix-table"><tbody>${groups.map(g=>`<tr class="matrix-typerow"><td class="matrix-standcol">${esc(g.label)}</td>${days.map(d=>renderMatrixDayHeaderCell(d)).join('')}</tr>${g.stands.map(s=>renderStandsMatrixRow(s,days,today)).join('')}`).join('')}</tbody></table></div><div class="matrix-legend"><span><span class="matrix-dot available"></span>Available</span><span><span class="matrix-dot reserved"></span>Reserved</span><span><span class="matrix-dot booked"></span>Booked / Maintenance</span><span><span class="matrix-dot past"></span>Past date</span><span><span class="matrix-dot holiday"></span>Public holiday</span></div></div>`;
}
function renderActive(){
  updateToolbarVisibility();
  const q=(document.getElementById('search').value||'').trim().toLowerCase();
  const filter=document.getElementById('filter').value;
  const content=document.getElementById('mainContent');
  const left=document.getElementById('toolbarLeft');
  const right=document.getElementById('toolbarRight');
  left.innerHTML='';right.innerHTML='';
  if(APP.activeView==='dashboard'){
    const headingStyle="font-family:'Poppins',sans-serif;font-size:14px;font-weight:800;margin-right:12px;";
    const btnStyle="height:28px;padding:0 12px;font-size:11px;";
    const insightAllowed=APP._insightAllowed!==false;
    // If role lost access to insights, bounce back to dashboard tab
    if(APP.dashboardTab==='insights'&&!insightAllowed)APP.dashboardTab='dashboard';
    document.getElementById('mainTitle').innerHTML=APP.dashboardTab==='insights'
      ?`<button class="btn btn-soft" style="${btnStyle}" onclick="setDashboardTab('dashboard')">Dashboard</button><span style="${headingStyle}margin-left:12px;">\ud83d\udcca Insights</span>`
      :`<span style="${headingStyle}">Dashboard</span>${insightAllowed?`<button class="btn btn-soft" style="${btnStyle}" onclick="setDashboardTab('insights')">\ud83d\udcca Insights</button>`:''}`;

    content.innerHTML=APP.dashboardTab==='insights'?renderInsightsPanel():renderDashboard();return;
  }
  if(APP.activeView==='availability'){
    left.innerHTML='';right.innerHTML='';
    content.innerHTML=renderStandsAvailabilityMatrixHtml();
    return;
  }
  if(APP.activeView==='stands'){
    const hasDeactivated=APP.standsTab==='standTypes'?APP.state.standTypes.some(t=>!t.SoftDeleted&&!truthy(t.Active)):APP.state.stands.some(s=>!s.SoftDeleted&&!truthy(s.Active));
    const deactivatedToggleHtml=hasDeactivated?`<label class="toggle-sw" title="Show deactivated"><input type="checkbox" ${APP.showDeactivated?'checked':''} onchange="toggleShowDeactivated(this.checked)"><span class="track"></span><span class="thumb"></span></label>`:'';
    document.getElementById('mainTitle').innerHTML=`<div class="subtabs"><button class="subtab ${APP.standsTab==='stands'?'on':''}" onclick="setStandsTab('stands')">Stands</button><button class="subtab ${APP.standsTab==='standTypes'?'on':''}" onclick="setStandsTab('standTypes')">Stand Types</button></div>`;
    if(APP.standsTab==='standTypes'){
      left.innerHTML=`<button class="btn btn-brand" onclick="openModal('standTypeModal')">+ Stand Type</button>`;
      right.innerHTML=`${deactivatedToggleHtml}<span class="pill">${APP.state.standTypes.filter(t=>!t.SoftDeleted&&truthy(t.Active)).length} stand types</span>`;
      content.innerHTML=renderStandTypesTable(q)+renderStandsAvailabilityMatrixHtml();return;
    }
    const clearFilterBtn=APP.utilFilter?`<button class="btn btn-soft" onclick="clearStandsFilter()" style="background:var(--brand-l);color:var(--brand-d);border-color:#FED7AA">&#10005; Clear Filter: ${esc(standTypeName(APP.utilFilter))}</button>`:'';
    left.innerHTML=`<button class="btn btn-brand" onclick="tryOpenStandModal()">+ Stand</button><button class="btn btn-soft" onclick="sortByName('stands')">Sort</button>${clearFilterBtn}`;
    right.innerHTML=`${deactivatedToggleHtml}<span class="pill">${APP.state.stands.filter(s=>!s.SoftDeleted&&truthy(s.Active)).length} stands</span>`;
    content.innerHTML=renderStandsTable(q,filter)+renderStandsAvailabilityMatrixHtml();return;
  }
  if(APP.activeView==='bookings'){
    left.innerHTML=`<button class="btn btn-brand" onclick="openModal('bookingModal')">+ Booking</button>`;
    right.innerHTML=`<span class="pill">${APP.state.bookings.length} bookings</span>`;
    if(APP.dashboardFilter){content.innerHTML=renderDashboardFilteredBookings();return;}
    const dateFilterVal=document.getElementById('dateFilter')?.value||'';
    content.innerHTML=renderBookingsTable(q,filter,dateFilterVal);return;
  }
  if(APP.activeView==='bulk'){left.innerHTML=`<button class="btn btn-soft" onclick="rebuildBulk()">Rebuild Cache</button>`;right.innerHTML=`<span class="pill">Months: ${APP.monthKeys.filter(m=>m>=todayMonth()).length}</span>`;content.innerHTML=renderBulkTable(q);return;}
  if(APP.activeView==='blocks'){left.innerHTML=`<button class="btn btn-brand" onclick="openModal('blockModal')">+ Maintenance Block</button>`;content.innerHTML=renderBlocksTable(q);return;}
  if(APP.activeView==='pricing'){content.innerHTML=renderPricingView();return;}
  if(APP.activeView==='settings'){content.innerHTML=renderSettingsView();return;}
  if(APP.activeView==='tiers'&&isKKSuperAdmin()){left.innerHTML=`<button class="btn btn-brand" onclick="openTierModal()">+ Add Tier</button>`;content.innerHTML=`<div class="panel-b"><div class="small" style="color:var(--muted)">Loading tiers…</div></div>`;loadTiersView();return;}
  if(APP.activeView==='users'){
    left.innerHTML=`<button class="btn btn-brand" onclick="openAddUser()">+ Add User</button>`;
    right.innerHTML=`<span class="pill" id="userCountPill">Loading…</span>`;
    content.innerHTML=`<div class="panel-b"><div class="small" style="color:var(--muted)">Loading users…</div></div>`;
    loadUsersView();
    return;
  }
}

function computeDateRange(key){
  const now=new Date();const fmt=d=>d.toISOString().slice(0,10);const todayUTC=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()));const shiftDays=(d,n)=>{const c=new Date(d);c.setUTCDate(c.getUTCDate()+n);return c;};const y=now.getFullYear(),m=now.getMonth();
  switch(key){
    case 'today':return[fmt(todayUTC),fmt(todayUTC)];
    case 'tomorrow':{const t=shiftDays(todayUTC,1);return[fmt(t),fmt(t)];}
    case 'lastWeek':return[fmt(shiftDays(todayUTC,-7)),fmt(shiftDays(todayUTC,-1))];
    case 'thisWeek':{const dow=todayUTC.getUTCDay();const mon=shiftDays(todayUTC,-(dow===0?6:dow-1));return[fmt(mon),fmt(shiftDays(mon,6))];}
    case 'nextWeek':return[fmt(shiftDays(todayUTC,1)),fmt(shiftDays(todayUTC,7))];
    case 'lastMonth':return[fmt(new Date(Date.UTC(y,m-1,1))),fmt(new Date(Date.UTC(y,m,0)))];
    case 'thisMonth':return[fmt(new Date(Date.UTC(y,m,1))),fmt(new Date(Date.UTC(y,m+1,0)))];
    case 'nextMonth':return[fmt(new Date(Date.UTC(y,m+1,1))),fmt(new Date(Date.UTC(y,m+2,0)))];
    case 'lastYear':return[fmt(new Date(Date.UTC(y-1,0,1))),fmt(new Date(Date.UTC(y-1,11,31)))];
    case 'thisYear':return[fmt(new Date(Date.UTC(y,0,1))),fmt(new Date(Date.UTC(y,11,31)))];
    case 'nextYear':return[fmt(new Date(Date.UTC(y+1,0,1))),fmt(new Date(Date.UTC(y+1,11,31)))];
    default:return null;
  }
}
function dateFilterLabel(key){const map={'':'All Time',today:'Today',tomorrow:'Tomorrow',lastWeek:'Last Week',thisWeek:'This Week',nextWeek:'Next Week',lastMonth:'Last Month',thisMonth:'This Month',nextMonth:'Next Month',lastYear:'Last Year',thisYear:'This Year',nextYear:'Next Year'};return map[key]??'Selected Range';}
function getArrivalsInRange(range){return APP.state.bookings.filter(b=>{if(b.SoftDeleted||!['reserved','confirmed','part-paid'].includes(String(b.Status||'').toLowerCase()))return false;const d=displayDate(b.CheckInDate);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);});}
function getDeparturesInRange(range){return APP.state.bookings.filter(b=>{if(b.SoftDeleted||!['checked-in','confirmed','part-paid','reserved'].includes(String(b.Status||'').toLowerCase()))return false;const d=displayDate(b.CheckOutDate);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);});}
function getNewRequestsInRange(range){return APP.state.bookings.filter(b=>{if(b.SoftDeleted)return false;const d=displayDate(b.CreatedAt);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);}).sort((a,b)=>new Date(b.CreatedAt)-new Date(a.CreatedAt));}
function getActiveBlocksInRange(range){return APP.state.blocks.filter(b=>{if(b.SoftDeleted)return false;return!range||overlap(b.StartDate,b.EndDate,range[0],addDays(range[1],1));});}
function getInHouseNow(){const today=dateOnly(new Date());return APP.state.bookings.filter(b=>!b.SoftDeleted&&['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,today,addDays(today,1)));}
function getExpiredReservations(){const now=new Date();return APP.state.bookings.filter(b=>{if(b.SoftDeleted||String(b.Status||'').toLowerCase()!=='reserved'||!b.HoldExpiresAt)return false;const exp=new Date(b.HoldExpiresAt);if(Number.isNaN(exp.getTime()))return false;return exp<now;}).sort((a,b)=>new Date(a.HoldExpiresAt)-new Date(b.HoldExpiresAt));}
function getOverdueCheckouts(){const today=dateOnly(new Date());return APP.state.bookings.filter(b=>!b.SoftDeleted&&String(b.Status||'').toLowerCase()==='checked-in'&&displayDate(b.CheckOutDate)<today);}
function getOverdueCheckins(){const today=dateOnly(new Date());return APP.state.bookings.filter(b=>!b.SoftDeleted&&['reserved','confirmed','part-paid'].includes(String(b.Status||'').toLowerCase())&&displayDate(b.CheckInDate)<today);}
function getOccupancyToday(){const today=dateOnly(new Date());const activeStandsList=APP.state.stands.filter(s=>!s.SoftDeleted);const occupiedStandIds=new Set(APP.state.bookings.filter(b=>!b.SoftDeleted&&['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,today,addDays(today,1))).map(b=>b.StandID));return{percent:activeStandsList.length?Math.round((occupiedStandIds.size/activeStandsList.length)*100):0,occupied:occupiedStandIds.size,total:activeStandsList.length};}
function getRevenueSnapshot(){const today=dateOnly(new Date());const payments=APP.state.payments||[];const todayRevenue=payments.reduce((sum,p)=>{if(displayDate(p.PaidAt)!==today)return sum;const amt=Number(p.Amount||0);return String(p.PaymentType||'').toLowerCase()==='refund'?sum-amt:sum+amt;},0);const outstanding=APP.state.bookings.filter(b=>!b.SoftDeleted&&!['cancelled','no-show','completed'].includes(String(b.Status||'').toLowerCase())).reduce((sum,b)=>sum+Number(b.BalanceSnapshot||0),0);return{todayRevenue,outstanding};}
function getWeekLookahead(){const today=dateOnly(new Date());const days=[];for(let i=0;i<7;i++){const d=addDays(today,i);const arrivals=APP.state.bookings.filter(b=>!b.SoftDeleted&&displayDate(b.CheckInDate)===d&&['reserved','confirmed','part-paid'].includes(String(b.Status||'').toLowerCase())).length;const departures=APP.state.bookings.filter(b=>!b.SoftDeleted&&displayDate(b.CheckOutDate)===d&&['checked-in','confirmed','part-paid','reserved'].includes(String(b.Status||'').toLowerCase())).length;days.push({date:d,arrivals,departures});}return days;}
function getSourceBreakdown(){const counts={};APP.state.bookings.filter(b=>!b.SoftDeleted).forEach(b=>{const src=String(b.Source||'unknown').toLowerCase();counts[src]=(counts[src]||0)+1;});return Object.entries(counts).sort((a,b)=>b[1]-a[1]);}
function getStandTypeUtilization(){
  const today=dateOnly(new Date());const types=APP.state.standTypes.filter(t=>!t.SoftDeleted);
  return types.map(t=>{const standsOfType=APP.state.stands.filter(s=>!s.SoftDeleted&&s.StandTypeID===t.StandTypeID);const occupied=standsOfType.filter(s=>APP.state.bookings.some(b=>!b.SoftDeleted&&b.StandID===s.StandID&&['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,today,addDays(today,1)))).length;return{name:t.StandTypeName||t.StandTypeID,id:t.StandTypeID,occupied,total:standsOfType.length,percent:standsOfType.length?Math.round((occupied/standsOfType.length)*100):0};}).filter(t=>t.total>0);
}
function getSpecialRequests(range){return APP.state.bookings.filter(b=>{if(b.SoftDeleted||['cancelled','no-show','completed'].includes(String(b.Status||'').toLowerCase()))return false;if(!String(b.GuestNotes||'').trim())return false;const d=displayDate(b.CheckInDate);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);});}
function getRepeatGuestsUpcoming(range){const allBookings=APP.state.bookings.filter(b=>!b.SoftDeleted&&String(b.GuestEmail||'').trim());const emailCounts={};allBookings.forEach(b=>{const key=String(b.GuestEmail).trim().toLowerCase();emailCounts[key]=(emailCounts[key]||0)+1;});return allBookings.filter(b=>{if(['cancelled','no-show'].includes(String(b.Status||'').toLowerCase()))return false;if(emailCounts[String(b.GuestEmail).trim().toLowerCase()]<=1)return false;const d=displayDate(b.CheckInDate);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);});}
function getUpcomingHoliday(){
  const today=dateOnly(new Date());
  const cutoff=addDays(today,60);
  const holidays=APP.state.resortDefaults?.PublicHolidaysList||[];
  // Resolve whichever date field is populated into a single _d value
  const resolved=holidays.map(h=>({
    ...h,
    _d:String(h.observedDate||h.ObservedDate||h.date||h.Date||'').trim().slice(0,10)
  })).filter(h=>h._d&&h._d>=today&&h._d<=cutoff)
    .sort((a,b)=>a._d.localeCompare(b._d));
  const upcoming=resolved[0];
  if(!upcoming)return null;
  const activeStandsList=APP.state.stands.filter(s=>!s.SoftDeleted);
  const occupiedStandIds=new Set(APP.state.bookings.filter(b=>
    !b.SoftDeleted&&
    ['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&
    overlap(b.CheckInDate,b.CheckOutDate,upcoming._d,addDays(upcoming._d,1))
  ).map(b=>b.StandID));
  const daysAway=Math.round((parseDateOnly(upcoming._d)-parseDateOnly(today))/86400000);
  return{name:upcoming.name||upcoming.Name,date:upcoming._d,daysAway,available:activeStandsList.length-occupiedStandIds.size,total:activeStandsList.length};
}
function getRecentCancellations(){const weekAgo=addDays(dateOnly(new Date()),-7);return APP.state.bookings.filter(b=>!b.SoftDeleted&&['cancelled','no-show'].includes(String(b.Status||'').toLowerCase())&&displayDate(b.UpdatedAt)>=weekAgo);}
function getRangeRevenueOutstanding(range){const bookings=APP.state.bookings.filter(b=>{if(b.SoftDeleted||['cancelled','no-show'].includes(String(b.Status||'').toLowerCase()))return false;const d=displayDate(b.CheckInDate);if(!d)return false;return!range||(d>=range[0]&&d<=range[1]);});return{bookings,revenue:bookings.reduce((s,b)=>s+Number(b.TotalSnapshot||0),0),outstanding:bookings.reduce((s,b)=>s+Number(b.BalanceSnapshot||0),0)};}
function getWeekStandBreakdown(field){const today=dateOnly(new Date());const weekDates=new Set();for(let i=0;i<7;i++)weekDates.add(addDays(today,i));const statusFilter=field==='CheckInDate'?['reserved','confirmed','part-paid']:['checked-in','confirmed','part-paid','reserved'];const counts={};APP.state.bookings.forEach(b=>{if(b.SoftDeleted||!statusFilter.includes(String(b.Status||'').toLowerCase()))return;const d=displayDate(b[field]);if(!weekDates.has(d))return;counts[b.StandID]=(counts[b.StandID]||0)+1;});return Object.entries(counts).map(([standId,count])=>{const s=APP.state.stands.find(x=>x.StandID===standId);return{standId,label:s?[s.StandNumber,s.StandName].filter(Boolean).join(' - '):standId,count};}).sort((a,b)=>a.label.localeCompare(b.label));}
let dashFilterIdx=0;
function registerRowsFilter(rows,label){const id=dashFilterIdx++;APP.pendingFilters=APP.pendingFilters||{};APP.pendingFilters[id]={rows,label};return id;}
function goToPendingFilter(id){const f=(APP.pendingFilters||{})[id];if(!f)return;const navBtn=document.querySelector('.nav button[data-view="bookings"]');setView('bookings',navBtn);APP.dashboardFilter={rows:f.rows,label:f.label};renderActive();}
function goToStandsFiltered(typeName){
  const navBtn=document.querySelector('.nav button[data-view="stands"]');
  setView('stands',navBtn);
  const searchEl=document.getElementById('search');if(searchEl)searchEl.value=typeName;
  APP.utilFilter=typeName;
  renderActive();
}
function clearStandsFilter(){
  APP.utilFilter=null;
  const searchEl=document.getElementById('search');if(searchEl)searchEl.value='';
  renderActive();
}
function goToDashboardFilter(type,label){const navBtn=document.querySelector('.nav button[data-view="bookings"]');setView('bookings',navBtn);APP.dashboardFilter={type,label};renderActive();}
function clearDashboardFilterAndRender(){APP.dashboardFilter=null;renderStats();renderActive();}
function dashboardFilterList(type){const dateFilterVal=document.getElementById('dateFilter')?.value??'today';const range=dateFilterVal?computeDateRange(dateFilterVal):null;const map={arrivalsRange:()=>getArrivalsInRange(range),departuresRange:()=>getDeparturesInRange(range),newRequestsRange:()=>getNewRequestsInRange(range),inHouse:getInHouseNow,expiredReservations:getExpiredReservations,overdueCheckouts:getOverdueCheckouts};return(map[type]||(() => []))();}
function renderDashboardFilteredBookings(){const rows=APP.dashboardFilter.rows||dashboardFilterList(APP.dashboardFilter.type);return `<div class="panel-b"><div class="notice info flex" style="justify-content:space-between;margin-bottom:12px"><span>Showing: <strong>${esc(APP.dashboardFilter.label)}</strong> (${rows.length})</span><button class="btn btn-soft" onclick="clearDashboardFilterAndRender()">Clear filter</button></div>${renderBookingsRowsTable(rows)}</div>`;}

function renderDashboard(){
  const dateFilterVal=document.getElementById('dateFilter')?.value??'today';const range=dateFilterVal?computeDateRange(dateFilterVal):null;const rangeLabel=dateFilterLabel(dateFilterVal);
  const arrivals=getArrivalsInRange(range),departures=getDeparturesInRange(range),newRequests=getNewRequestsInRange(range),inHouse=getInHouseNow(),expiredReservations=getExpiredReservations(),overdueCheckouts=getOverdueCheckouts(),overdueCheckins=getOverdueCheckins(),activeBlocks=getActiveBlocksInRange(range),occ=getOccupancyToday();
  const tile=(label,count,warn,onclick)=>`<div class="dashtile ${warn?'dashtile-warn':''}" onclick="${onclick}"><div class="dashtile-count">${esc(count)}</div><div class="dashtile-label">${esc(label)}</div></div>`;
  const currency=APP.state.resortDefaults?.DefaultCurrency||'ZAR';const revenue=getRevenueSnapshot();const week=getWeekLookahead();
  const utilization=getStandTypeUtilization();
  const staticTile=(label,value)=>`<div class="dashtile dashtile-static"><div class="dashtile-count">${esc(value)}</div><div class="dashtile-label">${esc(label)}</div></div>`;
  const specialRequests=getSpecialRequests(range),repeatGuests=getRepeatGuestsUpcoming(range),upcomingHoliday=getUpcomingHoliday(),cancellations=getRecentCancellations();
  const attnTiles=[];
  if(specialRequests.length){const id=registerRowsFilter(specialRequests,'Special Requests \xb7 '+rangeLabel);attnTiles.push(tile('Special Requests \xb7 '+rangeLabel,specialRequests.length,false,`goToPendingFilter(${id})`));}
  if(repeatGuests.length){const id=registerRowsFilter(repeatGuests,'Repeat Guests Arriving \xb7 '+rangeLabel);attnTiles.push(tile('Repeat Guests Arriving \xb7 '+rangeLabel,repeatGuests.length,false,`goToPendingFilter(${id})`));}
  if(upcomingHoliday)attnTiles.push(`<div class="dashtile" onclick="goToView('bulk')"><div class="dashtile-count">${esc(upcomingHoliday.daysAway)}d</div><div class="dashtile-label">${esc(upcomingHoliday.name)} \xb7 ${esc(upcomingHoliday.available)}/${esc(upcomingHoliday.total)} free</div></div>`);
  if(cancellations.length){const id=registerRowsFilter(cancellations,'Recent Cancellations / No-shows');attnTiles.push(tile('Cancellations / No-shows',cancellations.length,true,`goToPendingFilter(${id})`));}
  const rangeRevenue=getRangeRevenueOutstanding(range);
  if(rangeRevenue.bookings.length){const id=registerRowsFilter(rangeRevenue.bookings,'Check-ins \xb7 '+rangeLabel);attnTiles.push(`<div class="dashtile" onclick="goToPendingFilter(${id})"><div class="dashtile-count" style="font-size:15px;line-height:1.35">${esc(formatMoney(rangeRevenue.revenue,currency))}<br>${esc(formatMoney(rangeRevenue.outstanding,currency))}</div><div class="dashtile-label">Revenue / Outstanding \xb7 ${esc(rangeLabel)}</div></div>`);}
  const checkInStandBreakdown=getWeekStandBreakdown('CheckInDate'),checkOutStandBreakdown=getWeekStandBreakdown('CheckOutDate');
  const weekDayCard=(title,field,statusFilter,standBreakdown)=>`<div class="card" style="margin:0"><div class="section-t">${esc(title)}</div><div class="weekstrip">${week.map(d=>{const dayRows=APP.state.bookings.filter(b=>!b.SoftDeleted&&statusFilter.includes(String(b.Status||'').toLowerCase())&&displayDate(b[field])===d.date);const id=registerRowsFilter(dayRows,title+' \xb7 '+displayDate(d.date));const count=field==='CheckInDate'?d.arrivals:d.departures;return `<div class="weekday-col" onclick="goToPendingFilter(${id})"><div class="small" style="font-weight:800">${esc((parseDateOnly(d.date)||new Date()).toLocaleDateString('en-ZA',{weekday:'short',timeZone:'UTC'}))}</div><div class="small">${esc(d.date.slice(8,10))}</div><div style="font-size:13px;font-weight:800;color:var(--brand-d);margin-top:4px">${esc(count)}</div></div>`;}).join('')}</div><div class="divider" style="margin:10px 0"></div>${standBreakdown.length?standBreakdown.map(r=>{const id=registerRowsFilter(APP.state.bookings.filter(b=>!b.SoftDeleted&&b.StandID===r.standId&&statusFilter.includes(String(b.Status||'').toLowerCase())&&week.some(d=>d.date===displayDate(b[field]))),title+' \xb7 '+r.label);return `<div class="kv attn-row" style="grid-template-columns:1fr auto" onclick="goToPendingFilter(${id})"><span>${esc(r.label)}</span><strong>${esc(r.count)}</strong></div>`;}).join(''):`<div class="small" style="padding:6px 0">No stands with activity this week.</div>`}</div>`;
  return `<div class="panel-b stack"><div class="notice info">Live overview for <strong>${esc(APP.resortName)}</strong> \u2014 ${esc(new Date().toLocaleDateString('en-ZA',{weekday:'long',year:'numeric',month:'long',day:'numeric'}))}. Date range: <strong>${esc(rangeLabel)}</strong>.</div><div class="dashgrid">${tile('Check-ins Due \xb7 '+rangeLabel,arrivals.length,false,`goToDashboardFilter('arrivalsRange','Check-ins Due \xb7 ${esc(rangeLabel)}')`)}${tile('Check-outs Due \xb7 '+rangeLabel,departures.length,false,`goToDashboardFilter('departuresRange','Check-outs Due \xb7 ${esc(rangeLabel)}')`)}${tile('New Requests \xb7 '+rangeLabel,newRequests.length,false,`goToDashboardFilter('newRequestsRange','New Requests \xb7 ${esc(rangeLabel)}')`)}${tile('Currently In-House',inHouse.length,false,"goToDashboardFilter('inHouse','Currently In-House')")}${tile('Expired Reservations',expiredReservations.length,expiredReservations.length>0,"goToDashboardFilter('expiredReservations','Expired Reservations')")}${(()=>{const warn=overdueCheckins.length>0||overdueCheckouts.length>0;const id=registerRowsFilter([...overdueCheckins,...overdueCheckouts],'Overdue In / Out');return `<div class="dashtile ${warn?'dashtile-warn':''}" onclick="goToPendingFilter(${id})"><div class="dashtile-count">${esc(overdueCheckins.length)}/${esc(overdueCheckouts.length)}</div><div class="dashtile-label">Overdue in / out</div></div>`;})()}${tile('Occupancy Today',occ.percent+'%',false,"goToView('bulk')")}${tile('Blocked / Maintenance \xb7 '+rangeLabel,activeBlocks.length,activeBlocks.length>0,"goToView('blocks')")}</div><div class="section-divider"></div><div class="dashgrid">${(()=>{
      // Revenue tile — always today
      const revTile=`<div class="dashtile dashtile-static" id="tile-today-revenue"><div class="dashtile-count">${esc(formatMoney(revenue.todayRevenue,currency))}</div><div class="dashtile-label">Today's Revenue</div></div>`;
      // Outstanding — all active bookings
      const outTile=`<div class="dashtile dashtile-static" id="tile-outstanding"><div class="dashtile-count">${esc(formatMoney(revenue.outstanding,currency))}</div><div class="dashtile-label">Outstanding Balance</div></div>`;
      // Arrivals/Departures — respect the date filter range
      const arrId=registerRowsFilter(getArrivalsInRange(range),'Arrivals \xb7 '+rangeLabel);
      const depId=registerRowsFilter(getDeparturesInRange(range),'Departures \xb7 '+rangeLabel);
      const arrTile=`<div class="dashtile" id="tile-arrivals" onclick="goToPendingFilter(${arrId})"><div class="dashtile-count">${getArrivalsInRange(range).length}</div><div class="dashtile-label">Arrivals \xb7 ${esc(rangeLabel)}</div></div>`;
      const depTile=`<div class="dashtile" id="tile-departures" onclick="goToPendingFilter(${depId})"><div class="dashtile-count">${getDeparturesInRange(range).length}</div><div class="dashtile-label">Departures \xb7 ${esc(rangeLabel)}</div></div>`;
      // Source breakdown — filter by range
      const rangeBookings=range?APP.state.bookings.filter(b=>{if(b.SoftDeleted)return false;const d=displayDate(b.CheckInDate);return d>=range[0]&&d<=range[1];}):APP.state.bookings.filter(b=>!b.SoftDeleted);
      const srcMap={}; rangeBookings.forEach(b=>{const s=String(b.Source||'unknown').toLowerCase();srcMap[s]=(srcMap[s]||0)+1;});
      const srcTiles=Object.entries(srcMap).map(([src,count])=>{const id=registerRowsFilter(rangeBookings.filter(b=>String(b.Source||'unknown').toLowerCase()===src),src.charAt(0).toUpperCase()+src.slice(1)+' Bookings \xb7 '+rangeLabel);return `<div class="dashtile" id="tile-src-${esc(src)}" onclick="goToPendingFilter(${id})"><div class="dashtile-count">${count}</div><div class="dashtile-label">${esc(src.charAt(0).toUpperCase()+src.slice(1))} Bookings \xb7 ${esc(rangeLabel)}</div></div>`;}).join('');
      // Stand type utilization — occupancy within the filter range
      const utilTiles=utilization.map(u=>`<div class="dashtile" id="tile-util-${esc(u.id)}" onclick="goToStandsFiltered('${esc(u.id)}')"><div class="dashtile-count">${esc(String(u.occupied))}/${esc(String(u.total))}</div><div class="dashtile-label">${esc(u.name)} Utilization</div></div>`).join('');
      return revTile+outTile+arrTile+depTile+srcTiles+utilTiles;
    })()}</div><div class="section-divider"></div><div class="weekgrid">${weekDayCard('Check-ins This Week','CheckInDate',['reserved','confirmed','part-paid'],checkInStandBreakdown)}<div class="week-vdivider"></div>${weekDayCard('Check-outs This Week','CheckOutDate',['checked-in','confirmed','part-paid','reserved'],checkOutStandBreakdown)}</div>${attnTiles.length?`<div class="section-divider"></div><div class="dashgrid">${attnTiles.join('')}</div>`:''}</div>`;
}
function setDashboardTab(tab){APP.dashboardTab=tab;renderActive();}
function setStandPerfSort(sortBy){APP.standPerfSortBy=sortBy;renderActive();}
function setStandPerfMode(mode){APP.standPerfMode=mode;renderActive();}
function goToView(view){const navBtn=document.querySelector('.nav button[data-view="'+view+'"]');setView(view,navBtn);}
function getMonthlyFeeRange(mode){const curMonth=todayMonth();let m;if(mode==='current')m=curMonth;else if(mode==='future')m=addMonths(curMonth,1);else m=addMonths(curMonth,-1);const start=m+'-01',end=addDays(addMonths(m,1)+'-01',-1);return{start,end,label:monthLabel(m)};}
function computeMonthlyFeeBlock(mode){
  const range=getMonthlyFeeRange(mode);
  const todayStr=dateOnly(new Date());
  const bookingsInRange=APP.state.bookings.filter(x=>{
    if(x.SoftDeleted||['cancelled','no-show'].includes(String(x.Status||'').toLowerCase()))return false;
    const coDate=displayDate(x.CheckOutDate);
    if(!coDate||coDate>todayStr)return false; // commission only due after checkout
    return coDate>=range.start&&coDate<=range.end;
  });
  const totalDays=bookingsInRange.reduce((s,x)=>s+Number(x.Nights||0),0);
  const totalRevenue=bookingsInRange.reduce((s,x)=>s+Number(x.TotalSnapshot||0),0);
  let totalFee=0,onlineFee=0,adminFee=0,promoCount=0;
  // Resolve current tier for dynamic fallback
  const kkLevel=(APP.kkbookLevel||'').trim().toUpperCase();
  const tiers=APP.state.tiers||[];
  const activeTier=kkLevel?tiers.find(t=>String(t.TierID||'').trim().toUpperCase()===kkLevel||String(t.TierName||'').trim().toUpperCase()===kkLevel):null;
  const promoEnd=activeTier?String(activeTier.PromoEndDate||'').trim().slice(0,10):'';
  bookingsInRange.forEach(x=>{
    let snap=null;try{snap=JSON.parse(x.CommsSnapshot||'null');}catch(e){}
    if(snap&&typeof snap.commission==='number'&&snap.commission>0){
      // Use stored snapshot (promo already baked in at save time)
      totalFee+=snap.commission;
      if(snap.basis==='online')onlineFee+=snap.commission;else adminFee+=snap.commission;
      if(snap.promoApplied)promoCount++;
    } else if(activeTier){
      // Dynamic fallback — promo based on date booking was MADE (CreatedAt)
      const bookingMadeOn=dateOnly(x.CreatedAt||new Date());
      const usePromo=activeTier&&promoEnd&&bookingMadeOn<=promoEnd;
      const basis=String(x.Source||'').toLowerCase()==='website'?'online':'admin';
      const onlineRate=usePromo?Number(activeTier.PromoOnlineRate||activeTier.OnlineRate||0):Number(activeTier.OnlineRate||0);
      const adminRate=usePromo?Number(activeTier.PromoAdminRate||activeTier.AdminRate||0):Number(activeTier.AdminRate||0);
      const rate=basis==='online'?onlineRate:adminRate;
      const total=Number(x.TotalSnapshot||0);
      const commission=Math.round(total*rate/100*100)/100;
      if(commission>0){
        totalFee+=commission;
        if(basis==='online')onlineFee+=commission;else adminFee+=commission;
        if(usePromo)promoCount++;
      }
    }
  });
  const displayUsePromo=activeTier&&promoEnd&&dateOnly(new Date())<=promoEnd;
  return{label:range.label,totalDays,totalRevenue,fee:totalFee,onlineFee,adminFee,promoCount,bookings:bookingsInRange,activeTier,usePromo:displayUsePromo};
}
function getStandPerfRange(mode){const today=dateOnly(new Date());if(mode==='current'){const m=todayMonth();return{start:m+'-01',end:addDays(addMonths(m,1)+'-01',-1)};}if(mode==='future')return{start:today,end:addDays(today,89)};return{start:addDays(today,-89),end:today};}
function computeStandPerformance(mode){
  const stands=APP.state.stands.filter(s=>!s.SoftDeleted);const range=getStandPerfRange(mode||APP.standPerfMode);const days=[];let d=range.start;while(d<=range.end&&days.length<100){days.push(d);d=addDays(d,1);}
  const results=stands.map(s=>{const revenue=APP.state.bookings.filter(x=>!x.SoftDeleted&&x.StandID===s.StandID&&!['cancelled','no-show'].includes(String(x.Status||'').toLowerCase())).filter(x=>{const cd=displayDate(x.CheckInDate);return cd>=range.start&&cd<=range.end;}).reduce((sum,x)=>sum+Number(x.TotalSnapshot||0),0);let occupiedDays=0;days.forEach(day=>{if(APP.state.bookings.some(x=>!x.SoftDeleted&&x.StandID===s.StandID&&['reserved','confirmed','part-paid','checked-in'].includes(String(x.Status||'').toLowerCase())&&overlap(x.CheckInDate,x.CheckOutDate,day,addDays(day,1))))occupiedDays++;});return{standId:s.StandID,label:[s.StandNumber,s.StandName].filter(Boolean).join(' - '),typeLabel:standTypeName(s.StandTypeID),revenue,occupancyPct:days.length?(occupiedDays/days.length)*100:0};});
  const maxRevenue=Math.max(1,...results.map(r=>r.revenue));results.forEach(r=>{r.revenuePct=Math.round((r.revenue/maxRevenue)*100);});
  const sortKey=APP.standPerfSortBy==='occupancy'?'occupancyPct':'revenue';results.sort((a,b)=>b[sortKey]-a[sortKey]);return results;
}
function computeTrendData(mode){
  const range=getStandPerfRange(mode);const buckets=[];let d=range.start;while(d<=range.end&&buckets.length<100){buckets.push({label:d.slice(5),start:d,end:d});d=addDays(d,1);}
  const labels=buckets.map(b=>b.label);
  const revenueQuoted=buckets.map(b=>APP.state.bookings.filter(x=>!x.SoftDeleted&&!['cancelled','no-show'].includes(String(x.Status||'').toLowerCase())).filter(x=>{const d=displayDate(x.CheckInDate);return d>=b.start&&d<=b.end;}).reduce((s,x)=>s+Number(x.TotalSnapshot||0),0));
  const revenueReceived=buckets.map(b=>(APP.state.payments||[]).filter(p=>{const d=displayDate(p.PaidAt);return d>=b.start&&d<=b.end;}).reduce((s,p)=>{const amt=Number(p.Amount||0);return String(p.PaymentType||'').toLowerCase()==='refund'?s-amt:s+amt;},0));
  const activeStandsList=APP.state.stands.filter(s=>!s.SoftDeleted);
  const occupancy=buckets.map(b=>{if(!activeStandsList.length)return 0;const occupiedIds=new Set(APP.state.bookings.filter(x=>!x.SoftDeleted&&['reserved','confirmed','part-paid','checked-in'].includes(String(x.Status||'').toLowerCase())&&overlap(x.CheckInDate,x.CheckOutDate,b.start,addDays(b.start,1))).map(x=>x.StandID));return(occupiedIds.size/activeStandsList.length)*100;});
  return{labels,revenueQuoted,revenueReceived,occupancy};
}
function svgSingleLineChart(labels,values,formatFn,fixedMax=null){const width=560,height=220,padding=30,paddingLeft=54;const max=fixedMax!==null?fixedMax:Math.max(1,...values);const stepX=labels.length>1?(width-paddingLeft-padding)/(labels.length-1):0;const pts=values.map((v,i)=>[paddingLeft+i*stepX,height-padding-(v/max)*(height-padding*2)]);const path=pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');const showEvery=Math.max(1,Math.ceil(labels.length/8));const yTicks=[0,.25,.5,.75,1].map(f=>f*max);return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;flex:1;min-height:0;display:block;">${yTicks.map(t=>{const y=height-padding-(t/max)*(height-padding*2);return `<line x1="${paddingLeft}" y1="${y.toFixed(1)}" x2="${width-padding}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="${t===0?'none':'2 2'}"/><text x="${paddingLeft-6}" y="${(y+3).toFixed(1)}" font-size="10.6" fill="var(--muted)" text-anchor="end">${esc(formatFn(t))}</text>`;}).join('')}<path d="${path}" fill="none" stroke="var(--ok)" stroke-width="2.5"/>${pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.5" fill="var(--ok)"><title>${esc(labels[i])}: ${esc(formatFn(values[i]))}</title></circle>`).join('')}${pts.map((p,i)=>i%showEvery===0?`<text x="${p[0].toFixed(1)}" y="${height-8}" font-size="10.6" fill="var(--muted)" text-anchor="middle">${esc(labels[i])}</text>`:'').join('')}</svg>`;}
function svgDualLineChart(labels,valuesA,valuesB,labelA,labelB,formatFn){const width=560,height=220,padding=30,paddingLeft=54,max=Math.max(1,...valuesA,...valuesB),stepX=labels.length>1?(width-paddingLeft-padding)/(labels.length-1):0;const toPts=vals=>vals.map((v,i)=>[paddingLeft+i*stepX,height-padding-(v/max)*(height-padding*2)]);const ptsA=toPts(valuesA),ptsB=toPts(valuesB);const pathOf=pts=>pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');const showEvery=Math.max(1,Math.ceil(labels.length/8));const yTicks=[0,.25,.5,.75,1].map(f=>f*max);return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;flex:1;min-height:0;display:block;">${yTicks.map(t=>{const y=height-padding-(t/max)*(height-padding*2);return `<line x1="${paddingLeft}" y1="${y.toFixed(1)}" x2="${width-padding}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="${t===0?'none':'2 2'}"/><text x="${paddingLeft-6}" y="${(y+3).toFixed(1)}" font-size="8.8" fill="var(--muted)" text-anchor="end">${esc(formatFn(t))}</text>`;}).join('')}<path d="${pathOf(ptsA)}" fill="none" stroke="var(--brand)" stroke-width="2.5"/><path d="${pathOf(ptsB)}" fill="none" stroke="var(--info)" stroke-width="2.5" stroke-dasharray="4 3"/>${ptsA.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.2" fill="var(--brand)"><title>${esc(labelA)} ${esc(labels[i])}: ${esc(formatFn(valuesA[i]))}</title></circle>`).join('')}${ptsB.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.2" fill="var(--info)"><title>${esc(labelB)} ${esc(labels[i])}: ${esc(formatFn(valuesB[i]))}</title></circle>`).join('')}${ptsA.map((p,i)=>i%showEvery===0?`<text x="${p[0].toFixed(1)}" y="${height-8}" font-size="9.7" fill="var(--muted)" text-anchor="middle">${esc(labels[i])}</text>`:'').join('')}<g transform="translate(${paddingLeft},14)"><rect width="9" height="9" fill="var(--brand)"/><text x="13" y="8" font-size="9.9" fill="var(--muted)">${esc(labelA)}</text><rect x="70" width="9" height="9" fill="var(--info)"/><text x="83" y="8" font-size="9.9" fill="var(--muted)">${esc(labelB)}</text></g></svg>`;}
function renderInsightsPanel(){
  const trend=computeTrendData(APP.standPerfMode),standPerf=computeStandPerformance(APP.standPerfMode),feeBlock=computeMonthlyFeeBlock(APP.standPerfMode),currency=APP.state.resortDefaults?.DefaultCurrency||'ZAR';
  return `<div class="section" style="border-top:none;padding-top:0"><div class="section-h"><div class="section-t">Trends</div><select class="select" style="width:auto;height:28px;padding:0 10px;font-size:11px" onchange="setStandPerfMode(this.value)"><option value="history" ${APP.standPerfMode==='history'?'selected':''}>History - previous 90 days</option><option value="current" ${APP.standPerfMode==='current'?'selected':''}>Current - this calendar month</option><option value="future" ${APP.standPerfMode==='future'?'selected':''}>Future - next 90 days</option></select></div><div class="snapgrid" style="margin-bottom:20px"><div style="grid-column:span 2;padding:14px;background:#fff;border:1px solid var(--border);border-radius:14px;display:flex;flex-direction:column;cursor:pointer" onclick="openGraphModal(this,'Revenue \u2014 Quoted vs Received')" title="Click to zoom"><div class="small" style="font-weight:800;margin-bottom:8px">Revenue \u2014 Quoted vs Received</div>${svgDualLineChart(trend.labels,trend.revenueQuoted,trend.revenueReceived,'Quoted','Received',v=>formatMoney(v,currency))}</div><div style="padding:14px;background:#fff;border:1px solid var(--border);border-radius:14px;display:flex;flex-direction:column;cursor:pointer" onclick="openGraphModal(this,'Occupancy %')" title="Click to zoom"><div class="small" style="font-weight:800;margin-bottom:8px">Occupancy %</div>${svgSingleLineChart(trend.labels,trend.occupancy,v=>Math.round(v)+'%',100)}</div><div style="padding:14px;background:#fff;border:1px solid var(--border);border-radius:14px;min-width:0;overflow:hidden;cursor:pointer" onclick="openCommsSplitModal()" title="Tap for split"><div class="small" style="font-weight:800;margin-bottom:6px">KampKiepie Commission \u2014 ${esc(feeBlock.label)}</div><div style="margin-bottom:10px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted);font-weight:800">Booking Days</div><div style="font-family:'Poppins',sans-serif;font-weight:800;font-size:16px;color:var(--text)">${esc(feeBlock.totalDays)}</div></div><div style="margin-bottom:10px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted);font-weight:800">Total Revenue</div><div style="font-family:'Poppins',sans-serif;font-weight:800;font-size:16px;color:var(--text);word-break:break-word">${esc(formatMoney(feeBlock.totalRevenue,currency))}</div></div><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted);font-weight:800">KK Commission${feeBlock.activeTier?` — ${esc(feeBlock.activeTier.TierID)}`:''}</div><div style="font-family:'Poppins',sans-serif;font-weight:800;font-size:16px;color:var(--brand-d);word-break:break-word">${esc(formatMoney(feeBlock.fee,currency))}</div>${feeBlock.activeTier?`<div style="font-size:10px;color:var(--muted);margin-top:2px">${feeBlock.usePromo?'Promo: '+esc(feeBlock.activeTier.PromoOnlineRate||0)+'% / '+esc(feeBlock.activeTier.PromoAdminRate||0)+'% (promo)':esc(feeBlock.activeTier.OnlineRate||0)+'% online / '+esc(feeBlock.activeTier.AdminRate||0)+'% admin'}</div>`:''} ${feeBlock.promoCount?`<div style="font-size:10px;color:var(--warn);font-weight:700;margin-top:2px">⚡ ${feeBlock.promoCount} promo rate</div>`:''}${!feeBlock.activeTier?`<div style="font-size:10px;color:var(--bad);margin-top:4px;font-weight:700">${(APP.state.tiers||[]).length===0?'No tiers loaded — check GAS deployment':'Level \"'+esc(APP.kkbookLevel||'none')+'\" not matched in '+(APP.state.tiers||[]).length+' tier(s)'}</div>`:''}<div style="margin-top:6px;font-size:10px;color:var(--muted);font-weight:700">Tap for split →</div></div></div></div><div class="section-h" style="padding:0 0 10px"><div class="section-t" style="font-size:13px">Stand Performance</div><div class="flex"><button class="btn ${APP.standPerfSortBy==='revenue'?'btn-brand':'btn-soft'}" style="height:28px;font-size:11px;padding:0 10px" onclick="setStandPerfSort('revenue')">Sort: Revenue</button><button class="btn ${APP.standPerfSortBy==='occupancy'?'btn-brand':'btn-soft'}" style="height:28px;font-size:11px;padding:0 10px" onclick="setStandPerfSort('occupancy')">Sort: Occupancy</button></div></div><div class="table-wrap"><table><thead><tr><th>Stand</th><th>Type</th><th>Revenue</th><th></th><th>Occupancy</th><th></th></tr></thead><tbody>${standPerf.map(s=>`<tr><td><strong>${esc(s.label)}</strong></td><td class="small">${esc(s.typeLabel)}</td><td>${esc(formatMoney(s.revenue,currency))}</td><td style="width:80px"><div style="background:var(--bg);border-radius:4px;overflow:hidden;height:8px;width:100%"><div style="background:var(--brand);height:100%;width:${s.revenuePct}%"></div></div></td><td>${Math.round(s.occupancyPct)}%</td><td style="width:80px"><div style="background:var(--bg);border-radius:4px;overflow:hidden;height:8px;width:100%"><div style="background:var(--ok);height:100%;width:${s.occupancyPct}%"></div></div></td></tr>`).join('')}</tbody></table></div></div>`;
}

function renderStandsTable(q){const rows=APP.state.stands.filter(s=>!s.SoftDeleted).filter(s=>APP.showDeactivated||truthy(s.Active)).filter(s=>{if(!q)return true;return[s.StandID,s.StandNumber,s.StandName,s.DisplayName,s.ResortID,s.StandTypeID].some(v=>String(v||'').toLowerCase().includes(q));});return `<table><thead><tr><th>Stand</th><th>Type</th><th>Rates</th><th>Occupancy</th><th>Status</th></tr></thead><tbody>${rows.map(s=>`<tr onclick="selectStand('${s.StandID}')"><td><div><strong>${esc(s.StandNumber)}</strong></div><div class="small">${esc(s.StandName)}</div></td><td><strong>${esc(standTypeName(s.StandTypeID))}</strong><div class="small mono">${esc(s.StandTypeID)}</div></td><td><div class="small">Base: ${esc(s.BaseRate)} | Peak: ${esc(s.PeakRate)} | Off-peak: ${esc(s.OffPeakRate)}</div></td><td><div class="small">Adults ${esc(s.MaxAdults)} | Children ${esc(s.MaxChildren)} | Toddlers ${esc(s.MaxToddlers)}</div></td><td>${s.Active?'<span class="chip ok">Active</span>':'<span class="chip bad">Inactive</span>'}</td></tr>`).join('')}</tbody></table>`;}
function renderStandTypesTable(q){const rows=APP.state.standTypes.filter(t=>!t.SoftDeleted).filter(t=>APP.showDeactivated||truthy(t.Active)).filter(t=>{if(!q)return true;return[t.StandTypeID,t.StandTypeName,t.ResortID].some(v=>String(v||'').toLowerCase().includes(q));});return `<table><thead><tr><th>Type</th><th>Rates</th><th>Deposit</th><th>Stay Rules</th><th>Occupancy</th><th>Status</th></tr></thead><tbody>${rows.map(t=>{let occ={};try{occ=JSON.parse(t.DefaultOccupancyJSON||'{}')}catch(e){};return `<tr onclick="selectStandType('${esc(t.StandTypeID)}')"><td><div><strong>${esc(t.StandTypeName)}</strong></div><div class="small mono">${esc(t.StandTypeID)}</div></td><td><div class="small" style="font-weight:800">${esc(t.PricingMode||'legacy')}</div>${t.PricingMode?`<div class="small" style="color:var(--ok)">Dynamic pricing configured</div>`:`<div class="small">Base ${esc(t.DefaultBaseRate)} | Peak ${esc(t.DefaultPeakRate)}</div>`}</td><td class="small">${esc(t.DefaultDepositMode)} ${esc(t.DefaultDepositValue)}</td><td><div class="small">Nights ${esc(t.DefaultMinNights)}\u2013${esc(t.DefaultMaxNights)}</div><div class="small">Lead ${esc(t.DefaultLeadTimeDays)}d | Hold ${esc(Math.round((t.DefaultHoldMinutes||0)/60))}h</div></td><td class="small">${esc(occ.adults??0)}A ${esc(occ.children??0)}C ${esc(occ.toddlers??0)}T</td><td>${truthy(t.Active)?'<span class="chip ok">Active</span>':'<span class="chip bad">Inactive</span>'}</td></tr>`;}).join('')}</tbody></table>`;}
function renderBookingsTable(q,filter,dateFilter){
  const range=dateFilter?computeDateRange(dateFilter):null;
  const rows=APP.state.bookings.filter(b=>!b.SoftDeleted).filter(b=>{if(filter&&String(b.Status||'').toLowerCase()!==filter.toLowerCase())return false;if(range){const inDate=displayDate(b.CheckInDate),outDate=displayDate(b.CheckOutDate);if(!(inDate&&inDate>=range[0]&&inDate<=range[1])&&!(outDate&&outDate>=range[0]&&outDate<=range[1]))return false;}if(!q)return true;return[b.BookingID,b.BookingRef,b.GuestFullName,b.StandID,b.Status,b.Source,b.CheckInDate,b.CheckOutDate].some(v=>String(v||'').toLowerCase().includes(q));}).sort((a,b)=>displayDate(a.CheckInDate).localeCompare(displayDate(b.CheckInDate)));
  return renderBookingsRowsTable(rows);
}
function renderQuickStatusButton(b){
  const today=dateOnly(new Date()),status=String(b.Status||'').toLowerCase(),ciDate=displayDate(b.CheckInDate),coDate=displayDate(b.CheckOutDate);
  if(ciDate&&ciDate<=today&&['reserved','confirmed','part-paid'].includes(status)){const lbl=ciDate<today?'Check-in (overdue)':'Check-in';return `<button class="btn btn-ok" style="width:100%;margin-top:6px;height:24px;font-size:9.9px;white-space:nowrap" onclick="event.stopPropagation(); checkBalanceBeforeStatus('${esc(b.BookingID)}','checked-in',true)">${lbl}</button>`;}
  if(coDate&&coDate<=today&&status==='checked-in'){const lbl=coDate<today?'Check-out (overdue)':'Check-out';return `<button class="btn btn-soft" style="width:100%;margin-top:6px;height:24px;font-size:9.9px;white-space:nowrap" onclick="event.stopPropagation(); checkBalanceBeforeStatus('${esc(b.BookingID)}','completed',true)">${lbl}</button>`;}
  return '';
}
function showActionModal(msg){document.getElementById('actionModalMsg').textContent=msg;document.getElementById('actionModalErr').style.display='none';document.getElementById('actionModalErr').textContent='';document.getElementById('actionModalClose').style.display='none';document.getElementById('actionModalSpin').style.display='block';document.getElementById('actionModal').classList.add('on');}
function actionModalSuccess(msg){document.getElementById('actionModalMsg').textContent=msg||'Done!';document.getElementById('actionModalSpin').style.display='none';setTimeout(closeActionModal,1200);}
function actionModalError(errMsg){document.getElementById('actionModalErr').textContent=errMsg;document.getElementById('actionModalErr').style.display='';document.getElementById('actionModalSpin').style.display='none';document.getElementById('actionModalClose').style.display='';}
function closeActionModal(){document.getElementById('actionModal').classList.remove('on');}
async function quickStatusChangeFromRow(bookingId,newStatus,sendEmail,emailEventType,oldStatusOverride){
  const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);if(!booking)return;
  const guestName=esc(booking.GuestFullName||booking.GuestFirstName||'Guest');
  const actionLabel=newStatus==='checked-in'?'Checking in ':newStatus==='checked-out'?'Checking out ':'Updating ';
  showActionModal(actionLabel+guestName+'\u2026');
  try{
    const res=await sbChangeBookingStatus(bookingId,newStatus,APP.userEmail||APP.role||'admin');
    if(!res.success){actionModalError(res.error||'Could not update status');return;}
    booking.Status=newStatus;booking.UpdatedAt=new Date().toISOString();
    buildBulk();renderStats();renderActive();
    if(APP.selected&&APP.selected.kind==='booking'&&APP.selected.data.BookingID===bookingId)selectBooking(bookingId);
    const doneLabel=newStatus==='checked-in'?'Checked in \u2713':newStatus==='checked-out'?'Checked out \u2713':'Updated \u2713';
    actionModalSuccess(doneLabel+' \u2014 '+guestName);
    if(sendEmail){const et=emailEventType||(newStatus==='checked-in'?'check_in':newStatus==='completed'?'check_out':'status_change');await sendBookingEmailToGuest(bookingId,et,{newStatus,oldStatus:oldStatusOverride||''});}
  }catch(err){actionModalError('Could not update status: '+(err.message||err));}
}
function renderBookingsRowsTable(rows){return `<table><thead><tr><th>Ref</th><th>Guest</th><th>Stand</th><th>Dates</th><th>Guests</th><th>Status</th><th>Total</th></tr></thead><tbody>${rows.map(b=>`<tr onclick="selectBooking('${b.BookingID}')"><td class="mono">${esc(b.BookingRef)}</td><td><strong>${esc(b.GuestFullName)}</strong><div class="small">${esc(b.GuestEmail)}</div><div class="small">${esc(b.GuestPhone)}</div></td><td>${(()=>{const s=APP.state.stands.find(x=>x.StandID===b.StandID);return s?`<div>${esc(s.StandNumber)}</div><div class="small">${esc(s.StandName)}</div>`:`<span class="mono">${esc(b.StandID)}</span>`;})()}</td><td>${esc(displayDate(b.CheckInDate))} \u2192 ${esc(displayDate(b.CheckOutDate))}<div class="small">${esc(b.Nights)} nights</div></td><td>${esc(b.Adults)}A ${esc(b.Children)}C ${esc(b.Toddlers)}T</td><td>${bookingStatusChip(b.Status)}${b.HoldExpiresAt&&String(b.Status||'').toLowerCase()==='reserved'?`<div class="small">${new Date(b.HoldExpiresAt)<new Date()?'Hold expired':'Hold until'} ${esc(new Date(b.HoldExpiresAt).toLocaleString('en-ZA',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}))}</div>`:''} ${renderQuickStatusButton(b)}</td><td>${esc(formatMoney(b.TotalSnapshot,b.Currency))}${b.BalanceSnapshot!==undefined&&b.BalanceSnapshot!==''?`<div class="small">Outstanding: ${esc(formatMoney(b.BalanceSnapshot,b.Currency))}</div>`:''}</td></tr>`).join('')}</tbody></table>`;}
function renderBulkTable(q){const stands=APP.state.stands.filter(s=>!s.SoftDeleted);const currentMonth=todayMonth();const futureMonths=APP.months.filter(m=>m.key>=currentMonth);const futureMonthKeys=APP.monthKeys.filter(m=>m>=currentMonth);return `<table><thead><tr><th>Stand</th>${futureMonths.map(m=>`<th>${esc(m.label)}</th><th>${esc(m.label)} Map</th>`).join('')}</tr></thead><tbody>${stands.map(s=>`<tr><td>${esc(s.StandNumber)} ${esc(s.StandName)}</td>${futureMonthKeys.map(month=>{const cells=APP.state.bulk[s.StandID]?.[month]||[],map=APP.state.bulk[s.StandID]?.[month+'m']||{},occupiedCount=map.occupied?Object.values(map.occupied).filter(Boolean).length:0;return `<td class="bulkcell" title="${esc(JSON.stringify(cells))}">${cells.length?esc(String(cells.length)):'<span class="small">Empty</span>'}</td><td class="bulkcell" title="${esc(JSON.stringify(map))}">${map.days?esc(String(occupiedCount)):'<span class="small">Empty</span>'}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;}
function renderBlocksTable(q){const rows=APP.state.blocks.filter(b=>!b.SoftDeleted).filter(b=>{if(!q)return true;return[b.BlockID,b.StandID,b.BlockType,b.Reason,b.StartDate,b.EndDate].some(v=>String(v||'').toLowerCase().includes(q));});return `<table><thead><tr><th>Block</th><th>Stand</th><th>Range</th><th>Type</th><th>Reason</th></tr></thead><tbody>${rows.map(b=>`<tr onclick="selectBlock('${b.BlockID}')"><td class="mono">${esc(b.BlockID)}</td><td class="mono">${esc(b.StandID)}</td><td>${esc(displayDate(b.StartDate))} \u2192 ${esc(displayDate(b.EndDate))}</td><td><span class="chip info">${esc(b.BlockType)}</span></td><td>${esc(b.Reason)}</td></tr>`).join('')}</tbody></table>`;}
function renderPricingView(){
  const rows=APP.state.standTypes.filter(t=>!truthy(t.SoftDeleted));
  const body=rows.map(t=>{
    let occ={};try{occ=JSON.parse(t.DefaultOccupancyJSON||"{}")}catch(e){}
    const dep=(t.DefaultDepositMode||"").toLowerCase()==="percentage"
      ? "Perc "+t.DefaultDepositValue+"%"
      : "Fixed R"+t.DefaultDepositValue;
    const occStr=(occ.adults??0)+" Adults · "+(occ.children??0)+" Children · "+(occ.toddlers??0)+" Toddlers";
    const rateCell=t.PricingMode
      ? '<span style="color:var(--ok);font-weight:800">'+esc(t.PricingMode)+'</span>'
      : "Base "+esc(t.DefaultBaseRate)+" | Peak "+esc(t.DefaultPeakRate);
    return '<tr onclick="selectStandType(\''+t.StandTypeID+'\')">'
      +'<td><strong>'+esc(t.StandTypeName)+'</strong></td>'
      +'<td class="small">'+rateCell+'</td>'
      +'<td class="small">'+esc(dep)+'</td>'
      +'<td><div class="small">Nights '+esc(t.DefaultMinNights)+'\u2013'+esc(t.DefaultMaxNights)+'</div>'
      +'<div class="small">Lead '+esc(t.DefaultLeadTimeDays)+'d | Hold '+esc(Math.round((t.DefaultHoldMinutes||0)/60))+'h</div></td>'
      +'<td class="small">'+esc(occStr)+'</td>'
      +(truthy(t.Active)?'<td><span class="chip ok">Active</span></td>':'<td><span class="chip bad">Inactive</span></td>')
      +'</tr>';
  }).join("");
  return '<div class="panel-b stack">'
    +'<div class="notice warn">Pricing logic lives inside each stand type. Click a row to edit rates.</div>'
    +'<div class="section"><div class="section-h"><div class="section-t">Stand Type Defaults</div></div>'
    +'<div class="table-wrap"><table><thead><tr>'
    +'<th>Type</th><th>Rates</th><th>Deposit</th><th>Stay Rules</th><th>Occupancy</th><th>Status</th>'
    +'</tr></thead><tbody>'+body+'</tbody></table></div></div></div>';
}
function renderSettingsView(){
  initSeasonRulesDraft();
  const d=APP.state.resortDefaults||{};
  const extractTime=v=>{const s=String(v||'');const m=s.match(/(\d{1,2}:\d{2})/);return m?m[1]:s;};
  return `<div class="panel-b stack"><div class="notice info">Resort defaults are the base layer. Stand type defaults override them, and stand-level rates win on top.</div>
    <div class="section"><div class="section-h"><div class="section-t">General</div></div><div class="form-grid">
      <div class="field"><label>Currency</label><input class="input" id="rdCurrency" value="${esc(d.DefaultCurrency||'ZAR')}"></div>
      <div class="field"><label>Check-In Time</label><input class="input" id="rdCheckIn" value="${esc(extractTime(d.DefaultCheckInTime)||'14:00')}"></div>
      <div class="field"><label>Check-Out Time</label><input class="input" id="rdCheckOut" value="${esc(extractTime(d.DefaultCheckOutTime)||'10:00')}"></div>
      <div class="field"><label>Hold Hours</label><input class="input" id="rdHoldHours" type="number" min="0" step="0.5" value="${esc(Math.round((Number(d.DefaultHoldMinutes||120))/60*10)/10)}"></div>
      <div class="field"><label>Min Nights</label><input class="input" id="rdMinNights" value="${esc(d.DefaultMinNights??1)}"></div>
      <div class="field"><label>Max Nights</label><input class="input" id="rdMaxNights" value="${esc(d.DefaultMaxNights??21)}"></div>
      <div class="field"><label>Deposit Mode</label><select class="select" id="rdDepositMode">${optionHtml('percentage','percentage',String(d.DefaultDepositMode||'percentage')==='percentage')}${optionHtml('fixed','fixed',String(d.DefaultDepositMode||'')==='fixed')}</select></div>
      <div class="field"><label>Deposit Value</label><input class="input" id="rdDepositValue" value="${esc(d.DefaultDepositValue??30)}"></div>
    </div></div>
    <div class="section"><div class="section-h"><div class="section-t">Age Brackets &amp; Pricing</div></div><div class="form-grid">
      <div class="field"><label>Toddler Max Age</label><input class="input" id="rdAgeToddlerMax" type="number" min="0" value="${esc(d.AgeToddlerMax??2)}"></div>
      <div class="field"><label>Child Max Age</label><input class="input" id="rdAgeChildMax" type="number" min="0" value="${esc(d.AgeChildMax??12)}"></div>
      <div class="field full"><label>Pre-Holiday Night Treatment</label>
        <select class="select" id="rdPreHolidayTreatment">
          ${optionHtml('peak','Peak',String(d.PreHolidayTreatment||'offPeak')==='peak')}
          ${optionHtml('shoulder','Shoulder',String(d.PreHolidayTreatment||'')==='shoulder')}
          ${optionHtml('offPeak','Off-Peak',!d.PreHolidayTreatment||d.PreHolidayTreatment==='offPeak')}
          ${optionHtml('weekend','Weekend',String(d.PreHolidayTreatment||'')==='weekend')}
        </select>
      </div>
    </div></div>
    <div class="section"><div class="section-h"><div class="section-t">Season Date Ranges</div><div class="small" style="color:var(--muted)">YYYY-MM-DD</div></div>
      <div id="seasonRulesEditor">${renderSeasonRulesEditor()}</div>
    </div>
    <div class="flex" style="justify-content:flex-end;padding:0 14px 14px">
      <button class="btn btn-brand" id="rdSaveBtn" onclick="saveResortDefaults()">Save Defaults</button>
    </div>
    <div id="rdSaveMsg" style="padding:0 14px 14px"></div>
  </div>`;
}
async function saveResortDefaults(){
  const msg=document.getElementById('rdSaveMsg'),btn=document.getElementById('rdSaveBtn');
  if(msg)msg.innerHTML=`<div class="notice info">Saving\u2026</div>`;if(btn)btn.disabled=true;
  try{
    const holdHours=Number(document.getElementById('rdHoldHours')?.value||2);
    const existing=Object.assign({},APP.state.resortDefaults);delete existing.PublicHolidaysList;
    const body=Object.assign(existing,{ResortID:APP.resortId,DefaultCurrency:document.getElementById('rdCurrency')?.value||'ZAR',DefaultCheckInTime:document.getElementById('rdCheckIn')?.value||'14:00',DefaultCheckOutTime:document.getElementById('rdCheckOut')?.value||'10:00',DefaultHoldMinutes:Math.round(holdHours*60),DefaultMinNights:document.getElementById('rdMinNights')?.value||1,DefaultMaxNights:document.getElementById('rdMaxNights')?.value||21,DefaultDepositMode:document.getElementById('rdDepositMode')?.value||'percentage',DefaultDepositValue:document.getElementById('rdDepositValue')?.value||0,AgeToddlerMax:document.getElementById('rdAgeToddlerMax')?.value||2,AgeChildMax:document.getElementById('rdAgeChildMax')?.value||12,PreHolidayTreatment:document.getElementById('rdPreHolidayTreatment')?.value||'offPeak',SeasonRulesJSON:JSON.stringify(APP._seasonRulesDraft||{peak:[],shoulder:[]}),Active:true,SoftDeleted:false});
    const res=await sbUpsertResortDefaults(body);if(!res.success)throw new Error(res.error||'Save failed');
    APP.state.resortDefaults=Object.assign({},APP.state.resortDefaults,body);
    if(msg)msg.innerHTML=`<div class="notice ok">Saved.</div>`;setTimeout(()=>{if(msg)msg.innerHTML='';},3000);
  }catch(err){if(msg)msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;}finally{if(btn)btn.disabled=false;}
}
function computeSuggestedDeposit(b){
  const total=Number(b.TotalSnapshot||0);if(!total)return null;
  const stand=APP.state.stands.find(s=>s.StandID===b.StandID),standType=stand?APP.state.standTypes.find(t=>t.StandTypeID===stand.StandTypeID):null,defaults=APP.state.resortDefaults||{};
  let mode,value,source;
  if(stand&&stand.DepositMode&&stand.DepositValue!==undefined&&stand.DepositValue!==''){mode=stand.DepositMode;value=Number(stand.DepositValue);source='stand override';}
  else if(standType&&standType.DefaultDepositMode&&standType.DefaultDepositValue!==undefined&&standType.DefaultDepositValue!==''){mode=standType.DefaultDepositMode;value=Number(standType.DefaultDepositValue);source='stand type default';}
  else if(defaults.DefaultDepositMode&&defaults.DefaultDepositValue!==undefined&&defaults.DefaultDepositValue!==''){mode=defaults.DefaultDepositMode;value=Number(defaults.DefaultDepositValue);source='resort default';}
  else return null;
  const amount=String(mode).toLowerCase()==='fixed'?value:Math.round(total*(value/100));
  return{amount,mode:String(mode).toLowerCase(),value,source};
}
function renderInspector(record){
  const box=document.getElementById('inspector');
  if(!record){if(APP.activeView==='settings'){box.innerHTML=renderHolidaysInspector();return;}box.innerHTML='<div class="notice warn">No record selected yet. Click a row to inspect it here.</div><div class="small">Use this pane to inspect stands, bookings, and blocks.</div>';return;}
  if(record.kind==='stand'){const s=record.data;box.innerHTML=`<div class="notice ok">Stand selected</div><div class="kv"><span>StandID</span><strong class="mono">${esc(s.StandID)}</strong></div><div class="kv"><span>Name</span><strong>${esc(s.StandName)}</strong></div><div class="kv"><span>Type</span><strong>${esc(standTypeName(s.StandTypeID))} <span class="small mono">${esc(s.StandTypeID)}</span></strong></div><div class="kv"><span>Rates</span><strong>Base ${esc(s.BaseRate)} / Peak ${esc(s.PeakRate)} / Off ${esc(s.OffPeakRate)}</strong></div><div class="kv"><span>Occupancy</span><strong>${esc(s.MaxAdults)}A ${esc(s.MaxChildren)}C ${esc(s.MaxToddlers)}T</strong></div><div class="divider"></div><div class="small">${esc(s.Description||'No description')}</div><button class="btn btn-soft" style="width:100%" onclick="editRecord('stand','${esc(s.StandID)}')">Edit / Delete</button>`;return;}
  if(record.kind==='booking'){
    const b=record.data;
    box.innerHTML=`<div class="notice info">Booking selected</div><div class="kv"><span>BookingRef</span><strong class="mono">${esc(b.BookingRef)}</strong></div><div class="kv"><span>Guest</span><strong>${esc(b.GuestFullName)}</strong></div><div class="kv"><span>Stand</span><strong class="mono">${esc(b.StandID)}</strong></div><div class="kv"><span>Status</span><strong>${bookingStatusChip(b.Status)}</strong></div>${b.HoldExpiresAt?`<div class="kv"><span>Hold Expires</span><strong>${esc(new Date(b.HoldExpiresAt).toLocaleString('en-ZA'))} ${new Date(b.HoldExpiresAt)<new Date()?'<span class="chip bad">Expired</span>':(new Date(b.HoldExpiresAt)-new Date())/3600000<=6?'<span class="chip warn">Expiring soon</span>':''}</strong></div>`:''}<div class="kv"><span>Dates</span><strong>${esc(displayDate(b.CheckInDate))} \u2192 ${esc(displayDate(b.CheckOutDate))}</strong></div><div class="kv"><span>Total</span><strong>${esc(formatMoney(b.TotalSnapshot,b.Currency))}${b.BalanceSnapshot!==undefined&&b.BalanceSnapshot!==''?` <span class="small">(Outstanding: ${esc(formatMoney(b.BalanceSnapshot,b.Currency))})</span>`:''}</strong></div>${(()=>{const dep=computeSuggestedDeposit(b);return dep?`<div class="kv"><span>Suggested Deposit</span><strong>${esc(formatMoney(dep.amount,b.Currency))} <span class="small">(${dep.mode==='fixed'?'fixed':dep.value+'%'} \xb7 ${esc(dep.source)})</span></strong></div>`:'';})()} <div class="divider"></div><div class="small">${esc(b.GuestNotes||'No guest notes')}</div>
${(()=>{const today2=dateOnly(new Date()),st2=String(b.Status||'').toLowerCase();const bal=Number(b.BalanceSnapshot||0),ciD=displayDate(b.CheckInDate),coD=displayDate(b.CheckOutDate);const settled=bal<=0;let btns='';if(settled&&ciD&&ciD<=today2&&['reserved','confirmed','part-paid'].includes(st2)){const lbl2=ciD<today2?'Check-in (overdue)':'Check-in';btns+=`<label class="check" style="font-size:11px;margin-top:10px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="inspEmailCb"><span>Send email to guest</span></label><button class="btn btn-ok" style="width:100%;margin-top:6px" onclick="quickStatusChangeFromRow('${esc(b.BookingID)}','checked-in',document.getElementById('inspEmailCb')?.checked,'check_in','${esc(b.Status)}'">${lbl2}</button>`;}if(settled&&coD&&coD<=today2&&st2==='checked-in'){const lbl2=coD<today2?'Check-out (overdue)':'Check-out';btns+=`<label class="check" style="font-size:11px;margin-top:10px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="inspEmailCb"><span>Send email to guest</span></label><button class="btn btn-soft" style="width:100%;margin-top:6px" onclick="quickStatusChangeFromRow('${esc(b.BookingID)}','completed',document.getElementById('inspEmailCb')?.checked,'check_out','${esc(b.Status)}'">${lbl2}</button>`;}if(!settled&&(ciD&&ciD<=today2&&['reserved','confirmed','part-paid'].includes(st2)||coD&&coD<=today2&&st2==='checked-in')){btns+=`<div class="notice warn" style="margin-top:8px;font-size:11px">Outstanding balance of <strong>${esc(formatMoney(bal,b.Currency))}</strong> must be settled before check-in/out.</div>`;}return btns;})()}
<button class="btn btn-soft" style="width:100%;margin-top:6px" onclick="editRecord('booking','${esc(b.BookingID)}')">Edit / Delete</button>
${canAccessView('reallocate')?`<div style="display:flex;gap:6px;margin-top:6px">
<button class="btn btn-soft" style="flex:1;font-size:12px" onclick="openReallocatePanel('${esc(b.BookingID)}')">&#8597; Reallocate</button>
<button class="btn btn-soft" style="flex:1;font-size:12px" onclick="openDateChangePanel('${esc(b.BookingID)}')">&#128197; Dates</button>
</div>`:''}<div class="divider"></div><div class="small" style="margin-bottom:6px">Quick status change</div><select class="select" id="quickStatusSelect">${['inquiry','reserved','confirmed','part-paid','checked-in','cancelled','no-show','completed'].map(v=>optionHtml(v,v,v===String(b.Status||'').toLowerCase())).join('')}</select><label class="check" style="font-size:11px;margin-top:8px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="qsEmailCb"><span>Send email to guest</span></label><button class="btn btn-brand" id="quickStatusBtn" style="width:100%;margin-top:6px" onclick="submitQuickStatusChange('${esc(b.BookingID)}')">Update Status</button><div id="quickStatusMsg" style="margin-top:8px"></div>${renderBookingPaymentsSection(b.BookingID)}`;
    loadAndRenderPayments(b.BookingID);patchPaymentTypeSelect();return;
  }
  if(record.kind==='block'){const b=record.data;box.innerHTML=`<div class="notice warn">Maintenance block selected</div><div class="kv"><span>BlockID</span><strong class="mono">${esc(b.BlockID)}</strong></div><div class="kv"><span>StandID</span><strong class="mono">${esc(b.StandID)}</strong></div><div class="kv"><span>Type</span><strong>${esc(b.BlockType)}</strong></div><div class="kv"><span>Range</span><strong>${esc(displayDate(b.StartDate))} \u2192 ${esc(displayDate(b.EndDate))}</strong></div><div class="divider"></div><div class="small">${esc(b.Reason||'No reason')}</div><button class="btn btn-soft" style="width:100%" onclick="editRecord('block','${esc(b.BlockID)}')">Edit / Delete</button>`;return;}
  if(record.kind==='user'){
    box.innerHTML = renderUserInspector(record.data);
    return;
  }
  if(record.kind==='standType'){const t=record.data;let occ={};try{occ=JSON.parse(t.DefaultOccupancyJSON||'{}')}catch(e){};box.innerHTML=`<div class="notice ok">Stand type selected</div><div class="kv"><span>StandTypeID</span><strong class="mono">${esc(t.StandTypeID)}</strong></div><div class="kv"><span>Name</span><strong>${esc(t.StandTypeName)}</strong></div><div class="kv"><span>Rates</span><strong>Base ${esc(t.DefaultBaseRate)} / Peak ${esc(t.DefaultPeakRate)} / Off ${esc(t.DefaultOffPeakRate)}</strong></div><div class="kv"><span>Deposit</span><strong>${esc(t.DefaultDepositMode)} ${esc(t.DefaultDepositValue)}</strong></div><div class="kv"><span>Stay Rules</span><strong>${esc(t.DefaultMinNights)}\u2013${esc(t.DefaultMaxNights)} nights, lead ${esc(t.DefaultLeadTimeDays)}d</strong></div><div class="kv"><span>Occupancy</span><strong>${esc(occ.adults??0)}A ${esc(occ.children??0)}C ${esc(occ.toddlers??0)}T</strong></div><div class="kv"><span>Status</span><strong>${truthy(t.Active)?'<span class="chip ok">Active</span>':'<span class="chip bad">Inactive</span>'}</strong></div><button class="btn btn-soft" style="width:100%" onclick="editRecord('standType','${esc(t.StandTypeID)}')">Edit / Delete</button>`;}
}


async function loadAndRenderPayments(bookingId) {
  try { const payments=await sbLoadPaymentsForBooking(bookingId); APP.paymentsCache[bookingId]=payments; } catch(err) { APP.paymentsCache[bookingId]=APP.paymentsCache[bookingId]||[]; }
  renderPaymentsList(bookingId);
}
function renderPaymentsList(bookingId) {
  const listEl=document.getElementById('paymentsList'); if(!listEl)return;
  const payments=APP.paymentsCache[bookingId]||[];
  const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);
  const currency=booking?.Currency||'';
  const totalPaid=payments.reduce((sum,p)=>{const amt=Number(p.Amount||0);return String(p.PaymentType||'').toLowerCase()==='refund'?sum-amt:sum+amt;},0);
  const total=Number(booking?.TotalSnapshot||0),balance=total-totalPaid;
  const noTotalWarning=total<=0?`<div class="notice warn" style="margin-bottom:10px">No Total Amount is set on this booking. Edit the booking and set a Total Amount.</div>`:'';
  listEl.innerHTML=`${noTotalWarning}<div class="kv"><span>Total</span><strong>${esc(formatMoney(total,currency))}</strong></div><div class="kv"><span>Paid</span><strong>${esc(formatMoney(totalPaid,currency))}</strong></div><div class="kv"><span>Balance</span><strong>${esc(formatMoney(balance,currency))}</strong></div>${(()=>{const dep=booking?computeSuggestedDeposit(booking):null;return dep?`<div class="kv"><span>Sugg. Dep.</span><strong>${esc(formatMoney(dep.amount,currency))}</strong></div>`:'';})()} <div class="divider"></div>${payments.length?payments.map(p=>`<div class="small" style="display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-top:1px solid var(--border)"><span>${esc(p.PaymentType)} \xb7 ${esc(p.PaymentMethod)}${p.Reference?' \xb7 '+esc(p.Reference):''}</span><span>${esc(formatMoney(p.Amount,currency))}</span></div>`).join(''):`<div style="padding:4px 0">No payments recorded yet.</div>`}`;
  prefillPaymentForm(booking,payments,balance);
}
function prefillPaymentForm(booking,payments,balance){
  const amountEl=document.getElementById('paymentAmount'),typeEl=document.getElementById('paymentType');
  if(!amountEl||!typeEl||!booking)return;
  const status=String(booking.Status||'').toLowerCase(),hasPayments=payments.length>0;
  if(hasPayments){amountEl.value=Math.max(0,Math.round(balance));typeEl.value='full';}
  else if(['reserved','inquiry'].includes(status)){const dep=computeSuggestedDeposit(booking);if(dep)amountEl.value=dep.amount;}
}
async function submitPayment(bookingId){
  const payEmail=document.getElementById('payEmailCb')?.checked;
  const amountEl=document.getElementById('paymentAmount'),methodEl=document.getElementById('paymentMethod'),typeEl=document.getElementById('paymentType'),refEl=document.getElementById('paymentReference'),notesEl=document.getElementById('paymentNotes'),msg=document.getElementById('paymentMsg');
  const amount=Number(amountEl?.value||0); if(!msg)return;
  if(!amount||amount<=0){msg.innerHTML=`<div class="notice warn">Enter a payment amount greater than zero.</div>`;return;}
  // Refunds require a reference / reason
  const payType=typeEl?.value||'deposit';
  if(payType==='refund'&&!refEl?.value?.trim()){
    msg.innerHTML=`<div class="notice warn">A reference / reason is required for refunds.</div>`;
    refEl?.focus();
    return;
  }
  const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);
  msg.innerHTML=`<div class="notice info">Recording payment\u2026</div>`;
  try {
    const res=await sbAppendPayment({BookingID:bookingId,ResortID:booking?.ResortID||APP.resortId,PaymentType:typeEl?.value||'deposit',PaymentStatus:'completed',PaymentMethod:methodEl?.value||'EFT',Amount:amount,Currency:booking?.Currency||'ZAR',Reference:refEl?.value||'',PaidAt:new Date().toISOString(),CapturedAt:new Date().toISOString(),ReceivedBy:APP.userEmail||APP.role||'admin',Notes:notesEl?.value||''});
    if(!res.success)throw new Error(res.error||'Failed to record payment');
    if(amountEl)amountEl.value=''; if(refEl)refEl.value=''; if(notesEl)notesEl.value='';
    const optimisticPayment={BookingID:bookingId,ResortID:booking?.ResortID||APP.resortId,PaymentType:typeEl?.value||'deposit',PaymentStatus:'completed',PaymentMethod:methodEl?.value||'EFT',Amount:amount,Currency:booking?.Currency||'ZAR',Reference:refEl?.value||'',PaidAt:new Date().toISOString(),ReceivedBy:APP.userEmail||APP.role||'admin',Notes:notesEl?.value||'',SoftDeleted:false,_optimistic:true};
    if(!APP.paymentsCache[bookingId])APP.paymentsCache[bookingId]=[];
    APP.paymentsCache[bookingId]=[optimisticPayment,...APP.paymentsCache[bookingId]];
    renderPaymentsList(bookingId);
    const _paid=APP.paymentsCache[bookingId].reduce((s,p)=>{return String(p.PaymentType||'').toLowerCase()==='refund'?s-Number(p.Amount||0):s+Number(p.Amount||0);},0);
    const _bal=Math.max(0,Number(booking?.TotalSnapshot||0)-_paid);
    if(booking){booking.BalanceSnapshot=String(_bal);booking.DepositPaidSnapshot=String(_paid);}
    renderInspector({kind:'booking',data:booking});
    renderActive();
    if(res.syncError){msg.innerHTML=`<div class="notice warn">Payment recorded, but status sync failed: ${esc(res.syncError)}</div>`;}
    else if(res.statusChanged&&booking){booking.Status=res.newStatus;booking.UpdatedAt=new Date().toISOString();const statusSelect=document.getElementById('quickStatusSelect');if(statusSelect)statusSelect.value=res.newStatus;buildBulk();renderStats();renderActive();msg.innerHTML=`<div class="notice ok">Payment recorded. Status updated to "${esc(res.newStatus)}".</div>`;}
    else{const paidNum=Number(res.paidTotal||0),totalNum=Number(res.bookingTotal||0);msg.innerHTML=`<div class="notice ok">Payment recorded. Paid so far: ${esc(formatMoney(paidNum,booking?.Currency))} of ${esc(formatMoney(totalNum,booking?.Currency))} total.</div>`;}
    loadAndRenderPayments(bookingId);
    showToast('Email flag: '+(payEmail?'TICKED':'not ticked'),'info');
    if(payEmail){const et=payType==='refund'?'refund':'payment';await sendBookingEmailToGuest(bookingId,et,{amount,paymentType:payType,currency:booking?.Currency||'ZAR'});}
  }catch(err){msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;}
}
async function submitQuickStatusChange(bookingId){
  const qsEmail=document.getElementById('qsEmailCb')?.checked;
  const select=document.getElementById('quickStatusSelect'),btn=document.getElementById('quickStatusBtn'),msg=document.getElementById('quickStatusMsg'),newStatus=select?.value;
  const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);
  if(!booking||!newStatus||!msg)return;
  if(newStatus===booking.Status){msg.innerHTML=`<div class="notice info">Status is already "${esc(newStatus)}".</div>`;return;}
  msg.innerHTML=`<div class="notice info">Updating status\u2026</div>`;if(btn)btn.disabled=true;
  try{const res=await sbChangeBookingStatus(bookingId,newStatus,APP.userEmail||APP.role||'admin');if(!res.success)throw new Error(res.error||'Status change failed');const oldSt=booking.Status;booking.Status=newStatus;booking.UpdatedAt=new Date().toISOString();buildBulk();renderStats();renderActive();selectBooking(bookingId);if(qsEmail)await sendBookingEmailToGuest(bookingId,'status_change',{newStatus,oldStatus:oldSt});}
  catch(err){msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;if(btn)btn.disabled=false;}
}
function selectStand(id){const s=APP.state.stands.find(x=>x.StandID===id);if(!s)return;APP.selected={kind:'stand',data:s};renderInspector(APP.selected);}
function selectBooking(id){const b=APP.state.bookings.find(x=>x.BookingID===id);if(!b)return;APP.selected={kind:'booking',data:b};renderInspector(APP.selected);}
function selectStandType(id){const t=APP.state.standTypes.find(x=>x.StandTypeID===id);if(!t)return;APP.selected={kind:'standType',data:t};renderInspector(APP.selected);}
function selectBlock(id){const b=APP.state.blocks.find(x=>x.BlockID===id);if(!b)return;APP.selected={kind:'block',data:b};renderInspector(APP.selected);}
function sortByName(type){if(type==='stands'){APP.state.stands.sort((a,b)=>(a.StandName||'').localeCompare(b.StandName||''));renderActive();}}
async function rebuildBulk(){
  buildBulk();renderActive();
  // Also rebuild the server-side BookingsBulk sheet so bookings.html calendar stays in sync
  try{
    const btn=document.querySelector('.nav button[data-view="bulk"]');
    showToast('Rebuilding server cache…','info');
    const res=await apiCall('syncBulk',{resortId:APP.resortId},'POST');
    if(res&&res.success)showToast('Cache rebuilt ✓','ok');
    else showToast('Server rebuild failed: '+(res&&res.error||'unknown'),'warn');
  }catch(e){showToast('Server rebuild error: '+e.message,'warn');}
}
function openModal(id,prefillData){
  const modal=document.getElementById(id);if(!modal)return;modal.classList.add('on');
  if(id==='standModal')renderStandModal(prefillData||{});
  if(id==='standTypeModal')renderStandTypeModal(prefillData||{});
  if(id==='bookingModal')renderBookingModal(prefillData||{});
  if(id==='blockModal')renderBlockModal(prefillData||{});
  if(id==='recordModal')renderRecordModal();
  const box=modal.querySelector('.modal-box');if(box)box.scrollTop=0;
}
function closeModal(id){document.getElementById(id)?.classList.remove('on');}
function modalBackdrop(e,id){if(e.target.id===id)closeModal(id);}
function renderStandModal(data={}) {
  const isEdit=Boolean(data.StandID);
  const titleEl=document.getElementById('standModalTitle');if(titleEl)titleEl.textContent=isEdit?'Edit Stand':'New Stand';
  const body=document.getElementById('standModalBody');
  const resortForModal=data.ResortID||APP.resortId;
  const relevantTypes=standTypesForResort(resortForModal);
  const typeOptions=relevantTypes.length?relevantTypes.map(t=>optionHtml(t.StandTypeID,t.StandTypeName+' ('+t.StandTypeID+')',String(data.StandTypeID||'')===t.StandTypeID)).join(''):optionHtml('','No stand types for this resort',true);
  body.innerHTML=`<div class="form-grid">
    <div class="field"><label>Resort ID</label><input class="input" id="standResortId" value="${esc(resortForModal)}" readonly style="opacity:.6;cursor:not-allowed"></div>
    <div class="field"><label>Stand ID</label><input class="input" value="${esc(data.StandID||uid('ST'))}" disabled style="opacity:.6"></div>
    <div class="field"><label>Stand Number</label><input class="input" value="${esc(data.StandNumber||'')}"></div>
    <div class="field"><label>Stand Name</label><input class="input" value="${esc(data.StandName||'')}"></div>
    <div class="field"><label>Active</label><select class="select" id="standActive">${optionHtml('true','Active',data.Active===undefined||truthy(data.Active))}${optionHtml('false','Inactive',data.Active!==undefined&&!truthy(data.Active))}</select></div>
    <div class="field"><label>Visible for Public Booking</label><label class="check" style="margin-top:6px"><input type="checkbox" id="standVisibility" ${data.StandVisibility===false||data.StandVisibility==='false'?'':' checked'}> <span>Allow guests to see and book this stand</span></label></div>
    <div class="field"><label>Stand Type</label><div class="flex"><select class="select" id="standTypeSelect" style="flex:1">${typeOptions}</select><button type="button" class="btn btn-soft" onclick="loadStandTypeDefaults()">Load Defaults</button></div></div>
    <div class="field"><label>Display Name</label><input class="input" value="${esc(data.DisplayName||'')}"></div>
    <div class="field full"><label>Description</label><textarea class="textarea">${esc(data.Description||'')}</textarea></div>
    <div class="field full"><label>Stand Image</label>
      <div id="standImgPreview" style="margin-bottom:8px">${data.StandImageURL?`<img class="stand-img-thumb" src="${esc(data.StandImageURL)}" alt="Stand image" style="max-height:130px"><div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="btn btn-soft" onclick="openImagePicker()">Change Image</button><button type="button" class="btn btn-soft" style="color:var(--bad)" onclick="clearStandImage()">Remove</button></div>`:`<div class="small" style="color:var(--subtle);padding:6px 0">No image set</div><button type="button" class="btn btn-soft" style="margin-top:4px" onclick="openImagePicker()">Pick from Drive</button>`}</div>
      <input type="hidden" id="standImageURL" value="${esc(data.StandImageURL||'')}">
    </div>
    <div class="field"><label>Base Rate</label><input class="input" id="standBaseRate" value="${esc(data.BaseRate||'')}"></div>
    <div class="field"><label>Peak Rate</label><input class="input" id="standPeakRate" value="${esc(data.PeakRate||'')}"></div>
    <div class="field"><label>Off-Peak Rate</label><input class="input" id="standOffPeakRate" value="${esc(data.OffPeakRate||'')}"></div>
    <div class="field"><label>Weekend Rate</label><input class="input" id="standWeekendRate" value="${esc(data.WeekendRate||'')}"></div>
    <div class="field"><label>Shoulder Rate</label><input class="input" id="standShoulderRate" value="${esc(data.ShoulderRate||'')}"></div>
    <div class="field"><label>Currency</label><input class="input" id="standCurrency" value="${esc(data.Currency||'ZAR')}"></div>
    <div class="field"><label>Max Adults</label><input class="input" id="standMaxAdults" value="${esc(data.MaxAdults||0)}"></div>
    <div class="field"><label>Max Children</label><input class="input" id="standMaxChildren" value="${esc(data.MaxChildren||0)}"></div>
    <div class="field"><label>Max Toddlers</label><input class="input" id="standMaxToddlers" value="${esc(data.MaxToddlers||0)}"></div>
    <div class="field"><label>Max Guests</label><input class="input" value="${esc(data.MaxGuests||0)}"></div>
    <div class="field"><label>Max Vehicles</label><input class="input" value="${esc(data.MaxVehicles||0)}"></div>
    <div class="field"><label>Deposit Mode</label><input class="input" id="standDepositMode" value="${esc(data.DepositMode||'percentage')}"></div>
    <div class="field"><label>Deposit Value</label><input class="input" id="standDepositValue" value="${esc(data.DepositValue||0)}"></div>
    <div class="field full"><label>Amenities — one per line or comma-separated</label><textarea class="textarea" id="standAmenitiesJSON">${esc(jsonArrayToText(data.AmenitiesJSON||'[]'))}</textarea></div>
    <div class="field full"><label>Features — one per line or comma-separated</label><textarea class="textarea" id="standFeaturesJSON">${esc(jsonArrayToText(data.FeaturesJSON||'[]'))}</textarea></div>
    <div class="field full"><label>Extras — one per line or comma-separated</label><textarea class="textarea" id="standExtrasJSON">${esc(jsonArrayToText(data.ExtrasJSON||'[]'))}</textarea></div>
  </div>
  <div class="flex" style="margin-top:14px;justify-content:space-between">
    <div>${isEdit?`<button class="btn btn-bad" onclick="deleteRecord('stand','${esc(data.StandID)}')">Delete Stand</button>`:''}</div>
    <div class="flex"><button class="btn btn-soft" onclick="duplicateStandFromModal()">Duplicate</button><button class="btn btn-soft" onclick="closeModal('standModal')">Cancel</button><button class="btn btn-brand" onclick="saveModal('stand')">Save Stand</button></div>
  </div>`;
}
function loadStandTypeDefaults(){
  const select=document.getElementById('standTypeSelect');const typeId=String(select?.value||'');
  const t=APP.state.standTypes.find(x=>String(x.StandTypeID||'')===typeId);
  if(!t){showToast('Choose a stand type first.','warn');return;}
  const rd=APP.state.resortDefaults||{};
  const setVal=(id,value)=>{const el=document.getElementById(id);if(el&&value!==undefined&&value!==null&&String(value)!=='')el.value=value;};
  let occ={};try{occ=JSON.parse(t.DefaultOccupancyJSON||'{}');}catch(e){}
  if(occ.adults!==undefined)setVal('standMaxAdults',occ.adults);
  if(occ.children!==undefined)setVal('standMaxChildren',occ.children);
  if(occ.toddlers!==undefined)setVal('standMaxToddlers',occ.toddlers);
  const el=document.getElementById('standDepositMode');if(el&&(t.DefaultDepositMode||rd.DefaultDepositMode))el.value=t.DefaultDepositMode||rd.DefaultDepositMode;
  setVal('standDepositValue',t.DefaultDepositValue!==undefined&&t.DefaultDepositValue!==''?t.DefaultDepositValue:rd.DefaultDepositValue);
  setVal('standAmenitiesJSON',t.DefaultAmenitiesJSON);setVal('standFeaturesJSON',t.DefaultFeaturesJSON);setVal('standExtrasJSON',t.DefaultExtrasJSON);
  setVal('standCurrency',rd.DefaultCurrency||'ZAR');
  if(t.DefaultBaseRate||t.DefaultPeakRate||t.DefaultOffPeakRate||t.DefaultWeekendRate||t.DefaultShoulderRate){setVal('standBaseRate',t.DefaultBaseRate);setVal('standPeakRate',t.DefaultPeakRate);setVal('standOffPeakRate',t.DefaultOffPeakRate);setVal('standWeekendRate',t.DefaultWeekendRate);setVal('standShoulderRate',t.DefaultShoulderRate);}
  else if(t.PricingMode&&t.PricingJSON){let pricing={};try{pricing=JSON.parse(t.PricingJSON);}catch(e){}if(t.PricingMode==='flat'){setVal('standBaseRate',pricing.offPeak?.rate||'');setVal('standPeakRate',pricing.peak?.rate||'');setVal('standOffPeakRate',pricing.offPeak?.rate||'');setVal('standWeekendRate',pricing.weekend?.rate||'');setVal('standShoulderRate',pricing.shoulder?.rate||'');}else if(t.PricingMode==='base_plus_pppn'){setVal('standBaseRate',pricing.offPeak?.baseRate||'');setVal('standPeakRate',pricing.peak?.baseRate||'');setVal('standWeekendRate',pricing.weekend?.baseRate||'');}}
  showToast('Defaults loaded from '+esc(t.StandTypeName||typeId),'ok');
}
function refreshStandTypeOptions(){const select=document.getElementById('standTypeSelect');if(!select)return;const resortId=document.getElementById('standResortId')?.value||APP.resortId,current=select.value;const relevant=standTypesForResort(resortId);select.innerHTML=relevant.length?relevant.map(t=>optionHtml(t.StandTypeID,t.StandTypeName+' ('+t.StandTypeID+')',t.StandTypeID===current)).join(''):optionHtml('','No stand types for this resort',true);}
function renderBookingModal(data={}) {
  const isEdit=Boolean(data.BookingID)&&APP.state.bookings.some(b=>b.BookingID===data.BookingID);
  const titleEl=document.getElementById('bookingModalTitle');if(titleEl)titleEl.textContent=isEdit?'Edit Booking':'New Booking';
  const body=document.getElementById('bookingModalBody');
  const defaults=APP.state.resortDefaults||{},leadDays=Number(defaults.DefaultLeadTimeDays??0),minNights=Number(defaults.DefaultMinNights??1),holdMinutes=Number(defaults.DefaultHoldMinutes??0);
  const minCheckIn=addDays(dateOnly(new Date()),leadDays),defaultCheckIn=displayDate(data.CheckInDate)||minCheckIn||dateOnly(new Date()),defaultCheckOut=displayDate(data.CheckOutDate)||addDays(defaultCheckIn,Math.max(1,minNights));
  const standId=data.StandID||'',standQuery=standId?standLabel(APP.state.stands.find(s=>s.StandID===standId)||{}):'';
  body.innerHTML=`<div class="form-grid">
    <div class="field"><label>Booking ID</label><input class="input" value="${esc(data.BookingID||uid('BK'))}" disabled style="opacity:.6"></div>
    <div class="field"><label>Booking Ref</label><input class="input" value="${esc(data.BookingRef||generateBookingRef())}" ${isEdit?'disabled':''}></div>
    <div class="field"><label>Resort ID</label><input class="input" value="${esc(data.ResortID||APP.resortId)}" readonly style="opacity:.6;cursor:not-allowed"></div>
    <div class="field"><label>Check-In Date</label><input class="input" id="bookingCheckInDate" type="date" min="${esc(minCheckIn)}" value="${esc(defaultCheckIn)}" oninput="enforceBookingDefaults();renderBookingStandChoices(document.getElementById('bookingStandSearch')?.value||'');updateBookingPriceCalc()"></div>
    <div class="field"><label>Check-Out Date</label><input class="input" id="bookingCheckOutDate" type="date" min="${esc(addDays(defaultCheckIn,Math.max(1,minNights)))}" value="${esc(defaultCheckOut)}" oninput="renderBookingStandChoices(document.getElementById('bookingStandSearch')?.value||'');updateBookingPriceCalc()"></div>
    <div class="field"><label>Status</label><select class="select" id="bookingStatus">${['inquiry','reserved','confirmed','part-paid','checked-in','cancelled','no-show','completed'].map(v=>optionHtml(v,v,String(data.Status||'reserved')===v)).join('')}</select></div>
    <div class="field"><label>Source</label><select class="select" id="bookingSource">${['admin','manual','whatsapp','phone','email','website','import','api'].map(v=>optionHtml(v,v,String(data.Source||'admin')===v)).join('')}</select></div>
    <div class="field"><label>Channel</label><select class="select" id="bookingChannel">${['admin','whatsapp','phone','email','website','import','api'].map(v=>optionHtml(v,v,String(data.BookingChannel||'admin')===v)).join('')}</select></div>
    <div class="field full"><label>Guest First Name</label><input class="input" value="${esc(data.GuestFirstName||'')}"></div>
    <div class="field"><label>Guest Last Name</label><input class="input" value="${esc(data.GuestLastName||'')}"></div>
    <div class="field"><label>Guest Email</label><input class="input" value="${esc(data.GuestEmail||'')}"></div>
    <div class="field"><label>Guest Phone</label><input class="input" value="${esc(data.GuestPhone||'')}"></div>
    <div class="field"><label>Adults</label><input class="input" id="bkAdults" value="${esc(data.Adults||1)}" oninput="updateBookingPriceCalc()"></div>
    <div class="field"><label>Children</label><input class="input" id="bkChildren" value="${esc(data.Children||0)}" oninput="updateBookingPriceCalc()"></div>
    <div class="field"><label>Toddlers</label><input class="input" id="bkToddlers" value="${esc(data.Toddlers||0)}" oninput="updateBookingPriceCalc()"></div>
    <div class="field"><label>Stand Type</label><select class="select" id="bookingStandType" onchange="renderBookingStandChoices(document.getElementById('bookingStandSearch')?.value||'')"><option value="">All types</option>${[...new Set(activeStands().map(s=>String(s.StandTypeID||'')).filter(Boolean))].map(v=>optionHtml(v,standTypeName(v)+' ('+v+')',String(data.StandTypeID||'')===v)).join('')}</select></div>
    <div class="field"><label>Total Amount</label><input class="input" id="bookingTotalAmount" value="${esc(data.TotalSnapshot||'')}" placeholder="e.g. 2780"></div>
    <div class="field full"><label>Stand / Unit</label><input class="input" id="bookingStandSearch" list="bookingStandOptions" value="${esc(standQuery)}" placeholder="Type stand number, name, or type" oninput="renderBookingStandChoices(this.value)"><input type="hidden" id="bookingStandId" value="${esc(standId)}"><datalist id="bookingStandOptions"></datalist><div class="small" id="bookingStandHint" style="margin-top:6px">Start typing to choose a stand or unit.</div><div id="bookingStandChoiceList" class="stack" style="margin-top:10px"></div></div>
    <div id="bookingPriceCalc" class="field full"></div>
    <div class="field full"><label>Guest Notes</label><textarea class="textarea">${esc(data.GuestNotes||'')}</textarea></div>
    <div class="field full"><label>Internal Notes</label><textarea class="textarea">${esc(data.InternalNotes||'')}</textarea></div>
  </div>
  <div class="flex" style="margin-top:14px;justify-content:space-between">
    <div>${isEdit?`<button class="btn btn-bad" onclick="deleteRecord('booking','${esc(data.BookingID)}')">Delete Booking</button>`:''}</div>
    <div class="flex"><button class="btn btn-soft" onclick="closeModal('bookingModal')">Cancel</button><button class="btn btn-brand" onclick="saveModal('booking')">Save Booking</button></div>
  </div>`;
  body.dataset.holdMinutes=String(holdMinutes);
  document.getElementById('bookingStatus').value=data.Status||'reserved';
  document.getElementById('bookingSource').value=data.Source||'admin';
  document.getElementById('bookingChannel').value=data.BookingChannel||'admin';
  enforceBookingDefaults();renderBookingStandChoices(standQuery||'');
}
function renderBlockModal(data={}) {
  const isEdit=Boolean(data.BlockID);
  const titleEl=document.getElementById('blockModalTitle');if(titleEl)titleEl.textContent=isEdit?'Edit Maintenance Block':'New Maintenance Block';
  const body=document.getElementById('blockModalBody');const stands=activeStands();
  const defaultStart=displayDate(data.StartDate)||dateOnly(new Date());const defaultEnd=displayDate(data.EndDate)||dateOnly(new Date(Date.now()+86400000));
  body.innerHTML=`<div class="form-grid">
    <div class="field"><label>Block ID</label><input class="input" value="${esc(data.BlockID||uid('BLK'))}" disabled style="opacity:.6"></div>
    <div class="field"><label>Resort ID</label><input class="input" value="${esc(data.ResortID||APP.resortId)}" readonly style="opacity:.6;cursor:not-allowed"></div>
    <div class="field full"><label>Stand</label><select class="select" id="blockStandSelect" onchange="checkMaintenanceConflicts()"><option value="">\u2014 choose stand \u2014</option>${stands.map(s=>optionHtml(s.StandID,[s.StandNumber,s.StandName].filter(Boolean).join(' \u2013 '),String(data.StandID||'')===s.StandID)).join('')}</select></div>
    <div class="field"><label>Block Type</label><input class="input" value="${esc(data.BlockType||'maintenance')}"></div>
    <div class="field"><label>Start Date</label><input class="input" id="blockStartDate" type="date" value="${esc(defaultStart)}" oninput="checkMaintenanceConflicts()"></div>
    <div class="field"><label>End Date</label><input class="input" id="blockEndDate" type="date" value="${esc(defaultEnd)}" oninput="checkMaintenanceConflicts()"></div>
    <div class="field full"><label>Reason</label><textarea class="textarea">${esc(data.Reason||'')}</textarea></div>
  </div>
  <div id="maintenanceConflictWarning"></div>
  <div class="flex" style="margin-top:14px;justify-content:space-between">
    <div>${isEdit?`<button class="btn btn-bad" onclick="deleteRecord('block','${esc(data.BlockID)}')">Delete Block</button>`:''}</div>
    <div class="flex"><button class="btn btn-soft" onclick="closeModal('blockModal')">Cancel</button><button class="btn btn-brand" onclick="saveModal('block')">Save Block</button></div>
  </div>`;
  if(data.StandID&&data.StartDate)setTimeout(checkMaintenanceConflicts,50);
}
function renderBookingStandChoices(q){const list=standSearchList(q),options=document.getElementById('bookingStandOptions'),choices=document.getElementById('bookingStandChoiceList'),hint=document.getElementById('bookingStandHint'),hidden=document.getElementById('bookingStandId');const current=(hidden&&hidden.value)?APP.state.stands.find(s=>s.StandID===hidden.value):null;if(options)options.innerHTML=list.map(s=>optionHtml(s.StandID,standLabel(s),current&&current.StandID===s.StandID)).join('');if(choices)choices.innerHTML=list.length?list.map(s=>`<button class="btn btn-soft" style="justify-content:space-between;width:100%;text-align:left" onclick="pickBookingStand('${esc(s.StandID)}','${esc(standLabel(s))}')"><span><strong>${esc(s.StandNumber||s.StandID)}</strong> ${esc(s.StandName||'')}</span><span class="small">${esc(s.StandTypeID||'')}</span></button>`).join(''):`<div class="small">No stands match what you typed.</div>`;if(hint)hint.textContent=list.length?`${list.length} stand(s) available.`:'No matching stand found.';}
function pickBookingStand(standId,label){const hidden=document.getElementById('bookingStandId'),search=document.getElementById('bookingStandSearch');if(hidden)hidden.value=standId;if(search)search.value=label;renderBookingStandChoices(label);updateBookingPriceCalc();}
function resolveBookingStandId(){const hidden=document.getElementById('bookingStandId')?.value||'';if(hidden)return hidden;const search=(document.getElementById('bookingStandSearch')?.value||'').trim().toLowerCase();if(!search)return '';const typeFilter=document.getElementById('bookingStandType')?.value||'';const matches=activeStands().filter(s=>{if(typeFilter&&String(s.StandTypeID||'')!==typeFilter)return false;return [s.StandID,s.StandNumber,s.StandName,s.DisplayName,s.StandTypeID].join(' ').toLowerCase().includes(search);});return matches.length===1?matches[0].StandID:'';}
function renderStandTypeModal(data={}) {
  const isEdit=Boolean(data.StandTypeID);const titleEl=document.getElementById('standTypeModalTitle');if(titleEl)titleEl.textContent=isEdit?'Edit Stand Type':'New Stand Type';
  const body=document.getElementById('standTypeModalBody');let occ={};try{occ=JSON.parse(data.DefaultOccupancyJSON||'{}')}catch(e){}
  const pricingMode=data.PricingMode||'flat',pricingJSON=data.PricingJSON||'{}';
  body.innerHTML=`<div class="form-grid">
    <div class="field" style="opacity:.6"><label>Resort ID</label><input class="input" id="stResortID" value="${esc(data.ResortID||APP.resortId)}" readonly style="cursor:not-allowed"></div>
    <div class="field"><label>Stand Type ID</label><input class="input" id="stStandTypeID" value="${esc(data.StandTypeID||uid('TYPE'))}" disabled style="opacity:.6"></div>
    <div class="field full"><label>Type Name</label><input class="input" id="stStandTypeName" value="${esc(data.StandTypeName||'')}"></div>
    <div class="field full"><label>Pricing Mode</label><select class="select" id="stPricingMode" onchange="onPricingModeChange()"><option value="flat" ${pricingMode==='flat'?'selected':''}>Flat rate per night</option><option value="pppn" ${pricingMode==='pppn'?'selected':''}>Per person per night (PPPN)</option><option value="base_plus_pppn" ${pricingMode==='base_plus_pppn'?'selected':''}>Base rate + PPPN extras</option></select></div>
  </div>
  <div class="section"><div class="section-h"><div class="section-t">Rates per Tier</div></div><div id="pricingEditorContainer">${renderPricingEditor(pricingMode,pricingJSON)}</div></div>
  <div class="section"><div class="section-h"><div class="section-t">Stay Rules &amp; Deposit</div></div><div class="form-grid">
    <div class="field"><label>Deposit Mode</label><select class="select" id="stDefaultDepositMode">${optionHtml('percentage','percentage',String(data.DefaultDepositMode||'percentage')==='percentage')}${optionHtml('fixed','fixed',String(data.DefaultDepositMode||'')==='fixed')}</select></div>
    <div class="field"><label>Deposit Value</label><input class="input" id="stDefaultDepositValue" value="${esc(data.DefaultDepositValue??0)}"></div>
    <div class="field"><label>Min Nights</label><input class="input" id="stDefaultMinNights" value="${esc(data.DefaultMinNights??1)}"></div>
    <div class="field"><label>Max Nights</label><input class="input" id="stDefaultMaxNights" value="${esc(data.DefaultMaxNights??21)}"></div>
    <div class="field"><label>Lead Time Days</label><input class="input" id="stDefaultLeadTimeDays" value="${esc(data.DefaultLeadTimeDays??0)}"></div>
    <div class="field"><label>Active</label><select class="select" id="stActive">${optionHtml('true','Active',truthy(data.Active??true))}${optionHtml('false','Inactive',data.Active!==undefined&&!truthy(data.Active))}</select></div>
  </div></div>
  <div class="section"><div class="section-h"><div class="section-t">Occupancy &amp; Amenities</div></div><div class="form-grid">
    <div class="field"><label>Max Adults</label><input class="input" id="stDefaultMaxAdults" value="${esc(occ.adults??2)}"></div>
    <div class="field"><label>Max Children</label><input class="input" id="stDefaultMaxChildren" value="${esc(occ.children??0)}"></div>
    <div class="field"><label>Max Toddlers</label><input class="input" id="stDefaultMaxToddlers" value="${esc(occ.toddlers??0)}"></div>
    <div class="field full"><label>Amenities — one per line or comma-separated</label><textarea class="textarea" id="stDefaultAmenitiesJSON">${esc(jsonArrayToText(data.DefaultAmenitiesJSON||'[]'))}</textarea></div>
    <div class="field full"><label>Features — one per line or comma-separated</label><textarea class="textarea" id="stDefaultFeaturesJSON">${esc(jsonArrayToText(data.DefaultFeaturesJSON||'[]'))}</textarea></div>
    <div class="field full"><label>Extras — one per line or comma-separated</label><textarea class="textarea" id="stDefaultExtrasJSON">${esc(jsonArrayToText(data.DefaultExtrasJSON||'[]'))}</textarea></div>
  </div></div>
  <div class="flex" style="margin-top:14px;justify-content:space-between">
    <div>${isEdit?`<button class="btn btn-bad" onclick="deleteRecord('standType','${esc(data.StandTypeID)}')">Delete</button>`:''} ${isEdit?`<button class="btn btn-soft" onclick="duplicateStandTypeFromModal()">Duplicate</button>`:''}</div>
    <div class="flex"><button class="btn btn-soft" onclick="closeModal('standTypeModal')">Cancel</button><button class="btn btn-brand" onclick="saveModal('standType')">Save Stand Type</button></div>
  </div>`;
  if(document.getElementById('stPricingMode'))document.getElementById('stPricingMode').dataset.prevMode=pricingMode;
}
function standModalPayload(){const base=modalObject('standModal');base.StandImageURL=document.getElementById('standImageURL')?.value||'';base.StandVisibility=document.getElementById('standVisibility')?.checked!==false;base.AmenitiesJSON=textToJsonArray(document.getElementById('standAmenitiesJSON')?.value);base.FeaturesJSON=textToJsonArray(document.getElementById('standFeaturesJSON')?.value);base.ExtrasJSON=textToJsonArray(document.getElementById('standExtrasJSON')?.value);if(base.Description)base.Description=sanitizeText(base.Description);return base;}
function standTypeModalPayload(){const mode=document.getElementById('stPricingMode')?.value||'flat';return{ResortID:document.getElementById('stResortID')?.value||APP.resortId,StandTypeID:document.getElementById('stStandTypeID')?.value||uid('TYPE'),StandTypeName:document.getElementById('stStandTypeName')?.value||'',PricingMode:mode,PricingJSON:collectPricingJSON(mode),DefaultDepositMode:document.getElementById('stDefaultDepositMode')?.value||'percentage',DefaultDepositValue:document.getElementById('stDefaultDepositValue')?.value||0,DefaultMinNights:document.getElementById('stDefaultMinNights')?.value||1,DefaultMaxNights:document.getElementById('stDefaultMaxNights')?.value||21,DefaultLeadTimeDays:document.getElementById('stDefaultLeadTimeDays')?.value||0,Active:document.getElementById('stActive')?.value==='true',DefaultAmenitiesJSON:textToJsonArray(document.getElementById('stDefaultAmenitiesJSON')?.value),DefaultFeaturesJSON:textToJsonArray(document.getElementById('stDefaultFeaturesJSON')?.value),DefaultExtrasJSON:textToJsonArray(document.getElementById('stDefaultExtrasJSON')?.value),DefaultOccupancyJSON:JSON.stringify({adults:Number(document.getElementById('stDefaultMaxAdults')?.value||0),children:Number(document.getElementById('stDefaultMaxChildren')?.value||0),toddlers:Number(document.getElementById('stDefaultMaxToddlers')?.value||0)})};}
function renderRecordModal(){const body=document.getElementById('recordModalBody'),rec=APP.selected;if(!rec){body.innerHTML=`<div class="notice warn">Nothing selected.</div>`;return;}body.innerHTML=`<div class="notice info">Record data (read-only JSON view).</div><pre class="small mono" style="white-space:pre-wrap;overflow:auto;max-height:70vh;margin-top:12px">${esc(JSON.stringify(rec.data,null,2))}</pre>`;}
function editRecord(kind,id){
  if(kind==='stand'){const s=APP.state.stands.find(x=>x.StandID===id);if(!s)return;APP.selected={kind:'stand',data:s};renderInspector(APP.selected);openModal('standModal',s);return;}
  if(kind==='booking'){const b=APP.state.bookings.find(x=>x.BookingID===id);if(!b)return;APP.selected={kind:'booking',data:b};renderInspector(APP.selected);openModal('bookingModal',b);return;}
  if(kind==='block'){const b=APP.state.blocks.find(x=>x.BlockID===id);if(!b)return;APP.selected={kind:'block',data:b};renderInspector(APP.selected);openModal('blockModal',b);return;}
  if(kind==='standType'){const t=APP.state.standTypes.find(x=>x.StandTypeID===id);if(!t)return;APP.selected={kind:'standType',data:t};openModal('standTypeModal',t);}
}
function tryOpenStandModal(){const types=standTypesForResort(APP.resortId).filter(t=>truthy(t.Active));if(!types.length){alert('Please set up at least one Stand Type before adding stands.\n\nGo to Stands \u2192 Stand Types to create one first.');return;}openModal('standModal');}
function duplicateStandFromModal(){
  const get=id=>document.getElementById(id)?.value??'';const fields=Array.from(document.querySelectorAll('#standModal .field'));const byLabel=lbl=>{const f=fields.find(f=>f.querySelector('label')?.textContent.trim()===lbl);return f?.querySelector('input,textarea,select')?.value??'';};
  const data={StandID:uid('ST'),ResortID:get('standResortId')||APP.resortId,StandTypeID:get('standTypeSelect'),StandNumber:byLabel('Stand Number'),StandName:byLabel('Stand Name')+' {dupl}',DisplayName:byLabel('Display Name')+' {dupl}',Description:byLabel('Description'),Active:get('standActive')==='true',BaseRate:get('standBaseRate'),PeakRate:get('standPeakRate'),OffPeakRate:get('standOffPeakRate'),WeekendRate:get('standWeekendRate'),ShoulderRate:get('standShoulderRate'),Currency:get('standCurrency'),MaxAdults:get('standMaxAdults'),MaxChildren:get('standMaxChildren'),MaxToddlers:get('standMaxToddlers'),MaxGuests:byLabel('Max Guests'),MaxVehicles:byLabel('Max Vehicles'),DepositMode:get('standDepositMode'),DepositValue:get('standDepositValue'),AmenitiesJSON:get('standAmenitiesJSON'),FeaturesJSON:get('standFeaturesJSON'),ExtrasJSON:get('standExtrasJSON'),SoftDeleted:false};
  closeModal('standModal');openModal('standModal',data);
}
function duplicateStandTypeFromModal(){const payload=standTypeModalPayload();payload.StandTypeID=uid('TYPE');payload.StandTypeName=(payload.StandTypeName||'')+' {dupl}';payload.SoftDeleted=false;closeModal('standTypeModal');openModal('standTypeModal',payload);}
function checkBalanceBeforeStatus(bookingId,newStatus,showEmailPopup){const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);if(!booking)return;const balance=Number(booking.BalanceSnapshot||0);if(balance>0){const currency=booking.Currency||'ZAR';alert('Outstanding balance of '+formatMoney(balance,currency)+' must be settled first.');if(APP.activeView!=='bookings'){const navBtn=document.querySelector('.nav button[data-view="bookings"]');setView('bookings',navBtn);}selectBooking(bookingId);setTimeout(function(){const payEl=document.getElementById('paymentsList')||document.getElementById('paymentMsg');if(payEl)payEl.scrollIntoView({behavior:'smooth',block:'center'});},150);return;}if(showEmailPopup){showCheckInOutPopup(bookingId,newStatus);}else{quickStatusChangeFromRow(bookingId,newStatus);}}
function checkMaintenanceConflicts(){const standId=document.getElementById('blockStandSelect')?.value;const startDate=document.getElementById('blockStartDate')?.value;const endDate=document.getElementById('blockEndDate')?.value;const warningEl=document.getElementById('maintenanceConflictWarning');if(!warningEl)return;if(!standId||!startDate||!endDate){warningEl.innerHTML='';return;}const conflicts=APP.state.bookings.filter(b=>{if(b.SoftDeleted||String(b.StandID)!==standId)return false;return['reserved','confirmed','part-paid','checked-in'].includes(String(b.Status||'').toLowerCase())&&overlap(b.CheckInDate,b.CheckOutDate,startDate,endDate);});if(conflicts.length){warningEl.innerHTML=`<div class="notice bad" style="margin-top:10px"><strong>\u26a0\ufe0f ${conflicts.length} active booking(s) overlap these dates</strong>${conflicts.map(b=>`<div style="margin-top:4px;font-size:11px">\u2022 <strong>${esc(b.BookingRef)}</strong> \xb7 ${esc(b.GuestFullName)} \xb7 ${esc(displayDate(b.CheckInDate))} \u2192 ${esc(displayDate(b.CheckOutDate))}</div>`).join('')}</div>`;} else if(standId){warningEl.innerHTML='<div class="notice ok" style="margin-top:10px">No conflicts \u2014 stand is free for these dates.</div>';}}
function openGraphModal(el,title){const svg=el.querySelector('svg');if(!svg)return;const modal=document.getElementById('graphModal'),body=document.getElementById('graphModalBody'),ttl=document.getElementById('graphModalTitle');if(!modal||!body)return;if(ttl)ttl.textContent=title||'Chart';const clone=svg.cloneNode(true);clone.style.cssText='width:100%;height:auto;display:block;';clone.setAttribute('preserveAspectRatio','xMidYMid meet');body.innerHTML='';body.appendChild(clone);modal.classList.add('on');}
// ── USER MANAGEMENT ──────────────────────────────────────────────────────────
async function loadUsersView() {
  try {
    const res = await gasCall('listUsers', {}, 'GET');
    if (!res.success) throw new Error(res.error || 'Failed to load users');
    APP.state.users = res.users || [];
    const pill = document.getElementById('userCountPill');
    if (pill) pill.textContent = APP.state.users.length + ' users';
    document.getElementById('mainContent').innerHTML = renderUsersTable();
  } catch(err) {
    document.getElementById('mainContent').innerHTML =
      `<div class="panel-b"><div class="notice bad">${esc(err.message||String(err))}</div></div>`;
  }
}
function renderUsersTable() {
  const users = APP.state.users || [];
  if (!users.length) return `<div class="panel-b"><div class="notice info">No users yet. Click + Add User to create the first one.</div></div>`;
  return `<table><thead><tr>
    <th>Name</th><th>Email</th><th>Role</th><th>Permissions</th><th>Status</th><th>Admin Login</th><th>Portal Login</th>
  </tr></thead><tbody>${users.map(u => {
    const isSelf = u.Email.toLowerCase() === APP.userEmail.toLowerCase();
    const permLabel = u.Permissions ? `Custom (${u.Permissions.split(',').length})` : 'Role defaults';
    const active = String(u.Active||'').toLowerCase() === 'true' || u.Active === true;
    return `<tr onclick="selectUser('${esc(u.Email)}')" style="cursor:pointer">
      <td><strong>${esc(u.Name)}</strong>${isSelf ? ' <span class="chip info" style="font-size:9px">You</span>' : ''}</td>
      <td class="small">${esc(u.Email)}</td>
      <td><span class="chip ${u.Role==='Super'?'ok':u.Role==='Manager'?'warn':u.Role==='Finance'?'info':''}">${esc(u.Role)}</span></td>
      <td class="small">${esc(permLabel)}</td>
      <td>${active ? '<span class="chip ok">Active</span>' : '<span class="chip bad">Inactive</span>'}</td>
      <td class="small">${u.LastLogin ? esc(u.LastLogin.slice(0,10)) : '—'}</td>
      <td class="small">${u.LastFrontEndLogin ? esc(u.LastFrontEndLogin.slice(0,10)) : '—'}</td>
    </tr>`;
  }).join('')}</tbody></table>`;
}
function selectUser(email) {
  const u = (APP.state.users||[]).find(x => x.Email.toLowerCase() === email.toLowerCase());
  if (!u) return;
  APP.selected = { kind: 'user', data: u };
  renderInspector(APP.selected);
}
function openAddUser() {
  APP.selected = { kind: 'user', data: { _new: true } };
  renderInspector(APP.selected);
}
function renderUserInspector(u) {
  const isNew  = Boolean(u._new);
  const isSelf = !isNew && u.Email.toLowerCase() === APP.userEmail.toLowerCase();
  if (isSelf) {
    return `
      <div class="notice info">You can only change your own password.</div>
      <div class="kv" style="margin-top:10px"><span>Name</span><strong>${esc(u.Name)}</strong></div>
      <div class="kv"><span>Email</span><strong>${esc(u.Email)}</strong></div>
      <div class="kv"><span>Role</span><strong>${esc(u.Role)}</strong></div>
      <div class="divider" style="margin:12px 0"></div>
      <div class="field" style="margin-bottom:8px">
        <label>New Password</label>
        <input class="input" id="selfNewPw" type="password" placeholder="Enter new password">
      </div>
      <div class="field" style="margin-bottom:8px">
        <label>Confirm Password</label>
        <input class="input" id="selfConfirmPw" type="password" placeholder="Confirm new password">
      </div>
      <div id="uMsg" style="margin-top:8px"></div>
      <button class="btn btn-brand" style="width:100%;margin-top:10px"
        onclick="saveSelfPassword()">Change Password</button>
    `;
  }
  // Current permissions: parse from stored string or fall back to role defaults
  const storedPerms = isNew ? null : (u.Permissions ? u.Permissions.split(',').map(s=>s.trim()).filter(Boolean) : null);
  const currentRole = isNew ? 'Admin' : (u.Role || 'Admin');
  const roleDefaults = ROLE_VIEWS[currentRole] || [];
  const activePerms  = storedPerms || roleDefaults;
  const useDefaults  = !storedPerms;
  const active = isNew ? true : (String(u.Active||'').toLowerCase() === 'true' || u.Active === true);
  return `
    <div class="notice ${isNew?'info':'ok'}">${isNew ? 'New user' : 'Editing: '+esc(u.Name)}</div>
    <div class="form-grid" style="margin-top:10px">
      <div class="field full"><label>Name</label><input class="input" id="uName" value="${esc(isNew?'':u.Name)}"></div>
      <div class="field full"><label>Email</label><input class="input" id="uEmail" value="${esc(isNew?'':u.Email)}" ${isNew?'':'readonly style="opacity:.6"'}></div>
      <div class="field full"><label>Password ${isNew?'':'(blank = keep current)'}</label><input class="input" id="uPassword" type="password" placeholder="${isNew?'Required':'Leave blank to keep current'}"></div>
      <div class="field full"><label>Role</label>
        <select class="select" id="uRole" onchange="onUserRoleChange()">
          ${['Super','Manager','Admin','Finance'].map(r=>optionHtml(r,r,r===currentRole)).join('')}
        </select>
      </div>
      <div class="field full">
        <label class="check" style="margin-bottom:6px">
          <input type="checkbox" id="uUseDefaults" ${useDefaults?'checked':''} onchange="onUserDefaultsToggle()">
          <span>Use role defaults</span>
        </label>
        <div id="uPermsGrid" style="${useDefaults?'opacity:.4;pointer-events:none':''}">
          ${ALL_PERM_KEYS.map(k=>`
            <label class="check" style="margin-bottom:4px;display:flex;align-items:center;gap:8px">
              <input type="checkbox" id="uperm_${k}" ${activePerms.includes(k)?'checked':''}>
              <span style="font-size:12px;font-weight:700">${esc(PERM_LABELS[k])}</span>
            </label>`).join('')}
        </div>
      </div>
      <div class="field"><label>Active</label>
        <label class="check"><input type="checkbox" id="uActive" ${active?'checked':''}><span>Active</span></label>
      </div>
      <div class="field full"><label>Notes</label><input class="input" id="uNotes" value="${esc(isNew?'':u.Notes||'')}"></div>
    </div>
    <div id="uMsg" style="margin-top:8px"></div>
    <div class="flex" style="margin-top:10px">
      ${!isNew ? `<button class="btn btn-bad" style="flex:1" onclick="deleteUser('${esc(u.Email)}')">Remove User</button>` : ''}
      <button class="btn btn-brand" style="flex:2" onclick="saveUser()">Save User</button>
    </div>
  `;
}
async function deleteUser(email) {
  if (!confirm('Remove this user? They will be hidden from User Management and can no longer log in.')) return;
  const msg = document.getElementById('uMsg');
  if (msg) msg.innerHTML = '<div class="notice info">Removing\u2026</div>';
  try {
    const res = await gasCall('upsertUser', { Email: email, ResortID: APP.resortId, SoftDeleted: 'true' }, 'POST');
    if (!res.success) throw new Error(res.error || 'Failed');
    APP.selected = null;
    renderInspector(null);
    loadUsersView();
  } catch(err) {
    if (msg) msg.innerHTML = `<div class="notice bad">${esc(err.message||String(err))}</div>`;
  }
}
async function saveSelfPassword() {
  const newPw     = document.getElementById('selfNewPw')?.value?.trim();
  const confirmPw = document.getElementById('selfConfirmPw')?.value?.trim();
  const msg       = document.getElementById('uMsg');
  if (!newPw) {
    if (msg) msg.innerHTML = '<div class="notice warn">Enter a new password.</div>';
    return;
  }
  if (newPw !== confirmPw) {
    if (msg) msg.innerHTML = '<div class="notice warn">Passwords do not match.</div>';
    return;
  }
  if (msg) msg.innerHTML = '<div class="notice info">Saving\u2026</div>';
  try {
    const res = await sb.auth.updateUser({ password: newPw }).then(({error})=>error?{success:false,error:error.message}:{success:true});
    if (!res.success) throw new Error(res.error || 'Failed');
    if (msg) msg.innerHTML = '<div class="notice ok">Password changed successfully.</div>';
    const f1 = document.getElementById('selfNewPw');
    const f2 = document.getElementById('selfConfirmPw');
    if (f1) f1.value = '';
    if (f2) f2.value = '';
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 2500);
  } catch(err) {
    if (msg) msg.innerHTML = `<div class="notice bad">${esc(err.message||String(err))}</div>`;
  }
}
function onUserRoleChange() {
  // When role changes and "use defaults" is checked, update permission checkboxes
  if (!document.getElementById('uUseDefaults')?.checked) return;
  const role = document.getElementById('uRole')?.value || 'Admin';
  const defaults = ROLE_VIEWS[role] || [];
  ALL_PERM_KEYS.forEach(k => {
    const el = document.getElementById('uperm_' + k);
    if (el) el.checked = defaults.includes(k);
  });
}
function onUserDefaultsToggle() {
  const useDefaults = document.getElementById('uUseDefaults')?.checked;
  const grid = document.getElementById('uPermsGrid');
  if (grid) { grid.style.opacity = useDefaults ? '.4' : '1'; grid.style.pointerEvents = useDefaults ? 'none' : ''; }
  if (useDefaults) onUserRoleChange(); // reset checkboxes to role defaults
}
async function saveUser() {
  const email    = document.getElementById('uEmail')?.value?.trim();
  const name     = document.getElementById('uName')?.value?.trim();
  const password = document.getElementById('uPassword')?.value?.trim();
  const role     = document.getElementById('uRole')?.value || 'Admin';
  const active   = document.getElementById('uActive')?.checked ?? true;
  const notes    = document.getElementById('uNotes')?.value?.trim() || '';
  const msg      = document.getElementById('uMsg');
  if (!email) { if(msg)msg.innerHTML=`<div class="notice warn">Email is required.</div>`; return; }
  if (!name)  { if(msg)msg.innerHTML=`<div class="notice warn">Name is required.</div>`;  return; }
  const isNew = Boolean(APP.selected?.data?._new);
  if (isNew && !password) { if(msg)msg.innerHTML=`<div class="notice warn">Password is required for new users.</div>`; return; }
  // Build permissions string
  const useDefaults = document.getElementById('uUseDefaults')?.checked;
  const permsStr = useDefaults ? '' : ALL_PERM_KEYS.filter(k => document.getElementById('uperm_'+k)?.checked).join(',');
  if(msg) msg.innerHTML=`<div class="notice info">Saving…</div>`;
  try {
    const res = await gasCall('upsertUser', {
      Email: email, Name: name, Password: password || '',
      Role: role, Active: active ? 'true' : 'false',
      Permissions: permsStr, Notes: notes, ResortID: APP.resortId
    }, 'POST');
    if (!res.success) throw new Error(res.error || 'Save failed');
    if(msg) msg.innerHTML=`<div class="notice ok">${res.action === 'created' ? 'User created.' : 'User updated.'}</div>`;
    setTimeout(()=>{ if(msg) msg.innerHTML=''; APP.selected=null; renderInspector(null); }, 1500);
    loadUsersView();
  } catch(err) {
    if(msg) msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;
  }
}
function renderHolidaysInspector() {
  const holidays = APP.state.resortDefaults?.PublicHolidaysList || [];
  const thisYear = new Date().getFullYear();
  if (!holidays.length) return '<div class="notice info">No public holidays loaded yet.</div>';
  const byYear = {};
  holidays.forEach(h => {
    const d = h.date || h.observedDate || h.Date || h.ObservedDate || '';
    const yr = String(d).slice(0,4);
    if (yr == thisYear || yr == thisYear+1) {
      if (!byYear[yr]) byYear[yr] = [];
      byYear[yr].push(h);
    }
  });
  if (!Object.keys(byYear).length) return '<div class="notice info">No holidays found for this year or next.</div>';
  return Object.keys(byYear).sort().map(yr =>
    `<div class="section-t" style="margin-bottom:8px">${yr}</div>`
    + byYear[yr].map(h => {
        const date = (h.date||h.observedDate||h.Date||h.ObservedDate||'').slice(5);
        const name = h.name||h.Name||'Holiday';
        const obs  = (h.observedDate||h.ObservedDate||'');
        const obsNote = obs && obs !== (h.date||h.Date||'') ? ` <span class="small" style="color:var(--muted)">(obs. ${obs.slice(5)})</span>` : '';
        return `<div class="kv" style="margin-bottom:6px"><span>${esc(date)}</span><strong style="font-size:12px">${esc(name)}${obsNote}</strong></div>`;
      }).join('')
    + '<div class="divider" style="margin:8px 0"></div>'
  ).join('');
}
function renderBookingPaymentsSection(bookingId) {
  const canPay = canAccessView('payments');
  const formHtml = canPay
    ? `<div class="form-grid" style="margin-top:10px">
        <div class="field"><label>Amount</label><input class="input" id="paymentAmount" placeholder="0.00"></div>
        <div class="field"><label>Method</label><select class="select" id="paymentMethod">${['EFT','Card','Cash','Other'].map(v=>optionHtml(v,v)).join('')}</select></div>
        <div class="field"><label>Type</label><select class="select" id="paymentType">${buildPaymentTypeOptions()}</select></div>
        <div class="field"><label>Reference</label><input class="input" id="paymentReference" placeholder="Optional"></div>
        <div class="field full"><label>Notes</label><input class="input" id="paymentNotes" placeholder="Optional"></div>
      </div>
      <label class="check" style="font-size:11px;margin-top:8px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="payEmailCb"><span>Send email to guest</span></label><button class="btn btn-brand" style="width:100%;margin-top:6px" onclick="submitPayment('${esc(bookingId)}')">Record Payment</button>
      <div id="paymentMsg" style="margin-top:8px"></div>`
    : `<div class="notice info" style="margin-top:8px;font-size:11px">You don't have permission to record payments.</div>`;
  return `<div class="divider"></div><div class="small" style="margin-bottom:6px">Payments</div>
    <div id="paymentsList" class="small">Loading payments\u2026</div>${formHtml}`;
}
function buildPaymentTypeOptions() {
  const canRefund = canAccessView('refunds');
  return [
    optionHtml('deposit', 'Deposit'),
    optionHtml('balance', 'Balance'),
    optionHtml('full',    'Full Payment'),
    ...(canRefund ? [optionHtml('refund', 'Refund')] : [])
  ].join('');
}
// ── HOOK: replace the static payment type HTML with the guard version ─────────
function patchPaymentTypeSelect() {
  const el = document.getElementById('paymentType');
  if (el) el.innerHTML = buildPaymentTypeOptions();
}
// ─────────────────────────────────────────────────────────────────────────────

createMonthKeys();
APP.resortId = getQueryResortId();


// ── REALLOCATION & DATE CHANGE PANELS ─────────────────────────────────────────

function _getBookingForEdit(bookingId){
  return APP.state.bookings.find(b=>b.BookingID===bookingId);
}

function _priceSuggestion(checkIn,checkOut,standId,b){
  const stand=APP.state.stands.find(s=>String(s.StandID)===String(standId));
  if(!stand)return null;
  const standType=APP.state.standTypes.find(t=>String(t.StandTypeID||'')===String(stand.StandTypeID||''));
  if(!standType)return null;
  const defaults=APP.state.resortDefaults||{};
  const adults=Number(b.Adults||1),children=Number(b.Children||0),toddlers=Number(b.Toddlers||0);
  return calculateStayPrice(checkIn,checkOut,standType,defaults,adults,children,toddlers);
}

function _renderEditPanel(titleHtml, bodyHtml, bookingId){
  const box=document.getElementById('inspector');
  box.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="btn btn-soft" style="padding:4px 10px;font-size:12px" onclick="renderInspector(APP.selected)">&#8592; Back</button>
      <strong style="font-size:13px;font-family:'Poppins',sans-serif">${titleHtml}</strong>
    </div>
    ${bodyHtml}
  `;
}

function _availStandsFor(checkIn,checkOut,excludeBookingId,typeFilter){
  return activeStands().filter(s=>{
    if(typeFilter&&String(s.StandTypeID||'')!==typeFilter)return false;
    return isStandAvailableForDates(s.StandID,checkIn,checkOut,excludeBookingId);
  });
}

function openReallocatePanel(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const currency=b.Currency||'ZAR';
  const typeOpts=APP.state.standTypes.filter(t=>truthy(t.Active)).map(t=>`<option value="${esc(t.StandTypeID)}" ${String(t.StandTypeID)===String(b.StandTypeID||'')?'selected':''}>${esc(t.StandTypeName)}</option>`).join('');
  const currentStandLabel=(()=>{const s=APP.state.stands.find(x=>String(x.StandID)===String(b.StandID||''));return s?standLabel(s):b.StandID;})();

  const html=`
    <div class="kv"><span>Current Stand</span><strong>${esc(currentStandLabel)}</strong></div>
    <div class="kv"><span>Dates</span><strong>${esc(b.CheckInDate)} &#8594; ${esc(b.CheckOutDate)}</strong></div>
    <div class="divider"></div>
    <div class="field" style="margin-bottom:8px">
      <label>Filter by Type</label>
      <select class="select" id="rallocTypeFilter" onchange="refreshReallocStands('${esc(bookingId)}')">
        <option value="">All types</option>${typeOpts}
      </select>
    </div>
    <div class="field" style="margin-bottom:8px">
      <label>New Stand <span class="small" id="rallocCount"></span></label>
      <select class="select" id="rallocStandSelect" onchange="onReallocStandChange('${esc(bookingId)}')">
        <option value="">— choose a stand —</option>
      </select>
    </div>
    <div id="rallocPriceBox" style="display:none;background:var(--green-l);border-radius:10px;padding:10px 12px;margin-bottom:8px">
      <div class="small" id="rallocPriceBreakdown" style="color:var(--muted);margin-bottom:6px"></div>
      <label style="font-size:12px;font-weight:800;display:block;margin-bottom:4px">Suggested total</label>
      <input class="input" id="rallocTotal" type="number" step="0.01" style="font-size:14px;font-weight:800">
    </div>
    <div id="rallocWarn" style="display:none" class="notice warn"></div>
    <div class="divider" style="margin:12px 0"></div>
    <div id="rallocSuggestions"></div>
    <label class="check" style="font-size:11px;margin:8px 0 4px;display:flex;align-items:center;gap:6px">
      <input type="checkbox" id="rallocEmailCb"><span>Send email to guest</span>
    </label>
    <div style="display:flex;gap:6px;margin-top:6px">
      <button class="btn btn-soft" style="flex:1" onclick="renderInspector(APP.selected)">Cancel</button>
      <button class="btn btn-brand" style="flex:1" id="rallocConfirmBtn" disabled onclick="confirmReallocation('${esc(bookingId)}')">Confirm</button>
    </div>
    <div id="rallocMsg" style="margin-top:8px"></div>
  `;
  APP._chainTargetId = bookingId;
  _renderEditPanel('&#8597; Reallocate Stand', html, bookingId);
  refreshReallocStands(bookingId);
}

function refreshReallocStands(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const typeFilter=document.getElementById('rallocTypeFilter')?.value||'';
  const stands=_availStandsFor(b.CheckInDate,b.CheckOutDate,bookingId,typeFilter);
  const sel=document.getElementById('rallocStandSelect');
  const ct=document.getElementById('rallocCount');
  if(!sel)return;
  sel.innerHTML='<option value="">— choose a stand —</option>'+
    stands.map(s=>`<option value="${esc(s.StandID)}" ${String(s.StandID)===String(b.StandID)?'selected':''} >${esc(standLabel(s))}</option>`).join('');
  if(ct)ct.textContent='('+stands.length+' available)';
  document.getElementById('rallocPriceBox').style.display='none';
  document.getElementById('rallocConfirmBtn').disabled=true;
  // Run chain suggestions for occupied stands of this type
  const b2=_getBookingForEdit(bookingId);
  if(b2&&typeFilter){
    const suggs=findChainSuggestions(bookingId,typeFilter,b2.CheckInDate,b2.CheckOutDate);
    APP._currentSuggestions=suggs;
    const el=document.getElementById('rallocSuggestions');
    if(el)el.innerHTML=suggs.length?renderSuggestionCards(suggs,bookingId):'';
  }
}

function onReallocStandChange(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const newStandId=document.getElementById('rallocStandSelect')?.value||'';
  const priceBox=document.getElementById('rallocPriceBox');
  const confirmBtn=document.getElementById('rallocConfirmBtn');
  const warnEl=document.getElementById('rallocWarn');
  warnEl.style.display='none';
  if(!newStandId||newStandId===b.StandID){priceBox.style.display='none';confirmBtn.disabled=true;return;}
  const result=_priceSuggestion(b.CheckInDate,b.CheckOutDate,newStandId,b);
  const currency=b.Currency||'ZAR';
  if(result){
    const breakdown=result.breakdown.map(d=>`${d.date}: ${d.tierLabel} ${formatMoney(d.rate,currency)}`).join(', ');
    document.getElementById('rallocPriceBreakdown').textContent=breakdown;
    document.getElementById('rallocTotal').value=result.total.toFixed(2);
  } else {
    document.getElementById('rallocPriceBreakdown').textContent='Could not calculate — enter total manually';
    document.getElementById('rallocTotal').value=b.TotalSnapshot||'0';
  }
  priceBox.style.display='block';
  confirmBtn.disabled=false;
}

async function confirmReallocation(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const sendEmail=document.getElementById('rallocEmailCb')?.checked;
  const newStandId=document.getElementById('rallocStandSelect')?.value||'';
  const newTotal=document.getElementById('rallocTotal')?.value||b.TotalSnapshot||'0';
  if(!newStandId||newStandId===b.StandID){showToast('Please choose a different stand','warn');return;}
  const newStand=APP.state.stands.find(s=>String(s.StandID)===String(newStandId));
  const btn=document.getElementById('rallocConfirmBtn');
  btn.disabled=true;btn.textContent='Saving…';
  const msg=document.getElementById('rallocMsg');
  try{
    const res=await apiCall('editBookingDetails',{
      bookingId,editType:'reallocation',
      newStandId,newStandTypeId:newStand?.StandTypeID||'',
      newTotal,kkbookLevel:APP.kkbookLevel||'',
      notes:'Stand changed from '+b.StandID+' to '+newStandId
    },'POST');
    if(!res.success)throw new Error(res.error||'Failed');
    // Update local state
    b.StandID=newStandId;b.StandTypeID=newStand?.StandTypeID||'';
    b.TotalSnapshot=newTotal;
    const paid=Number(b.DepositPaidSnapshot||0);
    b.BalanceSnapshot=String(Math.max(0,Number(newTotal)-paid));
    buildBulk();renderStats();renderActive();
    APP.selected={kind:'booking',data:b};
    renderInspector(APP.selected);
    showToast('Stand reallocated ✓','ok');
    if(sendEmail)await sendBookingEmailToGuest(bookingId,'status_change',{newStatus:b.Status,oldStatus:b.Status});
  }catch(err){
    msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;
    btn.disabled=false;btn.textContent='Confirm';
  }
}

function openDateChangePanel(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const currency=b.Currency||'ZAR';
  const html=`
    <div class="kv"><span>Current Dates</span><strong>${esc(b.CheckInDate)} &#8594; ${esc(b.CheckOutDate)} (${esc(b.Nights)} nights)</strong></div>
    <div class="kv"><span>Stand</span><strong>${esc((()=>{const s=APP.state.stands.find(x=>String(x.StandID)===String(b.StandID||''));return s?standLabel(s):b.StandID;})())}</strong></div>
    <div class="divider"></div>
    <div class="form-grid" style="margin-bottom:8px">
      <div class="field">
        <label>New Check-in</label>
        <input class="input" id="dcNewCI" type="date" value="${esc(b.CheckInDate)}" oninput="onDateChangeInput('${esc(bookingId)}')">
      </div>
      <div class="field">
        <label>New Check-out</label>
        <input class="input" id="dcNewCO" type="date" value="${esc(b.CheckOutDate)}" oninput="onDateChangeInput('${esc(bookingId)}')">
      </div>
    </div>
    <div id="dcAvailWarn" style="display:none" class="notice bad"></div>
    <div id="dcPriceBox" style="display:none;background:var(--green-l);border-radius:10px;padding:10px 12px;margin-bottom:8px">
      <div class="small" id="dcNightsLabel" style="color:var(--muted);margin-bottom:4px"></div>
      <div class="small" id="dcPriceBreakdown" style="color:var(--muted);margin-bottom:6px"></div>
      <label style="font-size:12px;font-weight:800;display:block;margin-bottom:4px">Suggested total</label>
      <input class="input" id="dcTotal" type="number" step="0.01" style="font-size:14px;font-weight:800">
    </div>
    <div id="dcLessWarn" style="display:none" class="notice warn"></div>
    <label class="check" style="font-size:11px;margin:8px 0 4px;display:flex;align-items:center;gap:6px">
      <input type="checkbox" id="dcEmailCb"><span>Send email to guest</span>
    </label>
    <div style="display:flex;gap:6px;margin-top:6px">
      <button class="btn btn-soft" style="flex:1" onclick="renderInspector(APP.selected)">Cancel</button>
      <button class="btn btn-brand" style="flex:1" id="dcConfirmBtn" disabled onclick="confirmDateChange('${esc(bookingId)}')">Confirm</button>
    </div>
    <div id="dcMsg" style="margin-top:8px"></div>
  `;
  _renderEditPanel('&#128197; Change Dates', html, bookingId);
}

function onDateChangeInput(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const newCI=document.getElementById('dcNewCI')?.value||'';
  const newCO=document.getElementById('dcNewCO')?.value||'';
  const priceBox=document.getElementById('dcPriceBox');
  const availWarn=document.getElementById('dcAvailWarn');
  const lessWarn=document.getElementById('dcLessWarn');
  const confirmBtn=document.getElementById('dcConfirmBtn');
  availWarn.style.display='none';lessWarn.style.display='none';
  priceBox.style.display='none';confirmBtn.disabled=true;
  if(!newCI||!newCO||newCO<=newCI)return;
  if(newCI===b.CheckInDate&&newCO===b.CheckOutDate){availWarn.textContent='Dates are unchanged.';availWarn.style.display='block';return;}
  // Check availability (excluding this booking)
  if(!isStandAvailableForDates(b.StandID,newCI,newCO,bookingId)){
    availWarn.textContent='The current stand is not available for these dates. Reallocate to a different stand first.';
    availWarn.style.display='block';return;
  }
  const nights=Math.max(1,Math.round((new Date(newCO)-new Date(newCI))/86400000));
  const currency=b.Currency||'ZAR';
  const result=_priceSuggestion(newCI,newCO,b.StandID,b);
  const nightsLabel=`${nights} night${nights!==1?'s':''} (${nights>Number(b.Nights||0)?'+':(nights<Number(b.Nights||0)?'':'')}${nights-Number(b.Nights||0)} from ${b.Nights})`;
  document.getElementById('dcNightsLabel').textContent=nightsLabel;
  if(result){
    const breakdown=result.breakdown.map(d=>`${d.date}: ${d.tierLabel} ${formatMoney(d.rate,currency)}`).join(', ');
    document.getElementById('dcPriceBreakdown').textContent=breakdown;
    document.getElementById('dcTotal').value=result.total.toFixed(2);
    // Warn if new total < old and deposit paid
    const oldTotal=Number(b.TotalSnapshot||0);
    const newSugg=result.total;
    const paid=Number(b.DepositPaidSnapshot||0);
    if(newSugg<oldTotal&&paid>0){
      lessWarn.innerHTML=`New total (${formatMoney(newSugg,currency)}) is less than current total (${formatMoney(oldTotal,currency)}). A deposit of ${formatMoney(paid,currency)} has already been paid — manage any refund via the Payments panel.`;
      lessWarn.style.display='block';
    }
  } else {
    document.getElementById('dcPriceBreakdown').textContent='Could not calculate — enter total manually';
    document.getElementById('dcTotal').value=b.TotalSnapshot||'0';
  }
  priceBox.style.display='block';
  confirmBtn.disabled=false;
}

async function confirmDateChange(bookingId){
  const b=_getBookingForEdit(bookingId);
  if(!b)return;
  const sendEmail=document.getElementById('dcEmailCb')?.checked;
  const newCI=document.getElementById('dcNewCI')?.value||'';
  const newCO=document.getElementById('dcNewCO')?.value||'';
  const newTotal=document.getElementById('dcTotal')?.value||b.TotalSnapshot||'0';
  const btn=document.getElementById('dcConfirmBtn');
  btn.disabled=true;btn.textContent='Saving…';
  const msg=document.getElementById('dcMsg');
  try{
    const res=await apiCall('editBookingDetails',{
      bookingId,editType:'dateChange',
      newCheckIn:newCI,newCheckOut:newCO,
      newTotal,
      notes:'Dates changed from '+b.CheckInDate+'/'+b.CheckOutDate+' to '+newCI+'/'+newCO
    },'POST');
    if(!res.success)throw new Error(res.error||'Failed');
    const nights=Math.max(1,Math.round((new Date(newCO)-new Date(newCI))/86400000));
    b.CheckInDate=newCI;b.CheckOutDate=newCO;b.Nights=String(nights);
    b.TotalSnapshot=newTotal;
    const paid=Number(b.DepositPaidSnapshot||0);
    b.BalanceSnapshot=String(Math.max(0,Number(newTotal)-paid));
    buildBulk();renderStats();renderActive();
    APP.selected={kind:'booking',data:b};
    renderInspector(APP.selected);
    showToast('Dates updated ✓','ok');
    if(sendEmail)await sendBookingEmailToGuest(bookingId,'status_change',{newStatus:b.Status,oldStatus:b.Status});
  }catch(err){
    msg.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;
    btn.disabled=false;btn.textContent='Confirm';
  }
}


// ── CHAIN SUGGESTION ENGINE ────────────────────────────────────────────────────

function findChainSuggestions(targetBookingId, targetStandTypeId, targetCI, targetCO) {
  const suggestions = [], seen = new Set();

  // Stands of target type that are occupied (not directly free)
  const occupiedTargetStands = activeStands().filter(s =>
    String(s.StandTypeID) === String(targetStandTypeId) &&
    !isStandAvailableForDates(s.StandID, targetCI, targetCO, targetBookingId)
  );

  for (const S1 of occupiedTargetStands) {
    // Primary conflicting booking on S1 for target dates
    const B1list = APP.state.bookings.filter(b =>
      b.BookingID !== targetBookingId &&
      String(b.StandID) === String(S1.StandID) &&
      !bookingIsFinal(b.Status) && !truthy(b.SoftDeleted) &&
      overlap(b.CheckInDate, b.CheckOutDate, targetCI, targetCO)
    );
    if (!B1list.length) continue;
    const B1 = B1list[0];
    const B1stand = APP.state.stands.find(s => String(s.StandID) === String(B1.StandID));
    if (!B1stand) continue;
    const B1typeId = String(B1stand.StandTypeID || '');

    // ── 1-hop: find a free stand for B1 ───────────────────────────────────────
    const freeForB1 = activeStands().filter(s =>
      String(s.StandTypeID) === String(B1typeId) &&
      String(s.StandID) !== String(S1.StandID) &&
      isStandAvailableForDates(s.StandID, B1.CheckInDate, B1.CheckOutDate, B1.BookingID)
    );
    if (freeForB1.length) {
      const key = '1:' + B1.BookingID + ':' + S1.StandID + ':' + freeForB1[0].StandID;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ type: '1-hop', targetStand: S1,
          moves: [{ booking: B1, fromStand: B1stand, toStand: freeForB1[0] }] });
      }
      continue; // found 1-hop, no need for 2-hop on this S1
    }

    // ── 2-hop: find a stand S2 where B1 could go if we first move S2's booking ──
    const B1typeStands = activeStands().filter(s =>
      String(s.StandTypeID) === String(B1typeId) &&
      String(s.StandID) !== String(S1.StandID)
    );
    let found2hop = false;
    for (const S2 of B1typeStands) {
      if (found2hop) break;
      const B2list = APP.state.bookings.filter(b =>
        b.BookingID !== targetBookingId && b.BookingID !== B1.BookingID &&
        String(b.StandID) === String(S2.StandID) &&
        !bookingIsFinal(b.Status) && !truthy(b.SoftDeleted) &&
        overlap(b.CheckInDate, b.CheckOutDate, B1.CheckInDate, B1.CheckOutDate)
      );
      if (!B2list.length) continue;
      const B2 = B2list[0];
      const B2stand = APP.state.stands.find(s => String(s.StandID) === String(B2.StandID));
      if (!B2stand) continue;
      const B2typeId = String(B2stand.StandTypeID || '');

      // Find a free stand for B2 (avoiding S1 and S2)
      const freeForB2 = activeStands().filter(s =>
        String(s.StandTypeID) === String(B2typeId) &&
        String(s.StandID) !== String(S2.StandID) &&
        String(s.StandID) !== String(S1.StandID) &&
        isStandAvailableForDates(s.StandID, B2.CheckInDate, B2.CheckOutDate, B2.BookingID)
      );
      if (!freeForB2.length) continue;

      // After B2 moves away from S2, is S2 free for B1?
      if (!isStandAvailableForDates(S2.StandID, B1.CheckInDate, B1.CheckOutDate, B2.BookingID)) continue;

      const key = '2:' + B2.BookingID + ':' + S2.StandID + ':' + freeForB2[0].StandID + ':' + B1.BookingID;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ type: '2-hop', targetStand: S1,
          moves: [
            { booking: B2, fromStand: B2stand, toStand: freeForB2[0] },
            { booking: B1, fromStand: B1stand, toStand: S2 }
          ]
        });
        found2hop = true;
      }
    }
  }

  // 1-hop suggestions first, cap at 5
  suggestions.sort((a, b) => (a.type === '1-hop' ? 0 : 1) - (b.type === '1-hop' ? 0 : 1));
  return suggestions.slice(0, 5);
}

function renderSuggestionCards(suggestions, targetBookingId) {
  if (!suggestions.length) {
    return '';
  }
  return suggestions.map(function(s, i) {
    const hopsLabel = s.type === '1-hop' ? 'via 1 swap' : 'via 2 swaps';
    const movesHtml = s.moves.map(function(m) {
      return '<div class="small" style="margin:2px 0;line-height:1.5">'
        + '→ Move <strong>' + esc(m.booking.GuestFullName || m.booking.BookingRef) + '</strong>'
        + ' (' + esc(m.booking.BookingRef) + ')'
        + ' from <strong>' + esc(standLabel(m.fromStand)) + '</strong>'
        + ' to <strong>' + esc(standLabel(m.toStand)) + '</strong></div>';
    }).join('');
    return '<div style="border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:8px">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
      + '<strong style="font-size:11.5px;color:var(--green)">' + hopsLabel + '</strong>'
      + '<span class="chip ok" style="font-size:10px">opens ' + esc(s.targetStand.StandNumber || standLabel(s.targetStand)) + '</span>'
      + '</div>'
      + movesHtml
      + '<div class="small" style="margin-top:4px;color:var(--green);font-weight:800">→ Then move this booking to <strong>' + esc(standLabel(s.targetStand)) + '</strong></div>'
      + '<label class="check" style="font-size:11px;margin:6px 0 4px;display:flex;align-items:center;gap:6px">'
      + '<input type="checkbox" id="suggEmail_' + i + '"><span>Notify all affected guests</span></label>'
      + '<div style="display:flex;gap:6px;margin-top:6px">'
      + '<button class="btn btn-soft" style="flex:1;font-size:11px" onclick="executeSuggestion(' + i + ',false)">Step by Step</button>'
      + '<button class="btn btn-brand" style="flex:1;font-size:11px" onclick="executeSuggestion(' + i + ',true)">Do All</button>'
      + '</div></div>';
  }).join('');
}

async function executeSuggestion(suggIndex, doAll) {
  const targetBookingId = APP._chainTargetId;
  const sugg = APP._currentSuggestions[suggIndex];
  if (!sugg) return;
  const sendEmail = document.getElementById('suggEmail_' + suggIndex)?.checked;
  const b = _getBookingForEdit(targetBookingId);
  if (!b) return;

  // Build full move list: chain moves + final target move
  const allMoves = sugg.moves.map(function(m) {
    return { bookingId: m.booking.BookingID, newStandId: m.toStand.StandID,
      newStandTypeId: String(m.toStand.StandTypeID || ''),
      keepTotal: true, booking: m.booking,
      originalStandId: m.booking.StandID, originalStandTypeId: m.booking.StandTypeID };
  }).concat([{
    bookingId: targetBookingId, newStandId: sugg.targetStand.StandID,
    newStandTypeId: String(sugg.targetStand.StandTypeID || ''),
    keepTotal: false, booking: b,
    originalStandId: b.StandID, originalStandTypeId: b.StandTypeID
  }]);

  if (!doAll) {
    _runStepByStep(allMoves, 0, sendEmail, targetBookingId, suggIndex);
    return;
  }

  // ── Do All ──────────────────────────────────────────────────────────────────
  // Show progress panel in inspector
  const _showProgress = function(lines) {
    const box = document.getElementById('inspector');
    if (!box) return;
    box.innerHTML = '<div style="font-weight:800;font-size:14px;margin-bottom:12px">&#128257; Executing chain…</div>'
      + '<div id="chainProgressLines" style="font-size:12.5px;line-height:2">' + lines.join('') + '</div>';
  };
  const progressLines = allMoves.map(function(m, i) {
    const label = m.booking.GuestFullName || m.booking.BookingRef;
    const fromS = APP.state.stands.find(s => String(s.StandID) === String(m.originalStandId));
    const toS   = APP.state.stands.find(s => String(s.StandID) === String(m.newStandId));
    return '<div id="cpl_' + i + '" style="color:var(--muted)">'
      + '&#9744; Step ' + (i+1) + ': ' + esc(label)
      + ' → ' + esc(toS ? standLabel(toS) : m.newStandId) + '</div>';
  });
  _showProgress(progressLines);

  const executed = [];
  for (let i = 0; i < allMoves.length; i++) {
    const move = allMoves[i];
    // Update progress line to "in progress"
    progressLines[i] = '<div id="cpl_' + i + '" style="color:var(--orange);font-weight:800">'
      + '&#9203; Step ' + (i+1) + ': ' + esc(move.booking.GuestFullName || move.booking.BookingRef) + '…</div>';
    _showProgress(progressLines);
    // For chain moves keep existing total; for target booking use rallocTotal input
    const newTotal = (!move.keepTotal && document.getElementById('rallocTotal'))
      ? (document.getElementById('rallocTotal').value || move.booking.TotalSnapshot || '0')
      : (move.booking.TotalSnapshot || '0');
    try {
      const res = await apiCall('editBookingDetails', {
        bookingId: move.bookingId, editType: 'reallocation',
        newStandId: move.newStandId, newStandTypeId: move.newStandTypeId,
        newTotal, kkbookLevel: APP.kkbookLevel || '',
        notes: 'Chain reallocation (step ' + (i + 1) + ' of ' + allMoves.length + ')'
      }, 'POST');
      if (!res.success) throw new Error(res.error || 'Move failed');
      executed.push(move);
      const localB = APP.state.bookings.find(x => x.BookingID === move.bookingId);
      if (localB) { localB.StandID = move.newStandId; localB.StandTypeID = move.newStandTypeId; }
      // Mark step as done
      progressLines[i] = '<div style="color:var(--ok);font-weight:800">&#9989; Step ' + (i+1) + ': ' + esc(move.booking.GuestFullName || move.booking.BookingRef) + ' ✓</div>';
      _showProgress(progressLines);
    } catch(err) {
      progressLines[i] = '<div style="color:var(--bad);font-weight:800">&#10060; Step ' + (i+1) + ': Failed — ' + esc(err.message||String(err)) + '</div>';
      _showProgress(progressLines);
      showToast('Step ' + (i + 1) + ' failed: ' + (err.message || err) + '. Reverting…', 'warn');
      await _rollbackMoves(executed);
      showToast('Reverted to original state. Use Step by Step to identify the issue.', 'info');
      renderInspector(APP.selected);
      return;
    }
  }

  if (sendEmail) {
    for (const move of allMoves) {
      try { await sendBookingEmailToGuest(move.bookingId, 'status_change', {newStatus: move.booking.Status, oldStatus: move.booking.Status}); } catch(e) {}
    }
  }
  buildBulk(); renderStats(); renderActive();
  APP.selected = {kind: 'booking', data: b};
  renderInspector(APP.selected);
  showToast('Chain complete: ' + allMoves.length + ' moves executed ✓', 'ok');
}

function _runStepByStep(allMoves, stepIndex, sendEmail, targetBookingId, suggIndex) {
  const box = document.getElementById('inspector');
  if (stepIndex >= allMoves.length) {
    buildBulk(); renderStats(); renderActive();
    const b = _getBookingForEdit(targetBookingId);
    APP.selected = {kind: 'booking', data: b};
    renderInspector(APP.selected);
    showToast('All moves complete ✓', 'ok');
    return;
  }
  const move = allMoves[stepIndex];
  const fromLabel = (APP.state.stands.find(s => String(s.StandID) === String(move.originalStandId)));
  const toLabel   = (APP.state.stands.find(s => String(s.StandID) === String(move.newStandId)));
  const newTotal = (!move.keepTotal && document.getElementById('rallocTotal'))
    ? (document.getElementById('rallocTotal').value || move.booking.TotalSnapshot || '0')
    : (move.booking.TotalSnapshot || '0');
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <strong style="font-size:13px;font-family:'Poppins',sans-serif">Step ${stepIndex + 1} of ${allMoves.length}</strong>
    </div>
    <div class="notice info" style="margin-bottom:10px">
      Move <strong>${esc(move.booking.GuestFullName || move.booking.BookingRef)}</strong>
      (${esc(move.booking.BookingRef)})<br>
      from <strong>${esc(fromLabel ? standLabel(fromLabel) : move.originalStandId)}</strong>
      to <strong>${esc(toLabel ? standLabel(toLabel) : move.newStandId)}</strong>
    </div>
    <label class="check" style="font-size:11px;margin-bottom:8px;display:flex;align-items:center;gap:6px">
      <input type="checkbox" id="stepEmailCb" ${sendEmail ? 'checked' : ''}><span>Notify this guest by email</span>
    </label>
    <div style="display:flex;gap:6px">
      <button class="btn btn-soft" style="flex:1" onclick="(function(){const b=_getBookingForEdit(APP._chainTargetId);if(b){APP.selected={kind:'booking',data:b};}renderInspector(APP.selected);})()">Cancel all</button>
      <button class="btn btn-brand" style="flex:1" id="stepConfirmBtn" onclick="_confirmStep()">Confirm this move</button>
    </div>
    <div id="stepMsg" style="margin-top:8px"></div>`;
  // Store needed data
  APP._chainExecution = { allMoves, stepIndex, sendEmail, targetBookingId, suggIndex, newTotal };
}

async function _confirmStep() {
  const exec = APP._chainExecution || {};
  const { stepIndex, allMoves, targetBookingId, suggIndex } = exec;
  const move = allMoves[stepIndex];
  const sendStepEmail = document.getElementById('stepEmailCb')?.checked;
  const btn = document.getElementById('stepConfirmBtn');
  btn.disabled = true; btn.textContent = 'Saving…';
  const newTotal = exec.newTotal || move.booking.TotalSnapshot || '0';
  try {
    const res = await apiCall('editBookingDetails', {
      bookingId: move.bookingId, editType: 'reallocation',
      newStandId: move.newStandId, newStandTypeId: move.newStandTypeId,
      newTotal: move.keepTotal ? (move.booking.TotalSnapshot || '0') : newTotal,
      kkbookLevel: APP.kkbookLevel || '',
      notes: 'Chain reallocation step ' + (stepIndex + 1)
    }, 'POST');
    if (!res.success) throw new Error(res.error || 'Move failed');
    const localB = APP.state.bookings.find(x => x.BookingID === move.bookingId);
    if (localB) { localB.StandID = move.newStandId; localB.StandTypeID = move.newStandTypeId; }
    if (sendStepEmail) {
      try { await sendBookingEmailToGuest(move.bookingId, 'status_change', {newStatus: move.booking.Status, oldStatus: move.booking.Status}); } catch(e) {}
    }
    _runStepByStep(allMoves, stepIndex + 1, exec.sendEmail, targetBookingId, suggIndex);
  } catch(err) {
    const msg = document.getElementById('stepMsg');
    if (msg) msg.innerHTML = `<div class="notice bad">${esc(err.message || String(err))}</div>`;
    btn.disabled = false; btn.textContent = 'Confirm this move';
  }
}

async function _rollbackMoves(executedMoves) {
  for (let i = executedMoves.length - 1; i >= 0; i--) {
    const move = executedMoves[i];
    try {
      await apiCall('editBookingDetails', {
        bookingId: move.bookingId, editType: 'reallocation',
        newStandId: move.originalStandId, newStandTypeId: move.originalStandTypeId,
        newTotal: move.booking.TotalSnapshot || '0',
        notes: 'Rollback of failed chain reallocation'
      }, 'POST');
      const localB = APP.state.bookings.find(x => x.BookingID === move.bookingId);
      if (localB) { localB.StandID = move.originalStandId; localB.StandTypeID = move.originalStandTypeId; }
    } catch(rollErr) {
      showToast('Warning: could not revert ' + move.booking.BookingRef + '. Check manually.', 'warn');
    }
  }
}

function showCheckInOutPopup(bookingId,newStatus){
  const label=newStatus==='checked-in'?'Check-in':'Check-out';
  const existing=document.getElementById('kkCioPopup');if(existing)existing.remove();
  const el=document.createElement('div');
  el.id='kkCioPopup';
  el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9998;padding:16px';
  el.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.25)"><div style="font-family:'Poppins',sans-serif;font-weight:800;font-size:14px;margin-bottom:6px">${label} Confirmation</div><div style="font-size:12px;color:var(--muted);margin-bottom:20px">Send a notification email to the guest?</div><div style="display:flex;gap:10px"><button class="btn btn-brand" style="flex:1" onclick="completeCheckInOut('${esc(bookingId)}','${newStatus}',true)">&#128231; Send Email</button><button class="btn btn-soft" style="flex:1" onclick="completeCheckInOut('${esc(bookingId)}','${newStatus}',false)">No Email</button></div></div>`;
  document.body.appendChild(el);
}
async function completeCheckInOut(bookingId,newStatus,sendEmail){
  document.getElementById('kkCioPopup')?.remove();
  const booking=APP.state.bookings.find(b=>b.BookingID===bookingId);
  const oldStatus=booking?.Status||'';
  await quickStatusChangeFromRow(bookingId,newStatus);
  if(sendEmail)await sendBookingEmailToGuest(bookingId,newStatus==='checked-in'?'check_in':'check_out',{newStatus,oldStatus});
}
function showToast(msg,type){type=type||'info';const colors={ok:'var(--ok)',warn:'var(--warn)',bad:'var(--bad)',info:'var(--brand)'};const el=document.createElement('div');el.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid '+colors[type]+';color:'+colors[type]+';font-weight:800;font-size:13px;padding:10px 20px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);z-index:9999;transition:opacity .3s';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),300);},2500);}
async function openImagePicker(){const resort=APP.state.resort||{};const folderLink=resort['Resort- Header/DriveFolderLink']||'';if(!folderLink){showToast('No Drive folder configured for this resort.','warn');return;}const body=document.getElementById('imagePickerBody');const folderEl=document.getElementById('imagePickerFolderName');if(body)body.innerHTML='<div style="padding:40px 0"><div class="small">Loading images\u2026</div></div>';if(folderEl)folderEl.textContent='';openModal('imagePickerModal');try{const res=await apiCall('listDriveFolderImages',{folderLink},'GET');if(!res.success){if(body)body.innerHTML=`<div class="notice bad">${esc(res.error||'Could not load images')}</div>`;return;}if(folderEl&&res.folderName)folderEl.textContent=res.folderName;if(!res.images||!res.images.length){if(body)body.innerHTML='<div style="padding:30px 0"><div class="small">No image files found.</div></div>';return;}renderImagePickerGrid(res.images);}catch(err){if(body)body.innerHTML=`<div class="notice bad">${esc(err.message||String(err))}</div>`;}}
function renderImagePickerGrid(images){const body=document.getElementById('imagePickerBody');if(!body)return;const currentUrl=document.getElementById('standImageURL')?.value||'';body.innerHTML=`<div class="small" style="margin-bottom:10px;color:var(--muted)">${esc(images.length)} image${images.length!==1?'s':''} \u2014 click one to select</div><div class="img-pick-grid">${images.map(img=>`<div class="img-pick-card${currentUrl===img.url?' selected':''}" onclick="pickStandImage('${esc(img.url)}','${esc(img.name)}')" title="${esc(img.name)}"><img src="${esc(img.thumbnail)}" alt="${esc(img.name)}" onerror="this.style.height='60px';this.alt='\u26a0 Preview not available'"><div class="img-label">${esc(img.name)}</div></div>`).join('')}</div>`;}
function pickStandImage(url,name){const input=document.getElementById('standImageURL');if(input)input.value=url;const preview=document.getElementById('standImgPreview');if(preview){preview.innerHTML=`<img class="stand-img-thumb" src="${esc(url)}" alt="${esc(name)}" style="max-height:130px"><div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="btn btn-soft" onclick="openImagePicker()">Change Image</button><button type="button" class="btn btn-soft" style="color:var(--bad)" onclick="clearStandImage()">Remove</button></div>`;}closeModal('imagePickerModal');showToast('Image selected: '+name,'ok');}
function clearStandImage(){const input=document.getElementById('standImageURL');if(input)input.value='';const preview=document.getElementById('standImgPreview');if(preview){preview.innerHTML=`<div class="small" style="color:var(--subtle);padding:8px 0">No image set</div><button type="button" class="btn btn-soft" style="margin-top:4px" onclick="openImagePicker()">Pick from Drive</button>`;}}
// Option B: click-away clears util filter
document.addEventListener('click', function(e) {
  if (!APP.utilFilter) return;
  var search = document.getElementById('search');
  if (search && search.contains(e.target)) return;
  clearStandsFilter();
}, false);
// ── Cross-page navigation — carries session through URL ───────────────────────
function navigateToPage_(page) {
  // Session is managed by Supabase — just pass the resort ID.
  const params = new URLSearchParams();
  if (APP.resortId) params.set('resort', APP.resortId);
  window.location.href = page + (params.toString() ? '?' + params.toString() : '');
}

// ── Commission Split Modal ────────────────────────────────────────────────────
async function openCommsSplitModal(){
  // Load tiers on demand if not already loaded
  if(!(APP.state.tiers||[]).length){
    try{const r=await apiCall('listTiers',{},'GET');if(r.success){APP.state.tiers=r.tiers||[];TIERS_DATA=r.tiers||[];}}catch(e){}
  }
  const currency=APP.state.resortDefaults?.DefaultCurrency||'ZAR';
  const today=dateOnly(new Date());
  // Tier setup
  const kkLevel=(APP.kkbookLevel||'').trim().toUpperCase();
  const tiers=APP.state.tiers||[];
  const activeTier=kkLevel?tiers.find(t=>String(t.TierID||'').trim().toUpperCase()===kkLevel||String(t.TierName||'').trim().toUpperCase()===kkLevel):null;
  const promoEnd=activeTier?String(activeTier.PromoEndDate||'').trim().slice(0,10):'';
  // Per-booking commission calculator
  function calcBookingComm(x){
    let snap=null;try{snap=JSON.parse(x.CommsSnapshot||'null');}catch(e){}
    if(snap&&typeof snap.commission==='number'&&snap.commission>0)return snap.commission;
    if(!activeTier)return 0;
    const bookingMadeOn=dateOnly(x.CreatedAt||new Date());
    const usePromo=promoEnd&&bookingMadeOn<=promoEnd;
    const basis=String(x.Source||'').toLowerCase()==='website'?'online':'admin';
    const onlineRate=usePromo?Number(activeTier.PromoOnlineRate||activeTier.OnlineRate||0):Number(activeTier.OnlineRate||0);
    const adminRate=usePromo?Number(activeTier.PromoAdminRate||activeTier.AdminRate||0):Number(activeTier.AdminRate||0);
    return Math.round(Number(x.TotalSnapshot||0)*(basis==='online'?onlineRate:adminRate)/100*100)/100;
  }
  // Period summary: actual = checked out, projected = yet to check out, promoCount = bookings at promo rate
  function periodSummary(rangeStart,rangeEnd){
    const bks=APP.state.bookings.filter(x=>{
      if(x.SoftDeleted||['cancelled','no-show'].includes(String(x.Status||'').toLowerCase()))return false;
      const co=displayDate(x.CheckOutDate);
      return co&&co>=rangeStart&&co<=rangeEnd;
    });
    const actual=bks.filter(x=>displayDate(x.CheckOutDate)<=today);
    const projected=bks.filter(x=>displayDate(x.CheckOutDate)>today);
    let promoCount=0;
    function calcAndTrack(x){
      let snap=null;try{snap=JSON.parse(x.CommsSnapshot||'null');}catch(e){}
      if(snap&&typeof snap.commission==='number'&&snap.commission>0){if(snap.promoApplied)promoCount++;return snap.commission;}
      if(!activeTier)return 0;
      const bookingMadeOn=dateOnly(x.CreatedAt||new Date());
      const usePromo=promoEnd&&bookingMadeOn<=promoEnd;
      if(usePromo)promoCount++;
      const basis=String(x.Source||'').toLowerCase()==='website'?'online':'admin';
      const onlineRate=usePromo?Number(activeTier.PromoOnlineRate||activeTier.OnlineRate||0):Number(activeTier.OnlineRate||0);
      const adminRate=usePromo?Number(activeTier.PromoAdminRate||activeTier.AdminRate||0):Number(activeTier.AdminRate||0);
      return Math.round(Number(x.TotalSnapshot||0)*(basis==='online'?onlineRate:adminRate)/100*100)/100;
    }
    return{
      actual:actual.reduce((s,x)=>s+calcAndTrack(x),0),
      projected:projected.reduce((s,x)=>s+calcAndTrack(x),0),
      promoCount
    };
  }
  // Date ranges
  const curM=todayMonth(),prevM=addMonths(curM,-1),nextM=addMonths(curM,1);
  const lastStart=prevM+'-01', lastEnd=addDays(curM+'-01',-1);
  const curStart=curM+'-01',   curEnd=addDays(nextM+'-01',-1);
  const nextStart=nextM+'-01', nextEnd=addDays(addMonths(nextM,1)+'-01',-1);
  const last=periodSummary(lastStart,lastEnd);
  const cur=periodSummary(curStart,curEnd);
  const next=periodSummary(nextStart,nextEnd);
  const tierLabel=activeTier?esc(activeTier.TierName||activeTier.TierID):'No tier matched';
  const fmt=v=>esc(formatMoney(v,currency));
  const _cb=document.getElementById('inspector');
  if(!_cb)return;
  const R=(label,value,color)=>`<div style="display:flex;justify-content:space-between;align-items:baseline;line-height:1.3"><span style="font-size:11.5px;color:var(--muted)">${label}</span><strong style="font-size:12.5px;color:${color||'var(--text)'}">${value}</strong></div>`;
  const H=(label)=>`<div style="font-size:8.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);font-weight:800;line-height:1.2;margin-top:5px">${label}</div>`;
  const D=`<div style="border-top:1px solid var(--border);margin:10px 0 0"></div>`;
  const PROMO=(n)=>n?`<div style="font-size:10px;color:var(--warn);font-weight:700;line-height:1.3">⚡ ${n} booking${n!==1?'s':''} at promo rate</div>`:'';
  if(!_cb)return;
  _cb.innerHTML=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-family:'Poppins',sans-serif;font-weight:800;font-size:13px">KK Commission</span><span class="chip ok" style="font-size:10px;padding:1px 8px">${tierLabel}</span></div><div>${H('Last Month')}${R('Actual',fmt(last.actual),'var(--ok)')}${PROMO(last.promoCount)}${D}${H('This Month')}${R('Actual',fmt(cur.actual),'var(--ok)')}${R('Projected',fmt(cur.projected),'var(--warn)')}${PROMO(cur.promoCount)}<div style="display:flex;justify-content:space-between;align-items:baseline;line-height:1.3;border-top:1px solid var(--border);margin-top:3px"><span style="font-size:11.5px;font-weight:800">Total</span><strong style="font-size:12.5px;font-family:'Poppins',sans-serif;color:var(--brand-d)">${fmt(cur.actual+cur.projected)}</strong></div>${D}${H('Next Month')}${R('Projected',fmt(next.projected),'var(--warn)')}${PROMO(next.promoCount)}${D}</div>`;
}
// ── Tiers view (KK Super Admin only) ─────────────────────────────────────────
let TIERS_DATA=[];
async function loadTiersView(){
  if(!isKKSuperAdmin())return;
  const content=document.getElementById('mainContent');if(!content)return;
  content.innerHTML='<div class="panel-b"><div class="small" style="color:var(--muted)">Loading tiers…</div></div>';
  try{const res=await apiCall('listTiers',{},'GET');TIERS_DATA=res.tiers||[];renderTiersTable();}
  catch(err){content.innerHTML=`<div class="notice bad">${esc(err.message)}</div>`;}
}
function renderTiersTable(){
  const content=document.getElementById('mainContent');if(!content)return;
  if(!TIERS_DATA.length){content.innerHTML='<div class="notice info" style="margin:16px">No tiers yet. Click “+ Add Tier” to create one.</div>';return;}
  content.innerHTML=`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Tier ID</th><th>Name</th><th>Online %</th><th>Admin %</th><th>Promo Online %</th><th>Promo Admin %</th><th>Promo Until</th><th>Description</th><th></th></tr></thead><tbody>${TIERS_DATA.map(t=>`<tr onclick="openTierModal('${esc(t.TierID)}')" style="cursor:pointer"><td><strong>${esc(t.TierID)}</strong></td><td>${esc(t.TierName)}</td><td>${esc(t.OnlineRate||0)}%</td><td>${esc(t.AdminRate||0)}%</td><td>${t.PromoOnlineRate?esc(t.PromoOnlineRate)+'%':'—'}</td><td>${t.PromoAdminRate?esc(t.PromoAdminRate)+'%':'—'}</td><td>${t.PromoEndDate?esc(String(t.PromoEndDate).slice(0,10)):'—'}</td><td style="color:var(--muted)">${esc(t.Description||'')}</td><td onclick="event.stopPropagation()"><button class="btn" style="background:var(--bad-l);color:var(--bad);height:26px;padding:0 8px;font-size:10px" onclick="deleteTierRow('${esc(t.TierID)}')">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}
function openTierModal(tierId){
  const t=tierId?(TIERS_DATA.find(x=>x.TierID===tierId)||{}):{};
  const _tb=document.getElementById('inspector');
  if(!_tb)return;
  _tb.innerHTML=`<div style="font-weight:800;margin-bottom:12px">${tierId?'Edit: '+esc(t.TierID):'New Tier'}</div>
    <div class="field"><label>Tier ID (e.g. PIONEER)</label><input class="input" id="tTierID" value="${esc(t.TierID||'')}" ${tierId?'readonly':''}></div>
    <div class="field"><label>Tier Name</label><input class="input" id="tTierName" value="${esc(t.TierName||'')}"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="field"><label>Online Rate %</label><input class="input" id="tOnlineRate" type="number" step="0.1" min="0" max="100" value="${esc(t.OnlineRate||0)}"></div>
      <div class="field"><label>Admin Rate %</label><input class="input" id="tAdminRate" type="number" step="0.1" min="0" max="100" value="${esc(t.AdminRate||0)}"></div>
      <div class="field"><label>Promo Online %</label><input class="input" id="tPromoOnlineRate" type="number" step="0.1" min="0" max="100" value="${esc(t.PromoOnlineRate||'')}"></div>
      <div class="field"><label>Promo Admin %</label><input class="input" id="tPromoAdminRate" type="number" step="0.1" min="0" max="100" value="${esc(t.PromoAdminRate||'')}"></div>
    </div>
    <div class="field"><label>Promo End Date</label><input class="input" id="tPromoEndDate" type="date" value="${esc(t.PromoEndDate?String(t.PromoEndDate).slice(0,10):'')}"></div>
    <div class="field"><label>Description</label><input class="input" id="tDescription" value="${esc(t.Description||'')}"></div>
    <div id="tierMsg" style="margin-top:8px"></div>
    <button class="btn btn-brand" style="width:100%;margin-top:10px" onclick="saveTier()">Save Tier</button>`;
}
async function saveTier(){
  const id=(document.getElementById('tTierID')?.value||'').trim().toUpperCase();
  if(!id){const m=document.getElementById('tierMsg');if(m)m.innerHTML='<div class="notice warn">Tier ID is required.</div>';return;}
  const body={TierID:id,TierName:document.getElementById('tTierName')?.value||'',OnlineRate:document.getElementById('tOnlineRate')?.value||0,AdminRate:document.getElementById('tAdminRate')?.value||0,PromoOnlineRate:document.getElementById('tPromoOnlineRate')?.value||'',PromoAdminRate:document.getElementById('tPromoAdminRate')?.value||'',PromoEndDate:document.getElementById('tPromoEndDate')?.value||'',Description:document.getElementById('tDescription')?.value||''};
  const msgEl=document.getElementById('tierMsg');if(msgEl)msgEl.innerHTML='<div class="notice info">Saving…</div>';
  try{
    const res=await apiCall('upsertTier',body,'POST');if(!res.success)throw new Error(res.error||'Failed');
    const res2=await apiCall('listTiers',{},'GET');TIERS_DATA=res2.tiers||[];
    renderTiersTable();renderInspector(null);
  }catch(err){if(msgEl)msgEl.innerHTML=`<div class="notice bad">${esc(err.message)}</div>`;}
}
async function deleteTierRow(tierId){
  if(!confirm(`Delete tier "${tierId}"? This cannot be undone.`))return;
  try{
    const res=await gasCall('deleteTier',{TierID:tierId},'POST');if(!res.success)throw new Error(res.error||'Failed');
    TIERS_DATA=TIERS_DATA.filter(t=>t.TierID!==tierId);renderTiersTable();
  }catch(err){alert(err.message);}
}

async function boot() {
  await loadConfig();
  createMonthKeys();
  APP.resortId = getQueryResortId();
  showConnectMessage('Loading booking data\u2026');
  setApiState('Connecting\u2026', null);

  // Restore Supabase session
  const { data: { session }, error: sessErr } = await sb.auth.getSession();
  if (sessErr || !session) {
    showAuthRequired('Please sign in through the Admin Portal.');
    return;
  }

  // Read identity from JWT app_metadata
  let meta = {};
  try {
    const claims = JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    meta = claims.app_metadata || {};
  } catch(_) {}
  if (!meta.role && !meta.resort_id) meta = session.user?.app_metadata || {};

  APP.userEmail  = session.user?.email || '';
  APP.resortRole = meta.role || 'Super';
  APP.resortId   = meta.role === 'KampKiepie'
    ? (getQueryResortId() || meta.resort_id || APP.resortId)
    : String(meta.resort_id || getQueryResortId() || APP.resortId);
  APP.role = meta.role === 'KampKiepie' ? 'superadmin' : 'resort';

  try {
    await initLiveData();
    hideConnectGate();
    applySessionIdentity();
    lastLiveUpdate = new Date(); updateLiveIndicator();
    startLivePolling();
  } catch(err) {
    console.warn(err);
    setApiState('Offline', false);
    showConnectRetry('Could not load data: ' + (err.message || err));
  }
}
boot();