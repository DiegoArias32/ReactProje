// Src/styles/CyberStyles.ts
import { StyleSheet } from 'react-native';

export const CyberColors = {
  primaryNeon: '#00ff88',
  secondaryNeon: '#ff0088',
  accentNeon: '#0088ff',
  warningNeon: '#ffaa00',
  dangerNeon: '#ff3366',
  darkBg: '#0a0a0f',
  darkerBg: '#050508',
  cardBg: '#111118',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  borderGlow: 'rgba(0, 255, 136, 0.3)',
};

export const CyberShadows = {
  neonGlow: {
    shadowColor: CyberColors.primaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonShadow: {
    shadowColor: CyberColors.primaryNeon,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
};

export const CyberStyles = StyleSheet.create({
  // Contenedores principales
  cyberContainer: {
    flex: 1,
    backgroundColor: CyberColors.darkBg,
  },
  
  // Headers futuristas
  cyberHeader: {
    backgroundColor: CyberColors.darkerBg,
    borderBottomWidth: 2,
    borderBottomColor: CyberColors.primaryNeon,
    ...CyberShadows.neonGlow,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: CyberColors.primaryNeon,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: CyberColors.primaryNeon,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: CyberColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },

  // Cards futuristas
  cyberCard: {
    backgroundColor: CyberColors.cardBg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: CyberColors.borderGlow,
    margin: 10,
    padding: 20,
    ...CyberShadows.cardShadow,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: CyberColors.borderGlow,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CyberColors.primaryNeon,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Botones futuristas
  cyberButton: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 2,
    ...CyberShadows.buttonShadow,
  },

  primaryButton: {
    backgroundColor: CyberColors.primaryNeon,
    borderColor: CyberColors.primaryNeon,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: CyberColors.accentNeon,
  },

  dangerButton: {
    backgroundColor: CyberColors.dangerNeon,
    borderColor: CyberColors.dangerNeon,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  primaryButtonText: {
    color: CyberColors.darkerBg,
  },

  secondaryButtonText: {
    color: CyberColors.accentNeon,
  },

  dangerButtonText: {
    color: CyberColors.textPrimary,
  },

  // Inputs futuristas
  cyberInput: {
    backgroundColor: CyberColors.darkerBg,
    borderWidth: 2,
    borderColor: CyberColors.borderGlow,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: CyberColors.textPrimary,
    marginBottom: 15,
  },

  inputFocused: {
    borderColor: CyberColors.primaryNeon,
    ...CyberShadows.neonGlow,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: CyberColors.primaryNeon,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Avatar circular futurista
  cyberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CyberColors.primaryNeon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: CyberColors.borderGlow,
    ...CyberShadows.neonGlow,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: CyberColors.darkerBg,
  },

  // Badges de estado
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusActive: {
    backgroundColor: `${CyberColors.primaryNeon}20`,
    borderColor: CyberColors.primaryNeon,
  },

  statusInactive: {
    backgroundColor: `${CyberColors.dangerNeon}20`,
    borderColor: CyberColors.dangerNeon,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  statusActiveText: {
    color: CyberColors.primaryNeon,
  },

  statusInactiveText: {
    color: CyberColors.dangerNeon,
  },

  // Lista de clientes futurista
  clientCard: {
    backgroundColor: CyberColors.cardBg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: CyberColors.borderGlow,
    margin: 8,
    padding: 16,
    ...CyberShadows.cardShadow,
  },

  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  clientDetails: {
    marginLeft: 15,
    flex: 1,
  },

  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: CyberColors.textPrimary,
    marginBottom: 4,
  },

  clientEmail: {
    fontSize: 14,
    color: CyberColors.textSecondary,
  },

  clientPhone: {
    fontSize: 12,
    color: CyberColors.textMuted,
    marginTop: 2,
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: CyberColors.borderGlow,
  },

  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 70,
    alignItems: 'center',
  },

  viewButton: {
    backgroundColor: 'transparent',
    borderColor: CyberColors.accentNeon,
  },

  editButton: {
    backgroundColor: 'transparent',
    borderColor: CyberColors.warningNeon,
  },

  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: CyberColors.dangerNeon,
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  viewButtonText: {
    color: CyberColors.accentNeon,
  },

  editButtonText: {
    color: CyberColors.warningNeon,
  },

  deleteButtonText: {
    color: CyberColors.dangerNeon,
  },

  // Modal futurista
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  cyberModal: {
    backgroundColor: CyberColors.cardBg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: CyberColors.primaryNeon,
    width: '100%',
    maxWidth: 400,
    ...CyberShadows.neonGlow,
  },

  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: CyberColors.borderGlow,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: CyberColors.primaryNeon,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: CyberColors.dangerNeon,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBody: {
    padding: 20,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },

  // Textos generales
  cyberText: {
    color: CyberColors.textPrimary,
  },

  secondaryText: {
    color: CyberColors.textSecondary,
  },

  mutedText: {
    color: CyberColors.textMuted,
  },

  // Estados de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CyberColors.darkBg,
  },

  loadingText: {
    fontSize: 18,
    color: CyberColors.primaryNeon,
    marginTop: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Estado vacío
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  emptyText: {
    fontSize: 18,
    color: CyberColors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },

  emptySubtext: {
    fontSize: 14,
    color: CyberColors.textMuted,
    textAlign: 'center',
  },
});