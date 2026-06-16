const productPoints = [
  {
    title: "Discover",
    copy: "Curated events across Nairobi, organized by what's actually happening this week.",
  },
  {
    title: "Save",
    copy: "Keep events you're interested in without committing yet.",
  },
  {
    title: "Going",
    copy: "Mark the plans you intend to attend.",
  },
  {
    title: "Ticketed",
    copy: "Track events you've already booked or paid for, in one list.",
  },
  {
    title: "Group Plans",
    copy: "Create a plan, add a few options, and let friends vote - no app required to weigh in.",
  },
  {
    title: "For Organizers",
    badge: "Planned",
    copy: "Manage listings, track attendance, and understand your audience from one dashboard.",
  },
];

const planStates = [
  {
    title: "Saved",
    label: "Interested",
    copy: "Events a user wants to remember before committing.",
  },
  {
    title: "Going",
    label: "Committed",
    copy: "Experiences the user plans to attend or coordinate around.",
  },
  {
    title: "Ticketed",
    label: "Confirmed",
    copy: "Paid, booked, or confirmed plans that need easier tracking.",
  },
];

const groupSteps = [
  {
    title: "Create group plan",
    copy: "Start a plan and choose a few events that could work.",
  },
  {
    title: "Shared voting page",
    copy: "Send one link so friends can weigh in without signing up.",
  },
  {
    title: "Voting results",
    copy: "See what the group prefers and turn that signal into a plan.",
  },
];

const organizerCards = [
  "Create Event",
  "Manage Listings",
  "Ticket Sales",
  "Attendance Overview",
  "Audience Insights",
  "Verification Status",
];

const nowItems = [
  "Curated event discovery across Nairobi",
  "Save, Going, and Ticketed plan tracking",
  "Mobile app in active development (React Native + Expo)",
];

const nextItems = [
  "Group voting for shared plans",
  "Organizer dashboard and ticketing",
  "Audience insights for event hosts",
];

function ArrowNode() {
  return (
    <span className="iconNode" aria-hidden="true">
      ↗
    </span>
  );
}

function MiniPhone({ title, tag, image, children }) {
  return (
    <div className="phone">
      <div className="phoneNotch" />
      <div className="phoneScreen">
        {image ? (
          <img src={image} alt={`${title} screen`} />
        ) : (
          <>
            <div className="phoneTop">
              <span>{tag}</span>
            </div>
            <h3>{title}</h3>
            {children}
          </>
        )}
      </div>
      <span className="screenLabel">{tag}</span>
    </div>
  );
}

function StatusList({ title, items }) {
  return (
    <article className="statusPanel">
      <h3>{title}</h3>
      <div className="statusItems">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </article>
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
          <a href="#screens">Screens</a>
          <a href="#vision">Vision</a>
          <a href="#overview">Product</a>
          <a href="#plans">Plans</a>
        </nav>
      </header>

      <section className="hero section" id="top">
        <div className="heroCopy">
          <p className="kicker">Nairobi-First Event Discovery</p>
          <h1>Pursuit</h1>
          <h2>Discover real-life experiences in Nairobi.</h2>
          <p>
            Pursuit helps people find, save, and plan events and experiences -
            from casual nights out to group plans with friends.
          </p>
          <div className="actions">
            <a className="button primary hasNode" href="#overview">
              Explore Product <ArrowNode />
            </a>
            <a className="button secondary" href="#vision">
              See the Vision
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

      <section className="section" id="screens">
        <div className="sectionIntro centered">
          <p className="kicker">Interface</p>
          <h2>What it actually looks like.</h2>
          <p>
            Screens from the live build. Conceptual flows - group voting,
            organizer tools - are clearly marked as design previews.
          </p>
        </div>
        <div className="phones">
          <MiniPhone
            title="Explore"
            tag="Live build"
            image="/product-screens/discover-home.png"
          >
            <div className="eventTile tall" />
            <div className="eventTile" />
            <div className="eventTile small" />
          </MiniPhone>
          <MiniPhone
            title="Event detail"
            tag="Live build"
            image="/product-screens/event-detail.png"
          >
            <div className="planStrip saved">Saved</div>
            <div className="planStrip going">Going</div>
            <div className="planStrip ticketed">Ticketed</div>
          </MiniPhone>
          <MiniPhone
            title="Checkout"
            tag="Live build"
            image="/product-screens/checkout.png"
          >
            <div className="voteOption">
              Rooftop jazz <strong>62%</strong>
            </div>
            <div className="voteOption">
              Gallery night <strong>31%</strong>
            </div>
            <div className="voteOption">
              Supper club <strong>7%</strong>
            </div>
          </MiniPhone>
        </div>
      </section>

      <section className="section vision" id="vision">
        <div className="visionCopy">
          <p className="kicker">Product Vision</p>
          <h2>Nairobi runs on word of mouth. Pursuit gives it a home.</h2>
        </div>
        <div className="visionBody">
          <p>
            A friend's story, a poster on a wall, a forwarded screenshot -
            that's still how most people in Nairobi find out what's happening.
            Pursuit started as a way to fix discovery: one place to find real
            events, decide what's worth going to, and figure out who's coming
            with you. The next phase brings organizers into the same system,
            because the signals that help someone plan a Friday night are the
            same ones that help the person hosting it understand their audience.
            We're building this in public, in Nairobi, one release at a time.
          </p>
          <blockquote>
            "The goal isn't to replace how people already find things to do -
            it's to keep up with it."
          </blockquote>
        </div>
      </section>

      <section className="section split" id="overview">
        <div>
          <p className="kicker">The Core Experience</p>
          <h2>A lighter way to decide what to do next.</h2>
        </div>
        <div className="grid two">
          {productPoints.map((point) => (
            <article className="card compact" key={point.title}>
              <span className="dot" />
              {point.badge ? <span className="miniBadge">{point.badge}</span> : null}
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section warm" id="plans">
        <div className="sectionIntro">
          <p className="kicker">How Planning Works</p>
          <h2>Saved, Going, and Ticketed replace the itinerary.</h2>
          <p>
            Most plans don't need a spreadsheet. They need three honest states:
            interested, committed, and confirmed.
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
          <p className="kicker">Group Planning</p>
          <h2>Decide as a group, without making everyone download anything.</h2>
          <p>
            Create a plan, add a few events to choose from, and share one link.
            Friends vote without signing up - and some of them end up staying
            on Pursuit afterward.
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

      <section className="section dark" id="organizers">
        <div className="organizerLayout">
          <div className="sectionIntro">
            <p className="kicker">For Organizers - Planned</p>
            <h2>The other side of discovery.</h2>
            <p>
              Every event on Pursuit has someone behind it trying to fill the
              room. The organizer tools we're building turn that into less
              guesswork: create and manage listings, see who's actually showing
              interest, and eventually sell tickets without juggling five
              different tools.
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
        </div>
      </section>

      <section className="section nowNext">
        <div className="sectionIntro">
          <p className="kicker">Where Things Stand</p>
          <h2>Available now, with the next layer already in motion.</h2>
        </div>
        <div className="statusGrid">
          <StatusList title="Available Now" items={nowItems} />
          <StatusList title="Next" items={nextItems} />
        </div>
      </section>

      <footer id="contact">
        <div>
          <span>Pursuit</span>
          <p>Built by Faith Catherine Otieno through Pursuit HQ, Nairobi.</p>
        </div>
        <div className="footerLinks">
          <a href="https://faithkatherine.github.io/Portfolio">
            Portfolio ↗
          </a>
          <a href="mailto:faithcathy12@gmail.com">Contact</a>
        </div>
        <p>© 2026 Pursuit. Built in Nairobi.</p>
      </footer>
    </main>
  );
}
