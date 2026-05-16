import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const THEME_PALETTE = [
  { color: "#6D5FE8", light: "#F0EFFE", text: "#4A40B0" },
  { color: "#0D9488", light: "#ECFDF9", text: "#0A7A72" },
  { color: "#DC2626", light: "#FEF2F2", text: "#B91C1C" },
  { color: "#D97706", light: "#FFFBEB", text: "#B45309" },
  { color: "#059669", light: "#ECFDF5", text: "#047857" },
  { color: "#EA580C", light: "#FFF7ED", text: "#C2410C" },
  { color: "#7C3AED", light: "#F5F3FF", text: "#6D28D9" },
  { color: "#0284C7", light: "#F0F9FF", text: "#0369A1" },
  { color: "#BE185D", light: "#FDF2F8", text: "#9D174D" },
  { color: "#65A30D", light: "#F7FEE7", text: "#4D7C0F" },
];

const DEMO_POSTS = [
  { id:"p001", author:"Sarah Chen", author_title:"Partner at Andreessen Horowitz", date_saved:"2024-11-01", content:"The most underrated skill in venture: pattern recognition across failure modes.\n\nAfter 200+ board meetings this year, here's what separates companies that plateau at $5M ARR from those that break through:\n\n1. The plateau companies optimize for logos, not expansion revenue. Their NRR sits at 95% and they celebrate it.\n\n2. The breakout companies engineer switching costs from day one.\n\n3. Founder psychology matters more than the market. The best founders update their beliefs in real time, without ego.", likes:4821, comments:312 },
  { id:"p008", author:"Julie Zhuo", author_title:"Co-founder at Sundial, Former VP Design Facebook", date_saved:"2024-11-11", content:"The question I ask myself every week:\n\n'If I were starting fresh today, knowing what I know now, would I build this the same way?'\n\nNot 'is this working?' — you can spin almost any result into a positive narrative.\n\nBut 'would I make the same bet again?' forces you to confront the sunk cost you've been protecting.\n\nMost pivots that should have happened didn't because the founder was answering the first question.", likes:7823, comments:534 },
  { id:"p010", author:"Cassidy Williams", author_title:"CTO at Contenda", date_saved:"2024-11-15", content:"The jobs being replaced by AI first aren't the ones people expect. Not junior devs. Not junior lawyers.\n\nActually: middle management. The layer that exists to translate between strategy and execution — synthesizing reports, running status meetings, producing decks that summarize other decks.\n\nAI is extraordinarily good at synthesis. That entire layer is getting hollowed out.\n\nSafest jobs: people who make decisions with incomplete information, and people who build trusted relationships.", likes:9102, comments:812 },
  { id:"p019", author:"Sam Lessin", author_title:"General Partner at Slow Ventures", date_saved:"2024-12-03", content:"Unpopular opinion: the 'moat' conversation in AI is mostly cope.\n\nEvery founder has a moat thesis: proprietary data, workflow integration, switching costs, network effects.\n\nAll real. None as durable as you think when the underlying model improves by 10x every 18 months.\n\nThe actual moat: brand trust in regulated industries. Law firms, hospitals, financial institutions buy from vendors they trust, not vendors with the best benchmark.", likes:5102, comments:378 },
  { id:"p026", author:"Nabeel Qureshi", author_title:"Investor, Former PM at Palantir", date_saved:"2024-12-17", content:"The case for building in 'boring' markets:\n\n— Low competition\n— High switching costs\n— Sticky revenue (NRR >120% is common)\n— Patient capital (multi-year contracts)\n\nThe founder who builds the Salesforce of construction permitting will be worth $10B. Nobody will write about them on Twitter. Their customers will love them forever.\n\nPick boring. Win big.", likes:9234, comments:712 },
  { id:"p031", author:"Swyx", author_title:"Founder at Smol AI", date_saved:"2024-11-06", content:"The AI engineering stack in 2025 is settling:\n\nFoundation models: Claude 3.5 for reasoning, GPT-4o for multimodal, Llama 3 for on-premise.\nOrchestration: LangGraph over LangChain.\nVector DB: Qdrant for production, ChromaDB for prototyping.\nObservability: Langfuse — non-negotiable.\nEvals: Build your own. Generic evals lie.\n\nTreat your AI stack like infrastructure, not a research experiment.", likes:7123, comments:521 },
  { id:"p034", author:"Shreya Shankar", author_title:"PhD Researcher, ML Infrastructure", date_saved:"2024-11-12", content:"Evals are the new unit tests. And most teams are skipping them.\n\nMinimum viable setup:\n1. A golden dataset — 50-100 examples from your actual use cases\n2. A regression test on every deploy\n3. A weekly model drift check\n4. A human review queue for low-confidence outputs\n\nIf your model got 10% worse tomorrow, how long before you'd notice? Most teams: 2-4 weeks. With evals: under 24 hours.", likes:9102, comments:712 },
  { id:"p038", author:"Dario Amodei", author_title:"CEO at Anthropic", date_saved:"2024-11-20", content:"The capability that will matter most in 2025 isn't raw intelligence. It's reliable execution of multi-step tasks.\n\nA model that can write brilliant prose but fails unpredictably on step 4 of a 6-step process is not a product. It's a research demo.\n\nThe benchmark we should all be measuring: not accuracy, but consistency at scale.", likes:15234, comments:1021 },
  { id:"p043", author:"Lior Ben David", author_title:"CEO at Browse AI", date_saved:"2024-11-30", content:"AI contract review comparison — 2 months of evaluation:\n\n🔵 Harvey: Best for law firm workflows, expensive ($50K+ ACV)\n🟢 Spellbook: Best for transactional work, weaker on review\n🟡 Ironclad AI: Best for in-house legal, requires significant setup\n🔴 Generic GPT wrappers: Don't.\n\nThe gap none fill: audit trails that satisfy compliance teams.", likes:5102, comments:389 },
  { id:"p046", author:"Varun Mohan", author_title:"CEO at Codeium", date_saved:"2024-12-06", content:"The enterprise AI security question nobody is answering:\n\nFor legal and financial AI: your prompts contain client data. 'We might use this for training' is a potential ethics violation.\n\n— OpenAI: opt-out for enterprise, default is training data\n— Anthropic: enterprise data never used for training by default\n\nRead the actual DPA before signing any AI API contract.", likes:8102, comments:612 },
  { id:"p055", author:"Jason Lemkin", author_title:"Founder at SaaStr", date_saved:"2024-11-13", content:"You don't need the best product to win enterprise deals. You need the most trusted product.\n\nTrust is built through: consistent follow-through, security docs ready before asked, a named CSM from day one, proactive communication about problems, and a reference customer in their exact vertical.\n\nI've lost deals to products I knew were objectively worse. Every time: trust deficit, not feature gap.\n\nEnterprise: trust > features > price.", likes:15123, comments:1102 },
  { id:"p058", author:"Patrick Campbell", author_title:"Founder at ProfitWell", date_saved:"2024-11-19", content:"Churn is not a growth problem. It's a product problem that shows up in your growth numbers.\n\nTreat churned customers as product researchers:\n1. What workflow did you stop using first?\n2. What did you use before us?\n3. What would have made you stay?\n\nWe interviewed 300 churned customers in one quarter. More product insight than any user research we'd done before.", likes:13892, comments:1012 },
  { id:"p061", author:"Matt Mochary", author_title:"CEO Coach", date_saved:"2024-11-25", content:"The feedback conversation most leaders avoid: telling someone they're not performing.\n\nCost of avoiding it:\n— They don't improve\n— The team sees you tolerating underperformance\n— Your best people leave when standards drop\n\nFramework: separate observation from judgment, ask their read first, be specific about the standard, make a plan together, set a date to revisit.\n\nKind ≠ comfortable.", likes:16789, comments:1234 },
  { id:"p068", author:"Aaref Hilaly", author_title:"Partner at Bain Capital Ventures", date_saved:"2024-12-09", content:"Conversations co-founders need to have BEFORE they need them:\n\n1. Personal financial needs\n2. What does 'success' look like to each of you?\n3. Decision-making framework when you disagree?\n4. What happens if one wants to leave?\n5. How do you each handle stress?\n\nThe relationships that blow up skipped these because they seemed premature. They're never premature.", likes:13892, comments:1012 },
  { id:"p072", author:"Shreyas Doshi", author_title:"Product Coach, Former Stripe & Twitter", date_saved:"2024-11-04", content:"Stop writing specs that describe what the product does. Write specs that describe what changes for the user.\n\nBEFORE: 40-page manual review, 3 hours, misses 15-20% of risk clauses.\nAFTER: Highlights in 8 minutes, 94% accuracy, source citations.\nBRIDGE: Here's how the product creates that change.\n\nWhen engineers understand the 'before', they know what they're replacing.", likes:15234, comments:1123 },
  { id:"p075", author:"Des Traynor", author_title:"Co-founder at Intercom", date_saved:"2024-11-10", content:"The metric that predicts long-term success better than any other: Time-to-first-value.\n\nNot DAUs. Not activation rate. Not NPS.\n\nThe moment when a user first thinks 'oh, this actually works.'\n\nFor Intercom: first reply through our platform. Under 10 min: high LTV. Over 30 min: high churn.\n\nFind your TTFV. Build your entire onboarding around minimizing it.", likes:14892, comments:1089 },
  { id:"p085", author:"Kevin Systrom", author_title:"Co-founder at Instagram", date_saved:"2024-11-03", content:"Running without headphones changed how I think.\n\nYour brain's default mode network is most active when doing something rhythmic and automatic. Running activates it. Sitting at a desk suppresses it.\n\nEvery significant decision I've made in 5 years: I ran first. The 45 minutes feels unproductive. The hour after feels like a different brain.", likes:19234, comments:1423 },
  { id:"p089", author:"Nir Eyal", author_title:"Author of Indistractable", date_saved:"2024-11-11", content:"The mental health conversation professionals aren't having:\n\nThe work world celebrates hustle. Nobody talks about what it does to your brain.\n\n— People managing anxiety with alcohol\n— Professionals who haven't taken a real vacation in years\n— High performers experiencing burnout they didn't see coming\n\nI've been in therapy for 4 years. Highest-ROI investment I've made professionally.", likes:28934, comments:2341 },
  { id:"p091", author:"James Clear", author_title:"Author of Atomic Habits", date_saved:"2024-11-15", content:"The fitness routine that scales with a demanding schedule:\n\n20 minutes, non-negotiable, every day. Same time, same place.\n\nConsistency beats intensity for long-term outcomes. The habit has to survive your worst weeks. Design the minimum viable workout for your worst week, let good weeks be a bonus.\n\nThe 20-min walk is not the workout. It's the habit that keeps everything else going.", likes:34892, comments:2891 },
  { id:"p092", author:"Sahil Bloom", author_title:"Writer & Investor", date_saved:"2024-11-17", content:"The question I ask myself every Sunday:\n\n'If this was the last week of my life, would I be glad I spent it this way?'\n\n— Productivity questions optimize for output\n— Gladness questions optimize for meaning\n\nThe trap: optimizing for output while neglecting meaning creates a very efficient path to regret.", likes:42891, comments:3421 },
  { id:"p096", author:"Alex Cohen", author_title:"Developer & Startup Humor", date_saved:"2024-11-02", content:"Things I was NOT told before joining a fast-moving company:\n\n❌ 'You will have opinions about project management software'\n❌ 'A 15-minute delay in a reply causes physical pain'\n❌ 'You will lie awake thinking about metrics'\n❌ 'The words \"let's take this offline\" will make you want to quit'\n\nAnybody feel seen?", likes:48234, comments:3892 },
  { id:"p097", author:"Shreya Murthy", author_title:"Professional, Parent, Overthinker", date_saved:"2024-11-04", content:"Toddler communication vs. stakeholder communication:\n\n🧒 'I want the blue cup' → 🏢 'We're looking for strategic alignment before committing'\n\n🧒 [throws food on floor] → 🏢 'We're going to pass for now but would love to stay in touch'\n\n🧒 [screams for no apparent reason] → 🏢 'We had a few concerns from the review process'", likes:52891, comments:4234 },
  { id:"p099", author:"Adam Singer", author_title:"Marketing Executive", date_saved:"2024-11-08", content:"Things that are apparently 'quick syncs':\n• 45-minute alignment call with 7 people\n• Decision that required 3 pre-meetings\n• A meeting that spawned 2 follow-up meetings\n\nThings that are NOT quick syncs:\n• The 4-minute Loom that answered the question\n• The doc that had the answer already written", likes:67891, comments:5234 },
  { id:"p103", author:"Lenny Rachitsky", author_title:"Product Coach, Lenny's Newsletter", date_saved:"2024-11-16", content:"The PM's 5 stages of a feature launch:\n\n1. EXCITEMENT: 'This is going to change everything.'\n2. ANXIETY: 'Did we test all edge cases?'\n3. DENIAL: 'Metrics look flat but it's only been 2 days'\n4. BARGAINING: 'Maybe if we add the tooltip...'\n5. ACCEPTANCE: 'The problem was our hypothesis.'\n\n[Return to step 1]", likes:63892, comments:5102 },
  { id:"p105", author:"Nik Sharma", author_title:"CEO at Sharma Brands", date_saved:"2024-11-20", content:"Things I've sent my co-founder at 2am:\n• 'What if we pivoted to [completely different market]'\n• A 40-slide deck I made instead of sleeping\n• 'Ignore that deck, I think I was tired'\n• 'Actually can you look at the deck'\n\nCo-founders are the only people who respond to these messages.", likes:81234, comments:6234 },
];

// ── UTILITIES ─────────────────────────────────────────────────
const calcSignal = (post) => {
  const t = new Date(post.date_saved || "2024-11-15").getTime();
  // Recency relative to a 6-month window from today
  const now = Date.now();
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
  const recency = Math.max(0, Math.min(1, (t - sixMonthsAgo) / (now - sixMonthsAgo)));
  const eng = Math.min(1, ((post.likes || 0) + (post.comments || 0) * 3) / 120000);
  const density = Math.min(1, (post.content || "").length / 1200);
  return recency * 0.25 + eng * 0.5 + density * 0.25;
};
const fmtNum = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n || 0);
const getInitials = name => (name||"?").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const AVATAR_PAL = ["#6D5FE8","#0D9488","#DC2626","#D97706","#059669","#EA580C","#7C3AED","#0284C7","#BE185D","#65A30D"];
const avatarCol = name => AVATAR_PAL[(name||"").charCodeAt(0) % AVATAR_PAL.length];
const chunk = (arr, n) => Array.from({length: Math.ceil(arr.length/n)}, (_,i) => arr.slice(i*n, i*n+n));

// Robust JSON parser — multiple extraction strategies for Safari compatibility
const parseJSON = raw => {
  if (!raw || typeof raw !== "string") throw new Error("Empty response from AI.");
  // 1. Strip markdown fences and try direct parse
  const stripped = raw.replace(/```(?:json)?/gi, "").trim();
  try { return JSON.parse(stripped); } catch {}
  // 2. Find outermost {...} block
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(stripped.slice(start, end + 1)); } catch {}
  }
  // 3. Find outermost [...] block
  const aStart = stripped.indexOf("[");
  const aEnd = stripped.lastIndexOf("]");
  if (aStart !== -1 && aEnd > aStart) {
    try { return JSON.parse(stripped.slice(aStart, aEnd + 1)); } catch {}
  }
  throw new Error("AI returned an unexpected format. Please try again.");
};

// ── BROWSE AI + GENERIC JSON NORMALISER ───────────────────────
const normalisePosts = raw => {
  let arr = [];
  if (Array.isArray(raw)) arr = raw;
  else if (raw.posts)   arr = raw.posts;
  else if (raw.results) arr = raw.results;
  else if (raw.data)    arr = Array.isArray(raw.data) ? raw.data : (raw.data.posts || []);
  else arr = Object.values(raw).find(v => Array.isArray(v)) || [];

  return arr.map((p, i) => {
    // Browse AI specific fields: Author, Title, Post, Recency, Position
    const isBrowseAI = p.Post !== undefined || p.Author !== undefined;

    const rawContent = p.Post || p.content || p.post_text || p.text || p.body || p.description || "";
    // Strip LinkedIn "…see more" / "… see more" truncation markers
    const content = rawContent.replace(/\u2026see more$/, "").replace(/\.\.\.see more$/, "").replace(/…see more$/, "").trim();

    const author       = p.Author || p.author || p.author_name || p.name || p.poster || "Unknown";
    const author_title = p.Title  || p.author_title || p.headline || p.author_headline || "";

    // Browse AI gives relative recency ("7h •", "3d •") — convert to approximate date
    let date_saved = p.date_saved || p.saved_at || p.saved_date || p.date || new Date().toISOString().split("T")[0];
    if (p.Recency && !p.date_saved) {
      const now = new Date();
      const m = p.Recency.match(/(\d+)\s*([hHdDwWmM])/);
      if (m) {
        const n = parseInt(m[1]);
        const unit = m[2].toLowerCase();
        if (unit === "h") now.setHours(now.getHours() - n);
        else if (unit === "d") now.setDate(now.getDate() - n);
        else if (unit === "w") now.setDate(now.getDate() - n * 7);
        else if (unit === "m") now.setMonth(now.getMonth() - n);
        date_saved = now.toISOString().split("T")[0];
      }
    }

    const likes    = Number(p.likes    || p.reactions   || p.like_count    || 0);
    const comments = Number(p.comments || p.comment_count || 0);
    // Use Position as part of ID if available (Browse AI), else index
    const idBase = p.id || (p.Position ? `browseai_${p.Position}` : `post_${i}`);
    const id = String(idBase);

    return { id, author, author_title, date_saved, content, likes, comments };
  }).filter(p => p.content && p.content.length > 20);
};

// ── API CALL ──────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
const RETRY_DELAYS = [0, 2000, 4000, 6000]; // cold start needs longer gaps

const callClaude = async (prompt, apiKey, maxTokens = 1000, jsonMode = false) => {
  const key = typeof apiKey === "string" ? apiKey : "";
  const headers = { "Content-Type": "application/json" };
  if (key.startsWith("sk-")) {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  };
  if (jsonMode) {
    body.system = "You are a JSON API. Respond with valid JSON only. No markdown, no code blocks, no commentary. Your entire response must be parseable by JSON.parse().";
  }

  let lastErr;
  for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
    if (RETRY_DELAYS[attempt] > 0) await sleep(RETRY_DELAYS[attempt]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers, body: JSON.stringify(body),
      });

      // Read body as text first — res.json() throws native browser errors
      // in Safari that bypass try/catch and can't be recovered from
      let text;
      try { text = await res.text(); }
      catch {
        lastErr = new Error("Network read error");
        continue; // retry
      }

      if (!res.ok) {
        let msg = `API error ${res.status}`;
        try { msg = JSON.parse(text).error?.message || msg; } catch {}
        if (res.status === 401) throw new Error("Invalid API key — check console.anthropic.com.");
        // 5xx / 529 overloaded — retry
        if (res.status >= 500 || res.status === 529) { lastErr = new Error(msg); continue; }
        throw new Error(msg);
      }

      let data;
      try { data = JSON.parse(text); }
      catch {
        // Proxy returned non-JSON (HTML error page, cold-start response)
        lastErr = new Error("Connection warming up — retrying…");
        continue;
      }

      const content = data.content?.filter(b => b.type === "text").map(b => b.text).join("");
      if (!content) { lastErr = new Error("Empty response"); continue; }
      return content;

    } catch (err) {
      if (err.message.includes("API key")) throw err; // never retry auth errors
      lastErr = err;
    }
  }
  throw new Error((lastErr?.message || "Request failed") + " — please try again.");
};

// ── CLUSTERING ────────────────────────────────────────────────
const pickSample = (posts, n) => {
  const sorted = [...posts].sort((a,b) => new Date(a.date_saved||0) - new Date(b.date_saved||0));
  const step = Math.max(1, Math.floor(sorted.length / n));
  const evenly = sorted.filter((_,i) => i % step === 0).slice(0, n);
  return evenly.length >= n ? evenly : [...posts].sort(() => Math.random()-.5).slice(0, n);
};

const generateThemes = async (posts, apiKey) => {
  const sample = pickSample(posts, Math.min(40, posts.length));
  const prompt = `Analyze these LinkedIn saved posts and identify 5-7 distinct topic clusters that best capture this person's interests. Make cluster names specific and meaningful — not generic like "Technology" but more like "AI Product Design" or "Founder Mental Health".

Posts:
${sample.map((p,i) => `${i+1}. ${p.author}: "${(p.content||"").slice(0,220)}"`).join("\n\n")}

Respond with ONLY valid JSON (no markdown, no backticks):
{"themes":[{"name":"Cluster Name","emoji":"🎯","description":"One sentence describing what belongs here"}]}`;

  const raw = await callClaude(prompt, apiKey, 800, true);
  const { themes } = parseJSON(raw);
  if (!Array.isArray(themes) || themes.length === 0) throw new Error("Could not generate clusters — please try again.");
  return themes.map((t, i) => ({ ...t, ...THEME_PALETTE[i % THEME_PALETTE.length] }));
};

const assignBatch = async (batch, themeNames, apiKey) => {
  const prompt = `Assign each post to exactly one cluster: ${themeNames.join(" | ")}

Posts:
${batch.map(p => `ID: ${p.id}\n"${(p.content||"").slice(0,200)}"`).join("\n\n")}

Respond with ONLY valid JSON:
{"assignments":{"post-id":"Cluster Name"}}`;
  const raw = await callClaude(prompt, apiKey, 800, true);
  return parseJSON(raw).assignments || {};
};

// ── API KEY MODAL ─────────────────────────────────────────────
function ApiKeyModal({ onSave, onDismiss }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const save = () => {
    if (!val.trim().startsWith("sk-")) { setErr("Key should start with sk- or sk-ant-"); return; }
    onSave(val.trim());
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#fff", borderRadius:18, padding:"28px 28px 24px", maxWidth:460, width:"100%", boxShadow:"0 16px 48px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize:22, marginBottom:6 }}>🔑</div>
        <h2 style={{ fontFamily:"var(--fh)", fontSize:20, fontWeight:800, color:"#111", letterSpacing:"-0.02em", marginBottom:8 }}>Add your Anthropic API key</h2>
        <p style={{ fontSize:13, color:"#555", lineHeight:1.6, marginBottom:20, fontFamily:"var(--ff)" }}>
          Clarity uses the Claude API to cluster your posts, power search, and generate digests. Your key is used only in your browser and never sent to any server.
          <br/><br/>
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color:"#6D5FE8", fontWeight:500 }}>Get a key at console.anthropic.com →</a>
        </p>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={val}
          onChange={e => { setVal(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && save()}
          style={{ width:"100%", padding:"11px 14px", borderRadius:9, border:`1.5px solid ${err ? "#DC2626" : "#E0E0E0"}`, fontSize:14, fontFamily:"var(--ff)", outline:"none", marginBottom:err ? 6 : 16, boxSizing:"border-box" }}
          autoFocus
        />
        {err && <div style={{ fontSize:12, color:"#DC2626", marginBottom:12, fontFamily:"var(--ff)" }}>{err}</div>}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={save} style={{ flex:1, padding:"11px", borderRadius:50, background:"#111", border:"none", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"var(--ff)", cursor:"pointer" }}>
            Save & continue
          </button>
          <button onClick={onDismiss} style={{ padding:"11px 18px", borderRadius:50, background:"transparent", border:"1px solid #E0E0E0", color:"#888", fontSize:14, fontFamily:"var(--ff)", cursor:"pointer" }}>
            Cancel
          </button>
        </div>
        <p style={{ fontSize:11, color:"#BBB", marginTop:12, textAlign:"center", fontFamily:"var(--ff)" }}>
          Your key stays in your browser. Never stored or shared.
        </p>
      </div>
    </div>
  );
}

// ── POST CARD ─────────────────────────────────────────────────
function PostCard({ post, themeMap={}, showTheme=false, relevanceNote=null, rank=null }) {
  const [exp, setExp] = useState(false);
  const cfg = themeMap[post.theme] || { color:"#999", light:"#F5F5F5", text:"#666" };
  const sig = calcSignal(post);
  const isHigh = sig > 0.65;
  const col = avatarCol(post.author);
  return (
    <div onClick={() => setExp(e => !e)} style={{ background:"#fff", border:"1px solid #EBEBEB", borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"box-shadow 0.15s, border-color 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor="#D0D0D0"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#EBEBEB"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        {rank != null && <span style={{ fontSize:11, fontWeight:700, color:"#BBB", minWidth:14, fontFamily:"var(--ff)" }}>#{rank}</span>}
        <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, background:col+"15", border:`1.5px solid ${col}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:col, fontFamily:"var(--ff)" }}>{getInitials(post.author)}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111", lineHeight:1.25, fontFamily:"var(--ff)" }}>{post.author}</div>
          <div style={{ fontSize:11, color:"#999", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"var(--ff)" }}>{post.author_title}</div>
        </div>
        {showTheme && post.theme && <span style={{ fontSize:10, color:cfg.text, background:cfg.light, padding:"2px 8px", borderRadius:20, fontFamily:"var(--ff)", fontWeight:600, whiteSpace:"nowrap" }}>{post.theme}</span>}
        {isHigh && <span style={{ fontSize:10, color:"#92400E", background:"#FEF3C7", padding:"2px 7px", borderRadius:20, fontFamily:"var(--ff)", fontWeight:700, flexShrink:0 }}>★ High</span>}
      </div>
      <div style={{ fontSize:13, color:"#555", lineHeight:1.65, whiteSpace:"pre-wrap", fontFamily:"var(--ff)", overflow:exp?"visible":"hidden", display:exp?"block":"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", marginBottom:10 }}>{post.content}</div>
      {relevanceNote && <div style={{ fontSize:12, color:"#92400E", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8, padding:"6px 10px", marginBottom:10, lineHeight:1.5, fontFamily:"var(--ff)" }}>💡 {relevanceNote}</div>}
      <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:11, color:"#BBB", fontFamily:"var(--ff)" }}>
        <span>♥ {fmtNum(post.likes)}</span><span>💬 {fmtNum(post.comments)}</span>
        <div style={{ flex:1 }} />
        <div style={{ width:48, height:3, background:"#F0F0F0", borderRadius:2 }}>
          <div style={{ width:`${sig*100}%`, height:"100%", background:isHigh?"#F59E0B":"#D1D5DB", borderRadius:2 }} />
        </div>
        <span style={{ fontSize:10, color:isHigh?"#B45309":"#CCC" }}>{isHigh?"high":"med"}</span>
      </div>
    </div>
  );
}

// ── TOPICS TAB ────────────────────────────────────────────────
function TopicsTab({ posts, themes, assignments, phase, progress, error, onCluster, themeMap }) {
  const [expTheme, setExpTheme] = useState(null);
  const [insights, setInsights] = useState({});
  const [loadingInsight, setLoadingInsight] = useState(null);

  const grouped = useMemo(() => {
    if (phase !== "done") return {};
    const m = {};
    themes.forEach(t => { m[t.name] = []; });
    posts.forEach(p => {
      const t = assignments[p.id];
      if (t && m[t] !== undefined) m[t].push(p);
      else if (themes.length) m[themes[0].name].push(p);
    });
    Object.keys(m).forEach(k => m[k].sort((a,b) => calcSignal(b)-calcSignal(a)));
    return m;
  }, [posts, themes, assignments, phase]);

  const genInsight = useCallback(async (theme, apiKey) => {
    setLoadingInsight(theme);
    try {
      const sample = (grouped[theme]||[]).slice(0,6);
      const prompt = `Analyze these saved posts from the "${theme}" cluster and provide a sharp synthesis.\n\nPosts:\n${sample.map((p,i)=>`${i+1}. ${p.author}: "${(p.content||"").slice(0,280)}"`).join("\n\n")}\n\nRespond with ONLY valid JSON:\n{"synthesis":"2-sentence synthesis","actions":["action 1","action 2","action 3"],"topInsight":"single most actionable insight"}`;
      const raw = await callClaude(prompt, window.__clarityKey, 700, true);
      setInsights(prev => ({ ...prev, [theme]: parseJSON(raw) }));
    } catch (err) {
      setInsights(prev => ({ ...prev, [theme]: { error: err.message } }));
    } finally { setLoadingInsight(null); }
  }, [grouped]);

  if (phase === "idle") return (
    <div style={{ maxWidth:520, margin:"40px auto 0", textAlign:"center" }}>
      <div style={{ width:56, height:56, borderRadius:16, background:"#F0EFFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 18px" }}>🗂</div>
      <h2 style={{ fontFamily:"var(--fh)", fontSize:22, fontWeight:800, color:"#111", letterSpacing:"-0.025em", marginBottom:8 }}>Cluster your topics</h2>
      <p style={{ fontSize:14, color:"#555", lineHeight:1.6, marginBottom:28, fontFamily:"var(--ff)" }}>
        Claude reads your {posts.length} saved posts, finds the natural topic clusters in your reading habits, and organises everything automatically.
      </p>
      <button onClick={onCluster} style={{ padding:"13px 28px", borderRadius:50, background:"#111", border:"none", cursor:"pointer", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"var(--ff)", boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>
        ✦ Cluster my topics
      </button>
      <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:32 }}>
        {[["Auto","clusters from your saves"],["Signal","scoring per post"],["~30s","to organise everything"]].map(([v,l]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111", fontFamily:"var(--fh)" }}>{v}</div>
            <div style={{ fontSize:11, color:"#AAA", fontFamily:"var(--ff)" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (phase === "generating" || phase === "assigning") {
    const pct = phase === "generating" ? 20 : 20 + Math.round((progress.done/Math.max(progress.total,1))*80);
    return (
      <div style={{ maxWidth:420, margin:"60px auto 0", textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#BBB", letterSpacing:"0.08em", fontFamily:"var(--ff)", marginBottom:20 }}>
          {phase === "generating" ? "STEP 1 OF 2 — GENERATING CLUSTERS" : `STEP 2 OF 2 — ASSIGNING POSTS  ${progress.done}/${progress.total} batches`}
        </div>
        <div style={{ height:4, background:"#F0F0EE", borderRadius:2, overflow:"hidden", marginBottom:14 }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"#6D5FE8", borderRadius:2, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ fontSize:13, color:"#888", fontFamily:"var(--ff)" }}>
          {phase === "generating" ? "Analysing your reading patterns…" : "Categorising your posts…"}
        </div>
      </div>
    );
  }

  if (phase === "error") return (
    <div style={{ maxWidth:420, margin:"60px auto 0", textAlign:"center" }}>
      <div style={{ padding:"16px 20px", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, marginBottom:20, fontSize:13, color:"#DC2626", fontFamily:"var(--ff)", lineHeight:1.5 }}>⚠ {error}</div>
      <button onClick={onCluster} style={{ padding:"10px 22px", borderRadius:50, background:"#111", border:"none", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:600, fontFamily:"var(--ff)" }}>Retry</button>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:16 }}>
      {themes.map(theme => {
        const cfg = themeMap[theme.name] || {};
        const tp = grouped[theme.name] || [];
        const isExp = expTheme === theme.name;
        const insight = insights[theme.name];
        const avg = tp.length ? tp.reduce((s,p) => s+calcSignal(p), 0)/tp.length : 0;
        const visible = isExp ? tp : tp.slice(0,3);
        return (
          <div key={theme.name} style={{ background:"#fff", border:"1px solid #EBEBEB", borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ height:4, background:cfg.color||"#999" }} />
            <div style={{ padding:"16px 18px 14px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:22, flexShrink:0, marginTop:1 }}>{theme.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#111", fontFamily:"var(--fh)", letterSpacing:"-0.02em", marginBottom:2 }}>{theme.name}</div>
                  <div style={{ fontSize:11, color:"#999", fontFamily:"var(--ff)", lineHeight:1.4 }}>{tp.length} saves · {theme.description}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:cfg.color, fontFamily:"var(--fh)", lineHeight:1 }}>{Math.round(avg*100)}</div>
                  <div style={{ fontSize:9, color:"#BBB", fontFamily:"var(--ff)", textTransform:"uppercase", letterSpacing:"0.06em" }}>signal</div>
                </div>
              </div>
              <button onClick={() => genInsight(theme.name, window.__clarityKey)} disabled={loadingInsight===theme.name} style={{ width:"100%", padding:"8px 12px", background:loadingInsight===theme.name?(cfg.light||"#F5F5F5"):"#F8F8F7", border:`1.5px solid ${loadingInsight===theme.name?(cfg.color||"#999")+"40":"#E8E8E8"}`, borderRadius:8, cursor:loadingInsight===theme.name?"default":"pointer", color:loadingInsight===theme.name?(cfg.text||"#666"):"#555", fontSize:12, fontWeight:600, fontFamily:"var(--ff)", transition:"all 0.15s" }}
                onMouseEnter={e => { if(loadingInsight!==theme.name){e.currentTarget.style.background=cfg.light||"#F5F5F5";e.currentTarget.style.borderColor=(cfg.color||"#999")+"50";e.currentTarget.style.color=cfg.text||"#666";} }}
                onMouseLeave={e => { if(loadingInsight!==theme.name){e.currentTarget.style.background="#F8F8F7";e.currentTarget.style.borderColor="#E8E8E8";e.currentTarget.style.color="#555";} }}>
                {loadingInsight===theme.name ? "Generating…" : "✦ Generate insight"}
              </button>
            </div>
            {insight && !insight.error && (
              <div style={{ margin:"0 16px 14px", background:cfg.light||"#F5F5F5", border:`1px solid ${(cfg.color||"#999")}20`, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:10, color:cfg.text||"#666", fontWeight:700, letterSpacing:"0.07em", marginBottom:5, fontFamily:"var(--ff)" }}>TOP INSIGHT</div>
                <div style={{ fontSize:13, color:"#333", lineHeight:1.55, marginBottom:10, fontStyle:"italic", fontFamily:"var(--fh)" }}>"{insight.topInsight}"</div>
                <div style={{ fontSize:10, color:"#999", fontWeight:700, letterSpacing:"0.07em", marginBottom:5, fontFamily:"var(--ff)" }}>ACTIONS</div>
                {insight.actions?.map((a,i) => (
                  <div key={i} style={{ display:"flex", gap:6, marginBottom:4 }}>
                    <span style={{ color:cfg.color||"#999", fontWeight:700, fontSize:13, flexShrink:0 }}>→</span>
                    <span style={{ fontSize:12, color:"#444", lineHeight:1.5, fontFamily:"var(--ff)" }}>{a}</span>
                  </div>
                ))}
              </div>
            )}
            {insight?.error && <div style={{ margin:"0 16px 14px", padding:"8px 12px", background:"#FEF2F2", borderRadius:8, fontSize:12, color:"#DC2626", fontFamily:"var(--ff)" }}>⚠ {insight.error}</div>}
            <div style={{ padding:"0 12px", display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
              {visible.map(p => <PostCard key={p.id} post={p} themeMap={themeMap} />)}
              {tp.length===0 && <div style={{ padding:"20px 0", textAlign:"center", color:"#DDD", fontSize:13, fontFamily:"var(--ff)" }}>No posts in this cluster</div>}
            </div>
            {tp.length>3 && (
              <div style={{ padding:"0 12px 14px" }}>
                <button onClick={() => setExpTheme(isExp?null:theme.name)} style={{ width:"100%", padding:"8px", background:"#F8F8F7", border:"1px solid #EBEBEB", borderRadius:8, cursor:"pointer", color:"#888", fontSize:12, fontFamily:"var(--ff)" }}>
                  {isExp ? "↑ Show fewer" : `↓ Show all ${tp.length} saves`}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────
const SUGGESTED = ["How to negotiate a promotion","Build better relationships at work","Think through a career pivot","Manage stress and avoid burnout","Develop a stronger personal brand"];

function SearchTab({ posts, themeMap, needsKey, onNeedKey }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doSearch = useCallback(async query => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const ctx = posts.map(p => ({
        id: p.id,
        a: p.author,
        p: (p.content||"").slice(0, 200),
        s: Math.round(calcSignal(p) * 100),
      }));
      const prompt = `You are helping a professional search their LinkedIn saved posts.\n\nSearch intent: "${query}"\n\nPosts (id, author, preview, signal score):\n${JSON.stringify(ctx)}\n\nReturn the 5 most relevant post IDs and 3 concrete actions. Your entire response must be valid JSON only, no other text:\n{"results":[{"id":"post_id","relevance":"why this is relevant in 1 sentence"}],"actions":["action 1","action 2","action 3"]}`;
      const raw = await callClaude(prompt, window.__clarityKey, 1000, true);
      const parsed = parseJSON(raw);
      setResults({ ...parsed, results: parsed.results.map(r => ({ ...r, post:posts.find(p=>p.id===r.id) })).filter(r=>r.post) });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [posts, needsKey, onNeedKey]);

  return (
    <div style={{ maxWidth:700, margin:"0 auto" }}>
      <div style={{ background:"#fff", border:"1.5px solid #E0E0E0", borderRadius:14, padding:"4px 4px 4px 18px", display:"flex", alignItems:"center", gap:10, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize:16, color:"#CCC" }}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch(q)}
          placeholder="What do you want to accomplish?"
          style={{ flex:1, background:"none", border:"none", outline:"none", color:"#111", fontSize:14, fontFamily:"var(--ff)", padding:"12px 0" }} />
        <button onClick={()=>doSearch(q)} disabled={loading||!q.trim()} style={{ padding:"10px 20px", borderRadius:10, background:loading||!q.trim()?"#F0F0EE":"#111", border:"none", cursor:loading||!q.trim()?"default":"pointer", color:loading||!q.trim()?"#AAA":"#fff", fontSize:13, fontWeight:700, fontFamily:"var(--ff)" }}>
          {loading?"…":"Search"}
        </button>
      </div>
      {!results&&!loading&&(<>
        <div style={{ fontSize:11, color:"#CCC", letterSpacing:"0.07em", marginBottom:10, fontFamily:"var(--ff)" }}>TRY THESE</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
          {SUGGESTED.map(s=>(
            <button key={s} onClick={()=>{setQ(s);doSearch(s);}} style={{ padding:"8px 14px", borderRadius:20, background:"#F8F8F7", border:"1px solid #E8E8E8", color:"#666", fontSize:12, cursor:"pointer", fontFamily:"var(--ff)", transition:"all 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#111";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#111";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#F8F8F7";e.currentTarget.style.color="#666";e.currentTarget.style.borderColor="#E8E8E8";}}>{s}</button>
          ))}
        </div>
        <div style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:13, color:"#CCC", fontFamily:"var(--ff)" }}>Search by what you're trying to do, not by keyword</div>
        </div>
      </>)}
      {loading&&<div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:13, color:"#888", fontFamily:"var(--ff)" }}>Finding what's relevant…</div></div>}
      {error&&<div style={{ padding:"12px 16px", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, color:"#DC2626", fontSize:12, fontFamily:"var(--ff)" }}>⚠ {error}</div>}
      {results&&(
        <div>
          <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:"#92400E", fontWeight:700, letterSpacing:"0.07em", marginBottom:10, fontFamily:"var(--ff)" }}>RECOMMENDED ACTIONS</div>
            {results.actions?.map((a,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:6 }}>
                <span style={{ color:"#D97706", fontWeight:700, fontSize:13 }}>{i+1}.</span>
                <span style={{ fontSize:13, color:"#444", lineHeight:1.5, fontFamily:"var(--ff)" }}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, color:"#CCC", letterSpacing:"0.07em", marginBottom:12, fontFamily:"var(--ff)" }}>TOP MATCHES ({results.results.length})</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {results.results.map((r,i)=><PostCard key={r.id} post={r.post} themeMap={themeMap} showTheme rank={i+1} relevanceNote={r.relevance} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DIGEST TAB ────────────────────────────────────────────────
function DigestTab({ posts, themes, needsKey, onNeedKey }) {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true); setError(null); setDigest(null);
    try {
      const allThemes = themes.length>0 ? themes.map(t=>t.name) : [...new Set(posts.map(p=>p.theme).filter(Boolean))];
      const topPosts = [];
      allThemes.forEach(theme => {
        posts.filter(p=>p.theme===theme).sort((a,b)=>calcSignal(b)-calcSignal(a)).slice(0,2).forEach(p=>topPosts.push(p));
      });
      const fallback = posts.filter(p=>!p.theme).sort((a,b)=>calcSignal(b)-calcSignal(a)).slice(0,4);
      const final = [...topPosts, ...fallback].slice(0,16);
      const prompt = `Create a weekly digest from these LinkedIn saved posts.\n\nTop posts:\n${final.map(p=>`[${p.theme||"General"}] ${p.author} (${p.author_title||""}):\n"${(p.content||"").slice(0,320)}"`).join("\n\n")}\n\nWrite a personal weekly digest:\n1. Brief 2-sentence intro (acknowledge this is their own synthesis)\n2. 3-4 topic sections (emoji + name as headers): key insight + one action for THIS WEEK\n3. "This Week's Challenge" — one concrete action before next Friday\n\nDirect, personal tone. Reference actual authors. No filler.`;
      setDigest(await callClaude(prompt, window.__clarityKey, 1500));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      {!digest&&!loading&&(
        <div style={{ textAlign:"center", padding:"64px 0 48px" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#F0EFFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 20px" }}>📧</div>
          <h2 style={{ fontFamily:"var(--fh)", fontSize:28, fontWeight:800, color:"#111", marginBottom:10, letterSpacing:"-0.03em" }}>Your Weekly Digest</h2>
          <p style={{ fontSize:14, color:"#555", lineHeight:1.65, marginBottom:32, fontFamily:"var(--ff)" }}>
            Clarity reads your highest-signal saves across all your topics and distils<br />them into a digest with concrete actions for the week ahead.
          </p>
          <button onClick={generate} style={{ padding:"14px 32px", borderRadius:50, background:"#111", border:"none", cursor:"pointer", color:"#fff", fontSize:15, fontWeight:700, fontFamily:"var(--ff)" }}>Generate digest →</button>
          <div style={{ display:"flex", gap:28, justifyContent:"center", marginTop:36 }}>
            {[["🗂","Reads across all your topics"],["⚡","Prioritises high-signal saves"],["✅","Actions, not just summaries"]].map(([icon,label])=>(
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                <div style={{ fontSize:11, color:"#AAA", fontFamily:"var(--ff)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading&&<div style={{ textAlign:"center", padding:"80px 0" }}>
        <div style={{ fontSize:13, color:"#888", fontFamily:"var(--ff)", marginBottom:6 }}>Synthesising your saves…</div>
        <div style={{ fontSize:11, color:"#CCC", fontFamily:"var(--ff)" }}>Reading {posts.length} posts</div>
      </div>}
      {error&&<div style={{ padding:"12px 16px", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, color:"#DC2626", fontSize:12, fontFamily:"var(--ff)" }}>⚠ {error}</div>}
      {digest&&(
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:11, color:"#CCC", letterSpacing:"0.07em", fontFamily:"var(--ff)" }}>GENERATED DIGEST</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{navigator.clipboard.writeText(digest);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{ padding:"6px 14px", borderRadius:8, background:copied?"#ECFDF5":"#F8F8F7", border:`1px solid ${copied?"#6EE7B7":"#E8E8E8"}`, color:copied?"#059669":"#666", fontSize:11, cursor:"pointer", fontFamily:"var(--ff)" }}>{copied?"✓ Copied":"Copy"}</button>
              <button onClick={generate} style={{ padding:"6px 14px", borderRadius:8, background:"#111", border:"none", color:"#fff", fontSize:11, cursor:"pointer", fontFamily:"var(--ff)" }}>Regenerate</button>
            </div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #EBEBEB", borderRadius:14, padding:"28px 32px", fontSize:14, color:"#333", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"var(--ff)", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>{digest}</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
const TABS = [
  { id:"topics", label:"Topics",  emoji:"🗂" },
  { id:"search", label:"Search",  emoji:"🔍" },
  { id:"digest", label:"Digest",  emoji:"📧" },
];

export default function App() {
  const [posts,        setPosts]        = useState([]);
  const [loaded,       setLoaded]       = useState(false);
  const [tab,          setTab]          = useState("topics");
  const [apiKey,       setApiKey]       = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [pendingAction,setPendingAction]= useState(null); // action to run after key saved

  // Cluster state
  const [themes,     setThemes]     = useState([]);
  const [assignments,setAssignments]= useState({});
  const [phase,      setPhase]      = useState("idle");
  const [progress,   setProgress]   = useState({ done:0, total:0 });
  const [clusterErr, setClusterErr] = useState(null);

  const fileRef = useRef();
  const needsKey = !apiKey;

  // Store key in window so child components can access without prop drilling
  useEffect(() => { window.__clarityKey = apiKey; }, [apiKey]);

  const themeMap = useMemo(() => {
    const m = {};
    themes.forEach(t => { m[t.name] = { color:t.color, light:t.light, text:t.text, emoji:t.emoji }; });
    return m;
  }, [themes]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
    link.rel = "stylesheet"; document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0} :root{--fh:'Bricolage Grotesque',system-ui,sans-serif;--ff:'DM Sans',system-ui,sans-serif} body{background:#F5F5F2;font-family:var(--ff)} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} input::placeholder{color:#CCC} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#F5F5F2} ::-webkit-scrollbar-thumb{background:#DDD;border-radius:3px} html{scroll-behavior:smooth}`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const clusterPosts = useCallback(async (key) => {
    const k = key || apiKey;
    setPhase("generating"); setClusterErr(null);
    try {
      const generatedThemes = await generateThemes(posts, k);
      setThemes(generatedThemes);
      const themeNames = generatedThemes.map(t => t.name);
      const batches = chunk(posts, 40);
      setPhase("assigning"); setProgress({ done:0, total:batches.length });
      const allAssignments = {};
      for (let i=0; i<batches.length; i++) {
        const res = await assignBatch(batches[i], themeNames, k);
        Object.assign(allAssignments, res);
        setProgress({ done:i+1, total:batches.length });
      }
      setAssignments(allAssignments); setPhase("done");
    } catch (err) { setClusterErr(err.message); setPhase("error"); }
  }, [posts, apiKey]);

  const handleNeedKey = useCallback((pendingFn) => {
    setPendingAction(() => pendingFn || null);
    setShowKeyModal(true);
  }, []);

  const handleKeySave = useCallback(key => {
    setApiKey(key);
    setShowKeyModal(false);
    // If there was a pending action (e.g. cluster), run it now
    if (pendingAction) { pendingAction(key); setPendingAction(null); }
    else if (tab === "topics" && phase === "idle") { clusterPosts(key); } // auto-start clustering
  }, [pendingAction, tab, phase, clusterPosts]);

  const goHome = () => {
    setLoaded(false); setPosts([]); setThemes([]); setAssignments({});
    setPhase("idle"); setClusterErr(null); setTab("topics");
  };

  const loadPosts = list => {
    setPosts(list); setLoaded(true);
    setThemes([]); setAssignments({}); setPhase("idle"); setClusterErr(null); setTab("topics");
    // Silent warmup — fires a minimal API call immediately so the proxy
    // connection is warm by the time the user clicks any action button.
    // Errors are intentionally swallowed — this is best-effort only.
    setTimeout(() => {
      callClaude("Hi", window.__clarityKey || "", 5).catch(() => {});
    }, 300);
  };

  const loadFile = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const raw = JSON.parse(ev.target.result);
        const normalised = normalisePosts(raw);
        if (normalised.length === 0) { alert("No posts found in that file. Check the format and try again."); return; }
        loadPosts(normalised);
      } catch { alert("Couldn't parse that file. Make sure it's valid JSON."); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F2" }}>
      {showKeyModal && <ApiKeyModal onSave={handleKeySave} onDismiss={() => setShowKeyModal(false)} />}

      {/* ── Header ── */}
      <header style={{ background:"#fff", borderBottom:"1px solid #EBEBEB", position:"sticky", top:0, zIndex:50 }}>
        {/* Top row — logo, badges, key, upload */}
        <div style={{ height:54, display:"flex", alignItems:"center", padding:"0 24px", gap:12 }}>
          <button onClick={goHome} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, flexShrink:0 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"#111", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#fff" }}>✦</div>
            <span style={{ fontFamily:"var(--fh)", fontSize:17, fontWeight:800, color:"#111", letterSpacing:"-0.03em" }}>Clarity</span>
          </button>

          {loaded && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:11, color:"#059669", background:"#ECFDF5", border:"1px solid #A7F3D0", padding:"3px 10px", borderRadius:20, fontFamily:"var(--ff)", fontWeight:600, whiteSpace:"nowrap" }}>{posts.length} saves</div>
              {phase==="done" && <div style={{ fontSize:11, color:"#6D5FE8", background:"#F0EFFE", border:"1px solid #C7C2F8", padding:"3px 10px", borderRadius:20, fontFamily:"var(--ff)", fontWeight:600, whiteSpace:"nowrap" }}>{themes.length} topics</div>}
            </div>
          )}

          <div style={{ flex:1 }} />

          <button onClick={()=>setShowKeyModal(true)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:apiKey?"#ECFDF5":"#FFFBEB", border:`1px solid ${apiKey?"#A7F3D0":"#FDE68A"}`, color:apiKey?"#059669":"#92400E", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"var(--ff)", whiteSpace:"nowrap", flexShrink:0 }}>
            {apiKey ? "🔑 Key set" : "🔑 Add API key"}
          </button>

          <input ref={fileRef} type="file" accept=".json" onChange={loadFile} style={{ display:"none" }} />
          <button onClick={()=>fileRef.current.click()} style={{ padding:"7px 14px", borderRadius:8, background:"transparent", border:"1px solid #E0E0E0", color:"#888", fontSize:12, cursor:"pointer", fontFamily:"var(--ff)", whiteSpace:"nowrap", flexShrink:0, transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#111";e.currentTarget.style.color="#111";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E0E0E0";e.currentTarget.style.color="#888";}}>
            Upload JSON
          </button>
        </div>

        {/* Sub-nav row — only when app is loaded */}
        {loaded && (
          <div style={{ height:42, borderTop:"1px solid #F0F0EE", display:"flex", alignItems:"center", padding:"0 24px", gap:4, background:"#FAFAFA" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"6px 18px", borderRadius:20, background:tab===t.id?"#111":"transparent", border:tab===t.id?"none":"1px solid transparent", color:tab===t.id?"#fff":"#888", fontSize:13, fontWeight:tab===t.id?600:400, cursor:"pointer", fontFamily:"var(--ff)", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}
                onMouseEnter={e=>{ if(tab!==t.id){e.currentTarget.style.color="#111";e.currentTarget.style.borderColor="#E0E0E0";} }}
                onMouseLeave={e=>{ if(tab!==t.id){e.currentTarget.style.color="#888";e.currentTarget.style.borderColor="transparent";} }}>
                <span>{t.emoji}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Landing ── */}
      {!loaded && (
        <main style={{ animation:"fadeUp 0.5s ease" }}>
          <div style={{ maxWidth:840, margin:"0 auto", padding:"72px 24px 0" }}>
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <h1 style={{ fontFamily:"var(--fh)", fontSize:"clamp(34px, 5.5vw, 54px)", fontWeight:800, color:"#111", lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:18 }}>
                Your LinkedIn saves,<br />
                <span style={{ color:"#6D5FE8" }}>finally put to work.</span>
              </h1>
              <p style={{ fontSize:16, color:"#555", lineHeight:1.65, maxWidth:440, margin:"0 auto 36px", fontFamily:"var(--ff)" }}>
                Cluster your saves by topic, search by intent, and get a weekly digest with concrete next steps.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                  <button onClick={()=>loadPosts(DEMO_POSTS)} style={{ width:180, padding:"14px 0", borderRadius:50, background:"#111", border:"1.5px solid #111", cursor:"pointer", color:"#fff", fontSize:15, fontWeight:700, fontFamily:"var(--ff)", boxShadow:"0 4px 16px rgba(0,0,0,0.15)", transition:"transform 0.1s, box-shadow 0.1s" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.2)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.15)";}}>
                    Try Demo ↗
                  </button>
                  <span style={{ fontSize:11, color:"#999", fontFamily:"var(--ff)" }}>Sample posts pre-loaded</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                  <button onClick={()=>fileRef.current.click()} style={{ width:180, padding:"14px 0", borderRadius:50, background:"transparent", border:"1.5px solid #111", color:"#111", fontSize:15, fontWeight:700, fontFamily:"var(--ff)", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#111";e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#111";}}>
                    Upload your JSON
                  </button>
                  <a href="#how-it-works" style={{ fontSize:11, color:"#6D5FE8", textDecoration:"none", fontWeight:500, fontFamily:"var(--ff)" }}>How to get your JSON ↓</a>
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:14, marginBottom:80 }}>
              {[
                { emoji:"🗂", title:"Topic Clusters", bg:"#F0EFFE", desc:"Your saves automatically grouped by what they're about. Signal scoring surfaces what's most worth your attention right now." },
                { emoji:"🔍", title:"Intent Search",  bg:"#ECFDF9", desc:"Describe what you're trying to accomplish and instantly surface the most relevant saves — no scrolling through everything." },
                { emoji:"📧", title:"Weekly Digest",  bg:"#FEF2F2", desc:"A digest of your top saves with key takeaways and 3 concrete things to act on before the week is out." },
              ].map(f => (
                <div key={f.title} style={{ background:"#fff", border:"1px solid #EBEBEB", borderRadius:16, padding:"22px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:14 }}>{f.emoji}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#111", fontFamily:"var(--fh)", letterSpacing:"-0.02em", marginBottom:7 }}>{f.title}</div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.6, fontFamily:"var(--ff)" }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── How to get your data ── */}
          <div id="how-it-works" style={{ borderTop:"1px solid #E8E8E8", background:"#fff", padding:"64px 24px 72px" }}>
            <div style={{ maxWidth:600, margin:"0 auto" }}>
              <div style={{ fontSize:11, color:"#BBB", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12, fontFamily:"var(--ff)" }}>Getting your data</div>
              <h2 style={{ fontFamily:"var(--fh)", fontSize:26, fontWeight:800, color:"#111", letterSpacing:"-0.025em", marginBottom:8 }}>Your saves stay yours</h2>
              <p style={{ fontSize:14, color:"#555", marginBottom:28, lineHeight:1.6, fontFamily:"var(--ff)" }}>
                Clarity doesn't ask for your LinkedIn login, doesn't sync to any cloud, and doesn't store your posts anywhere. You export your own data, review it locally, and upload only what you choose.
              </p>

              <div style={{ background:"#F0EFFE", border:"1px solid #C7C2F8", borderRadius:12, padding:"16px 20px", marginBottom:32, display:"flex", gap:14, alignItems:"flex-start" }}>
                <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>🔒</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#4A40B0", marginBottom:6, fontFamily:"var(--ff)" }}>Privacy-preserving by design</div>
                  {["No LinkedIn login required — ever","Your posts never pass through our servers","You control what gets uploaded and when","Claude API processes your posts directly in-browser"].map(line => (
                    <div key={line} style={{ display:"flex", gap:8, alignItems:"baseline", marginBottom:3 }}>
                      <span style={{ color:"#6D5FE8", fontSize:12, fontWeight:700, flexShrink:0 }}>✓</span>
                      <span style={{ fontSize:13, color:"#4A40B0", lineHeight:1.5, fontFamily:"var(--ff)" }}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize:14, fontWeight:700, color:"#111", marginBottom:12, fontFamily:"var(--ff)" }}>How people export their saves</div>
              <p style={{ fontSize:13, color:"#555", lineHeight:1.65, marginBottom:20, fontFamily:"var(--ff)" }}>
                LinkedIn doesn't offer a native export for saved posts. A few approaches work well:
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:28 }}>
                {[
                  { icon:"🤖", title:"Browser-based automation tools", body:"No-code tools that can record and replay browsing actions let you collect your saved posts without writing any code. You point the tool at your saved posts page, it collects the data, and exports a file you can upload here." },
                  { icon:"🌐", title:"Browser network inspection", body:"Your browser fetches posts from LinkedIn's servers as you scroll. Developer tools let you capture those API responses directly — clean, structured data. Works on any browser with no installs." },
                  { icon:"📋", title:"Manual curation", body:"For a curated set rather than everything, copy-pasting your most important saves into a simple JSON file gives you full control over what goes in. Smaller dataset, but higher signal." },
                ].map(a => (
                  <div key={a.title} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"#F0EFFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:3, fontFamily:"var(--ff)" }}>{a.title}</div>
                      <div style={{ fontSize:12, color:"#777", lineHeight:1.55, fontFamily:"var(--ff)" }}>{a.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding:"16px 20px", background:"#F8F8F7", borderRadius:12, border:"1px solid #EBEBEB" }}>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.6, fontFamily:"var(--ff)" }}>
                  <strong style={{ color:"#111" }}>Want to try it first?</strong> The demo loads sample posts so you can explore all three features without any setup or data sharing.
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── App ── */}
      {loaded && (
        <main style={{ maxWidth:1200, margin:"0 auto", padding:"24px", animation:"fadeUp 0.3s ease" }}>
          {tab==="topics" && (
            <TopicsTab posts={posts} themes={themes} assignments={assignments}
              phase={phase} progress={progress} error={clusterErr}
              onCluster={() => clusterPosts()} themeMap={themeMap} />
          )}
          {tab==="search" && <SearchTab posts={posts} themeMap={themeMap} />}
          {tab==="digest" && <DigestTab posts={posts} themes={themes} />}
        </main>
      )}
    </div>
  );
}
