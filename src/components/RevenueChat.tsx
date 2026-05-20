import { useState } from 'react';
import { CheckCircle2, DatabaseZap, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { assistantCapabilities, chatPrompts } from '../data/strategy';

type ChatMode = 'Ask' | 'Act';

export function RevenueChat() {
  const [mode, setMode] = useState<ChatMode>('Ask');
  const [draft, setDraft] = useState(chatPrompts[0].prompt);

  const modeCopy =
    mode === 'Ask'
      ? 'Ask mode fetches connected campaign data and explains what is happening.'
      : 'Act mode drafts campaign changes, then asks for final approval before execution.';

  return (
    <section className="assistant-workspace">
      <div className="assistant-shell">
        <div className="assistant-topbar">
          <div>
            <p>AI Campaign Assistant</p>
            <h2>Ask about campaigns. Act only after approval.</h2>
            <span>{modeCopy}</span>
          </div>

          <div className="mode-toggle" aria-label="Assistant mode">
            {(['Ask', 'Act'] as ChatMode[]).map((item) => (
              <button
                className={mode === item ? 'active' : ''}
                key={item}
                onClick={() => setMode(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="connected-sources" aria-label="Connected data sources">
          <span>
            <DatabaseZap size={16} />
            Google Ads connected
          </span>
          <span>
            <DatabaseZap size={16} />
            Meta Ads connected
          </span>
          <span>
            <ShieldCheck size={16} />
            Approval required for writes
          </span>
        </div>

        <div className="simple-chat-panel">
          <div className="chat-bubble user">
            <p>{draft}</p>
          </div>

          <div className="chat-bubble assistant">
            <div className="assistant-label">
              <Sparkles size={17} />
              <strong>{mode} mode response</strong>
            </div>

            {mode === 'Ask' ? (
              <>
                <p>
                  I checked connected Google and Meta campaign signals. The biggest revenue leak is high spend on
                  low-intent search terms, followed by Meta creative fatigue in prospecting.
                </p>
                <ul>
                  <li>Wasted spend identified: ₹42.8k from search terms and fatigued creatives.</li>
                  <li>Most scalable pocket: High Intent Non Brand Search with stable CPA.</li>
                  <li>Confidence: High for Google Search, medium for Meta conversion forecast.</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  I can prepare the changes, but I will not execute them until you approve the final action list.
                </p>
                <ul>
                  <li>Draft 14 negative keywords for Google Search.</li>
                  <li>Reduce fatigued Meta ad set budget by 12%.</li>
                  <li>Create a replacement creative test with proof, comparison, and objection hooks.</li>
                </ul>
                <div className="approval-preview">
                  <CheckCircle2 size={17} />
                  <span>Next step: show exact platform changes for final approval.</span>
                </div>
              </>
            )}
          </div>

          <div className="prompt-row">
            {chatPrompts.slice(0, 4).map((item) => (
              <button key={item.label} onClick={() => setDraft(item.prompt)} type="button">
                {item.label}
              </button>
            ))}
          </div>

          <div className="assistant-input">
            <textarea
              aria-label="Ask AI about connected campaigns"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything about Google Ads or Meta campaigns..."
              value={draft}
            />
            <button type="button" aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <aside className="assistant-side">
        <div className="section-heading compact">
          <div>
            <p>Assistant contract</p>
            <h2>Simple modes, serious controls</h2>
          </div>
        </div>

        <div className="mode-capability-list">
          {assistantCapabilities.map((capability) => (
            <article key={`${capability.mode}-${capability.title}`}>
              <span>{capability.mode}</span>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
