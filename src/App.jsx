import { useState, useEffect, useCallback } from "react";

// ⚠️ Reemplaza esta URL por la URL pública de tu servicio de backend en Railway
const API_BASE = "https://fundacion-backend-production-ab2f.up.railway.app";

// ===================== DATOS BASE =====================
const EPS_LIST = [
  { id: 1, nombre: "Cafesalud" }, { id: 2, nombre: "Calisalud" },
  { id: 3, nombre: "Caprecom" }, { id: 4, nombre: "Capresoca" },
  { id: 5, nombre: "Colmédica" }, { id: 6, nombre: "Compensar" },
  { id: 7, nombre: "Comfenalco Antioquia" }, { id: 8, nombre: "Comfenalco Valle" },
  { id: 9, nombre: "Convida ARS" }, { id: 10, nombre: "Coomeva EPS" },
  { id: 11, nombre: "Cruz Blanca" }, { id: 12, nombre: "Famisanar" },
  { id: 13, nombre: "Humana Vivir" }, { id: 14, nombre: "ISS" },
  { id: 15, nombre: "Salud Colmena" }, { id: 16, nombre: "Salud Colpatria" },
  { id: 17, nombre: "Salud Total" }, { id: 18, nombre: "Saludcolombia" },
  { id: 19, nombre: "SaludCoop" }, { id: 20, nombre: "Saludvida" },
  { id: 21, nombre: "Sanitas" }, { id: 22, nombre: "Selvasalud" },
  { id: 23, nombre: "Solsalud" }, { id: 24, nombre: "SOS EPS" },
  { id: 25, nombre: "Susalud" }, { id: 26, nombre: "SALUD BOGOTÁ" },
];

const LOCALIDADES = [
  { id: 1, nombre: "Usaquén" }, { id: 2, nombre: "Chapinero" },
  { id: 3, nombre: "Santa Fe" }, { id: 4, nombre: "San Cristóbal" },
  { id: 5, nombre: "Usme" }, { id: 6, nombre: "Tunjuelito" },
  { id: 7, nombre: "Bosa" }, { id: 8, nombre: "Kennedy" },
  { id: 9, nombre: "Fontibón" }, { id: 10, nombre: "Engativá" },
  { id: 11, nombre: "Suba" }, { id: 12, nombre: "Barrios Unidos" },
  { id: 13, nombre: "Teusaquillo" }, { id: 14, nombre: "Los Mártires" },
  { id: 15, nombre: "Antonio Nariño" }, { id: 16, nombre: "Puente Aranda" },
  { id: 17, nombre: "La Candelaria" }, { id: 18, nombre: "Rafael Uribe Uribe" },
  { id: 19, nombre: "Ciudad Bolívar" }, { id: 20, nombre: "Sumapaz" },
  { id: 21, nombre: "Sibaté" }, { id: 22, nombre: "Soacha" },
  { id: 23, nombre: "Fusagasugá" }, { id: 24, nombre: "Chía" },
  { id: 25, nombre: "Cundinamarca" }, { id: 26, nombre: "Páramo" },
  { id: 30, nombre: "Sin Asignar" },
];

const REGIMEN = ["CONTRIBUTIVO", "SUBSIDIADO", "ESPECIAL", "SIN RÉGIMEN"];
const ESTRATOS = [0, 1, 2, 3, 4, 5, 6];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];
const RH = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const ESTADOS = ["ACTIVO", "INACTIVO"];

// ===================== ESTADO INICIAL =====================
const EMPTY_AFILIADO = {
  apellidos_afiliado: "",
  nombres_afiliado: "",
  doc_afiliado: "",
  no_carnet_afiliado: "",
  talla_afiliado: "",
  nombre_carnet_afiliado: "",
  genero_afiliado: "",
  nac_afiliado: "",
  id_eps: "",
  regimen_afiliado: "",
  estrato_afiliado: "",
  rh_afiliado: "",
  tel_afiliado: "",
  cel_afiliado: "",
  dir_afiliado: "",
  id_barrio: "",
  email_afiliado: "",
  id_asociacion: "",
  estado_afiliado: "ACTIVO",
  obs_afiliado: "",
};

// ===================== API =====================
async function apiList(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/afiliados?${qs}`);
  if (!res.ok) throw new Error("Error consultando afiliados");
  return res.json();
}
async function apiStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error("Error consultando estadísticas");
  return res.json();
}
async function apiCreate(data) {
  const res = await fetch(`${API_BASE}/api/afiliados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando afiliado");
  return res.json();
}
async function apiUpdate(id, data) {
  const res = await fetch(`${API_BASE}/api/afiliados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando afiliado");
  return res.json();
}
async function apiDelete(id) {
  const res = await fetch(`${API_BASE}/api/afiliados/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Error eliminando afiliado");
}
async function apiLocalidades() {
  const res = await fetch(`${API_BASE}/api/localidades`);
  if (!res.ok) throw new Error("Error consultando localidades");
  return res.json();
}
async function apiAsociaciones(idLocalidad) {
  const qs = idLocalidad ? `?id_localidad=${idLocalidad}` : "";
  const res = await fetch(`${API_BASE}/api/asociaciones${qs}`);
  if (!res.ok) throw new Error("Error consultando asociaciones");
  return res.json();
}
async function apiBarrios(idLocalidad) {
  const qs = idLocalidad ? `?id_localidad=${idLocalidad}` : "";
  const res = await fetch(`${API_BASE}/api/barrios${qs}`);
  if (!res.ok) throw new Error("Error consultando barrios");
  return res.json();
}

// ===================== ESTILOS =====================
const S = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1724 0%, #1a2744 50%, #0f1724 100%)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: "#e8edf5",
  },
  header: {
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  logoAccent: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, #4f8ef7, #7c5fe8)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  nav: { display: "flex", gap: 4 },
  navBtn: (active) => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.15s",
    background: active ? "rgba(79,142,247,0.15)" : "transparent",
    color: active ? "#4f8ef7" : "rgba(255,255,255,0.6)",
    borderBottom: active ? "2px solid #4f8ef7" : "2px solid transparent",
  }),
  main: { padding: "32px", maxWidth: 1800, margin: "0 auto" },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 24,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  cardTitleIcon: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, #4f8ef7, #7c5fe8)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
  },
  grid: (cols = 2) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "16px 20px",
    marginBottom: 24,
  }),
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 14,
    color: "#e8edf5",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: "rgba(20,32,56,0.9)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 14,
    color: "#e8edf5",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  textarea: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 14,
    color: "#e8edf5",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 72,
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #4f8ef7, #7c5fe8)",
    border: "none",
    borderRadius: 10,
    padding: "11px 24px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "11px 24px",
    fontSize: 14,
    fontWeight: 600,
    color: "#e8edf5",
    cursor: "pointer",
    transition: "background 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnDanger: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#f87171",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnEdit: {
    background: "rgba(79,142,247,0.12)",
    border: "1px solid rgba(79,142,247,0.25)",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#4f8ef7",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.4)",
    textAlign: "left",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 16px",
    fontSize: 15,
    color: "#d0d8ea",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    verticalAlign: "middle",
  },
  trHover: { transition: "background 0.1s", cursor: "pointer" },
  badgeActivo: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#4ade80",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
  },
  badgeInactivo: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#f87171",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
  },
  searchBox: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 14,
    color: "#e8edf5",
    outline: "none",
  },
  alert: (type) => ({
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 20,
    background: type === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
    border: `1px solid ${type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
    color: type === "success" ? "#4ade80" : "#f87171",
  }),
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "20px 22px",
  },
  statNum: { fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1 },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6, fontWeight: 500 },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    background: "#1a2744",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "32px",
    width: "100%",
    maxWidth: 760,
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    top: 16, right: 16,
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: 8,
    width: 32, height: 32,
    cursor: "pointer",
    color: "rgba(255,255,255,0.6)",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailRow: {
    display: "flex",
    gap: 8,
    padding: "9px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: 14,
  },
  detailLabel: { color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 12, width: 160, flexShrink: 0, paddingTop: 1 },
  detailVal: { color: "#e8edf5" },
  sectionDivider: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
    margin: "20px 0 12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.07)",
  },
  layout: { display: "flex", gap: 24, alignItems: "flex-start" },
  sidebar: {
    width: 260,
    flexShrink: 0,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "sticky",
    top: 80,
  },
  content: { flex: 1, minWidth: 0 },
  sidebarTitle: { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 },
  btnExport: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#4ade80",
    cursor: "pointer",
    width: "100%",
  },
};

// ===================== HELPERS =====================
function epsNombre(id) {
  return EPS_LIST.find(e => e.id === Number(id))?.nombre || (id ?? "—");
}
function localidadNombre(id) {
  return LOCALIDADES.find(l => l.id === Number(id))?.nombre || (id ?? "—");
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}
function calcEdad(d) {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d)) / (365.25 * 24 * 3600 * 1000));
}
function telefonoPrincipal(a) {
  return a.cel_afiliado || a.tel_afiliado || "—";
}

// ===================== COMPONENTES =====================

function Field({ label, children }) {
  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Input({ style, ...props }) {
  return <input style={{ ...S.input, ...style }} {...props} />;
}

function Select({ children, style, ...props }) {
  return (
    <select style={{ ...S.select, ...style }} {...props}>
      {children}
    </select>
  );
}

// ===================== FORMULARIO DE AFILIADO =====================
function AfiliadoForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_AFILIADO, ...initial });
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.apellidos_afiliado || !form.nombres_afiliado || !form.doc_afiliado) {
      setAlert({ type: "error", msg: "Apellidos, nombres y documento son obligatorios." });
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setAlert({ type: "error", msg: "No se pudo guardar. Intenta de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {alert && <div style={S.alert(alert.type)}>{alert.msg}</div>}

      <div style={S.sectionDivider}>
        <span>Datos personales</span>
        <span style={S.dividerLine} />
      </div>
      <div style={S.grid(3)}>
        <Field label="Apellidos *">
          <Input value={form.apellidos_afiliado || ""} onChange={e => set("apellidos_afiliado", e.target.value.toUpperCase())} placeholder="APELLIDO APELLIDO" />
        </Field>
        <Field label="Nombres *">
          <Input value={form.nombres_afiliado || ""} onChange={e => set("nombres_afiliado", e.target.value.toUpperCase())} placeholder="NOMBRE NOMBRE" />
        </Field>
        <Field label="Documento *">
          <Input value={form.doc_afiliado || ""} onChange={e => set("doc_afiliado", e.target.value)} placeholder="Cédula / Tarjeta" />
        </Field>
        <Field label="Género">
          <Select value={form.genero_afiliado || ""} onChange={e => set("genero_afiliado", e.target.value)}>
            <option value="">— Seleccionar —</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </Select>
        </Field>
        <Field label="Fecha de nacimiento">
          <Input type="date" value={form.nac_afiliado ? String(form.nac_afiliado).slice(0, 10) : ""} onChange={e => set("nac_afiliado", e.target.value)} />
        </Field>
        <Field label="RH">
          <Select value={form.rh_afiliado || ""} onChange={e => set("rh_afiliado", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {RH.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
      </div>

      <div style={S.sectionDivider}>
        <span>Carnet y talla</span>
        <span style={S.dividerLine} />
      </div>
      <div style={S.grid(3)}>
        <Field label="Nº Carnet">
          <Input type="number" value={form.no_carnet_afiliado ?? ""} onChange={e => set("no_carnet_afiliado", e.target.value)} placeholder="00000" />
        </Field>
        <Field label="Nombre en carnet">
          <Input value={form.nombre_carnet_afiliado || ""} onChange={e => set("nombre_carnet_afiliado", e.target.value)} placeholder="Nombre para imprimir" />
        </Field>
        <Field label="Talla camiseta">
          <Select value={form.talla_afiliado || ""} onChange={e => set("talla_afiliado", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {TALLAS.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
      </div>

      <div style={S.sectionDivider}>
        <span>EPS y régimen</span>
        <span style={S.dividerLine} />
      </div>
      <div style={S.grid(3)}>
        <Field label="EPS">
          <Select value={form.id_eps ?? ""} onChange={e => set("id_eps", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {EPS_LIST.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </Select>
        </Field>
        <Field label="Régimen">
          <Select value={form.regimen_afiliado || ""} onChange={e => set("regimen_afiliado", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {REGIMEN.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Estrato">
          <Select value={form.estrato_afiliado ?? ""} onChange={e => set("estrato_afiliado", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {ESTRATOS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <div style={S.sectionDivider}>
        <span>Contacto y ubicación</span>
        <span style={S.dividerLine} />
      </div>
      <div style={S.grid(3)}>
        <Field label="Teléfono fijo">
          <Input value={form.tel_afiliado || ""} onChange={e => set("tel_afiliado", e.target.value)} placeholder="601 XXXXXXX" />
        </Field>
        <Field label="Celular">
          <Input value={form.cel_afiliado || ""} onChange={e => set("cel_afiliado", e.target.value)} placeholder="3XX XXX XXXX" />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email_afiliado || ""} onChange={e => set("email_afiliado", e.target.value)} placeholder="correo@email.com" />
        </Field>
        <Field label="Dirección">
          <Input value={form.dir_afiliado || ""} onChange={e => set("dir_afiliado", e.target.value)} placeholder="CL / CR / DG..." />
        </Field>
        <Field label="Localidad">
          <Select value={form.id_barrio ?? ""} onChange={e => set("id_barrio", e.target.value)}>
            <option value="">— Seleccionar —</option>
            {LOCALIDADES.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={form.estado_afiliado || "ACTIVO"} onChange={e => set("estado_afiliado", e.target.value)}>
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Observaciones">
        <textarea
          style={S.textarea}
          value={form.obs_afiliado || ""}
          onChange={e => set("obs_afiliado", e.target.value)}
          placeholder="Notas adicionales..."
          rows={3}
        />
      </Field>

      <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
        {onCancel && <button style={S.btnSecondary} onClick={onCancel}>Cancelar</button>}
        <button style={S.btnPrimary} onClick={handleSubmit} disabled={saving}>
          💾 {saving ? "Guardando..." : initial?.id_afiliado ? "Guardar cambios" : "Registrar afiliado"}
        </button>
      </div>
    </div>
  );
}

// ===================== MODAL DETALLE =====================
function DetalleModal({ afiliado, onClose, onEdit }) {
  if (!afiliado) return null;
  const edad = afiliado.nac_afiliado
    ? Math.floor((Date.now() - new Date(afiliado.nac_afiliado)) / (365.25 * 24 * 3600 * 1000))
    : null;

  const Row = ({ label, val }) => (
    <div style={S.detailRow}>
      <span style={S.detailLabel}>{label}</span>
      <span style={S.detailVal}>{val || "—"}</span>
    </div>
  );

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <button style={S.modalClose} onClick={onClose}>✕</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              {afiliado.apellidos_afiliado}, {afiliado.nombres_afiliado}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
              CC {afiliado.doc_afiliado}
              {edad ? ` · ${edad} años` : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={afiliado.estado_afiliado === "ACTIVO" ? S.badgeActivo : S.badgeInactivo}>
              {afiliado.estado_afiliado}
            </span>
            <button style={S.btnEdit} onClick={onEdit}>✏️ Editar</button>
          </div>
        </div>

        <div style={S.sectionDivider}><span>Personal</span><span style={S.dividerLine} /></div>
        <Row label="Género" val={afiliado.genero_afiliado === "M" ? "Masculino" : afiliado.genero_afiliado === "F" ? "Femenino" : afiliado.genero_afiliado} />
        <Row label="Nacimiento" val={formatDate(afiliado.nac_afiliado)} />
        <Row label="RH" val={afiliado.rh_afiliado} />
        <Row label="Talla" val={afiliado.talla_afiliado} />
        <Row label="Nº Carnet" val={afiliado.no_carnet_afiliado} />
        <Row label="Nombre carnet" val={afiliado.nombre_carnet_afiliado} />

        <div style={S.sectionDivider}><span>EPS y Régimen</span><span style={S.dividerLine} /></div>
        <Row label="EPS" val={epsNombre(afiliado.id_eps)} />
        <Row label="Régimen" val={afiliado.regimen_afiliado} />
        <Row label="Estrato" val={afiliado.estrato_afiliado} />

        <div style={S.sectionDivider}><span>Contacto</span><span style={S.dividerLine} /></div>
        <Row label="Teléfono" val={afiliado.tel_afiliado} />
        <Row label="Celular" val={afiliado.cel_afiliado} />
        <Row label="Email" val={afiliado.email_afiliado} />
        <Row label="Dirección" val={afiliado.dir_afiliado} />
        <Row label="Barrio" val={afiliado.nombre_barrio || localidadNombre(afiliado.id_barrio)} />
        <Row label="Localidad" val={afiliado.nombre_localidad} />

        <div style={S.sectionDivider}><span>Asociación</span><span style={S.dividerLine} /></div>
        <Row label="Asociación" val={afiliado.nombre_asociacion} />
        <Row label="Coordinador" val={afiliado.coordinador} />
        <Row label="Cel. coordinador" val={afiliado.celular_coordinador} />

        {afiliado.obs_afiliado && (
          <>
            <div style={S.sectionDivider}><span>Observaciones</span><span style={S.dividerLine} /></div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{afiliado.obs_afiliado}</div>
          </>
        )}
      </div>
    </div>
  );
}

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

function ConsultaView() {
  const [query, setQuery] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [filtroBarrio, setFiltroBarrio] = useState("");
  const [filtroAsociacion, setFiltroAsociacion] = useState("");
  const [filtroCoordinador, setFiltroCoordinador] = useState("");
  const [filtroMesCumple, setFiltroMesCumple] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0, conEps: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [localidades, setLocalidades] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [barrios, setBarrios] = useState([]);

  // Load localidades once
  useEffect(() => {
    apiLocalidades().then(setLocalidades).catch(() => {});
  }, []);

  // Load asociaciones and barrios when localidad changes (cascading)
  useEffect(() => {
    apiAsociaciones(filtroLocalidad || undefined).then(setAsociaciones).catch(() => setAsociaciones([]));
    apiBarrios(filtroLocalidad || undefined).then(setBarrios).catch(() => setBarrios([]));
    setFiltroAsociacion("");
    setFiltroCoordinador("");
    setFiltroBarrio("");
  }, [filtroLocalidad]);

  // Coordinadores derived from current asociaciones list (cascading on asociacion too)
  const coordinadores = (() => {
    const base = filtroAsociacion
      ? asociaciones.filter(a => String(a.id_asociacion) === String(filtroAsociacion))
      : asociaciones;
    const set = new Map();
    base.forEach(a => { if (a.coordinador) set.set(a.coordinador, true); });
    return Array.from(set.keys()).sort();
  })();

  const filterParams = {
    q: query, estado: filtroEstado,
    localidad: filtroLocalidad, barrio: filtroBarrio, asociacion: filtroAsociacion,
    coordinador: filtroCoordinador, mes_cumple: filtroMesCumple,
    page, perPage: PER_PAGE,
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiList(filterParams);
      setRows(result.data);
      setTotal(result.total);
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica que el backend esté activo.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filtroEstado, filtroLocalidad, filtroBarrio, filtroAsociacion, filtroCoordinador, filtroMesCumple, page]);

  const loadStats = useCallback(async () => {
    try {
      const s = await apiStats();
      setStats(s);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // reset page on filter change
  useEffect(() => { setPage(1); }, [query, filtroEstado, filtroLocalidad, filtroBarrio, filtroAsociacion, filtroCoordinador, filtroMesCumple]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar a ${nombre}?`)) return;
    await apiDelete(id);
    await load();
    await loadStats();
  };

  const handleEditSave = async (data) => {
    await apiUpdate(editTarget.id_afiliado, data);
    setEditTarget(null);
    setDetalle(null);
    await load();
    await loadStats();
  };

  const handleExport = () => {
    const params = { ...filterParams };
    delete params.page;
    delete params.perPage;
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    window.open(`${API_BASE}/api/export?${qs}`, "_blank");
  };

  return (
    <div>
      <div style={S.statsGrid}>
        {[
          { num: stats.total, label: "Total registrados", color: "#4f8ef7" },
          { num: stats.activos, label: "Activos", color: "#4ade80" },
          { num: stats.inactivos, label: "Inactivos", color: "#f87171" },
          { num: stats.conEps, label: "Con EPS registrada", color: "#a78bfa" },
        ].map(({ num, label, color }) => (
          <div key={label} style={S.statCard}>
            <div style={{ ...S.statNum, color }}>{(num || 0).toLocaleString("es-CO")}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={S.layout}>
        <aside style={S.sidebar}>
          <div style={S.sidebarTitle}>🧭 Filtros</div>

          <Field label="Localidad">
            <Select value={filtroLocalidad} onChange={e => setFiltroLocalidad(e.target.value)}>
              <option value="">Todas</option>
              {localidades.map(l => <option key={l.id_localidad} value={l.id_localidad}>{l.nombre_localidad}</option>)}
            </Select>
          </Field>

          <Field label="Barrio">
            <Select value={filtroBarrio} onChange={e => setFiltroBarrio(e.target.value)}>
              <option value="">Todos</option>
              {barrios.map(b => <option key={b.id_barrio} value={b.id_barrio}>{b.nombre_barrio}</option>)}
            </Select>
          </Field>

          <Field label="Asociación">
            <Select value={filtroAsociacion} onChange={e => setFiltroAsociacion(e.target.value)}>
              <option value="">Todas</option>
              {asociaciones.map(a => <option key={a.id_asociacion} value={a.id_asociacion}>{a.nombre_asociacion}</option>)}
            </Select>
          </Field>

          <Field label="Coordinador">
            <Select value={filtroCoordinador} onChange={e => setFiltroCoordinador(e.target.value)}>
              <option value="">Todos</option>
              {coordinadores.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>

          <Field label="Mes de cumpleaños">
            <Select value={filtroMesCumple} onChange={e => setFiltroMesCumple(e.target.value)}>
              <option value="">Todos</option>
              {MESES.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
            </Select>
          </Field>

          <Field label="Estado">
            <Select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
            </Select>
          </Field>

          <button style={S.btnExport} onClick={handleExport}>⬇ Exportar CSV</button>
        </aside>

        <div style={S.content}>
          <div style={S.card}>
            <div style={S.cardTitle}>
              <span style={S.cardTitleIcon}>🔍</span>
              Consulta de afiliados
            </div>

            {error && <div style={S.alert("error")}>{error}</div>}

            <div style={S.searchBox}>
              <input
                style={S.searchInput}
                placeholder="Buscar por nombre, apellido, documento o nº carnet..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
              {loading ? "Cargando..." : `${total.toLocaleString("es-CO")} resultado${total !== 1 ? "s" : ""}`}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Carnet", "Apellidos y nombres", "Teléfono", "F. Nac. / Edad", "Localidad", "Asociación", "Coordinador", "Estado", "Acciones"].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={9} style={{ ...S.td, textAlign: "center", padding: 40, color: "rgba(255,255,255,0.25)" }}>
                      {loading ? "Cargando..." : "Sin resultados para la búsqueda actual"}
                    </td></tr>
                  ) : rows.map(a => {
                    const edad = calcEdad(a.nac_afiliado);
                    return (
                    <tr
                      key={a.id_afiliado}
                      style={S.trHover}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ ...S.td, color: "#7c5fe8", fontWeight: 700 }}>{a.no_carnet_afiliado || "—"}</td>
                      <td style={{ ...S.td, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                        onClick={() => setDetalle(a)}>
                        {a.apellidos_afiliado}, {a.nombres_afiliado}
                      </td>
                      <td style={S.td}>{telefonoPrincipal(a)}</td>
                      <td style={{ ...S.td, fontSize: 12 }}>
                        {formatDate(a.nac_afiliado)}{edad != null ? ` (${edad} años)` : ""}
                      </td>
                      <td style={{ ...S.td, fontSize: 12 }}>{a.nombre_localidad || "—"}</td>
                      <td style={{ ...S.td, fontSize: 12 }}>{a.nombre_asociacion || "—"}</td>
                      <td style={{ ...S.td, fontSize: 12 }}>{a.coordinador || "—"}</td>
                      <td style={S.td}>
                        <span style={a.estado_afiliado === "ACTIVO" ? S.badgeActivo : S.badgeInactivo}>
                          {a.estado_afiliado}
                        </span>
                      </td>
                      <td style={{ ...S.td, display: "flex", gap: 8 }}>
                        <button style={S.btnEdit} onClick={() => setEditTarget(a)}>✏️</button>
                        <button style={S.btnDanger} onClick={() => handleDelete(a.id_afiliado, `${a.nombres_afiliado} ${a.apellidos_afiliado}`)}>🗑️</button>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, alignItems: "center" }}>
                <button style={S.btnSecondary} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Página {page} de {totalPages}</span>
                <button style={S.btnSecondary} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {detalle && (
        <DetalleModal
          afiliado={detalle}
          onClose={() => setDetalle(null)}
          onEdit={() => { setEditTarget(detalle); setDetalle(null); }}
        />
      )}

      {editTarget && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setEditTarget(null)}>
          <div style={S.modal}>
            <button style={S.modalClose} onClick={() => setEditTarget(null)}>✕</button>
            <div style={{ ...S.cardTitle, marginBottom: 20 }}>
              <span style={S.cardTitleIcon}>✏️</span>
              Editar afiliado — {editTarget.apellidos_afiliado}
            </div>
            <AfiliadoForm
              initial={editTarget}
              onSave={handleEditSave}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== VISTA REGISTRO =====================
function RegistroView({ onRegistrado }) {
  const [success, setSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <div>
      {success && (
        <div style={S.alert("success")}>
          ✅ Afiliado registrado exitosamente. El formulario se ha limpiado para un nuevo registro.
        </div>
      )}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <span style={S.cardTitleIcon}>➕</span>
          Nuevo afiliado
        </div>
        <AfiliadoForm
          key={formKey}
          initial={{}}
          onSave={async (data) => {
            await apiCreate(data);
            setSuccess(true);
            setFormKey(k => k + 1);
            onRegistrado?.();
            setTimeout(() => setSuccess(false), 4000);
          }}
        />
      </div>
    </div>
  );
}

// ===================== APP PRINCIPAL =====================
export default function App() {
  const [tab, setTab] = useState("consulta");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={S.app}>
      <header style={S.header}>
        <div style={S.logo}>
          <img src="https://fundacionsonreirconcanas.org/wp-content/uploads/2016/04/cropped-logo-fundacion1-1.png" alt="" style={{ height: 40, width: "auto" }} />
          Fundación Sonreír con Canas
        </div>
        <nav style={S.nav}>
          {[
            { key: "consulta", label: "🔍 Consulta" },
            { key: "registro", label: "➕ Nuevo afiliado" },
          ].map(({ key, label }) => (
            <button
              key={key}
              style={S.navBtn(tab === key)}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={S.main}>
        {tab === "consulta" && <ConsultaView key={refreshKey} />}
        {tab === "registro" && (
          <RegistroView onRegistrado={() => setRefreshKey(k => k + 1)} />
        )}
      </main>
    </div>
  );
}
