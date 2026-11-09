import { useEffect } from 'react';
import { currentSpeakingId, speechSupported, stopSpeaking, takeSpeechNotice, toggleSpeak, usesNeural, useSpeakingId, useSpeechPhase } from '../lib/speech';
import { toast } from './ui';

interface Props {
  id: string;
  text: string | (() => string);
  label?: string;
  small?: boolean;
}

/** Knopf „Vorlesen“ / „Stopp“. Wird ausgeblendet, wenn das Gerät keine Sprachausgabe hat. */
export function SpeakButton({ id, text, label = 'Vorlesen', small = true }: Props) {
  const speaking = useSpeakingId() === id;
  const phase = useSpeechPhase();
  const preparing = speaking && phase === 'preparing';
  useEffect(() => {
    const n = takeSpeechNotice();
    if (n) toast(n);
  }, [phase]);
  // Nur beim Verlassen stoppen, und nur wenn dieser Knopf gerade vorliest
  useEffect(() => () => { if (currentSpeakingId() === id) stopSpeaking(); }, [id]);
  if (!speechSupported() && !usesNeural()) return null;
  return (
    <button
      type="button"
      className={`btn ${small ? 'sm' : ''} ${speaking ? 'primary' : 'ghost'} speak-btn`}
      aria-pressed={speaking}
      aria-label={speaking ? 'Vorlesen stoppen' : label}
      onClick={(e) => { e.stopPropagation(); toggleSpeak(id, typeof text === 'function' ? text() : text); }}
    >
      <span aria-hidden="true">{preparing ? '⏳' : speaking ? '■' : '🔊'}</span>
      <span className="speak-label">{preparing ? 'Stimme rechnet …' : speaking ? 'Stopp' : label}</span>
    </button>
  );
}

/** Beim Seitenwechsel Vorlesen beenden */
export function useStopSpeechOnLeave(key: string) {
  useEffect(() => () => stopSpeaking(), [key]);
}
