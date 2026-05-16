import React, { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = {
  navy:   '#0A1628',
  blue:   '#065A82',
  teal:   '#1C7293',
  mint:   '#9DCFDF',
  orange: '#F97316',
  light:  '#F0F7FA',
  gray:   '#64748B',
  white:  '#FFFFFF',
  green:  '#22C55E',
  red:    '#EF4444',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0A1628 0%, #065A82 50%, #1C7293 100%)',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: '0',
    margin: '0',
  },
  header: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '18px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logo: {
    width: '42px',
    height: '42px',
    background: COLORS.orange,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: '20px',
    fontWeight: '700',
    margin: '0',
  },
  headerSub: {
    color: COLORS.mint,
    fontSize: '12px',
    margin: '0',
  },
  statusBadge: (connected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: connected ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
    border: `1px solid ${connected ? COLORS.green : COLORS.red}`,
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    color: connected ? COLORS.green : COLORS.red,
    fontWeight: '600',
  }),
  dot: (connected) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: connected ? COLORS.green : COLORS.red,
    animation: connected ? 'pulse 2s infinite' : 'none',
  }),
  main: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: (color) => ({
    flex: 1,
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px',
    padding: '20px',
    borderTop: `3px solid ${color}`,
  }),
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: COLORS.white,
    margin: '0',
    lineHeight: '1',
  },
  statLabel: {
    color: COLORS.mint,
    fontSize: '12px',
    marginTop: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  card: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: '16px',
    fontWeight: '700',
    margin: '0',
  },
  cardSub: {
    color: COLORS.gray,
    fontSize: '12px',
    margin: '4px 0 0 0',
  },
  alumnoRow: (index) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    transition: 'background 0.2s',
    background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
  }),
  avatar: (color) => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.white,
    fontSize: '15px',
    fontWeight: '700',
    flexShrink: 0,
  }),
  alumnoInfo: {
    flex: 1,
  },
  alumnoNombre: {
    color: COLORS.white,
    fontSize: '15px',
    fontWeight: '600',
    margin: '0',
  },
  alumnoEmail: {
    color: COLORS.gray,
    fontSize: '12px',
    margin: '3px 0 0 0',
  },
  carreraBadge: {
    background: 'rgba(157,207,223,0.15)',
    border: '1px solid rgba(157,207,223,0.3)',
    borderRadius: '20px',
    padding: '4px 12px',
    color: COLORS.mint,
    fontSize: '11px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: COLORS.gray,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: `3px solid ${COLORS.orange}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '11px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
};

const avatarColors = [COLORS.orange, COLORS.teal, COLORS.blue, '#8B5CF6', '#EC4899'];

function getInitials(nombre, apellido) {
  return `${nombre?.[0] || ''}${apellido?.[0] || ''}`.toUpperCase();
}

export default function App() {
  const [alumnos, setAlumnos]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    axios.get('/alumnos')
      .then(res => {
        setAlumnos(res.data);
        setConnected(true);
        setLoading(false);
      })
      .catch(() => {
        setConnected(false);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>🎓</div>
            <div>
              <p style={styles.headerTitle}>Innovatech Chile</p>
              <p style={styles.headerSub}>Sistema de Gestión de Alumnos · AWS EC2</p>
            </div>
          </div>
          <div style={styles.statusBadge(connected)}>
            <div style={styles.dot(connected)} />
            {connected ? 'Spring Boot conectado' : 'Sin conexión al backend'}
          </div>
        </div>

        {/* Main */}
        <div style={styles.main}>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statCard(COLORS.orange)}>
              <p style={styles.statNumber}>{alumnos.length}</p>
              <p style={styles.statLabel}>Alumnos registrados</p>
            </div>
            <div style={styles.statCard(COLORS.teal)}>
              <p style={styles.statNumber}>React</p>
              <p style={styles.statLabel}>Frontend · Vite + Nginx</p>
            </div>
            <div style={styles.statCard(COLORS.mint)}>
              <p style={styles.statNumber}>Spring</p>
              <p style={styles.statLabel}>Backend · Java 21</p>
            </div>
          </div>

          {/* Tabla de alumnos */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.cardTitle}>Listado de Alumnos</p>
                <p style={styles.cardSub}>Datos obtenidos en tiempo real desde PostgreSQL</p>
              </div>
            </div>

            {loading ? (
              <div style={styles.emptyState}>
                <div style={styles.spinner} />
                <p style={{ color: COLORS.gray }}>Conectando con el backend...</p>
              </div>
            ) : alumnos.length > 0 ? (
              alumnos.map((a, i) => (
                <div key={a.id} style={styles.alumnoRow(i)}>
                  <div style={styles.avatar(avatarColors[i % avatarColors.length])}>
                    {getInitials(a.nombre, a.apellido)}
                  </div>
                  <div style={styles.alumnoInfo}>
                    <p style={styles.alumnoNombre}>{a.nombre} {a.apellido}</p>
                    <p style={styles.alumnoEmail}>{a.email || `alumno${a.id}@innovatech.cl`}</p>
                  </div>
                  {a.carrera && (
                    <span style={styles.carreraBadge}>{a.carrera}</span>
                  )}
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</p>
                <p style={{ color: COLORS.white, fontWeight: '600' }}>Sin conexión con el backend</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Verificar que Spring Boot esté operativo en EC2</p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          Innovatech Chile · ISY1101 Herramientas DevOps · Stack: React + Spring Boot + PostgreSQL + AWS EC2
        </div>
      </div>
    </>
  );
}
