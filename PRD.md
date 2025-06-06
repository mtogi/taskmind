
# TaskMind Product Requirements Document (PRD)

## 1. Overview

**Product Name:** TaskMind  
**Tagline (working):** “AI-Powered Task Management That Learns You”  

**Problem Statement:**  
Most task managers today simply let users create lists, set deadlines, and check things off. In a world where students (or knowledge workers generally) juggle assignments, part-time jobs, extracurriculars, and side projects, a plain to-do list often adds noise rather than clarity. TaskMind aims to solve this by using natural language understanding and adaptive prioritization so that creating, organizing, and executing tasks feels as frictionless as having a conversation with a personal assistant.

**Target Audience (initially):**  
- **Primary (narrowed MVP):** Students (high school, college/university) who need a quick, intelligent way to manage assignments, deadlines, study sessions, and group projects.  
- **Secondary (longer-term):** Freelancers and small teams who want AI-powered task breakdowns and predictions but won’t be the primary MVP focus.

**Key Differentiators (from existing tools):**  
1. **Natural Language Input + AI Parsing:** “Simply type ‘Schedule dentist appointment next Tuesday at 2 pm, high priority’ and watch TaskMind automatically parse, categorize, and optimize your entire schedule.”  
2. **Adaptive Prioritization:** Dynamic scoring based on deadlines, dependencies, and even personal energy levels (e.g., morning vs. evening work efficiency).  
3. **Smart Task Breakdown:** Break complex projects into subtasks automatically, so that a 10-step project is instantly decomposed into actionable pieces.  
4. **Predictive Intelligence:** By analyzing past completion rates, the AI suggests optimal sequences and deadlines to prevent bottlenecks.  
5. **Student-Focused Templates & Integrations (MVP scope addition):** Curriculum-specific templates (e.g., “Write lab report,” “Group project milestones”), course import, and study schedule generation.

---

## 2. Goals & Objectives

1. **Deliver an MVP** that includes:  
   - User authentication (signup/sign-in)  
   - Persistent task storage (database integration)  
   - Basic UI: task list view, task detail view, create/edit tasks  
   - Natural language task creation powered by the OpenAI API (e.g., parsing “Finish Math homework by Friday” → title, due date, priority)  
   - AI-driven priority suggestions (simple rule/predictive model initially)  
   - Basic student-centric features: assignment categories, due-date calendar view, reminders  
   - A Stripe-based billing flow (free trial → paid plan)  

2. **Validate Product-Market Fit** in the student segment by gathering early feedback (beta testing in two university classes).

3. **Establish a working revenue model** (free 14-day trial → subscription) to generate pocket money and cover server/API costs.

---

## 3. User Personas

| Persona                    | Description                                                                                                                                             | Needs & Pain Points                                                                                                                                                                                                                                          |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Undergraduate Student**  | 19-year-old second-year Computer Science major at Seneca College. Juggles four courses, a part-time on-campus job, and club responsibilities.         | – Quickly convert assignment announcements into tasks without manual data entry.  <br> – Stay on top of overlapping deadlines (e.g., two group projects due the same week).  <br> – Visualize workload per week.  <br> – Receive study reminders. |
| **Graduate Student (MSc)** | 24-year-old Master’s student balancing research, teaching assistant duties, and paper deadlines.                                                       | – Break down long-term research into daily/weekly subtasks.  <br> – Prioritize conference paper submissions vs. grading tasks.  <br> – Easily reschedule tasks when meetings shift.                                                                               |
| **Part-time Freelancer**   | 22-year-old graphic designer who works on Fiverr gigs in the evenings, while taking three classes during the day.                                      | – Keep track of client deliverables (e.g., design drafts) along with class assignments.  <br> – Receive notifications if a client deadline conflicts with exam week.  <br> – Pay for premium AI features if it saves time.                                         |

---

## 4. Scope & Feature List

### 4.1. Core MVP Features

1. **User Authentication & Profiles**  
   - Email/password sign up / sign in (with email verification).  
   - “Login with Google” (optional, stretch if time allows).  
   - Profile page: name, avatar, “Preferred study hours” (morning/afternoon/evening).  

2. **Database Integration (Task Storage)**  
   - Tech choice suggestion: PostgreSQL (hosted on Heroku/AWS RDS) or MongoDB Atlas for a NoSQL option.  
   - Tables/Collections: Users, Tasks, Subtasks, Settings, Subscription (Stripe) data.

3. **Task CRUD**  
   - **Create:** Free-form text box at top of dashboard where user can type in natural English (“Essay on History due next Tuesday at 11 am, high priority”).  
   - **Read:** Dashboard with a list view (sorted by AI-suggested priority or due date).  
   - **Update:** Inline editing of title, description, due date, priority, tags (e.g., “CS101,” “Group Project”).  
   - **Delete:** Soft delete (move to Trash for 30 days).  

4. **Natural Language Parsing (OpenAI API Integration)**  
   - Call OpenAI’s Text Parsing endpoint (e.g., GPT-4 with a specialized prompt) to parse a free-text input into structured fields: title, due date, estimated effort, priority, tags.  
   - If parsing fails, fallback to default “Create blank task”?  

5. **AI-Driven Prioritization & Scheduling**  
   - Simple MVP: Based on due dates and estimated effort, assign a priority score (e.g., 1–10).  
   - Over time (post-MVP), refine model to consider user’s historical completion times, time-of-day preferences, and dependency graphs.  
   - Show a “Suggested Order” toggle that reorders the list into AI-recommended sequence.  

6. **Student-Focused Extras (MVP Priorities)**  
   - **Assignment Templates:** Predefined templates for common academic tasks (e.g., “Lab Report,” “Team Presentation,” “Essay”), including typical subtasks (e.g., “Research → Outline → Draft → Revise”).  
   - **Calendar View:** Week/month view to see deadlines, color-coded by course or project.  
   - **Reminders & Notifications:** Email notifications 24 h before a due date, plus push notifications (in-browser) on the day of the task.  

7. **Basic Payment & Subscription Flow (Stripe)**  
   - **Pricing Tiers (example MVP):**  
     - Free Plan: Unlimited tasks, manual prioritization, 5 NLP parses per month.  
     - Premium Student Plan ($4.99/month): Unlimited NLP parses, calendar sync (Google Calendar), basic AI suggestions.  
     - Pro Plan ($9.99/month): Advanced AI features—predictive scheduling, team collaboration, data export.  
   - **Stripe Integration:**  
     - 14-day free trial for new users (requires credit card).  
     - Cancel anytime.  
     - Webhook endpoint to handle subscription status changes.

8. **Responsive Front End**  
   - Built (as appears) in React/Next.js (Vercel-hosted).  
   - Components: NavBar (Features, Pricing, Sign In), Dashboard, TaskList, TaskDetail Modal, Calendar View, Settings page.  
   - The “Stop Managing Tasks. Start Achieving Goals” hero section with “Start Free 14-Day Trial” button.  

9. **Basic Integrations (Stretch if time allows)**  
   - **Google Calendar Sync:** Read/write events under “TaskMind” calendar.  
   - **Email Integration:** e.g., auto-create tasks from a dedicated email address (e.g., forward syllabus emails).  
   - **Slack/Discord Bot (Long-term):** Quick task creation via chat.

### 4.2. Out-of-Scope (for MVP)

- Full team/collaboration features (assigning tasks to multiple users).  
- Mobile app (iOS/Android) — initial MVP is web only (but responsive).  
- Complex AI scheduling (initially stick to simple heuristics + basic parsing).  
- Third-party integrations beyond Google Calendar and Stripe.  
- Deep analytics/dashboard beyond “Completion Rate” and “Upcoming Deadlines.”  

---

## 5. Functional Requirements

| ID    | Feature                                 | Description                                                                                                                                                                                                                                                       | Priority (MoSCoW) |
|-------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| F1    | User Sign Up / Sign In                  | User can register with email/password, verify email, log in/out, and reset password.                                                                                                                                                                              | Must              |
| F2    | Create Task via Free-Text Input         | On dashboard, user types a sentence (e.g., “Finish Econ paper by Friday”), clicks “Enter,” triggering an OpenAI call to parse into fields.                                                                                                                        | Must              |
| F3    | Manual Task Creation / Editing          | User can click “+ New Task,” fill a form (title, description, due date, tags) and save. Edit existing tasks inline or via modal.                                                                                                                                  | Must              |
| F4    | Store Tasks in Database                 | Save all task data (title, description, due date, priority, tags, user ID) in a persistent DB.                                                                                                                                                                    | Must              |
| F5    | Dashboard List View                     | Show all active (non-deleted) tasks in a scrollable list. Default sort: AI priority score descending. Can toggle to sort by due date.                                                                                                                              | Must              |
| F6    | Task Detail Modal                       | Clicking a task opens a modal with full details (subtasks, notes, attachments if any), and options to edit, mark complete, delete.                                                                                                                                 | Must              |
| F7    | AI-Driven Priority Suggestion           | For each task, display a “Priority Score” (1–10) computed on the server based on due date and estimated effort (initial MVP heuristic).                                                                                                                             | Must              |
| F8    | Reminders / Notifications               | Email notification 24 h prior; in-app toast notification at 9 am on due date (browser notifications after permission).                                                                                                                                              | Must              |
| F9    | Assignment Templates (Student MVP)      | User can select from a list of “Templates” (e.g., “Lab Report → Research, Draft, Revise, Submit”). Clicking a template auto-creates subtasks under a new task.                                                                                                     | Should            |
| F10   | Calendar View                           | Month/week view showing tasks as cards on their due dates. Click on a calendar item to view/edit details.                                                                                                                                                           | Should            |
| F11   | Stripe Payment Flow                     | Integrate Stripe checkout to handle new subscriptions, manage existing subscription, display billing info. Webhook endpoint for “invoice.paid,” “customer.subscription.deleted,” etc.                                                                              | Must              |
| F12   | Free 14-Day Trial Logic                 | New accounts enter a 14-day trial automatically. After 14 days, if no payment, restrict NLP parsing and premium features.                                                                                                                                          | Must              |
| F13   | Settings / Profile                      | Allow user to set “Preferred study hours,” time zone, email preferences, connect/disconnect Google Calendar.                                                                                                                                                        | Must              |
| F14   | Logout / Session Management             | Secure session handling (JWT or session cookies), auto-logout after inactivity (>30 min).                                                                                                                                                                           | Must              |
| F15   | Database Schema & Migrations            | Define tables/collections for Users, Tasks, Subtasks, Templates, Subscriptions, Settings. Create migration scripts.                                                                                                                                                | Must              |
| F16   | Responsive Design                       | All pages must be responsive for desktop/tablet/mobile.                                                                                                                                                                                                             | Must              |
| F17   | Sign In / Sign Up Form Validation       | Client-side and server-side validation (email format, password length ≥8, etc.).                                                                                                                                                                                   | Must              |
| F18   | Forgot Password Flow                    | Email link to reset password (expires in 60 min).                                                                                                                                                                                                                    | Should            |
| F19   | User Activity Logging                   | Log key events (task created, task completed, login, subscription updated) for future analytics.                                                                                                                                                                    | Could              |
| F20   | SEO & Landing Page (Coming Soon)        | “Coming Soon” page where users can join waitlist (collect email) prior to full launch (already exists).                                                                                                                             | Already done      |
| F21   | Custom Tags & Filtering                 | Users can tag tasks (“CS101,” “GroupProject”), filter the list by tag or course.                                                                                                                                                                                    | Could              |
| F22   | API Endpoint (Public/Private)           | Expose a RESTful API (v1) so advanced users can integrate tasks into their own workflows.                                                                                                                                                                            | Could              |
| F23   | Data Export (CSV/JSON)                  | Allow users to export complete task list/subtasks for backup or reporting.                                                                                                                                                                                           | Could              |
| F24   | GDPR/Privacy Compliance                 | Include cookie consent banner and a link to Privacy Policy.                                                                                                                                                                                                           | Must              |
| F25   | SSL/TLS Everywhere                      | Ensure HTTPS on all pages.                                                                                                                                                                                                                                           | Must              |

---

## 6. Non-Functional Requirements

1. **Performance:**  
   - The dashboard should load and render < 2 seconds on a typical 4G connection.  
   - OpenAI parsing calls should return within 2–3 seconds (caching common patterns where feasible).  

2. **Security:**  
   - All endpoints require JWT or session authentication.  
   - Passwords hashed via bcrypt (salt ≥12).  
   - CSRF protection on forms.  
   - Stripe webhook signature verification.

3. **Scalability:**  
   - Host back end on AWS Elastic Beanstalk or Heroku (autoscaling).  
   - Database in a managed service (Postgres/RDS or MongoDB Atlas) with read replicas configured if needed.  

4. **Reliability / Availability:**  
   - 99.9% uptime target for core task functionality.  
   - Daily database backups.  

5. **Maintainability:**  
   - Code in a monorepo (if using Next.js for full-stack), or separate frontend (Next.js) and backend (Express/Node.js).  
   - Linting, Prettier formatting, unit tests for critical modules (e.g., parsing logic).  

6. **Localization (stretch):**  
   - Initially English only. Plan for easy addition of Spanish, French, etc., in future.  

---

## 7. Technical Architecture

- **Frontend (React/Next.js)**  
  - Hosted on Vercel.  
  - Pages: /login, /signup, /dashboard, /calendar, /settings, /pricing.  
  - Components: `<NavBar>`, `<TaskList>`, `<TaskItem>`, `<TaskModal>`, `<Calendar>`, `<Billing>`, `<ProfileForm>`.
- **Backend (Node.js + Express.js)**  
  - Hosted on AWS Elastic Beanstalk / Heroku.  
  - RESTful API:  
    - `POST /api/auth/signup`  
    - `POST /api/auth/login`  
    - `GET /api/tasks`  
    - `POST /api/tasks` (calls OpenAI)  
    - `PATCH /api/tasks/:id`  
    - `DELETE /api/tasks/:id`  
    - `GET /api/user/settings`  
    - `PATCH /api/user/settings`  
    - `POST /api/webhooks/stripe`  
    - `GET /api/stripe/session`

- **Database**  
  - **Users Table**: `id`, `email`, `password_hash`, `name`, `timezone`, `trial_start`, `stripe_customer_id`, `subscription_status`, `preferred_study_hours`  
  - **Tasks Table**: `id`, `user_id`, `title`, `description`, `due_date`, `priority_score`, `tags` (array), `created_at`, `updated_at`, `deleted_at`  
  - **Subtasks Table**: `id`, `task_id`, `title`, `is_completed`  
  - **Templates Table**: `id`, `name`, `default_subtasks` (JSON array), `category` (e.g., “Essay,” “Lab Report”)  
  - **Settings Table**: `user_id`, `email_notifications_enabled`, `calendar_integration_enabled`, `time_zone`  

- **Third-Party Integrations**  
  - **OpenAI API** for text parsing and, later, prioritization suggestions.  
  - **Stripe** for subscription billing.  
  - **Google Calendar API** for calendar sync.

- **Hosting & DevOps**  
  - **Frontend:** Vercel.  
  - **Backend:** Heroku or AWS Elastic Beanstalk.  
  - **CI/CD:** GitHub Actions.  
  - **Monitoring:** Sentry (errors), Datadog (performance), Papertrail (logs).  

---

## 8. MVP Roadmap & Milestones

1. **Week 1–2: Project Setup & Core Infrastructure**  
   - Initialize Next.js frontend (Vercel), Node.js backend (Heroku/EBS).  
   - Set up PostgreSQL (Heroku/AWS RDS) with initial schema.  
   - Scaffold authentication (signup/login, JWT).  
   - Basic “Coming Soon” landing page integration.

2. **Week 3–4: Basic Task CRUD & Database Integration**  
   - Implement Task model, migrations, and API endpoints.  
   - Frontend: Dashboard list view, task creation form (manual).  
   - Backend: Task routes (create, read, update, delete).  
   - Styling & responsiveness for Dashboard.  

3. **Week 5: OpenAI Integration (NLP Parsing)**  
   - Build a micro-service endpoint `/api/tasks/parse`.  
   - Frontend: Replace manual “Add Task” form with free-text input.

4. **Week 6: AI-Driven Priority Suggestion & Student Templates**  
   - Backend: Simple algorithm (due date urgency + estimated effort).  
   - Design a few assignment templates and allow “Create from Template.”  
   - Frontend: Display “Priority Score” badge on each task; allow sorting by priority.  

5. **Week 7: Calendar View & Reminders**  
   - Integrate a calendar library (e.g., React Big Calendar).  
   - Backend: Scheduled job (cron) for email reminders.  
   - Frontend: “Calendar” tab/route.  

6. **Week 8: Stripe Subscription Flow**  
   - Configure Stripe account, products (Free vs. Premium).  
   - Backend: Create Stripe checkout sessions; handle webhooks.  
   - Frontend: “Pricing” page; “Upgrade” CTA.  
   - Enforce trial logic.

7. **Week 9: Polish, Bug Fixes, Beta Testing**  
   - QA, responsive checks.  
   - Invite 10–20 student testers, gather feedback.  
   - Analytics integration.

8. **Week 10: Soft Launch & Marketing**  
   - Deploy “beta” to live domain.  
   - Email waitlist with invitation link.  
   - Monitor server load, fix high-priority bugs.

---

## 9. Success Metrics & KPIs

1. **Onboarding Metrics (Weeks 1–4)**  
   - **Waitlist Sign-ups:** 1,000 emails collected.  
   - **Conversion Rate to Beta:** ≥ 20% of waitlist convert to active users.  

2. **Engagement Metrics (Weeks 5–10)**  
   - **Task Creation Rate:** ≥ 5 tasks per user/week.  
   - **NLP Parse Usage:** ≥ 50% of new tasks created via free-text input.  
   - **DAU:** ≥ 100 during beta.  
   - **Retention Rate:** ≥ 40% of users return at least twice per week.

3. **Monetization Metrics (Post-MVP)**  
   - **Free → Paid Conversion:** ≥ 5% upgrade.  
   - **ARPU:** ≥ \$3/month.  
   - **Churn Rate:** ≤ 10% monthly for paying users.

---

## 10. Assumptions & Risks

1. **Assumption:** Students will pay a small fee for AI-powered parsing/prioritization.  
2. **Assumption:** OpenAI API costs can be offset by revenue.  
3. **Risk:** GPT-4 parsing might misinterpret complex sentences.  
4. **Risk:** Building a robust academic templates library needs research.  
5. **Risk:** Stripe complexity (international taxes, PCI).  
6. **Risk:** Competing with established tools; focusing on students mitigates this.

---

## 11. Suggested Narrow Focus (Student Segment)

> **Why “Task Management for Students”?**  
> 1. **Tighter Feature Set:** Focus on student-specific chaos: assignments, exams, group projects, etc.  
> 2. **Viral Growth:** University clubs, RAs, and professors can share.  
> 3. **Simpler Integrations:** LMS integration later rather than generic Slack/Teams.

### 11.1. Student-Specific Features (Phase 2)

1. **LMS Integration (Longer-Term):**  
   - Read assignments from Canvas API → auto-populate tasks.  
   - Sync grades and update “estimated effort.”

2. **Study Timer & Pomodoro:**  
   - Built-in Pomodoro timer for tasks.  
   - Reward streaks and gamification.

3. **Group Project Collaboration:**  
   - Shared boards for teammates to assign and chat.  
   - Document versioning.

4. **Campus Events Integration:**  
   - Show campus events; allow adding events as tasks.

5. **AI-Generated Study Plans:**  
   - Given an exam date and syllabus link, AI proposes a study schedule.

---

## 12. Appendix

### 12.1. Example OpenAI Prompt (MVP)

```
You are TaskMind’s parsing engine. Given a single line of user input describing a task, output a JSON object with:
- title (string)
- description (string, optional; if not present, set to empty string)
- due_date (ISO 8601 date, e.g., "2025-06-12")
- priority (one of "low", "medium", "high"; default to "medium" if unclear)
- tags (array of strings; e.g., course codes)
- estimated_effort (integer number of hours; if not specified, leave as 1)

Example Input:
  "Finish CS101 lab report by next Thursday, high priority, tag CS101, effort 3h"

Expected Output:
{
  "title": "Finish CS101 lab report",
  "description": "Lab report for CS101 (complete sections 1-4)",
  "due_date": "2025-06-12",
  "priority": "high",
  "tags": ["CS101"],
  "estimated_effort": 3
}
```

---

## 13. Glossary

- **MVP (Minimum Viable Product):** The smallest set of features that still solves the core problem.  
- **NLP (Natural Language Processing):** AI technique used to parse user free-text into structured data.  
- **Stripe:** Payment processing platform for managing subscriptions.  
- **OpenAI API:** The GPT-4 (or GPT-3.5) endpoint used for task parsing and future prioritization suggestions.  
