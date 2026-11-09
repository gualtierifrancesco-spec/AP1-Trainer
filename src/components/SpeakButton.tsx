import { useEffect } from 'react';
import { speechSupported, stopSpeaking, toggleSpeak, useSpeakingId } from '../lib/speech';

interface Props {
  id: string;
  text: string | (() => string);
  label?: string;
  small?: boolean;
}

/** Knopf „Vorlesen“ / „Stopp“. Wird ausgeblendet, wenn das Gerät keine Sprachausgabe hat. */
export function SpeakButton({ id, text, label = 'Vorlesen', small = true }: Props) {
  const speaking = useSpeakingId() === id;
  useEffect(() => () => { if (speaking) stopSpeaking(); }, [speaking]);
  if (!speechSupported()) return null;
  return (
    <button
      type="button"
      className={`btn ${small ? 'sm' : ''} ${speaking ? 'primary' : 'ghost'} speak-btn`}
      aria-pressed={speaking}
      aria-label={speaking ? 'Vorlesen stoppen' : label}
      onClick={(e) => { e.stopPropagation(); toggleSpeak(id, typeof text === 'function' ? text() : text); }}
    >
      <span aria-hidden="true">{speaking ? '■' : '🔊'}</span>
      <span className="speak-label">{speaking ? 'Stopp' : label}</span>
    </button>
  );
}

/** Beim Seitenwechsel Vorlesen beenden */
export function useStopSpeechOnLeave(key: string) {
  useEffect(() => () => stopSpeaking(), [key]);
}
