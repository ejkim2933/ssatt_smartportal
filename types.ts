
export interface PortalCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Maintenance task information for Dashboard
 */
export interface MaintenanceTask {
  id: string;
  part: string;
  health: number;
  lastService: string;
  nextService: string;
}

/**
 * AI Diagnostic result for MechanicAI
 */
export interface DiagnosticResult {
  issue: string;
  explanation: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  estimatedCost: string;
}
