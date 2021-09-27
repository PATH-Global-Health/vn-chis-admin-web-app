import { useState, useEffect } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

const useScript = (source: string): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>(
    source ? 'loading' : 'idle',
  );
  useEffect(() => {
    if (source) {
      const query: HTMLScriptElement | null = document.querySelector(
        `script[src="${source}"]`,
      );
      if (!query) {
        const script: HTMLScriptElement = document.createElement('script');
        script.src = source;
        script.async = true;
        script.setAttribute('data-status', 'loading');
        document.body.appendChild(script);

        const setAttributeFromEvent = (event: Event) => {
          script?.setAttribute(
            'data-status',
            event.type === 'load' ? 'ready' : 'error',
          );
        };

        script.addEventListener('load', setAttributeFromEvent);
        script.addEventListener('error', setAttributeFromEvent);
      } else {
        setStatus(query.getAttribute('data-status') as ScriptStatus);
      }
    }
    // eslint-disable-next-line
  }, [source]);
  return status;
};

export default useScript;
