const designLinks = [
  {
    title: "Home Experience",
    href: "/design-library/Pursuit%20Home.html",
    description: "Early home experience reference and product direction.",
  },
  {
    title: "Web Design Concepts",
    href: "/design-library/Pursuit%20Web%20Designs.html",
    description: "Editorial website explorations for the public Pursuit presence.",
  },
  {
    title: "Web Adaptation Playbook",
    href: "/design-library/Pursuit%20Web%20Playbook.html",
    description: "Guidance for adapting mobile product language to web.",
  },
  {
    title: "Button System",
    href: "/design-library/Pursuit%20Buttons.html",
    description: "Interaction and button references from the design library.",
  },
];

const productPoints = [
  "Discover curated Nairobi events",
  "Save events for later",
  "Mark events as Going",
  "Track Ticketed plans",
  "Create group plans with friends",
  "Support organizers in the future",
];

const planStates = [
  {
    title: "Saved",
    label: "Interested",
    copy: "Events a user wants to remember before committing.",
  },
  {
    title: "Going",
    label: "Intending",
    copy: "Experiences the user plans to attend or coordinate around.",
  },
  {
    title: "Ticketed",
    label: "Booked",
    copy: "Paid, booked, or confirmed plans that need easier tracking.",
  },
];

const groupSteps = [
  {
    title: "Create group plan",
    copy: "Start with a weekend, birthday, date night, or casual hangout.",
  },
  {
    title: "Shared voting page",
    copy: "Add a few event options and share one link with friends.",
  },
  {
    title: "Voting results",
    copy: "Friends vote without signing up, helping the group decide faster.",
  },
];

const organizerCards = [
  "Create event",
  "Manage listings",
  "Ticket sales",
  "Attendance overview",
  "Audience insights",
  "Verification status",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function MiniPhone({ title, tag, children }) {
  return (
    <div className="phone">
      <div className="phoneNotch" />
      <div className="phoneScreen">
        <div className="phoneTop">
          <span>{tag}</span>
          <span>Design preview</span>
        </div>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Pursuit home">
          Pursuit
        </a>
        <nav aria-label="Primary navigation">
          <a href="#overview">Overview</a>
          <a href="#plans">Plans</a>
          <a href="#screens">Screens</a>
          <a href="#library">Library</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero section" id="top">
        <div className="heroCopy">
          <p className="kicker">Nairobi-first event discovery</p>
          <h1>Pursuit</h1>
          <h2>Discover real-life experiences in Nairobi.</h2>
          <p>
            Pursuit helps people find, save, and plan events and experiences -
            from casual nights out to group plans with friends.
          </p>
          <div className="actions">
            <a className="button primary" href="#screens">
              View Product Screens <Arrow />
            </a>
            <a className="button secondary" href="#library">
              View Design Library
            </a>
            <a
              className="button ghost"
              href="https://faithkatherine.github.io/Portfolio"
            >
              View Portfolio <Arrow />
            </a>
          </div>
        </div>
        <div className="heroPreview" aria-label="Pursuit product preview">
          <div className="previewCard featureEvent">
            <p>Tonight in Nairobi</p>
            <h3>Gallery opening + rooftop set</h3>
            <span>Westlands · 7:30 PM</span>
          </div>
          <div className="previewStack">
            <div>Saved</div>
            <div>Going</div>
            <div>Ticketed</div>
          </div>
        </div>
      </section>

      <section className="section split" id="overview">
        <div>
          <p className="kicker">Product overview</p>
          <h2>A lighter way to decide what to do next.</h2>
        </div>
        <div className="grid two">
          {productPoints.map((point) => (
            <article className="card compact" key={point}>
              <span className="dot" />
              <h3>{point}</h3>
              <p>
                {point.includes("future")
                  ? "Planned as the platform grows beyond attendee discovery."
                  : "Presented as a focused product capability for the evolving app."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section warm" id="plans">
        <div className="sectionIntro">
          <p className="kicker">Plans concept</p>
          <h2>Saved, Going, and Ticketed replace itinerary overload.</h2>
          <p>
            Pursuit treats planning as a simple progression: interest,
            intention, then confirmation. These cards are static concept
            previews, not live ticketing tools.
          </p>
        </div>
        <div className="grid three">
          {planStates.map((state) => (
            <article className="planCard" key={state.title}>
              <span>{state.label}</span>
              <h3>{state.title}</h3>
              <p>{state.copy}</p>
              <div className="mockLine wide" />
              <div className="mockLine" />
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="kicker">Group planning concept</p>
          <h2>Make the group decision easier before anyone downloads an app.</h2>
          <p>
            A user can create a group plan, add event options, and share a
            voting link. Friends can vote without signing up, and the voting
            flow can introduce new people to Pursuit naturally.
          </p>
        </div>
        <div className="grid three">
          {groupSteps.map((step, index) => (
            <article className="flowCard" key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <div className="flowMock">
                <div />
                <div />
                <div />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="sectionIntro">
          <p className="kicker">Planned Organizer Tools</p>
          <h2>Future Organizer Dashboard</h2>
          <p>
            These are planned organizer concepts only. The public site does not
            build organizer accounts, payments, ticketing, or operational
            dashboard functionality.
          </p>
        </div>
        <div className="dashboardGrid">
          {organizerCards.map((card) => (
            <article className="dashboardCard" key={card}>
              <span className="status">Planned</span>
              <h3>{card}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="screens">
        <div className="sectionIntro centered">
          <p className="kicker">Product screens</p>
          <h2>Static previews for the evolving mobile experience.</h2>
          <p>
            Real product screenshots can be added here as the design library
            exports become available. For now, each frame is clearly labelled as
            a design preview.
          </p>
        </div>
        <div className="phones">
          <MiniPhone title="Explore" tag="Curated feed">
            <div className="eventTile tall" />
            <div className="eventTile" />
            <div className="eventTile small" />
          </MiniPhone>
          <MiniPhone title="Plans" tag="Saved · Going · Ticketed">
            <div className="planStrip saved">Saved</div>
            <div className="planStrip going">Going</div>
            <div className="planStrip ticketed">Ticketed</div>
          </MiniPhone>
          <MiniPhone title="Group vote" tag="Shared link">
            <div className="voteOption">Rooftop jazz <strong>62%</strong></div>
            <div className="voteOption">Gallery night <strong>31%</strong></div>
            <div className="voteOption">Supper club <strong>7%</strong></div>
          </MiniPhone>
        </div>
      </section>

      <section className="section warm" id="library">
        <div className="sectionIntro">
          <p className="kicker">Design library</p>
          <h2>Existing design references stay accessible.</h2>
        </div>
        <div className="grid four">
          {designLinks.map((link) => (
            <a className="libraryCard" href={link.href} key={link.title}>
              <span>HTML reference</span>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <strong>Open file <Arrow /></strong>
            </a>
          ))}
        </div>
      </section>

      <section className="section split" id="technology">
        <div>
          <p className="kicker">Technology / Case Study</p>
          <h2>Built as a public showcase for an active product.</h2>
        </div>
        <div className="techList">
          <p>
            <strong>Mobile:</strong> React Native, Expo, Tamagui
          </p>
          <p>
            <strong>Backend:</strong> Django, GraphQL, PostgreSQL
          </p>
          <p>
            <strong>Web:</strong> Next.js static showcase
          </p>
          <p>
            <strong>Status:</strong> active development
          </p>
        </div>
      </section>

      <section className="section about" id="about">
        <div>
          <p className="kicker">About</p>
          <h2>Pursuit HQ</h2>
          <p>
            Designed and developed by Faith Catherine Otieno through Pursuit HQ.
          </p>
        </div>
        <address>
          <a href="mailto:faithcathy12@gmail.com">faithcathy12@gmail.com</a>
          <span>Nairobi, Kenya</span>
          <a href="https://faithkatherine.github.io/Portfolio">
            Portfolio <Arrow />
          </a>
        </address>
      </section>

      <footer>
        <span>Pursuit</span>
        <p>Built in Nairobi. Static public website for the evolving platform.</p>
      </footer>
    </main>
  );
}
