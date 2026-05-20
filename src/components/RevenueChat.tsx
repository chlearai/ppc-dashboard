import { useState } from 'react';
import { ArrowRight, DatabaseZap, FilePlus2, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { chatPrompts, growthLevers } from '../data/strategy';

export function RevenueChat() {
  const [draft, setDraft] = useState(chatPrompts[0].prompt);

  return (
    <section className="chat-workspace">
      <div className="chat-main">
        <div className="chat-hero">
          <div>
            <p>AI Revenue Chat</p>
            <h2>Ask anything. Get the answer, the evidence, and the next revenue action.</h2>
            <span>
              The chat should fetch Google Ads, Meta Ads, website, forecast, and research context before answering. It
              turns strong answers into approved tasks, campaign plans, or experiment briefs.
            </span>
          </div>
          <div className="chat-source-stack">
            <article>
              <DatabaseZap size={18} />
              <span>Google Ads, Meta Ads, site crawl, forecast data</span>
            </article>
            <article>
              <ShieldCheck size={18} />
              <span>Every write action goes through approval</span>
            </article>
          </div>
        </div>

        <div className="prompt-bank">
          {chatPrompts.map((item) => (
            <button key={item.label} onClick={() => setDraft(item.prompt)} type="button">
              {item.label}
            </button>
          ))}
        </div>

        <div className="chat-panel">
          <div className="message user-message">
            <p>{draft}</p>
          </div>

          <div className="message ai-message">
            <div className="message-head">
              <Sparkles size={18} />
              <strong>Revenue answer format</strong>
            </div>
            <p>
              I found three immediate growth paths: recover wasted spend from low-intent search terms, reallocate budget
              into stable high-intent campaigns, and refresh fatigued Meta creative before CPM pressure compounds.
            </p>

            <div className="evidence-grid">
              <article>
                <span>Evidence</span>
                <strong>₹42.8k waste pool</strong>
                <p>Search terms and fatigued creatives are under target efficiency.</p>
              </article>
              <article>
                <span>Confidence</span>
                <strong>High for Search</strong>
                <p>Backed by query data, spend, conversion lag, and CPA trend.</p>
              </article>
              <article>
                <span>Action</span>
                <strong>Draft approval queue</strong>
                <p>Negatives, budget moves, creative refresh, and test plan.</p>
              </article>
            </div>

            <div className="answer-actions">
              <button type="button">
                Create action queue
                <ArrowRight size={16} />
              </button>
              <button className="secondary" type="button">
                Add to campaign book
                <FilePlus2 size={16} />
              </button>
            </div>
          </div>

          <div className="chat-input">
            <textarea
              aria-label="Ask AI about campaigns"
              onChange={(event) => setDraft(event.target.value)}
              value={draft}
            />
            <button type="button" aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <aside className="growth-lever-panel">
        <div className="section-heading compact">
          <div>
            <p>Revenue growth system</p>
            <h2>Features that create step-change upside</h2>
          </div>
        </div>

        <div className="growth-lever-list">
          {growthLevers.map((lever) => (
            <article key={lever.title}>
              <div>
                <h3>{lever.title}</h3>
                <span>{lever.upside}</span>
              </div>
              <p>{lever.proof}</p>
              <strong>{lever.nextStep}</strong>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
